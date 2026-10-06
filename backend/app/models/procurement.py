from sqlalchemy import Column, String, Integer, Float, Boolean, DateTime, ForeignKey, Text
from datetime import datetime, timezone
import uuid
from app.core.database import Base

def generate_uuid():
    return str(uuid.uuid4())

class Supplier(Base):
    __tablename__ = "suppliers"

    id = Column(String, primary_key=True, default=generate_uuid)
    vendor_code = Column(String, unique=True, nullable=False, index=True)
    name = Column(String, nullable=False)
    category = Column(String, nullable=False) # Direct Materials, Capital Equipment, Subcontractor, Logistics, Services
    is_msme = Column(Boolean, default=False)
    msme_type = Column(String, nullable=True) # Micro, Small, Medium, Non-MSME
    state = Column(String, nullable=True)
    country = Column(String, default="India")
    annual_spend_inr_cr = Column(Float, default=0.0)
    esg_audit_status = Column(String, default="Not Audited") # Audited, Scheduled, Not Audited
    esg_score = Column(Float, nullable=True)
    iso_14001_certified = Column(Boolean, default=False)
    iso_45001_certified = Column(Boolean, default=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class ProcurementMetric(Base):
    __tablename__ = "procurement_metrics"

    id = Column(String, primary_key=True, default=generate_uuid)
    reporting_period_id = Column(String, ForeignKey("reporting_periods.id"), nullable=False, index=True)
    total_procurement_spend_cr = Column(Float, nullable=False)
    msme_spend_cr = Column(Float, nullable=False)
    msme_spend_pct = Column(Float, nullable=False)
    local_sourcing_pct = Column(Float, nullable=False)
    suppliers_audited_count = Column(Integer, default=0)
    total_active_suppliers = Column(Integer, default=0)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class ProcurementTransaction(Base):
    __tablename__ = "procurement_transactions"

    id = Column(String, primary_key=True, default=generate_uuid)
    transaction_code = Column(String, unique=True, nullable=False, index=True)
    date = Column(String, nullable=False)
    supplier = Column(String, nullable=False)
    category = Column(String, nullable=False)
    project = Column(String, nullable=False)
    amount_cr = Column(Float, nullable=False)
    is_local = Column(Boolean, default=True)
    is_msme = Column(Boolean, default=False)
    source = Column(String, default="ERP")
    status = Column(String, default="Completed") # Completed, Verified, In Review
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class SupplierAssessment(Base):
    __tablename__ = "supplier_assessments"

    id = Column(String, primary_key=True, default=generate_uuid)
    assessment_code = Column(String, unique=True, nullable=False, index=True)
    supplier = Column(String, nullable=False)
    assessment_type = Column(String, nullable=False) # General ESG, Environmental, H&S, Social
    date = Column(String, nullable=False)
    score = Column(Float, nullable=True)
    risk_level = Column(String, default="Low") # Low, Medium, High
    status = Column(String, default="Approved") # Approved, In Review, In Progress
    next_review = Column(String, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class SupplierRisk(Base):
    __tablename__ = "supplier_risks"

    id = Column(String, primary_key=True, default=generate_uuid)
    risk_code = Column(String, unique=True, nullable=False, index=True)
    supplier = Column(String, nullable=False)
    risk_type = Column(String, nullable=False) # Environmental, Labor, Regulatory, Supply
    level = Column(String, default="Medium") # Low, Medium, High
    impact = Column(String, nullable=True)
    mitigation = Column(Text, nullable=True)
    status = Column(String, default="Monitored") # Monitored, Mitigated, Escalated
    owner = Column(String, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class ProcurementAction(Base):
    __tablename__ = "procurement_actions"

    id = Column(String, primary_key=True, default=generate_uuid)
    action_code = Column(String, unique=True, nullable=False, index=True)
    supplier = Column(String, nullable=False)
    issue = Column(Text, nullable=False)
    priority = Column(String, default="Medium") # Low, Medium, High
    status = Column(String, default="Open") # Open, In Progress, Completed
    owner = Column(String, nullable=True)
    due_date = Column(String, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
