import sys
import os
import unittest
from fastapi.testclient import TestClient

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))

from app.main import app
from app.core.database import SessionLocal
from app.models.reporting import ReportingPeriod, Submission
from app.models.esg_records import FuelRecord, EnergyRecord, WaterRecord, SafetyRecord
from app.models.organization import Project

class TestPhase3CalculationValidation(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.client = TestClient(app)

        # Authenticate site officer (Gayatri project, site-101)
        login_resp = cls.client.post(
            "/api/v1/auth/login",
            json={"email": "site.officer@meilgroup.in", "password": "password123"}
        )
        assert login_resp.status_code == 200, f"Login failed: {login_resp.text}"
        cls.site_token = login_resp.json()["access_token"]
        cls.site_headers = {"Authorization": f"Bearer {cls.site_token}"}

    def test_factors_and_units_endpoints(self):
        """Verify emission factors, factor sources, units, and unit conversions APIs"""
        # 1. Emission Factors
        res = self.client.get("/api/v1/emission-factors", headers=self.site_headers)
        self.assertEqual(res.status_code, 200)
        factors = res.json()
        self.assertGreaterEqual(len(factors), 6)
        diesel_factor = next((f for f in factors if "Diesel" in f["activity_type"]), None)
        self.assertIsNotNone(diesel_factor)
        self.assertEqual(diesel_factor["factor"], 2.68)
        self.assertEqual(diesel_factor["scope"], "SCOPE_1")

        # 2. Factor Sources
        res_src = self.client.get("/api/v1/factor-sources", headers=self.site_headers)
        self.assertEqual(res_src.status_code, 200)
        sources = res_src.json()
        self.assertGreaterEqual(len(sources), 3)

        # 3. Units
        res_units = self.client.get("/api/v1/units", headers=self.site_headers)
        self.assertEqual(res_units.status_code, 200)
        units = res_units.json()
        self.assertGreaterEqual(len(units), 5)
        self.assertTrue(any(u["code"] == "kWh" for u in units))

        # 4. Unit Conversions
        res_conv = self.client.get("/api/v1/unit-conversions", headers=self.site_headers)
        self.assertEqual(res_conv.status_code, 200)
        conversions = res_conv.json()
        self.assertGreaterEqual(len(conversions), 2)

    def test_deterministic_calculation_engine(self):
        """Verify deterministic calculation of Scope 1, Scope 2, GJ, LTIFR persisted to CalculationRun and CalculationResult"""
        db = SessionLocal()
        try:
            project = db.query(Project).filter(Project.id == "site-101").first()
            period = db.query(ReportingPeriod).filter(ReportingPeriod.id == "period-2025-09").first()
            self.assertIsNotNone(project)
            self.assertIsNotNone(period)

            # Create test submission
            sub = Submission(
                project_id=project.id,
                reporting_period_id=period.id,
                status="DRAFT",
                version=1,
                submitted_by="Rohit Kumar"
            )
            db.add(sub)
            db.flush()

            # Add Fuel (10,000 L Diesel)
            f_rec = FuelRecord(
                submission_id=sub.id,
                project_id=project.id,
                reporting_period_id=period.id,
                fuel_type="Diesel",
                quantity=10000.0,
                unit="L",
                scope1_co2e_tonnes=0.0,
                factor_id="std-diesel",
                factor_version="v19-2024"
            )
            db.add(f_rec)

            # Add Energy (50,000 kWh Grid Electricity)
            e_rec = EnergyRecord(
                submission_id=sub.id,
                project_id=project.id,
                reporting_period_id=period.id,
                energy_source="Grid Electricity",
                quantity_kwh=50000.0,
                renewable_kwh=0.0,
                scope2_co2e_tonnes=0.0,
                energy_gj=0.0,
                factor_id="std-grid",
                factor_version="CEA-v19"
            )
            db.add(e_rec)

            # Add Safety (250,000 safe man hours, 1 LTI)
            s_rec = SafetyRecord(
                submission_id=sub.id,
                project_id=project.id,
                reporting_period_id=period.id,
                safe_man_hours=250000.0,
                lost_time_injuries=1
            )
            db.add(s_rec)
            db.commit()
            db.refresh(sub)
            sub_id = sub.id
        finally:
            db.close()

        # Trigger calculation endpoint
        calc_res = self.client.post(f"/api/v1/submissions/{sub_id}/calculate", headers=self.site_headers)
        self.assertEqual(calc_res.status_code, 200)
        calc_data = calc_res.json()
        self.assertEqual(calc_data["status"], "COMPLETED")
        self.assertGreaterEqual(len(calc_data["results"]), 4)

        results = {r["metric_key"]: r for r in calc_data["results"]}

        # Scope 1: 10,000 L * 2.68 / 1000 = 26.8 tCO2e
        self.assertIn("scope1_co2e_tonnes", results)
        self.assertEqual(results["scope1_co2e_tonnes"]["result_value"], 26.8)
        self.assertEqual(results["scope1_co2e_tonnes"]["result_unit"], "tCO2e")
        self.assertIsNotNone(results["scope1_co2e_tonnes"]["factor_version"])

        # Scope 2: 50,000 kWh * 0.716 / 1000 = 35.8 tCO2e
        self.assertIn("scope2_co2e_tonnes", results)
        self.assertEqual(results["scope2_co2e_tonnes"]["result_value"], 35.8)

        # Energy GJ: 50,000 kWh * 3.6 / 1000 = 180.0 GJ
        self.assertIn("energy_gj", results)
        self.assertEqual(results["energy_gj"]["result_value"], 180.0)

        # LTIFR: 1 * 1,000,000 / 250,000 = 4.0
        self.assertIn("ltifr", results)
        self.assertEqual(results["ltifr"]["result_value"], 4.0)

        # Test retrieval of calculation history
        hist_res = self.client.get(f"/api/v1/submissions/{sub_id}/calculations", headers=self.site_headers)
        self.assertEqual(hist_res.status_code, 200)
        self.assertGreaterEqual(len(hist_res.json()), 1)

    def test_validation_engine_execution_and_persistence(self):
        """Verify automated validation run execution, counting evaluated rules, and persisting results"""
        db = SessionLocal()
        try:
            sub = db.query(Submission).filter(Submission.project_id == "site-101").first()
            if not sub:
                project = db.query(Project).filter(Project.id == "site-101").first()
                period = db.query(ReportingPeriod).filter(ReportingPeriod.id == "period-2025-09").first()
                sub = Submission(
                    project_id=project.id,
                    reporting_period_id=period.id,
                    status="DRAFT",
                    version=1,
                    submitted_by="Rohit Kumar"
                )
                db.add(sub)
                db.commit()
                db.refresh(sub)
            sub_id = sub.id
        finally:
            db.close()


        val_res = self.client.post(f"/api/v1/submissions/{sub_id}/validate", headers=self.site_headers)
        self.assertEqual(val_res.status_code, 200)
        val_data = val_res.json()
        self.assertEqual(val_data["status"], "COMPLETED")
        self.assertGreater(val_data["rules_evaluated_count"], 0)
        self.assertIn("is_valid", val_data)

        # Test retrieval of validation history
        runs_res = self.client.get(f"/api/v1/submissions/{sub_id}/validation", headers=self.site_headers)
        self.assertEqual(runs_res.status_code, 200)
        self.assertGreaterEqual(len(runs_res.json()), 1)

    def test_water_zero_withdrawal_anomaly_rejection(self):
        """Verify ADR-005 rule: 0 KL withdrawal with non-zero recycling triggers blocking validation error"""
        db = SessionLocal()
        try:
            project = db.query(Project).filter(Project.id == "site-101").first()
            period = db.query(ReportingPeriod).filter(ReportingPeriod.id == "period-2025-09").first()

            # Create submission with anomalous 0 withdrawal and 500 KL recycling
            sub = Submission(
                project_id=project.id,
                reporting_period_id=period.id,
                status="DRAFT",
                version=2
            )
            db.add(sub)
            db.flush()

            w_rec = WaterRecord(
                submission_id=sub.id,
                project_id=project.id,
                reporting_period_id=period.id,
                source_type="Groundwater",
                withdrawal_kl=0.0,
                recycled_kl=500.0
            )
            db.add(w_rec)
            db.commit()
            sub_id = sub.id
        finally:
            db.close()

        val_res = self.client.post(f"/api/v1/submissions/{sub_id}/validate", headers=self.site_headers)
        self.assertEqual(val_res.status_code, 200)
        val_data = val_res.json()
        # Must fail validation because 0 withdrawal cannot report 500 KL recycled
        self.assertFalse(val_data["is_valid"])
        self.assertGreaterEqual(val_data["errors_count"], 1)
        self.assertTrue(any("ADR-005" in r["message"] or "Cannot report 500.0 KL recycled when total withdrawal is 0" in r["message"] for r in val_data["results"]))

if __name__ == "__main__":
    unittest.main()
