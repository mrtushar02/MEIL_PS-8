from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

# ── Program Categories ──────────────────────────────────────────────
class CsrProgramCategoryBase(BaseModel):
    name: str
    description: Optional[str] = None

class CsrProgramCategoryCreate(CsrProgramCategoryBase):
    pass

class CsrProgramCategoryResponse(CsrProgramCategoryBase):
    id: str
    status: str
    created_at: datetime

    class Config:
        from_attributes = True

# ── CSR Projects ────────────────────────────────────────────────────
class CsrProjectBase(BaseModel):
    project_code: str
    name: str
    category_id: Optional[str] = None
    objective: Optional[str] = None
    description: Optional[str] = None
    subsidiary_id: Optional[str] = None
    business_unit_id: Optional[str] = None
    location: Optional[str] = None
    start_date: str
    end_date: Optional[str] = None
    budget: Optional[float] = None
    funding_source: Optional[str] = None
    responsible_owner: Optional[str] = None
    partner: Optional[str] = None
    status: Optional[str] = "Draft"
    reporting_period_id: Optional[str] = None

class CsrProjectCreate(CsrProjectBase):
    pass

class CsrProjectUpdate(BaseModel):
    project_code: Optional[str] = None
    name: Optional[str] = None
    category_id: Optional[str] = None
    objective: Optional[str] = None
    description: Optional[str] = None
    subsidiary_id: Optional[str] = None
    business_unit_id: Optional[str] = None
    location: Optional[str] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    budget: Optional[float] = None
    funding_source: Optional[str] = None
    responsible_owner: Optional[str] = None
    partner: Optional[str] = None
    status: Optional[str] = None
    reporting_period_id: Optional[str] = None

class CsrProjectResponse(CsrProjectBase):
    id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# ── CSR Project Milestones ──────────────────────────────────────────
class CsrProjectMilestoneBase(BaseModel):
    name: str
    target_date: str
    description: Optional[str] = None
    status: Optional[str] = "Planned"

class CsrProjectMilestoneCreate(CsrProjectMilestoneBase):
    pass

class CsrProjectMilestoneResponse(CsrProjectMilestoneBase):
    id: str
    achieved_date: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

# ── Budget Records ──────────────────────────────────────────────────
class CsrBudgetRecordBase(BaseModel):
    period: str
    approved_budget: float
    actual_spend: float = 0.0
    committed: float = 0.0
    variance: Optional[float] = None
    remaining: Optional[float] = None
    recorded_at: str

class CsrBudgetRecordCreate(CsrBudgetRecordBase):
    pass

class CsrBudgetRecordResponse(CsrBudgetRecordBase):
    id: str
    created_at: datetime

    class Config:
        from_attributes = True

# ── Spend Records ───────────────────────────────────────────────────
class CsrSpendRecordBase(BaseModel):
    period: str
    amount: float
    description: Optional[str] = None
    transaction_date: str
    evidence_ref: Optional[str] = None

class CsrSpendRecordCreate(CsrSpendRecordBase):
    pass

class CsrSpendRecordResponse(CsrSpendRecordBase):
    id: str
    created_at: datetime

    class Config:
        from_attributes = True

# ── Communities ─────────────────────────────────────────────────────
class CommunityBase(BaseModel):
    name: str
    location: Optional[str] = None
    state: Optional[str] = None
    district: Optional[str] = None
    country: Optional[str] = "India"
    project_id: Optional[str] = None
    status: Optional[str] = "Active"
    responsible_person: Optional[str] = None
    target_population: Optional[int] = None

class CommunityCreate(CommunityBase):
    pass

class CommunityResponse(CommunityBase):
    id: str
    status: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# ── Community Locations ─────────────────────────────────────────────
class CommunityLocationBase(BaseModel):
    community_id: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    address: Optional[str] = None
    pin_code: Optional[str] = None

class CommunityLocationCreate(CommunityLocationBase):
    pass

class CommunityLocationResponse(CommunityLocationBase):
    id: str
    created_at: datetime

    class Config:
        from_attributes = True

# ── Beneficiary Groups ──────────────────────────────────────────────
class BeneficiaryGroupBase(BaseModel):
    name: str
    category: Optional[str] = None
    description: Optional[str] = None

class BeneficiaryGroupCreate(BeneficiaryGroupBase):
    pass

class BeneficiaryGroupResponse(BeneficiaryGroupBase):
    id: str
    status: str
    created_at: datetime

    class Config:
        from_attributes = True

# ── Beneficiary Records ─────────────────────────────────────────────
class BeneficiaryRecordBase(BaseModel):
    project_id: Optional[str] = None
    community_id: Optional[str] = None
    beneficiary_group_id: Optional[str] = None
    category: Optional[str] = None
    gender: Optional[str] = None
    age_group: Optional[str] = None
    count: int
    period: str
    source: Optional[str] = None
    status: Optional[str] = "Verified"

class BeneficiaryRecordCreate(BeneficiaryRecordBase):
    pass

class BeneficiaryRecordResponse(BeneficiaryRecordBase):
    id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# ── Social Impact Indicators ────────────────────────────────────────
class SocialImpactIndicatorBase(BaseModel):
    name: str
    description: Optional[str] = None
    unit: Optional[str] = None
    indicator_type: Optional[str] = None  # output, outcome, impact
    baseline_allowed: bool = True
    target_allowed: bool = True
    methodology: Optional[str] = None
    category: Optional[str] = None  # Education, Health, Livelihood, Infrastructure, etc.

class SocialImpactIndicatorCreate(SocialImpactIndicatorBase):
    pass

class SocialImpactIndicatorResponse(SocialImpactIndicatorBase):
    id: str
    status: str
    created_at: datetime

    class Config:
        from_attributes = True

# ── Social Impact Records ───────────────────────────────────────────
class SocialImpactRecordBase(BaseModel):
    project_id: str
    indicator_id: str
    baseline: Optional[float] = None
    target: Optional[float] = None
    current_value: Optional[float] = None
    unit: Optional[str] = None
    measurement_date: Optional[str] = None
    reporting_period_id: Optional[str] = None
    methodology: Optional[str] = None
    source: Optional[str] = None
    evidence_id: Optional[str] = None
    status: Optional[str] = "Not Started"

class SocialImpactRecordCreate(SocialImpactRecordBase):
    pass

class SocialImpactRecordResponse(SocialImpactRecordBase):
    id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# ── Stakeholders ────────────────────────────────────────────────────
class StakeholderBase(BaseModel):
    name: str
    stakeholder_type: Optional[str] = None  # Community, Local Authorities, NGOs, Beneficiary Groups, Employees, Project Partners, Other
    category: Optional[str] = None
    contact_person: Optional[str] = None
    contact_email: Optional[str] = None
    contact_phone: Optional[str] = None

class StakeholderCreate(StakeholderBase):
    pass

class StakeholderResponse(StakeholderBase):
    id: str
    status: str
    created_at: datetime

    class Config:
        from_attributes = True

# ── Stakeholder Engagements ─────────────────────────────────────────
class StakeholderEngagementBase(BaseModel):
    project_id: Optional[str] = None
    community_id: Optional[str] = None
    stakeholder_id: Optional[str] = None
    stakeholder_type: Optional[str] = None
    stakeholder_group: Optional[str] = None
    date: str
    purpose: Optional[str] = None
    topics: Optional[str] = None
    participants: Optional[int] = None
    feedback: Optional[str] = None
    issues_raised: Optional[str] = None
    action_required: Optional[str] = None
    owner: Optional[str] = None
    due_date: Optional[str] = None
    status: Optional[str] = "Planned"

class StakeholderEngagementCreate(StakeholderEngagementBase):
    pass

class StakeholderEngagementResponse(StakeholderEngagementBase):
    id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# ── Community Grievances ────────────────────────────────────────────
class CommunityGrievanceBase(BaseModel):
    grievance_number: str
    project_id: Optional[str] = None
    community_id: Optional[str] = None
    date: str
    category: Optional[str] = None  # Project Impact, Access/Connectivity, Environmental Concern, Employment/Livelihood, Community Services, Construction Impact, Other
    description: str
    severity: Optional[str] = "Medium"
    owner: Optional[str] = None
    due_date: Optional[str] = None

class CommunityGrievanceCreate(CommunityGrievanceBase):
    pass

class CommunityGrievanceResponse(CommunityGrievanceBase):
    id: str
    status: str
    resolution: Optional[str] = None
    closed_at: Optional[str] = None

    class Config:
        from_attributes = True

# ── Grievance Actions ───────────────────────────────────────────────
class GrievanceActionBase(BaseModel):
    grievance_id: str
    action: str
    owner: Optional[str] = None
    due_date: Optional[str] = None

class GrievanceActionCreate(GrievanceActionBase):
    pass

class GrievanceActionResponse(GrievanceActionBase):
    id: str
    status: str
    completed_at: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

# ── CSR Actions ─────────────────────────────────────────────────────
class CsrActionBase(BaseModel):
    source_type: Optional[str] = None  # project, community, beneficiary, impact, stakeholder, grievance, submission
    source_id: Optional[str] = None
    project_id: Optional[str] = None
    description: str
    priority: Optional[str] = "Medium"  # Critical, High, Medium, Low
    owner: Optional[str] = None
    due_date: Optional[str] = None

class CsrActionCreate(CsrActionBase):
    pass

class CsrActionResponse(CsrActionBase):
    id: str
    status: str
    verification_status: str
    closed_at: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

# ── Evidence Documents ──────────────────────────────────────────────
class EvidenceDocumentBase(BaseModel):
    project_id: Optional[str] = None
    reporting_period_id: Optional[str] = None
    filename: str
    file_path: str
    file_size_bytes: int
    mime_type: str
    document_type: str
    uploaded_by: str
    is_verified: Optional[bool] = False
    verified_by: Optional[str] = None
    verification_notes: Optional[str] = None

class EvidenceDocumentCreate(EvidenceDocumentBase):
    pass

class EvidenceDocumentResponse(EvidenceDocumentBase):
    id: str
    status: str
    created_at: datetime

    class Config:
        from_attributes = True

# ── Evidence Links ──────────────────────────────────────────────────
class EvidenceLinkBase(BaseModel):
    evidence_id: str
    source_type: str
    source_id: str

class EvidenceLinkCreate(EvidenceLinkBase):
    pass

class EvidenceLinkResponse(EvidenceLinkBase):
    id: str
    created_at: datetime

    class Config:
        from_attributes = True

# ── Evidence Versions ───────────────────────────────────────────────
class EvidenceVersionBase(BaseModel):
    evidence_id: str
    version_number: int
    filename: str
    file_path: str
    sha256_hash: Optional[str] = None
    uploaded_by: Optional[str] = None
    reason: Optional[str] = None

class EvidenceVersionCreate(EvidenceVersionBase):
    pass

class EvidenceVersionResponse(EvidenceVersionBase):
    id: str
    status: str
    created_at: datetime

    class Config:
        from_attributes = True

# ── Submissions ─────────────────────────────────────────────────────
class SubmissionBase(BaseModel):
    project_id: Optional[str] = None
    reporting_period_id: Optional[str] = None
    status: Optional[str] = "Draft"
    submitted_by: Optional[str] = None
    submitted_at: Optional[datetime] = None
    reviewed_by: Optional[str] = None
    reviewed_at: Optional[datetime] = None
    approved_by: Optional[str] = None
    approved_at: Optional[datetime] = None
    correction_count: int = 0

class SubmissionCreate(SubmissionBase):
    pass

class SubmissionResponse(SubmissionBase):
    id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# ── Submission Items ────────────────────────────────────────────────
class SubmissionItemBase(BaseModel):
    submission_id: str
    module: str  # CSR Project, Community, Beneficiaries, Social Impact, Stakeholder Engagement, Grievances
    scope: Optional[str] = None
    project_id: Optional[str] = None
    data: Optional[str] = None  # JSON
    evidence_count: int = 0
    status: Optional[str] = "Validated"

class SubmissionItemCreate(SubmissionItemBase):
    pass

class SubmissionItemResponse(SubmissionItemBase):
    id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# ── Submission Reviews ──────────────────────────────────────────────
class SubmissionReviewBase(BaseModel):
    submission_id: str
    reviewer: Optional[str] = None
    reviewed_at: Optional[datetime] = None
    status: Optional[str] = "Under Review"
    comments: Optional[str] = None
    required_actions: Optional[str] = None

class SubmissionReviewCreate(SubmissionReviewBase):
    pass

class SubmissionReviewResponse(SubmissionReviewBase):
    id: str
    created_at: datetime

    class Config:
        from_attributes = True

# ── Submission Comments ─────────────────────────────────────────────
class SubmissionCommentBase(BaseModel):
    submission_id: str
    author: Optional[str] = None
    author_role: Optional[str] = None
    comment: str

class SubmissionCommentCreate(SubmissionCommentBase):
    pass

class SubmissionCommentResponse(SubmissionCommentBase):
    id: str
    created_at: datetime

    class Config:
        from_attributes = True

# ── Submission Status History ───────────────────────────────────────
class SubmissionStatusHistoryBase(BaseModel):
    submission_id: str
    from_status: Optional[str] = None
    to_status: str
    changed_by: Optional[str] = None
    comment: Optional[str] = None

class SubmissionStatusHistoryCreate(SubmissionStatusHistoryBase):
    pass

class SubmissionStatusHistoryResponse(SubmissionStatusHistoryBase):
    id: str
    created_at: datetime

    class Config:
        from_attributes = True

# ── Activities ──────────────────────────────────────────────────────
class ActivityBase(BaseModel):
    project_id: Optional[str] = None
    community_id: Optional[str] = None
    name: str
    description: Optional[str] = None
    activity_date: str
    location: Optional[str] = None
    participants: Optional[int] = None
    duration_hours: Optional[float] = None
    status: Optional[str] = "Planned"

class ActivityCreate(ActivityBase):
    pass

class ActivityResponse(ActivityBase):
    id: str
    created_at: datetime

    class Config:
        from_attributes = True

# ── Notifications ───────────────────────────────────────────────────
class NotificationBase(BaseModel):
    user_id: str
    title: str
    message: str
    type: Optional[str] = None
    source_type: Optional[str] = None
    source_id: Optional[str] = None
    is_read: bool = False

class NotificationCreate(NotificationBase):
    pass

class NotificationResponse(NotificationBase):
    id: str
    created_at: datetime
    is_read: bool

    class Config:
        from_attributes = True

# ── Audit Log ───────────────────────────────────────────────────────
class AuditLogBase(BaseModel):
    actor_id: Optional[str] = None
    actor_name: Optional[str] = None
    actor_role: Optional[str] = None
    action: str
    entity_type: str
    entity_id: Optional[str] = None
    old_state: Optional[str] = None
    new_state: Optional[str] = None
    details: Optional[str] = None
    comment: Optional[str] = None
    ip_address: Optional[str] = None

class AuditLogCreate(AuditLogBase):
    pass

class AuditLogResponse(AuditLogBase):
    id: str
    timestamp: datetime

    class Config:
        from_attributes = True