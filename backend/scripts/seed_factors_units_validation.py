import sys
import os
from datetime import date, datetime, timezone

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.core.database import SessionLocal
from app.models.factors import EmissionFactor, UnitConversion, Unit, FactorSource
from app.models.engine import ValidationRule

def seed_factors_units_validation():
    db = SessionLocal()
    try:
        print("1. Seeding Authoritative Units of Measure...")
        unit_defs = [
            ("L", "Litres", "Volume", "L"),
            ("KL", "Kilolitres", "Volume", "kL"),
            ("m3", "Cubic Metres", "Volume", "m³"),
            ("kWh", "Kilowatt-hour", "Energy", "kWh"),
            ("MWh", "Megawatt-hour", "Energy", "MWh"),
            ("GJ", "Gigajoules", "Energy", "GJ"),
            ("kg", "Kilograms", "Mass", "kg"),
            ("MT", "Metric Tonnes", "Mass", "MT"),
            ("hrs", "Man Hours", "Time", "hrs"),
            ("count", "Count / Numbers", "Dimensionless", "nos"),
            ("pct", "Percentage", "Ratio", "%"),
            ("inr_cr", "Indian Rupees (Crores)", "Currency", "₹ Cr")
        ]

        for code, name, dimension, symbol in unit_defs:
            u = db.query(Unit).filter(Unit.code == code).first()
            if not u:
                u = Unit(code=code, name=name, dimension=dimension, symbol=symbol, is_active=True)
                db.add(u)
        db.flush()

        print("2. Seeding Unit Conversions...")
        conversion_defs = [
            ("L", "KL", 0.001, "DIV_1000"),
            ("KL", "L", 1000.0, "MUL_1000"),
            ("kg", "MT", 0.001, "DIV_1000"),
            ("MT", "kg", 1000.0, "MUL_1000"),
            ("kWh", "GJ", 0.0036, "MUL_0_0036"),
            ("MWh", "GJ", 3.6, "MUL_3_6"),
            ("L_diesel", "GJ", 0.0358, "MUL_0_0358"),
        ]

        for from_u, to_u, factor, formula in conversion_defs:
            uc = db.query(UnitConversion).filter(
                UnitConversion.from_unit == from_u,
                UnitConversion.to_unit == to_u
            ).first()
            if not uc:
                uc = UnitConversion(
                    from_unit=from_u,
                    to_unit=to_u,
                    factor=factor,
                    formula_code=formula,
                    version="v1.0",
                    source="SI / CEA Standards",
                    status="ACTIVE"
                )
                db.add(uc)
        db.flush()

        print("3. Seeding Authoritative Factor Sources...")
        sources = [
            ("CEA Baseline v19", "Central Electricity Authority, Ministry of Power, Govt of India", "https://cea.nic.in", "v19-2024", date(2024, 6, 1), "Combined Margin (CM) grid baseline for Indian regional grids"),
            ("IPCC 2006", "Intergovernmental Panel on Climate Change", "https://www.ipcc-nggip.iges.or.jp", "2006-GL", date(2006, 1, 1), "2006 IPCC Guidelines for National Greenhouse Gas Inventories"),
            ("GHG Protocol Corporate", "World Resources Institute / WBCSD", "https://ghgprotocol.org", "Revised-2015", date(2015, 1, 1), "A Corporate Accounting and Reporting Standard")
        ]

        for name, pub, url, ver, ref_d, meth in sources:
            fs = db.query(FactorSource).filter(FactorSource.name == name).first()
            if not fs:
                fs = FactorSource(name=name, publisher=pub, source_url=url, version=ver, reference_date=ref_d, methodology=meth)
                db.add(fs)
        db.flush()

        print("4. Seeding Authoritative Emission Factors (CEA India Baseline v19 & IPCC)...")
        factors = [
            ("ef-diesel-01", "Stationary & Mobile Combustion", "Diesel", 2.68, "kg CO2e / Litre", "SCOPE_1", "Central Electricity Authority & IPCC 2006", "v19-2024", date(2024, 4, 1)),
            ("ef-petrol-01", "Mobile Transport Combustion", "Petrol", 2.31, "kg CO2e / Litre", "SCOPE_1", "IPCC 2006 Guidelines", "v19-2024", date(2024, 4, 1)),
            ("ef-gas-01", "Pipeline & CGD Distribution", "Natural Gas", 2.03, "kg CO2e / m3", "SCOPE_1", "GHG Protocol & CEA", "v19-2024", date(2024, 4, 1)),
            ("ef-lpg-01", "Liquefied Petroleum Gas", "LPG", 2.98, "kg CO2e / kg", "SCOPE_1", "IPCC 2006 Guidelines", "2024", date(2024, 4, 1)),
            ("ef-cng-01", "Compressed Natural Gas", "CNG", 2.75, "kg CO2e / kg", "SCOPE_1", "CEA / Petroleum Ministry", "2024", date(2024, 4, 1)),
            ("ef-grid-cea", "Purchased Grid Electricity", "Grid Electricity", 0.716, "kg CO2e / kWh", "SCOPE_2", "CEA India Grid Baseline Database v19", "v19-2024", date(2024, 4, 1)),
            ("ef-renew-solar", "Captive & PPA Clean Solar", "Solar Energy", 0.000, "kg CO2e / kWh", "SCOPE_2", "GHG Protocol Scope 2 Guidance (Market-based Zero)", "2024", date(2024, 4, 1)),
            ("ef-renew-wind", "Captive Clean Wind Energy", "Wind Energy", 0.000, "kg CO2e / kWh", "SCOPE_2", "GHG Protocol Scope 2 Guidance (Market-based Zero)", "2024", date(2024, 4, 1)),
            ("ef-cement-01", "Embodied Carbon in Construction", "Cement", 820.0, "kg CO2e / Tonne", "SCOPE_3", "IPCC 2006 & MEIL Supply Chain LCA", "2024", date(2024, 4, 1)),
            ("ef-steel-01", "Embodied Carbon in Structural Steel", "Structural Steel", 1850.0, "kg CO2e / Tonne", "SCOPE_3", "World Steel Association & IPCC", "2024", date(2024, 4, 1))
        ]

        for fid, cat, act, val, u, sc, src, ver, eff in factors:
            ef = db.query(EmissionFactor).filter(EmissionFactor.activity_type == act).first()
            if not ef:
                ef = EmissionFactor(
                    id=fid, category=cat, activity_type=act, factor=val,
                    unit=u, scope=sc, source=src, source_version=ver,
                    effective_date=eff, geography="India", status="ACTIVE"
                )
                db.add(ef)
            else:
                ef.factor = val
                ef.unit = u
                ef.scope = sc
                ef.source = src
                ef.source_version = ver
                ef.status = "ACTIVE"
        db.flush()

        print("5. Seeding Authoritative Validation Rules...")
        validation_rules = [
            ("VR-ENV-001", "Non-Negative Fuel Quantity", "Fuel", "quantity", "quantity >= 0", "ERROR", True, "Fuel quantity cannot be negative.", "v1.0"),
            ("VR-ENV-002", "Non-Negative Energy Consumption", "Energy", "quantity_kwh", "quantity_kwh >= 0", "ERROR", True, "Grid electricity consumed cannot be negative.", "v1.0"),
            ("VR-ENV-003", "Renewable Portion Exceeds Total", "Energy", "renewable_kwh", "renewable_kwh <= quantity_kwh", "ERROR", True, "Renewable energy cannot exceed total energy consumption.", "v1.0"),
            ("VR-WATER-001", "Water Zero-Withdrawal Recycling Anomaly", "Water", "recycled_kl", "withdrawal_kl > 0 or recycled_kl == 0", "ERROR", True, "Recycling cannot occur when total withdrawal is zero (ADR-005).", "v1.0"),
            ("VR-WATER-002", "Recycled Plus Discharged Balance", "Water", "discharged_kl", "(recycled_kl + discharged_kl) <= (withdrawal_kl * 1.5)", "WARNING", False, "Total recycled and discharged water significantly exceeds withdrawal. Verify internal generation sources.", "v1.0"),
            ("VR-SAFETY-001", "Safe Man Hours Non-Zero", "Safety", "safe_man_hours", "safe_man_hours > 0", "ERROR", True, "Safe man hours must be greater than zero for operational project reporting.", "v1.0"),
            ("VR-SAFETY-002", "Non-Negative Injury Counts", "Safety", "lost_time_injuries", "lost_time_injuries >= 0 and fatalities >= 0", "ERROR", True, "Injuries and fatalities cannot be negative numbers.", "v1.0"),
            ("VR-PERIOD-001", "Locked Reporting Period Immutability", "Period", "is_locked", "is_locked == False", "ERROR", True, "Target reporting period is locked by Group HQ. Modifications require controlled revision workflow.", "v1.0"),
            ("VR-EVID-001", "High Volume Fuel Evidence Mandatory", "Fuel", "evidence_id", "quantity < 10000 or (evidence_id is not None and evidence_id != '')", "WARNING", False, "High volume fuel consumption (>10,000 L) strongly requires attached weighbridge/invoice evidence.", "v1.0")
        ]

        for rcode, name, domain, fkey, cond, sev, block, tmpl, ver in validation_rules:
            vr = db.query(ValidationRule).filter(ValidationRule.rule_code == rcode).first()
            if not vr:
                vr = ValidationRule(
                    rule_code=rcode, name=name, domain=domain, field_key=fkey,
                    condition_expression=cond, severity=sev, blocking=block,
                    message_template=tmpl, version=ver, status="ACTIVE"
                )
                db.add(vr)
            else:
                vr.condition_expression = cond
                vr.message_template = tmpl
                vr.blocking = block
                vr.severity = sev
                vr.status = "ACTIVE"

        db.commit()
        print("Authoritative Factors, Units, and Validation Rules seeded successfully!")
    except Exception as e:
        db.rollback()
        print(f"Error during seeding: {e}")
        raise
    finally:
        db.close()

if __name__ == "__main__":
    seed_factors_units_validation()
