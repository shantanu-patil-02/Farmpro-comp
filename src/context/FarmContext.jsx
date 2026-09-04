import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { CROPS_DATABASE } from '../data/cropDatabase.js';
import { generateRecommendations } from '../services/recommendationEngine.js';
import { recommendationsAPI, marketAPI, authAPI, farmAPI } from '../services/apiClient.js';

export const FarmContext = createContext(null);

export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', native: 'English' },
  { code: 'hi', name: 'Hindi', native: 'हिन्दी' },
  { code: 'mr', name: 'Marathi', native: 'मराठी' },
  { code: 'pa', name: 'Punjabi', native: 'ਪੰਜਾਬੀ' },
  { code: 'gu', name: 'Gujarati', native: 'ગુજરાતી' },
  { code: 'te', name: 'Telugu', native: 'తెలుగు' },
  { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ' },
  { code: 'bn', name: 'Bengali', native: 'বাংলা' }
];

export const DEFAULT_FARM_PROFILE = {
  location: 'Nagpur, Maharashtra',
  latitude: 21.1458,
  longitude: 79.0882,
  soilType: 'Black Soil',
  landArea: 5,
  landUnit: 'acres',
  waterAvailability: 'Moderate (Borewell / Seasonal)',
  nitrogen: 140,
  phosphorus: 35,
  potassium: 210,
  soilPH: 6.8,
  previousCrop: 'Soybean',
};

export const INITIAL_FORM_STATE = {
  location: 'Nagpur, Maharashtra',
  soilType: 'Black Soil',
  landArea: 5,
  landUnit: 'Acres',
  cropCycle: '6 Months',
  waterAvailability: 'Medium',
  nitrogen: 140,
  phosphorus: 35,
  potassium: 210,
  ph: 6.8,
  farmingObjective: 'Maximum Profit',
  previousCrop: 'Soybean',
  weather: {
    temperature: 29,
    rainfall: 820,
    condition: 'Partly Cloudy',
    humidity: 65,
    forecast: 'Normal monsoon rainfall expected in late August.'
  }
};

export const INITIAL_HISTORY = [
  {
    id: 'hist-1',
    date: '2026-08-28',
    location: 'Nagpur, Maharashtra',
    soilType: 'Black Soil',
    landArea: 5,
    landUnit: 'Acres',
    cropCycle: '6 Months',
    farmingObjective: 'Maximum Profit',
    topCrop: 'Soybean',
    topScore: 92,
    expectedRevenue: 256500,
    status: 'Completed'
  },
  {
    id: 'hist-2',
    date: '2026-07-15',
    location: 'Indore, Madhya Pradesh',
    soilType: 'Alluvial',
    landArea: 8,
    landUnit: 'Acres',
    cropCycle: '3 Months',
    farmingObjective: 'Short Duration',
    topCrop: 'Green Gram (Moong)',
    topScore: 89,
    expectedRevenue: 400400,
    status: 'Completed'
  },
  {
    id: 'hist-3',
    date: '2026-05-10',
    location: 'Amravati, Maharashtra',
    soilType: 'Black Soil',
    landArea: 4,
    landUnit: 'Acres',
    cropCycle: '6 Months',
    farmingObjective: 'Balanced',
    topCrop: 'Cotton',
    topScore: 86,
    expectedRevenue: 258400,
    status: 'Completed'
  }
];

// Helper to construct local fallback recommendations format
function buildFallbackRecommendations(formData) {
  const locParts = (formData.location || 'Nagpur, Maharashtra').split(',');
  const engineInput = {
    state: locParts[1]?.trim() || 'Maharashtra',
    district: locParts[0]?.trim() || 'Nagpur',
    soilType: (formData.soilType || 'Black Soil').replace(' Soil', ''),
    cropCycle: formData.cropCycle?.includes('3') ? 'Zaid' : formData.cropCycle?.includes('12') ? 'Whole Year' : 'Kharif',
    landArea: String(formData.landUnit).toLowerCase().includes('hect') ? Number(formData.landArea) * 2.471 : Number(formData.landArea || 5),
    waterAvailability: formData.waterAvailability === 'Low' ? 'Rainfed' : formData.waterAvailability === 'High' ? 'Canal' : 'Borewell',
    npk: { n: Number(formData.nitrogen || 140), p: Number(formData.phosphorus || 35), k: Number(formData.potassium || 210) },
    ph: Number(formData.ph || 6.8),
    farmingObjective: formData.farmingObjective || 'Maximum Profit',
    previousCrop: formData.previousCrop || 'Soybean',
    weather: formData.weather
  };
  return generateRecommendations(engineInput);
}

export function FarmProvider({ children }) {
  // Current user state (null if unauthenticated)
  const [user, setUser] = useState(null);
  const [farmProfile, setFarmProfile] = useState(DEFAULT_FARM_PROFILE);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  const [language, setLanguage] = useState('en');
  const [farmForm, setFarmForm] = useState(INITIAL_FORM_STATE);
  const [history, setHistory] = useState(INITIAL_HISTORY);
  const [isGenerating, setIsGenerating] = useState(false);
  const [recommendationError, setRecommendationError] = useState(null);
  const [lastGeneratedTime, setLastGeneratedTime] = useState('Just now');
  const [dataSource, setDataSource] = useState('Demo Data');

  // Subscription state: First 3 recommendations are FREE.
  // Plans: BASIC, INTERMEDIATE, ADVANCE
  const [freeRecommendationsUsed, setFreeRecommendationsUsed] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('farmpro_free_rec_count');
      return stored ? parseInt(stored, 10) : 0;
    }
    return 0;
  });

  const [subscriptionPlan, setSubscriptionPlan] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('farmpro_subscription_plan') || 'FREE';
    }
    return 'FREE';
  });

  // Real backend recommendation results state
  const [recommendationResults, setRecommendationResults] = useState(() => {
    return buildFallbackRecommendations(INITIAL_FORM_STATE);
  });

  // Convert farmProfile into form state format
  const syncFormWithFarmProfile = useCallback((profile) => {
    if (!profile) return;
    setFarmForm(prev => ({
      ...prev,
      location: profile.location || prev.location,
      soilType: profile.soilType || prev.soilType,
      landArea: profile.landArea || prev.landArea,
      landUnit: (profile.landUnit || 'Acres').charAt(0).toUpperCase() + (profile.landUnit || 'acres').slice(1),
      waterAvailability: profile.waterAvailability?.includes('High') ? 'High' : profile.waterAvailability?.includes('Low') ? 'Low' : 'Medium',
      nitrogen: profile.nitrogen ?? prev.nitrogen,
      phosphorus: profile.phosphorus ?? prev.phosphorus,
      potassium: profile.potassium ?? prev.potassium,
      ph: profile.soilPH ?? profile.soilPh ?? prev.ph,
      previousCrop: profile.previousCrop || prev.previousCrop,
    }));
  }, []);

  // Check auth session on startup
  useEffect(() => {
  async function initSession() {
    setIsAuthLoading(true);
    setAuthError(null);

    const token =
      typeof window !== 'undefined'
        ? localStorage.getItem('farmpro_token')
        : null;

    if (!token) {
      setUser(null);
      setFarmProfile(DEFAULT_FARM_PROFILE);
      syncFormWithFarmProfile(DEFAULT_FARM_PROFILE);
      setIsAuthLoading(false);
      return;
    }

    

      try {
        const res = await authAPI.getMe();
        if (res && res.user) {
          setUser(res.user);
          if (res.user.language) setLanguage(res.user.language);
          if (res.user.subscriptionPlan) {
            setSubscriptionPlan(res.user.subscriptionPlan.toUpperCase());
            localStorage.setItem('farmpro_subscription_plan', res.user.subscriptionPlan.toUpperCase());
          }
          if (res.user.freeRecommendationsUsed !== undefined) {
            setFreeRecommendationsUsed(res.user.freeRecommendationsUsed);
            localStorage.setItem('farmpro_free_rec_count', String(res.user.freeRecommendationsUsed));
          }
          if (res.farm) {
            setFarmProfile(res.farm);
            syncFormWithFarmProfile(res.farm);
          }
        }
      } catch (err) {
        console.warn('Initial session check notice:', err.message);
        localStorage.removeItem('farmpro_token');
        setUser(null);
      } finally {
        setIsAuthLoading(false);
      }
    }

    initSession();

    // Listen for 401 token expiry events from apiClient
    const handleAuthExpired = (event) => {
      setUser(null);
      setAuthError(event.detail?.message || 'Session expired. Please log in again.');
    };

    window.addEventListener('farmpro:auth_expired', handleAuthExpired);
    return () => window.removeEventListener('farmpro:auth_expired', handleAuthExpired);
  }, [syncFormWithFarmProfile]);

  // Check data source on mount
  useEffect(() => {
    async function checkDataSource() {
      try {
        const res = await marketAPI.getOverview();
        if (res && res.dataSource) {
          setDataSource(res.dataSource);
        }
      } catch (err) {
        setDataSource('Demo Data');
      }
    }
    checkDataSource();
  }, []);

  // Fetch past recommendations from backend on startup
  useEffect(() => {
    async function loadHistory() {
      try {
        const res = await recommendationsAPI.getHistory();
        if (res && Array.isArray(res.data) && res.data.length > 0) {
          const mappedHistory = res.data.map(item => ({
            id: item._id || item.id,
            rawRecord: item,
            date: new Date(item.createdAt || item.timestamp || Date.now()).toISOString().split('T')[0],
            location: item.farmConditions?.location || item.farmInfo?.location || item.inputParameters?.location || 'Nagpur, Maharashtra',
            soilType: item.farmConditions?.soilType || item.farmInfo?.soilType || item.inputParameters?.soilType || 'Black Soil',
            landArea: item.farmConditions?.landArea || item.farmInfo?.landArea || item.inputParameters?.landArea || 5,
            landUnit: item.farmConditions?.landUnit || item.farmInfo?.landUnit || item.inputParameters?.landUnit || 'Acres',
            cropCycle: item.farmConditions?.cropCycle || item.farmInfo?.cropCycle || item.inputParameters?.cropCycle || '6 Months',
            farmingObjective: item.farmConditions?.farmingObjective || item.farmInfo?.farmingObjective || item.inputParameters?.farmingObjective || 'Maximum Profit',
            topCrop: item.top5?.[0]?.cropName || item.recommendedCrops?.[0]?.cropName || item.top5?.[0]?.crop?.name || 'Soybean',
            topScore: item.top5?.[0]?.score || item.recommendedCrops?.[0]?.score || 92,
            expectedRevenue: item.top5?.[0]?.financials?.totalGrossRevenue || ((item.top5?.[0]?.expectedPrice || 4850) * 45),
            status: 'Completed',
            top5: item.top5 || item.recommendedCrops,
            weather: item.weather || item.weatherInformation,
            marketSummary: item.marketSummary || item.marketInformation,
          }));
          setHistory(prev => {
            const combined = [...mappedHistory, ...prev];
            const unique = [];
            const ids = new Set();
            for (const h of combined) {
              if (!ids.has(h.id)) {
                ids.add(h.id);
              }
              unique.push(h);
            }
            return unique;
          });
        }
      } catch (err) {
        // Safe fallback - offline/in-memory
      }
    }
    loadHistory();
  }, [user]);

  // Update Subscription Plan (Demo Subscription)
  const updateSubscriptionPlan = async (planId) => {
    const normalized = (planId || 'INTERMEDIATE').toUpperCase();
    setSubscriptionPlan(normalized);
    if (typeof window !== 'undefined') {
      localStorage.setItem('farmpro_subscription_plan', normalized);
    }
    if (user) {
      setUser(prev => (prev ? { ...prev, subscriptionPlan: normalized } : null));
    }
    try {
      await subscriptionsAPI.subscribe(normalized);
    } catch (err) {
      console.warn('Subscription backend sync note:', err.message);
    }
    return {
      success: true,
      planId: normalized,
      message: 'Demo subscription — payment integration can be added later.',
    };
  };

  // Determine whether recommendation is allowed based on subscription & free limit (first 3 free)
  const isPaidPlan = ['BASIC', 'INTERMEDIATE', 'ADVANCE', 'PRO', 'ENTERPRISE'].includes(subscriptionPlan.toUpperCase());
  const canRecommend = isPaidPlan || freeRecommendationsUsed < 3;

  // Load a historical recommendation into the active Results view
  const loadHistoryItem = (historyItem) => {
    if (!historyItem) return;
    if (historyItem.rawRecord && historyItem.rawRecord.top5) {
      const recData = {
        topRecommendations: historyItem.rawRecord.top5,
        allResults: historyItem.rawRecord.allRanked || historyItem.rawRecord.top5,
        cautionedCrops: historyItem.rawRecord.cautionedCrops || [],
        locationAnalysis: historyItem.rawRecord.locationAnalysis || { location: historyItem.location, climateRisk: 'Low' },
        weather: historyItem.rawRecord.weather || historyItem.rawRecord.weatherInformation,
        marketSummary: historyItem.rawRecord.marketSummary || historyItem.rawRecord.marketInformation,
        recommendationId: historyItem.id,
        farmConditions: historyItem.rawRecord.farmConditions || historyItem.rawRecord.inputParameters,
        totalEvaluated: historyItem.rawRecord.totalEvaluated || 5,
        generatedAt: historyItem.date,
      };
      setRecommendationResults(recData);
    } else {
      const generated = buildFallbackRecommendations({
        location: historyItem.location,
        soilType: historyItem.soilType,
        landArea: historyItem.landArea,
        landUnit: historyItem.landUnit,
        cropCycle: historyItem.cropCycle,
        farmingObjective: historyItem.farmingObjective,
      });
      setRecommendationResults(generated);
    }
  };

  // Handle recommendation generation triggered from form (Connecting to POST /api/recommendations)
  const triggerRecommendation = async (formData) => {
    // Check subscription gate: First 3 recommendations are FREE
    if (!isPaidPlan && freeRecommendationsUsed >= 3) {
      setRecommendationError('Free recommendation limit reached (3 of 3 audits used). Please choose a subscription plan (BASIC, INTERMEDIATE, ADVANCE) to continue.');
      return {
        success: false,
        limitReached: true,
        freeRecommendationsUsed,
        freeRecommendationsAllowed: 3,
        error: 'Free recommendation limit reached (3 of 3 audits used). Please choose a subscription plan (BASIC, INTERMEDIATE, ADVANCE) to continue.',
      };
    }

    setIsGenerating(true);
    setRecommendationError(null);
    setFarmForm(formData);

    let backendId = `hist-${Date.now()}`;
    let realResults = null;

    try {
      // 1. Call real backend Express API: POST /api/recommendations
      const backendRes = await recommendationsAPI.generate(formData);

      if (backendRes && backendRes.limitReached) {
        setIsGenerating(false);
        setRecommendationError(backendRes.error);
        return {
          success: false,
          limitReached: true,
          error: backendRes.error,
        };
      }

      if (backendRes && backendRes.success && Array.isArray(backendRes.top5) && backendRes.top5.length > 0) {
        backendId = backendRes.recommendationId || backendId;
        
        // Normalize structure to ensure all UI components receive complete data
        const topRecommendations = backendRes.top5.map(item => ({
          ...item,
          crop: item.crop || CROPS_DATABASE.find(c => c.name.toLowerCase() === item.cropName?.toLowerCase()) || {
            id: item.cropId || 'crop-1',
            name: item.cropName,
            localName: item.crop?.localName || 'Regional Crop',
            category: item.crop?.category || 'Oilseed',
            currentPrice: item.currentPrice,
            expectedPrice: item.expectedPrice,
            msp: item.crop?.msp || 4892,
            durationDays: item.cropCycle,
            deficitPercentage: item.crop?.deficitPercentage || -15,
            supplyStatus: item.shortage,
            waterNeeds: item.waterRequirement,
            climateRisk: item.climateRisk,
            inputCostPerAcre: item.seedCost * 4,
            yieldPerAcre: 10,
          },
          overallScore: item.score || item.overallScore || 90,
          recommendationScore: item.score || item.recommendationScore || 90,
          agronomic: item.agronomic || {
            score: parseInt(item.soilSuitability) || 90,
            isFeasible: true,
            pros: [item.reason || 'Favorable soil compatibility.'],
            cons: [],
            breakdown: { soilType: 90, water: 85, ph: 90 }
          },
          market: item.market || {
            score: 88,
            pros: [item.opportunity || 'Strong market demand and shortage.'],
            cons: []
          },
          climate: item.climate || {
            climateScore: 85,
            riskLevel: item.climateRisk || 'Low',
            riskScore: 20
          },
          financials: item.financials || {
            acres: formData.landArea || 5,
            yieldPerAcre: 10,
            totalYieldQuintals: (formData.landArea || 5) * 10,
            inputCostPerAcre: 15000,
            totalInputCost: (formData.landArea || 5) * 15000,
            totalGrossRevenue: (formData.landArea || 5) * 10 * item.expectedPrice,
            totalNetProfit: ((formData.landArea || 5) * 10 * item.expectedPrice) - ((formData.landArea || 5) * 15000),
            netProfitPerAcre: Math.round((((formData.landArea || 5) * 10 * item.expectedPrice) - ((formData.landArea || 5) * 15000)) / (formData.landArea || 5)),
            roi: 120
          }
        }));

        const allResults = (backendRes.allRanked || backendRes.top5).map(item => ({
          ...item,
          crop: item.crop || CROPS_DATABASE.find(c => c.name.toLowerCase() === (item.cropName || item.crop?.name)?.toLowerCase()) || item.crop,
          overallScore: item.score || item.overallScore || 90,
          agronomic: item.agronomic || { score: parseInt(item.soilSuitability) || 85, isFeasible: true, pros: [], cons: [] },
          market: item.market || { score: 85, pros: [], cons: [] },
          climate: item.climate || { climateScore: 80, riskLevel: item.climateRisk || 'Low', riskScore: 25 },
          financials: item.financials || {
            acres: formData.landArea || 5,
            netProfitPerAcre: 28000,
            totalGrossRevenue: 240000,
            totalInputCost: 65000,
            totalNetProfit: 175000,
            roi: 115
          }
        }));

        const cautionedCrops = backendRes.cautionedCrops || allResults.filter(
          item => !item.agronomic?.isFeasible || item.overallScore < 65 || (item.crop?.deficitPercentage || 0) > 10
        );

        realResults = {
          topRecommendations,
          allResults,
          cautionedCrops,
          locationAnalysis: backendRes.locationAnalysis || {
            location: formData.location,
            climateRisk: 'Low',
            weatherSummary: '28°C • Partly Cloudy'
          },
          weather: backendRes.weather || formData.weather,
          marketSummary: backendRes.marketSummary,
          recommendationId: backendId,
          dataSource: backendRes.dataSource || (backendRes.isDemo ? 'Demo Data' : 'Live Market Data'),
          farmConditions: formData,
          totalEvaluated: backendRes.totalEvaluated || allResults.length,
          generatedAt: new Date().toISOString()
        };

        setRecommendationResults(realResults);
        if (backendRes.dataSource) {
          setDataSource(backendRes.dataSource);
        }
      }
    } catch (err) {
      console.warn('Backend recommendation notice, activating resilient fallback engine:', err.message);
      setRecommendationError(err.message);
      // Resilient fallback with local engine
      const localResults = buildFallbackRecommendations(formData);
      realResults = localResults;
      setRecommendationResults(localResults);
    }

    // Increment free count if on free tier
    if (!isPaidPlan) {
      const updatedCount = freeRecommendationsUsed + 1;
      setFreeRecommendationsUsed(updatedCount);
      if (typeof window !== 'undefined') {
        localStorage.setItem('farmpro_free_rec_count', String(updatedCount));
      }
      if (user) {
        setUser(prev => (prev ? { ...prev, freeRecommendationsUsed: updatedCount } : null));
      }
    }

    const topItem = realResults?.topRecommendations?.[0] || realResults?.top5?.[0];
    const topCropName = topItem?.crop?.name || topItem?.cropName || 'Soybean';
    const topScoreVal = topItem?.overallScore || topItem?.score || 94;
    const topRevVal = topItem?.financials?.totalGrossRevenue || 250000;

    // Create a new history entry
    const newEntry = {
      id: backendId,
      rawRecord: realResults,
      date: new Date().toISOString().split('T')[0],
      location: formData.location,
      soilType: formData.soilType,
      landArea: formData.landArea,
      landUnit: formData.landUnit,
      cropCycle: formData.cropCycle,
      farmingObjective: formData.farmingObjective,
      topCrop: topCropName,
      topScore: topScoreVal,
      expectedRevenue: topRevVal,
      status: 'Completed',
      top5: realResults?.topRecommendations || realResults?.top5,
      weather: realResults?.weather,
      marketSummary: realResults?.marketSummary,
    };

    setHistory(prev => [newEntry, ...prev]);
    setLastGeneratedTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));

    // Small timeout for smooth animation
    await new Promise(resolve => setTimeout(resolve, 300));
    setIsGenerating(false);
    return realResults;
  };

  // Login handler
  const loginUser = (userData, token = null, farm = null) => {
    if (token) {
      localStorage.setItem('farmpro_token', token);
    }
    setUser(userData);
    setAuthError(null);
    if (farm) {
      setFarmProfile(farm);
      syncFormWithFarmProfile(farm);
    }
  };

  // Login with credentials (calls backend API)
  const loginWithCredentials = async (email, password) => {
    setIsAuthLoading(true);
    setAuthError(null);
    try {
      const res = await authAPI.login({ email, password });
      if (res && res.user) {
        if (res.token) {
          localStorage.setItem('farmpro_token', res.token);
        }
        setUser(res.user);
        if (res.user.language) setLanguage(res.user.language);
        if (res.farm) {
          setFarmProfile(res.farm);
          syncFormWithFarmProfile(res.farm);
        }
        return { success: true, user: res.user };
      }
      throw new Error('Invalid response from server');
    } catch (err) {
      const msg = err.message || 'Invalid email or password';
      setAuthError(msg);
      throw err;
    } finally {
      setIsAuthLoading(false);
    }
  };

  // Register with full fields
  const registerNewUser = async (registrationData) => {
    setIsAuthLoading(true);
    setAuthError(null);
    try {
      const res = await authAPI.register(registrationData);
      if (res && res.user) {
        if (res.token) {
          localStorage.setItem('farmpro_token', res.token);
        }
        setUser(res.user);
        if (res.farm) {
          setFarmProfile(res.farm);
          syncFormWithFarmProfile(res.farm);
        }
        return { success: true, user: res.user };
      }
      throw new Error('Registration failed');
    } catch (err) {
      const msg = err.message || 'Failed to register account';
      setAuthError(msg);
      throw err;
    } finally {
      setIsAuthLoading(false);
    }
  };

  // Update profile
  const updateFarmProfileData = async (updatedData) => {
    try {
      const res = await farmAPI.updateMyFarm(updatedData);
      if (res && res.farm) {
        setFarmProfile(res.farm);
        syncFormWithFarmProfile(res.farm);
        return { success: true, farm: res.farm };
      }
    } catch (err) {
      // Offline fallback
      setFarmProfile(prev => ({ ...prev, ...updatedData }));
      syncFormWithFarmProfile({ ...farmProfile, ...updatedData });
      return { success: true, farm: { ...farmProfile, ...updatedData } };
    }
  };

  const logoutUser = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('farmpro_token');
    }
    setUser(null);
    setAuthError(null);
  };

  const value = {
    cropsDatabase: CROPS_DATABASE,
    user,
    farmProfile,
    isAuthLoading,
    authError,
    setAuthError,
    loginUser,
    loginWithCredentials,
    registerNewUser,
    updateFarmProfileData,
    logoutUser,
    language,
    setLanguage,
    farmForm,
    setFarmForm,
    syncFormWithFarmProfile,
    recommendationResults,
    triggerRecommendation,
    isGenerating,
    recommendationError,
    history,
    loadHistoryItem,
    lastGeneratedTime,
    dataSource,
    setDataSource,
    // Subscription & Free Tier tracking
    freeRecommendationsUsed,
    freeRecommendationsAllowed: 3,
    freeRemaining: Math.max(0, 3 - freeRecommendationsUsed),
    subscriptionPlan,
    isPaidPlan,
    canRecommend,
    updateSubscriptionPlan,
  };

  return (
    <FarmContext.Provider value={value}>
      {children}
    </FarmContext.Provider>
  );
}

export function useFarm() {
  const context = useContext(FarmContext);
  if (!context) {
    throw new Error('useFarm must be used within a FarmProvider');
  }
  return context;
}

export default FarmContext;
