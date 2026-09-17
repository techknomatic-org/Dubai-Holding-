import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useLiveData } from '../hooks/useLiveData';
import { LiveDataBadge } from '../components/LiveDataBadge';
import { defaultAutomationUseCases, AutomationUseCaseItem, defaultADHygieneModel, ActiveDirectoryHygieneModel } from '../data/automationData';
import { EXCEL_AUTOMATION_MONTHLY } from '../data/excelDataSource';
import {
  Cpu,
  CheckCircle2,
  Clock,
  Ticket,
  Mail,
  PhoneCall,
  Bell,
  Target,
  Sparkles,
  Zap,
  ShieldCheck,
  Bot,
  Workflow,
  BarChart3,
  Layers,
  Inbox,
  GitBranch,
  Headphones,
  Wrench,
  Check,
  Info,
  X,
  ArrowRight,
  ArrowDown,
  ChevronRight,
  TrendingUp,
  FileCheck,
  Server,
  Shield,
  Search,
  ArrowLeft,
  MousePointerClick,
  Key,
  UserCheck,
  HardDrive
} from 'lucide-react';

interface AutonomousServiceDeskProps {
  onNavigateToNext?: () => void;
  onNavigateToPrev?: () => void;
}

type StreamType = 'INFRA OPS' | 'SEC OPS' | 'TOTAL PIPELINE';
type FilterStatus = 'ALL' | 'ACTIVE' | 'PLANNED';

export const AutonomousServiceDesk: React.FC<AutonomousServiceDeskProps> = ({
  onNavigateToNext,
  onNavigateToPrev
}) => {
  const { data: liveData, isLoading, isRefreshing, error, lastUpdatedDisplay, dataSource, refresh } = useLiveData();

  const interactionBreakdown = liveData?.interactionBreakdown || {
    tickets: 3613,
    emails: 3084,
    calls: 1265,
    notifications: 49,
    totalMonthly: 8011
  };

  const maturityModel = liveData?.maturityModel || {
    achievedPct: 12,
    targetPct: 30,
    dueDate: '31 Dec 2026',
    status: 'Ahead of Schedule'
  };

  const adHygiene: ActiveDirectoryHygieneModel = liveData?.adHygiene || defaultADHygieneModel;

  const heroKPIs = liveData?.automationHeroKPIs || {
    totalUseCasesDeployed: 9,
    ticketsAutomated: 4470,
    overallSOPsAutomated: 31,
    useCasesLive: 56,
    srsProcessedByAutomation: 4470,
    srsProcessedByTechHub: 22319,
    automationAchievedPct: 20.03
  };

  const monthlyTrends = liveData?.automationMonthlyTrends || [
    { monthKey: '2026-04', monthLabel: 'Apr 2026', techHubSRs: 6519, automationSRs: 1408, totalSRs: 7927, automationPct: 17.76 },
    { monthKey: '2026-05', monthLabel: 'May 2026', techHubSRs: 4340, automationSRs: 978, totalSRs: 5318, automationPct: 18.39 },
    { monthKey: '2026-06', monthLabel: 'Jun 2026', techHubSRs: 5882, automationSRs: 1028, totalSRs: 6910, automationPct: 14.88 },
    { monthKey: '2026-07', monthLabel: 'Jul 2026', techHubSRs: 5578, automationSRs: 1056, totalSRs: 6634, automationPct: 15.92 }
  ];

  // Central use cases data source for the merged pipeline
  const allUseCases: AutomationUseCaseItem[] = useMemo(() => {
    return liveData?.automationUseCases && liveData.automationUseCases.length > 0
      ? liveData.automationUseCases
      : defaultAutomationUseCases;
  }, [liveData?.automationUseCases]);

  const [animStage, setAnimStage] = useState<number>(0);
  const [hoveredChannel, setHoveredChannel] = useState<string | null>(null);
  const [leftTab, setLeftTab] = useState<'volume' | 'ad_hygiene'>('volume');
  const [activeModal, setActiveModal] = useState<'zero-touch' | 'techhub' | 'smart-routing' | 'ad-hygiene' | 'volume-maturity' | null>(null);
  const [hoveredOffloadSlice, setHoveredOffloadSlice] = useState<'zero-touch' | 'techhub' | null>(null);
  const [selectedOffloadSlice, setSelectedOffloadSlice] = useState<'zero-touch' | 'techhub' | null>(null);

  // Pipeline Modal Navigation State
  const [activeModalLevel, setActiveModalLevel] = useState<1 | 2 | 3>(1);
  const [selectedStream, setSelectedStream] = useState<StreamType | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<FilterStatus>('ALL');
  const [selectedStreamSubFilter, setSelectedStreamSubFilter] = useState<'ALL' | 'INFRA OPS' | 'SEC OPS'>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Animated counters
  const [animatedChannels, setAnimatedChannels] = useState({
    tickets: 0,
    emails: 0,
    calls: 0,
    notifications: 0,
    achievedPct: 0,
    totalSR: 0,
    autoSR: 0,
    techHubSR: 0
  });

  const totalDemandSR = heroKPIs.srsProcessedByTechHub + heroKPIs.srsProcessedByAutomation;

  useEffect(() => {
    const t1 = setTimeout(() => setAnimStage(1), 50);
    const t2 = setTimeout(() => {
      setAnimStage(2);

      const duration = 800;
      const startTime = performance.now();
      const frame = (time: number) => {
        const progress = Math.min(1, (time - startTime) / duration);
        const ease = 1 - Math.pow(1 - progress, 3);
        setAnimatedChannels({
          tickets: Math.round(ease * interactionBreakdown.tickets),
          emails: Math.round(ease * interactionBreakdown.emails),
          calls: Math.round(ease * interactionBreakdown.calls),
          notifications: Math.round(ease * interactionBreakdown.notifications),
          achievedPct: Math.round(ease * maturityModel.achievedPct),
          totalSR: Math.round(ease * totalDemandSR),
          autoSR: Math.round(ease * heroKPIs.srsProcessedByAutomation),
          techHubSR: Math.round(ease * heroKPIs.srsProcessedByTechHub)
        });
        if (progress < 1) requestAnimationFrame(frame);
      };
      requestAnimationFrame(frame);
    }, 200);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [
    interactionBreakdown.tickets,
    interactionBreakdown.emails,
    interactionBreakdown.calls,
    interactionBreakdown.notifications,
    maturityModel.achievedPct,
    heroKPIs.srsProcessedByAutomation,
    heroKPIs.srsProcessedByTechHub,
    totalDemandSR
  ]);

  // Keyboard shortcut: Escape closes current modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (activeModalLevel === 3) {
          setActiveModalLevel(2);
        } else if (activeModalLevel === 2) {
          closeModal();
        } else if (activeModal) {
          setActiveModal(null);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeModalLevel, activeModal]);

  // Dynamic Stream Statistics derived from single data source
  const streamStats = useMemo(() => {
    const infraCases = allUseCases.filter(u => u.stream === 'INFRA OPS');
    const secCases = allUseCases.filter(u => u.stream === 'SEC OPS');

    return {
      infra: {
        total: infraCases.length,
        active: infraCases.filter(u => u.status === 'ACTIVE').length,
        planned: infraCases.filter(u => u.status === 'PLANNED').length
      },
      sec: {
        total: secCases.length,
        active: secCases.filter(u => u.status === 'ACTIVE').length,
        planned: secCases.filter(u => u.status === 'PLANNED').length
      },
      total: {
        total: allUseCases.length,
        active: allUseCases.filter(u => u.status === 'ACTIVE').length,
        planned: allUseCases.filter(u => u.status === 'PLANNED').length
      }
    };
  }, [allUseCases]);

  // Handlers for Pipeline Modals
  const handleDirectStatusClick = useCallback((stream: StreamType, status: FilterStatus, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSelectedStream(stream);
    setSelectedStatus(status);
    setSelectedStreamSubFilter('ALL');
    setSearchQuery('');
    setActiveModalLevel(3);
  }, []);

  const handleOpenStreamModal = useCallback((stream: StreamType) => {
    setSelectedStream(stream);
    setSelectedStatus('ALL');
    setSelectedStreamSubFilter('ALL');
    setSearchQuery('');
    setActiveModalLevel(2);
  }, []);

  const handleOpenStatusModal = useCallback((status: FilterStatus) => {
    setSelectedStatus(status);
    setSelectedStreamSubFilter('ALL');
    setSearchQuery('');
    setActiveModalLevel(3);
  }, []);

  const handleBackToLevel2 = useCallback(() => {
    setActiveModalLevel(2);
    setSearchQuery('');
  }, []);

  const closeModal = useCallback(() => {
    setActiveModalLevel(1);
    setSelectedStream(null);
    setSelectedStatus('ALL');
    setSelectedStreamSubFilter('ALL');
    setSearchQuery('');
  }, []);

  const filteredUseCases = useMemo(() => {
    if (!selectedStream) return [];
    return allUseCases.filter(item => {
      const matchesStream =
        selectedStream === 'TOTAL PIPELINE'
          ? (selectedStreamSubFilter === 'ALL' ? true : item.stream === selectedStreamSubFilter)
          : item.stream === selectedStream;

      const matchesStatus =
        selectedStatus === 'ALL'
          ? true
          : item.status === selectedStatus;

      const matchesSearch =
        searchQuery.trim() === '' ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.detail.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesStream && matchesStatus && matchesSearch;
    });
  }, [allUseCases, selectedStream, selectedStatus, selectedStreamSubFilter, searchQuery]);

  const activeStreamMeta = useMemo(() => {
    if (selectedStream === 'INFRA OPS') {
      return {
        title: 'InfraOps',
        subtitle: 'Infrastructure & Systems Automation',
        icon: Server,
        color: '#0284C7',
        stats: streamStats.infra
      };
    } else if (selectedStream === 'SEC OPS') {
      return {
        title: 'SecOps',
        subtitle: 'Security, Identity & Compliance Operations',
        icon: Shield,
        color: '#8B5CF6',
        stats: streamStats.sec
      };
    } else {
      return {
        title: 'Total Pipeline',
        subtitle: 'Consolidated Velocity & Delivery Target',
        icon: Cpu,
        color: '#10B981',
        stats: streamStats.total
      };
    }
  }, [selectedStream, streamStats]);

  const totalInteractions = interactionBreakdown.totalMonthly || 8011;

  // 4 Channel Cards Data
  const channels = [
    {
      id: 'tickets',
      label: 'Tickets',
      icon: Ticket,
      count: interactionBreakdown.tickets,
      pct: ((interactionBreakdown.tickets / totalInteractions) * 100).toFixed(1),
      color: '#0A0838'
    },
    {
      id: 'emails',
      label: 'Emails',
      icon: Mail,
      count: interactionBreakdown.emails,
      pct: ((interactionBreakdown.emails / totalInteractions) * 100).toFixed(1),
      color: '#0A0838'
    },
    {
      id: 'calls',
      label: 'Voice Calls',
      icon: PhoneCall,
      count: interactionBreakdown.calls,
      pct: ((interactionBreakdown.calls / totalInteractions) * 100).toFixed(1),
      color: '#0A0838'
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: Bell,
      count: interactionBreakdown.notifications,
      pct: ((interactionBreakdown.notifications / totalInteractions) * 100).toFixed(1),
      color: '#0A0838'
    }
  ];

  // Maturity Dial Math
  const dialRadius = 46;
  const circumference = 2 * Math.PI * dialRadius;
  const currentProgress = (animatedChannels.achievedPct / 100) * circumference;
  const targetProgress = (maturityModel.targetPct / 100) * circumference;

  return (
    <div className={`h-full w-full flex flex-col justify-between p-4 md:p-5 lg:p-6 gap-3 relative overflow-hidden bg-[#FFFFFF] dark:bg-[#0A0838] text-[#29251D] dark:text-white transition-opacity duration-700 select-none ${isLoading ? 'opacity-70' : 'opacity-100'}`}>

      {/* 1. TOP HEADER */}
      <div className={`shrink-0 transition-all duration-700 ${animStage >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-3'}`}>
        <div className="flex items-center justify-between gap-4 pb-1 border-b border-[#E5DFD3] dark:border-white/10">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="w-2 h-2 rounded-full bg-[#0066B2] dark:bg-sky-400 animate-pulse" />
              <span className="text-xs font-medium text-[#0066B2] dark:text-sky-400">
                04 • Autonomous Operations
              </span>
            </div>
            <h1 className="text-2xl font-semibold tracking-tight text-[#29251D] dark:text-white">
              Autonomous Service Desk &amp; Automation Offloading
            </h1>
          </div>

          <div className="flex items-center gap-3 shrink-0">
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

      {/* 2. TOP HERO IMPACT KPI CARDS */}
      <div className={`shrink-0 grid grid-cols-2 lg:grid-cols-4 gap-3 transition-all duration-700 ${animStage >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>

        {/* Card 1: Tickets Automated */}
        <div className="p-3 px-4 rounded-xl bg-[#F6F2EA] dark:bg-white/5 border border-[#E5DFD3] dark:border-white/10 shadow-xs flex items-center justify-between group hover:border-[#0A0838]/40 transition-all">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#0A0838]/10 text-[#0A0838] dark:text-white flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <span className="text-sm font-medium text-[#4D4D4F] dark:text-slate-300">
              Tickets Automated
            </span>
          </div>
          <span className="text-2xl font-semibold text-[#29251D] dark:text-white tracking-tight">
            {heroKPIs.ticketsAutomated.toLocaleString()}
          </span>
        </div>

        {/* Card 2: Automation Achieved */}
        <div className="p-3 px-4 rounded-xl bg-[#F6F2EA] dark:bg-white/5 border border-[#E5DFD3] dark:border-white/10 shadow-xs flex items-center justify-between group hover:border-[#0A0838]/40 transition-all">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#0A0838]/10 text-[#0A0838] dark:text-white flex items-center justify-center shrink-0">
              <Zap className="w-4 h-4" />
            </div>
            <span className="text-sm font-medium text-[#4D4D4F] dark:text-slate-300">
              Automation Achieved
            </span>
          </div>
          <span className="text-2xl font-semibold text-[#29251D] dark:text-white tracking-tight">
            {heroKPIs.automationAchievedPct.toFixed(1)}%
          </span>
        </div>

        {/* Card 3: Use Cases Live */}
        <div className="p-3 px-4 rounded-xl bg-[#F6F2EA] dark:bg-white/5 border border-[#E5DFD3] dark:border-white/10 shadow-xs flex items-center justify-between group hover:border-[#0A0838]/40 transition-all">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#0A0838]/10 text-[#0A0838] dark:text-white flex items-center justify-center shrink-0">
              <Workflow className="w-4 h-4" />
            </div>
            <span className="text-sm font-medium text-[#4D4D4F] dark:text-slate-300">
              Use Cases Live
            </span>
          </div>
          <span className="text-2xl font-semibold text-[#29251D] dark:text-white tracking-tight">
            {heroKPIs.useCasesLive}
          </span>
        </div>

        {/* Card 4: SOPs Automated */}
        <div className="p-3 px-4 rounded-xl bg-[#F6F2EA] dark:bg-white/5 border border-[#E5DFD3] dark:border-white/10 shadow-xs flex items-center justify-between group hover:border-[#0A0838]/40 transition-all">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#0A0838]/10 text-[#0A0838] dark:text-white flex items-center justify-center shrink-0">
              <FileCheck className="w-4 h-4" />
            </div>
            <span className="text-sm font-medium text-[#4D4D4F] dark:text-slate-300">
              SOPs Automated
            </span>
          </div>
          <span className="text-2xl font-semibold text-[#29251D] dark:text-white tracking-tight">
            {heroKPIs.overallSOPsAutomated}
          </span>
        </div>

      </div>      {/* 3. DUAL COMPARTMENT SECTION (8 Cols Left | 4 Cols Right for compressed donut and expanded AD hygiene) */}
      <div className={`flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-3 items-stretch transition-all duration-700 ${animStage >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'}`}>

        {/* COMPARTMENT 1 (LEFT 8 COLS): OPERATIONAL ANALYTICS & GOVERNANCE */}
        <div className="lg:col-span-8 p-3 md:p-3.5 rounded-2xl bg-[#F6F2EA] dark:bg-white/5 border border-[#E5DFD3] dark:border-white/10 shadow-xs flex flex-col justify-between overflow-hidden">

          <div className="flex items-center justify-between pb-1.5 border-b border-[#E5DFD3] dark:border-white/10 shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-[#0A0838]/10 text-[#0A0838] dark:text-white flex items-center justify-center shadow-inner">
                <Cpu className="w-3.5 h-3.5" />
              </div>
              <span className="text-sm font-semibold text-[#29251D] dark:text-slate-200">
                Operational Analytics &amp; Governance
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 py-1 items-stretch flex-1 min-h-0">
            {/* Card 1: Volume & Maturity (5 Cols) */}
            <div className="sm:col-span-5 p-3 md:p-3.5 rounded-xl bg-[#FFFFFF] dark:bg-white/5 border border-[#E5DFD3] dark:border-white/10 shadow-2xs flex flex-col justify-between text-left h-full gap-2">
              {/* Header */}
              <div className="flex items-center justify-between pb-1.5 border-b border-[#E5DFD3]/70 dark:border-white/10 shrink-0">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#0A0838]/10 text-[#0A0838] dark:text-white flex items-center justify-center shrink-0 shadow-2xs">
                    <Cpu className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-[13px] font-semibold text-[#29251D] dark:text-white leading-tight">
                      Service Desk Volume &amp; Maturity
                    </h3>
                    <p className="text-[10px] text-[#4D4D4F] dark:text-slate-400 font-normal">
                      {totalInteractions.toLocaleString()} Total Inbound / Month
                    </p>
                  </div>
                </div>
              </div>

              {/* Visual Body */}
              <div className="flex flex-col justify-between gap-2.5 min-h-0 flex-1">
                {/* 4 Channels Grid */}
                <div className="grid grid-cols-4 gap-1.5 flex-1 min-h-0">
                  {channels.map((ch) => {
                    const Icon = ch.icon;
                    return (
                      <div
                        key={ch.id}
                        className="p-1.5 sm:p-2 rounded-xl bg-[#F6F2EA] dark:bg-white/5 border border-[#E5DFD3] dark:border-white/10 flex flex-col justify-between gap-1 shadow-xs hover:border-[#0A0838]/30 transition-all h-full"
                      >
                        <div className="flex items-center justify-between">
                          <div className="w-5 h-5 rounded-md flex items-center justify-center bg-[#0A0838]/10 text-[#0A0838] dark:bg-white/10 dark:text-white shadow-2xs">
                            <Icon className="w-3 h-3" />
                          </div>
                          <span className="text-[8.5px] font-mono font-bold text-[#4D4D4F] dark:text-slate-400">
                            {ch.pct}%
                          </span>
                        </div>
                        <div className="mt-0.5">
                          <span className="text-[9px] font-medium text-[#4D4D4F] dark:text-slate-400 block whitespace-nowrap leading-tight truncate">
                            {ch.label}
                          </span>
                          <span className="text-xs sm:text-sm font-bold text-[#29251D] dark:text-white tracking-tight block mt-0.5">
                            {ch.count.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Automation Maturity Index Box */}
                <div className="p-2.5 sm:p-3 rounded-xl bg-[#F6F2EA] dark:bg-white/5 border border-[#E5DFD3] dark:border-white/10 flex items-center justify-between gap-2 shadow-xs">
                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <Target className="w-3.5 h-3.5 text-[#0A0838] dark:text-white shrink-0" />
                      <span className="text-xs font-bold text-[#29251D] dark:text-white whitespace-nowrap">
                        Automation Maturity
                      </span>
                      <span className="px-1.5 py-0.5 rounded-full bg-[#D1EED0] text-[#2E5F13] border border-[#B4DFB1] text-[8.5px] font-medium flex items-center gap-0.5 shrink-0">
                        <CheckCircle2 className="w-2.5 h-2.5" />
                        {maturityModel.status}
                      </span>
                    </div>
                    <p className="text-[9.5px] text-[#4D4D4F] dark:text-slate-400">
                      Target: <strong className="text-[#29251D] dark:text-white font-semibold">{maturityModel.targetPct}%</strong> by {maturityModel.dueDate}
                    </p>
                    <div className="flex items-center gap-2 pt-0.5 text-[9px] text-[#4D4D4F] dark:text-slate-400 font-medium flex-wrap">
                      <div className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-[#2E5F13]" />
                        <span>Achieved ({maturityModel.achievedPct}%)</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-[#8D5C1A]" />
                        <span>Target ({maturityModel.targetPct}%)</span>
                      </div>
                    </div>
                  </div>

                  {/* Circular Maturity Dial */}
                  <div className="relative w-15 h-15 sm:w-16 sm:h-16 shrink-0 flex items-center justify-center">
                    <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 120 120">
                      <circle
                        cx="60"
                        cy="60"
                        r={dialRadius}
                        fill="none"
                        stroke="currentColor"
                        className="text-[#E5DFD3] dark:text-white/10"
                        strokeWidth="10"
                      />
                      <circle
                        cx="60"
                        cy="60"
                        r={dialRadius}
                        fill="none"
                        stroke="#F59E0B"
                        strokeWidth="10"
                        strokeDasharray={`${targetProgress * (dialRadius / 80)} ${circumference}`}
                        strokeDashoffset="0"
                        className="opacity-40"
                      />
                      <circle
                        cx="60"
                        cy="60"
                        r={dialRadius}
                        fill="none"
                        stroke="#10B981"
                        strokeWidth="10"
                        strokeDasharray={`${currentProgress * (dialRadius / 80)} ${circumference}`}
                        strokeDashoffset="0"
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                      <span className="text-[8px] font-semibold text-[#4D4D4F] dark:text-slate-400 leading-tight">
                        Achieved
                      </span>
                      <span className="text-sm sm:text-base font-bold text-[#10B981] leading-none mt-0.5">
                        {animatedChannels.achievedPct}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2: Active Directory Hygiene (7 Cols - Expanded) */}
            <div className="sm:col-span-7 p-3 md:p-3.5 rounded-xl bg-[#FFFFFF] dark:bg-white/5 border border-[#E5DFD3] dark:border-white/10 shadow-2xs flex flex-col justify-between text-left h-full gap-2">
              {/* Header */}
              <div className="flex items-center justify-between pb-1.5 border-b border-[#E5DFD3]/70 dark:border-white/10 shrink-0">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#0A0838]/10 text-[#0A0838] dark:text-white flex items-center justify-center shrink-0 shadow-2xs">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-[13px] font-semibold text-[#29251D] dark:text-white leading-tight">
                      Active Directory Hygiene &amp; Governance
                    </h3>
                    <p className="text-[10px] text-[#4D4D4F] dark:text-slate-400 font-normal">
                      Licenses &amp; Mailbox Policies
                    </p>
                  </div>
                </div>
              </div>

              {/* Visual Body */}
              <div className="flex flex-col justify-between gap-2.5 min-h-0 flex-1">
                {/* Pillar 1: License Harvesting Breakdown */}
                <div className="p-2.5 sm:p-3 rounded-xl bg-[#F6F2EA] dark:bg-white/5 border border-[#E5DFD3] dark:border-white/10 shadow-xs space-y-2 flex-1 min-h-0 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] sm:text-xs font-semibold text-[#29251D] dark:text-slate-200 flex items-center gap-1.5 whitespace-nowrap">
                      <Key className="w-4 h-4 text-[#0A0838] dark:text-white" />
                      License Harvesting &amp; Reclamation
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#E0ECE0] text-[#2E7D32] border border-[#6DA470]/40 font-bold text-[8.5px] sm:text-[9.5px] whitespace-nowrap">
                      {adHygiene.licensesReleasedTotal.toLocaleString()} Released
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 flex-1 items-stretch">
                    {adHygiene.licenseBreakdown.map((lic, idx) => (
                      <div key={idx} className="p-2 sm:p-2.5 rounded-xl bg-[#FFFFFF] dark:bg-white/10 border border-[#E5DFD3] dark:border-white/10 text-center flex flex-col items-center justify-center gap-1 shadow-2xs">
                        <span className="text-[9.5px] sm:text-[10px] font-medium text-[#4D4D4F] dark:text-slate-400 whitespace-nowrap">{lic.tier}</span>
                        <span className="text-sm sm:text-base font-bold text-[#29251D] dark:text-white">{lic.count.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pillar 2 & 3: Mailbox Governance & Stale Purge */}
                <div className="grid grid-cols-12 gap-2 flex-1 min-h-0 items-stretch">
                  {/* Mailbox Policies */}
                  <div className="col-span-5 p-2 sm:p-2.5 rounded-xl bg-[#F6F2EA] dark:bg-white/5 border border-[#E5DFD3] dark:border-white/10 flex flex-col justify-between gap-1.5 shadow-xs">
                    <div className="flex items-center justify-between gap-1">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <div className="w-5 h-5 rounded bg-[#0A0838]/10 text-[#0A0838] dark:text-white flex items-center justify-center shrink-0">
                          <Mail className="w-3 h-3" />
                        </div>
                        <h4 className="text-[10.5px] sm:text-[11px] font-semibold text-[#29251D] dark:text-slate-200 whitespace-nowrap">
                          Mailbox Policies
                        </h4>
                      </div>
                      <span className="px-1.5 py-0.5 rounded-full bg-[#D1EED0] text-[#2E5F13] border border-[#B4DFB1] font-medium text-[8px] shrink-0">
                        Enforced
                      </span>
                    </div>
                    <div className="p-1.5 sm:p-2 rounded-xl bg-[#FFFFFF] dark:bg-white/10 border border-[#E5DFD3] dark:border-white/10 text-center shadow-2xs flex items-center justify-center flex-1">
                      <span className="text-base sm:text-lg font-bold text-[#29251D] dark:text-white block">
                        {adHygiene.mailboxPoliciesApplied}
                      </span>
                    </div>
                  </div>

                  {/* Stale Identity Items Purged */}
                  <div className="col-span-7 p-2 sm:p-2.5 rounded-xl bg-[#F6F2EA] dark:bg-white/5 border border-[#E5DFD3] dark:border-white/10 flex flex-col justify-between gap-1.5 shadow-xs">
                    <div className="flex items-center justify-between gap-1">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <div className="w-5 h-5 rounded bg-[#0A0838]/10 text-[#0A0838] dark:text-white flex items-center justify-center shrink-0">
                          <ShieldCheck className="w-3 h-3" />
                        </div>
                        <h4 className="text-[10.5px] sm:text-[11px] font-semibold text-[#29251D] dark:text-slate-200 whitespace-nowrap">
                          Stale Identity
                        </h4>
                      </div>
                      <span className="px-1.5 py-0.5 rounded-full bg-[#D1EED0] text-[#2E5F13] border border-[#B4DFB1] font-medium text-[8px] sm:text-[8.5px] shrink-0">
                        {adHygiene.staleItemsDisabledTotal.toLocaleString()} Purged
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-1.5 flex-1 items-stretch">
                      <div className="p-1.5 sm:p-2 rounded-xl bg-[#FFFFFF] dark:bg-white/10 border border-[#E5DFD3] dark:border-white/10 text-center shadow-2xs flex flex-col justify-center">
                        <span className="text-[8.5px] sm:text-[9px] font-medium text-[#4D4D4F] dark:text-slate-400 block whitespace-nowrap">Computers</span>
                        <span className="text-xs sm:text-sm font-bold text-[#29251D] dark:text-white">{adHygiene.staleComputersDisabled.toLocaleString()}</span>
                      </div>
                      <div className="p-1.5 sm:p-2 rounded-xl bg-[#FFFFFF] dark:bg-white/10 border border-[#E5DFD3] dark:border-white/10 text-center shadow-2xs flex flex-col justify-center">
                        <span className="text-[8.5px] sm:text-[9px] font-medium text-[#4D4D4F] dark:text-slate-400 block whitespace-nowrap">User Accounts</span>
                        <span className="text-xs sm:text-sm font-bold text-[#29251D] dark:text-white">{adHygiene.staleUserAccountsDisabled.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* COMPARTMENT 2 (RIGHT 4 COLS - COMPACT): AUTOMATION OFFLOADING FLOW SECTION */}
        <div className="lg:col-span-4 p-3 md:p-3.5 rounded-2xl bg-[#F6F2EA] dark:bg-white/5 border border-[#E5DFD3] dark:border-white/10 shadow-xs flex flex-col justify-between relative overflow-hidden">

          {/* Header */}
          <div className="flex items-center justify-between pb-1.5 border-b border-[#E5DFD3] dark:border-white/10 shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-[#0A0838]/10 text-[#0A0838] dark:text-white flex items-center justify-center shadow-inner">
                <Workflow className="w-3.5 h-3.5" />
              </div>
              <h2 className="text-sm font-semibold text-[#29251D] dark:text-white">
                Automation Offloading Flow
              </h2>
            </div>
            <span className="text-[10px] text-[#4D4D4F] dark:text-slate-400 font-medium">
              Click a segment to inspect details
            </span>
          </div>


          {/* HERO DONUT VISUAL - PROPORTIONED TO FILL CONTAINER CLEANLY */}
          <div className="p-2 sm:p-2.5 rounded-xl bg-[#FFFFFF] hover:bg-[#FAF8F5] dark:bg-white/5 dark:hover:bg-white/10 border border-[#E5DFD3] dark:border-white/10 shadow-2xs flex flex-col items-center justify-center flex-1 my-auto transition-all overflow-hidden w-full">

            {/* SVG DONUT CHART WITH DIRECT PERCENTAGES */}
            <div className="relative w-40 h-40 sm:w-44 sm:h-44 lg:w-48 lg:h-48 xl:w-50 xl:h-50 shrink-0 flex items-center justify-center my-auto mx-auto">
              <svg className="w-full h-full -rotate-90 transform overflow-visible" viewBox="0 0 200 200">
                {/* Background Ring Track */}
                <circle
                  cx="100"
                  cy="100"
                  r="74"
                  fill="none"
                  stroke="currentColor"
                  className="text-[#E5DFD3]/40 dark:text-white/5"
                  strokeWidth="24"
                />

                {/* Slice 2: TechHub Assisted (83.3% = 387.35 of 464.95 circumference) - AMBER */}
                <circle
                  cx="100"
                  cy="100"
                  r="74"
                  fill="none"
                  stroke="#F59E0B"
                  strokeWidth={selectedOffloadSlice === 'techhub' ? '28' : '24'}
                  strokeDasharray="387.30 464.95"
                  strokeDashoffset="-77.65"
                  className={`transition-all duration-300 cursor-pointer hover:opacity-90 ${
                    selectedOffloadSlice === 'techhub' ? 'filter drop-shadow-md opacity-100' : selectedOffloadSlice === 'zero-touch' ? 'opacity-40' : 'opacity-95'
                  }`}
                  onClick={() => setSelectedOffloadSlice(prev => prev === 'techhub' ? null : 'techhub')}
                >
                  <title>TechHub Service Desk: 22,319 (83.3% Assisted) - Click to inspect</title>
                </circle>

                {/* Slice 1: Zero-Touch Automated (16.7% = 77.65 of 464.95 circumference) - GREEN */}
                <circle
                  cx="100"
                  cy="100"
                  r="74"
                  fill="none"
                  stroke="#10B981"
                  strokeWidth={selectedOffloadSlice === 'zero-touch' ? '28' : '24'}
                  strokeDasharray="77.65 464.95"
                  strokeDashoffset="0"
                  strokeLinecap="round"
                  className={`transition-all duration-300 cursor-pointer hover:opacity-90 ${
                    selectedOffloadSlice === 'zero-touch' ? 'filter drop-shadow-md opacity-100' : selectedOffloadSlice === 'techhub' ? 'opacity-40' : 'opacity-95'
                  }`}
                  onClick={() => setSelectedOffloadSlice(prev => prev === 'zero-touch' ? null : 'zero-touch')}
                >
                  <title>Zero-Touch Automation: 4,470 (16.7% Offload) - Click to inspect</title>
                </circle>
              </svg>

              {/* Direct Percentage Badge on Right for 16.7% (Green) */}
              <button
                type="button"
                onClick={() => setSelectedOffloadSlice(prev => prev === 'zero-touch' ? null : 'zero-touch')}
                title="Click to view Zero-Touch total in center"
                className={`absolute top-1 right-0 sm:top-1.5 sm:right-0.5 lg:top-1.5 lg:right-0 px-2 py-0.5 rounded-full border text-[10px] sm:text-[11px] font-bold font-mono transition-all cursor-pointer shadow-xs flex items-center gap-1 z-20 ${
                  selectedOffloadSlice === 'zero-touch'
                    ? 'bg-[#10B981] text-white border-[#10B981] scale-105 shadow-md ring-2 ring-[#10B981]/40'
                    : 'bg-[#E0ECE0] text-[#2E7D32] border-[#2E7D32]/30 hover:scale-105 hover:bg-[#D1EED0]'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] dark:bg-white" />
                <span>16.7%</span>
              </button>

              {/* Direct Percentage Badge on Left for 83.3% (Amber) */}
              <button
                type="button"
                onClick={() => setSelectedOffloadSlice(prev => prev === 'techhub' ? null : 'techhub')}
                title="Click to view TechHub Assisted total in center"
                className={`absolute bottom-1 left-0 sm:bottom-1.5 sm:left-0.5 lg:bottom-1.5 lg:left-0 px-2 py-0.5 rounded-full border text-[10px] sm:text-[11px] font-bold font-mono transition-all cursor-pointer shadow-xs flex items-center gap-1 z-20 ${
                  selectedOffloadSlice === 'techhub'
                    ? 'bg-[#F59E0B] text-white border-[#F59E0B] scale-105 shadow-md ring-2 ring-[#F59E0B]/40'
                    : 'bg-[#FEF3C7] text-[#D97706] border-[#F59E0B]/30 hover:scale-105 hover:bg-[#FDE68A]'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]" />
                <span>83.3%</span>
              </button>

              {/* Center Dynamic Interactive Card: Total or Selected Slice Details */}
              <div
                onClick={() => {
                  if (selectedOffloadSlice === 'zero-touch') {
                    setActiveModal('zero-touch');
                  } else if (selectedOffloadSlice === 'techhub') {
                    setActiveModal('techhub');
                  } else {
                    setActiveModal('volume-maturity');
                  }
                }}
                title={
                  selectedOffloadSlice
                    ? `Click to view overall ${selectedOffloadSlice === 'zero-touch' ? 'Zero-Touch' : 'TechHub'} details`
                    : 'Click % badges or slices to inspect breakdown'
                }
                className={`absolute w-24 h-24 sm:w-26 sm:h-26 lg:w-28 lg:h-28 rounded-full flex flex-col items-center justify-center text-center px-1.5 cursor-pointer transition-all duration-300 z-10 group/card ${
                  selectedOffloadSlice === 'zero-touch'
                    ? 'bg-[#E0ECE0]/80 hover:bg-[#E0ECE0] dark:bg-[#10B981]/15 dark:hover:bg-[#10B981]/25 border-2 border-[#10B981] shadow-sm hover:scale-105'
                    : selectedOffloadSlice === 'techhub'
                    ? 'bg-[#FEF3C7]/80 hover:bg-[#FEF3C7] dark:bg-[#F59E0B]/15 dark:hover:bg-[#F59E0B]/25 border-2 border-[#F59E0B] shadow-sm hover:scale-105'
                    : 'bg-[#FAF8F5]/95 hover:bg-[#F6F2EA] dark:bg-white/5 dark:hover:bg-white/10 border border-[#E5DFD3] dark:border-white/10 shadow-2xs hover:scale-105'
                }`}
              >
                {selectedOffloadSlice === 'zero-touch' ? (
                  <>
                    <span className="text-[8px] sm:text-[8.5px] font-bold text-[#10B981] whitespace-nowrap">
                      Zero-Touch
                    </span>
                    <span className="text-lg sm:text-xl lg:text-2xl font-bold text-[#10B981] font-mono leading-none my-0.5">
                      {animatedChannels.autoSR.toLocaleString()}
                    </span>
                    <span className="text-[7.5px] sm:text-[8px] text-[#2E7D32] dark:text-[#6EE7B7] font-semibold flex items-center gap-0.5 mt-0.5 group-hover/card:underline">
                      View Details <ChevronRight className="w-2.5 h-2.5 inline" />
                    </span>
                  </>
                ) : selectedOffloadSlice === 'techhub' ? (
                  <>
                    <span className="text-[8px] sm:text-[8.5px] font-bold text-[#D97706] whitespace-nowrap">
                      TechHub Assist
                    </span>
                    <span className="text-lg sm:text-xl lg:text-2xl font-bold text-[#D97706] font-mono leading-none my-0.5">
                      {animatedChannels.techHubSR.toLocaleString()}
                    </span>
                    <span className="text-[7.5px] sm:text-[8px] text-[#B45309] dark:text-[#FCD34D] font-semibold flex items-center gap-0.5 mt-0.5 group-hover/card:underline">
                      View Details <ChevronRight className="w-2.5 h-2.5 inline" />
                    </span>
                  </>
                ) : (
                  <>
                    <span className="text-[8px] sm:text-[8.5px] font-semibold text-[#4D4D4F] dark:text-slate-400 whitespace-nowrap">
                      Total Demand
                    </span>
                    <span className="text-lg sm:text-xl lg:text-2xl font-bold text-[#29251D] dark:text-white font-mono leading-none my-0.5">
                      {animatedChannels.totalSR.toLocaleString()}
                    </span>
                    <span className="text-[7.5px] sm:text-[8px] text-[#4D4D4F] dark:text-slate-400 font-medium leading-tight whitespace-nowrap">
                      Inbound Requests
                    </span>
                    <span className="text-[6.5px] sm:text-[7px] text-[#0A0838] dark:text-slate-300 font-medium mt-0.5 opacity-60">
                      Click % to inspect
                    </span>
                  </>
                )}
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* 4. OVERALL AUTOMATION PIPELINE: EXPANDED SECTION (32 Total Center Hub & Focus Areas with InfraOps & SecOps Trends) */}
      <div className={`shrink-0 min-h-[148px] max-h-[162px] lg:h-[156px] transition-all duration-700 ${animStage >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'}`}>

        {/* UNIFIED OVERALL AUTOMATION PIPELINE CARD CONTAINER */}
        <div className="bg-[#F6F2EA] dark:bg-white/5 rounded-2xl p-2.5 sm:p-3 px-3.5 sm:px-4 border border-[#E5DFD3] dark:border-white/10 shadow-xs flex flex-col justify-between h-full group hover:border-[#0A0838]/40 transition-all">

          {/* Top Bar: Title & Status */}
          <div className="flex items-center justify-between gap-3 border-b border-[#E5DFD3] dark:border-white/10 pb-1">

            {/* Left: Section Header */}
            <div
              onClick={() => handleOpenStreamModal('TOTAL PIPELINE')}
              className="flex items-center gap-2 cursor-pointer group/title"
              title="Click to view Total Pipeline overview"
            >
              <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-lg bg-[#0A0838]/10 border border-[#0A0838]/20 flex items-center justify-center text-[#0A0838] dark:text-white group-hover/title:scale-105 transition-transform shrink-0 shadow-2xs">
                <Cpu className="w-3 sm:w-3.5 h-3 sm:h-3.5" />
              </div>
              <div className="flex items-center gap-2">
                <h2 className="text-xs sm:text-sm font-semibold text-[#29251D] dark:text-white group-hover/title:text-[#0A0838] dark:group-hover/title:text-white transition-colors">
                  Overall Automation Pipeline
                </h2>
                <span className="px-2 sm:px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-semibold bg-[#E0ECE0] text-[#2E7D32] border border-[#6DA470]/40 flex items-center gap-1 shadow-2xs">
                  <CheckCircle2 className="w-2.5 sm:w-3 h-2.5 sm:h-3" />
                  Ahead of Schedule
                </span>
              </div>
            </div>

            {/* Right: Target Completion Date (Clean un-highlighted text metadata) */}
            <div className="flex items-center gap-1.5 text-[11px] font-medium text-[#4D4D4F] dark:text-slate-300">
              <Clock className="w-3.5 h-3.5 text-[#4D4D4F] dark:text-slate-400" />
              <span>Target Completion:</span>
              <span className="text-[#29251D] dark:text-white font-mono font-semibold">31 Dec 2026</span>
            </div>

          </div>

          {/* DUAL WORKSTREAM CARDS & CENTER FLOW ON THE SAME HORIZONTAL AXIS */}
          <div className="flex items-center justify-between gap-2 lg:gap-2.5 flex-1 my-0.5 min-h-0 w-full">

            {/* LEFT: INFRA OPS AUTOMATION CARD WITH EMBEDDED TREND */}
            <div
              onClick={() => handleOpenStreamModal('INFRA OPS')}
              title="Click to view 16 InfraOps automation use cases"
              className="flex-1 p-2 sm:p-2.5 rounded-xl bg-[#FFFFFF] dark:bg-white/5 border border-[#E5DFD3] dark:border-white/10 hover:border-[#0284C7] shadow-2xs hover:shadow-xs transition-all flex items-center justify-between gap-2 cursor-pointer group text-left h-full"
            >
              {/* Left Details */}
              <div className="flex items-center gap-2 sm:gap-2.5 min-w-0 flex-1">
                <div className="w-8 h-8 sm:w-8.5 sm:h-8.5 rounded-xl bg-[#0A0838]/10 text-[#0A0838] dark:text-white flex items-center justify-center group-hover:scale-105 transition-transform shadow-2xs shrink-0">
                  <Server className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-xs sm:text-[13px] font-semibold text-[#29251D] dark:text-white group-hover:text-[#0A0838] dark:group-hover:text-sky-300 transition-colors">
                      InfraOps Automation
                    </h3>
                    <div className="w-3.5 h-3.5 rounded-full bg-[#0A0838] dark:bg-white text-white dark:text-[#0A0838] flex items-center justify-center shadow-2xs group-hover:translate-x-0.5 transition-all shrink-0">
                      <ArrowRight className="w-2 h-2" />
                    </div>
                  </div>
                  <span className="text-[9.5px] sm:text-[10px] text-[#4D4D4F] dark:text-slate-400 block truncate mt-0.5">
                    Infrastructure &amp; Systems Automation
                  </span>
                </div>
              </div>

              {/* Right: Embedded Trend Visual */}
              <div className="w-32 sm:w-36 md:w-40 lg:w-44 h-full flex flex-col justify-between py-0.5 shrink-0 pl-2 border-l border-[#E5DFD3]/80 dark:border-white/10">
                <div className="flex items-center justify-end text-[8px] sm:text-[8.5px] font-semibold">
                  <span className="px-1.5 py-0.5 rounded-full bg-[#E0ECE0] text-[#2E7D32] border border-[#6DA470]/30 text-[7.5px] sm:text-[8px] font-bold whitespace-nowrap">
                    81.8% Achieved
                  </span>
                </div>

                {/* SVG Trend Sparkline */}
                <div className="relative w-full h-8 sm:h-9 my-auto">
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 160 38" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="infraTrendGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#0284C7" stopOpacity="0.35" />
                        <stop offset="100%" stopColor="#0284C7" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>

                    {/* Target Guide Line at Target = 11 (y=11) */}
                    <line x1="0" y1="11" x2="160" y2="11" stroke="#F59E0B" strokeWidth="1" strokeDasharray="2.5 2.5" opacity="0.65" />

                    {/* Area Fill */}
                    <path
                      d="M 6 34 Q 35 32 65 22 T 115 14 L 115 36 L 6 36 Z"
                      fill="url(#infraTrendGrad)"
                    />

                    {/* Trend Progression Line */}
                    <path
                      d="M 6 34 Q 35 32 65 22 T 115 14"
                      fill="none"
                      stroke="#0284C7"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                    />

                    {/* Projected Target Line */}
                    <path
                      d="M 115 14 Q 135 11 155 6"
                      fill="none"
                      stroke="#0284C7"
                      strokeWidth="1.2"
                      strokeDasharray="2 2"
                      opacity="0.45"
                    />

                    {/* Historical Dots */}
                    <circle cx="6" cy="34" r="1.8" fill="#0284C7" />
                    <circle cx="65" cy="22" r="1.8" fill="#0284C7" />

                    {/* Current Achieved Marker at 9 */}
                    <circle cx="115" cy="14" r="3" fill="#10B981" />
                  </svg>
                </div>

                <div className="flex items-center justify-between text-[7.5px] sm:text-[8px] font-mono text-[#4D4D4F] dark:text-slate-400">
                  <span className="text-[#10B981] font-bold">Achieved: 9</span>
                  <span>Target: 11</span>
                  <span>Total: 16</span>
                </div>
              </div>
            </div>

            {/* CENTER CONNECTOR FLOW: Dashed Line -- Active Pill -- Dashed Line -- (32 Hub + Total Use Cases below) -- Dashed Line -- Planned Pill -- Dashed Line */}
            <div className="flex items-center justify-center gap-1 sm:gap-1.5 shrink-0 px-0.5">
              {/* Left Connector Dashed Line */}
              <div className="w-1.5 sm:w-2 lg:w-2.5 border-t-2 border-dashed border-[#0A0838]/30 dark:border-white/30" />

              {/* Active Pill: 18 Live with Green Pulse */}
              <div
                onClick={() => handleOpenStreamModal('TOTAL PIPELINE')}
                className="px-2 sm:px-2.5 py-1 rounded-full bg-[#E0ECE0] text-[#2E7D32] border border-[#6DA470]/60 flex items-center gap-1.5 text-[10px] sm:text-xs font-semibold cursor-pointer hover:scale-105 transition-transform shrink-0 shadow-2xs whitespace-nowrap"
                title="Click to view Active Use Cases"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10B981]"></span>
                </span>
                <span>Active: <strong className="font-bold font-mono">18</strong> Live</span>
              </div>

              {/* Center Left Dashed Line */}
              <div className="w-1 sm:w-1.5 border-t-2 border-dashed border-[#0A0838]/30 dark:border-white/30" />

              {/* Central Circular "32" with "Total Use Cases" outside below */}
              <div
                onClick={() => handleOpenStreamModal('TOTAL PIPELINE')}
                className="flex flex-col items-center justify-center cursor-pointer group shrink-0 pt-0.5"
                title="Click to view all 32 automation use cases"
              >
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#FFFFFF] dark:bg-[#0A0838] border-2 border-[#0A0838] dark:border-white shadow-md flex items-center justify-center group-hover:scale-105 transition-all">
                  <span className="text-sm sm:text-base font-bold text-[#29251D] dark:text-white group-hover:text-[#0A0838] dark:group-hover:text-white transition-colors font-mono leading-none">
                    32
                  </span>
                </div>
                <span className="text-[7.5px] sm:text-[8px] text-[#4D4D4F] dark:text-slate-400 font-bold text-center mt-1 sm:mt-1.5 whitespace-nowrap leading-tight tracking-tight">
                  Total Use Cases
                </span>
              </div>

              {/* Center Right Dashed Line */}
              <div className="w-1 sm:w-1.5 border-t-2 border-dashed border-[#0A0838]/30 dark:border-white/30" />

              {/* Planned Pill: 14 with Amber style */}
              <div
                onClick={() => handleOpenStreamModal('TOTAL PIPELINE')}
                className="px-2 sm:px-2.5 py-1 rounded-full bg-[#FEF3C7] text-[#D97706] dark:bg-amber-950/40 dark:text-amber-300 border border-[#F59E0B]/50 flex items-center gap-1.5 text-[10px] sm:text-xs font-semibold cursor-pointer hover:scale-105 transition-transform shrink-0 shadow-2xs whitespace-nowrap"
                title="Click to view Planned Use Cases"
              >
                <Clock className="w-2.5 sm:w-3 h-2.5 sm:h-3 text-[#D97706] dark:text-amber-400" />
                <span>Planned: <strong className="font-bold font-mono">14</strong></span>
              </div>

              {/* Right Connector Dashed Line */}
              <div className="w-1.5 sm:w-2 lg:w-2.5 border-t-2 border-dashed border-[#0A0838]/30 dark:border-white/30" />
            </div>

            {/* RIGHT: SEC OPS AUTOMATION CARD WITH EMBEDDED TREND */}
            <div
              onClick={() => handleOpenStreamModal('SEC OPS')}
              title="Click to view 16 SecOps automation use cases"
              className="flex-1 p-2 sm:p-2.5 rounded-xl bg-[#FFFFFF] dark:bg-white/5 border border-[#E5DFD3] dark:border-white/10 hover:border-[#8B5CF6] shadow-2xs hover:shadow-xs transition-all flex items-center justify-between gap-2 cursor-pointer group text-left h-full"
            >
              {/* Left Details */}
              <div className="flex items-center gap-2 sm:gap-2.5 min-w-0 flex-1">
                <div className="w-8 h-8 sm:w-8.5 sm:h-8.5 rounded-xl bg-[#0A0838]/10 text-[#0A0838] dark:text-white flex items-center justify-center group-hover:scale-105 transition-transform shadow-2xs shrink-0">
                  <Shield className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-xs sm:text-[13px] font-semibold text-[#29251D] dark:text-white group-hover:text-[#0A0838] dark:group-hover:text-sky-300 transition-colors">
                      SecOps Automation
                    </h3>
                    <div className="w-3.5 h-3.5 rounded-full bg-[#0A0838] dark:bg-white text-white dark:text-[#0A0838] flex items-center justify-center shadow-2xs group-hover:translate-x-0.5 transition-all shrink-0">
                      <ArrowRight className="w-2 h-2" />
                    </div>
                  </div>
                  <span className="text-[9.5px] sm:text-[10px] text-[#4D4D4F] dark:text-slate-400 block truncate mt-0.5">
                    Security, Identity &amp; Compliance Ops
                  </span>
                </div>
              </div>

              {/* Right: Embedded Trend Visual */}
              <div className="w-32 sm:w-36 md:w-40 lg:w-44 h-full flex flex-col justify-between py-0.5 shrink-0 pl-2 border-l border-[#E5DFD3]/80 dark:border-white/10">
                <div className="flex items-center justify-end text-[8px] sm:text-[8.5px] font-semibold">
                  <span className="px-1.5 py-0.5 rounded-full bg-[#E0ECE0] text-[#2E7D32] border border-[#6DA470]/30 text-[7.5px] sm:text-[8px] font-bold whitespace-nowrap">
                    81.8% Achieved
                  </span>
                </div>

                {/* SVG Trend Sparkline */}
                <div className="relative w-full h-8 sm:h-9 my-auto">
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 160 38" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="secTrendGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.35" />
                        <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>

                    {/* Target Guide Line at Target = 11 (y=11) */}
                    <line x1="0" y1="11" x2="160" y2="11" stroke="#F59E0B" strokeWidth="1" strokeDasharray="2.5 2.5" opacity="0.65" />

                    {/* Area Fill */}
                    <path
                      d="M 6 34 Q 35 32 65 22 T 115 14 L 115 36 L 6 36 Z"
                      fill="url(#secTrendGrad)"
                    />

                    {/* Trend Progression Line */}
                    <path
                      d="M 6 34 Q 35 32 65 22 T 115 14"
                      fill="none"
                      stroke="#8B5CF6"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                    />

                    {/* Projected Target Line */}
                    <path
                      d="M 115 14 Q 135 11 155 6"
                      fill="none"
                      stroke="#8B5CF6"
                      strokeWidth="1.2"
                      strokeDasharray="2 2"
                      opacity="0.45"
                    />

                    {/* Historical Dots */}
                    <circle cx="6" cy="34" r="1.8" fill="#8B5CF6" />
                    <circle cx="65" cy="22" r="1.8" fill="#8B5CF6" />

                    {/* Current Achieved Marker at 9 */}
                    <circle cx="115" cy="14" r="3" fill="#10B981" />
                  </svg>
                </div>

                <div className="flex items-center justify-between text-[7.5px] sm:text-[8px] font-mono text-[#4D4D4F] dark:text-slate-400">
                  <span className="text-[#10B981] font-bold">Achieved: 9</span>
                  <span>Target: 11</span>
                  <span>Total: 16</span>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* ========================================================================= */}
      {/* 5. INTERACTIVE DRILLDOWN MODALS (SERVICE DESK + PIPELINE)                 */}
      {/* ========================================================================= */}

      {/* ZERO-TOUCH & TECHHUB & SMART-ROUTING MODALS */}
      {activeModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-md p-4 animate-in fade-in duration-200"
          onClick={() => setActiveModal(null)}
        >
          <div
            className="w-full max-w-2xl bg-white dark:bg-[#0E0C28] border-2 border-slate-200 dark:border-white/20 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200"
            onClick={e => e.stopPropagation()}
          >
            {/* ZERO-TOUCH MODAL */}
            {activeModal === 'zero-touch' && (
              <>
                <div className="p-4 border-b border-[#E5DFD3] dark:border-white/10 bg-[#FFFFFF] dark:bg-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#0A0838]/10 text-[#0A0838] dark:text-white flex items-center justify-center shadow-2xs">
                      <Bot className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-[#29251D] dark:text-white">
                        Zero-Touch Automated Fulfillment
                      </h3>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveModal(null)}
                    className="w-8 h-8 rounded-full bg-[#F6F2EA] dark:bg-white/10 text-[#4D4D4F] hover:bg-[#E31837] hover:text-white dark:hover:bg-[#E31837] flex items-center justify-center transition-all cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-4 overflow-y-auto space-y-3 max-h-[60vh] bg-[#FAF8F5] dark:bg-transparent">
                  {/* Monthly Trend from Source Excel */}
                  <div>
                    <h4 className="text-xs font-medium text-[#4D4D4F] dark:text-slate-300 mb-2 flex items-center gap-1.5">
                      <BarChart3 className="w-3.5 h-3.5 text-[#0A0838] dark:text-white" />
                      Monthly Automation Trend
                    </h4>
                    <div className="grid grid-cols-4 gap-2">
                      {monthlyTrends.map((m) => (
                        <div key={m.monthKey} className="p-2.5 rounded-xl bg-[#F6F2EA] dark:bg-white/5 border border-[#E5DFD3] dark:border-white/10 text-center">
                          <span className="text-xs font-medium text-[#4D4D4F] dark:text-slate-400 block">{m.monthLabel}</span>
                          <span className="text-lg font-semibold text-[#29251D] dark:text-white block mt-0.5">
                            {m.automationSRs.toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* SVG Trend Line Graph */}
                  <div className="p-3.5 rounded-2xl bg-[#F6F2EA] dark:bg-white/5 border border-[#E5DFD3] dark:border-white/10">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-[#29251D] dark:text-slate-200 flex items-center gap-1.5">
                        <TrendingUp className="w-3.5 h-3.5 text-[#E31837]" />
                        Automation Volume Trajectory (Apr–Jul '26)
                      </span>
                      <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-[#E0ECE0] text-[#2E7D32] border border-[#6DA470]/40">
                        4,470 Total Auto-Closed
                      </span>
                    </div>

                    <div className="relative w-full h-32">
                      <svg className="w-full h-full" viewBox="0 0 500 110" preserveAspectRatio="none">
                        <defs>
                          <linearGradient id="modal-auto-desk-grad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#0A0838" stopOpacity="0.15" />
                            <stop offset="100%" stopColor="#0A0838" stopOpacity="0.0" />
                          </linearGradient>
                        </defs>

                        {/* Grid Lines */}
                        <line x1="40" y1="20" x2="460" y2="20" stroke="currentColor" strokeOpacity="0.08" strokeDasharray="3 3" />
                        <line x1="40" y1="55" x2="460" y2="55" stroke="currentColor" strokeOpacity="0.08" strokeDasharray="3 3" />
                        <line x1="40" y1="90" x2="460" y2="90" stroke="currentColor" strokeOpacity="0.08" strokeDasharray="3 3" />

                        {/* Area & Spline Path */}
                        <path
                          d="M 60 35 C 120 35, 120 75, 180 75 C 240 75, 240 70, 300 70 C 360 70, 360 67, 420 67 L 420 95 L 60 95 Z"
                          fill="url(#modal-auto-desk-grad)"
                        />
                        <path
                          d="M 60 35 C 120 35, 120 75, 180 75 C 240 75, 240 70, 300 70 C 360 70, 360 67, 420 67"
                          fill="none"
                          stroke="#0A0838"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                        />

                        {/* Points with Value Badges */}
                        {[
                          { x: 60, y: 35, val: '1,408', month: 'Apr 2026' },
                          { x: 180, y: 75, val: '978', month: 'May 2026' },
                          { x: 300, y: 70, val: '1,028', month: 'Jun 2026' },
                          { x: 420, y: 67, val: '1,056', month: 'Jul 2026' }
                        ].map((pt, i) => (
                          <g key={i}>
                            <circle cx={pt.x} cy={pt.y} r="4" fill="#0A0838" stroke="#FFFFFF" strokeWidth="2" />
                            <text x={pt.x} y={pt.y - 8} textAnchor="middle" fill="#29251D" fontSize="9" fontWeight="bold" fontFamily="monospace">
                              {pt.val}
                            </text>
                            <text x={pt.x} y={105} textAnchor="middle" fill="#4D4D4F" fontSize="8" fontWeight="500" fontFamily="monospace">
                              {pt.month}
                            </text>
                          </g>
                        ))}
                      </svg>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* TECHHUB MODAL */}
            {activeModal === 'techhub' && (
              <>
                <div className="p-4 border-b border-[#E5DFD3] dark:border-white/10 bg-[#FFFFFF] dark:bg-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#0A0838]/10 text-[#0A0838] dark:text-white flex items-center justify-center shadow-2xs">
                      <Headphones className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-[#29251D] dark:text-white">
                        TechHub Manual &amp; Assisted Resolution
                      </h3>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveModal(null)}
                    className="w-8 h-8 rounded-full bg-[#F6F2EA] dark:bg-white/10 text-[#4D4D4F] hover:bg-[#E31837] hover:text-white dark:hover:bg-[#E31837] flex items-center justify-center transition-all cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-4 overflow-y-auto space-y-3 max-h-[60vh] bg-[#FAF8F5] dark:bg-transparent">
                  {/* Monthly Trend from Source Excel */}
                  <div>
                    <h4 className="text-xs font-medium text-[#4D4D4F] dark:text-slate-300 mb-2 flex items-center gap-1.5">
                      <BarChart3 className="w-3.5 h-3.5 text-[#0A0838] dark:text-white" />
                      Monthly TechHub Volume
                    </h4>
                    <div className="grid grid-cols-4 gap-2">
                      {monthlyTrends.map((m) => (
                        <div key={m.monthKey} className="p-2.5 rounded-xl bg-[#F6F2EA] dark:bg-white/5 border border-[#E5DFD3] dark:border-white/10 text-center">
                          <span className="text-xs font-medium text-[#4D4D4F] dark:text-slate-400 block">{m.monthLabel}</span>
                          <span className="text-lg font-semibold text-[#29251D] dark:text-white block mt-0.5">
                            {m.techHubSRs.toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* SVG Trend Line Graph */}
                  <div className="p-3.5 rounded-2xl bg-[#F6F2EA] dark:bg-white/5 border border-[#E5DFD3] dark:border-white/10">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-[#29251D] dark:text-slate-200 flex items-center gap-1.5">
                        <TrendingUp className="w-3.5 h-3.5 text-[#0066B2] dark:text-[#38BDF8]" />
                        TechHub Assisted Volume Trajectory (Apr–Jul '26)
                      </span>
                      <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-[#0066B2]/10 text-[#0066B2] dark:bg-white/10 dark:text-white border border-[#0066B2]/20 dark:border-white/10">
                        22,319 Total Assisted
                      </span>
                    </div>

                    <div className="relative w-full h-32">
                      <svg className="w-full h-full" viewBox="0 0 500 110" preserveAspectRatio="none">
                        <defs>
                          <linearGradient id="modal-techhub-desk-grad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#0A0838" stopOpacity="0.15" />
                            <stop offset="100%" stopColor="#0A0838" stopOpacity="0.0" />
                          </linearGradient>
                        </defs>

                        {/* Grid Lines */}
                        <line x1="40" y1="20" x2="460" y2="20" stroke="currentColor" strokeOpacity="0.08" strokeDasharray="3 3" />
                        <line x1="40" y1="55" x2="460" y2="55" stroke="currentColor" strokeOpacity="0.08" strokeDasharray="3 3" />
                        <line x1="40" y1="90" x2="460" y2="90" stroke="currentColor" strokeOpacity="0.08" strokeDasharray="3 3" />

                        {/* Area & Spline Path */}
                        <path
                          d="M 60 28 C 120 28, 120 76, 180 76 C 240 76, 240 42, 300 42 C 360 42, 360 48, 420 48 L 420 95 L 60 95 Z"
                          fill="url(#modal-techhub-desk-grad)"
                        />
                        <path
                          d="M 60 28 C 120 28, 120 76, 180 76 C 240 76, 240 42, 300 42 C 360 42, 360 48, 420 48"
                          fill="none"
                          stroke="#0A0838"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                        />

                        {/* Points with Value Badges */}
                        {[
                          { x: 60, y: 28, val: '6,519', month: 'Apr 2026' },
                          { x: 180, y: 76, val: '4,340', month: 'May 2026' },
                          { x: 300, y: 42, val: '5,882', month: 'Jun 2026' },
                          { x: 420, y: 48, val: '5,578', month: 'Jul 2026' }
                        ].map((pt, i) => (
                          <g key={i}>
                            <circle cx={pt.x} cy={pt.y} r="4" fill="#0A0838" stroke="#FFFFFF" strokeWidth="2" />
                            <text x={pt.x} y={pt.y - 8} textAnchor="middle" fill="#29251D" fontSize="9" fontWeight="bold" fontFamily="monospace">
                              {pt.val}
                            </text>
                            <text x={pt.x} y={105} textAnchor="middle" fill="#4D4D4F" fontSize="8" fontWeight="500" fontFamily="monospace">
                              {pt.month}
                            </text>
                          </g>
                        ))}
                      </svg>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* SMART ROUTING MODAL */}
            {activeModal === 'smart-routing' && (
              <>
                <div className="p-4 border-b border-[#E5DFD3] dark:border-white/10 bg-[#FFFFFF] dark:bg-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#0A0838]/10 text-[#0A0838] dark:text-white flex items-center justify-center shadow-2xs">
                      <GitBranch className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-semibold text-[#29251D] dark:text-white">
                          Smart Routing &amp; Decision Layer
                        </h3>
                        <span className="px-2 py-0.5 rounded-full bg-[#0A0838] text-white text-[9.5px] font-mono font-medium">
                          DECISION ROUTER
                        </span>
                      </div>
                      <p className="text-xs text-[#4D4D4F] dark:text-slate-400">
                        Intelligent routing of 26,789 inbound service requests across 56 Production SOPs
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveModal(null)}
                    className="w-8 h-8 rounded-full bg-[#F6F2EA] dark:bg-white/10 text-[#4D4D4F] hover:bg-[#E31837] hover:text-white dark:hover:bg-[#E31837] flex items-center justify-center transition-all cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-4 overflow-y-auto space-y-3 bg-[#FAF8F5] dark:bg-transparent">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="p-3.5 rounded-2xl bg-[#F6F2EA] dark:bg-white/5 border border-[#E5DFD3] dark:border-white/10">
                      <div className="flex items-center gap-2 text-[#0A0838] dark:text-white font-semibold text-xs mb-1">
                        <span className="w-5 h-5 rounded-full bg-[#0A0838]/10 flex items-center justify-center text-[10px]">1</span>
                        Inbound Demand
                      </div>
                      <p className="text-xs text-[#4D4D4F] dark:text-slate-400">
                        26,789 service requests entered across April, May, June, and July 2026.
                      </p>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-[#F6F2EA] dark:bg-white/5 border border-[#E5DFD3] dark:border-white/10">
                      <div className="flex items-center gap-2 text-[#0A0838] dark:text-white font-semibold text-xs mb-1">
                        <span className="w-5 h-5 rounded-full bg-[#0A0838]/10 flex items-center justify-center text-[10px]">2</span>
                        56 Production SOPs
                      </div>
                      <p className="text-xs text-[#4D4D4F] dark:text-slate-400">
                        Standard Operating Procedures for access control, patching, AD hygiene, and health checks.
                      </p>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-[#F6F2EA] dark:bg-white/5 border border-[#E5DFD3] dark:border-white/10">
                      <div className="flex items-center gap-2 text-[#0A0838] dark:text-white font-semibold text-xs mb-1">
                        <span className="w-5 h-5 rounded-full bg-[#0A0838]/10 flex items-center justify-center text-[10px]">3</span>
                        Fulfillment Paths
                      </div>
                      <p className="text-xs text-[#4D4D4F] dark:text-slate-400">
                        4,470 requests (16.7%) resolved via Zero-Touch automation and 22,319 requests (83.3%) via TechHub.
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* VOLUME & MATURITY MODAL */}
            {activeModal === 'volume-maturity' && (
              <>
                <div className="p-4 border-b border-[#E5DFD3] dark:border-white/10 bg-[#FFFFFF] dark:bg-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#0A0838]/10 text-[#0A0838] dark:text-white flex items-center justify-center shadow-2xs">
                      <Cpu className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-[#29251D] dark:text-white">
                        Service Desk Volume &amp; Maturity
                      </h3>
                      <p className="text-xs text-[#4D4D4F] dark:text-slate-400">
                        {totalInteractions.toLocaleString()} Total Inbound Interactions / Month
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveModal(null)}
                    className="w-8 h-8 rounded-full bg-[#F6F2EA] dark:bg-white/10 text-[#4D4D4F] hover:bg-[#E31837] hover:text-white dark:hover:bg-[#E31837] flex items-center justify-center transition-all cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-4 overflow-y-auto space-y-3.5 max-h-[60vh] bg-[#FAF8F5] dark:bg-transparent">
                  {/* 4 Channels Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {channels.map((ch) => {
                      const Icon = ch.icon;
                      return (
                        <div
                          key={ch.id}
                          className="p-3 rounded-2xl bg-[#F6F2EA] dark:bg-white/5 border border-[#E5DFD3] dark:border-white/10 flex flex-col justify-between gap-2 shadow-xs"
                        >
                          <div className="flex items-center justify-between">
                            <div
                              className="w-7 h-7 rounded-lg flex items-center justify-center"
                              style={{
                                backgroundColor: `${ch.color}15`,
                                color: ch.color
                              }}
                            >
                              <Icon className="w-4 h-4" />
                            </div>
                          </div>
                          <div>
                            <span className="text-xs font-medium text-[#4D4D4F] dark:text-slate-400 block mb-0.5">
                              {ch.label}
                            </span>
                            <span className="text-2xl font-semibold text-[#29251D] dark:text-white tracking-tight block">
                              {ch.count.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Maturity Index Details */}
                  <div className="p-4 rounded-2xl bg-[#F6F2EA] dark:bg-white/5 border border-[#E5DFD3] dark:border-white/10 flex items-center justify-between gap-6 shadow-xs">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <Target className="w-4 h-4 text-[#0A0838] dark:text-white" />
                        <span className="text-sm font-semibold text-[#29251D] dark:text-white">
                          Automation Maturity Index
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-[#D1EED0] text-[#2E5F13] border border-[#B4DFB1] text-xs font-medium flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          {maturityModel.status}
                        </span>
                      </div>
                      <p className="text-xs text-[#4D4D4F] dark:text-slate-400">
                        Target: <strong className="text-[#29251D] dark:text-white font-semibold">{maturityModel.targetPct}%</strong> deflection by {maturityModel.dueDate}
                      </p>
                      <div className="flex items-center gap-3 pt-1 text-xs text-[#4D4D4F] dark:text-slate-400">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#2E5F13]" />
                          <span>Achieved (12%)</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#8D5C1A]" />
                          <span>Target (30%)</span>
                        </div>
                      </div>
                    </div>

                    {/* Prominent Maturity Circular Dial */}
                    <div className="relative w-28 h-28 shrink-0 flex items-center justify-center">
                      <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 120 120">
                        <circle
                          cx="60"
                          cy="60"
                          r={dialRadius}
                          fill="none"
                          stroke="currentColor"
                          className="text-[#E5DFD3] dark:text-white/10"
                          strokeWidth="10"
                        />
                        <circle
                          cx="60"
                          cy="60"
                          r={dialRadius}
                          fill="none"
                          stroke="#F59E0B"
                          strokeWidth="10"
                          strokeDasharray={`${targetProgress * (dialRadius / 80)} ${circumference}`}
                          strokeDashoffset="0"
                          className="opacity-40"
                        />
                        <circle
                          cx="60"
                          cy="60"
                          r={dialRadius}
                          fill="none"
                          stroke="#10B981"
                          strokeWidth="10"
                          strokeDasharray={`${currentProgress * (dialRadius / 80)} ${circumference}`}
                          strokeDashoffset="0"
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                        <span className="text-[9px] font-semibold text-[#4D4D4F] dark:text-slate-400">
                          Achieved
                        </span>
                        <span className="text-2xl font-semibold text-[#10B981] leading-none mt-0.5">
                          {animatedChannels.achievedPct}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* AD HYGIENE MODAL */}
            {activeModal === 'ad-hygiene' && (
              <>
                <div className="p-4 border-b border-[#E5DFD3] dark:border-white/10 bg-[#FFFFFF] dark:bg-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#0A0838]/10 text-[#0A0838] dark:text-white flex items-center justify-center shadow-2xs">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-[#29251D] dark:text-white">
                        Active Directory Hygiene &amp; Governance
                      </h3>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveModal(null)}
                    className="w-8 h-8 rounded-full bg-[#F6F2EA] dark:bg-white/10 text-[#4D4D4F] hover:bg-[#E31837] hover:text-white dark:hover:bg-[#E31837] flex items-center justify-center transition-all cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-4 overflow-y-auto space-y-3 max-h-[60vh] bg-[#FAF8F5] dark:bg-transparent">
                  {/* Pillar 1: License Harvesting Breakdown */}
                  <div className="p-4 rounded-2xl bg-[#F6F2EA] dark:bg-white/5 border border-[#E5DFD3] dark:border-white/10 shadow-xs">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-semibold text-[#29251D] dark:text-slate-200 flex items-center gap-2">
                        <Key className="w-4 h-4 text-[#0A0838] dark:text-white" />
                        License Harvesting &amp; Reclamation
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-[#E0ECE0] text-[#2E7D32] border border-[#6DA470]/40 font-medium text-xs">
                        {adHygiene.licensesReleasedTotal.toLocaleString()} Licenses Released
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-2.5">
                      {adHygiene.licenseBreakdown.map((lic, idx) => (
                        <div key={idx} className="p-3 rounded-xl bg-[#FFFFFF] dark:bg-white/10 border border-[#E5DFD3] dark:border-white/10 text-center flex flex-col items-center justify-center gap-0.5 shadow-2xs">
                          <span className="text-xs font-medium text-[#4D4D4F] dark:text-slate-400">{lic.tier}</span>
                          <span className="text-2xl font-semibold text-[#29251D] dark:text-white">{lic.count.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Pillar 2 & 3: Mailbox Governance & Stale Purge */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {/* Mailbox Policies */}
                    <div className="p-4 rounded-2xl bg-[#F6F2EA] dark:bg-white/5 border border-[#E5DFD3] dark:border-white/10 flex flex-col justify-between gap-3 shadow-xs">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-[#0A0838]/10 text-[#0A0838] dark:text-white flex items-center justify-center">
                            <Mail className="w-4 h-4" />
                          </div>
                          <h4 className="text-xs font-semibold text-[#29251D] dark:text-slate-200">
                            Mailbox Policies Applied
                          </h4>
                        </div>
                        <span className="px-2 py-0.5 rounded-full bg-[#D1EED0] text-[#2E5F13] border border-[#B4DFB1] font-medium text-xs">
                          Enforced
                        </span>
                      </div>
                      <div className="p-3 rounded-xl bg-[#FFFFFF] dark:bg-white/10 border border-[#E5DFD3] dark:border-white/10 text-center shadow-2xs">
                        <span className="text-2xl font-semibold text-[#29251D] dark:text-white block">
                          {adHygiene.mailboxPoliciesApplied}
                        </span>
                      </div>
                    </div>

                    {/* Stale Identity Items Purged */}
                    <div className="p-4 rounded-2xl bg-[#F6F2EA] dark:bg-white/5 border border-[#E5DFD3] dark:border-white/10 flex flex-col justify-between gap-3 shadow-xs">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-[#0A0838]/10 text-[#0A0838] dark:text-white flex items-center justify-center">
                            <ShieldCheck className="w-4 h-4" />
                          </div>
                          <h4 className="text-xs font-semibold text-[#29251D] dark:text-slate-200">
                            Stale Identity Items Purged
                          </h4>
                        </div>
                        <span className="px-2 py-0.5 rounded-full bg-[#D1EED0] text-[#2E5F13] border border-[#B4DFB1] font-medium text-xs">
                          {adHygiene.staleItemsDisabledTotal.toLocaleString()} Purged
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="p-2.5 rounded-xl bg-[#FFFFFF] dark:bg-white/10 border border-[#E5DFD3] dark:border-white/10 text-center shadow-2xs">
                          <span className="text-xs font-medium text-[#4D4D4F] dark:text-slate-400 block mb-0.5">Computers</span>
                          <span className="text-xl font-semibold text-[#29251D] dark:text-white">{adHygiene.staleComputersDisabled.toLocaleString()}</span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-[#FFFFFF] dark:bg-white/10 border border-[#E5DFD3] dark:border-white/10 text-center shadow-2xs">
                          <span className="text-xs font-medium text-[#4D4D4F] dark:text-slate-400 block mb-0.5">User Accounts</span>
                          <span className="text-xl font-semibold text-[#29251D] dark:text-white">{adHygiene.staleUserAccountsDisabled.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            <div className="p-3 border-t border-[#E5DFD3] dark:border-white/10 bg-[#FAF8F5] dark:bg-white/3 flex items-center justify-end">
              <button
                onClick={() => setActiveModal(null)}
                className="px-5 py-2 rounded-xl bg-[#2B2B36] hover:bg-[#1E1E24] text-white text-xs font-bold transition-all shadow-xs cursor-pointer border border-slate-700/30"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* LEVEL 2 MODAL: STATUS BREAKDOWN MODAL */}
      {activeModalLevel === 2 && selectedStream && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={closeModal}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-3xl bg-[#FAF8F5] dark:bg-[#0E0C42] border border-[#E5DFD3] dark:border-white/15 rounded-3xl p-6 md:p-8 shadow-2xl animate-in zoom-in-95 duration-250 flex flex-col gap-6 text-[#29251D] dark:text-white"
          >
            {/* Breadcrumb & Close Bar */}
            <div className="flex items-center justify-between pb-3 border-b border-[#E5DFD3] dark:border-white/10">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-500 dark:text-slate-400">
                <span className="hover:text-[#0A0838] dark:hover:text-white cursor-pointer" onClick={closeModal}>
                  Automation Pipeline
                </span>
                <ChevronRight className="w-3.5 h-3.5" />
                <span className="text-[#0A0838] dark:text-white">
                  {activeStreamMeta.title}
                </span>
              </div>

              <button
                onClick={closeModal}
                className="w-8 h-8 rounded-full bg-slate-200/60 dark:bg-white/10 hover:bg-[#0A0838] hover:text-white dark:hover:bg-white/20 flex items-center justify-center transition-colors cursor-pointer"
                title="Close modal (Esc)"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Header */}
            <div className="flex items-center gap-4">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner"
                style={{ backgroundColor: `${activeStreamMeta.color}20`, color: activeStreamMeta.color }}
              >
                <activeStreamMeta.icon className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-semibold tracking-tight">
                  {activeStreamMeta.title}
                </h2>
                <p className="text-xs text-[#4D4D4F] dark:text-slate-400">
                  {activeStreamMeta.subtitle}
                </p>
              </div>
            </div>

            {/* THREE INTERACTIVE KPI STATUS CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">

              {/* CARD 1: TOTAL */}
              <div
                onClick={() => handleOpenStatusModal('ALL')}
                className="group p-4 rounded-2xl bg-[#F6F2EA] dark:bg-white/5 border border-[#E5DFD3] dark:border-white/10 hover:border-[#0A0838]/40 shadow-xs hover:shadow-md hover:scale-[1.01] transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-medium text-[#4D4D4F] dark:text-slate-300">
                      Total Use Cases
                    </span>
                    <Layers className="w-4 h-4 text-[#0A0838] dark:text-slate-300 group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="text-3xl font-semibold text-[#29251D] dark:text-white my-1 font-mono">
                    {activeStreamMeta.stats.total}
                  </div>
                  <p className="text-xs text-[#4D4D4F] dark:text-slate-400">
                    Comprehensive automation scope
                  </p>
                </div>
                <div className="mt-3.5 pt-2.5 border-t border-[#E5DFD3] dark:border-white/10 flex items-center justify-between text-xs font-medium text-[#0A0838] dark:text-slate-200 group-hover:text-[#0066B2] transition-colors">
                  <span>View all {activeStreamMeta.stats.total} use cases</span>
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>

              {/* CARD 2: ACTIVE */}
              <div
                onClick={() => handleOpenStatusModal('ACTIVE')}
                className="group p-4 rounded-2xl bg-[#F6F2EA] dark:bg-white/5 border border-[#E5DFD3] dark:border-white/10 hover:border-[#2E5F13]/50 shadow-xs hover:shadow-md hover:scale-[1.01] transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-medium text-[#2E5F13] dark:text-emerald-400">
                      Active
                    </span>
                    <Zap className="w-4 h-4 text-[#2E5F13] dark:text-emerald-400 group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="text-3xl font-semibold text-[#2E5F13] dark:text-emerald-400 my-1">
                    {activeStreamMeta.stats.active}
                  </div>
                  <p className="text-xs text-[#4D4D4F] dark:text-slate-400">
                    Live production &amp; self-healing
                  </p>
                </div>
                <div className="mt-3.5 pt-2.5 border-t border-[#E5DFD3] dark:border-white/10 flex items-center justify-between text-xs font-medium text-[#2E5F13] dark:text-emerald-400 group-hover:text-[#2E5F13] transition-colors">
                  <span>View {activeStreamMeta.stats.active} active cases</span>
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>

              {/* CARD 3: PLANNED */}
              <div
                onClick={() => handleOpenStatusModal('PLANNED')}
                className="group p-4 rounded-2xl bg-[#F6F2EA] dark:bg-white/5 border border-[#E5DFD3] dark:border-white/10 hover:border-[#8D5C1A]/50 shadow-xs hover:shadow-md hover:scale-[1.01] transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-medium text-[#8D5C1A] dark:text-amber-400">
                      Planned
                    </span>
                    <Clock className="w-4 h-4 text-[#8D5C1A] dark:text-amber-400 group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="text-3xl font-semibold text-[#8D5C1A] dark:text-amber-400 my-1">
                    {activeStreamMeta.stats.planned}
                  </div>
                  <p className="text-xs text-[#4D4D4F] dark:text-slate-400">
                    Scheduled backlog &amp; milestone ETAs
                  </p>
                </div>
                <div className="mt-3.5 pt-2.5 border-t border-[#E5DFD3] dark:border-white/10 flex items-center justify-between text-xs font-medium text-[#8D5C1A] dark:text-amber-400 group-hover:text-[#8D5C1A] transition-colors">
                  <span>View {activeStreamMeta.stats.planned} planned cases</span>
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* LEVEL 3 MODAL: INDIVIDUAL USE CASE DETAILS MODAL */}
      {activeModalLevel === 3 && selectedStream && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={closeModal}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-5xl max-h-[90vh] bg-[#FAF8F5] dark:bg-[#0E0C42] border border-[#E5DFD3] dark:border-white/15 rounded-3xl p-5 md:p-7 shadow-2xl animate-in slide-in-from-bottom-3 duration-250 flex flex-col gap-4 text-[#29251D] dark:text-white"
          >
            {/* Top Navigation & Breadcrumbs Bar */}
            <div className="flex items-center justify-between pb-3 border-b border-[#E5DFD3] dark:border-white/10 shrink-0">
              <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono font-bold text-slate-500 dark:text-slate-400">
                <span className="hover:text-[#0A0838] dark:hover:text-white cursor-pointer" onClick={closeModal}>
                  Automation Pipeline
                </span>
                <ChevronRight className="w-3.5 h-3.5" />
                <span className="hover:text-[#0A0838] dark:hover:text-white cursor-pointer" onClick={handleBackToLevel2}>
                  {activeStreamMeta.title}
                </span>
                <ChevronRight className="w-3.5 h-3.5" />
                <span className="text-[#0A0838] dark:text-white">
                  {selectedStatus === 'ALL' ? 'All Identified' : selectedStatus === 'ACTIVE' ? 'Active' : 'Planned'} Use Cases
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleBackToLevel2}
                  className="px-3 py-1.5 rounded-xl bg-slate-200/70 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/20 text-xs font-heading font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Back to Status
                </button>

                <button
                  onClick={closeModal}
                  className="w-8 h-8 rounded-full bg-slate-200/60 dark:bg-white/10 hover:bg-[#0A0838] hover:text-white dark:hover:bg-white/20 flex items-center justify-center transition-colors cursor-pointer"
                  title="Close modal (Esc)"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal Title & Quick Filter Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 shrink-0">
              <div>
                <h2 className="text-xl md:text-2xl font-semibold tracking-tight text-[#29251D] dark:text-white">
                  {activeStreamMeta.title} / {selectedStatus === 'ALL' ? 'All Identified' : selectedStatus === 'ACTIVE' ? 'Active' : 'Planned'} Use Cases
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Showing {filteredUseCases.length} automation use cases with active components &amp; delivery status
                </p>
              </div>

              {/* Status Switcher & Sub-Stream Filter & Search Bar */}
              <div className="flex flex-wrap items-center gap-2">

                {/* Optional Stream sub-filter if viewing TOTAL PIPELINE */}
                {selectedStream === 'TOTAL PIPELINE' && (
                  <div className="flex items-center bg-slate-200/50 dark:bg-white/5 p-0.5 rounded-xl border border-slate-300/40 dark:border-white/10 text-[10.5px] font-mono font-bold">
                    <button
                      onClick={() => setSelectedStreamSubFilter('ALL')}
                      className={`px-2 py-1 rounded-lg transition-all cursor-pointer ${selectedStreamSubFilter === 'ALL'
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'text-slate-500 hover:text-[#29251D] dark:hover:text-white'
                        }`}
                    >
                      All Streams
                    </button>
                    <button
                      onClick={() => setSelectedStreamSubFilter('INFRA OPS')}
                      className={`px-2 py-1 rounded-lg transition-all cursor-pointer ${selectedStreamSubFilter === 'INFRA OPS'
                        ? 'bg-sky-600 text-white shadow-sm'
                        : 'text-sky-700 dark:text-sky-400 hover:text-sky-800'
                        }`}
                    >
                      InfraOps (16)
                    </button>
                    <button
                      onClick={() => setSelectedStreamSubFilter('SEC OPS')}
                      className={`px-2 py-1 rounded-lg transition-all cursor-pointer ${selectedStreamSubFilter === 'SEC OPS'
                        ? 'bg-purple-600 text-white shadow-sm'
                        : 'text-purple-700 dark:text-purple-400 hover:text-purple-800'
                        }`}
                    >
                      SecOps (16)
                    </button>
                  </div>
                )}

                {/* Status Switcher */}
                <div className="flex items-center bg-slate-200/50 dark:bg-white/5 p-0.5 rounded-xl border border-slate-300/40 dark:border-white/10 text-[11px] font-mono font-bold">
                  <button
                    onClick={() => setSelectedStatus('ALL')}
                    className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${selectedStatus === 'ALL'
                      ? 'bg-white dark:bg-white/20 text-[#29251D] dark:text-white shadow-sm'
                      : 'text-slate-500 hover:text-[#29251D] dark:hover:text-white'
                      }`}
                  >
                    All ({activeStreamMeta.stats.total})
                  </button>
                  <button
                    onClick={() => setSelectedStatus('ACTIVE')}
                    className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${selectedStatus === 'ACTIVE'
                      ? 'bg-[#2E5F13] text-white shadow-sm'
                      : 'text-[#2E5F13] dark:text-[#B4DFB1] hover:text-[#2E5F13]'
                      }`}
                  >
                    Active ({activeStreamMeta.stats.active})
                  </button>
                  <button
                    onClick={() => setSelectedStatus('PLANNED')}
                    className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${selectedStatus === 'PLANNED'
                      ? 'bg-[#8D5C1A] text-white shadow-sm'
                      : 'text-[#8D5C1A] dark:text-[#F2DF80] hover:text-[#8D5C1A]'
                      }`}
                  >
                    Planned ({activeStreamMeta.stats.planned})
                  </button>
                </div>

                {/* Inline Search Filter */}
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search use cases..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8 pr-3 py-1 text-xs rounded-xl bg-white dark:bg-white/5 border border-slate-300/60 dark:border-white/10 text-[#29251D] dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-[#E31837] w-32 md:w-44"
                  />
                </div>
              </div>
            </div>

            {/* Scrollable Use Cases Grid Container */}
            <div className="flex-1 overflow-y-auto max-h-[60vh] pr-1.5 space-y-3">
              {filteredUseCases.length === 0 ? (
                <div className="p-12 text-center rounded-2xl bg-white/50 dark:bg-white/5 border border-[#E5DFD3] dark:border-white/10 text-slate-500 dark:text-slate-400">
                  <Layers className="w-8 h-8 mx-auto mb-2 text-slate-400" />
                  <p className="font-heading font-bold text-sm">No use cases currently available.</p>
                  <p className="text-xs mt-1">Try changing your search query or status filter.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {filteredUseCases.map((uc, idx) => {
                    const isActive = uc.status === 'ACTIVE';
                    const isInfra = uc.stream === 'INFRA OPS';
                    const displayNum = String(idx + 1).padStart(2, '0');

                    return (
                      <div
                        key={uc.id}
                        className="group bg-white dark:bg-white/5 border border-[#E5DFD3] dark:border-white/10 hover:border-[#0284C7]/50 dark:hover:border-sky-400/50 rounded-2xl p-4 shadow-sm hover:shadow-md hover:scale-[1.01] transition-all flex flex-col justify-between"
                      >
                        <div>
                          {/* Card Top: Number, Stream Badge, Category & Status Pill */}
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <div className="flex items-center gap-1.5">
                              <span className="w-5 h-5 rounded-md bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 text-[10px] font-mono font-bold flex items-center justify-center">
                                {displayNum}
                              </span>
                              <span className={`px-2 py-0.5 rounded-full text-[9.5px] font-semibold ${isInfra
                                ? 'bg-sky-100/80 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-500/30'
                                : 'bg-purple-100/80 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-500/30'
                                }`}>
                                {isInfra ? 'InfraOps' : 'SecOps'}
                              </span>
                              <span className="text-[10px] font-mono text-slate-400 font-medium">
                                {uc.category}
                              </span>
                            </div>

                            <span className={`px-2.5 py-0.5 rounded-full text-[9.5px] font-mono font-extrabold flex items-center gap-1 ${isActive
                              ? 'bg-[#D1EED0] text-[#2E5F13] border border-[#B4DFB1]'
                              : 'bg-[#F8EDA4] text-[#8D5C1A] border border-[#F2DF80]'
                              }`}>
                              {isActive ? <Zap className="w-2.5 h-2.5 text-[#2E5F13]" /> : <Clock className="w-2.5 h-2.5 text-[#8D5C1A]" />}
                              {uc.status}
                            </span>
                          </div>

                          {/* Use Case Name */}
                          <h4 className="text-sm font-heading font-bold text-[#29251D] dark:text-white group-hover:text-[#0284C7] dark:group-hover:text-sky-400 transition-colors mb-1.5 leading-snug">
                            {uc.name}
                          </h4>

                          {/* Technical Detail & Runbook Logic */}
                          <p className="text-xs text-slate-600 dark:text-slate-300 font-sans leading-relaxed">
                            {uc.detail}
                          </p>
                        </div>

                        {/* Card Bottom Meta Bar */}
                        <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-white/10 flex items-center justify-between text-[10px] font-mono text-slate-500 dark:text-slate-400">
                          <span className="flex items-center gap-1">
                            <span className="font-bold text-slate-700 dark:text-slate-300">Tooling:</span> PowerShell / Runbook API
                          </span>
                          <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 font-bold">
                            {uc.targetDate || (isActive ? 'Self-Healing Active' : 'Q4 2026 Target')}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Modal Bottom Footer Summary */}
            <div className="pt-3 border-t border-[#E5DFD3] dark:border-white/10 flex items-center justify-between text-xs font-mono text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-4">
                <span>Total Stream: <strong>{activeStreamMeta.stats.total} Scoped</strong></span>
                <span>•</span>
                <span>Active Production: <strong className="text-[#2E5F13]">18 Use Cases</strong></span>
                <span>•</span>
                <span>Roadmap Backlog: <strong className="text-amber-600">14 Use Cases</strong></span>
              </div>

              <button
                onClick={closeModal}
                className="px-5 py-2 rounded-xl bg-[#2B2B36] hover:bg-[#1E1E24] text-white font-heading font-bold text-xs transition-all cursor-pointer border border-slate-700/30 shadow-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AutonomousServiceDesk;
