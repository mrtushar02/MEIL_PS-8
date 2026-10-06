import os
import re
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
from app.api.deps import (
    get_current_user, require_permission, require_any_permission,
    get_user_authorized_project_ids, check_project_access
)
from app.services.audit_service import AuditService

router = APIRouter(prefix="/evidence", tags=["Evidence & Assurance Vault"])

STORAGE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "..", "storage", "evidence"))
os.makedirs(STORAGE_DIR, exist_ok=True)

MAX_FILE_SIZE = 50 * 1024 * 1024  # 50 MB (ICAI & SEBI Assurance limit)
ALLOWED_EXTENSIONS = {".pdf", ".png", ".jpg", ".jpeg", ".xlsx", ".xls", ".docx", ".doc", ".csv"}
ALLOWED_MIME_TYPES = {
    "application/pdf",
    "image/png",
    "image/jpeg",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/msword",
    "text/csv",
    "text/plain",
    "application/octet-stream"
}

def sanitize_filename(filename: str) -> str:
    base = os.path.basename(filename)
    # Strip any unsafe path characters, keep alphanumeric, dots, underscores, hyphens
    sanitized = re.sub(r'[^a-zA-Z0-9_.-]', '_', base)
    return sanitized or "evidence_document.dat"

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
    current_user: User = Depends(require_any_permission(
        "esg:evidence_upload", "esg:data_entry", "hr:manage", "ehs:manage",
        "procurement:manage", "csr:manage", "governance:manage"
    ))
):
    # 1. Project scope access validation
    if project_id and not check_project_access(current_user, project_id, db):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to upload evidence for this project"
        )

    # 2. Filename and Extension Validation (Item 46: Safe filename and MIME validation)
    safe_name = sanitize_filename(file.filename or "evidence.pdf")
    ext = os.path.splitext(safe_name)[1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported file type '{ext}'. Allowed extensions: {', '.join(sorted(ALLOWED_EXTENSIONS))}"
        )

    # 3. Read actual file bytes and enforce size limits
    contents = await file.read()
    if not contents:
        raise HTTPException(status_code=400, detail="Cannot upload an empty file")
    
    file_size = len(contents)
    if file_size > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"File exceeds maximum permissible size of {MAX_FILE_SIZE // (1024 * 1024)}MB"
        )

    # 4. Compute SHA256 directly on actual file bytes (ICAI / SEBI Assurance standard)
    file_sha256 = hashlib.sha256(contents).hexdigest()

    # 5. Store file securely
    storage_key = f"{file_sha256[:16]}_{safe_name}"
    file_path = os.path.join(STORAGE_DIR, storage_key)
    with open(file_path, "wb") as f:
        f.write(contents)

    # 6. Create EvidenceDocument record
    doc = EvidenceDocument(
        project_id=project_id,
        reporting_period_id=reporting_period_id,
        filename=safe_name,
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

    # 7. Create initial history record
    initial_note = notes or f"Uploaded {safe_name} for {module}"
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

    # 8. Audit Trail logging
    AuditService.log_event(
        db=db,
        actor_id=current_user.id,
        actor_name=current_user.full_name,
        actor_role=current_user.role.name if current_user.role else "USER",
        action="EVIDENCE_UPLOAD",
        entity_type="EvidenceDocument",
        entity_id=doc.id,
        new_state="Pending",
        details=f"File: {safe_name} | SHA256: {file_sha256} | Size: {file_size} bytes"
    )

    return doc

@router.get("", response_model=List[EvidenceDocumentResponse])
def list_evidence(
    project_id: Optional[str] = Query(None),
    module: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    reporting_period_id: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = db.query(EvidenceDocument).options(
        joinedload(EvidenceDocument.history),
        joinedload(EvidenceDocument.links)
    )

    # Organization scope isolation
    allowed_pids = get_user_authorized_project_ids(db, current_user)
    if allowed_pids is not None:
        query = query.filter(
            (EvidenceDocument.project_id.in_(allowed_pids)) |
            (EvidenceDocument.project_id == None)
        )

    if project_id and project_id != "All":
        if allowed_pids is not None and project_id not in allowed_pids:
            raise HTTPException(status_code=403, detail="Access to evidence for this project is restricted")
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
def get_evidence_detail(
    document_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    doc = db.query(EvidenceDocument).options(
        joinedload(EvidenceDocument.history),
        joinedload(EvidenceDocument.links)
    ).filter(EvidenceDocument.id == document_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Evidence document not found")

    if doc.project_id and not check_project_access(current_user, doc.project_id, db):
        raise HTTPException(status_code=403, detail="Access to evidence for this project is restricted")

    return doc

@router.get("/{document_id}/download")
def download_evidence(
    document_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    doc = db.query(EvidenceDocument).filter(EvidenceDocument.id == document_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Evidence document not found")

    if doc.project_id and not check_project_access(current_user, doc.project_id, db):
        raise HTTPException(status_code=403, detail="Access to evidence for this project is restricted")

    if not os.path.exists(doc.file_path):
        raise HTTPException(status_code=404, detail="Evidence file not found on disk")

    return FileResponse(
        path=doc.file_path,
        filename=doc.filename,
        media_type=doc.mime_type
    )

@router.post("/{document_id}/verify-integrity")
def verify_evidence_integrity(
    document_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Computes actual SHA-256 on byte stream from storage and compares against registered hash.
    (Item 48: byte-level SHA-256 assurance verification)
    """
    doc = db.query(EvidenceDocument).filter(EvidenceDocument.id == document_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Evidence document not found")

    if doc.project_id and not check_project_access(current_user, doc.project_id, db):
        raise HTTPException(status_code=403, detail="Access to evidence for this project is restricted")

    if not os.path.exists(doc.file_path):
        raise HTTPException(status_code=404, detail="Physical evidence file missing from storage vault")

    with open(doc.file_path, "rb") as f:
        file_bytes = f.read()

    actual_hash = hashlib.sha256(file_bytes).hexdigest()
    is_intact = (actual_hash == doc.sha256_hash)

    AuditService.log_event(
        db=db,
        actor_id=current_user.id,
        actor_name=current_user.full_name,
        actor_role=current_user.role.name if current_user.role else "USER",
        action="EVIDENCE_INTEGRITY_CHECK",
        entity_type="EvidenceDocument",
        entity_id=doc.id,
        new_state="INTACT" if is_intact else "CORRUPTED",
        details=f"Stored: {doc.sha256_hash} | Computed: {actual_hash} | Match: {is_intact}"
    )

    return {
        "document_id": doc.id,
        "filename": doc.filename,
        "is_intact": is_intact,
        "stored_hash": doc.sha256_hash,
        "computed_hash": actual_hash,
        "status": "VERIFIED_AUTHENTIC" if is_intact else "INTEGRITY_COMPROMISED"
    }

@router.post("/{document_id}/verify", response_model=EvidenceDocumentResponse)
def verify_evidence(
    document_id: str,
    payload: EvidenceVerifyRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_any_permission(
        "esg:bu_review", "esg:subsidiary_review", "esg:group_lock", "assurance:audit_execute"
    ))
):
    doc = db.query(EvidenceDocument).filter(EvidenceDocument.id == document_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Evidence document not found")

    if doc.project_id and not check_project_access(current_user, doc.project_id, db):
        raise HTTPException(status_code=403, detail="Access to evidence for this project is restricted")

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
    current_user: User = Depends(require_any_permission(
        "esg:bu_review", "esg:subsidiary_review", "esg:group_lock", "assurance:audit_execute"
    ))
):
    doc = db.query(EvidenceDocument).filter(EvidenceDocument.id == document_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Evidence document not found")

    if doc.project_id and not check_project_access(current_user, doc.project_id, db):
        raise HTTPException(status_code=403, detail="Access to evidence for this project is restricted")

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

    if doc.project_id and not check_project_access(current_user, doc.project_id, db):
        raise HTTPException(status_code=403, detail="Access to evidence for this project is restricted")

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
