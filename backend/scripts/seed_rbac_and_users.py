import sys
import os
from datetime import datetime, timezone

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.core.database import SessionLocal
from app.core.security import get_password_hash
from app.models.user import Role, User, UserScope, Permission, role_permissions
from app.models.organization import Group, Subsidiary, BusinessUnit, Project

def seed_rbac():
    db = SessionLocal()
    try:
        print("1. Seeding Permissions...")
        permission_defs = [
            ("esg:data_entry", "esg", "data_entry", "Enter project-level ESG activity records"),
            ("esg:data_read", "esg", "data_read", "Read ESG activity and consolidation records"),
            ("esg:evidence_upload", "esg", "evidence_upload", "Upload supporting evidence documents"),
            ("esg:submit", "esg", "submit", "Submit monthly data package for review"),
            ("esg:bu_review", "esg", "bu_review", "Review and approve/reject BU submissions"),
            ("esg:subsidiary_review", "esg", "subsidiary_review", "Review and approve/reject Subsidiary submissions"),
            ("esg:group_lock", "esg", "group_lock", "Lock reporting period and generate BRSR at Group level"),
            ("esg:audit_read", "audit", "read", "View immutable audit trail and traceability chains"),
            ("esg:analytics_read", "analytics", "read", "View ESG analytics, decarbonization trajectories, and intensity trends"),
            ("esg:kpi_manage", "kpi", "manage", "Set and manage sustainability KPIs and targets"),
            ("brsr:manage", "brsr", "manage", "Manage BRSR Core disclosures, mappings, and regulatory filings"),
            ("reports:executive_read", "reports", "executive_read", "Access high-level C-Suite and Board ESG executive summaries"),
            ("assurance:audit_execute", "assurance", "audit_execute", "Perform third-party verification, assurance sign-off, and findings logging"),
            ("hr:manage", "hr", "manage", "Manage workforce, training, and wellbeing records"),
            ("hr:read", "hr", "read", "View HR and workforce metrics"),
            ("ehs:manage", "ehs", "manage", "Manage safety, zero harm audits, and environmental inspections"),
            ("ehs:read", "ehs", "read", "View safety and environmental metrics"),
            ("procurement:manage", "procurement", "manage", "Manage suppliers, MSME sourcing, and assessments"),
            ("procurement:read", "procurement", "read", "View supply chain and scope 3 procurement metrics"),
            ("csr:manage", "csr", "manage", "Manage CSR projects, community initiatives, and beneficiaries"),
            ("csr:read", "csr", "read", "View CSR community project records"),
            ("governance:manage", "governance", "manage", "Manage corporate governance policies and ethics records"),
            ("governance:read", "governance", "read", "View corporate governance policies and ethics registers"),
        ]

        permissions = {}
        for code, resource, action, desc in permission_defs:
            perm = db.query(Permission).filter(Permission.code == code).first()
            if not perm:
                perm = Permission(code=code, resource=resource, action=action, description=desc)
                db.add(perm)
                db.flush()
            permissions[code] = perm

        print("2. Seeding and updating Roles (All 15 Canonical Types)...")
        role_configs = [
            ("role-super", "SUPER_ADMIN", "Global System Administrator", list(permissions.values())),
            ("role-cso", "GROUP_CSO", "Group Chief Sustainability Officer", [
                permissions["esg:group_lock"], permissions["esg:audit_read"],
                permissions["esg:analytics_read"], permissions["esg:kpi_manage"],
                permissions["brsr:manage"], permissions["reports:executive_read"],
                permissions["hr:manage"], permissions["ehs:manage"],
                permissions["procurement:manage"], permissions["csr:manage"],
                permissions["governance:manage"], permissions["esg:data_read"]
            ]),
            ("role-sub", "SUBSIDIARY_HEAD", "Head of Subsidiary ESG", [
                permissions["esg:subsidiary_review"], permissions["esg:audit_read"],
                permissions["esg:analytics_read"], permissions["esg:data_read"],
                permissions["hr:read"], permissions["ehs:read"]
            ]),
            ("role-bu", "BU_COORDINATOR", "Business Unit Sustainability Coordinator", [
                permissions["esg:bu_review"], permissions["esg:audit_read"],
                permissions["esg:analytics_read"], permissions["esg:data_read"]
            ]),
            ("role-site", "PROJECT_OFFICER", "Site Safety & Energy Officer", [
                permissions["esg:data_entry"], permissions["esg:evidence_upload"],
                permissions["esg:submit"], permissions["esg:data_read"]
            ]),
            ("role-hr", "HR_OFFICER", "HR & Workforce Manager", [
                permissions["hr:manage"], permissions["hr:read"],
                permissions["esg:evidence_upload"]
            ]),
            ("role-ehs", "EHS_OFFICER", "EHS & Safety Specialist", [
                permissions["ehs:manage"], permissions["ehs:read"],
                permissions["esg:evidence_upload"]
            ]),
            ("role-procurement", "PROCUREMENT_OFFICER", "Procurement & Scope 3 Officer", [
                permissions["procurement:manage"], permissions["procurement:read"],
                permissions["esg:evidence_upload"]
            ]),
            ("role-csr", "CSR_OFFICER", "CSR & Community Lead", [
                permissions["csr:manage"], permissions["csr:read"],
                permissions["esg:evidence_upload"]
            ]),
            ("role-compliance", "COMPLIANCE_OFFICER", "Governance & Compliance Lead", [
                permissions["governance:manage"], permissions["governance:read"],
                permissions["esg:audit_read"], permissions["esg:evidence_upload"],
                permissions["brsr:manage"]
            ]),
            ("role-esg-mgr", "ESG_MANAGER", "Group Sustainability & Decarbonization Manager", [
                permissions["esg:analytics_read"], permissions["esg:kpi_manage"],
                permissions["esg:data_read"], permissions["esg:audit_read"],
                permissions["brsr:manage"], permissions["esg:evidence_upload"],
                permissions["hr:read"], permissions["ehs:read"],
                permissions["procurement:read"], permissions["csr:read"],
                permissions["governance:read"]
            ]),
            ("role-esg-analyst", "ESG_ANALYST", "ESG Quantitative Data & Carbon Accounting Analyst", [
                permissions["esg:analytics_read"], permissions["esg:data_read"],
                permissions["esg:audit_read"], permissions["hr:read"],
                permissions["ehs:read"], permissions["procurement:read"]
            ]),
            ("role-brsr-mgr", "BRSR_MANAGER", "SEBI BRSR Statutory Reporting & Filing Manager", [
                permissions["brsr:manage"], permissions["esg:analytics_read"],
                permissions["esg:data_read"], permissions["esg:audit_read"],
                permissions["governance:read"], permissions["hr:read"],
                permissions["ehs:read"], permissions["procurement:read"],
                permissions["csr:read"]
            ]),
            ("role-auditor", "ASSURANCE_AUDITOR", "Third-Party Assurance Auditor", [
                permissions["assurance:audit_execute"], permissions["esg:audit_read"],
                permissions["esg:data_read"], permissions["reports:executive_read"]
            ]),
            ("role-executive", "EXECUTIVE", "Board & Executive Leadership Observer", [
                permissions["reports:executive_read"], permissions["esg:analytics_read"],
                permissions["esg:audit_read"]
            ])
        ]

        roles = {}
        for role_id, role_name, desc, perms in role_configs:
            role = db.query(Role).filter(Role.name == role_name).first()
            if not role:
                role = Role(id=role_id, code=role_name, name=role_name, description=desc)
                db.add(role)
                db.flush()
            else:
                role.code = role_name
                role.description = desc
            
            role.permissions = perms
            roles[role_name] = role

        db.flush()

        # Find key entities for scopes
        group = db.query(Group).first()
        group_id = group.id if group else "meil-group-hq"
        
        project_gayatri = db.query(Project).filter(Project.id == "site-101").first()
        project_gayatri_id = project_gayatri.id if project_gayatri else "site-101"
        
        project_zojila = db.query(Project).filter(Project.id == "site-102").first()
        project_zojila_id = project_zojila.id if project_zojila else "site-102"

        sub_core = db.query(Subsidiary).filter(Subsidiary.id == "sub-meil-core").first()
        sub_core_id = sub_core.id if sub_core else "sub-meil-core"

        bu_tunnels = db.query(BusinessUnit).filter(BusinessUnit.id == "bu-tunnels").first()
        bu_tunnels_id = bu_tunnels.id if bu_tunnels else "bu-tunnels"

        print("3. Seeding Operational Users & Scopes (15 Canonical Types)...")
        pwd_hash = get_password_hash("password123")

        user_definitions = [
            ("user-admin", "admin@meilgroup.in", "System Super Administrator", "SUPER_ADMIN", True, "GROUP", group_id),
            ("user-cso", "cso@meilgroup.in", "Dr. B. Prasad (Group CSO)", "GROUP_CSO", False, "GROUP", group_id),
            ("user-sub-head", "sub.head@meilgroup.in", "V. R. Krishna Murthy (Sub Head)", "SUBSIDIARY_HEAD", False, "SUBSIDIARY", sub_core_id),
            ("user-bu-coord", "bu.coordinator@meilgroup.in", "R. K. Sharma (BU Coordinator)", "BU_COORDINATOR", False, "BUSINESS_UNIT", bu_tunnels_id),
            ("user-site-officer", "site.officer@meilgroup.in", "Rohit Kumar (Site Officer - Gayatri)", "PROJECT_OFFICER", False, "PROJECT", project_gayatri_id),
            ("user-site-zojila", "zojila.officer@meilgroup.in", "Tenzin Dorjey (Site Officer - Zojila)", "PROJECT_OFFICER", False, "PROJECT", project_zojila_id),
            ("user-hr", "hr.director@meilgroup.in", "Sunita Raman (HR Director)", "HR_OFFICER", False, "GROUP", group_id),
            ("user-ehs", "ehs.head@meilgroup.in", "Rajeshwar K. (EHS Head)", "EHS_OFFICER", False, "GROUP", group_id),
            ("user-procurement", "procurement@meilgroup.in", "Anand Mahindra V. (Procurement Lead)", "PROCUREMENT_OFFICER", False, "GROUP", group_id),
            ("user-csr", "csr.lead@meilgroup.in", "K. Meenakshi (CSR Lead)", "CSR_OFFICER", False, "GROUP", group_id),
            ("user-compliance", "compliance@meilgroup.in", "Adv. S. K. Nair (Compliance Officer)", "COMPLIANCE_OFFICER", False, "GROUP", group_id),
            ("user-esg-mgr", "esg.manager@meilgroup.in", "S. Ananthakrishnan (ESG Manager)", "ESG_MANAGER", False, "GROUP", group_id),
            ("user-esg-analyst", "esg.analyst@meilgroup.in", "Pooja Varma (ESG Analyst)", "ESG_ANALYST", False, "GROUP", group_id),
            ("user-brsr-mgr", "brsr.manager@meilgroup.in", "N. Ramachandran (BRSR Manager)", "BRSR_MANAGER", False, "GROUP", group_id),
            ("user-auditor", "auditor@meilgroup.in", "PwC / KPMG Assurance Lead", "ASSURANCE_AUDITOR", False, "GROUP", group_id),
            ("user-executive", "executive@meilgroup.in", "P. P. Reddy (Executive Chairman)", "EXECUTIVE", False, "GROUP", group_id),
        ]

        for uid, email, name, role_name, is_super, scope_type, scope_id in user_definitions:
            target_role = roles[role_name]
            user = db.query(User).filter(User.email == email).first()
            if not user:
                user = User(
                    id=uid,
                    email=email,
                    full_name=name,
                    hashed_password=pwd_hash,
                    role_id=target_role.id,
                    is_superuser=is_super,
                    is_active=True
                )
                db.add(user)
                db.flush()
            else:
                user.role_id = target_role.id
                user.is_superuser = is_super
                user.full_name = name
                user.hashed_password = pwd_hash
                user.is_active = True
                db.flush()

            # Ensure scope
            scope = db.query(UserScope).filter(
                UserScope.user_id == user.id,
                UserScope.scope_type == scope_type,
                UserScope.scope_id == scope_id
            ).first()
            if not scope:
                scope = UserScope(user_id=user.id, scope_type=scope_type, scope_id=scope_id)
                db.add(scope)

        db.commit()
        print("RBAC & User Seeding completed successfully!")
    except Exception as e:
        db.rollback()
        print(f"Error during RBAC seeding: {e}")
        raise
    finally:
        db.close()

if __name__ == "__main__":
    seed_rbac()
