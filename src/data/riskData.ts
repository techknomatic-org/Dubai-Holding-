// ============================================================================
// DUBAI HOLDING & TECH MAHINDRA MANAGED SERVICES
// SLIDES 20 & 21: RISK DASHBOARD & OVERDUE RISKS DATA MODEL
// Source: Excel Sheet 7 (22_Risk_Dashboard & 23_Risk_Overdue)
// ============================================================================

export interface RiskSummaryKPIs {
  total: number;
  open: number;
  closed: number;
  newRisks: number;
  overdue: number;
  requiresAttention: number;
  last30DaysClosed: number;
  noTargetDate: number;
  mitigationScheduled: number;
  mitigationRatePct: number;
}

export interface RiskDependencyClosure {
  dependency: string;
  count: number;
  sharePct: number;
}

export interface RiskByEntity {
  entity: string;
  count: number;
  sharePct?: number;
}

export interface RiskMitigationScheduleItem {
  month: string;
  monthLabel: string;
  entity: string;
  count: number;
}

export interface OverdueRiskDetail {
  id: string;
  riskNumber: string;
  riskName: string;
  riskDescription: string;
  potentialImpact: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  entity: string;
  subEntity: string;
  expectedDateOfClosure: string;
  actionPlan: string;
  accountability: string;
  owner: string;
  category: 'VMware License Dependency' | 'Entity Dependency' | 'Infrastructure' | 'Security';
}

// ----------------------------------------------------------------------------
// SLIDE 20: RISK SUMMARY KPIS
// ----------------------------------------------------------------------------
export const riskSummaryKPIs: RiskSummaryKPIs = {
  total: 599,
  open: 56,
  closed: 543,
  newRisks: 0,
  overdue: 5, // Reduced from 6 to 5 as on 26th Aug
  requiresAttention: 43,
  last30DaysClosed: 4,
  noTargetDate: 24,
  mitigationScheduled: 25,
  mitigationRatePct: 90.65 // 543 / 599 = 90.65%
};

// ----------------------------------------------------------------------------
// LAST 30 DAYS CLOSURES BY DEPENDENCY (4 RISKS)
// ----------------------------------------------------------------------------
export const last30DaysClosures: RiskDependencyClosure[] = [
  { dependency: 'Project Dependency', count: 2, sharePct: 50.0 },
  { dependency: 'Vendor Dependency', count: 1, sharePct: 25.0 },
  { dependency: 'Entity Dependency', count: 1, sharePct: 25.0 }
];

// ----------------------------------------------------------------------------
// RISKS WITH NO TARGET DATE BY ENTITY (24 RISKS)
// ----------------------------------------------------------------------------
export const risksWithNoTargetDate: RiskByEntity[] = [
  { entity: 'DHH', count: 11, sharePct: 45.83 },
  { entity: 'DHHQ', count: 9, sharePct: 37.50 },
  { entity: 'DHE', count: 2, sharePct: 8.33 },
  { entity: 'DHAM', count: 1, sharePct: 4.17 },
  { entity: 'Other Entities', count: 1, sharePct: 4.17 }
];

// ----------------------------------------------------------------------------
// RISKS REQUIRING ATTENTION BY ENTITY (43 RISKS)
// ----------------------------------------------------------------------------
export const risksRequiringAttention: RiskByEntity[] = [
  { entity: 'DHHQ', count: 12, sharePct: 27.91 },
  { entity: 'DHH', count: 9, sharePct: 20.93 },
  { entity: 'DHE', count: 8, sharePct: 18.60 },
  { entity: 'DHAM', count: 7, sharePct: 16.28 },
  { entity: 'Merex', count: 3, sharePct: 6.98 },
  { entity: 'DHRE', count: 2, sharePct: 4.65 },
  { entity: 'DHCM', count: 1, sharePct: 2.33 },
  { entity: 'DHGS', count: 1, sharePct: 2.33 }
];

// ----------------------------------------------------------------------------
// RISK MITIGATION SCHEDULE BY MONTH & ENTITY (25 RISKS)
// ----------------------------------------------------------------------------
export const riskMitigationSchedule: RiskMitigationScheduleItem[] = [
  { month: '2026-08', monthLabel: 'Aug 2026', entity: 'DHAM', count: 6 },
  { month: '2026-08', monthLabel: 'Aug 2026', entity: 'DHE', count: 3 },
  { month: '2026-08', monthLabel: 'Aug 2026', entity: 'Merex', count: 3 },
  { month: '2026-08', monthLabel: 'Aug 2026', entity: 'DHRE', count: 2 },
  { month: '2026-08', monthLabel: 'Aug 2026', entity: 'DHGS', count: 1 },
  { month: '2026-08', monthLabel: 'Aug 2026', entity: 'DHH', count: 1 },
  { month: '2026-08', monthLabel: 'Aug 2026', entity: 'DHHQ', count: 1 },
  { month: '2026-09', monthLabel: 'Sep 2026', entity: 'DHHQ', count: 4 },
  { month: '2026-09', monthLabel: 'Sep 2026', entity: 'DHE', count: 3 },
  { month: '2026-10', monthLabel: 'Oct 2026', entity: 'DHHQ', count: 1 }
];

// ----------------------------------------------------------------------------
// SLIDE 21: OVERDUE RISKS DETAILED REGISTER (5 RISKS)
// ----------------------------------------------------------------------------
export const overdueRisksList: OverdueRiskDetail[] = [
  {
    id: 'risk-1',
    riskNumber: 'DHHQ-15',
    riskName: 'Vulnerabilities for ESXi Platforms on VMware & VxRail',
    riskDescription: 'ESXi Platform Vulnerabilities reported on VXRAIL and Standalone ESXi hosts across enterprise infrastructure.',
    potentialImpact: 'HIGH',
    entity: 'DHHQ',
    subEntity: 'ATS',
    expectedDateOfClosure: '30 Apr 2026',
    actionPlan: '1. Upgrade ESXi Platforms to non-vulnerable versions. 2. Wintel team preparing execution plan with vendor CDA. 3. Broadcom License consolidation dependency active.',
    accountability: 'Murtuza Sathaliya',
    owner: 'Mathew Sheath',
    category: 'VMware License Dependency'
  },
  {
    id: 'risk-2',
    riskNumber: 'DHHQ-09',
    riskName: 'Vulnerabilities for ESXi Platforms on VMware & VxRail',
    riskDescription: 'ESXi Platform Vulnerabilities reported on VXRAIL and Standalone ESXi cluster hosts.',
    potentialImpact: 'HIGH',
    entity: 'DHHQ',
    subEntity: 'IMPZ',
    expectedDateOfClosure: '31 May 2026',
    actionPlan: '1. Upgrade ESXi Platforms to certified release levels. 2. Remediation plan aligned with vendor CDA. 3. Pending Broadcom License consolidation rollout.',
    accountability: 'Murtuza Sathaliya',
    owner: 'Mathew Sheath',
    category: 'VMware License Dependency'
  },
  {
    id: 'risk-3',
    riskNumber: 'DHHQ-11',
    riskName: 'Vulnerabilities for ESXi Platforms on VMware & VxRail',
    riskDescription: 'ESXi Platform Vulnerabilities detected on DPR virtualized production clusters.',
    potentialImpact: 'HIGH',
    entity: 'DHHQ',
    subEntity: 'DPR',
    expectedDateOfClosure: '31 May 2026',
    actionPlan: '1. Patching and microcode upgrade across ESXi hypervisors. 2. Vendor CDA engaged. 3. Broadcom License consolidation dependency active.',
    accountability: 'Murtuza Sathaliya',
    owner: 'Mathew Sheath',
    category: 'VMware License Dependency'
  },
  {
    id: 'risk-4',
    riskNumber: 'DHHQ-12',
    riskName: 'Vulnerabilities for ESXi Platforms on VMware & VxRail',
    riskDescription: 'ESXi Platform Vulnerabilities reported on GV production host environments.',
    potentialImpact: 'HIGH',
    entity: 'DHHQ',
    subEntity: 'GV',
    expectedDateOfClosure: '31 Jul 2026',
    actionPlan: '1. Target upgrade to hardened ESXi firmware. 2. Action plan in progress with vendor CDA. 3. Broadcom License consolidation dependency active.',
    accountability: 'Murtuza Sathaliya',
    owner: 'Mathew Sheath',
    category: 'VMware License Dependency'
  },
  {
    id: 'risk-5',
    riskNumber: 'DHRE-02',
    riskName: 'Unplanned Power & Cabling Outages at NSO DataCenter',
    riskDescription: 'Due to ongoing multiple site refresh activities at NSO DC, IT is facing unplanned service outages affecting hosted critical applications.',
    potentialImpact: 'CRITICAL',
    entity: 'DHRE',
    subEntity: 'Nakheel',
    expectedDateOfClosure: '15 Aug 2026',
    actionPlan: 'Multiple MIs occurred due to unplanned power & cabling works. Entity confirmed site renovation works target completion by Feb 2026. Closure date revised per extension work update.',
    accountability: 'Praseetha Mohan',
    owner: 'Vipin Aggarwal',
    category: 'Entity Dependency'
  }
];
