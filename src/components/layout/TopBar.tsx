import React from 'react';
import { Search, Loader2 } from 'lucide-react';
import { useAnalysisStore } from '../../store/useAnalysisStore';

interface TopBarProps {
  inputTicker: string;
  setInputTicker: (val: string) => void;
  onSearch: (e: React.FormEvent) => void;
}

export const TopBar: React.FC<TopBarProps> = ({ inputTicker, setInputTicker, onSearch }) => {
  const { activeTicker, activeTimeframe, setTimeframe, isLoading } = useAnalysisStore();

  return (
    <header className="h-14 border-b border-slate-800 bg-slate-950 flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-bold tracking-tight text-white">
          Ticker<span className="text-blue-500">Lab</span> <span className="text-xs font-normal text-slate-500 ml-2">Console v0.1</span>
        </h1>
        <div className="h-6 w-px bg-slate-800 mx-2" />
        {activeTicker && (
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium px-2 py-1 bg-slate-800 rounded text-blue-400">{activeTicker}</span>
            <select 
              value={activeTimeframe} 
              onChange={(e) => setTimeframe(e.target.value)}
              className="bg-slate-800 text-xs border-none rounded px-2 py-1 outline-none focus:ring-1 ring-blue-500"
            >
              <option value="1m">1m</option>
              <option value="15m">15m</option>
              <option value="1h">1h</option>
              <option value="1d">1d</option>
              <option value="1w">1w</option>
            </select>
          </div>
        )}
      </div>

      <form onSubmit={onSearch} className="flex gap-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input 
            type="text" 
            value={inputTicker} 
            onChange={(e) => setInputTicker(e.target.value)}
            placeholder="Search Ticker..." 
            className="bg-slate-800 border border-slate-700 rounded-md pl-9 pr-4 py-1.5 text-sm focus:outline-none focus:ring-2 ring-blue-500 w-64"
          />
        </div>
        <button 
          disabled={isLoading}
          className="bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 px-4 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-2"
        >
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Analyze'}
        </button>
      </form>
    </header>
  );
};
