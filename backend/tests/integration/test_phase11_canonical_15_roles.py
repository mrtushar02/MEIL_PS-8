import sys
import os
import unittest
from fastapi.testclient import TestClient

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))

from app.main import app

class TestPhase11Canonical15Roles(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.client = TestClient(app)

    def test_all_15_canonical_roles_authentication_and_claims(self):
        """Items 1-9 & 70: Verify all 15 planned role types authenticate and resolve permissions"""
        role_test_matrix = [
            ("admin@meilgroup.in", "SUPER_ADMIN", "System Super Administrator", True),
            ("cso@meilgroup.in", "GROUP_CSO", "Dr. B. Prasad (Group CSO)", False),
            ("sub.head@meilgroup.in", "SUBSIDIARY_HEAD", "V. R. Krishna Murthy (Sub Head)", False),
            ("bu.coordinator@meilgroup.in", "BU_COORDINATOR", "R. K. Sharma (BU Coordinator)", False),
            ("site.officer@meilgroup.in", "PROJECT_OFFICER", "Rohit Kumar (Site Officer - Gayatri)", False),
            ("hr.director@meilgroup.in", "HR_OFFICER", "Sunita Raman (HR Director)", False),
            ("ehs.head@meilgroup.in", "EHS_OFFICER", "Rajeshwar K. (EHS Head)", False),
            ("procurement@meilgroup.in", "PROCUREMENT_OFFICER", "Anand Mahindra V. (Procurement Lead)", False),
            ("csr.lead@meilgroup.in", "CSR_OFFICER", "K. Meenakshi (CSR Lead)", False),
            ("compliance@meilgroup.in", "COMPLIANCE_OFFICER", "Adv. S. K. Nair (Compliance Officer)", False),
            ("esg.manager@meilgroup.in", "ESG_MANAGER", "S. Ananthakrishnan (ESG Manager)", False),
            ("esg.analyst@meilgroup.in", "ESG_ANALYST", "Pooja Varma (ESG Analyst)", False),
            ("brsr.manager@meilgroup.in", "BRSR_MANAGER", "N. Ramachandran (BRSR Manager)", False),
            ("auditor@meilgroup.in", "ASSURANCE_AUDITOR", "PwC / KPMG Assurance Lead", False),
            ("executive@meilgroup.in", "EXECUTIVE", "P. P. Reddy (Executive Chairman)", False),
        ]

        for email, expected_role, expected_name, is_super in role_test_matrix:
            login_resp = self.client.post("/api/v1/auth/login", json={"email": email, "password": "password123"})
            self.assertEqual(login_resp.status_code, 200, f"Failed login for {email}: {login_resp.text}")
            token_data = login_resp.json()
            self.assertEqual(token_data["role"], expected_role, f"Role mismatch for {email}")

            # Verify /auth/me
            headers = {"Authorization": f"Bearer {token_data['access_token']}"}
            me_resp = self.client.get("/api/v1/auth/me", headers=headers)
            self.assertEqual(me_resp.status_code, 200, f"/auth/me failed for {email}")
            profile = me_resp.json()
            self.assertEqual(profile["role_code"], expected_role)
            self.assertEqual(profile["email"], email)
            self.assertEqual(profile["full_name"], expected_name)
            self.assertTrue(profile["is_active"])

            # Verify role specific capabilities
            if expected_role == "HR_OFFICER":
                self.assertIn("hr:manage", profile["permissions"])
            elif expected_role == "EHS_OFFICER":
                self.assertIn("ehs:manage", profile["permissions"])
            elif expected_role == "PROCUREMENT_OFFICER":
                self.assertIn("procurement:manage", profile["permissions"])
            elif expected_role == "CSR_OFFICER":
                self.assertIn("csr:manage", profile["permissions"])
            elif expected_role == "COMPLIANCE_OFFICER":
                self.assertIn("governance:manage", profile["permissions"])
            elif expected_role == "ESG_MANAGER":
                self.assertIn("esg:kpi_manage", profile["permissions"])
            elif expected_role == "BRSR_MANAGER":
                self.assertIn("brsr:manage", profile["permissions"])
            elif expected_role == "ASSURANCE_AUDITOR":
                self.assertIn("assurance:audit_execute", profile["permissions"])
            elif expected_role == "EXECUTIVE":
                self.assertIn("reports:executive_read", profile["permissions"])

if __name__ == "__main__":
    unittest.main()
