import React, { useState, useEffect } from 'react';
import { useLiveData } from '../hooks/useLiveData';
import { LiveDataBadge } from '../components/LiveDataBadge';
import {
  Laptop,
  Users,
  Clock,
  CheckCircle2,
  Activity,
  Layers,
  BarChart2,
  Zap,
  PhoneCall,
  Mail,
  Ticket,
  Bell,
  Sparkles,
  Key,
  ShieldCheck
} from 'lucide-react';

interface ServiceDeskPulseProps {
  onNavigateToNext?: () => void;
  onNavigateToPrev?: () => void;
  onNavigateToMOM?: () => void;
}

export const ServiceDeskPulse: React.FC<ServiceDeskPulseProps> = ({
  onNavigateToNext,
  onNavigateToPrev,
  onNavigateToMOM
}) => {
  // Live data from SharePoint Excel (Sheet 4: '4. Tickets' and Sheet 7: '7. Automation & Hygiene')
  const { data: liveData, isLoading, isRefreshing, error, lastUpdatedDisplay, dataSource, refresh } = useLiveData();

  // Safe destructuring of live SharePoint / Excel data
  const serviceFootprint = Array.isArray(liveData?.serviceFootprint) ? liveData.serviceFootprint : [];
  const julyOmnichannelVolumes = Array.isArray(liveData?.omnichannelVolumes) ? liveData.omnichannelVolumes : [];
  const julyTotalInteractions = typeof liveData?.totalInteractions === 'number' ? liveData.totalInteractions : 8402;
  const serviceDeskKPIParameters = Array.isArray(liveData?.kpiParameters) ? liveData.kpiParameters : [];
  const adHygiene = liveData?.adHygiene || {
    licensesReleasedTotal: 1311,
    licenseBreakdown: [
      { tier: 'SPE-F1', count: 825, description: 'Firstline Worker Suite', color: '#0284C7' },
      { tier: 'SPE-E5', count: 335, description: 'Enterprise Premium Security & Compliance', color: '#8B5CF6' },
      { tier: 'MS-E7', count: 151, description: 'Specialized Enterprise Tier', color: '#E31837' }
    ],
    mailboxPoliciesApplied: 289,
    staleItemsDisabledTotal: 2732,
    staleComputersDisabled: 1189,
    staleUserAccountsDisabled: 1543
  };

  // Extract endpoints and users count dynamically
  const endPointsValue = serviceFootprint.find(f => f.iconName === 'Laptop' || f.label.toLowerCase().includes('end'))?.value || '10800+';
  const usersCountValue = serviceFootprint.find(f => f.iconName === 'Users' || f.label.toLowerCase().includes('user'))?.value || '18300+';

  // Extract July volumetrics
  const ticketsVolume = julyOmnichannelVolumes.find(v => v.channel.toLowerCase().includes('ticket'))?.volume ?? 3703;
  const callsVolume = julyOmnichannelVolumes.find(v => v.channel.toLowerCase().includes('voice') || v.channel.toLowerCase().includes('call'))?.volume ?? 1129;
  const emailVolume = julyOmnichannelVolumes.find(v => v.channel.toLowerCase().includes('email') || v.channel.toLowerCase().includes('mail'))?.volume ?? 3516;
  const notifVolume = julyOmnichannelVolumes.find(v => v.channel.toLowerCase().includes('notif'))?.volume ?? 54;
  const totalVolume = julyTotalInteractions || (ticketsVolume + callsVolume + emailVolume + notifVolume);

  // Animation staging & interactive states
  const [animStage, setAnimStage] = useState<number>(0);
  const [hoveredCircle, setHoveredCircle] = useState<string | null>(null);
  const [selectedRow, setSelectedRow] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'trend' | 'cards' | 'matrix'>('trend');
  const [barProgress, setBarProgress] = useState(0);

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
      setBarProgress(1);

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
    }, 200);

    const t3 = setTimeout(() => setAnimStage(3), 350);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [ticketsVolume, callsVolume, emailVolume, notifVolume, totalVolume]);

  // Format table rows dynamically based on Excel kpiParameters
  const tableRows = serviceDeskKPIParameters.length > 0 ? serviceDeskKPIParameters : [
    {
      parameter: 'Average Call talk time',
      baseline: '10:00',
      apr: '2:05',
      may: '2:12',
      jun: '2:21',
      jul: '2:05',
      varianceVsBaseline: '79.2% faster than 10-min SLA ceiling',
      status: 'positive',
      trend: 'down-good'
    },
    {
      parameter: 'Average Answer Time',
      baseline: '0:10',
      apr: '0:06',
      may: '0:06',
      jun: '0:07',
      jul: '0:06',
      varianceVsBaseline: '40% below 10-second SLA limit',
      status: 'positive',
      trend: 'down-good'
    },
    {
      parameter: 'Email',
      baseline: 'NA',
      apr: '1846',
      may: '1472',
      jun: '1542',
      jul: String(emailVolume),
      varianceVsBaseline: '+128% interaction surge in July',
      status: 'attention',
      trend: 'up-surge'
    },
    {
      parameter: 'Notifications',
      baseline: 'NA',
      apr: '58',
      may: '49',
      jun: '49',
      jul: String(notifVolume),
      varianceVsBaseline: 'Steady enterprise broadcast flow',
      status: 'positive',
      trend: 'stable'
    }
  ];

  // Volumetric channel data
  const volumetricItems = [
    {
      id: 'tickets',
      label: 'Tickets',
      value: animatedVolumes.tickets,
      targetValue: ticketsVolume,
      pct: totalVolume > 0 ? ((ticketsVolume / totalVolume) * 100).toFixed(1) : '44.1',
      borderColor: '#0284C7',
      bgFill: 'rgba(2, 132, 199, 0.08)',
      textColor: '#0284C7',
      badgeColor: 'bg-sky-600',
      icon: Ticket,
      desc: 'Self-Service & Portal'
    },
    {
      id: 'calls',
      label: 'Calls',
      value: animatedVolumes.calls,
      targetValue: callsVolume,
      pct: totalVolume > 0 ? ((callsVolume / totalVolume) * 100).toFixed(1) : '13.4',
      borderColor: '#8B5CF6',
      bgFill: 'rgba(139, 92, 246, 0.08)',
      textColor: '#8B5CF6',
      badgeColor: 'bg-purple-600',
      icon: PhoneCall,
      desc: 'Direct Voice Hotline'
    },
    {
      id: 'email',
      label: 'Email',
      value: animatedVolumes.email,
      targetValue: emailVolume,
      pct: totalVolume > 0 ? ((emailVolume / totalVolume) * 100).toFixed(1) : '41.8',
      borderColor: '#10B981',
      bgFill: 'rgba(16, 185, 129, 0.08)',
      textColor: '#10B981',
      badgeColor: 'bg-emerald-600',
      icon: Mail,
      desc: 'Inbound Mailbox'
    },
    {
      id: 'notifications',
      label: 'Notifications',
      value: animatedVolumes.notif,
      targetValue: notifVolume,
      pct: totalVolume > 0 ? ((notifVolume / totalVolume) * 100).toFixed(1) : '0.6',
      borderColor: '#F59E0B',
      bgFill: 'rgba(245, 158, 11, 0.08)',
      textColor: '#D97706',
      badgeColor: 'bg-amber-600',
      icon: Bell,
      desc: 'System Alerts'
    },
    {
      id: 'total',
      label: 'Total',
      value: animatedVolumes.total,
      targetValue: totalVolume,
      pct: '100',
      borderColor: '#0A0838',
      bgFill: 'rgba(10, 8, 56, 0.06)',
      textColor: '#0A0838',
      badgeColor: 'bg-[#0A0838]',
      icon: Activity,
      desc: 'All Interactions'
    }
  ];

  return (
    <div className={`h-full w-full flex flex-col p-4 md:p-5 lg:p-6 gap-3 relative overflow-hidden bg-[#FFFFFF] dark:bg-[#0A0838] text-[#29251D] dark:text-white transition-opacity duration-500 select-none ${isLoading ? 'opacity-70' : 'opacity-100'}`}>

      {/* 1. TOP HEADER */}
      <div className={`shrink-0 transition-all duration-700 ${animStage >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-3'}`}>
        <div className="flex items-start justify-between gap-4 pb-2 border-b border-[#E5DFD3] dark:border-white/10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-[#0066B2] dark:bg-sky-400 animate-pulse" />
              <span className="text-xs font-medium text-[#0066B2] dark:text-sky-400">
                03 • Service Management
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#0A0838] dark:text-white leading-tight">
              Service Management Dashboard
            </h1>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
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

      {/* 2. TOP SECTION: END POINT DEVICES + PARAMETERS (TREND / CARDS / TABLE) */}
      <div className={`shrink-0 grid grid-cols-1 lg:grid-cols-12 gap-3 items-stretch transition-all duration-700 ${animStage >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'}`}>

        {/* Left Column: Unified Metric Card (End Point Devices) */}
        <div className="lg:col-span-3 flex flex-col justify-between bg-white dark:bg-white/5 rounded-2xl border border-[#E5DFD3] dark:border-white/10 p-3.5 shadow-sm executive-glass-card">
          <div className="flex items-center justify-between pb-1.5 border-b border-slate-100 dark:border-white/10">
            <span className="text-xs font-bold text-[#0A0838] dark:text-slate-200 flex items-center gap-1.5">
              <Laptop className="w-3.5 h-3.5 text-[#0A0838] dark:text-slate-300" />
              End Point Devices
            </span>
            <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-white/10 border border-slate-200 dark:border-white/10 text-[9.5px] font-mono text-slate-600 dark:text-slate-300 font-bold">
              Scope
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2.5 my-auto py-2">
            {/* Metric 1: End Points */}
            <div className="p-2.5 rounded-xl bg-slate-50/80 dark:bg-white/3 border border-[#E5DFD3] dark:border-white/5 flex flex-col justify-between">
              <div className="flex items-center gap-1.5 mb-1">
                <div className="w-5 h-5 rounded-md bg-[#0A0838]/10 text-[#0A0838] dark:text-white flex items-center justify-center">
                  <Laptop className="w-3 h-3" />
                </div>
                <span className="text-[10.5px] font-semibold text-[#4D4D4F] dark:text-slate-400 truncate">
                  End Points
                </span>
              </div>
              <span className="text-xl lg:text-2xl font-bold text-[#29251D] dark:text-white tracking-tight">
                {endPointsValue}
              </span>
            </div>

            {/* Metric 2: Users Count */}
            <div className="p-2.5 rounded-xl bg-slate-50/80 dark:bg-white/3 border border-[#E5DFD3] dark:border-white/5 flex flex-col justify-between">
              <div className="flex items-center gap-1.5 mb-1">
                <div className="w-5 h-5 rounded-md bg-[#0A0838]/10 text-[#0A0838] dark:text-white flex items-center justify-center">
                  <Users className="w-3 h-3" />
                </div>
                <span className="text-[10.5px] font-semibold text-[#4D4D4F] dark:text-slate-400 truncate">
                  Users Count
                </span>
              </div>
              <span className="text-xl lg:text-2xl font-bold text-[#29251D] dark:text-white tracking-tight">
                {usersCountValue}
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Service Desk Parameters (Trend | Cards | Table) */}
        <div className="lg:col-span-9 flex flex-col justify-between bg-white dark:bg-white/5 rounded-2xl border border-[#E5DFD3] dark:border-white/10 p-3 shadow-sm">

          {/* Header & View Mode Toggle */}
          <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-slate-100 dark:border-white/10">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-sky-500/15 border border-sky-500/35 text-sky-600 dark:text-sky-300 flex items-center justify-center shadow-inner">
                <Clock className="w-3 h-3" />
              </div>
              <h2 className="text-xs font-bold text-[#0A0838] dark:text-slate-200">
                Service Desk Parameters
              </h2>
              <span className="text-[9.5px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-300 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                SLA Met
              </span>
            </div>

            {/* View Mode Toggle: Trend first, Cards, Table */}
            <div className="flex items-center gap-1 bg-[#FFFFFF] dark:bg-white/10 p-0.5 rounded-lg text-[10px] font-mono border border-[#E5DFD3] dark:border-white/10">
              <button
                onClick={() => setViewMode('trend')}
                className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1 cursor-pointer font-medium ${viewMode === 'trend'
                  ? 'bg-[#0A0838] !text-white shadow-xs font-semibold'
                  : 'text-[#4D4D4F] dark:text-slate-400 hover:text-[#0A0838]'
                  }`}
              >
                <Activity className="w-3 h-3" />
                Trend
              </button>
              <button
                onClick={() => setViewMode('cards')}
                className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1 cursor-pointer font-medium ${viewMode === 'cards'
                  ? 'bg-[#0A0838] !text-white shadow-xs font-semibold'
                  : 'text-[#4D4D4F] dark:text-slate-400 hover:text-[#0A0838]'
                  }`}
              >
                <BarChart2 className="w-3 h-3" />
                Cards
              </button>
              <button
                onClick={() => setViewMode('matrix')}
                className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1 cursor-pointer font-medium ${viewMode === 'matrix'
                  ? 'bg-[#0A0838] !text-white shadow-xs font-semibold'
                  : 'text-[#4D4D4F] dark:text-slate-400 hover:text-[#0A0838]'
                  }`}
              >
                <Layers className="w-3 h-3" />
                Table
              </button>
            </div>
          </div>

          {/* Mode 1 (Default): Dedicated Multi-Month Trend Visualizations with Data Labels */}
          {viewMode === 'trend' && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 py-1 flex-1 items-stretch font-heading">

              {/* Trend Card 1: Average Call Talk Time */}
              <div className="p-3 rounded-xl bg-slate-50/90 dark:bg-white/5 border border-[#E5DFD3] dark:border-white/10 flex flex-col justify-between hover:shadow-md transition-all">
                <div className="pb-1 border-b border-slate-200/60 dark:border-white/5">
                  <span className="text-xs font-heading font-bold text-slate-800 dark:text-slate-200 block leading-tight">
                    Average Call Talk Time
                  </span>
                </div>

                {/* SVG Trend Line Chart with Data Labels */}
                <div className="h-20 w-full relative my-auto py-1">
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 200 65" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="talk-grad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10B981" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    <line x1="0" y1="15" x2="200" y2="15" stroke="#CBD5E1" strokeDasharray="3 3" strokeWidth="0.8" opacity="0.5" />
                    <line x1="0" y1="48" x2="200" y2="48" stroke="#CBD5E1" strokeDasharray="3 3" strokeWidth="0.8" opacity="0.3" />

                    <path
                      d="M 20 44 C 60 38, 100 24, 135 22 C 160 30, 175 42, 185 44 L 185 62 L 20 62 Z"
                      fill="url(#talk-grad)"
                    />
                    <path
                      d="M 20 44 C 60 38, 100 24, 135 22 C 160 30, 175 42, 185 44"
                      fill="none"
                      stroke="#10B981"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />

                    {/* Points & Data Labels for ALL months */}
                    <circle cx="20" cy="44" r="3.5" fill="#10B981" />
                    <text x="20" y="36" textAnchor="middle" fill="#047857" className="text-[8px] font-mono font-extrabold">2:05</text>

                    <circle cx="75" cy="36" r="3.5" fill="#10B981" />
                    <text x="75" y="28" textAnchor="middle" fill="#047857" className="text-[8px] font-mono font-extrabold">2:12</text>

                    <circle cx="135" cy="22" r="3.5" fill="#10B981" />
                    <text x="135" y="14" textAnchor="middle" fill="#047857" className="text-[8px] font-mono font-extrabold">2:21</text>

                    <circle cx="185" cy="44" r="3.5" fill="#10B981" />
                    <text x="185" y="36" textAnchor="middle" fill="#047857" className="text-[8px] font-mono font-extrabold">2:05</text>
                  </svg>
                </div>

                {/* 4-Month Label Pills (Uniform, No special July highlight) */}
                <div className="grid grid-cols-4 gap-1 text-[9.5px] font-heading font-semibold text-center pt-1.5 border-t border-slate-200/70 dark:border-white/5">
                  <div className="bg-white/80 dark:bg-white/5 py-0.5 rounded text-slate-600 dark:text-slate-400">Apr</div>
                  <div className="bg-white/80 dark:bg-white/5 py-0.5 rounded text-slate-600 dark:text-slate-400">May</div>
                  <div className="bg-white/80 dark:bg-white/5 py-0.5 rounded text-slate-600 dark:text-slate-400">Jun</div>
                  <div className="bg-white/80 dark:bg-white/5 py-0.5 rounded text-slate-600 dark:text-slate-400">Jul</div>
                </div>
              </div>

              {/* Trend Card 2: Average Answer Time (ASA) */}
              <div className="p-3 rounded-xl bg-slate-50/90 dark:bg-white/5 border border-[#E5DFD3] dark:border-white/10 flex flex-col justify-between hover:shadow-md transition-all">
                <div className="pb-1 border-b border-slate-200/60 dark:border-white/5">
                  <span className="text-xs font-heading font-bold text-slate-800 dark:text-slate-200 block leading-tight">
                    Average Answer Time (ASA)
                  </span>
                </div>

                {/* SVG Trend Line Chart with Data Labels */}
                <div className="h-20 w-full relative my-auto py-1">
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 200 65" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="asa-grad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#0284C7" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#0284C7" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    <line x1="0" y1="18" x2="200" y2="18" stroke="#CBD5E1" strokeDasharray="3 3" strokeWidth="0.8" opacity="0.5" />
                    <line x1="0" y1="46" x2="200" y2="46" stroke="#CBD5E1" strokeDasharray="3 3" strokeWidth="0.8" opacity="0.3" />

                    <path
                      d="M 20 42 C 60 42, 100 38, 135 26 C 155 36, 175 42, 185 42 L 185 62 L 20 62 Z"
                      fill="url(#asa-grad)"
                    />
                    <path
                      d="M 20 42 C 60 42, 100 38, 135 26 C 155 36, 175 42, 185 42"
                      fill="none"
                      stroke="#0284C7"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />

                    {/* Points & Data Labels for ALL months */}
                    <circle cx="20" cy="42" r="3.5" fill="#0284C7" />
                    <text x="20" y="34" textAnchor="middle" fill="#0284C7" className="text-[8px] font-mono font-extrabold">0:06</text>

                    <circle cx="75" cy="42" r="3.5" fill="#0284C7" />
                    <text x="75" y="34" textAnchor="middle" fill="#0284C7" className="text-[8px] font-mono font-extrabold">0:06</text>

                    <circle cx="135" cy="26" r="3.5" fill="#0284C7" />
                    <text x="135" y="18" textAnchor="middle" fill="#0284C7" className="text-[8px] font-mono font-extrabold">0:07</text>

                    <circle cx="185" cy="42" r="3.5" fill="#0284C7" />
                    <text x="185" y="34" textAnchor="middle" fill="#0284C7" className="text-[8px] font-mono font-extrabold">0:06</text>
                  </svg>
                </div>

                {/* 4-Month Label Pills (Uniform, No special July highlight) */}
                <div className="grid grid-cols-4 gap-1 text-[9.5px] font-heading font-semibold text-center pt-1.5 border-t border-slate-200/70 dark:border-white/5">
                  <div className="bg-white/80 dark:bg-white/5 py-0.5 rounded text-slate-600 dark:text-slate-400">Apr</div>
                  <div className="bg-white/80 dark:bg-white/5 py-0.5 rounded text-slate-600 dark:text-slate-400">May</div>
                  <div className="bg-white/80 dark:bg-white/5 py-0.5 rounded text-slate-600 dark:text-slate-400">Jun</div>
                  <div className="bg-white/80 dark:bg-white/5 py-0.5 rounded text-slate-600 dark:text-slate-400">Jul</div>
                </div>
              </div>

              {/* Trend Card 3: Email Interactions */}
              <div className="p-3 rounded-xl bg-slate-50/90 dark:bg-white/5 border border-[#E5DFD3] dark:border-white/10 flex flex-col justify-between hover:shadow-md transition-all">
                <div className="pb-1 border-b border-slate-200/60 dark:border-white/5">
                  <span className="text-xs font-heading font-bold text-slate-800 dark:text-slate-200 block leading-tight">
                    Email Interactions
                  </span>
                </div>

                {/* SVG Trend Line Chart with Data Labels */}
                <div className="h-20 w-full relative my-auto py-1">
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 200 65" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="email-grad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#3A59A4" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#3A59A4" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    <line x1="0" y1="18" x2="200" y2="18" stroke="#CBD5E1" strokeDasharray="3 3" strokeWidth="0.8" opacity="0.5" />
                    <line x1="0" y1="50" x2="200" y2="50" stroke="#CBD5E1" strokeDasharray="3 3" strokeWidth="0.8" opacity="0.3" />

                    <path
                      d="M 20 46 C 55 49, 85 52, 130 48 C 150 35, 170 18, 185 14 L 185 62 L 20 62 Z"
                      fill="url(#email-grad)"
                    />
                    <path
                      d="M 20 46 C 55 49, 85 52, 130 48 C 150 35, 170 18, 185 14"
                      fill="none"
                      stroke="#3A59A4"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />

                    {/* Points & Exact Data Labels for ALL months */}
                    <circle cx="20" cy="46" r="3.5" fill="#3A59A4" />
                    <text x="20" y="38" textAnchor="middle" fill="#3A59A4" className="text-[7.5px] font-mono font-extrabold">1,846</text>

                    <circle cx="75" cy="51" r="3.5" fill="#3A59A4" />
                    <text x="75" y="43" textAnchor="middle" fill="#3A59A4" className="text-[7.5px] font-mono font-extrabold">1,472</text>

                    <circle cx="130" cy="48" r="3.5" fill="#3A59A4" />
                    <text x="130" y="40" textAnchor="middle" fill="#3A59A4" className="text-[7.5px] font-mono font-extrabold">1,542</text>

                    <circle cx="185" cy="14" r="3.5" fill="#3A59A4" />
                    <text x="185" y="6" textAnchor="middle" fill="#3A59A4" className="text-[8px] font-mono font-extrabold">3,516</text>
                  </svg>
                </div>

                {/* 4-Month Label Pills (Uniform, No special July highlight) */}
                <div className="grid grid-cols-4 gap-1 text-[9.5px] font-heading font-semibold text-center pt-1.5 border-t border-slate-200/70 dark:border-white/5">
                  <div className="bg-white/80 dark:bg-white/5 py-0.5 rounded text-slate-600 dark:text-slate-400">Apr</div>
                  <div className="bg-white/80 dark:bg-white/5 py-0.5 rounded text-slate-600 dark:text-slate-400">May</div>
                  <div className="bg-white/80 dark:bg-white/5 py-0.5 rounded text-slate-600 dark:text-slate-400">Jun</div>
                  <div className="bg-white/80 dark:bg-white/5 py-0.5 rounded text-slate-600 dark:text-slate-400">Jul</div>
                </div>
              </div>

              {/* Trend Card 4: System Notifications */}
              <div className="p-3 rounded-xl bg-slate-50/90 dark:bg-white/5 border border-[#E5DFD3] dark:border-white/10 flex flex-col justify-between hover:shadow-md transition-all">
                <div className="pb-1 border-b border-slate-200/60 dark:border-white/5">
                  <span className="text-xs font-heading font-bold text-slate-800 dark:text-slate-200 block leading-tight">
                    System Notifications
                  </span>
                </div>

                {/* SVG Trend Line Chart with Data Labels */}
                <div className="h-20 w-full relative my-auto py-1">
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 200 65" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="notif-grad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    <line x1="0" y1="20" x2="200" y2="20" stroke="#CBD5E1" strokeDasharray="3 3" strokeWidth="0.8" opacity="0.5" />
                    <line x1="0" y1="48" x2="200" y2="48" stroke="#CBD5E1" strokeDasharray="3 3" strokeWidth="0.8" opacity="0.3" />

                    <path
                      d="M 20 22 C 60 46, 100 46, 130 46 C 155 42, 175 34, 185 32 L 185 62 L 20 62 Z"
                      fill="url(#notif-grad)"
                    />
                    <path
                      d="M 20 22 C 60 46, 100 46, 130 46 C 155 42, 175 34, 185 32"
                      fill="none"
                      stroke="#8B5CF6"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />

                    {/* Points & Data Labels for ALL months */}
                    <circle cx="20" cy="22" r="3.5" fill="#8B5CF6" />
                    <text x="20" y="14" textAnchor="middle" fill="#7C3AED" className="text-[8px] font-mono font-extrabold">58</text>

                    <circle cx="75" cy="46" r="3.5" fill="#8B5CF6" />
                    <text x="75" y="38" textAnchor="middle" fill="#7C3AED" className="text-[8px] font-mono font-extrabold">49</text>

                    <circle cx="130" cy="46" r="3.5" fill="#8B5CF6" />
                    <text x="130" y="38" textAnchor="middle" fill="#7C3AED" className="text-[8px] font-mono font-extrabold">49</text>

                    <circle cx="185" cy="32" r="3.5" fill="#8B5CF6" />
                    <text x="185" y="24" textAnchor="middle" fill="#7C3AED" className="text-[8px] font-mono font-extrabold">54</text>
                  </svg>
                </div>

                {/* 4-Month Label Pills (Uniform, No special July highlight) */}
                <div className="grid grid-cols-4 gap-1 text-[9.5px] font-heading font-semibold text-center pt-1.5 border-t border-slate-200/70 dark:border-white/5">
                  <div className="bg-white/80 dark:bg-white/5 py-0.5 rounded text-slate-600 dark:text-slate-400">Apr</div>
                  <div className="bg-white/80 dark:bg-white/5 py-0.5 rounded text-slate-600 dark:text-slate-400">May</div>
                  <div className="bg-white/80 dark:bg-white/5 py-0.5 rounded text-slate-600 dark:text-slate-400">Jun</div>
                  <div className="bg-white/80 dark:bg-white/5 py-0.5 rounded text-slate-600 dark:text-slate-400">Jul</div>
                </div>
              </div>

            </div>
          )}

          {/* Mode 2: Clean 4-Card Parameter Overview */}
          {viewMode === 'cards' && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 py-1 flex-1 items-stretch">
              {tableRows.map(row => (
                <div
                  key={row.parameter}
                  className="p-3 rounded-xl bg-slate-50/90 dark:bg-white/5 border border-[#E5DFD3] dark:border-white/10 flex flex-col justify-between hover:scale-[1.02] transition-transform duration-200"
                >
                  <span className="text-xs font-heading font-bold text-slate-700 dark:text-slate-300 line-clamp-1">
                    {row.parameter}
                  </span>
                  <div className="my-1">
                    <div className="text-xl lg:text-2xl font-heading font-extrabold text-[#0A0838] dark:text-[#38BDF8]">
                      {row.jul}
                    </div>
                    <span className="text-[10px] font-heading font-medium text-slate-500 dark:text-slate-400">
                      Baseline: {row.baseline}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Mode 3: Compact Table Matrix */}
          {viewMode === 'matrix' && (
            <div className="rounded-xl overflow-hidden border border-[#E5DFD3] dark:border-white/10 flex-1 flex flex-col justify-center">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#E5DFD3] dark:border-white/10 text-xs">
                    <th className="py-1.5 px-3 font-bold font-heading text-slate-800 dark:text-white bg-slate-50 dark:bg-slate-800/80 w-[30%]">
                      KPI / SLA Parameter
                    </th>
                    <th className="py-1.5 px-2 font-bold font-heading text-slate-800 dark:text-cyan-200 text-center bg-[#BFE3EC] dark:bg-[#004d66]/70 border-l border-white/80 dark:border-white/10 w-[14%]">
                      Baseline
                    </th>
                    <th className="py-1.5 px-2 font-bold font-heading text-slate-800 dark:text-emerald-200 text-center bg-[#E5EFE1] dark:bg-[#1B3820]/70 border-l border-white/80 dark:border-white/10 w-[14%]">
                      Apr'26
                    </th>
                    <th className="py-1.5 px-2 font-bold font-heading text-slate-800 dark:text-emerald-200 text-center bg-[#E5EFE1] dark:bg-[#1B3820]/70 border-l border-white/80 dark:border-white/10 w-[14%]">
                      May'26
                    </th>
                    <th className="py-1.5 px-2 font-bold font-heading text-slate-800 dark:text-emerald-200 text-center bg-[#E5EFE1] dark:bg-[#1B3820]/70 border-l border-white/80 dark:border-white/10 w-[14%]">
                      Jun'26
                    </th>
                    <th className="py-1.5 px-2 font-bold font-heading text-slate-800 dark:text-emerald-200 text-center bg-[#E5EFE1] dark:bg-[#1B3820]/70 border-l border-white/80 dark:border-white/10 w-[14%]">
                      July'26
                    </th>
                  </tr>
                </thead>
                <tbody className="text-xs divide-y divide-[#E5DFD3]/80 dark:divide-white/5 font-heading">
                  {tableRows.map((row, idx) => {
                    const isHovered = selectedRow === row.parameter;
                    return (
                      <tr
                        key={row.parameter || idx}
                        onMouseEnter={() => setSelectedRow(row.parameter)}
                        onMouseLeave={() => setSelectedRow(null)}
                        className={`transition-all duration-200 cursor-pointer ${isHovered ? 'bg-sky-50/70 dark:bg-white/5 shadow-xs' : ''
                          }`}
                      >
                        <td className="py-1.5 px-3 font-semibold text-slate-800 dark:text-slate-200">
                          {row.parameter}
                        </td>
                        <td className="py-1.5 px-2 font-medium text-center text-slate-900 dark:text-cyan-100 bg-[#CDEAF2]/60 dark:bg-[#003b4d]/30 border-l border-[#E5DFD3]/60 dark:border-white/5">
                          {row.baseline}
                        </td>
                        <td className="py-1.5 px-2 font-medium text-center text-slate-900 dark:text-emerald-100 bg-[#EEF6EB]/60 dark:bg-[#152e1b]/30 border-l border-[#E5DFD3]/60 dark:border-white/5">
                          {row.apr}
                        </td>
                        <td className="py-1.5 px-2 font-medium text-center text-slate-900 dark:text-emerald-100 bg-[#EEF6EB]/60 dark:bg-[#152e1b]/30 border-l border-[#E5DFD3]/60 dark:border-white/5">
                          {row.may}
                        </td>
                        <td className="py-1.5 px-2 font-medium text-center text-slate-900 dark:text-emerald-100 bg-[#EEF6EB]/60 dark:bg-[#152e1b]/30 border-l border-[#E5DFD3]/60 dark:border-white/5">
                          {row.jun}
                        </td>
                        <td className="py-1.5 px-2 font-bold text-center text-slate-950 dark:text-emerald-100 bg-[#EEF6EB]/80 dark:bg-[#152e1b]/40 border-l border-[#E5DFD3]/60 dark:border-white/5">
                          <span className="px-1.5 py-0.2 rounded bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 font-bold">
                            {row.jul}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

        </div>

      </div>

      {/* 3. LOWER SECTION: SERVICE DESK SUPPORT VOLUMETRICS (EXPANDED FULL-WIDTH) */}
      <div className={`flex-1 min-h-0 flex flex-col transition-all duration-700 ${animStage >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'}`}>

        <div className="flex-1 p-4 rounded-2xl bg-white dark:bg-white/5 border border-[#E5DFD3] dark:border-white/10 shadow-sm flex flex-col justify-between">
          {/* Header */}
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 dark:border-white/10">
            <h2 className="text-xs md:text-sm font-bold text-[#0A0838] dark:text-slate-200 truncate">
              Service Desk Support Volumetrics for the Reporting Month
            </h2>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-[10px] font-mono px-3 py-1 rounded-full bg-[#0A0838]/10 dark:bg-white/10 border border-[#0A0838]/20 dark:border-white/20 text-[#0A0838] dark:text-white font-bold">
                July 2026
              </span>
            </div>
          </div>

          {/* 5 Channel Cards Grid */}
          <div className="flex-1 grid grid-cols-2 sm:grid-cols-5 gap-3 items-stretch py-1 my-auto">
            {volumetricItems.map((item, idx) => {
              const ItemIcon = item.icon;
              const isHovered = hoveredCircle === item.id;
              const isTotal = item.id === 'total';
              return (
                <div
                  key={item.id}
                  onMouseEnter={() => setHoveredCircle(item.id)}
                  onMouseLeave={() => setHoveredCircle(null)}
                  style={{ animationDelay: `${idx * 60}ms`, animationFillMode: 'both' }}
                  className={`p-3.5 rounded-2xl border flex flex-col items-center justify-between text-center transition-all duration-300 cursor-pointer animate-in fade-in slide-in-from-bottom-2 ${isTotal
                    ? 'bg-[#0A0838]/5 dark:bg-white/10 border-2 border-[#0A0838] dark:border-white/30 shadow-sm hover:scale-[1.02]'
                    : isHovered
                      ? 'bg-slate-50 dark:bg-white/10 border-slate-400 shadow-md scale-[1.02]'
                      : 'bg-slate-50/70 dark:bg-white/3 border-[#E5DFD3] dark:border-white/5 hover:border-slate-300 hover:scale-[1.01]'
                    }`}
                >
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-1.5 shadow-inner" style={{ backgroundColor: `${item.borderColor}18`, color: item.borderColor }}>
                    <ItemIcon className="w-4 h-4" />
                  </div>
                  <span className="text-xs md:text-sm font-heading font-bold text-slate-800 dark:text-slate-200 leading-tight truncate w-full">
                    {item.label}
                  </span>
                  <span className="text-xl lg:text-2xl font-heading font-extrabold text-[#29251D] dark:text-white my-1 tracking-tight">
                    {item.value.toLocaleString()}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
};

export default ServiceDeskPulse;
