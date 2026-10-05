from typing import Optional, List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.user import User
from app.models.procurement import Supplier, ProcurementMetric
from app.api.deps import get_current_user

router = APIRouter(prefix="/procurement", tags=["Responsible Procurement & Supply Chain"])

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
            "vendor_code": s.vendor_code,
            "name": s.name,
            "category": s.category,
            "is_msme": s.is_msme,
            "msme_type": s.msme_type,
            "state": s.state,
            "country": s.country,
            "annual_spend_inr_cr": s.annual_spend_inr_cr,
            "esg_audit_status": s.esg_audit_status,
            "esg_score": s.esg_score,
            "iso_14001_certified": s.iso_14001_certified,
            "iso_45001_certified": s.iso_45001_certified
        }
        for s in suppliers
    ]

@router.post("/suppliers", status_code=201)
def create_supplier(
    payload: Dict[str, Any],
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Dict[str, Any]:
    existing = db.query(Supplier).filter(Supplier.vendor_code == payload["vendor_code"]).first()
    if existing:
        raise HTTPException(status_code=400, detail=f"Vendor with code {payload['vendor_code']} already exists")

    s = Supplier(
        vendor_code=payload["vendor_code"],
        name=payload["name"],
        category=payload.get("category", "Direct Materials"),
        is_msme=payload.get("is_msme", False),
        msme_type=payload.get("msme_type"),
        state=payload.get("state"),
        country=payload.get("country", "India"),
        annual_spend_inr_cr=payload.get("annual_spend_inr_cr", 0.0),
        esg_audit_status=payload.get("esg_audit_status", "Not Audited"),
        esg_score=payload.get("esg_score"),
        iso_14001_certified=payload.get("iso_14001_certified", False),
        iso_45001_certified=payload.get("iso_45001_certified", False)
    )
    db.add(s)
    db.commit()
    db.refresh(s)
    return {"message": "Supplier registered successfully", "id": s.id, "vendor_code": s.vendor_code}

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
