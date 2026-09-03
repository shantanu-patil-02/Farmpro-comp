import React, { useState } from 'react';
import { 
  MapPin, 
  Layers, 
  Maximize2, 
  Calendar, 
  Droplets, 
  FlaskConical, 
  CloudSun, 
  ChevronDown, 
  ChevronUp, 
  Sparkles,
  Info,
  CheckCircle2
} from 'lucide-react';
import { SOIL_TYPES, SEASONS, WATER_SOURCES, REGIONAL_PRESETS } from '../data/regionalPresets.js';

export default function FarmConditionsForm({ 
  farmState, 
  setFarmState, 
  selectedPresetId, 
  onSelectPreset,
  onAnalyze 
}) {
  const [showAdvancedSoil, setShowAdvancedSoil] = useState(false);

  const handleInputChange = (field, value) => {
    setFarmState(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNpChange = (nutrient, value) => {
    setFarmState(prev => ({
      ...prev,
      npk: {
        ...prev.npk,
        [nutrient]: Number(value) || 0
      }
    }));
  };

  // Safe percentage calculation for NPK relative to typical maximums
  const nPercent = Math.min(100, Math.max(10, Math.round(((farmState.npk?.n || 40) / 100) * 100)));
  const pPercent = Math.min(100, Math.max(10, Math.round(((farmState.npk?.p || 45) / 80) * 100)));
  const kPercent = Math.min(100, Math.max(10, Math.round(((farmState.npk?.k || 35) / 80) * 100)));

  const currentSoil = SOIL_TYPES.find(s => s.id === farmState.soilType) || SOIL_TYPES[0];
  const currentWater = WATER_SOURCES.find(w => w.id === farmState.waterAvailability) || WATER_SOURCES[0];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-5">
      {/* High Density Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Farm Conditions & Regional Agronomics
            </h3>
          </div>
          <p className="text-xs text-slate-600 mt-0.5">
            Configure soil composition, water security, and land scale to run high-density market opportunity matching.
          </p>
        </div>

        {/* 1-Click Regional Presets */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">Presets:</span>
          {REGIONAL_PRESETS.map((p) => (
            <button
              key={p.id}
              onClick={() => onSelectPreset(p.id)}
              className={`text-xs px-2.5 py-1 rounded-lg font-bold transition-all ${
                selectedPresetId === p.id
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              {p.state}
            </button>
          ))}
        </div>
      </div>

      {/* Main Parameters Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mt-4">
        {/* Location & District */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-emerald-600" />
            <span>Location & District</span>
          </label>
          <input
            type="text"
            value={`${farmState.state} (${farmState.district})`}
            onChange={(e) => handleInputChange('district', e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 focus:bg-white transition"
            placeholder="State & District"
          />
          <span className="text-[10px] text-slate-400 block truncate">
            {farmState.zoneName || 'Agro-Climatic Zone'}
          </span>
        </div>

        {/* Soil Type */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
            <Layers className="w-3.5 h-3.5 text-emerald-600" />
            <span>Soil Type</span>
          </label>
          <select
            value={farmState.soilType}
            onChange={(e) => handleInputChange('soilType', e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 focus:bg-white transition cursor-pointer"
          >
            {SOIL_TYPES.map((soil) => (
              <option key={soil.id} value={soil.id}>
                {soil.name}
              </option>
            ))}
          </select>
          <span className="text-[10px] text-slate-400 block truncate">
            {currentSoil.desc || ''}
          </span>
        </div>

        {/* Crop Cycle / Season */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-emerald-600" />
            <span>Crop Cycle / Season</span>
          </label>
          <select
            value={farmState.cropCycle}
            onChange={(e) => handleInputChange('cropCycle', e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 focus:bg-white transition cursor-pointer"
          >
            {SEASONS.map((season) => (
              <option key={season.id} value={season.id}>
                {season.name}
              </option>
            ))}
          </select>
          <span className="text-[10px] text-slate-400 block truncate">
            {SEASONS.find(s => s.id === farmState.cropCycle)?.period || ''}
          </span>
        </div>

        {/* Water Availability */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
            <Droplets className="w-3.5 h-3.5 text-blue-600" />
            <span>Water Availability</span>
          </label>
          <select
            value={farmState.waterAvailability}
            onChange={(e) => handleInputChange('waterAvailability', e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 focus:bg-white transition cursor-pointer"
          >
            {WATER_SOURCES.map((water) => (
              <option key={water.id} value={water.id}>
                {water.name}
              </option>
            ))}
          </select>
          <span className="text-[10px] text-slate-400 block truncate">
            Security: {currentWater.level}
          </span>
        </div>
      </div>

      {/* Row 2: Cultivable Land Scale + High Density Weather & Water Status Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 mt-4 pt-3.5 border-t border-slate-100">
        
        {/* Land Area Stepper (5 cols) */}
        <div className="lg:col-span-5 bg-slate-50 p-3.5 rounded-lg border border-slate-200 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
              <Maximize2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Cultivable Land Area</span>
            </label>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
              {farmState.landArea} Acres ({(farmState.landArea * 0.4047).toFixed(1)} ha)
            </span>
          </div>
          
          <div className="flex items-center gap-3 mt-1">
            <input
              type="range"
              min="1"
              max="25"
              step="0.5"
              value={farmState.landArea}
              onChange={(e) => handleInputChange('landArea', parseFloat(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
            />
            <div className="flex gap-1 shrink-0">
              {[2, 4, 8, 12].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => handleInputChange('landArea', num)}
                  className={`text-[10px] px-2 py-0.5 rounded font-bold transition ${
                    farmState.landArea === num
                      ? 'bg-emerald-700 text-white'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {num}ac
                </button>
              ))}
            </div>
          </div>
          
          <p className="text-[10px] text-slate-500 mt-2">
            Working capital, expected yield, and total net profit calculate proportionally across this land acreage.
          </p>
        </div>

        {/* Local Weather Card (4 cols) matching High Density design */}
        <div className="lg:col-span-4 bg-white p-3 rounded-lg border border-slate-200 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Local Weather</span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
              (farmState.weather?.riskScore || 20) <= 25
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-amber-50 text-amber-700 border-amber-200'
            }`}>
              Climate Risk: {farmState.weather?.climateRisk || 'Low'}
            </span>
          </div>

          <div className="flex items-center gap-3 mb-2">
            <div className="text-2xl font-light text-slate-900">
              {farmState.weather?.temperature || 32}°C
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-slate-800">
                {farmState.weather?.forecastSummary || 'Sunny Intermittent'}
              </span>
              <span className="text-[10px] text-slate-500">
                Humidity: {farmState.weather?.humidity || 42}% • Rain: {farmState.weather?.rainfallMm || 680}mm
              </span>
            </div>
          </div>

          {/* 4-day forecast mini blocks */}
          <div className="grid grid-cols-4 gap-1 text-center">
            <div className="bg-slate-50 p-1.5 rounded border border-slate-100">
              <span className="block text-[9px] text-slate-500">Mon</span>
              <span className="block text-[11px] font-bold text-slate-800">34°</span>
            </div>
            <div className="bg-slate-50 p-1.5 rounded border border-slate-100">
              <span className="block text-[9px] text-slate-500">Tue</span>
              <span className="block text-[11px] font-bold text-slate-800">31°</span>
            </div>
            <div className="bg-slate-50 p-1.5 rounded border border-blue-200 bg-blue-50/40">
              <span className="block text-[9px] text-blue-600 font-semibold">Wed</span>
              <span className="block text-[11px] font-bold text-blue-700">Rain</span>
            </div>
            <div className="bg-slate-50 p-1.5 rounded border border-slate-100">
              <span className="block text-[9px] text-slate-500">Thu</span>
              <span className="block text-[11px] font-bold text-slate-800">33°</span>
            </div>
          </div>
        </div>

        {/* Water Security / Irrigation Summary (3 cols) */}
        <div className="lg:col-span-3 p-3 bg-blue-50 rounded-lg border border-blue-100 flex flex-col justify-between">
          <div>
            <p className="text-[10px] text-blue-700 font-bold uppercase tracking-wider mb-1">Water Access</p>
            <p className="text-xs text-blue-900 leading-relaxed font-medium">
              {currentWater.name} ({currentWater.level} security). Stress level minimal for planned cycle.
            </p>
          </div>
          <div className="mt-2 pt-2 border-t border-blue-100/80 flex items-center justify-between text-[10px] text-blue-800">
            <span>Water Table: <strong>45-60 ft</strong></span>
            <span className="font-bold text-blue-700">Optimal</span>
          </div>
        </div>
      </div>

      {/* High Density NPK Composition & Soil Health Section */}
      <div className="mt-4 pt-3 border-t border-slate-100">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              NPK COMPOSITION & SOIL HEALTH CARD
            </p>
            <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs font-bold">
              pH {farmState.ph ?? 6.8} (Optimal)
            </span>
          </div>
          <button
            type="button"
            onClick={() => setShowAdvancedSoil(!showAdvancedSoil)}
            className="text-[11px] font-semibold text-emerald-700 hover:text-emerald-900 flex items-center gap-1 transition"
          >
            <span>{showAdvancedSoil ? 'Collapse Inputs' : 'Edit NPK Values'}</span>
            {showAdvancedSoil ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Visual High Density NPK Progress Gauges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 p-3 rounded-lg border border-slate-100">
          <div>
            <div className="flex justify-between text-[10px] mb-1">
              <span className="text-slate-600 font-medium">Nitrogen (N)</span>
              <span className="font-bold text-slate-900">{farmState.npk?.n ?? 40} kg/ha</span>
            </div>
            <div className="relative h-2 bg-slate-200 rounded-full overflow-hidden">
              <div 
                className="absolute h-full bg-emerald-500 rounded-full transition-all duration-300"
                style={{ width: `${nPercent}%` }}
              ></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-[10px] mb-1">
              <span className="text-slate-600 font-medium">Phosphorus (P)</span>
              <span className="font-bold text-slate-900">{farmState.npk?.p ?? 45} kg/ha</span>
            </div>
            <div className="relative h-2 bg-slate-200 rounded-full overflow-hidden">
              <div 
                className="absolute h-full bg-blue-500 rounded-full transition-all duration-300"
                style={{ width: `${pPercent}%` }}
              ></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-[10px] mb-1">
              <span className="text-slate-600 font-medium">Potassium (K)</span>
              <span className="font-bold text-slate-900">{farmState.npk?.k ?? 35} kg/ha</span>
            </div>
            <div className="relative h-2 bg-slate-200 rounded-full overflow-hidden">
              <div 
                className="absolute h-full bg-orange-500 rounded-full transition-all duration-300"
                style={{ width: `${kPercent}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Collapsible Editable Input Form */}
        {showAdvancedSoil && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3 p-3 bg-white rounded-lg border border-slate-200">
            <div>
              <label className="text-[10px] font-bold text-slate-500 block mb-1">
                Nitrogen (N) kg/ha
              </label>
              <input
                type="number"
                value={farmState.npk?.n ?? 40}
                onChange={(e) => handleNpChange('n', e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-md px-2.5 py-1 text-xs text-slate-900 font-bold"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-500 block mb-1">
                Phosphorus (P) kg/ha
              </label>
              <input
                type="number"
                value={farmState.npk?.p ?? 45}
                onChange={(e) => handleNpChange('p', e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-md px-2.5 py-1 text-xs text-slate-900 font-bold"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-500 block mb-1">
                Potassium (K) kg/ha
              </label>
              <input
                type="number"
                value={farmState.npk?.k ?? 35}
                onChange={(e) => handleNpChange('k', e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-md px-2.5 py-1 text-xs text-slate-900 font-bold"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-500 block mb-1">
                Soil pH Level (4 - 10)
              </label>
              <input
                type="number"
                step="0.1"
                min="4"
                max="10"
                value={farmState.ph ?? 6.8}
                onChange={(e) => handleInputChange('ph', parseFloat(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-md px-2.5 py-1 text-xs text-slate-900 font-bold"
              />
            </div>
          </div>
        )}
      </div>

      {/* Action Bar */}
      <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-100">
        <div className="flex items-center text-xs text-slate-500 gap-1.5">
          <Info className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Real-time evaluation automatically syncs with mandi shortage and profit metrics.</span>
        </div>

        <button
          type="button"
          onClick={onAnalyze}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-5 py-2.5 rounded-lg shadow-sm transition"
        >
          <Sparkles className="w-4 h-4" />
          <span>Run FarmPro AI Evaluation</span>
        </button>
      </div>
    </div>
  );
}
