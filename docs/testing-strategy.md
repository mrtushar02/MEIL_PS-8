# MEIL ESG / BRSR Reporting Platform — Quality Assurance & Testing Strategy

**Document Version**: 1.0.0  
**Phase**: Phase 0 — Full Repository Audit & Test Baseline  
**Authority**: BPUT PS-08 Specification, Master Implementation Prompt  

---

## 1. Testing Pyramid Architecture

```
                 / \
                /   \
               / E2E \       Canonical End-to-End Enterprise Flow (Phase 8)
              /-------\
             /  ROLE   \     Role-Based Access Control & Scope Isolation Tests
            /  ACCESS   \
           /-------------\
          /  INTEGRATION  \  API Route Contracts, Workflow State Machine & DB
         /-----------------\
        /    UNIT TESTS     \ Calculations, Validations, Conversions, Hash Chains
       /---------------------\
```

---

## 2. Test Suite Breakdown

### 2.1 Unit Tests (`backend/tests/unit/`)
* **`test_emission_calculations.py`**:
  * Scope 1 fuel combustion (Diesel, Petrol, Natural Gas) against CEA / IPCC factors.
  * Scope 2 grid electricity emissions using CEA India Baseline v19 ($0.716\text{ kg CO}_2\text{e/kWh}$).
  * Zero emissions for certified renewable generation.
  * Energy normalization to Gigajoules ($\text{kWh} \times 3.6 / 1000$).
* **`test_conversions.py`**:
  * Volume, mass, and energy unit conversion accuracy.
  * Incompatible dimension conversions raise structured `ConversionError`.
* **`test_validation_engine.py`**:
  * Non-negative physical checks for fuel, water, waste, and man-hours.
  * Recycling exceeds withdrawal produces blocking `ERROR`.
  * Water zero-withdrawal edge case returns structured `N/A`.
  * Evidence threshold requirement rules ($>50,000\text{ L}$ fuel requires document).
* **`test_hash_chain.py`**:
  * Canonical payload serialization.
  * Byte-level binary SHA-256 generation.
  * Tamper detection: modifying any historical event invalidates all downstream hashes.

### 2.2 Integration Tests (`backend/tests/integration/`)
* **`test_auth_api.py`**:
  * Successful login generates valid JWT with subject claim.
  * Invalid credentials return HTTP 401.
  * Inactive user accounts are rejected.
  * `/auth/me` resolves strictly from JWT `sub`.
* **`test_organization_api.py`**:
  * 4-tier tree navigation: Group ➔ Subsidiaries ➔ BUs ➔ Projects.
  * Project creation with mismatched BU and Subsidiary fails with HTTP 422.
* **`test_submissions_workflow.py`**:
  * Transactional creation of monthly ESG submissions.
  * State transitions: `DRAFT` ➔ `SUBMITTED` ➔ `BU_APPROVED` ➔ `SUBSIDIARY_APPROVED` ➔ `LOCKED`.
  * Unauthorized status jump (e.g., Project Officer attempting `APPROVE`) fails with HTTP 403.
  * Locked reporting period prevents edits with HTTP 423.
* **`test_evidence_api.py`**:
  * File upload streams raw bytes and calculates authentic SHA-256.
  * Storage upload metadata and record linkage.
  * Only `AUDITOR` / `APPROVER` can verify evidence.
* **`test_consolidation_api.py`**:
  * Group consolidation rolls up through strict hierarchy.
  * Unapproved drafts are excluded from official group totals.
  * Weighted LTIFR calculation verifies mathematical accuracy.
* **`test_brsr_api.py`**:
  * Dynamic readiness calculation moves with approved indicators.
  * BRSR Sections A, B, and C render controlled answers.

### 2.3 Role Access Control Tests (`backend/tests/security/`)
Verifies strict isolation across all 7 operational roles:
1. **`PROJECT_OFFICER`**: Can only view/edit their own assigned project; forbidden from approving or accessing foreign projects.
2. **`BU_COORDINATOR`**: Can view/approve projects strictly within their own Business Unit.
3. **`SUBSIDIARY_HEAD`**: Can view/approve BUs and projects within their own Subsidiary.
4. **`GROUP_ESG_DIRECTOR`**: Can review all subsidiaries and trigger final enterprise locking.
5. **`HR_OFFICER`**: Can access workforce, training, and wellbeing modules; blocked from altering fuel/energy records.
6. **`EHS_OFFICER`**: Can access safety, incidents, and environmental data; blocked from modifying corporate governance records.
7. **`INTERNAL_AUDITOR`**: Read-only access across all records with verify/reject permissions on evidence.

### 2.4 Canonical End-to-End Test (`backend/tests/e2e/test_canonical_flow.py`)
Simulates the complete 25-step audit lifecycle:
1. Super Admin logs in and creates reporting period `FY 2026-27`.
2. Project Officer logs in and navigates to `Zojila Tunnel PKG-2`.
3. Enters monthly DG fuel ($15,000\text{ L}$) and electricity ($85,000\text{ kWh}$).
4. Uploads supporting diesel challan PDF; system calculates SHA-256.
5. Automated validation runs (zero blocking errors).
6. Emission engine executes; Scope 1 and Scope 2 tonnes recorded.
7. Project Officer submits monthly bundle (`SUBMITTED`).
8. BU Coordinator logs in, reviews submission and evidence, and approves (`BU_APPROVED`).
9. Subsidiary ESG Head reviews and approves (`SUBSIDIARY_APPROVED`).
10. Group ESG Director triggers enterprise roll-up and locks period (`LOCKED`).
11. BRSR Readiness updates dynamically; P6 emission indicators populate.
12. Audit trace verifies every reported figure links back to source records and byte-level evidence hash.

---

## 3. Continuous Build & Quality Gates

* **Frontend Build**: `npm run build` inside `frontend/` must complete in $<500\text{ms}$ with zero syntax or bundle errors.
* **Frontend Lint**: `npx oxlint frontend/src` must report zero unhandled runtime errors.
* **Backend Test Suite**: `pytest backend/tests` must pass 100% of test cases.
* **Zero Fictional Claims**: All test fixtures and sample data must be tagged with `is_demo: true`.
