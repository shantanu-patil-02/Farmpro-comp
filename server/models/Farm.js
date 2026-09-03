import mongoose from 'mongoose';

const farmSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.Mixed, // Supports ObjectId or string in-memory user IDs
      ref: 'User',
      required: [true, 'Farm profile must belong to a user'],
      index: true,
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      default: 'Nagpur, Maharashtra',
      trim: true,
    },
    latitude: {
      type: Number,
      default: 21.1458,
    },
    longitude: {
      type: Number,
      default: 79.0882,
    },
    soilType: {
      type: String,
      required: [true, 'Soil type is required'],
      default: 'Black Soil',
    },
    landArea: {
      type: Number,
      required: [true, 'Land area is required'],
      min: [0.1, 'Land area must be at least 0.1'],
      default: 5,
    },
    landUnit: {
      type: String,
      enum: ['acres', 'hectares', 'bigha', 'guntha', 'Acres', 'Hectares', 'Bigha', 'Guntha'],
      default: 'acres',
    },
    waterAvailability: {
      type: String,
      default: 'Moderate (Borewell / Seasonal)',
    },
    nitrogen: {
      type: Number,
      default: 140, // kg/ha N
    },
    phosphorus: {
      type: Number,
      default: 35, // kg/ha P
    },
    potassium: {
      type: Number,
      default: 210, // kg/ha K
    },
    soilPH: {
      type: Number,
      default: 6.8,
      min: 3.5,
      max: 10.0,
    },
    previousCrop: {
      type: String,
      default: 'Soybean',
      trim: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        // Alias soilPh for consistency
        ret.soilPh = ret.soilPH;
        return ret;
      },
    },
  }
);

export const inMemoryFarms = [
  {
    _id: 'farm_default_1',
    id: 'farm_default_1',
    userId: 'user_default_1',
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
    createdAt: new Date('2025-03-01T00:00:00.000Z'),
  },
  {
    _id: 'farm_default_2',
    id: 'farm_default_2',
    userId: 'user_default_2',
    location: 'Bathinda, Punjab',
    latitude: 30.2110,
    longitude: 74.9455,
    soilType: 'Alluvial',
    landArea: 45,
    landUnit: 'acres',
    waterAvailability: 'High (Canal / Perennial)',
    nitrogen: 180,
    phosphorus: 40,
    potassium: 240,
    soilPH: 7.2,
    previousCrop: 'Wheat',
    createdAt: new Date('2025-01-15T00:00:00.000Z'),
  },
];

export const Farm = mongoose.models.Farm || mongoose.model('Farm', farmSchema);
export default Farm;
