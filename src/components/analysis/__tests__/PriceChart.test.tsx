import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { PriceChart } from '../PriceChart';
import type { AnalysisResponse } from '../../types/analysis';

// Mocking lightweight-charts as it relies on DOM APIs not fully present in jsdom
vi.mock('lightweight-charts', () => {
  return {
    createChart: vi.fn().mockReturnValue({
      addAreaSeries: vi.fn().mockReturnValue({
        setData: vi.fn(),
        setMarkers: vi.fn(),
      }),
      timeScale: vi.fn().mockReturnValue({
        fitContent: vi.fn(),
      }),
      applyOptions: vi.fn(),
      remove: vi.fn(),
    }),
    ColorType: {
      Solid: 'Solid',
    },
  };
});

describe('PriceChart', () => {
  const mockData: AnalysisResponse = {
    symbol: 'AAPL',
    timeframe: '1d',
    metrics: {},
    pivots: [
      { timestamp: '2023-01-01', type: 'high', value: 150 },
      { timestamp: '2023-01-05', type: 'low', value: 140 },
    ],
    validation: { walkforward_score: 80, folds: [] },
  };

  it('renders correctly with valid data', () => {
    render(<PriceChart data={mockData} />);
    
    // Since it's a chart, we check if the container is rendered
    const container = screen.getByTestId('price-chart-container'); // We will need to add this test id
    expect(container).toBeInTheDocument();
  });

  it('returns null when data is missing', () => {
    // @ts-ignore
    render(<PriceChart data={null} />);
    
    const container = screen.queryByTestId('price-chart-container');
    expect(container).not.toBeInTheDocument();
  });
});
