import os
import hashlib
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, Query, status
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session, joinedload
from app.core.database import get_db
from app.models.evidence import EvidenceDocument, EvidenceHistory, EvidenceLink
from app.models.user import User
from app.schemas.evidence import (
    EvidenceDocumentResponse, EvidenceVerifyRequest, EvidenceRejectRequest,
    EvidenceLinkRequest, EvidenceLinkResponse
)
from app.api.deps import get_current_user
from app.services.audit_service import AuditService

router = APIRouter(prefix="/evidence", tags=["Evidence & Assurance Vault"])

STORAGE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "..", "storage", "evidence"))
os.makedirs(STORAGE_DIR, exist_ok=True)

@router.post("/upload", response_model=EvidenceDocumentResponse)
async def upload_evidence(
    file: UploadFile = File(...),
    project_id: Optional[str] = Form(None),
    reporting_period_id: Optional[str] = Form(None),
    document_type: str = Form("Invoice"),
    module: str = Form("Energy"),
    related_record: Optional[str] = Form(None),
    notes: Optional[str] = Form(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # 1. Read actual file bytes
    contents = await file.read()
    if not contents:
        raise HTTPException(status_code=400, detail="Cannot upload an empty file")

    # 2. Compute SHA256 directly on actual file bytes (ICAI / SEBI Assurance standard)
    file_sha256 = hashlib.sha256(contents).hexdigest()
    file_size = len(contents)

    # 3. Store file securely
    safe_filename = f"{file_sha256[:16]}_{file.filename}"
    file_path = os.path.join(STORAGE_DIR, safe_filename)
    with open(file_path, "wb") as f:
        f.write(contents)

    # 4. Create EvidenceDocument record
    doc = EvidenceDocument(
        project_id=project_id,
        reporting_period_id=reporting_period_id,
        filename=file.filename,
        file_path=file_path,
        file_size_bytes=file_size,
        mime_type=file.content_type or "application/octet-stream",
        sha256_hash=file_sha256,
        document_type=document_type,
        module=module,
        related_record=related_record,
        uploaded_by=current_user.id,
        uploaded_by_name=current_user.full_name,
        status="Pending",
        is_verified=False,
        version="v1.0"
    )
    db.add(doc)
    db.flush()

    # 5. Create initial history record
    initial_note = notes or f"Uploaded {file.filename} for {module}"
    history_entry = EvidenceHistory(
        document_id=doc.id,
        action="Uploaded",
        actor_name=current_user.full_name,
        actor_role=current_user.role.name if current_user.role else "USER",
        notes=initial_note
    )
    db.add(history_entry)
    db.commit()
    db.refresh(doc)

    # 6. Audit Trail logging
    AuditService.log_event(
        db=db,
        actor_id=current_user.id,
        actor_name=current_user.full_name,
        actor_role=current_user.role.name if current_user.role else "USER",
        action="EVIDENCE_UPLOAD",
        entity_type="EvidenceDocument",
        entity_id=doc.id,
        new_state="Pending",
        details=f"File: {file.filename} | SHA256: {file_sha256} | Size: {file_size} bytes"
    )

    return doc

@router.get("", response_model=List[EvidenceDocumentResponse])
def list_evidence(
    project_id: Optional[str] = Query(None),
    module: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    reporting_period_id: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    query = db.query(EvidenceDocument).options(
        joinedload(EvidenceDocument.history),
        joinedload(EvidenceDocument.links)
    )
    if project_id and project_id != "All":
        query = query.filter(EvidenceDocument.project_id == project_id)
    if module and module != "All":
        query = query.filter(EvidenceDocument.module == module)
    if status and status != "All":
        query = query.filter(EvidenceDocument.status == status)
    if reporting_period_id:
        query = query.filter(EvidenceDocument.reporting_period_id == reporting_period_id)
    if search:
        s = f"%{search}%"
        query = query.filter(
            (EvidenceDocument.filename.ilike(s)) |
            (EvidenceDocument.related_record.ilike(s)) |
            (EvidenceDocument.uploaded_by_name.ilike(s))
        )
    return query.order_by(EvidenceDocument.created_at.desc()).all()

@router.get("/{document_id}", response_model=EvidenceDocumentResponse)
def get_evidence_detail(document_id: str, db: Session = Depends(get_db)):
    doc = db.query(EvidenceDocument).options(
        joinedload(EvidenceDocument.history),
        joinedload(EvidenceDocument.links)
    ).filter(EvidenceDocument.id == document_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Evidence document not found")
    return doc

@router.get("/{document_id}/download")
def download_evidence(document_id: str, db: Session = Depends(get_db)):
    doc = db.query(EvidenceDocument).filter(EvidenceDocument.id == document_id).first()
    if not doc or not os.path.exists(doc.file_path):
        raise HTTPException(status_code=404, detail="Evidence file not found on disk")
    return FileResponse(
        path=doc.file_path,
        filename=doc.filename,
        media_type=doc.mime_type
    )

@router.post("/{document_id}/verify", response_model=EvidenceDocumentResponse)
def verify_evidence(
    document_id: str,
    payload: EvidenceVerifyRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    doc = db.query(EvidenceDocument).filter(EvidenceDocument.id == document_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Evidence document not found")

    old_state = doc.status
    doc.status = "Verified"
    doc.is_verified = True
    doc.verified_by = current_user.full_name
    doc.verification_notes = payload.notes

    history = EvidenceHistory(
        document_id=doc.id,
        action="Verified",
        actor_name=current_user.full_name,
        actor_role=current_user.role.name if current_user.role else "REVIEWER",
        notes=payload.notes
    )
    db.add(history)
    db.commit()
    db.refresh(doc)

    AuditService.log_event(
        db=db,
        actor_id=current_user.id,
        actor_name=current_user.full_name,
        actor_role=current_user.role.name if current_user.role else "REVIEWER",
        action="EVIDENCE_VERIFY",
        entity_type="EvidenceDocument",
        entity_id=doc.id,
        old_state=old_state,
        new_state="Verified",
        comment=payload.notes
    )
    return doc

@router.post("/{document_id}/reject", response_model=EvidenceDocumentResponse)
def reject_evidence(
    document_id: str,
    payload: EvidenceRejectRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    doc = db.query(EvidenceDocument).filter(EvidenceDocument.id == document_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Evidence document not found")

    old_state = doc.status
    doc.status = "Rejected"
    doc.is_verified = False
    doc.verification_notes = payload.reason

    history = EvidenceHistory(
        document_id=doc.id,
        action="Rejected",
        actor_name=current_user.full_name,
        actor_role=current_user.role.name if current_user.role else "REVIEWER",
        notes=payload.reason
    )
    db.add(history)
    db.commit()
    db.refresh(doc)

    AuditService.log_event(
        db=db,
        actor_id=current_user.id,
        actor_name=current_user.full_name,
        actor_role=current_user.role.name if current_user.role else "REVIEWER",
        action="EVIDENCE_REJECT",
        entity_type="EvidenceDocument",
        entity_id=doc.id,
        old_state=old_state,
        new_state="Rejected",
        comment=payload.reason
    )
    return doc

@router.post("/{document_id}/link", response_model=EvidenceLinkResponse)
def link_evidence(
    document_id: str,
    link_data: EvidenceLinkRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    doc = db.query(EvidenceDocument).filter(EvidenceDocument.id == document_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Evidence document not found")

    link = EvidenceLink(
        document_id=doc.id,
        source_record_type=link_data.source_record_type,
        source_record_id=link_data.source_record_id,
        brsr_indicator_id=link_data.brsr_indicator_id,
        link_type=link_data.link_type
    )
    db.add(link)
    db.commit()
    db.refresh(link)
    return link
