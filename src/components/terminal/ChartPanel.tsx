import React from 'react';
import { PriceChart } from '../analysis/PriceChart';
import type { AnalysisResponse } from '../../types/analysis';

interface ChartPanelProps {
  data: AnalysisResponse;
}

export const ChartPanel: React.FC<ChartPanelProps> = ({ data }) => {
  return (
    <div className="flex flex-col h-full bg-[#0B0E14] border-r border-gray-800 p-2 overflow-hidden">
      <div className="flex justify-between items-center mb-2 px-1">
        <h3 className="text-[11px] font-bold uppercase tracking-widest text-gray-100">
          Gráfico de Precios y Pivotes
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-gray-500">{data.symbol}</span>
          <span className="text-[10px] font-mono text-gray-500">{data.timeframe}</span>
        </div>
      </div>
      <div className="flex-1 relative min-h-0 w-full">
        <PriceChart data={data} />
      </div>
    </div>
  );
};
