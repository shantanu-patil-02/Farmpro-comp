import React, { useState, useEffect } from 'react';
import { 
  CloudRain, 
  Thermometer, 
  Droplets, 
  Wind, 
  Sun, 
  AlertTriangle, 
  ShieldCheck, 
  Calendar,
  RefreshCw 
} from 'lucide-react';
import { useFarm } from '../context/FarmContext.jsx';
import { weatherAPI } from '../services/apiClient.js';
import DataSourceBadge from './DataSourceBadge.jsx';

export default function WeatherCard({ 
  location: propLocation,
  temperature: propTemp, 
  rainfall: propRain, 
  humidity: propHumidity, 
  windSpeed: propWind,
  condition: propCondition,
  advisory: propAdvisory,
  climateRisk: propClimateRisk,
}) {
  const { farmForm } = useFarm();
  const currentLocation = propLocation || farmForm?.location || 'Nagpur, Maharashtra';

  const [weatherData, setWeatherData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function loadWeather() {
      setIsLoading(true);
      try {
        const res = await weatherAPI.getWeather(currentLocation);
        if (isMounted && res && res.weather) {
          setWeatherData(res);
        }
      } catch (err) {
        console.warn('Weather fetch notice:', err.message);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadWeather();
    return () => { isMounted = false; };
  }, [currentLocation]);

  const weather = weatherData?.weather || {};
  const forecast = weatherData?.forecast || [];
  const dataSource = weatherData?.dataSource || 'Demo Weather Data';

  const temperature = propTemp ?? weather.temperature ?? 28;
  const rainfall = propRain ?? weather.rainfall ?? 750;
  const humidity = propHumidity ?? weather.humidity ?? 65;
  const windSpeed = propWind ?? weather.windSpeed ?? 12;
  const condition = propCondition ?? weather.condition ?? 'Partly Cloudy';
  const climateRisk = propClimateRisk ?? weather.climateRisk ?? 'Low';
  const advisory = propAdvisory ?? weather.advisory ?? 'Optimal conditions for Kharif sowing. Normal agronomic practices recommended.';

  // Color mapping for climate risk: Low, Medium, High
  const riskBadgeStyle = 
    climateRisk === 'High'
      ? 'bg-rose-100 text-rose-800 border-rose-300'
      : climateRisk === 'Medium'
      ? 'bg-amber-100 text-amber-900 border-amber-300'
      : 'bg-emerald-100 text-emerald-800 border-emerald-300';

  return (
    <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200 shadow-sm space-y-4" id="weather-card">
      {/* Card Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
            {condition.toLowerCase().includes('rain') ? (
              <CloudRain className="w-5 h-5 text-emerald-600" />
            ) : condition.toLowerCase().includes('cloud') || condition.toLowerCase().includes('overcast') ? (
              <CloudRain className="w-5 h-5 text-emerald-600" />
            ) : (
              <Sun className="w-5 h-5 text-amber-500" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                Agro-Meteorological Forecast
              </h4>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${riskBadgeStyle}`}>
                {climateRisk} Risk
              </span>
            </div>
            <span className="text-[11px] text-slate-500">
              {currentLocation} • {condition}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center">
          <DataSourceBadge dataSource={dataSource} type="weather" size="xs" />
        </div>
      </div>

      {/* Grid of Key Weather Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
          <div className="flex items-center gap-1.5 text-slate-500 text-[10px] uppercase font-bold tracking-wider">
            <Thermometer className="w-3.5 h-3.5 text-amber-600" />
            <span>Temperature</span>
          </div>
          <p className="text-base font-bold text-slate-900 mt-1">{temperature}°C</p>
          <span className="text-[10px] text-slate-400">
            Min {weather.tempMin ?? temperature - 4}° / Max {weather.tempMax ?? temperature + 4}°
          </span>
        </div>

        <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
          <div className="flex items-center gap-1.5 text-slate-500 text-[10px] uppercase font-bold tracking-wider">
            <CloudRain className="w-3.5 h-3.5 text-emerald-600" />
            <span>Seasonal Rain</span>
          </div>
          <p className="text-base font-bold text-slate-900 mt-1">{rainfall} mm</p>
          <span className="text-[10px] text-slate-400">
            {weather.precipitationMm ? `${weather.precipitationMm} mm 24h` : 'Monsoon Index'}
          </span>
        </div>

        <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
          <div className="flex items-center gap-1.5 text-slate-500 text-[10px] uppercase font-bold tracking-wider">
            <Droplets className="w-3.5 h-3.5 text-cyan-600" />
            <span>Humidity</span>
          </div>
          <p className="text-base font-bold text-slate-900 mt-1">{humidity}%</p>
          <span className="text-[10px] text-slate-400">Optimal Canopy</span>
        </div>

        <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
          <div className="flex items-center gap-1.5 text-slate-500 text-[10px] uppercase font-bold tracking-wider">
            <Wind className="w-3.5 h-3.5 text-indigo-500" />
            <span>Wind Speed</span>
          </div>
          <p className="text-base font-bold text-slate-900 mt-1">{windSpeed} km/h</p>
          <span className="text-[10px] text-slate-400">
            {windSpeed > 25 ? 'High Spray Drift' : 'Low Spray Drift'}
          </span>
        </div>
      </div>

      {/* 4-Day Mini Forecast Strip */}
      {forecast && forecast.length > 0 && (
        <div className="bg-slate-50/70 p-2.5 rounded-lg border border-slate-100">
          <div className="flex items-center gap-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
            <Calendar className="w-3 h-3 text-slate-400" />
            <span>5-Day Weather Outlook</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {forecast.slice(0, 4).map((f, idx) => (
              <div key={idx} className="bg-white p-2 rounded border border-slate-200/80 text-center">
                <span className="text-[11px] font-bold text-slate-800 block">{f.day}</span>
                <span className="text-xs font-extrabold text-slate-900 mt-0.5 block">{f.temp}°C</span>
                <span className="text-[10px] text-slate-500 truncate block mt-0.5">{f.condition}</span>
                <span className="text-[9px] font-semibold text-emerald-700 block mt-0.5">Rain: {f.rainChance}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Advisory Note & Climate Risk Details */}
      {advisory && (
        <div className={`p-3 rounded-lg border text-xs flex items-start gap-2.5 ${
          climateRisk === 'High'
            ? 'bg-rose-50/80 border-rose-200 text-rose-950'
            : climateRisk === 'Medium'
            ? 'bg-amber-50/80 border-amber-200 text-amber-950'
            : 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
        }`}>
          {climateRisk === 'High' ? (
            <AlertTriangle className="w-4 h-4 text-rose-700 shrink-0 mt-0.5" />
          ) : climateRisk === 'Medium' ? (
            <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          ) : (
            <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
          )}
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="font-bold text-[11px] block">
                Agromet Advisory & Risk Evaluation:
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider">
                [{climateRisk} Climate Risk]
              </span>
            </div>
            <p className="text-[11px] leading-relaxed opacity-90">
              {advisory}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
