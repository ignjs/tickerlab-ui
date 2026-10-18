import { create } from 'zustand';
import axios from 'axios';
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

    if (!symbol) {
      set({ error: 'No ticker symbol provided', isLoading: false });
      return;
    }

    set({ isLoading: true, error: null });
    try {
      const rangeConfig: Record<string, { timeframe: string; period: string }> = {
        '1d': { timeframe: '5m', period: '1d' },
        '1w': { timeframe: '30m', period: '5d' },
        '1m': { timeframe: '1d', period: '1mo' },
        '1y': { timeframe: '1d', period: '1y' },
        ytd: { timeframe: '1d', period: 'ytd' },
        all: { timeframe: '1d', period: 'max' },
      };
      const selectedRange = rangeConfig[activeTimeframe] ?? { timeframe: activeTimeframe, period: 'max' };
      const request: AnalysisRequest = {
        symbol,
        ...selectedRange,
      };
      const data = await analysisApi.analyzeSymbol(request);
      set({ analysisData: data, isLoading: false });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error fetching analysis';
      set({ 
        error: axios.isAxiosError<{ detail?: string }>(err)
          ? err.response?.data?.detail || message
          : message,
        isLoading: false 
      });
    }
  },
}));
