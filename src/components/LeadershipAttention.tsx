import React from 'react';
import { MomActionItem } from '../types';
import { AlertTriangle, ArrowRight, ShieldAlert, Sparkles, CheckCircle2 } from 'lucide-react';
import { StatusBadge } from './StatusBadge';

interface LeadershipAttentionProps {
  actions: MomActionItem[];
  onSelectAction: (actionNo: number) => void;
}

export const LeadershipAttention: React.FC<LeadershipAttentionProps> = ({
  actions,
  onSelectAction
}) => {
  const attentionItems = actions.filter(a => a.requiresAttention || a.status === 'Open');

  return (
    <div className="rounded-2xl bg-amber-50/70 dark:bg-gradient-to-br dark:from-amber-950/30 dark:via-slate-900/60 dark:to-slate-900/80 border border-amber-200 dark:border-amber-500/30 p-6 relative overflow-hidden backdrop-blur-xl">
      {/* Background ambient glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-amber-100 dark:bg-amber-500/20 border border-amber-300 dark:border-amber-500/40 flex items-center justify-center">
            <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <h3 className="text-sm font-heading font-bold text-amber-900 dark:text-amber-200 tracking-wide">
              LEADERSHIP ATTENTION REQUIRED ({attentionItems.length})
            </h3>
            <p className="text-[11px] font-mono text-slate-600 dark:text-slate-400">
              Strategic decisions, approvals, and dependencies requiring executive sponsorship
            </p>
          </div>
        </div>

        <span className="text-[10px] font-mono text-amber-800 dark:text-amber-400/80 uppercase px-2.5 py-1 rounded bg-amber-100 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-500/30 font-semibold">
          High Priority Items
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        {attentionItems.map((item) => (
          <div
            key={item.actionNo}
            onClick={() => onSelectAction(item.actionNo)}
            className="p-4 rounded-xl bg-white dark:bg-slate-900/90 hover:bg-slate-50 dark:hover:bg-slate-800/90 border border-amber-200 dark:border-amber-500/20 hover:border-amber-400 dark:hover:border-amber-400/50 shadow-sm transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 font-bold">
                  ACTION #{item.actionNo}
                </span>
                <StatusBadge status={item.status} size="sm" />
              </div>

              <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-200 group-hover:text-amber-700 dark:group-hover:text-amber-200 transition-colors line-clamp-1 mb-1.5">
                {item.title}
              </h4>

              <p className="text-[11px] text-amber-900/80 dark:text-amber-200/80 line-clamp-2 leading-relaxed">
                {item.attentionReason || item.story.nextMove.leadershipActionNeeded || item.story.nextMove.strategicNextStep}
              </p>
            </div>

            <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-[10px] font-mono">
              <span className="text-slate-500 dark:text-slate-400">Target: {item.revisedDueDate || item.story.nextMove.targetDate}</span>
              <span className="text-[#E31837] group-hover:translate-x-1 transition-transform flex items-center gap-1 font-semibold">
                <span>Examine</span>
                <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
