// ============================================================================
// DUBAI HOLDINGS & TECH MAHINDRA MANAGED SERVICES
// SLIDE 06 DATA MODEL: SERVICE MANAGEMENT DASHBOARD
// Source: 08_ServiceDesk_KPIs, 09_ServiceDesk_Volumes from DH_TechM_Managed_Services_BI_Source.xlsx
// ============================================================================

export interface ServiceFootprintMetric {
  label: string;
  value: string;
  subtext: string;
  iconName: string;
}

export interface JulyChannelVolumetric {
  channel: string;
  volume: number;
  sharePct: number;
  color: string;
  icon: string;
  speedOrNote: string;
}

export interface ServiceDeskParameterTrend {
  parameter: string;
  category: string;
  baseline: string;
  apr: string;
  may: string;
  jun: string;
  jul: string;
  unit: string;
  status: 'positive' | 'neutral' | 'attention';
  varianceVsBaseline: string;
}

// Enterprise Footprint
export const serviceFootprint: ServiceFootprintMetric[] = [
  {
    label: 'End Points Devices',
    value: '10,800+',
    subtext: 'Managed Corporate Assets & Laptops',
    iconName: 'Laptop'
  },
  {
    label: 'Users Count',
    value: '18,300+',
    subtext: 'Active Corporate Employees & Contractors',
    iconName: 'Users'
  },
  {
    label: 'July Interaction Volume',
    value: '8,402',
    subtext: 'Omnichannel Contacts Handled',
    iconName: 'Activity'
  }
];

// July Omnichannel Volumetrics
export const julyOmnichannelVolumes: JulyChannelVolumetric[] = [
  {
    channel: 'Tickets (ITSM)',
    volume: 3703,
    sharePct: 44.07,
    color: '#E31837', // Orange
    icon: 'Ticket',
    speedOrNote: 'ServiceNow Portal Requests & Tasks'
  },
  {
    channel: 'Email',
    volume: 3516,
    sharePct: 41.85,
    color: '#38BDF8', // Sky Blue
    icon: 'Mail',
    speedOrNote: '128% surge in July vs Q1 baseline'
  },
  {
    channel: 'Voice Calls',
    volume: 1129,
    sharePct: 13.44,
    color: '#10B981', // Emerald
    icon: 'PhoneCall',
    speedOrNote: 'Avg Talk: 2:05 min | Answer: 0:06 sec'
  },
  {
    channel: 'System Notifications',
    volume: 54,
    sharePct: 0.64,
    color: '#8B5CF6', // Purple
    icon: 'Bell',
    speedOrNote: 'Automated Broadcast Alerts'
  }
];

export const julyTotalInteractions = 8402;

// Service Desk Parameters (KPI / SLA Trend)
export const serviceDeskKPIParameters: ServiceDeskParameterTrend[] = [
  {
    parameter: 'Average Call talk time',
    category: 'VOICE EFFICIENCY',
    baseline: '10:00',
    apr: '2:05',
    may: '2:12',
    jun: '2:21',
    jul: '2:05',
    unit: 'min:sec',
    status: 'positive',
    varianceVsBaseline: '79.2% faster than 10-min SLA ceiling'
  },
  {
    parameter: 'Average Answer Time',
    category: 'RESPONSIVENESS',
    baseline: '0:10',
    apr: '0:06',
    may: '0:06',
    jun: '0:07',
    jul: '0:06',
    unit: 'min:sec',
    status: 'positive',
    varianceVsBaseline: '40% below 10-second SLA limit'
  },
  {
    parameter: 'Email',
    category: 'CHANNEL SHIFT',
    baseline: 'NA',
    apr: '1846',
    may: '1472',
    jun: '1542',
    jul: '3516',
    unit: 'count',
    status: 'attention',
    varianceVsBaseline: '+128% interaction surge in July'
  },
  {
    parameter: 'Notifications',
    category: 'BROADCAST OPS',
    baseline: 'NA',
    apr: '58',
    may: '49',
    jun: '49',
    jul: '54',
    unit: 'count',
    status: 'positive',
    varianceVsBaseline: 'Steady enterprise broadcast flow'
  }
];

// Service Desk Executive Takeaways
export const serviceDeskTakeaways = [
  {
    id: 1,
    title: 'Rapid Voice Response Time',
    detail: 'Average call answer time achieved 6 seconds in July (against 10s baseline limit) with talk time under 2:05 minutes.',
    badge: 'BENCHMARK MET'
  },
  {
    id: 2,
    title: 'Surge in Inbound Email Contacts',
    detail: 'Email contacts climbed to 3,516 in July (+128%), signaling an opportunity to redirect users to self-service AI bot and portal workflows.',
    badge: 'OPPORTUNITY'
  },
  {
    id: 3,
    title: 'Enterprise Scale Operational Footprint',
    detail: 'Seamlessly supporting 18,300+ users across 10,800+ managed devices with zero operational degradation.',
    badge: 'STABLE FOOTPRINT'
  }
];
