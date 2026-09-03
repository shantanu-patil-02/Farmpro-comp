import React, { useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle2, 
  Search, 
  Filter, 
  ArrowUpRight, 
  ArrowDownRight,
  ShieldCheck,
  ChevronRight,
  Layers
} from 'lucide-react';
import { CROPS_DATABASE } from '../data/cropDatabase.js';
import { useFarm } from '../context/FarmContext.jsx';
import DataSourceBadge from './DataSourceBadge.jsx';

export default function MarketIntelligenceView({ onSelectCropFromMarket }) {
  const { dataSource } = useFarm();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Oilseed', 'Pulse', 'Cereal', 'Cash Crop', 'Vegetable'];

  const filteredCrops = CROPS_DATABASE.filter(crop => {
    const matchesSearch = crop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          crop.localName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'All' || crop.category.toLowerCase().includes(selectedCategory.toLowerCase());
    return matchesSearch && matchesCat;
  });

  // Shortage commodities (opportunity)
  const topOpportunities = [...CROPS_DATABASE]
    .sort((a, b) => a.deficitPercentage - b.deficitPercentage)
    .slice(0, 3);

  // Glut/surplus warning crops
  const glutWarnings = [...CROPS_DATABASE]
    .sort((a, b) => b.deficitPercentage - a.deficitPercentage)
    .filter(c => c.deficitPercentage > 0)
    .slice(0, 2);

  return (
    <div className="space-y-4">
      {/* Top Banner: Market Philosophy Explanation - High Density Slate Dark Style */}
      <div className="bg-slate-900 text-white rounded-xl p-4 sm:p-5 shadow-sm border border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-widest mb-1.5 border border-emerald-500/30">
              <TrendingUp className="w-3 h-3" />
              <span>Market-Driven Intelligence Core</span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold tracking-tight">
              Mandi Deficit & Supply-Demand Tracker
            </h2>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              Conventional agronomy only checks if a crop will germinate. FarmPro analyzes regional wholesale mandi supply deficits, buffer stocks, and wholesale price momentum so farmers don't sow into harvest gluts.
            </p>
          </div>

          <div className="shrink-0 bg-slate-800/80 p-3 rounded-lg border border-slate-700/60">
            <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Data Source Status
            </div>
            <DataSourceBadge dataSource={dataSource} size="sm" showExplanation={false} />
          </div>
        </div>
      </div>

      {/* Opportunity vs Glut Flashcards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* High Opportunity Flashcard */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-2.5 pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <h3 className="text-xs sm:text-sm font-bold text-slate-900">
                Top Supply Deficits (High Farmer Opportunity)
              </h3>
            </div>
            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              High Pricing Power
            </span>
          </div>

          <div className="space-y-2">
            {topOpportunities.map(crop => (
              <div 
                key={crop.id}
                onClick={() => onSelectCropFromMarket(crop.id)}
                className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 hover:bg-emerald-50/70 transition cursor-pointer border border-slate-100"
              >
                <div>
                  <span className="text-xs font-bold text-slate-900 block">{crop.name}</span>
                  <span className="text-[10px] text-slate-500">{crop.category} • {crop.sowingWindow}</span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-emerald-700 block">
                    {crop.supplyStatus}
                  </span>
                  <span className="text-[10px] text-slate-600 font-semibold">
                    Exp: ₹{crop.expectedPrice.toLocaleString('en-IN')}/qtl
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Glut / Over-Supply Warnings */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-2.5 pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              <h3 className="text-xs sm:text-sm font-bold text-slate-900">
                Market Glut & Arrival Risk Warnings
              </h3>
            </div>
            <span className="text-[10px] font-bold text-rose-800 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
              Downside Risk
            </span>
          </div>

          <div className="space-y-2">
            {glutWarnings.map(crop => (
              <div 
                key={crop.id}
                onClick={() => onSelectCropFromMarket(crop.id)}
                className="p-2.5 rounded-lg bg-amber-50/50 hover:bg-amber-100/60 transition cursor-pointer border border-amber-200/60"
              >
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-xs font-bold text-rose-950">{crop.name}</span>
                  <span className="text-xs font-bold text-rose-700">{crop.supplyStatus}</span>
                </div>
                <p className="text-[11px] text-amber-900/80 leading-tight">
                  {crop.marketInsights}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Mandi Price Table with Filters */}
      <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200 shadow-sm">
        {/* Table Filter Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          {/* Search */}
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search crop or Hindi name..."
              className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`text-xs px-2.5 py-1 rounded-md font-semibold transition ${
                  selectedCategory === cat
                    ? 'bg-emerald-700 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto mt-3">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                <th className="py-2.5 px-3">Crop / Commodity</th>
                <th className="py-2.5 px-3">Current Mandi Price</th>
                <th className="py-2.5 px-3">Projected Harvest Price</th>
                <th className="py-2.5 px-3">Govt MSP</th>
                <th className="py-2.5 px-3">Supply Balance</th>
                <th className="py-2.5 px-3">Market Demand</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredCrops.map((crop) => {
                const priceDiff = crop.expectedPrice - crop.currentPrice;
                const percentDiff = Math.round((priceDiff / crop.currentPrice) * 100);

                return (
                  <tr 
                    key={crop.id}
                    className="hover:bg-slate-50 transition cursor-pointer"
                    onClick={() => onSelectCropFromMarket(crop.id)}
                  >
                    <td className="py-2.5 px-3">
                      <div className="font-bold text-slate-900">{crop.name}</div>
                      <div className="text-[11px] text-slate-500">{crop.localName} • {crop.category}</div>
                    </td>
                    
                    <td className="py-2.5 px-3 font-semibold text-slate-800">
                      ₹{crop.currentPrice.toLocaleString('en-IN')}/qtl
                    </td>

                    <td className="py-2.5 px-3">
                      <div className="font-bold text-slate-900">
                        ₹{crop.expectedPrice.toLocaleString('en-IN')}/qtl
                      </div>
                      <div className={`text-[11px] font-bold flex items-center ${
                        percentDiff >= 0 ? 'text-emerald-700' : 'text-rose-700'
                      }`}>
                        {percentDiff >= 0 ? <ArrowUpRight className="w-3 h-3 mr-0.5" /> : <ArrowDownRight className="w-3 h-3 mr-0.5" />}
                        {percentDiff >= 0 ? `+${percentDiff}%` : `${percentDiff}%`}
                      </div>
                    </td>

                    <td className="py-2.5 px-3 text-slate-600 font-medium">
                      {crop.msp > 0 ? `₹${crop.msp.toLocaleString('en-IN')}/qtl` : 'Free Market'}
                    </td>

                    <td className="py-2.5 px-3">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        crop.deficitPercentage < -10 
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                          : crop.deficitPercentage > 15 
                          ? 'bg-rose-100 text-rose-800 border border-rose-200' 
                          : 'bg-slate-100 text-slate-700 border border-slate-200'
                      }`}>
                        {crop.supplyStatus}
                      </span>
                    </td>

                    <td className="py-2.5 px-3 font-semibold text-slate-800">
                      {crop.marketDemand}
                    </td>

                    <td className="py-2.5 px-3 text-right">
                      <span className="inline-flex items-center text-xs font-bold text-emerald-700 hover:text-emerald-900">
                        <span>Details</span>
                        <ChevronRight className="w-3 h-3 ml-0.5" />
                      </span>
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
