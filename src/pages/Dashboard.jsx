import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Sprout, 
  TrendingUp, 
  MapPin, 
  Calendar, 
  Sparkles, 
  Clock, 
  Layers, 
  AlertTriangle, 
  ArrowRight,
  ShieldCheck,
  Maximize2
} from 'lucide-react';
import { useFarm } from '../context/FarmContext.jsx';
import { useTranslation } from '../i18n/index.jsx';
import CropCard from '../components/CropCard.jsx';
import WeatherCard from '../components/WeatherCard.jsx';

export default function Dashboard() {
  const { user, farmProfile, recommendationResults, history, farmForm } = useFarm();
  const { t } = useTranslation();

  const topCrop = recommendationResults.topRecommendations[0];
  const userLocation = farmProfile?.location || user?.district ? `${user?.district}, ${user?.state}` : 'Nagpur, Maharashtra';
  const landDisplay = `${farmProfile?.landArea || 5} ${farmProfile?.landUnit || 'acres'}`;
  const soilDisplay = farmProfile?.soilType || 'Black Soil';

  return (
    <div className="space-y-8 py-6 max-w-7xl mx-auto font-sans" id="dashboard-page">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-950 rounded-3xl p-6 sm:p-8 text-white border border-emerald-800 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-400 text-emerald-950">
              {user?.subscriptionPlan ? `${user.subscriptionPlan.toUpperCase()} PLAN` : 'PRO KISAN'}
            </span>
            <span className="text-xs text-emerald-300">
              {userLocation}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-heading">
            {t('dashboard.welcome', 'Welcome')}, {user?.name || 'Farmer'}!
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100/80 max-w-xl">
            {t('dashboard.summary', 'Your farm profile is active. Check top market opportunities and regional mandi analytics.')}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/recommendation"
            className="py-3 px-5 rounded-xl bg-amber-400 hover:bg-amber-300 text-emerald-950 text-xs sm:text-sm font-bold shadow-md transition flex items-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-emerald-950" />
            <span>{t('dashboard.newRecommendation', 'Run Sowing Audit')}</span>
          </Link>
          <Link
            to="/market-insights"
            className="py-3 px-4 rounded-xl bg-emerald-900 hover:bg-emerald-800 text-emerald-100 border border-emerald-700 text-xs font-bold transition flex items-center gap-1.5"
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>{t('nav.marketInsights', 'Mandi Rates')}</span>
          </Link>
        </div>
      </div>

      {/* 4 Quick Stat Metric Tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">{t('dashboard.myFarm', 'Cultivable Land')}</span>
          <p className="text-xl font-extrabold text-slate-900 mt-1 font-heading">
            {landDisplay}
          </p>
          <span className="text-[10px] text-emerald-700 font-semibold">{soilDisplay}</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">{t('dashboard.topPicks', 'Top Opportunity Crop')}</span>
          <p className="text-xl font-extrabold text-emerald-800 mt-1 font-heading truncate">
            {topCrop?.crop?.name || 'Soybean'}
          </p>
          <span className="text-[10px] text-slate-500 font-semibold">{topCrop?.overallScore || 94}/100 Match Score</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">{t('results.projectedRevenue', 'Projected Revenue')}</span>
          <p className="text-xl font-extrabold text-slate-900 mt-1 font-heading">
            ₹{topCrop?.financials?.totalGrossRevenue ? (topCrop.financials.totalGrossRevenue / 1000).toFixed(0) : '256'}k
          </p>
          <span className="text-[10px] text-emerald-700 font-semibold">
            ₹{topCrop?.financials?.totalNetProfit ? (topCrop.financials.totalNetProfit / 1000).toFixed(0) : '181'}k {t('results.netProfit', 'Net Profit')}
          </span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">{t('alerts.mandiAlerts', 'Mandi Alert')}</span>
          <p className="text-base font-bold text-rose-700 mt-1 truncate">
            Onion Glut Risk
          </p>
          <span className="text-[10px] text-slate-500 font-semibold">+38% regional surplus</span>
        </div>
      </div>

      {/* Main Grid: Top Recommended Crop + Weather Forecast */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 font-heading flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>{t('dashboard.topPicks', 'Current #1 Sowing Opportunity')}</span>
            </h2>
            <Link to="/results" className="text-xs font-bold text-emerald-800 hover:underline">
              {t('common.viewAll', 'View All Top 5')}
            </Link>
          </div>

          {topCrop && <CropCard item={topCrop} rank={1} />}
        </div>

        <div>
          <WeatherCard />
        </div>
      </div>

      {/* Recent History Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h3 className="text-base font-bold text-slate-900 font-heading flex items-center gap-2">
            <Clock className="w-4 h-4 text-emerald-700" />
            <span>{t('dashboard.recentAudits', 'Recent Recommendation Runs')}</span>
          </h3>
          <Link to="/history" className="text-xs font-bold text-emerald-800 hover:underline">
            {t('common.viewAll', 'View Full Audit History')}
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-[10px] uppercase font-bold text-slate-400 tracking-wider border-b border-slate-100">
                <th className="pb-2">Date</th>
                <th className="pb-2">Location & Soil</th>
                <th className="pb-2">Area</th>
                <th className="pb-2">Objective</th>
                <th className="pb-2">Top Recommendation</th>
                <th className="pb-2 text-right">{t('common.actions', 'Action')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {history.slice(0, 3).map((h) => (
                <tr key={h.id} className="hover:bg-slate-50/60">
                  <td className="py-2.5">{h.date}</td>
                  <td className="py-2.5">
                    <strong>{h.location}</strong>
                    <span className="block text-[10px] text-slate-400">{h.soilType}</span>
                  </td>
                  <td className="py-2.5">{h.landArea} {h.landUnit}</td>
                  <td className="py-2.5">{h.farmingObjective}</td>
                  <td className="py-2.5">
                    <span className="font-bold text-emerald-800">{h.topCrop}</span>
                    <span className="block text-[10px] text-slate-400">{h.topScore}/100 Score</span>
                  </td>
                  <td className="py-2.5 text-right">
                    <Link
                      to="/results"
                      className="text-xs font-bold text-emerald-800 hover:underline"
                    >
                      {t('cropCard.viewAnalysis', 'Inspect Results')}
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
