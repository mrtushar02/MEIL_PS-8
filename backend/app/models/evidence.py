from sqlalchemy import Column, String, Integer, Boolean, DateTime
from datetime import datetime, timezone
import uuid
from app.core.database import Base

def generate_uuid():
    return str(uuid.uuid4())

class EvidenceDocument(Base):
    __tablename__ = "evidence_documents"

    id = Column(String, primary_key=True, default=generate_uuid)
    project_id = Column(String, nullable=False, index=True)
    reporting_period_id = Column(String, nullable=False, index=True)
    filename = Column(String, nullable=False)
    file_path = Column(String, nullable=False)           # Local path or Supabase Storage URL
    file_size_bytes = Column(Integer, nullable=False)
    mime_type = Column(String, nullable=False)
    sha256_hash = Column(String, nullable=True)          # Cryptographic integrity check
    document_type = Column(String, nullable=False)       # Utility Bill, Fuel Invoice, CPCB Clearance, Calibration Cert, Manifest
    uploaded_by = Column(String, nullable=False)
    is_verified = Column(Boolean, default=False)
    verified_by = Column(String, nullable=True)
    verification_notes = Column(String, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
