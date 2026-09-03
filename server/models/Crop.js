import mongoose from 'mongoose';
import { CROPS_DATABASE } from '../../src/data/cropDatabase.js';

const cropSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    category: { type: String, required: true },
    suitableSoils: [{ type: String }],
    cropCycle: { type: String },
    seedCost: { type: Number, required: true },
    waterRequirement: { type: String, default: 'Moderate' },
    idealTemperature: {
      min: { type: Number, default: 15 },
      max: { type: Number, default: 35 },
    },
    idealRainfall: {
      min: { type: Number, default: 450 },
      max: { type: Number, default: 850 },
    },
    baseDemand: { type: String, default: 'High' },
    currentStock: { type: Number, default: 10000 },
    normalStock: { type: Number, default: 15000 },
    currentPrice: { type: Number, required: true },
    historicalPrice: [
      {
        month: String,
        price: Number,
        msp: Number,
      },
    ],
    expectedFuturePrice: { type: Number, required: true },
    climateRisk: { type: String, default: 'Low' },

    // Compatibility fields
    scientificName: { type: String },
    localName: { type: String },
    season: [{ type: String }],
    durationDays: { type: String },
    yieldPerAcre: { type: mongoose.Schema.Types.Mixed },
    inputCostPerAcre: { type: Number },
    seedCostPerAcre: { type: Number },
    expectedPrice: { type: Number },
    mandiUnit: { type: String, default: '₹/Quintal' },
    deficitPercentage: { type: Number, default: 0 },
    currentStockTonnes: { type: Number },
    normalStockTonnes: { type: Number },
    marketDemand: { type: String, default: 'High' },
    waterNeeds: { type: String, default: 'Moderate' },
    waterRequirementMm: { type: String },
    idealTemp: {
      min: { type: Number, default: 15 },
      max: { type: Number, default: 35 },
    },
    idealPh: {
      min: { type: Number, default: 6.0 },
      max: { type: Number, default: 7.5 },
    },
    soilTypes: [{ type: String }],
    description: { type: String },
    recommendationReason: { type: String },
    cultivationTips: [{ type: String }],
    diseaseAlerts: [{ type: String }],
    historicalPrices: [
      {
        month: String,
        price: Number,
        msp: Number,
      },
    ],
    mandiPrices: [
      {
        month: String,
        price: Number,
        mandi: String,
      },
    ],
  },
  { timestamps: true }
);

export const inMemoryCrops = [...CROPS_DATABASE];

export const Crop = mongoose.models.Crop || mongoose.model('Crop', cropSchema);
export default Crop;
