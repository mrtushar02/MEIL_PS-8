from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

# ── Incident Schemas ──
class HseIncidentCreate(BaseModel):
    project_name: str
    location: str
    type: str  # Incident, Near Miss, Injury, LTI, Fatality, Safety Observation, Environmental Incident
    severity: str  # Critical, High, Medium, Low
    description: str
    people_affected: int = 0
    injury: bool = False
    lti: bool = False
    fatality: bool = False
    immediate_action: Optional[str] = None
    root_cause: Optional[str] = None
    corrective_action: Optional[str] = None
    responsible_owner: str
    incident_date: str
    incident_time: Optional[str] = "10:30 AM"
    target_date: Optional[str] = None
    evidence_ref: Optional[str] = None

class HseIncidentResponse(BaseModel):
    id: str
    incident_number: str
    project_name: str
    location: str
    type: str
    severity: str
    description: str
    people_affected: int
    injury: bool
    lti: bool
    fatality: bool
    immediate_action: Optional[str]
    root_cause: Optional[str]
    corrective_action: Optional[str]
    responsible_owner: str
    status: str
    incident_date: str
    incident_time: Optional[str]
    target_date: Optional[str]
    evidence_ref: Optional[str]
    created_at: Optional[datetime]

    class Config:
        from_attributes = True

# ── Inspection Schemas ──
class HseInspectionCreate(BaseModel):
    project_name: str
    type: str
    inspector: str
    scheduled_date: str
    status: str = "Scheduled"
    score: float = 90.0
    checklist_summary: Optional[str] = None

class HseInspectionResponse(BaseModel):
    id: str
    inspection_number: str
    project_name: str
    type: str
    inspector: str
    scheduled_date: str
    completed_date: Optional[str]
    status: str
    score: float
    findings_count: int
    checklist_summary: Optional[str]
    created_at: Optional[datetime]

    class Config:
        from_attributes = True

# ── Corrective Action Schemas ──
class HseCorrectiveActionCreate(BaseModel):
    source_type: str
    source_id: str
    project_name: str
    issue: str
    description: Optional[str] = None
    priority: str = "Medium"
    owner: str
    due_date: str
    evidence_ref: Optional[str] = None

class HseCorrectiveActionResponse(BaseModel):
    id: str
    action_number: str
    source_type: str
    source_id: str
    project_name: str
    issue: str
    description: Optional[str]
    priority: str
    owner: str
    due_date: str
    status: str
    verification_status: str
    evidence_ref: Optional[str]
    created_at: Optional[datetime]

    class Config:
        from_attributes = True

# ── Training Batch Schemas ──
class HseTrainingBatchCreate(BaseModel):
    topic: str
    type: str
    mandatory: bool = True
    trainer: str
    project_name: str
    location: Optional[str] = None
    date_logged: str
    participants_count: int = 25
    hours: float = 1.0
    evidence_ref: Optional[str] = None

class HseTrainingBatchResponse(BaseModel):
    id: str
    batch_number: str
    topic: str
    type: str
    mandatory: bool
    trainer: str
    project_name: str
    location: Optional[str]
    date_logged: str
    participants_count: int
    hours: float
    status: str
    evidence_ref: Optional[str]
    created_at: Optional[datetime]

    class Config:
        from_attributes = True

# ── Environmental Record Schemas ──
class HseEnvironmentalRecordCreate(BaseModel):
    project_name: str
    module: str
    category: str
    quantity: float
    unit: str
    source: str = "Sensor Telemetry"
    status: str = "Compliant"
    evidence_ref: Optional[str] = None
    date_logged: str

class HseEnvironmentalRecordResponse(BaseModel):
    id: str
    project_name: str
    reporting_period: str
    module: str
    category: str
    quantity: float
    unit: str
    source: str
    status: str
    evidence_ref: Optional[str]
    date_logged: str
    created_at: Optional[datetime]

    class Config:
        from_attributes = True

# ── Evidence Schemas ──
class HseEvidenceCreate(BaseModel):
    title: str
    category: str
    project_name: str
    source_entity: Optional[str] = None
    source_id: Optional[str] = None
    file_name: str
    file_size: str = "1.8 MB"

class HseEvidenceResponse(BaseModel):
    id: str
    doc_number: str
    title: str
    category: str
    project_name: str
    source_entity: Optional[str]
    source_id: Optional[str]
    file_name: str
    file_size: str
    status: str
    uploaded_by: str
    uploaded_at: str
    hash_sha256: Optional[str]

    class Config:
        from_attributes = True

# ── Submission Schemas ──
class HseSubmissionCreate(BaseModel):
    module: str
    project_name: str
    reporting_period: str = "September 2026"
    submitted_by: str = "Rajeshwar K."
    remarks: Optional[str] = None

class HseSubmissionResponse(BaseModel):
    id: str
    submission_number: str
    module: str
    project_name: str
    reporting_period: str
    submitted_by: str
    submitted_on: str
    status: str
    reviewer: str
    total_items: int
    last_updated: str
    remarks: Optional[str]

    class Config:
        from_attributes = True

# ── Overview Response ──
class HseOverviewResponse(BaseModel):
    total_incidents: int
    incidents_trend_pct: float
    open_high_risk_incidents: int
    lost_time_injuries: int
    fatalities: int
    safe_man_hours_million: float
    ltifr_rate: float
    safety_training_coverage_pct: float
    inspection_completion_pct: float
    overdue_corrective_actions: int
    water_recycled_pct: float
    net_ghg_footprint_tco2e: float
    cea_grid_baseline_factor: float
    renewable_energy_share_pct: float
    active_sites_count: int
