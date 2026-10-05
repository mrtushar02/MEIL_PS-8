from sqlalchemy import Column, String, Integer, Float, Boolean, DateTime, ForeignKey, Text
from datetime import datetime, timezone
import uuid
from app.core.database import Base

def generate_uuid():
    return str(uuid.uuid4())

class WorkforceRecord(Base):
    __tablename__ = "hr_workforce_records"

    id = Column(String, primary_key=True, default=generate_uuid)
    subsidiary_id = Column(String, ForeignKey("subsidiaries.id"), nullable=True)
    subsidiary_name = Column(String, nullable=False)
    category = Column(String, nullable=False)  # Board of Directors, KMP, Senior Management, Technical, Site Workers, Trainees
    male_count = Column(Integer, default=0, nullable=False)
    female_count = Column(Integer, default=0, nullable=False)
    other_count = Column(Integer, default=0)
    total_count = Column(Integer, default=0, nullable=False)
    permanent_count = Column(Integer, default=0)
    contractual_count = Column(Integer, default=0)
    differently_abled_count = Column(Integer, default=0)
    turnover_rate_pct = Column(Float, default=0.0)
    reporting_period = Column(String, default="FY 2026-27")
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class TrainingRecord(Base):
    __tablename__ = "hr_training_records"

    id = Column(String, primary_key=True, default=generate_uuid)
    title = Column(String, nullable=False)
    category = Column(String, nullable=False)  # Health & Safety, Skill Upgradation, POSH & Human Rights, Technical & SOP
    subsidiary_name = Column(String, nullable=False)
    attendees_count = Column(Integer, nullable=False)
    hours = Column(Float, nullable=False)
    trainer = Column(String, nullable=True)
    date_logged = Column(String, nullable=False)
    status = Column(String, default="Verified")  # Verified, Pending, Biometric Logged
    evidence_ref = Column(String, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class WellbeingRecord(Base):
    __tablename__ = "hr_wellbeing_records"

    id = Column(String, primary_key=True, default=generate_uuid)
    subsidiary_name = Column(String, nullable=False)
    health_insurance_pct = Column(Float, default=98.2)
    accident_insurance_pct = Column(Float, default=100.0)
    maternity_retention_pct = Column(Float, default=98.4)
    paternity_takeup_pct = Column(Float, default=100.0)
    annual_medical_screenings = Column(Integer, default=41200)
    creche_compliant = Column(Boolean, default=True)
    reporting_period = Column(String, default="FY 2026-27")
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class PoshGrievanceRecord(Base):
    __tablename__ = "hr_posh_records"

    id = Column(String, primary_key=True, default=generate_uuid)
    reporting_period = Column(String, default="FY 2026-27")
    complaints_filed = Column(Integer, default=4)
    complaints_investigated = Column(Integer, default=4)
    complaints_resolved = Column(Integer, default=4)
    complaints_pending = Column(Integer, default=0)
    wage_parity_ratio = Column(Float, default=1.0)
    statutory_minimum_multiplier = Column(Float, default=1.28)
    child_labour_incidents = Column(Integer, default=0)
    forced_labour_incidents = Column(Integer, default=0)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class HREvidenceRecord(Base):
    __tablename__ = "hr_evidence_records"

    id = Column(String, primary_key=True, default=generate_uuid)
    doc_code = Column(String, nullable=False)
    title = Column(String, nullable=False)
    category = Column(String, nullable=False)  # Social Security, Human Rights, Wages & Parity, Wellbeing
    subsidiary_name = Column(String, nullable=False)
    ref_no = Column(String, nullable=False)
    date_issued = Column(String, nullable=False)
    file_size = Column(String, default="2.4 MB PDF")
    status = Column(String, default="Statutory Verified")
    verifier = Column(String, nullable=False)
    hash_sha256 = Column(String, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class HRSubmissionRecord(Base):
    __tablename__ = "hr_submission_records"

    id = Column(String, primary_key=True, default=generate_uuid)
    sub_code = Column(String, nullable=False)
    title = Column(String, nullable=False)
    authority = Column(String, nullable=False)
    due_date = Column(String, nullable=False)
    submitted_date = Column(String, nullable=False)
    approver = Column(String, nullable=False)
    status = Column(String, default="Verified & Approved")  # Verified & Approved, Acknowledged, Pending Submission, Scheduled, Statutory Closed
    ref_id = Column(String, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
