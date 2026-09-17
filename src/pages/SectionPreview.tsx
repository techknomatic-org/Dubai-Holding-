import React from 'react';
import { SectionId } from '../types';
import { agendaItems } from '../data/agendaData';
import { 
  Sparkles, 
  ArrowLeft, 
  ArrowRight, 
  TrendingUp, 
  Cpu, 
  Server, 
  ShieldAlert, 
  Briefcase, 
  AlertTriangle, 
  DollarSign, 
  Compass 
} from 'lucide-react';

interface SectionPreviewProps {
  sectionId: SectionId;
  onNavigateToMOM: () => void;
  onNavigateToAgenda: () => void;
}

export const SectionPreview: React.FC<SectionPreviewProps> = ({
  sectionId,
  onNavigateToMOM,
  onNavigateToAgenda
}) => {
  const currentItem = agendaItems.find(item => item.id === sectionId) || agendaItems[0];

  const getSectionIcon = (id: SectionId) => {
    switch (id) {
      case '02-business-pulse': return TrendingUp;
      case '03-service-experience': return Server;
      case '04-autonomous-ops': return Cpu;
      case '05-vulnerability': return ShieldAlert;
      case '06-delivery': return Briefcase;
      case '07-risk': return AlertTriangle;
      case '08-value-creation': return DollarSign;
      case '09-forward-view': return Compass;
      default: return Sparkles;
    }
  };

  const Icon = getSectionIcon(sectionId);

  return (
    <div className="h-full flex flex-col justify-between p-8 md:p-12 relative overflow-hidden text-left">
      <div className="absolute inset-0 subtle-grid opacity-20 pointer-events-none" />
      <div className="absolute top-1/3 right-1/3 w-[600px] h-[400px] bg-sky-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className="w-2 h-2 rounded-full bg-[#0066B2] dark:bg-sky-400 animate-pulse" />
          <span className="text-xs font-medium text-[#0066B2] dark:text-sky-400">
            Section {currentItem.number} • Strategic Chapter
          </span>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 pb-6 border-b border-[#E5DFD3] dark:border-white/10">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-[#0A0838] dark:text-white flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#0A0838]/10 text-[#0A0838] dark:text-white border border-[#0A0838]/20 dark:border-white/20 flex items-center justify-center">
                <Icon className="w-6 h-6" />
              </div>
              <span>{currentItem.title}</span>
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onNavigateToMOM}
              className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 border border-[#E5DFD3] dark:border-white/10 text-xs font-mono text-slate-700 dark:text-slate-300 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>MOM Review</span>
            </button>
            <button
              onClick={onNavigateToAgenda}
              className="px-4 py-2 rounded-xl bg-[#0A0838] hover:bg-[#0A0838]/90 text-white border border-[#0A0838] text-xs font-mono transition-all cursor-pointer flex items-center gap-1.5 font-semibold shadow-xs"
            >
              <span>Agenda Journey</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Story Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 my-auto">
        {/* Core Question Card */}
        <div className="lg:col-span-2 rounded-2xl executive-glass p-8 space-y-6 border border-[#E5DFD3] dark:border-white/10">
          <div className="space-y-2">
            <span className="text-xs font-mono font-bold tracking-widest text-[#0A0838] dark:text-slate-300 uppercase">
              EXECUTIVE QUESTION ANSWERED
            </span>
            <h2 className="text-2xl md:text-3xl font-heading font-bold text-slate-900 dark:text-white">
              "{currentItem.executiveQuestion}"
            </h2>
          </div>

          <div className="p-6 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-[#E5DFD3] dark:border-white/5 space-y-3">
            <span className="text-xs font-mono font-bold text-[#0A0838] dark:text-slate-300 uppercase block">
              LEADERSHIP TAKEAWAY
            </span>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-sm">
              {currentItem.executiveTakeaway}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#E5DFD3] dark:border-white/5">
            <div>
              <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 block">KEY FOCUS</span>
              <span className="text-sm font-semibold text-slate-900 dark:text-slate-200">{currentItem.keyMetricHighlight.label}</span>
            </div>
            <div>
              <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 block">STATUS</span>
              <span className="text-sm font-semibold text-[#0A0838] dark:text-white">Active Review Chapter</span>
            </div>
          </div>
        </div>

        {/* Highlight Metric Card */}
        <div className="rounded-2xl bg-slate-50 dark:bg-gradient-to-br dark:from-[#121B33] dark:to-[#0A0F1E] border border-[#E5DFD3] dark:border-white/20 p-8 flex flex-col justify-between shadow-xl relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#0A0838]/5 rounded-full blur-2xl" />

          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                PRIMARY METRIC
              </span>
              <span className="w-2 h-2 rounded-full bg-[#0A0838] dark:bg-white animate-pulse" />
            </div>

            <div className="my-6 text-center">
              <div className="text-5xl md:text-6xl font-heading font-extrabold text-[#0A0838] dark:text-white">
                {currentItem.keyMetricHighlight.value}
              </div>
              <div className="text-sm font-medium text-slate-800 dark:text-slate-300 mt-2">
                {currentItem.keyMetricHighlight.label}
              </div>
              {currentItem.keyMetricHighlight.sublabel && (
                <div className="text-xs font-mono text-[#4D4D4F] dark:text-slate-400 mt-1">
                  {currentItem.keyMetricHighlight.sublabel}
                </div>
              )}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-slate-900/60 border border-[#E5DFD3] dark:border-white/10 text-xs font-mono text-slate-600 dark:text-slate-400 text-center shadow-xs">
            <span className="text-slate-900 dark:text-slate-200 font-semibold block mb-0.5">{currentItem.title}</span>
            Detailed analytical breakdown mapped to core operational data model.
          </div>
        </div>
      </div>
    </div>
  );
};
