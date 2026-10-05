from sqlalchemy import Column, String, Integer, Float, Boolean, DateTime, ForeignKey, Text
from datetime import datetime, timezone
import uuid
from app.core.database import Base

def generate_uuid():
    return str(uuid.uuid4())

class HseIncident(Base):
    __tablename__ = "hse_incidents"

    id = Column(String, primary_key=True, default=generate_uuid)
    incident_number = Column(String, unique=True, nullable=False)
    project_id = Column(String, nullable=True)
    project_name = Column(String, nullable=False)
    reporting_period = Column(String, default="September 2026")
    incident_date = Column(String, nullable=False)
    incident_time = Column(String, default="10:30 AM")
    location = Column(String, nullable=False)
    type = Column(String, nullable=False)  # Incident, Near Miss, Injury, LTI, Fatality, Safety Observation, Environmental Incident
    severity = Column(String, nullable=False)  # Critical, High, Medium, Low
    description = Column(Text, nullable=False)
    people_affected = Column(Integer, default=0)
    injury = Column(Boolean, default=False)
    lti = Column(Boolean, default=False)
    fatality = Column(Boolean, default=False)
    immediate_action = Column(Text, nullable=True)
    root_cause = Column(Text, nullable=True)
    corrective_action = Column(Text, nullable=True)
    responsible_owner = Column(String, nullable=False)
    status = Column(String, default="Reported")  # Reported, Triage, Investigation, Corrective Action, Verification, Closed
    target_date = Column(String, nullable=True)
    evidence_ref = Column(String, nullable=True)
    created_by = Column(String, default="Rajeshwar K.")
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

class HseInspection(Base):
    __tablename__ = "hse_inspections"

    id = Column(String, primary_key=True, default=generate_uuid)
    inspection_number = Column(String, unique=True, nullable=False)
    project_name = Column(String, nullable=False)
    type = Column(String, nullable=False)  # Safety Inspection, Site HSE Inspection, Environmental Inspection, Equipment Inspection, Emergency Preparedness
    inspector = Column(String, nullable=False)
    scheduled_date = Column(String, nullable=False)
    completed_date = Column(String, nullable=True)
    status = Column(String, default="Scheduled")  # Scheduled, In Progress, Completed, Findings Recorded, Verified, Closed
    score = Column(Float, default=90.0)
    findings_count = Column(Integer, default=0)
    checklist_summary = Column(Text, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class HseCorrectiveAction(Base):
    __tablename__ = "hse_corrective_actions"

    id = Column(String, primary_key=True, default=generate_uuid)
    action_number = Column(String, unique=True, nullable=False)
    source_type = Column(String, nullable=False)  # Incident, Inspection, Audit, Observation, Environmental
    source_id = Column(String, nullable=False)
    project_name = Column(String, nullable=False)
    issue = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    priority = Column(String, default="Medium")  # Critical, High, Medium, Low
    owner = Column(String, nullable=False)
    due_date = Column(String, nullable=False)
    status = Column(String, default="Open")  # Open, In Progress, Pending Verification, Verified, Closed, Overdue
    verification_status = Column(String, default="Pending")
    evidence_ref = Column(String, nullable=True)
    closed_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class HseTrainingBatch(Base):
    __tablename__ = "hse_training_batches"

    id = Column(String, primary_key=True, default=generate_uuid)
    batch_number = Column(String, unique=True, nullable=False)
    topic = Column(String, nullable=False)
    type = Column(String, nullable=False)  # Safety Induction, Toolbox Talk, Emergency Response, PPE, Fire Safety, First Aid
    mandatory = Column(Boolean, default=True)
    trainer = Column(String, nullable=False)
    project_name = Column(String, nullable=False)
    location = Column(String, nullable=True)
    date_logged = Column(String, nullable=False)
    participants_count = Column(Integer, default=0)
    hours = Column(Float, default=1.0)
    status = Column(String, default="Completed")
    evidence_ref = Column(String, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class HseEnvironmentalRecord(Base):
    __tablename__ = "hse_environmental_records"

    id = Column(String, primary_key=True, default=generate_uuid)
    project_name = Column(String, nullable=False)
    reporting_period = Column(String, default="September 2026")
    module = Column(String, nullable=False)  # Water, Waste, CAAQMS, Stack Emissions, Monitoring
    category = Column(String, nullable=False)
    quantity = Column(Float, nullable=False)
    unit = Column(String, nullable=False)
    source = Column(String, default="Sensor Telemetry")
    status = Column(String, default="Compliant")  # Compliant, Warning, Exceedance, In Review
    evidence_ref = Column(String, nullable=True)
    date_logged = Column(String, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class HseEvidenceRecord(Base):
    __tablename__ = "hse_evidence_records"

    id = Column(String, primary_key=True, default=generate_uuid)
    doc_number = Column(String, unique=True, nullable=False)
    title = Column(String, nullable=False)
    category = Column(String, nullable=False)  # Incident Report, Inspection Checklist, Audit Report, Training Attendance, Environmental Manifest
    project_name = Column(String, nullable=False)
    source_entity = Column(String, nullable=True)  # INC-2026-081, INSP-104, TRN-501
    source_id = Column(String, nullable=True)
    file_name = Column(String, nullable=False)
    file_size = Column(String, default="1.8 MB")
    status = Column(String, default="Verified")  # Uploaded, Pending Review, Verified, Rejected
    uploaded_by = Column(String, default="Rajeshwar K.")
    uploaded_at = Column(String, nullable=False)
    hash_sha256 = Column(String, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class HseSubmissionRecord(Base):
    __tablename__ = "hse_submissions"

    id = Column(String, primary_key=True, default=generate_uuid)
    submission_number = Column(String, unique=True, nullable=False)
    module = Column(String, nullable=False)  # Zero-Harm HSE Monthly, CPCB Hazardous Manifest Form 10, Safety Audit P6
    project_name = Column(String, nullable=False)
    reporting_period = Column(String, default="September 2026")
    submitted_by = Column(String, default="Rajeshwar K.")
    submitted_on = Column(String, nullable=False)
    status = Column(String, default="Under Review")  # Draft, Validated, Submitted, Under Review, Correction Required, Approved, Locked
    reviewer = Column(String, default="Group Safety Director")
    total_items = Column(Integer, default=12)
    last_updated = Column(String, nullable=False)
    remarks = Column(Text, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
