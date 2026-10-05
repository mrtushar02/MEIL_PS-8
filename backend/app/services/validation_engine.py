from typing import Dict, List, Any

class ValidationEngine:
    @staticmethod
    def validate_monthly_submission(data: Dict[str, Any]) -> Dict[str, Any]:
        """Execute non-negotiable validation rules before saving or submitting"""
        errors: List[str] = []
        warnings: List[str] = []

        # 1. Non-negative quantities check
        fuel_records = data.get("fuel_records", [])
        for f in fuel_records:
            qty = f.get("quantity", 0)
            if qty < 0:
                errors.append(f"Fuel quantity for {f.get('fuel_type')} cannot be negative: {qty}")
            if qty > 500000:
                warnings.append(f"High fuel anomaly: {qty} L exceeds normal site threshold of 500,000 L.")
            if qty > 50000 and not f.get("evidence_id"):
                errors.append(f"Statutory proof document mandatory for fuel exceeding 50,000 L ({f.get('fuel_type')}).")

        # 2. Water recycling validity
        water_records = data.get("water_records", [])
        for w in water_records:
            withdrawal = w.get("withdrawal_kl", 0)
            recycled = w.get("recycled_kl", 0)
            if withdrawal < 0 or recycled < 0:
                errors.append("Water withdrawal and recycled quantities cannot be negative.")
            if recycled > withdrawal:
                errors.append(f"Water recycled ({recycled} KL) cannot exceed total withdrawal ({withdrawal} KL).")

        # 3. Safety consistency
        safety_records = data.get("safety_records", [])
        for s in safety_records:
            man_hours = s.get("safe_man_hours", 0)
            lti = s.get("lost_time_injuries", 0)
            fatalities = s.get("fatalities", 0)
            if man_hours <= 0:
                errors.append("Safe work man-hours must be greater than zero for active project reporting.")
            if fatalities > 0:
                warnings.append("CRITICAL INCIDENT: Fatality reported. Immediate board vigilance notification required.")

        return {
            "is_valid": len(errors) == 0,
            "errors": errors,
            "warnings": warnings,
            "rules_checked_count": 8
        }
