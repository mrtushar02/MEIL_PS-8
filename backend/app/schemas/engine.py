from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel

# ── Calculation Schemas ──
class CalculationResultResponse(BaseModel):
    id: str
    calculation_run_id: str
    source_record_type: str
    source_record_id: str
    metric_key: str
    input_value: float
    input_unit: str
    normalized_value: Optional[float] = None
    normalized_unit: Optional[str] = None
    factor_id: Optional[str] = None
    factor_version: Optional[str] = None
    formula_code: str
    result_value: float
    result_unit: str
    created_at: datetime

    class Config:
        from_attributes = True

class CalculationRunResponse(BaseModel):
    id: str
    submission_id: str
    engine_version: str
    started_at: datetime
    completed_at: Optional[datetime] = None
    status: str
    created_by: Optional[str] = None
    results: List[CalculationResultResponse] = []

    class Config:
        from_attributes = True

# ── Validation Schemas ──
class ValidationResultResponse(BaseModel):
    id: str
    validation_run_id: str
    rule_code: str
    severity: str
    source_record_type: Optional[str] = None
    source_record_id: Optional[str] = None
    field: Optional[str] = None
    message: str
    blocking: bool
    created_at: datetime

    class Config:
        from_attributes = True

class ValidationRunResponse(BaseModel):
    id: str
    submission_id: str
    engine_version: str
    started_at: datetime
    completed_at: Optional[datetime] = None
    rules_evaluated_count: int
    errors_count: int
    warnings_count: int
    is_valid: bool
    status: str
    results: List[ValidationResultResponse] = []

    class Config:
        from_attributes = True
