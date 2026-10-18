import React from 'react';
import { BarChart3, ShieldCheck } from 'lucide-react';
import type { AnalysisResponse } from '../../types/analysis';

interface MetricsPanelProps {
  data: AnalysisResponse['summary'] | null;
}

const MetricItem = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-center justify-between gap-2 border-b border-gray-900 py-1 last:border-0">
    <span className="text-[10px] font-medium uppercase text-gray-500">{label}</span>
    <span className="text-right font-mono text-xs tabular-nums text-gray-300">
      {value}
    </span>
  </div>
);

export const MetricsPanel: React.FC<MetricsPanelProps> = ({ data }) => {
  const formatNum = (value: number | null | undefined, percent = false) => {
    if (typeof value !== 'number' || Number.isNaN(value)) return 'N/A';
    if (!Number.isFinite(value)) return value > 0 ? '∞' : '-∞';
    return `${percent ? `${(value * 100).toFixed(2)}%` : value.toFixed(2)}`;
  };

  return (
    <aside className="flex h-full min-h-0 flex-col overflow-y-auto border-l border-gray-800 bg-[#0B0E14] p-2">
      <h2 className="mb-2 flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-gray-100">
        <BarChart3 className="h-3 w-3 text-[#00FF66]" /> Key Metrics
      </h2>

      {data ? (
        <>
          <div className="grid grid-cols-2 gap-2">
            <div className="col-span-2 border border-gray-800 bg-gray-900/50 p-2">
              <p className="mb-1 text-[9px] font-bold uppercase text-gray-600">Performance</p>
              <MetricItem label="Hit Rate" value={formatNum(data.hit_rate, true)} />
              <MetricItem label="Profit Factor" value={formatNum(data.profit_factor)} />
              <MetricItem label="Sharpe Ratio" value={formatNum(data.sharpe)} />
            </div>

            <div className="col-span-2 border border-gray-800 bg-gray-900/50 p-2">
              <p className="mb-1 text-[9px] font-bold uppercase text-gray-600">Returns</p>
              <MetricItem label="Mean Fwd Return" value={formatNum(data.mean_forward_return, true)} />
              <MetricItem label="Median Fwd Return" value={formatNum(data.median_forward_return, true)} />
            </div>

            <div className="col-span-2 border border-gray-800 bg-gray-900/50 p-2">
              <p className="mb-1 text-[9px] font-bold uppercase text-gray-600">Risk</p>
              <MetricItem label="Max Drawdown" value={formatNum(data.max_drawdown, true)} />
            </div>
          </div>

          <section className="mt-auto pt-3">
            <h2 className="mb-2 flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-gray-100">
              <ShieldCheck className="h-3 w-3 text-[#00FF66]" /> Robustness · Walk-forward
            </h2>
            <div className="space-y-3 border border-gray-800 bg-gray-900/50 p-2">
              <ScoreBar label="AUC Score" value={data.auc} formatNum={formatNum} />
              <ScoreBar label="Stability Score" value={data.stability_score} formatNum={formatNum} />
            </div>
          </section>
        </>
      ) : (
        <p className="mt-2 border border-gray-800 bg-gray-900/50 p-2 font-mono text-[10px] text-gray-600">
          Métricas no disponibles para esta consulta.
        </p>
      )}
    </aside>
  );
};

const ScoreBar = ({
  label,
  value,
  formatNum,
}: {
  label: string;
  value: number | null;
  formatNum: (value: number | null | undefined, percent?: boolean) => string;
}) => {
  const normalized = typeof value === 'number' && Number.isFinite(value)
    ? Math.min(1, Math.max(0, value))
    : 0;
  const color = value === null
    ? 'bg-gray-700'
    : normalized >= 0.8
      ? 'bg-[#00FF66]'
      : normalized >= 0.6
        ? 'bg-yellow-500'
        : 'bg-red-500';

  return (
    <div>
      <div className="mb-1 flex justify-between gap-2 text-[10px]">
        <span className="uppercase text-gray-500">{label}</span>
        <span className="font-mono tabular-nums text-gray-300">{formatNum(value, true)}</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-800">
        <div className={`h-full transition-all duration-500 ${color}`} style={{ width: `${normalized * 100}%` }} />
      </div>
    </div>
  );
};
