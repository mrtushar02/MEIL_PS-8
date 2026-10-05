from sqlalchemy.orm import Session
from app.models.audit import AuditLog

class AuditService:
    @staticmethod
    def log_event(
        db: Session,
        actor_id: str,
        actor_name: str,
        actor_role: str,
        action: str,
        entity_type: str,
        entity_id: str,
        old_state: str = None,
        new_state: str = None,
        details: str = None,
        comment: str = None,
        ip_address: str = None
    ) -> AuditLog:
        """Create an immutable regulatory audit event"""
        entry = AuditLog(
            actor_id=actor_id,
            actor_name=actor_name,
            actor_role=actor_role,
            action=action,
            entity_type=entity_type,
            entity_id=entity_id,
            old_state=old_state,
            new_state=new_state,
            details=details,
            comment=comment,
            ip_address=ip_address
        )
        db.add(entry)
        db.commit()
        db.refresh(entry)
        return entry
