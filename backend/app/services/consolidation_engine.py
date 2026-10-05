from typing import List, Dict, Any
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.models.organization import Group, Subsidiary, BusinessUnit, Project
from app.models.reporting import Submission
from app.models.esg_records import FuelRecord, EnergyRecord, WaterRecord, WasteRecord, SafetyRecord

class ConsolidationEngine:
    @staticmethod
    def consolidate_project(db: Session, project_id: str, reporting_period_id: str) -> Dict[str, Any]:
        """Aggregate all operational source records for a specific project site"""
        # Fuel / Scope 1
        fuel_totals = db.query(
            func.sum(FuelRecord.quantity).label("total_fuel"),
            func.sum(FuelRecord.scope1_co2e_tonnes).label("scope1_tonnes")
        ).filter(
            FuelRecord.project_id == project_id,
            FuelRecord.reporting_period_id == reporting_period_id
        ).first()

        # Energy / Scope 2
        energy_totals = db.query(
            func.sum(EnergyRecord.quantity_kwh).label("total_kwh"),
            func.sum(EnergyRecord.renewable_kwh).label("renewable_kwh"),
            func.sum(EnergyRecord.scope2_co2e_tonnes).label("scope2_tonnes"),
            func.sum(EnergyRecord.energy_gj).label("total_energy_gj")
        ).filter(
            EnergyRecord.project_id == project_id,
            EnergyRecord.reporting_period_id == reporting_period_id
        ).first()

        # Water
        water_totals = db.query(
            func.sum(WaterRecord.withdrawal_kl).label("withdrawal_kl"),
            func.sum(WaterRecord.recycled_kl).label("recycled_kl")
        ).filter(
            WaterRecord.project_id == project_id,
            WaterRecord.reporting_period_id == reporting_period_id
        ).first()

        # Safety
        safety_totals = db.query(
            func.sum(SafetyRecord.safe_man_hours).label("safe_hours"),
            func.sum(SafetyRecord.lost_time_injuries).label("lti"),
            func.sum(SafetyRecord.fatalities).label("fatalities")
        ).filter(
            SafetyRecord.project_id == project_id,
            SafetyRecord.reporting_period_id == reporting_period_id
        ).first()

        scope1 = fuel_totals.scope1_tonnes or 0.0
        scope2 = energy_totals.scope2_tonnes or 0.0
        withdrawal = water_totals.withdrawal_kl or 0.0
        recycled = water_totals.recycled_kl or 0.0
        water_recycled_pct = round((recycled / withdrawal) * 100.0, 1) if withdrawal > 0 else 0.0

        safe_hours = safety_totals.safe_hours or 0.0
        lti = safety_totals.lti or 0
        ltifr = round((lti * 1000000.0) / safe_hours, 2) if safe_hours > 0 else 0.0

        return {
            "project_id": project_id,
            "reporting_period_id": reporting_period_id,
            "scope1_co2e_tonnes": round(scope1, 2),
            "scope2_co2e_tonnes": round(scope2, 2),
            "total_ghg_co2e_tonnes": round(scope1 + scope2, 2),
            "total_kwh": energy_totals.total_kwh or 0.0,
            "total_energy_gj": energy_totals.total_energy_gj or 0.0,
            "water_withdrawal_kl": withdrawal,
            "water_recycled_kl": recycled,
            "water_recycled_pct": water_recycled_pct,
            "safe_man_hours": safe_hours,
            "ltifr": ltifr,
            "fatalities": safety_totals.fatalities or 0
        }

    @staticmethod
    def consolidate_business_unit(db: Session, bu_id: str, reporting_period_id: str) -> Dict[str, Any]:
        """Roll up all projects inside a business unit"""
        projects = db.query(Project).filter(Project.business_unit_id == bu_id).all()
        project_ids = [p.id for p in projects]
        results = [ConsolidationEngine.consolidate_project(db, pid, reporting_period_id) for pid in project_ids]
        
        scope1 = sum(r["scope1_co2e_tonnes"] for r in results)
        scope2 = sum(r["scope2_co2e_tonnes"] for r in results)
        water_with = sum(r["water_withdrawal_kl"] for r in results)
        water_rec = sum(r["water_recycled_kl"] for r in results)
        safe_hours = sum(r["safe_man_hours"] for r in results)
        lti = sum(int(r["ltifr"] * r["safe_man_hours"] / 1000000) for r in results) if safe_hours > 0 else 0

        return {
            "business_unit_id": bu_id,
            "project_count": len(projects),
            "scope1_co2e_tonnes": round(scope1, 2),
            "scope2_co2e_tonnes": round(scope2, 2),
            "total_ghg_co2e_tonnes": round(scope1 + scope2, 2),
            "water_recycled_pct": round((water_rec / water_with) * 100.0, 1) if water_with > 0 else 0.0,
            "ltifr": round((lti * 1000000.0) / safe_hours, 2) if safe_hours > 0 else 0.0,
            "project_breakdown": results
        }

    @staticmethod
    def consolidate_group(db: Session, reporting_period_id: str) -> Dict[str, Any]:
        """Group HQ enterprise roll-up across all subsidiaries and projects"""
        subsidiaries = db.query(Subsidiary).all()
        all_projects = db.query(Project).all()
        project_ids = [p.id for p in all_projects]
        results = [ConsolidationEngine.consolidate_project(db, pid, reporting_period_id) for pid in project_ids]

        scope1 = sum(r["scope1_co2e_tonnes"] for r in results)
        scope2 = sum(r["scope2_co2e_tonnes"] for r in results)
        total_energy_gj = sum(r["total_energy_gj"] for r in results)
        water_with = sum(r["water_withdrawal_kl"] for r in results)
        water_rec = sum(r["water_recycled_kl"] for r in results)
        safe_hours = sum(r["safe_man_hours"] for r in results)

        return {
            "group_name": "Megha Engineering & Infrastructures Limited (MEIL Group)",
            "reporting_period_id": reporting_period_id,
            "total_subsidiaries": len(subsidiaries),
            "total_projects_monitored": len(all_projects),
            "scope1_co2e_tonnes": round(scope1, 2),
            "scope2_co2e_tonnes": round(scope2, 2),
            "total_ghg_co2e_tonnes": round(scope1 + scope2, 2),
            "total_energy_gj": round(total_energy_gj, 1),
            "water_withdrawal_kl": water_with,
            "water_recycled_kl": water_rec,
            "water_recycled_pct": round((water_rec / water_with) * 100.0, 1) if water_with > 0 else 0.0,
            "total_safe_man_hours": safe_hours
        }
