import React from 'react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ReferenceLine 
} from 'recharts';
import { TrendingUp, Award } from 'lucide-react';

export default function PriceChart({ 
  historicalPrices = [], 
  msp = 0, 
  cropName = 'Crop', 
  height = 240,
  showTitle = true 
}) {
  if (!historicalPrices || historicalPrices.length === 0) {
    return (
      <div className="h-48 flex items-center justify-center text-slate-400 text-xs">
        No price trajectory data available
      </div>
    );
  }

  return (
    <div className="w-full font-sans" id="price-chart-component">
      {showTitle && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
              <span>{cropName} Mandi Rate Forecast (₹/Quintal)</span>
            </h4>
            <p className="text-[11px] text-slate-500">
              6-Month historical modal prices vs harvest realization
            </p>
          </div>

          <div className="flex items-center gap-3 text-[11px]">
            <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
              <span>Projected Rate</span>
            </span>
            {msp > 0 && (
              <span className="inline-flex items-center gap-1 text-amber-700 font-semibold">
                <span className="w-2.5 h-0.5 bg-amber-500 inline-block border-t border-dashed"></span>
                <span>MSP Floor</span>
              </span>
            )}
          </div>
        </div>
      )}

      <div style={{ height: `${height}px`, width: '100%' }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={historicalPrices} margin={{ top: 10, right: 20, left: 5, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis dataKey="month" stroke="#64748b" tick={{ fontSize: 10 }} />
            <YAxis stroke="#64748b" tick={{ fontSize: 10 }} domain={['auto', 'auto']} tickFormatter={(v) => `₹${v}`} />
            <Tooltip 
              formatter={(val) => [`₹${val.toLocaleString('en-IN')}/qtl`, 'Rate']}
              contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', borderColor: '#e2e8f0', fontSize: '11px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
            {msp > 0 && (
              <ReferenceLine 
                y={msp} 
                stroke="#d97706" 
                strokeDasharray="4 4" 
                label={{ value: `MSP ₹${msp}`, fill: '#b45309', fontSize: 9, position: 'insideTopLeft' }} 
              />
            )}
            <Line 
              type="monotone" 
              dataKey="price" 
              stroke="#10b981" 
              strokeWidth={2.5} 
              dot={{ r: 3.5, fill: '#10b981', strokeWidth: 1.5, stroke: '#ffffff' }} 
              activeDot={{ r: 5, fill: '#059669' }} 
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
