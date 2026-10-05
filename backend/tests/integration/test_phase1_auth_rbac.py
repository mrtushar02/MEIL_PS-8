import sys
import os
import unittest
from fastapi.testclient import TestClient

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))

from app.main import app
from app.api.deps import check_project_access
from app.core.database import SessionLocal
from app.models.user import User

class TestPhase1AuthRBAC(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.client = TestClient(app)

    def test_login_invalid_credentials(self):
        """Verify that bad password returns 401 Unauthorized"""
        response = self.client.post(
            "/api/v1/auth/login",
            json={"email": "admin@meilgroup.in", "password": "wrongpassword"}
        )
        self.assertEqual(response.status_code, 401)
        self.assertIn("Incorrect email or password", response.json()["detail"])

    def test_auth_me_requires_token(self):
        """Verify that /auth/me returns 401 without Bearer token (no default/fallback user)"""
        response = self.client.get("/api/v1/auth/me")
        self.assertEqual(response.status_code, 401)

    def test_login_and_auth_me_resolution(self):
        """Verify real JWT login and resolving profile from token sub claim"""
        # 1. Login as Dr. Prasad (Group CSO)
        login_resp = self.client.post(
            "/api/v1/auth/login",
            json={"email": "cso@meilgroup.in", "password": "password123"}
        )
        self.assertEqual(login_resp.status_code, 200)
        token_data = login_resp.json()
        self.assertIn("access_token", token_data)
        token = token_data["access_token"]
        self.assertEqual(token_data["role"], "GROUP_CSO")

        # 2. Call /auth/me with Bearer token
        me_resp = self.client.get(
            "/api/v1/auth/me",
            headers={"Authorization": f"Bearer {token}"}
        )
        self.assertEqual(me_resp.status_code, 200)
        profile = me_resp.json()
        self.assertEqual(profile["email"], "cso@meilgroup.in")
        self.assertEqual(profile["role"], "GROUP_CSO")
        self.assertTrue(any(s["type"] == "GROUP" for s in profile["scopes"]))

    def test_token_refresh(self):
        """Verify refresh token endpoint"""
        login_resp = self.client.post(
            "/api/v1/auth/login",
            json={"email": "admin@meilgroup.in", "password": "password123"}
        )
        token = login_resp.json()["access_token"]

        refresh_resp = self.client.post(
            "/api/v1/auth/refresh",
            headers={"Authorization": f"Bearer {token}"}
        )
        self.assertEqual(refresh_resp.status_code, 200)
        new_token_data = refresh_resp.json()
        self.assertIn("access_token", new_token_data)

    def test_project_scope_enforcement(self):
        """Verify that a site officer cannot access a project outside their scope"""
        login_resp = self.client.post(
            "/api/v1/auth/login",
            json={"email": "zojila.officer@meilgroup.in", "password": "password123"}
        )
        self.assertEqual(login_resp.status_code, 200)

        db = SessionLocal()
        try:
            user = db.query(User).filter(User.email == "zojila.officer@meilgroup.in").first()
            # Access to site-102 (Zojila) should be allowed
            self.assertTrue(check_project_access(user, "site-102", db))
            # Access to site-101 (Gayatri Lift Irrigation) should be denied!
            self.assertFalse(check_project_access(user, "site-101", db))
        finally:
            db.close()

    def test_parentage_validation_on_project_create(self):
        """Verify that project creation fails if business_unit does not belong to subsidiary"""
        login_resp = self.client.post(
            "/api/v1/auth/login",
            json={"email": "admin@meilgroup.in", "password": "password123"}
        )
        token = login_resp.json()["access_token"]

        invalid_payload = {
            "name": "Mismatched Test Project",
            "code": "TEST-MISMATCH-99",
            "subsidiary_id": "sub-olectra",
            "business_unit_id": "bu-tunnels",  # bu-tunnels belongs to sub-meil-core!
            "location": "Test Location",
            "country": "India"
        }

        response = self.client.post(
            "/api/v1/organization/projects",
            json=invalid_payload,
            headers={"Authorization": f"Bearer {token}"}
        )
        self.assertEqual(response.status_code, 400)
        self.assertIn("Parentage validation failed", response.json()["detail"])

if __name__ == "__main__":
    unittest.main()
