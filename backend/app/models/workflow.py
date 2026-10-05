from sqlalchemy import Column, String, Integer, Boolean, DateTime, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
import uuid
from app.core.database import Base

def generate_uuid():
    return str(uuid.uuid4())

class WorkflowTransition(Base):
    __tablename__ = "workflow_transitions"

    id = Column(String, primary_key=True, default=generate_uuid)
    from_status = Column(String, nullable=False)     # DRAFT, SUBMITTED, BU_APPROVED, SUBSIDIARY_APPROVED, CORRECTION_REQUIRED
    to_status = Column(String, nullable=False)       # SUBMITTED, BU_APPROVED, SUBSIDIARY_APPROVED, LOCKED, CORRECTION_REQUIRED
    required_role = Column(String, nullable=False)   # PROJECT_OFFICER, BU_COORDINATOR, SUBSIDIARY_HEAD, GROUP_CSO, SUPER_ADMIN
    required_permission = Column(String, nullable=True) # esg:submit, esg:bu_review, esg:subsidiary_review, esg:group_lock
    is_active = Column(Boolean, default=True)

class ApprovalAction(Base):
    __tablename__ = "approval_actions"

    id = Column(String, primary_key=True, default=generate_uuid)
    submission_id = Column(String, ForeignKey("submissions.id"), nullable=False, index=True)
    version_number = Column(Integer, nullable=False, default=1)
    action = Column(String, nullable=False)          # SUBMIT, BU_APPROVE, SUBSIDIARY_APPROVE, GROUP_LOCK, REQUEST_CORRECTION
    actor_id = Column(String, nullable=False)
    actor_name = Column(String, nullable=False)
    actor_role = Column(String, nullable=False)
    comment = Column(Text, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), index=True)

    submission = relationship("Submission")

class SubmissionVersion(Base):
    __tablename__ = "submission_versions"

    id = Column(String, primary_key=True, default=generate_uuid)
    submission_id = Column(String, ForeignKey("submissions.id"), nullable=False, index=True)
    version_number = Column(Integer, nullable=False)
    status = Column(String, nullable=False)
    change_reason = Column(Text, nullable=True)
    snapshot_json = Column(JSON, nullable=True)       # Canonical snapshot of records at this version
    is_current = Column(Boolean, default=False)
    created_by = Column(String, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    submission = relationship("Submission")

class ComplianceException(Base):
    __tablename__ = "compliance_exceptions"

    id = Column(String, primary_key=True, default=generate_uuid)
    scope_type = Column(String, nullable=False)      # PROJECT, BUSINESS_UNIT, SUBSIDIARY, GROUP
    scope_id = Column(String, nullable=False, index=True)
    reporting_period_id = Column(String, ForeignKey("reporting_periods.id"), nullable=False, index=True)
    source_record_type = Column(String, nullable=True) # FuelRecord, SafetyRecord, etc.
    source_record_id = Column(String, nullable=True)
    severity = Column(String, nullable=False)        # CRITICAL, HIGH, MEDIUM, LOW
    category = Column(String, nullable=False)        # DATA_GAP, ANOMALY, WORKFLOW_BREACH, MISSING_EVIDENCE
    description = Column(Text, nullable=False)
    status = Column(String, default="OPEN")          # OPEN, IN_REVIEW, RESOLVED, WAIVED
    assigned_to = Column(String, nullable=True)
    resolved_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
