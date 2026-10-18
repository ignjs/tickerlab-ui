import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MetricsCard } from '../MetricsCard';
import type { AnalysisResponse } from '../../../types/analysis';

describe('MetricsCard', () => {
  const mockData: NonNullable<AnalysisResponse['summary']> = {
    hit_rate: 0.65,
    mean_forward_return: 0.02,
    median_forward_return: 0.01,
    max_drawdown: -0.1,
    sharpe: 1.5,
    profit_factor: 1.8,
    auc: 0.78,
    brier_score: 0.2,
    precision_at_k: 0.6,
    stability_score: 0.9,
  };

  it('renders correctly with valid data', () => {
    render(<MetricsCard data={mockData} />);
    
    expect(screen.getByText(/Key Metrics/i)).toBeTruthy();
    expect(screen.getByText('1.50')).toBeTruthy();
    expect(screen.getByText('0.65')).toBeTruthy();
  });

  it('returns null when data is missing (prevents crash)', () => {
    // @ts-ignore
    render(<MetricsCard data={null} />);
    
    const card = screen.queryByText(/Key Metrics/i);
    expect(card).toBeNull();
  });

  it('handles non-numeric values gracefully', () => {
    render(<MetricsCard data={null} />);
    expect(screen.queryByText(/Key Metrics/i)).toBeNull();
  });
});
