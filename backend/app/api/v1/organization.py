from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session, joinedload
from app.core.database import get_db
from app.models.organization import Group, Subsidiary, BusinessUnit, Project
from app.schemas.organization import OrganizationTreeResponse, GroupResponse, ProjectResponse, ProjectCreate

router = APIRouter(prefix="/organization", tags=["Organization Master"])

@router.get("/tree", response_model=OrganizationTreeResponse)
def get_organization_tree(db: Session = Depends(get_db)):
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

@router.get("/projects", response_model=List[ProjectResponse])
def list_projects(
    subsidiary_id: Optional[str] = Query(None),
    business_unit_id: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    db: Session = Depends(get_db)
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
def get_project_detail(project_id: str, db: Session = Depends(get_db)):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project

@router.post("/projects", response_model=ProjectResponse)
def create_project(data: ProjectCreate, db: Session = Depends(get_db)):
    existing = db.query(Project).filter(Project.code == data.code).first()
    if existing:
        raise HTTPException(status_code=400, detail="Project with this code already exists")
    
    project = Project(**data.model_dump())
    db.add(project)
    db.commit()
    db.refresh(project)
    return project
