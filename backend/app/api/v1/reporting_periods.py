from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.reporting import ReportingPeriod
from app.schemas.reporting import ReportingPeriodResponse, ReportingPeriodCreate
from app.api.deps import get_current_user, require_group_access
from app.models.user import User
from app.services.audit_service import AuditService

router = APIRouter(prefix="/reporting-periods", tags=["Reporting Periods"])

@router.get("", response_model=List[ReportingPeriodResponse])
def list_reporting_periods(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return db.query(ReportingPeriod).order_by(ReportingPeriod.start_date.desc()).all()

@router.post("", response_model=ReportingPeriodResponse, status_code=status.HTTP_201_CREATED)
def create_reporting_period(
    data: ReportingPeriodCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if not current_user.is_superuser and (not current_user.role or current_user.role.code != "GROUP_CSO"):
        raise HTTPException(status_code=403, detail="Only Group CSO or Super Admin may configure reporting periods")

    existing = db.query(ReportingPeriod).filter(ReportingPeriod.name == data.name).first()
    if existing:
        raise HTTPException(status_code=400, detail="Reporting period already exists")

    period = ReportingPeriod(**data.model_dump())
    db.add(period)
    db.commit()
    db.refresh(period)

    AuditService.log_event(
        db=db,
        actor_id=current_user.id,
        actor_name=current_user.full_name,
        actor_role=current_user.role.name if current_user.role else "USER",
        action="REPORTING_PERIOD_CREATED",
        entity_type="ReportingPeriod",
        entity_id=period.id,
        details=f"Created reporting period {period.name} ({period.financial_year})"
    )

    return period

@router.post("/{period_id}/lock", response_model=ReportingPeriodResponse)
def lock_reporting_period(
    period_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if not current_user.is_superuser and (not current_user.role or current_user.role.code != "GROUP_CSO"):
        raise HTTPException(status_code=403, detail="Only Group CSO or Super Admin may execute Group-level period LOCK")

    period = db.query(ReportingPeriod).filter(ReportingPeriod.id == period_id).first()
    if not period:
        raise HTTPException(status_code=404, detail="Reporting period not found")

    period.is_locked = True
    db.commit()
    db.refresh(period)

    AuditService.log_event(
        db=db,
        actor_id=current_user.id,
        actor_name=current_user.full_name,
        actor_role=current_user.role.name if current_user.role else "USER",
        action="REPORTING_PERIOD_LOCKED",
        entity_type="ReportingPeriod",
        entity_id=period.id,
        details=f"Period '{period.name}' permanently locked for SEBI BRSR official filing"
    )

    return period

@router.post("/{period_id}/unlock", response_model=ReportingPeriodResponse)
def unlock_reporting_period(
    period_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if not current_user.is_superuser:
        raise HTTPException(status_code=403, detail="Unlocking a locked regulatory period strictly requires Super Admin override")

    period = db.query(ReportingPeriod).filter(ReportingPeriod.id == period_id).first()
    if not period:
        raise HTTPException(status_code=404, detail="Reporting period not found")

    period.is_locked = False
    db.commit()
    db.refresh(period)

    AuditService.log_event(
        db=db,
        actor_id=current_user.id,
        actor_name=current_user.full_name,
        actor_role=current_user.role.name if current_user.role else "SUPER_ADMIN",
        action="REPORTING_PERIOD_UNLOCKED",
        entity_type="ReportingPeriod",
        entity_id=period.id,
        details=f"Period '{period.name}' unlocked via Super Admin emergency procedure"
    )

    return period
