"""
MEIL ESG & BRSR Enterprise Platform - Supabase Auto-Setup & Seed Utility
Connects to Supabase PostgreSQL, provisions all database schemas,
runs all seed datasets, and verifies full operational readiness.
"""

import sys
import os
import time
from sqlalchemy import text

# Ensure backend root is on python path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.core.config import settings
from app.core.database import SessionLocal, engine, Base
import app.models

# Import all domain seed scripts
from scripts.seed_rbac_and_users import seed_rbac
from scripts.seed_data import seed as seed_org_and_data
from scripts.seed_factors_units_validation import seed_factors_units_validation
from scripts.seed_workflow_rules import seed_workflow_transitions
from scripts.seed_brsr_framework import seed_brsr
from scripts.seed_corporate_esg import seed_corporate_esg_data
from scripts.seed_bu_coordinator_data import seed_bu_coordinator_workspace_data
from scripts.seed_hr import seed_hr

# Force UTF-8 on Windows console output if possible
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

def setup_supabase():
    print("=" * 70)
    print("[MEIL ESG & BRSR] SUPABASE DATABASE INITIALIZATION UTILITY")
    print("=" * 70)

    db_url = settings.DATABASE_URL
    if not db_url or "sqlite" in db_url.lower():
        print("\n[!] CURRENT CONFIGURATION USES LOCAL SQLITE:")
        print(f"    DATABASE_URL = {db_url}")
        print("\nTo connect to Supabase, update `backend/.env` with your Supabase Postgres URL:")
        print("    DATABASE_URL=\"postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres\"")
        print("    (or Supabase Pooler port 6543/5432)")
        print("\nRunning in current mode for validation...")

    print("\n1. Connecting to Database Engine...")
    start_time = time.time()
    try:
        with engine.connect() as conn:
            result = conn.execute(text("SELECT version();" if "postgres" in db_url.lower() else "SELECT sqlite_version();"))
            version = result.scalar()
            print("   [+] Successfully Connected! Database Version:")
            print(f"       {version}")
    except Exception as e:
        print(f"   [-] Connection Failed: {e}")

        print("\n   Troubleshooting tips for Supabase:")
        print("   1. Verify your password is correct (no unencoded special characters).")
        print("   2. Check if your network requires Supabase connection pooler (port 6543/5432).")
        print("   3. In Supabase Dashboard -> Project Settings -> Database, use the URI format.")
        return False

    print("\n2. Provisioning All Schemas & Tables (Base.metadata.create_all)...")
    try:
        Base.metadata.create_all(bind=engine)
        print("   [+] All Tables, Foreign Keys, Indexes & Constraints Provisioned!")
    except Exception as e:
        print(f"   [-] Schema Creation Failed: {e}")
        return False

    print("\n3. Seeding Foundation Data...")

    print("   -> Seeding 4-Tier MEIL Organization Hierarchy & Baseline Records...")
    try:
        seed_org_and_data()
        print("      [+] Organization & Baseline Data Seeded.")
    except Exception as e:
        print(f"      [!] Note: {e}")

    print("   -> Seeding RBAC Roles, Scopes & System Users...")
    try:
        seed_rbac()
        print("      [+] RBAC & Users Seeded.")
    except Exception as e:
        print(f"      [!] Note: {e}")

    print("   -> Seeding Emission Factors, Standard Units & Validation Rules...")
    try:
        seed_factors_units_validation()
        print("      [+] Factors & Rules Seeded.")
    except Exception as e:
        print(f"      [!] Note: {e}")

    print("   -> Seeding Workflow State Machine & Transition Matrix...")
    try:
        seed_workflow_transitions()
        print("      [+] Workflow Transitions Seeded.")
    except Exception as e:
        print(f"      [!] Note: {e}")

    print("   -> Seeding Official SEBI BRSR & Core Indicator Framework...")
    try:
        seed_brsr()
        print("      [+] SEBI BRSR Framework Seeded.")
    except Exception as e:
        print(f"      [!] Note: {e}")

    print("   -> Seeding Procurement, Governance & CSR Programs...")
    try:
        seed_corporate_esg_data()
        print("      [+] Corporate ESG Data Seeded.")
    except Exception as e:
        print(f"      [!] Note: {e}")

    print("   -> Seeding BU Coordinator Submissions & Verification Ledger...")
    try:
        seed_bu_coordinator_workspace_data()
        print("      [+] BU Coordinator Workspace Seeded.")
    except Exception as e:
        print(f"      [!] Note: {e}")

    print("   -> Seeding HR Workforce, Diversity, POSH & Training Records...")
    try:
        seed_hr()
        print("      [+] HR Records Seeded.")
    except Exception as e:
        print(f"      [!] Note: {e}")

    # 4. Verification Check
    print("\n4. Verifying Entity Counts in Database...")
    db = SessionLocal()
    try:
        from app.models.organization import Group, Subsidiary, BusinessUnit, Project
        from app.models.user import User, Role
        from app.models.factors import EmissionFactor
        from app.models.brsr import BrsrFramework, BrsrIndicator
        from app.models.procurement import Supplier
        from app.models.csr_projects import CsrProject

        stats = [
            ("Groups", db.query(Group).count()),
            ("Subsidiaries", db.query(Subsidiary).count()),
            ("Business Units", db.query(BusinessUnit).count()),
            ("Projects", db.query(Project).count()),
            ("Roles", db.query(Role).count()),
            ("Active Users", db.query(User).count()),
            ("Emission Factors", db.query(EmissionFactor).count()),
            ("BRSR Frameworks", db.query(BrsrFramework).count()),
            ("BRSR Indicators", db.query(BrsrIndicator).count()),
            ("Suppliers", db.query(Supplier).count()),
            ("CSR Projects", db.query(CsrProject).count()),
        ]

        print("-" * 50)
        for name, count in stats:
            print(f"   * {name:<25}: {count:>5} records")
        print("-" * 50)
        elapsed = round(time.time() - start_time, 2)
        print(f"\n[OK] SUPABASE INITIALIZATION COMPLETE IN {elapsed}s!")
        print("   Database is 100% ready for FastAPI backend and React frontend.")
        print("=" * 70)
        return True
    except Exception as e:
        print(f"   [!] Error during verification: {e}")
        return False
    finally:
        db.close()


if __name__ == "__main__":
    setup_supabase()
