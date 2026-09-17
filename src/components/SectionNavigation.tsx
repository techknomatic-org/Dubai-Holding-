import React from 'react';
import { SectionId } from '../types';
import { agendaItems } from '../data/agendaData';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface SectionNavigationProps {
  currentSectionId: SectionId;
  onSelectSection: (id: SectionId) => void;
  onPrevSection: () => void;
  onNextSection: () => void;
  canPrev: boolean;
  canNext: boolean;
}

export const SectionNavigation: React.FC<SectionNavigationProps> = ({
  currentSectionId,
  onSelectSection,
  onPrevSection,
  onNextSection,
  canPrev,
  canNext
}) => {
  const currentIndex = agendaItems.findIndex(item => item.id === currentSectionId);

  return (
    <nav aria-label="Executive Presentation Navigation" className="relative z-20 flex items-center justify-between px-8 py-2.5 bg-[#060A14]/80 border-t border-white/8 backdrop-blur-md">
      {/* Step Controller */}
      <div className="flex items-center gap-2">
        <button
          onClick={onPrevSection}
          disabled={!canPrev}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-mono transition-all ${canPrev
              ? 'text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 cursor-pointer'
              : 'text-slate-600 bg-white/2 border border-white/5 cursor-not-allowed opacity-50'
            }`}
          title="Previous Section (Left Arrow)"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">PREV</span>
        </button>

        <span className="text-[11px] font-mono text-slate-500 px-1">
          <span className="text-sky-400 font-bold">{currentIndex + 1}</span>
          <span className="text-slate-600"> / </span>
          <span>{agendaItems.length}</span>
        </span>

        <button
          onClick={onNextSection}
          disabled={!canNext}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-mono transition-all ${canNext
              ? 'text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 cursor-pointer'
              : 'text-slate-600 bg-white/2 border border-white/5 cursor-not-allowed opacity-50'
            }`}
          title="Next Section (Right Arrow / Space)"
        >
          <span className="hidden sm:inline">NEXT</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Persistent Story Sequence Nodes */}
      <div className="flex items-center gap-1 md:gap-2 overflow-x-auto py-1 scrollbar-none">
        {agendaItems.map((item, idx) => {
          const isActive = item.id === currentSectionId;
          const isPast = idx < currentIndex;

          return (
            <button
              key={item.id}
              onClick={() => onSelectSection(item.id)}
              className={`group relative flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer ${isActive
                  ? 'bg-sky-500/15 text-sky-200 border border-sky-400/40 shadow-sm shadow-sky-500/20'
                  : isPast
                    ? 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent'
                    : 'text-slate-500 hover:text-slate-300 hover:bg-white/5 border border-transparent'
                }`}
            >
              {/* Progress Indicator Node */}
              <span className={`w-1.5 h-1.5 rounded-full transition-all ${isActive
                  ? 'bg-sky-400 ring-2 ring-sky-400/40 scale-125'
                  : isPast
                    ? 'bg-emerald-400/80'
                    : 'bg-slate-600'
                }`} />

              <span className={`font-semibold ${isActive ? 'text-sky-300' : 'text-slate-500'}`}>
                {item.number}
              </span>

              <span className={`hidden xl:inline text-[11px] font-medium tracking-wider ${isActive ? 'text-slate-100 font-semibold' : 'text-slate-400'
                }`}>
                {item.title}
              </span>
            </button>
          );
        })}
      </div>

      {/* Subtle Review Tag */}
      <div className="hidden lg:flex items-center gap-2 text-[11px] font-mono text-slate-400">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
        <span>Executive Review</span>
      </div>
    </nav>
  );
};
