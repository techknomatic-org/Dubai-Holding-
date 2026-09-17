// ============================================================================
// DUBAI HOLDINGS & TECH MAHINDRA MANAGED SERVICES
// SLIDES 07, 08, 09, 10 DATA MODEL: AUTOMATION & ACTIVE DIRECTORY HYGIENE
// Sourced from Tab 5: '5. Automation' of DH_TechM_Managed_Services_BI_Source.xlsx
// ============================================================================

// ----------------------------------------------------------------------------
// Slide 7: Autonomous Service Desk & Maturity Index
// ----------------------------------------------------------------------------
export interface AutonomousInteractionBreakdown {
  tickets: number;
  emails: number;
  calls: number;
  notifications: number;
  totalMonthly: number;
}

export interface AutonomousMaturityModel {
  achievedPct: number;    // e.g. 0.12 (12%)
  targetPct: number;      // e.g. 0.30 (30%)
  dueDate: string;        // e.g. "31 Dec 2026"
  status: string;         // e.g. "Ahead of Schedule"
}

export const defaultInteractionBreakdown: AutonomousInteractionBreakdown = {
  tickets: 3613,
  emails: 3084,
  calls: 1265,
  notifications: 49,
  totalMonthly: 8011
};

export const defaultMaturityModel: AutonomousMaturityModel = {
  achievedPct: 12,
  targetPct: 30,
  dueDate: '31 Dec 2026',
  status: 'Ahead of Schedule'
};

// ----------------------------------------------------------------------------
// Slide 8: Automation Use Cases & Pipeline (InfraOps & SecOps)
// ----------------------------------------------------------------------------
export interface AutomationUseCaseItem {
  id: number;
  stream: 'INFRA OPS' | 'SEC OPS';
  category: string;
  name: string;
  detail: string;
  status: 'ACTIVE' | 'PLANNED';
  targetDate?: string;
  sourceStatus?: 'ACTIVE' | 'DATED' | 'TBD';
}

export const defaultAutomationUseCases: AutomationUseCaseItem[] = [
  // ==========================================
  // INFRA OPS (16 Use Cases: 9 Active, 7 Planned)
  // ==========================================
  {
    id: 1,
    stream: 'INFRA OPS',
    category: 'Enforcement of access control policies',
    name: 'Access Control Policy Automation',
    detail: 'Disable/Enable AD & stale accounts, Admin creation, Azure RBAC removal, Guest cleanup, Linux user management',
    status: 'ACTIVE',
    sourceStatus: 'ACTIVE'
  },
  {
    id: 2,
    stream: 'INFRA OPS',
    category: 'App performance monitoring & vuln scanning',
    name: 'Application Performance & Vulnerability Scanning',
    detail: 'Exchange Health Check, OS Compliance Report, server health telemetry and baseline verification',
    status: 'ACTIVE',
    sourceStatus: 'ACTIVE'
  },
  {
    id: 3,
    stream: 'INFRA OPS',
    category: 'Basic patch management',
    name: 'Operating System & Patch Management',
    detail: 'Linux package updates, Daily patch download to DH repos, Linux patching automation & reporting',
    status: 'ACTIVE',
    sourceStatus: 'ACTIVE'
  },
  {
    id: 4,
    stream: 'INFRA OPS',
    category: 'Automated error reports',
    name: 'Automated Diagnostic & Error Reporting',
    detail: 'AD replication & cleanup reporting, Health check & backup reports, exception-based reporting',
    status: 'ACTIVE',
    sourceStatus: 'ACTIVE'
  },
  {
    id: 5,
    stream: 'INFRA OPS',
    category: 'Service catalog with ML & NLP auto-assignment',
    name: 'ML & NLP Service Catalog Auto-Assignment',
    detail: 'Post API integration success between ServiceNow ITSM tool and TechM Automation platform; will be attempted with support of DH Governance Team and ITSM Vendor partner',
    status: 'PLANNED',
    targetDate: 'Target: TBD',
    sourceStatus: 'TBD'
  },
  {
    id: 6,
    stream: 'INFRA OPS',
    category: 'Incident monitoring, logging & dispatching',
    name: 'Automated Incident Monitoring & Dispatch',
    detail: 'Automated event logging, alert triage, ticket auto-creation, and intelligent routing to resolver groups',
    status: 'ACTIVE',
    sourceStatus: 'ACTIVE'
  },
  {
    id: 7,
    stream: 'INFRA OPS',
    category: 'Predictive analytics for proactive support',
    name: 'Predictive Analytics & Outage Preemption',
    detail: 'Service Management Automation — pre-empt O365 outages and performance degradation via proactive support requests',
    status: 'ACTIVE',
    sourceStatus: 'ACTIVE'
  },
  {
    id: 8,
    stream: 'INFRA OPS',
    category: 'Predictive incident management & prevention',
    name: 'Predictive Incident Management & Prevention',
    detail: 'Advanced telemetry pattern recognition to detect system degradation before service impact occurs',
    status: 'PLANNED',
    targetDate: 'Target: 31 Dec 2026',
    sourceStatus: 'DATED'
  },
  {
    id: 9,
    stream: 'INFRA OPS',
    category: 'Automated resolution for known issues',
    name: 'Self-Healing & Known Issue Resolution',
    detail: 'Resource-group & OS file-system cleanup, periodic app service restart, generic FS cleanup and remediation scripts',
    status: 'ACTIVE',
    sourceStatus: 'ACTIVE'
  },
  {
    id: 10,
    stream: 'INFRA OPS',
    category: 'Automated approval workflows',
    name: 'Automated Approval & Governance Workflows',
    detail: 'AD Clean up exercise is in progress, post that automated multi-tier approval workflows will be attempted',
    status: 'PLANNED',
    targetDate: 'Target: TBD',
    sourceStatus: 'TBD'
  },
  {
    id: 11,
    stream: 'INFRA OPS',
    category: 'Autonomous service request fulfillment',
    name: 'Autonomous Service Request Fulfillment',
    detail: 'Distribution List (DL) management, Account & line-manager updates, Shared mailbox management, Azure App Registration',
    status: 'ACTIVE',
    sourceStatus: 'ACTIVE'
  },
  {
    id: 12,
    stream: 'INFRA OPS',
    category: 'Personalized self-service experiences',
    name: 'Personalized Self-Service Portal Experience',
    detail: 'Approach and requirement alignment with DH Stakeholder to begin for conversational user self-resolution',
    status: 'PLANNED',
    targetDate: 'Target: TBD',
    sourceStatus: 'TBD'
  },
  {
    id: 13,
    stream: 'INFRA OPS',
    category: 'Automated asset discovery & inventory',
    name: 'Automated Asset Discovery & CMDB Reconciliation',
    detail: 'Automated discovery scans, hardware/software inventory synchronization, and CMDB CI mapping',
    status: 'PLANNED',
    targetDate: 'Target: 31 Dec 2026',
    sourceStatus: 'DATED'
  },
  {
    id: 14,
    stream: 'INFRA OPS',
    category: 'Integration with monitoring & alerting tools',
    name: 'Monitoring & Alerting Engine Integration',
    detail: 'Hyper-V failover cluster reporting via monitoring engine, unified synthetic alert correlation',
    status: 'ACTIVE',
    sourceStatus: 'ACTIVE'
  },
  {
    id: 15,
    stream: 'INFRA OPS',
    category: 'AI-powered chatbots & virtual agents',
    name: 'AI-Powered Chatbots & Virtual Helpdesk Agent',
    detail: 'Conversational AI agent for IT service desk self-service, instant password resets, and FAQ resolution',
    status: 'PLANNED',
    targetDate: 'Target: 30 Oct 2026',
    sourceStatus: 'DATED'
  },
  {
    id: 16,
    stream: 'INFRA OPS',
    category: 'Automated disaster recovery orchestration',
    name: 'Automated DR Failover & Runbook Orchestration',
    detail: 'Approach and expectation realignment with DH Stakeholders to begin for automated cross-region DR orchestration',
    status: 'PLANNED',
    targetDate: 'Target: TBD',
    sourceStatus: 'TBD'
  },

  // ==========================================
  // SEC OPS (16 Use Cases: 9 Active, 7 Planned)
  // ==========================================
  {
    id: 17,
    stream: 'SEC OPS',
    category: 'Threat intelligence platforms',
    name: 'Threat Intelligence Platform Automation',
    detail: 'Threat Intelligence automation, automated IOC ingestion, reputation lookup, and real-time blacklisting',
    status: 'ACTIVE',
    sourceStatus: 'ACTIVE'
  },
  {
    id: 18,
    stream: 'SEC OPS',
    category: 'Security awareness training platforms',
    name: 'Security Awareness & Phishing Automation',
    detail: 'Malicious URL Click Automation, simulated phishing campaign trigger, and automated training assignment',
    status: 'ACTIVE',
    sourceStatus: 'ACTIVE'
  },
  {
    id: 19,
    stream: 'SEC OPS',
    category: 'Automated security configuration management',
    name: 'Security Baseline Configuration & Hardening',
    detail: 'MDI Windows audit-policy configuration, security baseline benchmarking, and automated policy hardening',
    status: 'ACTIVE',
    sourceStatus: 'ACTIVE'
  },
  {
    id: 20,
    stream: 'SEC OPS',
    category: 'Data Loss Prevention (DLP) solutions',
    name: 'Data Loss Prevention (DLP) Compliance',
    detail: 'Mailbox Forwarding Compliance Automation, confidential data exfiltration detection, and DLP policy enforcement',
    status: 'ACTIVE',
    sourceStatus: 'ACTIVE'
  },
  {
    id: 21,
    stream: 'SEC OPS',
    category: 'Network segmentation with automated rules',
    name: 'Automated Network Segmentation & Zero Trust Rules',
    detail: 'Dynamic micro-segmentation rule creation, firewall policy adjustment, and zero-trust perimeter enforcement',
    status: 'PLANNED',
    targetDate: 'Target: March 2027',
    sourceStatus: 'DATED'
  },
  {
    id: 22,
    stream: 'SEC OPS',
    category: 'User & Entity Behavior Analytics (UEBA)',
    name: 'User & Entity Behavior Analytics (UEBA)',
    detail: 'Part of tool features — Sentinel behavioral analytics, abnormal sign-in detection, and identity risk scoring',
    status: 'ACTIVE',
    sourceStatus: 'ACTIVE'
  },
  {
    id: 23,
    stream: 'SEC OPS',
    category: 'Endpoint protection deployment',
    name: 'Automated Endpoint Protection & EDR Deployment',
    detail: 'Automate Endpoint Deployment, sensor health validation, and real-time agent onboarding verification',
    status: 'ACTIVE',
    sourceStatus: 'ACTIVE'
  },
  {
    id: 24,
    stream: 'SEC OPS',
    category: 'Automated communication tools',
    name: 'Security Crisis Communication & Blast Engine',
    detail: 'Automated stakeholder alert broadcasting, incident notification dispatch, and escalation communication flows',
    status: 'PLANNED',
    targetDate: 'Target: March 2027',
    sourceStatus: 'DATED'
  },
  {
    id: 25,
    stream: 'SEC OPS',
    category: 'GRC platforms',
    name: 'Automated GRC & Compliance Governance',
    detail: 'Continuous regulatory compliance audit evidence collection, ISO/NIST control validation, and gap reporting',
    status: 'PLANNED',
    targetDate: 'Target: June 2027',
    sourceStatus: 'DATED'
  },
  {
    id: 26,
    stream: 'SEC OPS',
    category: 'Risk assessment with automated workflows',
    name: 'Automated Risk Assessment Workflows',
    detail: 'Automated vendor and project cyber-risk assessment questionnaires, scoring engine, and remediation tracking',
    status: 'PLANNED',
    targetDate: 'Target: June 2027',
    sourceStatus: 'DATED'
  },
  {
    id: 27,
    stream: 'SEC OPS',
    category: 'Vendor risk management platforms',
    name: 'Third-Party Vendor Risk Management',
    detail: 'Supply-chain cyber risk monitoring, automated security posture verification, and external risk indexing',
    status: 'PLANNED',
    targetDate: 'Target: June 2027',
    sourceStatus: 'DATED'
  },
  {
    id: 28,
    stream: 'SEC OPS',
    category: 'Security Information & Event Mgmt (SIEM)',
    name: 'SIEM Integration & Sentinel Event Management',
    detail: 'Active and Operation Ready — Azure Sentinel ingestion, log parsing, automated alert aggregation, and rule correlation',
    status: 'ACTIVE',
    sourceStatus: 'ACTIVE'
  },
  {
    id: 29,
    stream: 'SEC OPS',
    category: 'Intrusion Detection & Prevention (IDPS)',
    name: 'IDPS Automated Rule Updates & Threat Blocking',
    detail: 'Automated network and host intrusion detection signature synchronization and IP containment rules',
    status: 'PLANNED',
    targetDate: 'Target: December 2026',
    sourceStatus: 'TBD'
  },
  {
    id: 30,
    stream: 'SEC OPS',
    category: 'Security Orchestration & Response (SOAR)',
    name: 'SOAR Incident Response Playbook Automation',
    detail: 'SOAR automated incident response & orchestration (in progress) — automated host isolation, credential revocation, and ticket creation',
    status: 'ACTIVE',
    sourceStatus: 'ACTIVE'
  },
  {
    id: 31,
    stream: 'SEC OPS',
    category: 'Automated data backup processes',
    name: 'Automated Immutable Security Backup Verification',
    detail: 'Automated backup validation, air-gapped immutable storage verification, and recovery validation testing',
    status: 'PLANNED',
    targetDate: 'Target: December 2026',
    sourceStatus: 'TBD'
  },
  {
    id: 32,
    stream: 'SEC OPS',
    category: 'Configuration management tools',
    name: 'Device Hardening & Windows Autopilot Automation',
    detail: 'Kiosk device automation via Windows Autopilot / Intune (in progress) — zero-touch endpoint provisioning and compliance baseline enforcement',
    status: 'ACTIVE',
    sourceStatus: 'ACTIVE'
  }
];

export interface AutomationUseCaseCategory {
  type: string;
  identified: number;
  active: number;
  planned: number;
  completionTarget: number;
  status: string;
  color: string;
  iconName: string;
}

export const defaultAutomationCategories: AutomationUseCaseCategory[] = [
  {
    type: 'InfraOps',
    identified: 16,
    active: 9,
    planned: 7,
    completionTarget: 11,
    status: 'Ahead of Schedule',
    color: '#0A0838',
    iconName: 'Server'
  },
  {
    type: 'SecOps',
    identified: 16,
    active: 9,
    planned: 7,
    completionTarget: 11,
    status: 'Ahead of Schedule',
    color: '#E31837',
    iconName: 'Shield'
  },
  {
    type: 'Total Pipeline',
    identified: 32,
    active: 18,
    planned: 14,
    completionTarget: 22,
    status: 'Ahead of Schedule',
    color: '#0A0838',
    iconName: 'Cpu'
  }
];

// ----------------------------------------------------------------------------
// Slide 9: Automation Impact & Service Request Offloading
// ----------------------------------------------------------------------------
export interface AutomationMonthlyImpactRecord {
  monthKey: string;
  monthLabel: string;
  techHubSRs: number;
  automationSRs: number;
  totalSRs: number;
  automationPct: number;
}

export interface AutomationHeroImpactKPIs {
  totalUseCasesDeployed: number;
  ticketsAutomated: number;
  overallSOPsAutomated: number;
  useCasesLive: number;
  srsProcessedByAutomation: number;
  srsProcessedByTechHub: number;
  automationAchievedPct: number;
}

export const defaultAutomationMonthlyTrends: AutomationMonthlyImpactRecord[] = [
  { monthKey: '2026-04', monthLabel: 'Apr 2026', techHubSRs: 6519, automationSRs: 1408, totalSRs: 7927, automationPct: 17.76 },
  { monthKey: '2026-05', monthLabel: 'May 2026', techHubSRs: 4340, automationSRs: 978, totalSRs: 5318, automationPct: 18.39 },
  { monthKey: '2026-06', monthLabel: 'Jun 2026', techHubSRs: 5882, automationSRs: 1028, totalSRs: 6910, automationPct: 14.88 },
  { monthKey: '2026-07', monthLabel: 'Jul 2026', techHubSRs: 5578, automationSRs: 1056, totalSRs: 6634, automationPct: 15.92 }
];

export const defaultAutomationHeroKPIs: AutomationHeroImpactKPIs = {
  totalUseCasesDeployed: 9,
  ticketsAutomated: 4470,
  overallSOPsAutomated: 31,
  useCasesLive: 56,
  srsProcessedByAutomation: 4470,
  srsProcessedByTechHub: 22319,
  automationAchievedPct: 20.03
};

// ----------------------------------------------------------------------------
// Slide 10: Active Directory Hygiene & Clean-ups
// ----------------------------------------------------------------------------
export interface LicenseHarvestingItem {
  tier: string;
  count: number;
  description: string;
  color: string;
}

export interface ActiveDirectoryHygieneModel {
  licensesReleasedTotal: number;
  licenseBreakdown: LicenseHarvestingItem[];
  mailboxPoliciesApplied: number;
  staleItemsDisabledTotal: number;
  staleComputersDisabled: number;
  staleUserAccountsDisabled: number;
}

export const defaultADHygieneModel: ActiveDirectoryHygieneModel = {
  licensesReleasedTotal: 1311,
  licenseBreakdown: [
    { tier: 'SPE-F1', count: 825, description: 'Firstline Worker Suite', color: '#0A0838' },
    { tier: 'SPE-E5', count: 335, description: 'Enterprise Premium Security & Compliance', color: '#F8B4A3' },
    { tier: 'MS-E7', count: 151, description: 'Specialized Enterprise Tier', color: '#E31837' }
  ],
  mailboxPoliciesApplied: 289,
  staleItemsDisabledTotal: 2732,
  staleComputersDisabled: 1189,
  staleUserAccountsDisabled: 1543
};
