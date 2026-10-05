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
