import sys
import os
from datetime import datetime, timezone, timedelta
import uuid

# Ensure backend root is on python path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.core.database import SessionLocal
from app.models.organization import Group, Subsidiary, BusinessUnit, Project
from app.models.reporting import ReportingPeriod, Submission
from app.models.esg_records import FuelRecord, EnergyRecord, WaterRecord, WasteRecord, SafetyRecord
from app.models.evidence import EvidenceDocument, EvidenceLink
from app.models.workflow import ApprovalAction, SubmissionVersion
from app.models.audit import AuditLog

def seed_bu_coordinator_workspace_data():
    db = SessionLocal()
    try:
        print("Seeding BU Coordinator (Tunnels BU) Workspace Data...")

        # 1. Ensure Reporting Period
        period = db.query(ReportingPeriod).filter(ReportingPeriod.id == "period-2025-09").first()
        if not period:
            period = ReportingPeriod(
                id="period-2025-09",
                name="September 2026",
                financial_year="2026-2027",
                start_date=datetime(2026, 9, 1).date(),
                end_date=datetime(2026, 9, 30).date(),
                is_active=True,
                is_locked=False
            )
            db.add(period)
            db.flush()
        else:
            # Update name to September 2026 as per review cycle reference
            period.name = "September 2026"
            db.flush()

        # 2. Ensure Subsidiary & BU
        sub_core = db.query(Subsidiary).filter(Subsidiary.id == "sub-meil-core").first()
        if not sub_core:
            sub_core = Subsidiary(
                id="sub-meil-core",
                group_id="meil-group-hq",
                name="MEIL Core Infrastructure & Engineering Division",
                code="MEIL-INFRA",
                sector="EPC & Heavy Civil Infrastructure",
                meil_ownership_pct=100.0,
                turnover_inr_cr=22140.0
            )
            db.add(sub_core)
            db.flush()

        bu_tunnels = db.query(BusinessUnit).filter(BusinessUnit.id == "bu-tunnels").first()
        if not bu_tunnels:
            bu_tunnels = BusinessUnit(
                id="bu-tunnels",
                subsidiary_id=sub_core.id,
                name="Highways, Bridges & Himalayan Tunnels",
                code="BU-TUNNELS",
                lead_name="R. K. Sharma, VP - Strategic Infra"
            )
            db.add(bu_tunnels)
            db.flush()

        # 3. Seed 6 Landmark Projects under bu-tunnels
        projects_def = [
            ("site-102", "Zojila High-Altitude Road Tunnel (14.15 km)", "SITE-ZOJILA-01", "Sonamarg-Minamarg, J&K / Ladakh", 34.298, 75.485, "Harpal Singh", "Tenzin Dorjey"),
            ("site-gayatri-link", "Gayatri Tunnel Link & Pump System", "PRJ-GAYATRI-02", "Medaram, Telangana", 18.724, 79.912, "V. R. Krishna Murthy", "Suresh Panyam"),
            ("site-test-tunnel-b", "Atal Tunnel Extension Site (Tunnel B)", "PRJ-TUNNEL-B", "Rohtang Pass, Himachal Pradesh", 32.365, 77.168, "Col. Parikshit Mehra", "K. S. Dogra"),
            ("site-river-link", "River Link Diversion Tunnel Aqueduct", "PRJ-RIVER-01", "Prakasam Barrage, Andhra Pradesh", 16.512, 80.621, "M. Venkat Rao", "S. Mehta"),
            ("site-metro-p1", "Metro Phase 1 Underground Corridor", "PRJ-METRO-01", "Hyderabad Central Corridor, Telangana", 17.385, 78.486, "K. Chandrashekhar", "A. Verma"),
            ("site-expressway", "Expressway Twin Tube Tunnel", "PRJ-EXP-01", "Mumbai-Nagpur Samruddhi Corridor", 19.076, 72.877, "R. S. Solanki", "M. Deshmukh"),
        ]

        projects = {}
        for pid, pname, pcode, ploc, lat, lon, pdir, peso in projects_def:
            p = db.query(Project).filter(Project.id == pid).first()
            if not p:
                p = Project(
                    id=pid,
                    subsidiary_id=sub_core.id,
                    business_unit_id=bu_tunnels.id,
                    name=pname,
                    code=pcode,
                    location=ploc,
                    country="India",
                    project_type="Tunnels & Highway Infrastructure",
                    status="Active",
                    project_director=pdir,
                    site_esg_officer=peso,
                    latitude=lat,
                    longitude=lon
                )
                db.add(p)
                db.flush()
            else:
                p.business_unit_id = bu_tunnels.id
                p.name = pname
                p.code = pcode
                p.location = ploc
                p.project_director = pdir
                p.site_esg_officer = peso
                db.flush()
            projects[pid] = p

        # 4. Clean previous submissions under these 6 projects for clean seed
        project_ids = list(projects.keys())
        existing_subs = db.query(Submission).filter(
            Submission.project_id.in_(project_ids),
            Submission.reporting_period_id == "period-2025-09"
        ).all()
        for s in existing_subs:
            db.delete(s)
        db.flush()

        # 5. Create primary reference submission: SUB-2026-091 (Zojila Tunnel)
        # Exactly matching Screen 3: SUB-2026-091, Zojila Tunnel, Sep 2026, v3, Tenzin Dorjey (28 Sep 2026, 16:42), SUBMITTED
        now = datetime(2026, 9, 28, 16, 42, tzinfo=timezone.utc)
        sub_zojila = Submission(
            id="SUB-2026-091",
            project_id="site-102",
            reporting_period_id="period-2025-09",
            status="SUBMITTED",
            version=3,
            submitted_by="Tenzin Dorjey",
            submitted_at=now,
            created_at=now - timedelta(days=2),
            updated_at=now
        )
        db.add(sub_zojila)
        db.flush()

        # Child records for SUB-2026-091
        # Energy: Electricity Grid 85,000 kWh, Renewable Solar 17,200 kWh, Scope 2 60.12 tCO2e
        db.add(EnergyRecord(
            submission_id=sub_zojila.id,
            project_id="site-102",
            reporting_period_id="period-2025-09",
            energy_source="Grid Electricity",
            quantity_kwh=85000.0,
            renewable_kwh=17200.0,
            scope2_co2e_tonnes=60.86,
            energy_gj=367.92
        ))
        # Fuel: Diesel 12,000 L, Factor 2.68, Scope 1 32.16 tCO2e
        db.add(FuelRecord(
            submission_id=sub_zojila.id,
            project_id="site-102",
            reporting_period_id="period-2025-09",
            fuel_type="Diesel",
            quantity=12000.0,
            unit="L",
            scope1_co2e_tonnes=32.16,
            factor_id="ef-diesel-in",
            factor_version="v19"
        ))
        # Water: 65,000 KL withdrawal, 12,400 KL recycled
        db.add(WaterRecord(
            submission_id=sub_zojila.id,
            project_id="site-102",
            reporting_period_id="period-2025-09",
            source_type="Surface Water / Mountain Stream",
            withdrawal_kl=65000.0,
            recycled_kl=12400.0,
            discharged_kl=45000.0
        ))
        # Waste: 84.5 MT, 52.0 MT diverted
        db.add(WasteRecord(
            submission_id=sub_zojila.id,
            project_id="site-102",
            reporting_period_id="period-2025-09",
            waste_category="Excavated Rock & Debris",
            quantity_metric_tonnes=84.5,
            disposal_route="Crushed Aggregate Recycled in Road Base",
            diverted_from_disposal_pct=61.5
        ))
        # Safety: 450,000 safe hours, 0 LTI, 0 fatalities
        db.add(SafetyRecord(
            submission_id=sub_zojila.id,
            project_id="site-102",
            reporting_period_id="period-2025-09",
            safe_man_hours=450000.0,
            lost_time_injuries=0,
            fatalities=0,
            near_misses=3
        ))

        # Evidence Document for SUB-2026-091
        ev_invoice = EvidenceDocument(
            id="ev-sub-091-diesel",
            project_id="site-102",
            reporting_period_id="period-2025-09",
            filename="Diesel_Invoice_Sep26.pdf",
            file_path="backend/storage/evidence/Diesel_Invoice_Sep26.pdf",
            file_size_bytes=125430,
            mime_type="application/pdf",
            sha256_hash="7a3d8b12f45c90e3ab1234cd5678ef90123456789abcdef0123456789abcdef0",
            document_type="Invoice",
            module="Fuel / GHG",
            related_record="Diesel 12,000 L Batch #ZOJ-881",
            uploaded_by="user-site-zojila",
            uploaded_by_name="Tenzin Dorjey",
            status="Verified",
            is_verified=True,
            verified_by="R. K. Sharma (BU Coordinator)",
            verification_notes="Verified against Indian Oil bulk tanker meter slip.",
            version="v3.0"
        )
        db.add(ev_invoice)
        db.flush()

        db.add(EvidenceLink(
            document_id=ev_invoice.id,
            source_record_type="FuelRecord",
            source_record_id=sub_zojila.id,
            link_type="DIRECT_PROOF"
        ))

        # 6. Seed Remaining 36 Submissions to reach exact 37 total:
        # Breakdown: 24 Approved, 8 Pending Review (including SUB-2026-091), 3 Correction Required, 2 SLA At Risk
        sample_configs = [
            # Pending Review (7 more to make 8 total)
            ("SUB-2026-081", "site-gayatri-link", "SUBMITTED", 1, "Suresh Panyam", 18, 92.0, "Passed", "Low"),
            ("SUB-2026-075", "site-river-link", "SUBMITTED", 2, "S. Mehta", 22, 95.0, "Passed", "Low"),
            ("SUB-2026-071", "site-metro-p1", "SUBMITTED", 1, "A. Verma", 36, 88.0, "Passed", "Medium"),
            ("SUB-2026-068", "site-expressway", "SUBMITTED", 1, "M. Deshmukh", 40, 91.0, "Passed", "Low"),
            ("SUB-2026-065", "site-102", "SUBMITTED", 2, "Tenzin Dorjey", 14, 94.0, "Passed", "Low"),
            ("SUB-2026-062", "site-test-tunnel-b", "SUBMITTED", 1, "K. S. Dogra", 30, 89.0, "Passed", "Low"),
            ("SUB-2026-059", "site-gayatri-link", "SUBMITTED", 1, "Suresh Panyam", 26, 93.0, "Passed", "Low"),

            # SLA At Risk (2 submissions)
            ("SUB-2026-087", "site-gayatri-link", "SUBMITTED", 1, "Suresh Panyam", 6, 82.0, "Passed", "Medium"),
            ("SUB-2026-084", "site-test-tunnel-b", "SUBMITTED", 2, "K. S. Dogra", -2, 72.0, "Issues", "High"),

            # Correction Required (3 submissions)
            ("SUB-2026-058", "site-river-link", "CORRECTION_REQUIRED", 2, "S. Mehta", 14, 85.0, "Passed", "Low"),
            ("SUB-2026-051", "site-metro-p1", "CORRECTION_REQUIRED", 1, "A. Verma", 28, 79.0, "Issues", "Medium"),
            ("SUB-2026-047", "site-test-tunnel-b", "CORRECTION_REQUIRED", 1, "K. S. Dogra", 10, 68.0, "Issues", "High"),

            # Approved (24 submissions)
            ("SUB-2026-082", "site-metro-p1", "BU_APPROVED", 1, "A. Verma", 0, 96.0, "Passed", "Low"),
            ("SUB-2026-048", "site-expressway", "BU_APPROVED", 1, "M. Deshmukh", 0, 99.0, "Passed", "Low"),
            ("SUB-2026-041", "site-102", "BU_APPROVED", 2, "Tenzin Dorjey", 0, 100.0, "Passed", "Low"),
            ("SUB-2026-039", "site-gayatri-link", "BU_APPROVED", 1, "Suresh Panyam", 0, 98.0, "Passed", "Low"),
            ("SUB-2026-038", "site-river-link", "BU_APPROVED", 1, "S. Mehta", 0, 97.0, "Passed", "Low"),
            ("SUB-2026-037", "site-test-tunnel-b", "BU_APPROVED", 1, "K. S. Dogra", 0, 95.0, "Passed", "Low"),
            ("SUB-2026-036", "site-102", "BU_APPROVED", 1, "Tenzin Dorjey", 0, 98.0, "Passed", "Low"),
            ("SUB-2026-035", "site-metro-p1", "BU_APPROVED", 2, "A. Verma", 0, 96.0, "Passed", "Low"),
            ("SUB-2026-034", "site-expressway", "BU_APPROVED", 1, "M. Deshmukh", 0, 98.0, "Passed", "Low"),
            ("SUB-2026-033", "site-gayatri-link", "BU_APPROVED", 1, "Suresh Panyam", 0, 94.0, "Passed", "Low"),
            ("SUB-2026-032", "site-river-link", "BU_APPROVED", 1, "S. Mehta", 0, 95.0, "Passed", "Low"),
            ("SUB-2026-031", "site-test-tunnel-b", "BU_APPROVED", 2, "K. S. Dogra", 0, 92.0, "Passed", "Low"),
            ("SUB-2026-030", "site-102", "BU_APPROVED", 1, "Tenzin Dorjey", 0, 97.0, "Passed", "Low"),
            ("SUB-2026-029", "site-metro-p1", "BU_APPROVED", 1, "A. Verma", 0, 96.0, "Passed", "Low"),
            ("SUB-2026-028", "site-expressway", "BU_APPROVED", 2, "M. Deshmukh", 0, 99.0, "Passed", "Low"),
            ("SUB-2026-027", "site-gayatri-link", "BU_APPROVED", 1, "Suresh Panyam", 0, 95.0, "Passed", "Low"),
            ("SUB-2026-026", "site-river-link", "BU_APPROVED", 1, "S. Mehta", 0, 96.0, "Passed", "Low"),
            ("SUB-2026-025", "site-test-tunnel-b", "BU_APPROVED", 1, "K. S. Dogra", 0, 94.0, "Passed", "Low"),
            ("SUB-2026-024", "site-102", "BU_APPROVED", 2, "Tenzin Dorjey", 0, 98.0, "Passed", "Low"),
            ("SUB-2026-023", "site-metro-p1", "BU_APPROVED", 1, "A. Verma", 0, 95.0, "Passed", "Low"),
            ("SUB-2026-022", "site-expressway", "BU_APPROVED", 1, "M. Deshmukh", 0, 97.0, "Passed", "Low"),
            ("SUB-2026-021", "site-gayatri-link", "BU_APPROVED", 2, "Suresh Panyam", 0, 96.0, "Passed", "Low"),
            ("SUB-2026-020", "site-river-link", "BU_APPROVED", 1, "S. Mehta", 0, 98.0, "Passed", "Low"),
            ("SUB-2026-019", "site-test-tunnel-b", "BU_APPROVED", 1, "K. S. Dogra", 0, 93.0, "Passed", "Low"),
        ]

        for sid, spid, sstatus, sversion, sby, sla_h, comp, val_stat, risk in sample_configs:
            s_time = datetime(2026, 9, 20, 10, 0, tzinfo=timezone.utc) + timedelta(hours=len(sid))
            sub = Submission(
                id=sid,
                project_id=spid,
                reporting_period_id="period-2025-09",
                status=sstatus,
                version=sversion,
                submitted_by=sby,
                submitted_at=s_time,
                reviewed_by="R. K. Sharma" if sstatus != "SUBMITTED" else None,
                reviewed_at=s_time + timedelta(hours=2) if sstatus != "SUBMITTED" else None,
                approved_by="R. K. Sharma" if sstatus == "BU_APPROVED" else None,
                approved_at=s_time + timedelta(hours=3) if sstatus == "BU_APPROVED" else None,
                rejection_reason="Evidence document missing weighbridge calibration stamp." if sstatus == "CORRECTION_REQUIRED" else None,
                created_at=s_time - timedelta(days=1),
                updated_at=s_time
            )
            db.add(sub)
            db.flush()

            # Seed fuel & energy records so consolidation calculations have rich values
            db.add(FuelRecord(
                submission_id=sub.id,
                project_id=spid,
                reporting_period_id="period-2025-09",
                fuel_type="Diesel",
                quantity=8000.0 + (int(sid[-2:]) * 150),
                unit="L",
                scope1_co2e_tonnes=round((8000.0 + (int(sid[-2:]) * 150)) * 0.00268, 2),
                factor_id="ef-diesel-in",
                factor_version="v19"
            ))
            db.add(EnergyRecord(
                submission_id=sub.id,
                project_id=spid,
                reporting_period_id="period-2025-09",
                energy_source="Grid Electricity",
                quantity_kwh=45000.0 + (int(sid[-2:]) * 800),
                renewable_kwh=10000.0 + (int(sid[-2:]) * 200),
                scope2_co2e_tonnes=round((45000.0 + (int(sid[-2:]) * 800)) * 0.000716, 2),
                energy_gj=250.0
            ))
            db.add(WaterRecord(
                submission_id=sub.id,
                project_id=spid,
                reporting_period_id="period-2025-09",
                source_type="Surface Water",
                withdrawal_kl=25000.0 + (int(sid[-2:]) * 300),
                recycled_kl=5000.0 + (int(sid[-2:]) * 80),
                discharged_kl=18000.0
            ))
            db.add(WasteRecord(
                submission_id=sub.id,
                project_id=spid,
                reporting_period_id="period-2025-09",
                waste_category="Excavated Soil & Slag",
                quantity_metric_tonnes=35.0 + (int(sid[-2:]) * 0.5),
                disposal_route="Reused in Fill",
                diverted_from_disposal_pct=75.0
            ))
            db.add(SafetyRecord(
                submission_id=sub.id,
                project_id=spid,
                reporting_period_id="period-2025-09",
                safe_man_hours=250000.0 + (int(sid[-2:]) * 2000),
                lost_time_injuries=0 if risk == "Low" else 1,
                fatalities=0,
                near_misses=1
            ))

        # 7. Seed Evidence Documents matching Evidence Center screen
        evidences_data = [
            ("ev-01", "site-102", "Diesel_Invoice.pdf", "Invoice", "Fuel / GHG", "SUB-2026-091", "Tenzin Dorjey", "7a3d...1f0f", "Verified", True),
            ("ev-02", "site-gayatri-link", "Grid_Bill_Sep.pdf", "Energy Bill", "Energy", "SUB-2026-081", "Suresh Panyam", "9e21...4ba2", "Verified", True),
            ("ev-03", "site-gayatri-link", "Pumphouse_Flow.xlsx", "Water Flow Log", "Water", "SUB-2026-087", "Suresh Panyam", "1b4c...98de", "Pending", False),
            ("ev-04", "site-river-link", "Water_Report.docx", "Inspection Doc", "Water", "SUB-2026-058", "S. Mehta", "b41c...964a", "Pending", False),
            ("ev-05", "site-test-tunnel-b", "Waste_Manifest.pdf", "Hazardous Waste", "Waste", "SUB-2026-084", "K. S. Dogra", "3d8a...2ade", "Rejected", False),
            ("ev-06", "site-metro-p1", "Safety_Report.pdf", "Audit Certificate", "Safety", "SUB-2026-082", "A. Verma", "6c31...8a1a", "Verified", True),
            ("ev-07", "site-expressway", "Weighbridge_Slip.pdf", "Weight Slip", "Waste", "SUB-2026-048", "M. Deshmukh", "8e41...12cf", "Verified", True),
            ("ev-08", "site-102", "DG_Set_Logbook.xlsx", "Logbook", "Fuel / GHG", "SUB-2026-065", "Tenzin Dorjey", "5c12...49e1", "Verified", True),
            ("ev-09", "site-test-tunnel-b", "Ventilation_Shaft_Air.pdf", "Emissions Cert", "Environment", "SUB-2026-037", "K. S. Dogra", "2a9f...7b3c", "Verified", True),
            ("ev-10", "site-river-link", "Aqueduct_Concrete_Test.pdf", "Quality Report", "Procurement", "SUB-2026-038", "S. Mehta", "4f8c...1a2d", "Verified", True),
            ("ev-11", "site-metro-p1", "Tunnel_Boring_Log.pdf", "Operational Log", "Energy", "SUB-2026-035", "A. Verma", "7d2b...91e3", "Verified", True),
            ("ev-12", "site-expressway", "Solar_Generation_Cert.pdf", "Renewable Cert", "Energy", "SUB-2026-034", "M. Deshmukh", "1c4a...8f9e", "Verified", True),
            ("ev-13", "site-102", "Sub_Zero_Concrete_Curing.pdf", "Material Cert", "Waste", "SUB-2026-041", "Tenzin Dorjey", "9b3d...2e4f", "Verified", True),
            ("ev-14", "site-gayatri-link", "Canal_Discharge_Water.pdf", "Water Quality", "Water", "SUB-2026-039", "Suresh Panyam", "3e8a...5c1b", "Verified", True)
        ]

        for evid, epid, efname, edoctype, emod, esubid, eupby, ehash, estat, eisver in evidences_data:
            existing_ev = db.query(EvidenceDocument).filter(EvidenceDocument.id == evid).first()
            if not existing_ev:
                ev_doc = EvidenceDocument(
                    id=evid,
                    project_id=epid,
                    reporting_period_id="period-2025-09",
                    filename=efname,
                    file_path=f"backend/storage/evidence/{efname}",
                    file_size_bytes=84200,
                    mime_type="application/pdf" if efname.endswith(".pdf") else "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                    sha256_hash=ehash if len(ehash) > 20 else f"{ehash}0000000000000000000000000000000000000000",
                    document_type=edoctype,
                    module=emod,
                    related_record=f"Submission {esubid}",
                    uploaded_by="site.officer@meilgroup.in",
                    uploaded_by_name=eupby,
                    status=estat,
                    is_verified=eisver,
                    verified_by="R. K. Sharma (BU Coordinator)" if eisver else None,
                    verification_notes="Verified against statutory logbook." if eisver else ("Weighbridge seal missing" if estat == "Rejected" else "Pending verification"),
                    version="v1.0"
                )
                db.add(ev_doc)

        db.commit()
        print("BU Coordinator Workspace Seed completed successfully: 6 Projects, 37 Submissions, 14 Evidence files!")
    except Exception as e:
        db.rollback()
        print(f"Error seeding BU Coordinator data: {e}")
        raise
    finally:
        db.close()

if __name__ == "__main__":
    seed_bu_coordinator_workspace_data()
