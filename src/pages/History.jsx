import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Clock, 
  MapPin, 
  Layers, 
  Sparkles, 
  ArrowRight, 
  RotateCcw, 
  Calendar, 
  ChevronDown, 
  ChevronUp, 
  CheckCircle2, 
  TrendingUp, 
  CloudSun, 
  Coins, 
  SlidersHorizontal,
  ExternalLink,
  Search,
  User,
  ShieldAlert
} from 'lucide-react';
import { useFarm } from '../context/FarmContext.jsx';
import { useTranslation } from '../i18n/index.jsx';

export default function History() {
  const { history, user, setFarmForm, triggerRecommendation, loadHistoryItem } = useFarm();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [expandedId, setExpandedId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const toggleExpand = (id) => {
    setExpandedId(prev => prev === id ? null : id);
  };

  const handleViewResults = (item) => {
    loadHistoryItem(item);
    navigate('/results');
  };

  const handleRerun = (item) => {
    const raw = item.rawRecord?.inputParameters || item.rawRecord?.farmConditions || {};
    const updatedForm = {
      location: item.location || raw.location || 'Nagpur, Maharashtra',
      soilType: item.soilType || raw.soilType || 'Black Soil',
      landArea: item.landArea || raw.landArea || 5,
      landUnit: item.landUnit || raw.landUnit || 'Acres',
      cropCycle: item.cropCycle || raw.cropCycle || '6 Months',
      waterAvailability: raw.waterAvailability || 'Medium',
      nitrogen: raw.nitrogen ?? 50,
      phosphorus: raw.phosphorus ?? 25,
      potassium: raw.potassium ?? 30,
      ph: raw.ph ?? 6.8,
      farmingObjective: item.farmingObjective || raw.farmingObjective || 'Maximum Profit',
      previousCrop: raw.previousCrop || 'Wheat',
      weather: raw.weather || {
        temperature: 29,
        rainfall: 820,
        condition: 'Partly Cloudy',
        humidity: 65
      }
    };

    setFarmForm(updatedForm);
    triggerRecommendation(updatedForm);
    navigate('/results');
  };

  const filteredHistory = history.filter(item => {
    const matchLocation = item.location?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCrop = item.topCrop?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchSoil = item.soilType?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchLocation || matchCrop || matchSoil;
  });

  return (
    <div className="space-y-8 py-6 max-w-5xl mx-auto font-sans" id="history-page">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 uppercase tracking-wider">
            <Clock className="w-4 h-4 text-emerald-700" />
            <span>Audit Trail & Records</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading mt-1">
            {t('history.title', 'Recommendation History')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            {t('history.subtitle', 'Inspect previous farm condition evaluations, market shortage snapshots, and multi-crop rankings.')}
          </p>
        </div>

        <Link
          to="/recommendation"
          className="px-4 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold shadow-sm transition self-start sm:self-center flex items-center gap-1.5 cursor-pointer"
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span>New Recommendation Run</span>
        </Link>
      </div>

      {/* Filter / Search Bar */}
      <div className="flex items-center justify-between gap-4 bg-white p-3 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2 flex-1 px-2">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Filter previous audits by crop, district, or soil type..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs text-slate-800 bg-transparent focus:outline-none placeholder-slate-400"
          />
        </div>
        <span className="text-[11px] font-semibold text-slate-500 whitespace-nowrap px-2">
          {filteredHistory.length} Recorded Audits
        </span>
      </div>

      {/* History List */}
      {filteredHistory.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-500 mx-auto flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900 font-heading">
            No Previous Audits Found
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Run your first crop recommendation to start building your seasonal audit trail and price forecast history.
          </p>
          <Link
            to="/recommendation"
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-800 text-white rounded-xl text-xs font-bold"
          >
            Start Recommendation
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredHistory.map((item) => {
            const isExpanded = expandedId === item.id;
            const top5List = item.top5 || item.rawRecord?.recommendedCrops || item.rawRecord?.top5 || [];
            const rawInputs = item.rawRecord?.inputParameters || item.rawRecord?.farmConditions || {};
            const weatherInfo = item.weather || item.rawRecord?.weatherInformation || {};
            const marketInfo = item.marketSummary || item.rawRecord?.marketInformation || {};

            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:border-emerald-300 transition overflow-hidden"
                id={`history-item-${item.id}`}
              >
                {/* Main Card Header */}
                <div className="p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-5">
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-emerald-600" />
                        <span>{item.date}</span>
                      </span>
                      <span className="text-xs text-slate-300">•</span>
                      <span className="text-xs font-medium text-slate-700 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>{item.location}</span>
                      </span>
                      {user && (
                        <>
                          <span className="text-xs text-slate-300">•</span>
                          <span className="text-[11px] text-slate-500 flex items-center gap-1">
                            <User className="w-3 h-3 text-slate-400" />
                            <span>{user.name || 'Farmer'}</span>
                          </span>
                        </>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600 pt-1">
                      <span>Soil: <strong className="text-slate-900">{item.soilType}</strong></span>
                      <span>Area: <strong className="text-slate-900">{item.landArea} {item.landUnit}</strong></span>
                      <span>Cycle: <strong className="text-slate-900">{item.cropCycle}</strong></span>
                      <span>Objective: <strong className="text-slate-900">{item.farmingObjective}</strong></span>
                    </div>
                  </div>

                  {/* Top Crop & Actions */}
                  <div className="flex items-center justify-between md:justify-end gap-4 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                    <div className="text-left md:text-right">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">
                        Top Recommendation
                      </span>
                      <p className="text-base font-bold text-slate-900 flex items-center gap-1.5 md:justify-end">
                        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                        <span>{item.topCrop}</span>
                      </p>
                      <span className="text-[11px] font-bold text-emerald-800">
                        {item.topScore}/100 Match Score
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleViewResults(item)}
                        className="px-3 py-2 rounded-xl text-xs font-bold bg-emerald-800 hover:bg-emerald-900 text-white transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
                        title="Open full interactive charts & analytics"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">View Results</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => toggleExpand(item.id)}
                        className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 border border-slate-200 transition cursor-pointer"
                        title={isExpanded ? 'Collapse Details' : 'Expand Full Audit Data'}
                      >
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Expanded Detailed Audit Drawer */}
                {isExpanded && (
                  <div className="p-5 sm:p-6 bg-slate-50 border-t border-slate-200 space-y-5 animate-fadeIn">
                    
                    {/* 1. Farm Information & Input Parameters Used */}
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5 text-emerald-700" />
                        <span>Farm Information & Input Parameters Used</span>
                      </h4>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white p-3.5 rounded-xl border border-slate-200 text-xs">
                        <div>
                          <span className="text-slate-400 block text-[10px]">District / Location</span>
                          <span className="font-bold text-slate-800">{item.location}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px]">Soil Type & Texture</span>
                          <span className="font-bold text-slate-800">{item.soilType}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px]">Land Area</span>
                          <span className="font-bold text-slate-800">{item.landArea} {item.landUnit}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px]">Target Crop Cycle</span>
                          <span className="font-bold text-slate-800">{item.cropCycle}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px]">Farming Goal</span>
                          <span className="font-bold text-slate-800">{item.farmingObjective}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px]">Soil pH</span>
                          <span className="font-bold text-slate-800">{rawInputs.ph || '6.8'} (Optimal)</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px]">NPK Levels</span>
                          <span className="font-bold text-slate-800">{rawInputs.nitrogen || 50}N • {rawInputs.phosphorus || 25}P • {rawInputs.potassium || 30}K</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px]">Previous Rotation</span>
                          <span className="font-bold text-slate-800">{rawInputs.previousCrop || 'Wheat / Fallow'}</span>
                        </div>
                      </div>
                    </div>

                    {/* 2. Recommended Crops & Match Scores */}
                    {top5List.length > 0 && (
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                          <span>Top Ranked Crop Recommendations & Scores</span>
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          {top5List.slice(0, 3).map((cropItem, idx) => {
                            const name = cropItem.crop?.name || cropItem.cropName || 'Crop';
                            const score = cropItem.overallScore || cropItem.score || 90;
                            const price = cropItem.expectedPrice || cropItem.currentPrice || 4500;
                            return (
                              <div key={idx} className="bg-white p-3 rounded-xl border border-slate-200 space-y-1.5 text-xs">
                                <div className="flex items-center justify-between">
                                  <span className="font-bold text-slate-900">#{idx + 1} {name}</span>
                                  <span className="text-[10px] font-extrabold bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-md border border-emerald-200">
                                    {score}% Match
                                  </span>
                                </div>
                                <div className="flex justify-between text-slate-500 text-[11px] pt-1 border-t border-slate-100">
                                  <span>Mandi Price:</span>
                                  <span className="font-bold text-slate-800">₹{price}/qtl</span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* 3. Weather & Market Snapshots */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-1">
                        <div className="flex items-center gap-1.5 font-bold text-slate-800">
                          <CloudSun className="w-4 h-4 text-blue-600" />
                          <span>Weather & Climate Snapshot</span>
                        </div>
                        <p className="text-slate-600 text-[11px]">
                          {weatherInfo.condition || 'Partly Cloudy'} • Temp: {weatherInfo.temperature || '28'}°C • Rainfall: {weatherInfo.rainfall || '820'}mm
                        </p>
                      </div>

                      <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-1">
                        <div className="flex items-center gap-1.5 font-bold text-slate-800">
                          <TrendingUp className="w-4 h-4 text-emerald-700" />
                          <span>Market Deficit & Demand Snapshot</span>
                        </div>
                        <p className="text-slate-600 text-[11px]">
                          Top shortage: {item.topCrop} • Price outlook: Bullish (+8% to +14% at harvest)
                        </p>
                      </div>
                    </div>

                    {/* Action Bar */}
                    <div className="flex items-center justify-end gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => handleRerun(item)}
                        className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-200 bg-slate-100 transition flex items-center gap-1.5 cursor-pointer"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Re-tune & Run Again</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleViewResults(item)}
                        className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-800 hover:bg-emerald-900 text-white transition flex items-center gap-1.5 shadow-sm cursor-pointer"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Inspect in Full Dashboard</span>
                      </button>
                    </div>

                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}

