import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useAnalysisStore } from '../store/useAnalysisStore';
import { analysisApi } from '../api/client';

// Mock the API client
vi.mock('../api/client', () => ({
  analysisApi: {
    analyzeSymbol: vi.fn(),
  },
}));

describe('useAnalysisStore', () => {
  beforeEach(() => {
    // Reset store state by creating a new store if necessary 
    // or just resetting the known state manually since Zustand stores are singletons
    useAnalysisStore.setState({
      activeTicker: null,
      activeTimeframe: '1d',
      analysisData: null,
      isLoading: false,
      error: null,
    });
  });

  it('should set the active ticker', () => {
    useAnalysisStore.getState().setTicker('AAPL');
    expect(useAnalysisStore.getState().activeTicker).toBe('AAPL');
  });

  it('should set the active timeframe', () => {
    useAnalysisStore.getState().setTimeframe('1h');
    expect(useAnalysisStore.getState().activeTimeframe).toBe('1h');
  });

  it('should handle successful analysis fetch', async () => {
    const mockData = {
      symbol: 'AAPL',
      metrics: { sharpe: 1.5 },
      validation: { walkforward_score: 80, folds: [] },
      pivots: [],
    };
    
    useAnalysisStore.getState().setTicker('AAPL');
    (analysisApi.analyzeSymbol as any).mockResolvedValue(mockData);
    
    await useAnalysisStore.getState().fetchAnalysis();
    
    expect(useAnalysisStore.getState().analysisData).toEqual(mockData);
    expect(useAnalysisStore.getState().isLoading).toBe(false);
    expect(useAnalysisStore.getState().error).toBeNull();
  });

  it('should handle failed analysis fetch', async () => {
    useAnalysisStore.getState().setTicker('AAPL');
    (analysisApi.analyzeSymbol as any).mockRejectedValue(new Error('API Error'));
    
    await useAnalysisStore.getState().fetchAnalysis();
    
    expect(useAnalysisStore.getState().analysisData).toBeNull();
    expect(useAnalysisStore.getState().error).toBe('API Error');
    expect(useAnalysisStore.getState().isLoading).toBe(false);
  });

  it('should clear analysis data', () => {
    useAnalysisStore.setState({ analysisData: { symbol: 'X' } as any });
    useAnalysisStore.getState().clearAnalysis();
    expect(useAnalysisStore.getState().analysisData).toBeNull();
  });
});
