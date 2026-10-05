from sqlalchemy import Column, String, Integer, Float, Boolean, ForeignKey, DateTime, Text, JSON
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
import uuid
from app.core.database import Base

def generate_uuid():
    return str(uuid.uuid4())

class BrsrFramework(Base):
    __tablename__ = "brsr_frameworks"

    id = Column(String, primary_key=True, default=generate_uuid)
    version_code = Column(String, nullable=False, unique=True)  # e.g., "SEBI_BRSR_2021", "SEBI_BRSR_CORE_2023"
    title = Column(String, nullable=False)
    circular_reference = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    sections = relationship("BrsrSection", back_populates="framework", cascade="all, delete-orphan")
    principles = relationship("BrsrPrinciple", back_populates="framework", cascade="all, delete-orphan")
    answers = relationship("BrsrAnswer", back_populates="framework", cascade="all, delete-orphan")

class BrsrPrinciple(Base):
    __tablename__ = "brsr_principles"

    id = Column(String, primary_key=True, default=generate_uuid)
    framework_id = Column(String, ForeignKey("brsr_frameworks.id"), nullable=False)
    principle_number = Column(Integer, nullable=False) # 1 to 9
    code = Column(String, nullable=False)              # P1, P2, P3, ... P9
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)

    framework = relationship("BrsrFramework", back_populates="principles")

class BrsrSection(Base):
    __tablename__ = "brsr_sections"

    id = Column(String, primary_key=True, default=generate_uuid)
    framework_id = Column(String, ForeignKey("brsr_frameworks.id"), nullable=False)
    section_code = Column(String, nullable=False)  # SECTION_A, SECTION_B, SECTION_C, BRSR_CORE
    title = Column(String, nullable=False)
    description = Column(String, nullable=True)

    framework = relationship("BrsrFramework", back_populates="sections")
    indicators = relationship("BrsrIndicator", back_populates="section", cascade="all, delete-orphan")

class BrsrIndicator(Base):
    __tablename__ = "brsr_indicators"

    id = Column(String, primary_key=True, default=generate_uuid)
    section_id = Column(String, ForeignKey("brsr_sections.id"), nullable=False)
    principle_number = Column(Integer, nullable=True)  # 1 to 9 for Section C
    indicator_code = Column(String, nullable=False, unique=True, index=True) # e.g., "P6_E1", "P3_E4", "CORE_GHG"
    indicator_type = Column(String, nullable=False)    # ESSENTIAL, LEADERSHIP, CORE
    question_text = Column(Text, nullable=False)
    metric_key = Column(String, nullable=True)         # Identifier for automatic computation
    unit = Column(String, nullable=True)
    guidance_notes = Column(Text, nullable=True)
    required = Column(Boolean, default=True)

    section = relationship("BrsrSection", back_populates="indicators")
    mappings = relationship("BrsrMapping", back_populates="indicator", cascade="all, delete-orphan")
    answers = relationship("BrsrAnswer", back_populates="indicator", cascade="all, delete-orphan")

class BrsrMapping(Base):
    __tablename__ = "brsr_mappings"

    id = Column(String, primary_key=True, default=generate_uuid)
    indicator_id = Column(String, ForeignKey("brsr_indicators.id"), nullable=False)
    metric_key = Column(String, nullable=False)
    source_table = Column(String, nullable=False)       # fuel_records, energy_records, water_records, etc.
    aggregation_method = Column(String, nullable=False) # SUM, RATIO, STATIC, CONSOLIDATED
    source_field = Column(String, nullable=True)
    evidence_required = Column(Boolean, default=False)
    formula_code = Column(String, nullable=True)

    indicator = relationship("BrsrIndicator", back_populates="mappings")

class BrsrAnswer(Base):
    __tablename__ = "brsr_answers"

    id = Column(String, primary_key=True, default=generate_uuid)
    framework_id = Column(String, ForeignKey("brsr_frameworks.id"), nullable=False, index=True)
    reporting_period_id = Column(String, ForeignKey("reporting_periods.id"), nullable=False, index=True)
    indicator_id = Column(String, ForeignKey("brsr_indicators.id"), nullable=False, index=True)
    value_numeric = Column(Float, nullable=True)
    value_text = Column(Text, nullable=True)
    value_json = Column(JSON, nullable=True)
    unit = Column(String, nullable=True)
    status = Column(String, default="APPROVED")        # DRAFT, APPROVED, LOCKED, VERIFIED
    generated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    generated_by = Column(String, nullable=True)

    framework = relationship("BrsrFramework", back_populates="answers")
    indicator = relationship("BrsrIndicator", back_populates="answers")
    sources = relationship("BrsrAnswerSource", back_populates="answer", cascade="all, delete-orphan")

class BrsrAnswerSource(Base):
    __tablename__ = "brsr_answer_sources"

    id = Column(String, primary_key=True, default=generate_uuid)
    answer_id = Column(String, ForeignKey("brsr_answers.id"), nullable=False, index=True)
    source_record_type = Column(String, nullable=False) # FuelRecord, EnergyRecord, CalculationResult, etc.
    source_record_id = Column(String, nullable=True, index=True)
    calculation_result_id = Column(String, nullable=True)
    evidence_id = Column(String, nullable=True)
    trace_order = Column(Integer, default=1)

    answer = relationship("BrsrAnswer", back_populates="sources")
