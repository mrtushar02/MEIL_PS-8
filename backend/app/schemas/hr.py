from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class WorkforceRecordCreate(BaseModel):
    subsidiary_name: str
    category: str
    male_count: int
    female_count: int
    other_count: Optional[int] = 0
    permanent_count: Optional[int] = 0
    contractual_count: Optional[int] = 0
    differently_abled_count: Optional[int] = 0
    turnover_rate_pct: Optional[float] = 0.0
    reporting_period: Optional[str] = "FY 2026-27"

class WorkforceRecordResponse(WorkforceRecordCreate):
    id: str
    total_count: int
    female_pct: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

class TrainingRecordCreate(BaseModel):
    title: str
    category: str
    subsidiary_name: str
    attendees_count: int
    hours: float
    trainer: Optional[str] = None
    date_logged: Optional[str] = "Today"
    status: Optional[str] = "Verified"

class TrainingRecordResponse(TrainingRecordCreate):
    id: str
    created_at: datetime

    class Config:
        from_attributes = True

class WellbeingRecordResponse(BaseModel):
    id: str
    subsidiary_name: str
    health_insurance_pct: float
    accident_insurance_pct: float
    maternity_retention_pct: float
    paternity_takeup_pct: float
    annual_medical_screenings: int
    creche_compliant: bool
    reporting_period: str

    class Config:
        from_attributes = True

class PoshGrievanceResponse(BaseModel):
    id: str
    reporting_period: str
    complaints_filed: int
    complaints_investigated: int
    complaints_resolved: int
    complaints_pending: int
    wage_parity_ratio: float
    statutory_minimum_multiplier: float
    child_labour_incidents: int
    forced_labour_incidents: int

    class Config:
        from_attributes = True

class HREvidenceCreate(BaseModel):
    doc_code: str
    title: str
    category: str
    subsidiary_name: str
    ref_no: str
    date_issued: Optional[str] = None
    file_size: Optional[str] = "2.4 MB PDF"
    verifier: str

class HREvidenceResponse(HREvidenceCreate):
    id: str
    status: str
    hash_sha256: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

class HRSubmissionCreate(BaseModel):
    sub_code: str
    title: str
    authority: str
    due_date: str
    approver: str
    ref_id: str

class HRSubmissionResponse(BaseModel):
    id: str
    sub_code: str
    title: str
    authority: str
    due_date: str
    submitted_date: str
    approver: str
    status: str
    ref_id: str
    created_at: datetime

    class Config:
        from_attributes = True

class HROverviewResponse(BaseModel):
    total_workforce: int
    direct_employees: int
    contract_workers: int
    female_diversity_pct: float
    training_hours_per_emp: float
    fair_wage_adherence_pct: float
    statutory_minimum_multiplier: float
    differently_abled_count: int
    posh_resolution_pct: float
    pending_posh_grievances: int
    subsidiaries_count: int
    statutory_filings_count: int
