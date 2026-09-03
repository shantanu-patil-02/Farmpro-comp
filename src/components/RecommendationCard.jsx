import React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  CheckCircle2, 
  ShieldCheck,
  ChevronRight,
  Sparkles,
  Sprout
} from 'lucide-react';

export default function RecommendationCard({ recommendation, rank, onSelectCrop }) {
  const { crop, overallScore, agronomic, market, financials } = recommendation;

  const isGlutRisk = crop.deficitPercentage > 15;
  const isDeficitShortage = crop.deficitPercentage < -10;

  return (
    <div className={`bg-white rounded-xl shadow-sm border p-4 sm:p-5 transition-all duration-200 hover:shadow-md ${
      rank === 1 ? 'border-emerald-400/80 ring-1 ring-emerald-400/20' : 'border-slate-200'
    }`}>
      {/* Top Banner: Rank + Title + Score */}
      <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-3">
          {/* Rank Badge */}
          <div className={`w-7 h-7 rounded-lg font-bold flex items-center justify-center text-xs shrink-0 shadow-xs ${
            rank === 1 
              ? 'bg-emerald-700 text-white' 
              : rank === 2 
              ? 'bg-emerald-600 text-white' 
              : 'bg-slate-100 text-slate-700'
          }`}>
            #{rank}
          </div>

          <div>
            <div className="flex flex-wrap items-baseline gap-1.5">
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                {crop.name}
              </h3>
              <span className="text-xs text-slate-500 font-medium">
                ({crop.localName})
              </span>
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                {crop.category}
              </span>
              <span className="text-[11px] text-slate-400">
                • {crop.durationDays}
              </span>
            </div>
          </div>
        </div>

        {/* Opportunity Score */}
        <div className="text-right shrink-0">
          <div className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">
            Opportunity
          </div>
          <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg font-extrabold text-xs sm:text-sm bg-emerald-100 text-emerald-800 border border-emerald-200">
            <Sparkles className="w-3 h-3 text-emerald-600" />
            <span>{overallScore}%</span>
          </div>
        </div>
      </div>

      {/* Dual Pillar Progress Breakdown: Agronomic vs Market */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3.5 p-3 bg-slate-50 rounded-lg border border-slate-100">
        {/* Agronomic Score Bar */}
        <div>
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="font-bold text-slate-700 flex items-center gap-1">
              <Sprout className="w-3.5 h-3.5 text-emerald-600" />
              <span>Can Grow (Agronomic)</span>
            </span>
            <span className="font-bold text-slate-900">{agronomic.score}%</span>
          </div>
          <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-emerald-500 h-full rounded-full transition-all duration-500" 
              style={{ width: `${agronomic.score}%` }}
            />
          </div>
          <span className="text-[10px] text-slate-500 block mt-1 truncate">
            {agronomic.pros[0] || 'Suitable for local soil and cycle.'}
          </span>
        </div>

        {/* Market Score Bar */}
        <div>
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="font-bold text-slate-700 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
              <span>Market Opportunity</span>
            </span>
            <span className="font-bold text-slate-900">{market.score}%</span>
          </div>
          <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${
                market.score >= 75 ? 'bg-emerald-500' : market.score >= 50 ? 'bg-amber-500' : 'bg-rose-500'
              }`} 
              style={{ width: `${market.score}%` }}
            />
          </div>
          <span className="text-[10px] text-slate-500 block mt-1 truncate">
            {isDeficitShortage 
              ? `${Math.abs(crop.deficitPercentage)}% regional shortage at harvest` 
              : isGlutRisk 
              ? `Caution: ${crop.deficitPercentage}% glut risk` 
              : 'Balanced demand and pricing'}
          </span>
        </div>
      </div>

      {/* Financials & Market Intelligence Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3.5">
        {/* Net Profit */}
        <div className="p-2.5 rounded-lg bg-emerald-50/50 border border-emerald-100">
          <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider block">
            Net Profit ({financials.acres} ac)
          </span>
          <div className="text-sm sm:text-base font-bold text-slate-900 mt-0.5">
            ₹{financials.totalNetProfit.toLocaleString('en-IN')}
          </div>
          <span className="text-[10px] text-emerald-700 font-semibold block">
            ≈ ₹{Math.round(financials.netProfitPerAcre).toLocaleString('en-IN')}/ac
          </span>
        </div>

        {/* Expected Mandi Price */}
        <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
          <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider block">
            Harvest Price
          </span>
          <div className="text-sm sm:text-base font-bold text-slate-900 mt-0.5 flex items-center gap-0.5">
            <span>₹{crop.expectedPrice.toLocaleString('en-IN')}</span>
            <span className="text-[10px] font-semibold text-slate-500">/qtl</span>
          </div>
          <span className={`text-[10px] font-bold flex items-center ${
            crop.expectedPrice >= crop.currentPrice ? 'text-emerald-700' : 'text-rose-700'
          }`}>
            {crop.expectedPrice >= crop.currentPrice ? <TrendingUp className="w-3 h-3 mr-0.5 inline" /> : <TrendingDown className="w-3 h-3 mr-0.5 inline" />}
            {Math.round(((crop.expectedPrice - crop.currentPrice) / crop.currentPrice) * 100)}% vs today
          </span>
        </div>

        {/* Return on Investment (ROI) */}
        <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
          <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider block">
            ROI Yield
          </span>
          <div className="text-sm sm:text-base font-bold text-slate-900 mt-0.5">
            {financials.roi}%
          </div>
          <span className="text-[10px] text-slate-500 block truncate">
            Cost: ₹{(financials.totalInputCost / 1000).toFixed(1)}k
          </span>
        </div>

        {/* Market Supply Status */}
        <div className={`p-2.5 rounded-lg border ${
          isDeficitShortage 
            ? 'bg-emerald-50/70 border-emerald-200' 
            : isGlutRisk 
            ? 'bg-rose-50/70 border-rose-200' 
            : 'bg-slate-50 border-slate-100'
        }`}>
          <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider block">
            Supply Balance
          </span>
          <div className={`text-xs font-bold mt-0.5 truncate ${
            isDeficitShortage ? 'text-emerald-900' : isGlutRisk ? 'text-rose-900' : 'text-slate-900'
          }`}>
            {crop.supplyStatus}
          </div>
          <span className="text-[10px] text-slate-500 block">
            Demand: <strong className="text-slate-700">{crop.marketDemand}</strong>
          </span>
        </div>
      </div>

      {/* Explainable Insights: Why Recommend? */}
      <div className="mt-3.5 pt-2.5 border-t border-slate-100">
        <div className="text-[11px] font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>Why Recommend this Crop?</span>
        </div>
        <ul className="space-y-1 text-xs text-slate-600">
          {agronomic.pros.slice(0, 1).map((pro, idx) => (
            <li key={`agro-${idx}`} className="flex items-start gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
              <span><strong className="text-slate-800">Agronomics:</strong> {pro}</span>
            </li>
          ))}
          {market.pros.slice(0, 1).map((pro, idx) => (
            <li key={`mkt-${idx}`} className="flex items-start gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
              <span><strong className="text-slate-800">Market:</strong> {pro}</span>
            </li>
          ))}
          {crop.marketInsights && (
            <li className="flex items-start gap-1.5 text-slate-500">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
              <span><strong className="text-slate-700">Mandi Intel:</strong> {crop.marketInsights}</span>
            </li>
          )}
        </ul>
      </div>

      {/* Action Bar */}
      <div className="mt-3.5 pt-2.5 border-t border-slate-100 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-1 text-[11px] text-slate-500">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Govt MSP: {crop.msp > 0 ? `₹${crop.msp.toLocaleString('en-IN')}/qtl` : 'Open Market'}</span>
        </div>

        <div className="flex items-center gap-2">
          {onSelectCrop && (
            <button
              type="button"
              onClick={() => onSelectCrop(recommendation)}
              className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-emerald-800 bg-slate-100 hover:bg-slate-200 px-2.5 py-1.5 rounded-lg transition cursor-pointer"
            >
              <span>Quick Preview</span>
            </button>
          )}

          <a
            href={`/crop/${crop.id || crop.cropId || crop.name?.toLowerCase().replace(/\s+/g, '-')}`}
            className="inline-flex items-center gap-1 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 px-3 py-1.5 rounded-lg shadow-2xs transition cursor-pointer"
          >
            <span>View Analysis</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}
