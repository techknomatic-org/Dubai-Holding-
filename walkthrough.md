# Walkthrough: Dubai Holding & Tech Mahindra — Change Log & Session Summary

Last updated: **18 September 2026**

---

## Summary of All Changes (Full Session)

---

### 1. Global Icon System & Color Alignment

Applied a consistent enterprise icon language across the entire application:

- **Icon library:** `lucide-react` — outline style exclusively, no filled or emoji icons.
- **Stroke weight & size:** Uniform `w-4 h-4` or `w-5 h-5` icons inside `w-7 h-7` / `w-8 h-8` rounded containers.
- **Semantic mapping:** Each card, KPI, section, and action now uses a contextually relevant icon.
- **Dynamic Color Sync:** On the **Vulnerability Management Dashboard**, the top 6 KPI card icons now match their exact metric color (Red for Open >30 Days, Amber for Open 0–30 Days, Emerald for Exclusions, Sky Blue for Windows, Purple for Non-Windows).
- **Platform Specific Icons:** Used `<AppWindow />` for Windows Server exposures and `<Terminal />` for Non-Windows / Linux server exposure.

---

### 2. Agenda Page — Vulnerability Card & Live Teasers

- Added **Card 05 (Vulnerability Management)** to the main Agenda page between Delivery and Risk.
- Card order on Agenda: IT Ops → Service Mgmt → Autonomous Ops → **Vulnerability** → Delivery → Risk → Value Creation → Forward View.
- Cross-reconciled all live teaser metrics to guarantee 100% data consistency with the detailed dashboards.

---

### 3. Autonomous Operations & Service Desk Layout Optimization

- **Grid Balancing:** Compressed the Automation Offloading Flow to 4 columns (`lg:col-span-4`) to eliminate excess whitespace, and expanded Active Directory Hygiene to 8 columns (`lg:col-span-8`).
- **Active Directory Hygiene Cards:** Split "Mailbox Policies Applied" into a clean 2-line header (`Mailbox Policies<br />Applied`) and resized cards to eliminate text clipping and overlap.
- **Overall Automation Pipeline:**
  - Placed the `"Total Use Cases"` label directly below the circular `32` badge to avoid overlapping with numbers.
  - Unhighlighted the Target Completion date badge, rendering it in a crisp, clean neutral container (`bg-neutral-100 dark:bg-neutral-800`).
  - Matched Target Completion calendar icon styling with the overall icon color system.
- **Close Button Styling:** Applied high-contrast dark/light styling (`bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900`) for all modal close triggers.

---

### 4. AIOps Year-1 Roadmap — Layout, Milestone Line & Lifecycle Renaming

- **AIOps Casing Standard:** Standardized the casing strictly to **`AIOps`** everywhere across breadcrumbs, navigation tabs, component titles, and roadmap badges.
- **Vertical Milestone Phase Line:** Perfectly centered the vertical dashed milestone line directly in the middle of Quarter 4 using a CSS Grid 4-column overlay (`col-start-3` with `left: 50%`).
- **Chevron Notch Padding & Font Enhancement:** Added `pl-6 sm:pl-7` left padding so text never clips against the chevron notch, and boosted font sizes to `text-sm font-bold` for crystal-clear readability.
- **Lifecycle Phase Renaming:**
  - Renamed *"Handover"* → **"Project Approval"**.
  - Renamed *"Closure / Outcome Visibility"* → **"Benefits Realization"**.

---

### 5. Number Formatting — Global Standard

All numeric values standardized to `en-US` comma-separated format:

| Before | After |
|--------|-------|
| `96K` | `96,000` |
| `252K` | `252,000` |
| `8.5K` | `8,500` |
| `253K` | `253,000` |
| `4470` | `4,470` |

This standard was applied across all datasets (`vulnerabilityData.ts`, `automationData.ts`, `itopsData.ts`, `riskData.ts`, `costOptimizationData.ts`), rendered labels, and teaser cards.

---

### 6. Modal & Navigation Standardization

- All modal close buttons use high-contrast styling and clear text labels.
- Ticket Pulse modal cards for "Pending Incidents" and "Pending Service Requests" updated to Title Case (first letter capital only).
- All page navigation arrows use small `ChevronRight` / `ChevronLeft` Lucide icons.

---

### 7. Risk & Resilience — Overdue Tree Connector

Replaced curved bezier SVG arrows with a clean orthogonal connector:

- **Vertical dashed stem** drops straight down from "Overdue Risk (5)" root card.
- **Horizontal crossbar** spans across; navy junction dot (left) and red junction dot (right).
- **Left vertical drop:** solid navy line + arrowhead → VMware License Dependency (4).
- **Right vertical drop:** solid red line + arrowhead → Entity Dependency (1).

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

---

### 9. Title Case & First Letter Capital Standardization

Standardized text casing so that only the first letter is capitalized (Title Case / Sentence Case) across all dashboards and modals:
- **Vulnerability Management Dashboard:** `Total Open Vulnerabilities`, `Open >30 Days`, `Open 0–30 Days`, `Exclusions / Cleanup Approved`, `Windows Exposure`, and `Non-Windows Exposure`.
- **AIOps Roadmap:** `Workstreams`, quarter phase subtitles (`Discover & Prepare`, `Build & Pilot`, `Scale & Expand`, `Operationalize`), `Current Focus` pill, and ribbon banner.
- **Risk Dashboard:** `Overdue Risk`, `High Impact`, and `Critical Impact` badges.
- **Project Delivery Dashboard:** `Qualys Patch Management`.
- **Autonomous Operations:** `Zero-Touch`, `TechHub Assist`, `Total Demand`, and `Achieved`.
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
- **Paddings & Margins:** Harmonized viewport padding to `p-4 md:p-5 lg:p-6` with standard flex column gaps.
- **Cards & Borders:** Standardized primary cards to `bg-[#FFFFFF] dark:bg-white/5 border border-[#E5DFD3] dark:border-white/10 rounded-2xl` and sub-cards to `rounded-xl`.

---

### 12. Documentation Suite Refresh

- Updated [README.md](README.md), [Developer Guide](doc/developer-guide.md), [Project Manager Guide](doc/project-manager-guide.md), [User Guide](doc/user-guide.md), and [Walkthrough](walkthrough.md) to reflect all new design standards, casing rules, and architecture milestones.

---

## Verification

- **TypeScript Build:** `tsc && vite build` → Exit code 0 (zero errors, bundle built cleanly).
- **Dev server:** Verified responsive layout, dark/light mode, and interactive modals.
