import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { isDbConnected } from '../config/db.js';
import { User, inMemoryUsers } from '../models/User.js';
import { Farm, inMemoryFarms } from '../models/Farm.js';
import { protect, generateToken } from '../middleware/auth.js';

const router = Router();

/**
 * Format user object safely for response (never exposes password)
 */
function sanitizeUser(user) {
  const obj = user.toObject ? user.toObject() : { ...user };
  delete obj.password;
  delete obj.__v;
  return {
    id: obj._id ? String(obj._id) : String(obj.id),
    _id: obj._id ? String(obj._id) : String(obj.id),
    name: obj.name,
    email: obj.email,
    phone: obj.phone || '',
    language: obj.language || 'en',
    role: obj.role || 'farmer',
    subscriptionPlan: obj.subscriptionPlan || 'free',
    freeRecommendationsUsed: obj.freeRecommendationsUsed || 0,
    createdAt: obj.createdAt || new Date(),
  };
}

/**
 * POST /api/auth/register
 * Register a new farmer account with hashed password and initial farm profile
 */
router.post('/register', async (req, res, next) => {
  try {
    const {
      name,
      email,
      password,
      phone,
      language = 'en',
      role = 'farmer',
      location = 'Nagpur, Maharashtra',
      soilType = 'Black Soil',
      landArea = 5,
      landUnit = 'acres',
      waterAvailability = 'Moderate (Borewell / Seasonal)',
    } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, error: 'Farmer name is required' });
    }

    if (!email || !email.trim()) {
      return res.status(400).json({ success: false, error: 'Email address is required' });
    }

    if (!password || password.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'Password must be at least 6 characters in length',
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // 1. Check if user already exists
    if (isDbConnected()) {
      const existing = await User.findOne({ email: normalizedEmail });
      if (existing) {
        return res.status(400).json({
          success: false,
          error: 'An account with this email address already exists. Please log in.',
        });
      }

      // Create new user (pre-save hook hashes password)
      const newUser = await User.create({
        name: name.trim(),
        email: normalizedEmail,
        password, // Handled by pre-save bcrypt hook
        phone: phone ? phone.trim() : '',
        language,
        role,
        subscriptionPlan: 'free',
        freeRecommendationsUsed: 0,
      });

      // Create linked Farm profile
      const newFarm = await Farm.create({
        userId: newUser._id,
        location,
        soilType,
        landArea: Number(landArea) || 5,
        landUnit: landUnit.toLowerCase(),
        waterAvailability,
        nitrogen: 140,
        phosphorus: 35,
        potassium: 210,
        soilPH: 6.8,
        previousCrop: 'Soybean',
      });

      const token = generateToken(newUser);
      const safeUser = sanitizeUser(newUser);

      return res.status(201).json({
        success: true,
        message: 'Account registered successfully',
        token,
        user: safeUser,
        farm: newFarm,
      });
    }

    // 2. In-memory registration fallback (when MongoDB is offline or in memory mode)
    const memExisting = inMemoryUsers.find(u => u.email.toLowerCase() === normalizedEmail);
    if (memExisting) {
      return res.status(400).json({
        success: false,
        error: 'An account with this email address already exists. Please log in.',
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const memUserId = `user_${Date.now()}`;
    const memUser = {
      _id: memUserId,
      id: memUserId,
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      phone: phone ? phone.trim() : '',
      language,
      role,
      subscriptionPlan: 'free',
      freeRecommendationsUsed: 0,
      createdAt: new Date(),
    };
    inMemoryUsers.push(memUser);

    const memFarmId = `farm_${Date.now()}`;
    const memFarm = {
      _id: memFarmId,
      id: memFarmId,
      userId: memUserId,
      location,
      latitude: 21.1458,
      longitude: 79.0882,
      soilType,
      landArea: Number(landArea) || 5,
      landUnit: landUnit.toLowerCase(),
      waterAvailability,
      nitrogen: 140,
      phosphorus: 35,
      potassium: 210,
      soilPH: 6.8,
      previousCrop: 'Soybean',
      createdAt: new Date(),
    };
    inMemoryFarms.push(memFarm);

    const token = generateToken(memUser);
    const safeUser = sanitizeUser(memUser);

    res.status(201).json({
      success: true,
      message: 'Account registered successfully',
      token,
      user: safeUser,
      farm: memFarm,
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({
        success: false,
        error: 'An account with this email address already exists.',
      });
    }
    next(err);
  }
});

/**
 * POST /api/auth/login
 * Authenticate farmer via email and password using bcrypt & return JWT
 */
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Please provide both email and password',
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // 1. Database Login Flow
    if (isDbConnected()) {
      const user = await User.findOne({ email: normalizedEmail });
      if (!user) {
        return res.status(401).json({
          success: false,
          error: 'Invalid email or password',
        });
      }

      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          error: 'Invalid email or password',
        });
      }

      const token = generateToken(user);
      const safeUser = sanitizeUser(user);

      // Fetch linked farm profile
      let farm = await Farm.findOne({ userId: user._id }).lean();
      if (!farm) {
        // Create default farm if none existed
        farm = await Farm.create({
          userId: user._id,
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

      return res.json({
        success: true,
        message: 'Logged in successfully',
        token,
        user: safeUser,
        farm,
      });
    }

    // 2. In-Memory Login Flow
    const user = inMemoryUsers.find(u => u.email.toLowerCase() === normalizedEmail);
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password',
      });
    }

    // Check password hash
    let isMatch = false;
    if (user.password.startsWith('$2a$') || user.password.startsWith('$2b$')) {
      isMatch = await bcrypt.compare(password, user.password);
    } else {
      isMatch = user.password === password;
    }

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password',
      });
    }

    const token = generateToken(user);
    const safeUser = sanitizeUser(user);

    let farm = inMemoryFarms.find(
      f => String(f.userId) === String(user._id) || String(f.userId) === String(user.id)
    );

    if (!farm) {
      farm = {
        _id: `farm_${Date.now()}`,
        id: `farm_${Date.now()}`,
        userId: user.id || user._id,
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

    res.json({
      success: true,
      message: 'Logged in successfully',
      token,
      user: safeUser,
      farm,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/auth/me
 * Get current authenticated user details and their farm profile
 */
router.get('/me', protect, async (req, res, next) => {
  try {
    const user = req.user;
    const userId = user._id ? String(user._id) : String(user.id);

    let farm = null;
    if (isDbConnected()) {
      farm = await Farm.findOne({ userId: user._id }).lean();
      if (!farm) {
        farm = await Farm.create({
          userId: user._id,
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
    } else {
      farm = inMemoryFarms.find(
        f => String(f.userId) === userId || String(f.userId) === String(user.id)
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
    }

    res.json({
      success: true,
      user: sanitizeUser(user),
      farm,
    });
  } catch (err) {
    next(err);
  }
});

export default router;
