import React, { useState } from 'react';
import { useAnalysisStore } from './store/useAnalysisStore';
import { Activity, Loader2 } from 'lucide-react';
import { TopBar } from './components/layout/TopBar';
import { MetricsCard } from './components/analysis/MetricsCard';
import { ValidationCard } from './components/analysis/ValidationCard';
import { PriceChart } from './components/analysis/PriceChart';

function App() {
  const activeTicker = useAnalysisStore((state) => state.activeTicker);
  const setTicker = useAnalysisStore((state) => state.setTicker);
  const activeTimeframe = useAnalysisStore((state) => state.activeTimeframe);
  const setTimeframe = useAnalysisStore((state) => state.setTimeframe);
  const analysisData = useAnalysisStore((state) => state.analysisData);
  const isLoading = useAnalysisStore((state) => state.isLoading);
  const error = useAnalysisStore((state) => state.error);
  const fetchAnalysis = useAnalysisStore((state) => state.fetchAnalysis);

  console.log('[App Render] State:', { isLoading, hasData: !!analysisData, error });

  const [inputTicker, setInputTicker] = useState('');

  React.useEffect(() => {
    console.log('[App Effect] analysisData changed:', !!analysisData, 'isLoading:', isLoading);
  }, [analysisData, isLoading]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputTicker) return;
    const symbol = inputTicker.toUpperCase();
    setTicker(symbol);
    await fetchAnalysis(symbol);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans">
      <TopBar 
        inputTicker={inputTicker} 
        setInputTicker={setInputTicker} 
        onSearch={handleSearch} 
      />

      <main className="p-6 grid grid-cols-12 gap-6 h-[calc(100vh-3.5rem)]">
        
        {error && (
          <div className="col-span-12 p-4 bg-red-900/20 border border-red-900/50 text-red-400 rounded-lg text-sm">
            <strong>Error:</strong> {error}
          </div>
        )}

        {!analysisData && !isLoading && !error && (
          <div className="col-span-12 flex flex-col items-center justify-center text-slate-500">
            <Activity className="w-12 h-12 mb-4 opacity-20" />
            <p>Enter a ticker symbol to start quantitative analysis</p>
          </div>
        )}

        {isLoading && (
          <div className="col-span-12 flex flex-col items-center justify-center text-blue-500">
            <Loader2 className="w-12 h-12 mb-4 animate-spin" />
            <p className="animate-pulse">Executing Quant Pipeline...</p>
          </div>
        )}

        {analysisData && (
          <>
            <div className="col-span-8 bg-slate-950 border border-slate-800 rounded-xl overflow-hidden flex flex-col">
              <div className="p-3 border-b border-slate-800 bg-slate-900/50 flex justify-between items-center">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                  <Activity className="w-3 h-3" /> Price & Pivots
                </span>
              </div>
              <div className="flex-1 relative">
                <PriceChart data={analysisData} />
              </div>
            </div>

            <div className="col-span-4 flex flex-col gap-6">
              <MetricsCard data={analysisData.summary} />
              <ValidationCard data={analysisData.summary} />
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default App;
