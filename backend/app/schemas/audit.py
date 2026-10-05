from datetime import datetime
from typing import Optional
from pydantic import BaseModel

class AuditLogResponse(BaseModel):
    id: str
    actor_id: str
    actor_name: str
    actor_role: str
    action: str
    entity_type: str
    entity_id: str
    old_state: Optional[str] = None
    new_state: Optional[str] = None
    details: Optional[str] = None
    comment: Optional[str] = None
    timestamp: datetime

    class Config:
        from_attributes = True
