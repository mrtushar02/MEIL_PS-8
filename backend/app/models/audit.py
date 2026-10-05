from sqlalchemy import Column, String, DateTime, Text
from datetime import datetime, timezone
import uuid
from app.core.database import Base

def generate_uuid():
    return str(uuid.uuid4())

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(String, primary_key=True, default=generate_uuid)
    actor_id = Column(String, nullable=False)
    actor_name = Column(String, nullable=False)
    actor_role = Column(String, nullable=False)
    action = Column(String, nullable=False)         # CREATE, SUBMIT, APPROVE, REJECT, LOCK, UNLOCK, EVIDENCE_UPLOAD
    entity_type = Column(String, nullable=False)    # Submission, FuelRecord, Project, etc.
    entity_id = Column(String, nullable=False)
    old_state = Column(String, nullable=True)
    new_state = Column(String, nullable=True)
    details = Column(Text, nullable=True)
    comment = Column(Text, nullable=True)
    ip_address = Column(String, nullable=True)
    scope_type = Column(String, nullable=True)     # GROUP, SUBSIDIARY, BUSINESS_UNIT, PROJECT
    scope_id = Column(String, nullable=True)
    previous_hash = Column(String, nullable=True)   # SHA-256 hash of previous audit record
    event_hash = Column(String, nullable=True, index=True) # SHA-256(canonical_payload + previous_hash)
    timestamp = Column(DateTime, default=lambda: datetime.now(timezone.utc), index=True)

