# MEIL ESG & BRSR Reporting Portal — Agent Guidelines & Memory

## Project Context
* **Project**: BPUT Hackathon Problem Statement 08 — ESG Reporting Software for MEIL Group of Companies
* **Entity**: Megha Engineering and Infrastructures Limited (MEIL)
* **Regulations**: SEBI BRSR (Circular 2021), BRSR Core (Circulars 2023 & 2025), NGRBC 9 Principles
* **Scope**: 4-Tier Hierarchy (Group HQ ➔ 6 Subsidiaries ➔ 6 Business Units ➔ 258+ Project Sites)
* **Key Reference Documents**: In `BPUT PS-8/` folder (SEBI Circulars, ICAI Revised Edition 2024, L&T BRSR Report FY24)
* **Full Domain Knowledge**: Refer to `PROJECT_MEMORY.md`

## Mandatory UI/UX Rule — Single Source of Truth
* **Master Design System**: Always consult [`DESIGNS.md`](file:///d:/MEIL_PS-8/DESIGNS.md) before planning or making ANY UI/UX modification.
* **Golden Rule**: "DO NOT CHANGE THE SHELL. CHANGE THE FUNCTIONALITY INSIDE THE SHELL."
* **Style**: iOS Liquid Glass, white-dominant (85-92%), faint sky-blue atmosphere (8-15%), restrained interaction blue (`#2563EB`), Lucide React icons, Inter/Plus Jakarta Sans typography, real functional workflows. Never redesign or replace the approved visual shell.

## Architecture & Codebase Standards
* **Tech Stack**: React / Vite / Modern Vanilla CSS / Lucide React / Node.js
* **Calculations**: Defined in `src/utils/emissionCalculator.js` adhering to CEA India Grid Baseline v19 (0.716 kg CO2e/kWh) and GHG Protocol Scope 1, 2, 3.
* **Testing & Quality**: Run `npm run build` to verify clean compilation without bundle errors.
* **Autonomous Execution Loop**: Ralph loop in `scripts/ralph/ralph.sh` with `prd.json` and `progress.txt`.

