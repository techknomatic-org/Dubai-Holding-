import React, { useState, useMemo } from 'react';
import { useLiveData } from '../hooks/useLiveData';
import { LiveDataBadge } from '../components/LiveDataBadge';
import {
  EXCEL_AIOPS_ROADMAP_ACTIVITIES,
  ExcelRoadmapActivity
} from '../data/aiopsRoadmapData';
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

interface WorkstreamConfig {
  id: string;
  name: string;
  gradient: string;
  badgeBg: string;
  textColor: string;
  lineColor: string;
  rowBg: string;
  icon: React.ElementType;
}

const WORKSTREAM_CONFIGS: WorkstreamConfig[] = [
  {
    id: 'ae',
    name: 'Automation Enhancement',
    gradient: 'from-[#004C87] to-[#0066B2]',
    badgeBg: 'bg-[#00529B]',
    textColor: 'text-[#004C87]',
    lineColor: '#0066B2',
    rowBg: 'bg-[#F3F7FA] dark:bg-white/[0.02]',
    icon: Cog
  },
  {
    id: 'nuc',
    name: 'New Automation Use Cases',
    gradient: 'from-[#0080C8] to-[#00A3E0]',
    badgeBg: 'bg-[#0091D5]',
    textColor: 'text-[#0080C8]',
    lineColor: '#009BE0',
    rowBg: 'bg-[#EFF7FC] dark:bg-white/[0.02]',
    icon: Layers
  },
  {
    id: 'ta',
    name: 'Tools + AIOps',
    gradient: 'from-[#008E7E] to-[#00B4A4]',
    badgeBg: 'bg-[#009D8F]',
    textColor: 'text-[#008E7E]',
    lineColor: '#00A89A',
    rowBg: 'bg-[#ECF8F6] dark:bg-white/[0.02]',
    icon: Activity
  },
  {
    id: 'ga',
    name: 'Gen AI L2/L2 Ops',
    gradient: 'from-[#5540B0] to-[#7B5EE0]',
    badgeBg: 'bg-[#674ECE]',
    textColor: 'text-[#5540B0]',
    lineColor: '#7457DB',
    rowBg: 'bg-[#F5F1FC] dark:bg-white/[0.02]',
    icon: Sparkles
  },
  {
    id: 'ag',
    name: 'Agentic AI',
    gradient: 'from-[#3350CE] to-[#4F73E8]',
    badgeBg: 'bg-[#3F5FD9]',
    textColor: 'text-[#3350CE]',
    lineColor: '#4569E4',
    rowBg: 'bg-[#EFF3FC] dark:bg-white/[0.02]',
    icon: GitFork
  }
];

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
  const { data, isLoading, isRefreshing, error, lastUpdatedDisplay, dataSource, refresh } = useLiveData();

  // Source of truth: Excel sheet activities from live data (or fallback)
  const activities: ExcelRoadmapActivity[] = useMemo(() => {
    return data?.aiopsRoadmapActivities && data.aiopsRoadmapActivities.length > 0
      ? data.aiopsRoadmapActivities
      : EXCEL_AIOPS_ROADMAP_ACTIVITIES;
  }, [data]);

  // Group activities by workstream
  const workstreamData = useMemo(() => {
    return WORKSTREAM_CONFIGS.map(ws => {
      // Find matching activities from Excel
      const wsActivities = activities.filter(
        a => a.workstream.toLowerCase().trim() === ws.name.toLowerCase().trim() ||
             (ws.id === 'ta' && a.workstream.toLowerCase().includes('tools')) ||
             (ws.id === 'ga' && a.workstream.toLowerCase().includes('gen ai')) ||
             (ws.id === 'ag' && a.workstream.toLowerCase().includes('agentic')) ||
             (ws.id === 'ae' && a.workstream.toLowerCase().includes('automation enhancement')) ||
             (ws.id === 'nuc' && a.workstream.toLowerCase().includes('new automation'))
      );

      // Distribute into quarters
      const q2Activities = wsActivities.filter(a => a.startQKey === 'Q2');
      const q3Activities = wsActivities.filter(a => a.startQKey === 'Q3');
      const q4Activities = wsActivities.filter(a => a.startQKey === 'Q4');
      const q1Activities = wsActivities.filter(a => a.startQKey === 'Q1');

      return {
        config: ws,
        activities: wsActivities,
        q2Activities,
        q3Activities,
        q4Activities,
        q1Activities
      };
    });
  }, [activities]);

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
          <h1 className="text-2xl font-semibold tracking-tight text-[#29251D] dark:text-white flex items-center gap-2">
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

      {/* 2. ROADMAP MATRIX CONTAINER */}
      <div className="flex-1 min-h-0 flex flex-col justify-between gap-1.5 overflow-hidden">

        {/* 2A. TIMELINE COLUMN HEADERS (WORKSTREAMS + 4 QUARTERS) */}
        <div className="grid grid-cols-12 gap-2 shrink-0 items-stretch">
          {/* Workstreams Column Header Card */}
          <div className="col-span-3 lg:col-span-2.5 rounded-xl bg-[#E8EFF6] dark:bg-white/5 border border-[#D0DFEB] dark:border-white/10 p-2 flex items-center justify-center text-center shadow-xs">
            <span className="text-xs font-bold text-[#4A6572] dark:text-slate-300 flex items-center gap-1.5">
              <FileSpreadsheet className="w-3.5 h-3.5 text-[#004C87] dark:text-sky-400" />
              Workstreams
            </span>
          </div>

          {/* 4 Quarter Header Cards */}
          <div className="col-span-9 lg:col-span-9.5 grid grid-cols-4 gap-2">
            {TIMELINE_QUARTERS.map(q => {
              const Icon = q.icon;
              const isCurrentQ4 = q.key === 'Q4';

              return (
                <div
                  key={q.key}
                  className={`rounded-xl p-1.5 sm:p-2 flex flex-col items-center justify-center text-center transition-all border relative ${
                    isCurrentQ4
                      ? 'bg-gradient-to-b from-[#FEF3C7] via-[#FFFBEB] to-[#FDE68A]/60 dark:from-amber-950/80 dark:via-amber-900/50 dark:to-amber-950/70 border-2 border-[#F59E0B] shadow-sm'
                      : 'bg-[#EDF4FA] dark:bg-white/5 border-[#D0DFEB] dark:border-white/10 shadow-xs'
                  }`}
                >
                  {/* Circular Icon Badge + Active Pill */}
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center shadow-xs ${
                      isCurrentQ4 ? 'bg-[#D97706] text-white ring-2 ring-[#F59E0B]/40' : 'bg-[#002D56] text-white'
                    }`}>
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    {isCurrentQ4 && (
                      <span className="px-2 py-0.5 rounded-full bg-[#D97706] text-white text-[8px] font-bold flex items-center gap-1 shadow-2xs">
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                        Current Focus
                      </span>
                    )}
                  </div>

                  {/* Quarter Title */}
                  <h3 className={`text-xs sm:text-sm font-extrabold tracking-tight leading-tight ${
                    isCurrentQ4 ? 'text-[#92400E] dark:text-amber-300' : 'text-[#0A1A3A] dark:text-white'
                  }`}>
                    {q.title}
                  </h3>

                  {/* Phase Subtitle */}
                  <span className={`text-[10px] sm:text-[10.5px] font-bold mt-0.5 leading-tight ${
                    isCurrentQ4 ? 'text-[#B45309] dark:text-amber-400' : 'text-[#004C87] dark:text-sky-300'
                  }`}>
                    {q.phase}
                  </span>

                  {/* Description Subtext */}
                  <span className={`text-[8px] sm:text-[8.5px] leading-tight mt-0.5 line-clamp-1 ${
                    isCurrentQ4 ? 'text-[#92400E]/80 dark:text-amber-300/80 font-medium' : 'text-[#556987] dark:text-slate-400'
                  }`}>
                    {q.subtext}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* 2B. 5 WORKSTREAM ROWS (PERFECT VISUAL GRID) */}
        <div className="flex-1 flex flex-col justify-between gap-1.5 min-h-0 overflow-hidden">
          {workstreamData.map(({ config: ws, q2Activities, q3Activities, q4Activities, q1Activities }) => {
            const Icon = ws.icon;

            // Determine layout mode for this row:
            // Mode A: Spans across Q4 and Q1 as a single clean 2-column arrow block (Row 1, Row 4, Row 5)
            const isSpanningQ4Q1 = ws.id === 'ae' || ws.id === 'ga' || ws.id === 'ag';

            return (
              <div
                key={ws.id}
                className="grid grid-cols-12 gap-2 items-stretch min-h-[52px] flex-1"
              >
                {/* Left Workstream Gradient Card */}
                <div className={`col-span-3 lg:col-span-2.5 rounded-xl bg-gradient-to-r ${ws.gradient} text-white shadow-xs p-2 sm:p-2.5 flex items-center gap-2.5 border border-white/10 h-full`}>
                  <div className="w-7 h-7 rounded-lg bg-white/20 backdrop-blur-xs flex items-center justify-center shrink-0 shadow-inner">
                    <Icon className="w-3.5 h-3.5 text-white" />
                  </div>
                  <span className="text-[11px] sm:text-xs font-bold tracking-tight leading-snug">
                    {ws.name}
                  </span>
                </div>

                {/* Right 4 Quarter Matrix Track */}
                <div className="col-span-9 lg:col-span-9.5 grid grid-cols-4 gap-2 items-stretch h-full">

                  {/* CELL 1: Q2' 2026 */}
                  <div className={`rounded-xl p-1.5 sm:p-2 ${ws.rowBg} border border-[#D8E6F0] dark:border-white/5 flex flex-col justify-center h-full`}>
                    {q2Activities.length > 0 ? (
                      <ul className="space-y-0.5">
                        {q2Activities.map(act => (
                          <li
                            key={act.id}
                            className="text-[8.5px] sm:text-[9.5px] font-medium text-[#0A1A3A] dark:text-slate-200 flex items-start gap-1 leading-tight"
                          >
                            <span className="text-[#004C87] dark:text-sky-400 font-bold shrink-0 leading-none mt-0.5">•</span>
                            <span>{act.activity}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="text-center text-slate-400 font-bold text-sm">—</div>
                    )}
                  </div>

                  {/* CELL 2: Q3' 2026 */}
                  <div className={`rounded-xl p-1.5 sm:p-2 ${ws.rowBg} border border-[#D8E6F0] dark:border-white/5 flex flex-col justify-center h-full`}>
                    {q3Activities.length > 0 ? (
                      <ul className="space-y-0.5">
                        {q3Activities.map(act => (
                          <li
                            key={act.id}
                            className="text-[8px] sm:text-[9px] font-medium text-[#0A1A3A] dark:text-slate-200 flex items-start gap-1 leading-tight"
                          >
                            <span className="text-[#004C87] dark:text-sky-400 font-bold shrink-0 leading-none mt-0.5">•</span>
                            <span>{act.activity}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="text-center text-slate-400 font-bold text-sm">—</div>
                    )}
                  </div>

                  {/* CELL 3 & 4 (Q4 & Q1) */}
                  {isSpanningQ4Q1 ? (
                    /* SPANNING 2-COL BLOCK WITH TIMELINE ARROW (Row 1, 4, 5) */
                    <div className="col-span-2 grid grid-cols-2 gap-2 h-full">
                      {/* Q4 Segment (Highlighted) */}
                      <div className="rounded-xl p-1.5 sm:p-2 bg-[#FFFDF5] dark:bg-amber-950/20 border-2 border-[#F59E0B]/50 flex items-center justify-center relative h-full">
                        {/* Node circle at Q4 start */}
                        <div
                          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full border-2 bg-white dark:bg-[#07051E] shadow-xs z-10"
                          style={{ borderColor: ws.lineColor }}
                        />
                        {/* Full connecting line across Q4 */}
                        <div
                          className="w-full h-[2.5px]"
                          style={{ backgroundColor: ws.lineColor }}
                        />
                      </div>

                      {/* Q1 Segment (Continuation + Arrowhead) */}
                      <div className={`rounded-xl p-1.5 sm:p-2 ${ws.rowBg} border border-[#D8E6F0] dark:border-white/5 flex items-center justify-center relative h-full`}>
                        {/* Node circle at Q1 start */}
                        <div
                          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full border-2 bg-white dark:bg-[#07051E] shadow-xs z-10"
                          style={{ borderColor: ws.lineColor }}
                        />
                        {/* Connecting line to arrowhead */}
                        <div className="w-full flex items-center">
                          <div
                            className="flex-1 h-[2.5px]"
                            style={{ backgroundColor: ws.lineColor }}
                          />
                          {/* Terminal Arrowhead */}
                          <div
                            className="w-0 h-0 border-y-[5.5px] border-y-transparent border-l-[9px] shrink-0"
                            style={{ borderLeftColor: ws.lineColor }}
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* INDIVIDUAL Q4 & Q1 CELLS (Row 2, 3) */
                    <>
                      {/* Q4 Cell with Text + Arrow start */}
                      <div className="rounded-xl p-1.5 sm:p-2 bg-[#FFFDF5] dark:bg-amber-950/20 border-2 border-[#F59E0B] flex items-center justify-between gap-1 relative h-full shadow-xs">
                        {q4Activities.length > 0 ? (
                          <div className="flex-1 pr-1">
                            <ul className="space-y-0.5">
                              {q4Activities.map(act => (
                                <li
                                  key={act.id}
                                  className="text-[8px] sm:text-[9px] font-semibold text-[#92400E] dark:text-amber-200 flex items-start gap-1 leading-tight"
                                >
                                  <span className="text-[#D97706] font-bold shrink-0 leading-none mt-0.5">•</span>
                                  <span>{act.activity}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ) : null}

                        {/* Arrow start connector */}
                        <div className="flex items-center shrink-0 w-8">
                          <div
                            className="w-3 h-3 rounded-full border-2 bg-white dark:bg-[#07051E] shrink-0 shadow-xs"
                            style={{ borderColor: ws.lineColor }}
                          />
                          <div
                            className="flex-1 h-[2.5px]"
                            style={{ backgroundColor: ws.lineColor }}
                          />
                        </div>
                      </div>

                      {/* Q1 Cell with Arrow Continuation */}
                      <div className={`rounded-xl p-1.5 sm:p-2 ${ws.rowBg} border border-[#D8E6F0] dark:border-white/5 flex items-center justify-center relative h-full`}>
                        {/* Node circle at Q1 start */}
                        <div
                          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full border-2 bg-white dark:bg-[#07051E] shadow-xs z-10"
                          style={{ borderColor: ws.lineColor }}
                        />
                        {/* Connecting line to arrowhead */}
                        <div className="w-full flex items-center">
                          <div
                            className="flex-1 h-[2.5px]"
                            style={{ backgroundColor: ws.lineColor }}
                          />
                          {/* Terminal Arrowhead */}
                          <div
                            className="w-0 h-0 border-y-[5.5px] border-y-transparent border-l-[9px] shrink-0"
                            style={{ borderLeftColor: ws.lineColor }}
                          />
                        </div>
                      </div>
                    </>
                  )}

                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* 3. CLEAN BOTTOM BANNER RIBBON (FULL WIDTH CHEVRON) */}
      <div className="shrink-0 pt-0.5">
        <div className="w-full h-7 bg-gradient-to-r from-[#0091D5] via-[#0066B2] to-[#004C87] flex items-center justify-center px-6 shadow-xs rounded-lg clip-arrow">
          <span className="text-[10.5px] sm:text-[11px] font-bold text-white text-center drop-shadow-xs">
            From Foundational Automation to Operational AI-Led Service Delivery
          </span>
        </div>
      </div>



      {/* Embedded CSS for Chevron Arrow styling */}
      <style>{`
        .clip-arrow {
          clip-path: polygon(0% 0%, calc(100% - 12px) 0%, 100% 50%, calc(100% - 12px) 100%, 0% 100%, 0% 0%);
        }
      `}</style>

    </div>
  );
};
