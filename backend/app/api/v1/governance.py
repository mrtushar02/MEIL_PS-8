from typing import Optional, List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.user import User
from app.models.governance import GovernancePolicy, EthicsGrievance
from app.api.deps import get_current_user

router = APIRouter(prefix="/governance", tags=["Corporate Governance, Ethics & Anti-Corruption"])

@router.get("/policies")
def list_policies(
    category: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> List[Dict[str, Any]]:
    q = db.query(GovernancePolicy)
    if category:
        q = q.filter(GovernancePolicy.category == category)
    policies = q.order_by(GovernancePolicy.policy_code.asc()).all()
    return [
        {
            "id": p.id,
            "policy_code": p.policy_code,
            "title": p.title,
            "category": p.category,
            "board_approved": p.board_approved,
            "approval_date": p.approval_date,
            "weblink": p.weblink,
            "coverage_pct": p.coverage_pct,
            "grievance_redressal_defined": p.grievance_redressal_defined
        }
        for p in policies
    ]

@router.post("/policies", status_code=201)
def create_policy(
    payload: Dict[str, Any],
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Dict[str, Any]:
    existing = db.query(GovernancePolicy).filter(GovernancePolicy.policy_code == payload["policy_code"]).first()
    if existing:
        raise HTTPException(status_code=400, detail=f"Policy {payload['policy_code']} already exists")

    p = GovernancePolicy(
        policy_code=payload["policy_code"],
        title=payload["title"],
        category=payload["category"],
        board_approved=payload.get("board_approved", True),
        approval_date=payload.get("approval_date"),
        weblink=payload.get("weblink"),
        coverage_pct=payload.get("coverage_pct", 100.0),
        grievance_redressal_defined=payload.get("grievance_redressal_defined", True)
    )
    db.add(p)
    db.commit()
    db.refresh(p)
    return {"message": "Policy registered successfully", "id": p.id, "policy_code": p.policy_code}

@router.get("/grievances")
def list_ethics_grievances(
    reporting_period_id: str = Query("period-2025-09"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> List[Dict[str, Any]]:
    grievances = db.query(EthicsGrievance).filter(
        EthicsGrievance.reporting_period_id == reporting_period_id
    ).all()
    return [
        {
            "id": g.id,
            "reporting_period_id": g.reporting_period_id,
            "category": g.category,
            "complaints_received": g.complaints_received,
            "complaints_resolved": g.complaints_resolved,
            "complaints_pending": g.complaints_pending,
            "resolution_pct": g.resolution_pct,
            "remarks": g.remarks
        }
        for g in grievances
    ]
