from sqlalchemy import Column, String, Float, Integer, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
import uuid
from app.core.database import Base

def generate_uuid():
    return str(uuid.uuid4())

class FuelRecord(Base):
    __tablename__ = "fuel_records"

    id = Column(String, primary_key=True, default=generate_uuid)
    submission_id = Column(String, ForeignKey("submissions.id"), nullable=False)
    project_id = Column(String, ForeignKey("projects.id"), nullable=False)
    reporting_period_id = Column(String, ForeignKey("reporting_periods.id"), nullable=False)
    fuel_type = Column(String, nullable=False)         # Diesel, Petrol, Natural Gas, LPG
    quantity = Column(Float, nullable=False)           # Raw measured quantity
    unit = Column(String, nullable=False)              # Litres, m3, kg
    scope1_co2e_tonnes = Column(Float, nullable=False) # Derived Scope 1 output
    factor_id = Column(String, nullable=False)         # Versioned factor foreign key
    factor_version = Column(String, nullable=False)
    evidence_id = Column(String, nullable=True)        # Linked proof document
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    submission = relationship("Submission", back_populates="fuel_records")

class EnergyRecord(Base):
    __tablename__ = "energy_records"

    id = Column(String, primary_key=True, default=generate_uuid)
    submission_id = Column(String, ForeignKey("submissions.id"), nullable=False)
    project_id = Column(String, ForeignKey("projects.id"), nullable=False)
    reporting_period_id = Column(String, ForeignKey("reporting_periods.id"), nullable=False)
    energy_source = Column(String, nullable=False)     # Grid Electricity, Captive Solar, Captive Wind, Diesel DG
    quantity_kwh = Column(Float, nullable=False)       # Total units consumed
    renewable_kwh = Column(Float, default=0.0)         # Renewable portion
    scope2_co2e_tonnes = Column(Float, nullable=False) # Derived Scope 2 output
    energy_gj = Column(Float, nullable=False)          # Converted to GigaJoules
    factor_id = Column(String, nullable=False)
    factor_version = Column(String, nullable=False)
    evidence_id = Column(String, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    submission = relationship("Submission", back_populates="energy_records")

class WaterRecord(Base):
    __tablename__ = "water_records"

    id = Column(String, primary_key=True, default=generate_uuid)
    submission_id = Column(String, ForeignKey("submissions.id"), nullable=False)
    project_id = Column(String, ForeignKey("projects.id"), nullable=False)
    reporting_period_id = Column(String, ForeignKey("reporting_periods.id"), nullable=False)
    source_type = Column(String, nullable=False)       # Surface Water, Ground Water, Municipal Supply, Tankers
    withdrawal_kl = Column(Float, nullable=False)
    recycled_kl = Column(Float, default=0.0)
    discharged_kl = Column(Float, default=0.0)
    treatment_type = Column(String, nullable=True)     # ETP, STP, RO, Zero Liquid Discharge (ZLD)
    evidence_id = Column(String, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    submission = relationship("Submission", back_populates="water_records")

class WasteRecord(Base):
    __tablename__ = "waste_records"

    id = Column(String, primary_key=True, default=generate_uuid)
    submission_id = Column(String, ForeignKey("submissions.id"), nullable=False)
    project_id = Column(String, ForeignKey("projects.id"), nullable=False)
    reporting_period_id = Column(String, ForeignKey("reporting_periods.id"), nullable=False)
    waste_category = Column(String, nullable=False)    # Hazardous, Non-Hazardous, E-waste, Construction & Demolition, Plastic
    quantity_metric_tonnes = Column(Float, nullable=False)
    disposal_route = Column(String, nullable=False)    # Recycled, Repurposed into Roadbed, Incineration, Landfill
    diverted_from_disposal_pct = Column(Float, default=0.0)
    evidence_id = Column(String, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    submission = relationship("Submission", back_populates="waste_records")

class SafetyRecord(Base):
    __tablename__ = "safety_records"

    id = Column(String, primary_key=True, default=generate_uuid)
    submission_id = Column(String, ForeignKey("submissions.id"), nullable=False)
    project_id = Column(String, ForeignKey("projects.id"), nullable=False)
    reporting_period_id = Column(String, ForeignKey("reporting_periods.id"), nullable=False)
    safe_man_hours = Column(Float, nullable=False)
    lost_time_injuries = Column(Integer, default=0)
    fatalities = Column(Integer, default=0)
    near_misses = Column(Integer, default=0)
    ltifr = Column(Float, default=0.0)                 # (Injuries * 1,000,000) / safe_man_hours
    evidence_id = Column(String, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    submission = relationship("Submission", back_populates="safety_records")
