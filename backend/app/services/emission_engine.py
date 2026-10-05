from typing import Dict, Any, List, Optional
from datetime import datetime, timezone
from sqlalchemy.orm import Session
from app.models.factors import EmissionFactor
from app.models.reporting import Submission
from app.models.esg_records import FuelRecord, EnergyRecord, WaterRecord, WasteRecord, SafetyRecord
from app.models.engine import CalculationRun, CalculationResult

class EmissionEngine:
    ENGINE_VERSION = "CEA-v19.2-GHG-Protocol"

    @staticmethod
    def get_factor(db: Session, activity_type: str, category: str = None) -> Dict[str, Any]:
        """Look up authoritative active emission factor from database master"""
        query = db.query(EmissionFactor).filter(
            EmissionFactor.activity_type.ilike(f"%{activity_type}%"),
            EmissionFactor.status == "ACTIVE"
        )
        factor_record = query.first()
        if factor_record:
            return {
                "id": factor_record.id,
                "factor": factor_record.factor,
                "unit": factor_record.unit,
                "scope": factor_record.scope,
                "source": factor_record.source,
                "version": factor_record.source_version
            }
        
        # Controlled fallback with explicit documentation if DB factor is missing
        fallbacks = {
            "diesel": {"factor": 2.68, "unit": "kg CO2e / Litre", "scope": "SCOPE_1", "version": "v19-2024", "source": "CEA India Baseline v19"},
            "petrol": {"factor": 2.31, "unit": "kg CO2e / Litre", "scope": "SCOPE_1", "version": "v19-2024", "source": "IPCC 2006"},
            "natural_gas": {"factor": 2.03, "unit": "kg CO2e / m3", "scope": "SCOPE_1", "version": "v19-2024", "source": "GHG Protocol"},
            "grid_electricity": {"factor": 0.716, "unit": "kg CO2e / kWh", "scope": "SCOPE_2", "version": "CEA-v19", "source": "CEA India Baseline v19"},
            "cement": {"factor": 820.0, "unit": "kg CO2e / Tonne", "scope": "SCOPE_3", "version": "IPCC-2006", "source": "IPCC 2006"},
            "steel": {"factor": 1850.0, "unit": "kg CO2e / Tonne", "scope": "SCOPE_3", "version": "IPCC-2006", "source": "World Steel Association"}
        }
        key = activity_type.lower()
        if key in fallbacks:
            fb = fallbacks[key]
            return {
                "id": f"std-{key}",
                "factor": fb["factor"],
                "unit": fb["unit"],
                "scope": fb["scope"],
                "source": fb["source"],
                "version": fb["version"]
            }
        return {"id": "default-1", "factor": 1.0, "unit": "kg CO2e / unit", "scope": "SCOPE_1", "source": "Default", "version": "1.0"}

    @staticmethod
    def execute_submission_calculations(
        db: Session,
        submission_id: str,
        user_id: Optional[str] = None
    ) -> CalculationRun:
        """
        Execute deterministic calculation engine run for a submission,
        persisting CalculationRun and itemized CalculationResult records.
        """
        submission = db.query(Submission).filter(Submission.id == submission_id).first()
        if not submission:
            raise ValueError(f"Submission {submission_id} not found")

        # Create CalculationRun
        run = CalculationRun(
            submission_id=submission_id,
            engine_version=EmissionEngine.ENGINE_VERSION,
            status="COMPLETED",
            created_by=user_id,
            completed_at=datetime.now(timezone.utc)
        )
        db.add(run)
        db.flush()

        results: List[CalculationResult] = []

        # 1. Process Fuel Records (Scope 1)
        for f in submission.fuel_records:
            factor = EmissionEngine.get_factor(db, f.fuel_type)
            scope1_tons = round((f.quantity * factor["factor"]) / 1000.0, 2)
            f.scope1_co2e_tonnes = scope1_tons
            f.factor_id = factor["id"]
            f.factor_version = factor["version"]

            results.append(CalculationResult(
                calculation_run_id=run.id,
                source_record_type="FuelRecord",
                source_record_id=f.id,
                metric_key="scope1_co2e_tonnes",
                input_value=f.quantity,
                input_unit=f.unit,
                factor_id=factor["id"],
                factor_version=factor["version"],
                formula_code="QTY_X_FACTOR_DIV_1000",
                result_value=scope1_tons,
                result_unit="tCO2e"
            ))

        # 2. Process Energy Records (Scope 2 & GJ)
        for e in submission.energy_records:
            factor = EmissionEngine.get_factor(db, "grid_electricity")
            grid_kwh = max(0.0, e.quantity_kwh - (e.renewable_kwh or 0.0))
            scope2_tons = round((grid_kwh * factor["factor"]) / 1000.0, 2)
            energy_gj = round((e.quantity_kwh * 3.6) / 1000.0, 1)

            e.scope2_co2e_tonnes = scope2_tons
            e.energy_gj = energy_gj
            e.factor_id = factor["id"]
            e.factor_version = factor["version"]

            # Scope 2 result
            results.append(CalculationResult(
                calculation_run_id=run.id,
                source_record_type="EnergyRecord",
                source_record_id=e.id,
                metric_key="scope2_co2e_tonnes",
                input_value=grid_kwh,
                input_unit="kWh",
                factor_id=factor["id"],
                factor_version=factor["version"],
                formula_code="GRID_KWH_X_FACTOR_DIV_1000",
                result_value=scope2_tons,
                result_unit="tCO2e"
            ))

            # Energy GJ result
            results.append(CalculationResult(
                calculation_run_id=run.id,
                source_record_type="EnergyRecord",
                source_record_id=e.id,
                metric_key="energy_gj",
                input_value=e.quantity_kwh,
                input_unit="kWh",
                formula_code="TOTAL_KWH_X_3_6_DIV_1000",
                result_value=energy_gj,
                result_unit="GJ"
            ))

        # 3. Process Water Records (Recycling % with ADR-005 0-withdrawal handling)
        for w in submission.water_records:
            if w.withdrawal_kl > 0:
                recycling_pct = round((w.recycled_kl / w.withdrawal_kl) * 100.0, 1)
            else:
                recycling_pct = 0.0 # ADR-005: 0 withdrawal does NOT equal 100% recycling

            results.append(CalculationResult(
                calculation_run_id=run.id,
                source_record_type="WaterRecord",
                source_record_id=w.id,
                metric_key="water_recycling_pct",
                input_value=w.recycled_kl,
                input_unit="KL",
                formula_code="RECYCLED_DIV_WITHDRAWAL_X_100" if w.withdrawal_kl > 0 else "ZERO_WITHDRAWAL_ZERO_RECYCLE",
                result_value=recycling_pct,
                result_unit="%"
            ))

        # 4. Process Safety Records (LTIFR)
        for s in submission.safety_records:
            ltifr = round(((s.lost_time_injuries or 0) * 1000000.0) / s.safe_man_hours, 2) if s.safe_man_hours > 0 else 0.0
            s.ltifr = ltifr

            results.append(CalculationResult(
                calculation_run_id=run.id,
                source_record_type="SafetyRecord",
                source_record_id=s.id,
                metric_key="ltifr",
                input_value=float(s.lost_time_injuries or 0),
                input_unit="Injuries",
                formula_code="INJURIES_X_1M_DIV_SAFE_HOURS",
                result_value=ltifr,
                result_unit="LTIFR"
            ))

        db.add_all(results)
        db.commit()
        db.refresh(run)
        return run

    @staticmethod
    def calculate_scope1(db: Session, diesel_litres: float = 0.0, petrol_litres: float = 0.0, natural_gas_m3: float = 0.0) -> float:
        f_diesel = EmissionEngine.get_factor(db, "Diesel")["factor"]
        f_petrol = EmissionEngine.get_factor(db, "Petrol")["factor"]
        f_gas = EmissionEngine.get_factor(db, "Natural Gas")["factor"]

        diesel_co2 = diesel_litres * f_diesel
        petrol_co2 = petrol_litres * f_petrol
        gas_co2 = natural_gas_m3 * f_gas
        return round((diesel_co2 + petrol_co2 + gas_co2) / 1000.0, 2)

    @staticmethod
    def calculate_scope2(db: Session, grid_kwh: float = 0.0, renewable_kwh: float = 0.0) -> float:
        f_grid = EmissionEngine.get_factor(db, "Grid Electricity")["factor"]
        grid_co2 = grid_kwh * f_grid
        return round(grid_co2 / 1000.0, 2)

    @staticmethod
    def calculate_scope3(db: Session, cement_tonnes: float = 0.0, steel_tonnes: float = 0.0) -> float:
        f_cement = EmissionEngine.get_factor(db, "Cement")["factor"]
        f_steel = EmissionEngine.get_factor(db, "Structural Steel")["factor"]

        cement_co2 = cement_tonnes * f_cement
        steel_co2 = steel_tonnes * f_steel
        return round((cement_co2 + steel_co2) / 1000.0, 2)

    @staticmethod
    def calculate_total_energy_gj(diesel_litres: float = 0.0, grid_kwh: float = 0.0, solar_kwh: float = 0.0) -> float:
        diesel_gj = (diesel_litres * 35.8) / 1000.0
        electricity_gj = ((grid_kwh + solar_kwh) * 3.6) / 1000.0
        return round(diesel_gj + electricity_gj, 1)

    @staticmethod
    def calculate_ghg_intensity(total_ghg_tonnes: float, turnover_inr_cr: float) -> Optional[float]:
        if not turnover_inr_cr or turnover_inr_cr <= 0:
            return None # ADR-007: No fake turnover denominator
        return round(total_ghg_tonnes / turnover_inr_cr, 2)
