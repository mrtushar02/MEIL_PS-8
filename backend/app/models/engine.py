from sqlalchemy import Column, String, Float, Integer, Boolean, DateTime, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
import uuid
from app.core.database import Base

def generate_uuid():
    return str(uuid.uuid4())

# ── CALCULATION ENGINE ──
class CalculationRun(Base):
    __tablename__ = "calculation_runs"

    id = Column(String, primary_key=True, default=generate_uuid)
    submission_id = Column(String, ForeignKey("submissions.id"), nullable=False, index=True)
    engine_version = Column(String, nullable=False, default="CEA-v19.2")
    started_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    completed_at = Column(DateTime, nullable=True)
    status = Column(String, nullable=False, default="COMPLETED") # RUNNING, COMPLETED, FAILED
    created_by = Column(String, nullable=True)

    results = relationship("CalculationResult", back_populates="run", cascade="all, delete-orphan")

class CalculationResult(Base):
    __tablename__ = "calculation_results"

    id = Column(String, primary_key=True, default=generate_uuid)
    calculation_run_id = Column(String, ForeignKey("calculation_runs.id"), nullable=False, index=True)
    source_record_type = Column(String, nullable=False) # FuelRecord, EnergyRecord, WaterRecord, WasteRecord, SafetyRecord
    source_record_id = Column(String, nullable=False, index=True)
    metric_key = Column(String, nullable=False)         # scope1_co2e_tonnes, scope2_co2e_tonnes, energy_gj, ltifr, recycling_pct
    input_value = Column(Float, nullable=False)
    input_unit = Column(String, nullable=False)
    normalized_value = Column(Float, nullable=True)
    normalized_unit = Column(String, nullable=True)
    factor_id = Column(String, nullable=True)
    factor_version = Column(String, nullable=True)
    formula_code = Column(String, nullable=False)       # e.g., "QTY_X_FACTOR_DIV_1000", "INJURIES_X_1M_DIV_HOURS"
    result_value = Column(Float, nullable=False)
    result_unit = Column(String, nullable=False)        # tCO2e, GJ, LTIFR, %
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    run = relationship("CalculationRun", back_populates="results")

# ── VALIDATION ENGINE ──
class ValidationRule(Base):
    __tablename__ = "validation_rules"

    id = Column(String, primary_key=True, default=generate_uuid)
    rule_code = Column(String, nullable=False, unique=True, index=True) # e.g., "VR-ENV-001", "VR-WATER-002"
    name = Column(String, nullable=False)
    domain = Column(String, nullable=False)            # Energy, Fuel, Water, Waste, Safety, Period, Hierarchy
    field_key = Column(String, nullable=True)
    condition_expression = Column(String, nullable=False)
    severity = Column(String, nullable=False, default="ERROR") # ERROR, WARNING, INFO
    blocking = Column(Boolean, default=True)
    message_template = Column(String, nullable=False)
    version = Column(String, default="v1.0")
    status = Column(String, default="ACTIVE")

class ValidationRun(Base):
    __tablename__ = "validation_runs"

    id = Column(String, primary_key=True, default=generate_uuid)
    submission_id = Column(String, ForeignKey("submissions.id"), nullable=False, index=True)
    engine_version = Column(String, nullable=False, default="VE-v1.0")
    started_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    completed_at = Column(DateTime, nullable=True)
    rules_evaluated_count = Column(Integer, nullable=False, default=0)
    errors_count = Column(Integer, nullable=False, default=0)
    warnings_count = Column(Integer, nullable=False, default=0)
    is_valid = Column(Boolean, nullable=False, default=True)
    status = Column(String, nullable=False, default="COMPLETED")

    results = relationship("ValidationResult", back_populates="run", cascade="all, delete-orphan")

class ValidationResult(Base):
    __tablename__ = "validation_results"

    id = Column(String, primary_key=True, default=generate_uuid)
    validation_run_id = Column(String, ForeignKey("validation_runs.id"), nullable=False, index=True)
    rule_code = Column(String, nullable=False)
    severity = Column(String, nullable=False)          # ERROR, WARNING, INFO
    source_record_type = Column(String, nullable=True)
    source_record_id = Column(String, nullable=True)
    field = Column(String, nullable=True)
    message = Column(String, nullable=False)
    blocking = Column(Boolean, default=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    run = relationship("ValidationRun", back_populates="results")
