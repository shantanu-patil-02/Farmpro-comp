import { Router } from 'express';
import { optionalAuth } from '../middleware/auth.js';
import { User, inMemoryUsers } from '../models/User.js';
import { isDbConnected } from '../config/db.js';

const router = Router();

export const SUBSCRIPTION_PLANS = [
  {
    id: 'BASIC',
    name: 'BASIC',
    displayName: 'Kisan Basic',
    price: 199,
    annualPrice: 1499,
    billing: '₹199 / month',
    description: 'Essential seasonal crop intelligence and regional mandi price forecasts for smallholders.',
    features: [
      'Up to 25 full crop recommendations per season',
      'APMC Mandi price forecast & modal averages',
      '6-Factor agronomic soil suitability engine',
      'Local 5-day weather & climate risk alerts',
      'Community farmer feedback & crop tips',
    ],
    isPopular: false,
    recommended: false,
  },
  {
    id: 'INTERMEDIATE',
    name: 'INTERMEDIATE',
    displayName: 'FarmPro Intermediate',
    price: 399,
    annualPrice: 2999,
    billing: '₹399 / month',
    description: 'Most popular choice for commercial farmers seeking maximum ROI and supply shortage alerts.',
    features: [
      'Unlimited seasonal crop audits & recommendations',
      'Live Mandi supply shortage & deficit indexes',
      'AI Kisan Advisor (Gemini 3.7) 24/7 assistant',
      'Detailed Farm Profit & Cost-of-Cultivation simulator',
      'NPK fertilizer & soil amendment suggestions',
      'Multi-language audio & voice support',
    ],
    isPopular: true,
    recommended: true,
  },
  {
    id: 'ADVANCE',
    name: 'ADVANCE',
    displayName: 'FPO & Agri Enterprise Advance',
    price: 799,
    annualPrice: 5999,
    billing: '₹799 / month',
    description: 'Comprehensive agri-intelligence suite for large landholders, FPOs, and custom soil labs.',
    features: [
      'All Intermediate features with priority AI compute',
      'Multi-farm management up to 500 acres',
      'Custom soil lab spectrometer / report import',
      'Direct APMC trader liquidity & buyer matching',
      'Exportable PDF agronomy sheets for bank loans',
      'Dedicated agronomist phone helpline support',
    ],
    isPopular: false,
    recommended: false,
  },
];

// GET /api/subscriptions/plans
router.get('/plans', (req, res) => {
  res.json({
    success: true,
    freeTier: {
      name: 'FREE',
      freeRecommendationsAllowed: 3,
      description: 'First 3 recommendations are FREE for every farmer.',
    },
    plans: SUBSCRIPTION_PLANS,
    demoNotice: 'Demo subscription — payment integration can be added later.',
  });
});

// GET /api/subscriptions/status
router.get('/status', optionalAuth, async (req, res, next) => {
  try {
    const user = req.user;
    const userId = user ? (user._id ? String(user._id) : String(user.id)) : (req.headers['x-user-id'] || req.query.userId || null);

    let plan = 'FREE';
    let freeUsed = 0;

    if (user) {
      plan = user.subscriptionPlan || 'FREE';
      freeUsed = user.freeRecommendationsUsed || 0;
    } else if (userId) {
      if (isDbConnected()) {
        const dbUser = await User.findById(userId).lean();
        if (dbUser) {
          plan = dbUser.subscriptionPlan || 'FREE';
          freeUsed = dbUser.freeRecommendationsUsed || 0;
        }
      } else {
        const memU = inMemoryUsers.find(u => String(u._id) === String(userId) || String(u.id) === String(userId));
        if (memU) {
          plan = memU.subscriptionPlan || 'FREE';
          freeUsed = memU.freeRecommendationsUsed || 0;
        }
      }
    }

    const isPaid = ['BASIC', 'INTERMEDIATE', 'ADVANCE', 'basic', 'intermediate', 'advance', 'pro', 'enterprise'].includes(plan);
    const freeRemaining = Math.max(0, 3 - freeUsed);

    res.json({
      success: true,
      plan: plan.toUpperCase(),
      isPaid,
      freeRecommendationsUsed: freeUsed,
      freeRecommendationsAllowed: 3,
      freeRemaining,
      canRecommend: isPaid || freeUsed < 3,
      demoNotice: 'Demo subscription — payment integration can be added later.',
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/subscriptions/subscribe (Demo Subscription - instantly activates plan)
router.post('/subscribe', optionalAuth, async (req, res, next) => {
  try {
    const { planId } = req.body;
    const user = req.user;
    const userId = user ? (user._id ? String(user._id) : String(user.id)) : (req.headers['x-user-id'] || req.body.userId || 'user_default_1');

    const normalizedPlanId = (planId || 'INTERMEDIATE').toUpperCase();
    const selectedPlan = SUBSCRIPTION_PLANS.find(p => p.id === normalizedPlanId) || SUBSCRIPTION_PLANS[1];

    // Update user in DB or memory
    if (isDbConnected() && userId && userId !== 'user_default_1') {
      try {
        await User.findByIdAndUpdate(userId, { subscriptionPlan: normalizedPlanId });
      } catch (dbErr) {
        console.warn('DB update notice for subscription:', dbErr.message);
      }
    }

    const memUser = inMemoryUsers.find(u => String(u._id) === String(userId) || String(u.id) === String(userId));
    if (memUser) {
      memUser.subscriptionPlan = normalizedPlanId;
    }

    res.json({
      success: true,
      message: `Demo subscription activated: ${selectedPlan.displayName} (${selectedPlan.name}). Demo subscription — payment integration can be added later.`,
      demoNotice: 'Demo subscription — payment integration can be added later.',
      plan: selectedPlan,
      subscriptionPlan: normalizedPlanId,
      status: 'active',
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/subscriptions/checkout (Alias for compatibility)
router.post('/checkout', optionalAuth, async (req, res, next) => {
  try {
    const { planId } = req.body;
    const normalizedPlanId = (planId || 'INTERMEDIATE').toUpperCase();
    const selectedPlan = SUBSCRIPTION_PLANS.find(p => p.id === normalizedPlanId) || SUBSCRIPTION_PLANS[1];

    res.json({
      success: true,
      message: `Demo subscription activated: ${selectedPlan.displayName}. Demo subscription — payment integration can be added later.`,
      demoNotice: 'Demo subscription — payment integration can be added later.',
      orderId: `order_demo_${Date.now()}`,
      plan: selectedPlan,
      subscriptionPlan: normalizedPlanId,
      status: 'active',
    });
  } catch (err) {
    next(err);
  }
});

export default router;

