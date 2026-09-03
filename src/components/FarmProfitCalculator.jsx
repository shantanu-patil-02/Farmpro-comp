import React, { useState } from 'react';
import { 
  BarChart3, 
  DollarSign, 
  Maximize2, 
  TrendingUp, 
  Percent, 
  ArrowRight,
  Sparkles,
  Layers,
  Coins
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  Legend 
} from 'recharts';
import { useFarm } from '../context/FarmContext.jsx';
import { CROPS_DATABASE } from '../data/cropDatabase.js';

export default function FarmProfitCalculator({ recommendations, topPick, farmState, setFarmState }) {
  const { recommendationResults, farmForm } = useFarm();
  const [localLandArea, setLocalLandArea] = useState(farmState?.landArea || farmForm?.landArea || 5);
  const [priceShiftPercent, setPriceShiftPercent] = useState(0); // -20% to +25%

  const effectiveLandArea = farmState?.landArea || localLandArea || 5;

  const handleLandAreaChange = (newVal) => {
    setLocalLandArea(newVal);
    if (typeof setFarmState === 'function') {
      setFarmState(prev => ({ ...prev, landArea: newVal }));
    }
  };

  // Determine list of crops to evaluate (prioritize passed props, then context, then database)
  let rawCropsList = [];
  if (Array.isArray(recommendations) && recommendations.length > 0) {
    rawCropsList = recommendations;
  } else if (recommendationResults?.topRecommendations?.length > 0) {
    rawCropsList = recommendationResults.topRecommendations;
  } else if (topPick) {
    rawCropsList = [topPick, ...CROPS_DATABASE.slice(0, 3).map(c => ({ crop: c }))];
  } else {
    rawCropsList = CROPS_DATABASE.slice(0, 4).map(c => ({ crop: c }));
  }

  // Evaluate top 4 crops with simulated price shift
  const evaluatedCrops = rawCropsList.slice(0, 4).map((rec, idx) => {
    const crop = rec.crop || rec;
    const cropName = crop.name || crop.cropName || `Crop #${idx + 1}`;
    const basePrice = crop.expectedPrice || crop.currentPrice || (idx === 0 ? 4900 : 3500);
    const adjustedPrice = Math.round(basePrice * (1 + priceShiftPercent / 100));
    const yieldPerAcre = crop.yieldPerAcre || 10;
    const inputCostPerAcre = crop.inputCostPerAcre || (crop.seedCost ? crop.seedCost * 4 : 14000);
    
    const totalYield = Number((yieldPerAcre * effectiveLandArea).toFixed(1));
    const totalCost = Math.round(inputCostPerAcre * effectiveLandArea);
    const grossRev = Math.round(totalYield * adjustedPrice);
    const netProfit = Math.round(grossRev - totalCost);
    const roi = totalCost > 0 ? Math.round((netProfit / totalCost) * 100) : 100;

    return {
      name: cropName.split(' ')[0],
      fullName: cropName,
      crop,
      totalYield,
      totalCost,
      grossRev,
      netProfit,
      roi,
      adjustedPrice,
      costPerAcre: inputCostPerAcre,
      profitPerAcre: Math.round(netProfit / effectiveLandArea)
    };
  });

  // Chart data for comparative visualization
  const chartData = evaluatedCrops.map(item => ({
    name: item.name,
    'Net Profit (₹)': Math.max(0, item.netProfit),
    'Input Cost (₹)': item.totalCost
  }));

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6 space-y-5 font-sans" id="profit-calculator-component">
      {/* Top Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-900 text-[10px] font-bold uppercase tracking-wider mb-1.5 border border-emerald-200">
          <Coins className="w-3.5 h-3.5 text-emerald-700" />
          <span>Profit & Cashflow Simulator</span>
        </div>
        <h3 className="text-base sm:text-lg font-bold text-slate-900 font-heading">
          Land & Market Price Sensitivity Simulator
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Simulate mandi volatility and land acreage allocation to assess net cashflow safety.
        </p>
      </div>

      {/* Sliders Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
        {/* Land Area Slider */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Maximize2 className="w-3.5 h-3.5 text-emerald-700" />
              <span>Acreage Allocated:</span>
            </label>
            <span className="text-xs font-bold text-emerald-900 bg-emerald-100 px-2 py-0.5 rounded-md">
              {effectiveLandArea} Acres
            </span>
          </div>
          <input
            type="range"
            min="1"
            max="25"
            step="0.5"
            value={effectiveLandArea}
            onChange={(e) => handleLandAreaChange(parseFloat(e.target.value))}
            className="w-full accent-emerald-700 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
          />
          <div className="flex justify-between text-[10px] text-slate-400 mt-1">
            <span>1 Acre</span>
            <span>10 Acres</span>
            <span>25 Acres</span>
          </div>
        </div>

        {/* Mandi Price Swing Simulation */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Percent className="w-3.5 h-3.5 text-emerald-700" />
              <span>Mandi Price Fluctuation:</span>
            </label>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${
              priceShiftPercent > 0 
                ? 'text-emerald-900 bg-emerald-100' 
                : priceShiftPercent < 0 
                ? 'text-rose-900 bg-rose-100' 
                : 'text-slate-700 bg-slate-200'
            }`}>
              {priceShiftPercent > 0 ? `+${priceShiftPercent}% Surge` : priceShiftPercent < 0 ? `${priceShiftPercent}% Drop` : 'Baseline Modal'}
            </span>
          </div>
          <input
            type="range"
            min="-20"
            max="25"
            step="5"
            value={priceShiftPercent}
            onChange={(e) => setPriceShiftPercent(parseInt(e.target.value, 10))}
            className="w-full accent-emerald-700 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
          />
          <div className="flex justify-between text-[10px] text-slate-400 mt-1">
            <span>-20% Glut</span>
            <span>0% (Baseline)</span>
            <span>+25% Spike</span>
          </div>
        </div>
      </div>

      {/* Comparative Profit Chart */}
      <div>
        <h4 className="text-xs font-bold text-slate-800 mb-2">
          Projected Net Profit vs Working Capital ({effectiveLandArea} Acres)
        </h4>
        <div className="h-52 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 11 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 10 }} tickFormatter={(v) => `₹${(v/1000).toFixed(0)}k`} />
              <Tooltip formatter={(val) => [`₹${Number(val).toLocaleString('en-IN')}`, '']} />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '4px' }} />
              <Bar dataKey="Input Cost (₹)" fill="#f97316" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Net Profit (₹)" fill="#059669" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Summary Profit Cards */}
      <div className="grid grid-cols-2 gap-3 pt-2">
        {evaluatedCrops.slice(0, 2).map((item, idx) => (
          <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 truncate">#{idx + 1} {item.fullName}</span>
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                {item.roi}% ROI
              </span>
            </div>
            <div className="flex justify-between text-slate-500 text-[11px] pt-1">
              <span>Net Profit:</span>
              <span className="font-extrabold text-emerald-700">₹{item.netProfit.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-slate-400 text-[10px]">
              <span>Rate: ₹{item.adjustedPrice}/qtl</span>
              <span>Yield: {item.totalYield} Qtl</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
