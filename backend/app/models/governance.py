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
