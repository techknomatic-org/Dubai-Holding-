# Dubai Holding & Tech Mahindra — Monthly Service Review Platform

An enterprise-grade interactive executive presentation and BI analytics platform built for **Dubai Holding** and **Tech Mahindra Managed Services**.  
Covers the **April–July 2026** managed services reporting period.

---

## 🚀 Application Structure — 9 Executive Sections

| # | Section Title | Key Metric |
|---|---|---|
| **01** | **Minutes of Previous Meeting** | 3 of 6 Commitments Closed |
| **02** | **IT Operations** | 99.81% Infra Availability |
| **03** | **Service Management** | 10,800+ Managed Endpoints |
| **04** | **Autonomous Operations** | 4,470 Automated Requests |
| **05** | **Vulnerability Management** | 252,000 Open · 25,000 Exclusions |
| **06** | **Delivery** | 24.00% Qualys Rollout |
| **07** | **Risk Management** | 543 Risks Closed (90.65%) |
| **08** | **Value Creation** | $485,628 Total Annual Savings |
| **09** | **Forward View** | 20 AIOps Year-1 Activities |

---

## 📋 Page-by-Page Details

### 01 • Minutes of Previous Meeting
- **6 MoM action items** tracked from previous meeting (3 Closed, 2 Ongoing, 1 Open).
- Story cards for each action with commitment summary, progress, and next steps.
- 100% governance adherence; Qualys rollout and Azure Foundry underway.

### 02 • IT Operations
- **Infra Availability:** `99.81%` (Jul) — consistently above 99.00% target across Apr–Jul.
- **CSAT:** `4.54 / 5.00` (Jul) — above 4.50 target.
- **Change Success Rate:** `97.00%` (Jul).
- **Total Tickets Closed (Apr–Jul):** `27,806` (5,487 INC + 22,319 SR).
- Interactive metric cards with 6-month sparkline trend charts; editable executive notes.

### 03 • Service Management
- **Managed Endpoints:** `10,800+` · **Supported Users:** `18,300+`
- **July Interaction Volume:** `8,402` (3,703 Tickets + 3,516 Email + 1,129 Calls + 54 Notifications)
- KPI/SLA trend table across Apr–Jul; email surge tracking (+128% in July).

### 04 • Autonomous Operations
- **Automated Requests (4,470):** 20.03% zero-touch offload from 22,319 TechHub SRs.
- **32 Use Cases:** 16 InfraOps + 16 SecOps (18 Active, 14 Planned).
- **AD Hygiene:** 1,311 licenses released; 2,732 stale accounts disabled; 289 mailbox policies applied.

### 05 • Vulnerability Management
- **Total Open Vulnerabilities:** `252,000` (as of Jul-26).
- **Open >30 Days:** `184,000` · **Open 0–30 Days:** `68,000`.
- **Exclusions/Cleanup Approved:** `25,000`.
- **Windows Exposure:** `208,000` · **Non-Windows Exposure:** `44,000`.
- Monthly trend: Mar–Jul decline from 253 → 96 open (high/critical) vulnerabilities.
- Interactive drilldown modals for Windows Servers, Windows Clients, Linux Servers, Network/DB/ADMM.

### 06 • Delivery (Projects & Qualys Rollout)
- **Qualys Rollout:** `24.00%` complete — 7 of 29 tasks done, 22 in flight.
- Open backlog: 39 pending tickets with 100% audit hygiene.
- Target completion: **9 October 2026**.

### 07 • Risk Management
- **Total Risks:** `599` · **Closed:** `543` (90.65%) · **Open:** `56` · **Overdue:** `5`.
- **Requires Attention:** `43` across 8 entities (DHHQ 12, DHH 9, DHE 8, DHAM 7, etc.).
- **Overdue Risk Tree:** VMware License Dependency (4) + Entity Dependency (1).
- Last 30 Days Closures: 4 risks closed (VMware 2 + Entity 1 + Vendor/Tech 1).
- Interactive straight-line branching connector tree with drilldown modals.

### 08 • Value Creation
- **Total Annual Savings:** `$485,628` (Apr–Jul 2026).
- Automation License Savings: `$454,428` (704 licenses reclaimed in July alone).
- CSI SharePoint Optimization: `$31,200` (22 TB → 9 TB, Nakheel site).
- **Highest Month:** July — `$257,748`.

### 09 • Forward View
- **20 AIOps Year-1 Activities** across 5 workstreams (Q2 Foundation → Q1 2027 Scale).
- Workstreams: *Automation Enhancement, New Use Cases, Tools + AIOps, Gen AI L2 Ops, Agentic AI*.
- Q4 2026 is the active execution quarter; Azure Foundry architecture sign-off required.

---

## 🎨 Design System & UI Guidelines

- **Typography & Font:** Standardized to `Inter` across all headings, body copy, and metrics (`--font-sans`, `--font-heading`, `--font-mono`).
- **Text Casing Standard:** Title Case / Sentence Case (First Letter Capital Only) across all visual charts, gauges, KPI cards, badges, and modals. Forced CSS `uppercase` is deprecated.
- **Naming Standard:** Strictly use **`InfraOps`** and **`SecOps`** (PascalCase) across all titles, breadcrumbs, use case badges, and filter tabs.
- **Section Badges:** Unified chapter headers across all pages using the `#0066B2` blue brand accent with a pulsing indicator (`• 0X • Chapter Name`).
- **Brand Colors:** `#E31837` (Red) · `#0A0838` (Navy) · `#0066B2` (Blue) · `#F6F2EA` (Warm Cream Surface) · `#FFFFFF` (Card/Page Canvas).
- **Icon Library:** `lucide-react` — clean outline style, consistent stroke weight, semantic mapping, and uniform `w-8 h-8` rounded containers.
- **Number Format:** All values ≥ 1,000 use `en-US` comma separation (`252,000`, `27,806`, `$485,628`).
- **Dark Mode:** Full dark / light mode support via Tailwind `dark:` variants.
- **Modals:** All popups use single word **"Close"** button; all navigation uses small `ChevronRight` arrow icons.

---

## 🛠️ Technology Stack

- **Frontend:** React 18, TypeScript (strict), Vite 6
- **Styling:** Tailwind CSS v4, Custom CSS Variables Design System (`src/index.css`)
- **Icons:** Lucide React
- **Excel/Data:** SheetJS (`xlsx`) — client-side multi-tab workbook parsing
- **Live Data:** SharePoint REST API (`src/data/sharepointService.ts`) with offline fallback datasets
- **Charts:** Native SVG (line charts, bar charts, donut charts, tree connectors) + Recharts

---

## 📦 Getting Started

### Prerequisites
- Node.js 18+ (Node.js 20+ recommended)
- npm 9+

### Installation & Run
```bash
# Install dependencies
npm install

# Start local development server (http://localhost:5173)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# TypeScript type-check (no emit)
npx tsc --noEmit
```

---

## 📚 Documentation Suite

- [Developer Guide](doc/developer-guide.md)
- [Project Manager Guide](doc/project-manager-guide.md)
- [User & Navigation Guide](doc/user-guide.md)
- [Walkthrough Summary](walkthrough.md)
