import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sprout, HelpCircle, CheckCircle2, AlertCircle, ShieldAlert } from 'lucide-react';
import RecommendationForm from '../components/RecommendationForm.jsx';
import WeatherCard from '../components/WeatherCard.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import { useFarm } from '../context/FarmContext.jsx';

export default function Recommendation() {
  const { isGenerating } = useFarm();
  const navigate = useNavigate();

  return (
    <div className="space-y-8 py-6 max-w-5xl mx-auto font-sans" id="recommendation-page">
      {/* Page Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 uppercase tracking-wider">
          <Sprout className="w-4 h-4 text-emerald-700" />
          <span>Precision Farm Advisor</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">
          Get Your Market-Driven Crop Recommendation
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed">
          FarmPro doesn't just evaluate whether a crop can physically survive in your soil. We analyze 12+ APMC mandi buffer stocks, projected harvest prices, and regional supply deficits so you harvest crops that command premium rates.
        </p>
      </div>

      {isGenerating ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-12">
          <LoadingSpinner 
            message="Evaluating Soil NPK & Mandi Shortage Indexes..."
            submessage="Cross-referencing your soil type and water availability with projected harvest realizations"
          />
        </div>
      ) : (
        <div className="space-y-8">
          {/* Main 11-Field Form */}
          <RecommendationForm onSubmitSuccess={() => navigate('/results')} />

          {/* Context & Agronomic Tips Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <WeatherCard />

            <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-3">
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-emerald-700" />
                <span>Tips for Accurate Recommendations</span>
              </h4>
              <ul className="space-y-2 text-xs text-slate-600">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Soil Sampling:</strong> If test report is not handy, select your default regional soil type (e.g. Black Soil for Vidarbha/Malwa).</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Water Realism:</strong> Pick 'Low' if dependent solely on monsoon rains to prevent recommendations of water-exhaustive crops.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Farming Objective:</strong> Choose 'Low Risk' to enforce strict MSP protection floors or 'Maximum Profit' for high-upside pulses/spices.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
