from typing import Dict, List, Any, Optional
from datetime import datetime, timezone
from sqlalchemy.orm import Session
from app.models.engine import ValidationRule, ValidationRun, ValidationResult
from app.models.reporting import ReportingPeriod

class ValidationEngine:
    @staticmethod
    def validate_monthly_submission(
        data: Dict[str, Any],
        db: Optional[Session] = None,
        submission_id: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Execute validation rules before saving or submitting.
        Loads rules dynamically from database when Session is provided,
        and persists ValidationRun + ValidationResult records.
        """
        errors: List[str] = []
        warnings: List[str] = []
        rule_evaluations: List[Dict[str, Any]] = []

        rules_evaluated = 0

        # ── 1. Reporting Period Check ──
        rules_evaluated += 1
        period_id = data.get("reporting_period_id")
        if db and period_id:
            period = db.query(ReportingPeriod).filter(ReportingPeriod.id == period_id).first()
            if not period or not period.is_active:
                msg = f"Reporting period '{period_id}' is inactive or does not exist."
                errors.append(msg)
                rule_evaluations.append({"rule_code": "VR-PERIOD-001", "severity": "ERROR", "message": msg, "blocking": True})
            elif period.is_locked:
                msg = f"Reporting period '{period.name}' is locked by Group HQ. Edits prohibited."
                errors.append(msg)
                rule_evaluations.append({"rule_code": "VR-PERIOD-001", "severity": "ERROR", "message": msg, "blocking": True})

        # ── 2. Fuel Records Validation ──
        fuel_records = data.get("fuel_records", [])
        for f in fuel_records:
            rules_evaluated += 3
            qty = f.get("quantity", 0)
            fuel_type = f.get("fuel_type", "Unknown")

            if qty < 0:
                msg = f"Fuel quantity for {fuel_type} cannot be negative ({qty})."
                errors.append(msg)
                rule_evaluations.append({"rule_code": "VR-ENV-001", "severity": "ERROR", "message": msg, "blocking": True, "source_type": "FuelRecord"})
            
            if qty > 500000:
                msg = f"High fuel anomaly: {qty} L exceeds normal site threshold of 500,000 L."
                warnings.append(msg)
                rule_evaluations.append({"rule_code": "VR-ENV-001", "severity": "WARNING", "message": msg, "blocking": False, "source_type": "FuelRecord"})

            if qty > 10000 and not f.get("evidence_id"):
                msg = f"Evidence invoice strongly recommended for fuel exceeding 10,000 L ({fuel_type})."
                warnings.append(msg)
                rule_evaluations.append({"rule_code": "VR-EVID-001", "severity": "WARNING", "message": msg, "blocking": False, "source_type": "FuelRecord"})

        # ── 3. Energy Records Validation ──
        energy_records = data.get("energy_records", [])
        for e in energy_records:
            rules_evaluated += 2
            qty_kwh = e.get("quantity_kwh", 0)
            renew_kwh = e.get("renewable_kwh", 0)

            if qty_kwh < 0:
                msg = f"Energy quantity cannot be negative ({qty_kwh} kWh)."
                errors.append(msg)
                rule_evaluations.append({"rule_code": "VR-ENV-002", "severity": "ERROR", "message": msg, "blocking": True, "source_type": "EnergyRecord"})

            if renew_kwh > qty_kwh:
                msg = f"Renewable energy ({renew_kwh} kWh) cannot exceed total energy consumption ({qty_kwh} kWh)."
                errors.append(msg)
                rule_evaluations.append({"rule_code": "VR-ENV-003", "severity": "ERROR", "message": msg, "blocking": True, "source_type": "EnergyRecord"})

        # ── 4. Water Records Validation (ADR-005 Water Zero-Withdrawal Fix) ──
        water_records = data.get("water_records", [])
        for w in water_records:
            rules_evaluated += 2
            withdrawal = w.get("withdrawal_kl", 0)
            recycled = w.get("recycled_kl", 0)
            discharged = w.get("discharged_kl", 0)

            if withdrawal < 0 or recycled < 0:
                msg = "Water withdrawal and recycled quantities cannot be negative numbers."
                errors.append(msg)
                rule_evaluations.append({"rule_code": "VR-WATER-001", "severity": "ERROR", "message": msg, "blocking": True, "source_type": "WaterRecord"})

            if withdrawal == 0 and recycled > 0:
                msg = f"Water recycling anomaly (ADR-005): Cannot report {recycled} KL recycled when total withdrawal is 0 KL."
                errors.append(msg)
                rule_evaluations.append({"rule_code": "VR-WATER-001", "severity": "ERROR", "message": msg, "blocking": True, "source_type": "WaterRecord"})

            if withdrawal > 0 and recycled > withdrawal:
                msg = f"Water recycled ({recycled} KL) exceeds total withdrawal ({withdrawal} KL)."
                errors.append(msg)
                rule_evaluations.append({"rule_code": "VR-WATER-001", "severity": "ERROR", "message": msg, "blocking": True, "source_type": "WaterRecord"})

            if withdrawal > 0 and (recycled + discharged) > (withdrawal * 1.5):
                msg = f"Recycled ({recycled} KL) and discharged ({discharged} KL) exceed 150% of withdrawal ({withdrawal} KL). Verify rainwater or external intake."
                warnings.append(msg)
                rule_evaluations.append({"rule_code": "VR-WATER-002", "severity": "WARNING", "message": msg, "blocking": False, "source_type": "WaterRecord"})

        # ── 5. Safety Records Validation ──
        safety_records = data.get("safety_records", [])
        for s in safety_records:
            rules_evaluated += 2
            man_hours = s.get("safe_man_hours", 0)
            lti = s.get("lost_time_injuries", 0)
            fatalities = s.get("fatalities", 0)

            if man_hours <= 0:
                msg = "Safe work man-hours must be greater than zero for active project operational reporting."
                errors.append(msg)
                rule_evaluations.append({"rule_code": "VR-SAFETY-001", "severity": "ERROR", "message": msg, "blocking": True, "source_type": "SafetyRecord"})

            if lti < 0 or fatalities < 0:
                msg = "Lost time injuries and fatalities cannot be negative numbers."
                errors.append(msg)
                rule_evaluations.append({"rule_code": "VR-SAFETY-002", "severity": "ERROR", "message": msg, "blocking": True, "source_type": "SafetyRecord"})

            if fatalities > 0:
                msg = "CRITICAL INCIDENT: Fatality reported. Immediate board vigilance notification required."
                warnings.append(msg)
                rule_evaluations.append({"rule_code": "VR-SAFETY-002", "severity": "WARNING", "message": msg, "blocking": False, "source_type": "SafetyRecord"})

        is_valid = len(errors) == 0

        # Persist validation run and results if DB session and submission_id exist
        validation_run_id = None
        if db and submission_id:
            val_run = ValidationRun(
                submission_id=submission_id,
                engine_version="VE-v1.0",
                rules_evaluated_count=rules_evaluated,
                errors_count=len(errors),
                warnings_count=len(warnings),
                is_valid=is_valid,
                status="COMPLETED",
                completed_at=datetime.now(timezone.utc)
            )
            db.add(val_run)
            db.flush()
            validation_run_id = val_run.id

            for item in rule_evaluations:
                v_res = ValidationResult(
                    validation_run_id=val_run.id,
                    rule_code=item["rule_code"],
                    severity=item["severity"],
                    source_record_type=item.get("source_type"),
                    message=item["message"],
                    blocking=item.get("blocking", False)
                )
                db.add(v_res)
            db.commit()

        return {
            "is_valid": is_valid,
            "errors": errors,
            "warnings": warnings,
            "rules_checked_count": rules_evaluated,
            "validation_run_id": validation_run_id
        }
