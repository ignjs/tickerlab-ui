import React from 'react';
import { useAnalysisStore } from '../store/useAnalysisStore';
import { Activity, Loader2, TrendingUp } from 'lucide-react';
import { GlobalTickerBar } from './terminal/GlobalTickerBar';
import { ChartPanel } from './terminal/ChartPanel';
import { MetricsPanel } from './terminal/MetricsPanel';
import { WatchlistPanel } from './terminal/WatchlistPanel';

export const ConsoleDashboard: React.FC = () => {
  const setTicker = useAnalysisStore((state) => state.setTicker);
  const setTimeframe = useAnalysisStore((state) => state.setTimeframe);
  const activeTicker = useAnalysisStore((state) => state.activeTicker);
  const analysisData = useAnalysisStore((state) => state.analysisData);
  const isLoading = useAnalysisStore((state) => state.isLoading);
  const error = useAnalysisStore((state) => state.error);
  const fetchAnalysis = useAnalysisStore((state) => state.fetchAnalysis);

  const [inputTicker, setInputTicker] = React.useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const symbol = inputTicker.trim().toUpperCase() || activeTicker;
    if (!symbol) return;
    setInputTicker(symbol);
    setTicker(symbol);
    await fetchAnalysis(symbol);
  };

  const handleTimeframeChange = (timeframe: string) => {
    setTimeframe(timeframe);
    if (activeTicker) void fetchAnalysis(activeTicker);
  };

  return (
    <div className="flex h-dvh w-full flex-col overflow-hidden bg-[#0B0E14] font-sans text-gray-300 selection:bg-green-500/30">
      <GlobalTickerBar 
        inputTicker={inputTicker} 
        setInputTicker={setInputTicker} 
        onSearch={handleSearch} 
        onTimeframeChange={handleTimeframeChange}
      />

      <main className="relative grid min-h-0 flex-1 grid-cols-[190px_minmax(0,1fr)_280px] overflow-hidden max-[900px]:grid-cols-1 max-[900px]:overflow-y-auto">
        {error && (
          <div role="alert" className="absolute left-1/2 top-3 z-50 -translate-x-1/2 border border-red-500 bg-red-950/95 p-3 text-xs font-bold text-white shadow-2xl backdrop-blur-sm">
            ERROR: {error}
          </div>
        )}

        <div className="min-h-0 max-[900px]:h-48">
          <WatchlistPanel />
        </div>

        <section className="relative min-h-0 min-w-0 overflow-hidden max-[900px]:h-[min(58vh,520px)]">
          {analysisData ? (
              <ChartPanel data={analysisData} />
          ) : (
            <div className="flex h-full min-h-[260px] flex-col items-center justify-center gap-3 bg-[#0B0E14] text-gray-600">
              {isLoading ? <Loader2 className="h-8 w-8 animate-spin text-[#00FF66]" /> : <Activity className="h-10 w-10 opacity-20" />}
              <p className="font-mono text-[10px] uppercase tracking-widest">
                {isLoading ? 'Processing quant pipeline' : 'Awaiting ticker input'}
              </p>
              {!isLoading && <TrendingUp className="h-4 w-4 opacity-20" />}
            </div>
          )}
          {isLoading && analysisData && (
            <div className="absolute right-3 top-3 flex items-center gap-2 border border-gray-700 bg-[#0B0E14]/90 px-2 py-1 text-[9px] font-mono uppercase text-[#00FF66]">
              <Loader2 className="h-3 w-3 animate-spin" /> Updating
            </div>
          )}
        </section>

        <div className="min-h-0 overflow-hidden max-[900px]:min-h-[320px]">
          <MetricsPanel data={analysisData?.summary ?? null} />
        </div>
      </main>
    </div>
  );
};
