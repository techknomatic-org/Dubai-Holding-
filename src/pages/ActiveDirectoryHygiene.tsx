import React, { useState, useEffect } from 'react';
import { useLiveData } from '../hooks/useLiveData';
import { LiveDataBadge } from '../components/LiveDataBadge';
import {
  ShieldCheck,
  Key,
  Mail,
  UserX,
  MonitorX,
  Sparkles,
  Lock,
  CheckCircle2,
  ArrowUpRight,
  TrendingUp,
  Shield
} from 'lucide-react';

interface ActiveDirectoryHygieneProps {
  onNavigateToNext?: () => void;
  onNavigateToPrev?: () => void;
}

export const ActiveDirectoryHygiene: React.FC<ActiveDirectoryHygieneProps> = ({
  onNavigateToNext,
  onNavigateToPrev
}) => {
  const { data: liveData, isLoading, isRefreshing, error, lastUpdatedDisplay, dataSource, refresh } = useLiveData();

  const adHygiene = liveData?.adHygiene || {
    licensesReleasedTotal: 1311,
    licenseBreakdown: [
      { tier: 'SPE-F1', count: 825, description: 'Firstline Worker Suite', color: '#0A0838' },
      { tier: 'SPE-E5', count: 335, description: 'Enterprise Premium Security & Compliance', color: '#F8B4A3' },
      { tier: 'MS-E7', count: 151, description: 'Specialized Enterprise Tier', color: '#E31837' }
    ],
    mailboxPoliciesApplied: 289,
    staleItemsDisabledTotal: 2732,
    staleComputersDisabled: 1189,
    staleUserAccountsDisabled: 1543
  };

  const [animStage, setAnimStage] = useState<number>(0);
  const [hoveredLicense, setHoveredLicense] = useState<string | null>(null);

  // Animated number counters
  const [countLicenses, setCountLicenses] = useState<number>(0);
  const [countMailbox, setCountMailbox] = useState<number>(0);
  const [countStaleTotal, setCountStaleTotal] = useState<number>(0);
  const [countStaleUsers, setCountStaleUsers] = useState<number>(0);
  const [countStaleComputers, setCountStaleComputers] = useState<number>(0);
  const [arcProgress, setArcProgress] = useState<number>(0);

  const startAnimation = () => {
    setAnimStage(0);
    setCountLicenses(0);
    setCountMailbox(0);
    setCountStaleTotal(0);
    setCountStaleUsers(0);
    setCountStaleComputers(0);
    setArcProgress(0);

    const t1 = setTimeout(() => setAnimStage(1), 50);
    const t2 = setTimeout(() => {
      setAnimStage(2);
      setArcProgress(1);

      // Animate numbers smoothly over 800ms
      const duration = 800;
      const startTime = performance.now();
      const frame = (time: number) => {
        const progress = Math.min(1, (time - startTime) / duration);
        const ease = 1 - Math.pow(1 - progress, 3);
        setCountLicenses(Math.round(ease * adHygiene.licensesReleasedTotal));
        setCountMailbox(Math.round(ease * adHygiene.mailboxPoliciesApplied));
        setCountStaleTotal(Math.round(ease * adHygiene.staleItemsDisabledTotal));
        setCountStaleUsers(Math.round(ease * adHygiene.staleUserAccountsDisabled));
        setCountStaleComputers(Math.round(ease * adHygiene.staleComputersDisabled));
        if (progress < 1) requestAnimationFrame(frame);
      };
      requestAnimationFrame(frame);
    }, 200);

    const t3 = setTimeout(() => setAnimStage(3), 350);

    return [t1, t2, t3];
  };

  useEffect(() => {
    const timers = startAnimation();
    return () => timers.forEach(clearTimeout);
  }, [adHygiene.licensesReleasedTotal]);

  const f1Count = adHygiene.licenseBreakdown[0]?.count || 825;
  const e5Count = adHygiene.licenseBreakdown[1]?.count || 335;
  const e7Count = adHygiene.licenseBreakdown[2]?.count || 151;
  const f1Pct = ((f1Count / adHygiene.licensesReleasedTotal) * 100);
  const e5Pct = ((e5Count / adHygiene.licensesReleasedTotal) * 100);
  const e7Pct = ((e7Count / adHygiene.licensesReleasedTotal) * 100);

  const circumference = 2 * Math.PI * 34;

  return (
    <div className={`h-full w-full flex flex-col p-5 md:p-7 lg:p-8 gap-4 relative overflow-hidden bg-[#FFFFFF] dark:bg-[#0A0838] text-[#29251D] dark:text-white transition-opacity duration-700 select-none ${isLoading ? 'opacity-70' : 'opacity-100'}`}>

      {/* 1. TOP HEADER */}
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
              Active Directory Hygiene &amp; Clean-Ups
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

      {/* 2. THREE PILLARS OF HYGIENE & VALUE REALIZATION */}
      <div className={`flex-1 grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch min-h-0 transition-all duration-700 ${animStage >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>

        {/* Pillar 1 (5 Cols): License Harvesting & Cost Optimization */}
        <div className="lg:col-span-5 p-4 rounded-2xl bg-[#F6F2EA] dark:bg-white/5 border border-[#E5DFD3] dark:border-white/10 shadow-sm flex flex-col justify-between transition-all duration-300 hover:shadow-md">
          <div>
            {/* Header */}
            <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-[#E5DFD3] dark:border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#0A0838] text-white flex items-center justify-center shadow-sm">
                  <Key className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-[#29251D] dark:text-white">
                    Licenses Released
                  </h2>
                </div>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-[#0A0838]/10 dark:bg-white/10 border border-[#0A0838]/20 dark:border-white/20 text-xs font-medium text-[#0A0838] dark:text-white">
                {countLicenses.toLocaleString()} Total
              </span>
            </div>

            {/* Visualizer Row: Donut Distribution Chart + Stacked Proportional Pool */}
            <div className="p-3 rounded-xl bg-[#FFFFFF] dark:bg-white/10 border border-[#E5DFD3] dark:border-white/5 mb-3 flex items-center gap-4 shadow-sm">
              {/* SVG Donut Ring with Animated Drawing */}
              <div className="relative shrink-0 flex items-center justify-center">
                <svg width="86" height="86" viewBox="0 0 86 86" className="-rotate-90">
                  <circle cx="43" cy="43" r="34" fill="none" stroke="#E5DFD3" strokeWidth="9" />
                  {/* SPE-F1 (62.9%) - Navy Base */}
                  <circle
                    cx="43"
                    cy="43"
                    r="34"
                    fill="none"
                    stroke="#0A0838"
                    strokeWidth="9"
                    strokeDasharray={`${(f1Pct / 100) * circumference * arcProgress} ${circumference}`}
                    strokeDashoffset="0"
                    strokeLinecap="round"
                    className="transition-all duration-1000"
                  />
                  {/* SPE-E5 (25.6%) - Peach Accent */}
                  <circle
                    cx="43"
                    cy="43"
                    r="34"
                    fill="none"
                    stroke="#F8B4A3"
                    strokeWidth="9"
                    strokeDasharray={`${(e5Pct / 100) * circumference * arcProgress} ${circumference}`}
                    strokeDashoffset={-((f1Pct / 100) * circumference)}
                    strokeLinecap="round"
                    className="transition-all duration-1000"
                  />
                  {/* MS-E7 (11.5%) - Red Primary Highlight */}
                  <circle
                    cx="43"
                    cy="43"
                    r="34"
                    fill="none"
                    stroke="#E31837"
                    strokeWidth="9"
                    strokeDasharray={`${(e7Pct / 100) * circumference * arcProgress} ${circumference}`}
                    strokeDashoffset={-(((f1Pct + e5Pct) / 100) * circumference)}
                    strokeLinecap="round"
                    className="transition-all duration-1000"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-sm font-semibold text-[#29251D] dark:text-white leading-none">
                    {countLicenses.toLocaleString()}
                  </span>
                  <span className="text-xs text-[#4D4D4F] dark:text-slate-300 mt-0.5">Harvested</span>
                </div>
              </div>

              {/* Pool Breakdown Summary */}
              <div className="flex-1 min-w-0 flex flex-col justify-center">
                <span className="text-xs font-medium text-[#4D4D4F] dark:text-slate-300 block mb-1">
                  Reclamation Pool Composition
                </span>
                {/* Multi-segment Horizon Bar */}
                <div className="w-full h-3 rounded-full overflow-hidden flex bg-[#E5DFD3] dark:bg-white/10 mb-1.5 shadow-inner">
                  <div style={{ width: `${f1Pct * arcProgress}%` }} className="bg-[#0A0838] h-full transition-all duration-1000" title="SPE-F1" />
                  <div style={{ width: `${e5Pct * arcProgress}%` }} className="bg-[#F8B4A3] h-full border-l border-white/40 transition-all duration-1000" title="SPE-E5" />
                  <div style={{ width: `${e7Pct * arcProgress}%` }} className="bg-[#E31837] h-full border-l border-white/40 transition-all duration-1000" title="MS-E7" />
                </div>
                <div className="flex items-center justify-between text-xs text-[#4D4D4F] dark:text-slate-300 font-medium">
                  <span className="flex items-center gap-1 text-[#0A0838] dark:text-slate-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#0A0838]" /> F1 ({f1Pct.toFixed(1)}%)
                  </span>
                  <span className="flex items-center gap-1 text-[#4D4D4F] dark:text-slate-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#F8B4A3]" /> E5 ({e5Pct.toFixed(1)}%)
                  </span>
                  <span className="flex items-center gap-1 text-[#E31837]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#E31837]" /> E7 ({e7Pct.toFixed(1)}%)
                  </span>
                </div>
              </div>
            </div>

            {/* License Breakdown Cards */}
            <div className="space-y-2">
              {adHygiene.licenseBreakdown.map(lic => {
                const isHovered = hoveredLicense === lic.tier;
                const pct = ((lic.count / adHygiene.licensesReleasedTotal) * 100).toFixed(1);
                return (
                  <div
                    key={lic.tier}
                    onMouseEnter={() => setHoveredLicense(lic.tier)}
                    onMouseLeave={() => setHoveredLicense(null)}
                    className={`p-2.5 rounded-xl border transition-all duration-300 cursor-pointer ${
                      isHovered
                        ? 'bg-[#FFFFFF] dark:bg-white/15 border-[#0A0838] dark:border-white/40 shadow-md scale-[1.01]'
                        : 'bg-[#FFFFFF] dark:bg-white/5 border-[#E5DFD3] dark:border-white/5 hover:border-[#4D4D4F]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: lic.color }} />
                        <span className="text-sm font-semibold text-[#29251D] dark:text-white">
                          {lic.tier}
                        </span>
                        <span className="text-xs text-[#4D4D4F] dark:text-slate-400">
                          — {lic.description}
                        </span>
                      </div>
                      <div className="text-right flex items-baseline gap-1">
                        <span className="font-semibold text-[#29251D] dark:text-white text-sm">{Math.round(lic.count * arcProgress).toLocaleString()}</span>
                        <span className="text-xs text-[#4D4D4F]">({pct}%)</span>
                      </div>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-[#E5DFD3] dark:bg-white/10 overflow-hidden">
                      <div
                        style={{ width: `${Number(pct) * arcProgress}%`, backgroundColor: lic.color }}
                        className="h-full rounded-full transition-all duration-1000"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-2.5 p-2.5 rounded-xl bg-[#FFFFFF] dark:bg-white/5 border border-[#E5DFD3] dark:border-white/10 text-xs text-[#29251D] dark:text-slate-200 flex items-center justify-between">
            <span className="text-[#4D4D4F] dark:text-slate-300">Direct license reclamation across inactive &amp; offboarded seats.</span>
            <span className="font-semibold text-[#0A0838] dark:text-white">100% Recycled</span>
          </div>
        </div>

        {/* Pillar 2 (3 Cols): Mailbox Policies Applied */}
        <div
          style={{ animationDelay: '100ms', animationFillMode: 'both' }}
          className="lg:col-span-3 p-4 rounded-2xl bg-[#F6F2EA] dark:bg-white/5 border border-[#E5DFD3] dark:border-white/10 shadow-sm flex flex-col justify-between transition-all duration-300 hover:shadow-md hover:scale-[1.01] animate-in fade-in slide-in-from-bottom-2"
        >
          <div>
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-[#E5DFD3] dark:border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#0A0838] text-white flex items-center justify-center shadow-sm">
                  <Mail className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-[#29251D] dark:text-white">
                    Mailbox Policies
                  </h2>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-[#0A0838]/10 dark:bg-white/10 border border-[#0A0838]/20 dark:border-white/20 text-xs font-medium text-[#0A0838] dark:text-white">
                Enforced
              </span>
            </div>

            {/* Main Policy Hero Card */}
            <div className="p-3.5 rounded-xl bg-[#FFFFFF] dark:bg-white/10 border border-[#E5DFD3] dark:border-white/5 text-center my-2 shadow-sm">
              <span className="text-xs font-medium text-[#4D4D4F] dark:text-slate-400 block">
                Total Policies Enforced
              </span>
              <div className="text-2xl font-semibold text-[#0A0838] dark:text-white mt-0.5">
                {countMailbox.toLocaleString()}
              </div>
              <p className="text-xs text-[#4D4D4F] dark:text-slate-300 mt-0.5">
                Enterprise archiving &amp; quota governance
              </p>
            </div>

            {/* Policy Breakdown Items */}
            <div className="space-y-2 my-2.5">
              <div className="p-2.5 rounded-xl bg-[#FFFFFF] dark:bg-white/5 border border-[#E5DFD3] dark:border-white/5 flex items-center justify-between text-xs hover:border-[#4D4D4F] transition-all">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#0A0838]" />
                  <span className="text-[#29251D] dark:text-slate-200 font-medium">Inactive mailbox quotas</span>
                </div>
                <span className="font-semibold text-[#29251D] dark:text-white">{Math.round(142 * arcProgress)}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#FFFFFF] dark:bg-white/5 border border-[#E5DFD3] dark:border-white/5 flex items-center justify-between text-xs hover:border-[#4D4D4F] transition-all">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#4D4D4F]" />
                  <span className="text-[#29251D] dark:text-slate-200 font-medium">Shared mailbox hardening</span>
                </div>
                <span className="font-semibold text-[#29251D] dark:text-white">{Math.round(98 * arcProgress)}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#FFFFFF] dark:bg-white/5 border border-[#E5DFD3] dark:border-white/5 flex items-center justify-between text-xs hover:border-[#4D4D4F] transition-all">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#F8B4A3]" />
                  <span className="text-[#29251D] dark:text-slate-200 font-medium">Retention rules applied</span>
                </div>
                <span className="font-semibold text-[#29251D] dark:text-white">{Math.round(49 * arcProgress)}</span>
              </div>
            </div>

            {/* Key Enforcements */}
            <div className="space-y-1.5 text-xs text-[#4D4D4F] dark:text-slate-300">
              <div className="flex items-center gap-2 p-2 rounded-lg bg-[#FFFFFF] dark:bg-white/5 border border-[#E5DFD3] dark:border-white/5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#0A0838] dark:text-white shrink-0" />
                <span className="text-xs">Automated purge on inactive accounts</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-[#FFFFFF] dark:bg-white/5 border border-[#E5DFD3] dark:border-white/5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#0A0838] dark:text-white shrink-0" />
                <span className="text-xs">Zero unmonitored shared mailbox sprawl</span>
              </div>
            </div>
          </div>

          <div className="mt-2.5 pt-2 border-t border-[#E5DFD3] dark:border-white/10 flex items-center justify-between text-xs text-[#4D4D4F] dark:text-slate-400">
            <span>Storage optimization</span>
            <span className="text-[#0A0838] dark:text-white font-semibold">100% Policy attainment</span>
          </div>
        </div>

        {/* Pillar 3 (4 Cols): Stale Items Disabled */}
        <div
          style={{ animationDelay: '200ms', animationFillMode: 'both' }}
          className="lg:col-span-4 p-4 rounded-2xl bg-[#F6F2EA] dark:bg-white/5 border border-[#E5DFD3] dark:border-white/10 shadow-sm flex flex-col justify-between transition-all duration-300 hover:shadow-md hover:scale-[1.01] animate-in fade-in slide-in-from-bottom-2"
        >
          <div>
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-[#E5DFD3] dark:border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#0A0838] text-white flex items-center justify-center shadow-sm">
                  <ShieldCheck className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-[#29251D] dark:text-white">
                    Stale Items Disabled
                  </h2>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-[#0A0838]/10 dark:bg-white/10 border border-[#0A0838]/20 dark:border-white/20 text-xs font-medium text-[#0A0838] dark:text-white">
                Purged
              </span>
            </div>

            {/* Total Stale Block */}
            <div className="p-3 rounded-xl bg-[#FFFFFF] dark:bg-white/10 border border-[#E5DFD3] dark:border-white/5 text-center mb-2.5 shadow-sm">
              <span className="text-xs font-medium text-[#4D4D4F] dark:text-slate-400 block">
                Total Dormant Assets Purged
              </span>
              <div className="text-2xl font-semibold text-[#0A0838] dark:text-white mt-0.5">
                {countStaleTotal.toLocaleString()}
              </div>
              <span className="text-xs text-[#4D4D4F] dark:text-slate-300 flex items-center justify-center gap-1 mt-0.5 font-medium">
                <ArrowUpRight className="w-3 h-3" /> Objects decommissioned
              </span>
            </div>

            {/* Two Sub-breakdown Cards */}
            <div className="grid grid-cols-2 gap-2.5 mb-2.5">
              <div className="p-3 rounded-xl bg-[#FFFFFF] dark:bg-white/10 border border-[#E5DFD3] dark:border-white/5 text-center flex flex-col items-center justify-center gap-0.5 hover:border-[#0A0838] dark:hover:border-white/40 transition-all">
                <div className="w-8 h-8 rounded-lg bg-[#F6F2EA] dark:bg-white/10 flex items-center justify-center text-[#0A0838] dark:text-white mb-0.5">
                  <UserX className="w-4 h-4" />
                </div>
                <span className="text-xl font-semibold text-[#29251D] dark:text-white">
                  {countStaleUsers.toLocaleString()}
                </span>
                <span className="text-xs text-[#4D4D4F] dark:text-slate-400 font-medium">
                  Stale Users (&gt;90d)
                </span>
              </div>

              <div className="p-3 rounded-xl bg-[#FFFFFF] dark:bg-white/10 border border-[#E5DFD3] dark:border-white/5 text-center flex flex-col items-center justify-center gap-0.5 hover:border-[#0A0838] dark:hover:border-white/40 transition-all">
                <div className="w-8 h-8 rounded-lg bg-[#F6F2EA] dark:bg-white/10 flex items-center justify-center text-[#0A0838] dark:text-white mb-0.5">
                  <MonitorX className="w-4 h-4" />
                </div>
                <span className="text-xl font-semibold text-[#29251D] dark:text-white">
                  {countStaleComputers.toLocaleString()}
                </span>
                <span className="text-xs text-[#4D4D4F] dark:text-slate-400 font-medium">
                  Stale Computers
                </span>
              </div>
            </div>

            {/* Security impact stats */}
            <div className="grid grid-cols-2 gap-2.5 mb-2">
              <div className="p-2.5 rounded-xl bg-[#FFFFFF] dark:bg-white/5 border border-[#E5DFD3] dark:border-white/5 text-center">
                <span className="text-xs text-[#4D4D4F] dark:text-slate-400 block font-medium">Attack Vectors Removed</span>
                <span className="text-base font-semibold text-[#0A0838] dark:text-white mt-0.5 block">{countStaleTotal.toLocaleString()}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#FFFFFF] dark:bg-white/5 border border-[#E5DFD3] dark:border-white/5 text-center">
                <span className="text-xs text-[#4D4D4F] dark:text-slate-400 block font-medium">Surface Reduction</span>
                <span className="text-base font-semibold text-[#0A0838] dark:text-white mt-0.5 block">100%</span>
              </div>
            </div>
          </div>

          <div className="mt-2.5 p-2.5 rounded-xl bg-[#FFFFFF] dark:bg-white/5 border border-[#E5DFD3] dark:border-white/10 text-xs text-[#4D4D4F] dark:text-slate-300 flex items-center gap-2">
            <Lock className="w-3.5 h-3.5 text-[#0A0838] dark:text-white shrink-0" />
            <span>Eliminates legacy lateral movement vectors &amp; stale object security exposure.</span>
          </div>
        </div>

      </div>

    </div>
  );
};

export default ActiveDirectoryHygiene;

