/**
 * FarmPro Central Recommendation Engine
 * Server Utility: cropScoring.js
 * 
 * Formula:
 * Crop Score = (Stock Shortage Score × Future Price Increase Score × Soil Match Score)
 *              /
 *              (Seed Cost Score × Water Requirement Score × Climate Risk Score)
 * 
 * Guarantees:
 * - 0–1 parameter normalization
 * - Safe handling of maxValue === minValue
 * - Zero division prevention with EPSILON = 0.01 floor
 * - Never returns NaN, Infinity, null, or undefined
 * - Transparent and indicative advisory tone
 */

export const EPSILON = 0.01;

/**
 * Normalizes a numerical value into the [0, 1] range.
 * Safely guards against equal min/max, non-numeric inputs, and infinite values.
 * 
 * @param {number|any} value - Raw input value
 * @param {number|any} minValue - Lower boundary
 * @param {number|any} maxValue - Upper boundary
 * @param {number} [epsilon=0.01] - Safe minimum floor
 * @returns {number} Normalized value clamped between 0 and 1
 */
export function normalizeValue(value, minValue, maxValue, epsilon = EPSILON) {
  const eps = typeof epsilon === 'number' && !isNaN(epsilon) ? epsilon : EPSILON;

  // Handle null, undefined, NaN, and invalid numeric states
  if (value === null || value === undefined || isNaN(Number(value))) {
    return eps;
  }
  if (minValue === null || minValue === undefined || isNaN(Number(minValue))) {
    minValue = 0;
  }
  if (maxValue === null || maxValue === undefined || isNaN(Number(maxValue))) {
    maxValue = 1;
  }

  const val = Number(value);
  const min = Number(minValue);
  const max = Number(maxValue);

  // Safely handle maxValue === minValue (no range)
  if (Math.abs(max - min) < 1e-9) {
    return 0.50;
  }

  const normalized = (val - min) / (max - min);

  // Guard against non-finite outcomes
  if (isNaN(normalized) || !isFinite(normalized)) {
    return eps;
  }

  // Clamp strictly between 0 and 1
  return Math.max(0, Math.min(1, Number(normalized.toFixed(4))));
}

/**
 * POSITIVE FACTOR 1: Stock Shortage Score
 * Higher shortage (supply deficit in mandis) indicates pricing power and increases score.
 * 
 * @param {object|number} crop - Crop object or raw shortage percentage
 * @param {Array|number} [allCropsOrMin] - Crops array or minimum shortage bound
 * @param {number} [maxVal] - Maximum shortage bound (if passing bounds)
 * @param {number} [epsilon=0.01] - Floor epsilon
 * @returns {number} Factor score in [epsilon, 1.0]
 */
export function calculateStockShortageScore(crop, allCropsOrMin, maxVal, epsilon = EPSILON) {
  const eps = typeof epsilon === 'number' ? epsilon : EPSILON;
  let shortage = 0;

  if (typeof crop === 'number') {
    shortage = crop;
  } else if (crop && typeof crop === 'object') {
    if (typeof crop.deficitPercentage === 'number') {
      // In agricultural economics: negative deficit = supply deficit (shortage)
      // e.g., -18% deficit means an 18% supply shortage in mandis
      shortage = crop.deficitPercentage < 0 ? Math.abs(crop.deficitPercentage) : -crop.deficitPercentage;
    } else if (crop.normalStockTonnes && crop.currentStockTonnes) {
      shortage = ((crop.normalStockTonnes - crop.currentStockTonnes) / crop.normalStockTonnes) * 100;
    } else if (crop.normalStock && crop.currentStock) {
      shortage = ((crop.normalStock - crop.currentStock) / crop.normalStock) * 100;
    } else if (typeof crop.shortagePercentage === 'number') {
      shortage = crop.shortagePercentage;
    } else {
      shortage = 10; // Neutral default
    }
  }

  // Determine normalization boundaries
  let minShortage = 0;
  let maxShortage = 40;

  if (Array.isArray(allCropsOrMin) && allCropsOrMin.length > 0) {
    const shortages = allCropsOrMin.map(c => {
      if (typeof c === 'number') return c;
      if (typeof c.deficitPercentage === 'number') {
        return c.deficitPercentage < 0 ? Math.abs(c.deficitPercentage) : -c.deficitPercentage;
      }
      return 10;
    });
    minShortage = Math.min(...shortages);
    maxShortage = Math.max(...shortages);
  } else if (typeof allCropsOrMin === 'number' && typeof maxVal === 'number') {
    minShortage = allCropsOrMin;
    maxShortage = maxVal;
  }

  const normalized = normalizeValue(shortage, minShortage, maxShortage, eps);
  // Ensure non-zero positive factor
  return Math.max(eps, Math.min(1, normalized));
}

/**
 * POSITIVE FACTOR 2: Future Price Increase Score
 * Higher expected price increase at harvest increases score.
 * 
 * @param {object|number} crop - Crop object or raw growth percentage
 * @param {Array|number} [allCropsOrMin] - Crops array or minimum growth bound
 * @param {number} [maxVal] - Maximum growth bound
 * @param {number} [epsilon=0.01] - Floor epsilon
 * @returns {number} Factor score in [epsilon, 1.0]
 */
export function calculatePriceGrowthScore(crop, allCropsOrMin, maxVal, epsilon = EPSILON) {
  const eps = typeof epsilon === 'number' ? epsilon : EPSILON;
  let growth = 0;

  if (typeof crop === 'number') {
    growth = crop;
  } else if (crop && typeof crop === 'object') {
    const expected = crop.expectedFuturePrice || crop.expectedPrice;
    if (crop.currentPrice && expected && crop.currentPrice > 0) {
      growth = ((expected - crop.currentPrice) / crop.currentPrice) * 100;
    } else if (typeof crop.expectedPriceGrowth === 'number') {
      growth = crop.expectedPriceGrowth;
    } else if (typeof crop.priceGrowth === 'number') {
      growth = crop.priceGrowth;
    } else {
      growth = 5;
    }
  }

  let minGrowth = -15;
  let maxGrowth = 35;

  if (Array.isArray(allCropsOrMin) && allCropsOrMin.length > 0) {
    const growths = allCropsOrMin.map(c => {
      if (typeof c === 'number') return c;
      if (c.currentPrice && c.expectedPrice && c.currentPrice > 0) {
        return ((c.expectedPrice - c.currentPrice) / c.currentPrice) * 100;
      }
      return 5;
    });
    minGrowth = Math.min(...growths);
    maxGrowth = Math.max(...growths);
  } else if (typeof allCropsOrMin === 'number' && typeof maxVal === 'number') {
    minGrowth = allCropsOrMin;
    maxGrowth = maxVal;
  }

  const normalized = normalizeValue(growth, minGrowth, maxGrowth, eps);
  return Math.max(eps, Math.min(1, normalized));
}

/**
 * POSITIVE FACTOR 3: Soil Match Score
 * Higher agronomic compatibility between farm soil conditions and crop needs increases score.
 * 
 * @param {object|number} crop - Crop object or numeric score
 * @param {object|string} [farmerInputs] - Farm conditions (soilType, ph, npk)
 * @param {number} [epsilon=0.01] - Floor epsilon
 * @returns {number} Factor score in [epsilon, 1.0]
 */
export function calculateSoilMatchScore(crop, farmerInputs, epsilon = EPSILON) {
  const eps = typeof epsilon === 'number' ? epsilon : EPSILON;

  if (typeof crop === 'number') {
    // If passed as 0-100 percentage or 0-1 normalized
    const val = crop > 1 ? crop / 100 : crop;
    return Math.max(eps, Math.min(1, Number(val.toFixed(4))));
  }

  if (!crop || typeof crop !== 'object') {
    return eps;
  }

  let score = 0.40; // Default baseline compatibility
  const rawSoils = crop.suitableSoils || crop.soilTypes || [];
  const cropSoilTypes = Array.isArray(rawSoils) 
    ? rawSoils.map(s => String(s).toLowerCase().replace(' soil', '').trim())
    : [];

  const farmerSoil = typeof farmerInputs === 'string'
    ? farmerInputs.toLowerCase().replace(' soil', '').trim()
    : String(farmerInputs?.soilType || '').toLowerCase().replace(' soil', '').trim();

  // 1. Soil Texture Compatibility Check
  if (farmerSoil && cropSoilTypes.length > 0) {
    const isDirectMatch = cropSoilTypes.some(type => 
      type === farmerSoil || 
      farmerSoil.includes(type) || 
      type.includes(farmerSoil)
    );

    if (isDirectMatch) {
      score = 0.88;
    } else {
      // Partial loamy/clayey crossover
      const isPartiallyCompatible = 
        (farmerSoil.includes('loam') && cropSoilTypes.some(s => s.includes('alluvial') || s.includes('loam'))) ||
        (farmerSoil.includes('clay') && cropSoilTypes.some(s => s.includes('black') || s.includes('clay'))) ||
        (farmerSoil.includes('black') && cropSoilTypes.some(s => s.includes('clay')));

      score = isPartiallyCompatible ? 0.65 : 0.32;
    }
  } else if (cropSoilTypes.length > 0) {
    score = 0.70; // Generic baseline when farmer soil unselected
  }

  // 2. pH Range Fit (Bonus / Penalty)
  const farmerPh = Number(farmerInputs?.ph);
  if (!isNaN(farmerPh) && farmerPh > 0 && crop.idealPh) {
    const { min = 6.0, max = 7.5 } = crop.idealPh;
    if (farmerPh >= min && farmerPh <= max) {
      score += 0.10;
    } else {
      const diff = Math.min(Math.abs(farmerPh - min), Math.abs(farmerPh - max));
      score -= Math.min(0.15, diff * 0.08);
    }
  }

  return Math.max(eps, Math.min(1, Number(score.toFixed(4))));
}

/**
 * NEGATIVE FACTOR 1: Seed / Input Cost Score
 * Higher capital cost per acre reduces score (denominator factor).
 * 
 * @param {object|number} crop - Crop object or numeric seed cost
 * @param {Array|number} [allCropsOrMin] - Crops array or minimum cost bound
 * @param {number} [maxVal] - Maximum cost bound
 * @param {number} [epsilon=0.01] - Floor epsilon (prevents zero division)
 * @returns {number} Factor score in [epsilon, 1.0]
 */
export function calculateSeedCostScore(crop, allCropsOrMin, maxVal, epsilon = EPSILON) {
  const eps = typeof epsilon === 'number' ? epsilon : EPSILON;
  let cost = 3000;

  if (typeof crop === 'number') {
    cost = crop;
  } else if (crop && typeof crop === 'object') {
    if (typeof crop.seedCostPerAcre === 'number') {
      cost = crop.seedCostPerAcre;
    } else if (typeof crop.seedCost === 'number') {
      cost = crop.seedCost;
    } else if (typeof crop.inputCostPerAcre === 'number') {
      cost = crop.inputCostPerAcre * 0.25; // Standard seed proportion
    }
  }

  let minCost = 1500;
  let maxCost = 12000;

  if (Array.isArray(allCropsOrMin) && allCropsOrMin.length > 0) {
    const costs = allCropsOrMin.map(c => {
      if (typeof c === 'number') return c;
      if (typeof c.seedCostPerAcre === 'number') return c.seedCostPerAcre;
      if (typeof c.inputCostPerAcre === 'number') return c.inputCostPerAcre * 0.25;
      return 3000;
    });
    minCost = Math.min(...costs);
    maxCost = Math.max(...costs);
  } else if (typeof allCropsOrMin === 'number' && typeof maxVal === 'number') {
    minCost = allCropsOrMin;
    maxCost = maxVal;
  }

  const normalized = normalizeValue(cost, minCost, maxCost, eps);
  // CRITICAL: Must be at least epsilon to prevent zero division in denominator
  return Math.max(eps, Math.min(1, normalized));
}

/**
 * NEGATIVE FACTOR 2: Water Requirement Score
 * Higher crop water requirements reduce score, especially under constrained water availability (denominator factor).
 * 
 * @param {object|number|string} crop - Crop object, water needs label, or numeric score
 * @param {object|string} [farmerInputs] - Farm water availability conditions
 * @param {number} [epsilon=0.01] - Floor epsilon
 * @returns {number} Factor score in [epsilon, 1.0]
 */
export function calculateWaterRequirementScore(crop, farmerInputs, epsilon = EPSILON) {
  const eps = typeof epsilon === 'number' ? epsilon : EPSILON;

  if (typeof crop === 'number') {
    const val = crop > 1 ? crop / 100 : crop;
    return Math.max(eps, Math.min(1, Number(val.toFixed(4))));
  }

  let waterNeeds = 'Moderate';
  if (typeof crop === 'string') {
    waterNeeds = crop;
  } else if (crop && typeof crop === 'object') {
    waterNeeds = crop.waterNeeds || crop.waterRequirement || 'Moderate';
  }

  const farmerWater = typeof farmerInputs === 'string'
    ? farmerInputs
    : String(farmerInputs?.waterAvailability || 'Medium');

  // Baseline water requirement index
  let score = 0.50;
  const lowerNeed = String(waterNeeds).toLowerCase();

  if (lowerNeed.includes('high')) {
    score = 0.88;
  } else if (lowerNeed.includes('low')) {
    score = 0.22;
  } else {
    score = 0.52;
  }

  // Adjust strain based on farmer's irrigation infrastructure
  const lowerFarmerWater = farmerWater.toLowerCase();
  if (lowerFarmerWater.includes('low') || lowerFarmerWater.includes('rainfed')) {
    if (lowerNeed.includes('high')) {
      score = 0.98; // Extreme water stress penalty
    } else if (lowerNeed.includes('low')) {
      score = 0.18; // Favorable fit for rainfed
    }
  } else if (lowerFarmerWater.includes('canal') || lowerFarmerWater.includes('high')) {
    if (lowerNeed.includes('high')) {
      score = 0.70; // Moderated impact since water is available
    }
  }

  // Return clamped factor score (never 0)
  return Math.max(eps, Math.min(1, Number(score.toFixed(4))));
}

/**
 * NEGATIVE FACTOR 3: Climate Risk Score
 * Higher vulnerability to temperature spikes, pest pressure, or rainfall anomalies reduces score (denominator factor).
 * 
 * @param {object|number|string} crop - Crop object, risk label, or numeric risk score
 * @param {object} [farmerWeather] - Local weather metrics (temperature, rainfall, riskScore)
 * @param {number} [epsilon=0.01] - Floor epsilon
 * @returns {number} Factor score in [epsilon, 1.0]
 */
export function calculateClimateRiskScore(crop, farmerWeather, epsilon = EPSILON) {
  const eps = typeof epsilon === 'number' ? epsilon : EPSILON;

  if (typeof crop === 'number') {
    const val = crop > 1 ? crop / 100 : crop;
    return Math.max(eps, Math.min(1, Number(val.toFixed(4))));
  }

  let riskLevel = 'Low';
  if (typeof crop === 'string') {
    riskLevel = crop;
  } else if (crop && typeof crop === 'object') {
    riskLevel = crop.climateRisk || 'Low';
  }

  let score = 0.25;
  const lowerRisk = String(riskLevel).toLowerCase();

  if (lowerRisk.includes('high')) {
    score = 0.85;
  } else if (lowerRisk.includes('moderate') || lowerRisk.includes('medium')) {
    score = 0.50;
  } else {
    score = 0.22;
  }

  // Check temperature deviations if weather metrics are provided
  if (crop && typeof crop === 'object' && crop.idealTemp && farmerWeather?.temperature) {
    const temp = Number(farmerWeather.temperature);
    const { min = 15, max = 35 } = crop.idealTemp;
    if (temp < min || temp > max) {
      const diff = Math.min(Math.abs(temp - min), Math.abs(temp - max));
      score += Math.min(0.12, diff * 0.02);
    }
  }

  if (farmerWeather?.riskScore && typeof farmerWeather.riskScore === 'number') {
    score = score * 0.7 + (farmerWeather.riskScore / 100) * 0.3;
  }

  // Return clamped factor score (never 0)
  return Math.max(eps, Math.min(1, Number(score.toFixed(4))));
}

/**
 * Calculates the complete Crop Score using the official formula:
 * 
 * Crop Score = (Stock Shortage Score × Future Price Increase Score × Soil Match Score)
 *              /
 *              (Seed Cost Score × Water Requirement Score × Climate Risk Score)
 * 
 * @param {object} crop - Crop to score
 * @param {object} farmerInputs - Farm parameters
 * @param {Array} [allCrops=[]] - List of reference crops for relative factor normalization
 * @param {object} [options={}] - Additional options (epsilon, custom bounds)
 * @returns {object} Full crop evaluation result with score, breakdown, and transparent advisory fields
 */
export function calculateCropScore(crop, farmerInputs = {}, allCrops = [], options = {}) {
  const eps = typeof options.epsilon === 'number' ? options.epsilon : EPSILON;

  // 1. Calculate the 3 Positive Factors (Numerator)
  const stockShortageScore = calculateStockShortageScore(crop, allCrops, null, eps);
  const priceGrowthScore = calculatePriceGrowthScore(crop, allCrops, null, eps);
  const soilMatchScore = calculateSoilMatchScore(crop, farmerInputs, eps);

  // 2. Calculate the 3 Negative Factors (Denominator)
  const seedCostScore = calculateSeedCostScore(crop, allCrops, null, eps);
  const waterRequirementScore = calculateWaterRequirementScore(crop, farmerInputs, eps);
  const climateRiskScore = calculateClimateRiskScore(crop, farmerInputs?.weather, eps);

  // 3. Products
  const numerator = stockShortageScore * priceGrowthScore * soilMatchScore;
  const rawDenominator = seedCostScore * waterRequirementScore * climateRiskScore;

  // CRITICAL DIVISION BY ZERO & NAN SAFEGUARD
  // Since each factor in the denominator is >= eps, minimum rawDenominator is eps^3 = 0.000001
  const safeDenominator = Math.max(rawDenominator, eps * eps * eps);

  let rawScore = numerator / safeDenominator;

  // Clean invalid numerical states
  if (isNaN(rawScore) || !isFinite(rawScore) || rawScore < 0) {
    rawScore = eps;
  }

  // Calibrate raw score into an intuitive farmer-facing 0-100 composite index
  // Typical raw scores range from ~0.05 (high risk/low opportunity) to ~25+ (prime opportunity)
  const calibratedScore = Math.round(
    Math.min(99, Math.max(15, 30 + Math.log10(Math.max(0.1, rawScore) + 0.9) * 45))
  );

  // Helper metadata extraction
  const currentPrice = crop?.currentPrice || 0;
  const expectedPrice = crop?.expectedPrice || 0;
  const growthNum = currentPrice > 0 
    ? Number((((expectedPrice - currentPrice) / currentPrice) * 100).toFixed(1))
    : 0;
  const growth = growthNum >= 0 ? `+${growthNum}%` : `${growthNum}%`;

  const deficit = crop?.deficitPercentage;
  const shortage = typeof deficit === 'number'
    ? (deficit < 0 ? `Deficit (${Math.abs(deficit)}%)` : deficit > 0 ? `Surplus (+${deficit}%)` : 'Balanced')
    : 'Balanced';

  const soilSuitability = `${Math.round(soilMatchScore * 100)}%`;
  const seedCost = crop?.seedCostPerAcre || Math.round((crop?.inputCostPerAcre || 14000) * 0.25);
  const waterRequirement = crop?.waterNeeds || 'Moderate';
  const climateRisk = crop?.climateRisk || 'Low';
  const cropCycle = crop?.durationDays || '90 - 110 days';

  // Transparent, indicative advisory copy
  const opportunity = `Estimated opportunity: Mandi supply ${shortage.toLowerCase()} with projected ${growth} price upside at harvest.`;
  const confidence = `Indicative ${Math.min(96, Math.max(72, calibratedScore))}% (Based on available market data)`;
  
  const topReason = crop?.recommendationReason || 
    `Favorable price trajectory (${growth}) and strong soil compatibility (${soilSuitability}), balanced against manageable input costs.`;
  const reason = `Estimated opportunity based on available market data: ${topReason}`;

  return {
    crop,
    score: calibratedScore,
    rawScore: Number(rawScore.toFixed(4)),
    rank: 1, // updated during list ranking
    currentPrice,
    expectedPrice,
    growth,
    growthNum,
    shortage,
    soilSuitability,
    seedCost,
    waterRequirement,
    climateRisk,
    cropCycle,
    opportunity,
    confidence,
    reason,
    factors: {
      stockShortageScore: Number(stockShortageScore.toFixed(4)),
      priceGrowthScore: Number(priceGrowthScore.toFixed(4)),
      soilMatchScore: Number(soilMatchScore.toFixed(4)),
      seedCostScore: Number(seedCostScore.toFixed(4)),
      waterRequirementScore: Number(waterRequirementScore.toFixed(4)),
      climateRiskScore: Number(climateRiskScore.toFixed(4)),
      numerator: Number(numerator.toFixed(6)),
      denominator: Number(safeDenominator.toFixed(6))
    }
  };
}

/**
 * Complete Recommendation Engine Workflow
 * Evaluates all crops, calculates scores, ranks in descending order, and returns Top 5.
 * 
 * @param {object} farmerInputs - Inputs provided by the farmer (soil, water, location, etc.)
 * @param {Array} [crops=[]] - Pool of candidate crops
 * @param {object} [options={}] - Options (e.g. limit: 5)
 * @returns {object} { top5, allRanked, totalEvaluated }
 */
export function recommendTopCrops(farmerInputs = {}, crops = [], options = {}) {
  const cropPool = Array.isArray(crops) && crops.length > 0 ? crops : [];
  if (cropPool.length === 0) {
    return { top5: [], allRanked: [], totalEvaluated: 0 };
  }

  // 1. Evaluate all crops with the crop scoring formula
  const scoredCrops = cropPool.map(crop => {
    return calculateCropScore(crop, farmerInputs, cropPool, options);
  });

  // 2. Rank descending by raw formula score / calibrated score
  scoredCrops.sort((a, b) => b.rawScore - a.rawScore);

  // 3. Assign 1-indexed rank
  scoredCrops.forEach((item, index) => {
    item.rank = index + 1;
  });

  const limit = typeof options.limit === 'number' ? options.limit : 5;
  const top5 = scoredCrops.slice(0, limit);

  return {
    top5,
    allRanked: scoredCrops,
    totalEvaluated: scoredCrops.length
  };
}

export default {
  EPSILON,
  normalizeValue,
  calculateStockShortageScore,
  calculatePriceGrowthScore,
  calculateSoilMatchScore,
  calculateSeedCostScore,
  calculateWaterRequirementScore,
  calculateClimateRiskScore,
  calculateCropScore,
  recommendTopCrops
};
