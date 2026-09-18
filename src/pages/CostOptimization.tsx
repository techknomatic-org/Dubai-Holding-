import React, { useState, useEffect } from 'react';
import { useLiveData } from '../hooks/useLiveData';
import { LiveDataBadge } from '../components/LiveDataBadge';
import { defaultCostOptimizationData, CostOptimizationModel, MonthlyAutomationSaving } from '../data/costOptimizationData';
import {
  BarChart3,
  Settings,
  Users,
  Trophy,
  TrendingUp,
  Calendar,
  Layers,
  Sparkles,
  Lightbulb,
  X,
  ExternalLink,
  DollarSign,
  ShieldCheck
} from 'lucide-react';

interface CostOptimizationProps {
  onNavigateToNext?: () => void;
  onNavigateToPrev?: () => void;
}

export const CostOptimization: React.FC<CostOptimizationProps> = ({
  onNavigateToNext,
  onNavigateToPrev
}) => {
  const { data: liveData, isLoading, isRefreshing, error, lastUpdatedDisplay, dataSource, refresh } = useLiveData();
  const [selectedMonth, setSelectedMonth] = useState<MonthlyAutomationSaving | null>(null);

  const costData: CostOptimizationModel = liveData?.costOptimization || defaultCostOptimizationData;
  const { kpis, trendSeries, automation, csi, grandTotal } = costData;

  const formatUSD = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(val);
  };

  const formatNumberUS = (val: number) => {
    return new Intl.NumberFormat('en-US').format(val);
  };

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedMonth(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // SVG Chart Geometry Calculations for Tall Left Section (viewBox 0 0 850 360)
  const chartW = 850;
  const chartH = 360;
  const padLeft = 70;
  const padRight = 70;
  const padTop = 50;
  const padBottom = 60;
  const plotW = chartW - padLeft - padRight;
  const plotH = chartH - padTop - padBottom;
  const maxY = 600000;

  const getX = (idx: number) => padLeft + (idx / 3) * plotW;
  const getY = (val: number) => padTop + plotH - (val / maxY) * plotH;

  // Points for Monthly (Teal) and Cumulative (Blue)
  const monthlyPoints = trendSeries.map((d, i) => ({
    x: getX(i),
    y: getY(d.monthlyAnnualSaving),
    val: d.monthlyAnnualSaving,
    month: d.monthLabel
  }));

  const cumulativePoints = trendSeries.map((d, i) => ({
    x: getX(i),
    y: getY(d.cumulativeAnnualSaving),
    val: d.cumulativeAnnualSaving,
    month: d.monthLabel
  }));

  const monthlyPath = monthlyPoints.reduce((acc, p, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`, '');
  const cumulativePath = cumulativePoints.reduce((acc, p, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`, '');

  const julyCumulative = cumulativePoints[3] || { x: getX(3), y: getY(485628) };

  return (
    <div className={`h-full w-full flex flex-col p-3.5 md:p-4 lg:p-5 gap-3 relative overflow-y-auto bg-[#FFFFFF] dark:bg-[#0A0838] text-[#29251D] dark:text-white transition-opacity duration-500 select-none ${isLoading ? 'opacity-70' : 'opacity-100'}`}>
      
      {/* 1. TOP HEADER */}
      <div className="shrink-0 flex items-center justify-between gap-4 pb-1 border-b border-[#E5DFD3] dark:border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <span className="w-2 h-2 rounded-full bg-[#0066B2] dark:bg-sky-400 animate-pulse" />
            <span className="text-xs font-medium text-[#0066B2] dark:text-sky-400">
              08 • Value Creation
            </span>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-[#29251D] dark:text-white">
            Cost Optimization
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

      {/* 2. TOP 4 KPI CARDS */}
      <div className="shrink-0">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {/* KPI 1: Total Annual Savings */}
          <div className="p-2.5 sm:p-3 rounded-2xl bg-white dark:bg-white/5 border border-[#0066B2]/20 dark:border-white/10 shadow-2xs hover:shadow-xs transition-all flex flex-col items-center justify-center text-center group">
            <div className="flex items-center justify-center gap-2 mb-1">
              <div className="w-6 h-6 rounded-lg bg-[#0066B2]/10 text-[#0066B2] dark:text-[#38BDF8] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-2xs">
                <BarChart3 className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-semibold text-[#4D4D4F] dark:text-slate-300 leading-tight">
                Total Annual Savings
              </span>
            </div>
            <span className="text-xl sm:text-2xl font-black text-[#0066B2] dark:text-white font-mono leading-none mt-0.5 block text-center">
              {formatUSD(kpis.totalAnnualSavings)}
            </span>
          </div>

          {/* KPI 2: Automation Savings */}
          <div className="p-2.5 sm:p-3 rounded-2xl bg-white dark:bg-white/5 border border-[#008080]/20 dark:border-white/10 shadow-2xs hover:shadow-xs transition-all flex flex-col items-center justify-center text-center group">
            <div className="flex items-center justify-center gap-2 mb-1">
              <div className="w-6 h-6 rounded-lg bg-[#008080]/10 text-[#008080] dark:text-[#2DD4BF] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-2xs">
                <Settings className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-semibold text-[#4D4D4F] dark:text-slate-300 leading-tight">
                Automation Savings
              </span>
            </div>
            <span className="text-xl sm:text-2xl font-black text-[#008080] dark:text-[#2DD4BF] font-mono leading-none mt-0.5 block text-center">
              {formatUSD(kpis.automationSavings)}
            </span>
          </div>

          {/* KPI 3: CSI Savings */}
          <div className="p-2.5 sm:p-3 rounded-2xl bg-white dark:bg-white/5 border border-[#0A0838]/20 dark:border-white/10 shadow-2xs hover:shadow-xs transition-all flex flex-col items-center justify-center text-center group">
            <div className="flex items-center justify-center gap-2 mb-1">
              <div className="w-6 h-6 rounded-lg bg-[#0A0838]/10 text-[#0A0838] dark:text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-2xs">
                <Users className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-semibold text-[#4D4D4F] dark:text-slate-300 leading-tight">
                CSI / Service Improvement Savings
              </span>
            </div>
            <span className="text-xl sm:text-2xl font-black text-[#0A0838] dark:text-white font-mono leading-none mt-0.5 block text-center">
              {formatUSD(kpis.csiSavings)}
            </span>
          </div>

          {/* KPI 4: Highest Month */}
          <div className="p-2.5 sm:p-3 rounded-2xl bg-white dark:bg-white/5 border border-[#0066B2]/20 dark:border-white/10 shadow-2xs hover:shadow-xs transition-all flex flex-col items-center justify-center text-center group relative">
            <div className="flex items-center justify-center gap-2 mb-1">
              <div className="w-6 h-6 rounded-lg bg-[#0066B2]/10 text-[#0066B2] dark:text-[#38BDF8] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-2xs">
                <Trophy className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-semibold text-[#4D4D4F] dark:text-slate-300 leading-tight">
                Highest Month
              </span>
              <span className="px-1.5 py-0.2 rounded-md bg-[#0066B2]/10 dark:bg-[#38BDF8]/15 text-[#0066B2] dark:text-[#38BDF8] text-[10px] font-bold tracking-wide border border-[#0066B2]/20 dark:border-white/10 shrink-0">
                {kpis.highestMonthName}
              </span>
            </div>
            <span className="text-xl sm:text-2xl font-black text-[#0066B2] dark:text-white font-mono leading-none mt-0.5 block text-center">
              {formatUSD(kpis.highestMonthValue)}
            </span>
          </div>

        </div>
      </div>

      {/* 3. MAIN DASHBOARD CONTENT (SIDE-BY-SIDE SPLIT) */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-3 min-h-0 items-stretch">
        
        {/* LEFT SECTION (7 cols): LARGE TALL ENHANCED TREND CHART */}
        <div className="lg:col-span-7 p-4 rounded-xl bg-white dark:bg-white/5 border border-[#E5DFD3] dark:border-white/10 shadow-xs flex flex-col justify-between relative min-h-[360px]">
          <div className="relative w-full flex-1 flex flex-col justify-center">
            <svg className="w-full h-full min-h-[290px]" viewBox={`0 0 ${chartW} ${chartH}`} preserveAspectRatio="none">
              <defs>
                <marker
                  id="arrowhead"
                  markerWidth="8"
                  markerHeight="8"
                  refX="7"
                  refY="4"
                  orient="auto"
                >
                  <polygon points="0 0, 8 4, 0 8" fill="#0066B2" />
                </marker>
              </defs>

              {/* Horizontal Grid Lines */}
              {[0, 100000, 200000, 300000, 400000, 500000, 600000].map((val) => {
                const y = getY(val);
                return (
                  <line
                    key={val}
                    x1={padLeft - 25}
                    y1={y}
                    x2={chartW - padRight + 25}
                    y2={y}
                    stroke="currentColor"
                    className="text-[#E5DFD3] dark:text-white/10"
                    strokeWidth="0.85"
                    strokeDasharray={val === 0 ? 'none' : '4 4'}
                  />
                );
              })}

              {/* X Axis Bottom Line */}
              <line
                x1={padLeft - 25}
                y1={getY(0)}
                x2={chartW - padRight + 25}
                y2={getY(0)}
                stroke="currentColor"
                className="text-[#4D4D4F]/40 dark:text-white/20"
                strokeWidth="1.5"
              />

              {/* X Labels */}
              {trendSeries.map((d, i) => (
                <text
                  key={d.monthKey}
                  x={getX(i)}
                  y={chartH - 22}
                  textAnchor="middle"
                  className="text-[13px] font-black fill-[#0A0838] dark:fill-slate-200"
                >
                  {d.monthLabel}
                </text>
              ))}

              {/* Teal Line (Monthly Annual Savings) */}
              <path
                d={monthlyPath}
                fill="none"
                stroke="#008080"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Dark Blue Line (Cumulative Annual Savings) */}
              <path
                d={cumulativePath}
                fill="none"
                stroke="#0066B2"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Monthly Nodes & Text */}
              {monthlyPoints.map((p, idx) => (
                <g key={`m-${idx}`}>
                  <circle cx={p.x} cy={p.y} r="6" fill="#008080" className="stroke-white dark:stroke-slate-900" strokeWidth="2" />
                  <text
                    x={p.x}
                    y={p.y + 18}
                    textAnchor="middle"
                    className="text-[11.5px] font-black fill-[#008080] dark:fill-[#2DD4BF]"
                  >
                    {formatUSD(p.val)}
                  </text>
                </g>
              ))}

              {/* Cumulative Nodes & Text */}
              {cumulativePoints.map((p, idx) => (
                <g key={`c-${idx}`}>
                  <circle cx={p.x} cy={p.y} r="6.5" fill="#0066B2" className="stroke-white dark:stroke-slate-900" strokeWidth="2" />
                  <text
                    x={p.x}
                    y={p.y - 12}
                    textAnchor="middle"
                    className="text-[11.5px] font-black fill-[#0066B2] dark:fill-[#38BDF8]"
                  >
                    {formatUSD(p.val)}
                  </text>
                </g>
              ))}
            </svg>

            {/* July Cumulative Acceleration Callout Box */}
            <div className="absolute right-4 top-2 max-w-[245px] p-2.5 rounded-xl bg-[#F0F7FF] dark:bg-white/10 border border-[#0066B2]/30 dark:border-white/20 shadow-xs flex flex-col gap-0.5 pointer-events-none">
              <div className="text-[11.5px] font-black text-[#0066B2] dark:text-[#38BDF8] flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Cumulative Apr 26 - Jul 26: {formatUSD(kpis.totalAnnualSavings)}</span>
              </div>
              <div className="text-[9.5px] text-[#4D4D4F] dark:text-slate-300 font-medium leading-tight">
                Strong acceleration driven mainly by Automation license optimization.
              </div>
            </div>

            {/* Chart Legend at bottom */}
            <div className="absolute left-1/2 -translate-x-1/2 bottom-0.5 flex items-center gap-8 text-[11px] font-bold text-[#4D4D4F] dark:text-slate-300">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#008080]" />
                <span>Monthly Annual Savings</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#0066B2]" />
                <span>Cumulative Annual Savings</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SECTION (5 cols): STACKED COMPRESSED CARDS */}
        <div className="lg:col-span-5 flex flex-col gap-2.5 min-h-0 justify-between">
          
          {/* 1. Automation – License Cost Saved (Compressed Card - Red Marked) */}
          <div className="p-2.5 rounded-xl bg-white dark:bg-white/5 border border-[#0066B2]/30 dark:border-white/10 shadow-xs flex flex-col shrink-0">
            <div className="shrink-0 bg-[#0066B2] text-white px-2.5 py-1 rounded-lg flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1.5">
                <Settings className="w-3.5 h-3.5 text-white" />
                <span className="text-[11px] sm:text-xs font-bold tracking-tight">
                  Automation – License Cost Saved
                </span>
              </div>
            </div>

            {/* 4 Compressed Monthly Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 items-stretch">
              {automation.monthlyBreakdowns.map((m) => (
                <div
                  key={m.monthKey}
                  onClick={() => setSelectedMonth(m)}
                  className="group relative p-1.5 sm:p-2 rounded-lg bg-[#F6F2EA]/80 dark:bg-white/5 border border-[#E5DFD3] dark:border-white/10 hover:border-[#0066B2] dark:hover:border-[#38BDF8] hover:shadow-xs transition-all duration-200 cursor-pointer flex flex-col items-center justify-center text-center gap-0.5"
                >
                  <div className="w-full flex items-center justify-between pb-0.5 border-b border-[#E5DFD3] dark:border-white/10">
                    <span className="font-black text-[10.5px] sm:text-[11px] text-[#0066B2] dark:text-[#38BDF8]">
                      {m.monthLabel}
                    </span>
                    <ExternalLink className="w-2.5 h-2.5 text-[#4D4D4F] group-hover:text-[#0066B2] dark:group-hover:text-[#38BDF8] transition-colors" />
                  </div>

                  <div className="py-0.5 flex flex-col items-center justify-center">
                    <div className="text-base sm:text-[17px] font-black text-[#0A0838] dark:text-white tracking-tight leading-tight">
                      {m.totalLicensesReleased}
                    </div>
                    <div className="text-[8.5px] sm:text-[9px] font-bold text-[#4D4D4F] dark:text-slate-400 leading-none mt-0.5">
                      Licenses released
                    </div>
                  </div>

                  <div className="w-full pt-0.5 border-t border-[#E5DFD3] dark:border-white/10 text-center">
                    <div className="text-[9.5px] sm:text-[10px] font-black text-[#008080] dark:text-[#2DD4BF] leading-tight">
                      {formatUSD(m.annualTotalSaving)}
                    </div>
                    <div className="text-[8px] text-[#4D4D4F] dark:text-slate-400 leading-none">
                      per year
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 2. CSI (Service Improvement) – Approved & Acknowledged by DH (Expanded Height & Larger Font - Yellow Marked) */}
          <div className="p-3 sm:p-3.5 rounded-xl bg-white dark:bg-white/5 border border-[#0066B2]/30 dark:border-white/10 shadow-xs flex flex-col justify-between flex-1 min-h-[220px]">
            <div className="shrink-0 bg-[#0066B2] text-white px-3 py-1.5 rounded-lg flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-white shrink-0" />
                <span className="text-xs sm:text-[13px] font-bold tracking-tight">
                  CSI (Service Improvement) – Approved &amp; Acknowledged by DH
                </span>
              </div>
            </div>

            {/* Initiative Card with Generous Height and Enhanced Font Size */}
            <div className="p-3 sm:p-3.5 rounded-xl bg-[#F0FDF4] dark:bg-white/5 border border-[#DCFCE7] dark:border-white/10 flex flex-col justify-between flex-1 mb-2">
              <div>
                <div className="font-bold text-xs sm:text-[13px] text-[#0A0838] dark:text-white leading-snug mb-1">
                  {csi.primaryInitiative.title}
                </div>
                <div className="font-bold text-xs sm:text-[12px] text-[#16A34A] dark:text-[#4ADE80] mb-1.5">
                  Benefits -
                </div>
                <div className="space-y-1 sm:space-y-1.5 text-[10.5px] sm:text-[11.5px] text-[#29251D] dark:text-slate-200 leading-relaxed">
                  {csi.primaryInitiative.benefits.map((b, idx) => (
                    <div key={idx} className="flex items-start gap-1.5">
                      <span className="font-bold text-[#0A0838] dark:text-sky-300 shrink-0">{idx + 1}.</span>
                      <span>{b}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Monthly Status Bar with Clear Larger Font */}
            <div className="py-1.5 px-3 rounded-lg bg-[#F6F2EA] dark:bg-white/5 border border-[#E5DFD3] dark:border-white/10 flex flex-wrap items-center gap-1.5 text-[10px] sm:text-[11px] text-[#4D4D4F] dark:text-slate-300 shrink-0">
              <Calendar className="w-3.5 h-3.5 text-[#0066B2] shrink-0" />
              <span className="font-bold text-[#0A0838] dark:text-white shrink-0">Monthly Status:</span>
              <div className="flex flex-wrap items-center gap-x-2">
                {csi.monthlyStatuses.map((s, idx) => (
                  <span key={idx}>
                    <strong className="text-[#0A0838] dark:text-white">{s.month}:</strong> {s.text} {idx < csi.monthlyStatuses.length - 1 ? '|' : ''}
                  </span>
                ))}
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* 5. INTERACTIVE MONTHLY BREAKDOWN POPUP MODAL */}
      {selectedMonth && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedMonth(null)}
        >
          <div
            className="bg-white dark:bg-[#0A0838] border border-[#0066B2]/40 dark:border-white/20 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-[#0066B2] text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                  <Settings className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="text-base font-black tracking-tight">
                    {selectedMonth.monthLabel} – License Cost Optimization
                  </h3>
                  <p className="text-xs text-white/80">
                    Itemized breakdown of released licenses and annualized cost savings
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedMonth(null)}
                className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Summary KPI Strip */}
            <div className="p-4 grid grid-cols-3 gap-3 bg-[#F6F2EA]/60 dark:bg-white/5 border-b border-[#E5DFD3] dark:border-white/10">
              <div className="p-2.5 rounded-xl bg-white dark:bg-white/5 border border-[#E5DFD3] dark:border-white/10 text-center">
                <div className="text-[10px] font-bold text-[#4D4D4F] dark:text-slate-400">
                  Total Licenses Released
                </div>
                <div className="text-lg font-black text-[#0A0838] dark:text-white mt-0.5">
                  {selectedMonth.totalLicensesReleased}
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-white dark:bg-white/5 border border-[#E5DFD3] dark:border-white/10 text-center">
                <div className="text-[10px] font-bold text-[#4D4D4F] dark:text-slate-400">
                  Monthly Savings
                </div>
                <div className="text-lg font-black text-[#008080] dark:text-[#2DD4BF] mt-0.5">
                  {formatUSD(selectedMonth.annualTotalSaving / 12)}
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-white dark:bg-white/5 border border-[#E5DFD3] dark:border-white/10 text-center">
                <div className="text-[10px] font-bold text-[#4D4D4F] dark:text-slate-400">
                  Annualized Savings
                </div>
                <div className="text-lg font-black text-[#0066B2] dark:text-[#38BDF8] mt-0.5">
                  {formatUSD(selectedMonth.annualTotalSaving)}
                </div>
              </div>
            </div>

            {/* Modal Itemized Table */}
            <div className="p-4 overflow-y-auto flex-1">
              <div className="text-xs font-bold text-[#0A0838] dark:text-white mb-2 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#0066B2]" />
                <span>License Release Breakdown</span>
              </div>

              <div className="space-y-2.5">
                {selectedMonth.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-[#F6F2EA]/40 dark:bg-white/5 border border-[#E5DFD3] dark:border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#0066B2]/10 text-[#0066B2] dark:text-[#38BDF8] font-bold flex items-center justify-center text-xs shrink-0">
                        #{idx + 1}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-[#0A0838] dark:text-white">
                          {item.licenseType}
                        </div>
                        <div className="text-xs text-[#4D4D4F] dark:text-slate-400">
                          {item.count} Licenses released &bull; Unit cost ${item.unitCostMonthly}/month
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 sm:text-right">
                      <div>
                        <div className="text-[10px] text-[#4D4D4F] dark:text-slate-400">Monthly</div>
                        <div className="text-xs font-bold text-[#0A0838] dark:text-slate-200">
                          {formatUSD(item.monthlySaving)}
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] text-[#4D4D4F] dark:text-slate-400">Annualized</div>
                        <div className="text-sm font-black text-[#0066B2] dark:text-[#38BDF8]">
                          {formatUSD(item.annualSaving)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-3 bg-[#F6F2EA] dark:bg-white/5 border-t border-[#E5DFD3] dark:border-white/10 flex items-center justify-end">
              <button
                onClick={() => setSelectedMonth(null)}
                className="px-4 py-1.5 rounded-lg bg-[#0066B2] text-white !text-white text-xs font-bold hover:bg-[#0066B2]/90 transition-colors cursor-pointer"
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

export default CostOptimization;

