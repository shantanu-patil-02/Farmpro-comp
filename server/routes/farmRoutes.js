import { Router } from 'express';
import { isDbConnected } from '../config/db.js';
import { Farm, inMemoryFarms } from '../models/Farm.js';
import { protect, optionalAuth } from '../middleware/auth.js';

const router = Router();

/**
 * GET /api/farms/me
 * Get the currently authenticated farmer's farm profile
 */
router.get('/me', protect, async (req, res, next) => {
  try {
    const userId = req.user._id ? String(req.user._id) : String(req.user.id);

    if (isDbConnected()) {
      let farm = await Farm.findOne({ userId: req.user._id }).lean();
      if (!farm) {
        farm = await Farm.create({
          userId: req.user._id,
          location: 'Nagpur, Maharashtra',
          soilType: 'Black Soil',
          landArea: 5,
          landUnit: 'acres',
          waterAvailability: 'Moderate (Borewell / Seasonal)',
          nitrogen: 140,
          phosphorus: 35,
          potassium: 210,
          soilPH: 6.8,
          previousCrop: 'Soybean',
        });
      }
      return res.json({ success: true, farm });
    }

    let farm = inMemoryFarms.find(
      f => String(f.userId) === userId || String(f.userId) === String(req.user.id)
    );

    if (!farm) {
      farm = {
        _id: `farm_${Date.now()}`,
        id: `farm_${Date.now()}`,
        userId,
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
        createdAt: new Date(),
      };
      inMemoryFarms.push(farm);
    }

    res.json({ success: true, farm });
  } catch (err) {
    next(err);
  }
});

/**
 * PUT /api/farms/me
 * Update the currently authenticated farmer's farm profile
 */
router.put('/me', protect, async (req, res, next) => {
  try {
    const userId = req.user._id ? String(req.user._id) : String(req.user.id);
    const {
      location,
      latitude,
      longitude,
      soilType,
      landArea,
      landUnit,
      waterAvailability,
      nitrogen,
      phosphorus,
      potassium,
      soilPH,
      soilPh,
      previousCrop,
    } = req.body;

    const updates = {};
    if (location !== undefined) updates.location = location;
    if (latitude !== undefined) updates.latitude = Number(latitude);
    if (longitude !== undefined) updates.longitude = Number(longitude);
    if (soilType !== undefined) updates.soilType = soilType;
    if (landArea !== undefined) updates.landArea = Number(landArea);
    if (landUnit !== undefined) updates.landUnit = String(landUnit).toLowerCase();
    if (waterAvailability !== undefined) updates.waterAvailability = waterAvailability;
    if (nitrogen !== undefined) updates.nitrogen = Number(nitrogen);
    if (phosphorus !== undefined) updates.phosphorus = Number(phosphorus);
    if (potassium !== undefined) updates.potassium = Number(potassium);
    if (soilPH !== undefined || soilPh !== undefined) updates.soilPH = Number(soilPH ?? soilPh);
    if (previousCrop !== undefined) updates.previousCrop = previousCrop;

    if (isDbConnected()) {
      let farm = await Farm.findOneAndUpdate(
        { userId: req.user._id },
        { $set: updates },
        { new: true, upsert: true, runValidators: true }
      );
      return res.json({
        success: true,
        message: 'Farm profile updated successfully',
        farm,
      });
    }

    let farmIndex = inMemoryFarms.findIndex(
      f => String(f.userId) === userId || String(f.userId) === String(req.user.id)
    );

    if (farmIndex >= 0) {
      inMemoryFarms[farmIndex] = {
        ...inMemoryFarms[farmIndex],
        ...updates,
        updatedAt: new Date(),
      };
      return res.json({
        success: true,
        message: 'Farm profile updated successfully',
        farm: inMemoryFarms[farmIndex],
      });
    }

    const newMemFarm = {
      _id: `farm_${Date.now()}`,
      id: `farm_${Date.now()}`,
      userId,
      location: location || 'Nagpur, Maharashtra',
      latitude: Number(latitude) || 21.1458,
      longitude: Number(longitude) || 79.0882,
      soilType: soilType || 'Black Soil',
      landArea: Number(landArea) || 5,
      landUnit: (landUnit || 'acres').toLowerCase(),
      waterAvailability: waterAvailability || 'Moderate (Borewell / Seasonal)',
      nitrogen: Number(nitrogen) || 140,
      phosphorus: Number(phosphorus) || 35,
      potassium: Number(potassium) || 210,
      soilPH: Number(soilPH ?? soilPh) || 6.8,
      previousCrop: previousCrop || 'Soybean',
      createdAt: new Date(),
    };
    inMemoryFarms.push(newMemFarm);

    res.json({
      success: true,
      message: 'Farm profile created successfully',
      farm: newMemFarm,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/farms
 * List all farm records or filter by userId
 */
router.get('/', optionalAuth, async (req, res, next) => {
  try {
    if (isDbConnected()) {
      const query = req.query.userId ? { userId: req.query.userId } : {};
      const farms = await Farm.find(query).lean();
      return res.json({ success: true, count: farms.length, data: farms });
    }

    let farms = inMemoryFarms;
    if (req.query.userId) {
      farms = farms.filter(f => String(f.userId) === String(req.query.userId));
    }

    res.json({ success: true, count: farms.length, data: farms });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/farms
 * Create farm profile for authenticated user
 */
router.post('/', protect, async (req, res, next) => {
  try {
    const userId = req.user._id ? String(req.user._id) : String(req.user.id);
    const {
      location = 'Nagpur, Maharashtra',
      latitude = 21.1458,
      longitude = 79.0882,
      soilType = 'Black Soil',
      landArea = 5,
      landUnit = 'acres',
      waterAvailability = 'Moderate (Borewell / Seasonal)',
      nitrogen = 140,
      phosphorus = 35,
      potassium = 210,
      soilPH = 6.8,
      soilPh = 6.8,
      previousCrop = 'Soybean',
    } = req.body;

    const farmPayload = {
      userId: req.user._id || userId,
      location,
      latitude: Number(latitude) || 21.1458,
      longitude: Number(longitude) || 79.0882,
      soilType,
      landArea: Number(landArea) || 5,
      landUnit: String(landUnit).toLowerCase(),
      waterAvailability,
      nitrogen: Number(nitrogen) || 140,
      phosphorus: Number(phosphorus) || 35,
      potassium: Number(potassium) || 210,
      soilPH: Number(soilPH ?? soilPh) || 6.8,
      previousCrop,
    };

    if (isDbConnected()) {
      const newFarm = await Farm.create(farmPayload);
      return res.status(201).json({
        success: true,
        message: 'Farm profile created',
        farm: newFarm,
      });
    }

    const memFarm = {
      _id: `farm_${Date.now()}`,
      id: `farm_${Date.now()}`,
      ...farmPayload,
      userId,
      createdAt: new Date(),
    };
    inMemoryFarms.unshift(memFarm);

    res.status(201).json({
      success: true,
      message: 'Farm profile created',
      farm: memFarm,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/farms/:id
 * Retrieve specific farm profile
 */
router.get('/:id', optionalAuth, async (req, res, next) => {
  try {
    const { id } = req.params;

    if (isDbConnected()) {
      try {
        const farm = await Farm.findById(id).lean();
        if (farm) return res.json({ success: true, farm });
      } catch (e) {}
    }

    const farm = inMemoryFarms.find(
      f => String(f._id) === String(id) || String(f.id) === String(id)
    );

    if (!farm) {
      return res.status(404).json({ success: false, error: 'Farm profile not found' });
    }

    res.json({ success: true, farm });
  } catch (err) {
    next(err);
  }
});

/**
 * PUT /api/farms/:id
 * Update specific farm profile
 */
router.put('/:id', protect, async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (isDbConnected()) {
      try {
        const updated = await Farm.findByIdAndUpdate(id, { $set: updates }, { new: true });
        if (updated) {
          return res.json({ success: true, message: 'Farm profile updated', farm: updated });
        }
      } catch (e) {}
    }

    const idx = inMemoryFarms.findIndex(
      f => String(f._id) === String(id) || String(f.id) === String(id)
    );

    if (idx < 0) {
      return res.status(404).json({ success: false, error: 'Farm profile not found' });
    }

    inMemoryFarms[idx] = { ...inMemoryFarms[idx], ...updates, updatedAt: new Date() };
    res.json({ success: true, message: 'Farm profile updated', farm: inMemoryFarms[idx] });
  } catch (err) {
    next(err);
  }
});

export default router;
