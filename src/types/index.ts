export type SectionId = 
  | '01-look-back'
  | '02-business-pulse'
  | '03-service-experience'
  | '04-autonomous-ops'
  | '05-vulnerability'
  | '06-delivery'
  | '07-risk'
  | '08-value-creation'
  | '09-forward-view';

export interface AgendaItem {
  id: SectionId;
  number: string;
  title: string;
  subtitle: string;
  executiveQuestion: string;
  keyMetricHighlight: {
    label: string;
    value: string;
    sublabel?: string;
    status?: 'positive' | 'neutral' | 'attention';
  };
  secondaryMetrics?: {
    label: string;
    value: string;
  }[];
  keyThemes?: string[];
  executiveTakeaway: string;
  sourcePages: number[];
  position: { x: number; y: number };
}

export type MomActionStatus = 'Closed' | 'On going' | 'Open';
export type MomActionType = 'I' | 'A'; // Information | Action

export interface MomStoryArc {
  commitment: string;
  progress: {
    highlightText: string;
    keyMetrics?: { label: string; value: string; unit?: string }[];
    evidenceNote: string;
  };
  currentState: {
    statusText: string;
    governanceNote: string;
    completionPct?: number;
  };
  nextMove: {
    targetDate: string;
    actionOwner: string;
    strategicNextStep: string;
    leadershipActionNeeded?: string;
  };
}

export interface MomActionItem {
  actionNo: number;
  title: string;
  category: string;
  type: MomActionType;
  typeDescription: string;
  owner: string;
  originalDueDate: string;
  revisedDueDate?: string;
  status: MomActionStatus;
  remarks: string;
  sourcePage: number;
  requiresAttention: boolean;
  attentionReason?: string;
  story: MomStoryArc;
}

export interface MeetingMetadata {
  subject: string;
  meetingDate: string;
  timeRange: string;
  client: string;
  provider: string;
  leadPresenter: string;
  periodUnderReview: string;
}
