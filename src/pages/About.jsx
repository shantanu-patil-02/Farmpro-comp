import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Sprout, 
  TrendingUp, 
  Target, 
  ShieldCheck, 
  Users, 
  Sparkles, 
  ArrowRight,
  BarChart2,
  HeartHandshake
} from 'lucide-react';

export default function About() {
  return (
    <div className="space-y-12 py-6 max-w-5xl mx-auto font-sans" id="about-page">
      
      {/* Header */}
      <div className="space-y-3 text-center max-w-3xl mx-auto">
        <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          Our Agricultural Mission
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-heading">
          Empowering Indian Farmers to SOW for the MARKET, Not Just the SOIL.
        </h1>
        <p className="text-xs sm:text-base text-slate-600 leading-relaxed">
          FarmPro was conceived to solve one of the greatest systemic tragedies in Indian farming: bumper harvests that lead to catastrophic wholesale price crashes.
        </p>
      </div>

      {/* The Story / Paradox */}
      <div className="bg-emerald-950 text-white rounded-3xl p-6 sm:p-10 border border-emerald-900 space-y-6">
        <h2 className="text-xl sm:text-2xl font-bold font-heading text-amber-400">
          The Agronomic Paradox We Are Solving
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
          <p>
            For decades, agricultural extension services and traditional farming apps have focused exclusively on one question: <em>"Can this crop physically grow in your soil?"</em>
          </p>
          <p>
            If a farmer has fertile black soil and tube-well irrigation, the system answers: <em>"Yes, onion or tomato will grow wonderfully!"</em> But when hundreds of thousands of farmers receive that identical advice simultaneously, everyone harvests together.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-emerald-900/60 border border-emerald-800 text-xs text-amber-300 font-medium">
          Mandi arrivals spike by 400%, wholesale prices plunge to ₹2 per kilo, and farmers are forced to dump produce on highways. Soil suitability alone is NOT enough.
        </div>
      </div>

      {/* The Dual-Engine Solution */}
      <div className="space-y-6">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-heading">
            The FarmPro Dual-Engine Methodology
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Every crop recommendation must satisfy TWO non-negotiable criteria before we recommend it:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              <Sprout className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 font-heading">
              Pillar 1: Biological & Agronomic Feasibility 
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              We analyze soil texture (Alluvial, Black Soil, Red, Loam), soil pH, NPK nutrient reserves, water availability (Rainfed vs Borewell), and crop cycle duration to ensure the crop has optimal agronomic growth conditions.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 font-heading">
              Pillar 2: Mandi Economics & Buffer Shortage 
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              We cross-examine real-time mandi buffer stock deficits, crushing mill demand, projected harvest wholesale rates, and Government MSP safety nets. If a crop is in supply surplus, our algorithm flags a glut risk.
            </p>
          </div>
        </div>
      </div>

      {/* Team / Vision */}
      {/* <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex items-center gap-2.5">
          <HeartHandshake className="w-5 h-5 text-emerald-700" />
          <h3 className="text-base font-bold text-slate-900 font-heading">
            Built for Hackathon MVP & Real Agricultural Impact
          </h3>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed">
          FarmPro was built to demonstrate how data-driven market intelligence can transform smallholder livelihoods. By bridging the gap between farm agronomics and mandi economics, we empower farmers to move from distress selling to strategic harvesting.
        </p>

        <div className="pt-2">
          <Link
            to="/recommendation"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold shadow-sm transition"
          >
            <span>Try the Recommendation Engine</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div> */}

    </div>
  );
}
