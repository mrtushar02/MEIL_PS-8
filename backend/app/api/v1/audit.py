from typing import List, Optional, Dict, Any
from fastapi import APIRouter, Depends, Query, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.audit import AuditLog
from app.schemas.audit import AuditLogResponse
from app.services.audit_service import AuditService
from app.api.deps import get_current_user
from app.models.user import User

router = APIRouter(prefix="/audit", tags=["Regulatory Audit Trail"])

@router.get("/logs", response_model=List[AuditLogResponse])
def get_audit_logs(
    entity_type: Optional[str] = Query(None),
    entity_id: Optional[str] = Query(None),
    actor_id: Optional[str] = Query(None),
    limit: int = Query(100, le=500),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = db.query(AuditLog)
    if entity_type:
        query = query.filter(AuditLog.entity_type == entity_type)
    if entity_id:
        query = query.filter(AuditLog.entity_id == entity_id)
    if actor_id:
        query = query.filter(AuditLog.actor_id == actor_id)

    return query.order_by(AuditLog.timestamp.desc(), AuditLog.id.desc()).limit(limit).all()

@router.get("/verify-chain")
def verify_audit_hash_chain(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Dict[str, Any]:
    """Cryptographically verify the integrity of the audit log hash chain"""
    return AuditService.verify_audit_chain(db)

@router.get("/entity/{entity_type}/{entity_id}/trace", response_model=List[AuditLogResponse])
def get_entity_audit_trace(
    entity_type: str,
    entity_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Retrieve full chronological audit trail for a specific entity"""
    return db.query(AuditLog).filter(
        AuditLog.entity_type == entity_type,
        AuditLog.entity_id == entity_id
    ).order_by(AuditLog.timestamp.asc()).all()
