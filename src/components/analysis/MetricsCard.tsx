import React from 'react';
import { BarChart3 } from 'lucide-react';
import type { AnalysisResponse } from '../../types/analysis';

interface MetricsCardProps {
  data: AnalysisResponse['summary'];
}

export const MetricsCard: React.FC<MetricsCardProps> = ({ data }) => {
  if (!data) return null;

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
        <BarChart3 className="w-3 h-3" /> Key Metrics
      </h3>
      <div className="grid grid-cols-2 gap-3">
        {Object.entries(data).map(([key, val]) => (
          <div key={key} className="p-3 bg-slate-900 rounded-lg border border-slate-800">
            <p className="text-[10px] text-slate-500 uppercase font-bold">{key.replace('_', ' ')}</p>
            <p className="text-lg font-mono text-blue-400">
              {typeof val === 'number' ? val.toFixed(2) : String(val)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
