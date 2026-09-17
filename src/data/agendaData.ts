import { AgendaItem } from '../types';
import { 
  EXCEL_MOM_ACTIONS, 
  EXCEL_QUALYS_SUMMARY, 
  EXCEL_RISK_SUMMARY 
} from './excelDataSource';

const closedCount = EXCEL_MOM_ACTIONS.filter(a => a.Status === 'Closed').length;
const totalCount = EXCEL_MOM_ACTIONS.length;

export const agendaItems: AgendaItem[] = [
  {
    id: '01-look-back',
    number: '01',
    title: 'Minutes of Previous Meeting',
    subtitle: 'Strategic Commitments & MOM Review',
    executiveQuestion: 'What did we commit to in our last connect and what happened?',
    keyMetricHighlight: {
      label: 'Commitments Closed',
      value: `${closedCount} of ${totalCount}`,
      sublabel: `${((closedCount / totalCount) * 100).toFixed(2)}% Execution Rate`,
      status: 'positive'
    },
    secondaryMetrics: [
      { label: 'Ongoing Initiatives', value: '2' },
      { label: 'Open Target (Foundry)', value: '1' },
      { label: 'Governance Adherence', value: '100.00%' }
    ],
    keyThemes: ['Contract Commencement', '32 Use Cases', 'Qualys Rollout', 'Ticket Trend', 'On-Hold Audit', 'Azure Foundry'],
    executiveTakeaway: 'Core transition stabilized; 3 commitments closed across contract baseline, ticket analysis, and compliance audit. Qualys rollout and Azure Foundry architecture underway.',
    sourcePages: [2, 3],
    position: { x: 80, y: 150 }
  },
  {
    id: '02-business-pulse',
    number: '02',
    title: 'IT Operations',
    subtitle: 'IT Operations & Stability (Apr–Jul)',
    executiveQuestion: 'Are enterprise operations and digital systems stable?',
    keyMetricHighlight: {
      label: 'Infra Availability',
      value: '99.81%',
      sublabel: 'Zero Major Incidents',
      status: 'positive'
    },
    secondaryMetrics: [
      { label: 'Tickets Closed (Apr–Jul)', value: '27,806' },
      { label: 'Customer CSAT', value: '4.54 / 5.00' },
      { label: 'Change Success Rate', value: '97.00%' }
    ],
    keyThemes: ['99.81% Infrastructure Availability', 'Zero Severity-1 Incidents', 'Contractual SLA Attainment', 'Stable Incident Queues'],
    executiveTakeaway: 'Operational availability sustained above 99.00% target across all 4 months; 27,806 total tickets resolved with 4.54 CSAT and zero P1 business outages.',
    sourcePages: [4, 5, 6],
    position: { x: 300, y: 320 }
  },
  {
    id: '03-service-experience',
    number: '03',
    title: 'Service Management',
    subtitle: 'Autonomous Service Desk Operations',
    executiveQuestion: 'Where is user demand originating and how is satisfaction trending?',
    keyMetricHighlight: {
      label: 'Managed Endpoints',
      value: '10,800+',
      sublabel: 'Omnichannel Routing',
      status: 'positive'
    },
    secondaryMetrics: [
      { label: 'FCR Attainment', value: '78.20%' },
      { label: 'Avg Speed of Answer', value: '< 20 sec' },
      { label: 'Self-Service Adoption', value: '+34.00%' }
    ],
    keyThemes: ['10,800+ Corporate Endpoints', 'Virtual Agent Triage', 'SLA Adherence', 'Omnichannel Channel Shifts'],
    executiveTakeaway: 'Omnichannel service desk processing 10.8K+ endpoints with shift towards self-service portal, virtual assistants, and swift first-contact resolution.',
    sourcePages: [6, 7],
    position: { x: 520, y: 150 }
  },
  {
    id: '04-autonomous-ops',
    number: '04',
    title: 'Autonomous Operations',
    subtitle: 'Automation Pipeline & 32 Use Cases',
    executiveQuestion: 'Are we reducing manual operational dependency through AI?',
    keyMetricHighlight: {
      label: 'Automated Requests',
      value: '4,470',
      sublabel: '32 Use Cases (16 Infra + 16 Sec)',
      status: 'positive'
    },
    secondaryMetrics: [
      { label: 'Tech-Hub SR Volume', value: '22,319' },
      { label: 'Automation Achieved', value: '16.7%' },
      { label: 'SecOps Workflows', value: '16 Use Cases' }
    ],
    keyThemes: ['32 Use Case Deployments', '4,470 Zero-Touch Executions', 'Multi-Agent Routing Pilot', 'Automated Account Provisioning'],
    executiveTakeaway: '16.7% of total inbound service demand resolved with zero-touch automation (4,470 of 26,789 total requests); 32 RFP use cases progressing to autonomous execution across SecOps and InfraOps.',
    sourcePages: [8, 9, 10, 24],
    position: { x: 740, y: 320 }
  },
  {
    id: '05-vulnerability',
    number: '05',
    title: 'Vulnerability Management',
    subtitle: 'Vulnerability Remediation & Posture',
    executiveQuestion: 'Where could security posture or exposure deteriorate?',
    keyMetricHighlight: {
      label: 'Vuln Reduction',
      value: '-62.00%',
      sublabel: '252K Open · 25K Approved',
      status: 'positive'
    },
    secondaryMetrics: [
      { label: 'Total Open', value: '252,000' },
      { label: 'Exclusions Approved', value: '25,000' },
      { label: 'Mitigation Rate', value: '62.00%' }
    ],
    keyThemes: ['62.00% Backlog Elimination', 'Appreciation Note from DH', '25K Exclusions Approved', 'Active Remediation Tracking'],
    executiveTakeaway: 'Critical/High vulnerability backlog at 252,000 total open with 25,000 exclusions approved and ongoing patch mitigation; consistent month-over-month decline from Mar to Jul.',
    sourcePages: [11, 12, 20],
    position: { x: 960, y: 150 }
  },
  {
    id: '06-delivery',
    number: '06',
    title: 'Delivery',
    subtitle: 'Projects, Demands & Qualys Rollout',
    executiveQuestion: 'Are strategic transformation programs executing to schedule?',
    keyMetricHighlight: {
      label: 'Qualys Rollout',
      value: `${EXCEL_QUALYS_SUMMARY.completionPct.toFixed(2)}%`,
      sublabel: `${EXCEL_QUALYS_SUMMARY.ongoingTaskCount} Tasks In Flight`,
      status: 'attention'
    },
    secondaryMetrics: [
      { label: 'Completed Milestones', value: `${EXCEL_QUALYS_SUMMARY.completedTaskCount} / 29` },
      { label: 'Open Backlog Tickets', value: '39' },
      { label: 'Target Completion', value: '09 Oct 2026' }
    ],
    keyThemes: ['Qualys Architecture & Tagging', 'Server CAR Library Scripts', 'Backlog Audited (39 Tickets)', 'UAT/Prod Staging'],
    executiveTakeaway: `Qualys patch governance underway targeting 09 Oct 2026 completion; 39 pending tickets held with 100.00% audit hygiene across queues.`,
    sourcePages: [16, 17, 18],
    position: { x: 1180, y: 320 }
  },
  {
    id: '07-risk',
    number: '07',
    title: 'Risk Management',
    subtitle: 'Risk Dashboard & Overdue Detail',
    executiveQuestion: 'Where could performance or risk dependencies impact operations?',
    keyMetricHighlight: {
      label: 'Risks Closed',
      value: `${EXCEL_RISK_SUMMARY.Closed || 543}`,
      sublabel: 'Mitigation Adherence',
      status: 'positive'
    },
    secondaryMetrics: [
      { label: 'Overdue Risks', value: '5' },
      { label: 'VMware Dependency', value: '4' },
      { label: 'Entity Dependency', value: '1' }
    ],
    keyThemes: ['543 Mitigated Risks', '5 Overdue Items Under Control', 'VMware License Tracking', 'Entity Dependency Resolution'],
    executiveTakeaway: `${EXCEL_RISK_SUMMARY.Closed || 543} risks closed to date; 5 overdue risks managed under active mitigation across VMware and Entity dependencies.`,
    sourcePages: [21, 22],
    position: { x: 1400, y: 150 }
  },
  {
    id: '08-value-creation',
    number: '08',
    title: 'Value Creation',
    subtitle: 'Cost Optimization & Financial Savings',
    executiveQuestion: 'What measurable financial and operational value was delivered?',
    keyMetricHighlight: {
      label: 'Total Annual Savings',
      value: '$485,628',
      sublabel: 'Apr–Jul 2026 Optimization',
      status: 'positive'
    },
    secondaryMetrics: [
      { label: 'Automation Savings', value: '$454,428' },
      { label: 'CSI Savings', value: '$31,200' },
      { label: 'Highest Month (July)', value: '$257,748' }
    ],
    keyThemes: ['Automation License Release', 'CSI SharePoint Optimization', '704 Licenses Reclaimed', 'Measurable ROI'],
    executiveTakeaway: '$485,628 in total annual cost savings achieved across Apr–Jul 2026, accelerated by $454K in automation license optimization and $31.2K in SharePoint storage CSI efficiencies.',
    sourcePages: [13, 14, 15],
    position: { x: 1620, y: 320 }
  },
  {
    id: '09-forward-view',
    number: '09',
    title: 'Forward View',
    subtitle: 'AIOps Roadmap & Executive Actions',
    executiveQuestion: 'What requires leadership decisions and sponsorship next?',
    keyMetricHighlight: {
      label: 'Key Focus Areas',
      value: '20',
      sublabel: 'Year 1 AI Roadmap',
      status: 'attention'
    },
    secondaryMetrics: [],
    keyThemes: ['Azure Foundry Architecture Signoff', 'Qualys Server Patch Windows', 'Cross-Tenant Automation Clearance', 'Year-1 AIOps Execution'],
    executiveTakeaway: 'Decisions needed: Azure Foundry single-pane pilot approval, server reboot windows for Qualys patching, and cross-tenant automation access.',
    sourcePages: [23, 25],
    position: { x: 1840, y: 150 }
  }
];
