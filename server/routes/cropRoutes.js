import { Router } from 'express';
import { isDbConnected } from '../config/db.js';
import { Crop, inMemoryCrops } from '../models/Crop.js';

const router = Router();

// GET /api/crops
router.get('/', async (req, res, next) => {
  try {
    const { category, season, soilType } = req.query;

    let crops = [];
    if (isDbConnected()) {
      try {
        const query = {};
        if (category && category !== 'All') query.category = new RegExp(category, 'i');
        if (season) query.season = { $in: [season] };
        crops = await Crop.find(query).lean();
      } catch (err) {
        crops = [];
      }
    }

    if (!crops || crops.length === 0) {
      crops = [...inMemoryCrops];
      if (category && category !== 'All') {
        crops = crops.filter(c => c.category?.toLowerCase() === String(category).toLowerCase());
      }
      if (season) {
        crops = crops.filter(c => Array.isArray(c.season) && c.season.includes(season));
      }
      if (soilType) {
        crops = crops.filter(c => 
          Array.isArray(c.soilTypes) && c.soilTypes.some(s => s.toLowerCase().includes(String(soilType).toLowerCase()))
        );
      }
    }

    res.json({
      success: true,
      total: crops.length,
      data: crops,
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/crops/:id
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    let crop = null;
    if (isDbConnected()) {
      try {
        crop = await Crop.findById(id).lean();
      } catch (e) {
        // Continue to check local
      }
    }

    if (!crop) {
      crop = inMemoryCrops.find(
        c => String(c.id) === String(id) || String(c._id) === String(id) || c.name.toLowerCase() === id.toLowerCase()
      );
    }

    if (!crop) {
      return res.status(404).json({
        success: false,
        error: `Crop with identifier '${id}' was not found`,
      });
    }

    res.json({
      success: true,
      data: crop,
    });
  } catch (err) {
    next(err);
  }
});

export default router;
