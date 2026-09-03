/**
 * FarmPro Centralized & Explainable Recommendation Engine
 * Evaluates dual pillars: Agronomic Feasibility + Market Opportunity + Climate Resilience
 */

import { CROPS_DATABASE } from '../data/cropDatabase.js';
import { 
  calculateCropScore,
  calculateStockShortageScore,
  calculatePriceGrowthScore,
  calculateSoilMatchScore,
  calculateSeedCostScore,
  calculateWaterRequirementScore,
  calculateClimateRiskScore
} from '../../server/utils/cropScoring.js';

/**
 * Evaluates agronomic match between farm conditions and crop requirements
 * @returns {object} { score (0-100), reasons, isFeasible }
 */
export function evaluateAgronomics(crop, farm) {
  let score = 0;
  const pros = [];
  const cons = [];

  // 1. Soil Match (Weight: 30)
  if (crop.soilTypes.includes(farm.soilType)) {
    score += 30;
    pros.push(`Thrives in ${farm.soilType} soil with optimal root aeration.`);
  } else {
    // Partial compatibility check
    score += 10;
    cons.push(`Sub-optimal soil match: Prefers ${crop.soilTypes.slice(0, 2).join(' or ')} over ${farm.soilType}.`);
  }

  // 2. Season / Cycle Match (Weight: 25)
  if (crop.season.includes(farm.cropCycle) || crop.season.includes('Whole Year')) {
    score += 25;
    pros.push(`Perfect fit for the ${farm.cropCycle} seasonal daylight and temperature cycle.`);
  } else {
    score += 4;
    cons.push(`Out-of-season: Typically cultivated during ${crop.season.join('/')}.`);
  }

  // 3. Water Availability Match (Weight: 25)
  const isHighWaterCrop = crop.waterNeeds === 'High';
  const isRainfedFarm = farm.waterAvailability === 'Rainfed';

  if (isHighWaterCrop && isRainfedFarm) {
    score += 2;
    cons.push(`Severe water risk: Needs heavy standing water, while farm is monsoon rainfed.`);
  } else if (crop.waterSources.includes(farm.waterAvailability)) {
    score += 25;
    pros.push(`Water requirements (${crop.waterNeeds}) aligned with your ${farm.waterAvailability} source.`);
  } else {
    score += 15;
    pros.push(`Manageable with ${farm.waterAvailability} under careful irrigation scheduling.`);
  }

  // 4. Weather & Temperature Suitability (Weight: 15)
  const currentTemp = farm.weather?.temperature || 28;
  if (currentTemp >= crop.idealTemp.min && currentTemp <= crop.idealTemp.max) {
    score += 15;
    pros.push(`Current temperature (${currentTemp}°C) within optimal growth window (${crop.idealTemp.min}°C - ${crop.idealTemp.max}°C).`);
  } else {
    const diff = Math.min(Math.abs(currentTemp - crop.idealTemp.min), Math.abs(currentTemp - crop.idealTemp.max));
    const weatherScore = Math.max(4, 15 - diff * 2);
    score += weatherScore;
    cons.push(`Temperature (${currentTemp}°C) slightly deviates from peak ideal range (${crop.idealTemp.min}-${crop.idealTemp.max}°C).`);
  }

  // 5. Optional pH & NPK Suitability (Weight: 5 bonus)
  if (farm.ph) {
    if (farm.ph >= crop.idealPh.min && farm.ph <= crop.idealPh.max) {
      score += 5;
      pros.push(`Soil pH ${farm.ph} matches target range (${crop.idealPh.min} - ${crop.idealPh.max}).`);
    } else {
      cons.push(`Soil pH ${farm.ph} outside optimum range (${crop.idealPh.min} - ${crop.idealPh.max}). Gypsum/lime treatment recommended.`);
    }
  } else {
    score += 3; // Neutral bonus when unmeasured
  }

  const boundedScore = Math.min(100, Math.max(5, Math.round(score)));
  const isFeasible = boundedScore >= 45 && !(isHighWaterCrop && isRainfedFarm);

  return {
    score: boundedScore,
    pros,
    cons,
    isFeasible
  };
}

/**
 * Evaluates market opportunity, price trajectory, supply/demand balance, and profitability
 * @returns {object} { score (0-100), pros, cons, marginPerAcre, roi }
 */
export function evaluateMarket(crop) {
  let score = 0;
  const pros = [];
  const cons = [];

  // 1. Supply Shortage vs Surplus Index (Weight: 35)
  // Negative deficitPercentage means shortage (high market opportunity)
  if (crop.deficitPercentage <= -20) {
    score += 35;
    pros.push(`Critical market deficit of ${Math.abs(crop.deficitPercentage)}% projected at harvest, offering strong pricing power.`);
  } else if (crop.deficitPercentage < 0) {
    score += 28;
    pros.push(`Regional supply deficit (${Math.abs(crop.deficitPercentage)}%) indicates favorable seller market.`);
  } else if (crop.deficitPercentage <= 10) {
    score += 18;
    pros.push(`Balanced market supply; price stability supported by steady consumer absorption.`);
  } else {
    // Serious surplus / glut warning
    score += 4;
    cons.push(`WARNING: Significant regional surplus (${crop.deficitPercentage}% glut risk) expected to depress mandi arrivals.`);
  }

  // 2. Price Trajectory & Harvest Realization (Weight: 25)
  const priceGainPercent = Math.round(((crop.expectedPrice - crop.currentPrice) / crop.currentPrice) * 100);
  if (priceGainPercent > 10) {
    score += 25;
    pros.push(`Strong price upside: Projected harvest price of ₹${crop.expectedPrice.toLocaleString('en-IN')}/qtl (+${priceGainPercent}% over current ₹${crop.currentPrice.toLocaleString('en-IN')}).`);
  } else if (priceGainPercent >= 0) {
    score += 18;
    pros.push(`Stable price forecast near ₹${crop.expectedPrice.toLocaleString('en-IN')}/qtl.`);
  } else {
    score += 4;
    cons.push(`Negative price trajectory: Expected realization drops ${Math.abs(priceGainPercent)}% to ₹${crop.expectedPrice.toLocaleString('en-IN')}/qtl due to arrival pressure.`);
  }

  // 3. Profit Margin & ROI Potential (Weight: 25)
  const grossRevPerAcre = crop.yieldPerAcre * crop.expectedPrice;
  const netProfitPerAcre = grossRevPerAcre - crop.inputCostPerAcre;
  const roiPercent = Math.round((netProfitPerAcre / crop.inputCostPerAcre) * 100);

  if (roiPercent > 120) {
    score += 25;
    pros.push(`Exceptional profitability: Estimated net profit of ₹${Math.round(netProfitPerAcre).toLocaleString('en-IN')}/acre (${roiPercent}% ROI).`);
  } else if (roiPercent > 70) {
    score += 20;
    pros.push(`Healthy profit margin: Estimated net profit of ₹${Math.round(netProfitPerAcre).toLocaleString('en-IN')}/acre (${roiPercent}% ROI).`);
  } else if (roiPercent > 30) {
    score += 14;
    pros.push(`Moderate returns of ₹${Math.round(netProfitPerAcre).toLocaleString('en-IN')}/acre.`);
  } else {
    score += 5;
    cons.push(`Low capital efficiency: Projected profit is only ₹${Math.round(netProfitPerAcre).toLocaleString('en-IN')}/acre (${roiPercent}% ROI) against high input costs.`);
  }

  // 4. Institutional Demand & Support (Weight: 15)
  if (crop.marketDemand === 'High') {
    score += 15;
    pros.push(`High liquidity: High daily mandi turnover with robust buyer competition.`);
  } else if (crop.marketDemand === 'Moderate') {
    score += 10;
  } else {
    score += 4;
    cons.push(`Low buying demand; high risk of distressed sales if arrivals bottleneck.`);
  }

  if (crop.msp > 0 && crop.expectedPrice >= crop.msp) {
    pros.push(`Protected by Govt MSP floor (₹${crop.msp.toLocaleString('en-IN')}/qtl).`);
  }

  const boundedScore = Math.min(100, Math.max(5, Math.round(score)));

  return {
    score: boundedScore,
    pros,
    cons,
    grossRevPerAcre,
    netProfitPerAcre,
    roiPercent
  };
}

/**
 * Evaluates Climate & Weather Risk
 */
export function evaluateClimate(crop, weather) {
  let riskScore = 20; // default low
  const alerts = [];

  if (crop.climateRisk === 'High') {
    riskScore += 35;
    alerts.push('Crop is sensitive to unseasonal rain and pest pressure.');
  } else if (crop.climateRisk === 'Moderate') {
    riskScore += 18;
  }

  if (weather?.riskScore) {
    riskScore = Math.round(riskScore * 0.5 + weather.riskScore * 0.5);
  }

  const climateScore = Math.max(10, 100 - riskScore); // Higher is better / safer

  return {
    climateScore,
    riskScore,
    riskLevel: riskScore < 25 ? 'Low' : riskScore < 45 ? 'Moderate' : 'High',
    alerts
  };
}

/**
 * Main Centralized Recommendation Evaluator
 * Runs all crops through agronomic, market, and climate filters
 */
export function generateRecommendations(farmConditions) {
  const farmArea = Number(farmConditions.landArea) || 4;

  const results = CROPS_DATABASE.map(crop => {
    // Official FarmPro 6-Factor Formula from cropScoring.js
    const scoringResult = calculateCropScore(crop, farmConditions, CROPS_DATABASE);

    const agronomic = evaluateAgronomics(crop, farmConditions);
    const market = evaluateMarket(crop);
    const climate = evaluateClimate(crop, farmConditions.weather);

    // Composite calibrated score
    let overallScore = scoringResult.score;

    // Penalty if agronomics fail severely (cannot grow properly)
    if (!agronomic.isFeasible) {
      overallScore = Math.min(38, overallScore);
    }

    // Financial calculations scaled to the farmer's acreage
    const totalYieldQuintals = Number((crop.yieldPerAcre * farmArea).toFixed(1));
    const totalInputCost = Math.round(crop.inputCostPerAcre * farmArea);
    const totalGrossRevenue = Math.round(totalYieldQuintals * crop.expectedPrice);
    const totalNetProfit = Math.round(totalGrossRevenue - totalInputCost);
    const roi = Math.round((totalNetProfit / totalInputCost) * 100);

    // Identify primary reason tags
    const opportunityTags = [];
    if (market.score >= 80) opportunityTags.push('High Market Upside');
    if (agronomic.score >= 85) opportunityTags.push('Ideal Soil & Climate');
    if (crop.deficitPercentage < -15) opportunityTags.push(`Supply Shortage (${Math.abs(crop.deficitPercentage)}%)`);
    if (climate.riskLevel === 'Low') opportunityTags.push('Low Climate Risk');
    if (crop.deficitPercentage > 20) opportunityTags.push('Market Glut Risk');

    return {
      crop,
      score: overallScore,
      overallScore,
      recommendationScore: overallScore,
      rawScore: scoringResult.rawScore,
      rank: 1, // dynamically updated below
      cropName: crop.name,
      currentPrice: crop.currentPrice,
      expectedPrice: crop.expectedPrice,
      expectedPriceGrowth: scoringResult.growth,
      growth: scoringResult.growth,
      growthNum: scoringResult.growthNum,
      shortage: scoringResult.shortage,
      stockShortage: scoringResult.shortage,
      soilSuitability: `${agronomic.score}%`,
      seedCost: scoringResult.seedCost,
      waterRequirement: scoringResult.waterRequirement,
      climateRisk: scoringResult.climateRisk,
      cropCycle: scoringResult.cropCycle,
      opportunity: scoringResult.opportunity,
      confidence: scoringResult.confidence,
      reason: scoringResult.reason,
      recommendationReason: scoringResult.reason,
      factors: scoringResult.factors,
      agronomic,
      market,
      climate,
      opportunityTags,
      financials: {
        acres: farmArea,
        yieldPerAcre: crop.yieldPerAcre,
        totalYieldQuintals,
        inputCostPerAcre: crop.inputCostPerAcre,
        seedCostPerAcre: scoringResult.seedCost,
        totalInputCost,
        currentPrice: crop.currentPrice,
        expectedPrice: crop.expectedPrice,
        msp: crop.msp,
        grossRevenuePerAcre: market.grossRevPerAcre,
        totalGrossRevenue,
        netProfitPerAcre: market.netProfitPerAcre,
        totalNetProfit,
        roi
      }
    };
  });

  // Sort descending by FarmPro Opportunity Score
  results.sort((a, b) => b.overallScore - a.overallScore);

  // Mark top recommendations vs cautioned crops and assign explicit rank
  const recommendedCrops = results
    .filter(r => r.agronomic.isFeasible && r.overallScore >= 50)
    .map((item, idx) => ({ ...item, rank: idx + 1 }));

  const cautionedCrops = results.filter(r => !r.agronomic.isFeasible || r.overallScore < 50);

  return {
    allResults: results,
    topRecommendations: recommendedCrops.slice(0, 5),
    cautionedCrops: cautionedCrops,
    topPick: recommendedCrops[0] || results[0]
  };
}
