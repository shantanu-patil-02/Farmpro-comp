import { Router } from 'express';
import { getRegionalWeather, calculateClimateRisk } from '../services/weatherService.js';

const router = Router();

// GET /api/weather
// Fetch agro-meteorological parameters for farm location
router.get('/', async (req, res, next) => {
  try {
    const location = req.query.location || 'Nagpur, Maharashtra';
    const weatherData = await getRegionalWeather(location);
    res.json(weatherData);
  } catch (err) {
    next(err);
  }
});

// POST /api/weather/risk
// Evaluate transparent rule-based climate-risk for custom inputs
router.post('/risk', (req, res) => {
  const { temperature, rainfall, humidity, windSpeed } = req.body || {};
  const riskResult = calculateClimateRisk({ temperature, rainfall, humidity, windSpeed });
  res.json({
    success: true,
    data: riskResult,
  });
});

export default router;
