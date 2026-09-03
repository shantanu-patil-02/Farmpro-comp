import React from 'react';
import { 
  AlertOctagon, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  TrendingDown, 
  Droplets, 
  AlertTriangle,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { CROPS_DATABASE } from '../data/cropDatabase.js';

export default function WhyNotAnalysis({ 
  allEvaluatedCrops, 
  cautionedCrops, 
  onSelectCrop, 
  onOpenDeepDive 
}) {
  const handleOpenModal = onOpenDeepDive || onSelectCrop || (() => {});

  // Determine cautioned list from props or evaluate from all crops
  let cautionedList = [];

  if (Array.isArray(cautionedCrops) && cautionedCrops.length > 0) {
    cautionedList = cautionedCrops.map(c => {
      // Find underlying crop database object if available
      const dbCrop = CROPS_DATABASE.find(db => 
        db.name.toLowerCase() === (c.name || c.cropName || c.crop?.name || '').toLowerCase()
      ) || c.crop || {
        id: c.cropId || 'crop-caution',
        name: c.name || c.cropName || 'Cautioned Crop',
        localName: c.localName || 'Regional Crop',
        category: c.category || 'Cereal / Commercial',
        supplyStatus: c.supplyStatus || 'Oversupply / Low Margin',
        deficitPercentage: c.deficitPercentage || 18,
        inputCostPerAcre: c.inputCostPerAcre || 18000,
        expectedPrice: c.expectedPrice || 2400,
        yieldPerAcre: c.yieldPerAcre || 15,
        marketInsights: c.reason || c.warning || 'Market supply exceeds seasonal demand buffer; prices under historical downward pressure.',
      };

      return {
        crop: dbCrop,
        overallScore: c.score || c.overallScore || 54,
        agronomic: c.agronomic || {
          isFeasible: !c.agronomicBarrier,
          score: c.soilScore || 85,
          pros: ['Soil composition allows growth.'],
          cons: [c.agronomicBarrier || 'High water or pest management sensitivity.']
        },
        market: c.market || {
          score: c.marketScore || 45,
          pros: ['Local APMC mandi exists.'],
          cons: [c.warning || c.reason || 'Market supply exceeds seasonal buffer; high price drop risk.']
        }
      };
    });
  } else if (Array.isArray(allEvaluatedCrops) && allEvaluatedCrops.length > 0) {
    cautionedList = allEvaluatedCrops.filter(
      item => !item.agronomic?.isFeasible || (item.overallScore || item.score || 100) < 70 || (item.crop?.deficitPercentage || 0) > 10
    );
  } else {
    // Standard default cautioned crops (Sugarcane, Wheat, Cotton if not optimal)
    const defaults = CROPS_DATABASE.filter(c => ['Sugarcane', 'Cotton', 'Wheat'].includes(c.name));
    cautionedList = defaults.map(c => ({
      crop: c,
      overallScore: 58,
      agronomic: {
        isFeasible: true,
        score: 82,
        pros: ['Grows well in standard soils.'],
        cons: ['Heavy water consumption (1500+ mm requirement).']
      },
      market: {
        score: 48,
        pros: ['Guaranteed mill procurement.'],
        cons: ['Delayed payment cycles and wholesale sugar surplus.']
      }
    }));
  }

  return (
    <div className="space-y-4" id="why-not-analysis-section">
      {/* Explainability Philosophy Header */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-900 text-[10px] font-bold uppercase tracking-wider mb-1.5 border border-amber-200">
            <HelpCircle className="w-3.5 h-3.5 text-amber-700" />
            <span>Explainability & Caution Engine</span>
          </div>
          <h2 className="text-base sm:text-lg font-bold tracking-tight text-slate-900 font-heading">
            "Why NOT Crop X?" — The Market-First Truth
          </h2>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            Standard agronomic tools suggest crops purely because soil allows germination. 
            FarmPro warns farmers against market gluts, excessive input debt, and post-harvest price erosion.
          </p>
        </div>
      </div>

      {/* Cautioned Crop Cards */}
      <div className="grid grid-cols-1 gap-3.5">
        {cautionedList.slice(0, 3).map((item, idx) => {
          const crop = item.crop || item;
          const overallScore = item.overallScore || item.score || 55;
          const agronomic = item.agronomic || { isFeasible: true, score: 80, cons: [] };
          const market = item.market || { score: 50, cons: [] };
          const isGlut = (crop.deficitPercentage || 0) > 10;
          const isWaterRisk = agronomic.isFeasible === false;

          return (
            <div 
              key={crop.id || idx}
              className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 hover:border-amber-300 transition shadow-sm space-y-3"
            >
              {/* Card Header */}
              <div className="flex items-start justify-between pb-2 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 font-heading">
                      Why NOT {crop.name}?
                    </h3>
                    <span className="text-xs text-slate-500">({crop.localName || 'Regional Crop'})</span>
                  </div>
                  <span className="text-[10px] font-bold text-rose-800 bg-rose-50 px-2.5 py-0.5 rounded-full mt-1 inline-block border border-rose-200">
                    {isGlut ? 'Market Glut / Price Crash Risk' : isWaterRisk ? 'Agronomic Water Barrier' : 'Depressed Margins / High Cost'}
                  </span>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-wider">Score</span>
                  <div className="text-xs font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
                    {overallScore}%
                  </div>
                </div>
              </div>

              {/* Contrast: What traditional systems say vs What FarmPro reveals */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="flex items-center gap-1.5 text-emerald-800 font-bold mb-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Agronomic Viability</span>
                  </div>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    {agronomic.isFeasible 
                      ? `YES (${agronomic.score || 85}% soil match). The crop can physically grow in your soil.`
                      : `CAUTION: Agronomic barrier (${agronomic.cons?.[0] || 'High water/pH challenge'}).`}
                  </p>
                </div>

                <div className="p-3 bg-rose-50/50 rounded-xl border border-rose-200">
                  <div className="flex items-center gap-1.5 text-rose-900 font-bold mb-1">
                    <XCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                    <span>Market & Margin Reality</span>
                  </div>
                  <p className="text-rose-900/80 text-[11px] leading-relaxed">
                    {market.cons?.[0] || crop.marketInsights || `High inventory in district APMCs limits price surge potential.`}
                  </p>
                </div>
              </div>

              {/* Action Button */}
              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-[11px] text-slate-500">
                  Input Cost: ₹{(crop.inputCostPerAcre || 18000).toLocaleString('en-IN')}/ac
                </span>
                <button
                  type="button"
                  onClick={() => handleOpenModal({
                    crop,
                    overallScore,
                    agronomic,
                    market,
                    climate: { climateScore: 65, riskLevel: 'Medium', riskScore: 35 },
                    financials: {
                      acres: 5,
                      yieldPerAcre: crop.yieldPerAcre || 12,
                      totalYieldQuintals: (crop.yieldPerAcre || 12) * 5,
                      inputCostPerAcre: crop.inputCostPerAcre || 18000,
                      totalInputCost: (crop.inputCostPerAcre || 18000) * 5,
                      totalGrossRevenue: (crop.yieldPerAcre || 12) * 5 * (crop.expectedPrice || 2500),
                      totalNetProfit: ((crop.yieldPerAcre || 12) * 5 * (crop.expectedPrice || 2500)) - ((crop.inputCostPerAcre || 18000) * 5),
                      netProfitPerAcre: Math.round((((crop.yieldPerAcre || 12) * 5 * (crop.expectedPrice || 2500)) - ((crop.inputCostPerAcre || 18000) * 5)) / 5),
                      roi: 45
                    }
                  })}
                  className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 hover:text-emerald-950 cursor-pointer"
                >
                  <span>Inspect Risk Breakdown</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
