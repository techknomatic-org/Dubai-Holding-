export interface ExcelRoadmapActivity {
  id: string;
  workstream: 'Automation Enhancement' | 'New Automation Use Cases' | 'Tools + AIOps' | 'Gen AI L2/L2 Ops' | 'Agentic AI';
  activity: string;
  startQuarter: 'Q2 2026' | 'Q3 2026' | 'Q4 2026' | 'Q1 2027';
  endQuarter: 'Q2 2026' | 'Q3 2026' | 'Q4 2026' | 'Q1 2027';
  startQKey: 'Q2' | 'Q3' | 'Q4' | 'Q1';
  endQKey: 'Q2' | 'Q3' | 'Q4' | 'Q1';
  status: 'COMPLETED' | 'IN_PROGRESS' | 'PLANNED';
  badge: string;
  description: string;
  techStack: string[];
  impactOutcome: string;
}

export interface RoadmapWorkstream {
  id: string;
  title: string;
  shortTitle: string;
  iconName: 'Wrench' | 'Workflow' | 'Cpu' | 'Sparkles' | 'Bot';
  accentColor: string;
  bgLight: string;
  borderLight: string;
  description?: string;
  activities: ExcelRoadmapActivity[];
}

export interface QuarterMetadata {
  key: 'Q2' | 'Q3' | 'Q4' | 'Q1';
  label: 'Q2 2026' | 'Q3 2026' | 'Q4 2026' | 'Q1 2027';
  period: string;
  isCurrent: boolean;
  statusText: string;
  themeColor: string;
}

export const EXCEL_ROADMAP_QUARTERS: QuarterMetadata[] = [
  {
    key: 'Q2',
    label: 'Q2 2026',
    period: 'Apr – Jun 2026',
    isCurrent: false,
    statusText: 'Foundation (Completed)',
    themeColor: '#0284C7'
  },
  {
    key: 'Q3',
    label: 'Q3 2026',
    period: 'Jul – Sep 2026',
    isCurrent: false,
    statusText: 'Expansion (Completed)',
    themeColor: '#8B5CF6'
  },
  {
    key: 'Q4',
    label: 'Q4 2026',
    period: 'Oct – Dec 2026',
    isCurrent: true,
    statusText: 'Current Active Quarter',
    themeColor: '#E31837'
  },
  {
    key: 'Q1',
    label: 'Q1 2027',
    period: 'Jan – Mar 2027',
    isCurrent: false,
    statusText: 'Autonomous Scale (Target)',
    themeColor: '#10B981'
  }
];

// Exact 20 activities from Excel sheet '8.AIOPS Roadmap'
export const EXCEL_AIOPS_ROADMAP_ACTIVITIES: ExcelRoadmapActivity[] = [
  // 1. Automation Enhancement
  {
    id: 'ae-1',
    workstream: 'Automation Enhancement',
    activity: 'Existing Automation Review',
    startQuarter: 'Q2 2026',
    endQuarter: 'Q2 2026',
    startQKey: 'Q2',
    endQKey: 'Q2',
    status: 'COMPLETED',
    badge: 'Delivered',
    description: 'Comprehensive audit of legacy automation scripts, PowerShell routines, and bot triggers across infrastructure.',
    techStack: ['PowerShell', 'Python', 'SolarWinds'],
    impactOutcome: '100% Scripts Audited'
  },
  {
    id: 'ae-2',
    workstream: 'Automation Enhancement',
    activity: 'SolarWinds Integration',
    startQuarter: 'Q2 2026',
    endQuarter: 'Q2 2026',
    startQKey: 'Q2',
    endQKey: 'Q2',
    status: 'COMPLETED',
    badge: 'Delivered',
    description: 'Direct bi-directional alert integration and node telemetry streaming from SolarWinds ITOM.',
    techStack: ['SolarWinds API', 'REST Webhooks'],
    impactOutcome: 'Live Telemetry Linked'
  },
  {
    id: 'ae-3',
    workstream: 'Automation Enhancement',
    activity: 'Standardize workflows, orchestration across platform',
    startQuarter: 'Q3 2026',
    endQuarter: 'Q1 2027',
    startQKey: 'Q3',
    endQKey: 'Q1',
    status: 'IN_PROGRESS',
    badge: 'Active Q4 Execution',
    description: 'Unified cross-platform workflow orchestration standardizing 31+ SOPs across cloud, on-prem, and directory services.',
    techStack: ['Ansible', 'Power Automate', 'Active Directory'],
    impactOutcome: '31 SOPs Orchestrated'
  },
  {
    id: 'ae-4',
    workstream: 'Automation Enhancement',
    activity: 'SNOW Integration',
    startQuarter: 'Q3 2026',
    endQuarter: 'Q1 2027',
    startQKey: 'Q3',
    endQKey: 'Q1',
    status: 'IN_PROGRESS',
    badge: 'Active Q4 Execution',
    description: 'ServiceNow (SNOW) ITIL bi-directional connector for automated ticket generation, work-notes sync, and auto-closure.',
    techStack: ['ServiceNow REST API', 'MID Server', 'ITSM Gateway'],
    impactOutcome: 'Target 95% Auto-Sync'
  },

  // 2. New Automation Use Cases
  {
    id: 'nuc-1',
    workstream: 'New Automation Use Cases',
    activity: 'New Use Case Identification, Review, Feasibility and Deployment',
    startQuarter: 'Q2 2026',
    endQuarter: 'Q2 2026',
    startQKey: 'Q2',
    endQKey: 'Q2',
    status: 'COMPLETED',
    badge: 'Delivered',
    description: 'Systematic ticket category analysis to identify and prioritize candidate automation use cases with highest ROI.',
    techStack: ['Ticket Telemetry', 'Feasibility Matrix'],
    impactOutcome: '56 Use Cases Scoped'
  },
  {
    id: 'nuc-2',
    workstream: 'New Automation Use Cases',
    activity: 'New Automation Use case development',
    startQuarter: 'Q3 2026',
    endQuarter: 'Q3 2026',
    startQKey: 'Q3',
    endQKey: 'Q3',
    status: 'COMPLETED',
    badge: 'Delivered',
    description: 'Sprint-based engineering and deployment of 18 high-impact automation use cases in production.',
    techStack: ['Python', 'PowerShell', 'Power Automate'],
    impactOutcome: '18 Live Use Cases'
  },
  {
    id: 'nuc-3',
    workstream: 'New Automation Use Cases',
    activity: 'Automation based on trends, events, threshold, incident and requests',
    startQuarter: 'Q4 2026',
    endQuarter: 'Q1 2027',
    startQKey: 'Q4',
    endQKey: 'Q1',
    status: 'IN_PROGRESS',
    badge: 'Active Q4 Execution',
    description: 'Event-driven automated triggers reacting dynamically to threshold alerts, repeat incident patterns, and request spikes.',
    techStack: ['Event-Driven Engine', 'SolarWinds ITOM', 'SNOW API'],
    impactOutcome: '14 Roadmap Pipeline'
  },

  // 3. Tools + AIOps
  {
    id: 'ta-1',
    workstream: 'Tools + AIOps',
    activity: 'Alert Reduction on Solar Wind ITOM TOOL using AI capability',
    startQuarter: 'Q3 2026',
    endQuarter: 'Q3 2026',
    startQKey: 'Q3',
    endQKey: 'Q3',
    status: 'COMPLETED',
    badge: 'Delivered',
    description: 'AI-based alert deduplication and correlation algorithms deployed on SolarWinds ITOM monitoring pipeline.',
    techStack: ['AI Correlation Engine', 'SolarWinds ITOM'],
    impactOutcome: '40% Noise Suppressed'
  },
  {
    id: 'ta-2',
    workstream: 'Tools + AIOps',
    activity: 'Use Case Development',
    startQuarter: 'Q4 2026',
    endQuarter: 'Q1 2027',
    startQKey: 'Q4',
    endQKey: 'Q1',
    status: 'IN_PROGRESS',
    badge: 'Active Q4 Execution',
    description: 'Engineering specialized AIOps machine learning models for anomaly prediction and self-healing IT operations.',
    techStack: ['Machine Learning', 'AIOps Hub', 'FastAPI'],
    impactOutcome: 'Advanced Predictive Models'
  },

  // 4. Gen AI L2/L2 Ops
  {
    id: 'ga-1',
    workstream: 'Gen AI L2/L2 Ops',
    activity: 'AI Team Onboarding',
    startQuarter: 'Q2 2026',
    endQuarter: 'Q2 2026',
    startQKey: 'Q2',
    endQKey: 'Q2',
    status: 'COMPLETED',
    badge: 'Delivered',
    description: 'Onboarding dedicated AI engineers, data scientists, and prompt engineering specialists into core ops team.',
    techStack: ['AIOps Center of Excellence'],
    impactOutcome: 'Team Operational'
  },
  {
    id: 'ga-2',
    workstream: 'Gen AI L2/L2 Ops',
    activity: 'AI Use case identification and Feasibility',
    startQuarter: 'Q2 2026',
    endQuarter: 'Q2 2026',
    startQKey: 'Q2',
    endQKey: 'Q2',
    status: 'COMPLETED',
    badge: 'Delivered',
    description: 'Formal architectural validation and feasibility assessment of LLMs for enterprise troubleshooting workflows.',
    techStack: ['Model Benchmarking', 'Security Governance'],
    impactOutcome: 'Architecture Approved'
  },
  {
    id: 'ga-3',
    workstream: 'Gen AI L2/L2 Ops',
    activity: 'Gen AI powered L2 operations for troubleshooting and ticket handling',
    startQuarter: 'Q3 2026',
    endQuarter: 'Q1 2027',
    startQKey: 'Q3',
    endQKey: 'Q1',
    status: 'IN_PROGRESS',
    badge: 'Active Q4 Execution',
    description: 'Context-aware Gen AI assistant delivering guided troubleshooting playbooks to tier-2 support engineers.',
    techStack: ['Copilot Studio', 'Enterprise Vector Index'],
    impactOutcome: '30% Faster Resolution'
  },
  {
    id: 'ga-4',
    workstream: 'Gen AI L2/L2 Ops',
    activity: 'AI Assisted Incident summarization and RCA',
    startQuarter: 'Q3 2026',
    endQuarter: 'Q1 2027',
    startQKey: 'Q3',
    endQKey: 'Q1',
    status: 'IN_PROGRESS',
    badge: 'Active Q4 Execution',
    description: 'Automated extraction and summarization of ticket work-notes, logs, and RCA drafts for executive delivery.',
    techStack: ['Enterprise LLM', 'RAG Engine', 'TechHub'],
    impactOutcome: 'Auto-Draft RCA'
  },
  {
    id: 'ga-5',
    workstream: 'Gen AI L2/L2 Ops',
    activity: 'Automated Diagnostics',
    startQuarter: 'Q3 2026',
    endQuarter: 'Q1 2027',
    startQKey: 'Q3',
    endQKey: 'Q1',
    status: 'IN_PROGRESS',
    badge: 'Active Q4 Execution',
    description: 'Autonomous health check routines running deep diagnostic checks on compute, storage, and network latency.',
    techStack: ['Telemetry Collectors', 'Python Diagnostic Engine'],
    impactOutcome: 'Automated Triage'
  },
  {
    id: 'ga-6',
    workstream: 'Gen AI L2/L2 Ops',
    activity: 'Anomaly detections',
    startQuarter: 'Q3 2026',
    endQuarter: 'Q1 2027',
    startQKey: 'Q3',
    endQKey: 'Q1',
    status: 'IN_PROGRESS',
    badge: 'Active Q4 Execution',
    description: 'Time-series predictive models identifying anomalous compute and traffic spikes prior to business degradation.',
    techStack: ['Time-Series ML', 'SolarWinds ITOM'],
    impactOutcome: 'Proactive Alerting'
  },

  // 5. Agentic AI
  {
    id: 'ag-1',
    workstream: 'Agentic AI',
    activity: 'Evaluation, feasibility, development and deployment of one or two use cases',
    startQuarter: 'Q3 2026',
    endQuarter: 'Q1 2027',
    startQKey: 'Q3',
    endQKey: 'Q1',
    status: 'IN_PROGRESS',
    badge: 'Active Q4 Execution',
    description: 'Evaluation, architectural staging, and pilot deployment of initial conversational multi-agent workflows.',
    techStack: ['Multi-Agent Mesh', 'Power Virtual Agents'],
    impactOutcome: 'Pilot Deployed'
  },
  {
    id: 'ag-2',
    workstream: 'Agentic AI',
    activity: 'Chatbot Use case',
    startQuarter: 'Q3 2026',
    endQuarter: 'Q1 2027',
    startQKey: 'Q3',
    endQKey: 'Q1',
    status: 'IN_PROGRESS',
    badge: 'Active Q4 Execution',
    description: 'Conversational self-service assistant handling employee inquiries, status lookups, and standard FAQs.',
    techStack: ['Conversational AI', 'TechHub Portal'],
    impactOutcome: '24/7 Virtual Assistance'
  },
  {
    id: 'ag-3',
    workstream: 'Agentic AI',
    activity: 'Knowledge base use case',
    startQuarter: 'Q3 2026',
    endQuarter: 'Q1 2027',
    startQKey: 'Q3',
    endQKey: 'Q1',
    status: 'IN_PROGRESS',
    badge: 'Active Q4 Execution',
    description: 'Autonomous KB indexing and dynamic answer generation from verified SOP documentation and past tickets.',
    techStack: ['Semantic Vector Search', 'Enterprise KB'],
    impactOutcome: 'Instant Knowledge Retrieval'
  },
  {
    id: 'ag-4',
    workstream: 'Agentic AI',
    activity: 'Incident Resolution',
    startQuarter: 'Q3 2026',
    endQuarter: 'Q1 2027',
    startQKey: 'Q3',
    endQKey: 'Q1',
    status: 'IN_PROGRESS',
    badge: 'Active Q4 Execution',
    description: 'Multi-agent orchestration resolving standard IT incidents automatically with zero human touch.',
    techStack: ['Agentic Remediation Engine', 'Active Directory API'],
    impactOutcome: 'Zero-Touch Resolution'
  },
  {
    id: 'ag-5',
    workstream: 'Agentic AI',
    activity: 'Service Request fulfillment',
    startQuarter: 'Q3 2026',
    endQuarter: 'Q1 2027',
    startQKey: 'Q3',
    endQKey: 'Q1',
    status: 'IN_PROGRESS',
    badge: 'Active Q4 Execution',
    description: 'Autonomous end-to-end service request fulfillment for software access, license allocation, and mailbox provisioning.',
    techStack: ['Identity Governance', 'Exchange Online API', 'PowerShell'],
    impactOutcome: 'Target 30% Deflection'
  }
];

export const EXCEL_AIOPS_WORKSTREAMS: RoadmapWorkstream[] = [
  {
    id: 'automation_enhancement',
    title: 'Automation Enhancement',
    shortTitle: 'Auto Enhancement',
    iconName: 'Wrench',
    accentColor: '#0284C7',
    bgLight: '#E0F2FE',
    borderLight: '#BAE6FD',
    description: 'Platform integrations, workflow standardization, and cross-system orchestration.',
    activities: EXCEL_AIOPS_ROADMAP_ACTIVITIES.filter(a => a.workstream === 'Automation Enhancement')
  },
  {
    id: 'new_use_cases',
    title: 'New Automation Use Cases',
    shortTitle: 'New Use Cases',
    iconName: 'Workflow',
    accentColor: '#10B981',
    bgLight: '#E0ECE0',
    borderLight: '#6DA470',
    description: 'Pipeline expansion driven by incident trends, threshold alerts, and service requests.',
    activities: EXCEL_AIOPS_ROADMAP_ACTIVITIES.filter(a => a.workstream === 'New Automation Use Cases')
  },
  {
    id: 'tools_aiops',
    title: 'Tools + AIOps',
    shortTitle: 'Tools + AIOps',
    iconName: 'Cpu',
    accentColor: '#F59E0B',
    bgLight: '#FEF3C7',
    borderLight: '#F59E0B',
    description: 'Alert noise reduction on SolarWinds ITOM and predictive machine learning models.',
    activities: EXCEL_AIOPS_ROADMAP_ACTIVITIES.filter(a => a.workstream === 'Tools + AIOps')
  },
  {
    id: 'genai_ops',
    title: 'Gen AI L2/L2 Ops',
    shortTitle: 'Gen AI Ops',
    iconName: 'Sparkles',
    accentColor: '#8B5CF6',
    bgLight: '#F3E8FF',
    borderLight: '#D8B4FE',
    description: 'Generative AI assisted L2 troubleshooting, automated incident summarization, and RCA.',
    activities: EXCEL_AIOPS_ROADMAP_ACTIVITIES.filter(a => a.workstream === 'Gen AI L2/L2 Ops')
  },
  {
    id: 'agentic_ai',
    title: 'Agentic AI',
    shortTitle: 'Agentic AI',
    iconName: 'Bot',
    accentColor: '#E31837',
    bgLight: '#FBDCE1',
    borderLight: '#EB5D73',
    description: 'Autonomous multi-agent execution for end-to-end service request fulfillment & incident resolution.',
    activities: EXCEL_AIOPS_ROADMAP_ACTIVITIES.filter(a => a.workstream === 'Agentic AI')
  }
];
