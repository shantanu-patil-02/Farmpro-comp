import React from 'react';
import { 
  X, 
  TrendingUp, 
  DollarSign, 
  Calendar, 
  Droplets, 
  Layers, 
  AlertCircle, 
  CheckCircle2, 
  Sparkles,
  ShieldAlert,
  ArrowUpRight
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  Legend, 
  ReferenceLine,
  BarChart,
  Bar
} from 'recharts';
import ScoreBreakdown from './ScoreBreakdown.jsx';
import { CROPS_DATABASE } from '../data/cropDatabase.js';

export default function CropDeepDiveModal({ recommendation, cropItem, onClose }) {
  const activeItem = recommendation || cropItem;
  if (!activeItem) return null;

  // Resolve underlying crop object
  const rawCrop = activeItem.crop || activeItem;
  const dbCrop = CROPS_DATABASE.find(c => 
    c.name.toLowerCase() === (rawCrop.name || activeItem.cropName || '').toLowerCase()
  ) || {};

  const crop = {
    ...dbCrop,
    ...rawCrop,
    name: rawCrop.name || activeItem.cropName || dbCrop.name || 'Crop',
    localName: rawCrop.localName || dbCrop.localName || 'Regional Crop',
    category: rawCrop.category || dbCrop.category || 'Agricultural Crop',
    currentPrice: rawCrop.currentPrice || dbCrop.currentPrice || 4500,
    expectedPrice: rawCrop.expectedPrice || dbCrop.expectedPrice || 4900,
    msp: rawCrop.msp || dbCrop.msp || 0,
    yieldPerAcre: rawCrop.yieldPerAcre || dbCrop.yieldPerAcre || 10,
    inputCostPerAcre: rawCrop.inputCostPerAcre || dbCrop.inputCostPerAcre || (rawCrop.seedCost ? rawCrop.seedCost * 4 : 14000),
    supplyStatus: rawCrop.supplyStatus || activeItem.shortage || dbCrop.supplyStatus || 'Deficit (-15%)',
    marketDemand: rawCrop.marketDemand || dbCrop.marketDemand || 'High',
    currentStockTonnes: rawCrop.currentStockTonnes || dbCrop.currentStockTonnes || 12500,
    normalStockTonnes: rawCrop.normalStockTonnes || dbCrop.normalStockTonnes || 18000,
    marketInsights: rawCrop.marketInsights || activeItem.opportunity || dbCrop.marketInsights || 'High procurement demand with strong price resilience in central APMCs.',
    sowingWindow: rawCrop.sowingWindow || dbCrop.sowingWindow || 'June - July',
    harvestWindow: rawCrop.harvestWindow || dbCrop.harvestWindow || 'October - November',
    durationDays: rawCrop.durationDays || activeItem.cropCycle || dbCrop.durationDays || '90 - 110 days',
    waterNeeds: rawCrop.waterNeeds || activeItem.waterRequirement || dbCrop.waterNeeds || 'Moderate',
    soilTypes: rawCrop.soilTypes || dbCrop.soilTypes || ['Black Soil', 'Loamy Soil', 'Alluvial'],
    idealPh: rawCrop.idealPh || dbCrop.idealPh || { min: 6.0, max: 7.5 },
    npkRatio: rawCrop.npkRatio || dbCrop.npkRatio || { n: 40, p: 60, k: 30 },
    historicalPrices: rawCrop.historicalPrices || dbCrop.historicalPrices || [
      { month: 'Apr', price: 4200 },
      { month: 'May', price: 4350 },
      { month: 'Jun', price: 4500 },
      { month: 'Jul', price: 4650 },
      { month: 'Aug', price: 4800 },
      { month: 'Sep (Exp)', price: 4950 }
    ]
  };

  const acres = activeItem.financials?.acres || 5;
  const totalInputCost = activeItem.financials?.totalInputCost || (crop.inputCostPerAcre * acres);
  const totalGrossRevenue = activeItem.financials?.totalGrossRevenue || (crop.yieldPerAcre * acres * crop.expectedPrice);
  const totalNetProfit = activeItem.financials?.totalNetProfit || (totalGrossRevenue - totalInputCost);
  const roi = activeItem.financials?.roi || (totalInputCost > 0 ? Math.round((totalNetProfit / totalInputCost) * 100) : 85);

  const financials = {
    acres,
    totalInputCost,
    totalGrossRevenue,
    totalNetProfit,
    roi,
    totalYieldQuintals: activeItem.financials?.totalYieldQuintals || (crop.yieldPerAcre * acres)
  };

  const overallScore = activeItem.overallScore || activeItem.score || 90;
  const agronomic = activeItem.agronomic || {
    score: 92,
    isFeasible: true,
    pros: ['Excellent soil match with balanced NPK absorption.'],
    cons: []
  };
  const market = activeItem.market || {
    score: 88,
    pros: [crop.marketInsights],
    cons: []
  };
  const climate = activeItem.climate || {
    climateScore: 85,
    riskLevel: 'Low',
    riskScore: 20
  };

  // Chart data for financial breakdown
  const financialData = [
    { name: 'Seed & Inputs', amount: financials.totalInputCost, fill: '#f97316' },
    { name: 'Net Profit', amount: Math.max(0, financials.totalNetProfit), fill: '#10b981' },
    { name: 'Gross Revenue', amount: financials.totalGrossRevenue, fill: '#0f766e' }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 font-sans">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-xl border border-slate-200 overflow-hidden my-4">
        
        {/* Modal Header */}
        <div className="bg-slate-900 text-white px-4 sm:px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-extrabold text-base shadow-xs">
              {crop.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white font-heading">
                  {crop.name} Detailed Analysis
                </h2>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {crop.localName}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {crop.category} • Match Score: {overallScore}% • Model: {financials.acres} Acres
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Content Scrollable */}
        <div className="p-4 sm:p-6 max-h-[78vh] overflow-y-auto space-y-4">

          {/* Key Metrics Banner */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200">
              <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider block">
                Total Net Profit
              </span>
              <div className="text-base sm:text-lg font-bold text-slate-900 mt-0.5">
                ₹{financials.totalNetProfit.toLocaleString('en-IN')}
              </div>
              <span className="text-[10px] text-emerald-700 font-semibold">
                ROI: {financials.roi}%
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider block">
                Expected Harvest Price
              </span>
              <div className="text-base sm:text-lg font-bold text-slate-900 mt-0.5">
                ₹{crop.expectedPrice.toLocaleString('en-IN')}
                <span className="text-xs font-semibold text-slate-500">/qtl</span>
              </div>
              <span className="text-[10px] text-emerald-700 font-semibold">
                Today: ₹{crop.currentPrice.toLocaleString('en-IN')}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider block">
                Estimated Harvest Yield
              </span>
              <div className="text-base sm:text-lg font-bold text-slate-900 mt-0.5">
                {financials.totalYieldQuintals} Qtl
              </div>
              <span className="text-[10px] text-slate-500">
                ({crop.yieldPerAcre} qtl / acre)
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider block">
                Supply Balance
              </span>
              <div className="text-xs sm:text-sm font-bold text-emerald-800 mt-0.5 truncate">
                {crop.supplyStatus}
              </div>
              <span className="text-[10px] text-slate-500">
                Demand: {crop.marketDemand}
              </span>
            </div>
          </div>

          {/* 1. Price Forecast & Trajectory Chart (Recharts) */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                  <span>6-Month Mandi Price Trajectory & Harvest Forecast (₹/Quintal)</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Historical modal arrivals compared against MSP floor and projected harvest window.
                </p>
              </div>

              <div className="flex items-center gap-3 text-xs">
                <span className="inline-flex items-center gap-1 text-emerald-800 font-semibold">
                  <span className="w-3 h-0.5 bg-emerald-600 inline-block"></span>
                  <span>Mandi Realization</span>
                </span>
                {crop.msp > 0 && (
                  <span className="inline-flex items-center gap-1 text-amber-800 font-semibold">
                    <span className="w-3 h-0.5 bg-amber-500 inline-block border-t border-dashed"></span>
                    <span>Govt MSP</span>
                  </span>
                )}
              </div>
            </div>

            <div className="h-56 sm:h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={crop.historicalPrices} margin={{ top: 10, right: 20, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="month" stroke="#64748b" tick={{ fontSize: 10 }} />
                  <YAxis stroke="#64748b" tick={{ fontSize: 10 }} domain={['auto', 'auto']} />
                  <Tooltip 
                    formatter={(val) => [`₹${Number(val).toLocaleString('en-IN')}/qtl`, 'Rate']}
                    contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', borderColor: '#e2e8f0', fontSize: '11px' }}
                  />
                  {crop.msp > 0 && (
                    <ReferenceLine y={crop.msp} stroke="#d97706" strokeDasharray="4 4" label={{ value: `MSP ₹${crop.msp}`, fill: '#b45309', fontSize: 9, position: 'insideTopLeft' }} />
                  )}
                  <Line 
                    type="monotone" 
                    dataKey="price" 
                    stroke="#10b981" 
                    strokeWidth={2.5} 
                    dot={{ r: 3.5, fill: '#10b981' }} 
                    activeDot={{ r: 5 }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 2. Financial Breakdown & Revenue Distribution */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Financial Bars */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 mb-0.5 flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                <span>Financial Distribution ({financials.acres} Acres)</span>
              </h3>
              <p className="text-xs text-slate-500 mb-2">
                Total input capital expenditure vs gross realization and net return.
              </p>

              <div className="h-44 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={financialData} layout="vertical" margin={{ top: 5, right: 25, left: 15, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                    <XAxis type="number" stroke="#64748b" tick={{ fontSize: 9 }} tickFormatter={(v) => `₹${(v/1000).toFixed(0)}k`} />
                    <YAxis type="category" dataKey="name" stroke="#334155" tick={{ fontSize: 10 }} />
                    <Tooltip formatter={(val) => [`₹${Number(val).toLocaleString('en-IN')}`, 'Amount']} />
                    <Bar dataKey="amount" radius={[0, 6, 6, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Mandi Stock & Deficit Intelligence */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 mb-0.5 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>Mandi Supply Buffer & Liquidity</span>
              </h3>
              <p className="text-xs text-slate-500 mb-2">
                Regional warehouse storage metrics vs normal seasonal baseline.
              </p>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between p-2 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="text-slate-500 font-medium">Regional Mandi Stock:</span>
                  <span className="font-bold text-slate-900">{Number(crop.currentStockTonnes).toLocaleString('en-IN')} Tonnes</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="text-slate-500 font-medium">Normal Seasonal Buffer:</span>
                  <span className="font-bold text-slate-900">{Number(crop.normalStockTonnes).toLocaleString('en-IN')} Tonnes</span>
                </div>
                <div className="p-2.5 bg-emerald-50/50 rounded-lg border border-emerald-100">
                  <span className="font-bold text-emerald-950 block mb-0.5">Market Opportunity Thesis:</span>
                  <p className="text-emerald-900 text-[11px] leading-relaxed">
                    {crop.marketInsights}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 3. Official Formula & Score Breakdown */}
          <ScoreBreakdown
            agronomic={agronomic}
            market={market}
            climate={climate}
            overallScore={overallScore}
            factors={activeItem.factors}
            rawScore={activeItem.rawScore}
          />

          {/* 4. Agronomic Cultivation Advisory */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 mb-2.5 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-600" />
              <span>Agronomic Schedule & Cultivation Guide</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">Sowing Window</span>
                <span className="text-xs font-bold text-slate-900 mt-0.5 block">{crop.sowingWindow}</span>
                <span className="text-[10px] text-slate-400">Duration: {crop.durationDays}</span>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">Harvest Window</span>
                <span className="text-xs font-bold text-slate-900 mt-0.5 block">{crop.harvestWindow}</span>
                <span className="text-[10px] text-slate-400">Expected Yield: {crop.yieldPerAcre} qtl/ac</span>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">Ideal Soil & pH</span>
                <span className="text-xs font-bold text-slate-900 mt-0.5 block">pH {crop.idealPh?.min || 6.0} - {crop.idealPh?.max || 7.5}</span>
                <span className="text-[10px] text-slate-400">Soils: {Array.isArray(crop.soilTypes) ? crop.soilTypes.join(', ') : 'Black Soil'}</span>
              </div>
            </div>

            <div className="mt-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-xs font-bold text-slate-800 block mb-0.5">
                Water & Nutrient Recommendation:
              </span>
              <p className="text-xs text-slate-600 leading-relaxed">
                Water need is <strong className="text-slate-900">{crop.waterNeeds}</strong>. Recommended basal NPK fertilizer dosage: 
                <strong className="text-slate-900"> N:{crop.npkRatio?.n || 40} kg, P:{crop.npkRatio?.p || 50} kg, K:{crop.npkRatio?.k || 30} kg/ha</strong>. 
                Apply 50% nitrogen at sowing, remaining in split doses during active tillering/flowering.
              </p>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 px-4 sm:px-6 py-3 border-t border-slate-200 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 transition shadow-xs cursor-pointer"
          >
            Close Deep Dive
          </button>
        </div>

      </div>
    </div>
  );
}
