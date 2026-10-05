from typing import Optional, List
from pydantic import BaseModel

class EmissionCalculationRequest(BaseModel):
    diesel_litres: float = 0.0
    petrol_litres: float = 0.0
    natural_gas_m3: float = 0.0
    grid_kwh: float = 0.0
    renewable_kwh: float = 0.0
    cement_tonnes: float = 0.0
    steel_tonnes: float = 0.0
    turnover_inr_cr: Optional[float] = 1.0

class EmissionCalculationResponse(BaseModel):
    scope1_co2e_tonnes: float
    scope2_co2e_tonnes: float
    scope3_co2e_tonnes: float
    total_ghg_co2e_tonnes: float
    ghg_intensity_per_cr: float
    total_energy_gj: float
    renewable_energy_share_pct: float
    factors_used: List[dict] = []
    methodology: str = "GHG Protocol Corporate Standard & CEA India Grid Baseline v19"
