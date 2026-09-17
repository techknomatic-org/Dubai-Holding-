import React, { useEffect, useState } from 'react';
import { MomActionItem } from '../types';
import { StatusBadge } from './StatusBadge';
import {
  ArrowRight,
  ArrowLeft,
  AlertTriangle,
  User,
  Sparkles,
  CheckCircle2,
  Target
} from 'lucide-react';

interface MomStoryCardProps {
  action: MomActionItem;
  isSelected: boolean;
  onSelect: () => void;
  onClose: () => void;
}

// Status color style helper for cards
const getStatusCardStyles = (status: string) => {
  const norm = status.toLowerCase().trim();
  if (norm === 'closed' || norm === 'completed' || norm === 'complete') {
    return {
      bg: 'bg-[#F0F8EE] dark:bg-[#2E5F13]/15',
      border: 'border-[#B4DFB1] dark:border-[#2E5F13]/40',
      hoverBorder: 'hover:border-[#2E5F13]',
      hoverBg: 'hover:bg-[#E6F4E4] dark:hover:bg-[#2E5F13]/25',
      numBg: 'bg-[#D1EED0] text-[#2E5F13] border-[#B4DFB1] group-hover:bg-[#2E5F13] group-hover:text-white',
      titleHover: 'group-hover:text-[#2E5F13]'
    };
  }
  if (norm === 'on going' || norm === 'ongoing' || norm === 'in progress') {
    return {
      bg: 'bg-[#FEFCE8] dark:bg-[#8D5C1A]/15',
      border: 'border-[#F2DF80] dark:border-[#8D5C1A]/40',
      hoverBorder: 'hover:border-[#8D5C1A]',
      hoverBg: 'hover:bg-[#FDF7D0] dark:hover:bg-[#8D5C1A]/25',
      numBg: 'bg-[#F8EDA4] text-[#8D5C1A] border-[#F2DF80] group-hover:bg-[#8D5C1A] group-hover:text-white',
      titleHover: 'group-hover:text-[#8D5C1A]'
    };
  }
  if (norm === 'open') {
    return {
      bg: 'bg-[#EFF6FF] dark:bg-[#3A59A4]/15',
      border: 'border-[#BDD4F5] dark:border-[#3A59A4]/40',
      hoverBorder: 'hover:border-[#3A59A4]',
      hoverBg: 'hover:bg-[#E2EEFC] dark:hover:bg-[#3A59A4]/25',
      numBg: 'bg-[#E1EAF6] text-[#3A59A4] border-[#BDD4F5] group-hover:bg-[#3A59A4] group-hover:text-white',
      titleHover: 'group-hover:text-[#3A59A4]'
    };
  }
  if (norm === 'attention' || norm === 'requires attention') {
    return {
      bg: 'bg-[#FFF7F0] dark:bg-[#C47135]/15',
      border: 'border-[#F5CAAB] dark:border-[#C47135]/40',
      hoverBorder: 'hover:border-[#C47135]',
      hoverBg: 'hover:bg-[#FDE8D8] dark:hover:bg-[#C47135]/25',
      numBg: 'bg-[#F5E5D7] text-[#C47135] border-[#F5CAAB] group-hover:bg-[#C47135] group-hover:text-white',
      titleHover: 'group-hover:text-[#C47135]'
    };
  }
  if (norm === 'delayed') {
    return {
      bg: 'bg-[#FDF2F2] dark:bg-[#872213]/15',
      border: 'border-[#F4BDC3] dark:border-[#872213]/40',
      hoverBorder: 'hover:border-[#872213]',
      hoverBg: 'hover:bg-[#FAE3E6] dark:hover:bg-[#872213]/25',
      numBg: 'bg-[#F2CACE] text-[#872213] border-[#F4BDC3] group-hover:bg-[#872213] group-hover:text-white',
      titleHover: 'group-hover:text-[#872213]'
    };
  }
  return {
    bg: 'bg-[#F6F2EA] dark:bg-white/5',
    border: 'border-[#E5DFD3] dark:border-white/10',
    hoverBorder: 'hover:border-[#0A0838]',
    hoverBg: 'hover:bg-[#FFFFFF]',
    numBg: 'bg-[#FFFFFF] text-[#0A0838] border-[#E5DFD3] group-hover:bg-[#0A0838] group-hover:text-white',
    titleHover: 'group-hover:text-[#0A0838]'
  };
};

export const MomStoryCard: React.FC<MomStoryCardProps> = ({
  action,
  isSelected,
  onSelect,
  onClose
}) => {
  const [progressWidth, setProgressWidth] = useState(0);
  const statusStyles = getStatusCardStyles(action.status);

  // Animated progress bar expansion when card is selected
  useEffect(() => {
    if (isSelected && action.story.currentState.completionPct !== undefined) {
      setProgressWidth(0);
      const timer = setTimeout(() => {
        setProgressWidth(action.story.currentState.completionPct || 0);
      }, 120);
      return () => clearTimeout(timer);
    }
  }, [isSelected, action.story.currentState.completionPct]);

  // ESC key to return
  useEffect(() => {
    if (!isSelected) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSelected, onClose]);

  // COLLAPSED CARD VIEW (GRID ITEM)
  if (!isSelected) {
    return (
      <div
        onClick={onSelect}
        className={`group relative rounded-2xl ${statusStyles.bg} ${statusStyles.border} ${statusStyles.hoverBorder} ${statusStyles.hoverBg} border p-6 lg:p-7 hover:scale-[1.01] hover:shadow-md transition-all duration-300 cursor-pointer flex flex-col justify-between h-full min-h-[195px] lg:min-h-[220px] active:scale-[0.99] shadow-2xs`}
      >
        {/* Top Row: #Number & Status Badges */}
        <div className="flex items-center justify-between gap-3 mb-2">
          <div className={`w-8 h-8 rounded-lg ${statusStyles.numBg} border flex items-center justify-center font-semibold text-xs transition-all duration-300 shrink-0 shadow-2xs`}>
            #{action.actionNo}
          </div>

          <div className="flex items-center gap-1.5 shrink-0 flex-wrap justify-end">
            <StatusBadge status={action.status} size="sm" />
          </div>
        </div>

        {/* Center-Aligned Category & Header Title */}
        <div className="my-auto py-2 text-center flex flex-col items-center justify-center">
          {/* Full Category Name */}
          <span className="text-xs text-[#4D4D4F] dark:text-slate-400 font-medium block mb-1.5 leading-snug text-center">
            {action.category}
          </span>

          {/* Full Title */}
          <h4 className={`font-semibold text-base md:text-[17px] text-[#29251D] dark:text-slate-100 ${statusStyles.titleHover} leading-snug transition-colors duration-200 text-center max-w-sm`}>
            {action.title}
          </h4>
        </div>

        {/* Bottom Navigation Cue */}
        <div className="mt-2 pt-2.5 border-t border-[#E5DFD3]/60 dark:border-white/10 flex items-center justify-end">
          <span className="text-xs font-semibold text-[#0A0838] dark:text-slate-300 group-hover:translate-x-0.5 transition-transform flex items-center gap-1 shrink-0">
            Details <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    );
  }

  // EXPANDED DEDICATED FULL-VIEW
  return (
    <div className="w-full rounded-2xl p-6 md:p-8 bg-[#FFFFFF] dark:bg-[#0A0838] border border-[#E5DFD3] dark:border-white/10 shadow-xl text-left animate-in fade-in zoom-in-98 duration-300">
      {/* Top Header: Simple Arrow Back Button + Title + Status Badges */}
      <div className="flex items-center justify-between gap-4 pb-5 border-b border-[#E5DFD3] dark:border-white/10">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="group w-9 h-9 rounded-xl bg-[#F6F2EA] dark:bg-white/10 hover:bg-[#0A0838] border border-[#E5DFD3] dark:border-white/20 text-[#29251D] hover:text-white flex items-center justify-center transition-all duration-300 cursor-pointer shadow-2xs active:scale-95"
            title="Return to Overview (ESC)"
          >
            <ArrowLeft className="w-4 h-4 text-[#0A0838] group-hover:text-white group-hover:-translate-x-0.5 transition-all duration-200" />
          </button>

          <div className="w-9 h-9 rounded-xl bg-[#0A0838] text-white flex items-center justify-center font-semibold text-xs shadow-md shadow-[#0A0838]/20 animate-in fade-in duration-300">
            #{action.actionNo}
          </div>

          <div>
            <span className="text-xs text-[#4D4D4F] dark:text-slate-400 font-medium block">
              {action.category}
            </span>
            <h3 className="font-semibold text-lg md:text-xl text-[#29251D] dark:text-white">
              {action.title}
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <StatusBadge status={action.status} size="md" />
        </div>
      </div>

      {/* Action Metadata Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-3.5 my-5 rounded-xl bg-[#F6F2EA] dark:bg-white/5 border border-[#E5DFD3] dark:border-white/10 text-xs animate-in fade-in slide-in-from-top-1 duration-400">
        <div>
          <span className="text-[#4D4D4F] dark:text-slate-400 block text-xs">Action type</span>
          <span className="text-[#29251D] dark:text-slate-200 font-medium">{action.typeDescription} ({action.type})</span>
        </div>
        <div>
          <span className="text-[#4D4D4F] dark:text-slate-400 block text-xs">Owner / lead</span>
          <span className="text-[#29251D] dark:text-slate-200 font-medium">{action.owner}</span>
        </div>
        <div>
          <span className="text-[#4D4D4F] dark:text-slate-400 block text-xs">Original due date</span>
          <span className="text-[#29251D] dark:text-slate-200 font-medium">{action.originalDueDate}</span>
        </div>
        <div>
          <span className="text-[#4D4D4F] dark:text-slate-400 block text-xs">Target timeline</span>
          {action.status === 'Closed' ? (
            <span className="text-[#2E7D32] font-medium">Completed within time</span>
          ) : action.revisedDueDate ? (
            <span className="text-[#B54708] font-medium">Revised: {action.revisedDueDate}</span>
          ) : (
            <span className="text-[#C47135] font-medium">On track</span>
          )}
        </div>
      </div>

      {/* 4 BALANCED STORY ARCS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* STAGE 1: COMMITMENT */}
        <div className="p-4 rounded-xl bg-[#F6F2EA] dark:bg-white/5 border border-[#E5DFD3] dark:border-white/10 hover:border-[#0A0838]/40 hover:shadow-xs transition-all duration-300 flex flex-col justify-between relative animate-in fade-in slide-in-from-bottom-2 duration-500">
          <div className="absolute -top-2.5 left-4 px-2 py-0.5 bg-[#0A0838] text-white rounded text-[10px] font-medium shadow-2xs">
            01 • Commitment
          </div>
          <div className="space-y-2 mt-1">
            <h5 className="text-xs font-semibold text-[#29251D] dark:text-slate-200">What did we commit?</h5>
            <p className="text-xs text-[#4D4D4F] dark:text-slate-300 leading-relaxed font-normal">
              {action.story.commitment}
            </p>
          </div>
          <div className="mt-3 pt-2 border-t border-[#E5DFD3] dark:border-white/5 text-xs text-[#4D4D4F] dark:text-slate-400 flex items-center justify-between">
            <span>Connect: 29 Jun 2026</span>
            <span className="text-[#0A0838] dark:text-slate-200 font-medium">Agreed target</span>
          </div>
        </div>

        {/* STAGE 2: PROGRESS */}
        <div
          className="p-4 rounded-xl bg-[#F6F2EA] dark:bg-white/5 border border-[#E5DFD3] dark:border-white/10 hover:border-[#0A0838]/40 hover:shadow-xs transition-all duration-300 flex flex-col justify-between relative animate-in fade-in slide-in-from-bottom-2 duration-500"
          style={{ animationDelay: '80ms', animationFillMode: 'both' }}
        >
          <div className="absolute -top-2.5 left-4 px-2 py-0.5 bg-[#0A0838] text-white rounded text-[10px] font-medium shadow-2xs">
            02 • Progress
          </div>
          <div className="space-y-2 mt-1">
            <h5 className="text-xs font-semibold text-[#29251D] dark:text-slate-200">What happened?</h5>
            <p className="text-xs text-[#4D4D4F] dark:text-slate-300 leading-relaxed font-normal">
              {action.story.progress.highlightText}
            </p>

            {action.story.progress.keyMetrics && (
              <div className="grid grid-cols-2 gap-2 my-2">
                {action.story.progress.keyMetrics.map((m, idx) => (
                  <div key={idx} className="p-2 rounded-lg bg-[#FFFFFF] dark:bg-white/5 border border-[#E5DFD3] dark:border-white/10 text-center">
                    <span className="text-xs text-[#4D4D4F] dark:text-slate-400 block truncate font-normal">{m.label}</span>
                    <span className="text-sm font-semibold text-[#0A0838] dark:text-slate-200">{m.value}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="mt-3 pt-2 border-t border-[#E5DFD3] dark:border-white/5 text-xs text-[#4D4D4F] dark:text-slate-400 font-normal">
            {action.story.progress.evidenceNote}
          </div>
        </div>

        {/* STAGE 3: CURRENT STATE */}
        <div
          className="p-4 rounded-xl bg-[#F6F2EA] dark:bg-white/5 border border-[#E5DFD3] dark:border-white/10 hover:border-[#0A0838]/40 hover:shadow-xs transition-all duration-300 flex flex-col justify-between relative animate-in fade-in slide-in-from-bottom-2 duration-500"
          style={{ animationDelay: '160ms', animationFillMode: 'both' }}
        >
          <div className="absolute -top-2.5 left-4 px-2 py-0.5 bg-[#0A0838] text-white rounded text-[10px] font-medium shadow-2xs">
            03 • Current state
          </div>
          <div className="space-y-2 mt-1">
            <h5 className="text-xs font-semibold text-[#29251D] dark:text-slate-200">Where are we now?</h5>
            <p className="text-xs text-[#4D4D4F] dark:text-slate-300 leading-relaxed font-normal">
              {action.story.currentState.statusText}
            </p>

            {action.story.currentState.completionPct !== undefined && (
              <div className="pt-1">
                <div className="flex justify-between text-xs text-[#4D4D4F] dark:text-slate-400 mb-1">
                  <span>Milestone completion</span>
                  <span className="text-[#2E7D32] font-semibold">{action.story.currentState.completionPct}%</span>
                </div>
                <div className="w-full h-2 bg-[#E5DFD3] dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#2E7D32] rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${progressWidth}%` }}
                  />
                </div>
              </div>
            )}
          </div>
          <div className="mt-3 pt-2 border-t border-[#E5DFD3] dark:border-white/5 text-xs text-[#4D4D4F] dark:text-slate-400 font-normal">
            {action.story.currentState.governanceNote}
          </div>
        </div>

        {/* STAGE 4: NEXT MOVE */}
        <div
          className="p-4 rounded-xl bg-[#F6F2EA] dark:bg-white/5 border border-[#E5DFD3] dark:border-white/10 hover:border-[#0D9488]/40 hover:shadow-xs transition-all duration-300 flex flex-col justify-between relative animate-in fade-in slide-in-from-bottom-2 duration-500"
          style={{ animationDelay: '240ms', animationFillMode: 'both' }}
        >
          <div className="absolute -top-2.5 left-4 px-2 py-0.5 bg-[#0D9488] text-white rounded text-[10px] font-medium shadow-2xs">
            04 • Next move
          </div>
          <div className="space-y-2 mt-1">
            <h5 className="text-xs font-semibold text-[#29251D] dark:text-slate-200">What is next?</h5>
            <p className="text-xs text-[#4D4D4F] dark:text-slate-300 leading-relaxed font-normal">
              {action.story.nextMove.strategicNextStep}
            </p>

            {action.story.nextMove.leadershipActionNeeded && (
              <div className="mt-2 p-2 rounded-lg bg-[#F5E5D7] border border-[#C47135] text-xs shadow-2xs">
                <span className="text-xs font-medium text-[#C47135] flex items-center gap-1 mb-0.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-[#C47135]" />
                  Leadership action:
                </span>
                <p className="text-xs text-[#29251D] leading-tight font-normal">
                  {action.story.nextMove.leadershipActionNeeded}
                </p>
              </div>
            )}
          </div>
          <div className="mt-3 pt-2 border-t border-[#E5DFD3] dark:border-white/5 flex items-center justify-between text-xs">
            <span className="text-[#4D4D4F] dark:text-slate-400 font-normal">Target: {action.story.nextMove.targetDate}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
