from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session, joinedload
from app.core.database import get_db
from app.models.organization import Group, Subsidiary, BusinessUnit, Project
from app.models.user import User
from app.schemas.organization import (
    OrganizationTreeResponse, GroupResponse, GroupCreate, GroupUpdate,
    SubsidiaryResponse, SubsidiaryCreate, SubsidiaryUpdate,
    BusinessUnitResponse, BusinessUnitCreate, BusinessUnitUpdate,
    ProjectResponse, ProjectCreate, ProjectUpdate
)
from app.api.deps import get_current_user, require_permission
from app.services.audit_service import AuditService

router = APIRouter(prefix="/organization", tags=["Organization Master"])

@router.get("/tree", response_model=OrganizationTreeResponse)
def get_organization_tree(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    group = db.query(Group).options(
        joinedload(Group.subsidiaries)
        .joinedload(Subsidiary.business_units)
        .joinedload(BusinessUnit.projects)
    ).first()

    if not group:
        raise HTTPException(status_code=404, detail="Organization hierarchy not initialized. Run seed script.")

    total_subs = len(group.subsidiaries)
    total_bus = sum(len(sub.business_units) for sub in group.subsidiaries)
    total_projects = sum(
        sum(len(bu.projects) for bu in sub.business_units)
        for sub in group.subsidiaries
    )

    return OrganizationTreeResponse(
        group=group,
        total_subsidiaries=total_subs,
        total_business_units=total_bus,
        total_projects=total_projects
    )

# ── Groups ──
@router.get("/groups", response_model=List[GroupResponse])
def list_groups(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return db.query(Group).all()

@router.post("/groups", response_model=GroupResponse)
def create_group(
    data: GroupCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_permission("esg:group_lock"))
):
    existing = db.query(Group).filter(Group.code == data.code).first()
    if existing:
        raise HTTPException(status_code=400, detail="Group with this code already exists")
    group = Group(**data.model_dump())
    db.add(group)
    db.commit()
    db.refresh(group)

    AuditService.log_event(
        db=db,
        actor_id=current_user.id,
        actor_name=current_user.full_name,
        actor_role=current_user.role.name if current_user.role else "SUPER_ADMIN",
        action="CREATE_GROUP",
        entity_type="Group",
        entity_id=group.id,
        details=f"Created enterprise group {group.name} ({group.code})"
    )

    return group

@router.patch("/groups/{group_id}", response_model=GroupResponse)
def update_group(
    group_id: str,
    data: GroupUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_permission("esg:group_lock"))
):
    group = db.query(Group).filter(Group.id == group_id).first()
    if not group:
        raise HTTPException(status_code=404, detail="Group not found")
    for field, val in data.model_dump(exclude_unset=True).items():
        setattr(group, field, val)
    db.commit()
    db.refresh(group)

    AuditService.log_event(
        db=db,
        actor_id=current_user.id,
        actor_name=current_user.full_name,
        actor_role=current_user.role.name if current_user.role else "SUPER_ADMIN",
        action="UPDATE_GROUP",
        entity_type="Group",
        entity_id=group.id,
        details=f"Updated group {group.code}"
    )

    return group

# ── Subsidiaries ──
@router.get("/subsidiaries", response_model=List[SubsidiaryResponse])
def list_subsidiaries(
    group_id: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = db.query(Subsidiary)
    if group_id:
        query = query.filter(Subsidiary.group_id == group_id)
    return query.all()

@router.post("/subsidiaries", response_model=SubsidiaryResponse)
def create_subsidiary(
    data: SubsidiaryCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_permission("esg:group_lock"))
):
    group = db.query(Group).filter(Group.id == data.group_id).first()
    if not group:
        raise HTTPException(status_code=400, detail="Target Group does not exist")
    existing = db.query(Subsidiary).filter(Subsidiary.code == data.code).first()
    if existing:
        raise HTTPException(status_code=400, detail="Subsidiary with this code already exists")
    sub = Subsidiary(**data.model_dump())
    db.add(sub)
    db.commit()
    db.refresh(sub)

    AuditService.log_event(
        db=db,
        actor_id=current_user.id,
        actor_name=current_user.full_name,
        actor_role=current_user.role.name if current_user.role else "SUPER_ADMIN",
        action="CREATE_SUBSIDIARY",
        entity_type="Subsidiary",
        entity_id=sub.id,
        details=f"Created subsidiary {sub.name} ({sub.code})"
    )

    return sub

@router.patch("/subsidiaries/{sub_id}", response_model=SubsidiaryResponse)
def update_subsidiary(
    sub_id: str,
    data: SubsidiaryUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_permission("esg:group_lock"))
):
    sub = db.query(Subsidiary).filter(Subsidiary.id == sub_id).first()
    if not sub:
        raise HTTPException(status_code=404, detail="Subsidiary not found")
    for field, val in data.model_dump(exclude_unset=True).items():
        setattr(sub, field, val)
    db.commit()
    db.refresh(sub)

    AuditService.log_event(
        db=db,
        actor_id=current_user.id,
        actor_name=current_user.full_name,
        actor_role=current_user.role.name if current_user.role else "SUPER_ADMIN",
        action="UPDATE_SUBSIDIARY",
        entity_type="Subsidiary",
        entity_id=sub.id,
        details=f"Updated subsidiary {sub.code}"
    )

    return sub

# ── Business Units ──
@router.get("/business-units", response_model=List[BusinessUnitResponse])
def list_business_units(
    subsidiary_id: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = db.query(BusinessUnit)
    if subsidiary_id:
        query = query.filter(BusinessUnit.subsidiary_id == subsidiary_id)
    return query.all()

@router.post("/business-units", response_model=BusinessUnitResponse)
def create_business_unit(
    data: BusinessUnitCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_permission("esg:group_lock"))
):
    sub = db.query(Subsidiary).filter(Subsidiary.id == data.subsidiary_id).first()
    if not sub:
        raise HTTPException(status_code=400, detail="Target Subsidiary does not exist")
    existing = db.query(BusinessUnit).filter(
        BusinessUnit.subsidiary_id == data.subsidiary_id,
        BusinessUnit.code == data.code
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Business Unit with this code already exists for this subsidiary")
    bu = BusinessUnit(**data.model_dump())
    db.add(bu)
    db.commit()
    db.refresh(bu)

    AuditService.log_event(
        db=db,
        actor_id=current_user.id,
        actor_name=current_user.full_name,
        actor_role=current_user.role.name if current_user.role else "SUPER_ADMIN",
        action="CREATE_BUSINESS_UNIT",
        entity_type="BusinessUnit",
        entity_id=bu.id,
        details=f"Created business unit {bu.name} ({bu.code})"
    )

    return bu

@router.patch("/business-units/{bu_id}", response_model=BusinessUnitResponse)
def update_business_unit(
    bu_id: str,
    data: BusinessUnitUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_permission("esg:group_lock"))
):
    bu = db.query(BusinessUnit).filter(BusinessUnit.id == bu_id).first()
    if not bu:
        raise HTTPException(status_code=404, detail="Business Unit not found")
    for field, val in data.model_dump(exclude_unset=True).items():
        setattr(bu, field, val)
    db.commit()
    db.refresh(bu)

    AuditService.log_event(
        db=db,
        actor_id=current_user.id,
        actor_name=current_user.full_name,
        actor_role=current_user.role.name if current_user.role else "SUPER_ADMIN",
        action="UPDATE_BUSINESS_UNIT",
        entity_type="BusinessUnit",
        entity_id=bu.id,
        details=f"Updated business unit {bu.code}"
    )

    return bu

# ── Projects ──
@router.get("/projects", response_model=List[ProjectResponse])
def list_projects(
    subsidiary_id: Optional[str] = Query(None),
    business_unit_id: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = db.query(Project)
    if subsidiary_id:
        query = query.filter(Project.subsidiary_id == subsidiary_id)
    if business_unit_id:
        query = query.filter(Project.business_unit_id == business_unit_id)
    if status:
        query = query.filter(Project.status == status)
    return query.all()

@router.get("/projects/{project_id}", response_model=ProjectResponse)
def get_project_detail(
    project_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project

@router.post("/projects", response_model=ProjectResponse)
def create_project(
    data: ProjectCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_permission("esg:group_lock"))
):
    # 1. Check duplicate code
    existing = db.query(Project).filter(Project.code == data.code).first()
    if existing:
        raise HTTPException(status_code=400, detail="Project with this code already exists")
    
    # 2. Strict Parentage Validation: Validate business unit belongs to selected subsidiary
    bu = db.query(BusinessUnit).filter(BusinessUnit.id == data.business_unit_id).first()
    if not bu:
        raise HTTPException(status_code=400, detail="Selected business unit does not exist")
    if bu.subsidiary_id != data.subsidiary_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Parentage validation failed: Business Unit '{bu.name}' does not belong to the selected Subsidiary."
        )

    project = Project(**data.model_dump())
    db.add(project)
    db.commit()
    db.refresh(project)

    AuditService.log_event(
        db=db,
        actor_id=current_user.id,
        actor_name=current_user.full_name,
        actor_role=current_user.role.name if current_user.role else "SUPER_ADMIN",
        action="CREATE_PROJECT",
        entity_type="Project",
        entity_id=project.id,
        details=f"Created site project {project.name} ({project.code})"
    )

    return project

@router.patch("/projects/{project_id}", response_model=ProjectResponse)
def update_project(
    project_id: str,
    data: ProjectUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_permission("esg:group_lock"))
):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    for field, val in data.model_dump(exclude_unset=True).items():
        setattr(project, field, val)
    db.commit()
    db.refresh(project)

    AuditService.log_event(
        db=db,
        actor_id=current_user.id,
        actor_name=current_user.full_name,
        actor_role=current_user.role.name if current_user.role else "SUPER_ADMIN",
        action="UPDATE_PROJECT",
        entity_type="Project",
        entity_id=project.id,
        details=f"Updated site project {project.code}"
    )

    return project
