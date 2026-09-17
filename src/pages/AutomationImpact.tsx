import React, { useState, useEffect } from 'react';
import { useLiveData } from '../hooks/useLiveData';
import { LiveDataBadge } from '../components/LiveDataBadge';
import { defaultAutomationUseCases } from '../data/automationData';
import { EXCEL_AUTOMATION_MONTHLY } from '../data/excelDataSource';
import {
  Zap,
  Workflow,
  FileCheck,
  Bot,
  Sparkles,
  Layers,
  Target,
  Clock,
  TrendingUp,
  Cpu,
  CheckCircle2,
  Activity,
  BarChart3,
  Flame,
  ArrowRight,
  ArrowDown,
  Inbox,
  GitBranch,
  Headphones,
  Wrench,
  ShieldCheck,
  Check,
  Info,
  X,
  UserCheck,
  ExternalLink,
  ChevronRight,
  Shield
} from 'lucide-react';

interface AutomationImpactProps {
  onNavigateToNext?: () => void;
  onNavigateToPrev?: () => void;
}

export const AutomationImpact: React.FC<AutomationImpactProps> = ({
  onNavigateToNext,
  onNavigateToPrev
}) => {
  const { data: liveData, isLoading, isRefreshing, error, lastUpdatedDisplay, dataSource, refresh } = useLiveData();

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

  // Visual View Mode: 'flow' (Animated Flow Pipeline) vs 'trajectory' (Spline & Volume Wave)
  const [visualMode, setVisualMode] = useState<'flow' | 'trajectory'>('flow');
  const [selectedMonthIdx, setSelectedMonthIdx] = useState<number | null>(null);
  const [hoveredMonthIdx, setHoveredMonthIdx] = useState<number | null>(null);
  const [hoveredBranch, setHoveredBranch] = useState<'zero-touch' | 'techhub' | 'routing' | null>(null);
  const [activeModal, setActiveModal] = useState<'zero-touch' | 'techhub' | 'smart-routing' | null>(null);

  // Active data based on selection
  const activeMonthData = selectedMonthIdx !== null ? monthlyTrends[selectedMonthIdx] : null;
  const currentTotalSRs = activeMonthData ? activeMonthData.totalSRs : (heroKPIs.srsProcessedByTechHub + heroKPIs.srsProcessedByAutomation);
  const currentAutoSRs = activeMonthData ? activeMonthData.automationSRs : heroKPIs.srsProcessedByAutomation;
  const currentTechHubSRs = activeMonthData ? activeMonthData.techHubSRs : heroKPIs.srsProcessedByTechHub;
  const currentAutoPct = activeMonthData ? activeMonthData.automationPct : heroKPIs.automationAchievedPct;

  // Target Accelerator Constants
  const targetPct = 30.0;
  const currentGap = Math.max(0, targetPct - currentAutoPct);

  // Animation staging & number counters
  const [flowStage, setFlowStage] = useState<number>(0);
  const [animatedTotalSR, setAnimatedTotalSR] = useState<number>(0);
  const [animatedAutoSR, setAnimatedAutoSR] = useState<number>(0);
  const [animatedTechHubSR, setAnimatedTechHubSR] = useState<number>(0);
  const [animatedAutoPct, setAnimatedAutoPct] = useState<number>(0);
  const [animatedHours, setAnimatedHours] = useState<number>(0);

  const startFlowSequence = () => {
    setFlowStage(0);
    setAnimatedTotalSR(0);
    setAnimatedAutoSR(0);
    setAnimatedTechHubSR(0);
    setAnimatedAutoPct(0);
    setAnimatedHours(0);

    const timers: ReturnType<typeof setTimeout>[] = [];
    timers.push(setTimeout(() => setFlowStage(1), 50));
    timers.push(setTimeout(() => setFlowStage(2), 200));
    timers.push(setTimeout(() => setFlowStage(3), 400));
    timers.push(setTimeout(() => setFlowStage(4), 800));
    timers.push(setTimeout(() => setFlowStage(5), 1200));
    timers.push(setTimeout(() => setFlowStage(6), 1600));
    timers.push(setTimeout(() => setFlowStage(7), 2000));
    timers.push(setTimeout(() => setFlowStage(8), 2400));

    return timers;
  };

  useEffect(() => {
    const timers = startFlowSequence();
    return () => timers.forEach(clearTimeout);
  }, [selectedMonthIdx, visualMode]);

  // Count up numbers during sequence
  useEffect(() => {
    if (flowStage >= 3) {
      const duration = 700;
      const startTime = performance.now();
      const frame = (time: number) => {
        const progress = Math.min(1, (time - startTime) / duration);
        const ease = 1 - Math.pow(1 - progress, 3);
        setAnimatedTotalSR(Math.round(ease * currentTotalSRs));
        if (progress < 1) requestAnimationFrame(frame);
      };
      requestAnimationFrame(frame);
    }
  }, [flowStage, currentTotalSRs]);

  useEffect(() => {
    if (flowStage >= 6) {
      const duration = 800;
      const startTime = performance.now();
      const frame = (time: number) => {
        const progress = Math.min(1, (time - startTime) / duration);
        const ease = 1 - Math.pow(1 - progress, 3);
        setAnimatedAutoSR(Math.round(ease * currentAutoSRs));
        setAnimatedTechHubSR(Math.round(ease * currentTechHubSRs));
        setAnimatedAutoPct(Number((ease * currentAutoPct).toFixed(1)));
        setAnimatedHours(Math.round(ease * 2200));
        if (progress < 1) requestAnimationFrame(frame);
      };
      requestAnimationFrame(frame);
    }
  }, [flowStage, currentAutoSRs, currentTechHubSRs, currentAutoPct]);

  // SVG Spline Coordinates for Trajectory View
  const svgWidth = 560;
  const svgHeight = 160;
  const padX = 50;
  const padTop = 30;
  const padBottom = 30;
  const graphWidth = svgWidth - padX * 2;
  const graphHeight = svgHeight - padTop - padBottom;
  const minPct = 12;
  const maxPct = 22;

  const getSplineX = (idx: number) => padX + (idx / (monthlyTrends.length - 1)) * graphWidth;
  const getSplineY = (pct: number) => svgHeight - padBottom - ((pct - minPct) / (maxPct - minPct)) * graphHeight;

  const splinePoints = monthlyTrends.map((m, idx) => ({
    x: getSplineX(idx),
    y: getSplineY(m.automationPct),
    data: m
  }));

  let splinePath = '';
  if (splinePoints.length > 0) {
    splinePath = `M ${splinePoints[0].x} ${splinePoints[0].y}`;
    for (let i = 0; i < splinePoints.length - 1; i++) {
      const p0 = splinePoints[i];
      const p1 = splinePoints[i + 1];
      const cx1 = p0.x + (p1.x - p0.x) * 0.5;
      const cy1 = p0.y;
      const cx2 = p0.x + (p1.x - p0.x) * 0.5;
      const cy2 = p1.y;
      splinePath += ` C ${cx1} ${cy1}, ${cx2} ${cy2}, ${p1.x} ${p1.y}`;
    }
  }

  const areaSplinePath = splinePoints.length > 0
    ? `${splinePath} L ${splinePoints[splinePoints.length - 1].x} ${svgHeight - padBottom} L ${splinePoints[0].x} ${svgHeight - padBottom} Z`
    : '';

  return (
    <div className={`h-full w-full flex flex-col p-4 md:p-6 lg:p-7 gap-3 relative overflow-hidden bg-[#FFFFFF] dark:bg-[#0A0838] text-[#29251D] dark:text-white transition-opacity duration-700 select-none ${isLoading ? 'opacity-70' : 'opacity-100'}`}>

      {/* 1. TOP HEADER */}
      <div className={`shrink-0 transition-all duration-700 ${flowStage >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-3'}`}>
        <div className="flex items-start justify-between gap-4 pb-2 border-b border-[#E5DFD3] dark:border-white/10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-[#0066B2] dark:bg-sky-400 animate-pulse" />
              <span className="text-xs font-medium text-[#0066B2] dark:text-sky-400">
                06 • Value Realization
              </span>
            </div>
            <h1 className="text-2xl font-semibold tracking-tight text-[#29251D] dark:text-white">
              Automation Impact &amp; Service Request Offloading
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

      {/* 2. TOP ROW: 4 HERO IMPACT KPI CARDS */}
      <div className={`shrink-0 grid grid-cols-2 lg:grid-cols-4 gap-2.5 transition-all duration-700 ${flowStage >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'}`}>

        {/* Card 1: Tickets Automated */}
        <div className="p-3 rounded-xl bg-[#F6F2EA] dark:bg-white/5 border border-[#E5DFD3] dark:border-white/10 shadow-xs flex flex-col justify-between group hover:border-[#0A0838]/40 transition-all">
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded-md bg-[#0A0838]/10 text-[#0A0838] dark:text-white flex items-center justify-center">
              <Bot className="w-3 h-3" />
            </div>
            <span className="text-sm font-medium text-[#4D4D4F] dark:text-slate-300">
              Tickets Automated
            </span>
          </div>
          <div className="mt-2">
            <span className="text-2xl font-semibold text-[#29251D] dark:text-white tracking-tight">
              {heroKPIs.ticketsAutomated.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Card 2: Automation Achieved */}
        <div className="p-3 rounded-xl bg-[#F6F2EA] dark:bg-white/5 border border-[#E5DFD3] dark:border-white/10 shadow-xs flex flex-col justify-between group hover:border-[#0A0838]/40 transition-all">
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded-md bg-[#0A0838]/10 text-[#0A0838] dark:text-white flex items-center justify-center">
              <Zap className="w-3 h-3" />
            </div>
            <span className="text-sm font-medium text-[#4D4D4F] dark:text-slate-300">
              Automation Achieved
            </span>
          </div>
          <div className="mt-2">
            <span className="text-2xl font-semibold text-[#29251D] dark:text-white tracking-tight">
              {heroKPIs.automationAchievedPct.toFixed(1)}%
            </span>
          </div>
        </div>

        {/* Card 3: Use Cases Live */}
        <div className="p-3 rounded-xl bg-[#F6F2EA] dark:bg-white/5 border border-[#E5DFD3] dark:border-white/10 shadow-xs flex flex-col justify-between group hover:border-[#0A0838]/40 transition-all">
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded-md bg-[#0A0838]/10 text-[#0A0838] dark:text-white flex items-center justify-center">
              <Workflow className="w-3 h-3" />
            </div>
            <span className="text-sm font-medium text-[#4D4D4F] dark:text-slate-300">
              Use Cases Live
            </span>
          </div>
          <div className="mt-2">
            <span className="text-2xl font-semibold text-[#29251D] dark:text-white tracking-tight">
              {heroKPIs.useCasesLive}
            </span>
          </div>
        </div>

        {/* Card 4: Overall SOPs Automated */}
        <div className="p-3 rounded-xl bg-[#F6F2EA] dark:bg-white/5 border border-[#E5DFD3] dark:border-white/10 shadow-xs flex flex-col justify-between group hover:border-[#0A0838]/40 transition-all">
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded-md bg-[#0A0838]/10 text-[#0A0838] dark:text-white flex items-center justify-center">
              <FileCheck className="w-3 h-3" />
            </div>
            <span className="text-sm font-medium text-[#4D4D4F] dark:text-slate-300">
              SOPs Automated
            </span>
          </div>
          <div className="mt-2">
            <span className="text-2xl font-semibold text-[#29251D] dark:text-white tracking-tight">
              {heroKPIs.overallSOPsAutomated}
            </span>
          </div>
        </div>

      </div>

      {/* 3. PRIMARY STORYTELLING SECTION: DUAL INTERACTIVE VISUALS */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-3.5 items-stretch min-h-0">

        {/* LEFT PRIMARY STORYTELLING VISUAL (8 cols) */}
        <div className="lg:col-span-8 p-4 rounded-2xl bg-[#F6F2EA] dark:bg-white/5 border border-[#E5DFD3] dark:border-white/10 shadow-sm flex flex-col justify-between relative overflow-hidden">
          
          {/* Visual Header & Mode Switches */}
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#E5DFD3] dark:border-white/10">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#0A0838]/10 text-[#0A0838] dark:text-white flex items-center justify-center shadow-inner">
                {visualMode === 'flow' ? <Cpu className="w-3.5 h-3.5" /> : <TrendingUp className="w-3.5 h-3.5" />}
              </div>
              <div>
                <h2 className="text-sm font-semibold text-[#29251D] dark:text-white">
                  {visualMode === 'flow' ? 'Automation Offloading Flow' : 'Monthly Deflection & Volume Trajectory'}
                </h2>
              </div>
            </div>

            {/* Visualizer Mode Toggle */}
            <div className="flex items-center gap-1.5">
              <div className="flex items-center gap-1 bg-[#FFFFFF] dark:bg-white/10 p-0.5 rounded-lg text-xs font-medium border border-[#E5DFD3] dark:border-white/10">
                <button
                  onClick={() => setVisualMode('flow')}
                  className={`px-2.5 py-0.5 rounded-md transition-all flex items-center gap-1 cursor-pointer ${
                    visualMode === 'flow'
                      ? 'bg-[#0A0838] text-white shadow-xs font-semibold'
                      : 'text-[#4D4D4F] hover:text-[#29251D] dark:hover:text-white'
                  }`}
                >
                  <Workflow className="w-3 h-3 text-[#F8B4A3]" />
                  Flow Pipeline
                </button>
                <button
                  onClick={() => setVisualMode('trajectory')}
                  className={`px-2.5 py-0.5 rounded-md transition-all flex items-center gap-1 cursor-pointer ${
                    visualMode === 'trajectory'
                      ? 'bg-[#0A0838] text-white shadow-xs font-semibold'
                      : 'text-[#4D4D4F] hover:text-[#29251D] dark:hover:text-white'
                  }`}
                >
                  <BarChart3 className="w-3 h-3 text-[#F8B4A3]" />
                  Monthly Trajectory
                </button>
              </div>
            </div>
          </div>

          {/* MODE 1: ANIMATED ENTERPRISE AUTOMATION OFFLOADING FLOWCHART */}
          {visualMode === 'flow' && (
            <div className="relative flex-1 flex flex-col justify-between py-0.5 min-h-[260px] gap-1.5">
              
              {/* STEP 01: INGESTION & DEMAND INTAKE */}
              <div className="p-2.5 rounded-xl bg-[#FFFFFF] dark:bg-white/10 border border-[#E5DFD3] dark:border-white/10 shadow-xs flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#0A0838]/10 text-[#0A0838] dark:text-white flex items-center justify-center shrink-0">
                    <Inbox className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="px-1.5 py-0.2 rounded bg-[#0A0838]/10 text-[10px] font-medium text-[#0A0838] dark:text-white">
                        Step 01 • Intake
                      </span>
                      <span className="text-xs font-semibold text-[#29251D] dark:text-white">
                        Inbound Service Demand
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-lg font-semibold text-[#29251D] dark:text-white">
                        {animatedTotalSR.toLocaleString()}
                      </span>
                      <span className="text-xs text-[#4D4D4F] dark:text-slate-400 font-normal">
                        Total Requests (100% Volume)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Intake Channels breakdown */}
                <div className="hidden sm:flex items-center gap-1 text-xs">
                  <span className="px-2 py-0.5 rounded bg-[#F6F2EA] dark:bg-white/10 border border-[#E5DFD3] dark:border-white/10 text-[#4D4D4F] dark:text-slate-300">
                    Tickets: 3,613
                  </span>
                  <span className="px-2 py-0.5 rounded bg-[#F6F2EA] dark:bg-white/10 border border-[#E5DFD3] dark:border-white/10 text-[#4D4D4F] dark:text-slate-300">
                    Emails: 3,084
                  </span>
                  <span className="px-2 py-0.5 rounded bg-[#F6F2EA] dark:bg-white/10 border border-[#E5DFD3] dark:border-white/10 text-[#4D4D4F] dark:text-slate-300">
                    Voice: 1,265
                  </span>
                  <span className="px-2 py-0.5 rounded bg-[#F6F2EA] dark:bg-white/10 border border-[#E5DFD3] dark:border-white/10 text-[#4D4D4F] dark:text-slate-300">
                    Alerts: 49
                  </span>
                </div>
              </div>

              {/* FLOW CONNECTOR 1 (↓) */}
              <div className="flex items-center justify-center h-3 relative">
                <div className="w-0.5 h-full bg-[#0A0838]/30 dark:bg-white/20"></div>
                <ArrowDown className="w-2.5 h-2.5 text-[#0A0838] dark:text-white absolute top-0" />
              </div>

              {/* STEP 02: DECISION GATEWAY & SMART TRIAGE */}
              <div 
                onClick={() => setActiveModal('smart-routing')}
                className="w-full p-2.5 rounded-xl bg-[#FFFFFF] dark:bg-white/10 border border-[#E5DFD3] dark:border-white/10 shadow-xs flex items-center justify-between cursor-pointer group hover:border-[#0A0838] transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#0A0838]/10 text-[#0A0838] dark:text-white flex items-center justify-center shrink-0">
                    <GitBranch className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-1.5 py-0.2 rounded bg-[#0A0838]/10 text-[10px] font-medium text-[#0A0838] dark:text-white">
                        Step 02 • Decision Gateway
                      </span>
                      <span className="text-xs font-semibold text-[#29251D] dark:text-white">
                        Smart Routing &amp; Triage Layer
                      </span>
                    </div>
                    <span className="text-xs text-[#4D4D4F] dark:text-slate-300 block mt-0.5">
                      Evaluates Inbound Demand vs 56 Production Automated Use Cases
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-xs font-medium text-[#0A0838] dark:text-white group-hover:translate-x-0.5 transition-transform shrink-0">
                  <span>View Routing</span>
                  <ChevronRight className="w-3 h-3" />
                </div>
              </div>

              {/* SPLIT JUNCTION */}
              <div className="relative h-6 w-full flex items-center justify-between px-6">
                <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 500 24" preserveAspectRatio="none">
                  {/* Stem */}
                  <line x1="250" y1="0" x2="250" y2="6" stroke="#0A0838" strokeWidth="2" strokeLinecap="round" />
                  {/* Left Branch ↙ */}
                  <path d="M 250 6 C 250 14, 125 8, 125 24" fill="none" stroke="#0A0838" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
                  {/* Right Branch ↘ */}
                  <path d="M 250 6 C 250 14, 375 8, 375 24" fill="none" stroke="#0A0838" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
                </svg>
                
                {/* Left Condition Pill */}
                <div className="z-10 px-2.5 py-0.5 rounded-full bg-[#0A0838]/10 border border-[#0A0838]/20 text-xs font-medium text-[#0A0838] dark:text-white shadow-xs flex items-center gap-1">
                  <span>↙</span>
                  <span>Automation Offload (16.7%)</span>
                </div>

                {/* Right Condition Pill */}
                <div className="z-10 px-2.5 py-0.5 rounded-full bg-[#E1EAF6] border border-[#BDD4F5] text-xs font-medium text-[#3A59A4] shadow-xs flex items-center gap-1">
                  <span>TechHub Volume (83.3%)</span>
                  <span>↘</span>
                </div>
              </div>

              {/* STEP 03: DUAL PROCESS EXECUTION TRACKS */}
              <div className="grid grid-cols-2 gap-3">
                
                {/* TRACK A: ZERO-TOUCH AUTOMATION (16.7%) */}
                <div
                  onClick={() => setActiveModal('zero-touch')}
                  className="p-2.5 rounded-xl bg-[#FFFFFF] dark:bg-white/10 border border-[#E5DFD3] dark:border-white/10 shadow-xs flex flex-col justify-between cursor-pointer group hover:border-[#0A0838] transition-all"
                >
                  <div className="flex items-start justify-between pb-1.5 border-b border-[#E5DFD3] dark:border-white/10">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-md bg-[#0A0838] text-white flex items-center justify-center shadow-xs">
                        <Bot className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <span className="text-[10px] font-medium text-[#4D4D4F] dark:text-slate-400 block leading-none">
                          Step 03a • Automation
                        </span>
                        <span className="text-xs font-semibold text-[#29251D] dark:text-white">
                          Zero-Touch Automation
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-semibold text-[#29251D] dark:text-white block leading-tight">
                        {animatedAutoSR.toLocaleString()}
                      </span>
                      <span className="px-1.5 py-0.2 rounded-full bg-[#0A0838]/10 text-[#0A0838] dark:text-slate-200 text-[10px] font-medium">
                        16.7%
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1 my-1.5">
                    <div className="p-1 rounded bg-[#F6F2EA] dark:bg-white/5 border border-[#E5DFD3] dark:border-white/10 flex items-center justify-between text-xs">
                      <span className="text-[#4D4D4F] dark:text-slate-400">Automated Orders Placed:</span>
                      <span className="font-medium text-[#29251D] dark:text-white">4,470</span>
                    </div>
                    <div className="p-1 rounded bg-[#F6F2EA] dark:bg-white/5 border border-[#E5DFD3] dark:border-white/10 flex items-center justify-between text-xs">
                      <span className="text-[#4D4D4F] dark:text-slate-400">Standardized Runbooks:</span>
                      <span className="font-medium text-[#29251D] dark:text-white">31 SOPs</span>
                    </div>
                    <div className="p-1 rounded bg-[#0A0838]/5 border border-[#0A0838]/15 flex items-center justify-between text-xs font-medium text-[#0A0838] dark:text-slate-200">
                      <div className="flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-[#0A0838] dark:text-slate-200 shrink-0" />
                        <span>Auto-Closed</span>
                      </div>
                      <span className="text-xs text-[#0A0838] dark:text-slate-200">20.0% offload</span>
                    </div>
                  </div>

                  <div className="pt-1 border-t border-[#E5DFD3] dark:border-white/10 flex items-center justify-between text-xs text-[#0A0838] dark:text-white font-medium">
                    <span>View Use Cases</span>
                    <ChevronRight className="w-2.5 h-2.5 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>

                {/* TRACK B: TECHHUB ASSISTED / MANUAL (83.3%) */}
                <div
                  onClick={() => setActiveModal('techhub')}
                  className="p-2.5 rounded-xl bg-[#FFFFFF] dark:bg-white/10 border border-[#E5DFD3] dark:border-white/10 shadow-xs flex flex-col justify-between cursor-pointer group hover:border-[#0A0838] transition-all"
                >
                  <div className="flex items-start justify-between pb-1.5 border-b border-[#E5DFD3] dark:border-white/10">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-md bg-[#0A0838] text-white flex items-center justify-center shadow-xs">
                        <Headphones className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <span className="text-[10px] font-medium text-[#4D4D4F] dark:text-slate-400 block leading-none">
                          Step 03b • TechHub
                        </span>
                        <span className="text-xs font-semibold text-[#29251D] dark:text-white">
                          TechHub Service Desk
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-semibold text-[#29251D] dark:text-white block leading-tight">
                        {animatedTechHubSR.toLocaleString()}
                      </span>
                      <span className="px-1.5 py-0.2 rounded-full bg-[#E1EAF6] text-[#3A59A4] text-[10px] font-medium border border-[#BDD4F5]">
                        83.3%
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1 my-1.5">
                    <div className="p-1 rounded bg-[#F6F2EA] dark:bg-white/5 border border-[#E5DFD3] dark:border-white/10 flex items-center justify-between text-xs">
                      <span className="text-[#4D4D4F] dark:text-slate-400">Service Requests Closed:</span>
                      <span className="font-medium text-[#29251D] dark:text-white">22,319</span>
                    </div>
                    <div className="p-1 rounded bg-[#F6F2EA] dark:bg-white/5 border border-[#E5DFD3] dark:border-white/10 flex items-center justify-between text-xs">
                      <span className="text-[#4D4D4F] dark:text-slate-400">Delivery Channel:</span>
                      <span className="font-medium text-[#29251D] dark:text-white">Manual / assisted</span>
                    </div>
                    <div className="p-1 rounded bg-[#E1EAF6] border border-[#BDD4F5] flex items-center justify-between text-xs font-medium text-[#3A59A4]">
                      <div className="flex items-center gap-1">
                        <Check className="w-3 h-3 text-[#3A59A4] shrink-0" />
                        <span>TechHub Closed</span>
                      </div>
                      <span className="text-xs text-[#3A59A4]">83.3% share</span>
                    </div>
                  </div>

                  <div className="pt-1 border-t border-[#E5DFD3] dark:border-white/10 flex items-center justify-between text-xs text-[#0A0838] dark:text-white font-medium">
                    <span>View Volumes</span>
                    <ChevronRight className="w-2.5 h-2.5 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>

              </div>

              {/* Bottom Summary Bar */}
              <div className="pt-1 border-t border-[#E5DFD3] dark:border-white/10 flex items-center justify-between text-xs bg-[#FFFFFF] dark:bg-white/10 px-2.5 py-1 rounded-lg">
                <div className="flex items-center gap-1.5 text-[#4D4D4F] dark:text-slate-300 font-medium">
                  <span className="text-[#29251D] dark:text-white font-semibold">{animatedTotalSR.toLocaleString()} Total</span>
                  <span className="text-[#4D4D4F]/40">➔</span>
                  <span className="text-[#0A0838] dark:text-white font-semibold">{animatedAutoSR.toLocaleString()} Auto (16.7%)</span>
                  <span className="text-[#4D4D4F]/40">+</span>
                  <span className="text-[#3A59A4] font-semibold">{animatedTechHubSR.toLocaleString()} TechHub (83.3%)</span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-[#0A0838]/10 text-xs font-medium text-[#0A0838] dark:text-slate-200">
                  Offload: 16.7%
                </span>
              </div>

            </div>
          )}

          {/* MODE 2: ANIMATED MONTHLY TRAJECTORY & DEFLECTION SPLINE */}
          {visualMode === 'trajectory' && (
            <div className="relative flex-1 flex flex-col justify-between py-1 min-h-[220px]">
              
              {/* Legend & Summary */}
              <div className="flex items-center justify-between px-2 text-xs">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1.5 text-[#4D4D4F] dark:text-slate-300 font-medium">
                    <span className="w-2.5 h-2.5 rounded bg-[#0A0838]" /> TechHub volume
                  </span>
                  <span className="flex items-center gap-1.5 text-[#2E5F13] font-medium">
                    <span className="w-2.5 h-2.5 rounded bg-[#F8B4A3]" /> Automation volume
                  </span>
                  <span className="flex items-center gap-1.5 text-[#E31837] font-medium">
                    <span className="w-3 h-0.5 bg-[#E31837]" /> Offload % curve
                  </span>
                </div>
                <span className="text-[#2E5F13] font-medium">~16.7% 4-month average deflection</span>
              </div>

              {/* Main SVG Dual-Axis Chart Canvas */}
              <div className="relative w-full h-[150px] my-1">
                <svg className="w-full h-full overflow-visible" viewBox={`0 0 ${svgWidth} ${svgHeight}`}>
                  <defs>
                    <linearGradient id="offload-area-grad" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#E31837" stopOpacity="0.12" />
                      <stop offset="100%" stopColor="#E31837" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Reference Gridlines */}
                  {[15, 20].map(val => (
                    <g key={val}>
                      <line
                        x1={padX - 10}
                        y1={getSplineY(val)}
                        x2={svgWidth - padX + 10}
                        y2={getSplineY(val)}
                        stroke="#E5DFD3"
                        strokeDasharray="3 3"
                      />
                      <text
                        x={padX - 15}
                        y={getSplineY(val) + 3}
                        fontSize="10"
                        fill="#4D4D4F"
                        fontFamily="Inter"
                        textAnchor="end"
                      >
                        {val}%
                      </text>
                    </g>
                  ))}

                  {/* Stacked Columns Behind */}
                  {monthlyTrends.map((m, idx) => {
                    const colX = getSplineX(idx) - 22;
                    const maxH = 80;
                    const totalH = (m.totalSRs / 8000) * maxH;
                    const autoH = (m.automationSRs / m.totalSRs) * totalH;
                    const techH = totalH - autoH;
                    const baseY = svgHeight - padBottom;
                    const isHovered = hoveredMonthIdx === idx;

                    return (
                      <g
                        key={m.monthKey}
                        className="cursor-pointer transition-all"
                        onMouseEnter={() => setHoveredMonthIdx(idx)}
                        onMouseLeave={() => setHoveredMonthIdx(null)}
                      >
                        {/* TechHub Stack */}
                        <rect
                          x={colX}
                          y={baseY - totalH}
                          width={44}
                          height={techH}
                          rx={4}
                          fill="#0A0838"
                          opacity={isHovered ? 0.9 : 0.75}
                          className="transition-all duration-300"
                        />
                        {/* Auto Stack */}
                        <rect
                          x={colX}
                          y={baseY - autoH}
                          width={44}
                          height={autoH}
                          rx={4}
                          fill="#F8B4A3"
                          opacity={isHovered ? 1 : 0.9}
                          className="transition-all duration-300"
                        />
                        {/* Month Label */}
                        <text
                          x={getSplineX(idx)}
                          y={svgHeight - 12}
                          fontSize="11"
                          fontWeight={isHovered ? '600' : '400'}
                          fill={isHovered ? '#E31837' : '#4D4D4F'}
                          fontFamily="Inter"
                          textAnchor="middle"
                        >
                          {m.monthLabel.split(' ')[0]}
                        </text>
                      </g>
                    );
                  })}

                  {/* Area Gradient */}
                  {areaSplinePath && (
                    <path d={areaSplinePath} fill="url(#offload-area-grad)" />
                  )}

                  {/* Glowing Spline Curve */}
                  {splinePath && (
                    <path
                      d={splinePath}
                      fill="none"
                      stroke="#E31837"
                      strokeWidth="3"
                      strokeLinecap="round"
                      className="transition-all duration-700"
                    />
                  )}

                  {/* Spline Nodes */}
                  {splinePoints.map((pt, idx) => {
                    const isHovered = hoveredMonthIdx === idx;
                    return (
                      <g
                        key={idx}
                        className="cursor-pointer"
                        onMouseEnter={() => setHoveredMonthIdx(idx)}
                        onMouseLeave={() => setHoveredMonthIdx(null)}
                      >
                        {/* Value Badge */}
                        <g transform={`translate(${pt.x - 26}, ${pt.y - 24})`}>
                          <rect
                            width={52}
                            height={18}
                            rx={5}
                            fill={isHovered ? '#E31837' : '#FFFFFF'}
                            stroke={isHovered ? '#E31837' : '#E5DFD3'}
                            strokeWidth={1.5}
                            filter="drop-shadow(0 2px 4px rgba(0,0,0,0.06))"
                          />
                          <text
                            x={26}
                            y={13}
                            fontSize="10"
                            fontWeight="500"
                            fill={isHovered ? '#FFFFFF' : '#E31837'}
                            fontFamily="Inter"
                            textAnchor="middle"
                          >
                            {pt.data.automationPct}%
                          </text>
                        </g>
                        <circle
                          cx={pt.x}
                          cy={pt.y}
                          r={isHovered ? 6 : 4.5}
                          fill="#E31837"
                          stroke="#FFFFFF"
                          strokeWidth={2}
                          className="transition-all duration-200"
                        />
                      </g>
                    );
                  })}
                </svg>
              </div>

              {/* Monthly Breakdown Strip */}
              <div className="grid grid-cols-4 gap-2 pt-1 border-t border-[#E5DFD3] dark:border-white/10">
                {monthlyTrends.map((m, idx) => (
                  <div
                    key={m.monthKey}
                    onMouseEnter={() => setHoveredMonthIdx(idx)}
                    onMouseLeave={() => setHoveredMonthIdx(null)}
                    className={`p-1.5 rounded-lg border text-center transition-all ${
                      hoveredMonthIdx === idx
                        ? 'bg-[#FFFFFF] dark:bg-white/10 border-[#0A0838] shadow-xs'
                        : 'bg-[#FFFFFF] dark:bg-white/5 border-[#E5DFD3] dark:border-white/10'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs mb-0.5">
                      <span className="text-[#4D4D4F] font-medium">{m.monthLabel.split(' ')[0]}</span>
                      <span className="text-[#E31837] font-semibold">{m.automationPct}%</span>
                    </div>
                    <div className="text-xs text-[#29251D] dark:text-white font-medium">
                      <span className="text-[#0A0838]">{m.techHubSRs.toLocaleString()}</span> / <span className="text-[#E31837]">{m.automationSRs.toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}
        </div>

        {/* RIGHT VISUAL: "AUTOMATION TARGET ACCELERATOR" (4 cols) */}
        <div className="lg:col-span-4 p-4 rounded-2xl bg-[#F6F2EA] dark:bg-white/5 border border-[#E5DFD3] dark:border-white/10 shadow-sm flex flex-col justify-between">
          
          {/* Header */}
          <div>
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#E5DFD3] dark:border-white/10">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-[#0A0838] dark:text-white" />
                <h3 className="text-sm font-semibold text-[#29251D] dark:text-white">
                  Target Accelerator
                </h3>
              </div>
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-[#0A0838]/10 text-[#0A0838] dark:text-slate-200">
                30% Target
              </span>
            </div>

            {/* Current vs Target Gauge Visual */}
            <div className="my-2 p-3 rounded-xl bg-[#FFFFFF] dark:bg-white/10 border border-[#E5DFD3] dark:border-white/10">
              
              {/* Top Rate Comparison */}
              <div className="flex items-center justify-between mb-2">
                <div>
                  <span className="text-xs text-[#4D4D4F] block font-medium">
                    Current Offload
                  </span>
                  <span className="text-2xl font-semibold text-[#0A0838] dark:text-white">
                    {animatedAutoPct.toFixed(1)}%
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-[#4D4D4F] block font-medium">
                    Annual Milestone
                  </span>
                  <span className="text-2xl font-semibold text-[#29251D] dark:text-white">
                    30.0%
                  </span>
                </div>
              </div>

              {/* Progress Accelerator Bar Track */}
              <div className="relative w-full h-3 rounded-full bg-[#E5DFD3] dark:bg-white/10 overflow-hidden mb-1.5 shadow-inner">
                {/* Current Achieved Arc */}
                <div
                  style={{ width: `${Math.min(100, (animatedAutoPct / targetPct) * 100)}%` }}
                  className="h-full bg-[#0A0838] rounded-full transition-all duration-1000"
                />
                {/* Target Marker Pin */}
                <div className="absolute top-0 bottom-0 right-0 w-1 bg-[#0A0838]" />
              </div>

              {/* Gap Breakdown Bar */}
              <div className="flex items-center justify-between text-xs font-medium">
                <span className="text-[#0A0838] dark:text-slate-200">
                  ✓ {animatedAutoSR.toLocaleString()} Automated
                </span>
                <span className="text-[#4D4D4F] dark:text-slate-400">
                  Gap: ~{currentGap.toFixed(1)}% ({((targetPct - currentAutoPct) / targetPct * 100).toFixed(0)}% to Goal)
                </span>
              </div>
            </div>

            {/* Structured Metric Blocks */}
            <div className="space-y-2">
              
              {/* Metric 1: Automated Requests */}
              <div className="p-2.5 rounded-xl bg-[#FFFFFF] dark:bg-white/10 border border-[#E5DFD3] dark:border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bot className="w-3.5 h-3.5 text-[#0A0838]" />
                  <span className="text-xs font-medium text-[#29251D] dark:text-slate-200">
                    Automated Requests
                  </span>
                </div>
                <span className="text-sm font-semibold text-[#0A0838] dark:text-white">
                  {animatedAutoSR.toLocaleString()} SRs
                </span>
              </div>

              {/* Metric 2: Target Acceleration Velocity */}
              <div className="p-2.5 rounded-xl bg-[#FFFFFF] dark:bg-white/10 border border-[#E5DFD3] dark:border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-3.5 h-3.5 text-[#0A0838] dark:text-slate-300" />
                  <span className="text-xs font-medium text-[#29251D] dark:text-slate-200">
                    Offload Attainment
                  </span>
                </div>
                <span className="text-sm font-semibold text-[#0A0838] dark:text-white">
                  {((animatedAutoPct / targetPct) * 100).toFixed(1)}% of Target
                </span>
              </div>

            </div>
          </div>
        </div>

      </div>

      {/* 4. INTERACTIVE MODAL OVERLAYS */}
      {activeModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-md p-4 animate-in fade-in duration-200"
          onClick={() => setActiveModal(null)}
        >
          <div
            className="w-full max-w-2xl bg-white dark:bg-[#0E0C28] border-2 border-slate-200 dark:border-white/20 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200"
            onClick={e => e.stopPropagation()}
          >
            {/* ZERO-TOUCH MODAL (100% SOURCED FROM EXCEL / PPT DATA) */}
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
                      <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-[#D1EED0] text-[#2E5F13] border border-[#B4DFB1]">
                        4,470 Total Auto-Closed
                      </span>
                    </div>

                    <div className="relative w-full h-32">
                      <svg className="w-full h-full" viewBox="0 0 500 110" preserveAspectRatio="none">
                        <defs>
                          <linearGradient id="modal-auto-impact-grad" x1="0" y1="0" x2="0" y2="1">
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
                          fill="url(#modal-auto-impact-grad)"
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

            {/* TECHHUB MODAL (100% SOURCED FROM EXCEL / PPT DATA) */}
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
                          <linearGradient id="modal-techhub-impact-grad" x1="0" y1="0" x2="0" y2="1">
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
                          fill="url(#modal-techhub-impact-grad)"
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

            {/* SMART ROUTING MODAL (100% SOURCED FROM EXCEL / PPT DATA) */}
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

            <div className="p-3 border-t border-[#E5DFD3] dark:border-white/10 bg-[#FAF8F5] dark:bg-white/3 flex items-center justify-end">
              <button
                onClick={() => setActiveModal(null)}
                className="px-5 py-1.5 rounded-xl bg-[#0A0838] hover:bg-[#E31837] text-white text-xs font-medium transition-all shadow-xs cursor-pointer"
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

export default AutomationImpact;
