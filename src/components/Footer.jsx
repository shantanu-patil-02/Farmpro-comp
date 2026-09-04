import React from 'react';
import { Link } from 'react-router-dom';
import { Sprout, Phone, ShieldCheck, TrendingUp, Heart, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 text-xs mt-auto font-sans" id="main-footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-slate-800">
          
          {/* Col 1: Brand */}
          <div className="space-y-3 md:col-span-1"> 
  <div className="flex items-center gap-2.5"> 
    <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center shadow-xs overflow-hidden"> 
      <img
        src="/farmpro_icon2.png"
        alt="FarmPro"
        className="w-full h-full object-contain"
      />
    </div> 
    <span className="text-lg font-bold text-white tracking-tight"> 
      Farm<span className="text-amber-400">Pro</span> 
    </span> 
  </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Empowering Indian farmers with dual-pillar crop intelligence: matching farm agronomics with real-time APMC mandi demand, buffer stocks, and price trends.
            </p>
            <div className="flex items-center gap-2 text-emerald-400 text-[11px] font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Plant Smarter. Sell Better.</span>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Platform
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/" className="text-slate-400 hover:text-emerald-400 transition">
                  Home Landing
                </Link>
              </li>
              <li>
                <Link to="/recommendation" className="text-slate-400 hover:text-emerald-400 transition">
                  Crop Recommendation
                </Link>
              </li>
              <li>
                <Link to="/results" className="text-slate-400 hover:text-emerald-400 transition">
                  Top 5 Recommendations
                </Link>
              </li>
              
              <li>
                <Link to="/dashboard" className="text-slate-400 hover:text-emerald-400 transition">
                  Farmer Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Resources & Support */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Support & Plans
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/subscription" className="text-slate-400 hover:text-emerald-400 transition">
                  Subscription Plans
                </Link>
              </li>
              <li>
                <Link to="/history" className="text-slate-400 hover:text-emerald-400 transition">
                  Recommendation History
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-slate-400 hover:text-emerald-400 transition">
                  About FarmPro & Methodology
                </Link>
              </li>
              <li>
                <Link to="/feedback" className="text-slate-400 hover:text-emerald-400 transition">
                  Farmer Feedback
                </Link>
              </li>
              <li>
                <Link to="/profile" className="text-slate-400 hover:text-emerald-400 transition">
                  Farmer Profile
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Farmer Hotline & Mandi Sources */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-1">
              Farmer Support Helpline
            </h4>
            <div className="p-3 rounded-lg bg-slate-800/80 border border-slate-700/60">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
                <Phone className="w-3.5 h-3.5" />
                <span>Kisan Call Centre: 1800-180-xxxx</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Toll-free agricultural technical support (6 AM - 10 PM)
              </p>
            </div>
            <p className="text-[11px] text-slate-400 leading-normal">
              Market data synthesized from regional APMC Mandis, Agmarknet, and CACP Minimum Support Price benchmarks.
            </p>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
          <p>© {new Date().getFullYear()} FarmPro AgriTech. Built for Indian farmers with precision agronomy & mandi economics.</p>
          <div className="flex items-center gap-4">
            <span>e-NAM Integrated Standards</span>
            <span>•</span>
            <span>ICAR Agronomic Baseline</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
