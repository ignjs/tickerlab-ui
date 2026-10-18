import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { PriceChart } from '../PriceChart';
import type { AnalysisResponse } from '../../../types/analysis';

vi.mock('lightweight-charts', () => {
  const series = {
    setData: vi.fn(),
    createPriceLine: vi.fn(),
  };
  return {
    createChart: vi.fn().mockReturnValue({
      addSeries: vi.fn().mockReturnValue(series),
      priceScale: vi.fn().mockReturnValue({ applyOptions: vi.fn() }),
      timeScale: vi.fn().mockReturnValue({
        fitContent: vi.fn(),
      }),
      applyOptions: vi.fn(),
      remove: vi.fn(),
    }),
    createSeriesMarkers: vi.fn(),
    CandlestickSeries: {},
    HistogramSeries: {},
    ColorType: { Solid: 'Solid' },
    LineStyle: { Dashed: 2 },
  };
});

describe('PriceChart', () => {
  const mockData: AnalysisResponse = {
    symbol: 'AAPL',
    timeframe: '1d',
    quote: null,
    bars: [
      { timestamp: '2023-01-01T00:00:00', open: 145, high: 155, low: 140, close: 150, volume: 1000 },
    ],
    pivots: [
      { timestamp: '2023-01-01', type: 'high', value: 150 },
      { timestamp: '2023-01-05', type: 'low', value: 140 },
    ],
    bars_count: 1,
    events_count: 0,
    summary: null,
    score_now: null,
    message: null,
  };

  it('renders correctly with valid data', () => {
    vi.stubGlobal('ResizeObserver', class {
      observe() {}
      disconnect() {}
    });
    render(<PriceChart data={mockData} />);
    const container = screen.getByTestId('price-chart-container');
    expect(container).toBeTruthy();
  });

});
