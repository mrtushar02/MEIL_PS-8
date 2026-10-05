from sqlalchemy import Column, String, Integer, Float, Boolean, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
import uuid
from app.core.database import Base

def generate_uuid():
    return str(uuid.uuid4())

class Group(Base):
    __tablename__ = "groups"

    id = Column(String, primary_key=True, default=generate_uuid)
    name = Column(String, nullable=False, unique=True)
    code = Column(String, nullable=False, unique=True)
    cin = Column(String, nullable=True)
    turnover_inr_cr = Column(Float, default=0.0)
    net_worth_inr_cr = Column(Float, default=0.0)
    headquarters = Column(String, nullable=True)
    contact_person = Column(String, nullable=True)
    contact_email = Column(String, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    subsidiaries = relationship("Subsidiary", back_populates="group", cascade="all, delete-orphan")

class Subsidiary(Base):
    __tablename__ = "subsidiaries"

    id = Column(String, primary_key=True, default=generate_uuid)
    group_id = Column(String, ForeignKey("groups.id"), nullable=False)
    name = Column(String, nullable=False)
    code = Column(String, nullable=False, unique=True)
    cin = Column(String, nullable=True)
    sector = Column(String, nullable=True)
    meil_ownership_pct = Column(Float, default=100.0)
    turnover_inr_cr = Column(Float, default=0.0)
    is_listed = Column(Boolean, default=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    group = relationship("Group", back_populates="subsidiaries")
    business_units = relationship("BusinessUnit", back_populates="subsidiary", cascade="all, delete-orphan")
    projects = relationship("Project", back_populates="subsidiary")

class BusinessUnit(Base):
    __tablename__ = "business_units"

    id = Column(String, primary_key=True, default=generate_uuid)
    subsidiary_id = Column(String, ForeignKey("subsidiaries.id"), nullable=False)
    name = Column(String, nullable=False)
    code = Column(String, nullable=False)
    lead_name = Column(String, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    subsidiary = relationship("Subsidiary", back_populates="business_units")
    projects = relationship("Project", back_populates="business_unit", cascade="all, delete-orphan")

class Project(Base):
    __tablename__ = "projects"

    id = Column(String, primary_key=True, default=generate_uuid)
    subsidiary_id = Column(String, ForeignKey("subsidiaries.id"), nullable=False)
    business_unit_id = Column(String, ForeignKey("business_units.id"), nullable=False)
    name = Column(String, nullable=False)
    code = Column(String, nullable=False, unique=True)
    location = Column(String, nullable=True)
    country = Column(String, default="India")
    project_type = Column(String, nullable=True)
    status = Column(String, default="Active")
    project_director = Column(String, nullable=True)
    site_esg_officer = Column(String, nullable=True)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    subsidiary = relationship("Subsidiary", back_populates="projects")
    business_unit = relationship("BusinessUnit", back_populates="projects")
    submissions = relationship("Submission", back_populates="project", cascade="all, delete-orphan")
