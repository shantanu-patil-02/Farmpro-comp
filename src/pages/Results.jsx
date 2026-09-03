import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ScatterChart, 
  Scatter, 
  ZAxis, 
  ReferenceLine,
  Cell
} from 'recharts';
import { 
  Sparkles, 
  TrendingUp, 
  SlidersHorizontal, 
  ArrowLeft, 
  AlertTriangle, 
  Clock, 
  ShieldCheck, 
  Coins, 
  Layers, 
  BarChart3,
  Calendar
} from 'lucide-react';
import { useFarm } from '../context/FarmContext.jsx';
import { useTranslation } from '../i18n/index.jsx';
import CropCard from '../components/CropCard.jsx';
import ScoreBreakdown from '../components/ScoreBreakdown.jsx';
import CropDeepDiveModal from '../components/CropDeepDiveModal.jsx';
import WhyNotAnalysis from '../components/WhyNotAnalysis.jsx';
import FarmProfitCalculator from '../components/FarmProfitCalculator.jsx';
import DataSourceBadge from '../components/DataSourceBadge.jsx';
import RecommendationFeedback from '../components/RecommendationFeedback.jsx';

export default function Results() {
  const { recommendationResults, farmForm, dataSource, isGenerating, recommendationError } = useFarm();
  const { t } = useTranslation();
  const [selectedCropModal, setSelectedCropModal] = useState(null);
  const [activeChartTab, setActiveChartTab] = useState('scores'); // 'scores' | 'prices' | 'shortage' | 'soil' | 'risk' | 'timeline'

  const top5 = recommendationResults?.topRecommendations?.slice(0, 5) || [];
  const cautioned = recommendationResults?.cautionedCrops || [];

  if (isGenerating) {
    return (
      <div className="py-20 flex flex-col items-center justify-center text-center space-y-4">
        <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
        <h2 className="text-xl font-bold text-slate-900 font-heading">{t('results.loadingTitle', 'Computing Dual-Pillar Crop Recommendations...')}</h2>
        <p className="text-sm text-slate-500 max-w-md">
          {t('results.loadingDesc', 'Cross-referencing APMC wholesale supply deficits, historical price velocity, and your soil parameters.')}
        </p>
      </div>
    );
  }

  if (top5.length === 0) {
    return (
      <div className="py-16 max-w-2xl mx-auto text-center space-y-6">
        <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto border border-amber-200">
          <Sparkles className="w-8 h-8 text-amber-600" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 font-heading">{t('results.emptyTitle', 'No Recommendations Yet')}</h2>
        <p className="text-sm text-slate-600">
          {t('results.emptyDesc', 'Submit your farm conditions to view market-first ranking results.')}
        </p>
        <Link
          to="/recommendation"
          className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-800 hover:bg-emerald-900 text-white text-sm font-bold rounded-xl shadow-md transition cursor-pointer"
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span>{t('results.fillFormButton', 'Go to Recommendation Form')}</span>
        </Link>
      </div>
    );
  }

  // Chart 1: Crop Score Comparison Data
  const scoreComparisonData = top5.map(item => ({
    name: item.crop.name.split(' ')[0],
    fullName: item.crop.name,
    'Composite Score': item.overallScore,
    'Agronomic Suitability': item.agronomic.score,
    'Market Opportunity': item.market.score,
    'Climate Safety': item.climate.climateScore
  }));

  // Chart 2: Expected Price Growth Data
  const priceGrowthData = top5.map(item => {
    const current = item.currentPrice;
    const expected = item.expectedPrice;
    const growth = Number((((expected - current) / current) * 100).toFixed(1));
    return {
      name: item.crop.name.split(' ')[0],
      fullName: item.crop.name,
      'Current Price (₹/qtl)': current,
      'Expected Harvest (₹/qtl)': expected,
      'Growth (%)': growth
    };
  });

  // Chart 3: Market Stock Shortage Data
  const stockShortageData = top5.map(item => ({
    name: item.crop.name.split(' ')[0],
    fullName: item.crop.name,
    'Current Buffer (k Tonnes)': Math.round((item.crop.currentStockTonnes || 12000) / 1000),
    'Normal Reserve (k Tonnes)': Math.round((item.crop.normalStockTonnes || 18000) / 1000),
    'Deficit (%)': Math.abs(item.crop.deficitPercentage || 15)
  }));

  // Chart 4: Soil Suitability Data
  const soilSuitabilityData = top5.map(item => ({
    name: item.crop.name.split(' ')[0],
    fullName: item.crop.name,
    'Soil & NPK Match (%)': item.agronomic.score,
    'Water Compatibility (%)': item.agronomic.breakdown?.water || 85,
    'pH Compatibility (%)': item.agronomic.breakdown?.ph || 90
  }));

  // Chart 5: Risk vs Opportunity Data
  const riskOpportunityData = top5.map(item => ({
    name: item.crop.name.split(' ')[0],
    fullName: item.crop.name,
    risk: item.climate.riskScore || 25,
    profit: Math.round(item.financials.netProfitPerAcre / 1000), // in ₹k
    score: item.overallScore
  }));

  // Chart 6: Crop Cycle Timeline Data
  const cropCycleData = top5.map(item => {
    const match = item.crop.durationDays?.match(/\d+/g);
    const avgDays = match ? Math.round((Number(match[0]) + Number(match[1] || match[0])) / 2) : 100;
    return {
      name: item.crop.name.split(' ')[0],
      fullName: item.crop.name,
      'Duration (Days)': avgDays,
      displayDuration: item.crop.durationDays
    };
  });

  return (
    <div className="space-y-10 py-6 max-w-7xl mx-auto font-sans" id="results-page">
      
      {/* Top Breadcrumb & Summary Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800">
            <Link to="/recommendation" className="hover:underline flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{t('results.modifyInputs', 'Modify Inputs')}</span>
            </Link>
            <span>/</span>
            <span className="text-slate-500">{t('results.title', 'Top 5 Recommended Crops')}</span>
          </div>

          <div className="flex flex-wrap items-center gap-3 mt-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">
              {t('results.title', 'Top 5 Recommended Crops')}
            </h1>
            <DataSourceBadge dataSource={dataSource} size="sm" />
          </div>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            {t('results.subtitle', 'Ranked by composite score of market demand, mandi price forecast, and agronomic match.')} (<strong>{farmForm.landArea} {farmForm.landUnit}</strong> • <strong>{farmForm.soilType}</strong> • <strong>{farmForm.location}</strong>)
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-center">
          <Link
            to="/recommendation"
            className="px-3 py-2 rounded-xl text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 shadow-2xs flex items-center gap-1.5"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>{t('results.recalculate', 'Re-tune Conditions')}</span>
          </Link>
          <Link
            to="/market-insights"
            className="px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 shadow-sm flex items-center gap-1.5"
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>{t('nav.marketInsights', 'Market Insights')}</span>
          </Link>
        </div>
      </div>

      {/* TOP 5 RECOMMENDED CROPS CARDS */}
      <section className="space-y-4" id="top-5-cards-section">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 font-heading flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>{t('results.title', 'Top 5 Recommended Crops')}</span>
          </h2>
          <span className="text-xs text-slate-500">
            {t('results.showingCount', 'Showing Top 5 out of 12 evaluated crops')}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {top5.map((item, idx) => (
            <CropCard 
              key={item.crop.id || idx}
              item={item}
              rank={idx + 1}
              onOpenDeepDive={(c) => setSelectedCropModal(c)}
            />
          ))}
        </div>

        {/* Top Pick Recommendation Formula Breakdown */}
        {top5[0] && (
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                #1 Top Pick ({top5[0].crop.name}) — {t('results.scoreBreakdownTitle', '6-Factor Algorithmic Score Breakdown')}
              </span>
              <span className="text-[11px] text-emerald-800 font-semibold">
                {top5[0].confidence}
              </span>
            </div>
            <ScoreBreakdown 
              agronomic={top5[0].agronomic}
              market={top5[0].market}
              climate={top5[0].climate}
              overallScore={top5[0].score}
              factors={top5[0].factors}
              rawScore={top5[0].rawScore}
            />
          </div>
        )}
      </section>

      {/* 6 RECHARTS ANALYTICAL CHARTS SUITE */}
      <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-7 space-y-6" id="analytical-charts-suite">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <span className="text-[10px] uppercase font-bold text-emerald-700 tracking-wider block">
              {t('results.comparativeAnalysis', 'Comparative Analysis')}
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 font-heading mt-0.5">
              6 Recharts Analytical Projections
            </h2>
            <p className="text-xs text-slate-500">
              Select an analytical perspective to inspect the Top 5 crops:
            </p>
          </div>

          {/* Tab Switcher for 6 Charts */}
          <div className="flex flex-wrap gap-1.5 bg-slate-100 p-1 rounded-xl">
            {[
              { id: 'scores', label: '1. Crop Scores' },
              { id: 'prices', label: '2. Price Growth' },
              { id: 'shortage', label: '3. Mandi Deficit' },
              { id: 'soil', label: '4. Soil Match' },
              { id: 'risk', label: '5. Risk vs ROI' },
              { id: 'timeline', label: '6. Crop Cycle' },
            ].map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveChartTab(tab.id)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  activeChartTab === tab.id
                    ? 'bg-white text-emerald-800 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* CHART 1: Crop Score Comparison */}
        {activeChartTab === 'scores' && (
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-800">Overall Match & Component Sub-Scores</span>
              <span className="text-slate-500">Scale: 0 to 100</span>
            </div>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={scoreComparisonData} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 11 }} />
                  <YAxis stroke="#64748b" domain={[0, 100]} tick={{ fontSize: 11 }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', borderColor: '#e2e8f0', fontSize: '11px' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                  <Bar dataKey="Composite Score" fill="#047857" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Agronomic Suitability" fill="#10b981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Market Opportunity" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Climate Safety" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* CHART 2: Expected Price Growth */}
        {activeChartTab === 'prices' && (
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-800">Current vs Projected Harvest Realization (₹/Quintal)</span>
              <span className="text-slate-500">Mandi Modal Rate Forecast</span>
            </div>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={priceGrowthData} margin={{ top: 10, right: 20, left: 5, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 11 }} />
                  <YAxis stroke="#64748b" tick={{ fontSize: 11 }} tickFormatter={(v) => `₹${v}`} />
                  <Tooltip 
                    formatter={(val, name) => [name.includes('Growth') ? `${val}%` : `₹${val.toLocaleString('en-IN')}`, name]}
                    contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', borderColor: '#e2e8f0', fontSize: '11px' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                  <Bar dataKey="Current Price (₹/qtl)" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Expected Harvest (₹/qtl)" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* CHART 3: Market Stock Shortage */}
        {activeChartTab === 'shortage' && (
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-800">Mandi Reserve Buffer vs Normal Stock (Thousand Tonnes)</span>
              <span className="text-slate-500">Deficit indicates strong seller pricing leverage</span>
            </div>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stockShortageData} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 11 }} />
                  <YAxis stroke="#64748b" tick={{ fontSize: 11 }} tickFormatter={(v) => `${v}k T`} />
                  <Tooltip 
                    formatter={(val, name) => [`${val}k Tonnes`, name]}
                    contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', borderColor: '#e2e8f0', fontSize: '11px' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                  <Bar dataKey="Current Buffer (k Tonnes)" fill="#f97316" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Normal Reserve (k Tonnes)" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* CHART 4: Soil Suitability */}
        {activeChartTab === 'soil' && (
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-800">Agronomic Compatibility Breakdown (%)</span>
              <span className="text-slate-500">Tested against {farmForm.soilType} & NPK levels</span>
            </div>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={soilSuitabilityData} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 11 }} />
                  <YAxis stroke="#64748b" domain={[0, 100]} tick={{ fontSize: 11 }} />
                  <Tooltip 
                    formatter={(val) => [`${val}%`, '']}
                    contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', borderColor: '#e2e8f0', fontSize: '11px' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                  <Bar dataKey="Soil & NPK Match (%)" fill="#047857" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Water Compatibility (%)" fill="#0284c7" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="pH Compatibility (%)" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* CHART 5: Risk vs Opportunity */}
        {activeChartTab === 'risk' && (
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-800">Risk vs Net Profit Realization</span>
              <span className="text-slate-500">X-Axis: Climate Risk (lower is safer) • Y-Axis: Net Profit (₹k/acre)</span>
            </div>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 20, right: 20, bottom: 10, left: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis type="number" dataKey="risk" name="Climate Risk Score" domain={[10, 60]} stroke="#64748b" tick={{ fontSize: 11 }} unit=" Risk" />
                  <YAxis type="number" dataKey="profit" name="Net Profit" stroke="#64748b" tick={{ fontSize: 11 }} tickFormatter={(v) => `₹${v}k`} />
                  <ZAxis type="number" dataKey="score" range={[100, 400]} />
                  <Tooltip 
                    cursor={{ strokeDasharray: '3 3' }}
                    formatter={(value, name) => [
                      name === 'Net Profit' ? `₹${value},000/acre` : value,
                      name
                    ]}
                    contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', borderColor: '#e2e8f0', fontSize: '11px' }}
                  />
                  <Scatter name="Top Crops" data={riskOpportunityData} fill="#10b981">
                    {riskOpportunityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 0 ? '#047857' : '#10b981'} />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* CHART 6: Crop Cycle */}
        {activeChartTab === 'timeline' && (
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-800">Crop Duration in Days (Sowing to Harvest)</span>
              <span className="text-slate-500">Shorter durations permit multiple crop rotations</span>
            </div>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart layout="vertical" data={cropCycleData} margin={{ top: 10, right: 30, left: 30, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                  <XAxis type="number" stroke="#64748b" tick={{ fontSize: 11 }} unit=" Days" domain={[0, 200]} />
                  <YAxis type="category" dataKey="name" stroke="#64748b" tick={{ fontSize: 11 }} />
                  <Tooltip 
                    formatter={(val, name, item) => [`${item.payload.displayDuration}`, 'Duration']}
                    contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', borderColor: '#e2e8f0', fontSize: '11px' }}
                  />
                  <Bar dataKey="Duration (Days)" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </section>

      {/* WHY NOT ANALYSIS & PROFIT SIMULATOR */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <WhyNotAnalysis 
          cautionedCrops={cautioned} 
          onOpenDeepDive={(c) => setSelectedCropModal(c)}
        />
        <FarmProfitCalculator topPick={top5[0]} />
      </div>

      {/* WAS THIS RECOMMENDATION USEFUL? FEEDBACK FORM */}
      <RecommendationFeedback 
        recommendationId={recommendationResults?.recommendationId}
        topCrops={top5}
      />

      {/* MODAL DEEP DIVE */}
      {selectedCropModal && (
        <CropDeepDiveModal 
          cropItem={selectedCropModal}
          onClose={() => setSelectedCropModal(null)}
        />
      )}

    </div>
  );
}
