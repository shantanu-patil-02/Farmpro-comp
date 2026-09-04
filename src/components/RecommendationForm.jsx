import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MapPin, 
  Layers, 
  Maximize2, 
  Calendar, 
  Droplets, 
  FlaskConical, 
  Target, 
  History, 
  Sparkles, 
  ArrowRight,
  Navigation,
  RotateCcw,
  CheckCircle2
} from 'lucide-react';
import { useFarm } from '../context/FarmContext.jsx';
import { useTranslation } from '../i18n/index.jsx';
import { REGIONAL_PRESETS } from '../data/regionalPresets.js';

export default function RecommendationForm({ onSubmitSuccess }) {
  const { farmForm, farmProfile, syncFormWithFarmProfile, triggerRecommendation, isGenerating } = useFarm();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ ...farmForm });
  const [geoLoading, setGeoLoading] = useState(false);
  const [geoMessage, setGeoMessage] = useState('');
  const [isModifiedFromProfile, setIsModifiedFromProfile] = useState(false);

  // Keep form in sync when farmForm changes (e.g. on initial profile load)
  useEffect(() => {
    setFormData({ ...farmForm });
  }, [farmForm]);

  const handleChange = (field, value) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      setIsModifiedFromProfile(true);
      return updated;
    });
  };

  const handleResetToProfile = () => {
    if (farmProfile) {
      syncFormWithFarmProfile(farmProfile);
      setFormData(prev => ({
        ...prev,
        location: farmProfile.location || prev.location,
        soilType: farmProfile.soilType || prev.soilType,
        landArea: farmProfile.landArea || prev.landArea,
        landUnit: (farmProfile.landUnit || 'Acres').charAt(0).toUpperCase() + (farmProfile.landUnit || 'acres').slice(1),
        waterAvailability: farmProfile.waterAvailability?.includes('High') ? 'High' : farmProfile.waterAvailability?.includes('Low') ? 'Low' : 'Medium',
        nitrogen: farmProfile.nitrogen ?? prev.nitrogen,
        phosphorus: farmProfile.phosphorus ?? prev.phosphorus,
        potassium: farmProfile.potassium ?? prev.potassium,
        ph: farmProfile.soilPH ?? farmProfile.soilPh ?? prev.ph,
        previousCrop: farmProfile.previousCrop || prev.previousCrop,
      }));
      setIsModifiedFromProfile(false);
    }
  };

  const handleApplyPreset = (presetId) => {
    const preset = REGIONAL_PRESETS.find(p => p.id === presetId);
    if (!preset) return;

    setFormData(prev => ({
      ...prev,
      location: `${preset.farmConditions.district}, ${preset.farmConditions.state}`,
      soilType: `${preset.farmConditions.soilType} Soil`,
      landArea: preset.farmConditions.landArea || 5,
      cropCycle: preset.farmConditions.cropCycle === 'Zaid' ? '3 Months' : '6 Months',
      waterAvailability: preset.farmConditions.waterAvailability === 'Rainfed' ? 'Low' : 'Medium',
      nitrogen: preset.farmConditions.npk.n,
      phosphorus: preset.farmConditions.npk.p,
      potassium: preset.farmConditions.npk.k,
      ph: preset.farmConditions.ph,
      weather: preset.weather
    }));
    setIsModifiedFromProfile(true);
  };

  const handleUseGeolocation = () => {
    if (!navigator.geolocation) {
      setGeoMessage('Geolocation not supported by your browser.');
      return;
    }

    setGeoLoading(true);
    setGeoMessage('Detecting your agro-climatic coordinates...');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude.toFixed(2);
        const lon = position.coords.longitude.toFixed(2);
        handleChange('location', `GPS Pin: ${lat}°N, ${lon}°E (Central India Zone)`);
        setGeoLoading(false);
        setGeoMessage('Location identified! Agro-climatic weather mapped.');
        setTimeout(() => setGeoMessage(''), 3500);
      },
      () => {
        setGeoLoading(false);
        setGeoMessage('Location access declined. Using manual entry.');
        setTimeout(() => setGeoMessage(''), 3000);
      },
      { timeout: 8000 }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await triggerRecommendation(formData);
      if (onSubmitSuccess) {
        onSubmitSuccess();
      } else {
        navigate('/results');
      }
    } catch (err) {
      console.error('Recommendation generation error:', err);
      // Navigate anyway because FarmContext provides safe fallback
      if (onSubmitSuccess) {
        onSubmitSuccess();
      } else {
        navigate('/results');
      }
    }
  };

  return (
    <form 
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-7 space-y-6 font-sans"
      id="farm-recommendation-form"
    >
      {/* Header & Quick Regional Presets */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 font-heading">
              {t('form.title', 'Enter Farm & Field Conditions')}
            </h2>
            {farmProfile && !isModifiedFromProfile && (
              <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                <CheckCircle2 className="w-3 h-3" />
                <span>Pre-filled from Saved Profile</span>
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            {t('form.subtitle', 'Provide your agro-climatic and soil parameters to compute top crops.')}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start sm:self-center">
          {isModifiedFromProfile && (
            <button
              type="button"
              onClick={handleResetToProfile}
              className="text-[11px] font-semibold text-emerald-800 hover:text-emerald-950 flex items-center gap-1 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 transition cursor-pointer"
              title="Reset fields back to saved Farm Profile"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset to Saved Farm</span>
            </button>
          )}

          {/* Demo Presets Dropdown */}
          {/* <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <select
              onChange={(e) => handleApplyPreset(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 text-slate-700 font-semibold px-2 py-1 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-600 cursor-pointer"
            >
              <option value="">Choose State Preset...</option>
              {REGIONAL_PRESETS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div> */}
        </div>
      </div>

      {/* Grid of 11 Form Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 text-xs">
        
        {/* Field 1: Location & Geolocation */}
        <div className="sm:col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between mb-1">
            <label className="font-bold text-slate-700 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-700" />
              <span>{t('form.location', 'Location (District, State)')} *</span>
            </label>
            <button
              type="button"
              onClick={handleUseGeolocation}
              disabled={geoLoading}
              className="text-[10px] text-emerald-700 hover:text-emerald-900 font-bold flex items-center gap-1 hover:underline cursor-pointer"
            >
              <Navigation className={`w-3 h-3 ${geoLoading ? 'animate-spin' : ''}`} />
              <span>{geoLoading ? 'Locating...' : 'Use My GPS'}</span>
            </button>
          </div>
          <input
            type="text"
            required
            value={formData.location}
            onChange={(e) => handleChange('location', e.target.value)}
            placeholder={t('form.locationPlaceholder', 'e.g. Nagpur, Maharashtra')}
            className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-700"
          />
          {geoMessage && (
            <p className="text-[10px] text-amber-700 mt-1 font-medium">{geoMessage}</p>
          )}
        </div>

        {/* Field 2: Soil Type */}
        <div>
          <label className="font-bold text-slate-700 flex items-center gap-1.5 mb-1">
            <Layers className="w-3.5 h-3.5 text-amber-700" />
            <span>{t('form.soilType', 'Soil Type')} *</span>
          </label>
          <select
            value={formData.soilType}
            onChange={(e) => handleChange('soilType', e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-700"
          >
            <option value="Black Soil">{t('form.soilBlack', 'Black Soil')}</option>
            <option value="Alluvial">{t('form.soilAlluvial', 'Alluvial Soil')}</option>
            <option value="Red Soil">{t('form.soilRed', 'Red Soil')}</option>
            <option value="Laterite Soil">{t('form.soilLaterite', 'Laterite Soil')}</option>
            <option value="Sandy Soil">{t('form.soilSandy', 'Sandy Soil')}</option>
            <option value="Clay Soil">{t('form.soilClay', 'Clay Soil')}</option>
            <option value="Loamy Soil">{t('form.soilLoamy', 'Loamy Soil')}</option>
            <option value="Other">Other / Mixed</option>
          </select>
        </div>

        {/* Field 3: Land Area & Unit */}
        <div>
          <label className="font-bold text-slate-700 flex items-center gap-1.5 mb-1">
            <Maximize2 className="w-3.5 h-3.5 text-indigo-600" />
            <span>{t('form.landArea', 'Cultivable Land Area')} *</span>
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              min="0.5"
              max="500"
              step="0.1"
              required
              value={formData.landArea}
              onChange={(e) => handleChange('landArea', e.target.value)}
              className="w-2/3 px-3 py-2 rounded-lg border border-slate-300 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-700"
            />
            <select
              value={formData.landUnit}
              onChange={(e) => handleChange('landUnit', e.target.value)}
              className="w-1/3 px-2 py-2 rounded-lg border border-slate-300 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-700"
            >
              <option value="Acres">{t('form.acres', 'Acres')}</option>
              <option value="Hectares">{t('form.hectares', 'Hectares')}</option>
            </select>
          </div>
        </div>

        {/* Field 4: Crop Cycle */}
        <div>
          <label className="font-bold text-slate-700 flex items-center gap-1.5 mb-1">
            <Calendar className="w-3.5 h-3.5 text-blue-600" />
            <span>{t('form.cropCycle', 'Target Crop Duration')} *</span>
          </label>
          <select
            value={formData.cropCycle}
            onChange={(e) => handleChange('cropCycle', e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-700"
          >
            <option value="3 Months">{t('form.cycle3m', '3 Months (Zaid / Short)')}</option>
            <option value="6 Months">{t('form.cycle6m', '6 Months (Kharif / Rabi)')}</option>
            <option value="9 Months">{t('form.cycle9m', '9 Months (Semi-Annual)')}</option>
            <option value="12 Months">{t('form.cycle12m', '12 Months (Annual / Perennial)')}</option>
          </select>
        </div>

        {/* Field 5: Water Availability */}
        <div>
          <label className="font-bold text-slate-700 flex items-center gap-1.5 mb-1">
            <Droplets className="w-3.5 h-3.5 text-cyan-600" />
            <span>{t('form.waterAvailability', 'Water Availability')} *</span>
          </label>
          <select
            value={formData.waterAvailability}
            onChange={(e) => handleChange('waterAvailability', e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-700"
          >
            <option value="Low">{t('form.waterLow', 'Low (Rainfed / Drought-Prone)')}</option>
            <option value="Medium">{t('form.waterMedium', 'Medium (Canal / Borewell)')}</option>
            <option value="High">{t('form.waterHigh', 'High (Perennial / Drip Irrigation)')}</option>
          </select>
        </div>

        {/* Field 6: Soil Nitrogen (N) */}
        {/* <div>
          <label className="font-bold text-slate-700 flex items-center justify-between mb-1">
            <span className="flex items-center gap-1.5">
              <FlaskConical className="w-3.5 h-3.5 text-emerald-600" />
              <span>{t('form.nitrogen', 'Nitrogen (N)')}</span>
            </span>
            <span className="text-[10px] text-slate-400">kg/ha</span>
          </label>
          <input
            type="number"
            min="0"
            max="180"
            value={formData.nitrogen}
            onChange={(e) => handleChange('nitrogen', e.target.value)}
            placeholder="e.g. 140"
            className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-700"
          />
        </div> */}

        {/* Field 7: Soil Phosphorus (P) */}
        {/* <div>
          <label className="font-bold text-slate-700 flex items-center justify-between mb-1">
            <span className="flex items-center gap-1.5">
              <FlaskConical className="w-3.5 h-3.5 text-amber-600" />
              <span>{t('form.phosphorus', 'Phosphorus (P)')}</span>
            </span>
            <span className="text-[10px] text-slate-400">kg/ha</span>
          </label>
          <input
            type="number"
            min="0"
            max="120"
            value={formData.phosphorus}
            onChange={(e) => handleChange('phosphorus', e.target.value)}
            placeholder="e.g. 35"
            className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-700"
          />
        </div> */}

        {/* Field 8: Soil Potassium (K) */}
        {/* <div>
          <label className="font-bold text-slate-700 flex items-center justify-between mb-1">
            <span className="flex items-center gap-1.5">
              <FlaskConical className="w-3.5 h-3.5 text-rose-600" />
              <span>{t('form.potassium', 'Potassium (K)')}</span>
            </span>
            <span className="text-[10px] text-slate-400">kg/ha</span>
          </label>
          <input
            type="number"
            min="0"
            max="300"
            value={formData.potassium}
            onChange={(e) => handleChange('potassium', e.target.value)}
            placeholder="e.g. 210"
            className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-700"
          />
        </div> */}

        {/* Field 9: Soil pH */}
        <div>
          <label className="font-bold text-slate-700 flex items-center justify-between mb-1">
            <span>{t('form.ph', 'Soil pH Level')}</span>
            <span className="text-[10px] font-bold text-emerald-800">
              {formData.ph < 6.5 ? 'Acidic' : formData.ph > 7.5 ? 'Alkaline' : 'Neutral (Ideal)'}
            </span>
          </label>
          <input
            type="number"
            min="4.0"
            max="9.0"
            step="0.1"
            value={formData.ph}
            onChange={(e) => handleChange('ph', e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-700"
          />
        </div>

        {/* Field 10: Farming Objective */}
        {/* <div>
          <label className="font-bold text-slate-700 flex items-center gap-1.5 mb-1">
            <Target className="w-3.5 h-3.5 text-emerald-700" />
            <span>{t('form.farmingObjective', 'Farming Objective')} *</span>
          </label>
          <select
            value={formData.farmingObjective}
            onChange={(e) => handleChange('farmingObjective', e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-700"
          >
            <option value="Maximum Profit">{t('form.objProfit', 'Maximum Net Profit')}</option>
            <option value="Low Risk">{t('form.objRisk', 'Low Risk & Climate Resilient')}</option>
            <option value="Balanced">{t('form.objBalanced', 'Balanced Yield & Price Safety')}</option>
            <option value="Short Duration">{t('form.objCash', 'Short Duration Cash Flow')}</option>
            <option value="Long Duration">Long Duration (High Aggregate Yield)</option>
          </select>
        </div> */}

        {/* Field 11: Previous Crop */}
        <div>
          <label className="font-bold text-slate-700 flex items-center gap-1.5 mb-1">
            <History className="w-3.5 h-3.5 text-stone-600" />
            <span>{t('form.previousCrop', 'Previous Season Crop')}</span>
          </label>
          <select
            value={formData.previousCrop}
            onChange={(e) => handleChange('previousCrop', e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-700"
          >
            <option value="Soybean">{t('form.prevSoybean', 'Soybean / Legume')}</option>
            <option value="Wheat">{t('form.prevWheat', 'Wheat / Cereal')}</option>
            <option value="Paddy">{t('form.prevPaddy', 'Paddy / Rice')}</option>
            <option value="Cotton">{t('form.prevCotton', 'Cotton')}</option>
            <option value="Pulses">{t('form.prevPulses', 'Pulses / Gram')}</option>
            <option value="Sugarcane">{t('form.prevSugarcane', 'Sugarcane')}</option>
            <option value="Fallow">{t('form.prevFallow', 'Fallow / Rested Land')}</option>
            <option value="Other">Other Vegetable or Fodder</option>
          </select>
        </div>

      </div>

      {/* Submission Footer */}
      <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-xs text-slate-500">
          {t('form.subtitle', 'Provide your agro-climatic and soil parameters to compute top crops.')}
        </p>

        <button
          type="submit"
          disabled={isGenerating}
          id="get-recommendations-btn"
          className="w-full sm:w-auto py-3 px-7 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          <span>{isGenerating ? t('common.loading', 'Loading...') : t('form.submitButton', 'Generate Crop Recommendations')}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </form>
  );
}

