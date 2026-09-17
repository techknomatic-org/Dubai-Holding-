import React, { useState, useEffect } from 'react';
import { agendaItems } from '../data/agendaData';
import { AgendaItem, SectionId } from '../types';
import {
  ArrowRight,
  Sparkles,
  ShieldAlert,
  AlertTriangle,
  TrendingUp,
  Cpu,
  Headphones,
  Briefcase,
  DollarSign,
  Compass,
  CheckCircle2
} from 'lucide-react';

export type NavigationTarget =
  | 'mom'
  | 'itops'
  | 'tickets'
  | 'auto_maturity'
  | 'aiops_roadmap'
  | 'delivery'
  | 'cost_optimization'
  | 'vulnerability'
  | 'risk';

interface ExecutiveJourneyProps {
  onNavigateToMOM: () => void;
  onNavigateToITOps?: () => void;
  onNavigateToTickets?: () => void;
  onNavigateToServiceDesk?: () => void;
  onNavigateToAutonomousOps?: () => void;
  onNavigateToScene?: (scene: NavigationTarget) => void;
}

export const ExecutiveJourney: React.FC<ExecutiveJourneyProps> = ({
  onNavigateToMOM,
  onNavigateToITOps,
  onNavigateToTickets,
  onNavigateToServiceDesk,
  onNavigateToAutonomousOps,
  onNavigateToScene
}) => {
  const [activeNode, setActiveNode] = useState<AgendaItem>(agendaItems[0]);
  const [animStage, setAnimStage] = useState<number>(0);

  // Sequential Executive Animation on Initial Load
  useEffect(() => {
    const t1 = setTimeout(() => setAnimStage(1), 100);
    const t2 = setTimeout(() => setAnimStage(2), 300);
    const t3 = setTimeout(() => setAnimStage(3), 600);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  // Keyboard navigation for presentation (Arrow keys, 1-8 numbers, Enter)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName?.toLowerCase();
      if (tag === 'input' || tag === 'textarea') return;

      const currentIdx = agendaItems.findIndex(item => item.id === activeNode.id);

      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        const nextIdx = (currentIdx + 1) % agendaItems.length;
        setActiveNode(agendaItems[nextIdx]);
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        const prevIdx = (currentIdx - 1 + agendaItems.length) % agendaItems.length;
        setActiveNode(agendaItems[prevIdx]);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        handleNavigate(getTargetScene(activeNode.id));
      } else if (['1', '2', '3', '4', '5', '6', '7', '8', '9'].includes(e.key)) {
        const num = parseInt(e.key, 10) - 1;
        if (agendaItems[num]) {
          setActiveNode(agendaItems[num]);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeNode]);

  const getSectionIcon = (id: SectionId) => {
    switch (id) {
      case '01-look-back': return CheckCircle2;
      case '02-business-pulse': return TrendingUp;
      case '03-service-experience': return Headphones;
      case '04-autonomous-ops': return Cpu;
      case '05-vulnerability': return ShieldAlert;
      case '06-delivery': return Briefcase;
      case '07-risk': return AlertTriangle;
      case '08-value-creation': return DollarSign;
      case '09-forward-view': return Compass;
      default: return Sparkles;
    }
  };

  const getTargetScene = (id: SectionId): NavigationTarget => {
    switch (id) {
      case '01-look-back': return 'mom';
      case '02-business-pulse': return 'itops';
      case '03-service-experience': return 'tickets';
      case '04-autonomous-ops': return 'auto_maturity';
      case '05-vulnerability': return 'vulnerability';
      case '06-delivery': return 'delivery';
      case '07-risk': return 'risk';
      case '08-value-creation': return 'cost_optimization';
      case '09-forward-view': return 'aiops_roadmap';
      default: return 'mom';
    }
  };

  const handleNavigate = (target: NavigationTarget) => {
    if (onNavigateToScene) {
      onNavigateToScene(target);
    } else if (target === 'mom' && onNavigateToMOM) {
      onNavigateToMOM();
    } else if (target === 'itops' && onNavigateToITOps) {
      onNavigateToITOps();
    } else if (target === 'tickets' && onNavigateToTickets) {
      onNavigateToTickets();
    } else if (target === 'auto_maturity' && onNavigateToAutonomousOps) {
      onNavigateToAutonomousOps();
    }
  };

  const handleCardClick = (item: AgendaItem) => {
    setActiveNode(item);
    const target = getTargetScene(item.id);
    handleNavigate(target);
  };

  return (
    <div className="h-full w-full flex flex-col justify-between p-4 md:p-6 lg:p-7 relative overflow-hidden text-left bg-[#FFFFFF] dark:bg-[#0A0838]">
      {/* Background Ambient Elements */}
      <div className="absolute inset-0 subtle-grid opacity-25 pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-[#E31837]/5 rounded-full blur-3xl pointer-events-none" />

      {/* TOP HEADER: Title & Executive Framing */}
      <div className={`transition-all duration-700 ${animStage >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-full bg-[#0066B2] dark:bg-sky-400 animate-pulse" />
          <span className="text-xs font-medium text-[#0066B2] dark:text-sky-400">
            Agenda
          </span>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-3 pb-2 border-b border-[#E5DFD3] dark:border-white/10">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-[#0A0838] dark:text-white">
              Monthly Service Review
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onNavigateToMOM}
              className="group flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0A0838] hover:bg-[#0A0838]/90 text-white font-semibold text-xs transition-all shadow-md shadow-[#0A0838]/20 cursor-pointer active:scale-95"
            >
              <span>Begin Review</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* CENTER: INTERACTIVE STORYTELLING TIMELINE CARDS */}
      <div className={`flex-1 flex flex-col justify-center py-2 my-auto relative transition-all duration-1000 ${animStage >= 2 ? 'opacity-100' : 'opacity-0'}`}>
        {/* 9 VISUAL NODES */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-2.5 relative z-10 items-stretch">
          {agendaItems.map((item, idx) => {
            const ItemIcon = getSectionIcon(item.id);
            const isSelected = activeNode.id === item.id;
            const delayMs = idx * 50;

            return (
              <div
                key={item.id}
                style={{
                  transitionDelay: `${delayMs}ms`
                }}
                className={`h-full transition-all duration-500 ${animStage >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                  }`}
              >
                <div
                  onMouseEnter={() => setActiveNode(item)}
                  onClick={() => handleCardClick(item)}
                  title={`Click to open Section ${item.number} • ${item.title}`}
                  className={`group relative p-3 lg:p-3.5 rounded-2xl transition-all duration-300 cursor-pointer text-left h-full min-h-[220px] lg:min-h-[240px] flex flex-col justify-between overflow-hidden ${isSelected
                      ? 'bg-[#FFFFFF] dark:bg-[#0A0838] border-2 border-[#0A0838] ring-2 ring-[#0A0838]/10 dark:border-white/40 dark:ring-white/10 shadow-lg -translate-y-1 scale-[1.02]'
                      : 'bg-[#F6F2EA] dark:bg-white/5 border border-[#E5DFD3] dark:border-white/10 hover:border-[#0A0838]/40 hover:-translate-y-0.5'
                    }`}
                >
                  {/* Top Node Indicator & Number */}
                  <div className="flex items-center justify-between mb-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${isSelected
                        ? 'bg-[#0A0838] text-white shadow-xs scale-105'
                        : 'bg-[#FFFFFF] dark:bg-white/5 text-[#0A0838] dark:text-slate-300 group-hover:text-[#0A0838] group-hover:scale-105 border border-[#E5DFD3] dark:border-white/10'
                      }`}>
                      <ItemIcon className="w-4 h-4" />
                    </div>

                    <span className={`text-xs font-bold tracking-wider ${isSelected ? 'text-[#0A0838] dark:text-white' : 'text-[#4D4D4F] dark:text-slate-400'
                      }`}>
                      {item.number}
                    </span>
                  </div>

                  {/* Title */}
                  <div className="flex-1 flex flex-col justify-start my-1">
                    <h3 className={`font-semibold text-xs lg:text-[13px] leading-snug tracking-tight transition-colors ${isSelected ? 'text-[#0A0838] dark:text-white' : 'text-[#29251D] dark:text-slate-200 group-hover:text-[#0A0838] dark:group-hover:text-white'
                      }`}>
                      {item.title}
                    </h3>
                  </div>

                  {/* Metric Teaser */}
                  <div className="mt-auto pt-2.5 border-t border-[#E5DFD3]/80 dark:border-white/10">
                    <div className="text-[10px] lg:text-[11px] text-[#4D4D4F] dark:text-slate-400 block leading-tight min-h-[2rem] flex items-center font-normal">
                      {item.keyMetricHighlight.label}
                    </div>
                    <div className="text-xs lg:text-sm font-bold text-[#0A0838] dark:text-white mt-0.5 tracking-tight">
                      {item.keyMetricHighlight.value}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* BOTTOM SECTION: DYNAMIC ON-PAGE IN-DEPTH AGENDA SPOTLIGHT WITH SMOOTH KEYED TRANSITION */}
      <div className={`rounded-2xl p-4 md:p-5 lg:p-6 transition-all duration-500 bg-[#F6F2EA] dark:bg-white/5 border border-[#E5DFD3] dark:border-white/10 shadow-xs ${animStage >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <div key={activeNode.id} className="flex flex-col lg:flex-row items-center justify-between gap-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
          {/* Left Column: Chapter Badge & Narrative */}
          <div className="flex-1 space-y-2 text-left">
            <div className="flex items-center gap-2.5">
              <span className="px-2.5 py-1 rounded-md bg-[#0A0838]/10 text-xs font-medium text-[#0A0838] dark:bg-white/10 dark:text-white border border-[#0A0838]/20 animate-in fade-in duration-200">
                Section {activeNode.number} • {activeNode.title}
              </span>
            </div>

            <p className="text-sm text-[#4D4D4F] dark:text-slate-300 leading-relaxed font-normal max-w-4xl pt-1">
              {activeNode.executiveTakeaway}
            </p>
          </div>

          {/* Right Column: Symmetrically Aligned Metric Scorecards */}
          <div className="shrink-0 flex items-center gap-3 w-full lg:w-auto justify-end">
            <div className="flex items-center justify-end gap-3 flex-wrap w-full sm:w-auto">
              {/* Metric 1 */}
              <div className="w-full sm:w-40 lg:w-44 min-h-[84px] px-3.5 py-2.5 rounded-xl bg-[#FFFFFF] dark:bg-white/5 border border-[#E5DFD3] dark:border-white/10 flex flex-col justify-center items-center text-center shadow-2xs">
                <span className="text-xs text-[#4D4D4F] dark:text-slate-400 block text-center leading-tight mb-1 font-normal line-clamp-2">
                  {activeNode.keyMetricHighlight.label}
                </span>
                <span className="text-lg font-bold text-[#0A0838] dark:text-white tracking-tight">
                  {activeNode.keyMetricHighlight.value}
                </span>
              </div>

              {/* Metric 2 */}
              {activeNode.secondaryMetrics && activeNode.secondaryMetrics[0] && (
                <div className="w-full sm:w-40 lg:w-44 min-h-[84px] px-3.5 py-2.5 rounded-xl bg-[#FFFFFF] dark:bg-white/5 border border-[#E5DFD3] dark:border-white/10 flex flex-col justify-center items-center text-center shadow-2xs">
                  <span className="text-xs text-[#4D4D4F] dark:text-slate-400 block text-center leading-tight mb-1 font-normal line-clamp-2">
                    {activeNode.secondaryMetrics[0].label}
                  </span>
                  <span className="text-lg font-bold text-[#0A0838] dark:text-slate-100 tracking-tight">
                    {activeNode.secondaryMetrics[0].value}
                  </span>
                </div>
              )}

              {/* Metric 3 */}
              {activeNode.secondaryMetrics && activeNode.secondaryMetrics[1] && (
                <div className="w-full sm:w-40 lg:w-44 min-h-[84px] px-3.5 py-2.5 rounded-xl bg-[#FFFFFF] dark:bg-white/5 border border-[#E5DFD3] dark:border-white/10 flex flex-col justify-center items-center text-center shadow-2xs">
                  <span className="text-xs text-[#4D4D4F] dark:text-slate-400 block text-center leading-tight mb-1 font-normal line-clamp-2">
                    {activeNode.secondaryMetrics[1].label}
                  </span>
                  <span className="text-lg font-bold text-[#0A0838] dark:text-slate-100 tracking-tight">
                    {activeNode.secondaryMetrics[1].value}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
