import sys
import os
import unittest
import hashlib
from fastapi.testclient import TestClient

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))

from app.main import app
from app.core.database import SessionLocal
from app.models.reporting import IssuedReport
from app.models.evidence import EvidenceDocument

class TestPhase12ReportsEvidenceAudit(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.client = TestClient(app)

    def login_as(self, email: str = "cso@meilgroup.in", password: str = "password123"):
        resp = self.client.post("/api/v1/auth/login", json={"email": email, "password": password})
        self.assertEqual(resp.status_code, 200)
        token = resp.json()["access_token"]
        return {"Authorization": f"Bearer {token}"}

    def test_brsr_pdf_generation_and_seal(self):
        """Item 58, 60, 61: Statutory PDF export with cryptographic header seal"""
        headers = self.login_as()
        resp = self.client.get("/api/v1/reports/export/brsr.pdf?reporting_period_id=period-2025-09", headers=headers)
        self.assertEqual(resp.status_code, 200)
        self.assertEqual(resp.headers.get("content-type"), "application/pdf")
        self.assertIn("X-Report-SHA256", resp.headers)
        self.assertIn("X-Report-Id", resp.headers)

        pdf_bytes = resp.content
        self.assertGreater(len(pdf_bytes), 1000)
        self.assertTrue(pdf_bytes.startswith(b"%PDF"))

        # Verify computed byte hash matches header
        computed_hash = hashlib.sha256(pdf_bytes).hexdigest()
        self.assertEqual(computed_hash, resp.headers["X-Report-SHA256"])

    def test_brsr_xlsx_generation_and_seal(self):
        """Item 59, 60, 61: Statutory XLSX spreadsheet generation with header seal"""
        headers = self.login_as()
        resp = self.client.get("/api/v1/reports/export/brsr.xlsx?reporting_period_id=period-2025-09", headers=headers)
        self.assertEqual(resp.status_code, 200)
        self.assertIn("spreadsheetml", resp.headers.get("content-type", ""))
        self.assertIn("X-Report-SHA256", resp.headers)

        xlsx_bytes = resp.content
        self.assertGreater(len(xlsx_bytes), 1000)

        computed_hash = hashlib.sha256(xlsx_bytes).hexdigest()
        self.assertEqual(computed_hash, resp.headers["X-Report-SHA256"])

    def test_issued_report_cryptographic_verification(self):
        """Item 60 & 61: Verify issued report integrity endpoint"""
        headers = self.login_as()
        # List issued reports
        list_resp = self.client.get("/api/v1/reports/issued?reporting_period_id=period-2025-09", headers=headers)
        self.assertEqual(list_resp.status_code, 200)
        reports = list_resp.json()
        self.assertGreater(len(reports), 0)

        report_id = reports[0]["id"]
        # Verify physical integrity
        verify_resp = self.client.post(f"/api/v1/reports/issued/{report_id}/verify", headers=headers)
        self.assertEqual(verify_resp.status_code, 200)
        data = verify_resp.json()
        self.assertTrue(data["is_intact"])
        self.assertEqual(data["status"], "SEAL_VERIFIED")
        self.assertEqual(data["stored_hash"], data["computed_byte_hash"])

    def test_cryptographic_audit_chain_verification(self):
        """Item 55: Recompute every SHA-256 block in audit log from canonical payload"""
        headers = self.login_as()
        resp = self.client.get("/api/v1/audit/verify-chain", headers=headers)
        self.assertEqual(resp.status_code, 200)
        audit_res = resp.json()
        self.assertTrue(audit_res["valid"], f"Audit chain broken: {audit_res}")
        self.assertEqual(audit_res["status"], "CHAIN_VERIFIED_AUTHENTIC")
        self.assertGreater(audit_res["total_records"], 50)
        self.assertIn("head_hash", audit_res)

    def test_worm_archival_manifest_export(self):
        """Item 57: Immutable WORM Archival export with seal"""
        headers = self.login_as("admin@meilgroup.in")
        resp = self.client.get("/api/v1/audit/worm-archive", headers=headers)
        self.assertEqual(resp.status_code, 200)
        manifest = resp.json()
        self.assertTrue(manifest["chain_valid"])
        self.assertEqual(manifest["archival_standard"], "SEBI BRSR / ICAI Revised 2024 Assurance Standard")
        self.assertGreater(manifest["total_blocks"], 50)
        self.assertIn("genesis_hash", manifest)
        self.assertIn("head_hash", manifest)


if __name__ == "__main__":
    unittest.main()
