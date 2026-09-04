import React from 'react';
import { Link } from 'react-router-dom';
import { 
  TrendingUp, 
  Droplets, 
  ShieldCheck, 
  Calendar, 
  ArrowUpRight, 
  CheckCircle2, 
  Sparkles,
  Layers,
  Info
} from 'lucide-react';

export default function CropCard({ item, rank = 1, onOpenDeepDive }) {
  const crop = item.crop || item;
  const score = item.recommendationScore || item.overallScore || 90;
  const currentPrice = item.currentPrice || crop.currentPrice || 0;
  const expectedPrice = item.expectedPrice || crop.expectedPrice || 0;
  const priceGrowth = item.expectedPriceGrowth || (
    currentPrice > 0 
      ? `+${Math.round(((expectedPrice - currentPrice) / currentPrice) * 100)}%` 
      : '+0%'
  );
  const isPositiveGrowth = !priceGrowth.includes('-');
  const stockShortage = item.stockShortage || crop.supplyStatus || 'Deficit (-18%)';
  const soilSuitability = item.soilSuitability || `${item.agronomic?.score || 94}%`;
  const waterReq = item.waterRequirement || crop.waterNeeds || 'Moderate';
  const climateRisk = item.climateRisk || crop.climateRisk || 'Low';
  const cropCycle = item.cropCycle || crop.durationDays || '90-105 days';
  const seedCost = item.seedCost || item.crop?.seedCostPerAcre || 3500;
  const opportunity = item.opportunity || 'Estimated opportunity';
  const confidence = item.confidence || 'High confidence';
  const recommendationReason = item.recommendationReason || item.reason ||
    (item.market?.pros?.[0] ? `${item.market.pros[0]} ${item.agronomic?.pros?.[0] || ''}` : crop.recommendationReason);

  // Badge styling based on rank
  const getRankBadge = (r) => {
    switch (r) {
      case 1:
        return 'bg-amber-400 text-emerald-950 border-amber-300 font-extrabold shadow-xs';
      case 2:
        return 'bg-slate-200 text-slate-800 border-slate-300 font-bold';
      case 3:
        return 'bg-amber-100 text-amber-900 border-amber-200 font-bold';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200 font-medium';
    }
  };

  const getScoreBadge = (s) => {
    if (s >= 85) return 'bg-emerald-50 text-emerald-800 border-emerald-300';
    if (s >= 70) return 'bg-amber-50 text-amber-800 border-amber-200';
    return 'bg-slate-50 text-slate-700 border-slate-200';
  };

  return (
    <div 
      className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all p-4 sm:p-5 flex flex-col justify-between group"
      id={`crop-card-${crop.id || rank}`}
    >
      <div>
        {/* Top Header: Rank + Crop Name + Score */}
        <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs border ${getRankBadge(rank)}`}>
              #{rank}
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-emerald-800 transition-colors">
                  {crop.name}
                </h3>
                {rank === 1 && (
                  <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                    <Sparkles className="w-3 h-3 text-amber-500" />
                    Top Pick
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1.5 flex-wrap mt-0.5">
                {/* <span className="text-xs text-slate-500">
                  {crop.localName || 'Regional Crop'} • <span className="capitalize">{crop.category}</span>
                </span> */}
                <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-slate-100 text-slate-700 border border-slate-200">
                  {/* {opportunity} */}
                </span>
              </div>
            </div>
          </div>

          <div className="text-right shrink-0">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">
              Match Score
            </span>
            <div className={`px-2.5 py-0.5 rounded-lg border text-sm sm:text-base font-extrabold ${getScoreBadge(score)}`}>
              {score}<span className="text-[10px] font-semibold opacity-70">/100</span>
            </div>
          </div>
        </div>

        {/* Price & Market Highlight Bar */}
        <div className="grid grid-cols-3 gap-2 py-3 border-b border-slate-100 bg-slate-50/60 -mx-4 px-4 sm:-mx-5 sm:px-5">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Current Rate</span>
            <p className="text-xs sm:text-sm font-bold text-slate-800">
              ₹{currentPrice.toLocaleString('en-IN')}<span className="text-[10px] text-slate-400 font-normal">/qtl</span>
            </p>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Expected Harvest</span>
            <p className="text-xs sm:text-sm font-bold text-emerald-800">
              ₹{expectedPrice.toLocaleString('en-IN')}<span className="text-[10px] text-slate-400 font-normal">/qtl</span>
            </p>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Expected Growth</span>
            <p className={`text-xs sm:text-sm font-bold flex items-center gap-0.5 ${isPositiveGrowth ? 'text-emerald-700' : 'text-rose-600'}`}>
              <TrendingUp className={`w-3.5 h-3.5 ${!isPositiveGrowth ? 'rotate-180 text-rose-600' : ''}`} />
              <span>{priceGrowth}</span>
            </p>
          </div>
        </div>

        {/* Key Agronomic & Market Attributes Matrix */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 py-3 text-xs">
          <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Stock Shortage</span>
            <span className="font-bold text-slate-800 truncate block text-[11px]">
              {stockShortage}
            </span>
          </div>

          <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Soil Suitability</span>
            <span className="font-bold text-emerald-800 block text-[11px]">
              {soilSuitability}
            </span>
          </div>

          <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Water Need</span>
            <span className="font-bold text-slate-800 block text-[11px]">
              {waterReq}
            </span>
          </div>

          <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Crop Cycle</span>
            <span className="font-bold text-slate-800 block text-[11px]">
              {cropCycle}
            </span>
          </div>
        </div>

        {/* Recommendation Reason */}
        {/* <div className="p-2.5 rounded-lg bg-emerald-50/50 border border-emerald-100 text-xs mb-3">
          <span className="font-bold text-emerald-950 text-[10px] uppercase tracking-wider block">
            Why FarmPro Recommends:
          </span>
          <p className="text-emerald-900 text-[11px] leading-relaxed mt-0.5 line-clamp-2">
            {recommendationReason}
          </p>
        </div> */}
      </div>

      {/* Action Footer: Link to Crop Details + Profit Estimator */}
      <div className="pt-2 flex items-center justify-between gap-2 border-t border-slate-100 flex-wrap">
        <div className="flex items-center gap-2 text-[11px] text-slate-500">
          {/* <span>Risk: <strong className="text-slate-800">{climateRisk}</strong></span> */}
          <span>•</span>
          <span>Seed: <strong className="text-slate-800">₹{Number(seedCost).toLocaleString('en-IN')}/ac</strong></span>
        </div>

        <div className="flex items-center gap-2">
          {/* {onOpenDeepDive && (
            <button
              type="button"
              onClick={() => onOpenDeepDive(item)}
              className="text-xs font-semibold text-slate-600 hover:text-emerald-800 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 transition cursor-pointer"
            >
              Quick Breakdown
            </button>
          )} */}

          <Link
            to={`/crop/${crop.id || item.cropId || crop.name?.toLowerCase().replace(/\s+/g, '-')}`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold shadow-xs transition cursor-pointer"
            id={`view-analysis-${crop.id || rank}`}
          >
            <span>View Analysis</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
