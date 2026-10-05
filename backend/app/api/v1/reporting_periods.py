from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.reporting import ReportingPeriod
from app.schemas.reporting import ReportingPeriodResponse, ReportingPeriodCreate

router = APIRouter(prefix="/reporting-periods", tags=["Reporting Periods"])

@router.get("", response_model=List[ReportingPeriodResponse])
def list_reporting_periods(db: Session = Depends(get_db)):
    return db.query(ReportingPeriod).order_by(ReportingPeriod.start_date.desc()).all()

@router.post("", response_model=ReportingPeriodResponse)
def create_reporting_period(data: ReportingPeriodCreate, db: Session = Depends(get_db)):
    existing = db.query(ReportingPeriod).filter(ReportingPeriod.name == data.name).first()
    if existing:
        raise HTTPException(status_code=400, detail="Reporting period already exists")
    
    period = ReportingPeriod(**data.model_dump())
    db.add(period)
    db.commit()
    db.refresh(period)
    return period
