import { MomActionItem, MeetingMetadata } from '../types';
import { 
  EXCEL_MOM_ACTIONS, 
  EXCEL_QUALYS_SUMMARY, 
  EXCEL_AUTOMATION_MONTHLY, 
  EXCEL_ITOPS_MONTHLY, 
  EXCEL_RISK_SUMMARY 
} from './excelDataSource';

export const meetingMetadata: MeetingMetadata = {
  subject: 'Strategic Leadership Connect — Monthly Service Review',
  meetingDate: '29-June-2026',
  timeRange: '16:00 – 17:00 GST',
  client: 'Dubai Holding',
  provider: 'Tech Mahindra',
  leadPresenter: 'Sudesh (TechM Delivery Head)',
  periodUnderReview: 'April – July 2026 (Snapshot: August 2026)'
};

// Map each action item strictly from EXCEL_MOM_ACTIONS (Sheet 02_MOM_Actions)
export const momActions: MomActionItem[] = EXCEL_MOM_ACTIONS.map(raw => {
  const actionNo = raw.Action_No;

  if (actionNo === 1) {
    return {
      actionNo: 1,
      title: 'New Contract Commencement & Value Co-Creation',
      category: 'Commercial & Service Governance',
      type: raw.Type,
      typeDescription: raw.Type_Description,
      owner: raw.Owner,
      originalDueDate: raw.Original_Due_Date,
      revisedDueDate: raw.Revised_Due_Date || undefined,
      status: raw.Status,
      remarks: raw.Remarks || 'Baseline established',
      sourcePage: raw.Source_Page,
      requiresAttention: false,
      story: {
        commitment: raw.Action,
        progress: {
          highlightText: 'Full operational stabilization across 10,800+ enterprise endpoints with 99.81% infrastructure availability maintained.',
          keyMetrics: [
            { label: 'Endpoints Managed', value: '10,800+' },
            { label: 'Contract Baseline', value: '1st Apr 2026' },
            { label: 'Infra Availability', value: '99.81%' }
          ],
          evidenceNote: 'Seamless handover without SLA disruption; 13 Infra risks identified and closed.'
        },
        currentState: {
          statusText: 'Closed — Baseline transition complete. Structured monthly value tracking initiated.',
          governanceNote: 'Transition phase concluded with full operating model stabilization.'
        },
        nextMove: {
          targetDate: 'Continuous',
          actionOwner: raw.Owner,
          strategicNextStep: 'Sustain SLA excellence across IT Infra and Cyber Security towers while scaling proactive co-creation initiatives.'
        }
      }
    };
  }

  if (actionNo === 2) {
    return {
      actionNo: 2,
      title: 'Automation & AI Progress Against 32 RFP Use Cases',
      category: 'Autonomous Operations & AI',
      type: raw.Type,
      typeDescription: raw.Type_Description,
      owner: raw.Owner,
      originalDueDate: raw.Original_Due_Date,
      revisedDueDate: raw.Revised_Due_Date || undefined,
      status: raw.Status,
      remarks: raw.Remarks || 'Included in deck',
      sourcePage: raw.Source_Page,
      requiresAttention: true,
      attentionReason: 'Cross-tenant service account permissions needed for live workflow orchestration.',
      story: {
        commitment: raw.Action,
        progress: {
          highlightText: '32 use cases structured across InfraOps & SecOps. 4,470 requests automated out of 22,319 Tech-hub SRs (20.0% touchless fulfillment).',
          keyMetrics: [
            { label: 'Use Case Pipeline', value: '32 Categories' },
            { label: 'Automated Requests', value: '4,470' },
            { label: 'Tech-Hub SR Total', value: '22,319' },
            { label: 'Autonomous Share', value: '20.0%' }
          ],
          evidenceNote: '16 SecOps and 16 InfraOps use cases active in deployment pipeline.'
        },
        currentState: {
          statusText: 'On going — Wave 1 use cases in production; autonomous multi-agent roadmap defined for Year 1.',
          completionPct: 68,
          governanceNote: 'ServiceDesk automation and bulk user provisioning active; server self-healing in validation.'
        },
        nextMove: {
          targetDate: '30-Sep-2026',
          actionOwner: 'TechM Automation Lead',
          strategicNextStep: 'Deploy remaining 14 automated workflows across SecOps and complete multi-agent ticket routing pilot.',
          leadershipActionNeeded: 'Approve entity-level service account permissions for cross-tenant automation runners.'
        }
      }
    };
  }

  if (actionNo === 3) {
    return {
      actionNo: 3,
      title: 'Qualys Patch Management Rollout',
      category: 'Vulnerability & Patch Governance',
      type: raw.Type,
      typeDescription: raw.Type_Description,
      owner: raw.Owner,
      originalDueDate: raw.Original_Due_Date,
      revisedDueDate: raw.Revised_Due_Date || undefined,
      status: raw.Status,
      remarks: raw.Remarks || 'Project progress tracking',
      sourcePage: raw.Source_Page,
      requiresAttention: true,
      attentionReason: 'Server reboot windows and CAR script testing require entity business unit alignment.',
      story: {
        commitment: raw.Action,
        progress: {
          highlightText: `${EXCEL_QUALYS_SUMMARY.completionPct.toFixed(2)}% overall rollout completed. ${EXCEL_QUALYS_SUMMARY.completedTaskCount} milestones closed; ${EXCEL_QUALYS_SUMMARY.ongoingTaskCount} tasks in flight across QGS, Windows endpoints, and Linux servers.`,
          keyMetrics: [
            { label: 'Rollout Progress', value: `${EXCEL_QUALYS_SUMMARY.completionPct.toFixed(2)}%` },
            { label: 'Completed Tasks', value: `${EXCEL_QUALYS_SUMMARY.completedTaskCount} / 29` },
            { label: 'Vuln Reduction', value: '253K → 96K' },
            { label: 'Target Completion', value: EXCEL_QUALYS_SUMMARY.planEndDate }
          ],
          evidenceNote: 'Open Critical-High-Medium vulnerabilities reduced by 62.00% (253K in Apr to 96K in Jul).'
        },
        currentState: {
          statusText: 'On going — Foundation complete; active patching execution on UAT and production rings.',
          completionPct: EXCEL_QUALYS_SUMMARY.completionPct,
          governanceNote: 'Agent profiles & QGS topology configured. Server CAR library scripts under testing.'
        },
        nextMove: {
          targetDate: EXCEL_QUALYS_SUMMARY.planEndDate,
          actionOwner: 'TechM Security PMO',
          strategicNextStep: 'Finalize CAR scripts for Windows/Linux servers and execute scheduled patch cycles across entities.',
          leadershipActionNeeded: 'Endorse maintenance reboot windows across business units for non-disruptive server patching.'
        }
      }
    };
  }

  if (actionNo === 4) {
    return {
      actionNo: 4,
      title: 'Open Ticket Summary & Automated Resolution Trending',
      category: 'Service Management & Delivery',
      type: raw.Type,
      typeDescription: raw.Type_Description,
      owner: raw.Owner,
      originalDueDate: raw.Original_Due_Date,
      revisedDueDate: raw.Revised_Due_Date || undefined,
      status: raw.Status,
      remarks: raw.Remarks || 'Included in deck',
      sourcePage: raw.Source_Page,
      requiresAttention: false,
      story: {
        commitment: raw.Action,
        progress: {
          highlightText: '27,806 total tickets closed across April–July 2026. 98.4% CSAT delivered with 99.4% change management success rate.',
          keyMetrics: [
            { label: 'Total Tickets Closed', value: '27,806' },
            { label: 'Avg CSAT Score', value: '98.4%' },
            { label: 'Change Success Rate', value: '99.4%' },
            { label: 'Major Incidents', value: 'Zero P1' }
          ],
          evidenceNote: 'Incident and SCTASK resolution volume steady across all support groups.'
        },
        currentState: {
          statusText: 'Closed — Complete multi-month trend analysis institutionalized in executive deck.',
          governanceNote: 'SLA attainment sustained above contractual thresholds across all 4 reporting months.'
        },
        nextMove: {
          targetDate: 'Continuous',
          actionOwner: raw.Owner,
          strategicNextStep: 'Drive First Contact Resolution (FCR) from 78% towards 85% via enhanced virtual agent self-help.'
        }
      }
    };
  }

  if (actionNo === 5) {
    return {
      actionNo: 5,
      title: 'On-Hold Ticket Justification & ITSM Tool Compliance Audit',
      category: 'Quality Assurance & Backlog Hygiene',
      type: raw.Type,
      typeDescription: raw.Type_Description,
      owner: raw.Owner,
      originalDueDate: raw.Original_Due_Date,
      revisedDueDate: raw.Revised_Due_Date || undefined,
      status: raw.Status,
      remarks: raw.Remarks || 'Pending Tickets Analysis updated',
      sourcePage: raw.Source_Page,
      requiresAttention: false,
      story: {
        commitment: raw.Action,
        progress: {
          highlightText: 'Backlog held within TechM assignment groups reduced to 39 pending tickets. 100% of on-hold items audited for valid caller/vendor dependencies.',
          keyMetrics: [
            { label: 'TechM Open Backlog', value: '39' },
            { label: 'Audit Compliance', value: '100%' },
            { label: 'Aged >30 Days', value: '0 Critical' }
          ],
          evidenceNote: 'Clear categorization between caller dependency, vendor hold, and change-freeze.'
        },
        currentState: {
          statusText: 'Closed — Backlog hygiene established with weekly automated compliance checks.',
          governanceNote: 'Zero unjustified on-hold tickets detected across support queues.'
        },
        nextMove: {
          targetDate: 'Continuous',
          actionOwner: raw.Owner,
          strategicNextStep: 'Maintain daily queue hygiene with automated escalation triggers on tickets approaching 5-day stagnation.'
        }
      }
    };
  }

  // Action No 6
  return {
    actionNo: 6,
    title: 'Single Pane of Glass via Azure Foundry Capabilities',
    category: 'Digital Innovation & Architecture',
    type: raw.Type,
    typeDescription: raw.Type_Description,
    owner: raw.Owner,
    originalDueDate: raw.Original_Due_Date,
    revisedDueDate: raw.Revised_Due_Date || undefined,
    status: raw.Status,
    remarks: raw.Remarks || '03 Foundry SMEs on-boarded',
    sourcePage: raw.Source_Page,
    requiresAttention: true,
    attentionReason: 'Requires Dubai Holding IT executive approval on identified Foundry use-cases and cloud tenancy access.',
    story: {
      commitment: raw.Action,
      progress: {
        highlightText: '3 dedicated Azure Foundry Subject Matter Experts onboarded. High-level architecture schema completed; 4 core operational use cases formulated for consolidation.',
        keyMetrics: [
          { label: 'Foundry SMEs Onboarded', value: '03' },
          { label: 'Consolidation Scope', value: '8 Dashboards' },
          { label: 'Target MVP Date', value: raw.Revised_Due_Date || '2026-09-30' }
        ],
        evidenceNote: 'Strategic initiative to replace multiple disparate reports with unified executive telemetry.'
      },
      currentState: {
        statusText: `Open (Revised Target: ${raw.Revised_Due_Date}) — SME team mobilized; formal use-case approval in progress.`,
        completionPct: 40,
        governanceNote: 'Draft blueprint completed. Awaiting Dubai Holding architectural review.'
      },
      nextMove: {
        targetDate: raw.Revised_Due_Date || '2026-09-30',
        actionOwner: raw.Owner,
        strategicNextStep: 'Conduct joint architectural workshop with Dubai Holding IT leadership to freeze MVP scope and initiate pipeline integration.',
        leadershipActionNeeded: 'Authorize cloud tenant environment access and sign off on Phase 1 use case priority list.'
      }
    }
  };
});

// Calculate summary counts dynamically directly from Excel actions
export const momSummary = {
  totalCommitments: momActions.length,
  closedCount: momActions.filter(a => a.status === 'Closed').length,
  ongoingCount: momActions.filter(a => a.status === 'On going').length,
  openCount: momActions.filter(a => a.status === 'Open').length,
  attentionCount: momActions.filter(a => a.requiresAttention).length,
  closureRatePct: Math.round((momActions.filter(a => a.status === 'Closed').length / momActions.length) * 100)
};
