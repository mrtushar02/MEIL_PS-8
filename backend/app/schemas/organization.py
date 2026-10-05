from typing import List, Optional
from pydantic import BaseModel

class ProjectBase(BaseModel):
    name: str
    code: str
    location: Optional[str] = None
    country: Optional[str] = "India"
    project_type: Optional[str] = None
    status: Optional[str] = "Active"
    project_director: Optional[str] = None
    site_esg_officer: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None

class ProjectCreate(ProjectBase):
    subsidiary_id: str
    business_unit_id: str

class ProjectUpdate(BaseModel):
    name: Optional[str] = None
    location: Optional[str] = None
    country: Optional[str] = None
    project_type: Optional[str] = None
    status: Optional[str] = None
    project_director: Optional[str] = None
    site_esg_officer: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None

class ProjectResponse(ProjectBase):
    id: str
    subsidiary_id: str
    business_unit_id: str

    class Config:
        from_attributes = True

class BusinessUnitBase(BaseModel):
    name: str
    code: str
    lead_name: Optional[str] = None

class BusinessUnitCreate(BusinessUnitBase):
    subsidiary_id: str

class BusinessUnitUpdate(BaseModel):
    name: Optional[str] = None
    lead_name: Optional[str] = None

class BusinessUnitResponse(BusinessUnitBase):
    id: str
    subsidiary_id: str
    projects: List[ProjectResponse] = []

    class Config:
        from_attributes = True

class SubsidiaryBase(BaseModel):
    name: str
    code: str
    cin: Optional[str] = None
    sector: Optional[str] = None
    meil_ownership_pct: Optional[float] = 100.0
    turnover_inr_cr: Optional[float] = 0.0
    is_listed: Optional[bool] = False

class SubsidiaryCreate(SubsidiaryBase):
    group_id: str

class SubsidiaryUpdate(BaseModel):
    name: Optional[str] = None
    sector: Optional[str] = None
    meil_ownership_pct: Optional[float] = None
    turnover_inr_cr: Optional[float] = None
    is_listed: Optional[bool] = None

class SubsidiaryResponse(SubsidiaryBase):
    id: str
    group_id: str
    business_units: List[BusinessUnitResponse] = []

    class Config:
        from_attributes = True

class GroupBase(BaseModel):
    name: str
    code: str
    cin: Optional[str] = None
    turnover_inr_cr: Optional[float] = 0.0
    net_worth_inr_cr: Optional[float] = 0.0
    headquarters: Optional[str] = None
    contact_person: Optional[str] = None
    contact_email: Optional[str] = None

class GroupCreate(GroupBase):
    pass

class GroupUpdate(BaseModel):
    name: Optional[str] = None
    turnover_inr_cr: Optional[float] = None
    net_worth_inr_cr: Optional[float] = None
    headquarters: Optional[str] = None
    contact_person: Optional[str] = None
    contact_email: Optional[str] = None

class GroupResponse(GroupBase):
    id: str
    subsidiaries: List[SubsidiaryResponse] = []

    class Config:
        from_attributes = True

class OrganizationTreeResponse(BaseModel):
    group: GroupResponse
    total_subsidiaries: int
    total_business_units: int
    total_projects: int
