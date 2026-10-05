# MEIL ESG / BRSR Enterprise Design System (DESIGN.md)
*Master Visual & Interaction Architecture — iOS Liquid Glass & Enterprise SaaS*

---

## 1. Core Visual Philosophy

The MEIL ESG Reporting Portal is designed as a **mission-critical enterprise operating system** for Megha Engineering & Infrastructures Limited (MEIL Group). It balances:
- **Executive Trust & Clarity:** Clean, unadorned typography, authoritative data density, and clear statutory compliance hierarchy.
- **Apple-Inspired Liquid Glass:** Translucent, multi-depth frosted surfaces floating over an airy, luminous atmosphere with subtle refractive borders and inner highlights.
- **Controlled Kinetic Restraint:** Every interaction feels weighted, physical, and frictionless. No gratuitous gaming animations, dark modes, or cyberpunk neon glows.

---

## 2. Color Palette & Atmospheric Tokens

The visual foundation consists of **80–90% luminous white / off-white** balanced by **10–20% muted sky-blue atmosphere** with soft, diffuse orbs of gentle light.

```css
:root {
  /* Surface & Atmospheric Foundations */
  --bg-base: #F6FAFE;            /* Primary luminous canvas */
  --bg-blue-soft: #EAF4FC;       /* Soft ambient atmosphere */
  --bg-blue-faint: #DEEEFA;      /* Subtle gradient illumination */
  --blue-light: #B8DDF6;         /* Glow & highlight tint */
  --blue-accent: #178FE0;        /* Core MEIL Action Blue */
  --blue-active: #2A9CF0;        /* Active focus & interactive state */
  --blue-hover: #1377BD;         /* Button press & deep hover */

  /* Text & Contrast Hierarchy (WCAG AAA/AA 4.5:1 Compliant) */
  --text-primary: #14202B;       /* Deep slate charcoal for primary copy */
  --text-secondary: #526577;     /* Medium slate for secondary metadata */
  --text-muted: #7B8B99;         /* Soft muted gray-blue for hints/labels */
  --text-inverted: #FFFFFF;      /* Clean pure white for primary buttons */

  /* Translucent Liquid Glass Borders */
  --border-main: rgba(160, 190, 215, 0.45);   /* Standard card glass stroke */
  --border-soft: rgba(200, 217, 231, 0.35);   /* Nested control boundary */
  --border-focus: rgba(23, 143, 224, 0.55);   /* Interactive focus outline */

  /* Semantic Indicator States */
  --state-success: #16A36A;      /* Statutory approved / validated */
  --state-success-bg: rgba(22, 163, 106, 0.10);
  --state-warning: #D99A24;      /* Anomalous consumption / review required */
  --state-warning-bg: rgba(217, 154, 36, 0.10);
  --state-error: #D95C5C;        /* Validation rejection / missing evidence */
  --state-error-bg: rgba(217, 92, 92, 0.10);
  --state-info: #178FE0;         /* Under audit / in review */
  --state-info-bg: rgba(23, 143, 224, 0.10);
}
```

---

## 3. iOS Liquid Glass Elevation & Depth

We employ a 3-tier depth system where child elements float inside parent containers with distinct opacities, blurs, and shadows:

| Level | Component Type | Background | Backdrop Blur | Border & Highlight | Shadow |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Level 1** | Main Application Shell & Master Containers | `rgba(255, 255, 255, 0.65)` | `blur(28px)` | `1px solid rgba(160, 190, 215, 0.40)`, Inset `0 1px 0 rgba(255, 255, 255, 0.85)` | `0 24px 64px rgba(70, 110, 140, 0.08)` |
| **Level 2** | Section Panels & Dashboard Cards | `rgba(255, 255, 255, 0.75)` | `blur(20px)` | `1px solid rgba(160, 190, 215, 0.35)`, Inset `0 1px 0 rgba(255, 255, 255, 0.70)` | `0 12px 32px rgba(70, 110, 140, 0.06)` |
| **Level 3** | Inner Tiles, KPI Counters & Inputs | `rgba(246, 250, 254, 0.80)` | `blur(12px)` | `1px solid rgba(184, 221, 246, 0.50)`, Inset `0 1px 0 rgba(255, 255, 255, 0.90)` | `0 4px 16px rgba(70, 110, 140, 0.04)` |

---

## 4. Typography Scale (Inter / Plus Jakarta Sans)

- **Headings & Titles:**
  - Page Header: `28px` / `Font Weight: 600` / `Letter Spacing: -0.02em`
  - Section Title: `20px` / `Font Weight: 600` / `Letter Spacing: -0.01em`
  - Card Title: `16px` / `Font Weight: 600` / `Letter Spacing: 0`
- **Body & Data:**
  - Standard Body: `14px` / `Font Weight: 400` / `Line Height: 1.5`
  - Metadata / Microcopy: `12px` / `Font Weight: 500` / `Letter Spacing: 0.01em`
  - KPI Stat Figure: `28px–32px` / `Font Weight: 700` / `Letter Spacing: -0.03em`

---

## 5. Spacing & Radius Matrix

- **8pt Spacing Grid:** `4px`, `8px`, `12px`, `16px`, `24px`, `32px`, `40px`, `48px`, `64px`.
- **Corner Radii Hierarchy:**
  - Controls, Badges & Small Tags: `8px`
  - Form Inputs & Buttons: `10px–12px`
  - Compact Metric Tiles: `14px–16px`
  - Normal Dashboard Cards: `18px–20px`
  - Master Modal & Application Shells: `22px–24px`

---

## 6. Authentication Journey & Kinetic Sequence

The portal replaces static enterprise login screens with an immersive 5-stage glass kinetic transition:

```
[Stage 1: Welcome & Organization Verification]
   │
   ▼
[Stage 2: Horizontal Role Deck (6 Roles)]
   ├── Project/Site Officer
   ├── HR & Workforce Manager
   ├── EHS & Safety Specialist
   ├── Procurement & Scope 3 Officer
   ├── CSR & Community Officer
   └── Governance & Compliance Auditor
   │ (Mouse Parallax + Lift + Ambient Glow)
   │
   ▼
[Stage 3: Role Selection & Dispersion]
   │ Selected card centers; others dissolve into subtle frosted particles
   │
   ▼
[Stage 4: Continuous Horizontal Morph]
   │ Card expands into Landscape Glass Rectangle (680px × 400px)
   │
   ▼
[Stage 5: Credentials & Sign In]
   │ Left Column: Role Identity & Contextual Scope
   │ Right Column: Credentials + Button Morph (Loading -> Checkmark -> Launch)
```

---

## 7. Master Dashboard Composition

Following the **Master Visual Reference**:
1. **Top Application Bar:** MEIL Group Identity, Active Tier/Subsidiary breadcrumb, Reporting Period indicator (e.g. *September 2025*), and Corporate Profile pill.
2. **Main Large Region (70% Width):**
   - KPI Summary Grid (Scope 1 direct emissions, Scope 2 grid electricity, Safe Man-Hours, Water recycling rate).
   - Monthly Consumption Trends (Interactive SVG Bar/Line visualizations).
   - Active Module Workspace (Tabbed Data Entry or Role-specific metric tables).
3. **Supporting Utility Panel (30% Width):**
   - Verification & Maker-Checker Status tracker.
   - Evidence Document quick-vault (Bills, weighbridge slips, lab test certificates).
   - Immutable Audit Activity Feed (User timestamps, field modifications, SHA-256 links).

---

## 8. Role-Based Navigation Matrix (RBAC)

| Role | Primary Color Token | Core Modules | Default Data Entry Scope |
| :--- | :--- | :--- | :--- |
| **Project / Site** | `#178FE0` (Blue) | My Site, Energy/Fuel Entry, Water/Waste, Evidence Vault, Submissions | Fuel, Electricity, Water, Incident Logs |
| **HR User** | `#0284C7` (Sky) | Workforce Demographics, Training Hours, Diversity, Wages, Submissions | Gender ratios, PwD, Minimum Wages |
| **EHS / Safety** | `#059669` (Emerald) | Safety Incidents, LTIFR, Waste Management, Environmental Lab Audits | Safe hours, LTIs, Hazardous Waste |
| **Procurement** | `#7C3AED` (Violet) | Suppliers, Scope 3 Goods, Steel/Cement Mass, High-Impact Vendors | Material quantities, Transport km |
| **CSR / Community** | `#D97706` (Amber) | Projects, Beneficiaries, Gram Sabha Approvals, Community Impact | Expenditure INR Cr, Aspirational Dists |
| **Governance** | `#475569` (Slate) | Policies, Complaints, Anti-Corruption, Board Disclosures, BRSR Audit | Vigil mechanism, POSH cases, Core KPIs |

---

## 9. Performance & Accessibility Standards
- **Zero Heavy 3D Libs:** Pure CSS transitions, GPU-accelerated transforms (`translate3d`, `opacity`), and SVG icons.
- **Strict Motion Safeguards:** Full `@media (prefers-reduced-motion: reduce)` support instantly disables particles and parallax.
- **Readable Contrast Guarantee:** Text is never placed over raw semi-transparent glass without a solid underlying diffused white backdrop card.
