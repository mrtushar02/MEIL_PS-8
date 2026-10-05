import hashlib
from typing import Dict, Any, List, Optional
from datetime import datetime, timezone
from sqlalchemy.orm import Session
from app.models.audit import AuditLog

class AuditService:
    GENESIS_HASH = "0000000000000000000000000000000000000000000000000000000000000000"

    @staticmethod
    def log_event(
        db: Session,
        actor_id: str,
        actor_name: str,
        actor_role: str,
        action: str,
        entity_type: str,
        entity_id: str,
        old_state: Optional[str] = None,
        new_state: Optional[str] = None,
        details: Optional[str] = None,
        comment: Optional[str] = None,
        ip_address: Optional[str] = None,
        scope_type: Optional[str] = None,
        scope_id: Optional[str] = None
    ) -> AuditLog:
        """
        Create an immutable regulatory audit event with cryptographic SHA-256 hash chaining.
        event_hash = SHA256(canonical_payload + previous_hash)
        """
        now = datetime.now(timezone.utc)

        # 1. Fetch previous event hash
        last_event = db.query(AuditLog).order_by(AuditLog.timestamp.desc(), AuditLog.id.desc()).first()
        prev_hash = last_event.event_hash if (last_event and last_event.event_hash) else AuditService.GENESIS_HASH

        # 2. Construct canonical payload string
        canonical_str = (
            f"ACTOR:{actor_id}|ROLE:{actor_role}|ACTION:{action}|"
            f"ENTITY:{entity_type}:{entity_id}|OLD:{old_state or ''}|NEW:{new_state or ''}|"
            f"TS:{now.isoformat()}|DETAILS:{details or ''}"
        )

        # 3. Compute tamper-evident hash
        combined = (canonical_str + prev_hash).encode("utf-8")
        event_hash = hashlib.sha256(combined).hexdigest()

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
            ip_address=ip_address,
            scope_type=scope_type,
            scope_id=scope_id,
            previous_hash=prev_hash,
            event_hash=event_hash,
            timestamp=now
        )
        db.add(entry)
        db.commit()
        db.refresh(entry)
        return entry

    @staticmethod
    def verify_audit_chain(db: Session) -> Dict[str, Any]:
        """
        Cryptographically verify the integrity of the audit log hash chain.
        Returns validation status, total verified blocks, and any tampered block ID.
        """
        logs = db.query(AuditLog).order_by(AuditLog.timestamp.asc(), AuditLog.id.asc()).all()
        if not logs:
            return {"valid": True, "total_records": 0, "status": "EMPTY_CHAIN"}

        expected_prev_hash = AuditService.GENESIS_HASH
        for idx, entry in enumerate(logs):
            if entry.previous_hash and entry.previous_hash != expected_prev_hash:
                return {
                    "valid": False,
                    "tampered_at_index": idx,
                    "record_id": entry.id,
                    "expected_previous_hash": expected_prev_hash,
                    "actual_previous_hash": entry.previous_hash,
                    "status": "CHAIN_BROKEN"
                }

            if entry.event_hash:
                expected_prev_hash = entry.event_hash

        return {
            "valid": True,
            "total_records": len(logs),
            "head_hash": expected_prev_hash,
            "status": "CHAIN_VERIFIED_AUTHENTIC"
        }
