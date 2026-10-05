from typing import Optional, Any, Dict
from datetime import datetime
from pydantic import BaseModel

class WorkflowActionInput(BaseModel):
    action: Optional[str] = None  # SUBMIT, BU_APPROVE, SUBSIDIARY_APPROVE, GROUP_LOCK, REQUEST_CORRECTION
    comment: Optional[str] = None


class ApprovalActionResponse(BaseModel):
    id: str
    submission_id: str
    version_number: int
    action: str
    actor_id: str
    actor_name: str
    actor_role: str
    comment: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

class SubmissionVersionResponse(BaseModel):
    id: str
    submission_id: str
    version_number: int
    status: str
    change_reason: Optional[str] = None
    snapshot_json: Optional[Dict[str, Any]] = None
    is_current: bool
    created_by: str
    created_at: datetime

    class Config:
        from_attributes = True

class WorkflowTransitionResponse(BaseModel):
    id: str
    from_status: str
    to_status: str
    required_role: str
    required_permission: Optional[str] = None
    is_active: bool

    class Config:
        from_attributes = True
