import sys
import os
import unittest
from fastapi.testclient import TestClient

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))

from app.main import app
from app.core.database import SessionLocal
from app.models.brsr import BrsrFramework, BrsrIndicator, BrsrAnswer
from app.models.reporting import ReportingPeriod

class TestPhase6Brsr(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.client = TestClient(app)

        # Authenticate Group CSO
        resp = cls.client.post("/api/v1/auth/login", json={"email": "cso@meilgroup.in", "password": "password123"})
        assert resp.status_code == 200, f"CSO login failed: {resp.text}"
        cls.cso_headers = {"Authorization": f"Bearer {resp.json()['access_token']}"}

    def test_01_framework_sections_principles_indicators_seeded(self):
        """
        Verify authoritative SEBI BRSR framework metadata is available via API:
        Sections A, B, C, Principles P1-P9, and SEBI indicators.
        """
        # 1. Frameworks
        resp = self.client.get("/api/v1/brsr/frameworks", headers=self.cso_headers)
        self.assertEqual(resp.status_code, 200)
        frameworks = resp.json()
        version_codes = [f["version_code"] for f in frameworks]
        self.assertIn("SEBI_BRSR_2021", version_codes)

        # 2. Sections
        resp = self.client.get("/api/v1/brsr/sections?framework_code=SEBI_BRSR_2021", headers=self.cso_headers)
        self.assertEqual(resp.status_code, 200)
        sections = resp.json()
        section_codes = [s["section_code"] for s in sections]
        self.assertIn("SECTION_A", section_codes)
        self.assertIn("SECTION_B", section_codes)
        self.assertIn("SECTION_C", section_codes)

        # 3. Principles P1 to P9
        resp = self.client.get("/api/v1/brsr/principles?framework_code=SEBI_BRSR_2021", headers=self.cso_headers)
        self.assertEqual(resp.status_code, 200)
        principles = resp.json()
        self.assertEqual(len(principles), 9)
        p_nums = [p["principle_number"] for p in principles]
        self.assertEqual(p_nums, list(range(1, 10)))

        # 4. Indicators
        resp = self.client.get("/api/v1/brsr/indicators?framework_code=SEBI_BRSR_2021", headers=self.cso_headers)
        self.assertEqual(resp.status_code, 200)
        indicators = resp.json()
        self.assertGreaterEqual(len(indicators), 20)
        ind_codes = [i["indicator_code"] for i in indicators]
        self.assertIn("SEC_A_OPERATIONS", ind_codes) # General disclosures
        self.assertIn("P6_E1", ind_codes)            # Energy
        self.assertIn("P6_E2", ind_codes)            # Water
        self.assertIn("P6_E4", ind_codes)            # GHG Scope 1 & 2
        self.assertIn("CORE_GHG", ind_codes)         # BRSR Core GHG intensity

    def test_02_dynamic_readiness_calculation(self):
        """
        Verify ADR-008: Dynamic calculation replaces hardcoded 94.5% / 94.4%.
        Readiness must return exact calculated float values based on actual answered questions.
        """
        resp = self.client.get("/api/v1/brsr/SEBI_BRSR_2021/readiness?reporting_period_id=period-2025-09", headers=self.cso_headers)
        self.assertEqual(resp.status_code, 200)
        data = resp.json()

        self.assertIn("readiness_pct", data)
        self.assertIn("section_breakdown", data)
        self.assertIn("principle_breakdown", data)
        self.assertIsInstance(data["readiness_pct"], float)
        self.assertNotEqual(data["readiness_pct"], 94.5) # Hardcoded value must not appear arbitrarily

    def test_03_generate_brsr_answers_and_traceability(self):
        """
        Verify synthesis of BRSR answers from consolidated data and
        complete traceability tree (Indicator -> Answer -> Source -> Audit).
        """
        # 1. Trigger synthesis
        resp = self.client.post(
            "/api/v1/brsr/SEBI_BRSR_2021/generate?reporting_period_id=period-2025-09&group_id=meil-group-hq",
            headers=self.cso_headers
        )
        self.assertEqual(resp.status_code, 200)
        gen_res = resp.json()
        self.assertGreater(gen_res["answers_count"], 0)

        # 2. Verify answers are fetched
        resp = self.client.get("/api/v1/brsr/SEBI_BRSR_2021/answers?reporting_period_id=period-2025-09", headers=self.cso_headers)
        self.assertEqual(resp.status_code, 200)
        answers = resp.json()
        self.assertGreater(len(answers), 0)

        energy_ans = next((a for a in answers if a["indicator_code"] == "P6_E1"), None)
        self.assertIsNotNone(energy_ans, "Energy indicator P6_E1 should have synthesized answer")
        self.assertIsNotNone(energy_ans["value_numeric"])
        self.assertEqual(energy_ans["unit"], "GJ")

        # 3. Check updated readiness
        resp = self.client.get("/api/v1/brsr/SEBI_BRSR_2021/readiness?reporting_period_id=period-2025-09", headers=self.cso_headers)
        self.assertEqual(resp.status_code, 200)
        readiness_data = resp.json()
        self.assertGreater(readiness_data["readiness_pct"], 0.0)
        self.assertGreater(readiness_data["completed_indicators"], 0)

        # 4. Verify Traceability Tree (Part 73, Part 94)
        resp = self.client.get("/api/v1/brsr/indicators/P6_E1/trace?reporting_period_id=period-2025-09", headers=self.cso_headers)
        self.assertEqual(resp.status_code, 200)
        trace_data = resp.json()
        self.assertEqual(trace_data["indicator"]["code"], "P6_E1")
        self.assertIsNotNone(trace_data["answer"]["value_numeric"])
        self.assertGreaterEqual(len(trace_data["sources"]), 1)
        self.assertEqual(trace_data["sources"][0]["type"], "ConsolidatedMetric")

if __name__ == "__main__":
    unittest.main()
