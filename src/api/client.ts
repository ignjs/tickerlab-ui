import axios from 'axios';
import type { AnalysisRequest, AnalysisResponse } from '../types/analysis';

const api = axios.create({
  baseURL: 'http://localhost:8000', // Base URL de tickerlab-services
  headers: {
    'Content-Type': 'application/json',
  },
});

export const analysisApi = {
  async analyzeSymbol(request: AnalysisRequest): Promise<AnalysisResponse> {
    const { data } = await api.post<AnalysisResponse>('/analysis/analyze', request);
    return data;
  },
  
  async healthCheck() {
    const { data } = await api.get('/health');
    return data;
  }
};
