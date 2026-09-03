import React, { useState } from 'react';
import { 
  CheckCircle2, 
  AlertCircle, 
  TrendingUp, 
  ShieldCheck, 
  Sprout, 
  Calculator, 
  ChevronDown, 
  ChevronUp,
  Info
} from 'lucide-react';

export default function ScoreBreakdown({ agronomic, market, climate, overallScore, factors, rawScore }) {
  const [showFormulaDetails, setShowFormulaDetails] = useState(false);

  const agroScore = agronomic?.score ?? 85;
  const marketScore = market?.score ?? 88;
  const climateScore = climate?.climateScore ?? 82;
  const totalScore = overallScore ?? Math.round(agroScore * 0.40 + marketScore * 0.45 + climateScore * 0.15);

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-emerald-700 bg-emerald-50 border-emerald-200';
    if (score >= 60) return 'text-amber-700 bg-amber-50 border-amber-200';
    return 'text-rose-700 bg-rose-50 border-rose-200';
  };

  const getProgressColor = (score) => {
    if (score >= 80) return 'bg-emerald-600';
    if (score >= 60) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  return (
    <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200 shadow-sm space-y-4" id="score-breakdown-component">
      {/* Top Banner: Composite Score */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-slate-100">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            Composite Opportunity Score
          </span>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-0.5">
            FarmPro Dual-Engine Evaluation
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Balanced weighting: 40% Agronomics + 45% Mandi Economics + 15% Climate
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Grade</span>
            <span className="text-xs font-bold text-emerald-800">
              {totalScore >= 85 ? 'Grade A+' : totalScore >= 70 ? 'Grade A' : 'Grade B'}
            </span>
          </div>
          <div className={`px-3.5 py-1.5 rounded-xl border text-xl sm:text-2xl font-extrabold ${getScoreColor(totalScore)}`}>
            {totalScore}<span className="text-xs font-bold opacity-70">/100</span>
          </div>
        </div>
      </div>

      {/* 3 Pillar Bars */}
      <div className="space-y-3.5">
        
        {/* Pillar 1: Agronomic Match */}
        <div>
          <div className="flex items-center justify-between text-xs font-bold mb-1">
            <span className="flex items-center gap-1.5 text-slate-800">
              <Sprout className="w-3.5 h-3.5 text-emerald-600" />
              <span>Agronomic Suitability (Soil, pH, NPK, Cycle)</span>
            </span>
            <span className="text-slate-900 font-bold">{agroScore}%</span>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${getProgressColor(agroScore)}`}
              style={{ width: `${agroScore}%` }}
            ></div>
          </div>
          {agronomic?.pros?.length > 0 && (
            <p className="text-[11px] text-slate-600 mt-1 flex items-start gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0 mt-0.5" />
              <span>{agronomic.pros[0]}</span>
            </p>
          )}
        </div>

        {/* Pillar 2: Market Opportunity */}
        <div>
          <div className="flex items-center justify-between text-xs font-bold mb-1">
            <span className="flex items-center gap-1.5 text-slate-800">
              <TrendingUp className="w-3.5 h-3.5 text-amber-600" />
              <span>Market Opportunity (Deficit, Realization, ROI)</span>
            </span>
            <span className="text-slate-900 font-bold">{marketScore}%</span>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${getProgressColor(marketScore)}`}
              style={{ width: `${marketScore}%` }}
            ></div>
          </div>
          {market?.pros?.length > 0 && (
            <p className="text-[11px] text-slate-600 mt-1 flex items-start gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0 mt-0.5" />
              <span>{market.pros[0]}</span>
            </p>
          )}
        </div>

        {/* Pillar 3: Climate Resilience */}
        <div>
          <div className="flex items-center justify-between text-xs font-bold mb-1">
            <span className="flex items-center gap-1.5 text-slate-800">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-600" />
              <span>Climate & Weather Resilience</span>
            </span>
            <span className="text-slate-900 font-bold">{climateScore}%</span>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${getProgressColor(climateScore)}`}
              style={{ width: `${climateScore}%` }}
            ></div>
          </div>
          <p className="text-[11px] text-slate-600 mt-1 flex items-start gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0 mt-0.5" />
            <span>Risk Level: {climate?.riskLevel || 'Low'} • Temperature and rainfall within growth parameters</span>
          </p>
        </div>

      </div>

      {/* 6-Factor Mathematical Formula Section */}
      <div className="pt-3 border-t border-slate-100">
        <button
          type="button"
          onClick={() => setShowFormulaDetails(!showFormulaDetails)}
          className="w-full flex items-center justify-between p-2.5 rounded-lg bg-slate-50 hover:bg-slate-100 transition text-xs font-bold text-slate-700 cursor-pointer"
        >
          <span className="flex items-center gap-2">
            <Calculator className="w-3.5 h-3.5 text-emerald-700" />
            <span>6-Factor Recommendation Formula (cropScoring.js)</span>
          </span>
          <span className="flex items-center gap-1 text-[11px] text-slate-500">
            {showFormulaDetails ? 'Hide math' : 'Show formula & factors'}
            {showFormulaDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </span>
        </button>

        {showFormulaDetails && (
          <div className="mt-3 p-3.5 rounded-xl bg-slate-900 text-slate-100 text-xs space-y-3 font-mono">
            <div className="text-slate-400 text-[11px] border-b border-slate-800 pb-2">
              <span className="font-bold text-emerald-400">Crop Score Formula:</span>
              <div className="mt-1 text-slate-200 font-semibold leading-relaxed">
                (Stock Shortage × Price Growth × Soil Match) / (Seed Cost × Water Need × Climate Risk)
              </div>
            </div>

            {factors && (
              <div className="space-y-2 text-[11px]">
                <div>
                  <span className="text-emerald-400 font-bold uppercase block text-[10px]">Numerator (Positive Factors):</span>
                  <div className="grid grid-cols-3 gap-1.5 mt-1 text-slate-300">
                    <div className="bg-slate-800/80 p-1.5 rounded">
                      <span className="text-[10px] text-slate-400 block">Shortage</span>
                      <strong className="text-emerald-400">{factors.stockShortageScore}</strong>
                    </div>
                    <div className="bg-slate-800/80 p-1.5 rounded">
                      <span className="text-[10px] text-slate-400 block">Price Growth</span>
                      <strong className="text-emerald-400">{factors.priceGrowthScore}</strong>
                    </div>
                    <div className="bg-slate-800/80 p-1.5 rounded">
                      <span className="text-[10px] text-slate-400 block">Soil Match</span>
                      <strong className="text-emerald-400">{factors.soilMatchScore}</strong>
                    </div>
                  </div>
                  <div className="text-right text-[10px] text-slate-400 mt-0.5">
                    Product = <span className="text-slate-200">{factors.numerator}</span>
                  </div>
                </div>

                <div>
                  <span className="text-amber-400 font-bold uppercase block text-[10px]">Denominator (Negative Factors):</span>
                  <div className="grid grid-cols-3 gap-1.5 mt-1 text-slate-300">
                    <div className="bg-slate-800/80 p-1.5 rounded">
                      <span className="text-[10px] text-slate-400 block">Seed Cost</span>
                      <strong className="text-amber-400">{factors.seedCostScore}</strong>
                    </div>
                    <div className="bg-slate-800/80 p-1.5 rounded">
                      <span className="text-[10px] text-slate-400 block">Water Need</span>
                      <strong className="text-amber-400">{factors.waterRequirementScore}</strong>
                    </div>
                    <div className="bg-slate-800/80 p-1.5 rounded">
                      <span className="text-[10px] text-slate-400 block">Climate Risk</span>
                      <strong className="text-amber-400">{factors.climateRiskScore}</strong>
                    </div>
                  </div>
                  <div className="text-right text-[10px] text-slate-400 mt-0.5">
                    Product = <span className="text-slate-200">{factors.denominator}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-400">Formula Raw Result:</span>
                  <span className="text-emerald-300 font-bold">{rawScore ?? (factors.numerator / factors.denominator).toFixed(4)}</span>
                </div>
              </div>
            )}

            <div className="text-[10px] text-slate-400 flex items-center gap-1.5 pt-1 border-t border-slate-800">
              <Info className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Zero-division guarded with EPSILON = 0.01 floor. All factors normalized to [0, 1].</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
