// ============================================================================
// DUBAI HOLDINGS & TECH MAHINDRA MANAGED SERVICES
// SLIDE 16 & EXCEL TAB 4 ("4.Tickets") DATA MODEL:
// PENDING TICKET & ON-HOLD ANALYSIS & BACKLOG HIERARCHY
// Source: Excel Sheet '4.Tickets' (Cols 29-38 / AD-AM)
// ============================================================================

export interface PendingGroupAgeing {
  group: string;
  total: number;
  under2: number;
  days3to5?: number;
  days5to10?: number;
  days10to20?: number;
  days20to30?: number;
  days30to60?: number;
  days60to90?: number;
  over90?: number;
  primaryDependency?: string;
  category: 'INC' | 'SCTASK';
  color: string;
}

export interface HoldReasonRecord {
  ticketType: 'Incident' | 'SCTASK';
  holdReason: string;
  count: number;
  sharePct: number;
  definition: string;
  color: string;
}

export interface PendingBacklogSummary {
  asOfDate: string;
  totalPending: number;
  pendingIncidents: number;
  pendingSctasks: number;
  totalOnHold: number;
  incidentOnHold: number;
  sctaskOnHold: number;
  incidentGroups: PendingGroupAgeing[];
  sctaskGroups: PendingGroupAgeing[];
  holdReasons: HoldReasonRecord[];
  dependencies: {
    title: string;
    type: 'INC' | 'SCTASK' | 'BOTH';
    description: string;
    impactShare?: string;
    tagColor: string;
  }[];
}

// Exact Hold Reasons from Excel Sheet 4 ("4.Tickets" Cols 34-38 / AI-AM)
export const EXCEL_TAB4_HOLD_REASONS: HoldReasonRecord[] = [
  {
    ticketType: 'Incident',
    holdReason: 'User dependency',
    count: 5,
    sharePct: 50,
    definition: 'Tickets ON HOLD by USER request for observation.',
    color: '#0066B2'
  },
  {
    ticketType: 'Incident',
    holdReason: 'Vendor dependency',
    count: 3,
    sharePct: 30,
    definition: 'Response awaited from Principal OEM, support Ticket raised.',
    color: '#0066B2'
  },
  {
    ticketType: 'Incident',
    holdReason: 'Late assignment',
    count: 1,
    sharePct: 10,
    definition: 'Ticket was assigned after 6 month by DHH Application team',
    color: '#0066B2'
  },
  {
    ticketType: 'Incident',
    holdReason: 'Onsite dependency',
    count: 1,
    sharePct: 10,
    definition: 'Awaiting Service validation by onsite support team.',
    color: '#0066B2'
  },
  {
    ticketType: 'SCTASK',
    holdReason: 'DH Security Team',
    count: 21,
    sharePct: 38,
    definition: 'Awaiting DHIS team action.',
    color: '#7C3AED'
  },
  {
    ticketType: 'SCTASK',
    holdReason: 'Change dependency',
    count: 18,
    sharePct: 33,
    definition: '83% are server decommissioning; remaining related to commissioning and network activity.',
    color: '#7C3AED'
  },
  {
    ticketType: 'SCTASK',
    holdReason: 'Bulk Request',
    count: 11,
    sharePct: 20,
    definition: 'Multiple TASK /Activity in single SR, Majority related to vulnerability remediation.',
    color: '#7C3AED'
  },
  {
    ticketType: 'SCTASK',
    holdReason: 'User dependency',
    count: 5,
    sharePct: 9,
    definition: 'Awaiting Service validation by onsite support team.',
    color: '#7C3AED'
  }
];

export const PENDING_BACKLOG_DATA: PendingBacklogSummary = {
  asOfDate: '20 August 2026',
  totalPending: 213,
  pendingIncidents: 39,
  pendingSctasks: 174,
  totalOnHold: 65,      // 10 Incidents + 55 SCTASKs on hold
  incidentOnHold: 10,   // 5 + 3 + 1 + 1
  sctaskOnHold: 55,     // 21 + 18 + 11 + 5

  holdReasons: EXCEL_TAB4_HOLD_REASONS,

  // Pending Incidents Ageing by Assignment Group (Excel Tab 4 Cols 29-32)
  incidentGroups: [
    {
      group: 'DH - IT Networks',
      total: 15,
      under2: 9,
      days3to5: 2,
      days5to10: 2,
      days10to20: 2,
      days20to30: 0,
      days30to60: 0,
      days60to90: 0,
      over90: 0,
      primaryDependency: 'Vendor OEM response & Onsite validation',
      category: 'INC',
      color: '#0066B2'
    },
    {
      group: 'DH - IT Cloud Ops',
      total: 8,
      under2: 7,
      days3to5: 0,
      days5to10: 1,
      days10to20: 0,
      days20to30: 0,
      days30to60: 0,
      days60to90: 0,
      over90: 0,
      primaryDependency: 'User observation & service change validation',
      category: 'INC',
      color: '#0284C7'
    },
    {
      group: 'DH - IT Wintel & DC Ops',
      total: 5,
      under2: 3,
      days3to5: 0,
      days5to10: 0,
      days10to20: 0,
      days20to30: 1,
      days30to60: 0,
      days60to90: 0,
      over90: 1,
      primaryDependency: 'Late assignment after 6 months by DHH app team',
      category: 'INC',
      color: '#0A0838'
    },
    {
      group: 'DH - IT Backup & Storage',
      total: 3,
      under2: 1,
      days3to5: 0,
      days5to10: 1,
      days10to20: 1,
      days20to30: 0,
      days30to60: 0,
      days60to90: 0,
      over90: 0,
      primaryDependency: 'Hardware tape replacement & user validation',
      category: 'INC',
      color: '#0D9488'
    },
    {
      group: 'Techhub Service Desk Team',
      total: 3,
      under2: 3,
      days3to5: 0,
      days5to10: 0,
      days10to20: 0,
      days20to30: 0,
      days30to60: 0,
      days60to90: 0,
      over90: 0,
      primaryDependency: 'User callback & ticket closure validation',
      category: 'INC',
      color: '#E31837'
    },
    {
      group: 'DH - IT ADMM',
      total: 2,
      under2: 2,
      days3to5: 0,
      days5to10: 0,
      days10to20: 0,
      days20to30: 0,
      days30to60: 0,
      days60to90: 0,
      over90: 0,
      primaryDependency: 'Domain controller replication & policy sync',
      category: 'INC',
      color: '#7C3AED'
    },
    {
      group: 'DHHQ - Site Support',
      total: 1,
      under2: 1,
      days3to5: 0,
      days5to10: 0,
      days10to20: 0,
      days20to30: 0,
      days30to60: 0,
      days60to90: 0,
      over90: 0,
      primaryDependency: 'Onsite hardware diagnostic at HQ',
      category: 'INC',
      color: '#10B981'
    },
    {
      group: 'DHGS - Site Support',
      total: 1,
      under2: 1,
      days3to5: 0,
      days5to10: 0,
      days10to20: 0,
      days20to30: 0,
      days30to60: 0,
      days60to90: 0,
      over90: 0,
      primaryDependency: 'Site technician visit required',
      category: 'INC',
      color: '#059669'
    },
    {
      group: 'DH - IT Security',
      total: 1,
      under2: 1,
      days3to5: 0,
      days5to10: 0,
      days10to20: 0,
      days20to30: 0,
      days30to60: 0,
      days60to90: 0,
      over90: 0,
      primaryDependency: 'SOC security event review',
      category: 'INC',
      color: '#E11D48'
    }
  ],

  // Pending SCTASKs Ageing by Assignment Group (Excel Tab 4 Cols 29-32)
  sctaskGroups: [
    {
      group: 'DH - IT Security',
      total: 57,
      under2: 19,
      days3to5: 0,
      days5to10: 17,
      days10to20: 4,
      days20to30: 4,
      days30to60: 8,
      days60to90: 1,
      over90: 4,
      primaryDependency: 'Vulnerability remediation & bulk access certification',
      category: 'SCTASK',
      color: '#E11D48'
    },
    {
      group: 'DH - IT Wintel & DC Ops',
      total: 36,
      under2: 11,
      days3to5: 0,
      days5to10: 2,
      days10to20: 3,
      days20to30: 7,
      days30to60: 0,
      days60to90: 0,
      over90: 10,
      primaryDependency: '83% Server decommissioning change dependency',
      category: 'SCTASK',
      color: '#0A0838'
    },
    {
      group: 'DH - IT Networks',
      total: 22,
      under2: 5,
      days3to5: 0,
      days5to10: 6,
      days10to20: 7,
      days20to30: 3,
      days30to60: 1,
      days60to90: 0,
      over90: 0,
      primaryDependency: 'Network switch commissioning & change freeze',
      category: 'SCTASK',
      color: '#0066B2'
    },
    {
      group: 'DHHQ - Site Support',
      total: 15,
      under2: 12,
      days3to5: 0,
      days5to10: 3,
      days10to20: 0,
      days20to30: 0,
      days30to60: 0,
      days60to90: 0,
      over90: 0,
      primaryDependency: 'Hardware provisioning & user delivery schedule',
      category: 'SCTASK',
      color: '#10B981'
    },
    {
      group: 'Techhub Service Desk Team',
      total: 12,
      under2: 7,
      days3to5: 1,
      days5to10: 3,
      days10to20: 1,
      days20to30: 0,
      days30to60: 0,
      days60to90: 0,
      over90: 0,
      primaryDependency: 'Access request approvals & license provisioning',
      category: 'SCTASK',
      color: '#E31837'
    },
    {
      group: 'DH - IT ADMM',
      total: 10,
      under2: 6,
      days3to5: 0,
      days5to10: 4,
      days10to20: 0,
      days20to30: 0,
      days30to60: 0,
      days60to90: 0,
      over90: 0,
      primaryDependency: 'User account provisioning & group policy sync',
      category: 'SCTASK',
      color: '#7C3AED'
    },
    {
      group: 'DH - IT Cloud Ops',
      total: 6,
      under2: 6,
      days3to5: 0,
      days5to10: 0,
      days10to20: 0,
      days20to30: 0,
      days30to60: 0,
      days60to90: 0,
      over90: 0,
      primaryDependency: 'Azure VM scaling & IAM role assignment',
      category: 'SCTASK',
      color: '#0284C7'
    },
    {
      group: 'DH - IT Backup & Storage',
      total: 5,
      under2: 3,
      days3to5: 0,
      days5to10: 1,
      days10to20: 1,
      days20to30: 0,
      days30to60: 0,
      days60to90: 0,
      over90: 0,
      primaryDependency: 'Storage allocation quota approvals',
      category: 'SCTASK',
      color: '#0D9488'
    },
    {
      group: 'DH - IT SharePoint & Web Apps',
      total: 4,
      under2: 2,
      days3to5: 0,
      days5to10: 2,
      days10to20: 0,
      days20to30: 0,
      days30to60: 0,
      days60to90: 0,
      over90: 0,
      primaryDependency: 'SharePoint site permission configuration',
      category: 'SCTASK',
      color: '#D97706'
    },
    {
      group: 'DH - IT UNIX',
      total: 4,
      under2: 3,
      days3to5: 0,
      days5to10: 0,
      days10to20: 0,
      days20to30: 0,
      days30to60: 1,
      days60to90: 0,
      over90: 0,
      primaryDependency: 'Solaris / Linux server patch verification',
      category: 'SCTASK',
      color: '#475569'
    },
    {
      group: 'DHGS - Site Support',
      total: 3,
      under2: 2,
      days3to5: 0,
      days5to10: 1,
      days10to20: 0,
      days20to30: 0,
      days30to60: 0,
      days60to90: 0,
      over90: 0,
      primaryDependency: 'Site desktop deployment appointments',
      category: 'SCTASK',
      color: '#059669'
    }
  ],

  // Root Cause & Dependency Categorization (Excel Tab 4 Hold Reasons / Slide 16)
  dependencies: [
    {
      title: 'DH Security Team Action (DHIS)',
      type: 'SCTASK',
      description: 'Awaiting DHIS team action & approvals (38% of SCTASK hold backlog / 21 tasks).',
      impactShare: '21 Tasks (38%)',
      tagColor: '#7C3AED'
    },
    {
      title: 'Change Dependency (Decommissioning)',
      type: 'SCTASK',
      description: '83% are server decommissioning; remaining related to commissioning & network activity (18 tasks).',
      impactShare: '18 Tasks (33%)',
      tagColor: '#0284C7'
    },
    {
      title: 'Bulk Request Volume',
      type: 'SCTASK',
      description: 'Multiple task/activity in single SR, majority related to vulnerability remediation (11 tasks).',
      impactShare: '11 Tasks (20%)',
      tagColor: '#E11D48'
    },
    {
      title: 'User Dependency (Observation)',
      type: 'BOTH',
      description: 'Tickets kept on hold by user request for observation or awaiting service validation (10 tickets).',
      impactShare: '10 Tickets (50% INC / 9% SCTASK)',
      tagColor: '#0066B2'
    },
    {
      title: 'Vendor OEM Dependency',
      type: 'INC',
      description: 'Response awaited from Principal OEM, support ticket raised (3 incidents).',
      impactShare: '3 Incidents (30%)',
      tagColor: '#D97706'
    },
    {
      title: 'Late Assignment (>6 Months)',
      type: 'INC',
      description: 'Ticket was assigned after 6 months by DHH Application team (1 incident).',
      impactShare: '1 Incident (10%)',
      tagColor: '#E31837'
    },
    {
      title: 'Onsite Team Dependency',
      type: 'INC',
      description: 'Awaiting service validation by onsite support team (1 incident).',
      impactShare: '1 Incident (10%)',
      tagColor: '#0D9488'
    }
  ]
};
