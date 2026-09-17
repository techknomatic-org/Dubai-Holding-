// ============================================================================
// DUBAI HOLDINGS & TECH MAHINDRA MANAGED SERVICES
// PAGE 03 DATA MODEL: IT OPERATIONS | BUSINESS PULSE
// Source: 03_ITOps_Monthly & 04_ITOps_KPI_Status from DH_TechM_Managed_Services_BI_Source.xlsx
// ============================================================================

export interface MonthlyITOpsRecord {
  monthKey: string; // '2026-04'
  monthLabel: string; // 'Apr'
  fullName: string; // 'April 2026'
  isActual: boolean; // true for Apr-Jul, false for Aug-Sep if projected
  availabilityPct: number;
  availabilityTarget: number;
  csat: number;
  csatTarget: number;
  changeSuccessPct: number;
  changeVolume: number;
  majorIncidents: number;
  kpisTotal: number;
  kpisApplicable: number;
  kpisMet: number;
  kpisNotMet: number;
  kpisCantMeasure: number;
}

export interface MetricDefinition {
  id: 'availability' | 'csat' | 'change' | 'incidents' | 'kpis';
  title: string;
  category: string;
  unit: string;
  targetDisplay: string;
  targetValue: number;
  interpretation: string;
  colorHex: string;
  glowColor: string;
}

export const ITOPS_METRIC_DEFS: Record<string, MetricDefinition> = {
  availability: {
    id: 'availability',
    title: 'AVAILABILITY',
    category: 'INFRASTRUCTURE RELIABILITY',
    unit: '%',
    targetDisplay: 'Target 99.00%',
    targetValue: 99.00,
    interpretation: 'Reliability remains above target',
    colorHex: '#059669', // Emerald Green
    glowColor: 'rgba(5, 150, 105, 0.20)'
  },
  csat: {
    id: 'csat',
    title: 'CSAT',
    category: 'CUSTOMER EXPERIENCE',
    unit: '/ 5.00',
    targetDisplay: 'Target 4.50',
    targetValue: 4.50,
    interpretation: 'Customer experience remains healthy',
    colorHex: '#E31837', // Brand Red
    glowColor: 'rgba(227, 24, 55, 0.20)'
  },
  change: {
    id: 'change',
    title: 'CHANGE MANAGEMENT',
    category: 'EXECUTION QUALITY',
    unit: '%',
    targetDisplay: 'vs Prev: 100.00%',
    targetValue: 99.00,
    interpretation: 'Change execution remains controlled',
    colorHex: '#2563EB', // Royal Blue
    glowColor: 'rgba(37, 99, 235, 0.20)'
  },
  incidents: {
    id: 'incidents',
    title: 'MAJOR INCIDENTS',
    category: 'OPERATIONAL RESILIENCE',
    unit: 'incidents',
    targetDisplay: '0 in May & Jun',
    targetValue: 0,
    interpretation: 'No emerging major-incident pattern',
    colorHex: '#D97706', // Amber Orange
    glowColor: 'rgba(217, 119, 6, 0.20)'
  },
  kpis: {
    id: 'kpis',
    title: 'KPI HEALTH',
    category: 'SLA GOVERNANCE',
    unit: 'Met',
    targetDisplay: '96.67% Compliance',
    targetValue: 100.00,
    interpretation: 'One KPI exception requires attention',
    colorHex: '#7C3AED', // Royal Violet
    glowColor: 'rgba(124, 58, 237, 0.20)'
  }
};

// 6-Month Reusable Monthly Dataset strictly sourced from user-provided 6-month table
export const itOpsMonthlyHistory: MonthlyITOpsRecord[] = [
  {
    monthKey: '2026-04',
    monthLabel: 'Apr',
    fullName: 'April 2026',
    isActual: true,
    availabilityPct: 99.83,
    availabilityTarget: 99.00,
    csat: 4.50,
    csatTarget: 4.50,
    changeSuccessPct: 96.00,
    changeVolume: 100,
    majorIncidents: 2,
    kpisTotal: 56,
    kpisApplicable: 32,
    kpisMet: 28,
    kpisNotMet: 1,
    kpisCantMeasure: 3
  },
  {
    monthKey: '2026-05',
    monthLabel: 'May',
    fullName: 'May 2026',
    isActual: true,
    availabilityPct: 99.74,
    availabilityTarget: 99.00,
    csat: 4.60,
    csatTarget: 4.50,
    changeSuccessPct: 94.00,
    changeVolume: 100,
    majorIncidents: 0,
    kpisTotal: 56,
    kpisApplicable: 32,
    kpisMet: 29,
    kpisNotMet: 0,
    kpisCantMeasure: 3
  },
  {
    monthKey: '2026-06',
    monthLabel: 'Jun',
    fullName: 'June 2026',
    isActual: true,
    availabilityPct: 99.81,
    availabilityTarget: 99.00,
    csat: 4.60,
    csatTarget: 4.50,
    changeSuccessPct: 96.00,
    changeVolume: 100,
    majorIncidents: 0,
    kpisTotal: 56,
    kpisApplicable: 52,
    kpisMet: 46,
    kpisNotMet: 0,
    kpisCantMeasure: 6
  },
  {
    monthKey: '2026-07',
    monthLabel: 'Jul',
    fullName: 'July 2026',
    isActual: true,
    availabilityPct: 99.81,
    availabilityTarget: 99.00,
    csat: 4.54,
    csatTarget: 4.50,
    changeSuccessPct: 97.00,
    changeVolume: 100,
    majorIncidents: 1,
    kpisTotal: 56,
    kpisApplicable: 29,
    kpisMet: 29,
    kpisNotMet: 1,
    kpisCantMeasure: 3
  },
  {
    monthKey: '2026-08',
    monthLabel: 'Aug',
    fullName: 'August 2026',
    isActual: false,
    availabilityPct: 99.82,
    availabilityTarget: 99.00,
    csat: 4.55,
    csatTarget: 4.50,
    changeSuccessPct: 96.00,
    changeVolume: 100,
    majorIncidents: 0,
    kpisTotal: 56,
    kpisApplicable: 36,
    kpisMet: 28,
    kpisNotMet: 0,
    kpisCantMeasure: 3
  },
  {
    monthKey: '2026-09',
    monthLabel: 'Sep',
    fullName: 'September 2026',
    isActual: false,
    availabilityPct: 99.83,
    availabilityTarget: 99.00,
    csat: 4.56,
    csatTarget: 4.50,
    changeSuccessPct: 98.00,
    changeVolume: 100,
    majorIncidents: 1,
    kpisTotal: 56,
    kpisApplicable: 40,
    kpisMet: 29,
    kpisNotMet: 0,
    kpisCantMeasure: 6
  }
];

// Latest Valid Historical Baseline
export const latestITOpsMonth = itOpsMonthlyHistory[3]; // July 2026 (Explicit latest closed reporting period)
export const previousITOpsMonth = itOpsMonthlyHistory[2]; // June 2026

// CEO Executive Story Insights strictly generated from source data
export const itOpsCeoInsights = [
  {
    id: 1,
    category: 'RELIABILITY',
    highlight: 'Above 99.00% Target',
    statement: 'Infrastructure Availability delivered at 99.81% in July, consistently beating the 99.00% benchmark across all operating months.',
    status: 'positive' as const
  },
  {
    id: 2,
    category: 'CUSTOMER EXPERIENCE',
    highlight: '4.54 CSAT Maintained',
    statement: 'Customer satisfaction scored 4.54 against the 4.50 commitment, sustaining healthy user perception across corporate entities.',
    status: 'positive' as const
  },
  {
    id: 3,
    category: 'CHANGE CONTROL',
    highlight: '97.00% Execution Success',
    statement: 'Change success delivered at 97.00% in July (6-month average at 96.17%), preserving critical enterprise business continuity.',
    status: 'positive' as const
  },
  {
    id: 4,
    category: 'GOVERNANCE & SLA',
    highlight: '29 / 29 KPIs Met',
    statement: 'High operational compliance in July with no major incident pattern and steady SLA health across services.',
    status: 'attention' as const
  }
];

// Strategic Leadership Action Focus
export const itOpsLeadershipFocus = {
  headline: 'LEADERSHIP FOCUS',
  pill: 'STRATEGIC DIRECTIVE',
  statement: 'Maintain reliability → close KPI exception → sustain customer experience'
};
