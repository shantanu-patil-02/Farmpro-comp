import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Sprout, Mail, Lock, ArrowRight, UserCheck, ShieldCheck, Loader2, AlertCircle } from 'lucide-react';
import { useFarm } from '../context/FarmContext.jsx';

export default function Login() {
  const [email, setEmail] = useState(' ');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const { loginWithCredentials, authError } = useFarm();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect destination after login
  const from = location.state?.from || '/dashboard';

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    try {
      await loginWithCredentials(email.trim(), password);
      navigate(from, { replace: true });
    } catch (err) {
      setErrorMsg(err.message || 'Invalid email or password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickDemo = async (type) => {
    setIsLoading(true);
    setErrorMsg('');
    const demoEmail = type === 'farmer' ? 'farmer@farmpro.ai' : 'shantanu@gmail.com';
    const demoPass = 'shantanu';
    setEmail(demoEmail);
    setPassword(demoPass);

    try {
      await loginWithCredentials(demoEmail, demoPass);
      navigate(from, { replace: true });
    } catch (err) {
      setErrorMsg(err.message || 'Failed to authenticate demo account.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center py-10 px-4 font-sans" id="login-page">
      <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
        
        {/* Brand Header */}
        <div className="text-center space-y-1">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto mb-2 shadow-xs">
            <Sprout className="w-6 h-6 text-emerald-700" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 font-heading">
            Sign In to FarmPro
          </h1>
          <p className="text-xs text-slate-500">
            Access your secure farm profile & personalized Mandi intelligence
          </p>
        </div>

        {/* Demo Quick Logins */}
        <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block text-center">
            One-Click Demo Profiles (Pre-Seeded)
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemo('farmer')}
              disabled={isLoading}
              className="py-1.5 px-2 text-[11px] font-bold rounded-lg bg-emerald-800 hover:bg-emerald-900 disabled:opacity-50 text-white transition flex items-center justify-center gap-1 shadow-2xs cursor-pointer"
            >
              <UserCheck className="w-3 h-3" />
              <span>Ramesh (Farmer)</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('fpo')}
              disabled={isLoading}
              className="py-1.5 px-2 text-[11px] font-bold rounded-lg bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white transition flex items-center justify-center gap-1 shadow-2xs cursor-pointer"
            >
              <ShieldCheck className="w-3 h-3" />
              <span>Shantanu</span>
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {(errorMsg || authError) && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMsg || authError}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="farmer@farmpro.ai"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-700"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-700"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 rounded-xl bg-emerald-800 hover:bg-emerald-900 disabled:opacity-75 text-white text-xs font-bold shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Verifying credentials...</span>
              </>
            ) : (
              <>
                <span>Sign In to FarmPro</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Register Link */}
        <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
          <span>New to FarmPro? </span>
          <Link to="/register" className="text-emerald-800 font-bold hover:underline">
            Register your land (Free)
          </Link>
        </div>

      </div>
    </div>
  );
}
