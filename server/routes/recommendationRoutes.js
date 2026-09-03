import { Router } from 'express';
import {
  generateCropRecommendations,
  getRecommendationsHistory,
  getRecommendationById,
} from '../services/recommendationService.js';
import { optionalAuth } from '../middleware/auth.js';
import { Farm, inMemoryFarms } from '../models/Farm.js';
import { User, inMemoryUsers } from '../models/User.js';
import { isDbConnected } from '../config/db.js';

const router = Router();

// POST /api/recommendations
// Evaluates farm conditions (using saved farm profile as base + user overrides)
// and returns ranked Top 5 recommendations with 6-factor scores
router.post('/', optionalAuth, async (req, res, next) => {
  try {
    let farmConditions = req.body || {};
    const user = req.user;
    const userId = user ? (user._id ? String(user._id) : String(user.id)) : (req.headers['x-user-id'] || null);

    let currentPlan = 'FREE';
    let freeUsed = 0;

    // Check user profile & subscription tier
    if (user) {
      currentPlan = (user.subscriptionPlan || 'FREE').toUpperCase();
      freeUsed = user.freeRecommendationsUsed || 0;
    } else if (userId) {
      if (isDbConnected()) {
        const dbUser = await User.findById(userId).lean();
        if (dbUser) {
          currentPlan = (dbUser.subscriptionPlan || 'FREE').toUpperCase();
          freeUsed = dbUser.freeRecommendationsUsed || 0;
        }
      } else {
        const memU = inMemoryUsers.find(u => String(u._id) === String(userId) || String(u.id) === String(userId));
        if (memU) {
          currentPlan = (memU.subscriptionPlan || 'FREE').toUpperCase();
          freeUsed = memU.freeRecommendationsUsed || 0;
        }
      }
    }

    const isPaidPlan = ['BASIC', 'INTERMEDIATE', 'ADVANCE', 'PRO', 'ENTERPRISE'].includes(currentPlan);

    // Subscription gate: First 3 recommendations are FREE.
    // If freeRecommendationsUsed < 3: allow recommendation, increment counter.
    // Else: check subscriptionPlan.
    if (!isPaidPlan && freeUsed >= 3) {
      return res.status(403).json({
        success: false,
        limitReached: true,
        freeRecommendationsUsed: freeUsed,
        freeRecommendationsAllowed: 3,
        error: 'Free recommendation limit reached (3 of 3 audits used). Please upgrade to a BASIC, INTERMEDIATE, or ADVANCE plan to unlock unlimited audits.',
        plans: ['BASIC', 'INTERMEDIATE', 'ADVANCE'],
        demoNotice: 'Demo subscription — payment integration can be added later.',
      });
    }

    // Increment free count if on free tier
    if (!isPaidPlan) {
      if (user && isDbConnected()) {
        await User.findByIdAndUpdate(user._id, { $inc: { freeRecommendationsUsed: 1 } });
      } else if (userId && isDbConnected()) {
        await User.findByIdAndUpdate(userId, { $inc: { freeRecommendationsUsed: 1 } });
      } else {
        const memU = inMemoryUsers.find(u => String(u._id) === String(userId) || String(u.id) === String(userId));
        if (memU) {
          memU.freeRecommendationsUsed = (memU.freeRecommendationsUsed || 0) + 1;
        }
      }
      freeUsed += 1;
    }

    // If user is authenticated, check their saved farm profile for defaults
    if (user || userId) {
      let savedFarm = null;
      if (isDbConnected() && (user?._id || userId)) {
        savedFarm = await Farm.findOne({ userId: user?._id || userId }).lean();
      } else {
        savedFarm = inMemoryFarms.find(f => String(f.userId) === String(userId));
      }

      if (savedFarm) {
        // Merge: form conditions take precedence, saved farm profile provides defaults
        farmConditions = {
          location: farmConditions.location || savedFarm.location || 'Nagpur, Maharashtra',
          soilType: farmConditions.soilType || savedFarm.soilType || 'Black Soil',
          landArea: farmConditions.landArea !== undefined ? Number(farmConditions.landArea) : savedFarm.landArea || 5,
          landUnit: farmConditions.landUnit || savedFarm.landUnit || 'acres',
          waterAvailability: farmConditions.waterAvailability || savedFarm.waterAvailability || 'Moderate (Borewell / Seasonal)',
          nitrogen: farmConditions.nitrogen !== undefined ? Number(farmConditions.nitrogen) : savedFarm.nitrogen || 140,
          phosphorus: farmConditions.phosphorus !== undefined ? Number(farmConditions.phosphorus) : savedFarm.phosphorus || 35,
          potassium: farmConditions.potassium !== undefined ? Number(farmConditions.potassium) : savedFarm.potassium || 210,
          soilPH: farmConditions.ph !== undefined || farmConditions.soilPH !== undefined
            ? Number(farmConditions.ph ?? farmConditions.soilPH)
            : savedFarm.soilPH || 6.8,
          previousCrop: farmConditions.previousCrop || savedFarm.previousCrop || 'Soybean',
          farmingObjective: farmConditions.farmingObjective || 'Maximum Profit',
          cropCycle: farmConditions.cropCycle || '6 Months',
          weather: farmConditions.weather,
        };
      }
    }

    const result = await generateCropRecommendations(farmConditions, userId);
    result.freeRecommendationsUsed = freeUsed;
    result.subscriptionPlan = currentPlan;
    result.isPaidPlan = isPaidPlan;

    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
});

// GET /api/recommendations/history
// Retrieves past recommendation runs
router.get('/history', optionalAuth, async (req, res, next) => {
  try {
    const user = req.user;
    const userId = user ? (user._id ? String(user._id) : String(user.id)) : (req.headers['x-user-id'] || req.query.userId || null);
    const limit = Number(req.query.limit) || 15;

    const history = await getRecommendationsHistory(userId, limit);

    res.json({
      success: true,
      count: history.length,
      data: history,
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/recommendations/:id
router.get('/:id', optionalAuth, async (req, res, next) => {
  try {
    const { id } = req.params;
    const record = await getRecommendationById(id);

    if (!record) {
      return res.status(404).json({
        success: false,
        error: `Recommendation run #${id} was not found`,
      });
    }

    res.json({
      success: true,
      data: record,
    });
  } catch (err) {
    next(err);
  }
});

export default router;
