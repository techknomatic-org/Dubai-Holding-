# Developer Guide: Dubai Holding Executive Presentation Platform

## 1. Project Overview & Architecture

The **Dubai Holding & Tech Mahindra Executive Presentation Platform** is an enterprise-grade executive dashboard and interactive reporting application built with **React 18**, **TypeScript (strict)**, and **Vite 6**, styled with a bespoke design system using **Tailwind CSS v4** and custom CSS variables matching Dubai Holding & Tech Mahindra corporate brand standards.

### Technology Stack
| Layer | Technology |
|---|---|
| **Framework** | React 18 + TypeScript (`strict: true`) |
| **Bundler** | Vite 6.x (`@vitejs/plugin-react`) |
| **Icons** | Lucide React — outline style, dynamic metric color binding, semantic icons |
| **Excel Engine** | `xlsx` (SheetJS) — client-side multi-tab workbook parsing |
| **Styling** | Tailwind CSS v4 (`@tailwindcss/vite`) + CSS Variables (`src/index.css`) |
| **Charts** | Native SVG (sparklines, bar, donut, straight-line tree connectors) + Recharts |
| **Live Data** | SharePoint REST API + robust offline fallback to static snapshot datasets |

---

## 2. Directory Structure

```
Dubai Holdings/
├── doc/
│   ├── developer-guide.md          # This file — technical architecture & dev guide
│   ├── project-manager-guide.md    # PM overview, metrics, roadmap & milestones
│   └── user-guide.md               # User & executive navigation manual
├── public/                         # Static assets (logos, images, Excel source)
├── src/
│   ├── components/                 # Reusable UI components
│   │   ├── Header.tsx              # Navigation header with home, prev, next controls
│   │   ├── LeadershipAttention.tsx # Executive attention and action cards
│   │   ├── LiveDataBadge.tsx       # Real-time sync badge & refresh trigger
│   │   ├── MomTimelineBar.tsx      # MoM action timeline bar component
│   │   ├── SlideWrapper.tsx        # Slide container with entry transitions
│   │   └── ThemeToggle.tsx         # Dark / Light mode switcher
│   ├── data/                       # Data models, static datasets & SharePoint client
│   │   ├── agendaData.ts           # Agenda page card definitions & teaser metrics
│   │   ├── aiopsRoadmapData.ts     # AIOps Year-1 roadmap (20 activities, 5 workstreams)
│   │   ├── automationData.ts       # Automation use cases, AD hygiene, hero KPIs
│   │   ├── costOptimizationData.ts # Value Creation — savings, CSI, license data
│   │   ├── excelData.json          # Raw baseline records from Excel source
│   │   ├── excelDataSource.ts      # Typed Excel extracts (MoM, Qualys, Risk, ITOps)
│   │   ├── itopsData.ts            # IT Operations monthly KPI records (Apr–Jul)
│   │   ├── momData.ts              # Minutes of Meeting action items data model
│   │   ├── pendingBacklogData.ts   # Pending & On-Hold backlog model (Tab 4)
│   │   ├── projectDeliveryData.ts  # Delivery — Qualys rollout & project tasks
│   │   ├── riskData.ts             # Risk KPIs, entity breakdowns, overdue registers
│   │   ├── serviceDeskData.ts      # Service desk footprint & channel volumetrics
│   │   ├── sharepointService.ts    # SharePoint REST API & Excel parser client
│   │   ├── ticketsData.ts          # Ticket closure KPIs, team volumetrics, categories
│   │   └── vulnerabilityData.ts    # Vulnerability KPIs, category breakdown, monthly trend
│   ├── hooks/
│   │   ├── useLiveData.ts          # SharePoint & Excel live data synchronizer
│   │   └── usePresentation.ts      # Keyboard navigation & presentation state
│   ├── pages/                      # Executive Presentation Slides/Sections
│   │   ├── Agenda.tsx              # 01: Executive Agenda & Meeting Overview
│   │   ├── MomReview.tsx           # 01: Minutes of Previous Meeting detail
│   │   ├── ItOpsPulse.tsx          # 02: IT Operations — availability, CSAT, change, KPIs
│   │   ├── TicketPulse.tsx         # 02: ITSM Ticket Dashboard & Volumetrics
│   │   ├── ServiceDeskPulse.tsx    # 03: Service Management — omnichannel & SLA
│   │   ├── AutonomousOps.tsx       # 04: Autonomous Operations — use cases & AD hygiene
│   │   ├── AutonomousServiceDesk.tsx # 04: Enhanced Autonomous Service Desk & AD Hygiene
│   │   ├── VulnerabilityDashboard.tsx  # 05: Vulnerability Management
│   │   ├── ProjectDelivery.tsx     # 06: Delivery — Qualys rollout & project demands
│   │   ├── RiskDashboard.tsx       # 07: Risk Dashboard & Overdue Risk Detail
│   │   ├── ValueCreation.tsx       # 08: Value Creation — cost savings & license ROI
│   │   └── AiopsRoadmap.tsx        # 09: Forward View — AIOps Year-1 Roadmap
│   ├── types/                      # TypeScript declarations & domain types
│   ├── App.tsx                     # Main application routing & carousel logic
│   ├── index.css                   # Design tokens, color schemas, typography
│   └── main.tsx                    # React DOM entry point
├── index.html                      # HTML entry template
├── package.json                    # Dependencies & scripts
├── tsconfig.json                   # TypeScript configuration
└── vite.config.ts                  # Vite build settings
```

---

## 3. Data Flow Architecture

```
[Excel Workbook / SharePoint]
          │
          ▼
[sharepointService.ts → parseLiveSharePointWorkbook]
          │
          ├─── Fallback ──→ [Static Data Files in src/data/]
          │                  (ticketsData, vulnerabilityData, riskData, etc.)
          ▼
[LiveDataModel — unified typed schema]
          │
          ▼
[useLiveData Hook → provides { data, isLoading, error, refresh }]
          │
          ▼
[Page Components → Agenda, ItOpsPulse, VulnerabilityDashboard, AiopsRoadmap, etc.]
```

### Key Data Files & Their Sources

| Data File | Excel Source | Primary Consumer |
|---|---|---|
| `itopsData.ts` | `03_ITOps_Monthly`, `04_ITOps_KPI_Status` | `ItOpsPulse.tsx` |
| `ticketsData.ts` | `4. Tickets` | `TicketPulse.tsx` |
| `vulnerabilityData.ts` | Qualys reports | `VulnerabilityDashboard.tsx` |
| `riskData.ts` | `22_Risk_Dashboard`, `23_Risk_Overdue` | `RiskDashboard.tsx` |
| `automationData.ts` | `5. Automation` | `AutonomousOps.tsx`, `AutonomousServiceDesk.tsx` |
| `costOptimizationData.ts` | `11.Cost Optimization` | `ValueCreation.tsx` |
| `aiopsRoadmapData.ts` | `8.AIOPS Roadmap` | `AiopsRoadmap.tsx` |
| `agendaData.ts` | Aggregated from all above | `Agenda.tsx` |
| `excelDataSource.ts` | All Excel tabs (MoM, Qualys, Risk) | Multiple pages |

---

## 4. Design System & Token Hierarchy

All design tokens are defined in `src/index.css` under `:root`:

```css
:root {
  /* Brand Tokens */
  --color-primary: #E31837;          /* Brand Red — alerts, primary actions */
  --color-secondary: #0A0838;        /* Deep Navy — headers, data bars */
  --color-page-bg: #FFFFFF;          /* Light canvas background */
  --color-surface-bg: #F6F2EA;       /* Warm cream surface card */
  --color-surface-border: #E5DFD3;   /* Card border stroke */

  /* Status Tokens */
  --status-incident: #0066B2;        /* Blue — incidents, cloud, network */
  --status-sctask: #7C3AED;          /* Purple — service requests, security */
  --status-onhold: #B54708;          /* Amber — on-hold, pending items */
  --status-closed-font: #2E5F13;     /* Forest green — success, SLA met */
  --color-text-primary: #29251D;     /* Dark charcoal text */
  --color-text-secondary: #4D4D4F;   /* Neutral slate supporting text */
}
```

### Text Casing & Naming Standards
- **First Letter Capital Only (Title Case / Sentence Case):** All card headers, chart labels, gauge metrics, button texts, and modal titles must use natural Title Case or Sentence Case. Avoid Tailwind `uppercase` class and all-caps text transformations.
- **Naming Conventions:** Strictly use **`AIOps`**, **`InfraOps`**, and **`SecOps`** (PascalCase) across all components, modals, breadcrumbs, card badges, navigation items, and datasets.
- **Lifecycle Terminology:** Use **Project Approval** (formerly Handover) and **Benefits Realization** (formerly Closure / Outcome Visibility) across all roadmap steps.
- **Section Badges:** Every presentation slide must render a unified chapter tag using `<span className="w-2 h-2 rounded-full bg-[#0066B2] dark:bg-sky-400 animate-pulse" />` and `<span className="text-xs font-medium text-[#0066B2] dark:text-sky-400">`.

### Icon System Rules
- **Library:** `lucide-react` exclusively — no mixing with other icon sets.
- **Style:** Outline only — no filled, 3D, or emoji icons.
- **Dynamic Metric Color Synchronization:** On dashboards with highlighted figures (such as Vulnerability), icons must dynamically adopt the color matching the metric (Red for >30d, Amber for 0-30d, Emerald for Exclusions, Sky for Windows, Purple for Non-Windows).
- **Semantics:** Every icon must be contextually meaningful (e.g., `<AppWindow />` for Windows Server and `<Terminal />` for Non-Windows/Linux exposure).

### Number Formatting Rules
- All numbers ≥ 1,000 use `en-US` locale comma format: `252,000`, `27,806`, `$485,628`.
- No `K` abbreviations (e.g., use `252,000` not `252K`).
- Percentages use 2 decimal places or clean integers where designated: `99.81%`, `90.65%`, `16.7%`.

---

## 5. Key Engineering Decisions & Layout Patterns

### Agenda ↔ Dashboard Reconciliation
The `agendaData.ts` card teaser values must always match their source data files:

| Agenda Card | Key Metric | Source File |
|---|---|---|
| IT Operations | `99.81%` availability | `itopsData.ts` → Jul record |
| IT Operations | `4.54 / 5.00` CSAT | `itopsData.ts` → Jul record |
| Vulnerability | `252,000` total open | `vulnerabilityData.ts` |
| Vulnerability | `25,000` exclusions | `vulnerabilityData.ts` |
| Risk | `543` risks closed | `riskData.ts` → riskSummaryKPIs |
| Value Creation | `$485,628` savings | `costOptimizationData.ts` |
| Forward View | `20` activities | `aiopsRoadmapData.ts` (count) |

### SVG Connector Pattern (Risk Overdue Tree)
The branching connector between the root overdue card and the two leaf cards uses a straight orthogonal SVG layout:
- Vertical dashed stem from root → horizontal crossbar → two straight vertical drops with `<marker>` arrowheads.
- Left branch: `#0A0838` navy; Right branch: `#E31837` red.

### AIOps Milestone Overlay Pattern
The active execution milestone for Quarter 4 is centered using a CSS Grid 4-column overlay with a dashed vertical line placed at `col-start-3` with `left: 50%`. This guarantees precision across all responsive viewport sizes without brittle pixel offsets.

---

## 6. Development Workflows & Scripts

```bash
# Install dependencies
npm install

# Start local development server (http://localhost:5173)
npm run dev

# Build for production (typecheck + bundle)
npm run build

# Preview production build locally
npm run preview

# TypeScript type-check only (no emit)
npx tsc --noEmit
```

> **Always run `npx tsc --noEmit` after any data model or component change** to verify zero type errors before committing.
