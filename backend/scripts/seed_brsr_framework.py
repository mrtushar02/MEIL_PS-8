import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.core.database import SessionLocal
from app.models.brsr import (
    BrsrFramework, BrsrSection, BrsrPrinciple, BrsrIndicator, BrsrMapping, BrsrAnswer, BrsrAnswerSource
)
from app.models.reporting import ReportingPeriod

def seed_brsr():
    db = SessionLocal()
    try:
        print("Seeding Official SEBI BRSR Multi-Framework & Indicator Inventory...")

        # 1. Governed Frameworks (Item 35)
        frameworks_data = [
            (
                "fw-sebi-brsr-2021",
                "SEBI_BRSR_2021",
                "SEBI Business Responsibility and Sustainability Report (Circular SEBI/HO/CFD/CMD-2/P/CIR/2021/562)",
                "SEBI/HO/CFD/CMD-2/P/CIR/2021/562"
            ),
            (
                "fw-sebi-brsr-core-2023",
                "SEBI_BRSR_CORE_2023",
                "BRSR Core — Framework for Reasonable Assurance and ESG Disclosures for Value Chain (Circular 2023/122)",
                "SEBI/HO/CFD/CFD-SEC-2/P/CIR/2023/122"
            ),
            (
                "fw-sebi-brsr-core-2025",
                "SEBI_BRSR_CORE_2025",
                "SEBI Revised BRSR Core & Assurance Guidelines (Circular SEBI/HO/CFD/CFD-PoD-2/P/CIR/2025/008)",
                "SEBI/HO/CFD/CFD-PoD-2/P/CIR/2025/008"
            )
        ]

        framework_map = {}
        for f_id, v_code, title, circ in frameworks_data:
            fw = db.query(BrsrFramework).filter(BrsrFramework.version_code == v_code).first()
            if not fw:
                fw = BrsrFramework(
                    id=f_id,
                    version_code=v_code,
                    title=title,
                    circular_reference=circ,
                    is_active=True
                )
                db.add(fw)
                db.flush()
            framework_map[v_code] = fw

        primary_fw = framework_map["SEBI_BRSR_2021"]

        # 2. Sections
        sections_data = [
            ("sec-a", "SECTION_A", "Section A: General Disclosures", "Entity details, products, operations, employees, holdings, CSR"),
            ("sec-b", "SECTION_B", "Section B: Management & Process Disclosures", "Policy governance, leadership oversight, stakeholder engagement, grievance redressal"),
            ("sec-c", "SECTION_C", "Section C: Principle-wise Performance Disclosures", "Quantitative and qualitative disclosures across NGRBC Principles 1 through 9"),
            ("sec-core", "BRSR_CORE", "BRSR Core: Assurance KPIs", "9 ESG key performance indicators for reasonable assurance specified by SEBI")
        ]
        sections = {}
        for s_id, s_code, title, desc in sections_data:
            sec = db.query(BrsrSection).filter(BrsrSection.section_code == s_code, BrsrSection.framework_id == primary_fw.id).first()
            if not sec:
                sec = BrsrSection(id=s_id, framework_id=primary_fw.id, section_code=s_code, title=title, description=desc)
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
            p = db.query(BrsrPrinciple).filter(BrsrPrinciple.code == code, BrsrPrinciple.framework_id == primary_fw.id).first()
            if not p:
                p = BrsrPrinciple(framework_id=primary_fw.id, principle_number=num, code=code, title=title, description=desc)
                db.add(p)
                db.flush()

        # 4. Complete Inventory of Essential, Leadership & BRSR Core Indicators
        indicator_defs = [
            # Section A: General Disclosures
            ("SECTION_A", None, "SEC_A_OPERATIONS", "ESSENTIAL", "Total number of project locations and operational sites", "total_projects", "Count", "All active project sites"),
            ("SECTION_A", None, "SEC_A_TURNOVER", "ESSENTIAL", "Consolidated group turnover for the reporting year", "turnover_inr_cr", "INR Crores", "Audited financial accounts"),
            ("SECTION_A", None, "SEC_A_WORKFORCE", "ESSENTIAL", "Total employee and contractor workforce breakdown", "total_workforce", "Headcount", "Consolidated HR rosters"),

            # Section B: Management & Process Disclosures
            ("SECTION_B", None, "SEC_B_ENV_POLICY", "ESSENTIAL", "Whether entity has board-approved environmental and sustainability policy", "env_policy_active", "Boolean", "Board approved charter"),
            ("SECTION_B", None, "SEC_B_HR_POLICY", "ESSENTIAL", "Whether entity has human rights and anti-harassment policy", "hr_policy_active", "Boolean", "Board approved charter"),
            ("SECTION_B", None, "SEC_B_GRIEVANCE_MECH", "ESSENTIAL", "Grievance redressal mechanism established across stakeholder groups", "grievance_mech_active", "Boolean", "Grievance redressal portal"),

            # Principle 1: Ethics, Transparency & Accountability
            ("SECTION_C", 1, "P1_E1", "ESSENTIAL", "Number of anti-corruption and anti-bribery training sessions conducted", "anti_corruption_trainings", "Sessions", "Internal compliance logs"),
            ("SECTION_C", 1, "P1_E2", "ESSENTIAL", "Fines or penalties paid in proceedings with regulators/law enforcement", "regulatory_fines_paid", "INR", "Legal compliance records"),
            ("SECTION_C", 1, "P1_L1", "LEADERSHIP", "Awareness programs conducted for value chain partners on ethics and anti-corruption", "value_chain_ethics_sessions", "Programs", "Supply chain compliance charter"),

            # Principle 2: Product Lifecycle Sustainability
            ("SECTION_C", 2, "P2_E1", "ESSENTIAL", "Percentage of capital expenditure in R&D and clean tech projects", "clean_tech_capex_pct", "%", "Capital project accounting"),
            ("SECTION_C", 2, "P2_L1", "LEADERSHIP", "Percentage of recycled or reused input material used in infrastructure works", "recycled_input_materials_pct", "%", "Procurement circularity audit"),

            # Principle 3: Employee & Worker Wellbeing
            ("SECTION_C", 3, "P3_E1", "ESSENTIAL", "Workforce headcount: Permanent vs Other than permanent employees and workers", "workforce_headcount", "Headcount", "HRMS active rosters"),
            ("SECTION_C", 3, "P3_E4", "ESSENTIAL", "Health and Safety: Total Safe Man-hours, Lost Time Injuries (LTI), Fatalities and LTIFR", "safety_ltifr", "LTIFR", "HSE incident management system"),
            ("SECTION_C", 3, "P3_L1", "LEADERSHIP", "Life insurance and health insurance coverage for non-permanent workers and supply chain", "contractor_insurance_coverage_pct", "%", "Contractor safety compliance register"),

            # Principle 4: Stakeholder Responsiveness
            ("SECTION_C", 4, "P4_E1", "ESSENTIAL", "Consultation with vulnerable and marginalized stakeholder groups", "stakeholder_consultations", "Count", "Community liaison records"),
            ("SECTION_C", 4, "P4_L1", "LEADERSHIP", "Formal institutional processes to engage vulnerable and marginalized stakeholders", "marginalized_engagement_process", "Text", "Stakeholder engagement framework"),

            # Principle 5: Respect for Human Rights
            ("SECTION_C", 5, "P5_E1", "ESSENTIAL", "Coverage of employees and workers on Minimum Wages, POSH, and Grievance Mechanisms", "human_rights_coverage_pct", "%", "Labour compliance registers"),
            ("SECTION_C", 5, "P5_L1", "LEADERSHIP", "Human rights due diligence conducted across major contractor and supplier operations", "human_rights_dd_count", "Audits", "ESG supply chain vendor audits"),

            # Principle 6: Environmental Protection
            ("SECTION_C", 6, "P6_E1", "ESSENTIAL", "Total Energy Consumption: Grid electricity, fuel, and renewable sources", "energy_consumption_gj", "GJ", "Monthly electricity and fuel records"),
            ("SECTION_C", 6, "P6_E2", "ESSENTIAL", "Water Withdrawal, Consumption, and Zero Liquid Discharge (ZLD) rate", "water_withdrawal_kl", "KL", "Flow meters, utility bills, groundwater logs"),
            ("SECTION_C", 6, "P6_E4", "ESSENTIAL", "Greenhouse Gas (GHG) Scope 1 and Scope 2 emissions and intensity", "ghg_emissions_tco2e", "tCO2e", "CEA Grid Baseline v19 & fuel invoices"),
            ("SECTION_C", 6, "P6_E5", "ESSENTIAL", "Waste Generated, Hazardous waste, and diverted from disposal", "waste_generated_mt", "Metric Tonnes", "Pollution board manifests"),
            ("SECTION_C", 6, "P6_L1", "LEADERSHIP", "Scope 3 emissions accounting across major categories and science-based decarbonization targets", "scope3_emissions_tco2e", "tCO2e", "GHG Protocol Scope 3 Standard"),

            # Principle 7: Responsible Policy Advocacy
            ("SECTION_C", 7, "P7_E1", "ESSENTIAL", "Affiliations and memberships of trade and industry chambers", "trade_affiliations_count", "Count", "Corporate secretarial records"),
            ("SECTION_C", 7, "P7_L1", "LEADERSHIP", "Public policy advocacy submissions and positions made to governmental and regulatory bodies", "policy_advocacy_submissions", "Count", "Regulatory affairs register"),

            # Principle 8: Inclusive Growth & Development
            ("SECTION_C", 8, "P8_E1", "ESSENTIAL", "CSR spending, project themes (Education, Healthcare, Water), and beneficiaries", "csr_spend_inr_cr", "INR Crores", "Section 135 CSR committee reports"),
            ("SECTION_C", 8, "P8_L1", "LEADERSHIP", "Social Impact Assessment (SIA) conducted for major infrastructure projects", "social_impact_assessments_count", "Assessments", "Independent SIA reports"),

            # Principle 9: Consumer Value & Engagement
            ("SECTION_C", 9, "P9_E1", "ESSENTIAL", "Data privacy incidents, cyber security breaches, and resolved complaints", "cyber_privacy_incidents", "Incidents", "CISO & IT security audits"),
            ("SECTION_C", 9, "P9_L1", "LEADERSHIP", "Customer satisfaction surveys and product/service quality grievance resolution rate", "customer_satisfaction_rate_pct", "%", "Customer care metrics"),

            # 9 Official SEBI BRSR Core Assurance Attributes (Circular 2023/122 & Jan 2025)
            ("BRSR_CORE", 6, "CORE_GHG", "CORE", "BRSR Core 1: Scope 1 and Scope 2 GHG Intensity per Rupee of Turnover", "core_ghg_intensity", "tCO2e / Cr", "Formula: (Scope1 + Scope2) / Turnover"),
            ("BRSR_CORE", 6, "CORE_WATER", "CORE", "BRSR Core 2: Water intensity per Rupee of turnover and recycling percentage", "core_water_intensity", "KL / Cr", "Formula: Water Withdrawal / Turnover"),
            ("BRSR_CORE", 6, "CORE_ENERGY", "CORE", "BRSR Core 3: Energy footprint and renewable energy proportion in total energy", "core_renewable_share", "%", "Formula: Renewable Energy GJ / Total Energy GJ"),
            ("BRSR_CORE", 6, "CORE_WASTE", "CORE", "BRSR Core 4: Waste recovery and circularity footprint per turnover", "core_waste_circularity", "%", "Formula: Waste Diverted / Total Waste Generated"),
            ("BRSR_CORE", 3, "CORE_SAFETY", "CORE", "BRSR Core 5: Employee and worker safety: LTIFR and zero fatality assurance", "core_ltifr", "LTIFR", "Formula: (LTIs * 1,000,000) / Safe Man Hours"),
            ("BRSR_CORE", 3, "CORE_DIVERSITY", "CORE", "BRSR Core 6: Gender diversity: Proportion of women in total workforce and leadership", "core_gender_diversity", "%", "Formula: Women Headcount / Total Headcount"),
            ("BRSR_CORE", 3, "CORE_WAGES", "CORE", "BRSR Core 7: Fair wages: Median wage distribution and minimum wage statutory compliance", "core_fair_wages", "%", "Minimum Wages Act audited registers"),
            ("BRSR_CORE", 8, "CORE_SMALL_TOWN", "CORE", "BRSR Core 8: Job creation in Tier-2 and Tier-3 locations and project hinterlands", "core_local_hiring", "%", "Site HR employment records"),
            ("BRSR_CORE", 1, "CORE_FAIR_TRADE", "CORE", "BRSR Core 9: Open-ness of business: Proportion of payments to MSMEs within 45 days", "core_msme_payments", "%", "ERP accounts payable ledger")
        ]

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

        db.commit()

        # 5. Seed Answers for Both Current Reporting Period and Comparative Year Period (Item 36)
        curr_period = db.query(ReportingPeriod).filter(ReportingPeriod.id == "period-2025-09").first()
        comp_period = db.query(ReportingPeriod).filter(ReportingPeriod.id == "period-fy2425").first()

        sample_answers = [
            ("SEC_A_OPERATIONS", 258.0, "258 operational project sites across India and international", "Count"),
            ("SEC_A_TURNOVER", 32450.0, "Consolidated Gross Turnover INR 32,450.0 Crores", "INR Crores"),
            ("SEC_A_WORKFORCE", 44648.0, "Total workforce including permanent and contractual workers", "Headcount"),
            ("SEC_B_ENV_POLICY", 1.0, "Board-approved Environmental and Sustainability Charter active since 2018", "Boolean"),
            ("SEC_B_HR_POLICY", 1.0, "Comprehensive Human Rights and Anti-Harassment (POSH) Charter active", "Boolean"),
            ("SEC_B_GRIEVANCE_MECH", 1.0, "Integrated multi-stakeholder whistleblower and grievance redressal system active", "Boolean"),
            ("P1_E1", 42.0, "42 anti-corruption and governance sessions across subsidiaries", "Sessions"),
            ("P1_E2", 0.0, "Zero regulatory penalties or fines paid", "INR"),
            ("P1_L1", 18.0, "18 value chain partner ethics sessions conducted", "Programs"),
            ("P2_E1", 3.8, "3.8% of CapEx deployed in clean technology, solarisation and green equipment", "%"),
            ("P2_L1", 14.5, "14.5% recycled aggregate and fly ash utilized in construction", "%"),
            ("P3_E1", 44648.0, "12,450 permanent employees, 32,198 project workers", "Headcount"),
            ("P3_E4", 0.12, "LTIFR of 0.12 with zero fatalities across 16.8 million safe man-hours", "LTIFR"),
            ("P3_L1", 100.0, "100% of workers and contractors covered under Group Medical and Accidental Insurance", "%"),
            ("P4_E1", 86.0, "86 village council and stakeholder consultations conducted", "Count"),
            ("P4_L1", 1.0, "Institutional Free, Prior and Informed Consultation framework deployed", "Text"),
            ("P5_E1", 100.0, "100% compliance with Minimum Wages and statutory labor codes", "%"),
            ("P5_L1", 24.0, "24 supplier audits conducted covering human rights and labor standards", "Audits"),
            ("P6_E1", 284500.0, "Total energy consumption 284,500 GJ", "GJ"),
            ("P6_E2", 420000.0, "Water withdrawal 420,000 KL; 38.5% recycled and reused", "KL"),
            ("P6_E4", 62450.0, "Scope 1: 34,250 tCO2e | Scope 2: 28,200 tCO2e", "tCO2e"),
            ("P6_E5", 14500.0, "Total waste 14,500 MT; 72% recycled or diverted from landfills", "Metric Tonnes"),
            ("P6_L1", 85000.0, "Scope 3 emissions 85,000 tCO2e with target 25% reduction by 2030", "tCO2e"),
            ("P7_E1", 12.0, "Active member of CII, FICCI, ASSOCHAM and BAI", "Count"),
            ("P7_L1", 6.0, "6 public submissions on national water infrastructure and green hydrogen policy", "Count"),
            ("P8_E1", 48.5, "INR 48.5 Crores CSR spend benefiting over 284,000 community members", "INR Crores"),
            ("P8_L1", 8.0, "8 Social Impact Assessments completed by accredited third parties", "Assessments"),
            ("P9_E1", 0.0, "Zero substantiated consumer privacy or data breach incidents", "Incidents"),
            ("P9_L1", 94.2, "Customer satisfaction index 94.2% across infrastructure clients", "%"),
            ("CORE_GHG", 1.92, "Scope 1 + Scope 2 intensity 1.92 tCO2e per Crore Turnover", "tCO2e / Cr"),
            ("CORE_WATER", 12.94, "Water intensity 12.94 KL per Crore Turnover", "KL / Cr"),
            ("CORE_ENERGY", 22.4, "Renewable energy proportion 22.4% of total energy consumption", "%"),
            ("CORE_WASTE", 72.0, "Waste circularity index: 72% diverted from disposal", "%"),
            ("CORE_SAFETY", 0.12, "LTIFR 0.12 with zero fatalities", "LTIFR"),
            ("CORE_DIVERSITY", 14.2, "Female workforce participation 14.2% (18.5% in technical engineering)", "%"),
            ("CORE_WAGES", 100.0, "100% workers paid above statutory minimum wages", "%"),
            ("CORE_SMALL_TOWN", 62.5, "62.5% of non-executive workforce recruited from project hinterlands and Tier-2/3 towns", "%"),
            ("CORE_FAIR_TRADE", 98.2, "98.2% of MSME invoices cleared within 45 days statutory requirement", "%")
        ]

        if curr_period:
            for ind_code, val_num, val_txt, unit in sample_answers:
                ind = db.query(BrsrIndicator).filter(BrsrIndicator.indicator_code == ind_code).first()
                if ind:
                    ans = db.query(BrsrAnswer).filter(
                        BrsrAnswer.reporting_period_id == curr_period.id,
                        BrsrAnswer.indicator_id == ind.id
                    ).first()
                    if not ans:
                        ans = BrsrAnswer(
                            framework_id=primary_fw.id,
                            reporting_period_id=curr_period.id,
                            indicator_id=ind.id,
                            value_numeric=val_num,
                            value_text=val_txt,
                            unit=unit,
                            status="APPROVED",
                            generated_by="BRSR Statutory Seed Service"
                        )
                        db.add(ans)
                        db.flush()

                        # Link answer source
                        src = BrsrAnswerSource(
                            answer_id=ans.id,
                            source_record_type="ConsolidatedEngine",
                            source_record_id=f"SRC-{ind_code}",
                            trace_order=1
                        )
                        db.add(src)

        if comp_period:
            # Seed comparative previous year baseline numbers (Item 36)
            for ind_code, val_num, val_txt, unit in sample_answers:
                ind = db.query(BrsrIndicator).filter(BrsrIndicator.indicator_code == ind_code).first()
                if ind:
                    ans = db.query(BrsrAnswer).filter(
                        BrsrAnswer.reporting_period_id == comp_period.id,
                        BrsrAnswer.indicator_id == ind.id
                    ).first()
                    if not ans:
                        comp_val = round(val_num * 0.94, 2) if val_num is not None else None
                        ans = BrsrAnswer(
                            framework_id=primary_fw.id,
                            reporting_period_id=comp_period.id,
                            indicator_id=ind.id,
                            value_numeric=comp_val,
                            value_text=f"Comparative FY 2024-25 baseline: {comp_val or val_txt}",
                            unit=unit,
                            status="APPROVED",
                            generated_by="Comparative Baseline Seed Service"
                        )
                        db.add(ans)

        db.commit()
        print(f"Successfully seeded {len(indicator_defs)} official BRSR indicators across 3 frameworks with comparative baseline data!")
    finally:
        db.close()

if __name__ == "__main__":
    seed_brsr()
