from typing import Optional, List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.user import User
from app.models.procurement import (
    Supplier, ProcurementMetric, ProcurementTransaction,
    SupplierAssessment, SupplierRisk, ProcurementAction
)
from app.api.deps import get_current_user, require_permission
from app.services.audit_service import AuditService

router = APIRouter(prefix="/procurement", tags=["Responsible Procurement & Supply Chain"])

# 1. Suppliers
@router.get("/suppliers")
def list_suppliers(
    is_msme: Optional[bool] = Query(None),
    category: Optional[str] = Query(None),
    audit_status: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> List[Dict[str, Any]]:
    q = db.query(Supplier)
    if is_msme is not None:
        q = q.filter(Supplier.is_msme == is_msme)
    if category:
        q = q.filter(Supplier.category == category)
    if audit_status:
        q = q.filter(Supplier.esg_audit_status == audit_status)

    suppliers = q.order_by(Supplier.name.asc()).all()
    return [
        {
            "id": s.id,
            "code": s.vendor_code,
            "vendor_code": s.vendor_code,
            "name": s.name,
            "category": s.category,
            "is_msme": s.is_msme,
            "msme": "Yes" if s.is_msme else "No",
            "msme_type": s.msme_type,
            "state": s.state,
            "location": s.state or "Hyderabad",
            "country": s.country,
            "annual_spend_inr_cr": s.annual_spend_inr_cr,
            "spend": f"₹{s.annual_spend_inr_cr:.1f} Cr",
            "esg_audit_status": s.esg_audit_status,
            "esgStatus": s.esg_audit_status,
            "esg_score": s.esg_score,
            "assessmentScore": s.esg_score,
            "risk": "Low" if (s.esg_score or 0) >= 75 else ("Medium" if (s.esg_score or 0) >= 60 else "High"),
            "status": "Active",
            "tier": "Tier 1",
            "contact": "Authorized Procurement Representative",
            "email": f"vendor.{s.vendor_code.lower()}@partner.meilgroup.in",
            "phone": "+91 98765 43210",
            "iso_14001_certified": s.iso_14001_certified,
            "iso_45001_certified": s.iso_45001_certified
        }
        for s in suppliers
    ]

@router.post("/suppliers", status_code=201)
def create_supplier(
    payload: Dict[str, Any],
    db: Session = Depends(get_db),
    current_user: User = Depends(require_permission("procurement:manage"))
) -> Dict[str, Any]:
    vendor_code = payload.get("vendor_code") or payload.get("code") or f"VEND-{len(db.query(Supplier).all())+1:03d}"
    existing = db.query(Supplier).filter(Supplier.vendor_code == vendor_code).first()
    if existing:
        raise HTTPException(status_code=400, detail=f"Vendor with code {vendor_code} already exists")

    s = Supplier(
        vendor_code=vendor_code,
        name=payload["name"],
        category=payload.get("category", "Direct Materials"),
        is_msme=payload.get("is_msme", payload.get("msme") == "Yes"),
        msme_type=payload.get("msme_type", "Small" if payload.get("is_msme") else "Non-MSME"),
        state=payload.get("state") or payload.get("location", "Telangana"),
        country=payload.get("country", "India"),
        annual_spend_inr_cr=float(payload.get("annual_spend_inr_cr") or payload.get("spend", 10.0)),
        esg_audit_status=payload.get("esg_audit_status", "Audited"),
        esg_score=float(payload.get("esg_score", payload.get("assessmentScore", 80.0))),
        iso_14001_certified=payload.get("iso_14001_certified", True),
        iso_45001_certified=payload.get("iso_45001_certified", True)
    )
    db.add(s)
    db.commit()
    db.refresh(s)

    AuditService.log_event(
        db=db,
        actor_id=current_user.id,
        actor_name=current_user.full_name,
        actor_role=current_user.role.name if current_user.role else "PROCUREMENT_OFFICER",
        action="CREATE_SUPPLIER",
        entity_type="Supplier",
        entity_id=s.id,
        details=f"Onboarded supplier {s.vendor_code}: {s.name} (MSME: {s.is_msme})"
    )

    return {"message": "Supplier registered successfully", "id": s.id, "vendor_code": s.vendor_code}

# 2. Metrics
@router.get("/metrics")
def get_procurement_metrics(
    reporting_period_id: str = Query("period-2025-09"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Dict[str, Any]:
    pm = db.query(ProcurementMetric).filter(
        ProcurementMetric.reporting_period_id == reporting_period_id
    ).first()

    suppliers = db.query(Supplier).all()
    total_spend = sum(s.annual_spend_inr_cr for s in suppliers)
    msme_spend = sum(s.annual_spend_inr_cr for s in suppliers if s.is_msme)
    audited_count = sum(1 for s in suppliers if s.esg_audit_status == "Audited")
    msme_pct = round((msme_spend / total_spend * 100), 2) if total_spend > 0 else 0.0

    return {
        "reporting_period_id": reporting_period_id,
        "total_procurement_spend_cr": pm.total_procurement_spend_cr if pm else total_spend,
        "msme_spend_cr": pm.msme_spend_cr if pm else msme_spend,
        "msme_spend_pct": pm.msme_spend_pct if pm else msme_pct,
        "local_sourcing_pct": pm.local_sourcing_pct if pm else 88.5,
        "suppliers_audited_count": audited_count,
        "total_active_suppliers": len(suppliers)
    }

# 3. Transactions
@router.get("/transactions")
def list_transactions(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> List[Dict[str, Any]]:
    txs = db.query(ProcurementTransaction).order_by(ProcurementTransaction.created_at.desc()).all()
    return [
        {
            "id": t.transaction_code,
            "date": t.date,
            "supplier": t.supplier,
            "category": t.category,
            "project": t.project,
            "amount": f"₹{t.amount_cr:.1f} Cr",
            "amount_cr": t.amount_cr,
            "local": "Yes" if t.is_local else "No",
            "msme": "Yes" if t.is_msme else "No",
            "source": t.source,
            "status": t.status
        }
        for t in txs
    ]

@router.post("/transactions", status_code=201)
def create_transaction(
    payload: Dict[str, Any],
    db: Session = Depends(get_db),
    current_user: User = Depends(require_permission("procurement:manage"))
) -> Dict[str, Any]:
    count = db.query(ProcurementTransaction).count()
    tx_code = payload.get("id") or f"PR-2026-{count+1:03d}"
    amount_raw = str(payload.get("amount", "10")).replace("₹", "").replace("Cr", "").strip()
    try:
        amt = float(amount_raw)
    except ValueError:
        amt = 10.0

    tx = ProcurementTransaction(
        transaction_code=tx_code,
        date=payload.get("date", "01 Sep 2026"),
        supplier=payload["supplier"],
        category=payload.get("category", "Direct Materials"),
        project=payload.get("project", "Zojila Tunnel PKG-2"),
        amount_cr=amt,
        is_local=payload.get("local") != "No",
        is_msme=payload.get("msme") == "Yes",
        source=payload.get("source", "ERP"),
        status=payload.get("status", "Completed")
    )
    db.add(tx)
    db.commit()
    db.refresh(tx)

    AuditService.log_event(
        db=db,
        actor_id=current_user.id,
        actor_name=current_user.full_name,
        actor_role=current_user.role.name if current_user.role else "PROCUREMENT_OFFICER",
        action="CREATE_PROCUREMENT_TRANSACTION",
        entity_type="ProcurementTransaction",
        entity_id=tx.id,
        details=f"Logged transaction {tx.transaction_code}: {tx.supplier} ₹{tx.amount_cr} Cr"
    )

    return {"message": "Transaction recorded successfully", "id": tx.transaction_code}

# 4. Assessments
@router.get("/assessments")
def list_assessments(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> List[Dict[str, Any]]:
    ass = db.query(SupplierAssessment).order_by(SupplierAssessment.created_at.desc()).all()
    return [
        {
            "id": a.assessment_code,
            "supplier": a.supplier,
            "type": a.assessment_type,
            "date": a.date,
            "score": a.score,
            "risk": a.risk_level,
            "status": a.status,
            "nextReview": a.next_review
        }
        for a in ass
    ]

@router.post("/assessments", status_code=201)
def create_assessment(
    payload: Dict[str, Any],
    db: Session = Depends(get_db),
    current_user: User = Depends(require_permission("procurement:manage"))
) -> Dict[str, Any]:
    count = db.query(SupplierAssessment).count()
    code = payload.get("id") or f"SA-2026-{count+1:03d}"
    a = SupplierAssessment(
        assessment_code=code,
        supplier=payload["supplier"],
        assessment_type=payload.get("type", "General ESG"),
        date=payload.get("date", "18 Sep 2026"),
        score=float(payload.get("score", 85)),
        risk_level=payload.get("risk", "Low"),
        status=payload.get("status", "Approved"),
        next_review=payload.get("nextReview", "18 Sep 2027")
    )
    db.add(a)
    db.commit()
    db.refresh(a)

    AuditService.log_event(
        db=db,
        actor_id=current_user.id,
        actor_name=current_user.full_name,
        actor_role=current_user.role.name if current_user.role else "PROCUREMENT_OFFICER",
        action="CREATE_SUPPLIER_ASSESSMENT",
        entity_type="SupplierAssessment",
        entity_id=a.id,
        details=f"Completed ESG assessment for {a.supplier}: score {a.score} ({a.risk_level} risk)"
    )

    return {"message": "Assessment logged successfully", "id": a.assessment_code}

# 5. Risks & Actions
@router.get("/risks")
def list_risks(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> List[Dict[str, Any]]:
    risks = db.query(SupplierRisk).all()
    return [
        {
            "id": r.risk_code,
            "supplier": r.supplier,
            "riskType": r.risk_type,
            "level": r.level,
            "impact": r.impact,
            "mitigation": r.mitigation,
            "status": r.status,
            "owner": r.owner
        }
        for r in risks
    ]

@router.get("/actions")
def list_actions(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> List[Dict[str, Any]]:
    acts = db.query(ProcurementAction).all()
    return [
        {
            "id": a.action_code,
            "supplier": a.supplier,
            "issue": a.issue,
            "priority": a.priority,
            "status": a.status,
            "owner": a.owner,
            "dueDate": a.due_date
        }
        for a in acts
    ]

@router.post("/actions", status_code=201)
def create_action(
    payload: Dict[str, Any],
    db: Session = Depends(get_db),
    current_user: User = Depends(require_permission("procurement:manage"))
) -> Dict[str, Any]:
    count = db.query(ProcurementAction).count()
    code = payload.get("id") or f"ACT-{count+1:03d}"
    act = ProcurementAction(
        action_code=code,
        supplier=payload.get("supplier", "General Supplier"),
        issue=payload["issue"],
        priority=payload.get("priority", "Medium"),
        status=payload.get("status", "Open"),
        owner=payload.get("owner", "Procurement Officer"),
        due_date=payload.get("dueDate", "15 Oct 2026")
    )
    db.add(act)
    db.commit()
    db.refresh(act)

    AuditService.log_event(
        db=db,
        actor_id=current_user.id,
        actor_name=current_user.full_name,
        actor_role=current_user.role.name if current_user.role else "PROCUREMENT_OFFICER",
        action="CREATE_PROCUREMENT_ACTION",
        entity_type="ProcurementAction",
        entity_id=act.id,
        details=f"Created action {act.action_code} for {act.supplier}: {act.issue}"
    )

    return {"message": "Procurement action registered successfully", "id": act.action_code}
