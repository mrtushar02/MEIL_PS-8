from typing import Dict, Any, List
from sqlalchemy.orm import Session
from app.models.factors import EmissionFactor

# Standard baseline factors (Fallback if not in DB)
DEFAULT_FACTORS = {
    "diesel": {"factor": 2.68, "unit": "kg CO2e / Litre", "scope": "SCOPE_1", "version": "v19-2024"},
    "petrol": {"factor": 2.31, "unit": "kg CO2e / Litre", "scope": "SCOPE_1", "version": "v19-2024"},
    "natural_gas": {"factor": 2.03, "unit": "kg CO2e / m3", "scope": "SCOPE_1", "version": "v19-2024"},
    "grid_electricity": {"factor": 0.716, "unit": "kg CO2e / kWh", "scope": "SCOPE_2", "version": "CEA-v19"},
    "cement": {"factor": 820.0, "unit": "kg CO2e / Tonne", "scope": "SCOPE_3", "version": "IPCC-2006"},
    "steel": {"factor": 1850.0, "unit": "kg CO2e / Tonne", "scope": "SCOPE_3", "version": "IPCC-2006"},
    "diesel_energy_mj": 35.8,
    "electricity_energy_mj": 3.6
}

class EmissionEngine:
    @staticmethod
    def get_factor(db: Session, activity_type: str, category: str = None) -> Dict[str, Any]:
        """Look up active versioned emission factor from database, or fallback to standard baseline"""
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
        
        # Fallback to defaults
        key = activity_type.lower()
        if key in DEFAULT_FACTORS:
            d = DEFAULT_FACTORS[key]
            return {
                "id": f"std-{key}",
                "factor": d["factor"],
                "unit": d["unit"],
                "scope": d["scope"],
                "source": "CEA India Baseline v19 / IPCC",
                "version": d["version"]
            }
        return {"id": "default", "factor": 1.0, "unit": "kg CO2e / unit", "scope": "SCOPE_1", "version": "1.0"}

    @staticmethod
    def calculate_scope1(diesel_litres: float = 0.0, petrol_litres: float = 0.0, natural_gas_m3: float = 0.0) -> float:
        """Scope 1: Direct fuel combustion in tonnes CO2e"""
        diesel_co2_kg = diesel_litres * DEFAULT_FACTORS["diesel"]["factor"]
        petrol_co2_kg = petrol_litres * DEFAULT_FACTORS["petrol"]["factor"]
        gas_co2_kg = natural_gas_m3 * DEFAULT_FACTORS["natural_gas"]["factor"]
        return round((diesel_co2_kg + petrol_co2_kg + gas_co2_kg) / 1000.0, 2)

    @staticmethod
    def calculate_scope2(grid_kwh: float = 0.0, renewable_kwh: float = 0.0) -> float:
        """Scope 2: Purchased grid electricity in tonnes CO2e (zero for renewable)"""
        grid_co2_kg = grid_kwh * DEFAULT_FACTORS["grid_electricity"]["factor"]
        return round(grid_co2_kg / 1000.0, 2)

    @staticmethod
    def calculate_scope3(cement_tonnes: float = 0.0, steel_tonnes: float = 0.0) -> float:
        """Scope 3: Upstream embodied material carbon in tonnes CO2e"""
        cement_co2_kg = cement_tonnes * DEFAULT_FACTORS["cement"]["factor"]
        steel_co2_kg = steel_tonnes * DEFAULT_FACTORS["steel"]["factor"]
        return round((cement_co2_kg + steel_co2_kg) / 1000.0, 2)

    @staticmethod
    def calculate_total_energy_gj(diesel_litres: float = 0.0, grid_kwh: float = 0.0, solar_kwh: float = 0.0) -> float:
        """Total Energy consumed in GigaJoules (GJ)"""
        diesel_gj = (diesel_litres * DEFAULT_FACTORS["diesel_energy_mj"]) / 1000.0
        electricity_gj = ((grid_kwh + solar_kwh) * DEFAULT_FACTORS["electricity_energy_mj"]) / 1000.0
        return round(diesel_gj + electricity_gj, 1)

    @staticmethod
    def calculate_ghg_intensity(total_ghg_tonnes: float, turnover_inr_cr: float) -> float:
        """SEBI BRSR Core Metric 1: GHG intensity per Crore turnover"""
        if not turnover_inr_cr or turnover_inr_cr <= 0:
            return 0.0
        return round(total_ghg_tonnes / turnover_inr_cr, 2)
