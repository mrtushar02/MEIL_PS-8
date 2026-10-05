import sys
import os
import unittest
from fastapi.testclient import TestClient

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))

from app.main import app
from app.core.database import SessionLocal
from app.models.reporting import ReportingPeriod, Submission
from app.models.organization import Project
from app.models.workflow import SubmissionVersion, ApprovalAction
from app.models.audit import AuditLog

class TestPhase4WorkflowAudit(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.client = TestClient(app)

        # 1. Site Officer for Zojila (site-102 in bu-tunnels, sub-meil-core)
        resp = cls.client.post("/api/v1/auth/login", json={"email": "zojila.officer@meilgroup.in", "password": "password123"})
        assert resp.status_code == 200, f"Zojila login failed: {resp.text}"
        cls.zojila_headers = {"Authorization": f"Bearer {resp.json()['access_token']}"}

        # 2. Site Officer for Gayatri (site-101 in bu-water, sub-meil-core)
        resp = cls.client.post("/api/v1/auth/login", json={"email": "site.officer@meilgroup.in", "password": "password123"})
        assert resp.status_code == 200, f"Gayatri login failed: {resp.text}"
        cls.gayatri_headers = {"Authorization": f"Bearer {resp.json()['access_token']}"}

        # 3. BU Coordinator (bu-tunnels)
        resp = cls.client.post("/api/v1/auth/login", json={"email": "bu.coordinator@meilgroup.in", "password": "password123"})
        assert resp.status_code == 200, f"BU login failed: {resp.text}"
        cls.bu_headers = {"Authorization": f"Bearer {resp.json()['access_token']}"}

        # 4. Subsidiary Head (sub-meil-core)
        resp = cls.client.post("/api/v1/auth/login", json={"email": "sub.head@meilgroup.in", "password": "password123"})
        assert resp.status_code == 200, f"Sub Head login failed: {resp.text}"
        cls.sub_headers = {"Authorization": f"Bearer {resp.json()['access_token']}"}

        # 5. Group CSO (group-hq)
        resp = cls.client.post("/api/v1/auth/login", json={"email": "cso@meilgroup.in", "password": "password123"})
        assert resp.status_code == 200, f"CSO login failed: {resp.text}"
        cls.cso_headers = {"Authorization": f"Bearer {resp.json()['access_token']}"}
 
    def setUp(self):
        db = SessionLocal()
        try:
            period = db.query(ReportingPeriod).filter(ReportingPeriod.id == "period-2025-09").first()
            if period and period.is_locked:
                period.is_locked = False
                db.commit()
        finally:
            db.close()

    def test_full_hierarchical_workflow_and_lock(self):
        """Test complete 4-tier lifecycle: DRAFT -> SUBMITTED -> BU_APPROVED -> SUBSIDIARY_APPROVED -> LOCKED"""
        db = SessionLocal()
        try:
            # Create a clean test submission for site-102 (bu-tunnels)
            project = db.query(Project).filter(Project.id == "site-102").first()
            period = db.query(ReportingPeriod).filter(ReportingPeriod.id == "period-2025-09").first()
            self.assertIsNotNone(project)
            self.assertIsNotNone(period)

            sub = Submission(
                project_id=project.id,
                reporting_period_id=period.id,
                status="DRAFT",
                version=1,
                submitted_by="Tenzin Dorjey"
            )
            db.add(sub)
            db.commit()
            db.refresh(sub)
            sub_id = sub.id
        finally:
            db.close()

        # Step 1: Site officer submits (DRAFT -> SUBMITTED)
        res_sub = self.client.post(f"/api/v1/submissions/{sub_id}/submit", headers=self.zojila_headers)
        self.assertEqual(res_sub.status_code, 200)
        self.assertEqual(res_sub.json()["status"], "SUBMITTED")

        # Step 2: BU Coordinator approves (SUBMITTED -> BU_APPROVED)
        res_bu = self.client.post(f"/api/v1/submissions/{sub_id}/approve", json={"comment": "BU Technical Review OK"}, headers=self.bu_headers)
        self.assertEqual(res_bu.status_code, 200)
        self.assertEqual(res_bu.json()["status"], "BU_APPROVED")

        # Step 3: Subsidiary Head approves (BU_APPROVED -> SUBSIDIARY_APPROVED)
        res_sub_head = self.client.post(f"/api/v1/submissions/{sub_id}/approve", json={"comment": "Subsidiary Executive Review OK"}, headers=self.sub_headers)
        self.assertEqual(res_sub_head.status_code, 200)
        self.assertEqual(res_sub_head.json()["status"], "SUBSIDIARY_APPROVED")

        # Step 4: Group CSO locks (SUBSIDIARY_APPROVED -> LOCKED)
        res_lock = self.client.post(f"/api/v1/submissions/{sub_id}/lock", json={"comment": "Group ESG Lock for SEBI BRSR"}, headers=self.cso_headers)
        self.assertEqual(res_lock.status_code, 200)
        self.assertEqual(res_lock.json()["status"], "LOCKED")

        # Verify history endpoint
        hist_res = self.client.get(f"/api/v1/submissions/{sub_id}/history", headers=self.zojila_headers)
        self.assertEqual(hist_res.status_code, 200)
        hist = hist_res.json()
        self.assertEqual(hist["current_status"], "LOCKED")
        self.assertGreaterEqual(len(hist["approval_actions"]), 4)

    def test_cross_bu_approval_blocked(self):
        """Verify that BU Coordinator of bu-tunnels CANNOT approve a project in bu-water (HTTP 403)"""
        db = SessionLocal()
        try:
            sub = Submission(
                project_id="site-101", # bu-water
                reporting_period_id="period-2025-09",
                status="SUBMITTED",
                version=1
            )
            db.add(sub)
            db.commit()
            db.refresh(sub)
            sub_id = sub.id
        finally:
            db.close()

        # BU Coordinator of bu-tunnels tries to approve site-101 (in bu-water)
        cross_res = self.client.post(f"/api/v1/submissions/{sub_id}/approve", headers=self.bu_headers)
        self.assertEqual(cross_res.status_code, 403)
        self.assertIn("lacks BU scope authority", cross_res.json()["detail"])

    def test_illegal_transition_and_unauthorized_approvals_blocked(self):
        """Verify state machine blocks tier-skipping and unauthorized actors"""
        db = SessionLocal()
        try:
            sub = Submission(
                project_id="site-102",
                reporting_period_id="period-2025-09",
                status="DRAFT",
                version=1
            )
            db.add(sub)
            db.commit()
            db.refresh(sub)
            sub_id = sub.id
        finally:
            db.close()

        # Site Officer cannot directly approve or lock
        bad_lock = self.client.post(f"/api/v1/submissions/{sub_id}/lock", headers=self.zojila_headers)
        self.assertEqual(bad_lock.status_code, 409) # Cannot jump DRAFT -> LOCKED

        bad_approve = self.client.post(f"/api/v1/submissions/{sub_id}/approve", headers=self.zojila_headers)
        self.assertEqual(bad_approve.status_code, 409)

    def test_rejection_and_controlled_revision_cycle(self):
        """Verify BU Coordinator rejection creates archived version snapshot and increments version number"""
        db = SessionLocal()
        try:
            sub = Submission(
                project_id="site-102",
                reporting_period_id="period-2025-09",
                status="SUBMITTED",
                version=1
            )
            db.add(sub)
            db.commit()
            db.refresh(sub)
            sub_id = sub.id
        finally:
            db.close()

        # Reject with mandatory comment
        rej_res = self.client.post(
            f"/api/v1/submissions/{sub_id}/reject",
            json={"action": "REQUEST_CORRECTION", "comment": "Water meter log incomplete - missing recharge evidence"},
            headers=self.bu_headers
        )
        self.assertEqual(rej_res.status_code, 200)
        rej_data = rej_res.json()
        self.assertEqual(rej_data["status"], "CORRECTION_REQUIRED")
        self.assertEqual(rej_data["version"], 2) # Version incremented
        self.assertEqual(rej_data["rejection_reason"], "Water meter log incomplete - missing recharge evidence")

        # Verify historical version snapshot was persisted
        hist_res = self.client.get(f"/api/v1/submissions/{sub_id}/history", headers=self.zojila_headers)
        self.assertEqual(hist_res.status_code, 200)
        self.assertGreaterEqual(len(hist_res.json()["archived_versions"]), 1)

    def test_period_lock_enforcement(self):
        """Verify that when a reporting period is locked, submissions cannot be altered (HTTP 423)"""
        db = SessionLocal()
        try:
            period = db.query(ReportingPeriod).filter(ReportingPeriod.id == "period-2025-09").first()
            period.is_locked = True
            db.commit()

            sub = Submission(
                project_id="site-102",
                reporting_period_id=period.id,
                status="DRAFT",
                version=1
            )
            db.add(sub)
            db.commit()
            db.refresh(sub)
            sub_id = sub.id
        finally:
            db.close()

        try:
            # Attempt to submit during lock
            res = self.client.post(f"/api/v1/submissions/{sub_id}/submit", headers=self.zojila_headers)
            self.assertEqual(res.status_code, 423)
            self.assertIn("LOCKED", res.json()["detail"])
        finally:
            # Revert period lock
            db = SessionLocal()
            period = db.query(ReportingPeriod).filter(ReportingPeriod.id == "period-2025-09").first()
            period.is_locked = False
            db.commit()
            db.close()

    def test_tamper_evident_audit_hash_chain(self):
        """Verify that every regulatory event updates the SHA-256 hash chain and verification succeeds"""
        res = self.client.get("/api/v1/audit/verify-chain", headers=self.cso_headers)
        self.assertEqual(res.status_code, 200)
        chain_info = res.json()
        self.assertTrue(chain_info["valid"])
        self.assertEqual(chain_info["status"], "CHAIN_VERIFIED_AUTHENTIC")
        self.assertGreater(chain_info["total_records"], 0)
        self.assertIsNotNone(chain_info["head_hash"])

if __name__ == "__main__":
    unittest.main()
