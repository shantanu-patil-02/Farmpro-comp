import { Router } from 'express';
import { getMarketData, getMarketByCropId } from '../services/marketService.js';

const router = Router();

// GET /api/market
router.get('/', async (req, res, next) => {
  try {
    const { category, state, sort } = req.query;
    const market = await getMarketData({ category, state, sort });
    res.json(market);
  } catch (err) {
    next(err);
  }
});

// GET /api/market/:cropId
router.get('/:cropId', async (req, res, next) => {
  try {
    const { cropId } = req.params;
    const cropMarket = await getMarketByCropId(cropId);

    if (!cropMarket) {
      return res.status(404).json({
        success: false,
        error: `Market analytics for '${cropId}' not found`,
      });
    }

    res.json({
      success: true,
      data: cropMarket,
    });
  } catch (err) {
    next(err);
  }
});

export default router;
