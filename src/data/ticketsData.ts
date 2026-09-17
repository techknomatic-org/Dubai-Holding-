// ============================================================================
// DUBAI HOLDINGS & TECH MAHINDRA MANAGED SERVICES
// SLIDE 05 DATA MODEL: TICKET SUMMARY & TEAM VOLUMETRICS
// Exact Data from User Table & Source Sheets
// ============================================================================

export interface MonthlyTicketClosure {
  monthKey: string;
  monthLabel: string;
  incidents: number;
  serviceRequests: number;
  total: number;
  isActual: boolean;
}

export interface TeamTicketVolumetric {
  group: string;
  definition: string;
  incCount: number;
  srCount: number;
  totalCount: number;
  incSharePct: number;
  srSharePct: number;
  totalSharePct: number;
  color: string;
  iconName: string;
}

export interface TicketCategoryItem {
  rank: number;
  category: string;
  count: number;
  pctOfTotal: number;
  type: 'INC' | 'SR';
}

// 6 Months of Monthly Closure Trend (Apr to Sep 2026)
export const ticketMonthlyClosures: MonthlyTicketClosure[] = [
  {
    monthKey: '2026-04',
    monthLabel: 'Apr 26',
    incidents: 1488,
    serviceRequests: 6519,
    total: 8007,
    isActual: true
  },
  {
    monthKey: '2026-05',
    monthLabel: 'May 26',
    incidents: 1325,
    serviceRequests: 4340,
    total: 5665,
    isActual: true
  },
  {
    monthKey: '2026-06',
    monthLabel: 'Jun 26',
    incidents: 1176,
    serviceRequests: 5882,
    total: 7058,
    isActual: true
  },
  {
    monthKey: '2026-07',
    monthLabel: 'Jul 26',
    incidents: 1498,
    serviceRequests: 5578,
    total: 7076,
    isActual: true
  },
  {
    monthKey: '2026-08',
    monthLabel: 'Aug 26',
    incidents: 0,
    serviceRequests: 0,
    total: 0,
    isActual: false
  },
  {
    monthKey: '2026-09',
    monthLabel: 'Sep 26',
    incidents: 0,
    serviceRequests: 0,
    total: 0,
    isActual: false
  }
];

// Aggregated Summary Totals
export const ticketSummaryKPIs = {
  totalClosed: 27806,
  incidentsClosed: 5487,
  serviceRequestsClosed: 22319,
  incidentPct: 19.73,
  serviceRequestPct: 80.27,
  monthlyAvg: 6952,
  actualMonthsCount: 4
};

// Team Ticket Volumetrics (Exact absolute counts & shares)
export const teamTicketVolumetrics: TeamTicketVolumetric[] = [
  {
    group: 'Service Desk',
    definition: 'Techhub Service Desk',
    incCount: 498,
    srCount: 14441,
    totalCount: 14939,
    incSharePct: 9.08, // 498 / 5487
    srSharePct: 64.70, // 14441 / 22319
    totalSharePct: 53.73, // 14939 / 27806
    color: '#E31837', // Orange
    iconName: 'Headphones'
  },
  {
    group: 'Infra',
    definition: 'All remaining IT functions',
    incCount: 4283,
    srCount: 5086,
    totalCount: 9369,
    incSharePct: 78.06, // 4283 / 5487
    srSharePct: 22.79, // 5086 / 22319
    totalSharePct: 33.69, // 9369 / 27806
    color: '#38BDF8', // Sky Blue
    iconName: 'Server'
  },
  {
    group: 'EUS',
    definition: 'DHGS + DHHQ Site Support',
    incCount: 637,
    srCount: 1439,
    totalCount: 2076,
    incSharePct: 11.61, // 637 / 5487
    srSharePct: 6.45, // 1439 / 22319
    totalSharePct: 7.47, // 2076 / 27806
    color: '#10B981', // Emerald Green
    iconName: 'Laptop'
  },
  {
    group: 'Security',
    definition: 'IT Security & SOC Operations',
    incCount: 69,
    srCount: 1353,
    totalCount: 1422,
    incSharePct: 1.26, // 69 / 5487
    srSharePct: 6.06, // 1353 / 22319
    totalSharePct: 5.11, // 1422 / 27806
    color: '#8B5CF6', // Royal Purple
    iconName: 'Shield'
  }
];

// Top 5 INC Categories
export const topIncidentCategories: TicketCategoryItem[] = [
  {
    rank: 1,
    category: 'Monitoring Alert',
    count: 2577,
    pctOfTotal: 46.97, // 2577 / 5487
    type: 'INC'
  },
  {
    rank: 2,
    category: 'SOC',
    count: 690,
    pctOfTotal: 12.58, // 690 / 5487
    type: 'INC'
  },
  {
    rank: 3,
    category: 'Email',
    count: 375,
    pctOfTotal: 6.83, // 375 / 5487
    type: 'INC'
  },
  {
    rank: 4,
    category: 'Account Locked',
    count: 192,
    pctOfTotal: 3.50, // 192 / 5487
    type: 'INC'
  },
  {
    rank: 5,
    category: 'Shared Folder',
    count: 173,
    pctOfTotal: 3.15, // 173 / 5487
    type: 'INC'
  }
];

// Top 5 SR Categories
export const topServiceRequestCategories: TicketCategoryItem[] = [
  {
    rank: 1,
    category: 'Leaver Deactivation (FTE Account disable)',
    count: 3717,
    pctOfTotal: 16.65, // 3717 / 22319
    type: 'SR'
  },
  {
    rank: 2,
    category: 'Consultant Outsource Account (extend disable or create FTC)',
    count: 2249,
    pctOfTotal: 10.08, // 2249 / 22319
    type: 'SR'
  },
  {
    rank: 3,
    category: 'Distribution Group Services (add remove members or create DL)',
    count: 1778,
    pctOfTotal: 7.97, // 1778 / 22319
    type: 'SR'
  },
  {
    rank: 4,
    category: 'Shared Folder Management',
    count: 1657,
    pctOfTotal: 7.42, // 1657 / 22319
    type: 'SR'
  },
  {
    rank: 5,
    category: 'Shared Mailbox Management',
    count: 1183,
    pctOfTotal: 5.30, // 1183 / 22319
    type: 'SR'
  }
];

// Executive Key Observations
export const ticketExecutiveObservations = [
  {
    id: 1,
    title: 'Service Requests Dominate Demand (80.3%)',
    detail: '22,319 of 27,806 closures are repetitive catalog requests—creating prime potential for autonomous zero-touch fulfillment.',
    tag: 'AUTOMATION CATALYST'
  },
  {
    id: 2,
    title: 'Infra Drives 78.1% of Incidents (4,283)',
    detail: 'Monitoring Alerts (2,577) and SOC alerts (690) represent ~60% of all incident volume, indicating proactive alert capture.',
    tag: 'PROACTIVE MONITORING'
  },
  {
    id: 3,
    title: 'Service Desk Resolves 64.7% of SRs (14,441)',
    detail: 'TechHub Service Desk handles the bulk of leaver deactivations (3,717) and consultant identity updates (2,249).',
    tag: 'SERVICE DESK CORE'
  }
];
