import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MetricsCard } from '../MetricsCard';
import type { AnalysisResponse } from '../../types/analysis';

describe('MetricsCard', () => {
  const mockData: AnalysisResponse['metrics'] = {
    sharpe: 1.5,
    sortino: 2.1,
    drawdown: 12.5,
    win_rate: 65,
    profit_factor: 1.8,
  };

  it('renders correctly with valid data', () => {
    render(<MetricsCard data={mockData} />);
    
    expect(screen.getByText(/Key Metrics/i)).toBeInTheDocument();
    expect(screen.getByText('1.50')).toBeInTheDocument();
    expect(screen.getByText('65.00')).toBeInTheDocument();
  });

  it('returns null when data is missing (prevents crash)', () => {
    // @ts-ignore
    render(<MetricsCard data={null} />);
    
    const card = screen.queryByText(/Key Metrics/i);
    expect(card).not.toBeInTheDocument();
  });

  it('handles non-numeric values gracefully', () => {
    const dataWithStrings = {
      ...mockData,
      sharpe: 'N/A',
    };
    render(<MetricsCard data={dataWithStrings} />);
    
    expect(screen.getByText('N/A')).toBeInTheDocument();
  });
});
