from typing import Optional, List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session, joinedload
from app.core.database import get_db
from app.models.user import User
from app.models.csr_projects import (
    CsrProgramCategory, CsrProject, CsrSpendRecord,
    BeneficiaryRecord, BeneficiaryGroup, Community
)
from app.api.deps import get_current_user

router = APIRouter(prefix="/csr", tags=["Corporate Social Responsibility (Section 135)"])

@router.get("/overview")
def get_csr_overview(
    reporting_period_id: str = Query("period-2025-09"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Dict[str, Any]:
    projects = db.query(CsrProject).all()
    categories = db.query(CsrProgramCategory).all()
    spend_records = db.query(CsrSpendRecord).filter(CsrSpendRecord.period == reporting_period_id).all()
    beneficiaries = db.query(BeneficiaryRecord).filter(BeneficiaryRecord.period == reporting_period_id).all()

    total_spend_period = sum(s.amount for s in spend_records)
    total_beneficiaries = sum(b.count for b in beneficiaries)

    return {
        "reporting_period_id": reporting_period_id,
        "total_active_projects": len([p for p in projects if p.status == "Active"]),
        "total_categories": len(categories),
        "period_spend_inr_cr": round(total_spend_period, 2),
        "total_beneficiaries_served": total_beneficiaries,
        "section_135_compliance_pct": 100.0
    }

@router.get("/projects")
def list_csr_projects(
    subsidiary_id: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> List[Dict[str, Any]]:
    q = db.query(CsrProject).options(joinedload(CsrProject.category))
    if subsidiary_id:
        q = q.filter(CsrProject.subsidiary_id == subsidiary_id)
    if status:
        q = q.filter(CsrProject.status == status)

    projects = q.all()
    return [
        {
            "id": p.id,
            "project_code": p.project_code,
            "name": p.name,
            "category": p.category.name if p.category else None,
            "objective": p.objective,
            "location": p.location,
            "subsidiary_id": p.subsidiary_id,
            "business_unit_id": p.business_unit_id,
            "budget": p.budget,
            "status": p.status,
            "start_date": p.start_date,
            "end_date": p.end_date
        }
        for p in projects
    ]

@router.post("/projects", status_code=201)
def create_csr_project(
    payload: Dict[str, Any],
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Dict[str, Any]:
    existing = db.query(CsrProject).filter(CsrProject.project_code == payload["project_code"]).first()
    if existing:
        raise HTTPException(status_code=400, detail=f"CSR Project {payload['project_code']} already exists")

    p = CsrProject(
        project_code=payload["project_code"],
        name=payload["name"],
        category_id=payload.get("category_id"),
        objective=payload.get("objective"),
        location=payload.get("location"),
        subsidiary_id=payload.get("subsidiary_id"),
        business_unit_id=payload.get("business_unit_id"),
        budget=payload.get("budget", 0.0),
        status=payload.get("status", "Active"),
        start_date=payload.get("start_date", "2025-04-01"),
        end_date=payload.get("end_date"),
        reporting_period_id=payload.get("reporting_period_id", "period-2025-09")
    )
    db.add(p)
    db.commit()
    db.refresh(p)
    return {"message": "CSR Project created successfully", "id": p.id, "project_code": p.project_code}

@router.get("/spend")
def list_csr_spend(
    reporting_period_id: str = Query("period-2025-09"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> List[Dict[str, Any]]:
    spends = db.query(CsrSpendRecord).filter(
        CsrSpendRecord.period == reporting_period_id
    ).all()
    return [
        {
            "id": s.id,
            "project_id": s.project_id,
            "amount_cr": s.amount,
            "description": s.description,
            "transaction_date": s.transaction_date
        }
        for s in spends
    ]
