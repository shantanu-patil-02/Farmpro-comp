/**
 * FarmPro Recommendation Engine Test Suite
 * Validates cropScoring.js mathematical correctness, normalization, edge cases, and output formatting.
 */

import {
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
} from './cropScoring.js';

import { CROPS_DATABASE } from '../../src/data/cropDatabase.js';

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    passed++;
    console.log(`  ✓ PASS: ${message}`);
  } else {
    failed++;
    console.error(`  ✗ FAIL: ${message}`);
  }
}

console.log('\n=== RUNNING FARMPRO CROP SCORING TEST SUITE ===\n');

// 1. Normalization Tests
console.log('1. Testing normalizeValue()...');
assert(normalizeValue(5, 0, 10) === 0.5, 'Standard midpoint normalizes to 0.5');
assert(normalizeValue(0, 0, 10) === 0.0, 'Minimum boundary normalizes to 0.0');
assert(normalizeValue(10, 0, 10) === 1.0, 'Maximum boundary normalizes to 1.0');
assert(normalizeValue(15, 0, 10) === 1.0, 'Values exceeding max clamp to 1.0');
assert(normalizeValue(-5, 0, 10) === 0.0, 'Values below min clamp to 0.0');
assert(normalizeValue(10, 10, 10) === 0.5, 'Safely handles maxValue === minValue without division by zero');
assert(normalizeValue(null, 0, 10) === EPSILON, 'Safely handles null value with epsilon fallback');
assert(normalizeValue(undefined, 0, 10) === EPSILON, 'Safely handles undefined value with epsilon fallback');
assert(normalizeValue(NaN, 0, 10) === EPSILON, 'Safely handles NaN value with epsilon fallback');

// 2. Positive Factor: Stock Shortage
console.log('\n2. Testing calculateStockShortageScore()...');
const highShortageCrop = { deficitPercentage: -30 };
const lowShortageCrop = { deficitPercentage: 10 };
const highShortageScore = calculateStockShortageScore(highShortageCrop, 0, 40);
const lowShortageScore = calculateStockShortageScore(lowShortageCrop, 0, 40);
assert(highShortageScore > lowShortageScore, 'Higher stock shortage produces higher score');
assert(highShortageScore >= EPSILON && highShortageScore <= 1.0, 'Stock shortage score is bounded in [EPSILON, 1.0]');
assert(calculateStockShortageScore(null) >= EPSILON, 'Handles null crop without crashing');

// 3. Positive Factor: Future Price Increase
console.log('\n3. Testing calculatePriceGrowthScore()...');
const highGrowthCrop = { currentPrice: 5000, expectedPrice: 6500 }; // +30%
const lowGrowthCrop = { currentPrice: 5000, expectedPrice: 4800 }; // -4%
const highGrowthScore = calculatePriceGrowthScore(highGrowthCrop, -10, 30);
const lowGrowthScore = calculatePriceGrowthScore(lowGrowthCrop, -10, 30);
assert(highGrowthScore > lowGrowthScore, 'Higher expected price growth produces higher score');
assert(highGrowthScore >= EPSILON && highGrowthScore <= 1.0, 'Price growth score is bounded in [EPSILON, 1.0]');

// 4. Positive Factor: Soil Suitability
console.log('\n4. Testing calculateSoilMatchScore()...');
const soyCrop = { soilTypes: ['Black', 'Alluvial'], idealPh: { min: 6.0, max: 7.5 } };
const matchFarmer = { soilType: 'Black Soil', ph: 6.8 };
const mismatchFarmer = { soilType: 'Sandy Loam', ph: 5.0 };
const matchSoilScore = calculateSoilMatchScore(soyCrop, matchFarmer);
const mismatchSoilScore = calculateSoilMatchScore(soyCrop, mismatchFarmer);
assert(matchSoilScore > mismatchSoilScore, 'Matching soil type produces higher suitability score');
assert(matchSoilScore >= EPSILON && matchSoilScore <= 1.0, 'Soil score bounded in [EPSILON, 1.0]');

// 5. Negative Factor: Seed Cost
console.log('\n5. Testing calculateSeedCostScore()...');
const cheapSeedCrop = { seedCostPerAcre: 1800 };
const expensiveSeedCrop = { seedCostPerAcre: 9000 };
const cheapSeedScore = calculateSeedCostScore(cheapSeedCrop, 1500, 10000);
const expensiveSeedScore = calculateSeedCostScore(expensiveSeedCrop, 1500, 10000);
assert(expensiveSeedScore > cheapSeedScore, 'Higher seed cost produces higher denominator factor score');
assert(cheapSeedScore >= EPSILON, 'Seed cost score is never zero (EPSILON floor prevents division by zero)');

// 6. Negative Factor: Water Requirement
console.log('\n6. Testing calculateWaterRequirementScore()...');
const highWaterCrop = { waterNeeds: 'High' };
const lowWaterCrop = { waterNeeds: 'Low' };
const rainfedFarm = { waterAvailability: 'Low' };
const highWaterScore = calculateWaterRequirementScore(highWaterCrop, rainfedFarm);
const lowWaterScore = calculateWaterRequirementScore(lowWaterCrop, rainfedFarm);
assert(highWaterScore > lowWaterScore, 'High water requirement produces higher denominator factor score');
assert(lowWaterScore >= EPSILON, 'Water requirement score is never zero');

// 7. Negative Factor: Climate Risk
console.log('\n7. Testing calculateClimateRiskScore()...');
const highRiskCrop = { climateRisk: 'High' };
const lowRiskCrop = { climateRisk: 'Low' };
const highRiskScore = calculateClimateRiskScore(highRiskCrop);
const lowRiskScore = calculateClimateRiskScore(lowRiskCrop);
assert(highRiskScore > lowRiskScore, 'Higher climate risk produces higher denominator factor score');
assert(lowRiskScore >= EPSILON, 'Climate risk score is never zero');

// 8. Complete Formula & Output Fields Test
console.log('\n8. Testing calculateCropScore() and Output Fields...');
const testFarmer = {
  location: 'Nagpur, Maharashtra',
  soilType: 'Black Soil',
  waterAvailability: 'Medium',
  ph: 6.8,
  weather: { temperature: 28, rainfall: 750 }
};

const scoredSoybean = calculateCropScore(CROPS_DATABASE[0], testFarmer, CROPS_DATABASE);

// Validate formula behavior: positive in numerator, negative in denominator
const expectedNumerator = scoredSoybean.factors.stockShortageScore * 
                          scoredSoybean.factors.priceGrowthScore * 
                          scoredSoybean.factors.soilMatchScore;
const expectedDenominator = scoredSoybean.factors.seedCostScore * 
                            scoredSoybean.factors.waterRequirementScore * 
                            scoredSoybean.factors.climateRiskScore;
const manualRawScore = expectedNumerator / Math.max(expectedDenominator, EPSILON * EPSILON * EPSILON);

assert(Math.abs(scoredSoybean.rawScore - manualRawScore) < 0.01, 'Raw score strictly follows the official 6-factor formula');
assert(!isNaN(scoredSoybean.score) && isFinite(scoredSoybean.score), 'Score is never NaN or Infinity');
assert(scoredSoybean.score > 0 && scoredSoybean.score <= 100, 'Composite score is calibrated within 1-100 range');

// Validate all requested fields in output
console.log('\n9. Verifying all required output fields...');
const requiredFields = [
  'crop', 'score', 'rank', 'currentPrice', 'expectedPrice', 'growth',
  'shortage', 'soilSuitability', 'seedCost', 'waterRequirement',
  'climateRisk', 'cropCycle', 'opportunity', 'confidence', 'reason'
];

requiredFields.forEach(field => {
  assert(scoredSoybean[field] !== undefined && scoredSoybean[field] !== null, `Output contains required field '${field}'`);
});

// Validate tone: "Estimated opportunity", "Indicative", "Based on available market data"
console.log('\n10. Verifying transparent advisory tone...');
assert(scoredSoybean.opportunity.includes('Estimated opportunity'), 'Opportunity contains "Estimated opportunity" tone');
assert(scoredSoybean.confidence.includes('Indicative'), 'Confidence contains "Indicative" tone');
assert(scoredSoybean.confidence.includes('Based on available market data'), 'Confidence specifies "Based on available market data"');
assert(scoredSoybean.reason.includes('Estimated opportunity based on available market data'), 'Reason contains transparent market data attribution');

// 11. Testing Top 5 Recommendation Flow
console.log('\n11. Testing recommendTopCrops() Top 5 logic flow...');
const recommendation = recommendTopCrops(testFarmer, CROPS_DATABASE, { limit: 5 });
assert(Array.isArray(recommendation.top5), 'Top 5 is an array');
assert(recommendation.top5.length === 5, 'Returns exactly Top 5 crops');
assert(recommendation.top5[0].rank === 1, 'Top pick has rank 1');
assert(recommendation.top5[4].rank === 5, '5th pick has rank 5');
assert(recommendation.top5[0].rawScore >= recommendation.top5[1].rawScore, 'Crops are ranked in descending order of score');

console.log(`\n=== TEST SUMMARY: ${passed} PASSED, ${failed} FAILED ===\n`);

if (failed > 0) {
  process.exit(1);
} else {
  console.log('ALL TESTS PASSED SUCCESSFULLY! ✓');
}
