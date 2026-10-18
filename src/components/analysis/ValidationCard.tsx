import React from 'react';
import { ShieldCheck } from 'lucide-react';
import type { AnalysisResponse } from '../../types/analysis';

interface ValidationCardProps {
  data: AnalysisResponse['summary'];
}

export const ValidationCard: React.FC<ValidationCardProps> = ({ data }) => {
  if (!data) return null;

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex-1">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
        <ShieldCheck className="w-3 h-3" /> Robustness (Walk-forward)
      </h3>
      <div className="mb-4">
        <div className="flex justify-between text-xs mb-1">
          <span>Robustness Score (AUC)</span>
          <span className="text-blue-400 font-bold">
            {typeof data.auc === 'number' ? `${(data.auc * 100).toFixed(2)}%` : 'N/A'}
          </span>
        </div>
        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
          <div 
            className="bg-blue-500 h-full transition-all duration-1000" 
            style={{ width: `${typeof data.auc === 'number' ? data.auc * 100 : 0}%` }}
          />
        </div>
      </div>
      <div className="text-center p-2 bg-slate-900 rounded border border-slate-800 text-[11px]">
        <span className="text-slate-400">Stability Score: </span>
        <span className="font-mono text-blue-400">
          {data.stability_score !== null ? (data.stability_score * 100).toFixed(2) + '%' : 'N/A'}
        </span>
      </div>
    </div>
  );
};
