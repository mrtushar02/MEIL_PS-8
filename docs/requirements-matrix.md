# MEIL ESG / BRSR Reporting Platform — Requirements Traceability & Audit Matrix

**Document Version**: 1.0.0  
**Phase**: Phase 0 — Full Repository Audit & Requirements Baseline  
**Authority**: BPUT PS-08 Specification, SEBI BRSR Circulars (2021, 2023, 2025), ICAI Revised Edition 2024, Master Implementation Prompt  

---

## 1. Executive Summary & Audit Classification Key

Each requirement is audited against the active codebase (`frontend/`, `backend/`, and corporate documentation) and classified into one of six standard statuses:

| Status | Meaning |
| :--- | :--- |
| **`EXISTS`** | Fully implemented, database-backed, verified, and operational. |
| **`EXISTS BUT INCOMPLETE`** | UI or backend scaffold exists, but logic uses hardcoded constants, mock state, or lacks full workflow integration. |
| **`MISSING`** | Requirement is not implemented in either frontend or backend. |
| **`NEEDS REFACTOR`** | Implemented in a manner conflicting with production standards (e.g., SQLite default, `create_all()`, hardcoded factors). |
| **`CONFLICT`** | Conflicting definitions or ambiguous requirements between sources that require an explicit architecture decision. |
| **`OPTIONAL`** | Aspirational, secondary, or out-of-core-scope feature (e.g., comprehensive Scope 3 beyond seed categories). |

---

## 2. Comprehensive Requirements Matrix

### Category 1: Infrastructure & Database Engine

#### REQ-INF-01: Production PostgreSQL & Supabase Engine
* **Source**: Master Prompt Part 4.1 & Part 7; BPUT Architecture Spec
* **Status**: `NEEDS REFACTOR`
* **Current Implementation**: [backend/app/core/config.py](file:///d:/MEIL_PS-8/backend/app/core/config.py) defaults to `sqlite:///./meil_esg.db`. [backend/app/core/database.py](file:///d:/MEIL_PS-8/backend/app/core/database.py) has rudimentary conditional for SQLite.
* **Files Involved**: `backend/app/core/config.py`, `backend/app/core/database.py`, `backend/.env`, `backend/.env.example`
* **Gap**: SQLite is default in production config; no environment-driven PostgreSQL / Supabase pool configuration with failover isolation.
* **Required Fix**: Configure Supabase PostgreSQL as primary database with connection pooling (`pgbouncer`/SQLAlchemy pooling); isolate SQLite strictly to an optional local development profile (`APP_ENV=development`).
* **Database Change**: PostgreSQL-compatible schema types (UUID, TIMESTAMPTZ, NUMERIC, JSONB, INET).
* **API Change**: Database dependency `get_db()` supporting connection health checks.
* **Frontend Change**: None (transparent).
* **Test Required**: PostgreSQL connection and transaction integration tests.
* **Acceptance Criteria**: App connects to PostgreSQL/Supabase when `DATABASE_URL` is set; connection pool is managed; SQLite only active when explicitly selected for offline local tests.

#### REQ-INF-02: Migration-Controlled Database Lifecycle (Alembic)
* **Source**: Master Prompt Part 4.2
* **Status**: `NEEDS REFACTOR`
* **Current Implementation**: [backend/app/main.py](file:///d:/MEIL_PS-8/backend/app/main.py) calls `Base.metadata.create_all(bind=engine)` directly at application startup.
* **Files Involved**: `backend/app/main.py`, `backend/alembic/`, `backend/alembic.ini`
* **Gap**: No Alembic environment configured; schema changes happen via uncontrolled runtime mutations.
* **Required Fix**: Initialize Alembic, generate baseline migration `001_initial_schema.py`, remove `create_all()` from `main.py`, enforce `alembic upgrade head`.
* **Database Change**: Migration version table `alembic_version`.
* **API Change**: Startup check verifying database schema matches migration head.
* **Frontend Change**: None.
* **Test Required**: Migration up and downgrade verification tests.
* **Acceptance Criteria**: Database initializes strictly through migrations; zero runtime `create_all()` in production code.

#### REQ-INF-03: Redis Asynchronous Queue & Cache
* **Source**: Master Prompt Part 4.1 & Part 7
* **Status**: `EXISTS BUT INCOMPLETE`
* **Current Implementation**: [backend/app/core/config.py](file:///d:/MEIL_PS-8/backend/app/core/config.py) defines `REDIS_URL = "redis://localhost:6379/0"`.
* **Files Involved**: `backend/app/core/config.py`, `backend/app/services/`
* **Gap**: Redis client is not integrated into background task runners, report generation jobs, or caching layers.
* **Required Fix**: Implement lightweight Redis client for caching report summaries and queueing long-running PDF/Excel export jobs without allowing Redis to become source of truth.
* **Database Change**: None.
* **API Change**: Asynchronous report export worker endpoints.
* **Frontend Change**: Polling / status indicator for async export jobs.
* **Test Required**: Cache hit/miss and async worker dispatch tests.
* **Acceptance Criteria**: Report jobs queue to Redis; database remains the only permanent source of truth.

---

### Category 2: Authentication, RBAC & Scopes

#### REQ-SEC-01: Authentic JWT Authentication
* **Source**: Master Prompt Part 4.3 & Part 8
* **Status**: `NEEDS REFACTOR`
* **Current Implementation**: [frontend/src/App.jsx](file:///d:/MEIL_PS-8/frontend/src/App.jsx) initializes default demo session for Rohit Kumar. [frontend/src/services/api.js](file:///d:/MEIL_PS-8/frontend/src/services/api.js) line 67 has fallback dummy token generator. [backend/app/api/v1/auth.py](file:///d:/MEIL_PS-8/backend/app/api/v1/auth.py) `GET /auth/me` falls back to `db.query(User).first()`.
* **Files Involved**: `frontend/src/App.jsx`, `frontend/src/services/api.js`, `backend/app/api/v1/auth.py`, `backend/app/core/security.py`
* **Gap**: Unauthenticated visitors are auto-logged in via local client state; `GET /auth/me` ignores token subject and returns first user.
* **Required Fix**: Require genuine `POST /auth/login` to obtain signed JWT; resolve `GET /auth/me` from JWT subject claim (`sub`); reject invalid or expired tokens with HTTP 401.
* **Database Change**: Ensure `users.auth_user_id`, `users.is_active`, `users.hashed_password` are indexed.
* **API Change**: `GET /api/v1/auth/me` requires `Depends(get_current_user)`.
* **Frontend Change**: `App.jsx` redirects unauthenticated users to login; stores verified JWT; handles token expiration gracefully.
* **Test Required**: Invalid password test, expired JWT test, token tampering test.
* **Acceptance Criteria**: User cannot access dashboard without authentic token; `GET /auth/me` reflects token subject.

#### REQ-SEC-02: Backend Role-Based Access Control (RBAC) & Scope Enforcement
* **Source**: Master Prompt Part 4.4, Part 8, Part 61
* **Status**: `EXISTS BUT INCOMPLETE`
* **Current Implementation**: Backend models have `Role`, `Permission`, `UserScope` tables in [backend/app/models/user.py](file:///d:/MEIL_PS-8/backend/app/models/user.py), but API endpoints do not enforce scopes or permissions via FastAPI dependencies.
* **Files Involved**: `backend/app/models/user.py`, `backend/app/api/deps.py` (to create), `backend/app/api/v1/*.py`
* **Gap**: Endpoints rely on frontend UI hiding rather than server-side scope validation (`require_project_access`, `require_subsidiary_access`).
* **Required Fix**: Create dependency injection utilities: `get_current_user()`, `require_permission(perm)`, `require_scope(scope_type, scope_id)`.
* **Database Change**: Ensure composite index on `user_scopes(user_id, scope_type, scope_id)`.
* **API Change**: Add dependencies to all protected routes in `/projects/{id}/*`, `/submissions/*`, `/evidence/*`.
* **Frontend Change**: Handle HTTP 403 Forbidden with contextual error message.
* **Test Required**: Project user attempting to access foreign project receives HTTP 403.
* **Acceptance Criteria**: Backend halts unauthorized cross-project or cross-subsidiary mutations with 403.

#### REQ-SEC-03: Elimination of Hardcoded Actors in Workflows
* **Source**: Master Prompt Part 4.5, Part 28, Part 29
* **Status**: `NEEDS REFACTOR`
* **Current Implementation**: [backend/app/api/v1/submissions.py](file:///d:/MEIL_PS-8/backend/app/api/v1/submissions.py) hardcodes `actor_id="user-site-officer"` and `actor_id="user-reviewer"` during audit logging and review state transitions.
* **Files Involved**: `backend/app/api/v1/submissions.py`, `backend/app/services/audit_service.py`
* **Gap**: Audit logs and submissions attribute actions to hardcoded strings rather than the authenticated JWT user.
* **Required Fix**: Extract `current_user.id`, `current_user.full_name`, `current_user.role`, and `current_user.scopes` from request context and pass to submission and audit services.
* **Database Change**: None (tables already support UUID/string foreign keys).
* **API Change**: `submit_monthly_esg_data` and `review_submission` accept `current_user = Depends(get_current_user)`.
* **Frontend Change**: Pass Bearer token on all mutation requests.
* **Test Required**: Audit log captures exact logged-in user ID and role for every state transition.
* **Acceptance Criteria**: Zero occurrences of `"user-site-officer"` or `"user-reviewer"` in active code or database entries.

---

### Category 3: Organizational Hierarchy & Master Data

#### REQ-ORG-01: 4-Tier Enterprise Hierarchy (Group -> Subsidiary -> BU -> Project)
* **Source**: PS-08 Mandate, Master Prompt Part 7 & Part 56
* **Status**: `EXISTS BUT INCOMPLETE`
* **Current Implementation**: [backend/app/models/organization.py](file:///d:/MEIL_PS-8/backend/app/models/organization.py) defines `Group`, `Subsidiary`, `BusinessUnit`, `Project`. Seed data provides 6 subsidiaries, 6 BUs, and 5 projects.
* **Files Involved**: `backend/app/models/organization.py`, `backend/app/api/v1/organization.py`, `frontend/src/features/organization/MyProjectModule.jsx`
* **Gap**: Project creation does not strictly validate that `business_unit_id` belongs to `subsidiary_id`. UI still has static local `MASTER_PROJECTS` constant.
* **Required Fix**: Add database check constraint / validation dependency ensuring project's BU belongs to project's subsidiary; connect `MyProjectModule.jsx` to `/api/v1/organization/tree` and `/projects`.
* **Database Change**: Add foreign key consistency or validation trigger.
* **API Change**: `POST /projects` validates `bu.subsidiary_id == project.subsidiary_id`.
* **Frontend Change**: `MyProjectModule.jsx` queries backend API for dynamic project list.
* **Test Required**: Attempting to create project with mismatched BU and Subsidiary fails with HTTP 422.
* **Acceptance Criteria**: Strict hierarchical consistency enforced across all 4 tiers; UI displays live database hierarchy.

#### REQ-ORG-02: Configurable Organization vs Clearly Labeled Demo Mode
* **Source**: Master Prompt Part 56 & Part 57
* **Status**: `EXISTS BUT INCOMPLETE`
* **Current Implementation**: Database models have `is_demo` boolean flags on `Group`, `Subsidiary`, `Project`.
* **Files Involved**: `backend/app/models/organization.py`, `frontend/src/features/dashboard/DashboardHeader.jsx`
* **Gap**: UI does not display clear "DEMO / ILLUSTRATIVE DATA" badge when interacting with demo entities.
* **Required Fix**: Render prominent visual badge in header when active project/subsidiary has `is_demo = true`.
* **Database Change**: None (`is_demo` columns exist).
* **API Change**: Expose `is_demo` in all organization and project schemas.
* **Frontend Change**: Add Glassmorphic amber pill badge in header for demo entities.
* **Test Required**: Demo project returns `is_demo: true` and UI renders demo badge.
* **Acceptance Criteria**: Zero fictional data presented as legally certified MEIL records.

---

### Category 4: Reporting Periods & Lifecycle

#### REQ-PER-01: Dynamic Reporting Periods & Lock Immutability
* **Source**: Master Prompt Part 9, Part 67
* **Status**: `NEEDS REFACTOR`
* **Current Implementation**: UI hardcodes "September 2026" as default state in `App.jsx` and across dashboard cards. [backend/app/models/reporting.py](file:///d:/MEIL_PS-8/backend/app/models/reporting.py) has `ReportingPeriod` with `is_locked`.
* **Files Involved**: `frontend/src/App.jsx`, `backend/app/models/reporting.py`, `backend/app/api/v1/reporting_periods.py`
* **Gap**: Frontend relies on hardcoded string "September 2026"; lock enforcement is partial (does not block evidence modification or direct record updates).
* **Required Fix**: Fetch active periods from `GET /api/v1/reporting-periods`; enforce HTTP 423 Locked on any mutation when `period.is_locked = True`.
* **Database Change**: Add `locked_by`, `locked_at` columns to `reporting_periods`.
* **API Change**: `POST /api/v1/reporting-periods/{id}/lock` endpoint; check period lock status on all ESG record mutations.
* **Frontend Change**: Populate period selector dynamically; show lock icon and disable edit forms for locked periods.
* **Test Required**: Mutation on locked period returns HTTP 423.
* **Acceptance Criteria**: No hardcoded period strings; locked periods are strictly read-only across all modules.

---

### Category 5: Operational ESG Data Collection & Modules

#### REQ-ESG-01: Energy & Greenhouse Gas (GHG) Records (Scope 1, 2, 3)
* **Source**: BPUT PS08 Spec, SEBI Circular 2021/2023, Master Prompt Part 11 & Part 39
* **Status**: `EXISTS BUT INCOMPLETE`
* **Current Implementation**: `fuel_records` and `energy_records` tables exist in [backend/app/models/esg_records.py](file:///d:/MEIL_PS-8/backend/app/models/esg_records.py). Frontend has `DataEntryModule.jsx` with tabs for Grid, DG Fuel, Renewable.
* **Files Involved**: `backend/app/models/esg_records.py`, `backend/app/services/emission_engine.py`, `frontend/src/features/data-entry/DataEntryModule.jsx`
* **Gap**: `DataEntryModule.jsx` uses local state and `emissionCalculator.js` instead of executing backend calculation runs. Scope 1 direct fuel Combustion factors in backend use `DEFAULT_FACTORS` dictionary fallback instead of DB factor master.
* **Required Fix**: Wire `DataEntryModule` to `POST /projects/{id}/fuel` and `POST /projects/{id}/energy`; execute backend calculation engine; store factor ID and version on each record.
* **Database Change**: Ensure `fuel_records` and `energy_records` have `factor_id`, `factor_version`, `calculation_run_id`.
* **API Change**: Endpoints for fuel and energy records CRUD with automatic emission calculation.
* **Frontend Change**: Replace client-only calculation with backend preview API call; display factor version and source.
* **Test Required**: Inputting 10,000 L Diesel with CEA factor returns exactly 26.80 tCO2e.
* **Acceptance Criteria**: Calculations executed on backend, factor version preserved, record linked to submission.

#### REQ-ESG-02: Water Consumption, Recycling & ZLD Edge Case Fix
* **Source**: Master Prompt Part 11, Part 37; SEBI BRSR P6
* **Status**: `NEEDS REFACTOR`
* **Current Implementation**: Backend `consolidation_engine.py` line 55 sets `water_recycled_pct = round((recycled / withdrawal) * 100.0, 1) if withdrawal > 0 else 0.0`. However, earlier frontend logic in certain cards computed 100% when withdrawal was 0.
* **Files Involved**: `backend/app/services/consolidation_engine.py`, `frontend/src/utils/emissionCalculator.js`, `frontend/src/features/analytics/AnalyticsModule.jsx`
* **Gap**: Inconsistent handling of zero-withdrawal edge cases; lacks `zld_flag` (Zero Liquid Discharge) tracking.
* **Required Fix**: When withdrawal is 0, return `N/A` (or 0.0%) as defined in `docs/architecture-decisions.md`; persist `zld_flag` on `water_records`.
* **Database Change**: Add `zld_flag BOOLEAN DEFAULT FALSE` to `water_records`.
* **API Change**: Return structured `{ withdrawal_kl, recycled_kl, recycled_pct, is_na: bool }`.
* **Frontend Change**: Display "N/A (No Withdrawal)" when withdrawal is 0 rather than 100%.
* **Test Required**: Zero withdrawal test verifies recycling percentage is null or formatted as N/A.
* **Acceptance Criteria**: Zero-withdrawal does not produce mathematical absurdities; ZLD compliance explicitly recorded.

#### REQ-ESG-03: Waste Management & Circularity Index
* **Source**: Master Prompt Part 11; SEBI BRSR P6
* **Status**: `EXISTS BUT INCOMPLETE`
* **Current Implementation**: `waste_records` model exists in `esg_records.py`.
* **Files Involved**: `backend/app/models/esg_records.py`, `frontend/src/features/data-entry/DataEntryModule.jsx`
* **Gap**: `DataEntryModule` lacks a full dedicated waste entry form connected to backend.
* **Required Fix**: Add Waste tab in Data Entry module supporting Hazardous/Non-Hazardous categories, disposal routes (recycling, recovery, landfill), and calculate circularity diversion %.
* **Database Change**: Ensure `waste_records` includes `recovery_quantity`, `recycled_quantity`, `diverted_pct`.
* **API Change**: `GET/POST /projects/{id}/waste` with validation.
* **Frontend Change**: Full Waste form with automatic diverted % calculation.
* **Test Required**: Waste record validation and circularity percentage tests.
* **Acceptance Criteria**: Waste diversion % computed correctly: `(recycled + recovered) / total * 100`.

#### REQ-ESG-04: Safety & Weighted LTIFR Aggregation
* **Source**: Master Prompt Part 14, Part 41; SEBI BRSR P3 Essential Indicator 10
* **Status**: `NEEDS REFACTOR`
* **Current Implementation**: [backend/app/services/consolidation_engine.py](file:///d:/MEIL_PS-8/backend/app/services/consolidation_engine.py) computes LTIFR for BU and Group, but lines 89-98 reconstruct LTI from rounded LTIFR values.
* **Files Involved**: `backend/app/services/consolidation_engine.py`, `frontend/src/features/roles/ehs/screens/EHSSafetyScreen.jsx`
* **Gap**: Reconstructing integer counts from rounded ratios introduces rounding distortion; LTIFR must be aggregated directly from raw `sum(LTI)` and `sum(man_hours)`.
* **Required Fix**: Group and BU consolidation must query `func.sum(SafetyRecord.lost_time_injuries)` and `func.sum(SafetyRecord.safe_man_hours)` directly, then compute `LTIFR = (sum(LTI) * 1,000,000) / sum(man_hours)`. Never average LTIFR or reverse-calculate from floats.
* **Database Change**: None (raw integer columns exist).
* **API Change**: Consolidation endpoint returns raw aggregated LTI and man-hours alongside derived LTIFR.
* **Frontend Change**: Display total LTI, safe man-hours, and formula breakdown in EHS safety analytics.
* **Test Required**: Aggregating 2 projects with different man-hours produces exact weighted LTIFR.
* **Acceptance Criteria**: Mathematical precision verified; zero ratio averaging.

#### REQ-ESG-05: HR & Workforce Demographics (BRSR P3)
* **Source**: Master Prompt Part 12, Part 45; SEBI BRSR Section A & P3
* **Status**: `EXISTS BUT INCOMPLETE`
* **Current Implementation**: [backend/app/models/hr.py](file:///d:/MEIL_PS-8/backend/app/models/hr.py) and [backend/app/api/v1/hr.py](file:///d:/MEIL_PS-8/backend/app/api/v1/hr.py) exist. Frontend screens exist in `frontend/src/features/roles/hr/`.
* **Files Involved**: `backend/app/api/v1/hr.py`, `frontend/src/features/roles/hr/HRWorkforceScreen.jsx`, `frontend/src/features/roles/hr/HRWellbeingScreen.jsx`, `frontend/src/features/roles/hr/HRTrainingScreen.jsx`
* **Gap**: Frontend uses hybrid local state and mock fallbacks if backend is slow; not all screens use real user authentication token.
* **Required Fix**: Connect all HR screens to backend API; remove mock data fallbacks; support real creation of workforce, wellbeing, and training records.
* **Database Change**: Ensure `workforce_records`, `wellbeing_records`, `training_records` map to `project_id` and `reporting_period_id`.
* **API Change**: Protect all HR endpoints with `require_permission("hr:write")`.
* **Frontend Change**: Replace mock state with React query/useEffect lifecycle with error and retry handling.
* **Test Required**: HR officer creates workforce demographic record; verified in database.
* **Acceptance Criteria**: Complete statutory employee and worker breakdowns persisted and mapped to BRSR Principle 3.

#### REQ-ESG-06: Procurement, MSME & Value Chain (Scope 3)
* **Source**: Master Prompt Part 16, Part 47; SEBI BRSR Core Attribute 9
* **Status**: `EXISTS BUT INCOMPLETE`
* **Current Implementation**: Models exist in `backend/app/models/csr_projects.py` (which houses procurement models). Frontend screens in `frontend/src/features/roles/procurement/`.
* **Files Involved**: `backend/app/models/`, `frontend/src/features/roles/procurement/screens/*.jsx`
* **Gap**: Frontend currently loads `INITIAL_SUPPLIERS` and local state; procurement transactions are not linked to project ESG reporting periods.
* **Required Fix**: Create dedicated `backend/app/models/procurement.py` model file; connect `SupplierDirectoryScreen`, `SupplierAssessmentsScreen`, `ValueChainScopeScreen` to backend API.
* **Database Change**: Isolate procurement tables: `suppliers`, `supplier_assessments`, `procurement_records`.
* **API Change**: `GET/POST /api/v1/procurement/suppliers`, `POST /api/v1/procurement/transactions`.
* **Frontend Change**: Replace `INITIAL_SUPPLIERS` with live API fetch.
* **Test Required**: Create MSME supplier and log transaction; verify MSME spend % updates dynamically.
* **Acceptance Criteria**: Live supplier directory, real MSME tracking, 45-day payment statutory compliance recorded.

#### REQ-ESG-07: CSR & Community Impact (BRSR P8)
* **Source**: Master Prompt Part 17, Part 48; Section 135 Companies Act
* **Status**: `EXISTS BUT INCOMPLETE`
* **Current Implementation**: `csr_projects.py` models and schemas exist. Frontend screens in `frontend/src/features/roles/csr/`.
* **Files Involved**: `backend/app/models/csr_projects.py`, `frontend/src/features/roles/csr/screens/*.jsx`
* **Gap**: Frontend CSR action center, beneficiaries, and projects use local mock arrays.
* **Required Fix**: Connect `CSRProjectsScreen`, `CSRBeneficiariesScreen`, and `CSRCommunityScreen` to `/api/v1/csr/*` endpoints.
* **Database Change**: None (models defined).
* **API Change**: Expose CRUD for CSR projects, social impact metrics, and stakeholder engagements.
* **Frontend Change**: Bind CSR forms and tables to live backend endpoints.
* **Test Required**: CSR project creation and beneficiary impact tracking tests.
* **Acceptance Criteria**: Real CSR projects, budget vs expenditure tracking, and Section 135 disclosures.

#### REQ-ESG-08: Governance, Policies & Ethics (BRSR P1 & Section B)
* **Source**: Master Prompt Part 19, Part 49; SEBI BRSR Section B & P1
* **Status**: `EXISTS BUT INCOMPLETE`
* **Current Implementation**: Models exist in `csr_projects.py` (needs separation). Frontend screens in `frontend/src/features/roles/governance/`.
* **Files Involved**: `frontend/src/features/roles/governance/screens/*.jsx`, `backend/app/api/v1/`
* **Gap**: 16 governance screens implemented on frontend, but backend API routes for policy lifecycle, compliance obligations, and ethics cases are missing or incomplete.
* **Required Fix**: Create dedicated `backend/app/models/governance.py` and `backend/app/api/v1/governance.py` with full CRUD for policies, obligations, complaints, and ethics cases.
* **Database Change**: Tables `policies`, `compliance_obligations`, `complaints`, `ethics_records`.
* **API Change**: `/api/v1/governance/policies`, `/api/v1/governance/cases`.
* **Frontend Change**: Connect governance forms to backend API.
* **Test Required**: Policy versioning and whistle-blower complaint logging tests.
* **Acceptance Criteria**: 9 NGRBC policy matrix stored in database with document linkage and review history.

---

### Category 6: Factor Master & Normalization

#### REQ-FAC-01: Authoritative Emission Factor Master & Sources
* **Source**: Master Prompt Part 21, Part 38; ICAI Revised Edition 2024
* **Status**: `NEEDS REFACTOR`
* **Current Implementation**: [backend/app/models/factors.py](file:///d:/MEIL_PS-8/backend/app/models/factors.py) defines `EmissionFactor`. However, `backend/app/services/emission_engine.py` contains `DEFAULT_FACTORS` dictionary, and `frontend/src/utils/emissionCalculator.js` has duplicate hardcoded factors.
* **Files Involved**: `backend/app/models/factors.py`, `backend/app/services/emission_engine.py`, `frontend/src/utils/emissionCalculator.js`
* **Gap**: Factor duplication across frontend and backend; backend falls back to in-memory dictionary rather than enforcing DB lookup.
* **Required Fix**: Remove `DEFAULT_FACTORS` bypass in emission engine; enforce database lookup; seed authoritative CEA India Baseline v19 (0.716 kg CO2e/kWh), IPCC diesel/petrol/gas factors; expose factor lookup API.
* **Database Change**: Add `factor_sources` table; ensure `emission_factors` has `source_version`, `effective_date`, `expiry_date`.
* **API Change**: `GET /api/v1/emission-factors`, `POST /api/v1/emission-factors`.
* **Frontend Change**: `emissionCalculator.js` queries factors from backend or uses cached factors fetched on app load.
* **Test Required**: Calculation verifies factor ID and version are logged from database.
* **Acceptance Criteria**: One single authoritative factor master in database; zero hardcoded factors in UI business logic.

#### REQ-FAC-02: Unit Master & Dynamic Conversion Engine
* **Source**: Master Prompt Part 20
* **Status**: `MISSING`
* **Current Implementation**: Conversions (e.g., kWh to GJ, Litres to m3) are hardcoded with magic numbers like `3.6 / 1000.0` in `submissions.py` and `emissionCalculator.js`.
* **Files Involved**: `backend/app/models/factors.py`, `backend/app/services/conversion_engine.py` (to create)
* **Gap**: No `units` and `unit_conversions` database tables; conversions cannot be configured or audited.
* **Required Fix**: Implement `units` and `unit_conversions` tables and `ConversionEngine.convert(value, from_unit, to_unit)`.
* **Database Change**: Create `units` and `unit_conversions` tables.
* **API Change**: `GET /api/v1/units`, `GET /api/v1/unit-conversions`.
* **Frontend Change**: Unit selectors populated from unit master.
* **Test Required**: Converting 10,000 kWh to GJ returns 36.0 GJ via database conversion factor.
* **Acceptance Criteria**: All engineering conversions driven by database table; zero magic conversion multipliers.

---

### Category 7: Calculation Engine & Lineage

#### REQ-CAL-01: Deterministic Calculation Engine & Persisted Results
* **Source**: Master Prompt Part 22, Part 65
* **Status**: `MISSING`
* **Current Implementation**: Emission calculations happen inline in `submissions.py` and values are stored directly as columns on records without a dedicated calculation run or result audit entry.
* **Files Involved**: `backend/app/models/reporting.py`, `backend/app/services/calculation_engine.py` (to create)
* **Gap**: No `calculation_runs` and `calculation_results` tables; impossible to verify what factor version or formula was active when a historical metric was computed.
* **Required Fix**: Create `calculation_runs` and `calculation_results` tables; persist input value, input unit, normalized value, factor ID, factor version, formula code, and result for every metric.
* **Database Change**: Create `calculation_runs` and `calculation_results` tables.
* **API Change**: `GET /api/v1/calculations/{submission_id}/results`.
* **Frontend Change**: Display calculation lineage popover in Evidence and Submissions screens.
* **Test Required**: Deterministic calculation test: identical input + identical factor version = identical result.
* **Acceptance Criteria**: Every calculated metric has full lineage back to input, factor version, and formula code.

---

### Category 8: Validation Engine

#### REQ-VAL-01: Configurable Rule Registry & Validation Result Persistence
* **Source**: Master Prompt Part 23, Part 24, Part 85
* **Status**: `NEEDS REFACTOR`
* **Current Implementation**: [backend/app/services/validation_engine.py](file:///d:/MEIL_PS-8/backend/app/services/validation_engine.py) has hardcoded Python checks and returns `"rules_checked_count": 8`.
* **Files Involved**: `backend/app/services/validation_engine.py`, `backend/app/models/validation.py` (to create)
* **Gap**: Hardcoded rule count (8); validation results are not persisted to database; rules cannot be configured without code changes.
* **Required Fix**: Create `validation_rules`, `validation_runs`, and `validation_results` tables; evaluate active rules dynamically; return actual count of executed rules; classify as ERROR (blocking) vs WARNING/INFO.
* **Database Change**: Create `validation_rules`, `validation_runs`, `validation_results`.
* **API Change**: `POST /api/v1/submissions/{id}/validate` returns full rule execution breakdown.
* **Frontend Change**: Display validation results with Error/Warning pills and direct fix links.
* **Test Required**: Negative fuel triggers blocking ERROR; high anomaly triggers non-blocking WARNING.
* **Acceptance Criteria**: Rules are database-managed; actual count returned; blocking errors prevent submission.

---

### Category 9: Evidence Management & Storage

#### REQ-EVD-01: Byte-Level SHA256 Hash & Evidence Lifecycle
* **Source**: Master Prompt Part 25, Part 26; SEBI BRSR Core Reasonable Assurance
* **Status**: `NEEDS REFACTOR`
* **Current Implementation**: [frontend/src/features/evidence/EvidenceVault.jsx](file:///d:/MEIL_PS-8/frontend/src/features/evidence/EvidenceVault.jsx) and backend `evidence.py` compute dummy hashes or mock verification state.
* **Files Involved**: `backend/app/models/evidence.py`, `backend/app/api/v1/evidence.py`, `frontend/src/features/evidence/EvidenceVault.jsx`
* **Gap**: SHA-256 hash not computed from actual binary payload bytes; evidence not linked to Supabase storage; verification is not protected by role permissions.
* **Required Fix**: Compute `hashlib.sha256(file_bytes).hexdigest()`; integrate storage provider (Supabase Storage with signed URLs); require Auditor/Approver role for verification.
* **Database Change**: Tables `documents`, `document_versions`, `evidence_links`.
* **API Change**: `POST /api/v1/evidence/upload` (multipart/form-data), `POST /api/v1/evidence/{id}/verify`.
* **Frontend Change**: Connect `EvidenceVault.jsx` to upload API; display real computed SHA256; disable verify button for unauthorized roles.
* **Test Required**: Upload test verifying computed SHA-256 matches actual file byte hash.
* **Acceptance Criteria**: Authentic byte-level hash; document versioning supported; evidence verified only by authorized roles.

---

### Category 10: Workflow State Machine & Approvals

#### REQ-WFL-01: Multi-Tier State Machine (Draft -> Submitted -> BU Approved -> Subsidiary Approved -> Group Locked)
* **Source**: Master Prompt Part 27, Part 28; 4-Tier Governance Model
* **Status**: `NEEDS REFACTOR`
* **Current Implementation**: [backend/app/api/v1/submissions.py](file:///d:/MEIL_PS-8/backend/app/api/v1/submissions.py) allows arbitrary status patching via `PATCH /submissions/{id}/status`.
* **Files Involved**: `backend/app/api/v1/submissions.py`, `backend/app/services/workflow_engine.py` (to create), `frontend/src/features/submissions/SubmissionsManager.jsx`
* **Gap**: Anyone can PATCH any status; no validation that user has required role or scope for that specific transition; correction workflow lacks version snapshotting.
* **Required Fix**: Replace arbitrary status PATCH with discrete transition endpoints: `/submit`, `/review`, `/approve`, `/request-correction`, `/lock`. Enforce role, scope, and validation checks.
* **Database Change**: `submission_versions` table storing snapshot of approved state; `approval_actions` table.
* **API Change**: Discrete workflow endpoints with permission gating.
* **Frontend Change**: `SubmissionsManager.jsx` displays workflow stepper and renders only authorized action buttons.
* **Test Required**: Project officer cannot call approve; BU reviewer can only approve projects in their BU.
* **Acceptance Criteria**: Explicit state transitions enforced by backend; unauthorized transitions return HTTP 403/409; historical versions preserved.

---

### Category 11: Consolidation Engine & Mathematics

#### REQ-CON-01: True Hierarchical Roll-Up (Project -> BU -> Subsidiary -> Group)
* **Source**: Master Prompt Part 40, Part 41; PS-08 Multi-level Granularity
* **Status**: `NEEDS REFACTOR`
* **Current Implementation**: [backend/app/services/consolidation_engine.py](file:///d:/MEIL_PS-8/backend/app/services/consolidation_engine.py) `consolidate_group` directly queries `all_projects = db.query(Project).all()`, bypassing the Subsidiary and BU hierarchy, and includes unapproved drafts.
* **Files Involved**: `backend/app/services/consolidation_engine.py`, `backend/app/api/v1/reports.py`
* **Gap**: Group consolidation does not traverse hierarchy; includes draft unapproved records; does not provide audit drill-down.
* **Required Fix**: Consolidate strictly through tree: Group aggregates Subsidiaries; Subsidiary aggregates BUs; BU aggregates Projects; filter strictly by approved/locked submissions; provide drill-down lineage.
* **Database Change**: Ensure indexes on `(project_id, reporting_period_id, status)`.
* **API Change**: `GET /api/v1/consolidation/group?drilldown=true`.
* **Frontend Change**: Group KPI cards in `DataStreamDashboard` support click-through drill-down to Subsidiary -> BU -> Project.
* **Test Required**: Consolidation excludes DRAFT submissions and includes only APPROVED/LOCKED records.
* **Acceptance Criteria**: Strict hierarchy traversal; derived metrics match sum of verified children; full drill-down.

---

### Category 12: BRSR Framework Engine & Dynamic Readiness

#### REQ-BRS-01: Dynamic Readiness Calculation & Eliminating Hardcoded Percentages
* **Source**: Master Prompt Part 35, Part 36; SEBI BRSR Core
* **Status**: `NEEDS REFACTOR`
* **Current Implementation**: Multiple frontend components hardcode readiness percentages (e.g., `94.5%`, `94.4%`) and turnover `32450.0`.
* **Files Involved**: `frontend/src/features/dashboard/BRSRReadinessCard.jsx`, `backend/app/api/v1/reports.py`
* **Gap**: Readiness is static; turnover denominator is hardcoded rather than queried from organization master.
* **Required Fix**: Compute readiness dynamically: `controlled_indicators / total_applicable_indicators * 100`; turnover queried from `groups.turnover_inr_cr` for the active period.
* **Database Change**: Add `turnover_inr_cr` to `reporting_periods` or `groups`.
* **API Change**: `GET /api/v1/brsr/readiness` returns dynamically calculated percentage and status breakdown.
* **Frontend Change**: `BRSRReadinessCard.jsx` renders live percentage and applicable indicator count.
* **Test Required**: Adding or approving an indicator dynamically increments readiness score.
* **Acceptance Criteria**: Zero hardcoded readiness numbers or turnover constants.

#### REQ-BRS-02: Comprehensive BRSR Framework Representation (Sections A, B, C; P1-P9; Essential, Leadership, Core)
* **Source**: Master Prompt Part 30, Part 31, Part 32, Part 33, Part 34; SEBI Annexures I & II
* **Status**: `EXISTS BUT INCOMPLETE`
* **Current Implementation**: [backend/app/models/brsr.py](file:///d:/MEIL_PS-8/backend/app/models/brsr.py) defines framework and indicator models. Backend seeds prototype indicators (`P6_E1`, `P6_E2`, `P6_E4`, `P3_E4`).
* **Files Involved**: `backend/app/models/brsr.py`, `backend/app/api/v1/reports.py`, `frontend/src/features/reports/ReportsModule.jsx`
* **Gap**: Only 4 sample indicators mapped; full SEBI BRSR structure (68 Essential, 39 Leadership, 9 BRSR Core attributes across P1-P9) not yet fully seeded in framework registry.
* **Required Fix**: Seed complete framework structure for SEBI BRSR (Circular 2021) and BRSR Core (Circular 2023/2025) using exact official wording from `BPUT PS-8/` PDFs; implement mapping rules linking indicators to source tables.
* **Database Change**: Seed `brsr_sections`, `brsr_principles`, `brsr_questions`, `brsr_indicators`, `brsr_mappings`.
* **API Change**: `GET /api/v1/brsr/{framework}/indicators`, `GET /api/v1/brsr/{framework}/answers`.
* **Frontend Change**: `ReportsModule.jsx` renders full Section A, B, and C with indicator status.
* **Test Required**: BRSR report generation test covers all 9 principles and Core attributes.
* **Acceptance Criteria**: Exact official SEBI indicator codes, questions, and units represented without fabrication.

---

### Category 13: Audit Trail & Immutability

#### REQ-AUD-01: Tamper-Evident Hash Chain Audit Log
* **Source**: Master Prompt Part 29; ICAI Revised Edition 2024
* **Status**: `EXISTS BUT INCOMPLETE`
* **Current Implementation**: [backend/app/models/audit.py](file:///d:/MEIL_PS-8/backend/app/models/audit.py) and [backend/app/services/audit_service.py](file:///d:/MEIL_PS-8/backend/app/services/audit_service.py) exist, but lack cryptographic hash chaining between consecutive events.
* **Files Involved**: `backend/app/models/audit.py`, `backend/app/services/audit_service.py`, `frontend/src/features/audit/AuditTraceabilityModule.jsx`
* **Gap**: Audit logs record actions, but do not compute `event_hash = SHA256(payload + previous_hash)`; update/delete operations are not strictly blocked at DB level.
* **Required Fix**: Implement cryptographic hash chaining on `audit_logs`; log IP address, actor ID, actor role, old state, and new state; expose trace endpoint.
* **Database Change**: Add `previous_hash TEXT`, `event_hash TEXT`, `ip_address TEXT` to `audit_logs`.
* **API Change**: `GET /api/v1/audit/logs`, `GET /api/v1/audit/verify-chain`.
* **Frontend Change**: `AuditTraceabilityModule.jsx` displays cryptographic verification badge ("Hash Chain Intact").
* **Test Required**: Audit log hash chain verification test; tampering with any record breaks chain verification.
* **Acceptance Criteria**: Cryptographically verifiable tamper-evident audit trail for all material operations.

---

### Category 14: Frontend API Layer & Error Handling

#### REQ-FNT-01: Modular Frontend Service Layer & Robust State Management
* **Source**: Master Prompt Part 6, Part 82
* **Status**: `NEEDS REFACTOR`
* **Current Implementation**: Single monolithic [frontend/src/services/api.js](file:///d:/MEIL_PS-8/frontend/src/services/api.js) (870+ lines) containing inline mock fallbacks.
* **Files Involved**: `frontend/src/services/`
* **Gap**: Single large file; mock fallbacks obscure real network errors; lack of modular domain services (`energyService`, `evidenceService`, `workflowService`).
* **Required Fix**: Refactor `api.js` into clean domain services (`authService.js`, `organizationService.js`, `esgDataService.js`, `evidenceService.js`, `workflowService.js`, `brsrService.js`); eliminate mock fallbacks in production; provide standard `{ data, loading, error, retry }` states.
* **Database Change**: None.
* **API Change**: Standardized JSON error response format.
* **Frontend Change**: Dedicated service files imported into feature modules.
* **Test Required**: Network error renders user-friendly error card with retry button.
* **Acceptance Criteria**: Zero silent fallback to mock data on API errors; clear modular separation.

---

### Category 15: Reporting, Exports & End-to-End Traceability

#### REQ-REP-01: Controlled Report Generation & Excel/PDF Export
* **Source**: Master Prompt Part 52, Part 73, Part 86
* **Status**: `EXISTS BUT INCOMPLETE`
* **Current Implementation**: [backend/app/api/v1/reports.py](file:///d:/MEIL_PS-8/backend/app/api/v1/reports.py) provides basic JSON reports; frontend triggers client-side CSV downloads.
* **Files Involved**: `backend/app/api/v1/reports.py`, `frontend/src/features/reports/ReportsModule.jsx`
* **Gap**: No backend-certified PDF or structured Excel exports; export metadata does not link to generation timestamp or audit hash.
* **Required Fix**: Implement backend export engine producing structured BRSR Excel sheets (matching official SEBI format) and Audit Package PDFs with embedded QR code / verification hash.
* **Database Change**: None.
* **API Change**: `GET /api/v1/reports/export/excel`, `GET /api/v1/reports/export/pdf`.
* **Frontend Change**: Download buttons trigger backend export streams.
* **Test Required**: Generated Excel matches official SEBI BRSR reporting columns.
* **Acceptance Criteria**: Controlled exports generated from approved/locked data only with audit metadata.
