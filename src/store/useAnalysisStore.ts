import { create } from 'zustand';
import { analysisApi } from '../api/client';
import type { AnalysisResponse, AnalysisRequest } from '../types/analysis';

interface AnalysisState {
  activeTicker: string | null;
  activeTimeframe: string;
  analysisData: AnalysisResponse | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setTicker: (symbol: string) => void;
  setTimeframe: (timeframe: string) => void;
  fetchAnalysis: (symbolOverride?: string) => Promise<void>;
  clearAnalysis: () => void;
}

export const useAnalysisStore = create<AnalysisState>((set, get) => ({
  activeTicker: null,
  activeTimeframe: '1d',
  analysisData: null,
  isLoading: false,
  error: null,

  setTicker: (symbol) => set({ activeTicker: symbol }),
  
  setTimeframe: (timeframe) => set({ activeTimeframe: timeframe }),

  clearAnalysis: () => set({ analysisData: null, error: null }),

  fetchAnalysis: async (symbolOverride?: string) => {
    const { activeTicker, activeTimeframe } = get();
    const symbol = symbolOverride || activeTicker;

    console.log('[Store] Starting fetchAnalysis for symbol:', symbol);

    if (!symbol) {
      console.warn('[Store] No symbol provided, aborting fetch');
      set({ error: 'No ticker symbol provided', isLoading: false });
      return;
    }

    set({ isLoading: true, error: null });
    try {
      const request: AnalysisRequest = {
        symbol,
        timeframe: activeTimeframe,
      };
      console.log('[Store] Calling API with request:', request);
      const data = await analysisApi.analyzeSymbol(request);
      
      console.log('[Store] API response received successfully:', data);
      set({ analysisData: data, isLoading: false });
      console.log('[Store] State updated with analysisData');
    } catch (err: any) {
      console.error('[Store] API Error caught:', err);
      set({ 
        error: err.response?.data?.detail || err.message || 'Error fetching analysis', 
        isLoading: false 
      });
    }
  },
}));
