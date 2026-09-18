import React, { useState } from 'react';
import { useLiveData } from '../hooks/useLiveData';
import { LiveDataBadge } from '../components/LiveDataBadge';
import {
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Layers,
  ChevronRight,
  X,
  Server,
  Building2,
  HardDrive,
  AlertCircle,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import {
  riskSummaryKPIs as defaultRiskSummaryKPIs,
  last30DaysClosures as defaultLast30DaysClosures,
  risksWithNoTargetDate as defaultRisksWithNoTargetDate,
  risksRequiringAttention as defaultRisksRequiringAttention,
  riskMitigationSchedule as defaultRiskMitigationSchedule,
  overdueRisksList as defaultOverdueRisksList,
  OverdueRiskDetail
} from '../data/riskData';

interface RiskDashboardProps {
  onNavigateToPrev?: () => void;
  onNavigateToNext?: () => void;
}

export const RiskDashboard: React.FC<RiskDashboardProps> = () => {
  // Live Data Hook from Excel & SharePoint Sync
  const { data, dataSource, lastUpdatedDisplay, isRefreshing, refresh, error } = useLiveData();

  const riskSummaryKPIs = data.riskSummaryKPIs || defaultRiskSummaryKPIs;
  const overdueRisksList = data.overdueRisksList || defaultOverdueRisksList;
  const risksRequiringAttention = data.risksRequiringAttention || defaultRisksRequiringAttention;
  const risksWithNoTargetDate = data.risksWithNoTargetDate || defaultRisksWithNoTargetDate;
  const riskMitigationSchedule = data.riskMitigationSchedule || defaultRiskMitigationSchedule;
  const last30DaysClosures = data.last30DaysClosures || defaultLast30DaysClosures;

  // Section 1: 4-Tab Switcher State
  const [activeTab, setActiveTab] = useState<'attention' | 'notarget' | 'schedule' | 'closures'>('attention');
  const [hoveredNoTarget, setHoveredNoTarget] = useState<{ entity: string; count: number; color: string } | null>(null);
  const [hoveredClosure, setHoveredClosure] = useState<{ dependency: string; count: number; color: string } | null>(null);

  // Modal Popups for Section 2 Overdue Categories & Specific Risk Details & Mitigation Schedule
  const [activeModal, setActiveModal] = useState<'vmware' | 'entity' | 'allOverdue' | 'schedule' | null>(null);
  const [selectedRiskDetail, setSelectedRiskDetail] = useState<OverdueRiskDetail | null>(null);

  // Filtered lists for modals
  const vmwareRisks = overdueRisksList.filter(r => r.category === 'VMware License Dependency');
  const entityRisks = overdueRisksList.filter(r => r.category === 'Entity Dependency');

  // Palette constants matching the PPT exactly
  const entityColors: Record<string, string> = {
    DHHQ: '#2E3842',   // Dark Charcoal / Navy
    DHH: '#00A8A8',    // Bright Teal
    DHE: '#38BDF8',    // Sky Blue / Cyan
    DHAM: '#64748B',   // Slate Grey
    Merex: '#2DD4BF',  // Teal Mint
    DHRE: '#FB923C',   // Coral / Orange
    DHCM: '#FBBF24',   // Gold / Yellow
    DHGS: '#A855F7',   // Purple / Lavender
    'Other Entities': '#94A3B8'
  };

  return (
    <div className="h-full w-full flex flex-col justify-between p-3 sm:p-3.5 lg:p-4 gap-2.5 relative overflow-hidden text-left bg-[#FFFFFF] dark:bg-[#0A0838]">

      {/* 1. TOP HEADER & METADATA BAR */}
      <div className="shrink-0 flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-[#E5DFD3] dark:border-white/10 gap-2">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <span className="w-2 h-2 rounded-full bg-[#0066B2] dark:bg-sky-400 animate-pulse" />
            <span className="text-xs font-medium text-[#0066B2] dark:text-sky-400">
              07 • Risk Management
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#0A0838] dark:text-white leading-tight">
            Risk Management Dashboard
          </h1>
        </div>

        <div className="flex items-center gap-2.5">
          <LiveDataBadge
            dataSource={dataSource}
            lastUpdatedDisplay={lastUpdatedDisplay}
            isRefreshing={isRefreshing}
            onRefresh={refresh}
            error={error}
          />
        </div>
      </div>

      {/* 2. MAIN 2-SECTION SPLIT WORKSPACE */}
      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-3 items-stretch my-1.5">

        {/* =========================================================================
            SECTION 1 (LEFT 7 COLS): RISK DASHBOARD
            - Top: 5 Summary KPI Cards (White, clean)
            - 4 Tabs Bar: [ Requires Attention (43) ] [ No Target Date (24) ] [ Mitigation Schedule (25) ] [ Last 30 Days (4) ]
            - 3D Rounded Cylinder Bars Chart for Requires Attention
           ========================================================================= */}
        <div className="lg:col-span-7 flex flex-col justify-between bg-[#FFFFFF] dark:bg-white/5 rounded-2xl border border-[#E5DFD3] dark:border-white/10 p-3 sm:p-3.5 shadow-2xs overflow-hidden min-h-0">

          {/* Section 1 Header */}
          <div className="flex items-center justify-between pb-1.5 border-b border-[#E5DFD3]/80 dark:border-white/10 shrink-0">
            <h2 className="text-xs sm:text-sm font-bold text-[#29251D] dark:text-white flex items-center gap-2">
              <div className="w-5 h-5 rounded-lg bg-[#3A59A4]/10 text-[#3A59A4] flex items-center justify-center">
                <Layers className="w-3.5 h-3.5" />
              </div>
              <span>Risk Dashboard</span>
            </h2>
          </div>

          {/* Top 5 Summary KPI Cards */}
          <div className="grid grid-cols-5 gap-2.5 my-1.5 shrink-0">
            {/* 1. Total */}
            <div className="p-2.5 sm:p-3 rounded-2xl bg-[#FFFFFF] dark:bg-white/5 border border-[#E5DFD3] dark:border-white/10 shadow-2xs hover:shadow-xs transition-all flex flex-col items-center justify-center text-center group hover:border-[#0A0838]/40 min-h-[72px]">
              <div className="flex items-center justify-center gap-1.5 text-center">
                <div className="w-5 h-5 rounded-lg bg-[#0A0838]/5 text-[#0A0838] dark:text-white flex items-center justify-center shrink-0">
                  <Layers className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-semibold text-[#4D4D4F] dark:text-slate-300">
                  Total
                </span>
              </div>
              <div className="mt-1 flex items-center justify-center text-center">
                <span className="text-xl sm:text-2xl font-black text-[#0A0838] dark:text-white font-mono leading-none">
                  {riskSummaryKPIs.total}
                </span>
              </div>
            </div>

            {/* 2. Open */}
            <div className="p-2.5 sm:p-3 rounded-2xl bg-[#FFFFFF] dark:bg-white/5 border border-[#E5DFD3] dark:border-white/10 shadow-2xs hover:shadow-xs transition-all flex flex-col items-center justify-center text-center group hover:border-[#0284C7]/40 min-h-[72px]">
              <div className="flex items-center justify-center gap-1.5 text-center">
                <div className="w-5 h-5 rounded-lg bg-[#0284C7]/10 text-[#0284C7] flex items-center justify-center shrink-0">
                  <AlertCircle className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-semibold text-[#4D4D4F] dark:text-slate-300">
                  Open
                </span>
              </div>
              <div className="mt-1 flex items-center justify-center text-center">
                <span className="text-xl sm:text-2xl font-black text-[#0284C7] font-mono leading-none">
                  {riskSummaryKPIs.open}
                </span>
              </div>
            </div>

            {/* 3. Closed */}
            <div className="p-2.5 sm:p-3 rounded-2xl bg-[#FFFFFF] dark:bg-white/5 border border-[#E5DFD3] dark:border-white/10 shadow-2xs hover:shadow-xs transition-all flex flex-col items-center justify-center text-center group hover:border-[#10B981]/40 min-h-[72px]">
              <div className="flex items-center justify-center gap-1.5 text-center">
                <div className="w-5 h-5 rounded-lg bg-[#10B981]/10 text-[#10B981] flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-semibold text-[#4D4D4F] dark:text-slate-300">
                  Closed
                </span>
              </div>
              <div className="mt-1 flex items-center justify-center text-center">
                <span className="text-xl sm:text-2xl font-black text-[#10B981] font-mono leading-none">
                  {riskSummaryKPIs.closed}
                </span>
              </div>
            </div>

            {/* 4. New Risks */}
            <div className="p-2.5 sm:p-3 rounded-2xl bg-[#FFFFFF] dark:bg-white/5 border border-[#E5DFD3] dark:border-white/10 shadow-2xs hover:shadow-xs transition-all flex flex-col items-center justify-center text-center group hover:border-amber-500/40 min-h-[72px]">
              <div className="flex items-center justify-center gap-1.5 text-center">
                <div className="w-5 h-5 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-semibold text-[#4D4D4F] dark:text-slate-300 truncate">
                  New Risks
                </span>
              </div>
              <div className="mt-1 flex items-center justify-center text-center">
                <span className="text-xl sm:text-2xl font-black text-[#EA580C] font-mono leading-none">
                  {riskSummaryKPIs.newRisks}
                </span>
              </div>
            </div>

            {/* 5. Overdue */}
            <div className="p-2.5 sm:p-3 rounded-2xl bg-[#FFFFFF] dark:bg-white/5 border border-red-200 dark:border-red-900/40 shadow-2xs hover:shadow-xs transition-all flex flex-col items-center justify-center text-center group hover:border-[#E31837] min-h-[72px]">
              <div className="flex items-center justify-center gap-1.5 text-center">
                <div className="w-5 h-5 rounded-lg bg-red-50 dark:bg-red-950/40 text-[#E31837] flex items-center justify-center shrink-0">
                  <ShieldAlert className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-semibold text-[#E31837]">
                  Overdue
                </span>
              </div>
              <div className="mt-1 flex items-center justify-center text-center">
                <span className="text-xl sm:text-2xl font-black text-[#E31837] font-mono leading-none">
                  {riskSummaryKPIs.overdue}
                </span>
              </div>
            </div>
          </div>

          {/* 4-Tab Switcher Navigation Bar */}
          <div className="flex items-center gap-1 bg-[#F6F2EA]/60 dark:bg-white/5 p-1 rounded-2xl border border-[#E5DFD3] dark:border-white/10 shrink-0 my-1">
            <button
              onClick={() => setActiveTab('attention')}
              className={`flex-1 py-1.5 rounded-xl text-xs transition-all cursor-pointer font-bold text-center truncate ${activeTab === 'attention'
                ? 'bg-[#0A0838] text-white shadow-xs'
                : 'text-[#4D4D4F] dark:text-slate-300 hover:text-[#0A0838] hover:bg-white/80 dark:hover:bg-white/10'
                }`}
            >
              Requires Attention (43)
            </button>

            <button
              onClick={() => setActiveTab('notarget')}
              className={`flex-1 py-1.5 rounded-xl text-xs transition-all cursor-pointer font-bold text-center truncate ${activeTab === 'notarget'
                ? 'bg-[#0A0838] text-white shadow-xs'
                : 'text-[#4D4D4F] dark:text-slate-300 hover:text-[#0A0838] hover:bg-white/80 dark:hover:bg-white/10'
                }`}
            >
              No Target Date (24)
            </button>

            <button
              onClick={() => setActiveTab('schedule')}
              className={`flex-1 py-1.5 rounded-xl text-xs transition-all cursor-pointer font-bold text-center truncate ${activeTab === 'schedule'
                ? 'bg-[#0A0838] text-white shadow-xs'
                : 'text-[#4D4D4F] dark:text-slate-300 hover:text-[#0A0838] hover:bg-white/80 dark:hover:bg-white/10'
                }`}
            >
              Mitigation Schedule (25)
            </button>

            <button
              onClick={() => setActiveTab('closures')}
              className={`flex-1 py-1.5 rounded-xl text-xs transition-all cursor-pointer font-bold text-center truncate ${activeTab === 'closures'
                ? 'bg-[#0A0838] text-white shadow-xs'
                : 'text-[#4D4D4F] dark:text-slate-300 hover:text-[#0A0838] hover:bg-white/80 dark:hover:bg-white/10'
                }`}
            >
              Last 30 Days (4)
            </button>
          </div>

          {/* DYNAMIC TAB VISUAL WORKSPACE */}
          <div className="flex-1 p-3 sm:p-3.5 rounded-2xl bg-[#FFFFFF] dark:bg-white/5 border border-[#E5DFD3] dark:border-white/10 shadow-2xs flex flex-col justify-between min-h-0 overflow-hidden">

            {/* =================================================================
                TAB 1: REQUIRES ATTENTION - 43 (3D CYLINDER CAPSULE BARS)
               ================================================================= */}
            {activeTab === 'attention' && (
              <div className="h-full flex flex-col justify-between min-h-0">
                <div className="flex items-center justify-between pb-1.5 border-b border-[#E5DFD3]/70 dark:border-white/10 shrink-0">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#E31837]" />
                    <span className="text-xs font-bold text-[#0A0838] dark:text-white">
                      Requires Attention - 43 Total Risks
                    </span>
                  </div>
                  <span className="text-[10px] font-medium text-[#4D4D4F] dark:text-slate-400">
                    Hover over points to inspect details
                  </span>
                </div>

                <div className="flex-1 w-full flex flex-col justify-between px-4 py-3 my-1.5 rounded-2xl bg-white dark:bg-white/5 border border-[#E5DFD3] dark:border-white/10 relative min-h-0">

                  {/* Background Dashed Gridlines with Y-axis markers */}
                  <div className="absolute inset-x-4 inset-y-6 flex flex-col justify-between pointer-events-none">
                    {[12, 9, 6, 3, 0].map(v => (
                      <div key={v} className="w-full flex items-center">
                        <span className="w-6 text-[10px] font-mono font-medium text-slate-400 -mt-2.5 text-left">{v}</span>
                        <div className="flex-1 border-b border-dashed border-[#E5DFD3] dark:border-white/10 -mt-2.5" />
                      </div>
                    ))}
                  </div>

                  {/* 8 3D Cylindrical Capsule Bars spanning width */}
                  <div className="flex-1 flex items-end justify-between gap-2.5 pl-8 pr-3 relative z-10">
                    {risksRequiringAttention.map(item => {
                      const maxVal = 12;
                      const heightPct = Math.max(12, Math.round((item.count / maxVal) * 82));
                      const color = entityColors[item.entity] || '#3A59A4';

                      return (
                        <div key={item.entity} className="flex-1 flex flex-col items-center justify-end group h-full relative cursor-pointer">

                          {/* Floating Tooltip Card on Hover */}
                          <div className="absolute -top-14 opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none z-30 transform group-hover:-translate-y-1 scale-95 group-hover:scale-100">
                            <div className="px-3 py-1.5 rounded-xl bg-[#0A0838] text-white shadow-2xl border border-white/20 text-center whitespace-nowrap">
                              <div className="flex items-center justify-center gap-1.5 mb-0.5">
                                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                                <span className="text-xs font-bold">{item.entity}</span>
                              </div>
                              <span className="text-[11px] font-mono font-bold text-amber-300">
                                {item.count} {item.count === 1 ? 'Risk' : 'Risks'} Requiring Attention
                              </span>
                            </div>
                            <div className="w-2.5 h-2.5 bg-[#0A0838] transform rotate-45 mx-auto -mt-1 border-r border-b border-white/20" />
                          </div>

                          {/* Number Badge Floating on Top */}
                          <div className="px-2.5 py-0.5 rounded-md bg-white dark:bg-slate-800 shadow-2xs border border-[#E5DFD3]/80 dark:border-white/15 mb-2 transition-transform group-hover:scale-110">
                            <span className="text-xs font-black font-mono" style={{ color }}>
                              {item.count}
                            </span>
                          </div>

                          {/* 3D Cylindrical Capsule Bar */}
                          <div
                            className="w-10 sm:w-11 rounded-t-2xl rounded-b-xl relative overflow-hidden transition-all duration-300 group-hover:brightness-110 shadow-sm"
                            style={{
                              height: `${heightPct}%`,
                              background: `linear-gradient(180deg, ${color}ee 0%, ${color} 60%, ${color}cc 100%)`
                            }}
                          >
                            {/* Top 3D Oval Highlight Cap */}
                            <div className="absolute top-0 inset-x-0 h-3 rounded-full bg-white/35 backdrop-blur-xs" />
                            {/* Vertical Shimmer */}
                            <div className="absolute inset-y-0 left-1.5 w-1.5 bg-white/20 rounded-full blur-[0.5px]" />
                          </div>

                          {/* Entity Label */}
                          <span className="text-xs font-bold font-mono text-[#0A0838] dark:text-slate-200 mt-2.5 text-center truncate max-w-[55px] group-hover:text-[#E31837] transition-colors">
                            {item.entity === 'Other Entities' ? 'Other' : item.entity}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* =================================================================
                TAB 2: RISKS WITH NO TARGET DATE - 24
               ================================================================= */}
            {activeTab === 'notarget' && (
              <div className="h-full flex flex-col justify-between min-h-0">
                <div className="flex items-center justify-between pb-1.5 border-b border-[#E5DFD3]/70 dark:border-white/10 shrink-0">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#00A8A8]" />
                    <span className="text-xs font-bold text-[#0A0838] dark:text-white">
                      Risk with no target date - 24 Total Risks
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-[#4D4D4F] dark:text-slate-400">
                    Hover over segments to inspect details
                  </span>
                </div>

                <div className="flex-1 w-full flex flex-col md:flex-row items-center justify-around gap-6 p-3 sm:p-3.5 my-1.5 rounded-2xl bg-[#FAF8F5] dark:bg-white/5 border border-[#E5DFD3]/80 dark:border-white/10 relative min-h-0">

                  {/* Floating Tooltip Card Outside Donut Visual on Hover */}
                  {hoveredNoTarget && (
                    <div className="absolute top-2 left-1/2 -translate-x-1/2 z-30 animate-in fade-in zoom-in-95 duration-150 pointer-events-none">
                      <div className="px-3.5 py-1.5 rounded-xl bg-[#0A0838] text-white shadow-2xl border border-white/20 text-center whitespace-nowrap flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full shadow-xs" style={{ backgroundColor: hoveredNoTarget.color }} />
                        <span className="text-xs font-bold">{hoveredNoTarget.entity}</span>
                        <span className="text-slate-400">•</span>
                        <span className="text-xs font-mono font-bold text-amber-300">
                          {hoveredNoTarget.count} {hoveredNoTarget.count === 1 ? 'Risk' : 'Risks'} without target date
                        </span>
                      </div>
                      <div className="w-2.5 h-2.5 bg-[#0A0838] transform rotate-45 mx-auto -mt-1 border-r border-b border-white/20" />
                    </div>
                  )}

                  {/* Centered Interactive Donut */}
                  <div className="relative w-52 h-52 flex items-center justify-center shrink-0">
                    <svg className="w-full h-full transform -rotate-90 filter drop-shadow-md" viewBox="0 0 36 36">
                      {/* DHH: 11 / 24 = 45.83% -> dash = 37.43 */}
                      <circle
                        cx="18"
                        cy="18"
                        r="12.5"
                        fill="none"
                        stroke="#00A8A8"
                        strokeWidth="5.5"
                        strokeDasharray="37.43 44.25"
                        strokeDashoffset="0"
                        className="cursor-pointer transition-all duration-300 hover:opacity-85 hover:stroke-[6.5]"
                        onMouseEnter={() => setHoveredNoTarget({ entity: 'DHH', count: 11, color: '#00A8A8' })}
                        onMouseLeave={() => setHoveredNoTarget(null)}
                      />
                      {/* DHHQ: 9 / 24 = 37.50% -> dash = 30.63 */}
                      <circle
                        cx="18"
                        cy="18"
                        r="12.5"
                        fill="none"
                        stroke="#2E3842"
                        strokeWidth="5.5"
                        strokeDasharray="30.63 51.05"
                        strokeDashoffset="-37.43"
                        className="cursor-pointer transition-all duration-300 hover:opacity-85 hover:stroke-[6.5]"
                        onMouseEnter={() => setHoveredNoTarget({ entity: 'DHHQ', count: 9, color: '#2E3842' })}
                        onMouseLeave={() => setHoveredNoTarget(null)}
                      />
                      {/* DHE: 2 / 24 = 8.33% -> dash = 6.80 */}
                      <circle
                        cx="18"
                        cy="18"
                        r="12.5"
                        fill="none"
                        stroke="#38BDF8"
                        strokeWidth="5.5"
                        strokeDasharray="6.80 74.88"
                        strokeDashoffset="-68.06"
                        className="cursor-pointer transition-all duration-300 hover:opacity-85 hover:stroke-[6.5]"
                        onMouseEnter={() => setHoveredNoTarget({ entity: 'DHE', count: 2, color: '#38BDF8' })}
                        onMouseLeave={() => setHoveredNoTarget(null)}
                      />
                      {/* DHAM: 1 / 24 = 4.17% -> dash = 3.40 */}
                      <circle
                        cx="18"
                        cy="18"
                        r="12.5"
                        fill="none"
                        stroke="#64748B"
                        strokeWidth="5.5"
                        strokeDasharray="3.40 78.28"
                        strokeDashoffset="-74.86"
                        className="cursor-pointer transition-all duration-300 hover:opacity-85 hover:stroke-[6.5]"
                        onMouseEnter={() => setHoveredNoTarget({ entity: 'DHAM', count: 1, color: '#64748B' })}
                        onMouseLeave={() => setHoveredNoTarget(null)}
                      />
                      {/* Other Entities: 1 / 24 = 4.17% -> dash = 3.40 */}
                      <circle
                        cx="18"
                        cy="18"
                        r="12.5"
                        fill="none"
                        stroke="#F59E0B"
                        strokeWidth="5.5"
                        strokeDasharray="3.40 78.28"
                        strokeDashoffset="-78.26"
                        className="cursor-pointer transition-all duration-300 hover:opacity-85 hover:stroke-[6.5]"
                        onMouseEnter={() => setHoveredNoTarget({ entity: 'Other Entities', count: 1, color: '#F59E0B' })}
                        onMouseLeave={() => setHoveredNoTarget(null)}
                      />
                    </svg>

                    {/* Static Middle Display */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none p-3">
                      <span className="text-3xl font-black text-[#0A0838] dark:text-white font-mono leading-none">24</span>
                      <span className="text-[11px] text-[#00A8A8] font-bold uppercase tracking-wider mt-1">No Target Date</span>
                    </div>

                  </div>

                  {/* Right Side: Interactive Legend Breakdown */}
                  <div className="flex flex-col gap-1.5 p-3 sm:p-3.5 rounded-2xl bg-white dark:bg-white/5 border border-[#E5DFD3] dark:border-white/10 shadow-2xs w-full max-w-[240px]">
                    <div className="text-[10.5px] font-bold uppercase tracking-wider text-[#4D4D4F] dark:text-slate-400 border-b border-[#E5DFD3]/80 dark:border-white/10 pb-1 flex items-center justify-between">
                      <span>Entity Breakdown</span>
                      <span className="font-mono font-bold text-[#00A8A8]">24 Risks</span>
                    </div>

                    {[
                      { entity: 'DHH', count: 11, pct: '45.8%', color: '#00A8A8' },
                      { entity: 'DHHQ', count: 9, pct: '37.5%', color: '#2E3842' },
                      { entity: 'DHE', count: 2, pct: '8.3%', color: '#38BDF8' },
                      { entity: 'DHAM', count: 1, pct: '4.2%', color: '#64748B' },
                      { entity: 'Other Entities', count: 1, pct: '4.2%', color: '#F59E0B' },
                    ].map((item) => {
                      const isHovered = hoveredNoTarget?.entity === item.entity;
                      return (
                        <div
                          key={item.entity}
                          onMouseEnter={() => setHoveredNoTarget({ entity: item.entity, count: item.count, color: item.color })}
                          onMouseLeave={() => setHoveredNoTarget(null)}
                          className={`flex items-center justify-between px-2 py-1 rounded-xl transition-all cursor-pointer ${
                            isHovered
                              ? 'bg-[#0A0838]/10 dark:bg-white/15 scale-[1.02]'
                              : 'hover:bg-black/5 dark:hover:bg-white/5'
                          }`}
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="w-2.5 h-2.5 rounded-full shrink-0 shadow-xs" style={{ backgroundColor: item.color }} />
                            <span className="text-xs font-bold text-[#29251D] dark:text-white truncate">
                              {item.entity}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <span className="text-xs font-black font-mono text-[#0A0838] dark:text-white">
                              {item.count}
                            </span>
                            <span className="text-[10px] font-mono text-[#4D4D4F] dark:text-slate-400">
                              ({item.pct})
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                </div>
              </div>
            )}

            {/* =================================================================
                TAB 3: RISK MITIGATION SCHEDULE - 25
               ================================================================= */}
            {activeTab === 'schedule' && (
              <div className="h-full flex flex-col justify-between min-h-0">
                <div className="flex items-center justify-between pb-1.5 border-b border-[#E5DFD3]/70 dark:border-white/10 shrink-0">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" />
                    <span className="text-xs font-bold text-[#0A0838] dark:text-white">
                      Risk Mitigation Schedule - 25 Scheduled Risks
                    </span>
                  </div>
                  <button
                    onClick={() => setActiveModal('schedule')}
                    className="text-[10px] px-2.5 py-0.5 rounded bg-[#E31837] text-white font-semibold hover:bg-[#E31837]/80 transition-colors cursor-pointer"
                  >
                    View Detail
                  </button>
                </div>

                <div className="flex-1 w-full flex flex-col justify-between p-3 sm:p-3.5 my-1.5 rounded-2xl bg-white dark:bg-white/5 border border-[#E5DFD3] dark:border-white/10 relative min-h-0">

                  {/* Background Gridlines with value markers */}
                  <div className="absolute inset-x-4 inset-y-6 flex flex-col justify-between pointer-events-none opacity-25 dark:opacity-15">
                    <div className="border-b border-dashed border-slate-700 w-full flex items-center justify-between">
                      <span className="text-[9px] font-mono font-bold text-slate-500 -mt-3.5">6</span>
                    </div>
                    <div className="border-b border-dashed border-slate-700 w-full flex items-center justify-between">
                      <span className="text-[9px] font-mono font-bold text-slate-500 -mt-3.5">4</span>
                    </div>
                    <div className="border-b border-dashed border-slate-700 w-full flex items-center justify-between">
                      <span className="text-[9px] font-mono font-bold text-slate-500 -mt-3.5">2</span>
                    </div>
                    <div className="border-b border-slate-700 w-full flex items-center justify-between">
                      <span className="text-[9px] font-mono font-bold text-slate-500 -mt-3.5">0</span>
                    </div>
                  </div>

                  <div className="flex-1 flex items-end justify-around gap-6 px-4 relative z-10 pt-2">

                    {/* GROUP 1: Aug-26 (17 Total) */}
                    <div className="flex flex-col items-center justify-end h-full flex-1">
                      <div className="flex items-end justify-center gap-2.5 h-full w-full">
                        {[
                          { entity: 'DHAM', count: 6, color: '#64748B', height: '88%' },
                          { entity: 'DHE', count: 3, color: '#38BDF8', height: '44%' },
                          { entity: 'Merex', count: 3, color: '#2DD4BF', height: '44%' },
                          { entity: 'DHRE', count: 2, color: '#FB923C', height: '30%' },
                          { entity: 'DHGS', count: 1, color: '#A855F7', height: '16%' },
                          { entity: 'DHH', count: 1, color: '#00A8A8', height: '16%' },
                          { entity: 'DHHQ', count: 1, color: '#2E3842', height: '16%' },
                        ].map(item => (
                          <div key={item.entity} className="flex flex-col items-center group h-full justify-end relative cursor-pointer">
                            {/* Floating Tooltip on Hover */}
                            <div className="absolute -top-14 opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none z-30 transform group-hover:-translate-y-1 scale-95 group-hover:scale-100">
                              <div className="px-3 py-1.5 rounded-xl bg-[#0A0838] text-white shadow-2xl border border-white/20 text-center whitespace-nowrap">
                                <div className="flex items-center justify-center gap-1.5 mb-0.5">
                                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                                  <span className="text-xs font-bold">{item.entity} • Aug 2026</span>
                                </div>
                                <span className="text-[11px] font-mono font-bold text-amber-300">
                                  {item.count} Scheduled {item.count === 1 ? 'Risk' : 'Risks'}
                                </span>
                              </div>
                              <div className="w-2.5 h-2.5 bg-[#0A0838] transform rotate-45 mx-auto -mt-1 border-r border-b border-white/20" />
                            </div>

                            <span className="text-[10px] font-mono font-bold text-[#0A0838] dark:text-white mb-1 group-hover:scale-125 transition-transform">{item.count}</span>
                            <div className="w-6 rounded-t-md shadow-sm transition-all duration-300 group-hover:brightness-125 group-hover:w-7" style={{ height: item.height, backgroundColor: item.color }} />
                            <span className="text-[9px] font-mono font-bold text-slate-500 mt-1 truncate max-w-[32px]">{item.entity}</span>
                          </div>
                        ))}
                      </div>
                      <span className="text-xs font-mono font-bold text-[#0A0838] dark:text-white mt-2 px-3 py-1 rounded-md bg-[#0A0838]/10 dark:bg-white/10">
                        Aug 26 (17 Risks)
                      </span>
                    </div>

                    {/* GROUP 2: Sep-26 (7 Total) */}
                    <div className="flex flex-col items-center justify-end h-full">
                      <div className="flex items-end justify-center gap-3.5 h-full">
                        {[
                          { entity: 'DHE', count: 3, color: '#38BDF8', height: '44%' },
                          { entity: 'DHHQ', count: 4, color: '#F59E0B', height: '58%' },
                        ].map(item => (
                          <div key={item.entity} className="flex flex-col items-center group h-full justify-end relative cursor-pointer">
                            {/* Floating Tooltip on Hover */}
                            <div className="absolute -top-14 opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none z-30 transform group-hover:-translate-y-1 scale-95 group-hover:scale-100">
                              <div className="px-3 py-1.5 rounded-xl bg-[#0A0838] text-white shadow-2xl border border-white/20 text-center whitespace-nowrap">
                                <div className="flex items-center justify-center gap-1.5 mb-0.5">
                                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                                  <span className="text-xs font-bold">{item.entity} • Sep 2026</span>
                                </div>
                                <span className="text-[11px] font-mono font-bold text-amber-300">
                                  {item.count} Scheduled {item.count === 1 ? 'Risk' : 'Risks'}
                                </span>
                              </div>
                              <div className="w-2.5 h-2.5 bg-[#0A0838] transform rotate-45 mx-auto -mt-1 border-r border-b border-white/20" />
                            </div>

                            <span className="text-[10px] font-mono font-bold text-[#0A0838] dark:text-white mb-1 group-hover:scale-125 transition-transform">{item.count}</span>
                            <div className="w-7 rounded-t-md shadow-sm transition-all duration-300 group-hover:brightness-125 group-hover:w-8" style={{ height: item.height, backgroundColor: item.color }} />
                            <span className="text-[9px] font-mono font-bold text-slate-500 mt-1">{item.entity}</span>
                          </div>
                        ))}
                      </div>
                      <span className="text-xs font-mono font-bold text-[#0A0838] dark:text-white mt-2 px-3 py-1 rounded-md bg-[#0A0838]/10 dark:bg-white/10">
                        Sep 26 (7 Risks)
                      </span>
                    </div>

                    {/* GROUP 3: Oct-26 (1 Total) */}
                    <div className="flex flex-col items-center justify-end h-full">
                      <div className="flex items-end justify-center gap-3.5 h-full">
                        {[
                          { entity: 'DHHQ', count: 1, color: '#F59E0B', height: '16%' },
                        ].map(item => (
                          <div key={item.entity} className="flex flex-col items-center group h-full justify-end relative cursor-pointer">
                            {/* Floating Tooltip on Hover */}
                            <div className="absolute -top-14 opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none z-30 transform group-hover:-translate-y-1 scale-95 group-hover:scale-100">
                              <div className="px-3 py-1.5 rounded-xl bg-[#0A0838] text-white shadow-2xl border border-white/20 text-center whitespace-nowrap">
                                <div className="flex items-center justify-center gap-1.5 mb-0.5">
                                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                                  <span className="text-xs font-bold">{item.entity} • Oct 2026</span>
                                </div>
                                <span className="text-[11px] font-mono font-bold text-amber-300">
                                  {item.count} Scheduled {item.count === 1 ? 'Risk' : 'Risks'}
                                </span>
                              </div>
                              <div className="w-2.5 h-2.5 bg-[#0A0838] transform rotate-45 mx-auto -mt-1 border-r border-b border-white/20" />
                            </div>

                            <span className="text-[10px] font-mono font-bold text-[#0A0838] dark:text-white mb-1 group-hover:scale-125 transition-transform">{item.count}</span>
                            <div className="w-7 rounded-t-md shadow-sm transition-all duration-300 group-hover:brightness-125 group-hover:w-8" style={{ height: item.height, backgroundColor: item.color }} />
                            <span className="text-[9px] font-mono font-bold text-slate-500 mt-1">{item.entity}</span>
                          </div>
                        ))}
                      </div>
                      <span className="text-xs font-mono font-bold text-[#0A0838] dark:text-white mt-2 px-3 py-1 rounded-md bg-[#0A0838]/10 dark:bg-white/10">
                        Oct 26 (1 Risk)
                      </span>
                    </div>

                  </div>
                </div>
              </div>
            )}

            {/* =================================================================
                TAB 4: LAST 30 DAYS RISK CLOSURE - 4
               ================================================================= */}
            {activeTab === 'closures' && (
              <div className="h-full flex flex-col justify-between min-h-0">
                <div className="flex items-center justify-between pb-1.5 border-b border-[#E5DFD3]/70 dark:border-white/10 shrink-0">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#2E7D32]" />
                    <span className="text-xs font-bold text-[#0A0838] dark:text-white">
                      Last 30 days risk closure - 4 Total Closures
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-[#4D4D4F] dark:text-slate-400">
                    Hover over segments to inspect details
                  </span>
                </div>

                <div className="flex-1 w-full flex flex-col md:flex-row items-center justify-around gap-6 p-3 sm:p-3.5 my-1.5 rounded-2xl bg-[#FAF8F5] dark:bg-white/5 border border-[#E5DFD3]/80 dark:border-white/10 relative min-h-0">

                  {/* Floating Tooltip Card Outside Donut Visual on Hover */}
                  {hoveredClosure && (
                    <div className="absolute top-2 left-1/2 -translate-x-1/2 z-30 animate-in fade-in zoom-in-95 duration-150 pointer-events-none">
                      <div className="px-3.5 py-1.5 rounded-xl bg-[#0A0838] text-white shadow-2xl border border-white/20 text-center whitespace-nowrap flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full shadow-xs" style={{ backgroundColor: hoveredClosure.color }} />
                        <span className="text-xs font-bold">{hoveredClosure.dependency}</span>
                        <span className="text-slate-400">•</span>
                        <span className="text-xs font-mono font-bold text-green-300">
                          {hoveredClosure.count} {hoveredClosure.count === 1 ? 'Risk' : 'Risks'} Closed
                        </span>
                      </div>
                      <div className="w-2.5 h-2.5 bg-[#0A0838] transform rotate-45 mx-auto -mt-1 border-r border-b border-white/20" />
                    </div>
                  )}

                  {/* Left Side: Interactive Donut */}
                  <div className="relative w-52 h-52 flex items-center justify-center shrink-0">
                    <svg className="w-full h-full transform -rotate-90 filter drop-shadow-md" viewBox="0 0 36 36">
                      {/* Segment 1: Broadcom / VMware (2 / 4 = 50%) */}
                      <circle
                        cx="18"
                        cy="18"
                        r="12.5"
                        fill="none"
                        stroke="#2E7D32"
                        strokeWidth="5.5"
                        strokeDasharray="40.84 40.84"
                        strokeDashoffset="0"
                        className="cursor-pointer transition-all duration-300 hover:opacity-85 hover:stroke-[6.5]"
                        onMouseEnter={() => setHoveredClosure({ dependency: 'Broadcom / VMware License Dependency', count: 2, color: '#2E7D32' })}
                        onMouseLeave={() => setHoveredClosure(null)}
                      />
                      {/* Segment 2: Entity Dependency (1 / 4 = 25%) */}
                      <circle
                        cx="18"
                        cy="18"
                        r="12.5"
                        fill="none"
                        stroke="#F59E0B"
                        strokeWidth="5.5"
                        strokeDasharray="20.42 61.26"
                        strokeDashoffset="-40.84"
                        className="cursor-pointer transition-all duration-300 hover:opacity-85 hover:stroke-[6.5]"
                        onMouseEnter={() => setHoveredClosure({ dependency: 'Entity Dependency', count: 1, color: '#F59E0B' })}
                        onMouseLeave={() => setHoveredClosure(null)}
                      />
                      {/* Segment 3: Vendor / Technology (1 / 4 = 25%) */}
                      <circle
                        cx="18"
                        cy="18"
                        r="12.5"
                        fill="none"
                        stroke="#38BDF8"
                        strokeWidth="5.5"
                        strokeDasharray="20.42 61.26"
                        strokeDashoffset="-61.26"
                        className="cursor-pointer transition-all duration-300 hover:opacity-85 hover:stroke-[6.5]"
                        onMouseEnter={() => setHoveredClosure({ dependency: 'Vendor / Technology Validation', count: 1, color: '#38BDF8' })}
                        onMouseLeave={() => setHoveredClosure(null)}
                      />
                    </svg>

                    {/* Static Middle Display */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none p-3">
                      <span className="text-3xl font-black text-[#0A0838] dark:text-white font-mono leading-none">4</span>
                      <span className="text-[11px] text-[#2E7D32] font-bold uppercase tracking-wider mt-1">Closed</span>
                    </div>

                  </div>

                  {/* Right Side: Interactive Legend Breakdown */}
                  <div className="flex flex-col gap-1.5 p-3 sm:p-3.5 rounded-2xl bg-white dark:bg-white/5 border border-[#E5DFD3] dark:border-white/10 shadow-2xs w-full max-w-[340px] shrink-0">
                    <div className="text-[10.5px] font-bold uppercase tracking-wider text-[#4D4D4F] dark:text-slate-400 border-b border-[#E5DFD3]/80 dark:border-white/10 pb-1 flex items-center justify-between">
                      <span>Closure Categories</span>
                      <span className="font-mono font-bold text-[#2E7D32]">4 Closed</span>
                    </div>

                    {[
                      { dependency: 'VMware License Dependency', count: 2, pct: '50.0%', color: '#2E7D32' },
                      { dependency: 'Entity Dependency', count: 1, pct: '25.0%', color: '#F59E0B' },
                      { dependency: 'Vendor / Tech Validation', count: 1, pct: '25.0%', color: '#38BDF8' },
                    ].map((item) => {
                      const isHovered = hoveredClosure?.dependency?.includes(item.dependency) || hoveredClosure?.dependency === item.dependency;
                      return (
                        <div
                          key={item.dependency}
                          onMouseEnter={() => setHoveredClosure({ dependency: item.dependency, count: item.count, color: item.color })}
                          onMouseLeave={() => setHoveredClosure(null)}
                          className={`flex items-center justify-between px-2 py-1.5 rounded-xl transition-all cursor-pointer gap-2 ${
                            isHovered
                              ? 'bg-[#0A0838]/10 dark:bg-white/15 scale-[1.02]'
                              : 'hover:bg-black/5 dark:hover:bg-white/5'
                          }`}
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="w-2.5 h-2.5 rounded-full shrink-0 shadow-xs" style={{ backgroundColor: item.color }} />
                            <span className="text-xs font-bold text-[#29251D] dark:text-white whitespace-nowrap">
                              {item.dependency}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <span className="text-xs font-black font-mono text-[#0A0838] dark:text-white">
                              {item.count}
                            </span>
                            <span className="text-[10px] font-mono text-[#4D4D4F] dark:text-slate-400">
                              ({item.pct})
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                </div>
              </div>
            )}

          </div>

        </div>

        {/* =========================================================================
            SECTION 2 (RIGHT 5 COLS): OVERDUE RISK DETAIL (EXACT TREE FORMATTING)
            - Top Root Card: OVERDUE RISK [ 5 ]
            - Branching Lines & Arrows pointing down to 2 Category Cards:
              • [ 4 ] VMware License Dependency Card (Click to open Popup)
              • [ 1 ] Entity Dependency Card (Click to open Popup)
           ========================================================================= */}
        <div className="lg:col-span-5 flex flex-col justify-between bg-[#FFFFFF] dark:bg-white/5 rounded-2xl border border-[#E5DFD3] dark:border-white/10 p-3 sm:p-3.5 shadow-2xs overflow-hidden min-h-0">

          {/* Section 2 Header */}
          <div className="flex items-center justify-between pb-1.5 border-b border-[#E5DFD3]/80 dark:border-white/10 shrink-0">
            <h2 className="text-xs sm:text-sm font-bold text-[#29251D] dark:text-white flex items-center gap-2">
              <div className="w-5 h-5 rounded-lg bg-[#E31837]/10 text-[#E31837] flex items-center justify-center">
                <AlertTriangle className="w-3.5 h-3.5" />
              </div>
              <span>Overdue Risk Detail</span>
            </h2>
          </div>

          {/* VISUAL TREE HIERARCHY: ROOT [ 5 ] -> BRANCHES -> LEAVES [ 4 ] & [ 1 ] */}
          <div className="flex-1 flex flex-col justify-between my-2 min-h-0">

            {/* 1. TOP ROOT CARD: TOTAL OVERDUE (5) - Shifted upside */}
            <div
              onClick={() => setActiveModal('allOverdue')}
              className="w-full p-3 sm:p-3.5 rounded-2xl bg-red-50/40 dark:bg-red-950/20 border-2 border-red-200 dark:border-red-900/40 shadow-2xs hover:shadow-xs transition-all cursor-pointer group text-center mt-1"
            >
              <div className="flex items-center justify-center gap-1.5 mb-0.5">
                <AlertTriangle className="w-4 h-4 text-[#E31837]" />
                <span className="text-xs font-bold text-[#E31837] tracking-wide">
                  Overdue Risk
                </span>
              </div>
              <span className="text-4xl sm:text-5xl font-black text-[#E31837] font-mono leading-none block my-1">
                5
              </span>
            </div>

            {/* Branching Connector: Straight orthogonal lines — vertical stem, horizontal bar, vertical drops */}
            <div className="w-full flex items-center justify-center pointer-events-none" style={{ height: '80px' }}>
              <svg viewBox="0 0 300 80" preserveAspectRatio="xMidYMid meet" className="w-full h-full overflow-visible">
                <defs>
                  <marker id="arrow-left" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
                    <polygon points="0,0 8,4 0,8" fill="#0A0838" />
                  </marker>
                  <marker id="arrow-right" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
                    <polygon points="0,0 8,4 0,8" fill="#E31837" />
                  </marker>
                </defs>

                {/* Vertical stem straight down from center of root card */}
                <line x1="150" y1="0" x2="150" y2="28" stroke="#9CA3AF" strokeWidth="2.5" strokeDasharray="5 3" />

                {/* Horizontal crossbar across 25%–75% */}
                <line x1="75" y1="28" x2="225" y2="28" stroke="#9CA3AF" strokeWidth="2.5" />

                {/* Left junction dot */}
                <circle cx="75" cy="28" r="4" fill="#0A0838" />
                {/* Right junction dot */}
                <circle cx="225" cy="28" r="4" fill="#E31837" />

                {/* Left vertical drop — straight down with navy arrowhead */}
                <line x1="75" y1="28" x2="75" y2="72" stroke="#0A0838" strokeWidth="2.5" markerEnd="url(#arrow-left)" />

                {/* Right vertical drop — straight down with red arrowhead */}
                <line x1="225" y1="28" x2="225" y2="72" stroke="#E31837" strokeWidth="2.5" markerEnd="url(#arrow-right)" />
              </svg>
            </div>


            {/* 2. BOTTOM 2 LEAF NODES (VMware 4 vs Entity 1) */}
            <div className="grid grid-cols-2 gap-2.5 w-full mb-1">

              {/* CATEGORY 1: VMWARE LICENSE DEPENDENCY (4) */}
              <div
                onClick={() => setActiveModal('vmware')}
                className="p-3.5 sm:p-4 rounded-2xl bg-[#FFFFFF] dark:bg-white/5 border-2 border-amber-200/80 dark:border-amber-900/40 shadow-2xs hover:shadow-xs transition-all cursor-pointer group flex flex-col justify-between items-center text-center"
              >
                <div className="w-full flex flex-col items-center">
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-50 text-[#B54708] border border-amber-300">
                    High Impact
                  </span>

                  <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-[#0284C7] flex items-center justify-center my-1.5">
                    <HardDrive className="w-4 h-4" />
                  </div>

                  <span className="text-3xl sm:text-4xl font-black text-[#0A0838] dark:text-white font-mono leading-none my-0.5">
                    4
                  </span>

                  <h3 className="text-xs sm:text-sm font-bold text-[#29251D] dark:text-white group-hover:text-[#0284C7] transition-colors max-w-[140px] leading-tight my-1">
                    VMware License Dependency
                  </h3>
                </div>
              </div>

              {/* CATEGORY 2: ENTITY DEPENDENCY (1) */}
              <div
                onClick={() => setActiveModal('entity')}
                className="p-3.5 sm:p-4 rounded-2xl bg-[#FFFFFF] dark:bg-white/5 border-2 border-red-200/80 dark:border-red-900/40 shadow-2xs hover:shadow-xs transition-all cursor-pointer group flex flex-col justify-between items-center text-center"
              >
                <div className="w-full flex flex-col items-center">
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-red-50 text-[#E31837] border border-red-300">
                    Critical Impact
                  </span>

                  <div className="w-8 h-8 rounded-xl bg-red-50 dark:bg-red-950/40 text-[#E31837] flex items-center justify-center my-1.5">
                    <Building2 className="w-4 h-4" />
                  </div>

                  <span className="text-3xl sm:text-4xl font-black text-[#E31837] font-mono leading-none my-0.5">
                    1
                  </span>

                  <h3 className="text-xs sm:text-sm font-bold text-[#29251D] dark:text-white group-hover:text-[#E31837] transition-colors max-w-[140px] leading-tight my-1">
                    Entity Dependency
                  </h3>
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>

      {/* =========================================================================
          POPUP MODALS FOR SECTION 2 (VMWARE / ENTITY / ALL OVERDUE RISKS)
         ========================================================================= */}
      {(activeModal === 'vmware' || activeModal === 'entity' || activeModal === 'allOverdue') && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-[#FFFFFF] dark:bg-[#0A0838] border border-[#E5DFD3] dark:border-white/20 rounded-2xl w-full max-w-4xl max-h-[88vh] flex flex-col justify-between shadow-2xl p-5 overflow-hidden">

            {/* Modal Top Bar */}
            <div className="flex items-center justify-between pb-3 border-b border-[#E5DFD3] dark:border-white/10 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold ${activeModal === 'entity' ? 'bg-[#E31837]/10 text-[#E31837]' : 'bg-[#0A0838]/10 text-[#0A0838] dark:text-white'
                  }`}>
                  {activeModal === 'entity' ? <Building2 className="w-4 h-4" /> : <HardDrive className="w-4 h-4" />}
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#0A0838] dark:text-white">
                    {activeModal === 'vmware' && '4 Risks • VMware License Dependency'}
                    {activeModal === 'entity' && '1 Risk • Entity Dependency'}
                    {activeModal === 'allOverdue' && 'All 5 Overdue Risks'}
                  </h3>
                  <span className="text-[11px] text-[#4D4D4F] dark:text-slate-300">
                    Exact Overdue Risk Register with Remediation Plans
                  </span>
                </div>
              </div>

              <button
                onClick={() => setActiveModal(null)}
                className="w-8 h-8 rounded-full bg-[#F6F2EA] dark:bg-white/10 text-[#4D4D4F] dark:text-slate-300 hover:bg-[#E31837] hover:text-white dark:hover:bg-[#E31837] dark:hover:text-white border border-[#E5DFD3] dark:border-white/10 shadow-2xs flex items-center justify-center transition-all cursor-pointer"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body: Compact list showing only marked fields (Number, Name, Impact, Inspect) */}
            <div className="flex-1 py-3 overflow-y-auto space-y-2 min-h-0 pr-1">
              {(activeModal === 'vmware' ? vmwareRisks : activeModal === 'entity' ? entityRisks : overdueRisksList).map(risk => (
                <div
                  key={risk.id}
                  onClick={() => setSelectedRiskDetail(risk)}
                  className="p-3.5 rounded-xl bg-[#F6F2EA]/70 dark:bg-white/5 border border-[#E5DFD3] dark:border-white/10 hover:border-[#0A0838] dark:hover:border-white/40 hover:bg-white dark:hover:bg-white/10 hover:shadow-md transition-all cursor-pointer group flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-[#0A0838] text-white shrink-0 shadow-2xs">
                      {risk.riskNumber}
                    </span>
                    <span className="text-xs md:text-sm font-bold text-[#0A0838] dark:text-white group-hover:text-[#3A59A4] truncate">
                      {risk.riskName}
                    </span>
                  </div>

                  <div className="flex items-center gap-2.5 shrink-0">
                    <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full ${risk.potentialImpact === 'CRITICAL'
                      ? 'bg-[#FBDCE1] text-[#E31837] border border-[#EB5D73]'
                      : 'bg-amber-100 text-[#B54708] border border-amber-300'
                      }`}>
                      {risk.potentialImpact}
                    </span>
                    <span className="text-xs font-semibold text-[#3A59A4] dark:text-sky-300 group-hover:translate-x-1 transition-transform flex items-center gap-0.5">
                      Inspect <ChevronRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Modal Bottom Action Bar */}
            <div className="pt-3 border-t border-[#E5DFD3] dark:border-white/10 flex items-center justify-between shrink-0 text-xs">
              <span className="text-[#4D4D4F] dark:text-slate-400">
                Click any risk item above to view single detailed action plan
              </span>
              <button
                onClick={() => setActiveModal(null)}
                className="px-4 py-1.5 rounded-lg bg-[#0A0838] text-white !text-white text-xs font-semibold cursor-pointer hover:bg-[#0A0838]/80 transition-all"
                style={{ color: '#ffffff' }}
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

      {/* =========================================================================
          POPUP MODAL: RISK MITIGATION SCHEDULE (25 RISKS)
         ========================================================================= */}
      {activeModal === 'schedule' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-[#FFFFFF] dark:bg-[#0A0838] border border-[#E5DFD3] dark:border-white/20 rounded-2xl w-full max-w-3xl max-h-[85vh] flex flex-col justify-between shadow-2xl p-5 overflow-hidden">

            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#E5DFD3] dark:border-white/10 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center font-bold bg-[#F59E0B]/10 text-[#F59E0B]">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#0A0838] dark:text-white">
                    Risk Mitigation Schedule • 25 Risks
                  </h3>
                  <span className="text-[11px] text-[#4D4D4F] dark:text-slate-300">
                    Target closure milestones by entity &amp; month (Aug, Sep, Oct 2026)
                  </span>
                </div>
              </div>

              <button
                onClick={() => setActiveModal(null)}
                className="w-8 h-8 rounded-full bg-[#F6F2EA] dark:bg-white/10 text-[#4D4D4F] dark:text-slate-300 hover:bg-[#E31837] hover:text-white dark:hover:bg-[#E31837] dark:hover:text-white border border-[#E5DFD3] dark:border-white/10 shadow-2xs flex items-center justify-center transition-all cursor-pointer"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 py-3 overflow-y-auto space-y-2 min-h-0 pr-1">
              {riskMitigationSchedule.map((item, idx) => {
                const color = entityColors[item.entity] || '#3A59A4';
                return (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-[#F6F2EA]/70 dark:bg-white/5 border border-[#E5DFD3] dark:border-white/10 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-[#0A0838] text-white">
                        {item.monthLabel}
                      </span>
                      <span className="text-xs font-bold text-[#0A0838] dark:text-white flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
                        {item.entity}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-slate-200 dark:bg-white/10 text-[#0A0838] dark:text-white">
                        {item.count} {item.count === 1 ? 'Risk Scheduled' : 'Risks Scheduled'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Modal Footer */}
            <div className="pt-3 border-t border-[#E5DFD3] dark:border-white/10 flex items-center justify-between shrink-0 text-xs">
              <span className="text-[#4D4D4F] dark:text-slate-400">
                Total 25 Risks Scheduled across 3 milestone periods
              </span>
              <button
                onClick={() => setActiveModal(null)}
                className="px-4 py-1.5 rounded-lg bg-[#0A0838] text-white !text-white text-xs font-semibold cursor-pointer hover:bg-[#0A0838]/80 transition-all"
                style={{ color: '#ffffff' }}
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

      {/* =========================================================================
          POPUP MODAL: SINGLE RISK IN-DEPTH ACTION PLAN DRILLDOWN
         ========================================================================= */}
      {selectedRiskDetail && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-[#FFFFFF] dark:bg-[#0A0838] border border-[#E5DFD3] dark:border-white/20 rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto p-5 shadow-2xl space-y-4">

            {/* Modal Header */}
            <div className="flex items-start justify-between pb-3 border-b border-[#E5DFD3] dark:border-white/10">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-md bg-[#0A0838] text-white">
                    {selectedRiskDetail.riskNumber}
                  </span>
                  <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${selectedRiskDetail.potentialImpact === 'CRITICAL'
                    ? 'bg-[#FBDCE1] text-[#E31837] border border-[#EB5D73]'
                    : 'bg-amber-100 text-[#B54708] border border-amber-300'
                    }`}>
                    {selectedRiskDetail.potentialImpact} IMPACT
                  </span>
                </div>
                <h3 className="text-base font-bold text-[#0A0838] dark:text-white">
                  {selectedRiskDetail.riskName}
                </h3>
              </div>

              <button
                onClick={() => setSelectedRiskDetail(null)}
                className="w-8 h-8 rounded-full bg-[#F6F2EA] dark:bg-white/10 text-[#4D4D4F] dark:text-slate-300 hover:bg-[#E31837] hover:text-white dark:hover:bg-[#E31837] dark:hover:text-white border border-[#E5DFD3] dark:border-white/10 shadow-2xs flex items-center justify-center transition-all cursor-pointer"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Key Meta Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3 rounded-xl bg-[#F6F2EA] dark:bg-white/5 border border-[#E5DFD3] text-xs">
              <div>
                <span className="text-[#4D4D4F] dark:text-slate-400 block text-[10px]">Entity / Sub</span>
                <strong className="text-[#0A0838] dark:text-white">{selectedRiskDetail.entity} ({selectedRiskDetail.subEntity})</strong>
              </div>
              <div>
                <span className="text-[#4D4D4F] dark:text-slate-400 block text-[10px]">Expected Date</span>
                <strong className="text-[#0A0838] dark:text-white">{selectedRiskDetail.expectedDateOfClosure}</strong>
              </div>
              <div>
                <span className="text-[#4D4D4F] dark:text-slate-400 block text-[10px]">Accountable Lead</span>
                <strong className="text-[#0A0838] dark:text-white">{selectedRiskDetail.accountability}</strong>
              </div>
              <div>
                <span className="text-[#4D4D4F] dark:text-slate-400 block text-[10px]">Technical Owner</span>
                <strong className="text-[#0A0838] dark:text-white">{selectedRiskDetail.owner}</strong>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <h4 className="text-xs font-semibold text-[#0A0838] dark:text-white flex items-center gap-1.5">
                <Server className="w-3.5 h-3.5 text-[#3A59A4]" />
                Technical Risk Description
              </h4>
              <p className="text-xs text-[#29251D] dark:text-slate-300 leading-relaxed p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-[#E5DFD3]">
                {selectedRiskDetail.riskDescription}
              </p>
            </div>

            {/* Action Plan */}
            <div className="space-y-1.5">
              <h4 className="text-xs font-semibold text-[#0A0838] dark:text-white flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#2E7D32]" />
                Action Plan &amp; Remediation Workflow
              </h4>
              <p className="text-xs text-[#29251D] dark:text-slate-300 leading-relaxed p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-[#E5DFD3]">
                {selectedRiskDetail.actionPlan}
              </p>
            </div>

            {/* Modal Footer */}
            <div className="pt-2 flex items-center justify-between border-t border-[#E5DFD3] dark:border-white/10 text-xs">
              <span className="text-[#4D4D4F] dark:text-slate-400">Category: <strong>{selectedRiskDetail.category}</strong></span>
              <button
                onClick={() => setSelectedRiskDetail(null)}
                className="px-4 py-1.5 rounded-lg bg-[#0A0838] text-white !text-white text-xs font-semibold cursor-pointer hover:bg-[#0A0838]/80 transition-all"
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
