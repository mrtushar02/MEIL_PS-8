import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.core.database import SessionLocal
from app.models.workflow import WorkflowTransition

def seed_workflow_transitions():
    db = SessionLocal()
    try:
        print("Seeding Authorized Workflow Transitions...")
        transitions = [
            # 1. Project level: Draft to Submitted
            ("DRAFT", "SUBMITTED", "PROJECT_OFFICER", "esg:submit"),
            # 2. BU level: Submitted to BU Approved or Correction Required
            ("SUBMITTED", "BU_APPROVED", "BU_COORDINATOR", "esg:bu_review"),
            ("SUBMITTED", "CORRECTION_REQUIRED", "BU_COORDINATOR", "esg:bu_review"),
            # 3. Subsidiary level: BU Approved to Subsidiary Approved or Correction Required
            ("BU_APPROVED", "SUBSIDIARY_APPROVED", "SUBSIDIARY_HEAD", "esg:subsidiary_review"),
            ("BU_APPROVED", "CORRECTION_REQUIRED", "SUBSIDIARY_HEAD", "esg:subsidiary_review"),
            # 4. Group HQ level: Subsidiary Approved to Locked or Correction Required
            ("SUBSIDIARY_APPROVED", "LOCKED", "GROUP_CSO", "esg:group_lock"),
            ("SUBSIDIARY_APPROVED", "CORRECTION_REQUIRED", "GROUP_CSO", "esg:group_lock"),
            # 5. Correction Cycle: Resubmission after Controlled Revision
            ("CORRECTION_REQUIRED", "SUBMITTED", "PROJECT_OFFICER", "esg:submit"),
        ]

        count = 0
        for from_st, to_st, role, perm in transitions:
            existing = db.query(WorkflowTransition).filter(
                WorkflowTransition.from_status == from_st,
                WorkflowTransition.to_status == to_st,
                WorkflowTransition.required_role == role
            ).first()
            if not existing:
                t = WorkflowTransition(
                    from_status=from_st,
                    to_status=to_st,
                    required_role=role,
                    required_permission=perm,
                    is_active=True
                )
                db.add(t)
                count += 1

        db.commit()
        print(f"Seeded {count} active workflow transition rules successfully.")
    finally:
        db.close()

if __name__ == "__main__":
    seed_workflow_transitions()
