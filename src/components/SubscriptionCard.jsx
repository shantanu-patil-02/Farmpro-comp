import React from 'react';
import { Check, Sparkles, ArrowRight, Zap, ShieldCheck } from 'lucide-react';

export default function SubscriptionCard({
  planName = 'FarmPro Intermediate',
  planTier = 'INTERMEDIATE',
  price = '₹399',
  period = '/month',
  description = 'Ideal for progressive farmers seeking maximum harvest profitability',
  features = [],
  isPopular = false,
  isCurrent = false,
  onSelectPlan
}) {
  return (
    <div 
      className={`rounded-2xl p-6 flex flex-col justify-between transition-all relative ${
        isPopular 
          ? 'bg-white border-2 border-emerald-600 shadow-lg ring-4 ring-emerald-50' 
          : 'bg-white border border-slate-200 shadow-sm hover:shadow-md'
      }`}
      id={`plan-${planTier.toLowerCase()}`}
    >
      {isPopular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-extrabold text-[10px] uppercase tracking-wider px-3.5 py-1 rounded-full shadow-sm flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-slate-950" />
          <span>Most Popular Plan</span>
        </div>
      )}

      <div>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-extrabold text-emerald-800 uppercase tracking-wider block">
              {planTier} TIER
            </span>
            <h3 className="text-lg font-bold text-slate-900 font-heading">
              {planName}
            </h3>
          </div>
          {isCurrent && (
            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
              <Check className="w-3 h-3 text-emerald-700" />
              <span>Active</span>
            </span>
          )}
        </div>

        <p className="text-xs text-slate-500 mt-2 min-h-[32px] leading-relaxed">
          {description}
        </p>

        {/* Pricing */}
        <div className="mt-4 pb-4 border-b border-slate-100 flex items-baseline gap-1">
          <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-heading">
            {price}
          </span>
          <span className="text-xs text-slate-500 font-medium">{period}</span>
        </div>

        {/* Feature List */}
        <div className="mt-5 space-y-2.5">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
            Included Capabilities
          </span>
          <ul className="space-y-2 text-xs">
            {features.map((feature, idx) => (
              <li key={idx} className="flex items-start gap-2 text-slate-700">
                <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </div>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* CTA Button */}
      <div className="mt-6 pt-4 border-t border-slate-100">
        <button
          type="button"
          onClick={onSelectPlan}
          className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
            isCurrent
              ? 'bg-slate-100 text-slate-500 cursor-default'
              : isPopular
                ? 'bg-emerald-800 hover:bg-emerald-900 text-white shadow-sm hover:shadow'
                : 'bg-slate-900 hover:bg-slate-800 text-white'
          }`}
          disabled={isCurrent}
        >
          <span>{isCurrent ? 'Current Active Plan' : `Activate ${planTier}`}</span>
          {!isCurrent && <ArrowRight className="w-3.5 h-3.5" />}
        </button>
      </div>
    </div>
  );
}

