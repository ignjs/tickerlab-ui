import React from 'react';
import { Search, Loader2 } from 'lucide-react';
import { analysisApi } from '../../api/client';
import { useAnalysisStore } from '../../store/useAnalysisStore';

interface GlobalTickerBarProps {
  inputTicker: string;
  setInputTicker: (val: string) => void;
  onSearch: (e: React.FormEvent) => void;
  onTimeframeChange: (timeframe: string) => void;
}

export const GlobalTickerBar: React.FC<GlobalTickerBarProps> = ({
  inputTicker,
  setInputTicker,
  onSearch,
  onTimeframeChange,
}) => {
  const { activeTicker, activeTimeframe, isLoading } = useAnalysisStore();
  const [apiConnected, setApiConnected] = React.useState<boolean | null>(null);

  const timeframes = ['1D', '1W', '1M', '1Y', 'YTD', 'ALL'];

  React.useEffect(() => {
    let mounted = true;
    const checkApi = async () => {
      try {
        await analysisApi.healthCheck();
        if (mounted) setApiConnected(true);
      } catch {
        if (mounted) setApiConnected(false);
      }
    };

    void checkApi();
    const interval = window.setInterval(() => void checkApi(), 30_000);
    return () => {
      mounted = false;
      window.clearInterval(interval);
    };
  }, []);

  return (
    <header className="z-10 flex h-11 shrink-0 items-center justify-between gap-3 overflow-x-auto border-b border-gray-800 bg-[#0B0E14] px-3">
      <form onSubmit={onSearch} className="flex h-full min-w-max items-center gap-4">
        <div className="flex shrink-0 items-center">
          <span className="text-[10px] font-mono font-bold text-gray-400 tracking-tighter">
            TICKERLAB TERMINAL v1.0
          </span>
        </div>

        <div className="relative">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-500" />
            <input 
              list="ticker-suggestions"
              type="text" 
              value={inputTicker} 
              onChange={(e) => setInputTicker(e.target.value)}
              placeholder={activeTicker || 'SEARCH TICKER...'}
              aria-label="Search ticker"
              className="w-40 rounded-sm border border-gray-800 bg-gray-900 py-1 pl-7 pr-3 font-mono text-xs text-gray-300 outline-none focus:ring-1 focus:ring-[#00FF66] placeholder:text-gray-600"
            />
            <datalist id="ticker-suggestions">
              {['IONQ', 'TSLA', 'NVDA', 'AAPL', 'MSFT'].map((ticker) => (
                <option key={ticker} value={ticker} />
              ))}
            </datalist>
        </div>

        <div className="flex items-center gap-0.5 border border-gray-800 rounded-sm overflow-hidden">
          {timeframes.map((tf) => (
            <button
              key={tf}
              type="button"
              onClick={() => onTimeframeChange(tf.toLowerCase())}
              aria-pressed={activeTimeframe === tf.toLowerCase()}
              className={`px-2 py-1 text-[10px] font-mono transition-colors ${
                activeTimeframe === tf.toLowerCase() 
                ? 'bg-[#00FF66] text-black font-bold' 
                : 'bg-gray-900 text-gray-400 hover:bg-gray-800'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>

        <button 
          type="submit"
          disabled={isLoading}
          className="bg-gray-800 hover:bg-gray-700 disabled:opacity-50 px-3 py-1 rounded-sm text-[10px] font-bold uppercase tracking-wider text-gray-200 transition-colors flex items-center gap-2 border border-gray-700"
        >
          {isLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Execute Analysis'}
        </button>
      </form>

      <div className="flex shrink-0 items-center gap-2 rounded-sm border border-gray-800 bg-gray-900 px-2 py-1" aria-label="REST API status">
        <div className={`h-1.5 w-1.5 rounded-full ${
          apiConnected === null ? 'bg-yellow-500' : apiConnected ? 'bg-emerald-500' : 'bg-red-500'
        }`} />
        <span className="font-mono text-[9px] uppercase text-gray-500">
          {apiConnected === null ? 'API CHECK' : apiConnected ? 'API CONNECTED' : 'API OFFLINE'}
        </span>
      </div>
    </header>
  );
};
