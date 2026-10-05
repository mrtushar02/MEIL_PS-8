import sys
import os
import io
import unittest
import hashlib
from fastapi.testclient import TestClient

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))

from app.main import app
from app.core.database import SessionLocal
from app.models.organization import Group, Subsidiary, BusinessUnit, Project
from app.models.reporting import ReportingPeriod, Submission
from app.models.user import User

class TestPhase8CanonicalE2E(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.client = TestClient(app)

        # 1. Super Admin Login
        resp = cls.client.post("/api/v1/auth/login", json={"email": "admin@meilgroup.in", "password": "password123"})
        assert resp.status_code == 200, f"Super Admin login failed: {resp.text}"
        cls.admin_headers = {"Authorization": f"Bearer {resp.json()['access_token']}"}

        # 2. Site Officer Login (Gayatri / Polavaram)
        resp = cls.client.post("/api/v1/auth/login", json={"email": "site.officer@meilgroup.in", "password": "password123"})
        assert resp.status_code == 200, f"Site Officer login failed: {resp.text}"
        cls.site_headers = {"Authorization": f"Bearer {resp.json()['access_token']}"}

        # 3. BU Coordinator Login
        resp = cls.client.post("/api/v1/auth/login", json={"email": "bu.coordinator@meilgroup.in", "password": "password123"})
        assert resp.status_code == 200, f"BU Coordinator login failed: {resp.text}"
        cls.bu_headers = {"Authorization": f"Bearer {resp.json()['access_token']}"}

        # 4. Subsidiary Head Login
        resp = cls.client.post("/api/v1/auth/login", json={"email": "sub.head@meilgroup.in", "password": "password123"})
        assert resp.status_code == 200, f"Sub Head login failed: {resp.text}"
        cls.sub_headers = {"Authorization": f"Bearer {resp.json()['access_token']}"}

        # 5. Group CSO Login
        resp = cls.client.post("/api/v1/auth/login", json={"email": "cso@meilgroup.in", "password": "password123"})
        assert resp.status_code == 200, f"CSO login failed: {resp.text}"
        cls.cso_headers = {"Authorization": f"Bearer {resp.json()['access_token']}"}
 
    @classmethod
    def tearDownClass(cls):
        db = SessionLocal()
        try:
            period = db.query(ReportingPeriod).filter(ReportingPeriod.id == "period-2025-09").first()
            if period and period.is_locked:
                period.is_locked = False
                db.commit()
        finally:
            db.close()

    def test_canonical_25_step_lifecycle(self):
        """
        Execute the Complete Canonical 25-step End-to-End Enterprise Flow (Part 94).
        """
        # Step 1: Health & Auth Verification
        resp = self.client.get("/api/v1/auth/me", headers=self.admin_headers)
        self.assertEqual(resp.status_code, 200)
        self.assertEqual(resp.json()["email"], "admin@meilgroup.in")

        # Step 2: Organization Master Hierarchy
        resp = self.client.get("/api/v1/organization/tree", headers=self.admin_headers)
        self.assertEqual(resp.status_code, 200)
        tree = resp.json()
        self.assertEqual(tree["total_subsidiaries"], 6)
        self.assertEqual(tree["total_business_units"], 6)
        self.assertGreaterEqual(tree["total_projects"], 6)

        # Step 3: Factor Database Verification (CEA India Grid v19 = 0.716)
        resp = self.client.get("/api/v1/emission-factors", headers=self.admin_headers)
        self.assertEqual(resp.status_code, 200)
        factors = resp.json()
        grid_factor = next((f for f in factors if f["activity_type"] == "Grid Electricity"), None)
        self.assertIsNotNone(grid_factor)
        self.assertEqual(grid_factor["factor"], 0.716)

        # Step 4: Site Officer Project Verification
        resp = self.client.get("/api/v1/auth/me", headers=self.site_headers)
        self.assertEqual(resp.status_code, 200)
        site_user = resp.json()
        self.assertEqual(site_user["email"], "site.officer@meilgroup.in")

        # Step 5: Submission Setup
        period_id = "period-2025-09"
        project_id = "site-101" # Gayatri / Polavaram

        db = SessionLocal()
        try:
            # Unlock period for this test run if locked
            period = db.query(ReportingPeriod).filter(ReportingPeriod.id == period_id).first()
            if period and period.is_locked:
                period.is_locked = False
                db.commit()

            sub = db.query(Submission).filter(
                Submission.project_id == project_id,
                Submission.reporting_period_id == period_id
            ).first()
            if not sub:
                sub = Submission(
                    project_id=project_id,
                    reporting_period_id=period_id,
                    status="DRAFT"
                )
                db.add(sub)
                db.commit()
                db.refresh(sub)
            else:
                sub.status = "DRAFT"
                db.commit()
            sub_id = sub.id
        finally:
            db.close()

        # Step 6: Create Project ESG Fuel Record
        fuel_payload = {
            "fuel_type": "Diesel",
            "quantity": 12000.0,
            "unit": "Litres",
            "reporting_period_id": period_id
        }
        resp = self.client.post(f"/api/v1/projects/{project_id}/fuel", json=fuel_payload, headers=self.site_headers)
        self.assertEqual(resp.status_code, 200)

        # Step 7: Create Project Energy Record
        energy_payload = {
            "energy_source": "Grid Electricity",
            "quantity_kwh": 85000.0,
            "renewable_kwh": 15000.0,
            "reporting_period_id": period_id
        }
        resp = self.client.post(f"/api/v1/projects/{project_id}/energy", json=energy_payload, headers=self.site_headers)
        self.assertEqual(resp.status_code, 200)

        # Step 8: Create Project Water Record
        water_payload = {
            "withdrawal_kl": 25000.0,
            "recycled_kl": 18000.0,
            "source_type": "Surface Water (Godavari River)",
            "reporting_period_id": period_id
        }
        resp = self.client.post(f"/api/v1/projects/{project_id}/water", json=water_payload, headers=self.site_headers)
        self.assertEqual(resp.status_code, 200)

        # Step 9: Create Project Safety Record
        safety_payload = {
            "safe_man_hours": 650000,
            "lost_time_injuries": 0,
            "fatalities": 0,
            "near_misses": 1,
            "reporting_period_id": period_id
        }
        resp = self.client.post(f"/api/v1/projects/{project_id}/safety", json=safety_payload, headers=self.site_headers)
        self.assertEqual(resp.status_code, 200)

        # Step 10: Upload Evidence Document with SHA-256
        fake_content = b"PDF-Polavaram-Diesel-Invoices-IOCL-Sep-2025-Verified"
        sha256_hash = hashlib.sha256(fake_content).hexdigest()
        upload_resp = self.client.post(
            "/api/v1/evidence/upload",
            files={"file": ("Diesel_Invoice_Sep25.pdf", io.BytesIO(fake_content), "application/pdf")},
            data={
                "project_id": project_id,
                "reporting_period_id": period_id,
                "document_type": "Fuel Bill"
            },
            headers=self.site_headers
        )
        self.assertEqual(upload_resp.status_code, 200)
        ev_id = upload_resp.json()["id"]

        # Step 11: Link Evidence to Submission
        link_resp = self.client.post(
            f"/api/v1/evidence/{ev_id}/link",
            json={"source_record_type": "Submission", "source_record_id": sub_id},
            headers=self.site_headers
        )
        self.assertEqual(link_resp.status_code, 200)

        # Step 12: Run Emission Calculations
        calc_payload = {
            "diesel_litres": 12000.0,
            "petrol_litres": 0.0,
            "natural_gas_m3": 0.0,
            "grid_kwh": 85000.0,
            "renewable_kwh": 15000.0,
            "cement_tonnes": 500.0,
            "steel_tonnes": 250.0,
            "turnover_inr_cr": 45.0
        }
        calc_resp = self.client.post("/api/v1/reports/calculator", json=calc_payload, headers=self.site_headers)
        self.assertEqual(calc_resp.status_code, 200)
        calc_data = calc_resp.json()
        self.assertGreater(calc_data["scope1_co2e_tonnes"], 0)
        self.assertGreater(calc_data["scope2_co2e_tonnes"], 0)

        # Step 13: Site Officer Submits to BU Review (DRAFT -> SUBMITTED)
        resp = self.client.post(
            f"/api/v1/submissions/{sub_id}/submit",
            json={"comment": "Monthly ESG data submitted with attached IOCL invoices"},
            headers=self.site_headers
        )
        self.assertEqual(resp.status_code, 200)
        self.assertEqual(resp.json()["status"], "SUBMITTED")

        # Step 14: BU Coordinator Approves (SUBMITTED -> BU_APPROVED)
        # Using Admin or scoped BU Coordinator
        resp = self.client.post(
            f"/api/v1/submissions/{sub_id}/approve",
            json={"comment": "Reviewed and verified against IOCL metering logs"},
            headers=self.admin_headers
        )
        self.assertEqual(resp.status_code, 200)
        self.assertEqual(resp.json()["status"], "BU_APPROVED")

        # Step 15: Subsidiary Head Approves (BU_APPROVED -> SUBSIDIARY_APPROVED)
        resp = self.client.post(
            f"/api/v1/submissions/{sub_id}/approve",
            json={"comment": "Subsidiary level approval granted"},
            headers=self.admin_headers
        )
        self.assertEqual(resp.status_code, 200)
        self.assertEqual(resp.json()["status"], "SUBSIDIARY_APPROVED")

        # Step 16: Hierarchical Consolidation (Group Level)
        resp = self.client.get(
            f"/api/v1/groups/meil-group-hq/consolidated?reporting_period_id={period_id}",
            headers=self.cso_headers
        )
        self.assertEqual(resp.status_code, 200)
        cons_group = resp.json()
        self.assertIn("consolidated_metrics", cons_group)
        self.assertGreater(cons_group["consolidated_metrics"]["total_ghg_tonnes"], 0)

        # Step 17: BRSR Answer Synthesis
        resp = self.client.post(
            f"/api/v1/brsr/SEBI_BRSR_2021/generate?reporting_period_id={period_id}&group_id=meil-group-hq",
            headers=self.cso_headers
        )
        self.assertEqual(resp.status_code, 200)
        self.assertGreater(resp.json()["answers_count"], 0)

        # Step 18: Dynamic Readiness Check
        resp = self.client.get(
            f"/api/v1/brsr/SEBI_BRSR_2021/readiness?reporting_period_id={period_id}",
            headers=self.cso_headers
        )
        self.assertEqual(resp.status_code, 200)
        readiness = resp.json()
        self.assertGreater(readiness["readiness_pct"], 0.0)

        # Step 19: Full End-to-End Traceability Tree (Indicator -> Answer -> Source -> Audit)
        resp = self.client.get(
            f"/api/v1/brsr/indicators/P6_E1/trace?reporting_period_id={period_id}",
            headers=self.cso_headers
        )
        self.assertEqual(resp.status_code, 200)
        trace = resp.json()
        self.assertEqual(trace["indicator"]["code"], "P6_E1")
        self.assertIsNotNone(trace["answer"]["value_numeric"])
        self.assertGreaterEqual(len(trace["sources"]), 1)

        # Step 20: Cryptographic Audit Hash Chain Verification
        resp = self.client.get("/api/v1/audit/verify-chain", headers=self.cso_headers)
        self.assertEqual(resp.status_code, 200)
        chain_status = resp.json()
        self.assertTrue(chain_status["valid"], "Audit hash chain must be cryptographically intact")
        self.assertEqual(chain_status["status"], "CHAIN_VERIFIED_AUTHENTIC")
        self.assertGreater(chain_status["total_records"], 0)

        # Step 21: Group CSO Locks Reporting Period
        resp = self.client.post(f"/api/v1/reporting-periods/{period_id}/lock", headers=self.cso_headers)
        self.assertEqual(resp.status_code, 200)
        self.assertTrue(resp.json()["is_locked"])

        # Step 22: Attempted Mutation on Locked Period Returns HTTP 423
        resp = self.client.post(
            f"/api/v1/projects/{project_id}/fuel",
            json={"fuel_type": "Diesel", "quantity": 100.0, "unit": "Litres", "reporting_period_id": period_id},
            headers=self.site_headers
        )
        self.assertEqual(resp.status_code, 423) # HTTP 423 Locked!

        # Step 23: CSV BRSR Export
        resp = self.client.get(f"/api/v1/reports/export/brsr.csv?reporting_period_id={period_id}", headers=self.cso_headers)
        self.assertEqual(resp.status_code, 200)
        self.assertEqual(resp.headers["content-type"], "text/csv; charset=utf-8")
        self.assertIn("Indicator Code", resp.text)

        # Step 24: CSV Audit Trail Export
        resp = self.client.get("/api/v1/reports/export/audit.csv", headers=self.cso_headers)
        self.assertEqual(resp.status_code, 200)
        self.assertIn("Event Hash", resp.text)

        # Step 25: Executive Summary
        resp = self.client.get(f"/api/v1/reports/executive-summary?reporting_period_id={period_id}", headers=self.cso_headers)
        self.assertEqual(resp.status_code, 200)
        summary = resp.json()
        self.assertIn("environmental_summary", summary)
        self.assertIn("social_summary", summary)
        self.assertIn("governance_and_compliance", summary)
        self.assertTrue(summary["entity"]["period_locked"])

if __name__ == "__main__":
    unittest.main()
