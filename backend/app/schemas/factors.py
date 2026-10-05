from typing import Optional
from datetime import date, datetime
from pydantic import BaseModel

class FactorSourceResponse(BaseModel):
    id: str
    name: str
    publisher: str
    source_url: Optional[str] = None
    version: str
    reference_date: Optional[date] = None
    methodology: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

class EmissionFactorBase(BaseModel):
    category: str
    activity_type: str
    factor: float
    unit: str
    scope: str
    source: str
    source_version: str
    effective_date: date
    expiry_date: Optional[date] = None
    geography: Optional[str] = "India"
    methodology: Optional[str] = None
    status: Optional[str] = "ACTIVE"

class EmissionFactorCreate(EmissionFactorBase):
    pass

class EmissionFactorResponse(EmissionFactorBase):
    id: str
    created_at: datetime

    class Config:
        from_attributes = True

class UnitResponse(BaseModel):
    id: str
    code: str
    name: str
    dimension: str
    symbol: str
    is_active: bool

    class Config:
        from_attributes = True

class UnitConversionResponse(BaseModel):
    id: str
    from_unit: str
    to_unit: str
    factor: float
    formula_code: Optional[str] = None
    version: str
    source: str
    status: str

    class Config:
        from_attributes = True
