import React, { useState, useEffect } from 'react';
import { 
  User, 
  MapPin, 
  Phone, 
  Mail, 
  Layers, 
  Droplets, 
  CheckCircle2, 
  Save, 
  ShieldCheck, 
  Sparkles,
  ArrowRight,
  LogOut,
  Loader2,
  Calendar,
  AlertCircle,
  FlaskConical,
  Sprout
} from 'lucide-react';
import { useFarm, SUPPORTED_LANGUAGES } from '../context/FarmContext.jsx';
import { Link, useNavigate } from 'react-router-dom';

export default function Profile() {
  const { 
    user, 
    farmProfile, 
    updateFarmProfile, 
    updateProfile, 
    language, 
    setLanguage, 
    logoutUser 
  } = useFarm();
  
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    // User fields
    name: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    language: language || 'en',
    // Farm fields
    location: farmProfile?.location || 'Nagpur, Maharashtra',
    latitude: farmProfile?.latitude || 21.1458,
    longitude: farmProfile?.longitude || 79.0882,
    soilType: farmProfile?.soilType || 'Black Soil',
    landArea: farmProfile?.landArea || 5,
    landUnit: farmProfile?.landUnit || 'acres',
    waterAvailability: farmProfile?.waterAvailability || 'Moderate (Borewell / Seasonal)',
    nitrogen: farmProfile?.nitrogen ?? 140,
    phosphorus: farmProfile?.phosphorus ?? 35,
    potassium: farmProfile?.potassium ?? 210,
    soilPH: farmProfile?.soilPH ?? farmProfile?.soilPh ?? 6.8,
    previousCrop: farmProfile?.previousCrop || 'Soybean',
  });

  const [isSaving, setIsSaving] = useState(false);
  const [savedMessage, setSavedMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Sync formData when farmProfile or user loads
  useEffect(() => {
    if (farmProfile || user) {
      setFormData(prev => ({
        ...prev,
        name: user?.name || prev.name,
        phone: user?.phone || prev.phone,
        email: user?.email || prev.email,
        language: user?.language || language || 'en',
        location: farmProfile?.location || prev.location,
        latitude: farmProfile?.latitude ?? prev.latitude,
        longitude: farmProfile?.longitude ?? prev.longitude,
        soilType: farmProfile?.soilType || prev.soilType,
        landArea: farmProfile?.landArea ?? prev.landArea,
        landUnit: farmProfile?.landUnit || prev.landUnit,
        waterAvailability: farmProfile?.waterAvailability || prev.waterAvailability,
        nitrogen: farmProfile?.nitrogen ?? prev.nitrogen,
        phosphorus: farmProfile?.phosphorus ?? prev.phosphorus,
        potassium: farmProfile?.potassium ?? prev.potassium,
        soilPH: farmProfile?.soilPH ?? farmProfile?.soilPh ?? prev.soilPH,
        previousCrop: farmProfile?.previousCrop || prev.previousCrop,
      }));
    }
  }, [farmProfile, user, language]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSavedMessage(false);
    setErrorMessage('');

    try {
      // 1. Update Farm profile via API
      await updateFarmProfile({
        location: formData.location,
        latitude: Number(formData.latitude),
        longitude: Number(formData.longitude),
        soilType: formData.soilType,
        landArea: Number(formData.landArea),
        landUnit: formData.landUnit,
        waterAvailability: formData.waterAvailability,
        nitrogen: Number(formData.nitrogen),
        phosphorus: Number(formData.phosphorus),
        potassium: Number(formData.potassium),
        soilPH: Number(formData.soilPH),
        previousCrop: formData.previousCrop,
      });

      // 2. Update local user profile
      updateProfile({
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
      });

      setSavedMessage(true);
      setTimeout(() => setSavedMessage(false), 4000);
    } catch (err) {
      setErrorMessage(err.message || 'Failed to save farm records');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  return (
    <div className="space-y-8 py-6 max-w-4xl mx-auto font-sans" id="profile-page">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 uppercase tracking-wider">
            <User className="w-4 h-4 text-emerald-700" />
            <span>Kisan Account & Farm Records</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading mt-1">
            Farmer Profile & Land Records
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Your saved agronomic parameters are automatically applied when computing sowing recommendations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-emerald-950 border border-amber-300">
            {user?.subscriptionPlan ? `${user.subscriptionPlan.toUpperCase()} Plan` : 'Pro Kisan Plan'}
          </span>
          <button
            type="button"
            onClick={handleLogout}
            className="p-2 rounded-xl text-rose-700 hover:bg-rose-50 border border-rose-200 text-xs font-bold flex items-center gap-1 transition cursor-pointer"
            title="Sign Out"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </div>

      {savedMessage && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>Farm records and agronomic parameters updated successfully!</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-300 text-rose-900 text-xs font-bold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-700 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* User Account Info Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-slate-500 flex items-center gap-2">
              <User className="w-4 h-4 text-emerald-700" />
              <span>Personal Information</span>
            </h3>
            <span className="text-[11px] text-slate-400">
              Role: <strong className="text-slate-700 uppercase">{user?.role || 'Farmer'}</strong>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Farmer Full Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Email Address (Account ID)
              </label>
              <input
                type="email"
                disabled
                value={formData.email}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-500 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Mobile Number
              </label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Preferred App Language
              </label>
              <select
                value={language}
                onChange={(e) => {
                  setLanguage(e.target.value);
                  setFormData({ ...formData, language: e.target.value });
                }}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
              >
                {SUPPORTED_LANGUAGES.map(l => (
                  <option key={l.code} value={l.code}>
                    {l.native} ({l.name})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Farm Model & Agricultural Coordinates Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-slate-500 flex items-center gap-2">
              <Sprout className="w-4 h-4 text-emerald-700" />
              <span>Farm Holdings & Soil Parameters</span>
            </h3>
            <span className="text-[11px] text-emerald-800 font-semibold">
              Persisted in MongoDB
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-700 mb-1">
                Farm Location (District, State) *
              </label>
              <input
                type="text"
                required
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g. Nagpur, Maharashtra"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Primary Soil Type *
              </label>
              <select
                value={formData.soilType}
                onChange={(e) => setFormData({ ...formData, soilType: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
              >
                <option value="Black Soil">Black Soil (Regur)</option>
                <option value="Alluvial">Alluvial</option>
                <option value="Red Soil">Red Soil</option>
                <option value="Sandy Soil">Sandy Loam</option>
                <option value="Clay Soil">Clay Soil</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Total Land Holding *
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  min="0.1"
                  step="0.5"
                  required
                  value={formData.landArea}
                  onChange={(e) => setFormData({ ...formData, landArea: e.target.value })}
                  className="w-2/3 px-3 py-2 rounded-lg border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                />
                <select
                  value={formData.landUnit}
                  onChange={(e) => setFormData({ ...formData, landUnit: e.target.value })}
                  className="w-1/3 px-2 py-2 rounded-lg border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                >
                  <option value="acres">Acres</option>
                  <option value="hectares">Hectares</option>
                  <option value="bigha">Bigha</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Water Availability *
              </label>
              <select
                value={formData.waterAvailability}
                onChange={(e) => setFormData({ ...formData, waterAvailability: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
              >
                <option value="Moderate (Borewell / Seasonal)">Moderate (Borewell / Seasonal)</option>
                <option value="High (Canal / Perennial)">High (Canal / Perennial)</option>
                <option value="Low (Rainfed / Dryland)">Low (Rainfed / Dryland)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Previous Sown Crop
              </label>
              <input
                type="text"
                value={formData.previousCrop}
                onChange={(e) => setFormData({ ...formData, previousCrop: e.target.value })}
                placeholder="e.g. Soybean"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
              />
            </div>
          </div>

          {/* Soil Chemistry (NPK & pH) */}
          <div className="pt-3 border-t border-slate-100">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
              <FlaskConical className="w-3.5 h-3.5 text-emerald-700" />
              <span>Soil Chemistry Baseline (NPK & pH)</span>
            </span>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">
                  Nitrogen (N) kg/ha
                </label>
                <input
                  type="number"
                  value={formData.nitrogen}
                  onChange={(e) => setFormData({ ...formData, nitrogen: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">
                  Phosphorus (P) kg/ha
                </label>
                <input
                  type="number"
                  value={formData.phosphorus}
                  onChange={(e) => setFormData({ ...formData, phosphorus: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">
                  Potassium (K) kg/ha
                </label>
                <input
                  type="number"
                  value={formData.potassium}
                  onChange={(e) => setFormData({ ...formData, potassium: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">
                  Soil pH (3.5 - 9.5)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="3.5"
                  max="9.5"
                  value={formData.soilPH}
                  onChange={(e) => setFormData({ ...formData, soilPH: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Subscription & Usage Summary */}
        <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
          <div>
            <span className="font-bold text-emerald-950 block text-sm">
              Plan: {user?.subscriptionPlan?.toUpperCase() || 'PRO KISAN'}
            </span>
            <p className="text-emerald-800 text-[11px] mt-0.5">
              Audits conducted: <strong>{user?.freeRecommendationsUsed || 0}</strong> recommendation runs logged.
            </p>
          </div>
          <Link
            to="/subscription"
            className="px-3 py-1.5 rounded-lg bg-emerald-800 text-white font-bold text-xs hover:bg-emerald-900 transition shrink-0 text-center"
          >
            Upgrade Plan
          </Link>
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-between pt-2">
          <Link
            to="/recommendation"
            className="text-xs font-bold text-emerald-800 hover:underline flex items-center gap-1"
          >
            <span>Run Sowing Audit with this Profile</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          <button
            type="submit"
            disabled={isSaving}
            className="py-2.5 px-6 rounded-xl bg-emerald-800 hover:bg-emerald-900 disabled:opacity-75 text-white text-xs font-bold shadow-sm transition flex items-center gap-1.5 cursor-pointer"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Saving to MongoDB...</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />
                <span>Save Farm Profile</span>
              </>
            )}
          </button>
        </div>

      </form>

    </div>
  );
}
