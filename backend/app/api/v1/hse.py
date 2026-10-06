from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime, timezone
import hashlib

from app.core.database import get_db
from app.models.hse import (
    HseIncident,
    HseInspection,
    HseCorrectiveAction,
    HseTrainingBatch,
    HseEnvironmentalRecord,
    HseEvidenceRecord,
    HseSubmissionRecord
)
from app.models.audit import AuditLog
from app.models.user import User
from app.api.deps import get_current_user, require_permission
from app.services.audit_service import AuditService
from app.schemas.hse import (
    HseIncidentCreate,
    HseIncidentResponse,
    HseInspectionCreate,
    HseInspectionResponse,
    HseCorrectiveActionCreate,
    HseCorrectiveActionResponse,
    HseTrainingBatchCreate,
    HseTrainingBatchResponse,
    HseEnvironmentalRecordCreate,
    HseEnvironmentalRecordResponse,
    HseEvidenceCreate,
    HseEvidenceResponse,
    HseSubmissionCreate,
    HseSubmissionResponse,
    HseOverviewResponse
)

router = APIRouter(prefix="/hse", tags=["Environment, Health & Safety (EHS)"])

# ── SEED DATA GENERATOR ──
def seed_initial_hse_records(db: Session):
    if db.query(HseIncident).first() is not None:
        return

    # Seed Incidents
    incidents = [
        HseIncident(
            incident_number="INC-2026-081",
            project_name="Zojila Tunnel Project",
            location="Portal 2 - East Ventilation Shaft",
            type="Near Miss",
            severity="Medium",
            description="Rock boulder displacement during early morning stabilization drilling. Retaining wire caught loose rock before impact.",
            people_affected=0,
            injury=False,
            lti=False,
            fatality=False,
            immediate_action="Exclusion perimeter extended to 35 meters; geotechnical acoustic survey completed.",
            root_cause="Hydrostatic seepage pressure along shear plane following freeze-thaw cycle.",
            corrective_action="Install additional self-drilling rock anchors at 1.5m spacing with fiber reinforced shotcrete.",
            responsible_owner="G. Ramanujam (Rock Mechanics Head)",
            status="Investigation",
            incident_date="2026-09-24",
            incident_time="08:45 AM",
            target_date="2026-10-02",
            evidence_ref="EVD-GEO-2026-04"
        ),
        HseIncident(
            incident_number="INC-2026-079",
            project_name="Hyderabad Metro Phase 2 Extension",
            location="Pier 142 - Miyapur Substation",
            type="Injury",
            severity="Low",
            description="Subcontractor electrician sustained 1st degree thermal contact blister on thumb while tightening transformer terminal lug without rated insulated gloves.",
            people_affected=1,
            injury=True,
            lti=False,
            fatality=False,
            immediate_action="First-aid burn gel applied on-site; worker sent for prophylactic clinic review and certified fit for light duty.",
            root_cause="Failure to follow mandatory PPE checklist before entering high-voltage enclosure.",
            corrective_action="Mandatory re-induction and 100% lock-out tag-out (LOTO) toolbox verification prior to shift start.",
            responsible_owner="K. Venkat (Site HSE Lead)",
            status="Corrective Action",
            incident_date="2026-09-21",
            incident_time="02:15 PM",
            target_date="2026-09-28",
            evidence_ref="EVD-MED-2026-19"
        ),
        HseIncident(
            incident_number="INC-2026-074",
            project_name="Olectra EV Mega Plant - Phase 1",
            location="Bus Chassis Robotic Weld Cell 3",
            type="Near Miss",
            severity="High",
            description="Light curtain sensor safety interlock trip delayed by 1.2 seconds due to particulate accumulation on optical receiver lens.",
            people_affected=0,
            injury=False,
            lti=False,
            fatality=False,
            immediate_action="Robotic arm cell immediately powered down to safe stop; daily lens air-purge SOP introduced.",
            root_cause="Optical sensor housing lacked pressurized positive-air purge shroud in heavy weld-spatter zone.",
            corrective_action="Retrofit dry nitrogen positive-pressure purge kits across all 18 robotic weld cells.",
            responsible_owner="M. S. Reddy (Automation Safety Lead)",
            status="Verification",
            incident_date="2026-09-18",
            incident_time="11:10 AM",
            target_date="2026-09-30",
            evidence_ref="EVD-AUT-2026-08"
        ),
        HseIncident(
            incident_number="INC-2026-068",
            project_name="Polavaram Dam Project",
            location="Spillway Block 28 Scaffolding",
            type="Safety Observation",
            severity="Low",
            description="Scaffolding toe-board displacement noted during routine morning patrol. Guardrail intact.",
            people_affected=0,
            injury=False,
            lti=False,
            fatality=False,
            immediate_action="Toe-board clamped in place immediately with certified steel scaffolding couplers.",
            root_cause="Vibration from adjacent concrete transit mixer loosened standard clamp.",
            corrective_action="Switch to double-bolt heavy duty anti-vibration clamps on all spillway piers.",
            responsible_owner="C. H. Prasad (Civil Safety Officer)",
            status="Closed",
            incident_date="2026-09-12",
            incident_time="09:30 AM",
            target_date="2026-09-13",
            evidence_ref="EVD-SCF-2026-31"
        )
    ]
    for inc in incidents:
        db.add(inc)

    # Seed Inspections
    inspections = [
        HseInspection(
            inspection_number="INSP-2026-104",
            project_name="Zojila Tunnel Project",
            type="Site HSE Inspection",
            inspector="Rajeshwar K.",
            scheduled_date="2026-09-28",
            completed_date="2026-09-28",
            status="Findings Recorded",
            score=91.5,
            findings_count=2,
            checklist_summary="Tunnel ventilation airflow passed at 124 m3/s (norm >100 m3/s). Gas detectors calibrated. Emergency refuges inspected."
        ),
        HseInspection(
            inspection_number="INSP-2026-101",
            project_name="Hyderabad Metro Phase 2 Extension",
            type="Safety Inspection",
            inspector="A. B. Chari",
            scheduled_date="2026-09-25",
            completed_date="2026-09-25",
            status="Completed",
            score=96.0,
            findings_count=0,
            checklist_summary="All 24 scaffolding towers green-tagged. Fall arrest harnesses load-tested. LOTO register 100% compliant."
        ),
        HseInspection(
            inspection_number="INSP-2026-098",
            project_name="Olectra EV Mega Plant - Phase 1",
            type="Environmental Inspection",
            inspector="Dr. S. Mukherjee",
            scheduled_date="2026-09-22",
            completed_date="2026-09-22",
            status="Completed",
            score=94.0,
            findings_count=1,
            checklist_summary="Hazardous waste drum secondary containment passed. ETP treated water pH 7.2 (ZLD benchmark 6.5-8.5)."
        ),
        HseInspection(
            inspection_number="INSP-2026-110",
            project_name="Megha Gas CGD Network - Krishna",
            type="Permit/Compliance Inspection",
            inspector="P. R. Mohan",
            scheduled_date="2026-10-06",
            completed_date=None,
            status="Scheduled",
            score=0.0,
            findings_count=0,
            checklist_summary="Quarterly PNGRB gas odorization and high-pressure steel pipeline cathodic protection audit."
        )
    ]
    for insp in inspections:
        db.add(insp)

    # Seed Corrective Actions
    actions = [
        HseCorrectiveAction(
            action_number="CAPA-2026-042",
            source_type="Incident",
            source_id="INC-2026-081",
            project_name="Zojila Tunnel Project",
            issue="Loose rock boulder displacement at ventilation shaft",
            description="Install additional rock anchors with fiber reinforced shotcrete layer",
            priority="Critical",
            owner="G. Ramanujam",
            due_date="2026-10-02",
            status="In Progress",
            verification_status="Pending",
            evidence_ref="EVD-GEO-2026-04"
        ),
        HseCorrectiveAction(
            action_number="CAPA-2026-039",
            source_type="Incident",
            source_id="INC-2026-074",
            project_name="Olectra EV Mega Plant - Phase 1",
            issue="Optical safety interlock light curtain delay",
            description="Retrofit positive-pressure dry air purge shrouds on all 18 robotic weld cells",
            priority="High",
            owner="M. S. Reddy",
            due_date="2026-09-30",
            status="Pending Verification",
            verification_status="Submitted",
            evidence_ref="EVD-AUT-2026-08"
        ),
        HseCorrectiveAction(
            action_number="CAPA-2026-035",
            source_type="Inspection",
            source_id="INSP-2026-104",
            project_name="Zojila Tunnel Project",
            issue="Secondary dust suppression water nozzle clogged at Ch. 12+400",
            description="Replace bronze spray nozzles with carbide high-pressure anti-clog mist nozzles",
            priority="Medium",
            owner="S. K. Verma",
            due_date="2026-10-05",
            status="Open",
            verification_status="Pending",
            evidence_ref=None
        ),
        HseCorrectiveAction(
            action_number="CAPA-2026-028",
            source_type="Incident",
            source_id="INC-2026-068",
            project_name="Polavaram Dam Project",
            issue="Scaffolding toe-board displacement from vibration",
            description="Installed double-bolt heavy duty anti-vibration clamps",
            priority="Low",
            owner="C. H. Prasad",
            due_date="2026-09-13",
            status="Verified",
            verification_status="Approved",
            evidence_ref="EVD-SCF-2026-31"
        )
    ]
    for act in actions:
        db.add(act)

    # Seed Training Batches
    trainings = [
        HseTrainingBatch(
            batch_number="TRN-2026-118",
            topic="High-Altitude Cold Climate Underground Safety & Hypoxia Protocol",
            type="Safety Induction",
            mandatory=True,
            trainer="Dr. Col. K. S. Rathore (Retd.)",
            project_name="Zojila Tunnel Project",
            location="Site Safety Induction Center - Minamarg",
            date_logged="2026-09-26",
            participants_count=84,
            hours=4.0,
            status="Completed",
            evidence_ref="EVD-TRN-2026-44"
        ),
        HseTrainingBatch(
            batch_number="TRN-2026-112",
            topic="High Voltage LOTO & Arc-Flash Safety Induction",
            type="PPE",
            mandatory=True,
            trainer="S. T. Raghavan (Certified Electrical Safety Specialist)",
            project_name="Hyderabad Metro Phase 2 Extension",
            location="Depot Training Hall - Uppal",
            date_logged="2026-09-23",
            participants_count=62,
            hours=2.5,
            status="Completed",
            evidence_ref="EVD-TRN-2026-38"
        ),
        HseTrainingBatch(
            batch_number="TRN-2026-105",
            topic="Daily Pre-Shift Toolbox Talk: Deep Excavation Trench Shoring",
            type="Toolbox Talk",
            mandatory=True,
            trainer="K. Venkat",
            project_name="Hyderabad Metro Phase 2 Extension",
            location="Site Pier 142",
            date_logged="2026-09-27",
            participants_count=145,
            hours=0.5,
            status="Completed",
            evidence_ref="EVD-TBT-2026-92"
        ),
        HseTrainingBatch(
            batch_number="TRN-2026-099",
            topic="Emergency Spill Response & Battery Electrolyte Handling",
            type="Emergency Response",
            mandatory=True,
            trainer="Dr. S. Mukherjee",
            project_name="Olectra EV Mega Plant - Phase 1",
            location="Assembly Bay 2",
            date_logged="2026-09-20",
            participants_count=78,
            hours=3.0,
            status="Completed",
            evidence_ref="EVD-TRN-2026-29"
        )
    ]
    for trn in trainings:
        db.add(trn)

    # Seed Environmental Records
    env_records = [
        HseEnvironmentalRecord(
            project_name="Polavaram Dam Project",
            reporting_period="September 2026",
            module="Water",
            category="Industrial Water Withdrawal (Godavari River)",
            quantity=14200.0,
            unit="kL",
            source="SCADA Ultrasonic Flowmeter #F-102",
            status="Compliant",
            evidence_ref="EVD-WTR-2026-09",
            date_logged="2026-09-27"
        ),
        HseEnvironmentalRecord(
            project_name="Polavaram Dam Project",
            reporting_period="September 2026",
            module="Water",
            category="Treated Wastewater Recycled (ZLD Facility)",
            quantity=12410.0,
            unit="kL",
            source="ZLD Meter #R-04 (87.4% Recycling Ratio)",
            status="Compliant",
            evidence_ref="EVD-ZLD-2026-09",
            date_logged="2026-09-27"
        ),
        HseEnvironmentalRecord(
            project_name="Olectra EV Mega Plant - Phase 1",
            reporting_period="September 2026",
            module="Waste",
            category="Hazardous Waste Form 10 (Used Oil & Paint Sludge)",
            quantity=18.4,
            unit="MT",
            source="TSDF Manifest CPCB Authorized Transporter",
            status="Compliant",
            evidence_ref="EVD-HAZ-2026-03",
            date_logged="2026-09-24"
        ),
        HseEnvironmentalRecord(
            project_name="Polavaram Dam Project",
            reporting_period="September 2026",
            module="CAAQMS",
            category="Continuous Ambient Air Quality - PM10",
            quantity=64.8,
            unit="µg/m³",
            source="CPCB Live Telemetry Stack #AQ-01 (Limit: 100 µg/m³)",
            status="Compliant",
            evidence_ref="EVD-AIR-2026-11",
            date_logged="2026-09-28"
        ),
        HseEnvironmentalRecord(
            project_name="Polavaram Dam Project",
            reporting_period="September 2026",
            module="CAAQMS",
            category="Continuous Ambient Air Quality - PM2.5",
            quantity=24.2,
            unit="µg/m³",
            source="CPCB Live Telemetry Stack #AQ-01 (Limit: 60 µg/m³)",
            status="Compliant",
            evidence_ref="EVD-AIR-2026-11",
            date_logged="2026-09-28"
        )
    ]
    for rec in env_records:
        db.add(rec)

    # Seed Evidence
    evidence_docs = [
        HseEvidenceRecord(
            doc_number="EVD-GEO-2026-04",
            title="Geotechnical Acoustic Sensor & Rock Bolt Displacement Analysis",
            category="Incident Report",
            project_name="Zojila Tunnel Project",
            source_entity="INC-2026-081",
            source_id="INC-2026-081",
            file_name="Zojila_EastShaft_AcousticSurvey_24Sep.pdf",
            file_size="3.2 MB",
            status="Verified",
            uploaded_by="Rajeshwar K.",
            uploaded_at="2026-09-25",
            hash_sha256="e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
        ),
        HseEvidenceRecord(
            doc_number="EVD-INSP-2026-104",
            title="ISO 45001 & DGMS Statutory Tunnel Inspection Checklist Sign-Off",
            category="Inspection Checklist",
            project_name="Zojila Tunnel Project",
            source_entity="INSP-2026-104",
            source_id="INSP-2026-104",
            file_name="DGMS_Tunnel_StatutoryChecklist_Signed.pdf",
            file_size="2.4 MB",
            status="Verified",
            uploaded_by="Rajeshwar K.",
            uploaded_at="2026-09-28",
            hash_sha256="4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a"
        ),
        HseEvidenceRecord(
            doc_number="EVD-HAZ-2026-03",
            title="CPCB Hazardous Waste Form 10 Consignment Manifest",
            category="Environmental Manifest",
            project_name="Olectra EV Mega Plant - Phase 1",
            source_entity="Waste",
            source_id="Olectra",
            file_name="CPCB_Form10_HazardousWaste_Consignment.pdf",
            file_size="1.9 MB",
            status="Verified",
            uploaded_by="Dr. S. Mukherjee",
            uploaded_at="2026-09-24",
            hash_sha256="ef2d127de37b942baad06145e54b0c619a1f22327b2ebbcfbec78f5564afe39d"
        ),
        HseEvidenceRecord(
            doc_number="EVD-TRN-2026-44",
            title="High Altitude Hypoxia Protocol Attendance & Biometric Log (84 Personnel)",
            category="Training Attendance",
            project_name="Zojila Tunnel Project",
            source_entity="TRN-2026-118",
            source_id="TRN-2026-118",
            file_name="Zojila_Induction_BiometricRoster_Batch118.pdf",
            file_size="4.1 MB",
            status="Verified",
            uploaded_by="Rajeshwar K.",
            uploaded_at="2026-09-26",
            hash_sha256="c7be1ed902fb8dd4b4064195a522c2f16f3d26f6fc471f88e64ef4d6473d8769"
        )
    ]
    for evd in evidence_docs:
        db.add(evd)

    # Seed Submissions
    submissions = [
        HseSubmissionRecord(
            submission_number="SUB-HSE-2026-09",
            module="Zero-Harm HSE & DGMS Monthly Statutory Return",
            project_name="All MEIL Projects (258+ Sites)",
            reporting_period="September 2026",
            submitted_by="Rajeshwar K.",
            submitted_on="2026-09-28",
            status="Under Review",
            reviewer="Dr. P. V. Krishna Rao (Group Director HSE)",
            total_items=18,
            last_updated="2026-09-28 17:30",
            remarks="Covers safe man-hours (14.2M), zero fatalities, LTIFR 0.22, and 100% DGMS audit compliance."
        ),
        HseSubmissionRecord(
            submission_number="SUB-CPCB-2026-Q2",
            module="CPCB Environment & Hazardous Waste Form 10 Return",
            project_name="Olectra EV Mega Plant - Phase 1",
            reporting_period="Q2 FY 2026-27",
            submitted_by="Rajeshwar K.",
            submitted_on="2026-09-25",
            status="Approved",
            reviewer="Telangana State Pollution Control Board",
            total_items=6,
            last_updated="2026-09-26 11:20",
            remarks="Zero discharge to natural waterbodies; 18.4 MT hazardous paint sludge dispatched to authorized TSDF."
        ),
        HseSubmissionRecord(
            submission_number="SUB-BRSR-P6-2026",
            module="SEBI BRSR Principle 6 HSE & Decarbonization Annexure",
            project_name="MEIL Group Headquarters",
            reporting_period="FY 2026-27 (H1)",
            submitted_by="Rajeshwar K.",
            submitted_on="2026-09-22",
            status="Validated",
            reviewer="Corporate Secretarial & Audit Committee",
            total_items=32,
            last_updated="2026-09-24 16:45",
            remarks="CEA India Grid Baseline v19 (0.716 kg CO2e/kWh) verified across Scope 2 calculations."
        )
    ]
    for sub in submissions:
        db.add(sub)

    db.commit()

# ── 1. HSE Overview Summary ──
@router.get("/overview", response_model=HseOverviewResponse)
def get_hse_overview(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    seed_initial_hse_records(db)
    
    total_inc = db.query(HseIncident).count()
    high_risk_inc = db.query(HseIncident).filter(HseIncident.severity.in_(["Critical", "High"])).filter(HseIncident.status != "Closed").count()
    lti_count = db.query(HseIncident).filter(HseIncident.lti == True).count()
    fatality_count = db.query(HseIncident).filter(HseIncident.fatality == True).count()
    
    overdue_actions = db.query(HseCorrectiveAction).filter(HseCorrectiveAction.status == "Overdue").count()
    
    return HseOverviewResponse(
        total_incidents=total_inc,
        incidents_trend_pct=-8.5,
        open_high_risk_incidents=high_risk_inc,
        lost_time_injuries=lti_count,
        fatalities=fatality_count,
        safe_man_hours_million=14.2,
        ltifr_rate=0.22,
        safety_training_coverage_pct=92.4,
        inspection_completion_pct=87.5,
        overdue_corrective_actions=overdue_actions if overdue_actions > 0 else 0,
        water_recycled_pct=87.4,
        net_ghg_footprint_tco2e=148290.0,
        cea_grid_baseline_factor=0.716,
        renewable_energy_share_pct=34.6,
        active_sites_count=258
    )

# ── 2. Incidents ──
@router.get("/incidents", response_model=List[HseIncidentResponse])
def get_incidents(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    seed_initial_hse_records(db)
    return db.query(HseIncident).order_by(HseIncident.created_at.desc()).all()

@router.post("/incidents", response_model=HseIncidentResponse)
def create_incident(
    incident_in: HseIncidentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_permission("ehs:manage"))
):
    count = db.query(HseIncident).count() + 1
    inc_num = f"INC-2026-{str(count).zfill(3)}"
    
    new_inc = HseIncident(
        incident_number=inc_num,
        project_name=incident_in.project_name,
        location=incident_in.location,
        type=incident_in.type,
        severity=incident_in.severity,
        description=incident_in.description,
        people_affected=incident_in.people_affected,
        injury=incident_in.injury,
        lti=incident_in.lti,
        fatality=incident_in.fatality,
        immediate_action=incident_in.immediate_action,
        root_cause=incident_in.root_cause,
        corrective_action=incident_in.corrective_action,
        responsible_owner=incident_in.responsible_owner or current_user.full_name,
        incident_date=incident_in.incident_date,
        incident_time=incident_in.incident_time,
        target_date=incident_in.target_date,
        evidence_ref=incident_in.evidence_ref,
        status="Reported"
    )
    db.add(new_inc)
    db.commit()
    db.refresh(new_inc)

    AuditService.log_event(
        db=db,
        actor_id=current_user.id,
        actor_name=current_user.full_name,
        actor_role=current_user.role.name if current_user.role else "EHS_OFFICER",
        action="CREATE_INCIDENT",
        entity_type="HseIncident",
        entity_id=new_inc.id,
        details=f"Reported incident {new_inc.incident_number}: {new_inc.type} at {new_inc.project_name}"
    )

    return new_inc

@router.patch("/incidents/{incident_id}/status")
def update_incident_status(
    incident_id: str,
    status: str = Query(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_permission("ehs:manage"))
):
    inc = db.query(HseIncident).filter(HseIncident.id == incident_id).first()
    if not inc:
        raise HTTPException(status_code=404, detail="Incident not found")
    old_status = inc.status
    inc.status = status
    db.commit()

    AuditService.log_event(
        db=db,
        actor_id=current_user.id,
        actor_name=current_user.full_name,
        actor_role=current_user.role.name if current_user.role else "EHS_OFFICER",
        action="UPDATE_INCIDENT_STATUS",
        entity_type="HseIncident",
        entity_id=inc.id,
        old_state=old_status,
        new_state=status
    )

    return {"status": "success", "new_status": status, "incident_number": inc.incident_number}

# ── 3. Inspections ──
@router.get("/inspections", response_model=List[HseInspectionResponse])
def get_inspections(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    seed_initial_hse_records(db)
    return db.query(HseInspection).order_by(HseInspection.scheduled_date.desc()).all()

@router.post("/inspections", response_model=HseInspectionResponse)
def create_inspection(
    insp_in: HseInspectionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_permission("ehs:manage"))
):
    count = db.query(HseInspection).count() + 1
    insp_num = f"INSP-2026-{str(count).zfill(3)}"
    
    new_insp = HseInspection(
        inspection_number=insp_num,
        project_name=insp_in.project_name,
        type=insp_in.type,
        inspector=insp_in.inspector or current_user.full_name,
        scheduled_date=insp_in.scheduled_date,
        status=insp_in.status,
        score=insp_in.score,
        checklist_summary=insp_in.checklist_summary
    )
    db.add(new_insp)
    db.commit()
    db.refresh(new_insp)

    AuditService.log_event(
        db=db,
        actor_id=current_user.id,
        actor_name=current_user.full_name,
        actor_role=current_user.role.name if current_user.role else "EHS_OFFICER",
        action="CREATE_INSPECTION",
        entity_type="HseInspection",
        entity_id=new_insp.id,
        details=f"Created inspection {new_insp.inspection_number} for {new_insp.project_name}"
    )

    return new_insp

# ── 4. Corrective Actions (CAPA) ──
@router.get("/corrective-actions", response_model=List[HseCorrectiveActionResponse])
def get_corrective_actions(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    seed_initial_hse_records(db)
    return db.query(HseCorrectiveAction).order_by(HseCorrectiveAction.created_at.desc()).all()

@router.post("/corrective-actions", response_model=HseCorrectiveActionResponse)
def create_corrective_action(
    capa_in: HseCorrectiveActionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_permission("ehs:manage"))
):
    count = db.query(HseCorrectiveAction).count() + 1
    act_num = f"CAPA-2026-{str(count).zfill(3)}"
    
    new_act = HseCorrectiveAction(
        action_number=act_num,
        source_type=capa_in.source_type,
        source_id=capa_in.source_id,
        project_name=capa_in.project_name,
        issue=capa_in.issue,
        description=capa_in.description,
        priority=capa_in.priority,
        owner=capa_in.owner or current_user.full_name,
        due_date=capa_in.due_date,
        status="Open",
        evidence_ref=capa_in.evidence_ref
    )
    db.add(new_act)
    db.commit()
    db.refresh(new_act)

    AuditService.log_event(
        db=db,
        actor_id=current_user.id,
        actor_name=current_user.full_name,
        actor_role=current_user.role.name if current_user.role else "EHS_OFFICER",
        action="CREATE_CORRECTIVE_ACTION",
        entity_type="HseCorrectiveAction",
        entity_id=new_act.id,
        details=f"Logged CAPA {new_act.action_number}: {new_act.issue}"
    )

    return new_act

@router.patch("/corrective-actions/{action_id}/status")
def update_action_status(
    action_id: str,
    status: str = Query(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_permission("ehs:manage"))
):
    act = db.query(HseCorrectiveAction).filter(HseCorrectiveAction.id == action_id).first()
    if not act:
        raise HTTPException(status_code=404, detail="Action not found")
    old_status = act.status
    act.status = status
    if status in ["Closed", "Verified"]:
        act.verification_status = "Approved"
        act.closed_at = datetime.now(timezone.utc)
    db.commit()

    AuditService.log_event(
        db=db,
        actor_id=current_user.id,
        actor_name=current_user.full_name,
        actor_role=current_user.role.name if current_user.role else "EHS_OFFICER",
        action="UPDATE_ACTION_STATUS",
        entity_type="HseCorrectiveAction",
        entity_id=act.id,
        old_state=old_status,
        new_state=status
    )

    return {"status": "success", "new_status": status, "action_number": act.action_number}

# ── 5. Training Batches ──
@router.get("/training", response_model=List[HseTrainingBatchResponse])
def get_training_batches(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    seed_initial_hse_records(db)
    return db.query(HseTrainingBatch).order_by(HseTrainingBatch.date_logged.desc()).all()

@router.post("/training/batches", response_model=HseTrainingBatchResponse)
def create_training_batch(
    trn_in: HseTrainingBatchCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_permission("ehs:manage"))
):
    count = db.query(HseTrainingBatch).count() + 1
    batch_num = f"TRN-2026-{str(count).zfill(3)}"
    
    new_trn = HseTrainingBatch(
        batch_number=batch_num,
        topic=trn_in.topic,
        type=trn_in.type,
        mandatory=trn_in.mandatory,
        trainer=trn_in.trainer or current_user.full_name,
        project_name=trn_in.project_name,
        location=trn_in.location,
        date_logged=trn_in.date_logged,
        participants_count=trn_in.participants_count,
        hours=trn_in.hours,
        status="Completed",
        evidence_ref=trn_in.evidence_ref
    )
    db.add(new_trn)
    db.commit()
    db.refresh(new_trn)

    AuditService.log_event(
        db=db,
        actor_id=current_user.id,
        actor_name=current_user.full_name,
        actor_role=current_user.role.name if current_user.role else "EHS_OFFICER",
        action="CREATE_HSE_TRAINING_BATCH",
        entity_type="HseTrainingBatch",
        entity_id=new_trn.id,
        details=f"Completed training batch {new_trn.batch_number}: {new_trn.topic} ({new_trn.participants_count} attendees)"
    )

    return new_trn

# ── 6. Environmental Records ──
@router.get("/environmental", response_model=List[HseEnvironmentalRecordResponse])
def get_environmental_records(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    seed_initial_hse_records(db)
    return db.query(HseEnvironmentalRecord).order_by(HseEnvironmentalRecord.date_logged.desc()).all()

@router.post("/environmental", response_model=HseEnvironmentalRecordResponse)
def create_environmental_record(
    env_in: HseEnvironmentalRecordCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_permission("ehs:manage"))
):
    new_env = HseEnvironmentalRecord(
        project_name=env_in.project_name,
        reporting_period="September 2026",
        module=env_in.module,
        category=env_in.category,
        quantity=env_in.quantity,
        unit=env_in.unit,
        source=env_in.source,
        status=env_in.status,
        evidence_ref=env_in.evidence_ref,
        date_logged=env_in.date_logged
    )
    db.add(new_env)
    db.commit()
    db.refresh(new_env)

    AuditService.log_event(
        db=db,
        actor_id=current_user.id,
        actor_name=current_user.full_name,
        actor_role=current_user.role.name if current_user.role else "EHS_OFFICER",
        action="CREATE_ENVIRONMENTAL_RECORD",
        entity_type="HseEnvironmentalRecord",
        entity_id=new_env.id,
        details=f"Logged {new_env.module} {new_env.quantity} {new_env.unit} for {new_env.project_name}"
    )

    return new_env

# ── 7. Evidence Records ──
@router.get("/evidence", response_model=List[HseEvidenceResponse])
def get_evidence_records(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    seed_initial_hse_records(db)
    return db.query(HseEvidenceRecord).order_by(HseEvidenceRecord.uploaded_at.desc()).all()

@router.post("/evidence", response_model=HseEvidenceResponse)
def create_evidence_record(
    evd_in: HseEvidenceCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_permission("ehs:manage"))
):
    count = db.query(HseEvidenceRecord).count() + 1
    doc_num = f"EVD-HSE-2026-{str(count).zfill(2)}"
    
    actual_hash = hashlib.sha256(evd_in.file_name.encode()).hexdigest()
    
    new_evd = HseEvidenceRecord(
        doc_number=doc_num,
        title=evd_in.title,
        category=evd_in.category,
        project_name=evd_in.project_name,
        source_entity=evd_in.source_entity,
        source_id=evd_in.source_id,
        file_name=evd_in.file_name,
        file_size=evd_in.file_size,
        status="Verified",
        uploaded_by=current_user.full_name,
        uploaded_at=datetime.now(timezone.utc).strftime("%Y-%m-%d"),
        hash_sha256=actual_hash
    )
    db.add(new_evd)
    db.commit()
    db.refresh(new_evd)

    AuditService.log_event(
        db=db,
        actor_id=current_user.id,
        actor_name=current_user.full_name,
        actor_role=current_user.role.name if current_user.role else "EHS_OFFICER",
        action="CREATE_HSE_EVIDENCE",
        entity_type="HseEvidenceRecord",
        entity_id=new_evd.id,
        details=f"Uploaded HSE evidence {new_evd.doc_number}: {new_evd.title}"
    )

    return new_evd

# ── 8. Submissions ──
@router.get("/submissions", response_model=List[HseSubmissionResponse])
def get_submissions(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    seed_initial_hse_records(db)
    return db.query(HseSubmissionRecord).order_by(HseSubmissionRecord.submitted_on.desc()).all()

@router.post("/submissions", response_model=HseSubmissionResponse)
def create_submission(
    sub_in: HseSubmissionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_permission("ehs:manage"))
):
    count = db.query(HseSubmissionRecord).count() + 1
    sub_num = f"SUB-HSE-2026-{str(count).zfill(2)}"
    now_str = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M")
    
    new_sub = HseSubmissionRecord(
        submission_number=sub_num,
        module=sub_in.module,
        project_name=sub_in.project_name,
        reporting_period=sub_in.reporting_period,
        submitted_by=current_user.full_name,
        submitted_on=datetime.now(timezone.utc).strftime("%Y-%m-%d"),
        status="Under Review",
        reviewer="Dr. P. V. Krishna Rao (Group Director HSE)",
        total_items=14,
        last_updated=now_str,
        remarks=sub_in.remarks
    )
    db.add(new_sub)
    db.commit()
    db.refresh(new_sub)

    AuditService.log_event(
        db=db,
        actor_id=current_user.id,
        actor_name=current_user.full_name,
        actor_role=current_user.role.name if current_user.role else "EHS_OFFICER",
        action="CREATE_HSE_SUBMISSION",
        entity_type="HseSubmissionRecord",
        entity_id=new_sub.id,
        details=f"Filed HSE statutory submission {new_sub.submission_number}"
    )

    return new_sub
