import sys
import os
import io
import hashlib
import unittest
from fastapi.testclient import TestClient

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))

from app.main import app
from app.core.database import SessionLocal
from app.models.reporting import ReportingPeriod, Submission
from app.models.evidence import EvidenceDocument

class TestPhase2DataEvidenceSubmission(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.client = TestClient(app)

        # Authenticate site officer (Zojila tunnel, site-102)
        login_resp = cls.client.post(
            "/api/v1/auth/login",
            json={"email": "zojila.officer@meilgroup.in", "password": "password123"}
        )
        assert login_resp.status_code == 200, f"Login failed: {login_resp.text}"
        cls.site_token = login_resp.json()["access_token"]
        cls.site_headers = {"Authorization": f"Bearer {cls.site_token}"}

        # Authenticate reviewer / auditor
        cso_resp = cls.client.post(
            "/api/v1/auth/login",
            json={"email": "cso@meilgroup.in", "password": "password123"}
        )
        cls.cso_token = cso_resp.json()["access_token"]
        cls.cso_headers = {"Authorization": f"Bearer {cls.cso_token}"}

    def test_evidence_byte_sha256_and_upload(self):
        """Verify upload computes SHA256 from actual file bytes and stores document"""
        file_bytes = b"Official IOCL Diesel Delivery Invoice Content - Challan #88492"
        expected_sha256 = hashlib.sha256(file_bytes).hexdigest()

        response = self.client.post(
            "/api/v1/evidence/upload",
            files={"file": ("iocl_challan_sep25.pdf", io.BytesIO(file_bytes), "application/pdf")},
            data={
                "project_id": "site-102",
                "reporting_period_id": "period-2025-09",
                "document_type": "Invoice",
                "module": "Energy",
                "related_record": "Fuel Log #991",
                "notes": "Original weighbridge and fuel receipt"
            },
            headers=self.site_headers
        )
        self.assertEqual(response.status_code, 200, response.text)
        doc = response.json()
        self.assertEqual(doc["sha256_hash"], expected_sha256)
        self.assertEqual(doc["file_size_bytes"], len(file_bytes))
        self.assertEqual(doc["status"], "Pending")
        self.assertFalse(doc["is_verified"])
        self.assertTrue(len(doc["history"]) > 0)
        self.assertEqual(doc["history"][0]["action"], "Uploaded")

        # Verify listing
        list_resp = self.client.get(
            f"/api/v1/evidence?project_id=site-102&module=Energy",
            headers=self.site_headers
        )
        self.assertEqual(list_resp.status_code, 200)
        items = list_resp.json()
        self.assertTrue(any(i["id"] == doc["id"] for i in items))

        # Test Verification by CSO / Reviewer
        verify_resp = self.client.post(
            f"/api/v1/evidence/{doc['id']}/verify",
            json={"notes": "Audited and verified against weighbridge register"},
            headers=self.cso_headers
        )
        self.assertEqual(verify_resp.status_code, 200)
        verified_doc = verify_resp.json()
        self.assertEqual(verified_doc["status"], "Verified")
        self.assertTrue(verified_doc["is_verified"])
        self.assertIn("Dr. B. Prasad", verified_doc["verified_by"])

    def test_project_fuel_data_entry_and_scope1(self):
        """Verify project fuel endpoint calculates Scope 1 and links evidence"""
        payload = {
            "fuel_type": "Diesel",
            "quantity": 12500.0,
            "unit": "Litres",
            "reporting_period_id": "period-2025-09",
            "evidence_id": "ev-doc-test-1"
        }
        response = self.client.post(
            "/api/v1/projects/site-102/fuel",
            json=payload,
            headers=self.site_headers
        )
        self.assertEqual(response.status_code, 200, response.text)
        fuel_rec = response.json()
        self.assertEqual(fuel_rec["fuel_type"], "Diesel")
        self.assertEqual(fuel_rec["quantity"], 12500.0)
        # Expected: 12500 * 2.68 / 1000 = 33.5 tCO2e
        self.assertAlmostEqual(fuel_rec["scope1_co2e_tonnes"], 33.5, delta=0.5)

    def test_project_safety_data_entry_and_ltifr(self):
        """Verify project safety endpoint calculates LTIFR = (Injuries * 1,000,000) / man-hours"""
        payload = {
            "safe_man_hours": 250000.0,
            "lost_time_injuries": 1,
            "fatalities": 0,
            "near_misses": 4,
            "reporting_period_id": "period-2025-09"
        }
        response = self.client.post(
            "/api/v1/projects/site-102/safety",
            json=payload,
            headers=self.site_headers
        )
        self.assertEqual(response.status_code, 200, response.text)
        safety_rec = response.json()
        # LTIFR: (1 * 1,000,000) / 250000 = 4.0
        self.assertEqual(safety_rec["ltifr"], 4.0)

    def test_unauthorized_project_access_rejected(self):
        """Verify site officer for site-102 cannot post fuel data for site-101"""
        payload = {
            "fuel_type": "Diesel",
            "quantity": 5000.0,
            "unit": "Litres",
            "reporting_period_id": "period-2025-09"
        }
        response = self.client.post(
            "/api/v1/projects/site-101/fuel",
            json=payload,
            headers=self.site_headers
        )
        self.assertEqual(response.status_code, 403)

    def test_full_monthly_submission(self):
        """Verify complete monthly ESG package submission with validation and audit log"""
        submission_payload = {
            "project_id": "site-102",
            "reporting_period_id": "period-2025-09",
            "fuel_records": [
                {"fuel_type": "Diesel", "quantity": 10000.0, "unit": "Litres"}
            ],
            "energy_records": [
                {"energy_source": "Grid Electricity", "quantity_kwh": 45000.0, "renewable_kwh": 5000.0}
            ],
            "water_records": [
                {"source_type": "Ground Water", "withdrawal_kl": 1200.0, "recycled_kl": 300.0, "discharged_kl": 100.0}
            ],
            "waste_records": [
                {"waste_category": "Non-Hazardous", "quantity_metric_tonnes": 45.0, "disposal_route": "Recycled"}
            ],
            "safety_records": [
                {"safe_man_hours": 180000.0, "lost_time_injuries": 0, "fatalities": 0, "near_misses": 2}
            ]
        }
        response = self.client.post(
            "/api/v1/submissions",
            json=submission_payload,
            headers=self.site_headers
        )
        self.assertEqual(response.status_code, 200, response.text)
        sub = response.json()
        self.assertEqual(sub["status"], "SUBMITTED")
        self.assertEqual(sub["project_id"], "site-102")
        self.assertIn("Tenzin Dorjey", sub["submitted_by"])

        # Fetch detail
        detail_resp = self.client.get(
            f"/api/v1/submissions/{sub['id']}",
            headers=self.site_headers
        )
        self.assertEqual(detail_resp.status_code, 200)
        detail = detail_resp.json()
        self.assertEqual(len(detail["fuel_records"]), 1)
        self.assertEqual(len(detail["energy_records"]), 1)
        self.assertEqual(len(detail["water_records"]), 1)

if __name__ == "__main__":
    unittest.main()
