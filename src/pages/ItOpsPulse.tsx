import React, { useState, useEffect } from 'react';
import { ITOPS_METRIC_DEFS } from '../data/itopsData';
import { useLiveData } from '../hooks/useLiveData';
import { LiveDataBadge } from '../components/LiveDataBadge';
import { 
  ShieldCheck, 
  Smile, 
  GitCommit, 
  AlertOctagon, 
  CheckCircle2, 
  TrendingUp, 
  Activity, 
  RotateCcw, 
  Edit3, 
  Save, 
  Trash2, 
  Check 
} from 'lucide-react';

interface ItOpsPulseProps {
  onNavigateToMOM?: () => void;
  onNavigateToNext?: () => void;
}

const defaultFallbackRecord = {
  monthKey: '2026-07',
  monthLabel: 'Jul',
  fullName: 'July 2026',
  isActual: true,
  availabilityPct: 99.81,
  availabilityTarget: 99.00,
  csat: 4.54,
  csatTarget: 4.50,
  changeRecords: 99,
  changeSuccessPct: 97.00,
  majorIncidents: 1,
  kpisTotal: 56,
  kpisApplicable: 30,
  kpisMet: 29,
  kpisNotMet: 1,
  kpisCantMeasure: 2
};

export const ItOpsPulse: React.FC<ItOpsPulseProps> = ({
  onNavigateToMOM,
  onNavigateToNext
}) => {
  // Live data from SharePoint Excel (sheets 03_ITOps_Monthly + 04_ITOps_KPI_Status)
  const { data: liveData, isLoading, isRefreshing, error, lastUpdatedDisplay, dataSource, refresh } = useLiveData();
  
  const rawHistory = liveData?.itOpsMonthly;
  const itOpsMonthlyHistory = (Array.isArray(rawHistory) && rawHistory.length > 0)
    ? rawHistory
    : [defaultFallbackRecord];

  // Selected metric card: null (show all by default) | 'availability' | 'csat' | 'change' | 'incidents' | 'kpis'
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);
  
  // Find default reporting month: last actual month in the dataset as per Excel source (July 2026)
  const actualIndices = itOpsMonthlyHistory
    .map((m, idx) => (m.isActual ? idx : -1))
    .filter(idx => idx !== -1);
  const lastActualMonthIdx = actualIndices.length > 0 ? actualIndices[actualIndices.length - 1] : 0;
  const [selectedMonthIdx, setSelectedMonthIdx] = useState<number>(lastActualMonthIdx);
  const [animStage, setAnimStage] = useState<number>(0);

  // Reset selectedMonthIdx to latest actual month when live data loads
  useEffect(() => {
    if (itOpsMonthlyHistory.length > 0) {
      const idxs = itOpsMonthlyHistory
        .map((m, idx) => (m.isActual ? idx : -1))
        .filter(idx => idx !== -1);
      setSelectedMonthIdx(idxs.length > 0 ? idxs[idxs.length - 1] : 0);
    }
  }, [itOpsMonthlyHistory.length]);

  // User input text notes state with localStorage persistence
  const [executiveNotes, setExecutiveNotes] = useState<string>(() => {
    return localStorage.getItem('itops_executive_notes') || 
      '• Steady INFRA Availability with July at 99.81%.\n• CSAT maintained at 4.54.\n• Change success at 97.00% in July (6-month avg: 96.17%).\n• No Major Incidents reported in May & June.';
  });
  const [isSaved, setIsSaved] = useState(false);

  // Sequential Executive Animation
  useEffect(() => {
    const t1 = setTimeout(() => setAnimStage(1), 60);
    const t2 = setTimeout(() => setAnimStage(2), 200);
    const t3 = setTimeout(() => setAnimStage(3), 400);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  // Save notes to localStorage
  const handleSaveNotes = () => {
    localStorage.setItem('itops_executive_notes', executiveNotes);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleClearNotes = () => {
    setExecutiveNotes('');
    localStorage.removeItem('itops_executive_notes');
  };

  const handleInsertObservation = (text: string) => {
    setExecutiveNotes(prev => prev ? `${prev}\n• ${text}` : `• ${text}`);
  };

  // Primary default reporting month (dynamically last actual month)
  const reportingRecord = itOpsMonthlyHistory[lastActualMonthIdx] || itOpsMonthlyHistory[0] || defaultFallbackRecord;

  // Active record based on selected month on the trend
  const activeRecord = (selectedMonthIdx >= 0 && itOpsMonthlyHistory[selectedMonthIdx]) ? itOpsMonthlyHistory[selectedMonthIdx] : reportingRecord;

  // Helper: When a specific KPI is selected, ONLY that KPI's card changes as months are clicked.
  // The other KPI cards stay locked at the main reporting month (July 2026).
  // When 'Show All' is active (selectedMetric === null), all cards sync to the selected month.
  const getCardRecord = (metricKey: 'availability' | 'csat' | 'change' | 'incidents' | 'kpis') => {
    if (selectedMetric === null || selectedMetric === metricKey) {
      return activeRecord || defaultFallbackRecord;
    }
    return reportingRecord || defaultFallbackRecord;
  };

  // Normalization Helpers for the Trajectory Timeline (0 to 100 vertical scale)
  const normAvailability = (val: number) => {
    const min = 99.0, max = 100.0;
    const safeVal = typeof val === 'number' && !isNaN(val) ? val : 99.81;
    return Math.max(15, Math.min(88, ((safeVal - min) / (max - min)) * 72 + 15));
  };

  const normCsat = (val: number) => {
    const min = 4.40, max = 4.70;
    const safeVal = typeof val === 'number' && !isNaN(val) ? val : 4.54;
    return Math.max(15, Math.min(88, ((safeVal - min) / (max - min)) * 72 + 15));
  };

  const normChange = (val: number) => {
    const min = 92.0, max = 100.0;
    const safeVal = typeof val === 'number' && !isNaN(val) ? val : 97.0;
    return Math.max(15, Math.min(88, ((safeVal - min) / (max - min)) * 72 + 15));
  };

  const normIncidents = (val: number) => {
    const safeVal = typeof val === 'number' && !isNaN(val) ? val : 0;
    return Math.max(15, 88 - (safeVal * 28));
  };

  const normKpis = (met: number, app: number) => {
    const safeApp = typeof app === 'number' && app > 0 ? app : 30;
    const safeMet = typeof met === 'number' && !isNaN(met) ? met : 29;
    const pct = (safeMet / safeApp) * 100;
    return Math.max(15, Math.min(88, ((pct - 70) / 30) * 72 + 15));
  };

  // SVG Coordinates calculation for 6 months
  const svgWidth = 680;
  const svgHeight = 210;
  const paddingX = 50;
  const paddingY = 30;
  const availableWidth = svgWidth - paddingX * 2;
  const availableHeight = svgHeight - paddingY * 2;

  const getX = (idx: number) => {
    const totalSlots = Math.max(1, itOpsMonthlyHistory.length - 1);
    return paddingX + (idx / totalSlots) * availableWidth;
  };
  const getY = (normVal: number) => (svgHeight - paddingY) - (normVal / 100) * availableHeight;

  // Generate Smooth Curved SVG Path (Bezier Spline)
  const generateSmoothPath = (normFn: (rec: any) => number) => {
    const points = itOpsMonthlyHistory.map((rec, idx) => ({
      x: getX(idx),
      y: getY(normFn(rec))
    }));

    if (points.length === 0) return '';
    if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;

    let path = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i];
      const p1 = points[i + 1];
      const cx1 = p0.x + (p1.x - p0.x) * 0.45;
      const cy1 = p0.y;
      const cx2 = p0.x + (p1.x - p0.x) * 0.55;
      const cy2 = p1.y;
      path += ` C ${cx1} ${cy1}, ${cx2} ${cy2}, ${p1.x} ${p1.y}`;
    }
    return path;
  };

  // Generate Closed Area Path for Gradient Fill
  const generateAreaPath = (linePath: string) => {
    if (!linePath) return '';
    const firstX = getX(0);
    const lastX = getX(Math.max(0, itOpsMonthlyHistory.length - 1));
    const bottomY = svgHeight - paddingY;
    return `${linePath} L ${lastX} ${bottomY} L ${firstX} ${bottomY} Z`;
  };

  const pathAvailability = generateSmoothPath(r => normAvailability(r.availabilityPct));
  const pathCsat = generateSmoothPath(r => normCsat(r.csat));
  const pathChange = generateSmoothPath(r => normChange(r.changeSuccessPct));
  const pathIncidents = generateSmoothPath(r => normIncidents(r.majorIncidents));
  const pathKpis = generateSmoothPath(r => normKpis(r.kpisMet, r.kpisApplicable));

  // Determine active single metric details
  const activeMetricDef = selectedMetric ? ITOPS_METRIC_DEFS[selectedMetric] : null;

  // Active Value & Unit for Floating Callout on Chart (Consistently 2 decimal places)
  const getActiveCalloutText = (idx: number) => {
    const rec = itOpsMonthlyHistory[idx] || reportingRecord;
    if (!rec) return '99.81%';
    if (selectedMetric === 'availability') return `${(rec.availabilityPct ?? 99.81).toFixed(2)}%`;
    if (selectedMetric === 'csat') return `${(rec.csat ?? 4.54).toFixed(2)}`;
    if (selectedMetric === 'change') return `${(rec.changeSuccessPct ?? 97.0).toFixed(2)}%`;
    if (selectedMetric === 'incidents') return `${rec.majorIncidents ?? 0} inc`;
    if (selectedMetric === 'kpis') return `${rec.kpisMet ?? 29}/${rec.kpisApplicable ?? 30}`;
    return `${(rec.availabilityPct ?? 99.81).toFixed(2)}%`;
  };

  const activeNodeY = selectedMetric === 'csat'
    ? getY(normCsat(activeRecord.csat))
    : selectedMetric === 'change'
    ? getY(normChange(activeRecord.changeSuccessPct))
    : selectedMetric === 'incidents'
    ? getY(normIncidents(activeRecord.majorIncidents))
    : selectedMetric === 'kpis'
    ? getY(normKpis(activeRecord.kpisMet, activeRecord.kpisApplicable))
    : getY(normAvailability(activeRecord.availabilityPct));

  return (
    <div 
      className={`h-full w-full flex flex-col p-5 md:p-6 lg:p-7 gap-4 relative overflow-hidden text-left select-none transition-opacity duration-500 bg-[#FFFFFF] dark:bg-[#0A0838] text-[#29251D] dark:text-white ${isLoading ? 'opacity-60' : 'opacity-100'}`}
    >
      {/* Background Subtle Pattern */}
      <div className="absolute inset-0 subtle-grid opacity-15 pointer-events-none" />

      {/* ========================================================================
          1. TOP HEADER: TITLE & EXECUTIVE FRAMING
         ======================================================================== */}
      <div className={`transition-all duration-700 shrink-0 ${animStage >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-full bg-[#0066B2] dark:bg-sky-400 animate-pulse" />
          <span className="text-xs font-medium text-[#0066B2] dark:text-sky-400">
            02 • IT Operations
          </span>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-3 pb-3 border-b border-[#E5DFD3] dark:border-white/10">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-[#29251D] dark:text-white">
              IT Operations
            </h1>
            {/* Live Data Badge */}
            <div className="mt-1.5">
              <LiveDataBadge
                dataSource={dataSource}
                lastUpdatedDisplay={lastUpdatedDisplay}
                isRefreshing={isRefreshing}
                onRefresh={refresh}
                error={error}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================
          2. TOP 5 EXECUTIVE KPI CARDS (CLEAN LUXURY DESIGN, DYNAMIC MONTH SYNC)
         ======================================================================== */}
      {(() => {
        const recAvail = getCardRecord('availability');
        const recCsat = getCardRecord('csat');
        const recChange = getCardRecord('change');
        const recIncidents = getCardRecord('incidents');
        const recKpis = getCardRecord('kpis');

        return (
          <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 my-2.5 shrink-0 transition-all duration-700 ${animStage >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            
            {/* CARD 01: AVAILABILITY */}
            <div
              onClick={() => setSelectedMetric('availability')}
              className={`p-4 rounded-2xl transition-all duration-300 cursor-pointer flex flex-col justify-between relative overflow-hidden border ${
                selectedMetric === 'availability'
                  ? 'bg-[#FFFFFF] dark:bg-white/10 border-2 border-[#0A0838] dark:border-white ring-2 ring-[#0A0838]/10 shadow-md -translate-y-1'
                  : 'bg-[#F6F2EA] dark:bg-white/5 border-[#E5DFD3] dark:border-white/10 hover:border-[#0066B2] dark:hover:border-sky-400 hover:shadow-md hover:-translate-y-0.5'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#0A0838]/10 text-[#0A0838] dark:text-white flex items-center justify-center">
                    <ShieldCheck className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-sm font-medium text-[#4D4D4F] dark:text-slate-300">
                    Availability
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-[#0A0838]/10 text-[11px] font-medium text-[#0A0838] dark:text-slate-200">
                  Target 99.00%
                </span>
              </div>

              <div className="my-2 text-center">
                <span className="text-2xl font-semibold text-[#29251D] dark:text-white tracking-tight block">
                  {recAvail.availabilityPct.toFixed(2)}%
                </span>
              </div>

              <p className="text-xs text-[#4D4D4F] dark:text-slate-300 font-normal border-t border-[#E5DFD3] dark:border-white/10 pt-2 line-clamp-1">
                Reliability remains above target
              </p>
            </div>

            {/* CARD 02: CSAT */}
            <div
              onClick={() => setSelectedMetric('csat')}
              className={`p-4 rounded-2xl transition-all duration-300 cursor-pointer flex flex-col justify-between relative overflow-hidden border ${
                selectedMetric === 'csat'
                  ? 'bg-[#FFFFFF] dark:bg-white/10 border-2 border-[#0A0838] dark:border-white ring-2 ring-[#0A0838]/10 shadow-md -translate-y-1'
                  : 'bg-[#F6F2EA] dark:bg-white/5 border-[#E5DFD3] dark:border-white/10 hover:border-[#0066B2] dark:hover:border-sky-400 hover:shadow-md hover:-translate-y-0.5'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#0A0838]/10 text-[#0A0838] dark:text-white flex items-center justify-center">
                    <Smile className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-sm font-medium text-[#4D4D4F] dark:text-slate-300">
                    CSAT Score
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-[#0A0838]/10 text-[11px] font-medium text-[#0A0838] dark:text-slate-200">
                  Target 4.50
                </span>
              </div>

              <div className="my-2 flex items-baseline justify-center gap-1">
                <span className="text-2xl font-semibold text-[#29251D] dark:text-white tracking-tight">
                  {recCsat.csat.toFixed(2)}
                </span>
                <span className="text-xs text-[#4D4D4F] dark:text-slate-400 font-normal">/ 5.00</span>
              </div>

              <p className="text-xs text-[#4D4D4F] dark:text-slate-300 font-normal border-t border-[#E5DFD3] dark:border-white/10 pt-2 line-clamp-1">
                User experience remains healthy
              </p>
            </div>

            {/* CARD 03: CHANGE MANAGEMENT */}
            <div
              onClick={() => setSelectedMetric('change')}
              className={`p-4 rounded-2xl transition-all duration-300 cursor-pointer flex flex-col justify-between relative overflow-hidden border ${
                selectedMetric === 'change'
                  ? 'bg-[#FFFFFF] dark:bg-white/10 border-2 border-[#0A0838] dark:border-white ring-2 ring-[#0A0838]/10 shadow-md -translate-y-1'
                  : 'bg-[#F6F2EA] dark:bg-white/5 border-[#E5DFD3] dark:border-white/10 hover:border-[#0066B2] dark:hover:border-sky-400 hover:shadow-md hover:-translate-y-0.5'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#0A0838]/10 text-[#0A0838] dark:text-white flex items-center justify-center">
                    <GitCommit className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-sm font-medium text-[#4D4D4F] dark:text-slate-300">
                    Change Management
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-[#E1EAF6] text-[11px] font-medium text-[#3A59A4]">
                  {recChange.changeRecords} Records
                </span>
              </div>

              <div className="my-2 text-center">
                <span className="text-2xl font-semibold text-[#29251D] dark:text-white tracking-tight block">
                  {recChange.changeSuccessPct.toFixed(2)}%
                </span>
              </div>

              <p className="text-xs text-[#4D4D4F] dark:text-slate-300 font-normal border-t border-[#E5DFD3] dark:border-white/10 pt-2 line-clamp-1">
                Change execution remains controlled
              </p>
            </div>

            {/* CARD 04: MAJOR INCIDENTS */}
            <div
              onClick={() => setSelectedMetric('incidents')}
              className={`p-4 rounded-2xl transition-all duration-300 cursor-pointer flex flex-col justify-between relative overflow-hidden border ${
                selectedMetric === 'incidents'
                  ? 'bg-[#FFFFFF] dark:bg-white/10 border-2 border-[#0A0838] dark:border-white ring-2 ring-[#0A0838]/10 shadow-md -translate-y-1'
                  : 'bg-[#F6F2EA] dark:bg-white/5 border-[#E5DFD3] dark:border-white/10 hover:border-[#0066B2] dark:hover:border-sky-400 hover:shadow-md hover:-translate-y-0.5'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#0A0838]/10 text-[#0A0838] dark:text-white flex items-center justify-center">
                    <AlertOctagon className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-sm font-medium text-[#4D4D4F] dark:text-slate-300">
                    Major Incidents
                  </span>
                </div>
              </div>

              <div className="my-2 flex items-baseline justify-center gap-1.5">
                <span className="text-2xl font-semibold text-[#29251D] dark:text-white tracking-tight">
                  {recIncidents.majorIncidents}
                </span>
                <span className="text-xs text-[#4D4D4F] dark:text-slate-400 font-normal">Incidents</span>
              </div>

              <p className="text-xs text-[#4D4D4F] dark:text-slate-300 font-normal border-t border-[#E5DFD3] dark:border-white/10 pt-2 line-clamp-1">
                No emerging major-incident pattern
              </p>
            </div>

            {/* CARD 05: KPI HEALTH */}
            <div
              onClick={() => setSelectedMetric('kpis')}
              className={`p-4 rounded-2xl transition-all duration-300 cursor-pointer flex flex-col justify-between relative overflow-hidden border ${
                selectedMetric === 'kpis'
                  ? 'bg-[#FFFFFF] dark:bg-white/10 border-2 border-[#0A0838] dark:border-white ring-2 ring-[#0A0838]/10 shadow-md -translate-y-1'
                  : 'bg-[#F6F2EA] dark:bg-white/5 border-[#E5DFD3] dark:border-white/10 hover:border-[#0066B2] dark:hover:border-sky-400 hover:shadow-md hover:-translate-y-0.5'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#0A0838]/10 text-[#0A0838] dark:text-white flex items-center justify-center">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-sm font-medium text-[#4D4D4F] dark:text-slate-300">
                    KPI Health
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-[#0A0838]/10 text-[11px] font-medium text-[#0A0838] dark:text-slate-200">
                  {((recKpis.kpisApplicable > 0 ? (recKpis.kpisMet / recKpis.kpisApplicable) * 100 : 100)).toFixed(2)}% Met
                </span>
              </div>

              <div className="my-2 text-center">
                <span className="text-2xl font-semibold text-[#29251D] dark:text-white tracking-tight block">
                  {recKpis.kpisMet} / {recKpis.kpisApplicable || 30}
                </span>
              </div>

              <p className="text-xs text-[#4D4D4F] dark:text-slate-300 font-normal border-t border-[#E5DFD3] dark:border-white/10 pt-2 line-clamp-1">
                {recKpis.kpisNotMet > 0 ? 'One KPI exception requires attention' : 'All operational KPIs fully met'}
              </p>
            </div>

          </div>
        );
      })()}

      {/* ========================================================================
          3. MAIN WORKSPACE: OPERATING TRAJECTORY & OBSERVATION AND SUMMARY
         ======================================================================== */}
      <div className={`grid grid-cols-1 lg:grid-cols-12 gap-3.5 flex-1 min-h-0 my-auto items-stretch transition-all duration-700 ${animStage >= 3 ? 'opacity-100' : 'opacity-0'}`}>
        
        {/* LEFT (7 COLS): OPERATING TRAJECTORY */}
        <div className="lg:col-span-7 flex flex-col justify-between p-4 sm:p-5 rounded-2xl bg-[#F6F2EA] dark:bg-white/5 border border-[#E5DFD3] dark:border-white/10 relative overflow-hidden shadow-sm h-full">
          
          {/* Trajectory Header & Dynamic Filter Legend */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-[#E5DFD3] dark:border-white/10">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#0A0838] dark:text-white" />
              <h3 className="font-semibold text-sm text-[#29251D] dark:text-white tracking-wide">
                Operating Trajectory
              </h3>
            </div>

            {/* Dynamic Legend: Single focused badge + Show All toggle */}
            <div className="flex items-center gap-2 flex-wrap text-xs">
              {selectedMetric ? (
                <div className="flex items-center gap-2">
                  <span 
                    className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium border shadow-xs bg-[#FFFFFF] dark:bg-[#0A0838]"
                    style={{
                      color: activeMetricDef?.colorHex || '#0A0838',
                      borderColor: '#E5DFD3'
                    }}
                  >
                    <span 
                      className="w-2.5 h-2.5 rounded-full shadow-xs" 
                      style={{ backgroundColor: activeMetricDef?.colorHex || '#0A0838' }} 
                    />
                    <span>{activeMetricDef?.title}</span>
                  </span>

                  <button
                    onClick={() => setSelectedMetric(null)}
                    className="p-1 px-2.5 rounded-lg bg-[#FFFFFF] dark:bg-white/5 hover:bg-[#F8B4A3]/20 text-[#4D4D4F] dark:text-slate-300 hover:text-[#29251D] dark:hover:text-white transition-all text-xs flex items-center gap-1 cursor-pointer border border-[#E5DFD3] dark:border-white/15 active:scale-95 shadow-xs font-medium"
                    title="Show All Metrics"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Show All</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setSelectedMetric('availability')}
                  className="px-3 py-1 rounded-lg bg-[#0A0838] text-white border border-[#0A0838] text-xs font-medium flex items-center gap-1.5 shadow-sm transition-all cursor-pointer active:scale-95 hover:bg-[#0A0838]/90"
                  title="Showing all KPI curves. Click to focus on Availability or click any KPI card above."
                >
                  <RotateCcw className="w-3 h-3 text-[#F8B4A3]" />
                  <span>Show All (Active)</span>
                </button>
              )}
            </div>
          </div>

          {/* SVG Control Timeline Canvas with Controlled Palette */}
          <div className="relative my-auto w-full h-[210px] flex items-center justify-center">
            <svg 
              viewBox={`0 0 ${svgWidth} ${svgHeight}`} 
              className="w-full h-full overflow-visible"
            >
              <defs>
                {/* Area Gradient Fills */}
                <linearGradient id="area-avail" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#059669" stopOpacity="0.14" />
                  <stop offset="100%" stopColor="#059669" stopOpacity="0.0" />
                </linearGradient>
                <linearGradient id="area-csat" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#E31837" stopOpacity="0.14" />
                  <stop offset="100%" stopColor="#E31837" stopOpacity="0.0" />
                </linearGradient>
                <linearGradient id="area-change" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#2563EB" stopOpacity="0.14" />
                  <stop offset="100%" stopColor="#2563EB" stopOpacity="0.0" />
                </linearGradient>
                <linearGradient id="area-incidents" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#D97706" stopOpacity="0.14" />
                  <stop offset="100%" stopColor="#D97706" stopOpacity="0.0" />
                </linearGradient>
                <linearGradient id="area-kpis" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#7C3AED" stopOpacity="0.14" />
                  <stop offset="100%" stopColor="#7C3AED" stopOpacity="0.0" />
                </linearGradient>

                {/* Active Column Glow Gradient */}
                <linearGradient id="column-glow" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="rgba(10, 8, 56, 0.08)" />
                  <stop offset="100%" stopColor="rgba(10, 8, 56, 0.01)" />
                </linearGradient>
              </defs>

              {/* Horizontal Baseline Reference Grids */}
              <line x1={paddingX} y1={paddingY + 25} x2={svgWidth - paddingX} y2={paddingY + 25} stroke="#E5DFD3" strokeDasharray="4 4" />
              <line x1={paddingX} y1={paddingY + 75} x2={svgWidth - paddingX} y2={paddingY + 75} stroke="#E5DFD3" strokeDasharray="4 4" />
              <line x1={paddingX} y1={paddingY + 125} x2={svgWidth - paddingX} y2={paddingY + 125} stroke="#E5DFD3" strokeDasharray="4 4" />
              {/* 1. AREA FILLS FOR ALL 5 KPIS */}
              {(!selectedMetric || selectedMetric === 'availability') && (
                <path d={generateAreaPath(pathAvailability)} fill="url(#area-avail)" />
              )}
              {(!selectedMetric || selectedMetric === 'csat') && (
                <path d={generateAreaPath(pathCsat)} fill="url(#area-csat)" />
              )}
              {(!selectedMetric || selectedMetric === 'change') && (
                <path d={generateAreaPath(pathChange)} fill="url(#area-change)" />
              )}
              {(!selectedMetric || selectedMetric === 'incidents') && (
                <path d={generateAreaPath(pathIncidents)} fill="url(#area-incidents)" />
              )}
              {(!selectedMetric || selectedMetric === 'kpis') && (
                <path d={generateAreaPath(pathKpis)} fill="url(#area-kpis)" />
              )}

              {/* 2. CURVED STROKE LINES FOR ALL 5 KPIS */}
              {(!selectedMetric || selectedMetric === 'availability') && (
                <path
                  d={pathAvailability}
                  fill="none"
                  stroke="#059669"
                  strokeWidth={selectedMetric === 'availability' ? 3.5 : 2.5}
                  className="transition-all duration-500"
                />
              )}
              {(!selectedMetric || selectedMetric === 'csat') && (
                <path
                  d={pathCsat}
                  fill="none"
                  stroke="#E31837"
                  strokeWidth={selectedMetric === 'csat' ? 3.5 : 2.5}
                  className="transition-all duration-500"
                />
              )}
              {(!selectedMetric || selectedMetric === 'change') && (
                <path
                  d={pathChange}
                  fill="none"
                  stroke="#2563EB"
                  strokeWidth={selectedMetric === 'change' ? 3.5 : 2.5}
                  className="transition-all duration-500"
                />
              )}
              {(!selectedMetric || selectedMetric === 'incidents') && (
                <path
                  d={pathIncidents}
                  fill="none"
                  stroke="#D97706"
                  strokeWidth={selectedMetric === 'incidents' ? 3.5 : 2.5}
                  className="transition-all duration-500"
                />
              )}
              {(!selectedMetric || selectedMetric === 'kpis') && (
                <path
                  d={pathKpis}
                  fill="none"
                  stroke="#7C3AED"
                  strokeDasharray="4 3"
                  strokeWidth={selectedMetric === 'kpis' ? 3.5 : 2.5}
                  className="transition-all duration-500"
                />
              )}

              {/* 3. MONTHLY VERTICAL COLUMNS & CLICKABLE NODES */}
              {itOpsMonthlyHistory.map((rec, idx) => {
                const x = getX(idx);
                const isSelectedMonth = selectedMonthIdx === idx;

                return (
                  <g 
                    key={rec.monthKey} 
                    className="cursor-pointer"
                    onClick={() => setSelectedMonthIdx(idx)}
                  >
                    {/* Active Month Column Glow Pillar */}
                    {isSelectedMonth && (
                      <rect
                        x={x - 26}
                        y={paddingY - 8}
                        width={52}
                        height={svgHeight - paddingY * 2 + 16}
                        rx={10}
                        fill="url(#column-glow)"
                        stroke="#0A0838"
                        strokeOpacity="0.2"
                        strokeWidth="1.5"
                      />
                    )}

                    {/* Vertical Grid Line */}
                    <line
                      x1={x}
                      y1={paddingY}
                      x2={x}
                      y2={svgHeight - paddingY}
                      stroke={isSelectedMonth ? '#0A0838' : '#E5DFD3'}
                      strokeWidth={isSelectedMonth ? 2 : 1}
                      strokeDasharray={isSelectedMonth ? '' : '3 3'}
                    />

                    {/* Month Label X-Axis */}
                    <text
                      x={x}
                      y={svgHeight - 6}
                      fill={isSelectedMonth ? '#0A0838' : '#4D4D4F'}
                      fontSize="12"
                      fontWeight={isSelectedMonth ? '600' : '400'}
                      textAnchor="middle"
                      className="transition-colors"
                    >
                      {rec.monthLabel}
                      {isSelectedMonth && ' *'}
                    </text>

                    {/* Nodes for Availability */}
                    {(!selectedMetric || selectedMetric === 'availability') && (
                      <circle
                        cx={x}
                        cy={getY(normAvailability(rec.availabilityPct))}
                        r={selectedMetric === 'availability' ? (isSelectedMonth ? 6.5 : 4.5) : (isSelectedMonth ? 4.5 : 3)}
                        fill={isSelectedMonth ? '#059669' : '#FFFFFF'}
                        stroke="#059669"
                        strokeWidth="2.5"
                      />
                    )}

                    {/* Nodes for CSAT */}
                    {(!selectedMetric || selectedMetric === 'csat') && (
                      <circle
                        cx={x}
                        cy={getY(normCsat(rec.csat))}
                        r={selectedMetric === 'csat' ? (isSelectedMonth ? 6.5 : 4.5) : (isSelectedMonth ? 4.5 : 3)}
                        fill={isSelectedMonth ? '#E31837' : '#FFFFFF'}
                        stroke="#E31837"
                        strokeWidth="2.5"
                      />
                    )}

                    {/* Nodes for Change */}
                    {(!selectedMetric || selectedMetric === 'change') && (
                      <circle
                        cx={x}
                        cy={getY(normChange(rec.changeSuccessPct))}
                        r={selectedMetric === 'change' ? (isSelectedMonth ? 6.5 : 4.5) : (isSelectedMonth ? 4.5 : 3)}
                        fill={isSelectedMonth ? '#2563EB' : '#FFFFFF'}
                        stroke="#2563EB"
                        strokeWidth="2.5"
                      />
                    )}

                    {/* Nodes for Incidents */}
                    {(!selectedMetric || selectedMetric === 'incidents') && (
                      <circle
                        cx={x}
                        cy={getY(normIncidents(rec.majorIncidents))}
                        r={selectedMetric === 'incidents' ? (isSelectedMonth ? 6.5 : 4.5) : (isSelectedMonth ? 4.5 : 3)}
                        fill={isSelectedMonth ? '#D97706' : '#FFFFFF'}
                        stroke="#D97706"
                        strokeWidth="2.5"
                      />
                    )}

                    {/* Nodes for KPIs */}
                    {(!selectedMetric || selectedMetric === 'kpis') && (
                      <circle
                        cx={x}
                        cy={getY(normKpis(rec.kpisMet, rec.kpisApplicable))}
                        r={selectedMetric === 'kpis' ? (isSelectedMonth ? 6.5 : 4.5) : (isSelectedMonth ? 4.5 : 3)}
                        fill={isSelectedMonth ? '#7C3AED' : '#FFFFFF'}
                        stroke="#7C3AED"
                        strokeWidth="2.5"
                      />
                    )}
                  </g>
                );
              })}

              {/* 4. FLOATING VALUE CALLOUT OVER ACTIVE MONTH NODE */}
              {selectedMetric && (
                <g className="pointer-events-none transition-all duration-300">
                  <rect
                    x={getX(selectedMonthIdx) - 38}
                    y={activeNodeY - 32}
                    width={76}
                    height={22}
                    rx={6}
                    fill="#0A0838"
                    stroke={activeMetricDef?.colorHex || '#0A0838'}
                    strokeWidth="1.5"
                    filter="drop-shadow(0px 4px 8px rgba(0,0,0,0.2))"
                  />
                  <text
                    x={getX(selectedMonthIdx)}
                    y={activeNodeY - 17}
                    fill="#FFFFFF"
                    fontSize="11.5"
                    fontWeight="600"
                    textAnchor="middle"
                  >
                    {getActiveCalloutText(selectedMonthIdx)}
                  </text>
                </g>
              )}
            </svg>
          </div>

          {/* Timeline Inspection Footer: Clean Selected Month Indicator */}
          <div className="pt-2 border-t border-[#E5DFD3] dark:border-white/10 flex items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-[#4D4D4F] dark:text-slate-400 font-medium">Reporting Period:</span>
              <span className="px-2.5 py-0.5 rounded-md bg-[#0A0838]/10 text-[#0A0838] dark:text-white dark:bg-white/10 border border-[#0A0838]/20 font-semibold">
                {activeRecord.fullName}
              </span>
              {!activeRecord.isActual && (
                <span className="text-xs text-[#B54708] font-medium">(Extensible model)</span>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT (5 COLS): OBSERVATION AND SUMMARY INPUT TEXT BOX */}
        <div className="lg:col-span-5 flex flex-col justify-between p-4 sm:p-5 rounded-2xl bg-[#F6F2EA] dark:bg-white/5 border border-[#E5DFD3] dark:border-white/10 shadow-sm h-full">
          <div className="flex flex-col h-full justify-between gap-3">
            
            {/* Header: Title */}
            <div className="flex items-center justify-between pb-2.5 border-b border-[#E5DFD3] dark:border-white/10 shrink-0">
              <div className="flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-[#0A0838] dark:text-white" />
                <h3 className="font-semibold text-sm text-[#29251D] dark:text-white tracking-wide">
                  Observations & Summary
                </h3>
              </div>
            </div>

            {/* Interactive Text Box Area - Full Available Height */}
            <div className="flex-1 min-h-[220px] relative">
              <textarea
                value={executiveNotes}
                onChange={(e) => {
                  setExecutiveNotes(e.target.value);
                  localStorage.setItem('itops_executive_notes', e.target.value);
                }}
                placeholder="Enter observations, key discussion points, or leadership decisions here..."
                className="w-full h-full p-3.5 rounded-xl bg-[#FFFFFF] dark:bg-[#0A0838] border border-[#E5DFD3] dark:border-white/10 focus:border-[#0A0838] focus:ring-2 focus:ring-[#0A0838]/10 text-xs md:text-sm text-[#29251D] dark:text-slate-100 placeholder-[#4D4D4F]/60 leading-relaxed resize-none focus:outline-none transition-all shadow-inner font-normal"
              />
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};
