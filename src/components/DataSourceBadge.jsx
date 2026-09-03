import React from 'react';
import { Database, Activity, Info, CloudSun, Building2 } from 'lucide-react';

/**
 * Component to clearly distinguish "Demo Data" vs "Live Data"
 * Displays: "Live Market Data" | "Demo Market Data"
 * and "Live Weather Data" | "Demo Weather Data"
 * Prevents pretending simulated or demo data is live.
 */
export default function DataSourceBadge({ 
  dataSource = 'Demo Data', 
  type = 'market', // 'market' | 'weather' | 'general'
  size = 'sm', 
  showExplanation = false 
}) {
  const isDemo = String(dataSource).toLowerCase().includes('demo');
  const isWeather = type === 'weather' || String(dataSource).toLowerCase().includes('weather');

  // Compute exact label
  let displayLabel = dataSource;
  if (isWeather) {
    displayLabel = isDemo ? 'Demo Weather Data' : 'Live Weather Data';
  } else if (type === 'market' || String(dataSource).toLowerCase().includes('market')) {
    displayLabel = isDemo ? 'Demo Market Data' : 'Live Market Data';
  }

  const badgeStyle = isDemo
    ? 'bg-amber-100 text-amber-900 border-amber-300 hover:bg-amber-200/80'
    : 'bg-emerald-100 text-emerald-900 border-emerald-300 hover:bg-emerald-200/80';

  const dotStyle = isDemo ? 'bg-amber-500' : 'bg-emerald-500 animate-pulse';

  const iconSize = size === 'xs' ? 'w-3 h-3' : 'w-3.5 h-3.5';
  const textSize = size === 'xs' ? 'text-[10px]' : 'text-xs';

  return (
    <div className="inline-flex flex-col items-start gap-1" id="data-source-badge">
      <span
        title={
          isDemo
            ? `Calibrated benchmark dataset active (DEMO_MODE=true)`
            : isWeather
            ? `Streaming live agro-climatic readings & forecasts`
            : `Streaming verified live APMC terminal auction bids`
        }
        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-bold border transition-colors ${textSize} ${badgeStyle}`}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${dotStyle}`} />
        {isDemo ? (
          <Database className={iconSize} />
        ) : isWeather ? (
          <CloudSun className={iconSize} />
        ) : (
          <Activity className={iconSize} />
        )}
        <span>{displayLabel}</span>
      </span>

      {showExplanation && (
        <span className="text-[11px] text-slate-500 flex items-center gap-1">
          <Info className="w-3 h-3 text-slate-400 shrink-0" />
          {isDemo
            ? 'Operating in Demo Mode without external API dependencies. Calculations use realistic calibrated benchmarks.'
            : isWeather
            ? 'Live meteorological observation data via free agro-weather API.'
            : 'Streaming verified live APMC terminal auction bids and spot market arrivals.'}
        </span>
      )}
    </div>
  );
}
