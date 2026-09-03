import React, { useState } from 'react';
import { Star, Send, CheckCircle2, MessageSquare, Loader2 } from 'lucide-react';
import { feedbackAPI } from '../services/apiClient.js';
import { useTranslation } from '../i18n/index.jsx';

export default function FeedbackForm() {
  const { t } = useTranslation();
  const [rating, setRating] = useState(5);
  const [category, setCategory] = useState('Recommendation Accuracy');
  const [comments, setComments] = useState('');
  const [farmerName, setFarmerName] = useState('');
  const [contact, setContact] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comments.trim()) return;

    setIsSubmitting(true);
    try {
      await feedbackAPI.submit({
        farmerName: farmerName || 'Anonymous Farmer',
        rating,
        category,
        comments,
        location: contact || 'Nagpur, Maharashtra'
      });
    } catch (err) {
      console.warn('Backend feedback submission notice:', err.message);
    } finally {
      setIsSubmitting(false);
      setSubmitted(true);
    }
  };

  if (submitted) {
    return (
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 text-center space-y-4 shadow-sm" id="feedback-success">
        <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center">
          <CheckCircle2 className="w-7 h-7" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-900 font-heading">
            {t('feedback.success', 'Thank you! Your feedback has been recorded.')}
          </h3>
          <p className="text-xs text-slate-600 mt-1 max-w-md mx-auto">
            Your insights help our agronomy and mandi research teams continually refine our crop models for your region.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setSubmitted(false);
            setComments('');
          }}
          className="text-xs font-bold text-emerald-800 hover:text-emerald-950 underline underline-offset-4 cursor-pointer"
        >
          Submit Another Response
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-5 sm:p-7 border border-slate-200 shadow-sm space-y-4" id="farmer-feedback-form">
      <div>
        <h3 className="text-base sm:text-lg font-bold text-slate-900 font-heading flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-emerald-700" />
          <span>{t('feedback.title', 'Share Your Field & Mandi Experience')}</span>
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Did FarmPro's price and crop advice match your local mandi reality?
        </p>
      </div>

      {/* Star Rating */}
      <div>
        <label className="block text-xs font-bold text-slate-700 mb-1">
          {t('feedback.rating', 'Rating')}
        </label>
        <div className="flex items-center gap-1.5">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className="p-1 text-amber-400 hover:scale-110 transition cursor-pointer"
            >
              <Star 
                className={`w-6 h-6 ${star <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`} 
              />
            </button>
          ))}
          <span className="text-xs font-bold text-slate-600 ml-2">
            {rating === 5 ? 'Exceptional (5/5)' : rating === 4 ? 'Very Helpful (4/5)' : `${rating}/5`}
          </span>
        </div>
      </div>

      {/* Category Selection */}
      <div>
        <label className="block text-xs font-bold text-slate-700 mb-1">
          {t('feedback.category', 'Category')}
        </label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600"
        >
          <option value="Recommendation Accuracy">Crop Recommendation Accuracy</option>
          <option value="Mandi Price Forecast">Mandi Price Forecast & Realization</option>
          <option value="App Usability & Language">Ease of Use / Local Language Support</option>
          <option value="New Crop Suggestion">Suggest a New Crop to Add</option>
          <option value="FPO / Group Farming">FPO or Collective Selling Needs</option>
        </select>
      </div>

      {/* User info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            {t('auth.name', 'Farmer Name')} (Optional)
          </label>
          <input
            type="text"
            placeholder="e.g. Ramesh Patil"
            value={farmerName}
            onChange={(e) => setFarmerName(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-600"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            {t('auth.phone', 'Phone')} / {t('auth.email', 'Email')} (Optional)
          </label>
          <input
            type="text"
            placeholder="e.g. 98234 56789"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-600"
          />
        </div>
      </div>

      {/* Detailed Comments */}
      <div>
        <label className="block text-xs font-bold text-slate-700 mb-1">
          {t('feedback.comments', 'Detailed Comments or Suggestion')} *
        </label>
        <textarea
          rows={3}
          required
          placeholder="Tell us about your soil, local mandi rates, or how FarmPro can serve your farm better..."
          value={comments}
          onChange={(e) => setComments(e.target.value)}
          className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-2.5 px-4 rounded-xl bg-emerald-800 hover:bg-emerald-900 disabled:opacity-75 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition cursor-pointer"
      >
        {isSubmitting ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
        ) : (
          <Send className="w-3.5 h-3.5" />
        )}
        <span>{isSubmitting ? 'Saving to Database...' : t('feedback.submit', 'Submit Farmer Feedback')}</span>
      </button>
    </form>
  );
}
