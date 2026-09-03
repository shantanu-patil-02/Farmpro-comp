import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { CROPS_DATABASE } from '../src/data/cropDatabase.js';
import { Crop, inMemoryCrops } from './models/Crop.js';
import { User, inMemoryUsers } from './models/User.js';
import { Farm, inMemoryFarms } from './models/Farm.js';
import { Recommendation, inMemoryRecommendations } from './models/Recommendation.js';
import { Feedback, inMemoryFeedback } from './models/Feedback.js';

dotenv.config();

/**
 * FarmPro Demo & Database Seeder
 * Populates all 15 benchmark crops, realistic market values, demo farmers, and recommendation records.
 * Completely independent of external APIs.
 */
export async function runSeeder() {
  console.log('🌾 [FarmPro Seeder] Starting database seed process...');
  console.log(`🌾 [FarmPro Seeder] DEMO_MODE: ${process.env.DEMO_MODE || 'true'}`);

  const mongoUri = process.env.MONGODB_URI;
  let isConnected = false;

  if (mongoUri && mongoUri.trim() !== '') {
    try {
      console.log('🌾 [FarmPro Seeder] Connecting to MongoDB...');
      await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 5000 });
      isConnected = true;
      console.log('🌾 [FarmPro Seeder] MongoDB connected successfully.');
    } catch (err) {
      console.warn('⚠️ [FarmPro Seeder] MongoDB connection failed. Falling back to in-memory seeding:', err.message);
    }
  } else {
    console.log('ℹ️ [FarmPro Seeder] No MONGODB_URI provided. Seeding in-memory demo datasets.');
  }

  // Ensure all 15 crops conform to the required schema
  const requiredFields = [
    'name', 'category', 'suitableSoils', 'cropCycle', 'seedCost',
    'waterRequirement', 'idealTemperature', 'idealRainfall', 'baseDemand',
    'currentStock', 'normalStock', 'currentPrice', 'historicalPrice',
    'expectedFuturePrice', 'climateRisk'
  ];

  const sanitizedCrops = CROPS_DATABASE.map(c => {
    // Validate required fields
    for (const field of requiredFields) {
      if (c[field] === undefined || c[field] === null) {
        console.warn(`Warning: crop ${c.name} missing field: ${field}`);
      }
    }
    return {
      ...c,
      suitableSoils: c.suitableSoils || c.soilTypes || ['Alluvial', 'Black', 'Loamy'],
      cropCycle: c.cropCycle || c.durationDays || '90 - 120 days',
      seedCost: typeof c.seedCost === 'number' ? c.seedCost : 3000,
      waterRequirement: c.waterRequirement || c.waterNeeds || 'Moderate',
      idealTemperature: c.idealTemperature || c.idealTemp || { min: 18, max: 32 },
      idealRainfall: c.idealRainfall || { min: 450, max: 750 },
      baseDemand: c.baseDemand || c.marketDemand || 'High',
      currentStock: typeof c.currentStock === 'number' ? c.currentStock : 10000,
      normalStock: typeof c.normalStock === 'number' ? c.normalStock : 15000,
      currentPrice: typeof c.currentPrice === 'number' ? c.currentPrice : 3000,
      historicalPrice: c.historicalPrice || c.historicalPrices || [],
      expectedFuturePrice: typeof c.expectedFuturePrice === 'number' ? c.expectedFuturePrice : 3450,
      climateRisk: c.climateRisk || 'Low',
    };
  });

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash('password123', salt);

  if (isConnected) {
    try {
      console.log(`🌾 [FarmPro Seeder] Syncing ${sanitizedCrops.length} crops to MongoDB...`);
      for (const cropData of sanitizedCrops) {
        await Crop.findOneAndUpdate(
          { name: cropData.name },
          { $set: cropData },
          { upsert: true, returnDocument: 'after' }
        );
      }

      console.log('🌾 [FarmPro Seeder] Seeding default demo farmer account...');
      const seededUser = await User.findOneAndUpdate(
        { email: 'farmer@farmpro.ai' },
        {
          $set: {
            name: 'Ramesh Patil',
            email: 'farmer@farmpro.ai',
            password: hashedPassword,
            phone: '9823456789',
            language: 'en',
            role: 'farmer',
            subscriptionPlan: 'pro',
            freeRecommendationsUsed: 2,
          },
        },
        { upsert: true, returnDocument: 'after' }
      );

      console.log('🌾 [FarmPro Seeder] Seeding demo farm profile...');
      await Farm.findOneAndUpdate(
        { userId: seededUser._id },
        {
          $set: {
            userId: seededUser._id,
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
          },
        },
        { upsert: true, returnDocument: 'after' }
      );

      console.log('🌾 [FarmPro Seeder] Seeding demo feedback...');
      await Feedback.findOneAndUpdate(
        { farmerName: 'Ramesh Patil' },
        {
          $set: {
            farmerName: 'Ramesh Patil',
            rating: 5,
            category: 'Market Intelligence',
            comments: 'Mandi deficit notifications helped me shift 3 acres to Soybean before the price surge.',
            location: 'Katol, Nagpur, Maharashtra',
          },
        },
        { upsert: true, returnDocument: 'after' }
      );

      console.log('✅ [FarmPro Seeder] Successfully seeded MongoDB database!');
      await mongoose.disconnect();
    } catch (dbErr) {
      console.error('❌ [FarmPro Seeder] Error during MongoDB seeding:', dbErr);
    }
  } else {
    // In-memory update
    inMemoryCrops.length = 0;
    inMemoryCrops.push(...sanitizedCrops);
    console.log(`✅ [FarmPro Seeder] Populated ${inMemoryCrops.length} crops into in-memory store:`);
    sanitizedCrops.forEach((c, idx) => {
      console.log(`   ${idx + 1}. ${c.name.padEnd(14)} | ${c.category.padEnd(20)} | Price: ₹${c.currentPrice} → ₹${c.expectedFuturePrice} | Deficit: ${c.deficitPercentage || -20}%`);
    });
  }

  console.log('\n🎉 [FarmPro Seeder] Crop data & demo seed complete!\n');
}

// Auto-run if executed via `npm run seed` or `node server/seed.js`
if (process.argv[1]?.endsWith('seed.js')) {
  runSeeder()
    .then(() => process.exit(0))
    .catch(err => {
      console.error('Fatal seed error:', err);
      process.exit(1);
    });
}
