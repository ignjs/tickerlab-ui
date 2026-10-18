export interface AnalysisResponse {
  symbol: string;
  timeframe: string;
  quote: {
    symbol: string;
    price: number;
    change: number | null;
    change_pct: number | null;
    prev_close: number | null;
    open: number | null;
    day_high: number | null;
    day_low: number | null;
    volume: number | null;
    currency: string;
    timezone: string;
    timestamp: string;
  } | null;
  bars?: Array<{
    timestamp: string;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
  }>;
  pivots?: Array<{
    timestamp: string;
    type: 'high' | 'low';
    value: number;
  }>;
  bars_count: number;
  events_count: number;
  summary: {
    hit_rate: number | null;
    mean_forward_return: number | null;
    median_forward_return: number | null;
    profit_factor: number | null;
    sharpe: number | null;
    max_drawdown: number | null;
    auc: number | null;
    brier_score: number | null;
    precision_at_k: number | null;
    stability_score: number | null;
  } | null;
  score_now: number | null;
  message: string | null;
  note?: string | null;
}

export interface AnalysisRequest {
  symbol: string;
  timeframe?: string;
  period?: string;
  source?: string;
}
