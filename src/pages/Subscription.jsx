import React, { useState } from 'react';
import { ShieldCheck, Sparkles, CheckCircle2, Info, Zap, Award, Compass, ArrowRight } from 'lucide-react';
import SubscriptionCard from '../components/SubscriptionCard.jsx';
import { useFarm } from '../context/FarmContext.jsx';
import { useTranslation } from '../i18n/index.jsx';

export default function Subscription() {
  const { user, subscriptionPlan, updateSubscriptionPlan, freeRecommendationsUsed, freeRecommendationsAllowed, isPaidPlan } = useFarm();
  const { t } = useTranslation();
  const [selectedPlanMessage, setSelectedPlanMessage] = useState('');
  const [billingCycle, setBillingCycle] = useState('monthly'); // 'monthly' | 'yearly'

  const currentPlanNormalized = (subscriptionPlan || user?.subscriptionPlan || 'FREE').toUpperCase();

  const plans = [
    {
      id: 'BASIC',
      planName: 'BASIC',
      displayName: 'Kisan Basic',
      price: billingCycle === 'monthly' ? '₹99' : '₹1,100',
      period: billingCycle === 'monthly' ? '/month' : '/year (Save ₹88)',
      description: 'Essential seasonal crop intelligence and regional mandi price forecasts for smallholders.',
      features: [
        'Up to 5 full crop recommendations per season',
        'APMC Mandi price forecast & modal averages',
        '6-Factor agronomic soil suitability engine',
        
      ],
      isPopular: false,
      isCurrent: currentPlanNormalized === 'BASIC'
    },
    {
      id: 'INTERMEDIATE',
      planName: 'INTERMEDIATE',
      displayName: 'FarmPro Intermediate',
      price: billingCycle === 'monthly' ? '₹199' : '₹2200',
      period: billingCycle === 'monthly' ? '/month' : '/year (Save ₹200)',
      description: 'Most popular choice for commercial farmers seeking maximum ROI and supply shortage alerts.',
      features: [
        '10 seasonal crop audits & recommendations',
        'Live Mandi supply shortage & deficit indexes',
        'AI Kisan Advisor (Gemini 3.7) 24/7 assistant',
        'Detailed Farm Profit & Cost-of-Cultivation simulator',
        
      ],
      isPopular: true,
      isCurrent: currentPlanNormalized === 'INTERMEDIATE' || currentPlanNormalized === 'PRO'
    },
    {
      id: 'ADVANCE',
      planName: 'ADVANCE',
      displayName: 'FPO & Enterprise Advance',
      price: billingCycle === 'monthly' ? '₹599' : '₹5,999',
      period: billingCycle === 'monthly' ? '/month' : '/year (Save ₹1,189)',
      description: 'Comprehensive agri-intelligence suite for large landholders, FPOs, and custom soil labs.',
      features: [
        '15 seasonal crop audits & recommendations',
        'All Intermediate features with priority AI compute',
        'Multi-farm management up to 500 acres',
        'Dedicated agronomist phone helpline support'
      ],
      isPopular: false,
      isCurrent: currentPlanNormalized === 'ADVANCE' || currentPlanNormalized === 'ENTERPRISE'
    }
  ];

  const handleSelectPlan = async (planId, planDisplayName) => {
    await updateSubscriptionPlan(planId);
    setSelectedPlanMessage(`Demo subscription activated: ${planDisplayName} (${planId}). Demo subscription — payment integration can be added later.`);
    setTimeout(() => setSelectedPlanMessage(''), 6000);
  };

  return (
    <div className="space-y-10 py-6 max-w-6xl mx-auto font-sans" id="subscription-page">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-3.5 py-1 rounded-full text-xs font-bold text-emerald-800">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>Transparent AgriTech Pricing</span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 font-heading">
          {t('subscription.title', 'Invest in Smarter Sowing. Reap Higher Profits.')}
        </h1>
        
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl mx-auto">
          {t('subscription.subtitle', 'First 3 recommendations are FREE. Unlock unlimited AI dual-engine recommendations and APMC mandi shortage forecasts.')}
        </p>

        {/* Free Recommendations Usage Banner */}
        <div className="mt-4 p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 text-left">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-900">
                  {isPaidPlan ? `${currentPlanNormalized} Plan Active` : 'Free Tier Audit Quota'}
                </span>
                <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                  isPaidPlan 
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                    : freeRecommendationsUsed >= 3 
                      ? 'bg-red-100 text-red-800 border border-red-200'
                      : 'bg-amber-100 text-amber-800 border border-amber-200'
                }`}>
                  {isPaidPlan ? 'Unlimited Audits' : `${freeRecommendationsUsed} of ${freeRecommendationsAllowed} Free Audits Used`}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {isPaidPlan 
                  ? 'Your account has full access to 6-factor recommendations, mandi alerts, and AI advisor.'
                  : freeRecommendationsUsed < 3 
                    ? `You have ${3 - freeRecommendationsUsed} free recommendation audit remaining before upgrading.`
                    : 'You have used all 3 free audits. Choose a plan below to continue.'}
              </p>
            </div>
          </div>

          <div className="w-full sm:w-48 bg-slate-100 h-2.5 rounded-full overflow-hidden shrink-0 border border-slate-200">
            <div 
              className={`h-full transition-all duration-500 ${isPaidPlan ? 'bg-emerald-600 w-full' : freeRecommendationsUsed >= 3 ? 'bg-red-500 w-full' : 'bg-amber-500'}`}
              style={{ width: isPaidPlan ? '100%' : `${Math.min(100, (freeRecommendationsUsed / 3) * 100)}%` }}
            />
          </div>
        </div>

        {/* Demo Subscription Notice */}
        <div className="p-3.5 bg-blue-50 text-blue-900 rounded-xl text-xs font-semibold border border-blue-200 flex items-center justify-center gap-2">
          <Info className="w-4 h-4 text-blue-700 shrink-0" />
          <span>Demo subscription — payment integration can be added later.</span>
        </div>

        {selectedPlanMessage && (
          <div className="p-3 bg-emerald-100 text-emerald-900 rounded-xl text-xs font-bold border border-emerald-300 flex items-center justify-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>{selectedPlanMessage}</span>
          </div>
        )}

        {/* Billing Cycle Toggle */}
        <div className="pt-2 flex items-center justify-center gap-3">
          <span className={`text-xs font-bold cursor-pointer ${billingCycle === 'monthly' ? 'text-slate-900' : 'text-slate-400'}`} onClick={() => setBillingCycle('monthly')}>
            Monthly Billing
          </span>
          <button
            type="button"
            onClick={() => setBillingCycle(prev => prev === 'monthly' ? 'yearly' : 'monthly')}
            className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${billingCycle === 'yearly' ? 'bg-emerald-800' : 'bg-slate-300'}`}
          >
            <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${billingCycle === 'yearly' ? 'translate-x-6' : 'translate-x-0'}`} />
          </button>
          <span className={`text-xs font-bold cursor-pointer flex items-center gap-1.5 ${billingCycle === 'yearly' ? 'text-emerald-800' : 'text-slate-400'}`} onClick={() => setBillingCycle('yearly')}>
            <span>Annual Billing</span>
            
          </span>
        </div>
      </div>

      {/* 3 Pricing Cards Grid: BASIC, INTERMEDIATE, ADVANCE */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
        {plans.map((plan) => (
          <SubscriptionCard
            key={plan.id}
            planName={plan.displayName}
            planTier={plan.id}
            price={plan.price}
            period={plan.period}
            description={plan.description}
            features={plan.features}
            isPopular={plan.isPopular}
            isCurrent={plan.isCurrent}
            onSelectPlan={() => handleSelectPlan(plan.id, plan.displayName)}
          />
        ))}
      </div>

      {/* Trust & Guarantee Section */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 font-heading">
              Kisan-First Guarantee & Flexible Payments
            </h3>
            <p className="text-xs text-slate-500">
              Demo subscription mode is currently active. Real payment gateway (UPI / RuPay / Netbanking) integration can be connected seamlessly.
            </p>
          </div>
        </div>

        {/* FAQs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-4 border-t border-slate-100 text-xs">
          <div>
            <h4 className="font-bold text-slate-800 mb-1">
              How many free recommendations do I get?
            </h4>
            <p className="text-slate-600 leading-relaxed">
              Every farmer receives 3 full 6-factor crop recommendations completely FREE with no credit card or payment required.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-slate-800 mb-1">
              What are the available plans?
            </h4>
            <p className="text-slate-600 leading-relaxed">
              FarmPro offers three plans: <strong>BASIC</strong> (for smallholders), <strong>INTERMEDIATE</strong> (for commercial farming with Mandi shortage alerts & AI chat), and <strong>ADVANCE</strong> (for FPOs and large farms).
            </p>
          </div>

          <div>
            <h4 className="font-bold text-slate-800 mb-1">
              Can I switch or cancel plans anytime?
            </h4>
            <p className="text-slate-600 leading-relaxed">
              Yes, you can upgrade, downgrade, or switch between plans at any time with zero lock-in or cancellation penalties.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-slate-800 mb-1">
              How do I test premium features right now?
            </h4>
            <p className="text-slate-600 leading-relaxed">
              Simply click <strong>Choose BASIC, INTERMEDIATE, or ADVANCE</strong> above. The demo subscription will immediately activate for your session.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}

