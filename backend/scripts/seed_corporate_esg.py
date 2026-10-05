import sys
import os
from datetime import datetime, timezone

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.core.database import SessionLocal
from app.models.procurement import Supplier, ProcurementMetric
from app.models.governance import GovernancePolicy, EthicsGrievance
from app.models.csr_projects import (
    CsrProgramCategory, CsrProject, CsrSpendRecord,
    BeneficiaryGroup, BeneficiaryRecord, Community
)

def seed_corporate_esg_data():
    db = SessionLocal()
    try:
        # ── 1. Seed Governance Policies (BRSR Principle 1, Section B) ──
        policies = [
            ("POL-ETH-01", "Code of Conduct & Business Ethics Charter", "Ethics & Anti-Corruption", True, "2024-04-10", "https://meil.in/governance/code-of-conduct.pdf", 100.0),
            ("POL-ABC-02", "Anti-Bribery and Anti-Corruption Policy", "Ethics & Anti-Corruption", True, "2024-04-10", "https://meil.in/governance/anti-bribery.pdf", 100.0),
            ("POL-WB-03", "Whistle-Blower & Vigil Mechanism Policy", "Whistleblower", True, "2024-05-15", "https://meil.in/governance/whistleblower.pdf", 100.0),
            ("POL-HR-04", "Human Rights and Equal Opportunity Policy", "Human Rights", True, "2024-04-10", "https://meil.in/governance/human-rights.pdf", 100.0),
            ("POL-POSH-05", "Prevention of Sexual Harassment (POSH) Charter", "POSH", True, "2024-03-20", "https://meil.in/governance/posh-policy.pdf", 100.0),
            ("POL-ENV-06", "Environmental, Biodiversity & Climate Change Policy", "Environment", True, "2024-04-10", "https://meil.in/governance/environmental-policy.pdf", 100.0)
        ]

        for code, title, cat, approved, app_date, link, cov in policies:
            pol = db.query(GovernancePolicy).filter(GovernancePolicy.policy_code == code).first()
            if not pol:
                pol = GovernancePolicy(
                    policy_code=code,
                    title=title,
                    category=cat,
                    board_approved=approved,
                    approval_date=app_date,
                    weblink=link,
                    coverage_pct=cov,
                    grievance_redressal_defined=True
                )
                db.add(pol)

        # Ethics Grievances
        eg = db.query(EthicsGrievance).filter(EthicsGrievance.reporting_period_id == "period-2025-09").first()
        if not eg:
            eg = EthicsGrievance(
                reporting_period_id="period-2025-09",
                category="Anti-Corruption & Conflict of Interest",
                complaints_received=0,
                complaints_resolved=0,
                complaints_pending=0,
                resolution_pct=100.0,
                remarks="Zero corruption or anti-competitive conduct violations reported during the period."
            )
            db.add(eg)

        # ── 2. Seed Responsible Procurement & Suppliers (BRSR Principle 2, 8) ──
        suppliers_data = [
            ("VEND-STEEL-01", "Tata Steel Limited", "Direct Materials", False, "Non-MSME", "Jharkhand", 1240.5, "Audited", 92.5, True, True),
            ("VEND-CEM-02", "UltraTech Cement Limited", "Direct Materials", False, "Non-MSME", "Andhra Pradesh", 890.0, "Audited", 88.0, True, True),
            ("VEND-PIPE-03", "Jindal SAW Limited", "Direct Materials", False, "Non-MSME", "Gujarat", 640.2, "Audited", 85.5, True, False),
            ("VEND-MSME-04", "Sri Balaji Precision Valves & Fabricators", "Direct Materials", True, "Small", "Telangana", 42.8, "Audited", 81.0, True, True),
            ("VEND-MSME-05", "Suraksha Safety Equipments & PPE", "Services", True, "Micro", "Maharashtra", 18.4, "Audited", 86.0, False, True),
            ("VEND-LOG-06", "VRL Logistics & Heavy Haulage", "Logistics", False, "Non-MSME", "Karnataka", 112.5, "Scheduled", 74.0, False, False)
        ]

        for vcode, vname, cat, is_msme, mtype, state, spend, audit_status, esg_sc, iso14, iso45 in suppliers_data:
            s = db.query(Supplier).filter(Supplier.vendor_code == vcode).first()
            if not s:
                s = Supplier(
                    vendor_code=vcode,
                    name=vname,
                    category=cat,
                    is_msme=is_msme,
                    msme_type=mtype,
                    state=state,
                    annual_spend_inr_cr=spend,
                    esg_audit_status=audit_status,
                    esg_score=esg_sc,
                    iso_14001_certified=iso14,
                    iso_45001_certified=iso45
                )
                db.add(s)

        # Procurement Metrics for period
        pm = db.query(ProcurementMetric).filter(ProcurementMetric.reporting_period_id == "period-2025-09").first()
        if not pm:
            pm = ProcurementMetric(
                reporting_period_id="period-2025-09",
                total_procurement_spend_cr=2944.4,
                msme_spend_cr=61.2,
                msme_spend_pct=2.08,
                local_sourcing_pct=88.5, # 88.5% within India
                suppliers_audited_count=5,
                total_active_suppliers=450
            )
            db.add(pm)

        # ── 3. Seed CSR & Community Investment (BRSR Principle 8, Section 135) ──
        cat_water = db.query(CsrProgramCategory).filter(CsrProgramCategory.name == "Safe Drinking Water & Sanitation").first()
        if not cat_water:
            cat_water = CsrProgramCategory(
                name="Safe Drinking Water & Sanitation",
                description="Community RO purification plants and water distribution in remote project vicinities"
            )
            db.add(cat_water)
            db.flush()

        cat_health = db.query(CsrProgramCategory).filter(CsrProgramCategory.name == "Community Healthcare & Rural Medical Camps").first()
        if not cat_health:
            cat_health = CsrProgramCategory(
                name="Community Healthcare & Rural Medical Camps",
                description="Mobile health clinics, diagnostic screenings, and emergency medical camps in remote Himalayan and tribal zones"
            )
            db.add(cat_health)
            db.flush()

        # CSR Projects
        prj_water = db.query(CsrProject).filter(CsrProject.project_code == "CSR-MEIL-WTR-01").first()
        if not prj_water:
            prj_water = CsrProject(
                project_code="CSR-MEIL-WTR-01",
                name="Polavaram Vicinity Clean Drinking Water Initiative",
                category_id=cat_water.id,
                objective="Deliver safe, potable fluorosis-free drinking water to 45 tribal hamlets around Godavari basin.",
                subsidiary_id="sub-meil-core",
                business_unit_id="bu-water",
                location="Polavaram, Eluru District, Andhra Pradesh",
                start_date="2024-04-01",
                end_date="2027-03-31",
                budget=24.5,
                status="Active",
                reporting_period_id="period-2025-09"
            )
            db.add(prj_water)
            db.flush()

            # Spend record
            spend1 = CsrSpendRecord(
                project_id=prj_water.id,
                period="period-2025-09",
                amount=3.85,
                description="Installation of 4 new 2000 LPH RO water dispensing kiosks and pipeline extension",
                transaction_date="2025-09-18"
            )
            db.add(spend1)

        prj_health = db.query(CsrProject).filter(CsrProject.project_code == "CSR-MEIL-HLT-02").first()
        if not prj_health:
            prj_health = CsrProject(
                project_code="CSR-MEIL-HLT-02",
                name="Zojila Tunnel High-Altitude Health Clinic & Ambulance",
                category_id=cat_health.id,
                objective="Provide emergency high-altitude medical care, oxygen therapy, and free OPD to Baltal and Sonamarg local communities.",
                subsidiary_id="sub-meil-core",
                business_unit_id="bu-tunnels",
                location="Baltal / Sonamarg, Ganderbal District, J&K",
                start_date="2023-10-01",
                end_date="2026-12-31",
                budget=14.0,
                status="Active",
                reporting_period_id="period-2025-09"
            )
            db.add(prj_health)
            db.flush()

            spend2 = CsrSpendRecord(
                project_id=prj_health.id,
                period="period-2025-09",
                amount=1.92,
                description="Monthly mobile medical van fuel, doctors honorarium, and essential life-saving medicine distribution",
                transaction_date="2025-09-22"
            )
            db.add(spend2)

        # Beneficiaries
        bg = db.query(BeneficiaryGroup).filter(BeneficiaryGroup.name == "Tribal & Rural Communities").first()
        if not bg:
            bg = BeneficiaryGroup(
                name="Tribal & Rural Communities",
                category="Local Community",
                description="Indigenous families and daily wage earners residing within 15km of operational project sites"
            )
            db.add(bg)
            db.flush()

        b_rec = db.query(BeneficiaryRecord).filter(BeneficiaryRecord.project_id == prj_water.id).first()
        if not b_rec:
            b_rec = BeneficiaryRecord(
                project_id=prj_water.id,
                beneficiary_group_id=bg.id,
                count=18500,
                period="period-2025-09",
                source="Gram Panchayat Roster & Smart Card Logs",
                status="Verified"
            )
            db.add(b_rec)

        db.commit()
        print("Corporate ESG data seeded successfully (Governance, Procurement, CSR)!")
    except Exception as e:
        db.rollback()
        print(f"Error seeding corporate ESG data: {e}")
        raise
    finally:
        db.close()

if __name__ == "__main__":
    seed_corporate_esg_data()
