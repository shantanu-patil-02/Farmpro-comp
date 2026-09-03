import { connectDB, isDbConnected } from '../config/db.js';
import { Crop } from '../models/Crop.js';
import { Farm } from '../models/Farm.js';
import { User } from '../models/User.js';
import { CROPS_DATABASE } from '../../src/data/cropDatabase.js';

export async function seedDatabase() {
  console.log('--- Starting Database Seeding ---');
  await connectDB();

  if (!isDbConnected()) {
    console.log('MongoDB not connected. Seeding skipped; memory models already populated.');
    return;
  }

  try {
    // 1. Seed crops if empty
    const cropCount = await Crop.countDocuments();
    if (cropCount === 0) {
      console.log(`Seeding ${CROPS_DATABASE.length} agronomic crops...`);
      await Crop.insertMany(CROPS_DATABASE);
      console.log('Crops seeded successfully.');
    } else {
      console.log(`Crops collection already has ${cropCount} records.`);
    }

    // 2. Seed default user if empty
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('Seeding default farmer account...');
      const user = await User.create({
        name: 'Rajesh Patil',
        email: 'farmer@farmpro.ai',
        phone: '+91 98765 43210',
        password: 'password123',
        role: 'farmer',
        state: 'Maharashtra',
        district: 'Nagpur',
        subscription: { plan: 'pro', status: 'active', expiresAt: new Date('2027-12-31') },
      });

      await Farm.create({
        userId: user._id,
        farmName: 'Patil Organic Farm',
        location: {
          state: 'Maharashtra',
          district: 'Nagpur',
          subDistrict: 'Katol',
          village: 'Kondhali',
        },
        landArea: 4,
        soilType: 'Black Soil',
        soilPh: 6.8,
        waterAvailability: 'Medium',
        irrigationType: 'Borewell',
        budgetLimit: 60000,
        currentSeason: 'Kharif',
      });
      console.log('Default user and farm seeded.');
    }
  } catch (err) {
    console.error('Error during database seed:', err.message);
  }
}

// Allow direct execution: node server/utils/seed.js
if (process.argv[1]?.endsWith('seed.js')) {
  seedDatabase().then(() => {
    console.log('Seed execution completed.');
    process.exit(0);
  });
}

export default seedDatabase;
