/**
 * FarmPro Regional Agricultural Presets
 * Allows farmers and judges to test different agricultural belts with 1 click.
 */

export const REGIONAL_PRESETS = [
  {
    id: 'maharashtra_vidarbha',
    name: 'Maharashtra (Vidarbha / Amravati)',
    state: 'Maharashtra',
    district: 'Amravati',
    zoneName: 'Central Black Soil Agro-Climatic Zone',
    soilType: 'Black',
    defaultSeason: 'Kharif',
    defaultLandArea: 4,
    defaultWaterAvailability: 'Borewell',
    defaultNp: { n: 40, p: 45, k: 30, ph: 7.4 },
    weather: {
      temperature: 31,
      tempMin: 22,
      tempMax: 34,
      rainfallMm: 720,
      humidity: 68,
      forecastSummary: 'Normal Southwest Monsoon progression with intermittent sunny breaks.',
      climateRisk: 'Low to Moderate',
      riskScore: 25 // 0-100 scale, lower is safer
    },
    contextNote: 'Prominent soybean and cotton belt. Strong crushing mill network nearby.'
  },
  {
    id: 'punjab_ludhiana',
    name: 'Punjab (Ludhiana)',
    state: 'Punjab',
    district: 'Ludhiana',
    zoneName: 'Indo-Gangetic Alluvial Plain',
    soilType: 'Alluvial',
    defaultSeason: 'Rabi',
    defaultLandArea: 6,
    defaultWaterAvailability: 'Canal',
    defaultNp: { n: 90, p: 55, k: 50, ph: 7.2 },
    weather: {
      temperature: 18,
      tempMin: 9,
      tempMax: 23,
      rainfallMm: 510,
      humidity: 62,
      forecastSummary: 'Optimal cool winter temperatures, favorable for grain filling and mustard flowering.',
      climateRisk: 'Low',
      riskScore: 15
    },
    contextNote: 'High canal network density; major wheat, mustard, and green fodder region.'
  },
  {
    id: 'mp_malwa',
    name: 'Madhya Pradesh (Malwa / Indore)',
    state: 'Madhya Pradesh',
    district: 'Indore',
    zoneName: 'Malwa Plateau Deep Black Soil Zone',
    soilType: 'Black',
    defaultSeason: 'Kharif',
    defaultLandArea: 5,
    defaultWaterAvailability: 'Borewell',
    defaultNp: { n: 45, p: 50, k: 40, ph: 7.6 },
    weather: {
      temperature: 28,
      tempMin: 21,
      tempMax: 32,
      rainfallMm: 850,
      humidity: 74,
      forecastSummary: 'Well-distributed seasonal rains. Excellent moisture retention in deep vertisols.',
      climateRisk: 'Low',
      riskScore: 18
    },
    contextNote: 'Largest oilseed processing hub in India with direct mandi price transparency.'
  },
  {
    id: 'karnataka_dharwad',
    name: 'Karnataka (Dharwad / Hubballi)',
    state: 'Karnataka',
    district: 'Dharwad',
    zoneName: 'Northern Transition Zone',
    soilType: 'Red & Yellow',
    defaultSeason: 'Kharif',
    defaultLandArea: 3.5,
    defaultWaterAvailability: 'Drip',
    defaultNp: { n: 35, p: 40, k: 35, ph: 6.8 },
    weather: {
      temperature: 27,
      tempMin: 19,
      tempMax: 30,
      rainfallMm: 680,
      humidity: 72,
      forecastSummary: 'Gentle monsoon showers with moderate wind velocity. High crop diversity.',
      climateRisk: 'Low',
      riskScore: 20
    },
    contextNote: 'Ideal for pulses, maize, groundnut, and high-value spices like turmeric.'
  },
  {
    id: 'gujarat_saurashtra',
    name: 'Gujarat (Saurashtra / Rajkot)',
    state: 'Gujarat',
    district: 'Rajkot',
    zoneName: 'Semi-Arid Saurashtra Coastal Zone',
    soilType: 'Sandy Loam',
    defaultSeason: 'Kharif',
    defaultLandArea: 5,
    defaultWaterAvailability: 'Drip',
    defaultNp: { n: 30, p: 45, k: 35, ph: 7.8 },
    weather: {
      temperature: 33,
      tempMin: 24,
      tempMax: 36,
      rainfallMm: 560,
      humidity: 60,
      forecastSummary: 'Moderate monsoon with high solar radiance. Ideal for oilseeds and groundnut.',
      climateRisk: 'Moderate',
      riskScore: 32
    },
    contextNote: 'Groundnut and cotton powerhouse. Direct access to port export channels.'
  },
  {
    id: 'up_varanasi',
    name: 'Uttar Pradesh (Eastern / Varanasi)',
    state: 'Uttar Pradesh',
    district: 'Varanasi',
    zoneName: 'Eastern Plain Zone',
    soilType: 'Alluvial',
    defaultSeason: 'Rabi',
    defaultLandArea: 2.5,
    defaultWaterAvailability: 'Canal',
    defaultNp: { n: 70, p: 50, k: 45, ph: 7.1 },
    weather: {
      temperature: 21,
      tempMin: 12,
      tempMax: 26,
      rainfallMm: 480,
      humidity: 65,
      forecastSummary: 'Moderate winter conditions, minimal frost risk, stable water supply.',
      climateRisk: 'Low',
      riskScore: 16
    },
    contextNote: 'High population density creating strong local wholesale food demand.'
  }
];

export const SOIL_TYPES = [
  { id: 'Black', name: 'Black Soil (Regur / Vertisol)', desc: 'High clay, moisture retentive, ideal for cotton, soybean, pulses' },
  { id: 'Alluvial', name: 'Alluvial Soil', desc: 'Fertile river basin soil, rich in potash, ideal for wheat, paddy, mustard' },
  { id: 'Red & Yellow', name: 'Red & Yellow Soil', desc: 'Porous, rich in iron, responsive to fertilizers, ideal for groundnut, maize, spices' },
  { id: 'Sandy Loam', name: 'Sandy Loam Soil', desc: 'Well-drained, warm, quick root growth, ideal for onion, groundnut, pulses' },
  { id: 'Clayey', name: 'Clayey Heavy Soil', desc: 'Dense water holding, suitable for paddy and sugarcane' },
  { id: 'Laterite', name: 'Laterite Soil', desc: 'Acidic, low organic matter, needs organic manure enrichment' }
];

export const SEASONS = [
  { id: 'Kharif', name: 'Kharif (Monsoon / Autumn)', period: 'June to October' },
  { id: 'Rabi', name: 'Rabi (Winter / Spring)', period: 'October to April' },
  { id: 'Zaid', name: 'Zaid (Summer Short Season)', period: 'March to June' },
  { id: 'Whole Year', name: 'Perennial / Annual', period: '10 - 12 Months' }
];

export const WATER_SOURCES = [
  { id: 'Canal', name: 'Canal Irrigation (High & Regular)', level: 'High' },
  { id: 'Borewell', name: 'Borewell / Tube-well (Controlled)', level: 'Moderate' },
  { id: 'Drip', name: 'Drip / Sprinkler Micro-Irrigation', level: 'Efficient' },
  { id: 'Rainfed', name: 'Rainfed Only (Monsoon Dependent)', level: 'Low' }
];
