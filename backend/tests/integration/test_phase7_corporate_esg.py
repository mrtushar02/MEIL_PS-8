import sys
import os
import unittest
from fastapi.testclient import TestClient

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))

from app.main import app

class TestPhase7CorporateEsg(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.client = TestClient(app)

        # Authenticate Group CSO
        resp = cls.client.post("/api/v1/auth/login", json={"email": "cso@meilgroup.in", "password": "password123"})
        assert resp.status_code == 200, f"CSO login failed: {resp.text}"
        cls.cso_headers = {"Authorization": f"Bearer {resp.json()['access_token']}"}

    def test_01_hr_workforce_and_overview(self):
        """
        Verify Part 75: Workforce demographics and HR overview backed by live database records.
        """
        # HR Overview
        resp = self.client.get("/api/v1/hr/overview", headers=self.cso_headers)
        self.assertEqual(resp.status_code, 200)
        overview = resp.json()
        self.assertGreater(overview["total_workforce"], 40000)
        self.assertGreater(overview["direct_employees"], 10000)
        self.assertGreater(overview["contract_workers"], 20000)
        self.assertEqual(overview["fair_wage_adherence_pct"], 100.0)

        # Workforce categories
        resp = self.client.get("/api/v1/hr/workforce?period=FY 2026-27", headers=self.cso_headers)
        self.assertEqual(resp.status_code, 200)
        categories = resp.json()
        self.assertGreaterEqual(len(categories), 5)
        cat_names = [c["category"] for c in categories]
        self.assertIn("Board of Directors", cat_names)
        self.assertIn("Contractual EPC Site Workers", cat_names)

    def test_02_hse_incidents_inspections(self):
        """
        Verify Part 78: HSE incident tracking, zero-harm metrics, and CAPA lifecycle.
        """
        # Incidents
        resp = self.client.get("/api/v1/hse/incidents", headers=self.cso_headers)
        self.assertEqual(resp.status_code, 200)
        incidents = resp.json()
        self.assertGreaterEqual(len(incidents), 3)

        zojila_inc = next((i for i in incidents if "Zojila" in i["project_name"]), None)
        self.assertIsNotNone(zojila_inc)
        self.assertEqual(zojila_inc["type"], "Near Miss")

        # Inspections
        resp = self.client.get("/api/v1/hse/inspections", headers=self.cso_headers)
        self.assertEqual(resp.status_code, 200)
        inspections = resp.json()
        self.assertGreaterEqual(len(inspections), 2)

    def test_03_responsible_procurement_and_msme(self):
        """
        Verify Part 80: Responsible procurement, MSME sourcing ratio, and ESG audited suppliers.
        """
        # List suppliers
        resp = self.client.get("/api/v1/procurement/suppliers", headers=self.cso_headers)
        self.assertEqual(resp.status_code, 200)
        suppliers = resp.json()
        self.assertGreaterEqual(len(suppliers), 5)

        # MSME filtering
        msme_suppliers = [s for s in suppliers if s["is_msme"]]
        self.assertGreater(len(msme_suppliers), 0)

        # Procurement metrics
        resp = self.client.get("/api/v1/procurement/metrics?reporting_period_id=period-2025-09", headers=self.cso_headers)
        self.assertEqual(resp.status_code, 200)
        metrics = resp.json()
        self.assertGreater(metrics["total_procurement_spend_cr"], 1000.0)
        self.assertGreater(metrics["msme_spend_cr"], 0.0)
        self.assertGreater(metrics["local_sourcing_pct"], 80.0)

    def test_04_corporate_governance_and_policies(self):
        """
        Verify Part 84: Board-approved policies (Ethics, Whistleblower, POSH, Environment)
        and ethics grievance register.
        """
        # Policies
        resp = self.client.get("/api/v1/governance/policies", headers=self.cso_headers)
        self.assertEqual(resp.status_code, 200)
        policies = resp.json()
        self.assertGreaterEqual(len(policies), 6)
        codes = [p["policy_code"] for p in policies]
        self.assertIn("POL-ETH-01", codes)
        self.assertIn("POL-WB-03", codes)
        self.assertIn("POL-ENV-06", codes)

        # All must be board approved
        for p in policies:
            self.assertTrue(p["board_approved"])
            self.assertEqual(p["coverage_pct"], 100.0)

        # Grievances
        resp = self.client.get("/api/v1/governance/grievances?reporting_period_id=period-2025-09", headers=self.cso_headers)
        self.assertEqual(resp.status_code, 200)
        grievances = resp.json()
        self.assertGreaterEqual(len(grievances), 1)
        self.assertEqual(grievances[0]["resolution_pct"], 100.0)

    def test_05_csr_section_135(self):
        """
        Verify Part 82: Section 135 CSR projects, expenditure, and community beneficiaries.
        """
        # CSR Overview
        resp = self.client.get("/api/v1/csr/overview?reporting_period_id=period-2025-09", headers=self.cso_headers)
        self.assertEqual(resp.status_code, 200)
        overview = resp.json()
        self.assertGreater(overview["total_active_projects"], 0)
        self.assertGreater(overview["period_spend_inr_cr"], 0.0)
        self.assertGreater(overview["total_beneficiaries_served"], 10000)

        # CSR Projects
        resp = self.client.get("/api/v1/csr/projects", headers=self.cso_headers)
        self.assertEqual(resp.status_code, 200)
        projects = resp.json()
        self.assertGreaterEqual(len(projects), 2)
        codes = [p["project_code"] for p in projects]
        self.assertIn("CSR-MEIL-WTR-01", codes)
        self.assertIn("CSR-MEIL-HLT-02", codes)

        # CSR Spends
        resp = self.client.get("/api/v1/csr/spend?reporting_period_id=period-2025-09", headers=self.cso_headers)
        self.assertEqual(resp.status_code, 200)
        spends = resp.json()
        self.assertGreaterEqual(len(spends), 2)

if __name__ == "__main__":
    unittest.main()
