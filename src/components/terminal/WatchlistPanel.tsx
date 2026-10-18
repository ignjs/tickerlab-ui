import React from 'react';
import { useAnalysisStore } from '../../store/useAnalysisStore';

export const WatchlistPanel: React.FC = () => {
  const { activeTicker, analysisData, setTicker, fetchAnalysis, isLoading } = useAnalysisStore();
  const watchlist = ['IONQ', 'TSLA', 'NVDA', 'AAPL', 'MSFT'];

  const handleTickerClick = async (ticker: string) => {
    if (ticker === activeTicker || isLoading) return;
    setTicker(ticker);
    await fetchAnalysis(ticker);
  };

  return (
    <section className="flex h-full min-h-0 flex-col overflow-hidden border-r border-gray-800 bg-[#0B0E14]">
      <div className="border-b border-gray-800 bg-gray-900/30 p-2">
        <h2 className="px-1 text-[10px] font-bold uppercase tracking-widest text-gray-400">
          Watchlist
        </h2>
      </div>
      
      <div className="grid grid-cols-[minmax(0,1fr)_72px_62px] gap-2 border-b border-gray-800 bg-gray-900/50 px-2 py-1 text-[9px] font-bold uppercase tracking-tighter text-gray-600">
        <span>Ticker</span>
        <span className="text-right">Price</span>
        <span className="text-right">Change</span>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {watchlist.map((ticker) => {
          const quote = analysisData?.symbol === ticker ? analysisData.quote : null;
          const changePct = quote?.change_pct;
          const positive = typeof changePct === 'number' && changePct >= 0;
          return (
            <button
              key={ticker}
              type="button"
              onClick={() => void handleTickerClick(ticker)}
              aria-current={activeTicker === ticker ? 'true' : undefined}
              className={`grid w-full grid-cols-[minmax(0,1fr)_72px_62px] gap-2 border-b border-gray-900 px-2 py-2 text-left font-mono text-[11px] transition-colors ${
                activeTicker === ticker
                  ? 'bg-gray-800/80 text-[#00FF66]'
                  : 'text-gray-500 hover:bg-gray-900 hover:text-gray-300'
              }`}
            >
              <span className="truncate font-bold">{ticker}</span>
              <span className="text-right tabular-nums">
                {quote ? quote.price.toFixed(2) : '--'}
              </span>
              <span className={`text-right tabular-nums ${
                typeof changePct !== 'number' ? 'text-gray-700' : positive ? 'text-[#00FF66]' : 'text-red-500'
              }`}>
                {typeof changePct === 'number' ? `${changePct > 0 ? '+' : ''}${changePct.toFixed(2)}%` : '--'}
              </span>
            </button>
          );
        })}
        <p className="px-2 py-3 text-[9px] leading-4 text-gray-700">
          Precios disponibles para el activo consultado. Sin feed WebSocket conectado.
        </p>
      </div>
    </section>
  );
};
