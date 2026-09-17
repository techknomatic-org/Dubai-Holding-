// ============================================================================
// DUBAI HOLDING MANAGED SERVICES — DEMAND TO PROJECT DELIVERY DATA
// Sourced 100% from Excel Sheet "9. Projects " & PPT Slides 17 & 18
// ============================================================================

export interface PortfolioMetricGroup {
  total: number;
  closedInJul: number;
  workInProgress: number;
  effortManDays: number;
}

export interface PortfolioSummaryData {
  demands: PortfolioMetricGroup;
  projects: PortfolioMetricGroup;
  snapshotMonth: string;
}

export interface TopProjectSummaryItem {
  id: number;
  projectName: string;
  status: 'Implementation is in progress' | 'Completed' | string;
  effortsManDays: number;
  estimatedCompletionDate: string;
  teamEngaged: string;
}

export interface SpotlightProjectData {
  projectName: string;
  snapshotMonth: string;
  completionPct: number;
  completedTaskCount: number;
  ongoingTaskCount: number;
  planStartDate: string;
  planStartDateFormatted: string;
  planEndDate: string;
  planEndDateFormatted: string;
  completedTasks: string[];
  ongoingTasks: string[];
  sourceNote?: string;
}

export interface ProjectDeliveryModel {
  portfolioSummary: PortfolioSummaryData;
  topProjects: TopProjectSummaryItem[];
  spotlightProject: SpotlightProjectData;
}

export const defaultProjectDeliveryData: ProjectDeliveryModel = {
  portfolioSummary: {
    snapshotMonth: 'July 2026',
    demands: {
      total: 30,
      closedInJul: 1,
      workInProgress: 4,
      effortManDays: 13
    },
    projects: {
      total: 23,
      closedInJul: 1,
      workInProgress: 22,
      effortManDays: 70
    }
  },
  topProjects: [
    {
      id: 1,
      projectName: 'Meydan Network Refresh',
      status: 'Implementation is in progress',
      effortsManDays: 8,
      estimatedCompletionDate: '30 Sep 2026',
      teamEngaged: 'Network Data'
    },
    {
      id: 2,
      projectName: 'Meydan Voice Refresh',
      status: 'Implementation is in progress',
      effortsManDays: 12,
      estimatedCompletionDate: '31 Aug 2026',
      teamEngaged: 'Network Voice'
    },
    {
      id: 3,
      projectName: 'Qualys PM and ETM',
      status: 'Implementation is in progress',
      effortsManDays: 12,
      estimatedCompletionDate: '30 Oct 2026',
      teamEngaged: 'Asset , Patch'
    },
    {
      id: 4,
      projectName: 'DPR Firewall & Distribution Switches upgrade',
      status: 'Completed',
      effortsManDays: 4,
      estimatedCompletionDate: 'NA',
      teamEngaged: 'Network Data'
    }
  ],
  spotlightProject: {
    projectName: 'Qualys Patch Management',
    snapshotMonth: 'August 2026',
    completionPct: 24,
    completedTaskCount: 7,
    ongoingTaskCount: 22,
    planStartDate: '2026-07-13',
    planStartDateFormatted: '13-July-2026',
    planEndDate: '2026-10-09',
    planEndDateFormatted: '09-Oct-2026',
    sourceNote: '22 tasks in flight across QGS, endpoints and servers; slide lists 13 named ongoing task lines.',
    completedTasks: [
      'QGS topology and tagging planning',
      'Initial PM high-level design',
      'Demand meeting',
      'PM tagging workshop',
      'Agent configuration profile - “PM setting”',
      'License settings',
      'Server health check script'
    ],
    ongoingTasks: [
      'QGS deployment and configuration',
      'PM QGS and subnet mapping',
      'EDR and network whitelisting',
      'QGS-based Windows endpoints - 3rd party jobs',
      'QGS-based Windows UAT endpoints - OS jobs',
      'QGS-based Windows prod endpoints - OS jobs',
      'No-QGS Windows endpoints - 3rd party jobs',
      'Windows servers UAT - OS jobs',
      'Windows servers prod - OS jobs',
      'Windows servers - 3rd party jobs',
      'Linux servers - jobs',
      'Servers’ CAR library scripts',
      'Endpoints’ CAR library scripts'
    ]
  }
};
