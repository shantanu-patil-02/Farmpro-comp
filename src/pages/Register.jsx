import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sprout, Phone, Lock, User, Mail, MapPin, Maximize2, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { useFarm, SUPPORTED_LANGUAGES } from '../context/FarmContext.jsx';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [language, setLanguage] = useState('en');
  const [state, setState] = useState('Maharashtra');
  const [district, setDistrict] = useState('Nagpur');
  const [landArea, setLandArea] = useState(5);
  const [landUnit, setLandUnit] = useState('acres');
  const [soilType, setSoilType] = useState('Black Soil');
  const [waterAvailability, setWaterAvailability] = useState('Moderate (Borewell / Seasonal)');

  const [isRegistering, setIsRegistering] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const { registerNewUser } = useFarm();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsRegistering(true);
    setErrorMsg('');

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters in length');
      setIsRegistering(false);
      return;
    }

    const finalEmail = email.trim() || `${name.toLowerCase().replace(/[^a-z0-9]/g, '') || 'farmer'}${Math.floor(Math.random() * 900 + 100)}@farmpro.in`;
    const locationStr = `${district.trim() || 'Nagpur'}, ${state.trim() || 'Maharashtra'}`;

    try {
      await registerNewUser({
        name: name.trim(),
        email: finalEmail,
        password,
        phone: phone.trim(),
        language,
        role: 'farmer',
        location: locationStr,
        soilType,
        landArea: Number(landArea) || 5,
        landUnit,
        waterAvailability,
      });

      navigate('/dashboard');
    } catch (err) {
      setErrorMsg(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center py-10 px-4 font-sans" id="register-page">
      <div className="w-full max-w-lg bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-1">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto mb-2 shadow-xs">
            <Sprout className="w-6 h-6 text-emerald-700" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 font-heading">
            Register for FarmPro
          </h1>
          <p className="text-xs text-slate-500">
            Join thousands of Indian farmers sowing for market leverage & maximum mandi profit.
          </p>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleRegister} className="space-y-4 text-xs">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Farmer Full Name *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Patil"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="farmer@farmpro.ai"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Mobile Number
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="10-digit number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Preferred Language
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
              >
                {SUPPORTED_LANGUAGES.map(lang => (
                  <option key={lang.code} value={lang.code}>
                    {lang.native} ({lang.name})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                State
              </label>
              <select
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
              >
                <option value="Maharashtra">Maharashtra</option>
                <option value="Madhya Pradesh">Madhya Pradesh</option>
                <option value="Punjab">Punjab</option>
                <option value="Telangana">Telangana</option>
                <option value="Gujarat">Gujarat</option>
                <option value="Rajasthan">Rajasthan</option>
                <option value="Karnataka">Karnataka</option>
                <option value="Uttar Pradesh">Uttar Pradesh</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                District / Location
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Nagpur"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Land Holding
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  min="0.1"
                  step="0.5"
                  required
                  value={landArea}
                  onChange={(e) => setLandArea(e.target.value)}
                  className="w-2/3 px-3 py-2.5 rounded-xl border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                />
                <select
                  value={landUnit}
                  onChange={(e) => setLandUnit(e.target.value)}
                  className="w-1/3 px-2 py-2.5 rounded-xl border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                >
                  <option value="acres">Acres</option>
                  <option value="hectares">Hectares</option>
                  <option value="bigha">Bigha</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Soil Type
              </label>
              <select
                value={soilType}
                onChange={(e) => setSoilType(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
              >
                <option value="Black Soil">Black Soil (Regur)</option>
                <option value="Alluvial">Alluvial</option>
                <option value="Red Soil">Red Soil</option>
                <option value="Sandy Soil">Sandy Loam</option>
                <option value="Clay Soil">Clay Soil</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Water Availability
            </label>
            <select
              value={waterAvailability}
              onChange={(e) => setWaterAvailability(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
            >
              <option value="Moderate (Borewell / Seasonal)">Moderate (Borewell / Seasonal)</option>
              <option value="High (Canal / Perennial)">High (Canal / Perennial)</option>
              <option value="Low (Rainfed / Dryland)">Low (Rainfed / Dryland)</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Create Password (min 6 characters) *
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                placeholder="Choose a secure password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isRegistering}
            className="w-full py-3 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 disabled:opacity-75 text-emerald-950 font-bold text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
          >
            {isRegistering ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Creating farmer account...</span>
              </>
            ) : (
              <>
                <span>Complete Registration & Launch Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
          <span>Already registered? </span>
          <Link to="/login" className="text-emerald-800 font-bold hover:underline">
            Sign In here
          </Link>
        </div>

      </div>
    </div>
  );
}
