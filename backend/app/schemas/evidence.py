from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel

class EvidenceHistoryResponse(BaseModel):
    id: str
    action: str
    actor_name: str
    actor_role: Optional[str] = None
    notes: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

class EvidenceLinkResponse(BaseModel):
    id: str
    source_record_type: str
    source_record_id: str
    brsr_indicator_id: Optional[str] = None
    link_type: Optional[str] = "DIRECT_PROOF"
    created_at: datetime

    class Config:
        from_attributes = True

class EvidenceDocumentResponse(BaseModel):
    id: str
    project_id: Optional[str] = None
    reporting_period_id: Optional[str] = None
    filename: str
    file_path: str
    file_size_bytes: int
    mime_type: str
    sha256_hash: str
    document_type: str
    module: str
    related_record: Optional[str] = None
    uploaded_by: str
    uploaded_by_name: Optional[str] = None
    status: str
    is_verified: bool
    verified_by: Optional[str] = None
    verification_notes: Optional[str] = None
    version: str
    created_at: datetime
    updated_at: Optional[datetime] = None
    history: List[EvidenceHistoryResponse] = []
    links: List[EvidenceLinkResponse] = []

    class Config:
        from_attributes = True

class EvidenceVerifyRequest(BaseModel):
    notes: Optional[str] = "Verified under ICAI & SEBI BRSR Assurance standard"

class EvidenceRejectRequest(BaseModel):
    reason: str

class EvidenceLinkRequest(BaseModel):
    source_record_type: str
    source_record_id: str
    brsr_indicator_id: Optional[str] = None
    link_type: Optional[str] = "DIRECT_PROOF"
