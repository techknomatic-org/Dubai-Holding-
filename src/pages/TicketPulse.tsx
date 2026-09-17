import React, { useState, useEffect } from 'react';
import { useLiveData } from '../hooks/useLiveData';
import { LiveDataBadge } from '../components/LiveDataBadge';
import {
  Activity,
  Zap,
  Shield,
  Clock,
  CheckCircle2,
  FileText,
  Laptop,
  Users,
  Layers,
  BarChart2,
  Ticket,
  PhoneCall,
  Mail,
  Bell,
  AlertTriangle,
  FolderTree,
  Server,
  Network,
  Cloud,
  Database,
  Lock,
  ChevronRight,
  Info,
  X,
  PauseCircle,
  FileSpreadsheet
} from 'lucide-react';
import {
  PENDING_BACKLOG_DATA,
  EXCEL_TAB4_HOLD_REASONS,
  PendingGroupAgeing,
  HoldReasonRecord
} from '../data/pendingBacklogData';

interface TicketPulseProps {
  onNavigateToNext?: () => void;
  onNavigateToPrev?: () => void;
}

export const TicketPulse: React.FC<TicketPulseProps> = ({
  onNavigateToNext,
  onNavigateToPrev
}) => {
  // Live data from SharePoint Excel (Sheet 4: '4. Tickets' and Sheet 7: '7. Automation & Hygiene')
  const { data: liveData, isLoading, isRefreshing, error, lastUpdatedDisplay, dataSource, refresh } = useLiveData();

  // Safe destructuring of live SharePoint / Excel data
  const ticketMonthlyClosures = Array.isArray(liveData?.ticketClosures) && liveData.ticketClosures.length > 0
    ? liveData.ticketClosures
    : [];
  const ticketSummaryKPIs = liveData?.ticketSummaryKPIs ?? {
    totalClosed: 27806,
    incidentsClosed: 5487,
    serviceRequestsClosed: 22319,
    incidentPct: 19.73,
    serviceRequestPct: 80.27,
    monthlyAvg: 6952,
    actualMonthsCount: 4
  };
  const topIncidentCategories = Array.isArray(liveData?.incidentCategories) ? liveData.incidentCategories : [];
  const topServiceRequestCategories = Array.isArray(liveData?.srCategories) ? liveData.srCategories : [];

  const serviceFootprint = Array.isArray(liveData?.serviceFootprint) ? liveData.serviceFootprint : [];
  const julyOmnichannelVolumes = Array.isArray(liveData?.omnichannelVolumes) ? liveData.omnichannelVolumes : [];
  const julyTotalInteractions = typeof liveData?.totalInteractions === 'number' ? liveData.totalInteractions : 8402;
  const serviceDeskKPIParameters = Array.isArray(liveData?.kpiParameters) ? liveData.kpiParameters : [];

  // Format endpoints and users count dynamically
  const formatFootprintNumber = (val: string | undefined, defaultVal: string) => {
    if (!val || val.toLowerCase().includes('end') || val.toLowerCase().includes('device') || val.toLowerCase().includes('user')) {
      return defaultVal;
    }
    if (val.includes('10800') || val === '10800+') return '10,800+';
    if (val.includes('18300') || val === '18300+') return '18,300+';
    return val;
  };
  const rawEndpoints = serviceFootprint.find(f => f.iconName === 'Laptop' || f.label.toLowerCase().includes('end'))?.value;
  const rawUsers = serviceFootprint.find(f => f.iconName === 'Users' || f.label.toLowerCase().includes('user'))?.value;
  const endPointsValue = formatFootprintNumber(rawEndpoints, '10,800+');
  const usersCountValue = formatFootprintNumber(rawUsers, '18,300+');

  // Extract July volumetrics
  const ticketsVolume = julyOmnichannelVolumes.find(v => v.channel.toLowerCase().includes('ticket'))?.volume ?? 3703;
  const callsVolume = julyOmnichannelVolumes.find(v => v.channel.toLowerCase().includes('voice') || v.channel.toLowerCase().includes('call'))?.volume ?? 1129;
  const emailVolume = julyOmnichannelVolumes.find(v => v.channel.toLowerCase().includes('email') || v.channel.toLowerCase().includes('mail'))?.volume ?? 3516;
  const notifVolume = julyOmnichannelVolumes.find(v => v.channel.toLowerCase().includes('notif'))?.volume ?? 54;
  const totalVolume = julyTotalInteractions || (ticketsVolume + callsVolume + emailVolume + notifVolume);

  // States
  const [activeTab, setActiveTab] = useState<'pies' | 'requests' | 'incidents' | 'backlog'>('pies');
  const [backlogFilter, setBacklogFilter] = useState<'all' | 'onhold' | 'inc' | 'sctask' | 'causes'>('all');
  const [selectedHoldType, setSelectedHoldType] = useState<'ALL' | 'Incident' | 'SCTASK'>('ALL');
  const [hoveredIncSlice, setHoveredIncSlice] = useState<string | null>(null);
  const [hoveredSrSlice, setHoveredSrSlice] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'trend' | 'cards' | 'matrix'>('trend');
  const [animStage, setAnimStage] = useState<number>(0);

  // Hierarchical Drill-Down Modal States (3-Level Architecture)
  const [isPendingDrilldownOpen, setIsPendingDrilldownOpen] = useState<boolean>(false);
  const [drilldownLevel, setDrilldownLevel] = useState<1 | 2 | 3>(1);
  const [selectedDrilldownCategory, setSelectedDrilldownCategory] = useState<'INC' | 'SCTASK' | 'ONHOLD' | null>(null);
  const [selectedDrilldownGroup, setSelectedDrilldownGroup] = useState<PendingGroupAgeing | null>(null);
  const [selectedDrilldownHoldReason, setSelectedDrilldownHoldReason] = useState<HoldReasonRecord | null>(null);
  const [hoveredBracketIdx, setHoveredBracketIdx] = useState<number | null>(null);

  // Excel Tab 4 Live Data Hold Reasons & Ageing Groups
  const liveHoldReasons = (Array.isArray(liveData?.holdReasons) && liveData.holdReasons.length > 0
    ? liveData.holdReasons
    : EXCEL_TAB4_HOLD_REASONS) as HoldReasonRecord[];

  const livePendingGroups = (Array.isArray(liveData?.pendingAgeingGroups) && liveData.pendingAgeingGroups.length > 0
    ? liveData.pendingAgeingGroups
    : [
        ...PENDING_BACKLOG_DATA.sctaskGroups,
        ...PENDING_BACKLOG_DATA.incidentGroups
      ]) as PendingGroupAgeing[];

  const totalOnHoldCount = liveHoldReasons.reduce((acc, h) => acc + h.count, 0) || PENDING_BACKLOG_DATA.totalOnHold;
  const incOnHoldCount = liveHoldReasons.filter(h => h.ticketType === 'Incident').reduce((acc, h) => acc + h.count, 0) || PENDING_BACKLOG_DATA.incidentOnHold;
  const sctaskOnHoldCount = liveHoldReasons.filter(h => h.ticketType === 'SCTASK').reduce((acc, h) => acc + h.count, 0) || PENDING_BACKLOG_DATA.sctaskOnHold;

  // Handler to open Hierarchical Drilldown at specified level
  const openDrilldown = (level: 1 | 2 | 3 = 1, category: 'INC' | 'SCTASK' | 'ONHOLD' | null = null, group: PendingGroupAgeing | null = null, holdReason: HoldReasonRecord | null = null) => {
    setDrilldownLevel(level);
    setSelectedDrilldownCategory(category);
    setSelectedDrilldownGroup(group);
    setSelectedDrilldownHoldReason(holdReason);
    setIsPendingDrilldownOpen(true);
  };

  const closeDrilldown = () => {
    setIsPendingDrilldownOpen(false);
    // Reset state after transition
    setTimeout(() => {
      setDrilldownLevel(1);
      setSelectedDrilldownCategory(null);
      setSelectedDrilldownGroup(null);
      setSelectedDrilldownHoldReason(null);
    }, 200);
  };

  // Animated counters
  const [animatedVolumes, setAnimatedVolumes] = useState({
    tickets: 0,
    calls: 0,
    email: 0,
    notif: 0,
    total: 0
  });

  useEffect(() => {
    const t1 = setTimeout(() => setAnimStage(1), 50);
    const t2 = setTimeout(() => {
      setAnimStage(2);

      // Smooth count-up animation
      const duration = 750;
      const startTime = performance.now();
      const frame = (time: number) => {
        const progress = Math.min(1, (time - startTime) / duration);
        const ease = 1 - Math.pow(1 - progress, 3);
        setAnimatedVolumes({
          tickets: Math.round(ease * ticketsVolume),
          calls: Math.round(ease * callsVolume),
          email: Math.round(ease * emailVolume),
          notif: Math.round(ease * notifVolume),
          total: Math.round(ease * totalVolume)
        });
        if (progress < 1) requestAnimationFrame(frame);
      };
      requestAnimationFrame(frame);
    }, 150);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [ticketsVolume, callsVolume, emailVolume, notifVolume, totalVolume]);

  // Operational Months data
  const actualMonths = ticketMonthlyClosures.filter(m => m.isActual && m.total > 0);
  const safeActuals = actualMonths.length > 0 ? actualMonths : [
    { monthKey: '2026-04', monthLabel: 'Apr', incidents: 1488, serviceRequests: 6519, total: 8007, isActual: true },
    { monthKey: '2026-05', monthLabel: 'May', incidents: 1325, serviceRequests: 4340, total: 5665, isActual: true },
    { monthKey: '2026-06', monthLabel: 'Jun', incidents: 1176, serviceRequests: 5882, total: 7058, isActual: true },
    { monthKey: '2026-07', monthLabel: 'Jul', incidents: 1498, serviceRequests: 5578, total: 7076, isActual: true }
  ];

  // Interactive Month Selection for Top 3 KPI Cards
  const [selectedTotalMonth, setSelectedTotalMonth] = useState<string | null>(null);
  const [selectedSrMonth, setSelectedSrMonth] = useState<string | null>(null);
  const [selectedIncMonth, setSelectedIncMonth] = useState<string | null>(null);

  // Helper for generating High-End Top Hero Card Sparkline Curves with interactive month selection
  const renderSparkline = (
    data: number[],
    labels: string[],
    color: string,
    gradId: string,
    minVal: number,
    maxVal: number,
    selectedMonth: string | null,
    onSelectMonth: (month: string | null) => void
  ) => {
    const width = 210;
    const height = 56;
    const padX = 22;
    const padTop = 10;
    const padBottom = 16;
    const graphW = width - padX * 2;
    const graphH = height - padTop - padBottom;

    const points = data.map((val, idx) => {
      const x = padX + (idx / (data.length - 1)) * graphW;
      const clamped = Math.max(minVal, Math.min(maxVal, val));
      const y = height - padBottom - ((clamped - minVal) / (maxVal - minVal)) * graphH;
      return { x, y, val, label: labels[idx] };
    });

    let path = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i];
      const p1 = points[i + 1];
      const cx1 = p0.x + (p1.x - p0.x) * 0.45;
      const cy1 = p0.y;
      const cx2 = p0.x + (p1.x - p0.x) * 0.55;
      const cy2 = p1.y;
      path += ` C ${cx1} ${cy1}, ${cx2} ${cy2}, ${p1.x} ${p1.y}`;
    }

    const areaPath = `${path} L ${points[points.length - 1].x} ${height - padBottom} L ${points[0].x} ${height - padBottom} Z`;

    return (
      <svg className="w-full h-full overflow-visible" viewBox={`0 0 ${width} ${height}`}>
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={color} stopOpacity="0.22" />
            <stop offset="100%" stopColor={color} stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Subtle Horizontal Baseline Guide */}
        <line
          x1={padX - 4}
          y1={height - padBottom}
          x2={width - padX + 4}
          y2={height - padBottom}
          stroke="currentColor"
          strokeOpacity="0.08"
          strokeDasharray="2 2"
        />

        {/* Shaded Area */}
        <path d={areaPath} fill={`url(#${gradId})`} />

        {/* Spline Path */}
        <path
          d={path}
          fill="none"
          stroke={color}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Interactive Data points, selection rings & month labels */}
        {points.map((p, idx) => {
          const isSelected = selectedMonth === p.label;
          const isLatest = idx === points.length - 1 && !selectedMonth;
          const isHighlighted = isSelected || isLatest;

          return (
            <g
              key={idx}
              className="cursor-pointer group"
              onClick={(e) => {
                e.stopPropagation();
                onSelectMonth(selectedMonth === p.label ? null : p.label);
              }}
            >
              {/* Invisible expanded hit target */}
              <circle cx={p.x} cy={p.y} r="12" fill="transparent" />

              {/* Vertical subtle indicator line */}
              <line
                x1={p.x}
                y1={p.y}
                x2={p.x}
                y2={height - padBottom}
                stroke={color}
                strokeOpacity={isHighlighted ? "0.45" : "0.12"}
                strokeWidth={isHighlighted ? "1.5" : "1"}
                strokeDasharray={isHighlighted ? "none" : "2 2"}
              />

              {/* Data Point Dot */}
              <circle
                cx={p.x}
                cy={p.y}
                r={isSelected ? "4.5" : isLatest ? "3.8" : "3"}
                fill={isSelected ? color : isLatest ? color : "#FFFFFF"}
                stroke={color}
                strokeWidth={isSelected ? "2.5" : "1.8"}
                className="transition-transform duration-200 group-hover:scale-125"
              />

              {/* Month Label */}
              <text
                x={p.x}
                y={height - 2}
                textAnchor="middle"
                fontSize="7.5"
                fontWeight={isHighlighted ? "700" : "500"}
                fill={isSelected ? color : "currentColor"}
                className={`font-mono select-none ${isHighlighted ? 'text-slate-900 dark:text-white font-bold' : 'text-slate-400 dark:text-slate-500'}`}
              >
                {p.label}
              </text>
            </g>
          );
        })}
      </svg>
    );
  };

  // Helper for generating Mini Trend Graphs for the 4 Service Desk Parameters
  const renderMiniTrendGraph = (
    labels: string[],
    displayValues: string[],
    numericValues: number[],
    color: string,
    gradId: string,
    minVal: number,
    maxVal: number
  ) => {
    const width = 220;
    const height = 96;
    const padX = 22;
    const padTop = 20;
    const padBottom = 16;
    const graphW = width - padX * 2;
    const graphH = height - padTop - padBottom;

    const points = numericValues.map((val, idx) => {
      const x = padX + (idx / (numericValues.length - 1)) * graphW;
      const clamped = Math.max(minVal, Math.min(maxVal, val));
      const y = height - padBottom - ((clamped - minVal) / (maxVal - minVal)) * graphH;
      return { x, y, val: displayValues[idx], label: labels[idx] };
    });

    let path = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i];
      const p1 = points[i + 1];
      const cx1 = p0.x + (p1.x - p0.x) * 0.45;
      const cy1 = p0.y;
      const cx2 = p0.x + (p1.x - p0.x) * 0.55;
      const cy2 = p1.y;
      path += ` C ${cx1} ${cy1}, ${cx2} ${cy2}, ${p1.x} ${p1.y}`;
    }

    const areaPath = `${path} L ${points[points.length - 1].x} ${height - padBottom} L ${points[0].x} ${height - padBottom} Z`;

    return (
      <svg className="w-full h-full overflow-visible" viewBox={`0 0 ${width} ${height}`}>
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={color} stopOpacity="0.25" />
            <stop offset="100%" stopColor={color} stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Subtle Horizontal Reference Line */}
        <line
          x1={padX - 4}
          y1={height - padBottom}
          x2={width - padX + 4}
          y2={height - padBottom}
          stroke="currentColor"
          strokeOpacity="0.08"
          strokeDasharray="2 2"
        />

        {/* Shaded Gradient Area */}
        <path d={areaPath} fill={`url(#${gradId})`} />

        {/* Spline Path */}
        <path
          d={path}
          fill="none"
          stroke={color}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Data points & labels */}
        {points.map((p, idx) => {
          const isLatest = idx === points.length - 1;
          return (
            <g key={idx}>
              {/* Subtle vertical connector */}
              <line
                x1={p.x}
                y1={p.y}
                x2={p.x}
                y2={height - padBottom}
                stroke={color}
                strokeOpacity={isLatest ? "0.35" : "0.12"}
                strokeWidth={isLatest ? "1.5" : "1"}
                strokeDasharray={isLatest ? "none" : "2 2"}
              />

              {/* Dot */}
              <circle
                cx={p.x}
                cy={p.y}
                r={isLatest ? "3.8" : "3"}
                fill={color}
                stroke="#FFFFFF"
                strokeWidth={isLatest ? "2" : "1.5"}
              />

              {/* Display Value */}
              <text
                x={p.x}
                y={Math.max(10, p.y - 5)}
                textAnchor="middle"
                fontSize="8.5"
                fontWeight="800"
                fill={color}
                className="font-mono select-none"
              >
                {p.val}
              </text>

              {/* Month Axis */}
              <text
                x={p.x}
                y={height - 2}
                textAnchor="middle"
                fontSize="7.5"
                fontWeight={isLatest ? "700" : "500"}
                fill="currentColor"
                className={`font-mono select-none ${isLatest ? 'text-slate-800 dark:text-white' : 'text-slate-400 dark:text-slate-500'}`}
              >
                {p.label}
              </text>
            </g>
          );
        })}
      </svg>
    );
  };

  // Controlled Enterprise Color Palette for Groups
  const GROUP_COLORS = {
    Infra: '#0A0838',        // Deep Navy
    'Service Desk': '#3A59A4', // Corporate Blue
    EUS: '#F8B4A3',          // Peach
    Security: '#4D4D4F'      // Charcoal
  };

  const incPieData = [
    { label: 'Infra', pct: 78.06, count: 4283, color: GROUP_COLORS.Infra },
    { label: 'EUS', pct: 11.61, count: 637, color: GROUP_COLORS.EUS },
    { label: 'Service Desk', pct: 9.08, count: 498, color: GROUP_COLORS['Service Desk'] },
    { label: 'Security', pct: 1.26, count: 69, color: GROUP_COLORS.Security }
  ];

  const srPieData = [
    { label: 'Service Desk', pct: 64.70, count: 14441, color: GROUP_COLORS['Service Desk'] },
    { label: 'Infra', pct: 22.79, count: 5086, color: GROUP_COLORS.Infra },
    { label: 'EUS', pct: 6.45, count: 1439, color: GROUP_COLORS.EUS },
    { label: 'Security', pct: 6.06, count: 1353, color: GROUP_COLORS.Security }
  ];

  // Helper to render High-End Executive Donut Slices
  const renderDonutSvg = (
    slices: { label: string; pct: number; count: number; color: string }[],
    hoveredSlice: string | null,
    setHoveredSlice: (s: string | null) => void,
    cx = 75,
    cy = 75,
    r = 58,
    innerR = 38
  ) => {
    let cumulativeAngle = -Math.PI / 2;

    return slices.map(s => {
      const sliceAngle = (s.pct / 100) * (2 * Math.PI);
      const startAngle = cumulativeAngle;
      const endAngle = cumulativeAngle + sliceAngle;
      cumulativeAngle += sliceAngle;

      const isHovered = hoveredSlice === s.label;
      const currentR = isHovered ? r + 3 : r;
      const currentInnerR = isHovered ? innerR - 1 : innerR;

      const x1 = cx + currentR * Math.cos(startAngle);
      const y1 = cy + currentR * Math.sin(startAngle);
      const x2 = cx + currentR * Math.cos(endAngle);
      const y2 = cy + currentR * Math.sin(endAngle);

      const ix1 = cx + currentInnerR * Math.cos(startAngle);
      const iy1 = cy + currentInnerR * Math.sin(startAngle);
      const ix2 = cx + currentInnerR * Math.cos(endAngle);
      const iy2 = cy + currentInnerR * Math.sin(endAngle);

      const largeArcFlag = s.pct > 50 ? 1 : 0;
      const midAngle = startAngle + sliceAngle / 2;
      const offsetX = isHovered ? Math.cos(midAngle) * 3 : 0;
      const offsetY = isHovered ? Math.sin(midAngle) * 3 : 0;

      const pathData = `
        M ${ix1 + offsetX} ${iy1 + offsetY}
        L ${x1 + offsetX} ${y1 + offsetY}
        A ${currentR} ${currentR} 0 ${largeArcFlag} 1 ${x2 + offsetX} ${y2 + offsetY}
        L ${ix2 + offsetX} ${iy2 + offsetY}
        A ${currentInnerR} ${currentInnerR} 0 ${largeArcFlag} 0 ${ix1 + offsetX} ${iy1 + offsetY}
        Z
      `;

      return (
        <path
          key={s.label}
          d={pathData}
          fill={s.color}
          stroke="#FFFFFF"
          strokeWidth="2"
          className="transition-all duration-300 cursor-pointer"
          style={{
            filter: isHovered
              ? `drop-shadow(0 6px 12px ${s.color}66)`
              : 'drop-shadow(0 2px 4px rgba(0,0,0,0.08))',
            transform: isHovered ? 'scale(1.02)' : 'scale(1)',
            transformOrigin: `${cx}px ${cy}px`
          }}
          onMouseEnter={() => setHoveredSlice(s.label)}
          onMouseLeave={() => setHoveredSlice(null)}
        >
          <title>{`${s.label}: ${s.count.toLocaleString()} tickets (${s.pct.toFixed(1)}%)`}</title>
        </path>
      );
    });
  };

  // Format table rows dynamically based on Excel kpiParameters
  const tableRows = serviceDeskKPIParameters.length > 0 ? serviceDeskKPIParameters : [
    {
      parameter: 'Average Call talk time',
      baseline: '10:00',
      apr: '2:05',
      may: '2:12',
      jun: '2:21',
      jul: '2:05',
      status: 'positive'
    },
    {
      parameter: 'Average Answer Time',
      baseline: '0:10',
      apr: '0:06',
      may: '0:06',
      jun: '0:07',
      jul: '0:06',
      status: 'positive'
    },
    {
      parameter: 'Email',
      baseline: 'NA',
      apr: '1,846',
      may: '1,472',
      jun: '1,542',
      jul: typeof emailVolume === 'number' ? emailVolume.toLocaleString() : '3,516',
      status: 'attention'
    },
    {
      parameter: 'Notifications',
      baseline: 'NA',
      apr: '58',
      may: '49',
      jun: '49',
      jul: typeof notifVolume === 'number' ? notifVolume.toLocaleString() : '54',
      status: 'positive'
    }
  ];

  // Volumetric channel items using controlled enterprise palette
  const volumetricItems = [
    {
      id: 'tickets',
      label: 'Tickets',
      value: animatedVolumes.tickets,
      borderColor: '#0A0838',
      icon: Ticket
    },
    {
      id: 'calls',
      label: 'Calls',
      value: animatedVolumes.calls,
      borderColor: '#0A0838',
      icon: PhoneCall
    },
    {
      id: 'email',
      label: 'Email',
      value: animatedVolumes.email,
      borderColor: '#0A0838',
      icon: Mail
    },
    {
      id: 'notifications',
      label: 'Notifications',
      value: animatedVolumes.notif,
      borderColor: '#0A0838',
      icon: Bell
    },
    {
      id: 'total',
      label: 'Total',
      value: animatedVolumes.total,
      borderColor: '#0A0838',
      icon: Layers
    }
  ];

  return (
    <div className={`h-full w-full flex flex-col p-4 md:p-5 lg:p-6 gap-3 relative overflow-hidden text-left transition-opacity duration-500 bg-[#FFFFFF] dark:bg-[#0A0838] text-[#29251D] dark:text-white select-none ${isLoading ? 'opacity-70' : 'opacity-100'}`}>
      {/* Background Ambient Glow */}
      <div className="absolute top-1/4 left-1/3 w-[500px] h-[300px] bg-[#E31837]/5 rounded-full blur-3xl pointer-events-none" />

      {/* 1. TOP HEADER */}
      <div className={`shrink-0 transition-all duration-700 ${animStage >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-3'}`}>
        <div className="flex items-start justify-between gap-4 pb-1.5 border-b border-[#E5DFD3] dark:border-white/10">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="w-2 h-2 rounded-full bg-[#0066B2] dark:bg-sky-400 animate-pulse" />
              <span className="text-xs font-medium text-[#0066B2] dark:text-sky-400">
                03 • Service Management
              </span>
            </div>
            <h1 className="text-2xl font-semibold tracking-tight text-[#29251D] dark:text-slate-100">
              ITSM Dashboard
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <LiveDataBadge
              dataSource={dataSource}
              lastUpdatedDisplay={lastUpdatedDisplay}
              isRefreshing={isRefreshing}
              onRefresh={refresh}
              error={error}
            />
          </div>
        </div>
      </div>

      {/* 2. THREE GRAND STAT HERO CARDS WITH INTEGRATED MONTHLY TREND SPARKLINE CURVES */}
      <div className={`shrink-0 grid grid-cols-1 md:grid-cols-3 gap-3.5 transition-all duration-700 ${animStage >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'}`}>

        {/* Card 1: Total Closed + Embedded Trend */}
        <div className={`p-3.5 rounded-2xl transition-all duration-300 flex items-center justify-between bg-[#F6F2EA] dark:bg-white/5 border ${selectedTotalMonth ? 'border-[#0A0838] shadow-sm' : 'border-[#E5DFD3] dark:border-white/10 hover:border-[#0A0838]/40 shadow-xs'}`}>
          <div className="flex flex-col justify-between pr-2">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-7 h-7 rounded-lg bg-[#0A0838]/10 text-[#0A0838] dark:bg-white/10 dark:text-white flex items-center justify-center">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
              <span className="text-sm font-medium text-[#4D4D4F] dark:text-slate-300">
                Total Tickets Closed
              </span>
              {selectedTotalMonth && (
                <button
                  onClick={() => setSelectedTotalMonth(null)}
                  className="ml-1 text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-[#0A0838] text-white flex items-center gap-0.5 cursor-pointer hover:opacity-80 transition-all"
                  title="Click to reset to total"
                >
                  {selectedTotalMonth} ✕
                </button>
              )}
            </div>
            <span className="text-2xl font-semibold text-[#29251D] dark:text-white tracking-tight">
              {(selectedTotalMonth
                ? (safeActuals.find(m => m.monthLabel === selectedTotalMonth)?.total ?? 0)
                : (ticketSummaryKPIs.totalClosed || 27806)
              ).toLocaleString()}
            </span>
          </div>

          {/* Embedded 4-Month Sparkline Trend (Deep Navy Base) */}
          <div className="w-44 lg:w-52 h-14 pl-1 border-l border-[#E5DFD3] dark:border-white/10 shrink-0">
            {renderSparkline(
              safeActuals.map(m => m.total),
              safeActuals.map(m => m.monthLabel),
              '#0A0838',
              'spark-total-grad',
              4500,
              8800,
              selectedTotalMonth,
              setSelectedTotalMonth
            )}
          </div>
        </div>

        {/* Card 2: Service Requests (SCTASK) + Embedded Trend */}
        <div className={`p-3.5 rounded-2xl transition-all duration-300 flex items-center justify-between bg-[#F6F2EA] dark:bg-white/5 border ${selectedSrMonth ? 'border-[#0A0838] shadow-sm' : 'border-[#E5DFD3] dark:border-white/10 hover:border-[#0A0838]/50 shadow-xs'}`}>
          <div className="flex flex-col justify-between pr-2">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-7 h-7 rounded-lg bg-[#0A0838]/10 text-[#0A0838] dark:bg-white/10 dark:text-white flex items-center justify-center">
                <FileText className="w-3.5 h-3.5" />
              </div>
              <span className="text-sm font-medium text-[#4D4D4F] dark:text-slate-300">
                Service Requests
              </span>
              {selectedSrMonth && (
                <button
                  onClick={() => setSelectedSrMonth(null)}
                  className="ml-1 text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-[#0A0838] text-white flex items-center gap-0.5 cursor-pointer hover:opacity-80 transition-all"
                  title="Click to reset to total"
                >
                  {selectedSrMonth} ✕
                </button>
              )}
            </div>
            <span className="text-2xl font-semibold text-[#29251D] dark:text-white tracking-tight">
              {(selectedSrMonth
                ? (safeActuals.find(m => m.monthLabel === selectedSrMonth)?.serviceRequests ?? 0)
                : (ticketSummaryKPIs.serviceRequestsClosed || 22319)
              ).toLocaleString()}
            </span>
          </div>

          {/* Embedded 4-Month Sparkline Trend */}
          <div className="w-44 lg:w-52 h-14 pl-1 border-l border-[#E5DFD3] dark:border-white/10 shrink-0">
            {renderSparkline(
              safeActuals.map(m => m.serviceRequests),
              safeActuals.map(m => m.monthLabel),
              '#0A0838',
              'spark-sr-grad',
              3800,
              7200,
              selectedSrMonth,
              setSelectedSrMonth
            )}
          </div>
        </div>

        {/* Card 3: Incidents (INC) + Embedded Trend */}
        <div className={`p-3.5 rounded-2xl transition-all duration-300 flex items-center justify-between bg-[#F6F2EA] dark:bg-white/5 border ${selectedIncMonth ? 'border-[#4D4D4F] shadow-sm' : 'border-[#E5DFD3] dark:border-white/10 hover:border-[#4D4D4F]/40 shadow-xs'}`}>
          <div className="flex flex-col justify-between pr-2">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-7 h-7 rounded-lg bg-[#0A0838]/10 text-[#0A0838] dark:bg-white/10 dark:text-white flex items-center justify-center">
                <AlertTriangle className="w-3.5 h-3.5" />
              </div>
              <span className="text-sm font-medium text-[#4D4D4F] dark:text-slate-300">
                Incidents
              </span>
              {selectedIncMonth && (
                <button
                  onClick={() => setSelectedIncMonth(null)}
                  className="ml-1 text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-[#4D4D4F] text-white flex items-center gap-0.5 cursor-pointer hover:opacity-80 transition-all"
                  title="Click to reset to total"
                >
                  {selectedIncMonth} ✕
                </button>
              )}
            </div>
            <span className="text-2xl font-semibold text-[#29251D] dark:text-white tracking-tight">
              {(selectedIncMonth
                ? (safeActuals.find(m => m.monthLabel === selectedIncMonth)?.incidents ?? 0)
                : (ticketSummaryKPIs.incidentsClosed || 5487)
              ).toLocaleString()}
            </span>
          </div>

          {/* Embedded 4-Month Sparkline Trend */}
          <div className="w-44 lg:w-52 h-14 pl-1 border-l border-[#E5DFD3] dark:border-white/10 shrink-0">
            {renderSparkline(
              safeActuals.map(m => m.incidents),
              safeActuals.map(m => m.monthLabel),
              '#4D4D4F',
              'spark-inc-grad',
              1000,
              1650,
              selectedIncMonth,
              setSelectedIncMonth
            )}
          </div>
        </div>
      </div>

      {/* 3. MERGED LOWER WORKSPACE: SERVICE MANAGEMENT & SERVICE DESK CONTROLS */}
      <div className={`flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-3.5 items-stretch transition-all duration-700 ${animStage >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'}`}>

        {/* LEFT COMPARTMENT (6 COLS): END POINT SCOPE & SERVICE DESK PARAMETERS (TREND / CARDS / TABLE) */}
        <div className="lg:col-span-6 flex flex-col justify-between bg-[#F6F2EA] dark:bg-white/5 rounded-2xl border border-[#E5DFD3] dark:border-white/10 p-3.5 shadow-xs">

          {/* Top Bar: End Point Devices Scope Header & View Switcher */}
          <div className="flex items-center justify-between pb-2 border-b border-[#E5DFD3] dark:border-white/10">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-[#0A0838]/10 border border-[#0A0838]/20 text-[#0A0838] dark:text-white flex items-center justify-center shadow-inner">
                <Clock className="w-3.5 h-3.5" />
              </div>
              <h2 className="text-sm font-semibold text-[#0A0838] dark:text-slate-200">
                Service Desk Parameters
              </h2>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-1 bg-[#FFFFFF] dark:bg-white/10 p-0.5 rounded-lg text-[10px] font-mono border border-[#E5DFD3] dark:border-white/10">
              <button
                onClick={() => setViewMode('trend')}
                className={`px-2 py-0.5 rounded-md transition-all flex items-center gap-1 cursor-pointer font-medium ${viewMode === 'trend'
                  ? 'bg-[#0A0838] !text-white shadow-xs font-semibold'
                  : 'text-[#4D4D4F] dark:text-slate-400 hover:text-[#0A0838]'
                  }`}
              >
                <Activity className="w-2.5 h-2.5" />
                Trend
              </button>
              <button
                onClick={() => setViewMode('cards')}
                className={`px-2 py-0.5 rounded-md transition-all flex items-center gap-1 cursor-pointer font-medium ${viewMode === 'cards'
                  ? 'bg-[#0A0838] !text-white shadow-xs font-semibold'
                  : 'text-[#4D4D4F] dark:text-slate-400 hover:text-[#0A0838]'
                  }`}
              >
                <BarChart2 className="w-2.5 h-2.5" />
                Cards
              </button>
              <button
                onClick={() => setViewMode('matrix')}
                className={`px-2 py-0.5 rounded-md transition-all flex items-center gap-1 cursor-pointer font-medium ${viewMode === 'matrix'
                  ? 'bg-[#0A0838] !text-white shadow-xs font-semibold'
                  : 'text-[#4D4D4F] dark:text-slate-400 hover:text-[#0A0838]'
                  }`}
              >
                <Layers className="w-2.5 h-2.5" />
                Table
              </button>
            </div>
          </div>

          {/* End Point Devices Scope Strip */}
          <div className="grid grid-cols-2 gap-2 my-2 py-1 px-2.5 rounded-xl bg-[#FFFFFF] dark:bg-white/3 border border-[#E5DFD3] dark:border-white/5">
            <div className="flex items-center justify-between pr-3 border-r border-[#E5DFD3] dark:border-white/10">
              <div className="flex items-center gap-1.5">
                <Laptop className="w-3.5 h-3.5 text-[#0A0838] dark:text-slate-300" />
                <span className="text-xs text-[#4D4D4F] dark:text-slate-400 font-medium">
                  End Points
                </span>
              </div>
              <span className="text-sm font-semibold text-[#29251D] dark:text-white">
                {endPointsValue}
              </span>
            </div>

            <div className="flex items-center justify-between pl-3">
              <div className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-[#0A0838] dark:text-slate-300" />
                <span className="text-xs text-[#4D4D4F] dark:text-slate-400 font-medium">
                  Users Count
                </span>
              </div>
              <span className="text-sm font-semibold text-[#29251D] dark:text-white">
                {usersCountValue}
              </span>
            </div>
          </div>

          {/* Mode 1: Dedicated Multi-Month Trend Visualizations */}
          {viewMode === 'trend' && (
            <div className="grid grid-cols-2 gap-2.5 py-0.5 flex-1 items-stretch min-h-0">

              {/* Trend 1: Talk Time (Deep Navy) */}
              <div className="p-3 md:p-3.5 rounded-xl bg-[#FFFFFF] dark:bg-white/5 border border-[#E5DFD3] dark:border-white/10 flex flex-col justify-between shadow-2xs group hover:border-[#0A0838]/40 transition-all">
                <div className="pb-1 border-b border-[#E5DFD3]/60 dark:border-white/5 flex items-center justify-between">
                  <span className="text-xs font-medium text-[#29251D] dark:text-slate-200 block truncate">
                    Average Call Talk Time
                  </span>
                </div>
                <div className="flex-1 min-h-[85px] w-full flex items-center justify-center py-1">
                  {renderMiniTrendGraph(
                    ['Apr', 'May', 'Jun', 'Jul'],
                    ['2:05', '2:12', '2:21', '2:05'],
                    [125, 132, 141, 125],
                    '#0A0838',
                    'm-talk-grad',
                    110,
                    155
                  )}
                </div>
              </div>

              {/* Trend 2: ASA (Charcoal Supporting) */}
              <div className="p-3 md:p-3.5 rounded-xl bg-[#FFFFFF] dark:bg-white/5 border border-[#E5DFD3] dark:border-white/10 flex flex-col justify-between shadow-2xs group hover:border-[#4D4D4F]/40 transition-all">
                <div className="pb-1 border-b border-[#E5DFD3]/60 dark:border-white/5 flex items-center justify-between">
                  <span className="text-xs font-medium text-[#29251D] dark:text-slate-200 block truncate">
                    Average Answer Time (ASA)
                  </span>
                </div>
                <div className="flex-1 min-h-[85px] w-full flex items-center justify-center py-1">
                  {renderMiniTrendGraph(
                    ['Apr', 'May', 'Jun', 'Jul'],
                    ['0:06', '0:06', '0:07', '0:06'],
                    [6, 6, 7, 6],
                    '#4D4D4F',
                    'm-asa-grad',
                    5,
                    8
                  )}
                </div>
              </div>

              {/* Trend 3: Email Interactions (Corporate Blue) */}
              <div className="p-3 md:p-3.5 rounded-xl bg-[#FFFFFF] dark:bg-white/5 border border-[#E5DFD3] dark:border-white/10 flex flex-col justify-between shadow-2xs group hover:border-[#3A59A4]/40 transition-all">
                <div className="pb-1 border-b border-[#E5DFD3]/60 dark:border-white/5 flex items-center justify-between">
                  <span className="text-xs font-medium text-[#29251D] dark:text-slate-200 block truncate">
                    Email Interactions
                  </span>
                </div>
                <div className="flex-1 min-h-[85px] w-full flex items-center justify-center py-1">
                  {renderMiniTrendGraph(
                    ['Apr', 'May', 'Jun', 'Jul'],
                    ['1,846', '1,472', '1,542', '3,516'],
                    [1846, 1472, 1542, 3516],
                    '#3A59A4',
                    'm-email-grad',
                    1200,
                    3800
                  )}
                </div>
              </div>

              {/* Trend 4: System Notifications (Crisp High-Contrast Accent) */}
              <div className="p-3 md:p-3.5 rounded-xl bg-[#FFFFFF] dark:bg-white/5 border border-[#E5DFD3] dark:border-white/10 flex flex-col justify-between shadow-2xs group hover:border-[#8D5C1A]/60 transition-all">
                <div className="pb-1 border-b border-[#E5DFD3]/60 dark:border-white/5 flex items-center justify-between">
                  <span className="text-xs font-medium text-[#29251D] dark:text-slate-200 block truncate">
                    System Notifications
                  </span>
                </div>
                <div className="flex-1 min-h-[85px] w-full flex items-center justify-center py-1">
                  {renderMiniTrendGraph(
                    ['Apr', 'May', 'Jun', 'Jul'],
                    ['58', '49', '49', '54'],
                    [58, 49, 49, 54],
                    '#8D5C1A',
                    'm-notif-grad',
                    40,
                    65
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Mode 2: Metric Cards (Center-aligned numbers and content) */}
          {viewMode === 'cards' && (
            <div className="grid grid-cols-2 gap-2.5 py-0.5 flex-1 items-stretch min-h-0">
              {tableRows.map(row => (
                <div
                  key={row.parameter}
                  className="p-3 md:p-3.5 rounded-xl bg-[#FFFFFF] dark:bg-white/5 border border-[#E5DFD3] dark:border-white/10 flex flex-col justify-between shadow-2xs hover:border-[#0A0838]/30 transition-all text-center"
                >
                  <div className="flex items-center justify-center pb-1 border-b border-[#E5DFD3]/60 dark:border-white/5">
                    <span className="text-xs font-medium text-[#29251D] dark:text-slate-200 truncate text-center">
                      {row.parameter}
                    </span>
                  </div>
                  <div className="my-auto py-2 flex flex-col items-center justify-center text-center">
                    <div className="text-2xl lg:text-3xl font-semibold tracking-tight text-[#29251D] dark:text-white text-center">
                      {row.jul}
                    </div>
                    <div className="text-xs font-normal text-[#4D4D4F] dark:text-slate-400 mt-1 text-center">
                      Baseline: <span className="font-medium text-[#29251D] dark:text-slate-300">{row.baseline}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Mode 3: Compact Table Matrix */}
          {viewMode === 'matrix' && (
            <div className="rounded-xl overflow-hidden border border-[#E5DFD3] dark:border-white/10 bg-[#FFFFFF] dark:bg-white/5 flex-1 flex flex-col justify-start min-h-0 shadow-2xs">
              <table className="w-full text-left border-collapse h-full">
                <thead>
                  <tr className="border-b border-[#E5DFD3] dark:border-white/10 text-xs bg-[#F6F2EA] dark:bg-white/10">
                    <th className="py-2.5 px-3 font-semibold text-[#29251D] dark:text-white">
                      KPI / Parameter
                    </th>
                    <th className="py-2.5 px-2 font-semibold text-[#4D4D4F] dark:text-slate-300 text-center bg-[#E5DFD3]/40 dark:bg-white/5">
                      Baseline
                    </th>
                    <th className="py-2.5 px-2 font-semibold text-[#29251D] dark:text-slate-200 text-center">
                      Apr
                    </th>
                    <th className="py-2.5 px-2 font-semibold text-[#29251D] dark:text-slate-200 text-center">
                      May
                    </th>
                    <th className="py-2.5 px-2 font-semibold text-[#29251D] dark:text-slate-200 text-center">
                      Jun
                    </th>
                    <th className="py-2.5 px-2 font-semibold text-[#0A0838] dark:text-white text-center bg-[#0A0838]/5 dark:bg-white/10">
                      Jul
                    </th>
                  </tr>
                </thead>
                <tbody className="text-xs divide-y divide-[#E5DFD3]/70 dark:divide-white/5">
                  {tableRows.map((row, idx) => (
                    <tr key={row.parameter || idx} className="hover:bg-[#F6F2EA]/50 dark:hover:bg-white/5 transition-colors">
                      <td className="py-2.5 px-3 font-medium text-[#29251D] dark:text-slate-200">
                        {row.parameter}
                      </td>
                      <td className="py-2.5 px-2 font-mono text-center text-[#4D4D4F] dark:text-slate-400 bg-[#E5DFD3]/20 dark:bg-transparent">
                        {row.baseline}
                      </td>
                      <td className="py-2.5 px-2 font-mono font-medium text-center text-[#29251D] dark:text-slate-100">
                        {row.apr}
                      </td>
                      <td className="py-2.5 px-2 font-mono font-medium text-center text-[#29251D] dark:text-slate-100">
                        {row.may}
                      </td>
                      <td className="py-2.5 px-2 font-mono font-medium text-center text-[#29251D] dark:text-slate-100">
                        {row.jun}
                      </td>
                      <td className="py-2.5 px-2 font-mono font-semibold text-center text-[#0A0838] dark:text-white bg-[#0A0838]/5 dark:bg-white/5">
                        {row.jul}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* RIGHT COMPARTMENT (6 COLS): SUPPORT VOLUMETRICS (JULY) & INC/SR GROUP DONUTS / TOP 5 */}
        <div className="lg:col-span-6 flex flex-col justify-between bg-[#F6F2EA] dark:bg-white/5 rounded-2xl border border-[#E5DFD3] dark:border-white/10 p-3.5 shadow-xs">

          {/* Top 5 Volumetric Cards for July */}
          <div>
            <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-[#E5DFD3] dark:border-white/10">
              <h2 className="text-sm font-semibold text-[#0A0838] dark:text-slate-200">
                Support Volumetrics
              </h2>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#0A0838]/10 text-[#0A0838] dark:bg-white/10 dark:text-white font-medium">
                July 2026
              </span>
            </div>

            <div className="grid grid-cols-5 gap-2 items-stretch">
              {volumetricItems.map(item => {
                const ItemIcon = item.icon;
                return (
                  <div
                    key={item.id}
                    className="p-2 rounded-xl flex flex-col items-center justify-between text-center transition-all bg-[#FFFFFF] dark:bg-white/3 border border-[#E5DFD3] dark:border-white/5 shadow-2xs hover:border-[#0A0838]/30 hover:scale-[1.02] transition-all"
                  >
                    <div className="w-7 h-7 rounded-lg bg-[#0A0838]/10 text-[#0A0838] dark:bg-white/10 dark:text-white flex items-center justify-center mb-1">
                      <ItemIcon className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs font-medium text-[#4D4D4F] dark:text-slate-300 truncate w-full">
                      {item.label}
                    </span>
                    <span className="text-sm lg:text-base font-semibold text-[#29251D] dark:text-white mt-0.5">
                      {item.value.toLocaleString()}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom Tabs: INC & SR by Group | Top 5 SR | Top 5 INC | Pending & On-Hold */}
          <div className="mt-2.5 pt-2 border-t border-[#E5DFD3] dark:border-white/10 flex-1 flex flex-col justify-between min-h-0">
            <div className="flex items-center justify-between pb-1.5 shrink-0">
              <div className="flex items-center gap-1 bg-[#FFFFFF] dark:bg-white/10 p-0.5 rounded-xl text-xs border border-[#E5DFD3] dark:border-white/10 shadow-2xs">
                <button
                  onClick={() => setActiveTab('pies')}
                  className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer font-medium text-[11.5px] ${
                    activeTab === 'pies'
                      ? 'bg-[#0A0838] text-white shadow-xs font-semibold'
                      : 'text-[#4D4D4F] dark:text-slate-400 hover:text-[#0A0838]'
                  }`}
                >
                  INC &amp; SR by Group
                </button>
                <button
                  onClick={() => setActiveTab('requests')}
                  className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer font-medium text-[11.5px] ${
                    activeTab === 'requests'
                      ? 'bg-[#0A0838] text-white shadow-xs font-semibold'
                      : 'text-[#4D4D4F] dark:text-slate-400 hover:text-[#0A0838]'
                  }`}
                >
                  Top 5 SR Categories
                </button>
                <button
                  onClick={() => setActiveTab('incidents')}
                  className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer font-medium text-[11.5px] ${
                    activeTab === 'incidents'
                      ? 'bg-[#0A0838] text-white shadow-xs font-semibold'
                      : 'text-[#4D4D4F] dark:text-slate-400 hover:text-[#0A0838]'
                  }`}
                >
                  Top 5 INC
                </button>
                <button
                  onClick={() => setActiveTab('backlog')}
                  className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer font-medium text-[11.5px] flex items-center gap-1.5 hover:shadow-xs group ${
                    activeTab === 'backlog'
                      ? 'bg-[#0A0838] text-white shadow-xs font-semibold'
                      : 'text-[#4D4D4F] dark:text-slate-400 hover:text-[#0A0838] hover:bg-slate-100 dark:hover:bg-white/5'
                  }`}
                  title="View Pending Tickets"
                >
                  <FolderTree className="w-3.5 h-3.5 text-[#0A0838] dark:text-slate-300 group-hover:scale-110 transition-transform" />
                  <span>Pending Tickets</span>
                </button>
              </div>
            </div>

            {/* TAB 1: DUAL DONUT CHARTS (INC & SR BY GROUP) */}
            {activeTab === 'pies' && (
              <div className="grid grid-cols-2 gap-3 flex-1 items-stretch py-1 min-h-0">
                {/* Donut 1: INC by Group */}
                <div className="p-3 md:p-3.5 rounded-xl bg-[#FFFFFF] dark:bg-white/3 border border-[#E5DFD3] dark:border-white/5 flex flex-col justify-between shadow-2xs">
                  <div className="w-full flex items-center justify-between pb-1.5 mb-1 border-b border-[#E5DFD3]/60 dark:border-white/5">
                    <span className="text-xs font-semibold text-[#0A0838] dark:text-slate-200">
                      INC by Group
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-md bg-[#0A0838]/10 dark:bg-white/10 text-[#0A0838] dark:text-white font-medium">
                      5,487 INC
                    </span>
                  </div>

                  <div className="flex items-center gap-3 w-full justify-between flex-1 my-auto min-h-0">
                    <div className="relative w-32 h-32 lg:w-36 lg:h-36 flex items-center justify-center shrink-0">
                      <svg className="w-full h-full" viewBox="0 0 150 150">
                        {renderDonutSvg(incPieData, hoveredIncSlice, setHoveredIncSlice, 75, 75, 58, 38)}
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <span className="text-[10px] text-[#4D4D4F] dark:text-slate-400 font-medium tracking-wide">
                          {hoveredIncSlice ? hoveredIncSlice : 'Total'}
                        </span>
                        <span className="text-sm lg:text-base font-semibold text-[#29251D] dark:text-white">
                          {hoveredIncSlice ? `${incPieData.find(s => s.label === hoveredIncSlice)?.pct.toFixed(1)}%` : '5,487'}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col justify-center gap-2 text-xs flex-1 pl-1">
                      {incPieData.map(s => (
                        <div key={s.label} className="flex flex-col gap-0.5">
                          <div className="flex items-center justify-between">
                            <span className="flex items-center gap-1.5 truncate text-[#4D4D4F] dark:text-slate-300 font-medium text-[11px]">
                              <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: s.color }} />
                              {s.label}
                            </span>
                            <span className="font-semibold text-[#29251D] dark:text-white text-[11px]">
                              {s.pct.toFixed(1)}%
                            </span>
                          </div>
                          <div className="w-full bg-[#E5DFD3] dark:bg-white/10 h-1.5 rounded-full overflow-hidden">
                            <div className="h-full rounded-full transition-all duration-500" style={{ width: `${s.pct}%`, backgroundColor: s.color }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Donut 2: SR by Group */}
                <div className="p-3 md:p-3.5 rounded-xl bg-[#FFFFFF] dark:bg-white/3 border border-[#E5DFD3] dark:border-white/5 flex flex-col justify-between shadow-2xs">
                  <div className="w-full flex items-center justify-between pb-1.5 mb-1 border-b border-[#E5DFD3]/60 dark:border-white/5">
                    <span className="text-xs font-semibold text-[#0A0838] dark:text-slate-200">
                      SR by Group
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-md bg-[#0A0838]/10 dark:bg-white/10 text-[#0A0838] dark:text-white font-medium">
                      22,319 SR
                    </span>
                  </div>

                  <div className="flex items-center gap-3 w-full justify-between flex-1 my-auto min-h-0">
                    <div className="relative w-32 h-32 lg:w-36 lg:h-36 flex items-center justify-center shrink-0">
                      <svg className="w-full h-full" viewBox="0 0 150 150">
                        {renderDonutSvg(srPieData, hoveredSrSlice, setHoveredSrSlice, 75, 75, 58, 38)}
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <span className="text-[10px] text-[#4D4D4F] dark:text-slate-400 font-medium tracking-wide">
                          {hoveredSrSlice ? hoveredSrSlice : 'Total'}
                        </span>
                        <span className="text-sm lg:text-base font-semibold text-[#29251D] dark:text-white">
                          {hoveredSrSlice ? `${srPieData.find(s => s.label === hoveredSrSlice)?.pct.toFixed(1)}%` : '22,319'}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col justify-center gap-2 text-xs flex-1 pl-1">
                      {srPieData.map(s => (
                        <div key={s.label} className="flex flex-col gap-0.5">
                          <div className="flex items-center justify-between">
                            <span className="flex items-center gap-1.5 truncate text-[#4D4D4F] dark:text-slate-300 font-medium text-[11px]">
                              <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: s.color }} />
                              {s.label}
                            </span>
                            <span className="font-semibold text-[#29251D] dark:text-white text-[11px]">
                              {s.pct.toFixed(1)}%
                            </span>
                          </div>
                          <div className="w-full bg-[#E5DFD3] dark:bg-white/10 h-1.5 rounded-full overflow-hidden">
                            <div className="h-full rounded-full transition-all duration-500" style={{ width: `${s.pct}%`, backgroundColor: s.color }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: TOP 5 SR CATEGORIES */}
            {activeTab === 'requests' && (
              <div className="flex-1 flex flex-col justify-between gap-1.5 py-1 min-h-0">
                {topServiceRequestCategories.slice(0, 5).map((cat, idx) => (
                  <div
                    key={cat.category}
                    className="group relative px-3 py-2.5 rounded-xl bg-[#FFFFFF] dark:bg-white/3 border border-[#E5DFD3] dark:border-white/5 hover:border-[#3A59A4]/40 hover:bg-[#F6F2EA]/60 dark:hover:bg-white/5 hover:shadow-xs transition-all duration-200 flex items-center justify-between cursor-pointer"
                  >
                    {/* Left: Rank & Category Name */}
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      <span className="w-5 h-5 rounded-md bg-[#0A0838]/5 dark:bg-white/10 text-[#0A0838] dark:text-slate-300 text-[10px] font-semibold flex items-center justify-center shrink-0 group-hover:bg-[#0A0838] group-hover:text-white transition-colors">
                        #{idx + 1}
                      </span>
                      <span className="text-[12px] font-normal text-[#29251D] dark:text-slate-200 truncate group-hover:text-[#0A0838] dark:group-hover:text-white transition-colors">
                        {cat.category}
                      </span>
                    </div>

                    {/* Right: Creative Count Reveal on Hover */}
                    <div className="flex items-center shrink-0 min-h-[22px] ml-2">
                      <div className="opacity-0 group-hover:opacity-100 transition-all duration-200 transform group-hover:translate-x-0 translate-x-1">
                        <span className="text-[11px] font-mono font-semibold px-2.5 py-0.5 rounded-md bg-[#0A0838] text-white shadow-2xs">
                          {cat.count.toLocaleString()} tickets
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* TAB 3: TOP 5 INC CATEGORIES */}
            {activeTab === 'incidents' && (
              <div className="flex-1 flex flex-col justify-between gap-1.5 py-1 min-h-0">
                {topIncidentCategories.slice(0, 5).map((cat, idx) => (
                  <div
                    key={cat.category}
                    className="group relative px-3 py-2.5 rounded-xl bg-[#FFFFFF] dark:bg-white/3 border border-[#E5DFD3] dark:border-white/5 hover:border-[#0A0838]/40 hover:bg-[#F6F2EA]/60 dark:hover:bg-white/5 hover:shadow-xs transition-all duration-200 flex items-center justify-between cursor-pointer"
                  >
                    {/* Left: Rank & Category Name */}
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      <span className="w-5 h-5 rounded-md bg-[#0A0838]/5 dark:bg-white/10 text-[#0A0838] dark:text-slate-300 text-[10px] font-semibold flex items-center justify-center shrink-0 group-hover:bg-[#0A0838] group-hover:text-white transition-colors">
                        #{idx + 1}
                      </span>
                      <span className="text-[12px] font-normal text-[#29251D] dark:text-slate-200 truncate group-hover:text-[#0A0838] dark:group-hover:text-white transition-colors">
                        {cat.category}
                      </span>
                    </div>

                    {/* Right: Creative Count Reveal on Hover */}
                    <div className="flex items-center shrink-0 min-h-[22px] ml-2">
                      <div className="opacity-0 group-hover:opacity-100 transition-all duration-200 transform group-hover:translate-x-0 translate-x-1">
                        <span className="text-[11px] font-mono font-semibold px-2.5 py-0.5 rounded-md bg-[#0A0838] text-white shadow-2xs">
                          {cat.count.toLocaleString()} incidents
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* TAB 4: PENDING TICKETS (3 EXECUTIVE CARDS: 213, 39, 174) */}
            {activeTab === 'backlog' && (
              <div className="grid grid-cols-3 gap-2.5 flex-1 items-stretch py-1 min-h-0 animate-in fade-in duration-300">
                {/* Card 1: Total Pending (213) */}
                <div
                  onClick={() => openDrilldown(1)}
                  className="p-3.5 rounded-2xl bg-[#FFFFFF] dark:bg-white/5 border border-[#E5DFD3] dark:border-white/10 hover:border-[#0A0838]/40 hover:shadow-md hover:scale-[1.015] transition-all cursor-pointer flex flex-col justify-between group shadow-2xs"
                  title="Click to view full backlog overview"
                >
                  <div className="flex items-center justify-between pb-1">
                    <span className="text-[11px] font-semibold text-[#0A0838] dark:text-slate-300">
                      Total Pending
                    </span>
                    <Layers className="w-4 h-4 text-[#0A0838] dark:text-slate-300 group-hover:scale-110 transition-transform" />
                  </div>

                  <div className="my-auto">
                    <div className="text-3xl lg:text-4xl font-extrabold text-[#0A0838] dark:text-white font-mono tracking-tight">
                      213
                    </div>
                    <div className="text-xs text-[#4D4D4F] dark:text-slate-300 font-medium mt-0.5">
                      Total Backlog • 20 Groups
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-[11px] font-bold text-[#0A0838] dark:text-slate-200 group-hover:translate-x-0.5 transition-transform">
                    <span>View Backlog</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </div>

                {/* Card 2: Pending Incidents (39) */}
                <div
                  onClick={() => openDrilldown(2, 'INC')}
                  className="p-3.5 rounded-2xl bg-[#FFFFFF] dark:bg-white/5 border border-[#E5DFD3] dark:border-white/10 hover:border-[#0A0838]/40 hover:shadow-md hover:scale-[1.015] transition-all cursor-pointer flex flex-col justify-between group shadow-2xs"
                  title="Click to drill down into 9 incident groups"
                >
                  <div className="flex items-center justify-between pb-1">
                    <span className="text-[11px] font-semibold text-[#0A0838] dark:text-slate-300">
                      Pending Incidents
                    </span>
                    <Shield className="w-4 h-4 text-[#0A0838] dark:text-slate-300 group-hover:scale-110 transition-transform" />
                  </div>

                  <div className="my-auto">
                    <div className="text-3xl lg:text-4xl font-extrabold text-[#0A0838] dark:text-white font-mono tracking-tight">
                      39
                    </div>
                    <div className="text-xs text-[#4D4D4F] dark:text-slate-300 font-medium mt-0.5">
                      9 Assignment Groups
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-[11px] font-bold text-[#0A0838] dark:text-slate-200 group-hover:translate-x-0.5 transition-transform">
                    <span>View 9 Groups</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </div>

                {/* Card 3: Pending Service Requests (174) */}
                <div
                  onClick={() => openDrilldown(2, 'SCTASK')}
                  className="p-3.5 rounded-2xl bg-[#FFFFFF] dark:bg-white/5 border border-[#E5DFD3] dark:border-white/10 hover:border-[#0A0838]/40 hover:shadow-md hover:scale-[1.015] transition-all cursor-pointer flex flex-col justify-between group shadow-2xs"
                  title="Click to drill down into 11 SCTASK groups"
                >
                  <div className="flex items-center justify-between pb-1">
                    <span className="text-[11px] font-semibold text-[#0A0838] dark:text-slate-300">
                      Pending SCTasks
                    </span>
                    <Zap className="w-4 h-4 text-[#0A0838] dark:text-slate-300 group-hover:scale-110 transition-transform" />
                  </div>

                  <div className="my-auto">
                    <div className="text-3xl lg:text-4xl font-extrabold text-[#0A0838] dark:text-white font-mono tracking-tight">
                      174
                    </div>
                    <div className="text-xs text-[#4D4D4F] dark:text-slate-300 font-medium mt-0.5">
                      11 Assignment Groups
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-[11px] font-bold text-[#0A0838] dark:text-slate-200 group-hover:translate-x-0.5 transition-transform">
                    <span>View 11 Groups</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. HIERARCHICAL DRILL-DOWN POPUP / OVERLAY (3-LEVEL MODAL ARCHITECTURE)   */}
      {/* ========================================================================= */}
      {isPendingDrilldownOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 transition-all duration-200 animate-in fade-in"
          onClick={closeDrilldown}
        >
          <div
            className="w-full max-w-2xl bg-[#FFFFFF] dark:bg-[#0A0838] border border-[#E5DFD3] dark:border-white/20 rounded-3xl p-5 md:p-6 shadow-2xl flex flex-col justify-between max-h-[90vh] overflow-hidden transition-all duration-200 animate-in zoom-in-98 text-left relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* --- MODAL HEADER & BREADCRUMB NAVIGATION --- */}
            <div className="pb-3 border-b border-[#E5DFD3] dark:border-white/10 shrink-0">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  {/* Breadcrumb Navigation Trail */}
                  <div className="flex items-center gap-1.5 text-xs font-mono">
                    <button
                      onClick={() => {
                        setDrilldownLevel(1);
                        setSelectedDrilldownCategory(null);
                        setSelectedDrilldownGroup(null);
                        setSelectedDrilldownHoldReason(null);
                      }}
                      className={`cursor-pointer transition-colors ${
                        drilldownLevel === 1
                          ? 'font-bold text-[#0A0838] dark:text-white'
                          : 'text-slate-500 hover:text-[#0A0838] dark:hover:text-slate-200 hover:underline'
                      }`}
                    >
                      Pending &amp; On-Hold
                    </button>

                    {drilldownLevel >= 2 && selectedDrilldownCategory && (
                      <>
                        <ChevronRight className="w-3 h-3 text-slate-400" />
                        <button
                          onClick={() => {
                            setDrilldownLevel(2);
                            setSelectedDrilldownGroup(null);
                            setSelectedDrilldownHoldReason(null);
                          }}
                          className={`cursor-pointer transition-colors ${
                            drilldownLevel === 2
                              ? 'font-bold text-[#0A0838] dark:text-white'
                              : 'text-slate-500 hover:text-[#0A0838] dark:hover:text-slate-200 hover:underline'
                          }`}
                        >
                          {selectedDrilldownCategory === 'INC'
                            ? 'Pending Incidents (39)'
                            : selectedDrilldownCategory === 'SCTASK'
                            ? 'Pending Service Requests (174)'
                            : 'On-Hold Blockers (65)'}
                        </button>
                      </>
                    )}

                    {drilldownLevel === 3 && (selectedDrilldownGroup || selectedDrilldownHoldReason) && (
                      <>
                        <ChevronRight className="w-3 h-3 text-slate-400" />
                        <span className="font-bold text-[#0066B2] dark:text-sky-300 truncate max-w-[200px]">
                          {selectedDrilldownGroup?.group || selectedDrilldownHoldReason?.holdReason}
                        </span>
                      </>
                    )}
                  </div>

                  {/* Level-Specific Main Title */}
                  <div className="flex items-center gap-2 pt-0.5">
                    <h3 className="text-xl font-bold text-[#0A0838] dark:text-white tracking-tight">
                      {drilldownLevel === 1 && 'Pending & On-Hold Analysis'}
                      {drilldownLevel === 2 && (
                        selectedDrilldownCategory === 'INC'
                          ? 'Pending Incidents Breakdown'
                          : selectedDrilldownCategory === 'SCTASK'
                          ? 'Pending Service Requests Breakdown'
                          : 'On-Hold Root Causes & Blockers'
                      )}
                      {drilldownLevel === 3 && (
                        selectedDrilldownGroup
                          ? selectedDrilldownGroup.group
                          : selectedDrilldownHoldReason?.holdReason
                      )}
                    </h3>

                    {/* Total Count Badge */}
                    <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-[#0A0838]/10 text-[#0A0838] dark:bg-white/10 dark:text-white">
                      {drilldownLevel === 1 && '213 Total'}
                      {drilldownLevel === 2 && (
                        selectedDrilldownCategory === 'INC' ? '39 Tickets' : selectedDrilldownCategory === 'SCTASK' ? '174 Tasks' : '65 On-Hold'
                      )}
                      {drilldownLevel === 3 && (
                        selectedDrilldownGroup ? `${selectedDrilldownGroup.total} Tickets` : `${selectedDrilldownHoldReason?.count} Tickets`
                      )}
                    </span>
                  </div>
                </div>

                {/* Close Button */}
                <button
                  onClick={closeDrilldown}
                  className="w-8 h-8 rounded-full bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 hover:bg-[#E31837] hover:text-white transition-colors flex items-center justify-center cursor-pointer shadow-2xs shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* --- LEVEL 1: OVERVIEW SCREEN (3 HIERARCHICAL CLICKABLE CARDS) --- */}
            {drilldownLevel === 1 && (
              <div className="py-4 space-y-3 flex-1 overflow-y-auto pr-1 min-h-0">
                <p className="text-xs text-[#4D4D4F] dark:text-slate-300 leading-relaxed">
                  Select a category card below to drill down into assignment groups, 8-bracket ageing distributions, and verified blocker root causes.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                  {/* Card 1: Pending Incidents */}
                  <div
                    onClick={() => {
                      setSelectedDrilldownCategory('INC');
                      setDrilldownLevel(2);
                    }}
                    className="p-5 rounded-2xl bg-[#FFFFFF] dark:bg-white/5 border border-[#E5DFD3] dark:border-white/10 hover:border-[#0066B2] hover:shadow-md hover:scale-[1.015] transition-all cursor-pointer flex flex-col justify-between space-y-4 group"
                  >
                    <div>
                      <div className="flex items-center justify-between pb-1">
                        <span className="text-xs font-semibold text-[#0066B2] dark:text-sky-300">
                          Pending Incidents
                        </span>
                        <Shield className="w-5 h-5 text-[#0066B2]" />
                      </div>
                      <div className="text-4xl font-extrabold text-[#0A0838] dark:text-white font-mono mt-1">
                        39
                      </div>
                      <div className="text-xs text-[#4D4D4F] dark:text-slate-300 font-medium mt-1">
                        9 Assignment Groups
                      </div>
                    </div>
                  </div>

                  {/* Card 2: Pending Service Requests */}
                  <div
                    onClick={() => {
                      setSelectedDrilldownCategory('SCTASK');
                      setDrilldownLevel(2);
                    }}
                    className="p-5 rounded-2xl bg-[#FFFFFF] dark:bg-white/5 border border-[#E5DFD3] dark:border-white/10 hover:border-[#7C3AED] hover:shadow-md hover:scale-[1.015] transition-all cursor-pointer flex flex-col justify-between space-y-4 group"
                  >
                    <div>
                      <div className="flex items-center justify-between pb-1">
                        <span className="text-xs font-semibold text-[#7C3AED] dark:text-purple-300">
                          Pending Service Requests
                        </span>
                        <Zap className="w-5 h-5 text-[#7C3AED]" />
                      </div>
                      <div className="text-4xl font-extrabold text-[#0A0838] dark:text-white font-mono mt-1">
                        174
                      </div>
                      <div className="text-xs text-[#4D4D4F] dark:text-slate-300 font-medium mt-1">
                        11 Assignment Groups
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* --- LEVEL 2: CATEGORY DETAIL SCREEN --- */}
            {drilldownLevel === 2 && (
              <div className="py-3 space-y-3 flex-1 overflow-y-auto pr-1 min-h-0">
                {/* Back Control & Summary Header */}
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-white/5">
                  <button
                    onClick={() => {
                      setDrilldownLevel(1);
                      setSelectedDrilldownCategory(null);
                    }}
                    className="text-xs font-semibold text-[#0066B2] dark:text-sky-300 flex items-center gap-1 hover:underline cursor-pointer"
                  >
                    ← Back to Overview
                  </button>

                  <span className="text-[11px] text-[#4D4D4F] dark:text-slate-400">
                    Click any card below for 8-tier ageing matrix &amp; root causes
                  </span>
                </div>

                {/* Listing of Assignment Groups for INC or SCTASK */}
                {selectedDrilldownCategory !== 'ONHOLD' && (
                  <div className="space-y-2">
                    {(selectedDrilldownCategory === 'INC'
                      ? livePendingGroups.filter(g => g.category === 'INC')
                      : livePendingGroups.filter(g => g.category === 'SCTASK')
                    )
                      .slice()
                      .sort((a, b) => b.total - a.total)
                      .map((grp) => {
                        const isOverdue = (grp.over90 || 0) > 0 || (grp.days60to90 || 0) > 0 || (grp.days30to60 || 0) > 0;
                        return (
                          <div
                            key={grp.group}
                            onClick={() => {
                              setSelectedDrilldownGroup(grp);
                              setDrilldownLevel(3);
                            }}
                            className="p-3 rounded-2xl bg-[#FFFFFF] dark:bg-white/5 border border-[#E5DFD3] dark:border-white/10 hover:border-[#0A0838]/40 hover:shadow-md transition-all cursor-pointer group"
                            style={{
                              borderLeftWidth: '4px',
                              borderLeftColor: grp.category === 'INC' ? '#0066B2' : '#7C3AED'
                            }}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <h4 className="text-sm font-bold text-[#0A0838] dark:text-white group-hover:text-[#0066B2] transition-colors">
                                  {grp.group}
                                </h4>
                                {isOverdue && (
                                  <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 dark:bg-white/10 dark:text-slate-300 text-[8.5px] font-semibold flex items-center gap-0.5">
                                    Ageing &gt;30d
                                  </span>
                                )}
                              </div>
                              <span className="text-sm font-bold font-mono px-2.5 py-0.5 rounded-lg bg-slate-100 dark:bg-white/10 text-[#0A0838] dark:text-white">
                                {grp.total} {grp.category === 'INC' ? 'INC' : 'Tasks'}
                              </span>
                            </div>

                            {/* 4-Stage Distribution */}
                            <div className="grid grid-cols-4 gap-2 text-[10px] font-mono py-1.5 px-2.5 rounded-xl bg-[#F6F2EA] dark:bg-white/5">
                              <div>
                                <span className="text-slate-400 block text-[7.5px] uppercase font-sans font-semibold">≤2 Days</span>
                                <strong className="text-slate-800 dark:text-slate-200 text-xs font-bold">{grp.under2}</strong>
                              </div>
                              <div>
                                <span className="text-slate-400 block text-[7.5px] uppercase font-sans font-semibold">3-10 Days</span>
                                <strong className="text-slate-800 dark:text-slate-200 text-xs font-bold">
                                  {(grp.days3to5 || 0) + (grp.days5to10 || 0)}
                                </strong>
                              </div>
                              <div>
                                <span className="text-slate-400 block text-[7.5px] uppercase font-sans font-semibold">10-30 Days</span>
                                <strong className="text-slate-800 dark:text-slate-200 text-xs font-bold">
                                  {(grp.days10to20 || 0) + (grp.days20to30 || 0)}
                                </strong>
                              </div>
                              <div>
                                <span className="text-slate-400 block text-[7.5px] uppercase font-sans font-semibold">≥30-90+ Days</span>
                                <strong className="text-slate-800 dark:text-slate-200 text-xs font-bold">
                                  {(grp.days30to60 || 0) + (grp.days60to90 || 0) + (grp.over90 || 0)}
                                </strong>
                              </div>
                            </div>

                            <div className="mt-2 pt-1.5 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-[10.5px] text-[#4D4D4F] dark:text-slate-300">
                              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                                8-Tier Ageing Breakdown &amp; Trends
                              </span>
                              <span className="text-xs font-bold text-[#0066B2] dark:text-sky-300 shrink-0 group-hover:underline flex items-center gap-0.5">
                                View 8-Bracket Visuals <ChevronRight className="w-3 h-3" />
                              </span>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                )}

                {/* Listing of 8 Verified On-Hold Root Causes */}
                {selectedDrilldownCategory === 'ONHOLD' && (
                  <div className="space-y-2">
                    {liveHoldReasons.map((item, idx) => (
                      <div
                        key={idx}
                        onClick={() => {
                          setSelectedDrilldownHoldReason(item);
                          setDrilldownLevel(3);
                        }}
                        className="p-3 rounded-2xl bg-[#FFFFFF] dark:bg-white/5 border border-[#E5DFD3] dark:border-white/10 hover:border-[#0A0838]/40 hover:shadow-md transition-all cursor-pointer group"
                        style={{
                          borderLeftWidth: '4px',
                          borderLeftColor: item.ticketType === 'Incident' ? '#0066B2' : '#7C3AED'
                        }}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-2">
                            <span
                              className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                                item.ticketType === 'Incident'
                                  ? 'bg-[#E0F2FE] text-[#0066B2]'
                                  : 'bg-[#F3E8FF] text-[#7C3AED]'
                              }`}
                            >
                              {item.ticketType}
                            </span>
                            <h4 className="text-xs font-bold text-[#0A0838] dark:text-white group-hover:text-[#0066B2] transition-colors">
                              {item.holdReason}
                            </h4>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700 dark:bg-white/10 dark:text-slate-300">
                              {item.sharePct}% Share
                            </span>
                            <span className="text-xs font-mono font-bold text-[#0A0838] dark:text-white">
                              {item.count} {item.ticketType === 'Incident' ? 'Tickets' : 'Tasks'}
                            </span>
                          </div>
                        </div>

                        {/* Progress track */}
                        <div className="w-full h-1.5 bg-slate-100 dark:bg-white/10 rounded-full overflow-hidden my-1.5">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${Math.min(100, item.sharePct)}%`,
                              backgroundColor: item.ticketType === 'Incident' ? '#0066B2' : '#7C3AED'
                            }}
                          />
                        </div>

                        <p className="text-[11px] text-[#4D4D4F] dark:text-slate-300 leading-snug">
                          {item.definition}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* --- LEVEL 3: FINAL DETAIL VIEW (8-TIER MATRIX OR HOLD CAUSE DEEP DIVE) --- */}
            {drilldownLevel === 3 && (
              <div className="py-3 space-y-3.5 flex-1 overflow-y-auto pr-1 min-h-0">
                {/* Back Control */}
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-white/5">
                  <button
                    onClick={() => {
                      setDrilldownLevel(2);
                      setSelectedDrilldownGroup(null);
                      setSelectedDrilldownHoldReason(null);
                    }}
                    className="text-xs font-semibold text-[#0066B2] dark:text-sky-300 flex items-center gap-1 hover:underline cursor-pointer"
                  >
                    ← Back to {selectedDrilldownCategory === 'INC' ? 'Pending Incidents' : selectedDrilldownCategory === 'SCTASK' ? 'Pending SCTASKs' : 'On-Hold Reasons'}
                  </button>
                  <div />
                </div>

                {/* If Assignment Group is selected: 8-Bracket Ageing Distribution Donut Chart & Matrix */}
                {selectedDrilldownGroup && (() => {
                  const brackets = [
                    {
                      label: '≤ 2 Days',
                      short: '≤ 2d',
                      val: selectedDrilldownGroup.under2 || 0,
                      color: '#10B981',
                      textColor: 'text-emerald-500',
                      bgLight: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300',
                    },
                    {
                      label: '3–5 Days',
                      short: '3–5d',
                      val: selectedDrilldownGroup.days3to5 || 0,
                      color: '#6EE7B7',
                      textColor: 'text-teal-400',
                      bgLight: 'bg-teal-50 text-teal-700 dark:bg-teal-950/40 dark:text-teal-300',
                    },
                    {
                      label: '5–10 Days',
                      short: '5–10d',
                      val: selectedDrilldownGroup.days5to10 || 0,
                      color: '#2563EB',
                      textColor: 'text-blue-600',
                      bgLight: 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300',
                    },
                    {
                      label: '10–20 Days',
                      short: '10–20d',
                      val: selectedDrilldownGroup.days10to20 || 0,
                      color: '#60A5FA',
                      textColor: 'text-sky-400',
                      bgLight: 'bg-sky-50 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300',
                    },
                    {
                      label: '20–30 Days',
                      short: '20–30d',
                      val: selectedDrilldownGroup.days20to30 || 0,
                      color: '#FBBF24',
                      textColor: 'text-amber-400',
                      bgLight: 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300',
                    },
                    {
                      label: '30–60 Days',
                      short: '30–60d',
                      val: selectedDrilldownGroup.days30to60 || 0,
                      color: '#F97316',
                      textColor: 'text-orange-500',
                      bgLight: 'bg-orange-50 text-orange-700 dark:bg-orange-950/40 dark:text-orange-300',
                    },
                    {
                      label: '60–90 Days',
                      short: '60–90d',
                      val: selectedDrilldownGroup.days60to90 || 0,
                      color: '#FB7185',
                      textColor: 'text-rose-400',
                      bgLight: 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300',
                    },
                    {
                      label: '≥ 90 Days',
                      short: '≥ 90d',
                      val: selectedDrilldownGroup.over90 || 0,
                      color: '#DC2626',
                      textColor: 'text-red-600',
                      bgLight: 'bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300',
                    }
                  ];

                  const totalTickets = selectedDrilldownGroup.total || brackets.reduce((s, b) => s + b.val, 0);

                  // Helper functions for SVG donut arcs
                  const polarToCartesian = (cx: number, cy: number, r: number, angleDeg: number) => {
                    const rad = ((angleDeg - 90) * Math.PI) / 180.0;
                    return {
                      x: cx + r * Math.cos(rad),
                      y: cy + r * Math.sin(rad)
                    };
                  };

                  const describeArc = (cx: number, cy: number, rOut: number, rIn: number, startA: number, endA: number) => {
                    const span = endA - startA;
                    if (span <= 0) return '';
                    const safeEnd = span >= 359.99 ? startA + 359.99 : endA;
                    const startOut = polarToCartesian(cx, cy, rOut, safeEnd);
                    const endOut = polarToCartesian(cx, cy, rOut, startA);
                    const startIn = polarToCartesian(cx, cy, rIn, startA);
                    const endIn = polarToCartesian(cx, cy, rIn, safeEnd);
                    const largeArc = span <= 180 ? 0 : 1;

                    return [
                      'M', startOut.x, startOut.y,
                      'A', rOut, rOut, 0, largeArc, 0, endOut.x, endOut.y,
                      'L', startIn.x, startIn.y,
                      'A', rIn, rIn, 0, largeArc, 1, endIn.x, endIn.y,
                      'Z'
                    ].join(' ');
                  };

                  // Slice angle allocation
                  // Total degrees: 360.
                  // Base angle of 14 degrees for each slice so all 8 are visible and have clean pointer lines
                  const minAngle = 14;
                  const totalReserved = minAngle * 8; // 112
                  const remainingDeg = 360 - totalReserved; // 248

                  let currentAngle = 0;
                  const sliceData = brackets.map((b) => {
                    const sharePctNum = totalTickets > 0 ? (b.val / totalTickets) * 100 : 0;
                    const sharePct = totalTickets > 0 ? Math.round(sharePctNum) : 0;
                    const sliceAngle = minAngle + (totalTickets > 0 ? (b.val / totalTickets) * remainingDeg : 31);
                    const startAngle = currentAngle;
                    const endAngle = currentAngle + sliceAngle;
                    currentAngle = endAngle;

                    const midAngle = (startAngle + endAngle) / 2;
                    return {
                      ...b,
                      sharePct,
                      sharePctExact: sharePctNum.toFixed(1),
                      startAngle,
                      endAngle,
                      midAngle
                    };
                  });

                  // Active hovered slice (or default to first non-zero slice or index 0)
                  const activeSliceIndex = hoveredBracketIdx !== null 
                    ? hoveredBracketIdx 
                    : sliceData.findIndex(s => s.val > 0) >= 0 
                      ? sliceData.findIndex(s => s.val > 0) 
                      : 0;
                  const activeSlice = sliceData[activeSliceIndex] || sliceData[0];

                  const cx = 230;
                  const cy = 175;
                  const rOut = 112;
                  const rIn = 66;

                  return (
                    <div className="space-y-3">
                      {/* Header with Title and Total */}
                      <div className="flex items-center justify-between pb-1">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-300 flex items-center justify-center font-bold">
                            <BarChart2 className="w-4 h-4 text-[#0066B2] dark:text-sky-300" />
                          </div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider text-[#0A0838] dark:text-white">
                              8-BRACKET AGEING DISTRIBUTION MATRIX
                            </h3>
                          </div>
                        </div>

                        <div>
                          <span className="text-xs font-mono font-bold px-3 py-1 rounded-xl bg-[#EBF5FF] text-[#0066B2] dark:bg-sky-950/50 dark:text-sky-300 border border-[#BFDBFE]">
                            Total: {totalTickets} Tickets
                          </span>
                        </div>
                      </div>

                      {/* --- DONUT CHART & FLOATING TOOLTIP CONTAINER --- */}
                      <div className="p-3 rounded-2xl bg-[#FFFFFF] dark:bg-white/5 border border-slate-200/80 dark:border-white/10 shadow-xs relative flex items-center justify-center min-h-[350px] overflow-hidden">
                        
                        {/* Floating Tooltip Callout Card */}
                        {activeSlice && (
                          <div className="absolute top-3 right-4 p-3 rounded-2xl bg-white/95 dark:bg-[#0A0838]/95 backdrop-blur-md border border-slate-200/90 dark:border-white/15 shadow-xl z-20 pointer-events-none animate-in fade-in zoom-in-95 duration-200 min-w-[140px]">
                            <div className="flex items-center gap-1.5 text-xs font-bold text-[#0A0838] dark:text-white">
                              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: activeSlice.color }} />
                              <span>{activeSlice.label}</span>
                            </div>
                            <div className="text-base font-black font-mono text-[#0A0838] dark:text-white mt-1">
                              {activeSlice.val} Tickets
                            </div>
                            <div className="text-[10.5px] text-slate-500 dark:text-slate-400 font-medium">
                              {activeSlice.sharePct}% of total
                            </div>
                          </div>
                        )}

                        {/* SVG Pie / Donut Chart */}
                        <svg className="w-full max-w-[460px] h-[330px]" viewBox="0 0 460 350">
                          <defs>
                            {/* Glow Filters */}
                            <filter id="glow-slice" x="-20%" y="-20%" width="140%" height="140%">
                              <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.25" />
                            </filter>
                          </defs>

                          {/* Outer Wheel Slices */}
                          <g>
                            {sliceData.map((slice, idx) => {
                              const isHovered = hoveredBracketIdx === idx;
                              const isSelected = activeSliceIndex === idx;
                              const sliceROut = (isHovered || isSelected) ? rOut + 5 : rOut;
                              const sliceRIn = (isHovered || isSelected) ? rIn - 2 : rIn;
                              
                              // Gap of 1.8 degrees between slices
                              const gapDeg = 1.8;
                              const d = describeArc(cx, cy, sliceROut, sliceRIn, slice.startAngle + gapDeg / 2, slice.endAngle - gapDeg / 2);

                              // Internal text position
                              const centerRadius = (sliceROut + sliceRIn) / 2;
                              const pText = polarToCartesian(cx, cy, centerRadius, slice.midAngle);

                              // Pointer lines
                              const pLineStart = polarToCartesian(cx, cy, sliceROut + 2, slice.midAngle);
                              const pDot = polarToCartesian(cx, cy, sliceROut + 16, slice.midAngle);

                              // Text anchor calculation
                              const isRightSide = slice.midAngle >= 0 && slice.midAngle <= 180;
                              const textX = isRightSide ? pDot.x + 8 : pDot.x - 8;
                              const textY = pDot.y + 3.5;
                              const textAnchor = isRightSide ? 'start' : 'end';

                              return (
                                <g
                                  key={idx}
                                  className="cursor-pointer transition-all duration-300"
                                  onMouseEnter={() => setHoveredBracketIdx(idx)}
                                  onMouseLeave={() => setHoveredBracketIdx(null)}
                                >
                                  {/* Slice Arc */}
                                  <path
                                    d={d}
                                    fill={slice.color}
                                    filter="url(#glow-slice)"
                                    className={`transition-all duration-300 ${
                                      isHovered || isSelected
                                        ? 'opacity-100 brightness-105 stroke-2 stroke-white dark:stroke-slate-900'
                                        : 'opacity-90 hover:opacity-100'
                                    }`}
                                  />

                                  {/* Inside percentage text */}
                                  <text
                                    x={pText.x}
                                    y={pText.y + 3}
                                    textAnchor="middle"
                                    className="text-[10px] font-extrabold fill-white dark:fill-white pointer-events-none drop-shadow-sm select-none"
                                    style={{
                                      fill: slice.color === '#6EE7B7' || slice.color === '#FBBF24' ? '#1E293B' : '#FFFFFF'
                                    }}
                                  >
                                    {slice.sharePct}%
                                  </text>

                                  {/* Pointer Line */}
                                  <line
                                    x1={pLineStart.x}
                                    y1={pLineStart.y}
                                    x2={pDot.x}
                                    y2={pDot.y}
                                    stroke={slice.color}
                                    strokeWidth={isHovered || isSelected ? 2 : 1.2}
                                    strokeDasharray={isHovered || isSelected ? 'none' : '2 2'}
                                    className="transition-all duration-300"
                                  />

                                  {/* Pointer Pin Dot */}
                                  <circle
                                    cx={pDot.x}
                                    cy={pDot.y}
                                    r={isHovered || isSelected ? 4 : 3}
                                    fill={slice.color}
                                    stroke="#FFFFFF"
                                    strokeWidth={1.5}
                                    className="transition-all duration-300"
                                  />

                                  {/* Outer Label text */}
                                  <text
                                    x={textX}
                                    y={textY}
                                    textAnchor={textAnchor}
                                    className={`text-[10px] select-none transition-all duration-300 ${
                                      isHovered || isSelected
                                        ? 'font-bold fill-[#0A0838] dark:fill-white text-[11px]'
                                        : 'font-semibold fill-slate-600 dark:fill-slate-300'
                                    }`}
                                  >
                                    {slice.short}
                                  </text>
                                </g>
                              );
                            })}
                          </g>

                          {/* Center Circle Content */}
                          <g className="pointer-events-none">
                            <circle
                              cx={cx}
                              cy={cy}
                              r={rIn - 3}
                              fill="#FFFFFF"
                              className="dark:fill-[#0A0838] drop-shadow-sm"
                            />
                            <circle
                              cx={cx}
                              cy={cy}
                              r={rIn - 3}
                              fill="none"
                              stroke="#E2E8F0"
                              className="dark:stroke-white/10"
                              strokeWidth={1}
                            />
                            <text
                              x={cx}
                              y={cy - 4}
                              textAnchor="middle"
                              className="text-3xl font-black font-mono fill-[#0A0838] dark:fill-white tracking-tight"
                            >
                              {totalTickets}
                            </text>
                            <text
                              x={cx}
                              y={cy + 16}
                              textAnchor="middle"
                              className="text-[10px] font-bold fill-slate-400 dark:text-slate-400 uppercase tracking-wider"
                            >
                              Total Tickets
                            </text>
                          </g>
                        </svg>

                      </div>

                    </div>
                  );
                })()}

                {/* If Hold Reason is selected */}
                {selectedDrilldownHoldReason && (
                  <div className="space-y-3">
                    <div className="p-4 rounded-2xl bg-[#F8FAFC] dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-2">
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-[9.5px] font-mono font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                            selectedDrilldownHoldReason.ticketType === 'Incident'
                              ? 'bg-[#E0F2FE] text-[#0066B2]'
                              : 'bg-[#F3E8FF] text-[#7C3AED]'
                          }`}
                        >
                          {selectedDrilldownHoldReason.ticketType} On-Hold Reason
                        </span>
                        <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700 dark:bg-white/10 dark:text-slate-300">
                          {selectedDrilldownHoldReason.sharePct}% Total Share
                        </span>
                      </div>

                      <h4 className="text-lg font-bold text-[#0A0838] dark:text-white">
                        {selectedDrilldownHoldReason.holdReason}
                      </h4>

                      <div className="text-2xl font-extrabold font-mono text-[#0A0838] dark:text-white">
                        {selectedDrilldownHoldReason.count} {selectedDrilldownHoldReason.ticketType === 'Incident' ? 'Incidents' : 'Tasks'}
                      </div>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-[#F8FAFC] dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-1">
                      <span className="text-[9.5px] font-bold text-[#0066B2] dark:text-sky-300 uppercase tracking-wider block">
                        Official Excel Definition &amp; Description
                      </span>
                      <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                        {selectedDrilldownHoldReason.definition}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* --- MODAL FOOTER --- */}
            <div className="pt-3 border-t border-[#E5DFD3] dark:border-white/10 flex items-center justify-between text-xs shrink-0">
              <div />

              <div className="flex items-center gap-2">
                {drilldownLevel > 1 && (
                  <button
                    onClick={() => {
                      if (drilldownLevel === 3) {
                        setDrilldownLevel(2);
                        setSelectedDrilldownGroup(null);
                        setSelectedDrilldownHoldReason(null);
                      } else {
                        setDrilldownLevel(1);
                        setSelectedDrilldownCategory(null);
                      }
                    }}
                    className="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-white/20 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 text-xs font-semibold transition-all cursor-pointer"
                  >
                    ← Back
                  </button>
                )}
                <button
                  onClick={closeDrilldown}
                  className="px-4 py-1.5 rounded-xl bg-[#0A0838] hover:bg-[#0A0838]/80 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TicketPulse;
