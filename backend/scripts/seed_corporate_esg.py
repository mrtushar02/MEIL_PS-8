import sys
import os
from datetime import datetime, timezone

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.core.database import SessionLocal
from app.models.procurement import (
    Supplier, ProcurementMetric, ProcurementTransaction,
    SupplierAssessment, SupplierRisk, ProcurementAction
)
from app.models.governance import (
    GovernancePolicy, EthicsGrievance, ComplianceObligation,
    InternalControl, GovernanceAssessment, GovernanceAction, CorporateDisclosure
)
from app.models.csr_projects import (
    CsrProgramCategory, CsrProject, CsrSpendRecord,
    BeneficiaryGroup, BeneficiaryRecord, Community,
    CommunityGrievance, Stakeholder, StakeholderEngagement,
    SocialImpactIndicator, SocialImpactRecord, CsrAction
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
            ("POL-ENV-06", "Environmental, Biodiversity & Climate Change Policy", "Environment", True, "2024-04-10", "https://meil.in/governance/environmental-policy.pdf", 100.0),
            ("POL-SEC-07", "Enterprise Information Security & DPDPA Policy", "Governance", True, "2024-06-01", "https://meil.in/governance/cybersecurity.pdf", 100.0),
            ("POL-SCM-08", "Sustainable Supply Chain & MSME Inclusion Charter", "Procurement", True, "2024-05-10", "https://meil.in/governance/supply-chain.pdf", 100.0)
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

        # Governance Obligations
        obligations = [
            ("CO-001", "Annual Board Report & Directors Responsibility Statement", "Legal", "Companies Act 2013", "Adv. S. K. Nair", "2026-09-30", "Compliant", "Verified"),
            ("CO-002", "Mandatory SEBI BRSR & BRSR Core Reasonable Assurance", "ESG", "SEBI Circular 2023/2025", "Adv. S. K. Nair", "2026-11-15", "In Progress", "In Review"),
            ("CO-003", "Third-Party Integrity & Vendor Anti-Corruption Declarations", "Legal", "Prevention of Corruption Act", "Adv. S. K. Nair", "2026-12-31", "Compliant", "Verified"),
            ("CO-004", "Digital Personal Data Protection Act Compliance & Audit", "Governance", "DPDP Act 2023", "Amit Shah", "2026-10-30", "Compliant", "Verified"),
            ("CO-005", "Statutory Labour Law Returns (EPF, ESIC, BOCW, Minimum Wages)", "Social", "Ministry of Labour", "Sunita Raman", "2026-12-31", "Compliant", "Verified"),
            ("CO-006", "Environmental Clearance (EC/CTO) Half-Yearly Compliance Reports", "Environmental", "MoEFCC / CPCB", "Rajeshwar K.", "2026-09-30", "Compliant", "Verified")
        ]
        for code, req, cat, src, own, due, st, ev_st in obligations:
            if not db.query(ComplianceObligation).filter(ComplianceObligation.obligation_code == code).first():
                db.add(ComplianceObligation(
                    obligation_code=code,
                    requirement=req,
                    category=cat,
                    source=src,
                    owner_name=own,
                    due_date=due,
                    status=st,
                    evidence_status=ev_st
                ))

        # Internal Controls
        controls = [
            ("CTR-001", "Automated Vendor Sanction & AML Screening", "Preventive", "CO-003", "Anand Mahindra V.", "2026-09-10", "Pass", "Active"),
            ("CTR-002", "Board Level Related Party Transaction Approval Thresholds", "Detective", "CO-001", "Vikram Joshi", "2026-08-25", "Pass", "Active"),
            ("CTR-003", "Site Worker Biometric Attendance & Minimum Wage Reconciler", "Preventive", "CO-005", "Sunita Raman", "2026-09-18", "Pass", "Active"),
            ("CTR-004", "Continuous Emission & Effluent Monitoring System (CEMS/ZLD)", "Detective", "CO-006", "Rajeshwar K.", "2026-09-22", "Pass", "Active")
        ]
        for ccode, cname, ctype, obcode, cown, ltest, cres, cst in controls:
            if not db.query(InternalControl).filter(InternalControl.control_code == ccode).first():
                db.add(InternalControl(
                    control_code=ccode,
                    name=cname,
                    control_type=ctype,
                    obligation_code=obcode,
                    owner_name=cown,
                    last_test=ltest,
                    result=cres,
                    status=cst
                ))

        # Governance Assessments
        assessments_gov = [
            ("GA-2026-01", "Annual Board Governance & Ethics Compliance Audit", "Board Evaluation", "FY 2025-26", "Completed", 98.5, "100% Group Scope"),
            ("GA-2026-02", "SEBI BRSR Core Value Chain Assurance Readiness Review", "ESG Governance", "H1 FY 2026-27", "Completed", 94.4, "Top 75% Suppliers & Subsidiaries")
        ]
        for gcode, gtitle, gtype, gper, gst, gsc, gcov in assessments_gov:
            if not db.query(GovernanceAssessment).filter(GovernanceAssessment.assessment_code == gcode).first():
                db.add(GovernanceAssessment(
                    assessment_code=gcode,
                    title=gtitle,
                    assessment_type=gtype,
                    period=gper,
                    status=gst,
                    score=gsc,
                    coverage=gcov
                ))

        # Corporate Disclosures
        disclosures = [
            ("DISC-001", "SEBI BRSR Annual Statutory Disclosures (Principles 1-9)", "SEBI BRSR 2021", "Section C", "Approved", "Board Approved"),
            ("DISC-002", "Directors Responsibility Statement & Corporate Governance Return", "Companies Act", "Section A", "Approved", "Board Approved")
        ]
        for dcode, dtype, dfw, dsec, dst, dapp in disclosures:
            if not db.query(CorporateDisclosure).filter(CorporateDisclosure.disclosure_code == dcode).first():
                db.add(CorporateDisclosure(
                    disclosure_code=dcode,
                    disclosure_type=dtype,
                    framework=dfw,
                    section=dsec,
                    status=dst,
                    approval_status=dapp,
                    scope="Consolidated MEIL Group"
                ))

        # Governance Actions
        gov_actions = [
            ("ACT-GOV-01", "Conduct quarterly whistle-blower log review with Audit Committee", "Audit", "High", "Adv. S. K. Nair", "2026-10-15", "Completed", "Verified"),
            ("ACT-GOV-02", "Update cybersecurity data mapping for subcontractors under DPDPA", "Assessment", "Medium", "Amit Shah", "2026-11-01", "In Progress", "Pending")
        ]
        for acode, aissue, asrc, apri, aown, adue, ast, aver in gov_actions:
            if not db.query(GovernanceAction).filter(GovernanceAction.action_code == acode).first():
                db.add(GovernanceAction(
                    action_code=acode,
                    issue=aissue,
                    source=asrc,
                    priority=apri,
                    owner_name=aown,
                    due_date=adue,
                    status=ast,
                    verification=aver
                ))

        # ── 2. Seed Responsible Procurement & Suppliers ──
        suppliers_data = [
            ("VEND-STEEL-01", "Tata Steel Limited", "Direct Materials", False, "Non-MSME", "Jharkhand", 1240.5, "Audited", 92.5, True, True),
            ("VEND-CEM-02", "UltraTech Cement Limited", "Direct Materials", False, "Non-MSME", "Andhra Pradesh", 890.0, "Audited", 88.0, True, True),
            ("VEND-PIPE-03", "Jindal SAW Limited", "Direct Materials", False, "Non-MSME", "Gujarat", 640.2, "Audited", 85.5, True, False),
            ("VEND-MSME-04", "Sri Balaji Precision Valves & Fabricators", "Direct Materials", True, "Small", "Telangana", 42.8, "Audited", 81.0, True, True),
            ("VEND-MSME-05", "Suraksha Safety Equipments & PPE", "Services", True, "Micro", "Maharashtra", 18.4, "Audited", 86.0, False, True),
            ("VEND-LOG-06", "VRL Logistics & Heavy Haulage", "Logistics", False, "Non-MSME", "Karnataka", 112.5, "Scheduled", 74.0, False, False),
            ("VEND-MSME-07", "Kaveri Heavy Engineering & Electricals", "Capital Equipment", True, "Medium", "Tamil Nadu", 54.2, "Audited", 89.0, True, True),
            ("VEND-MSME-08", "Apex Geosynthetic Solutions", "Direct Materials", True, "Small", "Himachal Pradesh", 26.5, "Audited", 84.0, True, False)
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
                total_procurement_spend_cr=3025.1,
                msme_spend_cr=141.9,
                msme_spend_pct=4.69,
                local_sourcing_pct=88.5,
                suppliers_audited_count=7,
                total_active_suppliers=486
            )
            db.add(pm)

        # Procurement Transactions
        transactions = [
            ("PR-2026-001", "01 Sep 2026", "Tata Steel Limited", "Direct Materials", "Zojila Tunnel PKG-2", 12.5, True, False, "Completed"),
            ("PR-2026-002", "03 Sep 2026", "UltraTech Cement Limited", "Direct Materials", "Polavaram Hydro Site", 8.2, True, False, "Completed"),
            ("PR-2026-003", "05 Sep 2026", "Sri Balaji Precision Valves", "Direct Materials", "Megha Gas CGD Network", 3.8, True, True, "Completed"),
            ("PR-2026-004", "08 Sep 2026", "Suraksha Safety Equipments", "Services", "Olectra EV Gigafactory", 1.8, True, True, "Completed"),
            ("PR-2026-005", "12 Sep 2026", "Kaveri Heavy Engineering", "Capital Equipment", "Kaleshwaram Lift Irrigation", 9.6, True, True, "Verified")
        ]
        for tcode, tdate, tsup, tcat, tproj, tamt, tloc, tmsme, tst in transactions:
            if not db.query(ProcurementTransaction).filter(ProcurementTransaction.transaction_code == tcode).first():
                db.add(ProcurementTransaction(
                    transaction_code=tcode,
                    date=tdate,
                    supplier=tsup,
                    category=tcat,
                    project=tproj,
                    amount_cr=tamt,
                    is_local=tloc,
                    is_msme=tmsme,
                    source="ERP",
                    status=tst
                ))

        # Supplier Assessments
        assessments_proc = [
            ("SA-2026-001", "Tata Steel Limited", "General ESG", "18 Aug 2026", 92.5, "Low", "Approved", "18 Aug 2027"),
            ("SA-2026-002", "UltraTech Cement Limited", "Environmental", "12 Aug 2026", 88.0, "Low", "Approved", "12 Aug 2027"),
            ("SA-2026-003", "Sri Balaji Precision Valves", "General ESG", "18 Aug 2026", 81.0, "Low", "Approved", "18 Aug 2027"),
            ("SA-2026-004", "VRL Logistics & Heavy Haulage", "Scope 3 Logistics", "05 Sep 2026", 74.0, "Medium", "In Review", "05 Dec 2026")
        ]
        for sacode, sasup, satype, sadate, sasc, sarisk, sast, sanext in assessments_proc:
            if not db.query(SupplierAssessment).filter(SupplierAssessment.assessment_code == sacode).first():
                db.add(SupplierAssessment(
                    assessment_code=sacode,
                    supplier=sasup,
                    assessment_type=satype,
                    date=sadate,
                    score=sasc,
                    risk_level=sarisk,
                    status=sast,
                    next_review=sanext
                ))

        # Supplier Risks
        risks_proc = [
            ("RSK-001", "VRL Logistics & Heavy Haulage", "Regulatory", "Medium", "Fuel emissions reporting timeline", "Enforce GPS telemetry integration", "Monitored", "Logistics Team"),
            ("RSK-002", "Apex Geosynthetic Solutions", "Supply", "Low", "Monsoon freight delay in hill sectors", "Maintain 45-day on-site safety buffer", "Mitigated", "Procurement Lead")
        ]
        for rcode, rsup, rtype, rlvl, rimp, rmit, rst, rown in risks_proc:
            if not db.query(SupplierRisk).filter(SupplierRisk.risk_code == rcode).first():
                db.add(SupplierRisk(
                    risk_code=rcode,
                    supplier=rsup,
                    risk_type=rtype,
                    level=rlvl,
                    impact=rimp,
                    mitigation=rmit,
                    status=rst,
                    owner=rown
                ))

        # Procurement Actions
        actions_proc = [
            ("ACT-SCM-01", "Tata Steel Limited", "Request ISO 50001 Energy Management verification certificate", "Medium", "Open", "Anand Mahindra V.", "2026-10-20"),
            ("ACT-SCM-02", "Sri Balaji Precision Valves", "Complete MSME prompt payment statutory reconciliation (within 45 days)", "High", "Completed", "Anand Mahindra V.", "2026-09-25")
        ]
        for pacode, pasup, paiss, papri, past, paown, padue in actions_proc:
            if not db.query(ProcurementAction).filter(ProcurementAction.action_code == pacode).first():
                db.add(ProcurementAction(
                    action_code=pacode,
                    supplier=pasup,
                    issue=paiss,
                    priority=papri,
                    status=past,
                    owner=paown,
                    due_date=padue
                ))

        # ── 3. Seed CSR & Community Investment (Section 135) ──
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

        # Communities
        comms = [
            ("Polavaram Tribal Hamlets", "Eluru District", "Andhra Pradesh", 18500, "K. Venkata Rao"),
            ("Baltal & Sonamarg Settlements", "Ganderbal District", "Jammu & Kashmir", 12400, "Mohammad Shafi"),
            ("Uddanam Nephropathy Relief Zone", "Srikakulam District", "Andhra Pradesh", 32000, "Dr. P. Srinivas")
        ]
        for cname, cdist, cst, cpop, cresp in comms:
            if not db.query(Community).filter(Community.name == cname).first():
                db.add(Community(
                    name=cname,
                    district=cdist,
                    state=cst,
                    location=f"{cdist}, {cst}",
                    target_population=cpop,
                    responsible_person=cresp,
                    status="Active"
                ))

        # Community Grievances
        grievances_csr = [
            ("GRV-2026-001", "2026-09-14", "Water Access", "Request to extend piped RO outlet to downstream ST hamlet", "Medium", "Priya Nair", "Resolved", "Additional tap installed at 200m point", "2026-09-21"),
            ("GRV-2026-002", "2026-09-22", "Health Clinic", "Request for bi-weekly pediatrician visits at Baltal mobile dispensary", "Low", "Priya Nair", "Acknowledged", "Pediatrician schedule confirmed for alternate Tuesdays", "2026-10-05")
        ]
        for grcode, grdate, grcat, grdesc, grsev, grown, grst, grres, grdue in grievances_csr:
            if not db.query(CommunityGrievance).filter(CommunityGrievance.grievance_number == grcode).first():
                db.add(CommunityGrievance(
                    grievance_number=grcode,
                    date=grdate,
                    category=grcat,
                    description=grdesc,
                    severity=grsev,
                    owner=grown,
                    status=grst,
                    resolution=grres,
                    due_date=grdue
                ))

        # Stakeholders
        stakeholders = [
            ("Gram Panchayat Council (Polavaram)", "Community", "Polavaram Village Elders", "sarpanch.polavaram@ap.gov.in"),
            ("Sonamarg Traders & Local Transporters Union", "Local Authorities", "Gulzar Ahmed", "union.sonamarg@jk.gov.in")
        ]
        for sname, stype, scontact, semail in stakeholders:
            if not db.query(Stakeholder).filter(Stakeholder.name == sname).first():
                db.add(Stakeholder(
                    name=sname,
                    stakeholder_type=stype,
                    contact_person=scontact,
                    contact_email=semail,
                    status="Active"
                ))

        # Stakeholder Engagements
        engagements = [
            ("Community", "Polavaram Gram Panchayat", "2026-08-28", "RO Water Facility Review & Water Card Distribution", 45, "Enthusiastic support; requested water supply during festival week", "Festival delivery scheduled", "Closed"),
            ("Local Authorities", "Baltal Health Advisory Committee", "2026-09-15", "Pre-Winter High Altitude Medical Camp Planning", 28, "Confirmed oxygen cylinder buffer stock of 120 units", "Winter emergency stock verified", "Closed")
        ]
        for etype, egrp, edate, epurp, epart, efbk, eact, est in engagements:
            if not db.query(StakeholderEngagement).filter(StakeholderEngagement.purpose == epurp).first():
                db.add(StakeholderEngagement(
                    stakeholder_type=etype,
                    stakeholder_group=egrp,
                    date=edate,
                    purpose=epurp,
                    participants=epart,
                    feedback=efbk,
                    action_required=eact,
                    status=est
                ))

        # Social Impact Indicators
        indicators = [
            ("Households with Potable Fluorosis-Free Water", "Direct beneficiary households connected to safe RO pipeline", "households", "Health & Sanitation", "Outcome"),
            ("Emergency High-Altitude Patient Interventions", "Free medical consultations, oxygen therapies, and emergency trauma responses", "patients", "Healthcare", "Output")
        ]
        for iname, idesc, iunit, icat, itype in indicators:
            if not db.query(SocialImpactIndicator).filter(SocialImpactIndicator.name == iname).first():
                db.add(SocialImpactIndicator(
                    name=iname,
                    description=idesc,
                    unit=iunit,
                    category=icat,
                    indicator_type=itype,
                    status="Active"
                ))

        db.commit()
        print("Corporate ESG master data seeded successfully (Governance, Procurement, CSR)!")
    except Exception as e:
        db.rollback()
        print(f"Error seeding corporate ESG data: {e}")
        raise
    finally:
        db.close()

if __name__ == "__main__":
    seed_corporate_esg_data()
