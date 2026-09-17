import React, { useState } from 'react';
import { useLiveData } from '../hooks/useLiveData';
import { LiveDataBadge } from '../components/LiveDataBadge';
import { defaultProjectDeliveryData, ProjectDeliveryModel } from '../data/projectDeliveryData';
import {
  FileText,
  CheckCircle2,
  Settings,
  TrendingUp,
  Trophy,
  Users,
  Clock,
  BarChart3,
  Calendar,
  Sparkles,
  ChevronRight,
  Handshake,
  Target,
  Layers,
  Check,
  X,
  ArrowRight,
  Star
} from 'lucide-react';

function formatEstimatedDate(dateStr: string): string {
  if (!dateStr || dateStr.trim().toUpperCase() === 'NA') return 'NA';
  return dateStr
    .replace(/(\d+)(st|nd|rd|th)/i, '$1')
    .replace(/Sept\b/i, 'Sep')
    .replace(/August\b/i, 'Aug')
    .replace(/October\b/i, 'Oct')
    .replace(/November\b/i, 'Nov')
    .replace(/December\b/i, 'Dec')
    .replace(/January\b/i, 'Jan')
    .replace(/February\b/i, 'Feb')
    .replace(/March\b/i, 'Mar')
    .replace(/April\b/i, 'Apr')
    .replace(/June\b/i, 'Jun')
    .replace(/July\b/i, 'Jul')
    .trim();
}

interface ProjectDeliveryDashboardProps {
  onNavigateToNext?: () => void;
  onNavigateToPrev?: () => void;
}

export const ProjectDeliveryDashboard: React.FC<ProjectDeliveryDashboardProps> = ({
  onNavigateToNext,
  onNavigateToPrev
}) => {
  const { data: liveData, isLoading, isRefreshing, error, lastUpdatedDisplay, dataSource, refresh } = useLiveData();

  const projectData: ProjectDeliveryModel = liveData?.projectDelivery || defaultProjectDeliveryData;
  const { portfolioSummary, topProjects, spotlightProject } = projectData;

  const [isTasksModalOpen, setIsTasksModalOpen] = useState(false);
  const [activeTaskTab, setActiveTaskTab] = useState<'completed' | 'ongoing'>('completed');
  const [selectedProjectModal, setSelectedProjectModal] = useState<typeof topProjects[0] | null>(null);

  // Donut Gauge calculations (24% completion)
  const pct = spotlightProject.completionPct || 24;
  const radius = 42;
  const strokeWidth = 9.5;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (pct / 100) * circumference;

  return (
    <div className={`h-full w-full flex flex-col p-4 md:p-5 lg:p-6 gap-3.5 relative overflow-hidden bg-[#FFFFFF] dark:bg-[#0A0838] text-[#29251D] dark:text-white transition-opacity duration-500 select-none ${isLoading ? 'opacity-70' : 'opacity-100'}`}>
      
      {/* 1. TOP HEADER */}
      <div className="shrink-0 flex items-center justify-between gap-4 pb-2 border-b border-[#E5DFD3] dark:border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <span className="w-2 h-2 rounded-full bg-[#0066B2] dark:bg-sky-400 animate-pulse" />
            <span className="text-xs font-medium text-[#0066B2] dark:text-sky-400">
              06 • Delivery
            </span>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-[#29251D] dark:text-white">
            Demand to Project Delivery Dashboard
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

      {/* 2. TOP PROCESS FLOW (5 CONNECTED STAGES WITH DIRECTIONAL ARROWS) */}
      <div className="shrink-0 flex flex-col md:flex-row items-stretch gap-1.5 lg:gap-2">
        
        {/* STEP 1: Demand Raised & Confirmed */}
        <div className="flex-1 min-w-0 rounded-xl border border-[#0066B2]/30 bg-[#FFFFFF] dark:bg-white/5 shadow-2xs overflow-hidden flex flex-col justify-between">
          <div className="bg-[#0066B2] px-2.5 py-1.5 flex items-center gap-1.5 text-white">
            <div className="w-4.5 h-4.5 rounded-full bg-white text-[#0066B2] text-[11px] font-bold flex items-center justify-center shrink-0">
              1
            </div>
            <FileText className="w-3.5 h-3.5 text-white/90 shrink-0" />
            <span className="text-xs font-bold tracking-tight leading-snug">
              Demand Raised &amp; Confirmed
            </span>
          </div>
          <div className="p-2.5 space-y-1.5 text-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-[#4D4D4F] dark:text-slate-300">
                <Users className="w-3.5 h-3.5 text-[#0066B2]" />
                <span>Total Demands</span>
              </div>
              <span className="font-bold text-[#0066B2] dark:text-[#38BDF8] text-sm">
                {portfolioSummary.demands.total}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-[#4D4D4F] dark:text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#16A34A]" />
                <span>Closed in Jul&apos;26</span>
              </div>
              <span className="font-bold text-[#16A34A] text-sm">
                {portfolioSummary.demands.closedInJul}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-[#4D4D4F] dark:text-slate-300">
                <Clock className="w-3.5 h-3.5 text-[#D97706]" />
                <span>Work in Progress</span>
              </div>
              <span className="font-bold text-[#D97706] text-sm">
                {portfolioSummary.demands.workInProgress}
              </span>
            </div>
            <div className="flex items-center justify-between pt-1 border-t border-[#E5DFD3]/80 dark:border-white/10">
              <div className="flex items-center gap-1.5 text-[#4D4D4F] dark:text-slate-300">
                <BarChart3 className="w-3.5 h-3.5 text-[#0066B2]" />
                <span>Effort in Man-days</span>
              </div>
              <span className="font-bold text-[#0066B2] dark:text-[#38BDF8] text-sm">
                {portfolioSummary.demands.effortManDays}
              </span>
            </div>
          </div>
        </div>

        {/* Arrow 1 -> 2 */}
        <div className="hidden md:flex items-center justify-center shrink-0 self-center">
          <div className="w-5 h-5 rounded-full bg-[#0066B2]/10 dark:bg-white/10 flex items-center justify-center">
            <ArrowRight className="w-3 h-3 text-[#0066B2] dark:text-[#38BDF8]" />
          </div>
        </div>

        {/* STEP 2: Approval / Handover */}
        <div className="flex-1 min-w-0 rounded-xl border border-[#008080]/30 bg-[#FFFFFF] dark:bg-white/5 shadow-2xs overflow-hidden flex flex-col justify-between">
          <div className="bg-[#008080] px-2.5 py-1.5 flex items-center gap-1.5 text-white">
            <div className="w-4.5 h-4.5 rounded-full bg-white text-[#008080] text-[11px] font-bold flex items-center justify-center shrink-0">
              2
            </div>
            <CheckCircle2 className="w-3.5 h-3.5 text-white/90 shrink-0" />
            <span className="text-xs font-bold tracking-tight leading-snug">
              Approval / Handover
            </span>
          </div>
          <div className="p-3 flex flex-col items-center justify-center text-center flex-1 space-y-2">
            <div className="w-9 h-9 rounded-full bg-[#008080]/10 flex items-center justify-center text-[#008080] dark:text-[#2DD4BF]">
              <Handshake className="w-5 h-5" />
            </div>
            <p className="text-xs text-[#4D4D4F] dark:text-slate-300 font-medium leading-relaxed">
              Approved demand transitions into active project tracking
            </p>
          </div>
        </div>

        {/* Arrow 2 -> 3 */}
        <div className="hidden md:flex items-center justify-center shrink-0 self-center">
          <div className="w-5 h-5 rounded-full bg-[#008080]/10 dark:bg-white/10 flex items-center justify-center">
            <ArrowRight className="w-3 h-3 text-[#008080] dark:text-[#2DD4BF]" />
          </div>
        </div>

        {/* STEP 3: Project Created / Active Portfolio */}
        <div className="flex-1 min-w-0 rounded-xl border border-[#1D4ED8]/30 bg-[#FFFFFF] dark:bg-white/5 shadow-2xs overflow-hidden flex flex-col justify-between">
          <div className="bg-[#1D4ED8] px-2.5 py-1.5 flex items-center gap-1.5 text-white">
            <div className="w-4.5 h-4.5 rounded-full bg-white text-[#1D4ED8] text-[11px] font-bold flex items-center justify-center shrink-0">
              3
            </div>
            <Settings className="w-3.5 h-3.5 text-white/90 shrink-0" />
            <span className="text-xs font-bold tracking-tight leading-snug">
              Project Created / Active Portfolio
            </span>
          </div>
          <div className="p-2.5 space-y-1.5 text-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-[#4D4D4F] dark:text-slate-300">
                <Users className="w-3.5 h-3.5 text-[#1D4ED8]" />
                <span>Total Projects</span>
              </div>
              <span className="font-bold text-[#1D4ED8] dark:text-[#60A5FA] text-sm">
                {portfolioSummary.projects.total}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-[#4D4D4F] dark:text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#16A34A]" />
                <span>Closed in Jul&apos;26</span>
              </div>
              <span className="font-bold text-[#16A34A] text-sm">
                {portfolioSummary.projects.closedInJul}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-[#4D4D4F] dark:text-slate-300">
                <Clock className="w-3.5 h-3.5 text-[#D97706]" />
                <span>Work in Progress</span>
              </div>
              <span className="font-bold text-[#D97706] text-sm">
                {portfolioSummary.projects.workInProgress}
              </span>
            </div>
            <div className="flex items-center justify-between pt-1 border-t border-[#E5DFD3]/80 dark:border-white/10">
              <div className="flex items-center gap-1.5 text-[#4D4D4F] dark:text-slate-300">
                <BarChart3 className="w-3.5 h-3.5 text-[#1D4ED8]" />
                <span>Effort in Man-days</span>
              </div>
              <span className="font-bold text-[#1D4ED8] dark:text-[#60A5FA] text-sm">
                {portfolioSummary.projects.effortManDays}
              </span>
            </div>
          </div>
        </div>

        {/* Arrow 3 -> 4 */}
        <div className="hidden md:flex items-center justify-center shrink-0 self-center">
          <div className="w-5 h-5 rounded-full bg-[#0284C7]/10 dark:bg-white/10 flex items-center justify-center">
            <ArrowRight className="w-3 h-3 text-[#0284C7] dark:text-sky-400" />
          </div>
        </div>

        {/* STEP 4: Execution Tracking */}
        <div className="flex-1 min-w-0 rounded-xl border border-[#0284C7]/30 bg-[#FFFFFF] dark:bg-white/5 shadow-2xs overflow-hidden flex flex-col justify-between">
          <div className="bg-[#0284C7] px-2.5 py-1.5 flex items-center gap-1.5 text-white">
            <div className="w-4.5 h-4.5 rounded-full bg-white text-[#0284C7] text-[11px] font-bold flex items-center justify-center shrink-0">
              4
            </div>
            <TrendingUp className="w-3.5 h-3.5 text-white/90 shrink-0" />
            <span className="text-xs font-bold tracking-tight leading-snug">
              Execution Tracking
            </span>
          </div>
          <div className="p-2.5 space-y-1.5 text-xs">
            <div className="text-[11px] font-semibold text-[#4D4D4F] dark:text-slate-400">
              Active Projects / Demands
            </div>
            {topProjects.map((p) => (
              <div
                key={p.id}
                onClick={() => setSelectedProjectModal(p)}
                className="flex items-start gap-1.5 py-0.5 px-1 rounded-md hover:bg-slate-100 dark:hover:bg-white/10 cursor-pointer transition-colors"
              >
                <span className="w-4 h-4 rounded-full bg-[#0284C7] text-white text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {p.id}
                </span>
                <span className="text-[11px] font-medium text-[#29251D] dark:text-slate-200 leading-tight" title={p.projectName}>
                  {p.projectName}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Arrow 4 -> 5 */}
        <div className="hidden md:flex items-center justify-center shrink-0 self-center">
          <div className="w-5 h-5 rounded-full bg-[#16A34A]/10 dark:bg-white/10 flex items-center justify-center">
            <ArrowRight className="w-3 h-3 text-[#16A34A] dark:text-[#4ADE80]" />
          </div>
        </div>

        {/* STEP 5: Closure / Outcome Visibility */}
        <div className="flex-1 min-w-0 rounded-xl border border-[#16A34A]/30 bg-[#FFFFFF] dark:bg-white/5 shadow-2xs overflow-hidden flex flex-col justify-between">
          <div className="bg-[#16A34A] px-2.5 py-1.5 flex items-center gap-1.5 text-white">
            <div className="w-4.5 h-4.5 rounded-full bg-white text-[#16A34A] text-[11px] font-bold flex items-center justify-center shrink-0">
              5
            </div>
            <Trophy className="w-3.5 h-3.5 text-white/90 shrink-0" />
            <span className="text-xs font-bold tracking-tight leading-snug">
              Closure / Outcome Visibility
            </span>
          </div>
          <div className="p-3 flex flex-col items-center justify-center text-center flex-1 space-y-2">
            <div className="w-9 h-9 rounded-full bg-[#16A34A]/10 flex items-center justify-center text-[#16A34A]">
              <Target className="w-5 h-5" />
            </div>
            <p className="text-xs text-[#4D4D4F] dark:text-slate-300 font-medium leading-relaxed">
              Closures and progress are continuously tracked via project drill-downs and completion metrics.
            </p>
          </div>
        </div>

      </div>

      {/* 3. MAIN DASHBOARD CONTENT (TOP PROJECTS TABLE + QUALYS PROJECT STATUS) */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-3.5 min-h-0 items-stretch">
        
        {/* LEFT SECTION (6 cols): TOP PROJECTS & DEMANDS SUMMARY TABLE */}
        <div className="lg:col-span-6 p-4 rounded-2xl bg-[#FFFFFF] dark:bg-white/5 border border-[#E5DFD3] dark:border-white/10 shadow-xs flex flex-col justify-between min-h-0 overflow-hidden">
          
          {/* Card Header */}
          <div className="flex items-center gap-2 pb-2.5 border-b border-[#E5DFD3] dark:border-white/10 shrink-0">
            <div className="w-7 h-7 rounded-lg bg-[#0066B2]/10 text-[#0066B2] flex items-center justify-center font-bold">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#0A0838] dark:text-white leading-none">
                Projects &amp; Demands Summary
              </h2>
            </div>
          </div>

          {/* Full-Height Table Container displaying all 4 projects */}
          <div className="flex-1 flex flex-col justify-center pt-2 min-h-0">
            <div className="overflow-hidden rounded-xl border border-[#E5DFD3]/80 dark:border-white/10 bg-white dark:bg-transparent shadow-2xs">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#F6F2EA] dark:bg-white/10 text-[#4D4D4F] dark:text-slate-300 font-semibold border-b border-[#E5DFD3] dark:border-white/10">
                    <th className="py-2.5 px-3 text-center w-8">#</th>
                    <th className="py-2.5 px-3">Project Name</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-center">Efforts (Days)</th>
                    <th className="py-2.5 px-3 text-center">Estimated Completion</th>
                    <th className="py-2.5 px-3">Team Engaged</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5DFD3]/70 dark:divide-white/5">
                  {topProjects.map((p) => {
                    const isCompleted = p.status.toLowerCase().includes('completed');
                    const displayStatus = isCompleted ? 'Completed' : 'In Progress';
                    return (
                      <tr
                        key={p.id}
                        onClick={() => setSelectedProjectModal(p)}
                        className="hover:bg-[#F0F7FF] dark:hover:bg-white/5 transition-colors cursor-pointer group"
                      >
                        <td className="py-3.5 px-3 text-center font-bold text-[#4D4D4F] dark:text-slate-400">
                          <span className="w-5 h-5 rounded-full bg-[#F6F2EA] dark:bg-white/10 text-[#0A0838] dark:text-slate-200 inline-flex items-center justify-center text-[11px] font-bold">
                            {p.id}
                          </span>
                        </td>
                        <td className="py-3.5 px-3 font-bold text-[#29251D] dark:text-white group-hover:text-[#0066B2] dark:group-hover:text-[#38BDF8] transition-colors">
                          {p.projectName}
                        </td>
                        <td className="py-3.5 px-3">
                          <div className="flex items-center gap-2">
                            <span className="relative flex h-2.5 w-2.5 shrink-0">
                              <span
                                className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                                  isCompleted ? 'bg-emerald-400' : 'bg-amber-400'
                                }`}
                              />
                              <span
                                className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                                  isCompleted ? 'bg-[#16A34A]' : 'bg-[#D97706]'
                                }`}
                              />
                            </span>
                            <span className={`text-[11.5px] font-medium leading-tight ${
                              isCompleted ? 'text-[#16A34A] font-semibold' : 'text-[#D97706] font-medium'
                            }`}>
                              {displayStatus}
                            </span>
                          </div>
                        </td>
                        <td className="py-3.5 px-3 text-center font-bold text-[#0066B2] dark:text-[#38BDF8] text-sm">
                          {p.effortsManDays}
                        </td>
                        <td className="py-3.5 px-3 text-center font-medium text-[#4D4D4F] dark:text-slate-300 text-[11.5px]">
                          <span className="inline-block px-2 py-0.5 rounded bg-[#F6F2EA] dark:bg-white/5 border border-[#E5DFD3]/60 dark:border-white/5">
                            {formatEstimatedDate(p.estimatedCompletionDate)}
                          </span>
                        </td>
                        <td className="py-3.5 px-3 font-semibold text-[#0066B2] dark:text-[#38BDF8] text-[11.5px]">
                          {p.teamEngaged}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* RIGHT SECTION (6 cols): SPOTLIGHT PROJECT STATUS */}
        <div className="lg:col-span-6 p-4 rounded-2xl bg-[#FFFFFF] dark:bg-white/5 border border-[#0066B2]/30 dark:border-white/10 shadow-xs flex flex-col justify-between min-h-0 overflow-hidden gap-3">
          
          {/* Spotlight Project Header */}
          <div className="flex items-center justify-between pb-2 border-b border-[#E5DFD3] dark:border-white/10 shrink-0">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-[#0A0838] dark:text-white leading-none">
                {spotlightProject.projectName}
              </h2>
            </div>
            <div className="px-3 py-1 rounded-xl bg-[#F6F2EA] dark:bg-white/10 border border-[#E5DFD3] dark:border-white/15 shadow-2xs flex items-center gap-1.5 shrink-0">
              <Calendar className="w-3.5 h-3.5 text-[#0066B2] dark:text-[#38BDF8]" />
              <span className="text-xs font-semibold text-[#0A0838] dark:text-white tracking-tight">
                {spotlightProject.snapshotMonth}
              </span>
            </div>
          </div>

          {/* MAIN ROW: Donut Gauge (Left) + 2x2 Grid of 4 Cards (Right) */}
          <div className="grid grid-cols-12 gap-3 items-center flex-1 min-h-0">
            
            {/* Donut Gauge (5 cols) */}
            <div className="col-span-5 h-full min-h-[175px] flex flex-col items-center justify-center p-2 sm:p-3 rounded-2xl bg-[#F6F2EA]/60 dark:bg-white/5 border border-[#E5DFD3] dark:border-white/10 shadow-2xs">
              <div className="relative w-36 h-36 sm:w-40 sm:h-40 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  {/* Track */}
                  <circle
                    cx="50"
                    cy="50"
                    r={radius}
                    className="stroke-[#E5DFD3] dark:stroke-white/10"
                    strokeWidth={strokeWidth}
                    fill="transparent"
                  />
                  {/* Fill */}
                  <circle
                    cx="50"
                    cy="50"
                    r={radius}
                    className="stroke-[#0066B2] transition-all duration-1000 ease-out"
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    fill="transparent"
                  />
                </svg>
                {/* Center text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-3xl sm:text-3xl font-black text-[#0A0838] dark:text-white tracking-tight leading-none">
                    {pct}%
                  </span>
                  <span className="text-[11px] font-bold text-[#4D4D4F] dark:text-slate-400 mt-1">
                    complete
                  </span>
                </div>
              </div>
            </div>

            {/* 2x2 Grid of 4 Compact Tiles (7 cols) */}
            <div className="col-span-7 grid grid-cols-2 gap-2.5 h-full">
              
              {/* Tile 1: Start Date */}
              <div className="p-3 rounded-2xl bg-white dark:bg-white/5 border border-[#E5DFD3] dark:border-white/10 shadow-2xs flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#F0F7FF] dark:bg-white/10 flex items-center justify-center shrink-0 border border-[#DBEAFE]/80 dark:border-white/10">
                  <Calendar className="w-4 h-4 text-[#0066B2] dark:text-[#38BDF8]" />
                </div>
                <div>
                  <div className="text-[10px] text-[#4D4D4F] dark:text-slate-400 font-medium leading-none">Start Date</div>
                  <div className="text-xs font-bold text-[#0A0838] dark:text-white mt-1 leading-none">{spotlightProject.planStartDateFormatted}</div>
                </div>
              </div>

              {/* Tile 2: Planned End Date */}
              <div className="p-3 rounded-2xl bg-white dark:bg-white/5 border border-[#E5DFD3] dark:border-white/10 shadow-2xs flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#F0F7FF] dark:bg-white/10 flex items-center justify-center shrink-0 border border-[#DBEAFE]/80 dark:border-white/10">
                  <Calendar className="w-4 h-4 text-[#0066B2] dark:text-[#38BDF8]" />
                </div>
                <div>
                  <div className="text-[10px] text-[#4D4D4F] dark:text-slate-400 font-medium leading-none">Planned End Date</div>
                  <div className="text-xs font-bold text-[#0A0838] dark:text-white mt-1 leading-none">{spotlightProject.planEndDateFormatted}</div>
                </div>
              </div>

              {/* Tile 3: Completed Tasks */}
              <div
                onClick={() => {
                  setActiveTaskTab('completed');
                  setIsTasksModalOpen(true);
                }}
                className="p-3 rounded-2xl bg-white dark:bg-white/5 border border-[#E5DFD3] dark:border-white/10 shadow-2xs flex items-center gap-2.5 cursor-pointer hover:border-[#16A34A] hover:shadow-md transition-all group"
              >
                <div className="w-8 h-8 rounded-full bg-[#16A34A] text-white flex items-center justify-center shrink-0 shadow-2xs">
                  <Check className="w-4 h-4 stroke-[3]" />
                </div>
                <div>
                  <div className="text-[10px] text-[#4D4D4F] dark:text-slate-400 font-medium leading-none">Completed Tasks</div>
                  <div className="text-base font-black text-[#16A34A] mt-1 leading-none">{spotlightProject.completedTaskCount}</div>
                </div>
              </div>

              {/* Tile 4: Ongoing Tasks */}
              <div
                onClick={() => {
                  setActiveTaskTab('ongoing');
                  setIsTasksModalOpen(true);
                }}
                className="p-3 rounded-2xl bg-white dark:bg-white/5 border border-[#E5DFD3] dark:border-white/10 shadow-2xs flex items-center gap-2.5 cursor-pointer hover:border-[#D97706] hover:shadow-md transition-all group"
              >
                <div className="w-8 h-8 rounded-full bg-[#D97706] text-white flex items-center justify-center shrink-0 shadow-2xs">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[10px] text-[#4D4D4F] dark:text-slate-400 font-medium leading-none">Ongoing Tasks</div>
                  <div className="text-base font-black text-[#D97706] mt-1 leading-none">{spotlightProject.ongoingTaskCount}</div>
                </div>
              </div>

            </div>

          </div>

          {/* BOTTOM: Horizontal Timeline Bar */}
          <div className="p-2.5 rounded-xl bg-[#F6F2EA]/80 dark:bg-white/5 border border-[#E5DFD3] dark:border-white/10 shrink-0">
            <div className="relative flex items-center justify-between px-4 py-0.5">
              {/* Connecting Line */}
              <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-1 bg-[#E5DFD3] dark:bg-white/10 rounded-full z-0" />
              <div className="absolute left-6 w-[28%] top-1/2 -translate-y-1/2 h-1 bg-[#0066B2] rounded-full z-0" />

              {/* Node 1: Jul 2026 */}
              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="text-[9.5px] font-semibold text-[#4D4D4F] dark:text-slate-400 mb-0.5">Jul 2026</div>
                <div className="w-3 h-3 rounded-full bg-[#0066B2] ring-2 ring-white dark:ring-slate-900" />
                <div className="text-[9.5px] font-bold text-[#0A0838] dark:text-white mt-0.5">Project Start</div>
                <div className="text-[8.5px] text-[#4D4D4F] dark:text-slate-400">13 Jul 2026</div>
              </div>

              {/* Node 2: Aug 2026 (Current) */}
              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="text-[9.5px] font-bold text-[#0066B2] dark:text-[#38BDF8] mb-0.5">Aug 2026</div>
                <div className="w-3.5 h-3.5 rounded-full bg-[#0066B2] ring-3 ring-[#0066B2]/20 animate-pulse" />
                <div className="text-[9.5px] font-bold text-[#0066B2] dark:text-[#38BDF8] mt-0.5">Current</div>
                <div className="text-[8.5px] font-semibold text-[#0066B2] dark:text-[#38BDF8]">(24% complete)</div>
              </div>

              {/* Node 3: Sep 2026 */}
              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="text-[9.5px] font-semibold text-[#4D4D4F] dark:text-slate-400 mb-0.5">Sep 2026</div>
                <div className="w-3 h-3 rounded-full bg-[#94A3B8] ring-2 ring-white dark:ring-slate-900" />
                <div className="text-[9.5px] font-medium text-[#4D4D4F] dark:text-slate-400 mt-0.5">Rollout Phase</div>
                <div className="text-[8.5px] text-[#4D4D4F] dark:text-slate-400">UAT &amp; Prod</div>
              </div>

              {/* Node 4: Oct 2026 (Planned End Milestone) */}
              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="text-[9.5px] font-semibold text-[#4D4D4F] dark:text-slate-400 mb-0.5">Oct 2026</div>
                <div className="w-3 h-3 rounded-full bg-[#475569] dark:bg-slate-300 ring-2 ring-white dark:ring-slate-900" />
                <div className="text-[9.5px] font-bold text-[#0A0838] dark:text-white mt-0.5">Planned End</div>
                <div className="text-[8.5px] text-[#4D4D4F] dark:text-slate-400">09 Oct 2026</div>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* 4. MODAL: FULL TASK BREAKDOWN EXPLORER (NAVIGATION DRILL-DOWN) */}
      {isTasksModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-3xl bg-white dark:bg-[#0A0838] rounded-2xl shadow-2xl border border-[#E5DFD3] dark:border-white/10 overflow-hidden flex flex-col max-h-[88vh]">
            
            {/* Modal Header */}
            <div className="p-4 bg-[#0066B2] text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-amber-300" />
                </div>
                <div>
                  <h3 className="font-bold text-base leading-tight">
                    Qualys Patch Management — Detailed Work Breakdown
                  </h3>
                  <p className="text-xs text-blue-100 mt-0.5">
                    Interactive drill-down of all completed foundation items &amp; active deployment tasks
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsTasksModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Tab Selector Navigation */}
            <div className="p-3 bg-[#F6F2EA] dark:bg-white/5 border-b border-[#E5DFD3] dark:border-white/10 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTaskTab('completed')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                    activeTaskTab === 'completed'
                      ? 'bg-[#16A34A] text-white shadow-xs'
                      : 'bg-white dark:bg-white/10 text-[#4D4D4F] dark:text-slate-300 hover:bg-[#F0FDF4]'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Completed Tasks ({spotlightProject.completedTaskCount})</span>
                </button>
                <button
                  onClick={() => setActiveTaskTab('ongoing')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                    activeTaskTab === 'ongoing'
                      ? 'bg-[#D97706] text-white shadow-xs'
                      : 'bg-white dark:bg-white/10 text-[#4D4D4F] dark:text-slate-300 hover:bg-[#FFF7ED]'
                  }`}
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>Ongoing Tasks ({spotlightProject.ongoingTaskCount})</span>
                </button>
              </div>
            </div>

            {/* Task Content List */}
            <div className="p-4 overflow-y-auto space-y-2 flex-1">
              {activeTaskTab === 'completed' ? (
                <div className="space-y-2">
                  <div className="p-2.5 rounded-lg bg-[#F0FDF4] dark:bg-white/5 border border-[#DCFCE7] dark:border-white/10 text-xs text-[#16A34A] font-semibold flex items-center gap-2">
                    <Check className="w-4 h-4" />
                    <span>All 7 Foundation &amp; Design Milestones Successfully Closed</span>
                  </div>
                  {spotlightProject.completedTasks.map((task, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-white dark:bg-white/5 border border-[#E5DFD3] dark:border-white/10 flex items-center justify-between hover:border-[#16A34A] transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-[#16A34A]/10 text-[#16A34A] flex items-center justify-center text-xs font-bold shrink-0">
                          {idx + 1}
                        </div>
                        <span className="text-xs font-semibold text-[#29251D] dark:text-white">
                          {task}
                        </span>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full bg-[#16A34A]/10 text-[#16A34A] text-[10.5px] font-bold flex items-center gap-1 shrink-0">
                        <Check className="w-3 h-3" />
                        Completed
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="p-2.5 rounded-lg bg-[#FFF7ED] dark:bg-white/5 border border-[#FFEDD5] dark:border-white/10 text-xs text-[#D97706] font-semibold flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>22 Tasks In Progress across QGS, Endpoints and Servers</span>
                  </div>
                  {spotlightProject.ongoingTasks.map((task, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-white dark:bg-white/5 border border-[#E5DFD3] dark:border-white/10 flex items-center justify-between hover:border-[#D97706] transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-[#D97706]/10 text-[#D97706] flex items-center justify-center text-xs font-bold shrink-0">
                          {idx + 1}
                        </div>
                        <div>
                          <span className="text-xs font-semibold text-[#29251D] dark:text-white block">
                            {task}
                          </span>
                          <span className="text-[10px] text-[#4D4D4F] dark:text-slate-400">
                            {idx < 3 ? 'QGS Infrastructure' : idx < 7 ? 'Endpoint Rollouts' : idx < 11 ? 'Server Rollouts' : 'Automation Scripts & Validation'}
                          </span>
                        </div>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full bg-[#D97706]/10 text-[#D97706] text-[10.5px] font-bold shrink-0 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#D97706] animate-pulse" />
                        In Progress
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-3 bg-[#F6F2EA] dark:bg-white/5 border-t border-[#E5DFD3] dark:border-white/10 flex items-center justify-between">
              <span className="text-xs text-[#4D4D4F] dark:text-slate-400">
                Active Project: <strong className="text-[#0A0838] dark:text-white">Qualys Patch Management</strong>
              </span>
              <button
                onClick={() => setIsTasksModalOpen(false)}
                className="px-4 py-1.5 rounded-lg bg-[#0066B2] hover:bg-[#0066B2]/90 text-white text-xs font-bold cursor-pointer transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. MODAL: PROJECT DETAIL MODAL */}
      {selectedProjectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white dark:bg-[#0A0838] rounded-2xl shadow-2xl border border-[#E5DFD3] dark:border-white/10 overflow-hidden">
            <div className="p-4 bg-[#0066B2] text-white flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base">{selectedProjectModal.projectName}</h3>
                <p className="text-xs text-blue-100">Project #{selectedProjectModal.id} • {selectedProjectModal.teamEngaged}</p>
              </div>
              <button
                onClick={() => setSelectedProjectModal(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-[#F6F2EA] dark:bg-white/5 border border-[#E5DFD3] dark:border-white/10 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-[#4D4D4F] dark:text-slate-400">Execution Status:</span>
                  <div className="flex items-center gap-1.5">
                    <span className="relative flex h-2 w-2">
                      <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                        selectedProjectModal.status.toLowerCase().includes('completed') ? 'bg-emerald-400' : 'bg-amber-400'
                      }`} />
                      <span className={`relative inline-flex rounded-full h-2 w-2 ${
                        selectedProjectModal.status.toLowerCase().includes('completed') ? 'bg-[#16A34A]' : 'bg-[#D97706]'
                      }`} />
                    </span>
                    <span className={`font-bold ${
                      selectedProjectModal.status.toLowerCase().includes('completed') ? 'text-[#16A34A]' : 'text-[#D97706]'
                    }`}>
                      {selectedProjectModal.status.toLowerCase().includes('completed') ? 'Completed' : 'In Progress'}
                    </span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#4D4D4F] dark:text-slate-400">Efforts in Man Days:</span>
                  <span className="font-bold text-[#29251D] dark:text-white">{selectedProjectModal.effortsManDays} Days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#4D4D4F] dark:text-slate-400">Estimated Completion:</span>
                  <span className="font-bold text-[#29251D] dark:text-white">{formatEstimatedDate(selectedProjectModal.estimatedCompletionDate)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#4D4D4F] dark:text-slate-400">Assigned Team:</span>
                  <span className="font-bold text-[#29251D] dark:text-white">{selectedProjectModal.teamEngaged}</span>
                </div>
              </div>
            </div>

            <div className="p-3 bg-[#F6F2EA] dark:bg-white/5 border-t border-[#E5DFD3] dark:border-white/10 flex justify-end">
              <button
                onClick={() => setSelectedProjectModal(null)}
                className="px-4 py-1.5 rounded-lg bg-[#0066B2] text-white text-xs font-bold cursor-pointer"
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

export default ProjectDeliveryDashboard;
