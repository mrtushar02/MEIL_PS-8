from sqlalchemy import Column, String, Integer, Float, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
import uuid
from app.core.database import Base

def generate_uuid():
    return str(uuid.uuid4())

class CsrProgramCategory(Base):
    __tablename__ = "csr_program_categories"

    id = Column(String, primary_key=True, default=generate_uuid)
    name = Column(String, nullable=False, unique=True)
    description = Column(Text, nullable=True)
    parent_category_id = Column(String, ForeignKey("csr_program_categories.id"), nullable=True)
    status = Column(String, default="Active")
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    parent = relationship("CsrProgramCategory", backref="children", remote_side=[id])
    csr_projects = relationship("CsrProject", back_populates="category")

class CsrProject(Base):
    __tablename__ = "csr_projects"

    id = Column(String, primary_key=True, default=generate_uuid)
    project_code = Column(String, nullable=False, unique=True)
    name = Column(String, nullable=False)
    category_id = Column(String, ForeignKey("csr_program_categories.id"), nullable=True)
    objective = Column(Text, nullable=True)
    description = Column(Text, nullable=True)
    subsidiary_id = Column(String, ForeignKey("subsidiaries.id"), nullable=True)
    business_unit_id = Column(String, ForeignKey("business_units.id"), nullable=True)
    location = Column(String, nullable=True)
    start_date = Column(String, nullable=False)
    end_date = Column(String, nullable=True)
    budget = Column(Float, nullable=True)
    funding_source = Column(String, nullable=True)
    responsible_owner = Column(String, nullable=True)
    partner = Column(String, nullable=True)
    status = Column(String, default="Draft")  # Draft, Planned, Active, On Hold, Completed, Closed, Archived
    reporting_period_id = Column(String, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    category = relationship("CsrProgramCategory", back_populates="csr_projects")
    subsidiary = relationship("Subsidiary")
    business_unit = relationship("BusinessUnit")

class CsrProjectMilestone(Base):
    __tablename__ = "csr_project_milestones"

    id = Column(String, primary_key=True, default=generate_uuid)
    project_id = Column(String, ForeignKey("csr_projects.id"), nullable=False)
    name = Column(String, nullable=False)
    target_date = Column(String, nullable=False)
    achieved_date = Column(String, nullable=True)
    status = Column(String, default="Planned")  # Planned, In Progress, Achieved, Delayed
    description = Column(Text, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class CsrBudgetRecord(Base):
    __tablename__ = "csr_budget_records"

    id = Column(String, primary_key=True, default=generate_uuid)
    project_id = Column(String, ForeignKey("csr_projects.id"), nullable=False)
    period = Column(String, nullable=False)
    approved_budget = Column(Float, nullable=False)
    actual_spend = Column(Float, default=0.0, nullable=False)
    committed = Column(Float, default=0.0, nullable=False)
    variance = Column(Float, default=0.0, nullable=True)
    remaining = Column(Float, default=0.0, nullable=True)
    recorded_at = Column(String, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class CsrSpendRecord(Base):
    __tablename__ = "csr_spend_records"

    id = Column(String, primary_key=True, default=generate_uuid)
    project_id = Column(String, ForeignKey("csr_projects.id"), nullable=False)
    period = Column(String, nullable=False)
    amount = Column(Float, nullable=False)
    description = Column(Text, nullable=True)
    transaction_date = Column(String, nullable=False)
    evidence_ref = Column(String, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class Community(Base):
    __tablename__ = "communities"

    id = Column(String, primary_key=True, default=generate_uuid)
    name = Column(String, nullable=False)
    location = Column(String, nullable=True)
    state = Column(String, nullable=True)
    district = Column(String, nullable=True)
    country = Column(String, default="India")
    project_id = Column(String, ForeignKey("csr_projects.id"), nullable=True)
    status = Column(String, default="Active")
    responsible_person = Column(String, nullable=True)
    target_population = Column(Integer, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    project = relationship("CsrProject")

class CommunityLocation(Base):
    __tablename__ = "community_locations"

    id = Column(String, primary_key=True, default=generate_uuid)
    community_id = Column(String, ForeignKey("communities.id"), nullable=False)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    address = Column(String, nullable=True)
    pin_code = Column(String, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class BeneficiaryGroup(Base):
    __tablename__ = "beneficiary_groups"

    id = Column(String, primary_key=True, default=generate_uuid)
    name = Column(String, nullable=False, unique=True)
    category = Column(String, nullable=True)  # Students, Farmers, Workers, Women, Youth, Local Community, Persons with Disabilities, Other
    description = Column(Text, nullable=True)
    status = Column(String, default="Active")
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class BeneficiaryRecord(Base):
    __tablename__ = "beneficiary_records"

    id = Column(String, primary_key=True, default=generate_uuid)
    project_id = Column(String, ForeignKey("csr_projects.id"), nullable=True)
    community_id = Column(String, ForeignKey("communities.id"), nullable=True)
    beneficiary_group_id = Column(String, ForeignKey("beneficiary_groups.id"), nullable=True)
    category = Column(String, nullable=True)  # For gender-specific tracking
    gender = Column(String, nullable=True)  # Male, Female, Other where permitted
    age_group = Column(String, nullable=True)  # Where permitted
    count = Column(Integer, nullable=False)
    period = Column(String, nullable=False)
    source = Column(String, nullable=True)
    status = Column(String, default="Verified")
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

class SocialImpactIndicator(Base):
    __tablename__ = "social_impact_indicators"

    id = Column(String, primary_key=True, default=generate_uuid)
    name = Column(String, nullable=False, unique=True)
    description = Column(Text, nullable=True)
    unit = Column(String, nullable=True)  # persons, hours, kg, units, count, %
    indicator_type = Column(String, nullable=True)  # output, outcome, impact
    baseline_allowed = Column(Boolean, default=True)
    target_allowed = Column(Boolean, default=True)
    methodology = Column(Text, nullable=True)
    category = Column(String, nullable=True)  # Education, Health, Livelihood, Infrastructure, etc.
    status = Column(String, default="Active")
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class SocialImpactRecord(Base):
    __tablename__ = "social_impact_records"

    id = Column(String, primary_key=True, default=generate_uuid)
    project_id = Column(String, ForeignKey("csr_projects.id"), nullable=False)
    indicator_id = Column(String, ForeignKey("social_impact_indicators.id"), nullable=False)
    baseline = Column(Float, nullable=True)
    target = Column(Float, nullable=True)
    current_value = Column(Float, nullable=True)
    unit = Column(String, nullable=True)
    measurement_date = Column(String, nullable=True)
    reporting_period_id = Column(String, nullable=True)
    methodology = Column(Text, nullable=True)
    source = Column(String, nullable=True)
    evidence_id = Column(String, ForeignKey("evidence_documents.id"), nullable=True)
    status = Column(String, default="Not Started")  # Not Started, Data Collection, Reported, Under Review, Verified, Approved
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

class Stakeholder(Base):
    __tablename__ = "stakeholders"

    id = Column(String, primary_key=True, default=generate_uuid)
    name = Column(String, nullable=False)
    stakeholder_type = Column(String, nullable=True)  # Community, Local Authorities, NGOs, Beneficiary Groups, Employees, Project Partners, Other
    category = Column(String, nullable=True)
    contact_person = Column(String, nullable=True)
    contact_email = Column(String, nullable=True)
    contact_phone = Column(String, nullable=True)
    status = Column(String, default="Active")
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class StakeholderEngagement(Base):
    __tablename__ = "stakeholder_engagements"

    id = Column(String, primary_key=True, default=generate_uuid)
    project_id = Column(String, ForeignKey("csr_projects.id"), nullable=True)
    community_id = Column(String, ForeignKey("communities.id"), nullable=True)
    stakeholder_id = Column(String, ForeignKey("stakeholders.id"), nullable=True)
    stakeholder_type = Column(String, nullable=True)
    stakeholder_group = Column(String, nullable=True)
    date = Column(String, nullable=False)
    purpose = Column(Text, nullable=True)
    topics = Column(Text, nullable=True)
    participants = Column(Integer, nullable=True)
    feedback = Column(Text, nullable=True)
    issues_raised = Column(Text, nullable=True)
    action_required = Column(Text, nullable=True)
    owner = Column(String, nullable=True)
    due_date = Column(String, nullable=True)
    status = Column(String, default="Planned")  # Planned, Held, Feedback Recorded, Action Created, Follow-up, Closed
    evidence_id = Column(String, ForeignKey("evidence_documents.id"), nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

class CommunityGrievance(Base):
    __tablename__ = "community_grievances"

    id = Column(String, primary_key=True, default=generate_uuid)
    grievance_number = Column(String, unique=True, nullable=False)
    project_id = Column(String, ForeignKey("csr_projects.id"), nullable=True)
    community_id = Column(String, ForeignKey("communities.id"), nullable=True)
    date = Column(String, nullable=False)
    category = Column(String, nullable=True)  # Project Impact, Access/Connectivity, Environmental Concern, Employment/Livelihood, Community Services, Construction Impact, Other
    description = Column(Text, nullable=False)
    severity = Column(String, default="Medium")  # Critical, High, Medium, Low
    owner = Column(String, nullable=True)
    due_date = Column(String, nullable=True)
    status = Column(String, default="Received")  # Received, Acknowledged, Under Review, Investigation, Action, Verification, Resolved, Closed
    resolution = Column(Text, nullable=True)
    closed_at = Column(String, nullable=True)
    evidence = Column(String, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

class GrievanceAction(Base):
    __tablename__ = "grievance_actions"

    id = Column(String, primary_key=True, default=generate_uuid)
    grievance_id = Column(String, ForeignKey("community_grievances.id"), nullable=False)
    action = Column(Text, nullable=False)
    owner = Column(String, nullable=True)
    due_date = Column(String, nullable=True)
    status = Column(String, default="Open")  # Open, In Progress, Waiting, Completed, Overdue, Cancelled
    completed_at = Column(String, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class CsrAction(Base):
    __tablename__ = "csr_actions"

    id = Column(String, primary_key=True, default=generate_uuid)
    source_type = Column(String, nullable=True)  # project, community, beneficiary, impact, stakeholder, grievance, submission
    source_id = Column(String, nullable=True)
    project_id = Column(String, ForeignKey("csr_projects.id"), nullable=True)
    description = Column(Text, nullable=False)
    priority = Column(String, default="Medium")  # Critical, High, Medium, Low
    owner = Column(String, nullable=True)
    due_date = Column(String, nullable=True)
    status = Column(String, default="Open")  # Open, In Progress, Waiting, Completed, Overdue, Cancelled
    verification_status = Column(String, default="Pending")
    closed_at = Column(String, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class CsrActivity(Base):
    __tablename__ = "csr_activities"

    id = Column(String, primary_key=True, default=generate_uuid)
    project_id = Column(String, ForeignKey("csr_projects.id"), nullable=True)
    community_id = Column(String, ForeignKey("communities.id"), nullable=True)
    name = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    activity_date = Column(String, nullable=False)
    location = Column(String, nullable=True)
    participants = Column(Integer, nullable=True)
    duration_hours = Column(Float, nullable=True)
    status = Column(String, default="Planned")  # Planned, In Progress, Completed
    evidence_ref = Column(String, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class CsrNotification(Base):
    __tablename__ = "csr_notifications"

    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, nullable=False)
    title = Column(String, nullable=False)
    message = Column(String, nullable=False)
    type = Column(String, nullable=True)  # deadline, evidence_due, grievance_due, submission_correction, submission_approved
    source_type = Column(String, nullable=True)  # csr_project, community, beneficiary, impact, stakeholder, grievance
    source_id = Column(String, nullable=True)
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    read_at = Column(DateTime, nullable=True)