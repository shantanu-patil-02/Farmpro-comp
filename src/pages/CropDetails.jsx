import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Sparkles, 
  TrendingUp, 
  Sprout, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  Droplets, 
  Thermometer, 
  Coins, 
  Calendar, 
  Layers,
  Award
} from 'lucide-react';
import { useFarm } from '../context/FarmContext.jsx';
import { useTranslation } from '../i18n/index.jsx';
import PriceChart from '../components/PriceChart.jsx';
import ScoreBreakdown from '../components/ScoreBreakdown.jsx';
import WeatherCard from '../components/WeatherCard.jsx';

export default function CropDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { cropsDatabase, recommendationResults, farmForm } = useFarm();
  const { t } = useTranslation();

  // Find crop in database or recommendation results
  const normalizedId = (id || '').toLowerCase().trim();
  const allAvailableCrops = [
    ...(recommendationResults?.allResults?.map(r => r.crop) || []),
    ...(recommendationResults?.topRecommendations?.map(r => r.crop) || []),
    ...cropsDatabase
  ];

  const crop = allAvailableCrops.find(c => 
    c.id === id || 
    c._id === id || 
    c.cropId === id ||
    c.name?.toLowerCase().replace(/\s+/g, '-') === normalizedId ||
    c.name?.toLowerCase() === normalizedId
  ) || cropsDatabase[0];

  // Check if crop has evaluation result in the engine
  const evaluatedItem = 
    recommendationResults?.allResults?.find(r => 
      r.crop?.id === crop?.id || 
      r.cropId === crop?.id || 
      r.crop?.name?.toLowerCase() === crop?.name?.toLowerCase()
    ) || 
    recommendationResults?.topRecommendations?.find(r => 
      r.crop?.id === crop?.id || 
      r.cropId === crop?.id || 
      r.crop?.name?.toLowerCase() === crop?.name?.toLowerCase()
    ) || {
    overallScore: 88,
    recommendationScore: 88,
    agronomic: { score: 90, pros: ['Highly compatible with regional soil.'] },
    market: { score: 86, pros: ['Favorable price trajectory and high demand.'] },
    climate: { climateScore: 84, riskLevel: crop.climateRisk || 'Low', riskScore: 20 },
    financials: {
      acres: farmForm.landArea,
      yieldPerAcre: crop.yieldPerAcre,
      totalYieldQuintals: crop.yieldPerAcre * farmForm.landArea,
      inputCostPerAcre: crop.inputCostPerAcre,
      totalInputCost: crop.inputCostPerAcre * farmForm.landArea,
      totalGrossRevenue: crop.yieldPerAcre * farmForm.landArea * crop.expectedPrice,
      totalNetProfit: (crop.yieldPerAcre * farmForm.landArea * crop.expectedPrice) - (crop.inputCostPerAcre * farmForm.landArea),
      roi: Math.round((((crop.yieldPerAcre * crop.expectedPrice) - crop.inputCostPerAcre) / crop.inputCostPerAcre) * 100)
    }
  };

  const growthPercent = Math.round(((crop.expectedPrice - crop.currentPrice) / crop.currentPrice) * 100);
  const isPositiveGrowth = growthPercent >= 0;

  return (
    <div className="space-y-8 py-6 max-w-6xl mx-auto font-sans" id="crop-details-page">
      
      {/* Back Navigation Bar */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <Link
          to="/results"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-emerald-800 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t('cropDetails.back', 'Back to Top 5 Recommendations')}</span>
        </Link>

        <span className="text-xs text-slate-500 font-medium">
          Category: <strong className="text-slate-800 capitalize">{crop.category}</strong>
        </span>
      </div>

      {/* Hero Crop Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200">
                {crop.opportunityBadge || 'Recommended Opportunity'}
              </span>
              <span className="text-xs text-slate-500 font-medium">
                {crop.season?.join(', ')} Season
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 font-heading">
              {crop.name}
            </h1>
            <p className="text-base text-slate-500 font-medium">
              Local Name: <strong className="text-slate-800">{crop.localName || 'Regional Crop'}</strong>
            </p>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pt-1">
              {crop.marketInsights || 'High demand profile with robust commercial buyer interest.'}
            </p>
          </div>

          {/* Pricing & Score Box */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center gap-6 shrink-0">
            <div className="text-center sm:text-left">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                {t('cropCard.currentPrice', 'Current Price')}
              </span>
              <p className="text-xl font-bold text-slate-800">
                ₹{crop.currentPrice.toLocaleString('en-IN')}<span className="text-xs text-slate-500 font-normal">/qtl</span>
              </p>
              <div className="mt-1 flex items-center gap-1 text-xs font-bold">
                <span className="text-slate-400">{t('cropCard.expectedPrice', 'Expected Harvest')}:</span>
                <span className="text-emerald-800">₹{crop.expectedPrice.toLocaleString('en-IN')}</span>
                <span className={`px-1.5 py-0.2 rounded text-[10px] ${isPositiveGrowth ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                  {isPositiveGrowth ? `+${growthPercent}%` : `${growthPercent}%`}
                </span>
              </div>
            </div>

            <div className="w-px h-12 bg-slate-200 hidden sm:block"></div>

            <div className="text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                {t('cropDetails.score', 'Suitability & Market Score')}
              </span>
              <div className="px-3.5 py-1 rounded-xl bg-emerald-800 text-white text-xl sm:text-2xl font-extrabold shadow-xs mt-0.5">
                {evaluatedItem.overallScore}<span className="text-xs font-normal opacity-80">/100</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Highlights Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-100 text-xs">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">{t('cropCard.stockShortage', 'Mandi Stock Level')}</span>
            <p className="font-bold text-slate-800 mt-0.5">{crop.supplyStatus}</p>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">{t('cropCard.cycle', 'Crop Cycle')}</span>
            <p className="font-bold text-slate-800 mt-0.5">{crop.durationDays}</p>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">{t('cropDetails.yield', 'Expected Yield')}</span>
            <p className="font-bold text-slate-800 mt-0.5">{crop.yieldPerAcre} Quintals/Acre</p>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">{t('cropDetails.inputCost', 'Input Cost')}</span>
            <p className="font-bold text-slate-800 mt-0.5">₹{crop.inputCostPerAcre.toLocaleString('en-IN')}/Acre</p>
          </div>
        </div>
      </div>

      {/* Dual Section: Score Breakdown + Price Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ScoreBreakdown 
          agronomic={evaluatedItem.agronomic}
          market={evaluatedItem.market}
          climate={evaluatedItem.climate}
          overallScore={evaluatedItem.overallScore}
        />

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-col justify-between">
          <PriceChart 
            historicalPrices={crop.historicalPrices} 
            msp={crop.msp}
            cropName={crop.name}
            height={220}
          />
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Minimum Support Price (MSP): <strong>₹{crop.msp ? `${crop.msp.toLocaleString('en-IN')}/qtl` : 'N/A'}</strong></span>
            <span>Perishability: <strong className="capitalize">{crop.perishability}</strong></span>
          </div>
        </div>
      </div>

      {/* Detailed Agronomic & Environmental Requirements */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
        <h3 className="text-base sm:text-lg font-bold text-slate-900 font-heading">
          {t('cropDetails.agronomicDetails', 'Agronomic Requirements')}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
            <div className="flex items-center gap-1.5 font-bold text-slate-700 mb-1">
              <Layers className="w-3.5 h-3.5 text-amber-600" />
              <span>Compatible Soils</span>
            </div>
            <p className="text-slate-600">{crop.soilTypes?.join(', ') || 'Alluvial, Black Soil, Loam'}</p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
            <div className="flex items-center gap-1.5 font-bold text-slate-700 mb-1">
              <Droplets className="w-3.5 h-3.5 text-blue-600" />
              <span>Water & Irrigation</span>
            </div>
            <p className="text-slate-600">{crop.waterNeeds} Requirement • Ideal rain: {crop.idealRainfall?.min}-{crop.idealRainfall?.max} mm</p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
            <div className="flex items-center gap-1.5 font-bold text-slate-700 mb-1">
              <Thermometer className="w-3.5 h-3.5 text-rose-600" />
              <span>Temperature & pH</span>
            </div>
            <p className="text-slate-600">Temp: {crop.idealTemp?.min}°C - {crop.idealTemp?.max}°C • pH: {crop.idealPh?.min} - {crop.idealPh?.max}</p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
            <div className="flex items-center gap-1.5 font-bold text-slate-700 mb-1">
              <Coins className="w-3.5 h-3.5 text-emerald-600" />
              <span>Seed & Capital Cost</span>
            </div>
            <p className="text-slate-600">Seed cost: ₹{(crop.seedCostPerAcre || 3000).toLocaleString('en-IN')}/acre • Total: ₹{crop.inputCostPerAcre.toLocaleString('en-IN')}/acre</p>
          </div>
        </div>

        {/* Sowing and Harvest Windows */}
        <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div>
            <span className="font-bold text-emerald-950 block">Recommended Sowing Window:</span>
            <span className="text-emerald-800 font-semibold">{crop.sowingWindow}</span>
          </div>
          <div>
            <span className="font-bold text-emerald-950 block">Anticipated Harvest Window:</span>
            <span className="text-emerald-800 font-semibold">{crop.harvestWindow}</span>
          </div>
          <div>
            <span className="font-bold text-emerald-950 block">Fertilizer Benchmark (N:P:K):</span>
            <span className="text-emerald-800 font-semibold">{crop.npkRatio?.n}:{crop.npkRatio?.p}:{crop.npkRatio?.k} kg/ha</span>
          </div>
        </div>
      </div>

      {/* Advantages, Risks, and Farming Considerations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Advantages */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-3">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{t('cropDetails.advantages', 'Key Advantages')}</span>
          </h3>
          <ul className="space-y-2 text-xs text-slate-700">
            {crop.advantages?.map((adv, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 mt-1.5"></span>
                <span>{adv}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Risks */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-3">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span>{t('cropDetails.risks', 'Key Risks & Watchpoints')}</span>
          </h3>
          <ul className="space-y-2 text-xs text-slate-700">
            {crop.risks?.map((risk, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 mt-1.5"></span>
                <span>{risk}</span>
              </li>
            ))}
          </ul>
        </div>

      </div>

      {/* Practical Farming Considerations */}
      <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-5 sm:p-6 text-xs space-y-2">
        <h4 className="font-bold text-amber-950 flex items-center gap-1.5 text-xs sm:text-sm">
          <Sparkles className="w-4 h-4 text-amber-700" />
          <span>FarmPro Field Package & Management Tip</span>
        </h4>
        <p className="text-amber-900 leading-relaxed">
          {crop.farmingConsiderations}
        </p>
      </div>

      {/* Weather Context */}
      <WeatherCard />

    </div>
  );
}

