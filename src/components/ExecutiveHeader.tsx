import React from 'react';
import {
  Maximize2,
  Minimize2,
  ChevronLeft,
  ChevronRight,
  Home
} from 'lucide-react';
import { DualBrandHeaderLogo } from './BrandLogos';

export type PresentationTheme = 'white' | 'color' | 'bw-dark' | 'bw-light';

interface ExecutiveHeaderProps {
  currentSectionId: string;
  currentSectionTitle: string;
  currentIndex: number;
  totalScenes: number;
  onPrev: () => void;
  onNext: () => void;
  onGoHome?: () => void;
  canPrev: boolean;
  canNext: boolean;
  theme: PresentationTheme;
  onSelectTheme: (t: PresentationTheme) => void;
  onToggleFullscreen: () => void;
  isFullscreen: boolean;
  onOpenHelp: () => void;
}

export const ExecutiveHeader: React.FC<ExecutiveHeaderProps> = ({
  currentSectionId,
  currentSectionTitle,
  currentIndex,
  totalScenes,
  onPrev,
  onNext,
  onGoHome,
  canPrev,
  canNext,
  theme,
  onSelectTheme,
  onToggleFullscreen,
  isFullscreen,
  onOpenHelp
}) => {
  const isDark = theme === 'bw-dark' || theme === 'color';

  return (
    <header className={`relative z-30 flex items-center justify-between px-6 py-2.5 border-b backdrop-blur-xl transition-colors shadow-xs ${
      isDark ? 'bg-[#0A0838] border-white/10 text-white' : 'bg-[#FFFFFF] border-[#E5DFD3] text-[#29251D]'
    }`}>
      {/* Left: Client Brand + Navigation Controller [ Home ] [ < ] [ > ] */}
      <div className="flex items-center gap-3.5">
        {/* Dubai Holding & Tech Mahindra Official Brand Logos */}
        <DualBrandHeaderLogo className="h-8" theme={theme} />

        {/* [ Home ] [ < ] [ > ] NAVIGATION CONTROLS (Only visible from Slide 2 onwards) */}
        {currentIndex !== 0 && (
          <>
            {/* Divider */}
            <div className="h-5 w-[1px] bg-[#E5DFD3] dark:bg-white/15" />

            <div className="flex items-center gap-1.5 animate-in fade-in duration-200">
              <button
                onClick={onGoHome}
                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all border cursor-pointer shadow-2xs active:scale-95 ${
                  isDark
                    ? 'bg-white/10 hover:bg-[#E31837] hover:text-white text-white border-white/20 hover:border-[#E31837]'
                    : 'bg-[#F6F2EA] hover:bg-[#E31837] hover:text-white text-[#29251D] border-[#E5DFD3] hover:border-[#E31837]'
                }`}
                title="Return to Home (Monthly Service Review)"
              >
                <Home className="w-4 h-4" />
              </button>

              <button
                onClick={onPrev}
                disabled={!canPrev}
                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all border ${
                  canPrev
                    ? isDark
                      ? 'bg-white/10 hover:bg-[#E31837]/20 text-white border-white/20 hover:border-[#E31837]/50 cursor-pointer shadow-2xs active:scale-95'
                      : 'bg-[#F6F2EA] hover:bg-[#E31837]/15 text-[#29251D] border-[#E5DFD3] hover:border-[#E31837]/50 cursor-pointer shadow-2xs active:scale-95'
                    : 'bg-slate-100 dark:bg-white/3 text-slate-400 dark:text-slate-600 border-slate-200 dark:border-white/5 cursor-not-allowed opacity-40'
                }`}
                title="Previous (Left Arrow ←)"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                onClick={onNext}
                disabled={!canNext}
                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all border ${
                  canNext
                    ? 'bg-[#E31837]/15 hover:bg-[#E31837]/30 text-[#E31837] border-[#E31837]/40 hover:border-[#E31837]/60 cursor-pointer shadow-2xs active:scale-95'
                    : 'bg-slate-100 dark:bg-white/3 text-slate-400 dark:text-slate-600 border-slate-200 dark:border-white/5 cursor-not-allowed opacity-40'
                }`}
                title="Next (Right Arrow → / Space)"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </>
        )}
      </div>

      {/* Right Controls: Fullscreen */}
      <div className="flex items-center gap-2.5">
        {/* Fullscreen Mode */}
        <button
          onClick={onToggleFullscreen}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shadow-xs cursor-pointer ${
            isFullscreen
              ? 'bg-[#FFFFFF] dark:bg-[#FFFFFF] text-[#10B981] border-2 border-[#10B981] hover:bg-[#F0FDF4] dark:hover:bg-[#F0FDF4] hover:border-[#10B981]'
              : 'bg-[#E31837]/10 hover:bg-[#E31837]/20 border border-[#E31837]/30 text-[#E31837]'
          }`}
          title={isFullscreen ? 'Exit Fullscreen (ESC)' : 'Presentation Fullscreen Mode (F)'}
        >
          {isFullscreen ? (
            <>
              <Minimize2 className="w-3.5 h-3.5 text-[#10B981]" />
              <span className="hidden sm:inline text-[11px] font-bold text-[#10B981]">Exit Fullscreen</span>
            </>
          ) : (
            <>
              <Maximize2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline text-[11px]">Present</span>
            </>
          )}
        </button>
      </div>
    </header>
  );
};
