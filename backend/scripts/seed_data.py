import sys
import os
from datetime import date, datetime, timezone

# Ensure backend root is on python path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.core.database import SessionLocal, engine, Base
from app.core.security import get_password_hash
import app.models
from app.models.organization import Group, Subsidiary, BusinessUnit, Project
from app.models.user import Role, User, UserScope
from app.models.reporting import ReportingPeriod, Submission
from app.models.factors import EmissionFactor, UnitConversion
from app.models.esg_records import FuelRecord, EnergyRecord, WaterRecord, WasteRecord, SafetyRecord
from app.models.audit import AuditLog

from scripts.seed_rbac_and_users import seed_rbac

def seed():
    db = SessionLocal()

    try:
        # Check if already seeded
        if db.query(Group).first():
            print("Database already contains organization records. Ensuring RBAC is seeded...")
            seed_rbac()
            return

        print("Seeding MEIL Organization Hierarchy...")
        # 1. Group
        group = Group(
            id="meil-group-hq",
            name="Megha Engineering and Infrastructures Limited (MEIL Group)",
            code="MEIL-CORP",
            cin="U45202TG2006PLC050271",
            turnover_inr_cr=32450.0,
            net_worth_inr_cr=19800.0,
            headquarters="Hyderabad, Telangana, India",
            contact_person="Dr. B. Prasad, Chief Sustainability Officer",
            contact_email="esg.reporting@meilgroup.in"
        )
        db.add(group)
        db.flush()

        # 2. Subsidiaries
        sub_core = Subsidiary(
            id="sub-meil-core",
            group_id=group.id,
            name="MEIL Core Infrastructure & Engineering Division",
            code="MEIL-INFRA",
            cin="U45202TG2006PLC050271",
            sector="EPC & Heavy Civil Infrastructure",
            meil_ownership_pct=100.0,
            turnover_inr_cr=22140.0,
            is_listed=False
        )
        sub_olectra = Subsidiary(
            id="sub-olectra",
            group_id=group.id,
            name="Olectra Greentech Limited",
            code="OLECTRA",
            cin="L34100TG2000PLC035451",
            sector="Electric Mobility & Insulators",
            meil_ownership_pct=50.02,
            turnover_inr_cr=1820.0,
            is_listed=True
        )
        sub_gas = Subsidiary(
            id="sub-megha-gas",
            group_id=group.id,
            name="Megha Gas (Megha City Gas Distribution Pvt Ltd)",
            code="MEGHA-GAS",
            cin="U40300TG2015PTC099412",
            sector="City Gas Distribution (CNG / PNG)",
            meil_ownership_pct=100.0,
            turnover_inr_cr=2150.0,
            is_listed=False
        )
        sub_drillmec = Subsidiary(
            id="sub-drillmec",
            group_id=group.id,
            name="Drillmec S.p.A / Drillmec India",
            code="DRILLMEC",
            cin="FOREIGN-IT01548790338",
            sector="Heavy Oil & Gas Rig Manufacturing",
            meil_ownership_pct=100.0,
            turnover_inr_cr=4120.0,
            is_listed=False
        )
        sub_icomm = Subsidiary(
            id="sub-icomm",
            group_id=group.id,
            name="ICOMM Tele Limited",
            code="ICOMM",
            cin="U64203TG1989PLC010167",
            sector="Defense & Strategic Communications",
            meil_ownership_pct=98.5,
            turnover_inr_cr=1240.0,
            is_listed=False
        )
        sub_evey = Subsidiary(
            id="sub-evey",
            group_id=group.id,
            name="Evey Trans Private Limited",
            code="EVEY-TRANS",
            cin="U60200TG2018PTC125893",
            sector="Electric Public Transit Fleet Operations",
            meil_ownership_pct=100.0,
            turnover_inr_cr=980.0,
            is_listed=False
        )
        db.add_all([sub_core, sub_olectra, sub_gas, sub_drillmec, sub_icomm, sub_evey])
        db.flush()

        # 3. Business Units under MEIL Core Infra
        bu_water = BusinessUnit(
            id="bu-water",
            subsidiary_id=sub_core.id,
            name="Irrigation & Water Resources Management",
            code="BU-IRRIGATION",
            lead_name="K. Satyanarayana, Senior VP"
        )
        bu_tunnels = BusinessUnit(
            id="bu-tunnels",
            subsidiary_id=sub_core.id,
            name="Highways, Bridges & Himalayan Tunnels",
            code="BU-TUNNELS",
            lead_name="R. K. Sharma, VP - Strategic Infra"
        )
        bu_hydrocarbons = BusinessUnit(
            id="bu-hydrocarbons",
            subsidiary_id=sub_core.id,
            name="Hydrocarbons, Refineries & Petrochemicals",
            code="BU-HYDROCARBONS",
            lead_name="G. V. Rao, VP"
        )
        bu_power = BusinessUnit(
            id="bu-power",
            subsidiary_id=sub_core.id,
            name="Power Generation & Renewable Energy",
            code="BU-POWER",
            lead_name="M. Ramanathan, VP"
        )
        bu_cgd = BusinessUnit(
            id="bu-cgd",
            subsidiary_id=sub_gas.id,
            name="City Gas Pipeline Distribution Grid",
            code="BU-CGD",
            lead_name="Anil K. Verma, COO"
        )
        bu_ev = BusinessUnit(
            id="bu-ev",
            subsidiary_id=sub_olectra.id,
            name="Electric Bus Assembly & Battery Integration",
            code="BU-EV-MOBILITY",
            lead_name="K. V. Pradeep, MD"
        )
        db.add_all([bu_water, bu_tunnels, bu_hydrocarbons, bu_power, bu_cgd, bu_ev])
        db.flush()

        # 4. Landmark Project Sites
        site_gayatri = Project(
            id="site-101",
            subsidiary_id=sub_core.id,
            business_unit_id=bu_water.id,
            name="Gayatri Pumphouse - Kaleshwaram Lift Irrigation",
            code="SITE-KALES-01",
            location="Medaram, Jayashankar Bhupalpally, Telangana",
            country="India",
            project_type="Civil & Electromechanical Lift Irrigation",
            status="Operational",
            project_director="V. R. Krishna Murthy",
            site_esg_officer="Suresh Panyam",
            latitude=18.724,
            longitude=79.912
        )
        site_zojila = Project(
            id="site-102",
            subsidiary_id=sub_core.id,
            business_unit_id=bu_tunnels.id,
            name="Zojila High-Altitude Road Tunnel (14.15 km)",
            code="SITE-ZOJILA-01",
            location="Sonamarg-Minamarg, Jammu & Kashmir / Ladakh",
            country="India",
            project_type="Sub-Zero Rock Tunnelling EPC",
            status="Under Construction (74% Complete)",
            project_director="Harpal Singh",
            site_esg_officer="Tenzin Dorjey",
            latitude=34.298,
            longitude=75.485
        )
        site_uddanam = Project(
            id="site-103",
            subsidiary_id=sub_core.id,
            business_unit_id=bu_water.id,
            name="Uddanam Multi-Village Drinking Water Supply",
            code="SITE-UDDANAM-01",
            location="Srikakulam District, Andhra Pradesh",
            country="India",
            project_type="Water Treatment & Transmission Grid",
            status="Commissioned",
            project_director="M. Someswara Rao",
            site_esg_officer="P. Venkat Reddy",
            latitude=18.825,
            longitude=84.412
        )
        site_alzour = Project(
            id="site-104",
            subsidiary_id=sub_core.id,
            business_unit_id=bu_hydrocarbons.id,
            name="Al-Zour 66-Storage Tanks Hydrocarbon Terminal",
            code="SITE-ALZOUR-01",
            location="Al Zour, Kuwait",
            country="Kuwait",
            project_type="Hydrocarbon Terminal & Storage EPC",
            status="Commissioning",
            project_director="G. V. R. Raju",
            site_esg_officer="Faisal Al-Mansoor",
            latitude=28.742,
            longitude=48.243
        )
        site_olectra = Project(
            id="site-105",
            subsidiary_id=sub_olectra.id,
            business_unit_id=bu_ev.id,
            name="Olectra Mega Electric Bus Gigafactory",
            code="SITE-OLECTRA-DIND",
            location="Dindigul / Chandanvelly, Telangana",
            country="India",
            project_type="Clean Manufacturing & Battery Integration",
            status="Operational",
            project_director="B. Shravan Kumar",
            site_esg_officer="Pooja Deshmukh",
            latitude=17.158,
            longitude=78.214
        )
        db.add_all([site_gayatri, site_zojila, site_uddanam, site_alzour, site_olectra])
        db.flush()

        print("Seeding Versioned Emission Factors (CEA Baseline v19 & GHG Protocol)...")
        factors = [
            EmissionFactor(
                id="ef-diesel-01",
                category="Stationary & Mobile Combustion",
                activity_type="Diesel",
                factor=2.68,
                unit="kg CO2e / Litre",
                scope="SCOPE_1",
                source="Central Electricity Authority & IPCC 2006",
                source_version="v19-2024",
                effective_date=date(2024, 4, 1),
                geography="India",
                status="ACTIVE"
            ),
            EmissionFactor(
                id="ef-petrol-01",
                category="Mobile Combustion",
                activity_type="Petrol",
                factor=2.31,
                unit="kg CO2e / Litre",
                scope="SCOPE_1",
                source="IPCC 2006 Guidelines",
                source_version="v19-2024",
                effective_date=date(2024, 4, 1),
                geography="India",
                status="ACTIVE"
            ),
            EmissionFactor(
                id="ef-gas-01",
                category="Stationary Combustion",
                activity_type="Natural Gas",
                factor=2.03,
                unit="kg CO2e / m3",
                scope="SCOPE_1",
                source="IPCC 2006 Guidelines",
                source_version="v19-2024",
                effective_date=date(2024, 4, 1),
                geography="India",
                status="ACTIVE"
            ),
            EmissionFactor(
                id="ef-grid-01",
                category="Purchased Electricity",
                activity_type="Grid Electricity",
                factor=0.716,
                unit="kg CO2e / kWh",
                scope="SCOPE_2",
                source="CEA CO2 Baseline Database for Indian Power Sector",
                source_version="CEA-v19",
                effective_date=date(2024, 4, 1),
                geography="India (National Average)",
                status="ACTIVE"
            )
        ]
        for f in factors:
            if not db.query(EmissionFactor).filter(EmissionFactor.id == f.id).first():
                db.add(f)
        db.flush()

        print("Seeding Reporting Periods...")
        period_sep = db.query(ReportingPeriod).filter(ReportingPeriod.id == "period-2025-09").first()
        if not period_sep:
            period_sep = ReportingPeriod(
                id="period-2025-09",
                name="September 2025",
                financial_year="2025-2026",
                start_date=date(2025, 9, 1),
                end_date=date(2025, 9, 30),
                is_active=True,
                is_locked=False
            )
            db.add(period_sep)

        period_annual = db.query(ReportingPeriod).filter(ReportingPeriod.id == "period-fy2425").first()
        if not period_annual:
            period_annual = ReportingPeriod(
                id="period-fy2425",
                name="FY 2024-25 (Annual Filing)",
                financial_year="2024-2025",
                start_date=date(2024, 4, 1),
                end_date=date(2025, 3, 31),
                is_active=True,
                is_locked=True
            )
            db.add(period_annual)
        db.flush()

        print("Seeding Roles and Scoped Users...")
        def get_or_create_role(role_id, name, desc):
            r = db.query(Role).filter(Role.id == role_id).first()
            if not r:
                r = Role(id=role_id, name=name, description=desc)
                db.add(r)
                db.flush()
            return r

        role_super = get_or_create_role("role-super", "SUPER_ADMIN", "Global administrator")
        role_cso = get_or_create_role("role-cso", "GROUP_CSO", "Group Chief Sustainability Officer")
        role_sub = get_or_create_role("role-sub", "SUBSIDIARY_HEAD", "Head of Subsidiary ESG")
        role_bu = get_or_create_role("role-bu", "BU_COORDINATOR", "Business Unit Sustainability Coordinator")
        role_site = get_or_create_role("role-site", "PROJECT_OFFICER", "Site Safety & Energy Officer")
        role_auditor = get_or_create_role("role-auditor", "ASSURANCE_AUDITOR", "Third-Party Assurance Auditor")

        # Users
        pwd_hash = get_password_hash("password123")
        def get_or_create_user(user_id, email, full_name, role_id, is_super=False):
            u = db.query(User).filter(User.id == user_id).first()
            if not u:
                u = User(
                    id=user_id,
                    email=email,
                    full_name=full_name,
                    hashed_password=pwd_hash,
                    role_id=role_id,
                    is_superuser=is_super
                )
                db.add(u)
                db.flush()
            return u

        admin_user = get_or_create_user("user-admin", "admin@meilgroup.in", "System Super Administrator", role_super.id, is_super=True)
        cso_user = get_or_create_user("user-cso", "cso@meilgroup.in", "Dr. B. Prasad (Group CSO)", role_cso.id)
        site_user = get_or_create_user("user-site-zojila", "zojila.officer@meilgroup.in", "Tenzin Dorjey (Site Officer - Zojila)", role_site.id)

        # Scopes
        def get_or_create_scope(user_id, scope_type, scope_id):
            s = db.query(UserScope).filter(UserScope.user_id == user_id, UserScope.scope_type == scope_type, UserScope.scope_id == scope_id).first()
            if not s:
                s = UserScope(user_id=user_id, scope_type=scope_type, scope_id=scope_id)
                db.add(s)
                db.flush()
            return s

        scope_group = get_or_create_scope(cso_user.id, "GROUP", group.id)
        scope_zojila = get_or_create_scope(site_user.id, "PROJECT", site_zojila.id)

        print("Seeding Operational Baseline Records for MEIL Group...")
        # Zojila Tunnel Submission (Approved)
        sub_zojila = Submission(
            id="sub-zojila-sep25",
            project_id=site_zojila.id,
            reporting_period_id=period_sep.id,
            status="SUBSIDIARY_APPROVED",
            version=1,
            submitted_by="Tenzin Dorjey",
            submitted_at=datetime.now(timezone.utc),
            reviewed_by="R. K. Sharma (BU Coordinator)",
            approved_by="MEIL Group ESG Director"
        )
        db.add(sub_zojila)
        db.flush()

        # Zojila fuel & energy records
        fuel_zojila = FuelRecord(
            id="fr-zoj-01",
            submission_id=sub_zojila.id,
            project_id=site_zojila.id,
            reporting_period_id=period_sep.id,
            fuel_type="Diesel",
            quantity=384000.0,
            unit="Litres",
            scope1_co2e_tonnes=round((384000.0 * 2.68) / 1000.0, 2),
            factor_id="ef-diesel-01",
            factor_version="v19-2024",
            evidence_id="DOC-ZOJILA-IOCL-INV-SEP25"
        )
        energy_zojila = EnergyRecord(
            id="er-zoj-01",
            submission_id=sub_zojila.id,
            project_id=site_zojila.id,
            reporting_period_id=period_sep.id,
            energy_source="Grid Electricity",
            quantity_kwh=950000.0,
            renewable_kwh=50000.0,
            scope2_co2e_tonnes=round((900000.0 * 0.716) / 1000.0, 2),
            energy_gj=round((950000.0 * 3.6) / 1000.0, 1),
            factor_id="ef-grid-01",
            factor_version="CEA-v19"
        )
        water_zojila = WaterRecord(
            id="wr-zoj-01",
            submission_id=sub_zojila.id,
            project_id=site_zojila.id,
            reporting_period_id=period_sep.id,
            source_type="Glacial Stream & Spring Runoff",
            withdrawal_kl=28900.0,
            recycled_kl=21200.0,
            discharged_kl=7700.0,
            treatment_type="Sedimentation & Recycling Plant"
        )
        safety_zojila = SafetyRecord(
            id="sr-zoj-01",
            submission_id=sub_zojila.id,
            project_id=site_zojila.id,
            reporting_period_id=period_sep.id,
            safe_man_hours=580000.0,
            lost_time_injuries=0,
            fatalities=0,
            ltifr=0.00
        )
        db.add_all([fuel_zojila, energy_zojila, water_zojila, safety_zojila])

        # Initial Audit Event
        audit_init = AuditLog(
            id="aud-init-01",
            actor_id="user-cso",
            actor_name="Dr. B. Prasad",
            actor_role="GROUP_CSO",
            action="ORGANIZATION_MASTER_INITIALIZED",
            entity_type="Group",
            entity_id=group.id,
            details="Seeded initial 4-Tier MEIL Group structure, versioned emission factors, and September 2025 reporting period."
        )
        db.add(audit_init)

        db.commit()
        print("Database seeded successfully with authentic MEIL Group hierarchy & records!")

    except Exception as e:
        db.rollback()
        print(f"Error during seeding: {e}")
        raise
    finally:
        db.close()

if __name__ == "__main__":
    seed()
