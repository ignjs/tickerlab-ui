import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ValidationCard } from '../ValidationCard';
import type { AnalysisResponse } from '../../../types/analysis';

describe('ValidationCard', () => {
  const mockValidation: NonNullable<AnalysisResponse['summary']> = {
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
    render(<ValidationCard data={mockValidation} />);
    
    expect(screen.getByText(/Robustness \(Walk-forward\)/i)).toBeTruthy();
    expect(screen.getByText('78.00%')).toBeTruthy();
  });

  it('returns null when data is missing (prevents crash)', () => {
    // @ts-ignore
    render(<ValidationCard data={null} />);
    
    const card = screen.queryByText(/Robustness/i);
    expect(card).toBeNull();
  });
});
