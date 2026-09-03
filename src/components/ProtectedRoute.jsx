import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useFarm } from '../context/FarmContext.jsx';
import { Loader2 } from 'lucide-react';

/**
 * ProtectedRoute component: ensures user is authenticated before rendering children.
 * Redirects to /login if unauthorized.
 */
export default function ProtectedRoute({ children }) {
  const { user, isAuthLoading } = useFarm();
  const location = useLocation();

  if (isAuthLoading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center p-8 text-center space-y-3">
        <Loader2 className="w-8 h-8 text-emerald-700 animate-spin" />
        <p className="text-xs font-semibold text-slate-500">Verifying farmer session...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return children;
}
