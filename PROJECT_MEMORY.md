# PROJECT MEMORY: BPUT HACKATHON PROBLEM STATEMENT 08
## Online Portal for BRSR Reporting of Corporate ESG Reports (MEIL Group)

---

## 1. Hackathon Problem Statement Overview
* **Hackathon**: BPUT Hackathon
* **Problem Statement ID**: PS-08
* **Title**: Development of an online portal for BRSR reporting of Corporate ESG Reports.
* **Deliverable**: ESG Reporting Software (Web-based Software / Enterprise Portal).
* **Target Enterprise**: **Megha Engineering and Infrastructures Limited (MEIL)**.
* **Scale**: Large infrastructure conglomerate with several subsidiaries and **over 250 projects across India and abroad**.
* **Mandate**: Build web-based software to help MEIL Group of Companies handle its ESG reporting in a comprehensive and detailed manner meeting published **SEBI guidelines**, with multi-level granularity starting from **Group $\rightarrow$ Subsidiary Entities $\rightarrow$ Business Units $\rightarrow$ Project Sites**.

---

## 2. MEIL Group Corporate Architecture & Hierarchy

### 2.1 Corporate Profile
* **Holding / Group Company**: Megha Engineering & Infrastructures Limited (MEIL Group)
* **CIN**: U45202TG2006PLC050271 | Founded: 1989 | HQ: Hyderabad, Telangana
* **Turnover**: ~₹32,450 Crores | Net Worth: ~₹19,800 Crores
* **Workforce**: 42,800+ personnel (14,200 permanent + 28,600 EPC contractual site workforce)
* **Active Projects**: 258 project sites across 19 Indian states and 21 countries.

### 2.2 Subsidiaries
1. **Olectra Greentech Limited** (CIN: L34100TG2000PLC035451) — Listed on NSE & BSE. Pioneer electric bus manufacturer and composite insulator producer. Standalone & Consolidated BRSR mandatory.
2. **Megha Gas (Megha City Gas Distribution Pvt Ltd)** — Unlisted Material Subsidiary operating 16 Geographical Areas (GAs) distributing CNG & PNG.
3. **Drillmec S.p.A / Drillmec India** — Global oil & gas automated drilling and workover rig manufacturer (Italy / Kakinada).
4. **ICOMM Tele Limited** — Strategic defense electronics, missile subsystems, UAVs, and telecom infrastructure.
5. **Evey Trans Private Limited** — India's largest electric public bus fleet operator (operating for BEST Mumbai, PMPML Pune, TSRTC, etc.).
6. **MEIL Core Infrastructure & Engineering Division** — EPC execution for mega lift irrigation schemes, Himalayan tunnels, refineries, and power transmission.

### 2.3 Business Units (BUs)
1. **Irrigation & Water Resources Management** (Kaleshwaram Lift Irrigation, Polavaram, Uddanam drinking water).
2. **Highways, Bridges & Himalayan Tunnels** (Zojila Tunnel, Samruddhi Mahamarg Expressway).
3. **Hydrocarbons, Refineries & Petrochemicals** (Kuwait Al-Zour storage terminals, refinery expansion).
4. **Power Generation & Renewables** (Tuticorin-Nagai thermal power, Anantapur solar thermal).
5. **City Gas Distribution (CGD)** (Megha Gas pipeline network).
6. **Electric Mobility & Clean Transit** (Olectra EV gigafactory).

### 2.4 Representative Project Sites (~250+ Total)
* **Gayatri Pumphouse (Kaleshwaram Project)**: World's largest underground lift irrigation pump station.
* **Zojila Road Tunnel (14.15 km)**: Strategic high-altitude sub-zero rock tunnelling EPC connecting Sonamarg and Ladakh.
* **Uddanam Drinking Water Project**: Water pipeline network addressing chronic kidney disease in rural Andhra Pradesh.
* **Al-Zour 66-Storage Tanks Complex (Kuwait)**: International refinery hydrocarbon terminal.
* **Samruddhi Mahamarg Expressway Package 14**: Expressway and viaduct engineering in Maharashtra.
* **Olectra Dindigul EV Gigafactory**: Clean electric bus assembly and battery integration campus.

---

## 3. Regulatory Framework: SEBI BRSR & BRSR Core

### 3.1 Statutory Documents Mapped
1. **SEBI Circular SEBI/HO/CFD/CMD-2/P/CIR/2021/562 (May 10, 2021)**:
   * Replaced BRR with BRSR (Business Responsibility and Sustainability Report).
   * **Annexure I**: Official Reporting Format (Sections A, B, and C).
   * **Annexure II**: Guidance Note for BRSR format (metrics definitions and interoperability with GRI, SASB, TCFD).
2. **SEBI Circular SEBI/HO/CFD/CFD-SEC-2/P/CIR/2023/122 (July 12, 2023)**:
   * Introduced **BRSR Core**: Subset of verifiable Key Performance Indicators (KPIs) requiring reasonable assurance.
   * Mandated value chain ESG disclosures for top listed entities.
3. **SEBI Circular SEBI/HO/CFD/CFD-PoD-1/P/CIR/2025/42 (March 28, 2025)**:
   * Ease of doing business amendments: Option for Assessment or Assurance for BRSR Core and value chain disclosures; voluntary green credits.
4. **ICAI Revised Edition 2024 Background Material on BRSR**:
   * Detailed accounting, emission factor verification, and internal control methodology.

### 3.2 Structure of SEBI BRSR Format
* **Section A: General Disclosures**
  * I. Details of Listed Entity (CIN, turnover, employees, contacts)
  * II. Products & Services (NIC codes, top contributors)
  * III. Operations (National & international locations, 250+ project sites)
  * IV. Employees & Workers (Gender diversity, differently-abled, turnover, median remuneration)
  * V. Holding, Subsidiary & Associate Companies (Participation in BRSR)
  * VI. CSR Details (Section 135 compliance, ₹64.8 Cr spent)
  * VII. Transparency & Disclosures (Grievance redressal mechanisms for stakeholders)
* **Section B: Management and Process Disclosures**
  * Policy governance across all 9 NGRBC principles.
  * Board Sustainability Committee oversight and executive accountability.
* **Section C: Principle-wise Performance Disclosures (9 NGRBC Principles)**
  * Principle 1: Ethics, Transparency & Anti-Corruption
  * Principle 2: Safe & Sustainable Goods & Services (LCA, EPR, Recycled inputs)
  * Principle 3: Employee Well-being & Safety (LTIFR, Zero Fatalities, POSH)
  * Principle 4: Stakeholder Engagement & Vulnerable Groups
  * Principle 5: Human Rights Protection & Minimum Wages
  * Principle 6: Environmental Protection & Climate Action (Scope 1, 2, 3 GHG, Water, Waste, Energy)
  * Principle 7: Responsible Public Policy Advocacy
  * Principle 8: Inclusive Growth & CSR Impact Assessments
  * Principle 9: Consumer Value & Data Privacy
  * Both **Essential Indicators** (Mandatory) and **Leadership Indicators** (Aspirational).

### 3.3 The 9 SEBI BRSR Core Mandated Attributes (Assurance Ready)
1. GreenHouse Gas (GHG) Footprint & Turnover Intensity (Scope 1, Scope 2, intensity per ₹ Cr)
2. Water Footprint & Zero Liquid Discharge (ZLD) Compliance
3. Energy Footprint & Renewable Electricity Share %
4. Waste Management & Circularity Index (% diverted from landfill)
5. Employee Well-being & Safety (LTIFR & Zero Fatalities)
6. Gender Diversity & Differently-Abled Inclusion
7. Median Wage & Gender Pay Parity Ratio
8. Job Creation in Small Towns (Tier 2/3 and rural aspirational districts)
9. Open-ness of Business & Payments to MSMEs (within statutory 45 days)
* Plus **Value Chain Disclosures** for partners contributing $>2\%$ of purchases or revenue.

---

## 4. Technical Architecture & Formulas

### 4.1 GHG Protocol & Emission Calculation Engine
* **Scope 1**: Diesel ($2.68\text{ kg CO}_2\text{e/L}$), Petrol ($2.31\text{ kg CO}_2\text{e/L}$), Natural Gas ($2.03\text{ kg CO}_2\text{e/m}^3$)
* **Scope 2**: Grid Electricity using Central Electricity Authority (CEA) CO2 Baseline Database v19 ($0.716\text{ kg CO}_2\text{e/kWh}$)
* **Scope 3**: Upstream freight and material embodied carbon in structural steel ($1,850\text{ kg CO}_2\text{e/T}$) and cement ($820\text{ kg CO}_2\text{e/T}$)
* **Intensity Metrics**: Total GHG (tCO2e) / Turnover (INR Crores)
* **Water Circularity**: $\text{Recycled KL} / \text{Total Withdrawal KL} \times 100$
* **Safety LTIFR**: $(\text{Lost Time Injuries} \times 1,000,000) / \text{Total Man-Hours Worked}$

### 4.2 Governance: 5-Stage Maker-Checker Workflow
1. **Field Drafter**: Site ESG Officer logs monthly fuel, electricity, water, and safety hours.
2. **BU Reviewer**: Business Unit Coordinator reconciles across sites in vertical.
3. **Subsidiary Head**: Subsidiary ESG Officer verifies standalone entity disclosures.
4. **Group Consolidation**: Group Chief Sustainability Officer (CSO) signs off enterprise report.
5. **Third-Party Assurer**: Bureau Veritas / External Auditor issues Reasonable Assurance Statement.

---

## 5. Peer Benchmark (MEIL vs. Larsen & Toubro)
* Direct head-to-head comparison derived from official L&T BRSR Report FY24:
  * MEIL leads in **Water Circularity (87.4% vs 84.1%)**
  * MEIL leads in **Safety LTIFR (0.22 vs 0.28 per million hours)**
  * MEIL close in **Carbon Intensity (18.42 vs 17.85 tCO2e/Cr)**
  * MEIL leads in **MSME Payment Timeliness (96.4% vs 95.2%)**

---

## 6. Master Design System (`DESIGNS.md`) — Single Source of Truth
* **Status**: LOCKED MASTER DESIGN SYSTEM. Always read [`DESIGNS.md`](file:///d:/MEIL_PS-8/DESIGNS.md) first before planning or executing ANY UI/UX modification.
* **Golden Rule**: "DO NOT CHANGE THE SHELL. CHANGE THE FUNCTIONALITY INSIDE THE SHELL."
* **Style**: iOS Liquid Glass, white-dominant (85-92%), faint sky-blue atmosphere (8-15%), restrained interaction blue (`#2563EB`), Lucide React icons, Inter/Plus Jakarta Sans typography, real functional workflows. Never redesign or replace the approved visual shell.
* **Checklist**: Before completing any UI change, execute the 24-point acceptance checklist defined in Section 69 of `DESIGNS.md`.

