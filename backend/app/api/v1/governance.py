from typing import Optional, List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.user import User
from app.models.governance import (
    GovernancePolicy, EthicsGrievance, ComplianceObligation,
    InternalControl, GovernanceAssessment, GovernanceAction, CorporateDisclosure
)
from app.api.deps import get_current_user, require_permission
from app.services.audit_service import AuditService

router = APIRouter(prefix="/governance", tags=["Corporate Governance, Ethics & Anti-Corruption"])

# 1. Policies
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
            "code": p.policy_code,
            "policy_code": p.policy_code,
            "name": p.title,
            "title": p.title,
            "category": p.category,
            "board_approved": p.board_approved,
            "approval_date": p.approval_date,
            "effectiveDate": p.approval_date or "01 Jan 2024",
            "reviewDate": "01 Jan 2027",
            "version": "v2.0",
            "status": "Active",
            "approvalStatus": "Approved" if p.board_approved else "Pending Review",
            "weblink": p.weblink,
            "coverage_pct": p.coverage_pct,
            "evidenceCount": 4,
            "scope": "Group Level & Subsidiaries",
            "description": f"Mandatory Board-approved governance framework for {p.category}",
            "grievance_redressal_defined": p.grievance_redressal_defined
        }
        for p in policies
    ]

@router.post("/policies", status_code=201)
def create_policy(
    payload: Dict[str, Any],
    db: Session = Depends(get_db),
    current_user: User = Depends(require_permission("governance:manage"))
) -> Dict[str, Any]:
    code = payload.get("policy_code") or payload.get("code") or f"POL-{len(db.query(GovernancePolicy).all())+1:03d}"
    existing = db.query(GovernancePolicy).filter(GovernancePolicy.policy_code == code).first()
    if existing:
        raise HTTPException(status_code=400, detail=f"Policy {code} already exists")

    p = GovernancePolicy(
        policy_code=code,
        title=payload.get("title") or payload.get("name", "New Policy"),
        category=payload.get("category", "Ethics & Anti-Corruption"),
        board_approved=payload.get("board_approved", True),
        approval_date=payload.get("approval_date") or payload.get("effectiveDate", "2024-04-15"),
        weblink=payload.get("weblink", "https://meil.in/governance/policy.pdf"),
        coverage_pct=float(payload.get("coverage_pct", 100.0)),
        grievance_redressal_defined=payload.get("grievance_redressal_defined", True)
    )
    db.add(p)
    db.commit()
    db.refresh(p)

    AuditService.log_event(
        db=db,
        actor_id=current_user.id,
        actor_name=current_user.full_name,
        actor_role=current_user.role.name if current_user.role else "COMPLIANCE_OFFICER",
        action="CREATE_GOVERNANCE_POLICY",
        entity_type="GovernancePolicy",
        entity_id=p.id,
        details=f"Registered policy {p.policy_code}: {p.title}"
    )

    return {"message": "Policy registered successfully", "id": p.id, "policy_code": p.policy_code}

# 2. Obligations
@router.get("/obligations")
def list_obligations(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> List[Dict[str, Any]]:
    obs = db.query(ComplianceObligation).order_by(ComplianceObligation.created_at.desc()).all()
    return [
        {
            "id": o.obligation_code,
            "code": o.obligation_code,
            "requirement": o.requirement,
            "category": o.category,
            "source": o.source,
            "ownerName": o.owner_name or "Adv. S. K. Nair",
            "owner": "Legal",
            "dueDate": o.due_date,
            "status": o.status,
            "evidence": o.evidence_status,
            "applicability": o.applicability,
            "frequency": o.frequency,
            "scope": o.scope,
            "lastReview": o.last_review,
            "description": o.description
        }
        for o in obs
    ]

@router.post("/obligations", status_code=201)
def create_obligation(
    payload: Dict[str, Any],
    db: Session = Depends(get_db),
    current_user: User = Depends(require_permission("governance:manage"))
) -> Dict[str, Any]:
    count = db.query(ComplianceObligation).count()
    code = payload.get("id") or payload.get("code") or f"CO-{count+1:03d}"
    ob = ComplianceObligation(
        obligation_code=code,
        requirement=payload["requirement"],
        category=payload.get("category", "Legal"),
        source=payload.get("source", "Companies Act"),
        owner_name=payload.get("ownerName", "Adv. S. K. Nair"),
        due_date=payload.get("dueDate", "31 Dec 2026"),
        status=payload.get("status", "Compliant"),
        evidence_status=payload.get("evidence", "Verified"),
        applicability=payload.get("applicability", "Applicable"),
        frequency=payload.get("frequency", "Annual"),
        scope=payload.get("scope", "MEIL Group HQ"),
        last_review=payload.get("lastReview", "18 Sep 2026"),
        description=payload.get("description", "Statutory compliance obligation")
    )
    db.add(ob)
    db.commit()
    db.refresh(ob)

    AuditService.log_event(
        db=db,
        actor_id=current_user.id,
        actor_name=current_user.full_name,
        actor_role=current_user.role.name if current_user.role else "COMPLIANCE_OFFICER",
        action="CREATE_COMPLIANCE_OBLIGATION",
        entity_type="ComplianceObligation",
        entity_id=ob.id,
        details=f"Registered obligation {ob.obligation_code}: {ob.requirement}"
    )

    return {"message": "Compliance obligation added successfully", "id": ob.obligation_code}

# 3. Controls
@router.get("/controls")
def list_controls(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> List[Dict[str, Any]]:
    ctrs = db.query(InternalControl).all()
    return [
        {
            "id": c.control_code,
            "code": c.control_code,
            "name": c.name,
            "type": c.control_type,
            "obligation": c.obligation_code,
            "ownerName": c.owner_name or "Adv. S. K. Nair",
            "owner": "Compliance",
            "lastTest": c.last_test,
            "result": c.result,
            "status": c.status,
            "frequency": c.frequency,
            "testMethod": c.test_method,
            "evidenceRequired": c.evidence_required
        }
        for c in ctrs
    ]

@router.post("/controls", status_code=201)
def create_control(
    payload: Dict[str, Any],
    db: Session = Depends(get_db),
    current_user: User = Depends(require_permission("governance:manage"))
) -> Dict[str, Any]:
    count = db.query(InternalControl).count()
    code = payload.get("id") or payload.get("code") or f"CTR-{count+1:03d}"
    c = InternalControl(
        control_code=code,
        name=payload["name"],
        control_type=payload.get("type", "Preventive"),
        obligation_code=payload.get("obligation", "CO-001"),
        owner_name=payload.get("ownerName", "Adv. S. K. Nair"),
        last_test=payload.get("lastTest", "18 Sep 2026"),
        result=payload.get("result", "Pass"),
        status=payload.get("status", "Active"),
        frequency=payload.get("frequency", "Quarterly"),
        test_method=payload.get("testMethod", "Audited Walkthrough & Evidence Inspection"),
        evidence_required=payload.get("evidenceRequired", "Statutory Certificate")
    )
    db.add(c)
    db.commit()
    db.refresh(c)

    AuditService.log_event(
        db=db,
        actor_id=current_user.id,
        actor_name=current_user.full_name,
        actor_role=current_user.role.name if current_user.role else "COMPLIANCE_OFFICER",
        action="CREATE_INTERNAL_CONTROL",
        entity_type="InternalControl",
        entity_id=c.id,
        details=f"Configured control {c.control_code}: {c.name}"
    )

    return {"message": "Internal control registered successfully", "id": c.control_code}

# 4. Assessments & Disclosures
@router.get("/assessments")
def list_assessments(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> List[Dict[str, Any]]:
    ass = db.query(GovernanceAssessment).all()
    return [
        {
            "id": a.assessment_code,
            "title": a.title,
            "type": a.assessment_type,
            "period": a.period,
            "status": a.status,
            "score": a.score,
            "coverage": a.coverage,
            "findings": f"{a.findings_count} Observations",
            "nextReview": a.next_review
        }
        for a in ass
    ]

@router.get("/disclosures")
def list_disclosures(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> List[Dict[str, Any]]:
    dis = db.query(CorporateDisclosure).all()
    return [
        {
            "id": d.disclosure_code,
            "type": d.disclosure_type,
            "framework": d.framework,
            "section": d.section,
            "status": d.status,
            "approval": d.approval_status,
            "scope": d.scope,
            "lastUpdated": d.last_updated
        }
        for d in dis
    ]

# 5. Grievances & Whistleblower Cases
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

@router.post("/grievances", status_code=201)
def create_ethics_grievance(
    payload: Dict[str, Any],
    db: Session = Depends(get_db),
    current_user: User = Depends(require_permission("governance:manage"))
) -> Dict[str, Any]:
    eg = EthicsGrievance(
        reporting_period_id=payload.get("reporting_period_id", "period-2025-09"),
        category=payload.get("category", "Ethics & Anti-Corruption"),
        complaints_received=int(payload.get("complaints_received", 1)),
        complaints_resolved=int(payload.get("complaints_resolved", 1)),
        complaints_pending=int(payload.get("complaints_pending", 0)),
        resolution_pct=float(payload.get("resolution_pct", 100.0)),
        remarks=payload.get("remarks") or payload.get("description", "Logged via Ethics Channel")
    )
    db.add(eg)
    db.commit()
    db.refresh(eg)

    AuditService.log_event(
        db=db,
        actor_id=current_user.id,
        actor_name=current_user.full_name,
        actor_role=current_user.role.name if current_user.role else "COMPLIANCE_OFFICER",
        action="CREATE_ETHICS_GRIEVANCE",
        entity_type="EthicsGrievance",
        entity_id=eg.id,
        details=f"Filed grievance for {eg.category}"
    )

    return {"message": "Ethics complaint registered successfully", "id": eg.id}

# 6. Actions
@router.get("/actions")
def list_governance_actions(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> List[Dict[str, Any]]:
    acts = db.query(GovernanceAction).all()
    return [
        {
            "id": a.action_code,
            "issue": a.issue,
            "source": a.source,
            "priority": a.priority,
            "owner": a.owner_name or "Adv. S. K. Nair",
            "dueDate": a.due_date,
            "status": a.status,
            "verification": a.verification
        }
        for a in acts
    ]

@router.post("/actions", status_code=201)
def create_governance_action(
    payload: Dict[str, Any],
    db: Session = Depends(get_db),
    current_user: User = Depends(require_permission("governance:manage"))
) -> Dict[str, Any]:
    count = db.query(GovernanceAction).count()
    code = payload.get("id") or f"ACT-{count+1:03d}"
    a = GovernanceAction(
        action_code=code,
        issue=payload["issue"],
        source=payload.get("source", "Audit"),
        priority=payload.get("priority", "Medium"),
        owner_name=payload.get("owner", "Adv. S. K. Nair"),
        due_date=payload.get("dueDate", "30 Oct 2026"),
        status=payload.get("status", "Open"),
        verification=payload.get("verification", "Pending")
    )
    db.add(a)
    db.commit()
    db.refresh(a)

    AuditService.log_event(
        db=db,
        actor_id=current_user.id,
        actor_name=current_user.full_name,
        actor_role=current_user.role.name if current_user.role else "COMPLIANCE_OFFICER",
        action="CREATE_GOVERNANCE_ACTION",
        entity_type="GovernanceAction",
        entity_id=a.id,
        details=f"Initiated action {a.action_code}: {a.issue}"
    )

    return {"message": "Action created successfully", "id": a.action_code}
