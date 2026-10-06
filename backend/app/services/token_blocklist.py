import time
import hashlib
from typing import Dict, Set, Tuple


# In-memory store for revoked token signatures (Item 66)
_REVOKED_TOKENS: Dict[str, float] = {}

# In-memory store for failed login attempts: email -> (fail_count, first_fail_timestamp, lock_until) (Item 67)
_LOGIN_ATTEMPTS: Dict[str, Dict[str, float]] = {}

MAX_FAILED_ATTEMPTS = 5
LOCKOUT_DURATION_SECONDS = 900  # 15 minutes
ATTEMPT_WINDOW_SECONDS = 900    # 15 minutes

def hash_token(token: str) -> str:
    return hashlib.sha256(token.encode("utf-8")).hexdigest()

def revoke_token(token: str, expires_in_seconds: float = 28800) -> None:
    """Revoke an active JWT token upon logout."""
    now = time.time()
    t_hash = hash_token(token)
    _REVOKED_TOKENS[t_hash] = now + expires_in_seconds
    _clean_expired_tokens()

def is_token_revoked(token: str) -> bool:
    """Check if token signature is in revocation blocklist."""
    t_hash = hash_token(token)
    exp = _REVOKED_TOKENS.get(t_hash)
    if exp is None:
        return False
    if time.time() > exp:
        del _REVOKED_TOKENS[t_hash]
        return False
    return True

def _clean_expired_tokens() -> None:
    now = time.time()
    expired = [k for k, v in _REVOKED_TOKENS.items() if now > v]
    for k in expired:
        del _REVOKED_TOKENS[k]

def check_login_attempts(email: str) -> Tuple[bool, int, float]:
    """
    Check if the user is locked out due to excessive failed login attempts.
    Returns: (is_locked, remaining_attempts, lock_remaining_seconds)
    """
    now = time.time()
    rec = _LOGIN_ATTEMPTS.get(email)
    if not rec:
        return False, MAX_FAILED_ATTEMPTS, 0.0

    lock_until = rec.get("lock_until", 0.0)
    if now < lock_until:
        return True, 0, lock_until - now

    # If attempt window has expired, reset
    if now - rec.get("first_attempt", now) > ATTEMPT_WINDOW_SECONDS:
        _LOGIN_ATTEMPTS.pop(email, None)
        return False, MAX_FAILED_ATTEMPTS, 0.0

    count = int(rec.get("count", 0))
    remaining = max(0, MAX_FAILED_ATTEMPTS - count)
    return False, remaining, 0.0

def record_failed_login(email: str) -> Tuple[bool, int]:
    """
    Record a failed login attempt. If threshold reached, lock out.
    Returns: (is_now_locked, attempts_remaining)
    """
    now = time.time()
    rec = _LOGIN_ATTEMPTS.setdefault(email, {
        "count": 0,
        "first_attempt": now,
        "lock_until": 0.0
    })

    if now - rec["first_attempt"] > ATTEMPT_WINDOW_SECONDS:
        rec["count"] = 1
        rec["first_attempt"] = now
        rec["lock_until"] = 0.0
    else:
        rec["count"] += 1

    if rec["count"] >= MAX_FAILED_ATTEMPTS:
        rec["lock_until"] = now + LOCKOUT_DURATION_SECONDS
        return True, 0

    return False, MAX_FAILED_ATTEMPTS - rec["count"]

def clear_failed_login(email: str) -> None:
    """Clear failed attempts upon successful authentication."""
    _LOGIN_ATTEMPTS.pop(email, None)
