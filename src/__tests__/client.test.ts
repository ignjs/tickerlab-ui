import { describe, it, expect, vi, beforeEach } from 'vitest';
import { analysisApi } from '../api/client';

// Mocking axios to avoid actual network calls
vi.mock('axios', () => {
  return {
    default: {
      create: vi.fn().mockReturnValue({
        post: vi.fn(),
        get: vi.fn(),
      }),
    },
  };
});

import axios from 'axios';
const mockedAxios = axios.create();

describe('analysisApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('analyzeSymbol should call post with correct parameters', async () => {
    const request = { symbol: 'AAPL', timeframe: '1d', period: 'max', source: 'yahoo' };
    const mockResponse = { data: { symbol: 'AAPL', metrics: {} } };
    
    // Setup the mock for the post method
    (mockedAxios.post as any).mockResolvedValue(mockResponse);

    const result = await analysisApi.analyzeSymbol(request);

    expect(mockedAxios.post).toHaveBeenCalledWith('/analysis/analyze', request);
    expect(result).toEqual(mockResponse.data);
  });

  it('healthCheck should call get /health', async () => {
    const mockResponse = { data: { status: 'healthy' } };
    (mockedAxios.get as any).mockResolvedValue(mockResponse);

    const result = await analysisApi.healthCheck();

    expect(mockedAxios.get).toHaveBeenCalledWith('/health');
    expect(result).toEqual(mockResponse.data);
  });

  it('should handle API errors gracefully', async () => {
    (mockedAxios.post as any).mockRejectedValue(new Error('Network Error'));

    await expect(analysisApi.analyzeSymbol({ symbol: 'FAIL' })).rejects.toThrow('Network Error');
  });
});
