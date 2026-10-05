import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.core.database import SessionLocal
from app.models.brsr import (
    BrsrFramework, BrsrSection, BrsrPrinciple, BrsrIndicator, BrsrMapping
)

def seed_brsr():
    db = SessionLocal()
    try:
        print("Seeding Official SEBI BRSR Framework...")
        # 1. Framework
        fw = db.query(BrsrFramework).filter(BrsrFramework.version_code == "SEBI_BRSR_2021").first()
        if not fw:
            fw = BrsrFramework(
                id="fw-sebi-brsr-2021",
                version_code="SEBI_BRSR_2021",
                title="SEBI Business Responsibility and Sustainability Report (Circular SEBI/HO/CFD/CMD-2/P/CIR/2021/562)",
                circular_reference="SEBI/HO/CFD/CMD-2/P/CIR/2021/562",
                is_active=True
            )
            db.add(fw)
            db.flush()

        # 2. Sections
        sections_data = [
            ("sec-a", "SECTION_A", "Section A: General Disclosures", "Entity details, products, operations, employees, holdings, CSR"),
            ("sec-b", "SECTION_B", "Section B: Management & Process Disclosures", "Policy governance, leadership oversight, stakeholder engagement, grievance redressal"),
            ("sec-c", "SECTION_C", "Section C: Principle-wise Performance Disclosures", "Quantitative and qualitative disclosures across NGRBC Principles 1 through 9"),
            ("sec-core", "BRSR_CORE", "BRSR Core: Assurance KPIs", "Key performance indicators for reasonable assurance specified by SEBI Circular 2023/2025")
        ]
        sections = {}
        for s_id, s_code, title, desc in sections_data:
            sec = db.query(BrsrSection).filter(BrsrSection.section_code == s_code, BrsrSection.framework_id == fw.id).first()
            if not sec:
                sec = BrsrSection(id=s_id, framework_id=fw.id, section_code=s_code, title=title, description=desc)
                db.add(sec)
                db.flush()
            sections[s_code] = sec

        # 3. Principles P1 through P9
        principles_data = [
            (1, "P1", "Principle 1: Ethics, Transparency & Accountability", "Businesses should conduct and govern themselves with integrity, and in a manner that is Ethical, Transparent and Accountable"),
            (2, "P2", "Principle 2: Product Lifecycle Sustainability", "Businesses should provide goods and services in a manner that is sustainable and safe"),
            (3, "P3", "Principle 3: Employee & Worker Wellbeing", "Businesses should respect and promote the well-being of all employees, including those in their value chains"),
            (4, "P4", "Principle 4: Stakeholder Responsiveness", "Businesses should respect the interests of and be responsive to all its stakeholders"),
            (5, "P5", "Principle 5: Respect for Human Rights", "Businesses should respect and promote human rights"),
            (6, "P6", "Principle 6: Environmental Protection", "Businesses should respect and make efforts to protect and restore the environment"),
            (7, "P7", "Principle 7: Responsible Policy Advocacy", "Businesses, when engaging in influencing public and regulatory policy, should do so in a manner that is responsible and transparent"),
            (8, "P8", "Principle 8: Inclusive Growth & Development", "Businesses should promote inclusive growth and equitable development"),
            (9, "P9", "Principle 9: Consumer Value & Engagement", "Businesses should engage with and provide value to their consumers in a responsible manner")
        ]
        for num, code, title, desc in principles_data:
            p = db.query(BrsrPrinciple).filter(BrsrPrinciple.code == code, BrsrPrinciple.framework_id == fw.id).first()
            if not p:
                p = BrsrPrinciple(framework_id=fw.id, principle_number=num, code=code, title=title, description=desc)
                db.add(p)
                db.flush()

        # 4. Indicators & Mappings across Section A, B, C (P1-P9) and BRSR Core
        indicator_defs = [
            # Section A: Entity & Operational Disclosures
            ("SECTION_A", None, "SEC_A_OPERATIONS", "ESSENTIAL", "Total number of project locations and operational sites", "total_projects", "Count", "All active project sites"),
            ("SECTION_A", None, "SEC_A_TURNOVER", "ESSENTIAL", "Consolidated group turnover for the reporting year", "turnover_inr_cr", "INR Crores", "Audited financial accounts"),
            # Section B: Policies
            ("SECTION_B", None, "SEC_B_ENV_POLICY", "ESSENTIAL", "Whether entity has board-approved environmental and sustainability policy", "env_policy_active", "Boolean", "Board approved charter"),
            ("SECTION_B", None, "SEC_B_HR_POLICY", "ESSENTIAL", "Whether entity has human rights and anti-harassment policy", "hr_policy_active", "Boolean", "Board approved charter"),
            # Principle 1: Ethics & Governance
            ("SECTION_C", 1, "P1_E1", "ESSENTIAL", "Number of anti-corruption and anti-bribery training sessions conducted", "anti_corruption_trainings", "Sessions", "Internal compliance logs"),
            ("SECTION_C", 1, "P1_E2", "ESSENTIAL", "Fines or penalties paid in proceedings with regulators/law enforcement", "regulatory_fines_paid", "INR", "Legal compliance records"),
            # Principle 2: Safe & Sustainable Goods
            ("SECTION_C", 2, "P2_E1", "ESSENTIAL", "Percentage of capital expenditure in R&D and clean tech projects", "clean_tech_capex_pct", "%", "Capital project accounting"),
            # Principle 3: Employees & Workers
            ("SECTION_C", 3, "P3_E1", "ESSENTIAL", "Workforce headcount: Permanent vs Other than permanent employees and workers", "workforce_headcount", "Headcount", "HRMS active rosters"),
            ("SECTION_C", 3, "P3_E4", "ESSENTIAL", "Health and Safety: Total Safe Man-hours, Lost Time Injuries (LTI), Fatalities and LTIFR", "safety_ltifr", "LTIFR", "HSE incident management system"),
            # Principle 4: Stakeholders
            ("SECTION_C", 4, "P4_E1", "ESSENTIAL", "Consultation with vulnerable and marginalized stakeholder groups", "stakeholder_consultations", "Count", "Community liaison records"),
            # Principle 5: Human Rights
            ("SECTION_C", 5, "P5_E1", "ESSENTIAL", "Coverage of employees and workers on Minimum Wages, POSH, and Grievance Mechanisms", "human_rights_coverage_pct", "%", "Labour compliance registers"),
            # Principle 6: Environment
            ("SECTION_C", 6, "P6_E1", "ESSENTIAL", "Total Energy Consumption: Grid electricity, fuel, and renewable sources", "energy_consumption_gj", "GJ", "Monthly electricity and fuel records"),
            ("SECTION_C", 6, "P6_E2", "ESSENTIAL", "Water Withdrawal, Consumption, and Zero Liquid Discharge (ZLD) rate", "water_withdrawal_kl", "KL", "Flow meters, utility bills, groundwater logs"),
            ("SECTION_C", 6, "P6_E4", "ESSENTIAL", "Greenhouse Gas (GHG) Scope 1 and Scope 2 emissions and intensity", "ghg_emissions_tco2e", "tCO2e", "CEA Grid Baseline v19 & fuel invoices"),
            ("SECTION_C", 6, "P6_E5", "ESSENTIAL", "Waste Generated, Hazardous waste, and diverted from disposal", "waste_generated_mt", "Metric Tonnes", "Pollution board manifests"),
            # Principle 7: Policy Advocacy
            ("SECTION_C", 7, "P7_E1", "ESSENTIAL", "Affiliations and memberships of trade and industry chambers", "trade_affiliations_count", "Count", "Corporate secretarial records"),
            # Principle 8: CSR & Inclusive Growth
            ("SECTION_C", 8, "P8_E1", "ESSENTIAL", "CSR spending, project themes (Education, Healthcare, Water), and beneficiaries", "csr_spend_inr_cr", "INR Crores", "Section 135 CSR committee reports"),
            # Principle 9: Customer Privacy & Incident
            ("SECTION_C", 9, "P9_E1", "ESSENTIAL", "Data privacy incidents, cyber security breaches, and resolved complaints", "cyber_privacy_incidents", "Incidents", "CISO & IT security audits"),
            # BRSR Core
            ("BRSR_CORE", 6, "CORE_GHG", "CORE", "BRSR Core Indicator 1: Scope 1 and Scope 2 GHG Intensity per Rupee of Turnover", "core_ghg_intensity", "tCO2e / Cr", "Formula: (Scope1 + Scope2) / Turnover"),
            ("BRSR_CORE", 6, "CORE_WATER", "CORE", "BRSR Core Indicator 2: Water intensity per Rupee of turnover and recycling percentage", "core_water_intensity", "KL / Cr", "Formula: Water Withdrawal / Turnover"),
            ("BRSR_CORE", 3, "CORE_SAFETY", "CORE", "BRSR Core Indicator 3: Lost Time Injury Frequency Rate (LTIFR) and Fatalities", "core_ltifr", "LTIFR", "Formula: (LTIs * 1,000,000) / Safe Man Hours"),

        ]

        mapped_count = 0
        for s_code, p_num, ind_code, ind_type, q_text, metric_k, unit, notes in indicator_defs:
            ind = db.query(BrsrIndicator).filter(BrsrIndicator.indicator_code == ind_code).first()
            sec_obj = sections[s_code]
            if not ind:
                ind = BrsrIndicator(
                    section_id=sec_obj.id,
                    principle_number=p_num,
                    indicator_code=ind_code,
                    indicator_type=ind_type,
                    question_text=q_text,
                    metric_key=metric_k,
                    unit=unit,
                    guidance_notes=notes,
                    required=True
                )
                db.add(ind)
                db.flush()

            # Mapping
            m = db.query(BrsrMapping).filter(BrsrMapping.indicator_id == ind.id).first()
            if not m:
                m = BrsrMapping(
                    indicator_id=ind.id,
                    metric_key=metric_k,
                    source_table="consolidated_engine",
                    aggregation_method="CONSOLIDATED",
                    evidence_required=True
                )
                db.add(m)
                mapped_count += 1

        db.commit()
        print(f"Successfully seeded BRSR Framework with 9 Principles and {len(indicator_defs)} authoritative indicators!")
    finally:
        db.close()

if __name__ == "__main__":
    seed_brsr()
