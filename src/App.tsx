import React, { useState, useEffect, useRef, Component, ErrorInfo, ReactNode } from 'react';
import { ExecutiveHeader, PresentationTheme } from './components/ExecutiveHeader';
import { PresentationController } from './components/PresentationController';
import { ExecutiveJourney } from './pages/ExecutiveJourney';
import { MomReview } from './pages/MomReview';
import { ItOpsPulse } from './pages/ItOpsPulse';
import { TicketPulse } from './pages/TicketPulse';
import { AutonomousServiceDesk } from './pages/AutonomousServiceDesk';
import { AiopsRoadmap } from './pages/AiopsRoadmap';
import { ProjectDeliveryDashboard } from './pages/ProjectDeliveryDashboard';
import { CostOptimization } from './pages/CostOptimization';
import { VulnerabilityDashboard } from './pages/VulnerabilityDashboard';
import { RiskDashboard } from './pages/RiskDashboard';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Presentation error boundary caught:', error, errorInfo);
  }

  handleReset = () => {
    try {
      localStorage.removeItem('dh_live_data_cache');
      localStorage.removeItem('dh_live_data_cache_v2');
      localStorage.removeItem('dh_live_data_cache_v3');
      localStorage.removeItem('dh_live_data_cache_v4');
    } catch {}
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-slate-900 text-white min-h-[400px]">
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 max-w-lg">
            <AlertTriangle className="w-10 h-10 text-amber-500 mx-auto mb-3" />
            <h2 className="text-xl font-bold font-heading mb-2">Display Recovery</h2>
            <p className="text-sm text-slate-300 mb-4">
              {this.state.error?.message || 'An error occurred while displaying this slide.'}
            </p>
            <button
              onClick={this.handleReset}
              className="px-4 py-2 rounded-xl bg-[#E31837] text-white font-mono text-xs font-bold hover:bg-[#E31837]/80 transition-all flex items-center gap-2 mx-auto cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              Reset Cache &amp; Reload Slide
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export type SceneId =
  | 'agenda'
  | 'mom'
  | 'itops'
  | 'tickets'
  | 'auto_maturity'
  | 'vulnerability'
  | 'delivery'
  | 'risk'
  | 'cost_optimization'
  | 'aiops_roadmap';

export const App: React.FC = () => {
  // Core Executive Presentation Scenes
  const [currentScene, setCurrentScene] = useState<SceneId>('agenda');
  const [theme, setTheme] = useState<PresentationTheme>('white');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Fullscreen Management
  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch(err => {
        console.error('Fullscreen error:', err);
      });
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
      }).catch(err => {
        console.error('Exit fullscreen error:', err);
      });
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const scenes: SceneId[] = [
    'agenda',
    'mom',
    'itops',
    'tickets',
    'auto_maturity',
    'vulnerability',
    'delivery',
    'risk',
    'cost_optimization',
    'aiops_roadmap'
  ];
  const currentIndex = scenes.indexOf(currentScene);

  const handleNext = () => {
    if (currentIndex < scenes.length - 1) {
      setCurrentScene(scenes[currentIndex + 1]);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentScene(scenes[currentIndex - 1]);
    }
  };

  const getSceneTitle = () => {
    switch (currentScene) {
      case 'agenda': return 'Monthly Service Review';
      case 'mom': return 'MOM | From Commitment to Outcome';
      case 'itops': return 'IT Operations | Business Pulse';
      case 'tickets': return 'Service Management | ITSM Dashboard';
      case 'auto_maturity': return 'Automation Strategy | Autonomous Service Desk Maturity';
      case 'vulnerability': return 'Governance & Resilience | Vulnerability Management Dashboard';
      case 'delivery': return 'Strategic Delivery | Demand to Project Delivery Dashboard';
      case 'risk': return 'Governance & Resilience | Risk Dashboard & Overdue Overview';
      case 'cost_optimization': return 'Financial Co-Creation | Cost Optimization';
      case 'aiops_roadmap': return 'Automation & AIOps | AIOPS Roadmap Year 1';
      default: return 'Dubai Holding Managed Services';
    }
  };

  const getThemeClass = () => {
    if (theme === 'white') return 'theme-white bg-[#FFFFFF] text-[#29251D]';
    if (theme === 'bw-dark') return 'theme-bw-dark bg-black text-white';
    if (theme === 'bw-light') return 'theme-bw-light bg-[#FFFFFF] text-[#29251D]';
    return 'theme-color bg-[#0A0838] text-slate-100';
  };

  return (
    <div
      ref={containerRef}
      className={`w-screen h-screen flex flex-col justify-between overflow-hidden select-none font-sans transition-colors duration-300 relative ${getThemeClass()}`}
    >
      {/* GLOBAL PERSISTENT HEADER WITH [ HOME ] [ < ] [ > ] CONTROLS AND THEME SWITCHER */}
      <ExecutiveHeader
        currentSectionId={currentScene}
        currentSectionTitle={getSceneTitle()}
        currentIndex={currentIndex}
        totalScenes={scenes.length}
        onGoHome={() => setCurrentScene('agenda')}
        onPrev={handlePrev}
        onNext={handleNext}
        canPrev={currentIndex > 0}
        canNext={currentIndex < scenes.length - 1}
        theme={theme}
        onSelectTheme={setTheme}
        onToggleFullscreen={handleToggleFullscreen}
        isFullscreen={isFullscreen}
        onOpenHelp={() => setIsHelpOpen(true)}
      />

      {/* 16:9 EXECUTIVE PRESENTATION CANVAS VIEWPORT */}
      <main className="flex-1 w-full relative overflow-hidden flex items-center justify-center">
        <div className="w-full h-full max-w-[1920px] max-h-[1080px] mx-auto flex flex-col justify-between">
          <ErrorBoundary key={currentScene}>
            {currentScene === 'agenda' && (
              <ExecutiveJourney
                onNavigateToScene={(scene) => setCurrentScene(scene)}
                onNavigateToMOM={() => setCurrentScene('mom')}
                onNavigateToITOps={() => setCurrentScene('itops')}
                onNavigateToTickets={() => setCurrentScene('tickets')}
                onNavigateToServiceDesk={() => setCurrentScene('tickets')}
                onNavigateToAutonomousOps={() => setCurrentScene('auto_maturity')}
              />
            )}

            {currentScene === 'mom' && (
              <MomReview
                onNavigateToNext={() => setCurrentScene('itops')}
              />
            )}

            {currentScene === 'itops' && (
              <ItOpsPulse
                onNavigateToMOM={() => setCurrentScene('mom')}
                onNavigateToNext={() => setCurrentScene('tickets')}
              />
            )}

            {currentScene === 'tickets' && (
              <TicketPulse
                onNavigateToPrev={() => setCurrentScene('itops')}
                onNavigateToNext={() => setCurrentScene('auto_maturity')}
              />
            )}

            {currentScene === 'auto_maturity' && (
              <AutonomousServiceDesk
                onNavigateToPrev={() => setCurrentScene('tickets')}
                onNavigateToNext={() => setCurrentScene('vulnerability')}
              />
            )}

            {currentScene === 'vulnerability' && (
              <VulnerabilityDashboard
                onNavigateToPrev={() => setCurrentScene('auto_maturity')}
                onNavigateToNext={() => setCurrentScene('delivery')}
              />
            )}

            {currentScene === 'delivery' && (
              <ProjectDeliveryDashboard
                onNavigateToPrev={() => setCurrentScene('vulnerability')}
                onNavigateToNext={() => setCurrentScene('risk')}
              />
            )}

            {currentScene === 'risk' && (
              <RiskDashboard
                onNavigateToPrev={() => setCurrentScene('delivery')}
                onNavigateToNext={() => setCurrentScene('cost_optimization')}
              />
            )}

            {currentScene === 'cost_optimization' && (
              <CostOptimization
                onNavigateToPrev={() => setCurrentScene('risk')}
                onNavigateToNext={() => setCurrentScene('aiops_roadmap')}
              />
            )}

            {currentScene === 'aiops_roadmap' && (
              <AiopsRoadmap
                onNavigateToPrev={() => setCurrentScene('cost_optimization')}
              />
            )}
          </ErrorBoundary>
        </div>
      </main>

      {/* PRESENTATION SHORTCUTS & HELP CONTROLLER */}
      <PresentationController
        onNext={handleNext}
        onPrev={handlePrev}
        onToggleFullscreen={handleToggleFullscreen}
        isFullscreen={isFullscreen}
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
      />
    </div>
  );
};

export default App;

