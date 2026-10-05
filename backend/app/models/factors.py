from sqlalchemy import Column, String, Float, Boolean, DateTime, Date, Text
from datetime import datetime, timezone
import uuid
from app.core.database import Base

def generate_uuid():
    return str(uuid.uuid4())

class FactorSource(Base):
    __tablename__ = "factor_sources"

    id = Column(String, primary_key=True, default=generate_uuid)
    name = Column(String, nullable=False, unique=True) # e.g. "CEA Baseline v19", "IPCC 2006", "GHG Protocol"
    publisher = Column(String, nullable=False)         # e.g. "Central Electricity Authority", "IPCC"
    source_url = Column(String, nullable=True)
    version = Column(String, nullable=False)
    reference_date = Column(Date, nullable=True)
    methodology = Column(Text, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class EmissionFactor(Base):
    __tablename__ = "emission_factors"

    id = Column(String, primary_key=True, default=generate_uuid)
    category = Column(String, nullable=False)        # Stationary Combustion, Purchased Electricity, Transport, etc.
    activity_type = Column(String, nullable=False)   # Diesel, Petrol, Natural Gas, Grid Electricity, etc.
    factor = Column(Float, nullable=False)           # Numeric multiplier e.g. 2.68, 0.716
    unit = Column(String, nullable=False)             # kg CO2e / Litre, kg CO2e / kWh, etc.
    scope = Column(String, nullable=False)            # SCOPE_1, SCOPE_2, SCOPE_3
    source = Column(String, nullable=False)           # CEA Baseline v19, IPCC 2006, GHG Protocol
    source_version = Column(String, nullable=False)   # 2024.1, v19
    effective_date = Column(Date, nullable=False)
    expiry_date = Column(Date, nullable=True)
    geography = Column(String, default="India")
    methodology = Column(String, nullable=True)
    status = Column(String, default="ACTIVE")         # ACTIVE, SUPERSEDED
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class Unit(Base):
    __tablename__ = "units"

    id = Column(String, primary_key=True, default=generate_uuid)
    code = Column(String, nullable=False, unique=True) # e.g. "L", "kWh", "KL", "MT", "GJ"
    name = Column(String, nullable=False)              # e.g. "Litres", "Kilowatt-hour", "Kilolitres", "Metric Tonnes", "Gigajoules"
    dimension = Column(String, nullable=False)         # Volume, Energy, Mass, Time
    symbol = Column(String, nullable=False)            # L, kWh, kL, MT, GJ
    is_active = Column(Boolean, default=True)

class UnitConversion(Base):
    __tablename__ = "unit_conversions"

    id = Column(String, primary_key=True, default=generate_uuid)
    from_unit = Column(String, nullable=False)
    to_unit = Column(String, nullable=False)
    factor = Column(Float, nullable=False)
    formula_code = Column(String, nullable=True)
    version = Column(String, default="v1.0")
    source = Column(String, default="SI / National Standard")
    status = Column(String, default="ACTIVE")
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
