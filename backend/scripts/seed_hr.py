import sys
import os
from datetime import datetime, timezone

# Ensure backend root is on python path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.core.database import SessionLocal, engine, Base
import app.models
from app.models.hr import (
    WorkforceRecord,
    TrainingRecord,
    WellbeingRecord,
    PoshGrievanceRecord,
    HREvidenceRecord,
    HRSubmissionRecord
)
from app.models.audit import AuditLog

def seed_hr():
    print("Creating HR tables if not exist...")
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    try:
        # Check if HR records already exist
        if db.query(WorkforceRecord).first():
            print("HR records already seeded. Skipping.")
            return

        print("Seeding MEIL HR & Workforce Intelligence Records...")

        # 1. Workforce Demographics across Employee Grade Categories (SEBI BRSR P3)
        categories = [
            {"cat": "Board of Directors", "male": 12, "female": 2, "perm": 14, "cont": 0, "pwd": 0, "turn": 0.0},
            {"cat": "Key Managerial Personnel (KMP)", "male": 36, "female": 6, "perm": 42, "cont": 0, "pwd": 0, "turn": 2.4},
            {"cat": "Senior Management & GMs", "male": 238, "female": 42, "perm": 280, "cont": 0, "pwd": 2, "turn": 3.8},
            {"cat": "Engineering & Project Managers", "male": 3310, "female": 510, "perm": 3820, "cont": 0, "pwd": 18, "turn": 5.2},
            {"cat": "Permanent Technical & Supervisory Staff", "male": 8482, "female": 1520, "perm": 10002, "cont": 0, "pwd": 68, "turn": 6.4},
            {"cat": "Contractual EPC Site Workers", "male": 24410, "female": 4240, "perm": 0, "cont": 28650, "pwd": 54, "turn": 7.8},
            {"cat": "Trainees & Apprentices (NATS / NAPS)", "male": 1460, "female": 380, "perm": 1840, "cont": 0, "pwd": 8, "turn": 4.1},
        ]

        for c in categories:
            total = c["male"] + c["female"]
            rec = WorkforceRecord(
                subsidiary_name="MEIL Group of Companies",
                category=c["cat"],
                male_count=c["male"],
                female_count=c["female"],
                other_count=0,
                total_count=total,
                permanent_count=c["perm"],
                contractual_count=c["cont"],
                differently_abled_count=c["pwd"],
                turnover_rate_pct=c["turn"],
                reporting_period="FY 2026-27"
            )
            db.add(rec)

        # 2. Training Sessions Register (BRSR P3 Indicator 8)
        trainings = [
            {"title": "Zojila Tunnel Sub-Zero Safety Protocol & Hypothermia First Aid", "cat": "Health & Safety", "sub": "MEIL Core EPC", "att": 480, "hrs": 8.0, "date": "28 Sep 2026", "status": "Verified"},
            {"title": "POSH & Workplace Dignity Refresher for Engineers & Managers", "cat": "POSH & Human Rights", "sub": "Olectra Greentech", "att": 210, "hrs": 4.0, "date": "24 Sep 2026", "status": "Verified"},
            {"title": "City Gas High-Pressure Transmission Line SOP & HAZOP", "cat": "Technical & SOP", "sub": "Megha Gas", "att": 145, "hrs": 12.0, "date": "21 Sep 2026", "status": "Verified"},
            {"title": "Automated Rig Hydraulics & Top-Drive Safety Certification", "cat": "Technical & SOP", "sub": "Drillmec India", "att": 88, "hrs": 16.0, "date": "18 Sep 2026", "status": "Verified"},
            {"title": "Confined Space Ventilation & Toxic Gas Escape Protocols", "cat": "Health & Safety", "sub": "MEIL Core Infrastructure", "att": 350, "hrs": 6.0, "date": "14 Sep 2026", "status": "Verified"},
            {"title": "EV Battery Pack Thermal Runway & High-Voltage Handling", "cat": "Technical & SOP", "sub": "Olectra Greentech", "att": 120, "hrs": 8.0, "date": "10 Sep 2026", "status": "Verified"},
            {"title": "Site Environmental Impact & C&D Waste Circularity", "cat": "Environmental Compliance", "sub": "MEIL Group All Sites", "att": 540, "hrs": 4.0, "date": "05 Sep 2026", "status": "Verified"},
        ]

        for t in trainings:
            tr = TrainingRecord(
                title=t["title"],
                category=t["cat"],
                subsidiary_name=t["sub"],
                attendees_count=t["att"],
                hours=t["hrs"],
                trainer="Certified Technical Faculty",
                date_logged=t["date"],
                status=t["status"]
            )
            db.add(tr)

        # 3. Wellbeing & Social Security
        wb = WellbeingRecord(
            subsidiary_name="MEIL Core Infrastructure & EPC",
            health_insurance_pct=98.2,
            accident_insurance_pct=100.0,
            maternity_retention_pct=98.4,
            paternity_takeup_pct=100.0,
            annual_medical_screenings=41200,
            creche_compliant=True,
            reporting_period="FY 2026-27"
        )
        db.add(wb)

        # 4. POSH & Fair Wages Register (BRSR P5)
        posh = PoshGrievanceRecord(
            reporting_period="FY 2026-27",
            complaints_filed=4,
            complaints_investigated=4,
            complaints_resolved=4,
            complaints_pending=0,
            wage_parity_ratio=1.00,
            statutory_minimum_multiplier=1.28,
            child_labour_incidents=0,
            forced_labour_incidents=0
        )
        db.add(posh)

        # 5. Statutory Evidence Documents
        evidence = [
            {"code": "DOC-EPF-01", "title": "EPFO Monthly Electronic Challan cum Return (ECR) Receipt", "cat": "Social Security", "sub": "MEIL Core Infrastructure & EPC", "ref": "TRRN-1012609048291", "date": "15 Sep 2026", "size": "2.4 MB PDF", "ver": "EPFO Unified Portal API"},
            {"code": "DOC-ESI-02", "title": "ESIC Monthly Contribution Form 5 Challan", "cat": "Social Security", "sub": "Olectra Greentech Limited", "ref": "ESIC-TS-5000012489", "date": "12 Sep 2026", "size": "1.8 MB PDF", "ver": "ESIC Regional Office Hyderabad"},
            {"code": "DOC-POSH-03", "title": "ICC POSH Statutory Annual Inquiries & Closure Audit", "cat": "Human Rights", "sub": "MEIL Group (HQ & All Sites)", "ref": "ICC-MEIL-POSH-2026-04", "date": "28 Sep 2026", "size": "4.2 MB PDF", "ver": "District Officer & External NGO Advocate"},
            {"code": "DOC-FWA-04", "title": "Bureau Veritas Fair Wage & Remuneration Audit Certificate", "cat": "Wages & Parity", "sub": "MEIL Group of Companies", "ref": "BV-IN-FWA-88421", "date": "20 Sep 2026", "size": "3.1 MB PDF", "ver": "Bureau Veritas India"},
            {"code": "DOC-OHC-05", "title": "Occupational Health Center (OHC) Annual Medical Screenings", "cat": "Wellbeing", "sub": "MEIL Core (Polavaram & Zojila)", "ref": "OHC-MED-41200-LOG", "date": "25 Sep 2026", "size": "5.6 MB PDF", "ver": "Chief Medical Officer (CMO)"},
            {"code": "DOC-SA-06", "title": "SA8000 Child Labour & Forced Labour Zero-Incident Certificate", "cat": "Human Rights", "sub": "All 258+ Project Sites", "ref": "SA8K-IN-2026-991", "date": "10 Sep 2026", "size": "2.1 MB PDF", "ver": "Social Accountability International Auditor"},
        ]

        for e in evidence:
            doc = HREvidenceRecord(
                doc_code=e["code"],
                title=e["title"],
                category=e["cat"],
                subsidiary_name=e["sub"],
                ref_no=e["ref"],
                date_issued=e["date"],
                file_size=e["size"],
                status="Statutory Verified",
                verifier=e["ver"],
                hash_sha256="sha256:7f8b9c0d1e2f3a4b"
            )
            db.add(doc)

        # 6. Statutory Filings & Submissions
        submissions = [
            {"code": "SUB-BRSR-P3", "title": "SEBI BRSR Principle 3 Workforce & Human Rights Annexure", "auth": "SEBI / Board ESG Committee", "due": "30 Sep 2026", "sub": "28 Sep 2026", "app": "Dr. Sunita Raman (HR Director)", "stat": "Verified & Approved", "ref": "BRSR-P3-MEIL-2026-Q2"},
            {"code": "SUB-EPFO-ECR", "title": "EPFO Electronic Challan cum Return (ECR Monthly Filing)", "auth": "Central Provident Fund Commissioner", "due": "15 Oct 2026", "sub": "02 Oct 2026", "app": "Payroll & Statutory Compliance Cell", "stat": "Acknowledged", "ref": "EPFO-ECR-TS-998124"},
            {"code": "SUB-ESIC-F5", "title": "ESIC Form 5 Half-Yearly Contribution Return", "auth": "Employees State Insurance Corporation", "due": "11 Nov 2026", "sub": "Draft Ready", "app": "Statutory Compliance Lead", "stat": "Pending Submission", "ref": "ESIC-HY-2026-02"},
            {"code": "SUB-FACT-22", "title": "Annual Return under Factories Act 1948 (Form 22)", "auth": "Chief Inspector of Factories (TS & AP)", "due": "31 Jan 2027", "sub": "Scheduled", "app": "Group Legal & Labor Lead", "stat": "Scheduled", "ref": "FACT-RET-2026-FY"},
            {"code": "SUB-POSH-DO", "title": "Statutory Annual Report to District Officer (POSH Section 21)", "auth": "District Officer & Women Development Dept", "due": "31 Jan 2027", "sub": "28 Sep 2026", "app": "Internal Complaints Committee Presiding Officer", "stat": "Statutory Closed", "ref": "POSH-DO-HYD-2026-01"},
        ]

        for s in submissions:
            sub = HRSubmissionRecord(
                sub_code=s["code"],
                title=s["title"],
                authority=s["auth"],
                due_date=s["due"],
                submitted_date=s["sub"],
                approver=s["app"],
                status=s["stat"],
                ref_id=s["ref"]
            )
            db.add(sub)

        # Audit event
        audit = AuditLog(
            actor_id="user-hr-director",
            actor_name="Sunita Raman",
            actor_role="HR_OFFICER",
            action="HR_STATUTORY_DATA_SEEDED",
            entity_type="WorkforceRecord",
            entity_id="init-hr-01",
            details="Seeded initial MEIL HR workforce demographics, training sessions, wellbeing, POSH, evidence, and statutory filings."
        )
        db.add(audit)

        db.commit()
        print("Successfully seeded MEIL HR & Workforce Intelligence records into database!")

    except Exception as e:
        db.rollback()
        print(f"Error seeding HR data: {e}")
        raise
    finally:
        db.close()

if __name__ == "__main__":
    seed_hr()
