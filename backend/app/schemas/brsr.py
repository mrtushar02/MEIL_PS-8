from typing import List, Optional
from pydantic import BaseModel

class BrsrIndicatorResponse(BaseModel):
    indicator_code: str
    indicator_type: str
    principle_number: Optional[int] = None
    question_text: str
    reported_value: str
    unit: Optional[str] = None
    data_source: str
    evidence_status: str
    approval_status: str

class BrsrSectionResponse(BaseModel):
    section_code: str
    title: str
    completion_percentage: float
    indicators: List[BrsrIndicatorResponse] = []

class BrsrReportResponse(BaseModel):
    reporting_period: str
    reporting_entity: str
    cin: str
    turnover_inr_cr: float
    sections: List[BrsrSectionResponse] = []
    brsr_core_readiness_pct: float
    assurance_status: str
