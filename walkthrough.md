# Walkthrough: Dubai Holding & Tech Mahindra — Change Log & Session Summary

Last updated: **17 September 2026**

---

## Summary of All Changes (Full Session)

---

### 1. Global Icon System

Applied a consistent enterprise icon language across the entire application:

- **Icon library:** `lucide-react` — outline style exclusively, no filled or emoji icons.
- **Stroke weight & size:** Uniform `w-4 h-4` or `w-5 h-5` icons inside `w-7 h-7` / `w-8 h-8` rounded containers.
- **Semantic mapping:** Each card, KPI, section, and action now uses a contextually relevant icon.
- **Color system:** All icon containers use the same brand color family throughout (no ad-hoc colors).

---

### 2. Agenda Page — New Vulnerability Card

- Added **Card 05 (Vulnerability Management)** to the main Agenda page between Delivery and Risk.
- New card order on Agenda: IT Ops → Service Mgmt → Autonomous Ops → **Vulnerability** → Delivery → Risk → Value Creation → Forward View.

---

### 3. Layout & Spacing Fixes

- **Risk & Resilience page:** Removed redundant `max-w-*` containers to use full viewport width.
- **Risk & Resilience overdue tree:** Shifted root card upward; added extra connector height; implemented straight orthogonal SVG connector lines.
- Font size corrected on Agenda page hero circles.
- "July" month label repositioned to top-right on applicable date cards.

---

### 4. Number Formatting — Global Standard

All numeric values standardized to `en-US` comma-separated format:

| Before | After |
|--------|-------|
| `96K` | `96,000` |
| `252K` | `252,000` |
| `8.5K` | `8,500` |
| `253K` | `253,000` |

This standard was applied to:
- `vulnerabilityData.ts` — all KPI and category values.
- `VulnerabilityDashboard.tsx` — all rendered metric labels.
- Agenda card secondary metrics (vulnerability section).

---

### 5. Modal & Navigation Standardization

- All modal close buttons changed to the single word **"Close"** (no X, no "Dismiss").
- All page navigation arrows changed to small `ChevronRight` / `ChevronLeft` Lucide icons.

---

### 6. Risk & Resilience — Overdue Tree Connector

Replaced curved bezier SVG arrows with a clean orthogonal connector:

- **Vertical dashed stem** drops straight down from "OVERDUE RISK 5" root card.
- **Horizontal crossbar** spans across; navy junction dot (left) and red junction dot (right).
- **Left vertical drop:** solid navy line + arrowhead → VMware License Dependency (4).
- **Right vertical drop:** solid red line + arrowhead → Entity Dependency (1).

---

### 7. Autonomous Operations — Red Background Fix

Investigated and resolved the red background on the Autonomous Operations page that was incorrectly applied to the hero metric container.

---

### 8. Cross-Page Number Reconciliation

Audited all "teaser" values on the **Agenda/first page** against actual dashboard pages:

| Field | Was | Fixed To | Source |
|---|---|---|---|
| IT Ops · Infra Availability | `99.93%` | `99.81%` | `itopsData.ts` (Jul actual) |
| IT Ops · Customer CSAT | `98.40%` | `4.54 / 5.00` | `ItOpsPulse.tsx` raw score |
| IT Ops · Change Success Rate | `99.40%` | `97.00%` | `itopsData.ts` Jul = 97.00% |
| Vulnerability · Total Open | `96,284` | `252,000` | `vulnerabilityData.ts` |
| Vulnerability · Exclusions Approved | `8,591` | `25,000` | `vulnerabilityData.ts` |
| Vulnerability · Sublabel | `253K down to 96K` | `252K Open · 25K Approved` | `vulnerabilityData.ts` |
| Forward View · Key Focus Areas | `23` | `20` | `aiopsRoadmapData.ts` (20 activities) |

Also fixed `momData.ts` which contained the same stale `99.93%` value.

### 9. Title Case & First Letter Capital Standardization

Standardized text casing so that only the first letter is capitalized (Title Case / Sentence Case) across all dashboards and modals:
- **Vulnerability Management Dashboard:** Top 6 KPI card titles updated to `Total Open Vulnerabilities`, `Open >30 Days`, `Open 0–30 Days`, `Exclusions / Cleanup Approved`, `Windows Exposure`, and `Non-Windows Exposure`.
- **AIOPS Roadmap:** Updated `Workstreams` header, quarter phase subtitles (`Discover & Prepare`, `Build & Pilot`, `Scale & Expand`, `Operationalize`), `Current Focus` pill, and the bottom ribbon banner (`From Foundational Automation to Operational AI-Led Service Delivery`).
- **Risk Dashboard:** Updated `Overdue Risk`, `High Impact`, and `Critical Impact` badges.
- **Project Delivery Dashboard:** Changed spotlight project title from `QUALYS PATCH MANAGEMENT` to `Qualys Patch Management`.
- **Autonomous Operations:** Updated donut chart center labels from all-caps to `Zero-Touch`, `TechHub Assist`, `Total Demand`, and `Achieved`.
- Removed forced CSS `uppercase` text transformations across all pages.

---

### 10. `InfraOps` & `SecOps` Naming Standardization

- Standardized all occurrences to PascalCase **`InfraOps`** and **`SecOps`** across:
  - Autonomous operations workstream cards and modal titles.
  - Drilldown breadcrumbs and sub-filter tabs (`InfraOps (16)` / `SecOps (16)`).
  - Use case item badges and narrative story points in `momData.ts`.

---

### 11. Design System, Spacing & Layout Consistency

- **Font Family:** Unified to `Inter` across all headings, body, labels, and metrics in `index.css`.
- **Chapter Header Badges:** Standardized all slide headers to use the `#0066B2` blue brand accent with a pulsing indicator (`• 0X • Chapter Name`).
- **Paddings & Margins:** Harmonized viewport padding to `p-4 md:p-5 lg:p-6` with standard flex column gaps (`gap-2.5` to `gap-3.5`).
- **Cards & Borders:** Standardized primary cards to `bg-[#FFFFFF] dark:bg-white/5 border border-[#E5DFD3] dark:border-white/10 rounded-2xl` and sub-cards to `rounded-xl`.

---

### 12. Documentation Suite Refresh

- Updated [README.md](README.md), [Developer Guide](doc/developer-guide.md), [Project Manager Guide](doc/project-manager-guide.md), [User Guide](doc/user-guide.md), and [Walkthrough](walkthrough.md) to reflect all new design standards, casing rules, and architecture milestones.

---

## Verification

- **TypeScript Build:** `tsc && vite build` → Exit code 0 (zero errors, bundle built cleanly).
- **Dev server:** Verified responsive layout, dark/light mode, and interactive modals.
