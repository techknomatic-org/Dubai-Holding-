import React, { useState, useEffect } from 'react';
import { momActions, momSummary } from '../data/momData';
import { MomStoryCard } from '../components/MomStoryCard';
import {
  RotateCcw,
  AlertTriangle,
  Sparkles
} from 'lucide-react';

interface MomReviewProps {
  onNavigateToNext?: () => void;
}

export const MomReview: React.FC<MomReviewProps> = ({ onNavigateToNext }) => {
  const [selectedActionNo, setSelectedActionNo] = useState<number | null>(null);
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'Closed' | 'On going' | 'Open'>('ALL');
  const [counts, setCounts] = useState({
    total: 0,
    closed: 0,
    ongoing: 0,
    open: 0
  });

  // Count-up animation on initial load
  useEffect(() => {
    const duration = 650;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3); // Cubic ease out

      setCounts({
        total: Math.round(easeOut * momSummary.totalCommitments),
        closed: Math.round(easeOut * momSummary.closedCount),
        ongoing: Math.round(easeOut * momSummary.ongoingCount),
        open: Math.round(easeOut * momSummary.openCount)
      });

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    const animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName?.toLowerCase();
      if (tag === 'input' || tag === 'textarea') return;

      if (['1', '2', '3', '4', '5', '6'].includes(e.key)) {
        const num = parseInt(e.key, 10);
        setSelectedActionNo(prev => (prev === num ? null : num));
      } else if (e.key === 'Escape') {
        setSelectedActionNo(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const filteredActions = momActions.filter(action => {
    if (statusFilter === 'ALL') return true;
    return action.status === statusFilter;
  });

  const selectedAction = momActions.find(a => a.actionNo === selectedActionNo);

  return (
    <div className="h-full w-full flex flex-col p-6 md:p-8 lg:p-10 gap-4 relative overflow-y-auto overflow-x-hidden text-left bg-[#FFFFFF] dark:bg-[#0A0838] select-none transition-all duration-300">
      {/* Background Ambient Elements */}
      <div className="absolute inset-0 subtle-grid opacity-20 pointer-events-none" />
      <div className="absolute top-10 right-10 w-96 h-96 bg-[#E31837]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* TOP HEADER & EXECUTIVE SCORECARD */}
      <div className="shrink-0 animate-in fade-in slide-in-from-top-2 duration-500">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 pb-3 border-b border-[#E5DFD3] dark:border-white/10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-[#0066B2] dark:bg-sky-400 animate-pulse" />
              <span className="text-xs font-medium text-[#0066B2] dark:text-sky-400">
                01 • Minutes of Meeting
              </span>
            </div>
            <h1 className="text-2xl font-semibold tracking-tight text-[#29251D] dark:text-white">
              Minutes of Previous Meeting
            </h1>
          </div>

          {/* EXECUTIVE SUMMARY SCORECARD & FILTERS */}
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">

            {/* Total Commitments (ALL) */}
            <button
              onClick={() => {
                setStatusFilter('ALL');
                setSelectedActionNo(null);
              }}
              className={`px-4 py-2 rounded-xl border transition-all duration-300 cursor-pointer text-center min-w-[90px] active:scale-95 group ${
                statusFilter === 'ALL'
                  ? 'bg-[#FFFFFF] dark:bg-white/15 border-[#0A0838] dark:border-white shadow-md scale-[1.02] -translate-y-0.5'
                  : 'bg-[#F6F2EA] dark:bg-white/5 border-[#E5DFD3] dark:border-white/10 hover:-translate-y-0.5 hover:shadow-xs'
              }`}
            >
              <span className="text-xs font-medium block text-[#4D4D4F] dark:text-slate-300">
                Commitments
              </span>
              <span className="text-2xl font-semibold leading-tight mt-0.5 block text-[#29251D] dark:text-white transition-transform group-hover:scale-105">
                {counts.total}
              </span>
            </button>

            {/* Closed */}
            <button
              onClick={() => {
                setStatusFilter(statusFilter === 'Closed' ? 'ALL' : 'Closed');
                setSelectedActionNo(null);
              }}
              className={`px-3.5 py-2 rounded-xl border transition-all duration-300 cursor-pointer text-center min-w-[85px] active:scale-95 group ${
                statusFilter === 'Closed'
                  ? 'bg-[#FFFFFF] dark:bg-[#2E5F13]/25 border-2 border-[#2E5F13] shadow-md scale-[1.02] -translate-y-0.5'
                  : 'bg-[#F0F8EE] dark:bg-[#2E5F13]/10 border-[#B4DFB1] dark:border-[#2E5F13]/40 hover:-translate-y-0.5 hover:border-[#2E5F13] hover:shadow-xs'
              }`}
            >
              <div className="flex items-center justify-center mb-0.5">
                <span className="px-2 py-0.5 rounded text-[11px] font-medium" style={{ color: '#2E5F13', backgroundColor: '#D1EED0' }}>
                  Closed
                </span>
              </div>
              <span className="text-2xl font-semibold leading-tight block text-[#29251D] dark:text-white group-hover:scale-105 transition-transform">
                {counts.closed}
              </span>
            </button>

            {/* Ongoing */}
            <button
              onClick={() => {
                setStatusFilter(statusFilter === 'On going' ? 'ALL' : 'On going');
                setSelectedActionNo(null);
              }}
              className={`px-3.5 py-2 rounded-xl border transition-all duration-300 cursor-pointer text-center min-w-[85px] active:scale-95 group ${
                statusFilter === 'On going'
                  ? 'bg-[#FFFFFF] dark:bg-[#8D5C1A]/25 border-2 border-[#8D5C1A] shadow-md scale-[1.02] -translate-y-0.5'
                  : 'bg-[#FEFCE8] dark:bg-[#8D5C1A]/10 border-[#F2DF80] dark:border-[#8D5C1A]/40 hover:-translate-y-0.5 hover:border-[#8D5C1A] hover:shadow-xs'
              }`}
            >
              <div className="flex items-center justify-center mb-0.5">
                <span className="px-2 py-0.5 rounded text-[11px] font-medium" style={{ color: '#8D5C1A', backgroundColor: '#F8EDA4' }}>
                  Ongoing
                </span>
              </div>
              <span className="text-2xl font-semibold leading-tight block text-[#29251D] dark:text-white group-hover:scale-105 transition-transform">
                {counts.ongoing}
              </span>
            </button>

            {/* Open */}
            <button
              onClick={() => {
                setStatusFilter(statusFilter === 'Open' ? 'ALL' : 'Open');
                setSelectedActionNo(null);
              }}
              className={`px-3.5 py-2 rounded-xl border transition-all duration-300 cursor-pointer text-center min-w-[85px] active:scale-95 group ${
                statusFilter === 'Open'
                  ? 'bg-[#FFFFFF] dark:bg-[#3A59A4]/25 border-2 border-[#3A59A4] shadow-md scale-[1.02] -translate-y-0.5'
                  : 'bg-[#EFF6FF] dark:bg-[#3A59A4]/10 border-[#BDD4F5] dark:border-[#3A59A4]/40 hover:-translate-y-0.5 hover:border-[#3A59A4] hover:shadow-xs'
              }`}
            >
              <div className="flex items-center justify-center mb-0.5">
                <span className="px-2 py-0.5 rounded text-[11px] font-medium" style={{ color: '#3A59A4', backgroundColor: '#E1EAF6' }}>
                  Open
                </span>
              </div>
              <span className="text-2xl font-semibold leading-tight block text-[#29251D] dark:text-white group-hover:scale-105 transition-transform">
                {counts.open}
              </span>
            </button>

            {statusFilter !== 'ALL' && (
              <button
                onClick={() => {
                  setStatusFilter('ALL');
                  setSelectedActionNo(null);
                }}
                className="px-3 py-2 rounded-xl bg-[#FFFFFF] dark:bg-white/10 text-[#4D4D4F] dark:text-slate-300 border border-[#E5DFD3] dark:border-white/10 hover:border-[#0A0838] dark:hover:border-white/40 text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
                title="Reset Filter"
              >
                <RotateCcw className="w-3.5 h-3.5 text-[#0A0838] dark:text-white" />
                <span>Show All</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* MAIN VIEW: EITHER FULL-WIDTH EXPANDED CARD OR CLEAN 6-CARD GRID */}
      <div className="flex-1 flex flex-col min-h-0 justify-center my-auto py-2 transition-all duration-300">
        {selectedAction ? (
          // DEDICATED FULL-WIDTH EXPANDED VIEW
          <MomStoryCard
            action={selectedAction}
            isSelected={true}
            onSelect={() => { }}
            onClose={() => setSelectedActionNo(null)}
          />
        ) : (
          // 6 CARDS GRID WITH STAGGERED CASCADE ANIMATION
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5 flex-1 items-stretch">
            {filteredActions.map((action, index) => (
              <div
                key={action.actionNo}
                className="h-full animate-in fade-in slide-in-from-bottom-3 duration-500"
                style={{
                  animationDelay: `${index * 60}ms`,
                  animationFillMode: 'both'
                }}
              >
                <MomStoryCard
                  action={action}
                  isSelected={false}
                  onSelect={() => setSelectedActionNo(action.actionNo)}
                  onClose={() => setSelectedActionNo(null)}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
