import React from 'react';
import { useLiveData } from '../hooks/useLiveData';
import { LiveDataBadge } from '../components/LiveDataBadge';
import {
  Cog,
  Layers,
  Activity,
  Sparkles,
  GitFork,
  Sprout,
  BarChart2,
  Rocket,
  FileSpreadsheet
} from 'lucide-react';

interface AiopsRoadmapProps {
  onNavigateToPrev?: () => void;
  onNavigateToNext?: () => void;
}

const TIMELINE_QUARTERS = [
  {
    key: 'Q2',
    year: '2026',
    title: "Q2' 2026",
    phase: 'Discover & Prepare',
    subtext: 'Assess, plan and build the foundation',
    icon: Sprout
  },
  {
    key: 'Q3',
    year: '2026',
    title: "Q3' 2026",
    phase: 'Build & Pilot',
    subtext: 'Develop, pilot and validate solutions',
    icon: Cog
  },
  {
    key: 'Q4',
    year: '2026',
    title: "Q4' 2026",
    phase: 'Scale & Expand',
    subtext: 'Scale successful pilots and expand adoption',
    icon: BarChart2
  },
  {
    key: 'Q1',
    year: '2027',
    title: "Q1' 2027",
    phase: 'Operationalize',
    subtext: 'Embed into operations for lasting impact',
    icon: Rocket
  }
];

export const AiopsRoadmap: React.FC<AiopsRoadmapProps> = () => {
  const { isLoading, isRefreshing, error, lastUpdatedDisplay, dataSource, refresh } = useLiveData();

  return (
    <div className={`h-full w-full flex flex-col justify-between p-3 md:p-4 gap-2 relative overflow-hidden bg-[#FFFFFF] dark:bg-[#07051E] text-[#0B1E38] dark:text-white transition-opacity duration-300 select-none ${isLoading ? 'opacity-70' : 'opacity-100'}`}>

      {/* 1. TOP HEADER */}
      <div className="shrink-0 flex items-center justify-between gap-4 pb-1.5 border-b border-[#E2E8F0] dark:border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <span className="w-2 h-2 rounded-full bg-[#0066B2] dark:bg-sky-400 animate-pulse" />
            <span className="text-xs font-medium text-[#0066B2] dark:text-sky-400">
              09 • Forward View
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#0A0838] dark:text-white flex items-center gap-2 leading-tight">
            <span>AIOPS Roadmap Year-1</span>
          </h1>
        </div>

        {/* Live Status Badge */}
        <div className="flex items-center gap-2 shrink-0">
          <LiveDataBadge
            dataSource={dataSource}
            lastUpdatedDisplay={lastUpdatedDisplay}
            isRefreshing={isRefreshing}
            onRefresh={refresh}
            error={error}
          />
        </div>
      </div>

      {/* 2. ROADMAP PROCESS MATRIX CONTAINER */}
      <div className="flex-1 min-h-0 flex flex-col justify-between gap-2 overflow-hidden relative">

        {/* 2A. TIMELINE COLUMN HEADERS (WORKSTREAMS + 4 EQUAL QUARTERS) */}
        <div className="grid grid-cols-12 gap-2 shrink-0 items-stretch relative">
          {/* Workstreams Column Header Card */}
          <div className="col-span-3 lg:col-span-2.5 rounded-xl bg-[#EDF4FA] dark:bg-white/5 border border-[#D0DFEB] dark:border-white/10 p-2 flex items-center justify-center text-center shadow-2xs">
            <span className="text-xs font-bold text-[#4A6572] dark:text-slate-300 flex items-center gap-1.5">
              <FileSpreadsheet className="w-3.5 h-3.5 text-[#004C87] dark:text-sky-400" />
              Workstreams
            </span>
          </div>

          {/* 4 Quarter Header Cards */}
          <div className="col-span-9 lg:col-span-9.5 grid grid-cols-4 gap-2 relative">
            {/* Q4 Light Vertical Line Indicator */}
            <div className="absolute top-0 bottom-0 left-[62.5%] -translate-x-1/2 w-0 border-l-2 border-dashed border-[#F59E0B]/70 dark:border-amber-400/60 z-20 pointer-events-none" />

            {TIMELINE_QUARTERS.map(q => {
              const Icon = q.icon;
              const isQ4 = q.key === 'Q4';

              return (
                <div
                  key={q.key}
                  className={`rounded-xl p-1.5 sm:p-2 flex flex-col items-center justify-center text-center transition-all border shadow-2xs relative ${
                    isQ4
                      ? 'bg-[#E8EFF5] dark:bg-[#486B80]/20 border-[#B9D3E5] dark:border-[#486B80]/40'
                      : 'bg-[#EDF4FA] dark:bg-white/5 border-[#D0DFEB] dark:border-white/10'
                  }`}
                >
                  {/* Circular Icon Badge */}
                  <div className="w-6 h-6 rounded-full flex items-center justify-center shadow-2xs bg-[#002D56] text-white mb-0.5">
                    <Icon className="w-3.5 h-3.5" />
                  </div>

                  {/* Quarter Title */}
                  <h3 className="text-xs sm:text-sm font-bold tracking-tight leading-tight text-[#0A1A3A] dark:text-white">
                    {q.title}
                  </h3>

                  {/* Phase Subtitle */}
                  <span className="text-[10px] sm:text-[10.5px] font-bold mt-0.5 leading-tight text-[#004C87] dark:text-sky-300">
                    {q.phase}
                  </span>

                  {/* Description Subtext */}
                  <span className="text-[8px] sm:text-[8.5px] leading-tight mt-0.5 line-clamp-1 text-[#556987] dark:text-slate-400">
                    {q.subtext}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* 2B. 5 WORKSTREAM ROWS WITH CONTINUOUS CHEVRON PROCESS ARROWS */}
        <div className="flex-1 flex flex-col justify-between gap-1.5 min-h-0 overflow-hidden relative">

          {/* ============================================================ */}
          {/* ROW 1: Automation Enhancement                                */}
          {/* ============================================================ */}
          <div className="grid grid-cols-12 gap-2 items-stretch min-h-[52px] flex-1">
            {/* Left Workstream Card */}
            <div className="col-span-3 lg:col-span-2.5 rounded-xl bg-[#486B80] dark:bg-[#344E5E] text-white shadow-xs p-2 sm:p-2.5 flex items-center gap-2.5 border border-white/10 h-full">
              <div className="w-7 h-7 rounded-lg bg-white/20 backdrop-blur-xs flex items-center justify-center shrink-0 shadow-inner">
                <Cog className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-[11px] sm:text-xs font-bold tracking-tight leading-snug">
                Automation Enhancement
              </span>
            </div>

            {/* Right 4-Quarter Timeline Track */}
            <div className="col-span-9 lg:col-span-9.5 grid grid-cols-4 gap-2 items-stretch h-full relative">
              {/* Q4 Light Vertical Line Indicator */}
              <div className="absolute top-0 bottom-0 left-[62.5%] -translate-x-1/2 w-0 border-l-2 border-dashed border-[#F59E0B]/70 dark:border-amber-400/60 z-20 pointer-events-none" />

              {/* Chevron 1 (Spans Q2: 1 Col) */}
              <div className="col-span-1 chevron-first bg-[#DCE6ED] dark:bg-[#486B80]/30 text-[#0F2331] dark:text-slate-100 p-2 sm:p-2.5 pr-5 flex flex-col justify-center shadow-2xs h-full">
                <ul className="space-y-0.5">
                  <li className="text-[8px] sm:text-[9px] font-medium leading-tight flex items-start gap-1">
                    <span className="text-[#3B5B70] dark:text-sky-300 font-bold shrink-0 leading-none mt-0.5">•</span>
                    <span>Existing Automation Review</span>
                  </li>
                  <li className="text-[8px] sm:text-[9px] font-medium leading-tight flex items-start gap-1">
                    <span className="text-[#3B5B70] dark:text-sky-300 font-bold shrink-0 leading-none mt-0.5">•</span>
                    <span>SolarWinds Integration</span>
                  </li>
                </ul>
              </div>

              {/* Chevron 2 (Spans Q3 -> Q1: 3 Cols) */}
              <div className="col-span-3 chevron-subsequent bg-[#DCE6ED] dark:bg-[#486B80]/30 text-[#0F2331] dark:text-slate-100 p-2 sm:p-2.5 pl-6 pr-6 flex flex-col justify-center shadow-2xs h-full">
                <ul className="space-y-0.5">
                  <li className="text-[8px] sm:text-[9px] font-medium leading-tight flex items-start gap-1">
                    <span className="text-[#3B5B70] dark:text-sky-300 font-bold shrink-0 leading-none mt-0.5">•</span>
                    <span>Standardize workflows, orchestration across platform</span>
                  </li>
                  <li className="text-[8px] sm:text-[9px] font-medium leading-tight flex items-start gap-1">
                    <span className="text-[#3B5B70] dark:text-sky-300 font-bold shrink-0 leading-none mt-0.5">•</span>
                    <span>SNOW Integration</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* ============================================================ */}
          {/* ROW 2: New Automation Use Cases                             */}
          {/* ============================================================ */}
          <div className="grid grid-cols-12 gap-2 items-stretch min-h-[52px] flex-1">
            {/* Left Workstream Card */}
            <div className="col-span-3 lg:col-span-2.5 rounded-xl bg-[#486B80] dark:bg-[#344E5E] text-white shadow-xs p-2 sm:p-2.5 flex items-center gap-2.5 border border-white/10 h-full">
              <div className="w-7 h-7 rounded-lg bg-white/20 backdrop-blur-xs flex items-center justify-center shrink-0 shadow-inner">
                <Layers className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-[11px] sm:text-xs font-bold tracking-tight leading-snug">
                New Automation Use Cases
              </span>
            </div>

            {/* Right 4-Quarter Timeline Track */}
            <div className="col-span-9 lg:col-span-9.5 grid grid-cols-4 gap-2 items-stretch h-full relative">
              {/* Q4 Light Vertical Line Indicator */}
              <div className="absolute top-0 bottom-0 left-[62.5%] -translate-x-1/2 w-0 border-l-2 border-dashed border-[#F59E0B]/70 dark:border-amber-400/60 z-20 pointer-events-none" />

              {/* Chevron 1 (Spans Q2: 1 Col) */}
              <div className="col-span-1 chevron-first bg-[#DCE6ED] dark:bg-[#486B80]/30 text-[#0F2331] dark:text-slate-100 p-2 sm:p-2.5 pr-5 flex flex-col justify-center shadow-2xs h-full">
                <ul className="space-y-0.5">
                  <li className="text-[8px] sm:text-[9px] font-medium leading-tight flex items-start gap-1">
                    <span className="text-[#3B5B70] dark:text-sky-300 font-bold shrink-0 leading-none mt-0.5">•</span>
                    <span>New Use Case Identification, Review, Feasibility and Deployment</span>
                  </li>
                </ul>
              </div>

              {/* Chevron 2 (Spans Q3: 1 Col) */}
              <div className="col-span-1 chevron-subsequent bg-[#DCE6ED] dark:bg-[#486B80]/30 text-[#0F2331] dark:text-slate-100 p-2 sm:p-2.5 pl-6 pr-5 flex flex-col justify-center shadow-2xs h-full">
                <ul className="space-y-0.5">
                  <li className="text-[8px] sm:text-[9px] font-medium leading-tight flex items-start gap-1">
                    <span className="text-[#3B5B70] dark:text-sky-300 font-bold shrink-0 leading-none mt-0.5">•</span>
                    <span>New Automation Use case development</span>
                  </li>
                </ul>
              </div>

              {/* Chevron 3 (Spans Q4 -> Q1: 2 Cols) */}
              <div className="col-span-2 chevron-subsequent bg-[#DCE6ED] dark:bg-[#486B80]/30 text-[#0F2331] dark:text-slate-100 p-2 sm:p-2.5 pl-6 pr-6 flex flex-col justify-center shadow-2xs h-full">
                <ul className="space-y-0.5">
                  <li className="text-[8px] sm:text-[9px] font-medium leading-tight flex items-start gap-1">
                    <span className="text-[#3B5B70] dark:text-sky-300 font-bold shrink-0 leading-none mt-0.5">•</span>
                    <span>Automation based on trends, events, threshold, incident and requests</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* ============================================================ */}
          {/* ROW 3: Tools + AIOps                                         */}
          {/* ============================================================ */}
          <div className="grid grid-cols-12 gap-2 items-stretch min-h-[52px] flex-1">
            {/* Left Workstream Card */}
            <div className="col-span-3 lg:col-span-2.5 rounded-xl bg-[#486B80] dark:bg-[#344E5E] text-white shadow-xs p-2 sm:p-2.5 flex items-center gap-2.5 border border-white/10 h-full">
              <div className="w-7 h-7 rounded-lg bg-white/20 backdrop-blur-xs flex items-center justify-center shrink-0 shadow-inner">
                <Activity className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-[11px] sm:text-xs font-bold tracking-tight leading-snug">
                Tools + AIOps
              </span>
            </div>

            {/* Right 4-Quarter Timeline Track */}
            <div className="col-span-9 lg:col-span-9.5 grid grid-cols-4 gap-2 items-stretch h-full relative">
              {/* Q4 Light Vertical Line Indicator */}
              <div className="absolute top-0 bottom-0 left-[62.5%] -translate-x-1/2 w-0 border-l-2 border-dashed border-[#F59E0B]/70 dark:border-amber-400/60 z-20 pointer-events-none" />

              {/* Q2 Gap / Empty */}
              <div className="col-span-1 flex items-center justify-center text-slate-300 dark:text-slate-600 font-bold text-sm">
                —
              </div>

              {/* Chevron 1 (Spans Q3: 1 Col) */}
              <div className="col-span-1 chevron-first bg-[#DCE6ED] dark:bg-[#486B80]/30 text-[#0F2331] dark:text-slate-100 p-2 sm:p-2.5 pr-5 flex flex-col justify-center shadow-2xs h-full">
                <ul className="space-y-0.5">
                  <li className="text-[8px] sm:text-[9px] font-medium leading-tight flex items-start gap-1">
                    <span className="text-[#3B5B70] dark:text-sky-300 font-bold shrink-0 leading-none mt-0.5">•</span>
                    <span>Alert Reduction on Solar Wind ITOM TOOL using AI capability</span>
                  </li>
                </ul>
              </div>

              {/* Chevron 2 (Spans Q4 -> Q1: 2 Cols) */}
              <div className="col-span-2 chevron-subsequent bg-[#DCE6ED] dark:bg-[#486B80]/30 text-[#0F2331] dark:text-slate-100 p-2 sm:p-2.5 pl-6 pr-6 flex flex-col justify-center shadow-2xs h-full">
                <ul className="space-y-0.5">
                  <li className="text-[8px] sm:text-[9px] font-medium leading-tight flex items-start gap-1">
                    <span className="text-[#3B5B70] dark:text-sky-300 font-bold shrink-0 leading-none mt-0.5">•</span>
                    <span>Use Case Development</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* ============================================================ */}
          {/* ROW 4: Gen AI L2/L2 Ops                                     */}
          {/* ============================================================ */}
          <div className="grid grid-cols-12 gap-2 items-stretch min-h-[52px] flex-1">
            {/* Left Workstream Card */}
            <div className="col-span-3 lg:col-span-2.5 rounded-xl bg-[#486B80] dark:bg-[#344E5E] text-white shadow-xs p-2 sm:p-2.5 flex items-center gap-2.5 border border-white/10 h-full">
              <div className="w-7 h-7 rounded-lg bg-white/20 backdrop-blur-xs flex items-center justify-center shrink-0 shadow-inner">
                <Sparkles className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-[11px] sm:text-xs font-bold tracking-tight leading-snug">
                Gen AI L2/L2 Ops
              </span>
            </div>

            {/* Right 4-Quarter Timeline Track */}
            <div className="col-span-9 lg:col-span-9.5 grid grid-cols-4 gap-2 items-stretch h-full relative">
              {/* Q4 Light Vertical Line Indicator */}
              <div className="absolute top-0 bottom-0 left-[62.5%] -translate-x-1/2 w-0 border-l-2 border-dashed border-[#F59E0B]/70 dark:border-amber-400/60 z-20 pointer-events-none" />

              {/* Chevron 1 (Spans Q2: 1 Col) */}
              <div className="col-span-1 chevron-first bg-[#DCE6ED] dark:bg-[#486B80]/30 text-[#0F2331] dark:text-slate-100 p-2 sm:p-2.5 pr-5 flex flex-col justify-center shadow-2xs h-full">
                <ul className="space-y-0.5">
                  <li className="text-[8px] sm:text-[9px] font-medium leading-tight flex items-start gap-1">
                    <span className="text-[#3B5B70] dark:text-sky-300 font-bold shrink-0 leading-none mt-0.5">•</span>
                    <span>AI Team Onboarding</span>
                  </li>
                  <li className="text-[8px] sm:text-[9px] font-medium leading-tight flex items-start gap-1">
                    <span className="text-[#3B5B70] dark:text-sky-300 font-bold shrink-0 leading-none mt-0.5">•</span>
                    <span>AI Use case identification and Feasibility</span>
                  </li>
                </ul>
              </div>

              {/* Chevron 2 (Spans Q3 -> Q1: 3 Cols) */}
              <div className="col-span-3 chevron-subsequent bg-[#DCE6ED] dark:bg-[#486B80]/30 text-[#0F2331] dark:text-slate-100 p-2 sm:p-2.5 pl-6 pr-6 flex flex-col justify-center shadow-2xs h-full">
                <ul className="space-y-0.5">
                  <li className="text-[8px] sm:text-[9px] font-medium leading-tight flex items-start gap-1">
                    <span className="text-[#3B5B70] dark:text-sky-300 font-bold shrink-0 leading-none mt-0.5">•</span>
                    <span>Gen AI powered L2 operations for troubleshooting and ticket handling</span>
                  </li>
                  <li className="text-[8px] sm:text-[9px] font-medium leading-tight flex items-start gap-1">
                    <span className="text-[#3B5B70] dark:text-sky-300 font-bold shrink-0 leading-none mt-0.5">•</span>
                    <span>AI Assisted Incident summarization and RCA</span>
                  </li>
                  <li className="text-[8px] sm:text-[9px] font-medium leading-tight flex items-start gap-1">
                    <span className="text-[#3B5B70] dark:text-sky-300 font-bold shrink-0 leading-none mt-0.5">•</span>
                    <span>Automated Diagnostics</span>
                  </li>
                  <li className="text-[8px] sm:text-[9px] font-medium leading-tight flex items-start gap-1">
                    <span className="text-[#3B5B70] dark:text-sky-300 font-bold shrink-0 leading-none mt-0.5">•</span>
                    <span>Anomaly detections</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* ============================================================ */}
          {/* ROW 5: Agentic AI                                            */}
          {/* ============================================================ */}
          <div className="grid grid-cols-12 gap-2 items-stretch min-h-[52px] flex-1">
            {/* Left Workstream Card */}
            <div className="col-span-3 lg:col-span-2.5 rounded-xl bg-[#486B80] dark:bg-[#344E5E] text-white shadow-xs p-2 sm:p-2.5 flex items-center gap-2.5 border border-white/10 h-full">
              <div className="w-7 h-7 rounded-lg bg-white/20 backdrop-blur-xs flex items-center justify-center shrink-0 shadow-inner">
                <GitFork className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-[11px] sm:text-xs font-bold tracking-tight leading-snug">
                Agentic AI
              </span>
            </div>

            {/* Right 4-Quarter Timeline Track */}
            <div className="col-span-9 lg:col-span-9.5 grid grid-cols-4 gap-2 items-stretch h-full relative">
              {/* Q4 Light Vertical Line Indicator */}
              <div className="absolute top-0 bottom-0 left-[62.5%] -translate-x-1/2 w-0 border-l-2 border-dashed border-[#F59E0B]/70 dark:border-amber-400/60 z-20 pointer-events-none" />

              {/* Q2 Gap / Empty */}
              <div className="col-span-1 flex items-center justify-center text-slate-300 dark:text-slate-600 font-bold text-sm">
                —
              </div>

              {/* Chevron (Spans Q3 -> Q1: 3 Cols) */}
              <div className="col-span-3 chevron-first bg-[#DCE6ED] dark:bg-[#486B80]/30 text-[#0F2331] dark:text-slate-100 p-2 sm:p-2.5 pr-6 flex flex-col justify-center shadow-2xs h-full">
                <div className="space-y-0.5">
                  <div className="text-[8px] sm:text-[9px] font-medium leading-tight flex items-start gap-1">
                    <span className="text-[#3B5B70] dark:text-sky-300 font-bold shrink-0 leading-none mt-0.5">•</span>
                    <span>Evaluation, feasibility, development and deployment of one or two use cases</span>
                  </div>
                  <div className="pl-4 space-y-0.5 text-[7.5px] sm:text-[8.5px] text-[#2C475A] dark:text-slate-200">
                    <div className="flex items-center gap-1">
                      <span className="font-bold">•</span>
                      <span>Chatbot Use case</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="font-bold">•</span>
                      <span>Knowledge base use case</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="font-bold">•</span>
                      <span>Incident Resolution</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="font-bold">•</span>
                      <span>Service Request fulfillment</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* 3. CLEAN BOTTOM BANNER RIBBON (FULL WIDTH PROCESS CHEVRON) */}
      <div className="shrink-0 pt-0.5">
        <div className="w-full h-7 bg-[#004C87] dark:bg-[#003866] flex items-center justify-center px-6 shadow-xs rounded-lg clip-arrow">
          <span className="text-[10px] sm:text-[10.5px] font-bold text-white text-center tracking-wider uppercase drop-shadow-xs">
            From Foundational Automation to Operational AI-Led Service Delivery
          </span>
        </div>
      </div>

      {/* Embedded CSS for Precision Chevron Arrow Shapes */}
      <style>{`
        .chevron-first {
          clip-path: polygon(0% 0%, calc(100% - 14px) 0%, 100% 50%, calc(100% - 14px) 100%, 0% 100%);
        }
        .chevron-subsequent {
          clip-path: polygon(0% 0%, calc(100% - 14px) 0%, 100% 50%, calc(100% - 14px) 100%, 0% 100%, 14px 50%);
        }
        .clip-arrow {
          clip-path: polygon(0% 0%, calc(100% - 12px) 0%, 100% 50%, calc(100% - 12px) 100%, 0% 100%);
        }
      `}</style>

    </div>
  );
};
