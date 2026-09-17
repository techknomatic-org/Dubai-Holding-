import React from 'react';
import { MomActionItem } from '../types';
import { Calendar, ArrowRight, CheckCircle2, Clock, PlayCircle } from 'lucide-react';

interface MomTimelineBarProps {
  actions: MomActionItem[];
  selectedActionNo: number | null;
  onSelectAction: (actionNo: number) => void;
}

export const MomTimelineBar: React.FC<MomTimelineBarProps> = ({
  actions,
  selectedActionNo,
  onSelectAction
}) => {
  return (
    <div className="rounded-2xl executive-glass p-5 mb-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4 pb-3 border-b border-white/5">
        <div className="flex items-center gap-2.5">
          <Calendar className="w-4 h-4 text-sky-400" />
          <span className="text-xs font-mono font-bold tracking-wider text-slate-200 uppercase">
            COMMITMENT HORIZON
          </span>
          <span className="text-[10px] font-mono text-slate-400">
            (29-June-2026 Strategic Connect → 31-August-2026 Current Position)
          </span>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-[10px] font-mono text-slate-400">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#2E5F13]" />
            <span>4 Closed</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#8D5C1A]" />
            <span>2 Ongoing</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#3A59A4]" />
            <span>1 Open (Revised)</span>
          </span>
        </div>
      </div>

      {/* Interactive Timeline Bar */}
      <div className="relative pt-2 pb-2">
        {/* Track Line */}
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500/40 via-sky-500/50 to-emerald-500/50 rounded-full -translate-y-1/2" />

        {/* Action Nodes Grid */}
        <div className="relative flex items-center justify-between gap-2">
          {/* Start Point */}
          <div className="flex flex-col items-center">
            <div className="w-4 h-4 rounded-full bg-indigo-600 border-2 border-indigo-400 shadow-md flex items-center justify-center">
              <span className="w-1.5 h-1.5 rounded-full bg-white" />
            </div>
            <span className="text-[9px] font-mono text-indigo-300 mt-2 font-semibold">29-JUN</span>
            <span className="text-[8px] font-mono text-slate-500 hidden sm:block">LAST CONNECT</span>
          </div>

          {/* Action Markers */}
          {actions.map((item, idx) => {
            const isSelected = selectedActionNo === item.actionNo;
            let nodeBg = '#2E5F13';
            if (item.status === 'On going') nodeBg = '#8D5C1A';
            if (item.status === 'Open') nodeBg = '#3A59A4';

            return (
              <button
                key={item.actionNo}
                onClick={() => onSelectAction(item.actionNo)}
                className={`group flex flex-col items-center transition-all cursor-pointer ${
                  isSelected ? 'scale-110' : 'hover:scale-105'
                }`}
              >
                <div className={`w-7 h-7 rounded-xl flex items-center justify-center font-mono text-xs font-bold transition-all ${
                  isSelected
                    ? 'bg-sky-500 text-white ring-4 ring-sky-400/40 shadow-lg shadow-sky-500/40'
                    : 'bg-slate-900 border border-white/20 text-slate-300 group-hover:border-sky-400 group-hover:text-white'
                }`}>
                  #{item.actionNo}
                </div>

                <div className="flex items-center gap-1 mt-2">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: nodeBg }} />
                  <span className="text-[10px] font-mono text-slate-400 group-hover:text-slate-200">
                    {item.status === 'Closed' ? 'Closed' : item.revisedDueDate ? '30-Sep' : '27-Jul'}
                  </span>
                </div>
              </button>
            );
          })}

          {/* End Point / Today */}
          <div className="flex flex-col items-center">
            <div className="w-4 h-4 rounded-full bg-emerald-500 border-2 border-emerald-300 shadow-md flex items-center justify-center animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-white" />
            </div>
            <span className="text-[9px] font-mono text-emerald-300 mt-2 font-semibold">31-AUG</span>
            <span className="text-[8px] font-mono text-slate-500 hidden sm:block">TODAY (REVIEW)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
