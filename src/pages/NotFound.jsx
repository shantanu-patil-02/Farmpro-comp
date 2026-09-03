import React from 'react';
import { Link } from 'react-router-dom';
import { Sprout, ArrowLeft, Home, Sparkles } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6 space-y-5 font-sans" id="not-found-page">
      <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto shadow-sm">
        <Sprout className="w-8 h-8 text-emerald-700" />
      </div>

      <div className="space-y-2 max-w-md">
        <span className="text-xs font-bold text-amber-600 uppercase tracking-widest">
          Error 404 • Field Plot Not Located
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">
          Page Not Found in the Mandi
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
          The crop record or page address you requested does not exist or has been relocated to another seasonal catalog.
        </p>
      </div>

      <div className="flex items-center gap-3 pt-2">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-xs transition"
        >
          <Home className="w-3.5 h-3.5" />
          <span>Return Home</span>
        </Link>

        <Link
          to="/recommendation"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold shadow-xs transition"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Get Crop Recommendation</span>
        </Link>
      </div>
    </div>
  );
}
