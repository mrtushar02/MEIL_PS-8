from sqlalchemy import Column, String, Integer, Boolean, ForeignKey, DateTime, Date
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
import uuid
from app.core.database import Base

def generate_uuid():
    return str(uuid.uuid4())

class ReportingPeriod(Base):
    __tablename__ = "reporting_periods"

    id = Column(String, primary_key=True, default=generate_uuid)
    name = Column(String, nullable=False, unique=True)  # e.g., "September 2025", "FY 2024-25"
    financial_year = Column(String, nullable=False)     # e.g., "2024-2025"
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=False)
    is_active = Column(Boolean, default=True)
    is_locked = Column(Boolean, default=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    submissions = relationship("Submission", back_populates="reporting_period")

class Submission(Base):
    __tablename__ = "submissions"

    id = Column(String, primary_key=True, default=generate_uuid)
    project_id = Column(String, ForeignKey("projects.id"), nullable=False)
    reporting_period_id = Column(String, ForeignKey("reporting_periods.id"), nullable=False)
    status = Column(String, default="DRAFT")  # DRAFT, SUBMITTED, BU_APPROVED, SUBSIDIARY_APPROVED, GROUP_AUDITED, LOCKED, CORRECTION_REQUESTED
    version = Column(Integer, default=1)
    submitted_by = Column(String, nullable=True)
    submitted_at = Column(DateTime, nullable=True)
    reviewed_by = Column(String, nullable=True)
    reviewed_at = Column(DateTime, nullable=True)
    approved_by = Column(String, nullable=True)
    approved_at = Column(DateTime, nullable=True)
    audited_by = Column(String, nullable=True)
    audited_at = Column(DateTime, nullable=True)
    rejection_reason = Column(String, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    project = relationship("Project", back_populates="submissions")
    reporting_period = relationship("ReportingPeriod", back_populates="submissions")
    fuel_records = relationship("FuelRecord", back_populates="submission", cascade="all, delete-orphan")
    energy_records = relationship("EnergyRecord", back_populates="submission", cascade="all, delete-orphan")
    water_records = relationship("WaterRecord", back_populates="submission", cascade="all, delete-orphan")
    waste_records = relationship("WasteRecord", back_populates="submission", cascade="all, delete-orphan")
    safety_records = relationship("SafetyRecord", back_populates="submission", cascade="all, delete-orphan")

class IssuedReport(Base):
    __tablename__ = "issued_reports"

    id = Column(String, primary_key=True, default=generate_uuid)
    report_title = Column(String, nullable=False)
    report_type = Column(String, nullable=False)  # BRSR_PDF, BRSR_XLSX, AUDIT_CSV, EXECUTIVE_PDF
    reporting_period_id = Column(String, ForeignKey("reporting_periods.id"), nullable=False)
    framework_code = Column(String, default="SEBI_BRSR_2021")
    version = Column(Integer, default=1)
    status = Column(String, default="ISSUED")  # DRAFT, ISSUED, ARCHIVED
    file_path = Column(String, nullable=True)
    file_format = Column(String, nullable=False)  # PDF, XLSX, CSV
    file_size_bytes = Column(Integer, nullable=True)
    sha256_hash = Column(String, nullable=True)  # Immutable byte hash
    snapshot_data_json = Column(String, nullable=True)  # Full locked data snapshot JSON
    issued_by = Column(String, nullable=True)
    issued_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    is_locked = Column(Boolean, default=True)
    metadata_json = Column(String, nullable=True)

    reporting_period = relationship("ReportingPeriod")

