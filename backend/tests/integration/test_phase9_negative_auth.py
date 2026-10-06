import sys
import os
import unittest
from fastapi.testclient import TestClient

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))

from app.main import app
from app.services.token_blocklist import clear_failed_login

class TestPhase9NegativeAuth(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.client = TestClient(app)

    def login_as(self, email: str, password: str = "password123"):
        resp = self.client.post("/api/v1/auth/login", json={"email": email, "password": password})
        self.assertEqual(resp.status_code, 200, f"Login failed for {email}: {resp.text}")
        token = resp.json()["access_token"]
        return {"Authorization": f"Bearer {token}"}

    def test_unauthenticated_protected_endpoints_fail(self):
        """Item 68: Prove unauthorized unauthenticated requests receive 401"""
        endpoints = [
            ("GET", "/api/v1/auth/me"),
            ("GET", "/api/v1/submissions"),
            ("POST", "/api/v1/reports/calculator"),
            ("GET", "/api/v1/evidence/documents"),
            ("GET", "/api/v1/hr/workforce"),
            ("GET", "/api/v1/hse/incidents"),
            ("GET", "/api/v1/governance/policies"),
            ("GET", "/api/v1/procurement/suppliers"),
            ("GET", "/api/v1/csr/projects"),
            ("GET", "/api/v1/organization/tree"),
            ("GET", "/api/v1/reports/brsr?reporting_period_id=period-2025-09"),
        ]
        for method, ep in endpoints:
            if method == "GET":
                resp = self.client.get(ep)
            else:
                resp = self.client.post(ep, json={})
            self.assertEqual(resp.status_code, 401, f"Expected 401 for {method} {ep}, got {resp.status_code}")

    def test_revoked_token_fails_with_401(self):
        """Item 66: Prove that token revoked upon logout is denied access"""
        headers = self.login_as("site.officer@meilgroup.in")
        # Ensure token works
        resp = self.client.get("/api/v1/auth/me", headers=headers)
        self.assertEqual(resp.status_code, 200)

        # Logout
        logout_resp = self.client.post("/api/v1/auth/logout", headers=headers)
        self.assertEqual(logout_resp.status_code, 200)

        # Attempt to use revoked token
        resp2 = self.client.get("/api/v1/auth/me", headers=headers)
        self.assertEqual(resp2.status_code, 401)
        self.assertIn("revoked", resp2.json()["detail"].lower())

    def test_brute_force_lockout_returns_429(self):
        """Item 67: Prove that 5 consecutive failed logins trigger 429 lockout"""
        test_email = "lockout.test@meilgroup.in"
        clear_failed_login(test_email)

        for i in range(4):
            r = self.client.post("/api/v1/auth/login", json={"email": test_email, "password": "wrong"})
            self.assertEqual(r.status_code, 401)

        # 5th attempt triggers lockout
        r5 = self.client.post("/api/v1/auth/login", json={"email": test_email, "password": "wrong"})
        self.assertEqual(r5.status_code, 429)
        self.assertIn("locked", r5.json()["detail"].lower())

        # Cleanup
        clear_failed_login(test_email)

    def test_role_permission_denials(self):
        """Item 68: Prove that unauthorized roles receive 403 on restricted mutations"""
        site_headers = self.login_as("site.officer@meilgroup.in")
        hr_headers = self.login_as("hr.director@meilgroup.in")
        exec_headers = self.login_as("executive@meilgroup.in")

        # 1. Site officer cannot mutate HR records (requires hr:manage)
        r1 = self.client.post("/api/v1/hr/workforce", headers=site_headers, json={
            "reporting_period_id": "period-2025-09",
            "permanent_male": 100
        })
        self.assertEqual(r1.status_code, 403)

        # 2. HR officer cannot mutate EHS incident records (requires ehs:manage)
        r2 = self.client.post("/api/v1/hse/incidents", headers=hr_headers, json={
            "incident_type": "NEAR_MISS",
            "description": "Test near miss"
        })
        self.assertEqual(r2.status_code, 403)

        # 3. Executive Observer cannot mutate Procurement suppliers (requires procurement:manage)
        r3 = self.client.post("/api/v1/procurement/suppliers", headers=exec_headers, json={
            "name": "Unauthorized Supplier"
        })
        self.assertEqual(r3.status_code, 403)

        # 4. Site officer cannot mutate Governance policies (requires governance:manage)
        r4 = self.client.post("/api/v1/governance/policies", headers=site_headers, json={
            "title": "Unauthorized Policy",
            "principle_code": "P1"
        })
        self.assertEqual(r4.status_code, 403)

        # 5. Site officer cannot mutate CSR projects (requires csr:manage)
        r5 = self.client.post("/api/v1/csr/projects", headers=site_headers, json={
            "name": "Unauthorized CSR Project"
        })
        self.assertEqual(r5.status_code, 403)

if __name__ == "__main__":
    unittest.main()
