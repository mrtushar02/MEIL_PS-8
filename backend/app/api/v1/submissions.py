from typing import List, Optional, Dict, Any
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session, joinedload
from app.core.database import get_db
from app.models.reporting import Submission, ReportingPeriod
from app.models.organization import Project
from app.models.esg_records import FuelRecord, EnergyRecord, WaterRecord, WasteRecord, SafetyRecord
from app.models.user import User
from app.models.engine import CalculationRun, CalculationResult, ValidationRun, ValidationResult
from app.models.workflow import ApprovalAction, SubmissionVersion, WorkflowTransition
from app.schemas.reporting import ProjectMonthlySubmissionInput, SubmissionResponse, SubmissionStatusUpdate
from app.schemas.engine import CalculationRunResponse, ValidationRunResponse
from app.schemas.workflow import WorkflowActionInput, ApprovalActionResponse, SubmissionVersionResponse
from app.services.validation_engine import ValidationEngine
from app.services.emission_engine import EmissionEngine
from app.services.workflow_engine import WorkflowEngine
from app.services.audit_service import AuditService
from app.api.deps import get_current_user, require_project_access, get_user_authorized_project_ids

router = APIRouter(prefix="/submissions", tags=["ESG Data Submissions & Workflow"])



@router.get("", response_model=List[SubmissionResponse])
def list_submissions(
    project_id: Optional[str] = Query(None),
    reporting_period_id: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = db.query(Submission).options(
        joinedload(Submission.fuel_records),
        joinedload(Submission.energy_records),
        joinedload(Submission.water_records),
        joinedload(Submission.waste_records),
        joinedload(Submission.safety_records)
    )
    if project_id:
        require_project_access(project_id, current_user, db)
        query = query.filter(Submission.project_id == project_id)
    else:
        # Enforce scope isolation when project_id is omitted (Item 24 & 69)
        allowed_pids = get_user_authorized_project_ids(current_user, db)
        if allowed_pids is not None:
            query = query.filter(Submission.project_id.in_(allowed_pids))

    if reporting_period_id:
        query = query.filter(Submission.reporting_period_id == reporting_period_id)
    if status:
        query = query.filter(Submission.status == status)

    return query.order_by(Submission.updated_at.desc()).all()

@router.get("/{submission_id}", response_model=SubmissionResponse)
def get_submission_detail(
    submission_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    submission = db.query(Submission).options(
        joinedload(Submission.fuel_records),
        joinedload(Submission.energy_records),
        joinedload(Submission.water_records),
        joinedload(Submission.waste_records),
        joinedload(Submission.safety_records)
    ).filter(Submission.id == submission_id).first()

    if not submission:
        raise HTTPException(status_code=404, detail="Submission not found")

    require_project_access(submission.project_id, current_user, db)
    return submission

@router.post("", response_model=SubmissionResponse)
def submit_monthly_esg_data(
    data: ProjectMonthlySubmissionInput,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # 1. Verify project authorization scope
    require_project_access(data.project_id, current_user, db)

    # 2. Verify reporting period is active and not locked
    period = db.query(ReportingPeriod).filter(ReportingPeriod.id == data.reporting_period_id).first()
    if not period or not period.is_active:
        raise HTTPException(status_code=400, detail="Reporting period is inactive or does not exist")
    if period.is_locked:
        raise HTTPException(status_code=423, detail="Reporting period is locked. Edits not permitted.")

    # 3. Run automated validation engine
    validation_result = ValidationEngine.validate_monthly_submission(data.model_dump())
    if not validation_result["is_valid"]:
        raise HTTPException(
            status_code=422,
            detail={"message": "Validation rules failed", "errors": validation_result["errors"]}
        )

    # 4. Create or update Submission header
    submission = db.query(Submission).filter(
        Submission.project_id == data.project_id,
        Submission.reporting_period_id == data.reporting_period_id
    ).first()

    user_role_name = current_user.role.name if current_user.role else "PROJECT_OFFICER"

    if not submission:
        submission = Submission(
            project_id=data.project_id,
            reporting_period_id=data.reporting_period_id,
            status="SUBMITTED",
            version=1,
            submitted_by=current_user.full_name,
            submitted_at=datetime.now(timezone.utc)
        )
        db.add(submission)
        db.flush()
    else:
        submission.status = "SUBMITTED"
        submission.version += 1
        submission.submitted_by = current_user.full_name
        submission.submitted_at = datetime.now(timezone.utc)

    # Clean existing draft child records for clean version replacement
    db.query(FuelRecord).filter(FuelRecord.submission_id == submission.id).delete()
    db.query(EnergyRecord).filter(EnergyRecord.submission_id == submission.id).delete()
    db.query(WaterRecord).filter(WaterRecord.submission_id == submission.id).delete()
    db.query(WasteRecord).filter(WasteRecord.submission_id == submission.id).delete()
    db.query(SafetyRecord).filter(SafetyRecord.submission_id == submission.id).delete()

    # 5. Process Fuel Records (Scope 1)
    for f in data.fuel_records:
        fuel_factor = EmissionEngine.get_factor(db, f.fuel_type)
        scope1_tons = round((f.quantity * fuel_factor["factor"]) / 1000.0, 2)
        rec = FuelRecord(
            submission_id=submission.id,
            project_id=data.project_id,
            reporting_period_id=data.reporting_period_id,
            fuel_type=f.fuel_type,
            quantity=f.quantity,
            unit=f.unit,
            scope1_co2e_tonnes=scope1_tons,
            factor_id=fuel_factor["id"],
            factor_version=fuel_factor["version"],
            evidence_id=f.evidence_id
        )
        db.add(rec)

    # 6. Process Energy Records (Scope 2 & GJ)
    for e in data.energy_records:
        energy_factor = EmissionEngine.get_factor(db, "grid_electricity")
        grid_kwh = max(0.0, e.quantity_kwh - (e.renewable_kwh or 0.0))
        scope2_tons = round((grid_kwh * energy_factor["factor"]) / 1000.0, 2)
        energy_gj = round((e.quantity_kwh * 3.6) / 1000.0, 1)

        rec = EnergyRecord(
            submission_id=submission.id,
            project_id=data.project_id,
            reporting_period_id=data.reporting_period_id,
            energy_source=e.energy_source,
            quantity_kwh=e.quantity_kwh,
            renewable_kwh=e.renewable_kwh or 0.0,
            scope2_co2e_tonnes=scope2_tons,
            energy_gj=energy_gj,
            factor_id=energy_factor["id"],
            factor_version=energy_factor["version"],
            evidence_id=e.evidence_id
        )
        db.add(rec)

    # 7. Process Water Records
    for w in data.water_records:
        rec = WaterRecord(
            submission_id=submission.id,
            project_id=data.project_id,
            reporting_period_id=data.reporting_period_id,
            source_type=w.source_type,
            withdrawal_kl=w.withdrawal_kl,
            recycled_kl=w.recycled_kl or 0.0,
            discharged_kl=w.discharged_kl or 0.0,
            treatment_type=w.treatment_type,
            evidence_id=w.evidence_id
        )
        db.add(rec)

    # 8. Process Waste Records
    for wst in data.waste_records:
        rec = WasteRecord(
            submission_id=submission.id,
            project_id=data.project_id,
            reporting_period_id=data.reporting_period_id,
            waste_category=wst.waste_category,
            quantity_metric_tonnes=wst.quantity_metric_tonnes,
            disposal_route=wst.disposal_route,
            diverted_from_disposal_pct=wst.diverted_from_disposal_pct or 0.0,
            evidence_id=wst.evidence_id
        )
        db.add(rec)

    # 9. Process Safety Records
    for s in data.safety_records:
        ltifr = round(((s.lost_time_injuries or 0) * 1000000.0) / s.safe_man_hours, 2) if s.safe_man_hours > 0 else 0.0
        rec = SafetyRecord(
            submission_id=submission.id,
            project_id=data.project_id,
            reporting_period_id=data.reporting_period_id,
            safe_man_hours=s.safe_man_hours,
            lost_time_injuries=s.lost_time_injuries or 0,
            fatalities=s.fatalities or 0,
            near_misses=s.near_misses or 0,
            ltifr=ltifr,
            evidence_id=s.evidence_id
        )
        db.add(rec)

    db.commit()
    db.refresh(submission)

    # 10. Log Immutable Regulatory Audit Event with Real Context
    AuditService.log_event(
        db=db,
        actor_id=current_user.id,
        actor_name=current_user.full_name,
        actor_role=user_role_name,
        action="MONTHLY_SUBMISSION_CREATED",
        entity_type="Submission",
        entity_id=submission.id,
        new_state="SUBMITTED",
        details=f"Submitted ESG monthly package for Project ID: {data.project_id} (Version {submission.version})"
    )

    return submission

@router.patch("/{submission_id}/status", response_model=SubmissionResponse)
def update_submission_status(
    submission_id: str,
    update: SubmissionStatusUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    target_status = update.status
    if target_status == "CORRECTION_REQUESTED":
        target_status = "CORRECTION_REQUIRED"

    return WorkflowEngine.execute_transition(
        db=db,
        submission_id=submission_id,
        to_status=target_status,
        user=current_user,
        comment=update.comment
    )

@router.post("/{submission_id}/submit", response_model=SubmissionResponse)
def workflow_submit(
    submission_id: str,
    action_in: Optional[WorkflowActionInput] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    comment = action_in.comment if action_in else None
    return WorkflowEngine.execute_transition(
        db=db,
        submission_id=submission_id,
        to_status="SUBMITTED",
        user=current_user,
        comment=comment
    )

@router.post("/{submission_id}/approve", response_model=SubmissionResponse)
def workflow_approve(
    submission_id: str,
    action_in: Optional[WorkflowActionInput] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    submission = db.query(Submission).filter(Submission.id == submission_id).first()
    if not submission:
        raise HTTPException(status_code=404, detail="Submission not found")

    # Tier advancement based on current status
    if submission.status in ["SUBMITTED", "BU_REVIEW"]:
        target_status = "BU_APPROVED"
    elif submission.status in ["BU_APPROVED", "SUBSIDIARY_REVIEW"]:
        target_status = "SUBSIDIARY_APPROVED"
    else:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Cannot approve submission currently in status '{submission.status}'"
        )

    comment = action_in.comment if action_in else None
    return WorkflowEngine.execute_transition(
        db=db,
        submission_id=submission_id,
        to_status=target_status,
        user=current_user,
        comment=comment
    )

@router.post("/{submission_id}/reject", response_model=SubmissionResponse)
def workflow_reject_for_correction(
    submission_id: str,
    action_in: WorkflowActionInput,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if not action_in.comment:
        raise HTTPException(status_code=400, detail="Rejection comment explaining required corrections is mandatory")

    return WorkflowEngine.execute_transition(
        db=db,
        submission_id=submission_id,
        to_status="CORRECTION_REQUIRED",
        user=current_user,
        comment=action_in.comment
    )

@router.post("/{submission_id}/lock", response_model=SubmissionResponse)
def workflow_group_lock(
    submission_id: str,
    action_in: Optional[WorkflowActionInput] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    comment = action_in.comment if action_in else None
    return WorkflowEngine.execute_transition(
        db=db,
        submission_id=submission_id,
        to_status="LOCKED",
        user=current_user,
        comment=comment
    )

@router.get("/{submission_id}/history", response_model=Dict[str, Any])
def get_submission_workflow_history(
    submission_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    submission = db.query(Submission).filter(Submission.id == submission_id).first()
    if not submission:
        raise HTTPException(status_code=404, detail="Submission not found")
    require_project_access(submission.project_id, current_user, db)

    approvals = db.query(ApprovalAction).filter(
        ApprovalAction.submission_id == submission_id
    ).order_by(ApprovalAction.created_at.desc()).all()

    versions = db.query(SubmissionVersion).filter(
        SubmissionVersion.submission_id == submission_id
    ).order_by(SubmissionVersion.version_number.desc()).all()

    return {
        "submission_id": submission_id,
        "current_status": submission.status,
        "current_version": submission.version,
        "approval_actions": [ApprovalActionResponse.model_validate(a) for a in approvals],
        "archived_versions": [SubmissionVersionResponse.model_validate(v) for v in versions]
    }

 
@router.post("/{submission_id}/calculate", response_model=CalculationRunResponse)
def calculate_submission_metrics(
    submission_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    submission = db.query(Submission).filter(Submission.id == submission_id).first()
    if not submission:
        raise HTTPException(status_code=404, detail="Submission not found")
    require_project_access(submission.project_id, current_user, db)

    run = EmissionEngine.execute_submission_calculations(db, submission_id, current_user.id)

    # Log Calculation Run in Audit Trail
    user_role_name = current_user.role.name if current_user.role else "USER"
    AuditService.log_event(
        db=db,
        actor_id=current_user.id,
        actor_name=current_user.full_name,
        actor_role=user_role_name,
        action="CALCULATION_ENGINE_EXECUTED",
        entity_type="CalculationRun",
        entity_id=run.id,
        new_state="COMPLETED",
        details=f"Calculated Scope 1, Scope 2, GJ, LTIFR for submission {submission_id} (Version: {run.engine_version})"
    )

    return run

@router.get("/{submission_id}/calculations", response_model=List[CalculationRunResponse])
def get_submission_calculations(
    submission_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    submission = db.query(Submission).filter(Submission.id == submission_id).first()
    if not submission:
        raise HTTPException(status_code=404, detail="Submission not found")
    require_project_access(submission.project_id, current_user, db)

    runs = db.query(CalculationRun).options(
        joinedload(CalculationRun.results)
    ).filter(CalculationRun.submission_id == submission_id).order_by(CalculationRun.started_at.desc()).all()

    return runs

@router.post("/{submission_id}/validate", response_model=ValidationRunResponse)
def validate_submission_data(
    submission_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    submission = db.query(Submission).options(
        joinedload(Submission.fuel_records),
        joinedload(Submission.energy_records),
        joinedload(Submission.water_records),
        joinedload(Submission.waste_records),
        joinedload(Submission.safety_records)
    ).filter(Submission.id == submission_id).first()
    if not submission:
        raise HTTPException(status_code=404, detail="Submission not found")
    require_project_access(submission.project_id, current_user, db)

    # Serialize submission records for validation engine
    submission_data = {
        "reporting_period_id": submission.reporting_period_id,
        "fuel_records": [{"quantity": f.quantity, "fuel_type": f.fuel_type, "unit": f.unit, "evidence_id": f.evidence_id} for f in submission.fuel_records],
        "energy_records": [{"quantity_kwh": e.quantity_kwh, "renewable_kwh": e.renewable_kwh, "energy_source": e.energy_source} for e in submission.energy_records],
        "water_records": [{"withdrawal_kl": w.withdrawal_kl, "recycled_kl": w.recycled_kl, "discharged_kl": w.discharged_kl, "source_type": w.source_type} for w in submission.water_records],
        "waste_records": [{"quantity_metric_tonnes": wst.quantity_metric_tonnes, "waste_category": wst.waste_category, "disposal_route": wst.disposal_route} for wst in submission.waste_records],
        "safety_records": [{"safe_man_hours": s.safe_man_hours, "lost_time_injuries": s.lost_time_injuries, "fatalities": s.fatalities} for s in submission.safety_records]
    }

    val_res = ValidationEngine.validate_monthly_submission(submission_data, db=db, submission_id=submission_id)
    val_run = db.query(ValidationRun).options(
        joinedload(ValidationRun.results)
    ).filter(ValidationRun.id == val_res["validation_run_id"]).first()

    return val_run

@router.get("/{submission_id}/validation", response_model=List[ValidationRunResponse])
def get_submission_validation_runs(
    submission_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    submission = db.query(Submission).filter(Submission.id == submission_id).first()
    if not submission:
        raise HTTPException(status_code=404, detail="Submission not found")
    require_project_access(submission.project_id, current_user, db)

    runs = db.query(ValidationRun).options(
        joinedload(ValidationRun.results)
    ).filter(ValidationRun.submission_id == submission_id).order_by(ValidationRun.started_at.desc()).all()

    return runs

