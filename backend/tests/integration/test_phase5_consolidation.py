import sys
import os
import unittest
from fastapi.testclient import TestClient

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))

from app.main import app
from app.core.database import SessionLocal
from app.models.organization import Group, Subsidiary, BusinessUnit, Project
from app.models.reporting import ReportingPeriod, Submission
from app.models.esg_records import FuelRecord, EnergyRecord, WaterRecord, SafetyRecord

class TestPhase5Consolidation(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.client = TestClient(app)

        # Authenticate Group CSO
        resp = cls.client.post("/api/v1/auth/login", json={"email": "cso@meilgroup.in", "password": "password123"})
        assert resp.status_code == 200, f"CSO login failed: {resp.text}"
        cls.cso_headers = {"Authorization": f"Bearer {resp.json()['access_token']}"}

        # Authenticate BU Coordinator (bu-tunnels)
        resp = cls.client.post("/api/v1/auth/login", json={"email": "bu.coordinator@meilgroup.in", "password": "password123"})
        assert resp.status_code == 200, f"BU login failed: {resp.text}"
        cls.bu_headers = {"Authorization": f"Bearer {resp.json()['access_token']}"}

        # Authenticate Subsidiary Head (sub-meil-core)
        resp = cls.client.post("/api/v1/auth/login", json={"email": "sub.head@meilgroup.in", "password": "password123"})
        assert resp.status_code == 200, f"Sub Head login failed: {resp.text}"
        cls.sub_headers = {"Authorization": f"Bearer {resp.json()['access_token']}"}

    def test_consolidation_mathematics_weighted_not_averaged(self):
        """
        Verify Part 41: Mathematical correctness of consolidated ratios.
        Ratios MUST NOT be computed by averaging child ratios.
        - LTIFR must equal sum(LTI)*1M / sum(hours), NOT average(child LTIFRs).
        - Water Recycling % must equal sum(recycled)*100 / sum(withdrawal), NOT average(child %s).
        """
        db = SessionLocal()
        try:
            # We will use bu-tunnels and setup two submissions under projects in bu-tunnels
            period = db.query(ReportingPeriod).filter(ReportingPeriod.id == "period-2025-09").first()
            p1 = db.query(Project).filter(Project.id == "site-102").first() # Zojila

            # Create second project under bu-tunnels if needed
            p2 = db.query(Project).filter(Project.code == "PRJ-TUNNEL-B").first()
            if not p2:
                p2 = Project(
                    id="site-test-tunnel-b",
                    code="PRJ-TUNNEL-B",
                    name="Atal Tunnel Extension Site",
                    subsidiary_id="sub-meil-core",
                    business_unit_id="bu-tunnels",
                    location="Himachal Pradesh",
                    country="India",
                    status="ACTIVE"
                )

                db.add(p2)
                db.flush()

            # Clean existing submissions for period on these projects
            db.query(Submission).filter(
                Submission.project_id.in_([p1.id, p2.id]),
                Submission.reporting_period_id == period.id
            ).delete(synchronize_session=False)
            db.commit()

            # Sub 1: Project 1
            # Hours = 50,000, LTI = 1 -> Child LTIFR = 20.0
            # Withdrawal = 50 KL, Recycled = 25 KL -> Child Recycling % = 50.0%
            sub1 = Submission(
                project_id=p1.id,
                reporting_period_id=period.id,
                status="BU_APPROVED",
                version=1
            )
            db.add(sub1)
            db.flush()

            s1_safety = SafetyRecord(
                submission_id=sub1.id, project_id=p1.id, reporting_period_id=period.id,
                safe_man_hours=50000.0, lost_time_injuries=1, ltifr=20.0
            )
            s1_water = WaterRecord(
                submission_id=sub1.id, project_id=p1.id, reporting_period_id=period.id,
                source_type="Groundwater", withdrawal_kl=50.0, recycled_kl=25.0
            )
            s1_fuel = FuelRecord(
                submission_id=sub1.id, project_id=p1.id, reporting_period_id=period.id,
                fuel_type="Diesel", quantity=10000.0, unit="L", scope1_co2e_tonnes=26.8,
                factor_id="std-diesel", factor_version="v19-2024"
            )
            db.add_all([s1_safety, s1_water, s1_fuel])

            # Sub 2: Project 2
            # Hours = 150,000, LTI = 1 -> Child LTIFR = 6.67
            # Withdrawal = 200 KL, Recycled = 50 KL -> Child Recycling % = 25.0%
            sub2 = Submission(
                project_id=p2.id,
                reporting_period_id=period.id,
                status="BU_APPROVED",
                version=1
            )
            db.add(sub2)
            db.flush()

            s2_safety = SafetyRecord(
                submission_id=sub2.id, project_id=p2.id, reporting_period_id=period.id,
                safe_man_hours=150000.0, lost_time_injuries=1, ltifr=6.67
            )
            s2_water = WaterRecord(
                submission_id=sub2.id, project_id=p2.id, reporting_period_id=period.id,
                source_type="Groundwater", withdrawal_kl=200.0, recycled_kl=50.0
            )
            s2_fuel = FuelRecord(
                submission_id=sub2.id, project_id=p2.id, reporting_period_id=period.id,
                fuel_type="Diesel", quantity=20000.0, unit="L", scope1_co2e_tonnes=53.6,
                factor_id="std-diesel", factor_version="v19-2024"
            )
            db.add_all([s2_safety, s2_water, s2_fuel])
            db.commit()
        finally:
            db.close()

        # Query BU Consolidation endpoint
        res = self.client.get("/api/v1/business-units/bu-tunnels/consolidated?reporting_period_id=period-2025-09", headers=self.bu_headers)
        self.assertEqual(res.status_code, 200)
        data = res.json()

        metrics = data["consolidated_metrics"]
        # Total safe hours: 50,000 + 150,000 = 200,000
        self.assertEqual(metrics["safe_man_hours"], 200000.0)
        self.assertEqual(metrics["lost_time_injuries"], 2)

        # Consolidated LTIFR = 2 * 1,000,000 / 200,000 = 10.0!
        # If incorrectly averaged: (20.0 + 6.67) / 2 = 13.33
        self.assertEqual(metrics["ltifr"], 10.0)

        # Total withdrawal = 50 + 200 = 250 KL
        # Total recycled = 25 + 50 = 75 KL
        # Consolidated Recycling Rate = (75 / 250) * 100 = 30.0%!
        # If incorrectly averaged: (50.0 + 25.0) / 2 = 37.5%
        self.assertEqual(metrics["water_recycling_pct"], 30.0)

        # Scope 1 sum = 26.8 + 53.6 = 80.4 tCO2e
        self.assertEqual(metrics["scope1_co2e_tonnes"], 80.4)

        # Drilldowns present
        self.assertGreaterEqual(len(data["project_drilldowns"]), 2)

    def test_multi_tier_hierarchy_consolidation(self):
        """Verify Group -> Subsidiary -> BU hierarchy traversal and completeness metrics"""
        # 1. Subsidiary consolidation
        sub_res = self.client.get("/api/v1/subsidiaries/sub-meil-core/consolidated?reporting_period_id=period-2025-09", headers=self.sub_headers)
        self.assertEqual(sub_res.status_code, 200)
        sub_data = sub_res.json()
        self.assertEqual(sub_data["tier"], "SUBSIDIARY")
        self.assertGreater(sub_data["total_projects"], 0)
        self.assertIn("business_unit_drilldowns", sub_data)

        # 2. Group consolidation
        group_res = self.client.get("/api/v1/groups/meil-group-hq/consolidated?reporting_period_id=period-2025-09", headers=self.cso_headers)
        self.assertEqual(group_res.status_code, 200)
        group_data = group_res.json()
        self.assertEqual(group_data["tier"], "GROUP")
        self.assertGreater(group_data["total_subsidiaries"], 0)
        self.assertIn("subsidiary_drilldowns", group_data)
        self.assertIn("reporting_completeness_pct", group_data)

    def test_unauthorized_consolidation_scope_blocked(self):
        """Verify BU Coordinator cannot query another BU's consolidated metrics"""
        # bu.coordinator has scope bu-tunnels, attempt to query bu-water
        res = self.client.get("/api/v1/business-units/bu-water/consolidated?reporting_period_id=period-2025-09", headers=self.bu_headers)
        self.assertIn("does not have authorization for business unit", res.json()["detail"])


if __name__ == "__main__":
    unittest.main()
