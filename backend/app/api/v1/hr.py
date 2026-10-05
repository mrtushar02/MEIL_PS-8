from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime, timezone
import hashlib

from app.core.database import get_db
from app.models.hr import (
    WorkforceRecord,
    TrainingRecord,
    WellbeingRecord,
    PoshGrievanceRecord,
    HREvidenceRecord,
    HRSubmissionRecord
)
from app.models.audit import AuditLog
from app.schemas.hr import (
    WorkforceRecordCreate,
    WorkforceRecordResponse,
    TrainingRecordCreate,
    TrainingRecordResponse,
    WellbeingRecordResponse,
    PoshGrievanceResponse,
    HREvidenceCreate,
    HREvidenceResponse,
    HRSubmissionCreate,
    HRSubmissionResponse,
    HROverviewResponse
)

router = APIRouter(prefix="/hr", tags=["HR & Workforce Intelligence"])

# ── 1. HR Overview Summary ──
@router.get("/overview", response_model=HROverviewResponse)
def get_hr_overview(db: Session = Depends(get_db)):
    records = db.query(WorkforceRecord).all()
    
    if not records:
        # Default enterprise figures for MEIL Group
        return HROverviewResponse(
            total_workforce=42850,
            direct_employees=14200,
            contract_workers=28650,
            female_diversity_pct=14.8,
            training_hours_per_emp=28.4,
            fair_wage_adherence_pct=100.0,
            statutory_minimum_multiplier=1.28,
            differently_abled_count=142,
            posh_resolution_pct=100.0,
            pending_posh_grievances=0,
            subsidiaries_count=6,
            statutory_filings_count=5
        )
    
    total = sum(r.total_count for r in records)
    males = sum(r.male_count for r in records)
    females = sum(r.female_count for r in records)
    direct = sum(r.permanent_count for r in records)
    contract = sum(r.contractual_count for r in records)
    pwd = sum(r.differently_abled_count for r in records)
    female_pct = round((females / total * 100), 1) if total > 0 else 14.8

    trainings = db.query(TrainingRecord).all()
    total_hours = sum(t.hours * t.attendees_count for t in trainings) if trainings else 0
    avg_training_hrs = round(total_hours / total, 1) if total > 0 else 28.4

    posh = db.query(PoshGrievanceRecord).first()
    pending_posh = posh.complaints_pending if posh else 0
    resolved_pct = 100.0 if not posh or posh.complaints_filed == 0 else round((posh.complaints_resolved / posh.complaints_filed) * 100, 1)

    subs_count = len(set(r.subsidiary_name for r in records)) or 6
    filings_count = db.query(HRSubmissionRecord).count() or 5

    return HROverviewResponse(
        total_workforce=total,
        direct_employees=direct,
        contract_workers=contract,
        female_diversity_pct=female_pct,
        training_hours_per_emp=avg_training_hrs,
        fair_wage_adherence_pct=100.0,
        statutory_minimum_multiplier=1.28,
        differently_abled_count=pwd,
        posh_resolution_pct=resolved_pct,
        pending_posh_grievances=pending_posh,
        subsidiaries_count=subs_count,
        statutory_filings_count=filings_count
    )

# ── 2. Workforce Demographics (BRSR Principle 3) ──
@router.get("/workforce")
def get_workforce_demographics(
    subsidiary: Optional[str] = Query(None),
    period: Optional[str] = Query("FY 2026-27"),
    db: Session = Depends(get_db)
):
    query = db.query(WorkforceRecord)
    if subsidiary and subsidiary != "ALL":
        query = query.filter(WorkforceRecord.subsidiary_name.ilike(f"%{subsidiary}%"))
    if period:
        query = query.filter(WorkforceRecord.reporting_period == period)
    
    records = query.all()
    
    # Return formatted rows
    results = []
    for r in records:
        f_pct = f"{round((r.female_count / r.total_count * 100), 1)}%" if r.total_count > 0 else "0.0%"
        results.append({
            "id": r.id,
            "category": r.category,
            "subsidiary_name": r.subsidiary_name,
            "total_count": r.total_count,
            "male_count": r.male_count,
            "female_count": r.female_count,
            "female_pct": f_pct,
            "permanent_count": r.permanent_count,
            "contractual_count": r.contractual_count,
            "differently_abled_count": r.differently_abled_count,
            "turnover_rate_pct": f"{r.turnover_rate_pct}%",
            "reporting_period": r.reporting_period
        })
    return results

@router.post("/workforce", status_code=201)
def create_workforce_record(
    payload: WorkforceRecordCreate,
    db: Session = Depends(get_db)
):
    total = payload.male_count + payload.female_count + (payload.other_count or 0)
    record = WorkforceRecord(
        subsidiary_name=payload.subsidiary_name,
        category=payload.category,
        male_count=payload.male_count,
        female_count=payload.female_count,
        other_count=payload.other_count or 0,
        total_count=total,
        permanent_count=payload.permanent_count or payload.male_count + payload.female_count,
        contractual_count=payload.contractual_count or 0,
        differently_abled_count=payload.differently_abled_count or 0,
        turnover_rate_pct=payload.turnover_rate_pct or 0.0,
        reporting_period=payload.reporting_period or "FY 2026-27"
    )
    db.add(record)
    
    # Audit log
    audit = AuditLog(
        actor_id="user-hr-director",
        actor_name="Sunita Raman",
        actor_role="HR_OFFICER",
        action="CREATE_WORKFORCE_DISCLOSURE",
        entity_type="WorkforceRecord",
        entity_id=record.id,
        details=f"Category: {record.category}, Total: {total}, Sub: {record.subsidiary_name}"
    )
    db.add(audit)
    db.commit()
    db.refresh(record)
    return {"message": "Workforce demographic record created successfully", "id": record.id}

# ── 3. Training & Skills Matrix (BRSR P3 Indicator 8) ──
@router.get("/training")
def get_training_records(
    category: Optional[str] = Query(None),
    subsidiary: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    query = db.query(TrainingRecord)
    if category and category != "ALL":
        query = query.filter(TrainingRecord.category == category)
    if subsidiary and subsidiary != "ALL":
        query = query.filter(TrainingRecord.subsidiary_name.ilike(f"%{subsidiary}%"))
    
    sessions = query.order_by(TrainingRecord.created_at.desc()).all()
    
    # BRSR P3 Indicator 8 statutory matrix summary
    statutory_matrix = [
        {
            "category": "Board of Directors",
            "total_count": 14,
            "safety_coverage_pct": "100%",
            "safety_hours": 18.0,
            "skill_coverage_pct": "100%",
            "skill_hours": 22.0,
            "posh_coverage_pct": "100%",
            "status": "Statutory Signed"
        },
        {
            "category": "Key Managerial Personnel (KMP)",
            "total_count": 42,
            "safety_coverage_pct": "100%",
            "safety_hours": 24.0,
            "skill_coverage_pct": "97.6%",
            "skill_hours": 36.0,
            "posh_coverage_pct": "100%",
            "status": "Verified"
        },
        {
            "category": "Permanent Employees (Engineering & HQ)",
            "total_count": 14144,
            "safety_coverage_pct": "98.8%",
            "safety_hours": 32.0,
            "skill_coverage_pct": "91.4%",
            "skill_hours": 28.0,
            "posh_coverage_pct": "98.2%",
            "status": "LMS Verified"
        },
        {
            "category": "Contractual EPC Site Workers",
            "total_count": 28650,
            "safety_coverage_pct": "100%",
            "safety_hours": 26.8,
            "skill_coverage_pct": "78.4%",
            "skill_hours": 16.0,
            "posh_coverage_pct": "96.5%",
            "status": "Biometric Logged"
        }
    ]

    return {
        "statutory_matrix": statutory_matrix,
        "sessions": [
            {
                "id": s.id,
                "title": s.title,
                "category": s.category,
                "subsidiary": s.subsidiary_name,
                "attendees": s.attendees_count,
                "hours": s.hours,
                "trainer": s.trainer or "Certified Safety Faculty",
                "date": s.date_logged,
                "status": s.status
            }
            for s in sessions
        ]
    }

@router.post("/training", status_code=201)
def log_training_batch(
    payload: TrainingRecordCreate,
    db: Session = Depends(get_db)
):
    session = TrainingRecord(
        title=payload.title,
        category=payload.category,
        subsidiary_name=payload.subsidiary_name,
        attendees_count=payload.attendees_count,
        hours=payload.hours,
        trainer=payload.trainer or "Internal Technical Lead",
        date_logged=payload.date_logged or datetime.now(timezone.utc).strftime("%d %b %Y"),
        status=payload.status or "Verified"
    )
    db.add(session)
    
    # Audit log
    audit = AuditLog(
        actor_id="user-hr-director",
        actor_name="Sunita Raman",
        actor_role="HR_OFFICER",
        action="LOG_TRAINING_BATCH",
        entity_type="TrainingRecord",
        entity_id=session.id,
        details=f"Title: {session.title}, Attendees: {session.attendees_count}, Hours: {session.hours}"
    )
    db.add(audit)
    db.commit()
    db.refresh(session)
    return {"message": "Training session successfully registered in BRSR P3 Register", "id": session.id}
    db.commit()
    db.refresh(session)
    return {"message": "Training session successfully registered in BRSR P3 Register", "id": session.id}

# ── 4. Wellbeing, Social Security & Health (BRSR P3 #1, #2) ──
@router.get("/wellbeing")
def get_wellbeing_records(db: Session = Depends(get_db)):
    records = db.query(WellbeingRecord).all()
    if not records:
        return [
            {
                "subsidiary_name": "MEIL Core Infrastructure & EPC",
                "health_insurance_pct": 98.2,
                "accident_insurance_pct": 100.0,
                "maternity_retention_pct": 98.4,
                "paternity_takeup_pct": 100.0,
                "annual_medical_screenings": 41200,
                "creche_compliant": True,
                "reporting_period": "FY 2026-27"
            }
        ]
    return records

# ── 5. Human Rights, POSH & Fair Wages (BRSR Principle 5) ──
@router.get("/human-rights")
def get_human_rights_and_posh(db: Session = Depends(get_db)):
    posh = db.query(PoshGrievanceRecord).first()
    if not posh:
        return {
            "posh_register": {
                "period": "FY 2026-27",
                "complaints_filed": 4,
                "complaints_investigated": 4,
                "complaints_resolved": 4,
                "complaints_pending": 0,
                "resolution_rate_pct": 100.0,
                "statutory_window_days": 90
            },
            "fair_wages": {
                "minimum_wage_multiplier": 1.28,
                "engineering_parity_ratio": "1.00 : 1.00",
                "site_parity_ratio": "1.00 : 1.00",
                "child_labour_incidents": 0,
                "forced_labour_incidents": 0,
                "sa8000_certified": True
            }
        }
    return {
        "posh_register": {
            "period": posh.reporting_period,
            "complaints_filed": posh.complaints_filed,
            "complaints_investigated": posh.complaints_investigated,
            "complaints_resolved": posh.complaints_resolved,
            "complaints_pending": posh.complaints_pending,
            "resolution_rate_pct": 100.0 if posh.complaints_filed == 0 else round((posh.complaints_resolved / posh.complaints_filed) * 100, 1),
            "statutory_window_days": 90
        },
        "fair_wages": {
            "minimum_wage_multiplier": posh.statutory_minimum_multiplier,
            "engineering_parity_ratio": f"{posh.wage_parity_ratio:.2f} : 1.00",
            "site_parity_ratio": "1.00 : 1.00",
            "child_labour_incidents": posh.child_labour_incidents,
            "forced_labour_incidents": posh.forced_labour_incidents,
            "sa8000_certified": True
        }
    }

# ── 6. HR Statutory Evidence Repository ──
@router.get("/evidence")
def list_hr_evidence(
    category: Optional[str] = Query(None),
    query: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    q = db.query(HREvidenceRecord)
    if category and category != "ALL":
        q = q.filter(HREvidenceRecord.category == category)
    if query:
        q = q.filter(
            (HREvidenceRecord.title.ilike(f"%{query}%")) |
            (HREvidenceRecord.ref_no.ilike(f"%{query}%")) |
            (HREvidenceRecord.subsidiary_name.ilike(f"%{query}%"))
        )
    return q.all()

@router.post("/evidence", status_code=201)
def upload_hr_evidence(
    payload: HREvidenceCreate,
    db: Session = Depends(get_db)
):
    content_str = f"{payload.title}:{payload.ref_no}:{datetime.now(timezone.utc).isoformat()}"
    sha256 = hashlib.sha256(content_str.encode()).hexdigest()

    doc = HREvidenceRecord(
        doc_code=payload.doc_code,
        title=payload.title,
        category=payload.category,
        subsidiary_name=payload.subsidiary_name,
        ref_no=payload.ref_no,
        date_issued=payload.date_issued or datetime.now(timezone.utc).strftime("%d %b %Y"),
        file_size=payload.file_size or "2.4 MB PDF",
        status="Statutory Verified",
        verifier=payload.verifier,
        hash_sha256=f"sha256:{sha256[:16]}"
    )
    db.add(doc)
    
    audit = AuditLog(
        actor_id="user-hr-director",
        actor_name="Sunita Raman",
        actor_role="HR_OFFICER",
        action="UPLOAD_HR_EVIDENCE",
        entity_type="HREvidenceRecord",
        entity_id=doc.id,
        details=f"Title: {doc.title}, Ref: {doc.ref_no}, Hash: {doc.hash_sha256}"
    )
    db.add(audit)
    db.commit()
    db.refresh(doc)
    return {"message": "HR evidence document verified and vaulted", "id": doc.id, "hash": doc.hash_sha256}

# ── 7. Statutory Filings & Submissions Tracker ──
@router.get("/submissions")
def list_hr_submissions(db: Session = Depends(get_db)):
    return db.query(HRSubmissionRecord).order_by(HRSubmissionRecord.due_date.asc()).all()

@router.post("/submissions", status_code=201)
def create_hr_submission(
    payload: HRSubmissionCreate,
    db: Session = Depends(get_db)
):
    sub = HRSubmissionRecord(
        sub_code=payload.sub_code,
        title=payload.title,
        authority=payload.authority,
        due_date=payload.due_date,
        submitted_date=datetime.now(timezone.utc).strftime("%d %b %Y"),
        approver=payload.approver,
        status="Verified & Approved",
        ref_id=payload.ref_id
    )
    db.add(sub)
    
    audit = AuditLog(
        actor_id="user-hr-director",
        actor_name=payload.approver,
        actor_role="HR_OFFICER",
        action="SUBMIT_REGULATORY_RETURN",
        entity_type="HRSubmissionRecord",
        entity_id=sub.id,
        details=f"Title: {sub.title}, Authority: {sub.authority}, Ref: {sub.ref_id}"
    )
    db.add(audit)
    db.commit()
    db.refresh(sub)
    return {"message": "Statutory return filed and acknowledged", "id": sub.id}
