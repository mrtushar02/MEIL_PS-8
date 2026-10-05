from sqlalchemy import Column, String, Integer, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
import uuid
from app.core.database import Base

def generate_uuid():
    return str(uuid.uuid4())

class EvidenceDocument(Base):
    __tablename__ = "evidence_documents"

    id = Column(String, primary_key=True, default=generate_uuid)
    project_id = Column(String, nullable=True, index=True)
    reporting_period_id = Column(String, nullable=True, index=True)
    filename = Column(String, nullable=False)
    file_path = Column(String, nullable=False)           # Local path or Supabase Storage URL
    file_size_bytes = Column(Integer, nullable=False)
    mime_type = Column(String, nullable=False)
    sha256_hash = Column(String, nullable=False)         # Cryptographic integrity check on actual file bytes
    document_type = Column(String, nullable=False)       # Invoice, Meter Reading, Weighbridge Slip, Manifest, Calibration Cert
    module = Column(String, nullable=False, default="Energy")  # Energy, Water, Waste, People, Safety, etc.
    related_record = Column(String, nullable=True)       # e.g., "Fuel Log #4921", "Meter M-012"
    uploaded_by = Column(String, nullable=False)
    uploaded_by_name = Column(String, nullable=True)
    status = Column(String, nullable=False, default="Pending") # Pending, Verified, Rejected
    is_verified = Column(Boolean, default=False)
    verified_by = Column(String, nullable=True)
    verification_notes = Column(String, nullable=True)
    version = Column(String, nullable=False, default="v1.0")
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    links = relationship("EvidenceLink", back_populates="document", cascade="all, delete-orphan")
    history = relationship("EvidenceHistory", back_populates="document", cascade="all, delete-orphan", order_by="EvidenceHistory.created_at.desc()")

class EvidenceLink(Base):
    __tablename__ = "evidence_links"

    id = Column(String, primary_key=True, default=generate_uuid)
    document_id = Column(String, ForeignKey("evidence_documents.id"), nullable=False)
    source_record_type = Column(String, nullable=False)  # FuelRecord, EnergyRecord, WaterRecord, WasteRecord, SafetyRecord
    source_record_id = Column(String, nullable=False)
    brsr_indicator_id = Column(String, nullable=True)
    link_type = Column(String, nullable=True, default="DIRECT_PROOF")
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    document = relationship("EvidenceDocument", back_populates="links")

class EvidenceHistory(Base):
    __tablename__ = "evidence_history"

    id = Column(String, primary_key=True, default=generate_uuid)
    document_id = Column(String, ForeignKey("evidence_documents.id"), nullable=False)
    action = Column(String, nullable=False)              # Uploaded, Verified, Rejected, Replaced, Note Added
    actor_name = Column(String, nullable=False)
    actor_role = Column(String, nullable=True)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    document = relationship("EvidenceDocument", back_populates="history")
