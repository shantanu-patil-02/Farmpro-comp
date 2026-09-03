import React from 'react';
import { MessageSquare, Star, Heart, CheckCircle2 } from 'lucide-react';
import FeedbackForm from '../components/FeedbackForm.jsx';
import { useTranslation } from '../i18n/index.jsx';

export default function Feedback() {
  const { t } = useTranslation();

  const testimonials = [
    {
      name: 'Balwinder Singh',
      district: 'Bathinda, Punjab',
      crop: 'Mustard (Sarson)',
      text: 'Last season FarmPro warned us about excess wheat planting and suggested Mustard due to edible oil deficits. We made ₹5,800/qtl at early harvest!',
      rating: 5
    },
    {
      name: 'Santosh Deshmukh',
      district: 'Amravati, Maharashtra',
      crop: 'Soybean',
      text: 'The NPK recommendations for black soil were spot on. Coupled with good mandi timing, our input costs dropped 18% and yield was 9.5 qtl/acre.',
      rating: 5
    },
    {
      name: 'Venkata Rao',
      district: 'Warangal, Telangana',
      crop: 'Turmeric',
      text: 'The stock shortage indicator for turmeric in Nizamabad mandi helped our FPO hold produce for 3 weeks and capture peak wholesale price.',
      rating: 5
    }
  ];

  return (
    <div className="space-y-10 py-6 max-w-4xl mx-auto font-sans" id="feedback-page">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          {t('feedback.title', 'Farmer Voice & Field Data')}
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">
          {t('feedback.title', 'Help Us Calibrate Mandi & Crop Realities')}
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          {t('feedback.subtitle', 'Every field is unique. Your feedback directly trains our algorithmic crop feasibility and mandi price forecast engine.')}
        </p>
      </div>

      {/* Main Feedback Form Component */}
      <FeedbackForm />

      {/* Recent Farmer Field Reviews */}
      <div className="space-y-4 pt-4 border-t border-slate-200">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-slate-500">
          What Fellow Farmers Say
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {testimonials.map((tItem, idx) => (
            <div key={idx} className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs space-y-2">
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(tItem.rating)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-xs text-slate-600 leading-relaxed italic">
                "{tItem.text}"
              </p>
              <div className="pt-2 border-t border-slate-100">
                <strong className="text-xs text-slate-900 block">{tItem.name}</strong>
                <span className="text-[10px] text-slate-400">{tItem.district} • {tItem.crop}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
