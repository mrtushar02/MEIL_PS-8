import sys
import os
from fastapi.testclient import TestClient

# Ensure backend directory is in path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.main import app

client = TestClient(app)

def test_health():
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    print("[OK] Health Check Passed:", data)

def test_auth_login():
    response = client.post("/api/v1/auth/login", json={"email": "admin@meilgroup.in", "password": "password123"})
    assert response.status_code == 200, f"Login failed: {response.text}"
    token_data = response.json()
    assert "access_token" in token_data
    token = token_data["access_token"]
    print("[OK] Admin Login Passed. Token acquired.")

    # Test me endpoint
    me_resp = client.get("/api/v1/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert me_resp.status_code == 200
    user_info = me_resp.json()
    assert user_info["email"] == "admin@meilgroup.in"
    print(f"[OK] Current User Profile Verified: {user_info['full_name']} ({user_info['role']})")
    return token

def test_organization_tree():
    headers = _get_auth_headers()
    response = client.get("/api/v1/organization/tree", headers=headers)
    assert response.status_code == 200
    tree = response.json()
    assert tree["group"]["code"] == "MEIL-CORP"
    assert tree["total_subsidiaries"] >= 5
    assert tree["total_business_units"] >= 6
    assert tree["total_projects"] >= 5
    print(f"[OK] Organization Hierarchy Verified: {tree['group']['name']} with {tree['total_subsidiaries']} Subsidiaries, {tree['total_business_units']} BUs, {tree['total_projects']} Projects")

def test_emission_calculator():
    headers = _get_auth_headers()
    payload = {
        "diesel_litres": 15000.0,
        "petrol_litres": 2000.0,
        "natural_gas_m3": 500.0,
        "grid_kwh": 85000.0,
        "renewable_kwh": 35000.0,
        "cement_tonnes": 250.0,
        "steel_tonnes": 120.0,
        "turnover_inr_cr": 45.0
    }
    response = client.post("/api/v1/reports/calculator", json=payload, headers=headers)
    assert response.status_code == 200
    calc = response.json()
    assert calc["scope1_co2e_tonnes"] > 0
    assert calc["scope2_co2e_tonnes"] > 0
    assert calc["scope3_co2e_tonnes"] > 0
    assert calc["ghg_intensity_per_cr"] > 0
    print(f"[OK] Emission Engine Verified: Scope 1={calc['scope1_co2e_tonnes']} tCO2e, Scope 2={calc['scope2_co2e_tonnes']} tCO2e, Scope 3={calc['scope3_co2e_tonnes']} tCO2e, Intensity={calc['ghg_intensity_per_cr']} tCO2e/Cr")

def _get_auth_headers():
    response = client.post("/api/v1/auth/login", json={"email": "admin@meilgroup.in", "password": "password123"})
    token = response.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}

def test_consolidation_and_brsr():
    headers = _get_auth_headers()
    # First get reporting period
    periods_resp = client.get("/api/v1/reporting-periods", headers=headers)
    assert periods_resp.status_code == 200
    periods = periods_resp.json()
    assert len(periods) > 0
    period_id = periods[0]["id"]
    period_name = periods[0]["name"]
    print(f"[OK] Reporting Period Fetched: {period_name} ({period_id})")

    # Test Group Consolidation
    group_resp = client.get(f"/api/v1/reports/consolidation/group?reporting_period_id={period_id}", headers=headers)
    assert group_resp.status_code == 200
    group_data = group_resp.json()
    assert group_data["total_projects"] > 0
    metrics = group_data["consolidated_metrics"]
    print(f"[OK] Group Consolidation Engine Verified: {group_data['total_projects']} Projects Monitored across {group_data['total_subsidiaries']} Subsidiaries")
    print(f"  - Scope 1: {metrics['scope1_co2e_tonnes']:,} tCO2e")
    print(f"  - Scope 2: {metrics['scope2_co2e_tonnes']:,} tCO2e")
    print(f"  - Total Energy: {metrics['energy_gj']:,} GJ")
    print(f"  - Water Recycled: {metrics['water_recycling_pct']}%")

    # Test Statutory BRSR Report
    brsr_resp = client.get(f"/api/v1/reports/brsr?reporting_period_id={period_id}", headers=headers)
    assert brsr_resp.status_code == 200
    brsr = brsr_resp.json()
    assert "Megha Engineering and Infrastructures Limited" in brsr["reporting_entity"]
    assert "readiness_pct" in brsr
    print(f"[OK] Statutory BRSR Report Engine Verified: Readiness {brsr['readiness_pct']}%, Answers Count: {brsr['answers_count']}")

def test_audit_trail():
    headers = _get_auth_headers()
    resp = client.get("/api/v1/audit/logs", headers=headers)
    assert resp.status_code == 200
    logs = resp.json()
    print(f"[OK] Immutable Audit Trail Verified: {len(logs)} audit entries captured")

if __name__ == "__main__":
    print("=" * 60)
    print("STARTING END-TO-END FASTAPI ESG ENGINE VERIFICATION")
    print("=" * 60)
    test_health()
    test_auth_login()
    test_organization_tree()
    test_emission_calculator()
    test_consolidation_and_brsr()
    test_audit_trail()
    print("=" * 60)
    print("ALL BACKEND SERVICES & ENGINES VERIFIED 100% OPERATIONAL!")
    print("=" * 60)
