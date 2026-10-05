# MEIL ESG & BRSR Reporting Platform — `DESIGNS.md`

**Status:** LOCKED / MASTER DESIGN SYSTEM  
**Purpose:** Single source of truth for UI/UX, visual design, interaction, motion, layout, component behavior, accessibility, responsive behavior, and design restrictions for the MEIL ESG & BRSR Reporting Platform.

---

## 0. MASTER DIRECTIVE

The MEIL ESG application already has an approved visual language.

**Do not redesign the product. Do not replace the approved shell with a different dashboard style. Do not introduce a permanent left sidebar unless a future product decision explicitly authorizes it.**

The job of every implementation is:

> **Keep the approved visual shell and make the inside of every section functional, coherent, accessible, and production-ready.**

The current approved screens and references establish the design direction for:

- Global application shell
- Header
- Horizontal global navigation
- Project/site secondary navigation
- Dashboard compositions
- My Project
- Data Entry
- Evidence Management
- Submissions
- Reports
- Analytics
- Project/Site sections
- Role Selection
- Login transition

When a new module is created, it must visually belong to the same MEIL ESG product.

---

# 1. PRODUCT DESIGN PHILOSOPHY

The product is an **enterprise ESG operating and reporting platform**, not a marketing website.

The interface must communicate:

- Trust
- Accuracy
- Accountability
- Transparency
- Operational usefulness
- Data traceability
- Professionalism
- Calmness
- Modern enterprise quality

The UX should consistently help the user answer:

1. What am I looking at?
2. What project/reporting period am I working on?
3. What is complete?
4. What is missing?
5. What needs attention?
6. What can I do next?
7. What evidence supports this data?
8. What is the workflow/status?
9. Where did this value come from?

The design principle is:

> **Rich information, restrained decoration.**

---

# 2. MASTER VISUAL IDENTITY

## 2.1 Core Style

Use:

**iOS Liquid Glass + Premium Glassmorphism + Modern Enterprise SaaS + White/Faint-Blue Data Workspace**

The design should feel like a high-end professional application with subtle physical depth.

It should not feel like:

- Cyberpunk
- Sci-fi HUD
- Gaming UI
- Cryptocurrency UI
- Neon dashboard
- Futuristic military interface
- Dark developer tool
- Cartoon product
- Marketing landing page

---

# 3. COLOR SYSTEM

## 3.1 Base Colors

### Primary Background

`#FFFFFF`

### Soft Backgrounds

`#F8FBFE`  
`#F3F8FC`  
`#ECF6FD`

### Soft Atmospheric Blue

`#EAF4FF`  
`#DDEEFF`

### Primary Interaction Blue

`#2563EB`

### Secondary Blue

`#3B82F6`

### Soft Blue

`#60A5FA`

### Primary Text

`#0F172A`

### Secondary Text

`#475569`

### Muted Text

`#64748B`

### Optional Neutral

`#94A3B8`

## 3.2 Semantic Colors

### Success

Use green only for:

- Approved
- Verified
- Complete
- Connected
- Successful

### Warning

Use orange only for:

- Pending
- Attention
- Unusual value
- Upcoming deadline

### Error

Use red only for:

- Invalid data
- Failed upload
- Rejected evidence
- Correction required
- System error

### Neutral

Use gray for:

- Draft
- Disabled
- Inactive
- Informational neutral states

## 3.3 Color Restrictions

DO NOT:

- Use neon colors
- Use purple as a primary brand color
- Use dark gradients
- Use large solid blue areas
- Use rainbow dashboards
- Use high-saturation backgrounds
- Use color merely for decoration

Blue is primarily an **interaction and information-accent color**.

Target visual balance:

- ~85–92% white/near-white
- ~8–15% subtle blue atmosphere and interaction accents

---

# 4. IOS LIQUID GLASS SYSTEM

## 4.1 Principle

Liquid Glass is the material language of the application.

It must feel like layered translucent surfaces with depth, refraction, soft reflections, and blur — not simply `opacity: 0.5` cards.

## 4.2 Suggested Surface

```css
background: rgba(255, 255, 255, 0.55–0.75);
backdrop-filter: blur(20px–30px) saturate(125%–140%);
border: 1px solid rgba(255, 255, 255, 0.70–0.85);
box-shadow: 0 10px 35px rgba(30, 90, 160, 0.05–0.08);
```

Optional inner highlight:

```css
box-shadow:
  inset 0 1px 0 rgba(255,255,255,0.90),
  0 10px 35px rgba(30,90,160,0.05);
```

## 4.3 Glass Hierarchy

Use different strength levels:

### Level 1 — Application / Workspace Surface

Strongest glass layer.

### Level 2 — Major Section Card

Medium glass.

### Level 3 — Small Widget / Control

Lighter glass.

### Level 4 — Input / Button / Status

Mostly opaque for readability, with subtle glass effects.

Never make every surface equally transparent.

## 4.4 Glass Restrictions

DO NOT:

- Blur everything heavily
- Make text low-contrast
- Place important form labels over noisy transparent backgrounds
- Use glass only as decoration
- Use heavy white borders everywhere
- Use extreme glow
- Make surfaces look metallic

---

# 5. BACKGROUND SYSTEM

## 5.1 Background Appearance

The background must be:

- Mostly white
- Extremely clean
- Very faint blue atmosphere
- Softly illuminated
- Minimal

Use:

- Soft radial gradients
- Blurred blue light fields
- Very faint arcs
- Tiny translucent particles
- Subtle glass illumination

## 5.2 Background Restrictions

DO NOT use:

- Photographic backgrounds
- Large illustrations behind application content
- Heavy 3D environments
- Dark scenery
- Cyber grids
- Neon glows
- Strong blue fills
- Large decorative objects

## 5.3 Background Motion

Ambient motion should be nearly imperceptible.

Use:

- Slow blue illumination drift
- Very faint curved-arc movement
- A small number of particles
- Slow glass reflection movement
- Very subtle cursor-following light

Recommended durations:

`8–20 seconds`

Use ease-in-out.

Pause expensive ambient effects when the browser tab is hidden.

---

# 6. TYPOGRAPHY SYSTEM

Preferred fonts:

- **Inter**
- **Plus Jakarta Sans**

Choose one as the primary application font and use it consistently.

## Hierarchy

### Page Title

`30–40px`

### Large Hero / Role Title

`48–58px`

### Section Header

`16–20px`

### Card Title

`13–16px`

### Metric Value

`28–34px`

### Body

`12–14px`

### Small Metadata

`10–12px`

### Eyebrow / Step Label

`11–13px`

Use 500–700 weights. Avoid excessive bold text.

## Typography Rules

- Keep headings concise.
- Use sentence case except for deliberate labels/eyebrows.
- Do not use decorative display fonts.
- Do not use too many font sizes on one screen.
- Maintain strong contrast.

---

# 7. ICON SYSTEM

Preferred:

- **Lucide React**
- **Phosphor Icons**

Use one consistent family throughout the application.

## Rules

- No emoji for functional UI.
- No mixed icon families.
- Keep stroke weight consistent.
- Icons support the content; they do not overpower it.

## Interaction

Hover:

- `scale(1.04–1.08)` where appropriate
- `translateY(-1px)`

Selected:

- subtle blue emphasis/halo

Never use large icon glow effects.

---

# 8. RADIUS / GEOMETRY SYSTEM

### Main Application Surfaces

`22–28px`

### Major Cards

`16–22px`

### Small Cards

`14–18px`

### Inputs / Controls

`10–14px`

### Pills / Status Chips

Use full pill radius only when semantically appropriate.

Avoid making every object look like a bubble.

---

# 9. SHADOW SYSTEM

Shadows must be soft and low contrast.

Recommended:

```css
0 10px 35px rgba(30, 90, 160, 0.05–0.08)
```

Hover:

```css
0 16px 45px rgba(30, 90, 160, 0.08–0.11)
```

Avoid hard black shadows.

---

# 10. BORDER SYSTEM

Default:

```css
1px solid rgba(148, 163, 184, 0.12–0.18)
```

Glass highlight:

```css
1px solid rgba(255, 255, 255, 0.70–0.85)
```

Selected/active:

Use a subtle blue border only where meaningful.

Do not outline every component in solid blue.

---

# 11. SPACING SYSTEM

Use a consistent spacing scale:

`4 / 8 / 12 / 16 / 20 / 24 / 32 / 40 / 48`

Recommended:

### Outer Page Margin

`20–44px` desktop, adapted responsively.

### Card Gap

`12–20px`

### Card Internal Padding

`16–24px`

### Form Field Gap

`10–16px`

Whitespace should create hierarchy, not emptiness.

---

# 12. CORE APPLICATION SHELL

All major screens should inherit the same shell.

```text
GLOBAL HEADER
    ↓
GLOBAL HORIZONTAL NAVIGATION
    ↓
PAGE HEADER
    ↓
PAGE CONTENT
```

## Global Header

Left:

- MEIL logo
- divider
- MEIL ESG
- ESG & BRSR Reporting Platform

Center:

- global search
- Ctrl+K hint

Right:

- Notifications
- Help
- User avatar
- User name
- User role
- dropdown

## Global Navigation

Primary navigation:

- Overview
- My Project
- Data Entry
- Evidence
- Submissions
- Reports
- Analytics
- More

Secondary functions can live under `More`:

- Audit & Traceability
- Settings
- Profile
- Help

### Navigation rule

Do not replace this with a permanent left sidebar unless explicitly approved in a future design change.

---

# 13. PROJECT / SITE SECONDARY NAVIGATION

The Project/Site workspace has a dedicated horizontal secondary navigation:

- Overview
- Fuel & DG
- Grid Power
- Water & ZLD
- Safety & HSE
- Waste & Scrap
- Site Team
- Sync & IoT
- Workforce
- Travel

## Visual Style

The navigation is a **single horizontal row** with compact Liquid Glass tabs.

### Tab Height

`34–44px`

### Tab Radius

`16–22px`

### Active State

- Light/white glass highlight
- Blue text
- Thin blue underline
- Slightly stronger contrast

### Hover

- Soft glass highlight
- Slight text darkening
- Optional 1–2px icon movement
- Very subtle reflection

### Responsive

Do not wrap into multiple rows.

Use horizontal scrolling or overflow.

---

# 14. PAGE COMPOSITION SYSTEM

Use asymmetric layouts rather than a uniform grid.

Preferred structure:

```text
┌──────────────────────────────────────────┬───────────────────┐
│                                          │                   │
│ MAIN WORKSPACE                           │ CONTEXT / WIDGETS │
│                                          │                   │
└──────────────────────────────────────────┴───────────────────┘
```

Typical desktop ratio:

- Main area: ~60–70%
- Context/right rail: ~30–40%

Do not make every card equal size.

Use:

- Large primary cards
- Medium supporting cards
- Small KPI cards
- Compact data widgets

---

# 15. SECTION HEADER SYSTEM

Every major section uses:

```text
Section Title                              Action / View All
Supporting description
```

Rules:

- Dark navy title
- Small supporting text
- Compact action on the right
- No heavy divider bars
- No giant colored title backgrounds

---

# 16. CARD SYSTEM

Every card must have a purpose:

- Inform
- Monitor
- Warn
- Act
- Navigate

If a card has no meaningful function, do not add decorative content solely to fill space.

## Hover

```text
transform: translateY(-2px)
```

Then:

- slightly brighter glass
- slightly stronger shadow
- slight border enhancement

Duration:

`220–300ms`

## Press

```text
transform: scale(0.98)
```

---

# 17. TABLE SYSTEM

Tables should be light and readable.

Use:

- Subtle header background
- Minimal separators
- Comfortable row height
- Compact status chips
- Small action menu
- Hover highlight

Avoid:

- Heavy grid lines
- Dark headers
- Overloaded borders
- Excessively dense typography

---

# 18. CHART SYSTEM

Charts should visually belong inside glass cards.

Use:

- Thin smooth lines
- Subtle fills
- Light grid
- Minimal axes
- Small data points
- Glass tooltips
- Blue as primary analytical color

Semantic colors only where meaningful.

## Chart Hover

- Highlight the nearest data point
- Show glass tooltip
- Temporarily emphasize the selected series
- Reduce opacity of unrelated series if necessary

Do not use giant thick chart lines.

---

# 19. STATUS SYSTEM

Standard statuses:

- Draft
- Validated
- Submitted
- Under Review
- Correction Required
- Resubmitted
- Approved
- Locked
- Verified
- Rejected
- Processing
- Failed
- Connected
- Disconnected

Status chips should be compact and semantic.

---

# 20. BUTTON SYSTEM

## Primary

Blue Liquid Glass / blue filled surface.

## Secondary

White/translucent glass.

## Tertiary

Text or subtle outline.

### Hover

- `translateY(-1px)`
- soft reflection
- slight shadow increase

### Press

- `scale(0.98)`

### Loading

- spinner replacing action indicator

### Success

- checkmark transition

Do not use huge rounded buttons with excessive gradients.

---

# 21. INPUT SYSTEM

Inputs must be compact, readable, and calm.

Default:

- White/glass background
- Thin border
- Clear label

Focus:

- Blue border
- Subtle blue halo
- Optional icon accent

Error:

- Red semantic border
- Clear inline message

Warning:

- Orange semantic indicator

Do not shake the entire form for validation.

---

# 22. MODAL / DRAWER SYSTEM

Use Liquid Glass.

## Modal

- Backdrop blur
- Soft glass surface
- Rounded corners
- Subtle shadow

Animation:

`opacity 0 → 1`  
`scale 0.98 → 1`

## Drawer

Animation:

`translateX(20px) → 0`  
`opacity 0 → 1`

Duration:

`300–450ms`

---

# 23. LOADING / EMPTY / ERROR STATES

Every major module must have:

- Loading
- Loaded
- Empty
- Error
- Refreshing
- Saving
- Submitting
- Success

## Loading

Use soft Liquid Glass skeletons.

Shimmer:

`1.5–2.2s`

## Empty

Explain what is missing and give a useful next action.

Example:

> No water records for this reporting period.
> 
> **[Add Water Data]**

## Error

Explain the problem and offer retry.

> Unable to load site data.
> 
> **[Retry]**

Never blank the entire screen when one widget fails.

---

# 24. ANIMATION PRINCIPLES

Motion must be:

- Purposeful
- Physical
- Subtle
- Consistent
- Predictable
- Fast enough for enterprise work

The user should feel the interface is alive without being distracted by animation.

## Timing Guidelines

### Micro interaction

`150–250ms`

### Hover

`200–350ms`

### Standard card/page transition

`250–500ms`

### Drawer/modal

`300–600ms`

### Major transition

`500–1000ms`

### Ambient motion

`8–20s`

---

# 25. EASING

Preferred:

```text
cubic-bezier(0.22, 1, 0.36, 1)
```

Also use:

- ease-out
- ease-in-out
- controlled spring physics

Avoid:

- Linear motion for everything
- Excessive bounce
- Elastic cartoon motion
- Randomized movement

---

# 26. MOUSE INTERACTION

Use subtle pointer response.

Mouse may influence:

- Background light
- Glass reflections
- Card parallax
- Role-selection card movement

Do not connect the entire application layout directly to the cursor.

Use interpolation:

```js
current += (target - current) * 0.08;
```

Prefer GPU-friendly transforms.

---

# 27. REDUCED MOTION

Always respect:

`prefers-reduced-motion`

When enabled, reduce/disable:

- Background particles
- Cursor parallax
- Large card movements
- Strong page transitions
- Chart entrance animation
- Decorative reflections

Keep:

- Basic fades
- Functional state changes
- Focus states
- Accessible navigation

---

# 28. RESPONSIVE DESIGN

The desktop reference is the primary visual target.

## Desktop

Use the intended asymmetric glass composition.

## Tablet

- Compress gaps
- Reduce card size
- Maintain horizontal navigation with scroll
- Move right-side detail panels below main content if necessary

## Mobile

Do not merely shrink desktop.

Stack content logically.

Example:

```text
Project Context
↓
Module Navigation
↓
Data/Form
↓
Evidence
↓
Preview
↓
Validation
↓
Actions
```

Preserve the same:

- colors
- glass
- typography
- spacing language
- interaction philosophy

---

# 29. ACCESSIBILITY RULES

Every screen must support:

- Keyboard navigation
- Focus-visible states
- Semantic HTML
- ARIA labels where required
- Accessible dialogs
- Accessible tabs
- Accessible tables
- Accessible form labels
- Screen-reader-friendly status messages

Keyboard examples:

- `Tab` — navigate interactive elements
- `Enter` — activate
- `Escape` — close modal/drawer
- `ArrowLeft / ArrowRight` — navigate where appropriate

Never make animation the only way to understand a state.

---

# 30. IMAGE / ILLUSTRATION RULES

Human role illustrations are used on the Role Selection screen.

They must:

- Have transparent backgrounds
- Have no white rectangular backing
- Have clean edges
- Use one coherent visual family
- Look professional
- Have consistent lighting
- Have consistent proportions
- Fit naturally inside Liquid Glass cards

Avoid:

- Random stock photos
- Mixed illustration styles
- Childish cartoon assets
- Low-quality clip art
- Inconsistent rendering styles

If third-party assets are used, verify license/attribution requirements before shipping.

Never present a licensed external asset as original artwork.

---

# 31. ROLE SELECTION SCREEN

The role screen uses the established Liquid Glass style plus the Dribbble-inspired browsing concept.

Roles:

1. Project / Site User
2. HR User
3. EHS / Safety User
4. Procurement User
5. CSR / Community User
6. Compliance User

## Interaction Flow

```text
Initial Stacked Cards
↓
Mouse Enters
↓
Stack Expands
↓
Horizontal Arrangement
↓
Hover / Focus
↓
Card Rebound
↓
Click Role
↓
Other Cards Dissolve into Glass Particles
↓
Selected Card Moves to Center
↓
Card Expands
↓
Morphs into Landscape Login
```

The inspiration is card browsing, depth, movement, and rebound. Do not reproduce any third-party artwork literally.

---

# 32. ROLE CARD STACK

Initial state:

```text
          BACK CARDS
       ┌───────────┐
      ┌───────────┐
     ┌───────────┐
    ┌───────────┐
   │ FRONT CARD │
   └───────────┘
```

Use:

- Scale reduction
- Slight vertical/horizontal offset
- Opacity reduction
- z-index depth
- Very subtle blur for far cards

Do not make the stack messy.

---

# 33. ROLE CARD PROFILE ILLUSTRATIONS

Human/profile illustrations replace ordinary static icons.

Example role cues:

### Project/Site

Engineer/site professional, helmet, tablet, project context.

### HR

People/employee/team context.

### EHS

Safety/environment professional, protection/safety context.

### Procurement

Supply-chain/procurement professional, package/document context.

### CSR

Community/social impact context.

### Compliance

Governance/document/checklist context.

Illustrations should visually identify the role before the text is read.

---

# 34. ROLE CARD MOTION

On hover:

- Card lifts `5–8px`
- Scale `1.04–1.07`
- Glass brightens
- Border becomes subtly stronger
- Profile image scales slightly
- Small contextual animation plays
- Neighbor cards shift slightly

Card movement should have a subtle rebound/settle.

---

# 35. ROLE CARD SELECTION

On click:

1. Freeze deck
2. Lock selected card
3. Move selected card to center
4. Other cards dissolve
5. Particles drift outward/upward
6. Selected card remains
7. Card expands horizontally
8. Internal layout reorganizes
9. Login content appears

Particles must feel like glass dissolving, not an explosion.

---

# 36. LANDSCAPE LOGIN MORPH

Selected card morphs into a horizontal login panel.

Target:

`~680–780px wide`

`~360–440px high`

Left:

- Role illustration
- Role title
- Description
- Capabilities

Right:

- Welcome Back
- Email/Username
- Password
- Remember me
- Forgot password
- Sign In

The same glass surface must morph rather than simply fade into an unrelated login page.

---

# 37. MAIN DASHBOARD DESIGN RULE

The approved Project/Site dashboard layout is locked.

Keep:

- Existing header
- Existing global navigation
- Existing site navigation
- Existing white/faint-blue background
- Existing card placement
- Existing card proportions
- Existing section headers
- Existing glass effect
- Existing chart language
- Existing timeline language
- Existing spacing

Only update the inside of sections with real functionality and data.

---

# 38. PROJECT / SITE DASHBOARD

Project/Site workspace navigation:

- Overview
- Fuel & DG
- Grid Power
- Water & ZLD
- Safety & HSE
- Waste & Scrap
- Site Team
- Sync & IoT
- Workforce
- Travel

The dashboard should answer:

- What is happening at my site?
- What data is complete?
- What is missing?
- What has been submitted?
- What needs correction?
- What evidence is missing?
- What is due?
- What are the current ESG trends?

---

# 39. MY PROJECT SCREEN

`My Project` is the project portfolio/selection screen.

It answers:

> Which projects am I responsible for and what is their current state?

Keep the approved design:

- Summary cards
- Search
- Filters
- Project table
- Right-side project details
- Bottom progress/submission/deadline cards

Do not turn My Project into the operational Project/Site dashboard.

### Functional responsibilities

- Assigned projects
- Search
- Business Unit filter
- Status filter
- Reporting period filter
- Project type filter
- Sorting
- Pagination
- Project selection
- Project details
- ESG progress
- Submission status
- Deadlines
- Project access request/assignment where permitted

---

# 40. DATA ENTRY SCREEN

Core interaction:

```text
Select Project
↓
Select Reporting Period
↓
Select Module
↓
Enter Data on LEFT
↓
Upload Evidence on RIGHT
↓
Evidence Appears Immediately
↓
Preview Evidence
↓
Validate
↓
Save Draft
↓
Submit for Review
```

## Layout

Desktop:

- Left: Data Entry ~58–62%
- Right: Evidence ~38–42%

The evidence panel is deliberately narrower than the form, but the document preview must receive most of the right-side vertical space.

### Right-side order

```text
Supporting Evidence Header
↓
Compact Upload Zone
↓
Compact Uploaded Evidence List
↓
LARGE Evidence Preview
```

Do not allow the upload area to consume the space needed for document inspection.

### Data Entry content

Supported modules:

- Energy
- Water
- Waste
- Safety
- Social
- Governance
- Workforce
- Travel & Transport

---

# 41. EVIDENCE MANAGEMENT SCREEN

Evidence Management is the global evidence lifecycle workspace.

It must support:

- Search
- Project filter
- Module filter
- Status filter
- Date range
- Upload
- Preview
- Verify
- Reject
- Replace
- Version history
- Related record navigation

Evidence is not just a generic file manager.

Every important document should be linked to a relevant ESG record, submission, or reporting context.

---

# 42. SUBMISSIONS SCREEN

Submissions is the workflow center.

It must support:

- Create submission
- Review status
- Submission details
- Data included
- Evidence included
- Reviewer
- Comments
- Timeline
- Corrections
- Resubmissions
- Approval

Workflow:

```text
Draft
↓
Validated
↓
Submitted
↓
Under Review
↓
Approved
```

Correction path:

```text
Under Review
↓
Correction Required
↓
Edit
↓
Revalidate
↓
Resubmit
```

---

# 43. REPORTS SCREEN

Reports converts authorized/approved data into reporting outputs.

Support:

- ESG reports
- BRSR-related reports
- Emissions
- Energy
- Water
- Waste
- Safety
- Workforce
- CSR/Social
- Supplier/value chain
- Evidence
- Audit

Formats:

- PDF
- Excel
- CSV

Report generation must be real, traceable, and status-aware.

---

# 44. ANALYTICS SCREEN

Analytics is the intelligence layer.

It should support:

- KPI summary
- Trends
- Comparisons
- Project comparison
- Data completeness
- ESG performance
- Anomaly indicators
- Drill-down
- Export

Typical drill-down:

```text
Group
↓
Subsidiary
↓
Business Unit
↓
Project
↓
Reporting Period
↓
Module
↓
Metric
```

Analytics should never be powered by disconnected fake dashboard values.

---

# 45. SITE SECTION DESIGN RULES

Each Project/Site secondary section uses the same visual shell but has a specific operational purpose.

## Overview

Summary and action center.

## Fuel & DG

Fuel logs, DG sets, stock, runtime, evidence, validation.

## Grid Power

Meters, readings, bills, renewable power, electricity consumption, Scope 2 calculation support.

## Water & ZLD

Withdrawal, consumption, discharge, recycling, treatment, ZLD.

## Safety & HSE

Incidents, near misses, injuries, fatalities, toolbox talks, training, corrective actions, environmental incidents.

## Waste & Scrap

Generation, recovery, recycling, disposal, manifests, vendors.

## Site Team

Members, responsibilities, assignments, status.

## Sync & IoT

Connections, status, sync history, imported data, conflicts, errors.

## Workforce

Project-level workforce counts, employment type, gender, training summary; detailed HR authority stays with HR.

## Travel

Air, rail, road, distance, trips, passengers, basic Scope 3 activity data.

---

# 46. DATA ENTRY / EVIDENCE RELATIONSHIP

This relationship is central to the product.

```text
DATA RECORD
     ↓
EVIDENCE LINK
     ↓
DOCUMENT
```

The user should not have to leave the data-entry screen to attach evidence to the current record.

The right panel should react instantly to the current record.

---

# 47. VALIDATION SYSTEM

Validation should be visible and understandable.

Validate:

- Required fields
- Units
- Dates
- Reporting period
- Numeric ranges
- Cross-field consistency
- Duplicates
- Historical comparison
- Evidence requirement
- Anomalies

## Example

```text
✓ Opening reading is valid
✓ Closing reading is greater than opening
✓ Consumption calculated successfully
⚠ Consumption is higher than usual
✕ Required evidence missing
```

Errors block submission.
Warnings may allow continuation depending on configured rules.

---

# 48. CALCULATION VISIBILITY

Calculated values should not appear magical.

Show:

- Auto Calculated
- Source value
- Unit conversion if used
- Emission factor where relevant
- Result
- Methodology/factor version where appropriate

Example:

```text
Opening
128,420

Closing
128,804

Consumption (Auto Calculated)
384 kWh
```

---

# 49. PROJECT WORKFLOW

The product is not a set of disconnected pages.

The core data lifecycle is:

```text
PROJECT
↓
DATA ENTRY
↓
EVIDENCE
↓
VALIDATION
↓
SUBMISSION
↓
REVIEW
↓
CORRECTION IF REQUIRED
↓
APPROVAL
↓
CALCULATION
↓
CONSOLIDATION
↓
BRSR MAPPING
↓
REPORT
↓
AUDIT TRACE
```

---

# 50. APPROVAL / LOCK RULES

Once a record is approved/locked:

- Do not silently modify it.
- Do not overwrite history.
- Do not allow ordinary editing.
- Use a controlled correction/revision workflow.

Historical records must remain auditable.

---

# 51. PROJECT HIERARCHY

The entire platform follows:

```text
GROUP
 ↓
SUBSIDIARY
 ↓
BUSINESS UNIT
 ↓
PROJECT / SITE
 ↓
REPORTING PERIOD
```

Do not create duplicate alternative hierarchies in different modules.

---

# 52. ROLE-AWARE UX

The visual shell is shared, but content/actions are role-aware.

Primary data-entry roles:

- Project/Site User
- HR User
- EHS/Safety User
- Procurement/Supply Chain User
- CSR/Community User
- Compliance/Governance User

Review roles:

- BU Reviewer
- Subsidiary ESG Reviewer
- Group/HQ ESG Reviewer

ESG/reporting roles:

- ESG/Sustainability Manager
- ESG Analyst
- BRSR Manager

Assurance/management/admin:

- Auditor/Assurance
- Management/Executive
- Super Admin

Users must only see and act on information allowed by their permissions.

---

# 53. PERMISSION RULES

Frontend hiding is NOT security.

Enforce access through:

- Backend authorization
- RBAC
- Row-level security where appropriate
- Project assignment checks
- Organization scope

Example:

Project/Site User may:

- create draft source data
- edit own drafts
- upload evidence
- submit
- fix corrections

They may not:

- modify global emission factors
- edit organization hierarchy
- approve their own final submission
- access unauthorized projects
- configure global BRSR rules
- configure admin forms

---

# 54. ADMIN RESTRICTION

The approved non-admin interface must remain operational and clean.

Admin-only configuration includes:

- User management
- Role management
- Permissions
- Organizations
- Projects master
- Reporting periods
- Units
- Emission factors
- BRSR configuration
- Form Builder
- System settings

Project users **use configured forms**.

Admins **configure forms**.

Do not expose the full drag-and-drop Form Builder to ordinary Project/Site Users.

---

# 55. DATA SOURCE LABELS

Where useful, identify values as:

- Manual Entry
- IoT
- ERP
- Imported
- Calculated

Examples:

```text
384 MWh
[Smart Meter]
```

```text
9,200 L
[Manual Entry]
```

```text
12,480 tCO2e
[Calculated]
```

Use subtle labels, not large badges.

---

# 56. TRACEABILITY

Important metrics should be traceable:

```text
Reported Value
↓
Calculation
↓
Consolidation
↓
Project
↓
Original Source Record
↓
Evidence
↓
Approval History
```

The UX should provide a reasonable drill-down path whenever the user's role permits it.

---

# 57. PERFORMANCE RULES

Target:

**60 FPS** for motion.

Prefer animation of:

- transform
- opacity

Avoid unnecessary animation of:

- width
- height
- top
- left

Use:

- `requestAnimationFrame`
- GPU-friendly transforms
- lazy loading
- query caching
- pagination/virtualization for large datasets

Avoid continuous React re-renders caused by ambient animation.

---

# 58. DATA / API ARCHITECTURE VISUAL CONSEQUENCES

Frontend:

```text
React
↓
TanStack Query
↓
FastAPI
↓
Service Layer
↓
PostgreSQL / Supabase
```

Calculations:

```text
FastAPI
↓
ESG Calculation Engine
```

Reporting:

```text
FastAPI
↓
BRSR / Reporting Engine
```

Evidence:

```text
Frontend
↓
Secure Upload Flow
↓
Supabase Storage
↓
Evidence Metadata in PostgreSQL
```

Redis is only:

- Cache
- Background jobs
- Temporary state
- Notifications
- Sync jobs
- Report generation jobs

Redis is never the authoritative ESG datastore.

---

# 59. DESIGN DATA RULE

Do not use permanent hard-coded business data in components.

Bad:

```js
const emissions = 4430;
```

Good:

```text
PostgreSQL
↓
FastAPI
↓
TanStack Query
↓
Existing UI component
```

Seed/demo data is allowed for development if it uses the same API/data architecture as production.

---

# 60. SECURITY / PRIVACY

The interface must not expose data beyond the authenticated user's permission scope.

Sensitive operational documents should use secure authenticated access or signed URLs where appropriate.

Do not put confidential business data into:

- client-side constants
- URLs unnecessarily
- public file paths
- logs without a reason

---

# 61. LICENSE / ASSET GOVERNANCE

Third-party icons, illustrations, fonts, photographs, and UI resources must be used only according to their license.

For external illustration assets:

- Record source/license information.
- Verify commercial-use conditions.
- Add attribution where required.
- Do not remove required credit.
- Do not present third-party artwork as original MEIL artwork.

Use locally hosted or properly licensed production assets where feasible.

---

# 62. UI CONSISTENCY RULE

Every new screen must inherit the established:

- Header
- Navigation
- Background
- Liquid Glass surfaces
- Typography
- Cards
- Buttons
- Inputs
- Status chips
- Tables
- Charts
- Spacing
- Motion

Do not invent a new visual language for a new module.

---

# 63. DESIGN REVIEW CHECKLIST

Before approving a new screen, ask:

### Layout

- Does it fit the approved composition?
- Are major areas aligned?
- Is card hierarchy clear?
- Is the right/left ratio sensible?
- Is whitespace intentional?

### Visual

- Is the background mostly white?
- Is blue restrained?
- Are glass layers clear?
- Are borders subtle?
- Are shadows soft?
- Is typography consistent?

### UX

- Can the user understand the page immediately?
- Is the primary action obvious?
- Are empty/error/loading states covered?
- Are filters functional?
- Are actions permission-aware?

### Motion

- Is animation subtle?
- Does hover provide feedback?
- Is the motion performant?
- Does reduced-motion work?

### Data

- Are values real?
- Is the reporting period correct?
- Is evidence linked?
- Is validation real?
- Is the workflow real?

---

# 64. ABSOLUTE DESIGN RESTRICTIONS

NEVER:

1. Redesign the approved dashboard without approval.
2. Replace the horizontal navigation with a sidebar.
3. Introduce a dark/neon/cyber theme.
4. Use purple as the dominant color.
5. Use giant decorative illustrations inside operational screens.
6. Make every card identical in size.
7. Make every component equally transparent.
8. Overuse blur.
9. Overuse glow.
10. Overuse particles.
11. Create chaotic cursor parallax.
12. Use heavy bounce animation.
13. Make important text low contrast.
14. Use emoji as the primary icon system.
15. Mix incompatible illustration/icon styles.
16. Put the Admin Form Builder in the ordinary Project User workflow.
17. Make evidence a disconnected file manager.
18. Make analytics use fake permanent numbers.
19. Allow buttons that only animate but do nothing.
20. Allow approved data to be silently edited.
21. Store authoritative ESG data only in Redis.
22. Hard-code emission factors into frontend components.
23. Hard-code BRSR answers.
24. Expose unauthorized data through search or API responses.
25. Break mobile usability by simply shrinking desktop layouts.

---

# 65. WHAT THE FINAL PRODUCT SHOULD FEEL LIKE

The final product should feel like:

> **MEIL's premium ESG operating system for collecting, validating, proving, reviewing, consolidating, and reporting sustainability data.**

Visual feeling:

```text
WHITE
+
VERY FAINT SKY BLUE
+
IOS LIQUID GLASS
+
SOFT DEPTH
+
PRECISE TYPOGRAPHY
+
PROFESSIONAL ICONS
+
REAL DATA
+
CONTROLLED MOTION
```

Behavioral feeling:

```text
CLEAR
+
RESPONSIVE
+
TRACEABLE
+
ACTIONABLE
+
PREDICTABLE
+
ACCESSIBLE
```

---

# 66. FINAL GOLDEN RULE

### DO NOT CHANGE THE SHELL.
### CHANGE THE FUNCTIONALITY INSIDE THE SHELL.

The approved design is the visual foundation.

The application becomes complete by adding:

- Real data
- Real forms
- Real evidence
- Real validation
- Real calculations
- Real submissions
- Real review
- Real approvals
- Real analytics
- Real reports
- Real audit history
- Real permissions

The design system should make every section feel like it belongs to the same application.

---

# 67. FINAL PRODUCT FLOW

```text
AUTHENTICATION
↓
ROLE SELECTION
↓
APPLICATION SHELL
↓
MY PROJECT
↓
PROJECT / SITE
↓
DATA ENTRY
↓
EVIDENCE
↓
VALIDATION
↓
SUBMISSION
↓
REVIEW
↓
CORRECTION / RESUBMISSION
↓
APPROVAL
↓
CALCULATION
↓
CONSOLIDATION
↓
ANALYTICS
↓
BRSR / REPORTS
↓
AUDIT & TRACEABILITY
```

---

# 68. IMPLEMENTATION RULE

Before changing any visual component:

1. Inspect the existing component.
2. Identify whether the change is necessary for functionality.
3. Preserve the current visual geometry.
4. Reuse existing design tokens.
5. Reuse existing components.
6. Change only what is required.
7. Verify against the approved reference screenshot.
8. Test responsive behavior.
9. Test accessibility.
10. Test reduced motion.

**Do not solve functional problems by creating a new design.**

---

# 69. FINAL ACCEPTANCE GATE

A screen is not finished just because it looks good.

It must satisfy all applicable requirements:

- [ ] Visual system matches MEIL master design
- [ ] iOS Liquid Glass is consistent
- [ ] White/faint-blue atmosphere preserved
- [ ] Navigation preserved
- [ ] Card hierarchy preserved
- [ ] Section headers consistent
- [ ] Responsive behavior works
- [ ] Accessibility works
- [ ] Reduced motion works
- [ ] Loading state works
- [ ] Empty state works
- [ ] Error state works
- [ ] Real data works
- [ ] Permissions work
- [ ] Workflow works
- [ ] Evidence relationships work
- [ ] Auditability works
- [ ] No dead buttons
- [ ] No permanent fake business data
- [ ] No unauthorized data exposure
- [ ] No unnecessary redesign
- [ ] No console errors

---

# 70. MASTER STATEMENT

> **The MEIL ESG platform must look like one coherent premium Liquid Glass enterprise application from authentication to BRSR reporting. Every module should preserve the approved visual shell while providing real operational logic inside it. The interface should remain white-dominant, faint-blue, calm, precise, accessible, responsive, and data-driven. Functionality can evolve; the approved visual identity must remain stable unless explicitly changed by product design approval.**

---

## END OF `DESIGNS.md`
