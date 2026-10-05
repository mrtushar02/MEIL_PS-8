from typing import Dict, Any, List, Optional
from sqlalchemy.orm import Session, joinedload
from app.models.organization import Group, Subsidiary, BusinessUnit, Project
from app.models.reporting import Submission, ReportingPeriod
from app.models.esg_records import FuelRecord, EnergyRecord, WaterRecord, WasteRecord, SafetyRecord

class ConsolidationEngine:
    @staticmethod
    def aggregate_submission_metrics(submissions: List[Submission]) -> Dict[str, Any]:
        """
        Aggregate ESG records across a list of submissions strictly enforcing
        correct mathematical rules (ratio aggregation, no averaging of averages).
        """
        total_scope1 = 0.0
        fuel_breakdown: Dict[str, float] = {}

        total_grid_kwh = 0.0
        total_renewable_kwh = 0.0
        total_scope2 = 0.0
        total_energy_gj = 0.0

        total_withdrawal_kl = 0.0
        total_recycled_kl = 0.0
        total_discharged_kl = 0.0

        total_waste_mt = 0.0
        total_waste_diverted_mt = 0.0

        total_safe_hours = 0.0
        total_lti = 0
        total_fatalities = 0
        total_near_misses = 0

        for sub in submissions:
            # 1. Fuel & Scope 1
            for f in sub.fuel_records:
                s1 = f.scope1_co2e_tonnes or 0.0
                total_scope1 += s1
                fuel_breakdown[f.fuel_type] = fuel_breakdown.get(f.fuel_type, 0.0) + (f.quantity or 0.0)

            # 2. Energy & Scope 2
            for e in sub.energy_records:
                total_grid_kwh += e.quantity_kwh or 0.0
                total_renewable_kwh += e.renewable_kwh or 0.0
                total_scope2 += e.scope2_co2e_tonnes or 0.0
                total_energy_gj += e.energy_gj or 0.0

            # 3. Water
            for w in sub.water_records:
                total_withdrawal_kl += w.withdrawal_kl or 0.0
                total_recycled_kl += w.recycled_kl or 0.0
                total_discharged_kl += w.discharged_kl or 0.0

            # 4. Waste
            for wst in sub.waste_records:
                qty = wst.quantity_metric_tonnes or 0.0
                div_pct = wst.diverted_from_disposal_pct or 0.0
                total_waste_mt += qty
                total_waste_diverted_mt += qty * (div_pct / 100.0)

            # 5. Safety
            for s in sub.safety_records:
                total_safe_hours += s.safe_man_hours or 0.0
                total_lti += s.lost_time_injuries or 0
                total_fatalities += s.fatalities or 0
                total_near_misses += s.near_misses or 0

        # Mathematical ratio aggregations (NEVER average ratios!)
        # LTIFR = (Total Lost Time Injuries * 1,000,000) / Total Safe Man Hours
        consolidated_ltifr = round((total_lti * 1000000.0) / total_safe_hours, 2) if total_safe_hours > 0 else 0.0

        # Water Recycling Rate % (ADR-005: 0 withdrawal does NOT equal 100%)
        water_recycling_pct = round((total_recycled_kl / total_withdrawal_kl) * 100.0, 1) if total_withdrawal_kl > 0 else 0.0

        # Renewable Energy Share %
        total_energy_kwh = total_grid_kwh + total_renewable_kwh
        renewable_share_pct = round((total_renewable_kwh / total_energy_kwh) * 100.0, 1) if total_energy_kwh > 0 else 0.0

        # Waste Diverted Rate %
        waste_diverted_pct = round((total_waste_diverted_mt / total_waste_mt) * 100.0, 1) if total_waste_mt > 0 else 0.0

        return {
            "submissions_count": len(submissions),
            "scope1_co2e_tonnes": round(total_scope1, 2),
            "scope2_co2e_tonnes": round(total_scope2, 2),
            "total_ghg_tonnes": round(total_scope1 + total_scope2, 2),
            "fuel_breakdown": fuel_breakdown,
            "grid_electricity_kwh": round(total_grid_kwh, 1),
            "renewable_energy_kwh": round(total_renewable_kwh, 1),
            "total_energy_kwh": round(total_energy_kwh, 1),
            "renewable_share_pct": renewable_share_pct,
            "energy_gj": round(total_energy_gj, 1),
            "water_withdrawal_kl": round(total_withdrawal_kl, 1),
            "water_recycled_kl": round(total_recycled_kl, 1),
            "water_discharged_kl": round(total_discharged_kl, 1),
            "water_recycling_pct": water_recycling_pct,
            "total_waste_mt": round(total_waste_mt, 2),
            "waste_diverted_mt": round(total_waste_diverted_mt, 2),
            "waste_diverted_pct": waste_diverted_pct,
            "safe_man_hours": round(total_safe_hours, 1),
            "lost_time_injuries": total_lti,
            "fatalities": total_fatalities,
            "near_misses": total_near_misses,
            "ltifr": consolidated_ltifr
        }

    @staticmethod
    def consolidate_business_unit(
        db: Session,
        bu_id: str,
        reporting_period_id: str,
        allowed_statuses: Optional[List[str]] = None
    ) -> Dict[str, Any]:
        """Consolidate all projects belonging to a Business Unit"""
        bu = db.query(BusinessUnit).filter(BusinessUnit.id == bu_id).first()
        if not bu:
            raise ValueError(f"Business Unit {bu_id} not found")

        projects = db.query(Project).filter(Project.business_unit_id == bu_id).all()
        project_ids = [p.id for p in projects]

        sub_query = db.query(Submission).options(
            joinedload(Submission.fuel_records),
            joinedload(Submission.energy_records),
            joinedload(Submission.water_records),
            joinedload(Submission.waste_records),
            joinedload(Submission.safety_records)
        ).filter(
            Submission.project_id.in_(project_ids),
            Submission.reporting_period_id == reporting_period_id
        )

        if allowed_statuses:
            sub_query = sub_query.filter(Submission.status.in_(allowed_statuses))

        submissions = sub_query.all()
        aggregated = ConsolidationEngine.aggregate_submission_metrics(submissions)

        # Drilldown by project
        project_drilldowns = []
        for p in projects:
            p_subs = [s for s in submissions if s.project_id == p.id]
            p_metrics = ConsolidationEngine.aggregate_submission_metrics(p_subs)
            project_drilldowns.append({
                "project_id": p.id,
                "project_code": p.code,
                "project_name": p.name,
                "location": p.location,
                "status": p_subs[0].status if p_subs else "NO_SUBMISSION",
                "metrics": p_metrics
            })

        return {
            "tier": "BUSINESS_UNIT",
            "business_unit_id": bu.id,
            "business_unit_name": bu.name,
            "business_unit_code": bu.code,
            "subsidiary_id": bu.subsidiary_id,
            "reporting_period_id": reporting_period_id,
            "total_projects": len(projects),
            "reported_projects": len(submissions),
            "reporting_completeness_pct": round((len(submissions) / len(projects)) * 100.0, 1) if projects else 0.0,
            "consolidated_metrics": aggregated,
            "project_drilldowns": project_drilldowns
        }

    @staticmethod
    def consolidate_subsidiary(
        db: Session,
        subsidiary_id: str,
        reporting_period_id: str,
        allowed_statuses: Optional[List[str]] = None
    ) -> Dict[str, Any]:
        """Consolidate all Business Units belonging to a Subsidiary"""
        sub = db.query(Subsidiary).filter(Subsidiary.id == subsidiary_id).first()
        if not sub:
            raise ValueError(f"Subsidiary {subsidiary_id} not found")

        bus = db.query(BusinessUnit).filter(BusinessUnit.subsidiary_id == subsidiary_id).all()
        bu_drilldowns = []
        all_submissions: List[Submission] = []

        total_projects = 0
        reported_projects = 0

        for bu in bus:
            bu_res = ConsolidationEngine.consolidate_business_unit(
                db, bu.id, reporting_period_id, allowed_statuses=allowed_statuses
            )
            bu_drilldowns.append(bu_res)
            total_projects += bu_res["total_projects"]
            reported_projects += bu_res["reported_projects"]

        # Aggregate across entire subsidiary projects
        sub_projects = db.query(Project).filter(Project.subsidiary_id == subsidiary_id).all()
        proj_ids = [p.id for p in sub_projects]

        sub_query = db.query(Submission).options(
            joinedload(Submission.fuel_records),
            joinedload(Submission.energy_records),
            joinedload(Submission.water_records),
            joinedload(Submission.waste_records),
            joinedload(Submission.safety_records)
        ).filter(
            Submission.project_id.in_(proj_ids),
            Submission.reporting_period_id == reporting_period_id
        )

        if allowed_statuses:
            sub_query = sub_query.filter(Submission.status.in_(allowed_statuses))

        submissions = sub_query.all()
        consolidated = ConsolidationEngine.aggregate_submission_metrics(submissions)

        # GHG Intensity based on subsidiary turnover (INR Cr)
        turnover = sub.turnover_inr_cr
        ghg_intensity = round(consolidated["total_ghg_tonnes"] / turnover, 2) if (turnover and turnover > 0) else None

        return {
            "tier": "SUBSIDIARY",
            "subsidiary_id": sub.id,
            "subsidiary_name": sub.name,
            "subsidiary_code": sub.code,
            "group_id": sub.group_id,
            "reporting_period_id": reporting_period_id,
            "turnover_inr_cr": turnover,
            "ghg_intensity_tco2e_per_cr": ghg_intensity,
            "total_business_units": len(bus),
            "total_projects": total_projects,
            "reported_projects": reported_projects,
            "reporting_completeness_pct": round((reported_projects / total_projects) * 100.0, 1) if total_projects else 0.0,
            "consolidated_metrics": consolidated,
            "business_unit_drilldowns": bu_drilldowns
        }

    @staticmethod
    def consolidate_group(
        db: Session,
        group_id: str,
        reporting_period_id: str,
        allowed_statuses: Optional[List[str]] = None
    ) -> Dict[str, Any]:
        """
        Consolidate Group Group-wide metrics strictly by traversing
        Group -> Subsidiary -> Business Unit -> Project hierarchy.
        """
        group = db.query(Group).filter(Group.id == group_id).first()
        if not group:
            raise ValueError(f"Group {group_id} not found")

        subsidiaries = db.query(Subsidiary).filter(Subsidiary.group_id == group_id).all()
        sub_drilldowns = []

        total_projects = 0
        reported_projects = 0

        for s in subsidiaries:
            sub_res = ConsolidationEngine.consolidate_subsidiary(
                db, s.id, reporting_period_id, allowed_statuses=allowed_statuses
            )
            sub_drilldowns.append(sub_res)
            total_projects += sub_res["total_projects"]
            reported_projects += sub_res["reported_projects"]

        # Aggregate across all group submissions
        all_subs = db.query(Submission).options(
            joinedload(Submission.fuel_records),
            joinedload(Submission.energy_records),
            joinedload(Submission.water_records),
            joinedload(Submission.waste_records),
            joinedload(Submission.safety_records)
        ).join(Project, Submission.project_id == Project.id)\
         .join(Subsidiary, Project.subsidiary_id == Subsidiary.id)\
         .filter(
             Subsidiary.group_id == group_id,
             Submission.reporting_period_id == reporting_period_id
         )

        if allowed_statuses:
            all_subs = all_subs.filter(Submission.status.in_(allowed_statuses))

        submissions = all_subs.all()
        consolidated = ConsolidationEngine.aggregate_submission_metrics(submissions)

        # Group GHG Intensity (INR Cr)
        turnover = group.turnover_inr_cr
        ghg_intensity = round(consolidated["total_ghg_tonnes"] / turnover, 2) if (turnover and turnover > 0) else None

        return {
            "tier": "GROUP",
            "group_id": group.id,
            "group_name": group.name,
            "group_code": group.code,
            "reporting_period_id": reporting_period_id,
            "turnover_inr_cr": turnover,
            "ghg_intensity_tco2e_per_cr": ghg_intensity,
            "total_subsidiaries": len(subsidiaries),
            "total_projects": total_projects,
            "reported_projects": reported_projects,
            "reporting_completeness_pct": round((reported_projects / total_projects) * 100.0, 1) if total_projects else 0.0,
            "consolidated_metrics": consolidated,
            "subsidiary_drilldowns": sub_drilldowns
        }
