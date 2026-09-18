import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useLiveData } from '../hooks/useLiveData';
import { LiveDataBadge } from '../components/LiveDataBadge';
import { defaultAutomationUseCases, AutomationUseCaseItem } from '../data/automationData';
import {
  Server,
  Shield,
  Cpu,
  CheckCircle2,
  X,
  ChevronRight,
  ArrowLeft,
  Sparkles,
  Zap,
  Clock,
  Layers,
  ArrowUpRight,
  Search,
  MousePointerClick,
  GitBranch
} from 'lucide-react';

interface AutomationPipelineProps {
  onNavigateToNext?: () => void;
  onNavigateToPrev?: () => void;
}

type StreamType = 'INFRA OPS' | 'SEC OPS' | 'TOTAL PIPELINE';
type FilterStatus = 'ALL' | 'ACTIVE' | 'PLANNED';

export const AutomationPipeline: React.FC<AutomationPipelineProps> = ({
  onNavigateToNext,
  onNavigateToPrev
}) => {
  const { data: liveData, isLoading, isRefreshing, error, lastUpdatedDisplay, dataSource, refresh } = useLiveData();

  // Central use cases data source (from live data or typed default fallback)
  const allUseCases: AutomationUseCaseItem[] = useMemo(() => {
    return liveData?.automationUseCases && liveData.automationUseCases.length > 0
      ? liveData.automationUseCases
      : defaultAutomationUseCases;
  }, [liveData?.automationUseCases]);

  // Modal Navigation State:
  // level 1: Dashboard (no modal)
  // level 2: Status Breakdown Modal (selectedStream is set, activeModalLevel === 2)
  // level 3: Use Case Details Modal (selectedStream & selectedStatus are set, activeModalLevel === 3)
  const [activeModalLevel, setActiveModalLevel] = useState<1 | 2 | 3>(1);
  const [selectedStream, setSelectedStream] = useState<StreamType | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<FilterStatus>('ALL');
  const [selectedStreamSubFilter, setSelectedStreamSubFilter] = useState<'ALL' | 'INFRA OPS' | 'SEC OPS'>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Page entrance animation state
  const [animStage, setAnimStage] = useState<number>(0);

  useEffect(() => {
    const t1 = setTimeout(() => setAnimStage(1), 50);
    const t2 = setTimeout(() => setAnimStage(2), 200);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  // Keyboard shortcut: Escape closes current modal or steps back
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (activeModalLevel === 3) {
          setActiveModalLevel(2);
        } else if (activeModalLevel === 2) {
          closeModal();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeModalLevel]);

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

  // Direct Click Handler: Opens Level 3 modal directly for a stream + status (e.g. click Active on InfraOps)
  const handleDirectStatusClick = useCallback((stream: StreamType, status: FilterStatus, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSelectedStream(stream);
    setSelectedStatus(status);
    setSelectedStreamSubFilter('ALL');
    setSearchQuery('');
    setActiveModalLevel(3);
  }, []);

  // Level 1 -> Level 2: Click on Stream Card Header / Container
  const handleOpenStreamModal = useCallback((stream: StreamType) => {
    setSelectedStream(stream);
    setSelectedStatus('ALL');
    setSelectedStreamSubFilter('ALL');
    setSearchQuery('');
    setActiveModalLevel(2);
  }, []);

  // Level 2 -> Level 3: Click on Status KPI Card inside Level 2 modal
  const handleOpenStatusModal = useCallback((status: FilterStatus) => {
    setSelectedStatus(status);
    setSelectedStreamSubFilter('ALL');
    setSearchQuery('');
    setActiveModalLevel(3);
  }, []);

  // Back from Level 3 to Level 2
  const handleBackToLevel2 = useCallback(() => {
    setActiveModalLevel(2);
    setSearchQuery('');
  }, []);

  // Close all modals back to Level 1
  const closeModal = useCallback(() => {
    setActiveModalLevel(1);
    setSelectedStream(null);
    setSelectedStatus('ALL');
    setSelectedStreamSubFilter('ALL');
    setSearchQuery('');
  }, []);

  // Filtered Use Cases for Level 3
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

  // Current active stream metadata for Level 2 & 3
  const activeStreamMeta = useMemo(() => {
    if (selectedStream === 'INFRA OPS') {
      return {
        title: 'InfraOps',
        subtitle: 'Infrastructure & Systems Automation',
        icon: Server,
        color: '#0284C7',
        badgeBg: 'bg-sky-50 dark:bg-sky-950/40 border-sky-200 dark:border-sky-500/30 text-sky-700 dark:text-sky-300',
        cardBorderHover: 'hover:border-sky-500',
        stats: streamStats.infra
      };
    } else if (selectedStream === 'SEC OPS') {
      return {
        title: 'SecOps',
        subtitle: 'Security, Identity & Compliance Operations',
        icon: Shield,
        color: '#8B5CF6',
        badgeBg: 'bg-purple-50 dark:bg-purple-950/40 border-purple-200 dark:border-purple-500/30 text-purple-700 dark:text-purple-300',
        cardBorderHover: 'hover:border-purple-500',
        stats: streamStats.sec
      };
    } else {
      return {
        title: 'Total Pipeline',
        subtitle: 'Consolidated Velocity & Delivery Target',
        icon: Cpu,
        color: '#10B981',
        badgeBg: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-300',
        cardBorderHover: 'hover:border-emerald-500',
        stats: streamStats.total
      };
    }
  }, [selectedStream, streamStats]);

  return (
    <div className={`h-full w-full flex flex-col p-5 md:p-7 lg:p-9 gap-3.5 relative overflow-hidden bg-[#FFFFFF] dark:bg-[#0A0838] text-[#29251D] dark:text-white transition-opacity duration-500 select-none ${isLoading ? 'opacity-70' : 'opacity-100'}`}>

      {/* 1. TOP EXECUTIVE HEADER */}
      <div className={`shrink-0 transition-all duration-700 ${animStage >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
        <div className="flex items-start justify-between gap-4 pb-2 border-b border-[#E5DFD3] dark:border-white/10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-[#0066B2] dark:bg-sky-400 animate-pulse" />
              <span className="text-xs font-medium text-[#0066B2] dark:text-sky-400">
                04 • Autonomous Operations
              </span>
            </div>
            <h1 className="text-2xl font-semibold tracking-tight text-[#29251D] dark:text-white">
              Automation Use Cases &amp; Pipeline
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

      {/* 2. LEVEL 1: UNIFIED TOP TOTAL SECTION + 2 STREAM CARDS */}
      <div className={`flex-1 flex flex-col gap-3.5 justify-between transition-all duration-700 ${animStage >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        
        {/* TOTAL AUTOMATION PIPELINE EXECUTIVE BANNER (CLICKABLE DIRECTLY) */}
        <div className="bg-[#F6F2EA] dark:bg-white/5 rounded-2xl p-3.5 md:p-4 border border-[#E5DFD3] dark:border-white/10 shadow-sm flex flex-wrap items-center justify-between gap-3 group hover:border-[#0A0838]/40 transition-all">
          
          {/* Left: Total Identity */}
          <div 
            onClick={() => handleOpenStreamModal('TOTAL PIPELINE')}
            className="flex items-center gap-3 cursor-pointer"
            title="Click to view Total Pipeline overview"
          >
            <div className="w-10 h-10 rounded-xl bg-[#0A0838]/10 text-[#0A0838] dark:text-white flex items-center justify-center group-hover:scale-105 transition-transform">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-semibold text-[#29251D] dark:text-white group-hover:text-[#0A0838] dark:group-hover:text-white transition-colors">
                  Overall Automation Pipeline
                </h2>
                <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-[#0A0838]/10 text-[#0A0838] dark:bg-white/10 dark:text-white flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Ahead of Schedule
                </span>
              </div>
              <p className="text-xs text-[#4D4D4F] dark:text-slate-400 mt-0.5">
                Consolidated delivery across InfraOps &amp; SecOps streams
              </p>
            </div>
          </div>

          {/* Right: Clickable Total Metric Pills */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Total Identified */}
            <button
              onClick={(e) => handleDirectStatusClick('TOTAL PIPELINE', 'ALL', e)}
              className="px-3 py-1.5 rounded-xl bg-[#FFFFFF] hover:bg-[#FAF8F5] dark:bg-white/5 dark:hover:bg-white/10 border border-[#E5DFD3] dark:border-white/10 flex items-center gap-2 hover:scale-105 transition-all cursor-pointer group/btn"
              title="Click to view all 32 scoped use cases"
            >
              <span className="text-xs font-medium text-[#4D4D4F] dark:text-slate-400">
                Total:
              </span>
              <span className="text-sm font-semibold text-[#29251D] dark:text-white">
                {streamStats.total.total}
              </span>
              <span className="text-xs text-[#4D4D4F]/70">Scoped</span>
            </button>

            {/* Total Active */}
            <button
              onClick={(e) => handleDirectStatusClick('TOTAL PIPELINE', 'ACTIVE', e)}
              className="px-3 py-1.5 rounded-xl bg-[#0A0838]/10 hover:bg-[#0A0838]/15 border border-[#0A0838]/20 dark:bg-white/10 dark:text-white flex items-center gap-2 hover:scale-105 transition-all cursor-pointer group/btn"
              title="Click to view 18 active production use cases"
            >
              <span className="w-2 h-2 rounded-full bg-[#0A0838] dark:bg-white animate-pulse" />
              <span className="text-xs font-medium text-[#0A0838] dark:text-white">
                Active:
              </span>
              <span className="text-sm font-semibold text-[#0A0838] dark:text-white">
                {streamStats.total.active}
              </span>
              <span className="text-xs text-[#0A0838]/70 dark:text-white/70">Live</span>
            </button>

            {/* Total Planned */}
            <button
              onClick={(e) => handleDirectStatusClick('TOTAL PIPELINE', 'PLANNED', e)}
              className="px-3 py-1.5 rounded-xl bg-[#FFFFFF] hover:bg-[#FAF8F5] dark:bg-white/5 dark:hover:bg-white/10 border border-[#E5DFD3] dark:border-white/10 flex items-center gap-2 hover:scale-105 transition-all cursor-pointer group/btn"
              title="Click to view 14 planned roadmap use cases"
            >
              <Clock className="w-3 h-3 text-[#4D4D4F] dark:text-slate-300" />
              <span className="text-xs font-medium text-[#4D4D4F] dark:text-slate-300">
                Planned:
              </span>
              <span className="text-sm font-semibold text-[#29251D] dark:text-white">
                {streamStats.total.planned}
              </span>
              <span className="text-xs text-[#4D4D4F]/70">Roadmap</span>
            </button>
          </div>

        </div>

        {/* TWO LARGE SELECTABLE WORKSTREAM CARDS (INFRA OPS & SEC OPS) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 flex-1 items-start">
          
          {/* STREAM 1: INFRA OPS */}
          <div
            onClick={() => handleOpenStreamModal('INFRA OPS')}
            className="group relative bg-[#F6F2EA] dark:bg-white/5 border border-[#E5DFD3] dark:border-white/10 hover:border-[#0A0838] dark:hover:border-white/30 rounded-3xl p-6 md:p-7 flex flex-col justify-between shadow-sm hover:shadow-md hover:scale-[1.012] transition-all duration-300 cursor-pointer overflow-hidden"
          >
            <div>
              {/* Header with Icon & Stream Metadata */}
              <div className="flex items-start justify-between gap-3 mb-5">
                <div className="flex items-center gap-3.5">
                  <div className="w-13 h-13 rounded-2xl bg-[#0A0838]/10 text-[#0A0838] dark:text-white flex items-center justify-center shadow-inner group-hover:scale-105 transition-all duration-300 p-2.5">
                    <Server className="w-7 h-7" />
                  </div>
                  <div>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#FFFFFF] dark:bg-white/10 border border-[#E5DFD3] dark:border-white/10 text-[#0A0838] dark:text-white mb-1 inline-block">
                      Infrastructure Workstream
                    </span>
                    <h3 className="text-xl font-semibold text-[#29251D] dark:text-white group-hover:text-[#0A0838] dark:group-hover:text-white transition-colors">
                      InfraOps
                    </h3>
                    <p className="text-xs text-[#4D4D4F] dark:text-slate-400">
                      Infrastructure &amp; Systems Automation
                    </p>
                  </div>
                </div>

                <div className="px-3 py-1 rounded-full bg-[#0A0838]/10 dark:bg-white/10 text-[#0A0838] dark:text-white font-medium text-xs flex items-center gap-1.5 shrink-0">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Ahead of Schedule
                </div>
              </div>

              {/* THREE DIRECTLY CLICKABLE KPI BLOCKS */}
              <div className="grid grid-cols-3 gap-3">
                
                {/* IDENTIFIED */}
                <div 
                  onClick={(e) => handleDirectStatusClick('INFRA OPS', 'ALL', e)}
                  className="py-3 px-2 rounded-2xl bg-[#FFFFFF] dark:bg-white/5 border border-[#E5DFD3] dark:border-white/10 hover:border-[#0A0838] text-center transition-all hover:scale-105 hover:shadow-sm cursor-pointer group/kpi"
                  title="Click to view all 16 InfraOps use cases"
                >
                  <span className="text-xs font-medium text-[#4D4D4F] dark:text-slate-400 group-hover/kpi:text-[#0A0838] block mb-1">
                    Identified
                  </span>
                  <span className="text-2xl font-semibold text-[#29251D] dark:text-white group-hover/kpi:text-[#0A0838] block">
                    {streamStats.infra.total}
                  </span>
                </div>

                {/* ACTIVE */}
                <div 
                  onClick={(e) => handleDirectStatusClick('INFRA OPS', 'ACTIVE', e)}
                  className="py-3 px-2 rounded-2xl bg-[#FFFFFF] dark:bg-white/5 border border-[#E5DFD3] dark:border-white/10 hover:border-[#0A0838] text-center transition-all hover:scale-105 hover:shadow-sm cursor-pointer group/kpi"
                  title="Click to view 9 live active InfraOps use cases"
                >
                  <span className="text-xs font-medium text-[#0A0838] dark:text-slate-200 block mb-1">
                    Active
                  </span>
                  <span className="text-2xl font-semibold text-[#0A0838] dark:text-white block">
                    {streamStats.infra.active}
                  </span>
                </div>

                {/* PLANNED */}
                <div 
                  onClick={(e) => handleDirectStatusClick('INFRA OPS', 'PLANNED', e)}
                  className="py-3 px-2 rounded-2xl bg-[#FFFFFF] dark:bg-white/5 border border-[#E5DFD3] dark:border-white/10 hover:border-[#0A0838] text-center transition-all hover:scale-105 hover:shadow-sm cursor-pointer group/kpi"
                  title="Click to view 7 planned roadmap InfraOps use cases"
                >
                  <span className="text-xs font-medium text-[#4D4D4F] dark:text-slate-400 block mb-1">
                    Planned
                  </span>
                  <span className="text-2xl font-semibold text-[#4D4D4F] dark:text-slate-300 block">
                    {streamStats.infra.planned}
                  </span>
                </div>

              </div>
            </div>
          </div>

          {/* STREAM 2: SEC OPS */}
          <div
            onClick={() => handleOpenStreamModal('SEC OPS')}
            className="group relative bg-[#F6F2EA] dark:bg-white/5 border border-[#E5DFD3] dark:border-white/10 hover:border-[#0A0838] dark:hover:border-white/30 rounded-3xl p-6 md:p-7 flex flex-col justify-between shadow-sm hover:shadow-md hover:scale-[1.012] transition-all duration-300 cursor-pointer overflow-hidden"
          >
            <div>
              {/* Header with Icon & Stream Metadata */}
              <div className="flex items-start justify-between gap-3 mb-5">
                <div className="flex items-center gap-3.5">
                  <div className="w-13 h-13 rounded-2xl bg-[#0A0838]/10 text-[#0A0838] dark:text-white flex items-center justify-center shadow-inner group-hover:scale-105 transition-all duration-300 p-2.5">
                    <Shield className="w-7 h-7" />
                  </div>
                  <div>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#FFFFFF] dark:bg-white/10 border border-[#E5DFD3] dark:border-white/10 text-[#0A0838] dark:text-white mb-1 inline-block">
                      Cybersecurity Workstream
                    </span>
                    <h3 className="text-xl font-semibold text-[#29251D] dark:text-white group-hover:text-[#0A0838] dark:group-hover:text-white transition-colors">
                      SecOps
                    </h3>
                    <p className="text-xs text-[#4D4D4F] dark:text-slate-400">
                      Security, Identity &amp; Compliance Operations
                    </p>
                  </div>
                </div>

                <div className="px-3 py-1 rounded-full bg-[#0A0838]/10 dark:bg-white/10 text-[#0A0838] dark:text-white font-medium text-xs flex items-center gap-1.5 shrink-0">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Ahead of Schedule
                </div>
              </div>

              {/* THREE DIRECTLY CLICKABLE KPI BLOCKS */}
              <div className="grid grid-cols-3 gap-3">
                
                {/* IDENTIFIED */}
                <div 
                  onClick={(e) => handleDirectStatusClick('SEC OPS', 'ALL', e)}
                  className="py-3 px-2 rounded-2xl bg-[#FFFFFF] dark:bg-white/5 border border-[#E5DFD3] dark:border-white/10 hover:border-[#0A0838] text-center transition-all hover:scale-105 hover:shadow-sm cursor-pointer group/kpi"
                  title="Click to view all 16 SecOps use cases"
                >
                  <span className="text-xs font-medium text-[#4D4D4F] dark:text-slate-400 group-hover/kpi:text-[#0A0838] block mb-1">
                    Identified
                  </span>
                  <span className="text-2xl font-semibold text-[#29251D] dark:text-white group-hover/kpi:text-[#0A0838] block">
                    {streamStats.sec.total}
                  </span>
                </div>

                {/* ACTIVE */}
                <div 
                  onClick={(e) => handleDirectStatusClick('SEC OPS', 'ACTIVE', e)}
                  className="py-3 px-2 rounded-2xl bg-[#FFFFFF] dark:bg-white/5 border border-[#E5DFD3] dark:border-white/10 hover:border-[#0A0838] text-center transition-all hover:scale-105 hover:shadow-sm cursor-pointer group/kpi"
                  title="Click to view 9 live active SecOps use cases"
                >
                  <span className="text-xs font-medium text-[#0A0838] dark:text-slate-200 block mb-1">
                    Active
                  </span>
                  <span className="text-2xl font-semibold text-[#0A0838] dark:text-white block">
                    {streamStats.sec.active}
                  </span>
                </div>

                {/* PLANNED */}
                <div 
                  onClick={(e) => handleDirectStatusClick('SEC OPS', 'PLANNED', e)}
                  className="py-3 px-2 rounded-2xl bg-[#FFFFFF] dark:bg-white/5 border border-[#E5DFD3] dark:border-white/10 hover:border-[#0A0838] text-center transition-all hover:scale-105 hover:shadow-sm cursor-pointer group/kpi"
                  title="Click to view 7 planned roadmap SecOps use cases"
                >
                  <span className="text-xs font-medium text-[#4D4D4F] dark:text-slate-400 block mb-1">
                    Planned
                  </span>
                  <span className="text-2xl font-semibold text-[#4D4D4F] dark:text-slate-300 block">
                    {streamStats.sec.planned}
                  </span>
                </div>

              </div>
            </div>
          </div>

        </div>

      </div>

      {/* ========================================================================= */}
      {/* 3. LEVEL 2 MODAL: STATUS BREAKDOWN MODAL                                  */}
      {/* ========================================================================= */}
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
                  Automation Use Cases
                </span>
                <ChevronRight className="w-3.5 h-3.5" />
                <span className="text-[#0A0838] dark:text-white">
                  {activeStreamMeta.title}
                </span>
              </div>

              <button
                onClick={closeModal}
                className="w-8 h-8 rounded-full bg-slate-200/60 dark:bg-white/10 hover:bg-[#0A0838] hover:text-white dark:hover:bg-[#0A0838] flex items-center justify-center transition-colors"
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
                <h2 className="text-xl md:text-2xl font-heading font-extrabold tracking-tight">
                  {activeStreamMeta.title}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {activeStreamMeta.subtitle}
                </p>
              </div>
            </div>

            {/* Instructional Prompt */}
            <p className="text-xs font-medium text-slate-600 dark:text-slate-300">
              Select a status filter to inspect individual production use cases, runbook logic, and delivery roadmap:
            </p>

            {/* THREE INTERACTIVE KPI STATUS CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
              
              {/* CARD 1: IDENTIFIED (ALL) */}
              <div
                onClick={() => handleOpenStatusModal('ALL')}
                className="group p-4 rounded-2xl bg-[#F6F2EA] dark:bg-white/5 border border-[#E5DFD3] dark:border-white/10 hover:border-[#0A0838]/40 shadow-xs hover:shadow-md hover:scale-[1.01] transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-center gap-1.5 mb-1 text-center">
                    <Layers className="w-4 h-4 text-[#0A0838] dark:text-slate-300 group-hover:scale-110 transition-transform shrink-0" />
                    <span className="text-xs font-medium text-[#4D4D4F] dark:text-slate-300">
                      Total Use Cases
                    </span>
                  </div>
                  <div className="text-3xl font-semibold text-[#29251D] dark:text-white my-1 font-mono text-center">
                    {activeStreamMeta.stats.total}
                  </div>
                  <p className="text-xs text-[#4D4D4F] dark:text-slate-400 text-center">
                    All scoped automation use cases
                  </p>
                </div>
                <div className="mt-3.5 pt-2.5 border-t border-[#E5DFD3] dark:border-white/10 flex items-center justify-between text-xs font-medium text-[#0A0838] dark:text-slate-200 group-hover:text-[#0A0838] transition-colors">
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
                  <div className="flex items-center justify-center gap-1.5 mb-1 text-center">
                    <Zap className="w-4 h-4 text-[#2E5F13] dark:text-emerald-400 group-hover:scale-110 transition-transform shrink-0" />
                    <span className="text-xs font-medium text-[#2E5F13] dark:text-emerald-400">
                      Active
                    </span>
                  </div>
                  <div className="text-3xl font-semibold text-[#2E5F13] dark:text-emerald-400 my-1 font-mono text-center">
                    {activeStreamMeta.stats.active}
                  </div>
                  <p className="text-xs text-[#4D4D4F] dark:text-slate-400 text-center">
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
                  <div className="flex items-center justify-center gap-1.5 mb-1 text-center">
                    <Clock className="w-4 h-4 text-[#8D5C1A] dark:text-amber-400 group-hover:scale-110 transition-transform shrink-0" />
                    <span className="text-xs font-medium text-[#8D5C1A] dark:text-amber-400">
                      Planned
                    </span>
                  </div>
                  <div className="text-3xl font-semibold text-[#8D5C1A] dark:text-amber-400 my-1 font-mono text-center">
                    {activeStreamMeta.stats.planned}
                  </div>
                  <p className="text-xs text-[#4D4D4F] dark:text-slate-400 text-center">
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

      {/* ========================================================================= */}
      {/* 4. LEVEL 3 MODAL: INDIVIDUAL USE CASE DETAILS MODAL                       */}
      {/* ========================================================================= */}
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
                  Automation Use Cases
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
                  className="px-3 py-1.5 rounded-xl bg-slate-200/70 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/20 text-xs font-heading font-bold flex items-center gap-1.5 transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Back to Status
                </button>

                <button
                  onClick={closeModal}
                  className="w-8 h-8 rounded-full bg-slate-200/60 dark:bg-white/10 hover:bg-[#0A0838] hover:text-white dark:hover:bg-[#0A0838] flex items-center justify-center transition-colors"
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
                      className={`px-2 py-1 rounded-lg transition-all ${
                        selectedStreamSubFilter === 'ALL'
                          ? 'bg-emerald-600 text-white shadow-sm'
                          : 'text-slate-500 hover:text-[#29251D] dark:hover:text-white'
                      }`}
                    >
                      All Streams
                    </button>
                    <button
                      onClick={() => setSelectedStreamSubFilter('INFRA OPS')}
                      className={`px-2 py-1 rounded-lg transition-all ${
                        selectedStreamSubFilter === 'INFRA OPS'
                          ? 'bg-sky-600 text-white shadow-sm'
                          : 'text-sky-700 dark:text-sky-400 hover:text-sky-800'
                      }`}
                    >
                      InfraOps (16)
                    </button>
                    <button
                      onClick={() => setSelectedStreamSubFilter('SEC OPS')}
                      className={`px-2 py-1 rounded-lg transition-all ${
                        selectedStreamSubFilter === 'SEC OPS'
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
                    className={`px-2.5 py-1 rounded-lg transition-all ${
                      selectedStatus === 'ALL'
                        ? 'bg-white dark:bg-white/20 text-[#29251D] dark:text-white shadow-sm'
                        : 'text-slate-500 hover:text-[#29251D] dark:hover:text-white'
                    }`}
                  >
                    All ({activeStreamMeta.stats.total})
                  </button>
                  <button
                    onClick={() => setSelectedStatus('ACTIVE')}
                    className={`px-2.5 py-1 rounded-lg transition-all ${
                      selectedStatus === 'ACTIVE'
                        ? 'bg-[#2E5F13] text-white shadow-sm'
                        : 'text-[#2E5F13] dark:text-[#B4DFB1] hover:text-[#2E5F13]'
                    }`}
                  >
                    Active ({activeStreamMeta.stats.active})
                  </button>
                  <button
                    onClick={() => setSelectedStatus('PLANNED')}
                    className={`px-2.5 py-1 rounded-lg transition-all ${
                      selectedStatus === 'PLANNED'
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
                    className="pl-8 pr-3 py-1 text-xs rounded-xl bg-white dark:bg-white/5 border border-slate-300/60 dark:border-white/10 text-[#29251D] dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-[#0A0838] w-32 md:w-44"
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
                        className="group bg-white dark:bg-white/5 border border-[#E5DFD3] dark:border-white/10 hover:border-[#0A0838]/50 dark:hover:border-white/30 rounded-2xl p-4 shadow-sm hover:shadow-md hover:scale-[1.01] transition-all flex flex-col justify-between"
                      >
                        <div>
                          {/* Card Top: Stream Tag, Badges & ETA */}
                          <div className="flex items-center justify-between gap-2 mb-2.5">
                            <div className="flex items-center gap-1.5">
                              {/* Stream Indicator Tag */}
                              <span
                                className={`px-2 py-0.5 rounded-md text-[9.5px] font-semibold ${
                                  isInfra
                                    ? 'bg-[#0A0838]/10 dark:bg-white/10 border border-[#0A0838]/20 dark:border-white/20 text-[#0A0838] dark:text-slate-200'
                                    : 'bg-[#4D4D4F]/10 dark:bg-white/10 border border-[#4D4D4F]/20 dark:border-white/20 text-[#4D4D4F] dark:text-slate-200'
                                }`}
                              >
                                {isInfra ? 'InfraOps' : 'SecOps'}
                              </span>

                              {/* Status Badge */}
                              <span
                                className={`px-2 py-0.5 rounded-md text-[9px] font-mono font-bold uppercase tracking-wider flex items-center gap-1 ${
                                  isActive
                                    ? 'bg-[#0A0838]/10 text-[#0A0838] dark:bg-white/10 dark:text-white border border-[#0A0838]/20'
                                    : 'bg-[#4D4D4F]/10 text-[#4D4D4F] dark:bg-white/10 dark:text-slate-300 border border-[#E5DFD3]'
                                }`}
                              >
                                {isActive ? (
                                  <>
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#0A0838] dark:bg-white animate-pulse" />
                                    LIVE / ACTIVE
                                  </>
                                ) : (
                                  <>
                                    <Clock className="w-3 h-3 text-[#4D4D4F] dark:text-slate-400" />
                                    PLANNED
                                  </>
                                )}
                              </span>
                            </div>

                            {uc.targetDate && (
                              <span className="px-2 py-0.5 rounded-md text-[9px] font-mono font-bold bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/10">
                                {uc.targetDate}
                              </span>
                            )}
                          </div>

                          {/* Card Middle: Index & Name */}
                          <div className="flex items-start gap-2.5 mb-2">
                            <span className="text-xs font-mono font-extrabold text-[#0A0838] dark:text-white shrink-0 pt-0.5">
                              {displayNum}
                            </span>
                            <div>
                              <h4 className="font-heading font-bold text-sm text-[#29251D] dark:text-white leading-snug group-hover:text-[#0284C7] dark:group-hover:text-sky-400 transition-colors">
                                {uc.category}
                              </h4>
                              {uc.name !== uc.category && (
                                <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block mt-0.5">
                                  {uc.name}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Card Bottom: Detail components */}
                          <p className="text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-white/5 p-2.5 rounded-xl border border-slate-100 dark:border-white/5 leading-relaxed">
                            {uc.detail}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Modal Bottom Action Bar */}
            <div className="pt-2 border-t border-[#E5DFD3] dark:border-white/10 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 shrink-0">
              <span className="font-mono text-[10px]">
                Showing {filteredUseCases.length} of {activeStreamMeta.stats.total} total {activeStreamMeta.title} use cases
              </span>
              <button
                onClick={closeModal}
                className="px-5 py-2 rounded-xl bg-[#0A0838] hover:bg-[#0A0838]/90 text-white !text-white font-heading font-bold text-xs transition-all cursor-pointer shadow-xs"
                style={{ color: '#ffffff' }}
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

export default AutomationPipeline;
