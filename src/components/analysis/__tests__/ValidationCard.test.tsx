import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ValidationCard } from '../ValidationCard';
import type { AnalysisResponse } from '../../types/analysis';

describe('ValidationCard', () => {
  const mockValidation: AnalysisResponse['validation'] = {
    walkforward_score: 78,
    folds: [
      { id: 1, score: 0.65, metric: 'AUC' },
      { id: 2, score: 0.72, metric: 'AUC' },
    ],
  };

  it('renders correctly with valid data', () => {
    render(<ValidationCard data={mockValidation} />);
    
    expect(screen.getByText(/Robustness/i)).toBeInTheDocument();
    expect(screen.getByText('78%')).toBeInTheDocument();
    expect(screen.getByText('Fold 1')).toBeInTheDocument();
  });

  it('returns null when data is missing (prevents crash)', () => {
    // @ts-ignore
    render(<ValidationCard data={null} />);
    
    const card = screen.queryByText(/Robustness/i);
    expect(card).not.toBeInTheDocument();
  });
});
