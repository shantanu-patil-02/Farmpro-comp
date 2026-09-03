import React from 'react';
import { Sprout, Loader2 } from 'lucide-react';

export default function LoadingSpinner({ message = 'Analyzing Soil Conditions & Market Prices...', submessage = 'Evaluating supply shortage indexes across regional mandis' }) {
  return (
    <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center" id="farmpro-loading-spinner">
      <div className="relative mb-4">
        <div className="w-16 h-16 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-700 shadow-inner">
          <Sprout className="w-8 h-8 text-emerald-600 animate-pulse" />
        </div>
        <Loader2 className="w-20 h-20 text-amber-500 absolute -top-2 -left-2 animate-spin opacity-80" />
      </div>
      <h3 className="text-base sm:text-lg font-bold text-slate-800 tracking-tight">
        {message}
      </h3>
      {submessage && (
        <p className="text-xs text-slate-500 mt-1 max-w-sm">
          {submessage}
        </p>
      )}
    </div>
  );
}
