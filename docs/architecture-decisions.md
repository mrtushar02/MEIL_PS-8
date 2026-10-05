# MEIL ESG / BRSR Reporting Platform — Architecture Decision Records (ADRs)

**Document Version**: 1.0.0  
**Phase**: Phase 0 — Full Repository Audit & Architecture Baseline  
**Authority**: BPUT PS-08 Specification, SEBI BRSR Circulars (2021, 2023, 2025), ICAI Revised Edition 2024, Master Implementation Prompt  

---

## Index of Architectural Decisions

* **ADR-001**: Supabase PostgreSQL as Primary Source of Truth vs Isolated SQLite Local Mode
* **ADR-002**: Migration-Controlled Database Lifecycle via Alembic (Elimination of `create_all()`)
* **ADR-003**: Cryptographic JWT Authentication with Strict Organization-Scoped RBAC
* **ADR-004**: Strict 4-Tier Hierarchical Aggregation & Roll-up Rules
* **ADR-005**: Resolution of Water Recycling Zero-Withdrawal Mathematical Edge Case
* **ADR-006**: Authoritative Emission Factor Master & Unit Normalization Pipeline
* **ADR-007**: Byte-Level Binary SHA-256 Hashing for Documentary Evidence Assurance
* **ADR-008**: Raw Weighted Aggregation for LTIFR and Statutory Ratios
* **ADR-009**: Configurable Regulatory Applicability & Elimination of Fictional Corporate Claims
* **ADR-010**: Dynamic BRSR Readiness Calculation Engine
* **ADR-011**: Tamper-Evident Hash-Chained Audit Trail
* **ADR-012**: Elimination of Silent Mock Fallbacks in Frontend Data Services

---

### ADR-001: Supabase PostgreSQL as Primary Source of Truth vs Isolated SQLite Local Mode

#### Status
**ACCEPTED & ENFORCED**

#### Context
The prototype codebase in [backend/app/core/config.py](file:///d:/MEIL_PS-8/backend/app/core/config.py) defaulted to a local SQLite database (`sqlite:///./meil_esg.db`). While convenient for zero-dependency local runs, SQLite lacks concurrent write isolation under high enterprise load, lacks native `JSONB`, `INET`, and `TIMESTAMPTZ` optimizations, and does not align with the production architecture mandated in the BPUT PS08 specifications (which requires Supabase / PostgreSQL).

#### Decision
1. **Primary Production Engine**: PostgreSQL (specifically Supabase PostgreSQL) is the sole permanent source of truth for all enterprise data, transactions, evidence metadata, and audit logs.
2. **Local Development Profile**: SQLite is permitted **only** as an optional offline development mode when `APP_ENV=development` and `DATABASE_URL` explicitly starts with `sqlite:`.
3. **Redis Role**: Redis is utilized strictly for caching report outputs, session tokens, and queueing asynchronous export tasks. Redis **must never** be used as a primary data store.
4. **Data Types**: All schema definitions will use PostgreSQL-native types (`UUID`, `TIMESTAMPTZ`, `NUMERIC(14, 4)`, `JSONB`, `INET`) with compatible fallbacks in SQLAlchemy.

#### Consequences
* Consistent transaction semantics across local and cloud environments.
* Eliminates SQLite file locking conflicts during multi-role concurrent submissions.
* Enables robust indexing and JSON querying on metadata fields.

---

### ADR-002: Migration-Controlled Database Lifecycle via Alembic

#### Status
**ACCEPTED & ENFORCED**

#### Context
[backend/app/main.py](file:///d:/MEIL_PS-8/backend/app/main.py) executed `Base.metadata.create_all(bind=engine)` at application boot. In an enterprise system, `create_all()` silently fails to alter existing columns, does not support rollbacks, and risks race conditions in multi-worker environments.

#### Decision
1. `Base.metadata.create_all()` is **strictly banned** from production startup.
2. All database schema evolution must be managed via versioned **Alembic migrations** in `backend/alembic/versions/`.
3. CI/CD and deployment procedures will execute `alembic upgrade head`.
4. Startup scripts will verify that the database schema revision matches the current migration head, aborting boot if unapplied migrations exist.

#### Consequences
* Every schema change is auditable, testable, and reversible.
* Prevents silent schema drift across development, staging, and production.

---

### ADR-003: Cryptographic JWT Authentication with Strict Organization-Scoped RBAC

#### Status
**ACCEPTED & ENFORCED**

#### Context
The prototype application permitted unauthenticated browsing by storing a default demo session in `localStorage` and allowing role switching without credentials. The `/auth/me` endpoint returned the first user in the database without validating tokens.

#### Decision
1. **Cryptographic Identity**: All protected API endpoints must require an `Authorization: Bearer <JWT>` header signed with the backend `SECRET_KEY` using HMAC-SHA256 (`HS256`).
2. **Token Subject**: Identity is established exclusively from the JWT subject claim (`sub`), which resolves to the user's UUID. Arbitrary `user_id` query parameters are strictly ignored.
3. **Backend Scope Verification**: Every endpoint must evaluate `get_current_user`, `require_permission`, and verify organization scope (`GROUP`, `SUBSIDIARY`, `BUSINESS_UNIT`, `PROJECT`).
4. **Actor Attribution**: Submission and audit services must extract actor details (`actor_id`, `actor_name`, `actor_role`) directly from the verified token context. Hardcoded actor literals (`"user-site-officer"`, `"user-reviewer"`) are purged.

#### Consequences
* Complete protection against unauthorized access or cross-subsidiary data leakage.
* Fully auditable attribution for every state change.

---

### ADR-004: Strict 4-Tier Hierarchical Aggregation & Roll-up Rules

#### Status
**ACCEPTED & ENFORCED**

#### Context
The PS-08 mandate requires 4-tier granularity: Group HQ ➔ Subsidiaries ➔ Business Units ➔ Project Sites. The prototype's `ConsolidationEngine.consolidate_group` queried all projects directly via `db.query(Project).all()`, skipping the intermediate subsidiary and business unit hierarchy, and included unapproved draft records.

#### Decision
1. **Hierarchical Traversal**:
   $$\text{Group} = \sum \text{Subsidiaries}, \quad \text{Subsidiary} = \sum \text{Business Units}, \quad \text{Business Unit} = \sum \text{Projects}$$
2. **Approval Gate**: Only records from submissions with status `BU_APPROVED`, `SUBSIDIARY_APPROVED`, or `LOCKED` may enter official consolidated reports. Draft and pending submissions are flagged as "Uncontrolled / In-Progress".
3. **Parentage Integrity**: A project's assigned Business Unit must strictly belong to the project's assigned Subsidiary (`project.bu.subsidiary_id == project.subsidiary_id`).
4. **Drill-down Lineage**: Every consolidated total must provide an immutable trace path back to its constituent projects and source records.

#### Consequences
* Guarantees mathematical and organizational consistency across all reporting levels.
* Eliminates distorted metrics caused by unverified site drafts.

---

### ADR-005: Resolution of Water Recycling Zero-Withdrawal Mathematical Edge Case

#### Status
**ACCEPTED & ENFORCED**

#### Context
In instances where an operational site has zero water withdrawal ($W = 0$) during a reporting period (e.g., shutdown, rain harvesting reliance, or non-operational site), calculating recycled percentage as $\frac{R}{W} \times 100$ leads to division by zero ($\frac{0}{0}$). Certain earlier client scripts resolved this as `100%`, which is mathematically false and regulatory misrepresentation.

#### Decision
1. **Mathematical Definition**:
   $$\text{Water Recycled \%} = \begin{cases} \text{round}\left(\frac{\text{Recycled KL}}{\text{Withdrawal KL}} \times 100, 1\right), & \text{if } \text{Withdrawal KL} > 0 \\ \text{null / N/A}, & \text{if } \text{Withdrawal KL} = 0 \text{ and } \text{Recycled KL} = 0 \\ 100.0\%, & \text{if } \text{Withdrawal KL} = 0 \text{ and } \text{Recycled KL} > 0 \text{ (Closed Loop / ZLD)} \end{cases}$$
2. **API Contract**: The API will return `water_recycled_pct` as `null` with a boolean flag `is_zero_withdrawal: true` when no withdrawal occurred.
3. **UI Display**: The frontend will display `"N/A (Zero Withdrawal)"` rather than a misleading `100%`.
4. **Zero Liquid Discharge (ZLD)**: Sites operating under certified ZLD protocols must explicitly register the `zld_flag: true` along with supporting SPCB clearance evidence.

#### Consequences
* Eliminates regulatory audit red-flags during third-party assurance.

---

### ADR-006: Authoritative Emission Factor Master & Unit Normalization Pipeline

#### Status
**ACCEPTED & ENFORCED**

#### Context
Emission factors were previously hardcoded in three different locations: `frontend/src/utils/emissionCalculator.js`, `backend/app/services/emission_engine.py` (`DEFAULT_FACTORS`), and seed scripts. Calculations often bypassed database lookups.

#### Decision
1. **Single Source of Truth**: The `emission_factors` database table is the **only** authoritative source for emission factors.
2. **Factor Metadata**: Every factor record must preserve:
   * `source` (e.g., "CEA India Grid CO2 Baseline Database v19")
   * `source_version` (e.g., "v19-2024")
   * `effective_date` and `expiry_date`
   * `geography` (e.g., "IN-NEW_GRID", "GLOBAL")
   * `factor_value` and `factor_unit`
3. **Execution Flow**:
   $$\text{Source Activity} \xrightarrow{\text{Unit Normalization}} \text{Standard Unit} \xrightarrow{\text{Factor Lookup (DB)}} \text{Formula Execution} \xrightarrow{} \text{Calculation Result}$$
4. **Result Immutability**: Every calculation result stores the exact `factor_id` and `factor_version` utilized at execution time. Changing a factor in the master table does not retroactively mutate past locked calculation runs.

#### Consequences
* Fully reproducible calculations meeting GHG Protocol Corporate Standard requirements.
* Zero factor discrepancy between frontend previews and backend certified reports.

---

### ADR-007: Byte-Level Binary SHA-256 Hashing for Documentary Evidence Assurance

#### Status
**ACCEPTED & ENFORCED**

#### Context
Regulatory assurance under SEBI BRSR Core Circulars (2023/2025) and ICAI Guidance requires proof that uploaded supporting documents (utility bills, weighbridge slips, fuel challans) have not been altered post-submission. Calculating hashes from filenames or metadata is legally invalid.

#### Decision
1. **Byte Hash Calculation**: The system must compute SHA-256 directly from the incoming raw binary stream:
   $$\text{sha256\_hash} = \text{hashlib.sha256}(\text{file\_bytes}).\text{hexdigest}()$$
2. **Storage Architecture**: Uploaded files are streamed to Supabase Storage in an isolated, private bucket (`esg-evidence-vault`). Access is mediated via short-lived signed URLs.
3. **Document Versioning**: Replacing a document generates a new version record (`document_versions`) with its own unique SHA-256 hash. Previous versions remain immutable.
4. **Verification Boundary**: Only users with the `AUDITOR` or `APPROVER` role may mark an evidence record as `VERIFIED`.

#### Consequences
* Tamper-evident evidence vault meeting statutory pre-assurance readiness.

---

### ADR-008: Raw Weighted Aggregation for LTIFR and Statutory Ratios

#### Status
**ACCEPTED & ENFORCED**

#### Context
Averaging ratios across projects (e.g., calculating average LTIFR across 10 sites) produces mathematically invalid results because it ignores the difference in exposure hours (e.g., a site with 10,000 man-hours weighted equally with one with 1,000,000 man-hours).

#### Decision
1. **LTIFR Formulation**:
   $$\text{LTIFR}_{\text{Consolidated}} = \frac{\sum_{i=1}^{n} \text{Lost Time Injuries}_i \times 1,000,000}{\sum_{i=1}^{n} \text{Safe Work Man-Hours}_i}$$
2. **Raw Roll-up Rule**: Consolidated endpoints must sum the raw numerators ($\sum \text{LTI}$) and raw denominators ($\sum \text{Man-Hours}$) before dividing.
3. **Percentage Rule**: Gender diversity, MSME spend %, and water recycling % must similarly be derived from summed numerators and denominators at the consolidated level.

#### Consequences
* Accurate mathematical representation adhering to OSHA and SEBI statutory reporting principles.

---

### ADR-009: Configurable Regulatory Applicability & Elimination of Fictional Corporate Claims

#### Status
**ACCEPTED & ENFORCED**

#### Context
Supplied video transcripts and corporate documents indicate MEIL is pursuing BRSR voluntarily as an unlisted holding infrastructure conglomerate, while its listed subsidiary Olectra Greentech is legally mandated. Claiming that MEIL Group is legally forced to file BRSR is factually inaccurate.

#### Decision
1. **Platform Terminology**: Use precise, professional nomenclature:
   * `"MEIL ESG & BRSR Reporting Platform"`
   * `"Voluntary Corporate Sustainability Disclosure & BRSR-Ready Framework"`
   * Standalone listed mandate explicitly noted for Olectra Greentech.
2. **Configurable Applicability**: The framework engine must treat BRSR applicability as configuration-driven (`MANDATORY_LISTED`, `VOLUNTARY_CONGLOMERATE`, `CORE_ASSURANCE`).
3. **Data Authenticity**: All seed and mock corporate figures must be clearly tagged with `is_demo: true` and displayed with ambient warning pills in the UI.

#### Consequences
* Total compliance with the No-Hallucination Policy (Part 88).

---

### ADR-010: Dynamic BRSR Readiness Calculation Engine

#### Status
**ACCEPTED & ENFORCED**

#### Context
The prototype application displayed static hardcoded readiness values (e.g., `94.5%`, `94.4%`) across several dashboard cards and reports.

#### Decision
1. **Dynamic Metric Formulation**:
   $$\text{Readiness \%} = \frac{\text{Count of Approved \& Evidence-Backed Indicators}}{\text{Total Applicable Framework Indicators}} \times 100$$
2. **Scoring Breakdown**:
   * **Data Collected**: Record exists in database for active period.
   * **Evidence Verified**: Supporting document uploaded and verified.
   * **Workflow Controlled**: Submission has passed at least BU approval.
3. **Zero Hardcoded Figures**: The frontend must bind all readiness gauges, donut cards, and report headers to `GET /api/v1/brsr/readiness`.

#### Consequences
* Transparent, auditable compliance readiness that moves dynamically as site officers log data.

---

### ADR-011: Tamper-Evident Hash-Chained Audit Trail

#### Status
**ACCEPTED & ENFORCED**

#### Context
ICAI sustainability assurance guidelines require audit trails to be immutable and tamper-evident. Standard database audit tables are vulnerable to administrative tampering or silent edits.

#### Decision
1. **Cryptographic Hash Chain**: Every record in `audit_logs` must compute:
   $$\text{event\_hash}_n = \text{SHA256}\left(\text{canonical\_payload}_n + \text{event\_hash}_{n-1}\right)$$
2. **Canonical Payload**: Comprises `timestamp`, `actor_id`, `actor_role`, `action`, `entity_type`, `entity_id`, `old_state`, `new_state`.
3. **Database Immutability**: `UPDATE` and `DELETE` privileges on `audit_logs` are revoked for the application user.
4. **Verification Endpoint**: An API endpoint `GET /api/v1/audit/verify-chain` recalculates the hash chain from genesis, reporting any broken links.

#### Consequences
* Third-party assurance auditors can mathematically verify that no log entries were injected, deleted, or modified.

---

### ADR-012: Elimination of Silent Mock Fallbacks in Frontend Data Services

#### Status
**ACCEPTED & ENFORCED**

#### Context
`frontend/src/services/api.js` previously contained extensive catch blocks that returned mock success objects whenever the backend returned an error or was unavailable. This obscured real backend failures and created a false illusion of functionality.

#### Decision
1. **Explicit State Model**: All frontend service calls must strictly propagate HTTP errors to UI components.
2. **Standard State Lifecycle**: Components must render:
   * **Loading**: Liquid Glass animated skeleton.
   * **Success**: Live database records.
   * **Empty**: Clean informational empty-state card with "Add Record" action.
   * **Error**: Prominent error banner with retry button.
3. **No Fake Success**: If an API call fails, the UI must never fabricate a success toast or display fake data.

#### Consequences
* High engineering integrity; immediate visibility into real network or permission issues.
