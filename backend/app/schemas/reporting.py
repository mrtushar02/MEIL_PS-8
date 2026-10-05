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

# ── Fuel ──
class FuelRecordInput(BaseModel):
    fuel_type: str
    quantity: float
    unit: str
    evidence_id: Optional[str] = None
    reporting_period_id: Optional[str] = None

class FuelRecordResponse(BaseModel):
    id: str
    submission_id: str
    project_id: str
    reporting_period_id: str
    fuel_type: str
    quantity: float
    unit: str
    scope1_co2e_tonnes: float
    factor_id: str
    factor_version: str
    evidence_id: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

# ── Energy ──
class EnergyRecordInput(BaseModel):
    energy_source: str
    quantity_kwh: float
    renewable_kwh: Optional[float] = 0.0
    evidence_id: Optional[str] = None
    reporting_period_id: Optional[str] = None

class EnergyRecordResponse(BaseModel):
    id: str
    submission_id: str
    project_id: str
    reporting_period_id: str
    energy_source: str
    quantity_kwh: float
    renewable_kwh: float
    scope2_co2e_tonnes: float
    energy_gj: float
    factor_id: str
    factor_version: str
    evidence_id: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

# ── Water ──
class WaterRecordInput(BaseModel):
    source_type: str
    withdrawal_kl: float
    recycled_kl: Optional[float] = 0.0
    discharged_kl: Optional[float] = 0.0
    treatment_type: Optional[str] = "ZLD"
    evidence_id: Optional[str] = None
    reporting_period_id: Optional[str] = None

class WaterRecordResponse(BaseModel):
    id: str
    submission_id: str
    project_id: str
    reporting_period_id: str
    source_type: str
    withdrawal_kl: float
    recycled_kl: float
    discharged_kl: float
    treatment_type: Optional[str] = None
    evidence_id: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

# ── Waste ──
class WasteRecordInput(BaseModel):
    waste_category: str
    quantity_metric_tonnes: float
    disposal_route: str
    diverted_from_disposal_pct: Optional[float] = 0.0
    evidence_id: Optional[str] = None
    reporting_period_id: Optional[str] = None

class WasteRecordResponse(BaseModel):
    id: str
    submission_id: str
    project_id: str
    reporting_period_id: str
    waste_category: str
    quantity_metric_tonnes: float
    disposal_route: str
    diverted_from_disposal_pct: float
    evidence_id: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

# ── Safety ──
class SafetyRecordInput(BaseModel):
    safe_man_hours: float
    lost_time_injuries: Optional[int] = 0
    fatalities: Optional[int] = 0
    near_misses: Optional[int] = 0
    evidence_id: Optional[str] = None
    reporting_period_id: Optional[str] = None

class SafetyRecordResponse(BaseModel):
    id: str
    submission_id: str
    project_id: str
    reporting_period_id: str
    safe_man_hours: float
    lost_time_injuries: int
    fatalities: int
    near_misses: int
    ltifr: float
    evidence_id: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

# ── Full Monthly Submission ──
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
    rejection_reason: Optional[str] = None
    created_at: datetime
    fuel_records: List[FuelRecordResponse] = []
    energy_records: List[EnergyRecordResponse] = []
    water_records: List[WaterRecordResponse] = []
    waste_records: List[WasteRecordResponse] = []
    safety_records: List[SafetyRecordResponse] = []

    class Config:
        from_attributes = True
