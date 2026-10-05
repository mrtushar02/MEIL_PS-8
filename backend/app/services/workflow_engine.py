from typing import Optional, Dict, Any, List
from datetime import datetime, timezone
from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from app.models.reporting import Submission, ReportingPeriod
from app.models.organization import Project, BusinessUnit, Subsidiary
from app.models.workflow import WorkflowTransition, ApprovalAction, SubmissionVersion
from app.models.user import User
from app.services.audit_service import AuditService
from app.api.deps import check_project_access

class WorkflowEngine:
    VALID_STATUSES = [
        "DRAFT", "SUBMITTED", "BU_APPROVED",
        "SUBSIDIARY_APPROVED", "LOCKED", "CORRECTION_REQUIRED"
    ]

    @staticmethod
    def can_transition(
        db: Session,
        submission: Submission,
        to_status: str,
        user: User
    ) -> bool:
        """Verify if transition is authorized in the rule matrix for this user"""
        if user.is_superuser:
            return True

        user_role_code = user.role.code if user.role else "USER"

        # Check DB workflow transitions table
        rule = db.query(WorkflowTransition).filter(
            WorkflowTransition.from_status == submission.status,
            WorkflowTransition.to_status == to_status,
            WorkflowTransition.required_role == user_role_code,
            WorkflowTransition.is_active == True
        ).first()

        return rule is not None

    @staticmethod
    def execute_transition(
        db: Session,
        submission_id: str,
        to_status: str,
        user: User,
        comment: Optional[str] = None
    ) -> Submission:
        """
        Execute an authorized workflow transition with scope checks,
        snapshotting on correction, and cryptographic audit logging.
        """
        submission = db.query(Submission).filter(Submission.id == submission_id).first()
        if not submission:
            raise HTTPException(status_code=404, detail="Submission not found")

        # 1. Enforce reporting period lock
        period = db.query(ReportingPeriod).filter(ReportingPeriod.id == submission.reporting_period_id).first()
        if period and period.is_locked:
            raise HTTPException(
                status_code=status.HTTP_423_LOCKED,
                detail=f"Reporting period '{period.name}' is LOCKED by Group HQ. No workflow alterations permitted."
            )

        if submission.status == "LOCKED" and not user.is_superuser:
            raise HTTPException(
                status_code=status.HTTP_423_LOCKED,
                detail="Submission is permanently LOCKED. Controlled corrections require Super Admin override."
            )

        # 2. Verify state transition legality
        if not WorkflowEngine.can_transition(db, submission, to_status, user):
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"Illegal transition: '{submission.status}' -> '{to_status}' is not permitted for role '{user.role.name if user.role else 'USER'}'"
            )

        # 3. Enforce organizational scope
        project = db.query(Project).filter(Project.id == submission.project_id).first()
        if not project:
            raise HTTPException(status_code=404, detail="Associated project not found")

        user_role_code = user.role.code if user.role else "USER"
        user_scopes = {s.scope_type: s.scope_id for s in user.scopes} if user.scopes else {}

        if to_status == "SUBMITTED":
            if not user.is_superuser and not check_project_access(user, project.id, db):
                raise HTTPException(status_code=403, detail="User lacks scope access to submit data for this project")

        elif to_status == "BU_APPROVED":
            if not user.is_superuser and user_scopes.get("BUSINESS_UNIT") != project.business_unit_id:
                if user_scopes.get("GROUP") is None and user_scopes.get("SUBSIDIARY") != project.subsidiary_id:
                    raise HTTPException(status_code=403, detail="User lacks BU scope authority over this project")

        elif to_status == "SUBSIDIARY_APPROVED":
            if not user.is_superuser and user_scopes.get("SUBSIDIARY") != project.subsidiary_id:
                if user_scopes.get("GROUP") is None:
                    raise HTTPException(status_code=403, detail="User lacks Subsidiary scope authority over this project")

        elif to_status == "LOCKED":
            if not user.is_superuser and user_scopes.get("GROUP") is None and user_role_code != "GROUP_CSO":
                raise HTTPException(status_code=403, detail="Only Group CSO or Super Admin may execute Group-level LOCK")

        # 4. Handle CORRECTION_REQUIRED (Controlled Revision)
        old_state = submission.status
        actor_name = user.full_name
        actor_role = user.role.name if user.role else "USER"

        if to_status == "CORRECTION_REQUIRED":
            if not comment:
                raise HTTPException(status_code=400, detail="Mandatory change reason/comment required when rejecting for correction")

            # Snapshot historical approved state before allowing revisions
            snapshot = {
                "fuel_records": [{"fuel_type": f.fuel_type, "quantity": f.quantity, "scope1": f.scope1_co2e_tonnes} for f in submission.fuel_records],
                "energy_records": [{"energy_source": e.energy_source, "quantity_kwh": e.quantity_kwh, "scope2": e.scope2_co2e_tonnes} for e in submission.energy_records],
                "water_records": [{"withdrawal_kl": w.withdrawal_kl, "recycled_kl": w.recycled_kl} for w in submission.water_records],
                "safety_records": [{"safe_man_hours": s.safe_man_hours, "lost_time_injuries": s.lost_time_injuries, "ltifr": s.ltifr} for s in submission.safety_records]
            }

            sub_version = SubmissionVersion(
                submission_id=submission.id,
                version_number=submission.version,
                status=old_state,
                change_reason=comment,
                snapshot_json=snapshot,
                is_current=False,
                created_by=actor_name
            )
            db.add(sub_version)

            submission.status = "CORRECTION_REQUIRED"
            submission.rejection_reason = comment
            submission.version += 1 # Controlled increment for next submission cycle

            action_type = "REQUEST_CORRECTION"

        elif to_status == "BU_APPROVED":
            submission.status = "BU_APPROVED"
            submission.reviewed_by = actor_name
            submission.reviewed_at = datetime.now(timezone.utc)
            action_type = "BU_APPROVE"

        elif to_status == "SUBSIDIARY_APPROVED":
            submission.status = "SUBSIDIARY_APPROVED"
            submission.approved_by = actor_name
            submission.approved_at = datetime.now(timezone.utc)
            action_type = "SUBSIDIARY_APPROVE"

        elif to_status == "LOCKED":
            submission.status = "LOCKED"
            action_type = "GROUP_LOCK"

        elif to_status == "SUBMITTED":
            submission.status = "SUBMITTED"
            submission.submitted_by = actor_name
            submission.submitted_at = datetime.now(timezone.utc)
            action_type = "SUBMIT"

        # Record ApprovalAction
        action_rec = ApprovalAction(
            submission_id=submission.id,
            version_number=submission.version,
            action=action_type,
            actor_id=user.id,
            actor_name=actor_name,
            actor_role=actor_role,
            comment=comment
        )
        db.add(action_rec)
        db.commit()
        db.refresh(submission)

        # Log cryptographic audit trail
        AuditService.log_event(
            db=db,
            actor_id=user.id,
            actor_name=actor_name,
            actor_role=actor_role,
            action=f"WORKFLOW_TRANSITION_{action_type}",
            entity_type="Submission",
            entity_id=submission.id,
            old_state=old_state,
            new_state=to_status,
            comment=comment,
            details=f"Transitioned submission for project {submission.project_id} (Version {submission.version}) to {to_status}",
            scope_type="PROJECT",
            scope_id=submission.project_id
        )

        return submission
