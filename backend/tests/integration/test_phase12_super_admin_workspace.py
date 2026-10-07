import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.core.database import SessionLocal
from app.models.user import User, Role
from app.core.security import create_access_token

@pytest.fixture(scope="module")
def client():
    return TestClient(app)

@pytest.fixture(scope="module")
def admin_token():
    db = SessionLocal()
    admin = db.query(User).filter(User.email == "admin@meilgroup.in").first()
    db.close()
    assert admin is not None
    return create_access_token(admin.id)

@pytest.fixture(scope="module")
def non_admin_token():
    db = SessionLocal()
    user = db.query(User).filter(User.email == "site.officer@meilgroup.in").first()
    db.close()
    assert user is not None
    return create_access_token(user.id)

def test_admin_overview_requires_super_admin(client, non_admin_token, admin_token):
    # Non-admin forbidden
    res_403 = client.get("/api/v1/admin/overview", headers={"Authorization": f"Bearer {non_admin_token}"})
    assert res_403.status_code == 403

    # Super admin authorized
    res_200 = client.get("/api/v1/admin/overview", headers={"Authorization": f"Bearer {admin_token}"})
    assert res_200.status_code == 200
    data = res_200.json()
    assert "kpi" in data
    assert data["kpi"]["active_roles"] == 15
    assert data["kpi"]["platform_health_pct"] == 98.7

def test_admin_list_users(client, admin_token):
    res = client.get("/api/v1/admin/users", headers={"Authorization": f"Bearer {admin_token}"})
    assert res.status_code == 200
    users = res.json()
    assert len(users) >= 15
    assert any(u["email"] == "admin@meilgroup.in" for u in users)

def test_admin_create_and_update_user(client, admin_token):
    db = SessionLocal()
    role = db.query(Role).first()
    db.close()
    
    import uuid
    test_email = f"test.provisioned.{uuid.uuid4().hex[:8]}@meilgroup.in"
    create_payload = {
        "full_name": "Test Provisioned User",
        "email": test_email,
        "role_id": role.id,
        "scope_type": "BUSINESS_UNIT",
        "scope_id": "bu-tunnels",
        "department": "Engineering Operations"
    }
    res_create = client.post("/api/v1/admin/users", json=create_payload, headers={"Authorization": f"Bearer {admin_token}"})
    assert res_create.status_code == 201
    user_id = res_create.json()["id"]

    # Update user
    update_payload = {
        "full_name": "Test Provisioned User Updated",
        "is_active": True
    }
    res_update = client.patch(f"/api/v1/admin/users/{user_id}", json=update_payload, headers={"Authorization": f"Bearer {admin_token}"})
    assert res_update.status_code == 200
    assert res_update.json()["full_name"] == "Test Provisioned User Updated"

    # Revoke sessions
    res_revoke = client.post(f"/api/v1/admin/users/{user_id}/revoke-sessions", headers={"Authorization": f"Bearer {admin_token}"})
    assert res_revoke.status_code == 200
    assert res_revoke.json()["status"] == "REVOKED"

def test_admin_canonical_roles_and_permissions(client, admin_token):
    res_roles = client.get("/api/v1/admin/roles", headers={"Authorization": f"Bearer {admin_token}"})
    assert res_roles.status_code == 200
    roles = res_roles.json()
    assert len(roles) == 15

    res_perms = client.get("/api/v1/admin/permissions", headers={"Authorization": f"Bearer {admin_token}"})
    assert res_perms.status_code == 200
    perms = res_perms.json()
    assert len(perms) >= 20

def test_admin_workflow_configuration(client, admin_token):
    res = client.get("/api/v1/admin/workflow", headers={"Authorization": f"Bearer {admin_token}"})
    assert res.status_code == 200
    data = res.json()
    assert "states" in data
    assert "transitions" in data
    assert len(data["transitions"]) >= 5

def test_admin_system_health_and_storage(client, admin_token):
    res_health = client.get("/api/v1/admin/health", headers={"Authorization": f"Bearer {admin_token}"})
    assert res_health.status_code == 200
    assert res_health.json()["platform_health_pct"] == 98.7

    res_storage = client.get("/api/v1/admin/storage", headers={"Authorization": f"Bearer {admin_token}"})
    assert res_storage.status_code == 200
    assert "integrity_status" in res_storage.json()

def test_admin_global_search(client, admin_token):
    res_search = client.get("/api/v1/admin/search?q=Zojila", headers={"Authorization": f"Bearer {admin_token}"})
    assert res_search.status_code == 200
    results = res_search.json()
    assert any("Zojila" in r["title"] for r in results)
