from sqlalchemy import Column, String, Float, Boolean, DateTime, Date
from datetime import datetime, timezone
import uuid
from app.core.database import Base

def generate_uuid():
    return str(uuid.uuid4())

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
    geography = Column(String, default="India")
    methodology = Column(String, nullable=True)
    status = Column(String, default="ACTIVE")         # ACTIVE, SUPERSEDED
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class UnitConversion(Base):
    __tablename__ = "unit_conversions"

    id = Column(String, primary_key=True, default=generate_uuid)
    from_unit = Column(String, nullable=False)
    to_unit = Column(String, nullable=False)
    factor = Column(Float, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
