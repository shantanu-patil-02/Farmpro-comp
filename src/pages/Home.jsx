import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Sprout, 
  TrendingUp, 
  ArrowRight, 
  ShieldCheck, 
  BarChart3, 
  Layers, 
  AlertTriangle, 
  Coins, 
  Clock, 
  CheckCircle2, 
  Globe2, 
  ChevronRight,
  Sparkles,
  Award
} from 'lucide-react';
import { useFarm } from '../context/FarmContext.jsx';
import { useTranslation, SUPPORTED_LANGUAGES } from '../i18n/index.jsx';
import CropCard from '../components/CropCard.jsx';
import WeatherCard from '../components/WeatherCard.jsx';

export default function Home() {
  const { recommendationResults } = useFarm();
  const { t } = useTranslation();
  const topCropItem = recommendationResults.topRecommendations[0];

  return (
    <div className="space-y-16 py-6 sm:py-10 font-sans" id="home-page">
      
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-emerald-950 via-emerald-900 to-emerald-950 text-white p-6 sm:p-12 lg:p-16 border border-emerald-800/80 shadow-xl">
        {/* Subtle decorative background pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none"></div>

        <div className="relative max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-800/80 border border-emerald-600/60 text-xs font-bold text-amber-300">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>{t('home.heroBadge', 'India’s 1st Market-Demand Driven Crop Selector')}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white font-heading leading-tight">
            {t('home.heroTitlePrefix', 'Stop Planting in the Dark.')} <br />
            <span className="text-amber-400">{t('home.heroTitleHighlight', 'Grow What the Market Needs.')}</span>
          </h1>

          <p className="text-sm sm:text-lg text-emerald-100/90 leading-relaxed max-w-2xl font-normal">
            {t('home.heroSubtitle', 'FarmPro combines real-time APMC mandi arrivals, wholesale buffer deficits, and 10-year historical price velocity with your local soil chemistry to maximize your farm profit.')}
          </p>

          {/* Action CTAs */}
          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
            <Link
              to="/recommendation"
              id="hero-get-recommendation-btn"
              className="py-3.5 px-6 rounded-xl bg-amber-400 hover:bg-amber-300 text-emerald-950 text-xs sm:text-sm font-extrabold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{t('home.ctaPrimary', 'Run Crop Recommendation')}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/market-insights"
              id="hero-explore-market-btn"
              className="py-3.5 px-6 rounded-xl bg-emerald-900/80 hover:bg-emerald-800 text-emerald-100 hover:text-white border border-emerald-700/80 text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2"
            >
              <BarChart3 className="w-4 h-4 text-emerald-400" />
              <span>{t('home.ctaSecondary', 'Explore Mandi Insights')}</span>
            </Link>
          </div>

          {/* Trust badges */}
          <div className="pt-4 flex flex-wrap items-center gap-4 text-[11px] text-emerald-300 border-t border-emerald-800/80">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
              {t('home.statMandis', '1,400+ APMC Mandis')}
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
              {t('home.statFarmers', '50,000+ Farmers')}
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
              {t('home.statAccuracy', '94.2% Predictive Score')}
            </span>
          </div>
        </div>
      </section>

      {/* 2. HOW FARMPRO WORKS */}
      <section className="space-y-6" id="how-it-works-section">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-[11px] uppercase font-bold text-emerald-700 tracking-wider">
            {t('home.step1Title', '1. Enter Farm Conditions')}
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-heading">
            {t('home.howItWorksTitle', 'How FarmPro Works in 3 Steps')}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            {t('home.featuresSubtitle', 'Traditional agronomy only looks at what CAN grow. FarmPro analyzes what WILL SELL at peak profit.')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm relative">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold text-sm mb-4 border border-emerald-100">
              01
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1">
              {t('home.step1Title', '1. Enter Farm Conditions')}
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              {t('home.step1Desc', 'Provide your location, soil type, land size, and available irrigation source.')}
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm relative">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-900 flex items-center justify-center font-bold text-sm mb-4 border border-amber-100">
              02
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1">
              {t('home.step2Title', '2. Market-First Computation')}
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              {t('home.step2Desc', 'Our algorithm cross-checks APMC mandi trends with agro-climatic parameters.')}
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm relative">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-900 flex items-center justify-center font-bold text-sm mb-4 border border-blue-100">
              03
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1">
              {t('home.step3Title', '3. Plant with Market Confidence')}
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              {t('home.step3Desc', 'Get ranked top crop recommendations, price projections, and day-by-day advisories.')}
            </p>
          </div>
        </div>
      </section>

      {/* 3. WHY MARKET-DRIVEN FARMING? (The Problem & Solution) */}
      <section className="bg-emerald-950 text-white rounded-3xl p-6 sm:p-10 border border-emerald-900" id="why-market-driven-section">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <span className="text-[11px] uppercase font-bold text-amber-400 tracking-wider">
              {t('home.featuresTitle', 'Why Market-First Agriculture Wins')}
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-heading">
              {t('home.featuresSubtitle', 'Traditional agronomy only looks at what CAN grow. FarmPro analyzes what WILL SELL at peak profit.')}
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100/80 leading-relaxed">
              {t('home.feature1Desc', 'Identifies wholesale buffer deficits to help you plant high-demand crops before harvest price gluts occur.')}
            </p>

            <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-emerald-900/60 border border-emerald-800">
                <span className="text-amber-400 font-bold text-xs block">{t('home.feature1Title', 'Mandi Supply Shortage Index')}</span>
                <p className="text-[11px] text-emerald-200 mt-1">
                  {t('home.feature1Desc', 'Identifies wholesale buffer deficits to help you plant high-demand crops before harvest price gluts occur.')}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-emerald-900/60 border border-emerald-800">
                <span className="text-amber-400 font-bold text-xs block">{t('home.feature2Title', '6-Factor Agronomic Matching')}</span>
                <p className="text-[11px] text-emerald-200 mt-1">
                  {t('home.feature2Desc', 'Calculates soil pH, NPK balance, irrigation capacity, seed costs, and climate vulnerability in real-time.')}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-emerald-900/40 border border-emerald-800/80 rounded-2xl p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-emerald-800/70 pb-3">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span>Real Season Case Study: Onion vs Soybean</span>
              </span>
              <span className="text-[10px] bg-rose-900/80 text-rose-200 px-2 py-0.5 rounded border border-rose-700">
                Glut Warning
              </span>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-800/60">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-rose-300">Onion (High Agronomic Suitability: 92%)</span>
                  <span className="text-[10px] text-rose-400 font-bold">+38% Mandi Surplus</span>
                </div>
                <p className="text-[11px] text-emerald-100/70">
                  Soil loves it, but massive over-planting will flood mandis. Projected price drop of -28% means negative net profit.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-800/60">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-emerald-300">Soybean (Agronomic Suitability: 94%)</span>
                  <span className="text-[10px] text-amber-300 font-bold">-18% Supply Deficit</span>
                </div>
                <p className="text-[11px] text-emerald-100/70">
                  Crushing plants running low on inventory. Projected price rise of +11.3% secures ₹36,000+ net profit/acre.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. KEY BENEFITS */}
      <section className="space-y-6" id="benefits-section">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-[11px] uppercase font-bold text-emerald-700 tracking-wider">
            {t('home.heroBadge', 'India’s 1st Market-Demand Driven Crop Selector')}
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-heading">
            {t('home.featuresTitle', 'Why Market-First Agriculture Wins')}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            {t('home.featuresSubtitle', 'Traditional agronomy only looks at what CAN grow. FarmPro analyzes what WILL SELL at peak profit.')}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Coins className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">
              {t('common.netProfit', 'Net Profit')} & ROI
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              {t('home.feature3Desc', 'Forecasts revenue, input costs, and net returns per acre based on verified wholesale mandi arrivals.')}
            </p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-2.5">
            <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-800 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">
              {t('market.shortageSurplus', 'Market Surplus (Glut Risk)')}
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              {t('home.feature1Desc', 'Identifies wholesale buffer deficits to help you plant high-demand crops before harvest price gluts occur.')}
            </p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">
              {t('home.feature2Title', '6-Factor Agronomic Matching')}
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              {t('home.feature2Desc', 'Calculates soil pH, NPK balance, irrigation capacity, seed costs, and climate vulnerability in real-time.')}
            </p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">
              {t('home.feature4Title', 'AI Agronomist Support')}
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              {t('home.feature4Desc', 'Consult Gemini-powered agricultural intelligence in your regional language 24/7.')}
            </p>
          </div>
        </div>
      </section>

      {/* 5. SUPPORTED LANGUAGES SECTION */}
      <section className="bg-slate-900 text-white rounded-3xl p-6 sm:p-10 border border-slate-800" id="supported-languages-section">
        <div className="text-center max-w-xl mx-auto space-y-2 mb-8">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-2">
            <Globe2 className="w-5 h-5" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-heading">
            English • हिन्दी • मराठी
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Accessible technology for every farmer across India’s major agro-climatic zones.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-3xl mx-auto">
          {SUPPORTED_LANGUAGES.map((lang) => (
            <div
              key={lang.code}
              className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/60 text-center hover:border-emerald-500 transition"
            >
              <span className="text-base font-bold text-amber-400 block font-heading">
                {lang.native}
              </span>
              <span className="text-[11px] text-slate-400 block mt-0.5">
                {lang.name}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* 6. FARMER-FRIENDLY DASHBOARD PREVIEW */}
      <section className="space-y-6" id="dashboard-preview-section">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <span className="text-[11px] uppercase font-bold text-emerald-700 tracking-wider">
              {t('dashboard.activeProfile', 'Active Farm Profile')}
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-heading mt-1">
              {t('dashboard.overviewTitle', 'Farmer Command Dashboard')}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              {t('dashboard.overviewSubtitle', 'Monitor crop market forecasts, local weather alerts, and historical performance.')}
            </p>
          </div>

          <Link
            to="/recommendation"
            className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 hover:text-emerald-950"
          >
            <span>{t('dashboard.quickActionRecommendation', 'New Recommendation')}</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {topCropItem && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <CropCard item={topCropItem} rank={1} />
            </div>
            <div>
              <WeatherCard />
            </div>
          </div>
        )}
      </section>

      {/* FINAL BOTTOM CTA */}
      <section className="rounded-3xl bg-amber-400 text-emerald-950 p-8 sm:p-12 text-center space-y-4 shadow-lg">
        <h2 className="text-2xl sm:text-4xl font-extrabold font-heading">
          {t('home.heroTitleHighlight', 'Grow What the Market Needs.')}
        </h2>
        <p className="text-xs sm:text-sm max-w-xl mx-auto font-medium text-emerald-900 leading-relaxed">
          {t('home.heroSubtitle', 'FarmPro combines real-time APMC mandi arrivals, wholesale buffer deficits, and 10-year historical price velocity with your local soil chemistry to maximize your farm profit.')}
        </p>
        <div className="pt-2">
          <Link
            to="/recommendation"
            className="inline-flex items-center gap-2 py-3.5 px-8 rounded-xl bg-emerald-950 hover:bg-emerald-900 text-white font-bold text-sm shadow-xl transition cursor-pointer"
          >
            <span>{t('home.ctaPrimary', 'Run Crop Recommendation')}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

    </div>
  );
}

