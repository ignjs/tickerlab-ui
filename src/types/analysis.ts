export interface AnalysisResponse {
  symbol: string;
  timeframe: string;
  quote: {
    symbol: string;
    price: number;
    change: number;
    change_pct: number;
    prev_close: number;
    open: number;
    day_high: number;
    day_low: number;
    volume: number;
    currency: string;
    timezone: string;
    timestamp: string;
  };
  bars_count: number;
  events_count: number;
  summary: {
    hit_rate: number;
    mean_forward_return: number;
    median_forward_return: number;
    profit_factor: number;
    sharpe: number;
    max_drawdown: number;
    auc: number;
    brier_score: number;
    precision_at_k: number;
    stability_score: number | null;
    [key: string]: any;
  };
  score_now: number;
  message: string | null;
  pivots?: Array<{
    timestamp: string;
    type: 'high' | 'low';
    value: number;
  }>;
  [key: string]: any;
}

export interface AnalysisRequest {
  symbol: string;
  timeframe?: string;
  period?: string;
  source?: string;
}
