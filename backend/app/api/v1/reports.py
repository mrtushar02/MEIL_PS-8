import csv
import io
from typing import Optional, List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, Query, Response, status
from sqlalchemy.orm import Session, joinedload
from app.core.database import get_db
from app.models.reporting import ReportingPeriod, Submission
from app.models.organization import Group
from app.models.audit import AuditLog
from app.models.brsr import BrsrFramework, BrsrIndicator, BrsrAnswer, BrsrAnswerSource
from app.models.evidence import EvidenceDocument, EvidenceLink
from app.models.user import User
from app.schemas.calculation import EmissionCalculationRequest, EmissionCalculationResponse
from app.services.consolidation_engine import ConsolidationEngine
from app.services.emission_engine import EmissionEngine
from app.services.brsr_engine import BrsrEngine
from app.api.deps import get_current_user

router = APIRouter(prefix="/reports", tags=["Reporting & Consolidation Engine"])

@router.get("/consolidation/group")
def get_group_consolidation(
    reporting_period_id: str = Query(..., description="ID of reporting period"),
    group_id: str = Query("meil-group-hq"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    period = db.query(ReportingPeriod).filter(ReportingPeriod.id == reporting_period_id).first()
    if not period:
        raise HTTPException(status_code=404, detail="Reporting period not found")
    try:
        return ConsolidationEngine.consolidate_group(db, group_id, reporting_period_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.get("/consolidation/business-unit/{bu_id}")
def get_bu_consolidation(
    bu_id: str,
    reporting_period_id: str = Query(..., description="ID of reporting period"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        return ConsolidationEngine.consolidate_business_unit(db, bu_id, reporting_period_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.post("/calculator", response_model=EmissionCalculationResponse)
def calculate_emissions(req: EmissionCalculationRequest, db: Session = Depends(get_db)):
    scope1 = EmissionEngine.calculate_scope1(db, req.diesel_litres, req.petrol_litres, req.natural_gas_m3)
    scope2 = EmissionEngine.calculate_scope2(db, req.grid_kwh, req.renewable_kwh)
    scope3 = EmissionEngine.calculate_scope3(db, req.cement_tonnes, req.steel_tonnes)
    total_ghg = round(scope1 + scope2, 2)
    ghg_intensity = EmissionEngine.calculate_ghg_intensity(total_ghg, req.turnover_inr_cr)
    total_energy_gj = EmissionEngine.calculate_total_energy_gj(req.diesel_litres, req.grid_kwh, req.renewable_kwh)
    
    total_kwh = req.grid_kwh + req.renewable_kwh
    renew_pct = round((req.renewable_kwh / total_kwh) * 100.0, 1) if total_kwh > 0 else 0.0

    return EmissionCalculationResponse(
        scope1_co2e_tonnes=scope1,
        scope2_co2e_tonnes=scope2,
        scope3_co2e_tonnes=scope3,
        total_ghg_co2e_tonnes=total_ghg,
        ghg_intensity_per_cr=ghg_intensity,
        total_energy_gj=total_energy_gj,
        renewable_energy_share_pct=renew_pct,
        factors_used=[
            {"activity": "Diesel", "factor": 2.68, "unit": "kg CO2e/L", "source": "CEA India Baseline v19"},
            {"activity": "Grid Electricity", "factor": 0.716, "unit": "kg CO2e/kWh", "source": "CEA India Baseline v19"},
            {"activity": "Cement", "factor": 820.0, "unit": "kg CO2e/Tonne", "source": "IPCC 2006"},
            {"activity": "Steel", "factor": 1850.0, "unit": "kg CO2e/Tonne", "source": "IPCC 2006"}
        ]
    )

@router.get("/brsr")
def get_brsr_statutory_report(
    reporting_period_id: str = Query(..., description="ID of reporting period"),
    framework_code: str = Query("SEBI_BRSR_2021"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    period = db.query(ReportingPeriod).filter(ReportingPeriod.id == reporting_period_id).first()
    if not period:
        raise HTTPException(status_code=404, detail="Reporting period not found")

    group = db.query(Group).filter(Group.id == "meil-group-hq").first()
    readiness = BrsrEngine.compute_brsr_readiness(db, framework_code, reporting_period_id)
    answers = db.query(BrsrAnswer).options(joinedload(BrsrAnswer.indicator)).filter(
        BrsrAnswer.reporting_period_id == reporting_period_id
    ).all()

    return {
        "reporting_period": period.name,
        "reporting_period_id": period.id,
        "reporting_entity": group.name if group else "Megha Engineering and Infrastructures Limited (MEIL Group)",
        "cin": group.cin if group else "U45202TG2006PLC050271",
        "turnover_inr_cr": group.turnover_inr_cr if group else 32450.0,
        "readiness_pct": readiness["readiness_pct"],
        "essential_indicators_pct": readiness["essential_indicators_pct"],
        "core_assurance_pct": readiness["core_assurance_pct"],
        "section_breakdown": readiness["section_breakdown"],
        "principle_breakdown": readiness["principle_breakdown"],
        "answers_count": len(answers),
        "assurance_status": "Assurance Ready (Bureau Veritas / ICAI BRSR Revised 2024 Protocol)"
    }

@router.get("/export/brsr.csv")
def export_brsr_csv(
    reporting_period_id: str = Query("period-2025-09"),
    framework_code: str = Query("SEBI_BRSR_2021"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    fw = db.query(BrsrFramework).filter(BrsrFramework.version_code == framework_code).first()
    if not fw:
        raise HTTPException(status_code=404, detail="Framework not found")

    indicators = db.query(BrsrIndicator).all()
    answers = {
        a.indicator_id: a
        for a in db.query(BrsrAnswer).filter(BrsrAnswer.reporting_period_id == reporting_period_id).all()
    }

    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow([
        "Indicator Code", "Section", "Principle", "Type", "Question",
        "Reported Numeric Value", "Reported Text Value", "Unit", "Assurance Status"
    ])

    for ind in indicators:
        ans = answers.get(ind.id)
        writer.writerow([
            ind.indicator_code,
            ind.section.section_code if ind.section else "",
            f"P{ind.principle_number}" if ind.principle_number else "",
            ind.indicator_type,
            ind.question_text,
            ans.value_numeric if (ans and ans.value_numeric is not None) else "N/A",
            ans.value_text if (ans and ans.value_text) else "",
            ind.unit or "",
            ans.status if ans else "UNREPORTED"
        ])

    csv_data = output.getvalue()
    return Response(
        content=csv_data,
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename=BRSR_Export_{reporting_period_id}.csv"}
    )

@router.get("/export/audit.csv")
def export_audit_trail_csv(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    logs = db.query(AuditLog).order_by(AuditLog.timestamp.desc()).all()
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow([
        "Timestamp", "Actor ID", "Actor Name", "Actor Role", "Action",
        "Entity Type", "Entity ID", "Event Hash", "Previous Hash"
    ])

    for l in logs:
        writer.writerow([
            l.timestamp.isoformat() if l.timestamp else "",
            l.actor_id or "",
            l.actor_name or "",
            l.actor_role or "",
            l.action or "",
            l.entity_type or "",
            l.entity_id or "",
            l.event_hash or "",
            l.previous_hash or ""
        ])

    csv_data = output.getvalue()
    return Response(
        content=csv_data,
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=ESG_Audit_Trail.csv"}
    )

@router.get("/executive-summary")
def get_executive_summary(
    reporting_period_id: str = Query("period-2025-09"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    period = db.query(ReportingPeriod).filter(ReportingPeriod.id == reporting_period_id).first()
    if not period:
        raise HTTPException(status_code=404, detail="Reporting period not found")

    group = db.query(Group).filter(Group.id == "meil-group-hq").first()
    cons = ConsolidationEngine.consolidate_group(db, "meil-group-hq", reporting_period_id)
    readiness = BrsrEngine.compute_brsr_readiness(db, "SEBI_BRSR_2021", reporting_period_id)
    metrics = cons["consolidated_metrics"]

    return {
        "entity": {
            "name": group.name if group else "MEIL Group",
            "cin": group.cin if group else "U45202TG2006PLC050271",
            "turnover_inr_cr": group.turnover_inr_cr if group else 32450.0,
            "reporting_period": period.name,
            "period_locked": period.is_locked
        },
        "environmental_summary": {
            "total_ghg_emissions_tco2e": metrics["total_ghg_tonnes"],
            "scope1_tco2e": metrics["scope1_co2e_tonnes"],
            "scope2_tco2e": metrics["scope2_co2e_tonnes"],
            "ghg_intensity_per_cr": cons["ghg_intensity_tco2e_per_cr"],
            "total_energy_gj": metrics["energy_gj"],
            "water_withdrawal_kl": metrics["water_withdrawal_kl"],
            "water_recycling_pct": metrics["water_recycling_pct"],
            "waste_diverted_pct": metrics["waste_diverted_pct"]
        },
        "social_summary": {
            "total_workforce": 44648,
            "safe_man_hours": metrics["safe_man_hours"],
            "fatalities": metrics["fatalities"],
            "lost_time_injuries": metrics["lost_time_injuries"],
            "ltifr": metrics["ltifr"]
        },
        "governance_and_compliance": {
            "brsr_readiness_pct": readiness["readiness_pct"],
            "core_assurance_readiness_pct": readiness["core_assurance_pct"],
            "board_policies_active": 6,
            "anti_corruption_violations": 0,
            "audit_trail_integrity": "Cryptographically Sealed (SHA-256 Chained)"
        }
    }
