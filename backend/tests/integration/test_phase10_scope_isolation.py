import sys
import os
import unittest
from fastapi.testclient import TestClient

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))

from app.main import app

class TestPhase10ScopeIsolation(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.client = TestClient(app)

    def login_as(self, email: str, password: str = "password123"):
        resp = self.client.post("/api/v1/auth/login", json={"email": email, "password": password})
        self.assertEqual(resp.status_code, 200, f"Login failed for {email}: {resp.text}")
        token = resp.json()["access_token"]
        return {"Authorization": f"Bearer {token}"}

    def test_project_user_scope_isolation(self):
        """Item 69: Project Officer scoped to Zojila (site-102) only sees site-102 submissions"""
        zojila_headers = self.login_as("zojila.officer@meilgroup.in")
        resp = self.client.get("/api/v1/submissions", headers=zojila_headers)
        self.assertEqual(resp.status_code, 200)
        submissions = resp.json()
        for sub in submissions:
            self.assertEqual(sub["project_id"], "site-102", "Zojila officer must only see site-102 records")

    def test_bu_consolidation_scope_boundary(self):
        """Item 69: BU Coordinator scoped to bu-tunnels cannot access bu-water consolidation"""
        bu_headers = self.login_as("bu.coordinator@meilgroup.in")

        # 1. Accessing their own BU consolidation succeeds
        r_ok = self.client.get("/api/v1/reports/consolidation/business-unit/bu-tunnels?reporting_period_id=period-2025-09", headers=bu_headers)
        self.assertEqual(r_ok.status_code, 200)

        # 2. Accessing unrelated BU consolidation fails with 403
        r_denied = self.client.get("/api/v1/reports/consolidation/business-unit/bu-water?reporting_period_id=period-2025-09", headers=bu_headers)
        self.assertEqual(r_denied.status_code, 403)

    def test_subsidiary_head_scope_boundary(self):
        """Item 69: Subsidiary Head scoped to sub-meil-core has access to projects under sub-meil-core"""
        sub_headers = self.login_as("sub.head@meilgroup.in")

        resp = self.client.get("/api/v1/submissions", headers=sub_headers)
        self.assertEqual(resp.status_code, 200)
        # All visible projects must be under sub-meil-core
        for sub in resp.json():
            self.assertIn(sub["project_id"], ["site-101", "site-102", "site-test-tunnel-b", "site-gayatri-link", "site-river-link", "site-metro-p1", "site-expressway"])

    def test_evidence_download_scope_isolation(self):
        """Item 47 & 69: Evidence documents are scoped and unauthorized users cannot query unrelated projects"""
        zojila_headers = self.login_as("zojila.officer@meilgroup.in")

        # Fetch evidence list for zojila officer (no explicit project filter)
        resp = self.client.get("/api/v1/evidence", headers=zojila_headers)
        self.assertEqual(resp.status_code, 200)

        # Querying an unauthorized project explicitly returns 403 Forbidden
        r_unauth = self.client.get("/api/v1/evidence?project_id=site-101", headers=zojila_headers)
        self.assertEqual(r_unauth.status_code, 403)
        self.assertIn("restricted", r_unauth.json()["detail"].lower())

if __name__ == "__main__":
    unittest.main()
