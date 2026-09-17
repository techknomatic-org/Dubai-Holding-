import React, { useEffect, useState } from 'react';
import { 
  Keyboard, 
  ArrowLeft, 
  ArrowRight, 
  Maximize, 
  Minimize, 
  X, 
  Sparkles,
  Command
} from 'lucide-react';

interface PresentationControllerProps {
  onNext: () => void;
  onPrev: () => void;
  onToggleFullscreen: () => void;
  isFullscreen: boolean;
  isOpen: boolean;
  onClose: () => void;
}

export const PresentationController: React.FC<PresentationControllerProps> = ({
  onNext,
  onPrev,
  onToggleFullscreen,
  isFullscreen,
  isOpen,
  onClose
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (['input', 'textarea'].includes((e.target as HTMLElement)?.tagName?.toLowerCase())) {
        return;
      }

      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        onNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        onPrev();
      } else if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        onToggleFullscreen();
      } else if (e.key === 'Escape') {
        if (isOpen) {
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onNext, onPrev, onToggleFullscreen, isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xl p-6">
      <div className="relative w-full max-w-2xl p-8 rounded-2xl bg-white dark:bg-[#0C1222] border border-slate-200 dark:border-white/15 shadow-2xl text-slate-800 dark:text-slate-100">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#F6F2EA] dark:bg-white/10 text-[#4D4D4F] dark:text-slate-300 hover:bg-[#E31837] hover:text-white dark:hover:bg-[#E31837] dark:hover:text-white border border-[#E5DFD3] dark:border-white/10 shadow-2xs flex items-center justify-center transition-all cursor-pointer"
          title="Close"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-[#E31837]/10 border border-[#E31837]/30 flex items-center justify-center">
            <Keyboard className="w-5 h-5 text-[#E31837]" />
          </div>
          <div>
            <h3 className="text-lg font-heading font-bold text-slate-900 dark:text-white tracking-wide">
              Executive Presentation Controls
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
              Keyboard shortcuts for high-stakes leadership delivery
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="font-mono text-sm text-slate-800 dark:text-slate-200">Next Section</span>
            </div>
            <div className="flex items-center gap-1.5">
              <kbd className="px-2.5 py-1 rounded bg-white dark:bg-slate-800 border border-slate-300 dark:border-white/10 font-mono text-xs text-[#E31837] shadow-sm">Space</kbd>
              <span className="text-slate-400 text-xs">or</span>
              <kbd className="px-2 py-1 rounded bg-white dark:bg-slate-800 border border-slate-300 dark:border-white/10 font-mono text-xs text-[#E31837] shadow-sm">→</kbd>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="font-mono text-sm text-slate-800 dark:text-slate-200">Previous Section</span>
            </div>
            <div>
              <kbd className="px-2.5 py-1 rounded bg-white dark:bg-slate-800 border border-slate-300 dark:border-white/10 font-mono text-xs text-[#E31837] shadow-sm">←</kbd>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="font-mono text-sm text-slate-800 dark:text-slate-200">Presentation Fullscreen</span>
            </div>
            <div>
              <kbd className="px-2.5 py-1 rounded bg-white dark:bg-slate-800 border border-slate-300 dark:border-white/10 font-mono text-xs text-[#E31837] shadow-sm">F</kbd>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="font-mono text-sm text-slate-800 dark:text-slate-200">Close Modals / Exit</span>
            </div>
            <div>
              <kbd className="px-2.5 py-1 rounded bg-white dark:bg-slate-800 border border-slate-300 dark:border-white/10 font-mono text-xs text-slate-600 dark:text-slate-400 shadow-sm">ESC</kbd>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-orange-50/80 dark:bg-gradient-to-r dark:from-amber-500/10 dark:via-sky-500/10 dark:to-indigo-500/10 border border-orange-200 dark:border-amber-500/20 text-xs text-slate-700 dark:text-slate-300 flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-[#E31837] dark:text-amber-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-[#E31837] dark:text-amber-300 block mb-0.5">Storytelling Principle:</span>
            Every page answers one central executive question. Use interactive commitment cards on the MOM page to uncover the complete 4-stage story arc from Commitment to Next Move.
          </div>
        </div>
      </div>
    </div>
  );
};
