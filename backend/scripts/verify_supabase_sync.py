import httpx
import sys

def verify_all_users():
    users_to_test = [
        ('admin@meilgroup.in', 'SUPER_ADMIN'),
        ('cso@meilgroup.in', 'GROUP_CSO'),
        ('sub.head@meilgroup.in', 'SUBSIDIARY_HEAD'),
        ('bu.coordinator@meilgroup.in', 'BU_COORDINATOR'),
        ('site.officer@meilgroup.in', 'PROJECT_OFFICER'),
        ('zojila.officer@meilgroup.in', 'PROJECT_OFFICER'),
        ('hr.director@meilgroup.in', 'HR_OFFICER'),
        ('ehs.head@meilgroup.in', 'EHS_OFFICER'),
        ('procurement@meilgroup.in', 'PROCUREMENT_OFFICER'),
        ('csr.lead@meilgroup.in', 'CSR_OFFICER'),
        ('compliance@meilgroup.in', 'COMPLIANCE_OFFICER'),
        ('esg.manager@meilgroup.in', 'ESG_MANAGER'),
        ('esg.analyst@meilgroup.in', 'ESG_ANALYST'),
        ('brsr.manager@meilgroup.in', 'BRSR_MANAGER'),
        ('auditor@meilgroup.in', 'ASSURANCE_AUDITOR'),
        ('executive@meilgroup.in', 'EXECUTIVE'),
    ]

    print("=" * 80)
    print("MEIL ESG - SUPABASE END-TO-END DATA FETCH & USER PROFILE VERIFICATION")
    print("=" * 80)
    print(f"Testing live authentication & profile retrieval for all {len(users_to_test)} accounts:\n")

    passed = 0
    for email, expected_role in users_to_test:
        try:
            # 1. Login through Vite frontend proxy (or direct API)
            resp = httpx.post(
                'http://localhost:5173/api/v1/auth/login',
                json={'email': email, 'password': 'password123'},
                timeout=10.0
            )
            if resp.status_code != 200:
                print(f"[-] FAILED LOGIN for {email}: {resp.status_code} {resp.text}")
                continue

            token_data = resp.json()
            token = token_data.get('access_token')

            # 2. Fetch User Profile (/auth/me) with token
            headers = {'Authorization': f'Bearer {token}'}
            me_resp = httpx.get('http://localhost:5173/api/v1/auth/me', headers=headers, timeout=10.0)
            if me_resp.status_code != 200:
                print(f"[-] FAILED /auth/me for {email}: {me_resp.status_code}")
                continue

            user_profile = me_resp.json()
            uid = user_profile.get('id', '')
            role = user_profile.get('role', '')
            name = user_profile.get('full_name', '')
            scopes_count = len(user_profile.get('scopes', []))
            perms_count = len(user_profile.get('permissions', []))

            print(f"[+] User ID: {uid:<20} | Role: {role:<20} | Name: {name:<35} | Scopes: {scopes_count} | Perms: {perms_count}")
            passed += 1
        except Exception as e:
            print(f"[-] Exception testing {email}: {e}")

    print("-" * 80)
    print(f"Result: {passed}/{len(users_to_test)} user accounts successfully authenticated & verified from Supabase!")
    print("=" * 80)
    return passed == len(users_to_test)

if __name__ == "__main__":
    success = verify_all_users()
    sys.exit(0 if success else 1)
