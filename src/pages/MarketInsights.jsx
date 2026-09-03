import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  Search, 
  Filter, 
  ArrowUpRight, 
  Layers, 
  Info,
  ShieldCheck,
  Building2,
  Package,
  MapPin
} from 'lucide-react';
import { useFarm } from '../context/FarmContext.jsx';
import { useTranslation } from '../i18n/index.jsx';
import { marketAPI } from '../services/apiClient.js';
import MarketChart from '../components/MarketChart.jsx';
import DataSourceBadge from '../components/DataSourceBadge.jsx';

export default function MarketInsights() {
  const { cropsDatabase, dataSource: contextDataSource } = useFarm();
  const { t } = useTranslation();
  const [marketItems, setMarketItems] = useState([]);
  const [marketSummary, setMarketSummary] = useState(null);
  const [marketDataSource, setMarketDataSource] = useState(contextDataSource || 'Demo Market Data');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [chartView, setChartView] = useState('shortage'); // 'shortage' | 'price'

  const categories = ['All', 'Oilseed', 'Pulse', 'Cash Crop', 'Cereal', 'Spice', 'Vegetable'];

  useEffect(() => {
    let isMounted = true;
    async function loadMarket() {
      setIsLoading(true);
      try {
        const res = await marketAPI.getMarket({ category: selectedCategory === 'All' ? undefined : selectedCategory });
        if (isMounted && res && res.data) {
          setMarketItems(res.data);
          if (res.summary) setMarketSummary(res.summary);
          if (res.dataSource) setMarketDataSource(res.dataSource);
        }
      } catch (err) {
        console.warn('Market fetch notice, using fallback dataset:', err.message);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadMarket();
    return () => { isMounted = false; };
  }, [selectedCategory]);

  const activeCrops = marketItems.length > 0 ? marketItems : cropsDatabase;

  const filteredCrops = activeCrops.filter(crop => {
    const matchesCategory = selectedCategory === 'All' || crop.category?.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch = crop.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          crop.localName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          crop.primaryMandi?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-8 py-6 max-w-7xl mx-auto font-sans" id="market-insights-page">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 uppercase tracking-wider">
            <Building2 className="w-4 h-4 text-emerald-700" />
            <span>APMC Mandi Intelligence Hub</span>
          </div>
          <div className="flex flex-wrap items-center gap-3 mt-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">
              {t('marketInsights.title', 'Mandi Prices & Supply Shortage Indexes')}
            </h1>
            <DataSourceBadge dataSource={marketDataSource} type="market" size="sm" showExplanation={false} />
          </div>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            {t('marketInsights.subtitle', 'Real-time wholesale market intelligence across APMC mandis')}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/recommendation"
            className="px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold shadow-sm transition"
          >
            {t('dashboard.newRecommendation', 'Apply to My Farm')}
          </Link>
        </div>
      </div>

      {/* Market Intelligence Bulletins / Mandi Ticker */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-emerald-950">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-700" />
            <span>Soybean & Mustard Crushing Rally</span>
          </div>
          <p className="text-emerald-900 leading-relaxed text-[11px]">
            Domestic edible oil shortfall ensures solvent extraction plants maintain aggressive bids across central Indian APMCs.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-rose-950">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-700" />
            <span>Perishable Vegetable Glut Alert</span>
          </div>
          <p className="text-rose-900 leading-relaxed text-[11px]">
            Arrivals across Lasalgaon and Pimpalgaon projected to exceed seasonal absorption by 35%, exerting heavy downward pressure on spot rates.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-amber-950">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-800" />
            <span>Pulses MSP Buffer Procurement</span>
          </div>
          <p className="text-amber-900 leading-relaxed text-[11px]">
            Government buffer procurement active for Chickpea (Chana) and Moong; minimum support prices guaranteed at APMC gates.
          </p>
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900 font-heading">
              {chartView === 'shortage' ? 'Mandi Stock Buffer vs Normal (k Tonnes)' : 'Current vs Harvest Price Realization (₹/qtl)'}
            </h3>
            <p className="text-xs text-slate-500">
              Visualizing wholesale supply gaps and expected price momentum across commodities
            </p>
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg self-start sm:self-center">
            <button
              type="button"
              onClick={() => setChartView('shortage')}
              className={`px-3 py-1 text-xs font-bold rounded-md transition ${chartView === 'shortage' ? 'bg-white text-emerald-800 shadow-2xs' : 'text-slate-600'}`}
            >
              Shortage / Surplus
            </button>
            <button
              type="button"
              onClick={() => setChartView('price')}
              className={`px-3 py-1 text-xs font-bold rounded-md transition ${chartView === 'price' ? 'bg-white text-emerald-800 shadow-2xs' : 'text-slate-600'}`}
            >
              Price Trajectory
            </button>
          </div>
        </div>

        <MarketChart 
          crops={activeCrops}
          type={chartView}
          height={260}
        />
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={t('common.search', 'Search crop or APMC mandi...')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
          />
        </div>
      </div>

      {/* Commodities Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                <th className="py-3 px-4">Commodity</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">{t('cropCard.currentPrice', 'Current Modal Price')}</th>
                <th className="py-3 px-4">{t('cropCard.expectedPrice', 'Projected Harvest')}</th>
                <th className="py-3 px-4">Expected Growth</th>
                <th className="py-3 px-4">Daily Arrivals</th>
                <th className="py-3 px-4">{t('cropCard.stockShortage', 'Supply Balance')}</th>
                <th className="py-3 px-4">Primary Mandi</th>
                <th className="py-3 px-4 text-right">{t('common.actions', 'Action')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filteredCrops.map((crop) => {
                const growth = Math.round(((crop.expectedPrice - crop.currentPrice) / crop.currentPrice) * 100);
                const isPositive = growth >= 0;
                const arrivals = crop.marketArrivals ? `${crop.marketArrivals.toLocaleString('en-IN')} Qtl` : 'Active';

                return (
                  <tr key={crop.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3 px-4">
                      <div>
                        <strong className="text-slate-900 block">{crop.name}</strong>
                        <span className="text-[10px] text-slate-400">{crop.localName}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 capitalize">{crop.category}</td>
                    <td className="py-3 px-4 font-bold text-slate-900">₹{crop.currentPrice.toLocaleString('en-IN')}/qtl</td>
                    <td className="py-3 px-4 font-bold text-emerald-800">₹{crop.expectedPrice.toLocaleString('en-IN')}/qtl</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center gap-0.5 font-bold ${isPositive ? 'text-emerald-700' : 'text-rose-600'}`}>
                        {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        <span>{isPositive ? `+${growth}%` : `${growth}%`}</span>
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600 font-semibold">
                      {arrivals}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        (crop.deficitPercentage || 0) < 0
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-rose-50 text-rose-800 border border-rose-200'
                      }`}>
                        {crop.shortageStatus || crop.supplyStatus || ((crop.deficitPercentage || 0) < 0 ? 'Deficit' : 'Surplus')}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      <div className="flex items-center gap-1 text-[11px]">
                        <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                        <span>{crop.primaryMandi || 'Nagpur APMC'}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Link
                        to={`/crop/${crop.id}`}
                        className="inline-flex items-center gap-1 text-emerald-800 hover:text-emerald-950 font-bold hover:underline"
                      >
                        <span>{t('cropCard.viewAnalysis', 'Details')}</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
