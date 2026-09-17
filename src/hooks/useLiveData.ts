import { useState, useEffect, useCallback, useRef } from 'react';
import {
  fetchLiveData,
  parseWorkbookFromBuffer,
  uploadWorkbookToServer,
  checkExcelStatus,
  LiveDataModel,
  formatLastUpdated
} from '../data/sharepointService';

// Static fallback data imports
import {
  ticketMonthlyClosures,
  ticketSummaryKPIs,
  teamTicketVolumetrics,
  topIncidentCategories,
  topServiceRequestCategories
} from '../data/ticketsData';
import {
  serviceFootprint,
  julyOmnichannelVolumes,
  julyTotalInteractions,
  serviceDeskKPIParameters
} from '../data/serviceDeskData';
import {
  defaultInteractionBreakdown,
  defaultMaturityModel,
  defaultAutomationCategories,
  defaultAutomationUseCases,
  defaultAutomationMonthlyTrends,
  defaultAutomationHeroKPIs,
  defaultADHygieneModel
} from '../data/automationData';
import {
  riskSummaryKPIs,
  risksRequiringAttention,
  risksWithNoTargetDate,
  riskMitigationSchedule,
  last30DaysClosures,
  overdueRisksList
} from '../data/riskData';
import { itOpsMonthlyHistory } from '../data/itopsData';
import { EXCEL_AIOPS_ROADMAP_ACTIVITIES } from '../data/aiopsRoadmapData';
import {
  EXCEL_TAB4_HOLD_REASONS,
  PENDING_BACKLOG_DATA
} from '../data/pendingBacklogData';
import {
  defaultProjectDeliveryData
} from '../data/projectDeliveryData';
import {
  defaultCostOptimizationData
} from '../data/costOptimizationData';
import {
  defaultVulnerabilityData
} from '../data/vulnerabilityData';

// Cache key for localStorage - v4
const CACHE_KEY = 'dh_live_data_cache_v4';
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

// Fast Live Sync Auto-Refresh Interval (3 seconds in dev mode for real-time Excel sync)
const LIVE_POLL_INTERVAL_MS = 3000;

// ============================================================================
// STATIC FALLBACK BUILDER
// Converts static typed data to LiveDataModel shape
// ============================================================================
export function buildStaticFallback(): LiveDataModel {
  return {
    // IT Ops fallback from itopsData.ts (static)
    itOpsMonthly: itOpsMonthlyHistory.map(m => ({
      monthKey: m.monthKey,
      monthLabel: m.monthLabel,
      fullName: m.fullName,
      isActual: m.isActual,
      availabilityPct: m.availabilityPct,
      availabilityTarget: m.availabilityTarget,
      csat: m.csat,
      csatTarget: m.csatTarget,
      changeRecords: m.changeVolume || 0,
      changeSuccessPct: m.changeSuccessPct,
      majorIncidents: m.majorIncidents,
      kpisTotal: m.kpisTotal,
      kpisApplicable: m.kpisApplicable,
      kpisMet: m.kpisMet,
      kpisNotMet: m.kpisNotMet,
      kpisCantMeasure: m.kpisCantMeasure
    })),
    ticketClosures: ticketMonthlyClosures,
    ticketSummaryKPIs,
    teamVolumetrics: teamTicketVolumetrics,
    incidentCategories: topIncidentCategories,
    srCategories: topServiceRequestCategories,
    holdReasons: EXCEL_TAB4_HOLD_REASONS,
    pendingAgeingGroups: [
      ...PENDING_BACKLOG_DATA.incidentGroups,
      ...PENDING_BACKLOG_DATA.sctaskGroups
    ],
    serviceFootprint: serviceFootprint.map(f => ({
      label: f.label,
      value: f.value,
      subtext: f.subtext,
      iconName: f.iconName
    })),
    omnichannelVolumes: julyOmnichannelVolumes.map(v => ({
      channel: v.channel,
      volume: v.volume,
      sharePct: v.sharePct,
      color: v.color,
      icon: v.icon,
      speedOrNote: v.speedOrNote
    })),
    totalInteractions: julyTotalInteractions,
    kpiParameters: serviceDeskKPIParameters.map(p => ({
      parameter: p.parameter,
      category: p.category,
      baseline: p.baseline,
      apr: p.apr,
      may: p.may,
      jun: p.jun,
      jul: p.jul,
      unit: p.unit,
      status: p.status,
      varianceVsBaseline: p.varianceVsBaseline
    })),
    interactionBreakdown: defaultInteractionBreakdown,
    maturityModel: defaultMaturityModel,
    automationCategories: defaultAutomationCategories,
    automationUseCases: defaultAutomationUseCases,
    automationMonthlyTrends: defaultAutomationMonthlyTrends,
    automationHeroKPIs: defaultAutomationHeroKPIs,
    adHygiene: defaultADHygieneModel,
    riskSummaryKPIs,
    risksRequiringAttention,
    risksWithNoTargetDate,
    riskMitigationSchedule,
    last30DaysClosures,
    overdueRisksList,
    aiopsRoadmapActivities: EXCEL_AIOPS_ROADMAP_ACTIVITIES,
    projectDelivery: defaultProjectDeliveryData,
    costOptimization: defaultCostOptimizationData,
    vulnerabilityData: defaultVulnerabilityData,
    lastUpdated: new Date(),
    dataSource: 'static'
  };
}

// ============================================================================
// CACHE HELPERS
// ============================================================================
function saveToCache(data: LiveDataModel): void {
  try {
    const serializable = {
      ...data,
      lastUpdated: data.lastUpdated instanceof Date ? data.lastUpdated.toISOString() : new Date().toISOString()
    };
    localStorage.setItem(CACHE_KEY, JSON.stringify({
      data: serializable,
      timestamp: Date.now()
    }));
  } catch {
    // localStorage may be full – silently ignore
  }
}

function loadFromCache(): { data: LiveDataModel; age: number } | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    const age = Date.now() - parsed.timestamp;
    
    // Validate that critical fields exist and are arrays
    if (!parsed.data || 
        !Array.isArray(parsed.data.itOpsMonthly) || parsed.data.itOpsMonthly.length === 0 ||
        !Array.isArray(parsed.data.ticketClosures) || parsed.data.ticketClosures.length === 0) {
      return null;
    }

    const fallback = buildStaticFallback();
    const model: LiveDataModel = {
      ...fallback,
      ...parsed.data,
      lastUpdated: parsed.data.lastUpdated ? new Date(parsed.data.lastUpdated) : new Date()
    };
    return { data: model, age };
  } catch {
    return null;
  }
}

// ============================================================================
// HOOK INTERFACE
// ============================================================================
export interface UseLiveDataReturn {
  data: LiveDataModel;
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
  lastUpdatedDisplay: string;
  dataSource: 'sharepoint' | 'local' | 'static';
  refresh: () => void;
  uploadExcelFile: (file: File) => Promise<boolean>;
}

// ============================================================================
// useLiveData HOOK
// ============================================================================
export function useLiveData(refreshIntervalMs = LIVE_POLL_INTERVAL_MS): UseLiveDataReturn {
  const [data, setData] = useState<LiveDataModel>(() => {
    // Try to load from cache first for instant display
    const cached = loadFromCache();
    if (cached && cached.age < CACHE_TTL_MS * 2) {
      return cached.data;
    }
    return buildStaticFallback();
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const lastKnownMtimeRef = useRef<number>(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isMounted = useRef(true);

  const doFetch = useCallback(async (isInitial = false) => {
    if (!isMounted.current) return;

    if (isInitial) {
      setIsLoading(true);
    } else {
      setIsRefreshing(true);
    }
    setError(null);

    try {
      const liveData = await fetchLiveData();
      if (!isMounted.current) return;
      if (liveData && Array.isArray(liveData.itOpsMonthly) && liveData.itOpsMonthly.length > 0) {
        setData(liveData);
        saveToCache(liveData);
      }
      setError(null);
    } catch (err) {
      if (!isMounted.current) return;
      const message = err instanceof Error ? err.message : 'Failed to load data';
      setError(message);

      // Try cache as fallback
      const cached = loadFromCache();
      if (cached) {
        setData(cached.data);
      } else {
        setData(buildStaticFallback());
      }
    } finally {
      if (isMounted.current) {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    }
  }, []);

  const refresh = useCallback(() => {
    doFetch(false);
  }, [doFetch]);

  // Handle direct file upload / drag-and-drop
  const uploadExcelFile = useCallback(async (file: File): Promise<boolean> => {
    try {
      setIsRefreshing(true);
      const buffer = await file.arrayBuffer();
      // 1. Instantly parse in memory & update UI
      const parsedData = parseWorkbookFromBuffer(buffer, 'local');
      setData(parsedData);
      saveToCache(parsedData);
      
      // 2. Persist to server disk
      await uploadWorkbookToServer(buffer);
      setError(null);
      return true;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to process Excel file';
      setError(msg);
      return false;
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  // Check for server-side file modifications
  const checkAndFetchIfModified = useCallback(async () => {
    if (!isMounted.current) return;
    try {
      const status = await checkExcelStatus();
      if (status && status.lastModified > 0) {
        if (lastKnownMtimeRef.current === 0) {
          lastKnownMtimeRef.current = status.lastModified;
        } else if (status.lastModified > lastKnownMtimeRef.current) {
          // File changed on disk! Trigger instant re-fetch
          lastKnownMtimeRef.current = status.lastModified;
          doFetch(false);
        }
      }
    } catch {
      // Ignore polling errors
    }
  }, [doFetch]);

  // Initial fetch and live poll setup
  useEffect(() => {
    isMounted.current = true;
    doFetch(true);

    // Fast live poll directly from SharePoint / backend
    if (refreshIntervalMs > 0) {
      intervalRef.current = setInterval(() => {
        if (isMounted.current) {
          doFetch(false);
        }
      }, refreshIntervalMs);
    }

    // Auto-refresh when user focuses or returns to the window
    const handleFocus = () => {
      if (isMounted.current) {
        doFetch(false);
      }
    };
    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible' && isMounted.current) {
        doFetch(false);
      }
    });

    return () => {
      isMounted.current = false;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      window.removeEventListener('focus', handleFocus);
    };
  }, [doFetch, checkAndFetchIfModified, refreshIntervalMs]);

  const lastUpdatedDisplay = (!data.lastUpdated || !(data.lastUpdated instanceof Date) || isNaN(data.lastUpdated.getTime()) || data.lastUpdated.getTime() === 0)
    ? 'Just now'
    : formatLastUpdated(data.lastUpdated);

  return {
    data,
    isLoading,
    isRefreshing,
    error,
    lastUpdatedDisplay,
    dataSource: data.dataSource || 'local',
    refresh,
    uploadExcelFile
  };
}
