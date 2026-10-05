from typing import Optional, List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session, joinedload
from app.core.database import get_db
from app.models.user import User
from app.models.brsr import (
    BrsrFramework, BrsrSection, BrsrPrinciple, BrsrIndicator,
    BrsrAnswer, BrsrAnswerSource
)
from app.api.deps import get_current_user, require_group_access
from app.services.brsr_engine import BrsrEngine

router = APIRouter(prefix="/brsr", tags=["BRSR Reporting & Assurance Engine"])

@router.get("/frameworks")
def list_frameworks(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> List[Dict[str, Any]]:
    frameworks = db.query(BrsrFramework).all()
    return [
        {
            "id": f.id,
            "title": f.title,
            "version_code": f.version_code,
            "circular_reference": f.circular_reference,
            "is_active": f.is_active,
            "created_at": f.created_at.isoformat() if f.created_at else None
        }
        for f in frameworks
    ]

@router.get("/sections")
def list_sections(
    framework_code: Optional[str] = Query(None, description="Framework version code, e.g. SEBI_BRSR_2021"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> List[Dict[str, Any]]:
    q = db.query(BrsrSection)
    if framework_code:
        fw = db.query(BrsrFramework).filter(BrsrFramework.version_code == framework_code).first()
        if fw:
            q = q.filter(BrsrSection.framework_id == fw.id)
        else:
            return []
    sections = q.order_by(BrsrSection.section_code.asc()).all()
    return [
        {
            "id": s.id,
            "framework_id": s.framework_id,
            "section_code": s.section_code,
            "title": s.title,
            "description": s.description
        }
        for s in sections
    ]

@router.get("/principles")
def list_principles(
    framework_code: Optional[str] = Query(None, description="Framework version code"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> List[Dict[str, Any]]:
    q = db.query(BrsrPrinciple)
    if framework_code:
        fw = db.query(BrsrFramework).filter(BrsrFramework.version_code == framework_code).first()
        if fw:
            q = q.filter(BrsrPrinciple.framework_id == fw.id)
        else:
            return []
    principles = q.order_by(BrsrPrinciple.principle_number.asc()).all()
    return [
        {
            "id": p.id,
            "framework_id": p.framework_id,
            "principle_number": p.principle_number,
            "code": p.code,
            "title": p.title,
            "description": p.description
        }
        for p in principles
    ]

@router.get("/indicators")
def list_indicators(
    framework_code: Optional[str] = Query(None),
    section_code: Optional[str] = Query(None),
    principle_number: Optional[int] = Query(None),
    indicator_type: Optional[str] = Query(None, description="ESSENTIAL, LEADERSHIP, CORE, GENERAL"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> List[Dict[str, Any]]:
    q = db.query(BrsrIndicator).options(joinedload(BrsrIndicator.section))
    
    if framework_code:
        fw = db.query(BrsrFramework).filter(BrsrFramework.version_code == framework_code).first()
        if fw:
            q = q.join(BrsrSection).filter(BrsrSection.framework_id == fw.id)
        else:
            return []
    if section_code:
        q = q.join(BrsrSection).filter(BrsrSection.section_code == section_code)
    if principle_number:
        q = q.filter(BrsrIndicator.principle_number == principle_number)
    if indicator_type:
        q = q.filter(BrsrIndicator.indicator_type == indicator_type.upper())

    indicators = q.order_by(BrsrIndicator.indicator_code.asc()).all()
    return [
        {
            "id": i.id,
            "indicator_code": i.indicator_code,
            "section_code": i.section.section_code if i.section else None,
            "principle_number": i.principle_number,
            "indicator_type": i.indicator_type,
            "question_text": i.question_text,
            "metric_key": i.metric_key,
            "unit": i.unit,
            "required": i.required,
            "guidance_notes": i.guidance_notes
        }
        for i in indicators
    ]

@router.get("/{framework_code}/readiness")
@router.get("/{framework_code}/status")
def get_brsr_readiness(
    framework_code: str,
    reporting_period_id: str = Query("period-2025-09", description="Reporting period ID"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Dict[str, Any]:
    try:
        return BrsrEngine.compute_brsr_readiness(
            db=db,
            framework_version=framework_code,
            reporting_period_id=reporting_period_id
        )
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.get("/{framework_code}/answers")
def get_brsr_answers(
    framework_code: str,
    reporting_period_id: str = Query("period-2025-09", description="Reporting period ID"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> List[Dict[str, Any]]:
    fw = db.query(BrsrFramework).filter(BrsrFramework.version_code == framework_code).first()
    if not fw:
        raise HTTPException(status_code=404, detail=f"Framework '{framework_code}' not found")

    answers = db.query(BrsrAnswer).options(
        joinedload(BrsrAnswer.indicator),
        joinedload(BrsrAnswer.sources)
    ).filter(
        BrsrAnswer.framework_id == fw.id,
        BrsrAnswer.reporting_period_id == reporting_period_id
    ).all()

    return [
        {
            "id": a.id,
            "indicator_code": a.indicator.indicator_code if a.indicator else None,
            "question": a.indicator.question_text if a.indicator else None,
            "type": a.indicator.indicator_type if a.indicator else None,
            "value_numeric": a.value_numeric,
            "value_text": a.value_text,
            "value_json": a.value_json,
            "unit": a.unit,
            "status": a.status,
            "generated_at": a.generated_at.isoformat() if a.generated_at else None,
            "source_count": len(a.sources)
        }
        for a in answers
    ]

@router.post("/{framework_code}/generate")
def generate_brsr_answers(
    framework_code: str,
    reporting_period_id: str = Query("period-2025-09", description="Reporting period ID"),
    group_id: str = Query("meil-group-hq", description="Group ID"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Dict[str, Any]:
    require_group_access(group_id, current_user)
    try:
        answers = BrsrEngine.generate_brsr_answers(
            db=db,
            framework_version=framework_code,
            reporting_period_id=reporting_period_id,
            group_id=group_id,
            user_id=current_user.id
        )
        return {
            "message": f"Successfully generated {len(answers)} BRSR answers for period {reporting_period_id}",
            "answers_count": len(answers),
            "framework_code": framework_code,
            "reporting_period_id": reporting_period_id
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/indicators/{indicator_code}/trace")
def get_indicator_trace(
    indicator_code: str,
    reporting_period_id: str = Query("period-2025-09", description="Reporting period ID"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Dict[str, Any]:
    try:
        return BrsrEngine.get_indicator_trace(
            db=db,
            indicator_code=indicator_code,
            reporting_period_id=reporting_period_id
        )
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
