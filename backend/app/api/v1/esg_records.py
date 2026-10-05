from typing import List, Optional
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.esg_records import FuelRecord, EnergyRecord, WaterRecord, WasteRecord, SafetyRecord
from app.models.reporting import Submission, ReportingPeriod
from app.models.user import User
from app.schemas.reporting import (
    FuelRecordInput, FuelRecordResponse,
    EnergyRecordInput, EnergyRecordResponse,
    WaterRecordInput, WaterRecordResponse,
    WasteRecordInput, WasteRecordResponse,
    SafetyRecordInput, SafetyRecordResponse
)
from app.api.deps import get_current_user, require_project_access
from app.services.emission_engine import EmissionEngine
from app.services.audit_service import AuditService

router = APIRouter(prefix="/projects/{project_id}", tags=["Project ESG Operational Data"])

def get_or_create_draft_submission(db: Session, project_id: str, reporting_period_id: str, user: User) -> Submission:
    period = db.query(ReportingPeriod).filter(ReportingPeriod.id == reporting_period_id).first()
    if not period or not period.is_active:
        raise HTTPException(status_code=400, detail="Reporting period is inactive or does not exist")
    if period.is_locked:
        raise HTTPException(status_code=423, detail="Reporting period is locked. Edits not permitted.")

    submission = db.query(Submission).filter(
        Submission.project_id == project_id,
        Submission.reporting_period_id == reporting_period_id
    ).first()

    if not submission:
        submission = Submission(
            project_id=project_id,
            reporting_period_id=reporting_period_id,
            status="DRAFT",
            version=1,
            submitted_by=user.full_name,
            submitted_at=datetime.now(timezone.utc)
        )
        db.add(submission)
        db.flush()
    return submission

# ── 1. FUEL (Scope 1) ──
@router.get("/fuel", response_model=List[FuelRecordResponse])
def list_fuel_records(
    project_id: str,
    reporting_period_id: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    require_project_access(project_id, current_user, db)
    query = db.query(FuelRecord).filter(FuelRecord.project_id == project_id)
    if reporting_period_id:
        query = query.filter(FuelRecord.reporting_period_id == reporting_period_id)
    return query.order_by(FuelRecord.created_at.desc()).all()

@router.post("/fuel", response_model=FuelRecordResponse)
def create_fuel_record(
    project_id: str,
    data: FuelRecordInput,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    require_project_access(project_id, current_user, db)
    if not data.reporting_period_id:
        raise HTTPException(status_code=400, detail="reporting_period_id is required")

    submission = get_or_create_draft_submission(db, project_id, data.reporting_period_id, current_user)
    factor = EmissionEngine.get_factor(db, data.fuel_type)
    scope1_tons = round((data.quantity * factor["factor"]) / 1000.0, 2)

    record = FuelRecord(
        submission_id=submission.id,
        project_id=project_id,
        reporting_period_id=data.reporting_period_id,
        fuel_type=data.fuel_type,
        quantity=data.quantity,
        unit=data.unit,
        scope1_co2e_tonnes=scope1_tons,
        factor_id=factor["id"],
        factor_version=factor["version"],
        evidence_id=data.evidence_id
    )
    db.add(record)
    db.commit()
    db.refresh(record)

    AuditService.log_event(
        db=db,
        actor_id=current_user.id,
        actor_name=current_user.full_name,
        actor_role=current_user.role.name if current_user.role else "PROJECT_OFFICER",
        action="FUEL_RECORD_CREATED",
        entity_type="FuelRecord",
        entity_id=record.id,
        details=f"Fuel: {data.fuel_type} | Qty: {data.quantity} {data.unit} | Scope 1: {scope1_tons} tCO2e"
    )
    return record

# ── 2. ENERGY (Scope 2 & GJ) ──
@router.get("/energy", response_model=List[EnergyRecordResponse])
def list_energy_records(
    project_id: str,
    reporting_period_id: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    require_project_access(project_id, current_user, db)
    query = db.query(EnergyRecord).filter(EnergyRecord.project_id == project_id)
    if reporting_period_id:
        query = query.filter(EnergyRecord.reporting_period_id == reporting_period_id)
    return query.order_by(EnergyRecord.created_at.desc()).all()

@router.post("/energy", response_model=EnergyRecordResponse)
def create_energy_record(
    project_id: str,
    data: EnergyRecordInput,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    require_project_access(project_id, current_user, db)
    if not data.reporting_period_id:
        raise HTTPException(status_code=400, detail="reporting_period_id is required")

    submission = get_or_create_draft_submission(db, project_id, data.reporting_period_id, current_user)
    factor = EmissionEngine.get_factor(db, "grid_electricity")
    grid_kwh = max(0.0, data.quantity_kwh - (data.renewable_kwh or 0.0))
    scope2_tons = round((grid_kwh * factor["factor"]) / 1000.0, 2)
    energy_gj = round((data.quantity_kwh * 3.6) / 1000.0, 1)

    record = EnergyRecord(
        submission_id=submission.id,
        project_id=project_id,
        reporting_period_id=data.reporting_period_id,
        energy_source=data.energy_source,
        quantity_kwh=data.quantity_kwh,
        renewable_kwh=data.renewable_kwh or 0.0,
        scope2_co2e_tonnes=scope2_tons,
        energy_gj=energy_gj,
        factor_id=factor["id"],
        factor_version=factor["version"],
        evidence_id=data.evidence_id
    )
    db.add(record)
    db.commit()
    db.refresh(record)

    AuditService.log_event(
        db=db,
        actor_id=current_user.id,
        actor_name=current_user.full_name,
        actor_role=current_user.role.name if current_user.role else "PROJECT_OFFICER",
        action="ENERGY_RECORD_CREATED",
        entity_type="EnergyRecord",
        entity_id=record.id,
        details=f"Source: {data.energy_source} | Qty: {data.quantity_kwh} kWh | Scope 2: {scope2_tons} tCO2e"
    )
    return record

# ── 3. WATER ──
@router.get("/water", response_model=List[WaterRecordResponse])
def list_water_records(
    project_id: str,
    reporting_period_id: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    require_project_access(project_id, current_user, db)
    query = db.query(WaterRecord).filter(WaterRecord.project_id == project_id)
    if reporting_period_id:
        query = query.filter(WaterRecord.reporting_period_id == reporting_period_id)
    return query.order_by(WaterRecord.created_at.desc()).all()

@router.post("/water", response_model=WaterRecordResponse)
def create_water_record(
    project_id: str,
    data: WaterRecordInput,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    require_project_access(project_id, current_user, db)
    if not data.reporting_period_id:
        raise HTTPException(status_code=400, detail="reporting_period_id is required")

    submission = get_or_create_draft_submission(db, project_id, data.reporting_period_id, current_user)
    record = WaterRecord(
        submission_id=submission.id,
        project_id=project_id,
        reporting_period_id=data.reporting_period_id,
        source_type=data.source_type,
        withdrawal_kl=data.withdrawal_kl,
        recycled_kl=data.recycled_kl or 0.0,
        discharged_kl=data.discharged_kl or 0.0,
        treatment_type=data.treatment_type,
        evidence_id=data.evidence_id
    )
    db.add(record)
    db.commit()
    db.refresh(record)

    AuditService.log_event(
        db=db,
        actor_id=current_user.id,
        actor_name=current_user.full_name,
        actor_role=current_user.role.name if current_user.role else "PROJECT_OFFICER",
        action="WATER_RECORD_CREATED",
        entity_type="WaterRecord",
        entity_id=record.id,
        details=f"Source: {data.source_type} | Withdrawal: {data.withdrawal_kl} KL | Recycled: {data.recycled_kl} KL"
    )
    return record

# ── 4. WASTE ──
@router.get("/waste", response_model=List[WasteRecordResponse])
def list_waste_records(
    project_id: str,
    reporting_period_id: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    require_project_access(project_id, current_user, db)
    query = db.query(WasteRecord).filter(WasteRecord.project_id == project_id)
    if reporting_period_id:
        query = query.filter(WasteRecord.reporting_period_id == reporting_period_id)
    return query.order_by(WasteRecord.created_at.desc()).all()

@router.post("/waste", response_model=WasteRecordResponse)
def create_waste_record(
    project_id: str,
    data: WasteRecordInput,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    require_project_access(project_id, current_user, db)
    if not data.reporting_period_id:
        raise HTTPException(status_code=400, detail="reporting_period_id is required")

    submission = get_or_create_draft_submission(db, project_id, data.reporting_period_id, current_user)
    record = WasteRecord(
        submission_id=submission.id,
        project_id=project_id,
        reporting_period_id=data.reporting_period_id,
        waste_category=data.waste_category,
        quantity_metric_tonnes=data.quantity_metric_tonnes,
        disposal_route=data.disposal_route,
        diverted_from_disposal_pct=data.diverted_from_disposal_pct or 0.0,
        evidence_id=data.evidence_id
    )
    db.add(record)
    db.commit()
    db.refresh(record)

    AuditService.log_event(
        db=db,
        actor_id=current_user.id,
        actor_name=current_user.full_name,
        actor_role=current_user.role.name if current_user.role else "PROJECT_OFFICER",
        action="WASTE_RECORD_CREATED",
        entity_type="WasteRecord",
        entity_id=record.id,
        details=f"Category: {data.waste_category} | Qty: {data.quantity_metric_tonnes} MT | Route: {data.disposal_route}"
    )
    return record

# ── 5. SAFETY ──
@router.get("/safety", response_model=List[SafetyRecordResponse])
def list_safety_records(
    project_id: str,
    reporting_period_id: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    require_project_access(project_id, current_user, db)
    query = db.query(SafetyRecord).filter(SafetyRecord.project_id == project_id)
    if reporting_period_id:
        query = query.filter(SafetyRecord.reporting_period_id == reporting_period_id)
    return query.order_by(SafetyRecord.created_at.desc()).all()

@router.post("/safety", response_model=SafetyRecordResponse)
def create_safety_record(
    project_id: str,
    data: SafetyRecordInput,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    require_project_access(project_id, current_user, db)
    if not data.reporting_period_id:
        raise HTTPException(status_code=400, detail="reporting_period_id is required")

    submission = get_or_create_draft_submission(db, project_id, data.reporting_period_id, current_user)
    
    # Calculate LTIFR deterministically: (Injuries * 1,000,000) / safe_man_hours
    ltifr = round(((data.lost_time_injuries or 0) * 1000000.0) / data.safe_man_hours, 2) if data.safe_man_hours > 0 else 0.0

    record = SafetyRecord(
        submission_id=submission.id,
        project_id=project_id,
        reporting_period_id=data.reporting_period_id,
        safe_man_hours=data.safe_man_hours,
        lost_time_injuries=data.lost_time_injuries or 0,
        fatalities=data.fatalities or 0,
        near_misses=data.near_misses or 0,
        ltifr=ltifr,
        evidence_id=data.evidence_id
    )
    db.add(record)
    db.commit()
    db.refresh(record)

    AuditService.log_event(
        db=db,
        actor_id=current_user.id,
        actor_name=current_user.full_name,
        actor_role=current_user.role.name if current_user.role else "PROJECT_OFFICER",
        action="SAFETY_RECORD_CREATED",
        entity_type="SafetyRecord",
        entity_id=record.id,
        details=f"Safe Man Hours: {data.safe_man_hours} | LTI: {data.lost_time_injuries} | LTIFR: {ltifr}"
    )
    return record
