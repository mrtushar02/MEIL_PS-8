from sqlalchemy import Column, String, Integer, Float, Boolean, DateTime, ForeignKey, Text
from datetime import datetime, timezone
import uuid
from app.core.database import Base

def generate_uuid():
    return str(uuid.uuid4())

class GovernancePolicy(Base):
    __tablename__ = "governance_policies"

    id = Column(String, primary_key=True, default=generate_uuid)
    policy_code = Column(String, unique=True, nullable=False, index=True) # e.g. POL-ETH-01
    title = Column(String, nullable=False)
    category = Column(String, nullable=False) # Ethics & Anti-Corruption, Whistleblower, Human Rights, POSH, Environment, Health & Safety
    board_approved = Column(Boolean, default=True)
    approval_date = Column(String, nullable=True) # e.g. "2024-04-15"
    weblink = Column(String, nullable=True)
    coverage_pct = Column(Float, default=100.0) # 100% of employees/workers
    grievance_redressal_defined = Column(Boolean, default=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class EthicsGrievance(Base):
    __tablename__ = "ethics_grievances"

    id = Column(String, primary_key=True, default=generate_uuid)
    reporting_period_id = Column(String, ForeignKey("reporting_periods.id"), nullable=False, index=True)
    category = Column(String, nullable=False) # Anti-Bribery, Anti-Corruption, Conflict of Interest, Whistleblower, Fair Competition
    complaints_received = Column(Integer, default=0)
    complaints_resolved = Column(Integer, default=0)
    complaints_pending = Column(Integer, default=0)
    resolution_pct = Column(Float, default=100.0)
    remarks = Column(Text, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class ComplianceObligation(Base):
    __tablename__ = "compliance_obligations"

    id = Column(String, primary_key=True, default=generate_uuid)
    obligation_code = Column(String, unique=True, nullable=False, index=True)
    requirement = Column(String, nullable=False)
    category = Column(String, nullable=False) # Legal, ESG, Social, Environmental, Governance
    source = Column(String, nullable=False) # Companies Act, SEBI, Prevention of Corruption Act, DPDP Act
    owner_name = Column(String, nullable=True)
    due_date = Column(String, nullable=False)
    status = Column(String, default="Compliant") # Compliant, In Progress, Overdue, Pending Review
    evidence_status = Column(String, default="Verified") # Verified, In Review, Missing Evidence, Draft
    applicability = Column(String, default="Applicable")
    frequency = Column(String, default="Annual")
    scope = Column(String, default="MEIL Group HQ")
    last_review = Column(String, nullable=True)
    description = Column(Text, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class InternalControl(Base):
    __tablename__ = "internal_controls"

    id = Column(String, primary_key=True, default=generate_uuid)
    control_code = Column(String, unique=True, nullable=False, index=True)
    name = Column(String, nullable=False)
    control_type = Column(String, default="Preventive") # Preventive, Detective, Corrective
    obligation_code = Column(String, nullable=True)
    owner_name = Column(String, nullable=True)
    last_test = Column(String, nullable=True)
    result = Column(String, default="Pass") # Pass, Needs Improvement, Fail
    status = Column(String, default="Active")
    frequency = Column(String, default="Quarterly")
    test_method = Column(String, nullable=True)
    evidence_required = Column(String, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class GovernanceAssessment(Base):
    __tablename__ = "governance_assessments"

    id = Column(String, primary_key=True, default=generate_uuid)
    assessment_code = Column(String, unique=True, nullable=False, index=True)
    title = Column(String, nullable=False)
    assessment_type = Column(String, nullable=False) # Board Evaluation, Anti-Corruption, Internal Audit, ESG Governance
    period = Column(String, nullable=False)
    status = Column(String, default="Completed") # Completed, In Progress, Scheduled
    score = Column(Float, nullable=True)
    coverage = Column(String, default="100% Group Scope")
    findings_count = Column(Integer, default=0)
    next_review = Column(String, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class GovernanceAction(Base):
    __tablename__ = "governance_actions"

    id = Column(String, primary_key=True, default=generate_uuid)
    action_code = Column(String, unique=True, nullable=False, index=True)
    issue = Column(Text, nullable=False)
    source = Column(String, nullable=True) # Audit, Assessment, Grievance
    priority = Column(String, default="Medium")
    owner_name = Column(String, nullable=True)
    due_date = Column(String, nullable=True)
    status = Column(String, default="Open") # Open, In Progress, Completed
    verification = Column(String, default="Pending") # Pending, Verified
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class CorporateDisclosure(Base):
    __tablename__ = "corporate_disclosures"

    id = Column(String, primary_key=True, default=generate_uuid)
    disclosure_code = Column(String, unique=True, nullable=False, index=True)
    disclosure_type = Column(String, nullable=False) # BRSR Core, Board Report, MCA Return
    framework = Column(String, default="SEBI BRSR 2021")
    section = Column(String, default="Section A")
    status = Column(String, default="Approved")
    approval_status = Column(String, default="Board Approved")
    scope = Column(String, default="Consolidated Group")
    last_updated = Column(String, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
