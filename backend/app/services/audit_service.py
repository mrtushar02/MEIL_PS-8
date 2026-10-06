import hashlib
import json
import threading
from typing import Dict, Any, List, Optional
from datetime import datetime, timezone
from sqlalchemy.orm import Session
from app.models.audit import AuditLog

_audit_lock = threading.Lock()

class AuditService:
    GENESIS_HASH = "0000000000000000000000000000000000000000000000000000000000000000"

    @staticmethod
    def format_canonical_payload(
        actor_id: str,
        actor_role: str,
        action: str,
        entity_type: str,
        entity_id: str,
        old_state: Optional[str],
        new_state: Optional[str],
        timestamp_iso: str,
        details: Optional[str]
    ) -> str:
        return (
            f"ACTOR:{actor_id}|ROLE:{actor_role}|ACTION:{action}|"
            f"ENTITY:{entity_type}:{entity_id}|OLD:{old_state or ''}|NEW:{new_state or ''}|"
            f"TS:{timestamp_iso}|DETAILS:{details or ''}"
        )

    @staticmethod
    def compute_event_hash(canonical_payload: str, previous_hash: str) -> str:
        combined = (canonical_payload + previous_hash).encode("utf-8")
        return hashlib.sha256(combined).hexdigest()

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
        Thread-safe and concurrency-guarded (Item 56).
        """
        with _audit_lock:
            now = datetime.now(timezone.utc)
            now_iso = now.isoformat()

            # Ensure details is a string (serialize dicts/lists to JSON)
            details_str = json.dumps(details, sort_keys=True) if isinstance(details, (dict, list)) else (str(details) if details is not None else None)

            # 1. Fetch previous event hash
            last_event = db.query(AuditLog).order_by(AuditLog.timestamp.desc(), AuditLog.id.desc()).first()
            prev_hash = last_event.event_hash if (last_event and last_event.event_hash) else AuditService.GENESIS_HASH

            # 2. Construct canonical payload string
            canonical_str = AuditService.format_canonical_payload(
                actor_id=actor_id,
                actor_role=actor_role,
                action=action,
                entity_type=entity_type,
                entity_id=entity_id,
                old_state=old_state,
                new_state=new_state,
                timestamp_iso=now_iso,
                details=details_str
            )

            # 3. Compute tamper-evident hash
            event_hash = AuditService.compute_event_hash(canonical_str, prev_hash)

            entry = AuditLog(
                actor_id=actor_id,
                actor_name=actor_name,
                actor_role=actor_role,
                action=action,
                entity_type=entity_type,
                entity_id=entity_id,
                old_state=old_state,
                new_state=new_state,
                details=details_str,
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
        Cryptographically verify the integrity of the audit log hash chain by recomputing
        each block's event hash from its canonical payload + previous block hash (Item 55).
        Proves: canonical payload -> recomputed hash -> stored hash -> chain linkage.
        """
        logs = db.query(AuditLog).order_by(AuditLog.timestamp.asc(), AuditLog.id.asc()).all()
        if not logs:
            return {"valid": True, "total_records": 0, "status": "EMPTY_CHAIN"}

        expected_prev_hash = AuditService.GENESIS_HASH
        for idx, entry in enumerate(logs):
            # 1. Chain linkage continuity check
            if entry.previous_hash and entry.previous_hash != expected_prev_hash:
                return {
                    "valid": False,
                    "tampered_at_index": idx,
                    "record_id": entry.id,
                    "reason": "PREVIOUS_HASH_MISMATCH",
                    "expected_previous_hash": expected_prev_hash,
                    "actual_previous_hash": entry.previous_hash,
                    "status": "CHAIN_BROKEN"
                }

            ts = entry.timestamp
            if hasattr(ts, "tzinfo") and ts.tzinfo is None:
                ts = ts.replace(tzinfo=timezone.utc)
            ts_str = ts.isoformat() if hasattr(ts, "isoformat") else str(ts)
            canonical_payload = AuditService.format_canonical_payload(
                actor_id=entry.actor_id,
                actor_role=entry.actor_role,
                action=entry.action,
                entity_type=entry.entity_type,
                entity_id=entry.entity_id,
                old_state=entry.old_state,
                new_state=entry.new_state,
                timestamp_iso=ts_str,
                details=entry.details
            )
            recomputed_hash = AuditService.compute_event_hash(canonical_payload, entry.previous_hash or AuditService.GENESIS_HASH)

            if entry.event_hash and entry.event_hash != recomputed_hash:
                return {
                    "valid": False,
                    "tampered_at_index": idx,
                    "record_id": entry.id,
                    "reason": "PAYLOAD_TAMPERED",
                    "stored_hash": entry.event_hash,
                    "recomputed_hash": recomputed_hash,
                    "status": "DATA_INTEGRITY_VIOLATION"
                }

            if entry.event_hash:
                expected_prev_hash = entry.event_hash

        return {
            "valid": True,
            "total_records": len(logs),
            "head_hash": expected_prev_hash,
            "status": "CHAIN_VERIFIED_AUTHENTIC",
            "audit_method": "CANONICAL_PAYLOAD_SHA256_RECOMPUTED"
        }

    @staticmethod
    def export_worm_archival_manifest(db: Session) -> Dict[str, Any]:
        """
        Generate statutory WORM (Write Once Read Many) immutable archival manifest (Item 57).
        """
        verification = AuditService.verify_audit_chain(db)
        logs = db.query(AuditLog).order_by(AuditLog.timestamp.asc()).all()
        return {
            "archival_standard": "SEBI BRSR / ICAI Revised 2024 Assurance Standard",
            "generated_at": datetime.now(timezone.utc).isoformat(),
            "chain_valid": verification["valid"],
            "total_blocks": len(logs),
            "genesis_hash": AuditService.GENESIS_HASH,
            "head_hash": verification.get("head_hash"),
            "audit_blocks": [
                {
                    "id": l.id,
                    "timestamp": l.timestamp.isoformat() if l.timestamp else None,
                    "actor_id": l.actor_id,
                    "actor_role": l.actor_role,
                    "action": l.action,
                    "entity_type": l.entity_type,
                    "entity_id": l.entity_id,
                    "previous_hash": l.previous_hash,
                    "event_hash": l.event_hash
                }
                for l in logs
            ]
        }
