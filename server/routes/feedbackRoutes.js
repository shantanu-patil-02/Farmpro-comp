import { Router } from 'express';
import { isDbConnected } from '../config/db.js';
import { Feedback, inMemoryFeedback } from '../models/Feedback.js';
import { optionalAuth } from '../middleware/auth.js';

const router = Router();

// POST /api/feedback
// Allows: rating 1–5, feedback text, usefulness ('yes' | 'no'), optional crop, optional recommendationId
router.post('/', optionalAuth, async (req, res, next) => {
  try {
    const {
      farmerName,
      rating,
      usefulness,
      feedbackText,
      comments,
      cropName,
      crop,
      category,
      location,
      recommendationId,
    } = req.body;

    const user = req.user;
    const userId = user ? (user._id || user.id) : (req.headers['x-user-id'] || null);

    // Normalize rating (1 to 5, default to 5 if undefined)
    const normalizedRating = rating !== undefined ? Math.max(1, Math.min(5, Number(rating))) : 5;
    
    // Normalize text
    const textContent = (feedbackText || comments || '').trim();

    // Normalize usefulness
    let normalizedUsefulness = 'yes';
    if (usefulness === false || usefulness === 'no' || usefulness === 'No') {
      normalizedUsefulness = 'no';
    }

    const payload = {
      userId,
      farmerName: farmerName || (user ? user.name : 'Anonymous Farmer'),
      rating: normalizedRating,
      usefulness: normalizedUsefulness,
      feedbackText: textContent || (normalizedUsefulness === 'yes' ? 'Recommendation was helpful and accurate.' : 'Recommendation needs calibration.'),
      comments: textContent || (normalizedUsefulness === 'yes' ? 'Recommendation was helpful and accurate.' : 'Recommendation needs calibration.'),
      cropName: cropName || crop || 'General',
      crop: cropName || crop || 'General',
      category: category || (normalizedUsefulness === 'yes' ? 'Recommendation Accuracy' : 'Calibration Required'),
      location: location || 'Nagpur, Maharashtra',
      recommendationId: recommendationId || null,
      status: 'new',
    };

    if (isDbConnected()) {
      const saved = await Feedback.create(payload);
      return res.status(201).json({
        success: true,
        message: 'Feedback submitted successfully. Thank you for helping calibrate FarmPro recommendations!',
        data: saved,
      });
    }

    const memFeedback = {
      _id: `fb_${Date.now()}`,
      id: `fb_${Date.now()}`,
      ...payload,
      createdAt: new Date(),
    };
    inMemoryFeedback.unshift(memFeedback);

    res.status(201).json({
      success: true,
      message: 'Feedback submitted successfully. Thank you for helping calibrate FarmPro recommendations!',
      data: memFeedback,
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/feedback
router.get('/', async (req, res, next) => {
  try {
    if (isDbConnected()) {
      const items = await Feedback.find({}).sort({ createdAt: -1 }).limit(25).lean();
      return res.json({ success: true, count: items.length, data: items });
    }

    res.json({ success: true, count: inMemoryFeedback.length, data: inMemoryFeedback });
  } catch (err) {
    next(err);
  }
});

export default router;

