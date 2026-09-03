import React from 'react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ReferenceLine 
} from 'recharts';
import { BarChart3 } from 'lucide-react';

export default function MarketChart({ 
  crops = [], 
  type = 'shortage', // 'shortage' | 'priceGrowth' | 'revenue'
  height = 250,
  title
}) {
  const chartData = crops.map(item => {
    const crop = item.crop || item;
    const current = crop.currentPrice || 0;
    const expected = crop.expectedPrice || 0;
    const growthPercent = current > 0 ? Math.round(((expected - current) / current) * 100) : 0;
    const deficit = crop.deficitPercentage || 0;

    return {
      name: crop.name?.split(' ')[0] || 'Crop',
      fullName: crop.name,
      'Current Price (₹)': current,
      'Expected Price (₹)': expected,
      'Price Growth (%)': growthPercent,
      'Stock Shortage (%)': Math.abs(deficit),
      'Deficit Balance': deficit,
      'Mandi Stock (k Tonnes)': Math.round((crop.currentStockTonnes || 10000) / 1000),
      'Normal Buffer (k Tonnes)': Math.round((crop.normalStockTonnes || 15000) / 1000)
    };
  });

  return (
    <div className="w-full font-sans" id="market-chart-component">
      {title && (
        <div className="mb-2">
          <h4 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1.5">
            <BarChart3 className="w-3.5 h-3.5 text-emerald-600" />
            <span>{title}</span>
          </h4>
        </div>
      )}

      <div style={{ height: `${height}px`, width: '100%' }}>
        <ResponsiveContainer width="100%" height="100%">
          {type === 'shortage' ? (
            <BarChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 10 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 10 }} tickFormatter={(v) => `${v}k T`} />
              <Tooltip 
                formatter={(val) => [`${val}k Tonnes`, '']}
                contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', borderColor: '#e2e8f0', fontSize: '11px' }}
              />
              <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '4px' }} />
              <Bar dataKey="Mandi Stock (k Tonnes)" fill="#f97316" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Normal Buffer (k Tonnes)" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          ) : (
            <BarChart data={chartData} margin={{ top: 10, right: 20, left: 5, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 10 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 10 }} tickFormatter={(v) => `₹${(v/1000).toFixed(0)}k`} />
              <Tooltip 
                formatter={(val) => [`₹${val.toLocaleString('en-IN')}`, '']}
                contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', borderColor: '#e2e8f0', fontSize: '11px' }}
              />
              <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '4px' }} />
              <Bar dataKey="Current Price (₹)" fill="#94a3b8" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Expected Price (₹)" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}
