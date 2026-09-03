import mongoose from 'mongoose';

const recommendationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
    // Farm information used
    farmInfo: {
      location: String,
      state: String,
      district: String,
      landArea: Number,
      landUnit: { type: String, default: 'Acres' },
      soilType: String,
      ph: Number,
      nitrogen: Number,
      phosphorus: Number,
      potassium: Number,
      waterAvailability: String,
      irrigationType: String,
      budgetLimit: Number,
    },
    // Input parameters
    inputParameters: {
      location: String,
      soilType: String,
      landArea: Number,
      landUnit: String,
      cropCycle: String,
      waterAvailability: String,
      nitrogen: Number,
      phosphorus: Number,
      potassium: Number,
      ph: Number,
      farmingObjective: String,
      previousCrop: String,
    },
    // Recommended crops
    recommendedCrops: [
      {
        rank: Number,
        cropId: String,
        cropName: String,
        score: Number,
        rawScore: Number,
        currentPrice: Number,
        expectedPrice: Number,
        growth: String,
        shortage: String,
        soilSuitability: String,
        seedCost: Number,
        waterRequirement: String,
        climateRisk: String,
        cropCycle: String,
        opportunity: String,
        confidence: String,
        reason: String,
        recommendationReason: String,
        factors: {
          stockShortageScore: Number,
          priceGrowthScore: Number,
          soilMatchScore: Number,
          seedCostScore: Number,
          waterRequirementScore: Number,
          climateRiskScore: Number,
          numerator: Number,
          denominator: Number,
        },
        agronomic: mongoose.Schema.Types.Mixed,
        market: mongoose.Schema.Types.Mixed,
        climate: mongoose.Schema.Types.Mixed,
        financials: mongoose.Schema.Types.Mixed,
        crop: mongoose.Schema.Types.Mixed,
      },
    ],
    // Scores summary
    scores: {
      topScore: Number,
      averageScore: Number,
      totalEvaluated: Number,
    },
    // Market information
    marketInformation: {
      primaryMandi: String,
      modalPriceAverage: Number,
      stateAverage: Number,
      deficitCropsCount: Number,
      surplusCropsCount: Number,
      marketSentiment: String,
      dataSource: String,
    },
    // Weather information
    weatherInformation: {
      temperature: Number,
      tempMin: Number,
      tempMax: Number,
      humidity: Number,
      rainfall: Number,
      condition: String,
      climateRisk: String,
      forecast: String,
    },
    // Backwards compatibility aliases
    farmConditions: mongoose.Schema.Types.Mixed,
    top5: [mongoose.Schema.Types.Mixed],
    totalEvaluated: {
      type: Number,
      default: 0,
    },
    engineVersion: {
      type: String,
      default: '6-factor-v2',
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export const inMemoryRecommendations = [];

export const Recommendation =
  mongoose.models.Recommendation || mongoose.model('Recommendation', recommendationSchema);
export default Recommendation;

