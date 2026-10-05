from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime, timezone
from app.core.database import get_db
from app.models.reporting import Submission, ReportingPeriod
from app.models.organization import Project
from app.models.esg_records import FuelRecord, EnergyRecord, WaterRecord, WasteRecord, SafetyRecord
from app.schemas.reporting import ProjectMonthlySubmissionInput, SubmissionResponse, SubmissionStatusUpdate
from app.services.validation_engine import ValidationEngine
from app.services.emission_engine import EmissionEngine
from app.services.audit_service import AuditService

router = APIRouter(prefix="/submissions", tags=["ESG Data Submissions & Workflow"])

@router.post("", response_model=SubmissionResponse)
def submit_monthly_esg_data(data: ProjectMonthlySubmissionInput, db: Session = Depends(get_db)):
    # 1. Verify period is active and not locked
    period = db.query(ReportingPeriod).filter(ReportingPeriod.id == data.reporting_period_id).first()
    if not period or not period.is_active:
        raise HTTPException(status_code=400, detail="Reporting period is inactive or does not exist")
    if period.is_locked:
        raise HTTPException(status_code=400, detail="Reporting period is locked. Edits not permitted.")

    # 2. Run automated validation engine
    validation_result = ValidationEngine.validate_monthly_submission(data.model_dump())
    if not validation_result["is_valid"]:
        raise HTTPException(
            status_code=422,
            detail={"message": "Validation rules failed", "errors": validation_result["errors"]}
        )

    # 3. Create or update Submission header
    submission = db.query(Submission).filter(
        Submission.project_id == data.project_id,
        Submission.reporting_period_id == data.reporting_period_id
    ).first()

    if not submission:
        submission = Submission(
            project_id=data.project_id,
            reporting_period_id=data.reporting_period_id,
            status="SUBMITTED",
            submitted_by="Site ESG Officer",
            submitted_at=datetime.now(timezone.utc)
        )
        db.add(submission)
        db.flush()
    else:
        submission.status = "SUBMITTED"
        submission.version += 1
        submission.submitted_at = datetime.now(timezone.utc)

    # 4. Process Fuel Records (Scope 1)
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

    # 5. Process Energy Records (Scope 2 & GJ)
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

    # 6. Process Water Records
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

    # 7. Process Safety Records
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

    # 8. Log Immutable Audit Event
    AuditService.log_event(
        db=db,
        actor_id="user-site-officer",
        actor_name="Site ESG Engineer",
        actor_role="PROJECT_OFFICER",
        action="MONTHLY_SUBMISSION_CREATED",
        entity_type="Submission",
        entity_id=submission.id,
        new_state="SUBMITTED",
        details=f"Logged monthly ESG records for Project ID: {data.project_id}"
    )

    return submission

@router.patch("/{submission_id}/status", response_model=SubmissionResponse)
def update_submission_status(
    submission_id: str,
    update: SubmissionStatusUpdate,
    db: Session = Depends(get_db)
):
    submission = db.query(Submission).filter(Submission.id == submission_id).first()
    if not submission:
        raise HTTPException(status_code=404, detail="Submission not found")

    old_state = submission.status
    submission.status = update.status

    if update.status == "BU_APPROVED":
        submission.reviewed_by = "BU Coordinator"
        submission.reviewed_at = datetime.now(timezone.utc)
    elif update.status == "SUBSIDIARY_APPROVED":
        submission.approved_by = "Subsidiary ESG Head"
        submission.approved_at = datetime.now(timezone.utc)
    elif update.status == "CORRECTION_REQUESTED":
        submission.rejection_reason = update.comment

    db.commit()
    db.refresh(submission)

    # Log transition
    AuditService.log_event(
        db=db,
        actor_id="user-reviewer",
        actor_name="Reviewer / Approver",
        actor_role="REVIEWER",
        action=f"STATUS_TRANSITION_TO_{update.status}",
        entity_type="Submission",
        entity_id=submission.id,
        old_state=old_state,
        new_state=update.status,
        comment=update.comment
    )

    return submission
