from typing import List, Optional
from datetime import date, datetime
from pydantic import BaseModel

class ReportingPeriodBase(BaseModel):
    name: str
    financial_year: str
    start_date: date
    end_date: date
    is_active: Optional[bool] = True
    is_locked: Optional[bool] = False

class ReportingPeriodCreate(ReportingPeriodBase):
    pass

class ReportingPeriodResponse(ReportingPeriodBase):
    id: str
    created_at: datetime

    class Config:
        from_attributes = True

class FuelRecordInput(BaseModel):
    fuel_type: str
    quantity: float
    unit: str
    evidence_id: Optional[str] = None

class EnergyRecordInput(BaseModel):
    energy_source: str
    quantity_kwh: float
    renewable_kwh: Optional[float] = 0.0
    evidence_id: Optional[str] = None

class WaterRecordInput(BaseModel):
    source_type: str
    withdrawal_kl: float
    recycled_kl: Optional[float] = 0.0
    discharged_kl: Optional[float] = 0.0
    treatment_type: Optional[str] = "ZLD"
    evidence_id: Optional[str] = None

class WasteRecordInput(BaseModel):
    waste_category: str
    quantity_metric_tonnes: float
    disposal_route: str
    diverted_from_disposal_pct: Optional[float] = 0.0
    evidence_id: Optional[str] = None

class SafetyRecordInput(BaseModel):
    safe_man_hours: float
    lost_time_injuries: Optional[int] = 0
    fatalities: Optional[int] = 0
    near_misses: Optional[int] = 0
    evidence_id: Optional[str] = None

class ProjectMonthlySubmissionInput(BaseModel):
    project_id: str
    reporting_period_id: str
    fuel_records: List[FuelRecordInput] = []
    energy_records: List[EnergyRecordInput] = []
    water_records: List[WaterRecordInput] = []
    waste_records: List[WasteRecordInput] = []
    safety_records: List[SafetyRecordInput] = []

class SubmissionStatusUpdate(BaseModel):
    status: str
    comment: Optional[str] = None

class SubmissionResponse(BaseModel):
    id: str
    project_id: str
    reporting_period_id: str
    status: str
    version: int
    submitted_by: Optional[str] = None
    submitted_at: Optional[datetime] = None
    reviewed_by: Optional[str] = None
    approved_by: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True
