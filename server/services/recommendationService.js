import { isDbConnected } from '../config/db.js';
import { Crop, inMemoryCrops } from '../models/Crop.js';
import { Recommendation, inMemoryRecommendations } from '../models/Recommendation.js';
import { getRegionalWeather, calculateClimateRisk } from './weatherService.js';
import { getMarketData } from './marketService.js';
import { CROPS_DATABASE } from '../../src/data/cropDatabase.js';
import { 
  calculateStockShortageScore,
  calculatePriceGrowthScore,
  calculateSoilMatchScore,
  calculateSeedCostScore,
  calculateWaterRequirementScore,
  calculateClimateRiskScore,
  normalizeValue,
  EPSILON
} from '../utils/cropScoring.js';

/**
 * Validates and normalizes farmer input fields
 */
export function validateAndNormalizeInputs(rawInputs = {}) {
  const errors = [];

  const location = typeof rawInputs.location === 'string' && rawInputs.location.trim() !== ''
    ? rawInputs.location.trim()
    : 'Nagpur, Maharashtra';

  const soilType = typeof rawInputs.soilType === 'string' && rawInputs.soilType.trim() !== ''
    ? rawInputs.soilType.trim()
    : 'Black Soil';

  let landArea = Number(rawInputs.landArea);
  if (isNaN(landArea) || landArea <= 0) {
    landArea = 5;
  }

  const landUnit = typeof rawInputs.landUnit === 'string' && rawInputs.landUnit.toLowerCase().includes('hect')
    ? 'Hectares'
    : 'Acres';

  // Effective acres for calculation
  const effectiveAcres = landUnit === 'Hectares' ? landArea * 2.471 : landArea;

  const waterAvailability = typeof rawInputs.waterAvailability === 'string' && rawInputs.waterAvailability.trim() !== ''
    ? rawInputs.waterAvailability.trim()
    : 'Medium';

  let nitrogen = Number(rawInputs.nitrogen);
  if (isNaN(nitrogen) || nitrogen < 0) nitrogen = 140;

  let phosphorus = Number(rawInputs.phosphorus);
  if (isNaN(phosphorus) || phosphorus < 0) phosphorus = 35;

  let potassium = Number(rawInputs.potassium);
  if (isNaN(potassium) || potassium < 0) potassium = 210;

  let soilPH = Number(rawInputs.ph ?? rawInputs.soilPH ?? rawInputs.soilPh);
  if (isNaN(soilPH) || soilPH < 3 || soilPH > 11) soilPH = 6.8;

  const cropCycle = typeof rawInputs.cropCycle === 'string' && rawInputs.cropCycle.trim() !== ''
    ? rawInputs.cropCycle.trim()
    : '6 Months';

  const farmingObjective = typeof rawInputs.farmingObjective === 'string' && rawInputs.farmingObjective.trim() !== ''
    ? rawInputs.farmingObjective.trim()
    : 'Maximum Profit';

  const previousCrop = typeof rawInputs.previousCrop === 'string' && rawInputs.previousCrop.trim() !== ''
    ? rawInputs.previousCrop.trim()
    : 'Soybean';

  return {
    valid: errors.length === 0,
    errors,
    data: {
      location,
      soilType,
      landArea,
      landUnit,
      effectiveAcres: Number(effectiveAcres.toFixed(2)),
      waterAvailability,
      nitrogen,
      phosphorus,
      potassium,
      soilPH: Number(soilPH.toFixed(1)),
      cropCycle,
      farmingObjective,
      previousCrop,
      weather: rawInputs.weather || null,
    }
  };
}

/**
 * Generate Top 5 recommendations orchestrating:
 * Input Validation -> Location Analysis -> Market Data -> Weather Data -> Soil Suitability -> 6 Scoring Factors -> Rank -> Return Top 5
 */
export async function generateCropRecommendations(rawInputs = {}, userId = null) {
  // 1. Validate and normalize inputs
  const validation = validateAndNormalizeInputs(rawInputs);
  const farmConditions = validation.data;

  // 2. Fetch Weather Data & Climate Risk for location
  let weatherResult = null;
  try {
    weatherResult = await getRegionalWeather(farmConditions.location);
  } catch (wErr) {
    console.warn('Weather service notice, using fallback baseline:', wErr.message);
    const risk = calculateClimateRisk({ temperature: 28, rainfall: 750, humidity: 65, windSpeed: 12 });
    weatherResult = {
      success: true,
      dataSource: 'Demo Weather Data',
      isDemo: true,
      weather: {
        temperature: 28,
        tempMin: 23,
        tempMax: 33,
        humidity: 65,
        rainfall: 750,
        precipitationMm: 12.0,
        condition: 'Partly Cloudy',
        windSpeed: 12,
        climateRisk: risk.riskLevel,
        advisory: risk.advisory,
      }
    };
  }

  const weather = weatherResult?.weather || {};
  farmConditions.weather = weather;

  // 3. Fetch APMC Mandi Market Data
  let marketResult = null;
  try {
    marketResult = await getMarketData();
  } catch (mErr) {
    console.warn('Market service notice, using local database:', mErr.message);
  }

  const marketList = marketResult?.data || [];
  const marketSummary = marketResult?.summary || {
    totalCommodities: CROPS_DATABASE.length,
    averagePriceGrowthPercent: 14.5,
    dataSource: 'Demo Market Data',
    isDemo: true,
  };

  // 4. Candidate Crops Pool - merge base crop knowledge with latest mandi price / arrival metrics
  let cropsPool = CROPS_DATABASE.map(baseCrop => {
    const liveMkt = marketList.find(m => m.name.toLowerCase() === baseCrop.name.toLowerCase());
    return {
      ...baseCrop,
      currentPrice: liveMkt?.currentPrice || baseCrop.currentPrice || 4200,
      expectedPrice: liveMkt?.expectedPrice || baseCrop.expectedPrice || 4850,
      expectedFuturePrice: liveMkt?.expectedFuturePrice || liveMkt?.expectedPrice || baseCrop.expectedPrice || 4850,
      deficitPercentage: liveMkt?.deficitPercentage ?? baseCrop.deficitPercentage ?? 0,
      supplyStatus: liveMkt?.shortageStatus || baseCrop.supplyStatus || 'Balanced',
      marketArrivals: liveMkt?.marketArrivals || baseCrop.marketArrivals || 2400,
      currentStockTonnes: liveMkt?.currentStock || baseCrop.currentStockTonnes || 12000,
      normalStockTonnes: liveMkt?.normalStock || baseCrop.normalStockTonnes || 18000,
      primaryMandi: liveMkt?.primaryMandi || baseCrop.primaryMandi || 'Nagpur APMC',
      regionalMandis: liveMkt?.regionalMarkets || baseCrop.regionalMandis || [],
    };
  });

  // 5. Calculate 6 Scoring Factors and Final Composite Scores for every crop
  const scoredCrops = cropsPool.map(crop => {
    // 6-Factor Calculations
    const stockShortageScore = calculateStockShortageScore(crop, cropsPool, null, EPSILON);
    const priceGrowthScore = calculatePriceGrowthScore(crop, cropsPool, null, EPSILON);
    const soilMatchScore = calculateSoilMatchScore(crop, farmConditions, EPSILON);

    const seedCostScore = calculateSeedCostScore(crop, cropsPool, null, EPSILON);
    const waterRequirementScore = calculateWaterRequirementScore(crop, farmConditions, EPSILON);
    const climateRiskScore = calculateClimateRiskScore(crop, weather, EPSILON);

    // Numerator & Denominator
    const numerator = stockShortageScore * priceGrowthScore * soilMatchScore;
    const rawDenominator = seedCostScore * waterRequirementScore * climateRiskScore;
    const safeDenominator = Math.max(rawDenominator, EPSILON * EPSILON * EPSILON);

    let rawScore = numerator / safeDenominator;
    if (isNaN(rawScore) || !isFinite(rawScore) || rawScore < 0) {
      rawScore = EPSILON;
    }

    // Calibrated 0-100 Farmer Opportunity Score
    const calibratedScore = Math.round(
      Math.min(99, Math.max(15, 30 + Math.log10(Math.max(0.1, rawScore) + 0.9) * 45))
    );

    // Dynamic Financial Calculations based on farmer's effective acreage
    const acres = farmConditions.effectiveAcres || 5;
    const currentPrice = crop.currentPrice || 4000;
    const expectedPrice = crop.expectedPrice || 4800;
    const yieldPerAcre = crop.yieldPerAcre || 10;
    const totalYieldQuintals = Number((yieldPerAcre * acres).toFixed(1));
    const inputCostPerAcre = crop.inputCostPerAcre || 15000;
    const totalInputCost = Math.round(inputCostPerAcre * acres);
    const totalGrossRevenue = Math.round(totalYieldQuintals * expectedPrice);
    const totalNetProfit = totalGrossRevenue - totalInputCost;
    const netProfitPerAcre = Math.round(totalNetProfit / (acres || 1));
    const roi = totalInputCost > 0 ? Math.round(((totalNetProfit) / totalInputCost) * 100) : 100;

    const growthNum = currentPrice > 0 ? Number((((expectedPrice - currentPrice) / currentPrice) * 100).toFixed(1)) : 0;
    const growthStr = growthNum >= 0 ? `+${growthNum}%` : `${growthNum}%`;

    const deficit = crop.deficitPercentage || 0;
    const shortageStr = deficit < 0 ? `Deficit (${Math.abs(deficit)}%)` : deficit > 10 ? `Surplus (+${deficit}%)` : 'Balanced';

    const agronomicScore = Math.round(soilMatchScore * 100);
    const marketScore = Math.round(
      Math.min(98, Math.max(20, (stockShortageScore * 0.45 + priceGrowthScore * 0.55) * 100))
    );
    const climateScore = Math.round(Math.max(20, (1 - climateRiskScore) * 100));

    // Agronomic and Market explainability pros/cons
    const agronomicPros = [];
    const agronomicCons = [];
    if (agronomicScore >= 80) {
      agronomicPros.push(`Excellent match for ${farmConditions.soilType} with NPK (${farmConditions.nitrogen}-${farmConditions.phosphorus}-${farmConditions.potassium}).`);
    } else {
      agronomicCons.push(`Marginal match with ${farmConditions.soilType}; requires careful soil conditioning.`);
    }

    if (String(crop.waterNeeds).toLowerCase().includes('high') && farmConditions.waterAvailability === 'Low') {
      agronomicCons.push('High water consumption conflicts with rainfed/low water setup.');
    } else {
      agronomicPros.push(`Water consumption (${crop.waterNeeds}) aligns well with your ${farmConditions.waterAvailability} water availability.`);
    }

    const marketPros = [];
    const marketCons = [];
    if (deficit < -5) {
      marketPros.push(`${Math.abs(deficit)}% regional supply deficit driving strong bidding at ${crop.primaryMandi}.`);
    } else if (deficit > 10) {
      marketCons.push(`Supply surplus (+${deficit}%) creates potential post-harvest price glut risk.`);
    }
    if (growthNum > 10) {
      marketPros.push(`Projected ${growthStr} price upside by harvest window.`);
    } else if (growthNum < 0) {
      marketCons.push(`Flat or bearish price momentum predicted.`);
    }

    const opportunity = `Estimated opportunity: Mandi supply ${shortageStr.toLowerCase()} with projected ${growthStr} price upside at harvest.`;
    const confidence = `Indicative ${Math.min(96, Math.max(72, calibratedScore))}% (Based on available market data)`;
    const reason = `Estimated opportunity based on available market data: Favorable price trajectory (${growthStr}) and strong soil suitability (${agronomicScore}%), balanced against manageable input costs.`;

    return {
      crop,
      cropId: crop.id || crop.name.toLowerCase().replace(/\s+/g, '-'),
      cropName: crop.name,
      overallScore: calibratedScore,
      recommendationScore: calibratedScore,
      score: calibratedScore,
      rawScore: Number(rawScore.toFixed(4)),
      currentPrice,
      expectedPrice,
      growth: growthStr,
      growthNum,
      expectedPriceGrowth: growthStr,
      shortage: shortageStr,
      stockShortage: shortageStr,
      soilSuitability: `${agronomicScore}%`,
      seedCost: crop.seedCostPerAcre || Math.round(inputCostPerAcre * 0.25),
      waterRequirement: crop.waterNeeds || 'Moderate',
      climateRisk: crop.climateRisk || weather.climateRisk || 'Low',
      cropCycle: crop.durationDays || '90-110 days',
      opportunity,
      confidence,
      reason,
      recommendationReason: crop.recommendationReason || reason,
      factors: {
        stockShortageScore: Number(stockShortageScore.toFixed(4)),
        priceGrowthScore: Number(priceGrowthScore.toFixed(4)),
        soilMatchScore: Number(soilMatchScore.toFixed(4)),
        seedCostScore: Number(seedCostScore.toFixed(4)),
        waterRequirementScore: Number(waterRequirementScore.toFixed(4)),
        climateRiskScore: Number(climateRiskScore.toFixed(4)),
        numerator: Number(numerator.toFixed(6)),
        denominator: Number(safeDenominator.toFixed(6)),
      },
      agronomic: {
        score: agronomicScore,
        isFeasible: agronomicScore >= 60 && !(String(crop.waterNeeds).toLowerCase().includes('high') && farmConditions.waterAvailability === 'Low'),
        pros: agronomicPros,
        cons: agronomicCons,
        breakdown: {
          soilType: agronomicScore,
          water: farmConditions.waterAvailability === 'High' ? 95 : farmConditions.waterAvailability === 'Medium' ? 82 : 65,
          ph: Math.abs(farmConditions.soilPH - 6.8) < 1.0 ? 94 : 78,
        }
      },
      market: {
        score: marketScore,
        pros: marketPros.length > 0 ? marketPros : ['Steady demand across central mandi hubs.'],
        cons: marketCons.length > 0 ? marketCons : ['Normal seasonal price fluctuations.'],
      },
      climate: {
        climateScore,
        riskLevel: crop.climateRisk || weather.climateRisk || 'Low',
        riskScore: climateRiskScore > 0.6 ? 75 : climateRiskScore > 0.35 ? 45 : 20,
      },
      financials: {
        acres,
        yieldPerAcre,
        totalYieldQuintals,
        inputCostPerAcre,
        totalInputCost,
        totalGrossRevenue,
        totalNetProfit,
        netProfitPerAcre,
        roi,
      }
    };
  });

  // 6. Rank Crops descending by composite score / raw score
  scoredCrops.sort((a, b) => b.rawScore - a.rawScore);
  scoredCrops.forEach((item, idx) => {
    item.rank = idx + 1;
  });

  // 7. Extract Top 5 and Cautioned / Why Not subsets
  const top5 = scoredCrops.slice(0, 5);
  const cautionedCrops = scoredCrops.filter(
    item => !item.agronomic.isFeasible || item.overallScore < 65 || (item.crop.deficitPercentage || 0) > 10
  );

  // 8. Construct Persistent Record
  const mappedTop5 = top5.map(item => ({
    rank: item.rank,
    cropId: item.cropId,
    cropName: item.cropName,
    score: item.score,
    rawScore: item.rawScore,
    currentPrice: item.currentPrice,
    expectedPrice: item.expectedPrice,
    growth: item.growth,
    shortage: item.shortage,
    soilSuitability: item.soilSuitability,
    seedCost: item.seedCost,
    waterRequirement: item.waterRequirement,
    climateRisk: item.climateRisk,
    cropCycle: item.cropCycle,
    opportunity: item.opportunity,
    confidence: item.confidence,
    reason: item.reason,
    recommendationReason: item.recommendationReason,
    factors: item.factors,
    agronomic: item.agronomic,
    market: item.market,
    climate: item.climate,
    financials: item.financials,
    crop: item.crop,
  }));

  const recommendationRecord = {
    userId,
    // Farm Information Used & Input Parameters
    farmInfo: {
      location: farmConditions.location,
      landArea: farmConditions.landArea,
      landUnit: farmConditions.landUnit,
      soilType: farmConditions.soilType,
      ph: farmConditions.soilPH,
      nitrogen: farmConditions.nitrogen,
      phosphorus: farmConditions.phosphorus,
      potassium: farmConditions.potassium,
      waterAvailability: farmConditions.waterAvailability,
      cropCycle: farmConditions.cropCycle,
      farmingObjective: farmConditions.farmingObjective,
      previousCrop: farmConditions.previousCrop,
    },
    inputParameters: {
      location: farmConditions.location,
      soilType: farmConditions.soilType,
      landArea: farmConditions.landArea,
      landUnit: farmConditions.landUnit,
      cropCycle: farmConditions.cropCycle,
      waterAvailability: farmConditions.waterAvailability,
      nitrogen: farmConditions.nitrogen,
      phosphorus: farmConditions.phosphorus,
      potassium: farmConditions.potassium,
      ph: farmConditions.soilPH,
      farmingObjective: farmConditions.farmingObjective,
      previousCrop: farmConditions.previousCrop,
    },
    farmConditions,
    // Recommended Crops
    recommendedCrops: mappedTop5,
    top5: mappedTop5,
    // Scores
    scores: {
      topScore: mappedTop5[0]?.score || 90,
      averageScore: Math.round(mappedTop5.reduce((sum, c) => sum + (c.score || 0), 0) / (mappedTop5.length || 1)),
      totalEvaluated: scoredCrops.length,
    },
    // Market Information
    marketInformation: {
      primaryMandi: marketSummary?.primaryMandi || 'Nagpur APMC Mandi',
      modalPriceAverage: marketSummary?.modalPriceAverage || 4600,
      stateAverage: marketSummary?.stateAverage || 4500,
      deficitCropsCount: marketSummary?.shortageCount || 4,
      surplusCropsCount: marketSummary?.surplusCount || 2,
      marketSentiment: marketSummary?.sentiment || 'Bullish on Pulses & Oilseeds',
      dataSource: marketResult?.dataSource || 'Live APMC Feed',
    },
    // Weather Information
    weatherInformation: {
      temperature: weather.temperature || 28,
      tempMin: weather.tempMin || 23,
      tempMax: weather.tempMax || 33,
      humidity: weather.humidity || 65,
      rainfall: weather.rainfall || 750,
      condition: weather.condition || 'Partly Cloudy',
      climateRisk: weather.climateRisk || 'Low',
      forecast: weather.forecast || 'Normal monsoon conditions with optimal soil moisture.',
    },
    allRanked: scoredCrops,
    cautionedCrops,
    totalEvaluated: scoredCrops.length,
    locationAnalysis: {
      location: farmConditions.location,
      coordinates: weatherResult?.coordinates || { lat: 21.1458, lon: 79.0882 },
      climateRisk: weather.climateRisk || 'Low',
      weatherSummary: `${weather.temperature || 28}°C • ${weather.condition || 'Partly Cloudy'} • ${weather.humidity || 65}% Humidity`,
    },
    weather,
    marketSummary,
    engineVersion: '6-factor-v2-connected',
    timestamp: new Date(),
    createdAt: new Date(),
  };

  let savedRecord = null;
  if (isDbConnected()) {
    try {
      savedRecord = await Recommendation.create(recommendationRecord);
    } catch (saveErr) {
      console.warn('Failed to persist recommendation to DB:', saveErr.message);
    }
  }

  if (!savedRecord) {
    const memoryRecord = {
      _id: `rec_${Date.now()}`,
      id: `rec_${Date.now()}`,
      ...recommendationRecord,
    };
    inMemoryRecommendations.unshift(memoryRecord);
    savedRecord = memoryRecord;
  }

  const isDemo = weatherResult?.isDemo || marketResult?.isDemo || process.env.DEMO_MODE === 'true';
  const dataSource = isDemo ? 'Demo Data' : 'Live Market Data';

  return {
    success: true,
    dataSource,
    isDemo,
    recommendationId: savedRecord._id || savedRecord.id,
    top5: savedRecord.top5,
    topRecommendations: savedRecord.top5,
    allRanked: scoredCrops,
    allResults: scoredCrops,
    cautionedCrops,
    totalEvaluated: scoredCrops.length,
    locationAnalysis: savedRecord.locationAnalysis,
    weather: savedRecord.weather,
    marketSummary,
    farmConditions: savedRecord.farmConditions,
    createdAt: savedRecord.createdAt,
  };
}

/**
 * Fetch recommendation history
 */
export async function getRecommendationsHistory(userId = null, limit = 10) {
  if (isDbConnected()) {
    try {
      const query = userId ? { userId } : {};
      const history = await Recommendation.find(query)
        .sort({ createdAt: -1 })
        .limit(limit)
        .lean();
      return history;
    } catch (err) {
      console.warn('Failed to query DB for recommendations history:', err.message);
    }
  }

  const filtered = userId
    ? inMemoryRecommendations.filter(r => String(r.userId) === String(userId))
    : inMemoryRecommendations;
  return filtered.slice(0, limit);
}

/**
 * Fetch recommendation by ID
 */
export async function getRecommendationById(id) {
  if (isDbConnected()) {
    try {
      const rec = await Recommendation.findById(id).lean();
      if (rec) return rec;
    } catch (err) {
      // Ignored for fallback check
    }
  }

  return inMemoryRecommendations.find(r => String(r._id) === String(id) || String(r.id) === String(id)) || null;
}

export default {
  validateAndNormalizeInputs,
  generateCropRecommendations,
  getRecommendationsHistory,
  getRecommendationById,
};
