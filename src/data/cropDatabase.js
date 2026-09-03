/**
 * FarmPro Central Crop Database
 * Comprehensive agronomic requirements and market metrics for key Indian crops.
 * Contains at least the 15 required benchmark crops with standardized schema:
 * - name, category, suitableSoils, cropCycle, seedCost, waterRequirement,
 *   idealTemperature, idealRainfall, baseDemand, currentStock, normalStock,
 *   currentPrice, historicalPrice, expectedFuturePrice, climateRisk
 */

export const CROPS_DATABASE = [
  // 1. Wheat
  {
    id: 'wheat',
    name: 'Wheat',
    localName: 'गेहूं (Gehun)',
    category: 'Cereal & Grain',
    season: ['Rabi'],
    suitableSoils: ['Alluvial', 'Clayey', 'Loamy', 'Black'],
    cropCycle: '115 - 130 days',
    seedCost: 1850,
    waterRequirement: 'Moderate',
    idealTemperature: { min: 14, max: 25 },
    idealRainfall: { min: 450, max: 650 },
    baseDemand: 'Very High',
    currentStock: 28500,
    normalStock: 35000,
    currentPrice: 2275,
    expectedFuturePrice: 2550,
    climateRisk: 'Low',

    // Compatibility fields
    soilTypes: ['Alluvial', 'Clayey', 'Loamy', 'Black'],
    waterNeeds: 'Moderate',
    waterSources: ['Canal', 'Borewell'],
    idealTemp: { min: 14, max: 25 },
    idealPh: { min: 6.0, max: 7.5 },
    npkRatio: { n: 120, p: 60, k: 40 },
    durationDays: '115 - 130 days',
    sowingWindow: 'November 1 - November 25',
    harvestWindow: 'March - April',
    yieldPerAcre: 18.5,
    seedCostPerAcre: 1850,
    inputCostPerAcre: 15200,
    expectedPrice: 2550,
    msp: 2275,
    priceTrend: 'Stable',
    deficitPercentage: -19,
    currentStockTonnes: 28500,
    normalStockTonnes: 35000,
    perishability: 'Low',
    marketDemand: 'Very High',
    opportunityBadge: 'Guaranteed Procurement',
    historicalPrice: [
      { month: 'Nov', price: 2150, msp: 2275 },
      { month: 'Dec', price: 2200, msp: 2275 },
      { month: 'Jan', price: 2250, msp: 2275 },
      { month: 'Feb', price: 2275, msp: 2275 },
      { month: 'Mar (Proj)', price: 2380, msp: 2275 },
      { month: 'Apr (Harvest)', price: 2550, msp: 2275 }
    ],
    historicalPrices: [
      { month: 'Nov', price: 2150, msp: 2275 },
      { month: 'Dec', price: 2200, msp: 2275 },
      { month: 'Jan', price: 2250, msp: 2275 },
      { month: 'Feb', price: 2275, msp: 2275 },
      { month: 'Mar (Proj)', price: 2380, msp: 2275 },
      { month: 'Apr (Harvest)', price: 2550, msp: 2275 }
    ],
    marketInsights: 'FCI open-market sales stabilizing flour mill procurement; government export curbs maintain elevated domestic mill gate rates.',
    cultivationTips: [
      'Use certified seeds of HD-2967 or PBW-550',
      'Apply first irrigation strictly at Crown Root Initiation (CRI) stage (21 days)',
      'Split nitrogen into 3 doses: basal, first irrigation, and tillering'
    ],
    diseaseAlerts: ['Yellow rust alert in cooler humid weeks', 'Karnal bunt in high humidity areas']
  },

  // 2. Rice
  {
    id: 'rice',
    name: 'Rice',
    localName: 'चावल / धान (Dhan)',
    category: 'Cereal & Food Grain',
    season: ['Kharif'],
    suitableSoils: ['Clayey', 'Alluvial', 'Loamy', 'Black'],
    cropCycle: '120 - 145 days',
    seedCost: 1450,
    waterRequirement: 'High',
    idealTemperature: { min: 22, max: 35 },
    idealRainfall: { min: 1000, max: 1500 },
    baseDemand: 'High',
    currentStock: 32000,
    normalStock: 38000,
    currentPrice: 2320,
    expectedFuturePrice: 2580,
    climateRisk: 'Moderate',

    soilTypes: ['Clayey', 'Alluvial', 'Loamy', 'Black'],
    waterNeeds: 'High',
    waterSources: ['Canal', 'Borewell', 'Rainfed'],
    idealTemp: { min: 22, max: 35 },
    idealPh: { min: 5.5, max: 7.2 },
    npkRatio: { n: 100, p: 50, k: 50 },
    durationDays: '120 - 145 days',
    sowingWindow: 'June 1 - June 30',
    harvestWindow: 'October - November',
    yieldPerAcre: 22.0,
    seedCostPerAcre: 1450,
    inputCostPerAcre: 16800,
    expectedPrice: 2580,
    msp: 2300,
    priceTrend: 'Bullish',
    deficitPercentage: -16,
    currentStockTonnes: 32000,
    normalStockTonnes: 38000,
    perishability: 'Low',
    marketDemand: 'High',
    opportunityBadge: 'Export Demand Surge',
    historicalPrice: [
      { month: 'Jun', price: 2180, msp: 2300 },
      { month: 'Jul', price: 2220, msp: 2300 },
      { month: 'Aug', price: 2280, msp: 2300 },
      { month: 'Sep', price: 2320, msp: 2300 },
      { month: 'Oct (Proj)', price: 2420, msp: 2300 },
      { month: 'Nov (Harvest)', price: 2580, msp: 2300 }
    ],
    historicalPrices: [
      { month: 'Jun', price: 2180, msp: 2300 },
      { month: 'Jul', price: 2220, msp: 2300 },
      { month: 'Aug', price: 2280, msp: 2300 },
      { month: 'Sep', price: 2320, msp: 2300 },
      { month: 'Oct (Proj)', price: 2420, msp: 2300 },
      { month: 'Nov (Harvest)', price: 2580, msp: 2300 }
    ],
    marketInsights: 'Non-basmati export parity easing and Asian basin inventory drawdowns keep premium milling qualities in tight supply.',
    cultivationTips: [
      'Adopt Direct Seeded Rice (DSR) or System of Rice Intensification (SRI) to save 30% water',
      'Maintain 2-3 cm standing water during panicle initiation stage',
      'Incorporate zinc sulphate @ 25 kg/ha to prevent Khaira disease'
    ],
    diseaseAlerts: ['Blast disease in cloudy humid weather', 'Bacterial leaf blight after strong monsoon winds']
  },

  // 3. Soybean
  {
    id: 'soybean',
    name: 'Soybean',
    localName: 'सोयाबीन (Bhatwar)',
    category: 'Oilseed & Legume',
    season: ['Kharif'],
    suitableSoils: ['Black', 'Alluvial', 'Clayey', 'Loamy'],
    cropCycle: '90 - 105 days',
    seedCost: 2850,
    waterRequirement: 'Moderate',
    idealTemperature: { min: 20, max: 35 },
    idealRainfall: { min: 600, max: 1000 },
    baseDemand: 'High',
    currentStock: 14200,
    normalStock: 19500,
    currentPrice: 4850,
    expectedFuturePrice: 5400,
    climateRisk: 'Low',

    soilTypes: ['Black', 'Alluvial', 'Clayey', 'Loamy'],
    waterNeeds: 'Moderate',
    waterSources: ['Borewell', 'Canal', 'Rainfed', 'Drip'],
    idealTemp: { min: 20, max: 35 },
    idealPh: { min: 6.0, max: 7.5 },
    npkRatio: { n: 30, p: 60, k: 40 },
    durationDays: '90 - 105 days',
    sowingWindow: 'June 15 - July 15',
    harvestWindow: 'October - November',
    yieldPerAcre: 9.5,
    seedCostPerAcre: 2850,
    inputCostPerAcre: 14500,
    expectedPrice: 5400,
    msp: 4892,
    priceTrend: 'Bullish',
    deficitPercentage: -27,
    currentStockTonnes: 14200,
    normalStockTonnes: 19500,
    perishability: 'Low',
    marketDemand: 'High',
    opportunityBadge: 'Top Market Pick',
    historicalPrice: [
      { month: 'May', price: 4600, msp: 4892 },
      { month: 'Jun', price: 4720, msp: 4892 },
      { month: 'Jul', price: 4850, msp: 4892 },
      { month: 'Aug (Proj)', price: 5050, msp: 4892 },
      { month: 'Sep (Proj)', price: 5220, msp: 4892 },
      { month: 'Oct (Harvest)', price: 5400, msp: 4892 }
    ],
    historicalPrices: [
      { month: 'May', price: 4600, msp: 4892 },
      { month: 'Jun', price: 4720, msp: 4892 },
      { month: 'Jul', price: 4850, msp: 4892 },
      { month: 'Aug (Proj)', price: 5050, msp: 4892 },
      { month: 'Sep (Proj)', price: 5220, msp: 4892 },
      { month: 'Oct (Harvest)', price: 5400, msp: 4892 }
    ],
    marketInsights: 'Domestic crushing plants operating with low buffer stocks; crushing demand up 14% with strong meal exports.',
    cultivationTips: [
      'Seed treatment with Bradyrhizobium japonicum + PSB @ 5g/kg seed',
      'Maintain row spacing of 45 cm for adequate aeration and pod development',
      'Foliar spray of 2% DAP at flowering and pod filling enhances seed weight'
    ],
    diseaseAlerts: ['Stem fly during seedling emergence', 'Yellow Mosaic Virus in late sown crops']
  },

  // 4. Onion
  {
    id: 'onion',
    name: 'Onion',
    localName: 'प्याज / कांदा (Kanda)',
    category: 'Vegetable & Horticulture',
    season: ['Rabi', 'Kharif'],
    suitableSoils: ['Alluvial', 'Black', 'Sandy Loam', 'Red'],
    cropCycle: '90 - 120 days',
    seedCost: 3800,
    waterRequirement: 'Moderate',
    idealTemperature: { min: 15, max: 32 },
    idealRainfall: { min: 450, max: 750 },
    baseDemand: 'Very High',
    currentStock: 6800,
    normalStock: 12500,
    currentPrice: 3200,
    expectedFuturePrice: 4600,
    climateRisk: 'Moderate',

    soilTypes: ['Alluvial', 'Black', 'Sandy Loam', 'Red'],
    waterNeeds: 'Moderate',
    waterSources: ['Drip', 'Borewell', 'Canal'],
    idealTemp: { min: 15, max: 32 },
    idealPh: { min: 6.5, max: 7.8 },
    npkRatio: { n: 100, p: 50, k: 80 },
    durationDays: '90 - 120 days',
    sowingWindow: 'August - September (Late Kharif) / November (Rabi)',
    harvestWindow: 'December - January / April - May',
    yieldPerAcre: 110, // quintals per acre
    seedCostPerAcre: 3800,
    inputCostPerAcre: 38000,
    expectedPrice: 4600,
    msp: 0,
    priceTrend: 'Surging',
    deficitPercentage: -45,
    currentStockTonnes: 6800,
    normalStockTonnes: 12500,
    perishability: 'Medium',
    marketDemand: 'Very High',
    opportunityBadge: 'High Profit Potential',
    historicalPrice: [
      { month: 'Aug', price: 2400 },
      { month: 'Sep', price: 2750 },
      { month: 'Oct', price: 3200 },
      { month: 'Nov (Proj)', price: 3650 },
      { month: 'Dec (Proj)', price: 4100 },
      { month: 'Jan (Harvest)', price: 4600 }
    ],
    historicalPrices: [
      { month: 'Aug', price: 2400 },
      { month: 'Sep', price: 2750 },
      { month: 'Oct', price: 3200 },
      { month: 'Nov (Proj)', price: 3650 },
      { month: 'Dec (Proj)', price: 4100 },
      { month: 'Jan (Harvest)', price: 4600 }
    ],
    marketInsights: 'Major storage inventories depleted in Maharashtra and Karnataka; terminal markets seeing daily arrival drops of 35%.',
    cultivationTips: [
      'Transplant 6-7 week old seedlings on raised broad beds',
      'Ensure sulphur fertilization @ 30 kg/ha for bulb firmness and pungency',
      'Withhold irrigation 15 days before harvesting to improve curing'
    ],
    diseaseAlerts: ['Purple blotch under dense morning fog', 'Thrips infestation during warm dry spells']
  },

  // 5. Tomato
  {
    id: 'tomato',
    name: 'Tomato',
    localName: 'टमाटर (Tamatar)',
    category: 'Vegetable & Horticulture',
    season: ['Kharif', 'Rabi', 'Zaid'],
    suitableSoils: ['Sandy Loam', 'Alluvial', 'Black', 'Red'],
    cropCycle: '75 - 90 days',
    seedCost: 3200,
    waterRequirement: 'Moderate',
    idealTemperature: { min: 18, max: 30 },
    idealRainfall: { min: 400, max: 700 },
    baseDemand: 'Very High',
    currentStock: 4800,
    normalStock: 8200,
    currentPrice: 2800,
    expectedFuturePrice: 3900,
    climateRisk: 'High',

    soilTypes: ['Sandy Loam', 'Alluvial', 'Black', 'Red'],
    waterNeeds: 'Moderate',
    waterSources: ['Drip', 'Borewell'],
    idealTemp: { min: 18, max: 30 },
    idealPh: { min: 6.0, max: 7.2 },
    npkRatio: { n: 120, p: 80, k: 100 },
    durationDays: '75 - 90 days',
    sowingWindow: 'June - July / October - November',
    harvestWindow: 'Continuous picking for 4-6 weeks',
    yieldPerAcre: 160,
    seedCostPerAcre: 3200,
    inputCostPerAcre: 42000,
    expectedPrice: 3900,
    msp: 0,
    priceTrend: 'Surging',
    deficitPercentage: -41,
    currentStockTonnes: 4800,
    normalStockTonnes: 8200,
    perishability: 'High',
    marketDemand: 'Very High',
    opportunityBadge: 'Short Cycle Cash Flow',
    historicalPrice: [
      { month: 'May', price: 1900 },
      { month: 'Jun', price: 2300 },
      { month: 'Jul', price: 2800 },
      { month: 'Aug (Proj)', price: 3200 },
      { month: 'Sep (Proj)', price: 3500 },
      { month: 'Oct (Harvest)', price: 3900 }
    ],
    historicalPrices: [
      { month: 'May', price: 1900 },
      { month: 'Jun', price: 2300 },
      { month: 'Jul', price: 2800 },
      { month: 'Aug (Proj)', price: 3200 },
      { month: 'Sep (Proj)', price: 3500 },
      { month: 'Oct (Harvest)', price: 3900 }
    ],
    marketInsights: 'Intense demand in metropolitan consumption zones; heatwave damages in early season created supply gaps across South & Central mandis.',
    cultivationTips: [
      'Use indeterminate hybrids like US-440 or Abhinav with trellising and stake support',
      'Apply calcium nitrate to eliminate blossom end rot',
      'Implement mulching to conserve moisture and reduce fruit contact with soil'
    ],
    diseaseAlerts: ['Early blight and late blight in humid cloudy spells', 'Leaf curl virus transmitted by whiteflies']
  },

  // 6. Potato
  {
    id: 'potato',
    name: 'Potato',
    localName: 'आलू (Aloo)',
    category: 'Tuber & Horticulture',
    season: ['Rabi'],
    suitableSoils: ['Sandy Loam', 'Alluvial', 'Loamy'],
    cropCycle: '85 - 105 days',
    seedCost: 6500,
    waterRequirement: 'Moderate',
    idealTemperature: { min: 14, max: 24 },
    idealRainfall: { min: 350, max: 550 },
    baseDemand: 'High',
    currentStock: 16500,
    normalStock: 22000,
    currentPrice: 1650,
    expectedFuturePrice: 2100,
    climateRisk: 'Low',

    soilTypes: ['Sandy Loam', 'Alluvial', 'Loamy'],
    waterNeeds: 'Moderate',
    waterSources: ['Drip', 'Sprinkler', 'Canal'],
    idealTemp: { min: 14, max: 24 },
    idealPh: { min: 5.5, max: 7.0 },
    npkRatio: { n: 150, p: 80, k: 120 },
    durationDays: '85 - 105 days',
    sowingWindow: 'October 15 - November 10',
    harvestWindow: 'January - February',
    yieldPerAcre: 140,
    seedCostPerAcre: 6500,
    inputCostPerAcre: 34000,
    expectedPrice: 2100,
    msp: 0,
    priceTrend: 'Bullish',
    deficitPercentage: -25,
    currentStockTonnes: 16500,
    normalStockTonnes: 22000,
    perishability: 'Medium',
    marketDemand: 'High',
    opportunityBadge: 'Bulk Processing Demand',
    historicalPrice: [
      { month: 'Oct', price: 1400 },
      { month: 'Nov', price: 1520 },
      { month: 'Dec', price: 1650 },
      { month: 'Jan (Proj)', price: 1780 },
      { month: 'Feb (Proj)', price: 1920 },
      { month: 'Mar (Harvest)', price: 2100 }
    ],
    historicalPrices: [
      { month: 'Oct', price: 1400 },
      { month: 'Nov', price: 1520 },
      { month: 'Dec', price: 1650 },
      { month: 'Jan (Proj)', price: 1780 },
      { month: 'Feb (Proj)', price: 1920 },
      { month: 'Mar (Harvest)', price: 2100 }
    ],
    marketInsights: 'Cold storage dispatches tracking ahead of schedule; processing variety demand (chip-grade) trading at 22% premium.',
    cultivationTips: [
      'Use well-sprouted seed tubers of Kufri Pukhraj or Kufri Chipsona',
      'Perform earthing-up 30 days after planting to prevent greening of tubers',
      'Stop irrigation 10-12 days before dehaulming'
    ],
    diseaseAlerts: ['Late blight warning during overcast misty days', 'Black scurf on tuber surface in untreated soil']
  },

  // 7. Watermelon
  {
    id: 'watermelon',
    name: 'Watermelon',
    localName: 'तरबूज (Tarbooj)',
    category: 'Fruit & Horticulture',
    season: ['Zaid'],
    suitableSoils: ['Sandy Loam', 'Alluvial', 'Sandy Riverbed'],
    cropCycle: '75 - 95 days',
    seedCost: 4200,
    waterRequirement: 'Moderate',
    idealTemperature: { min: 24, max: 38 },
    idealRainfall: { min: 300, max: 500 },
    baseDemand: 'High',
    currentStock: 5200,
    normalStock: 8900,
    currentPrice: 1400,
    expectedFuturePrice: 2050,
    climateRisk: 'Moderate',

    soilTypes: ['Sandy Loam', 'Alluvial', 'Sandy Riverbed'],
    waterNeeds: 'Moderate',
    waterSources: ['Drip', 'Borewell'],
    idealTemp: { min: 24, max: 38 },
    idealPh: { min: 6.0, max: 7.5 },
    npkRatio: { n: 100, p: 60, k: 90 },
    durationDays: '75 - 95 days',
    sowingWindow: 'January 15 - February 28',
    harvestWindow: 'April - May (Summer peak)',
    yieldPerAcre: 180,
    seedCostPerAcre: 4200,
    inputCostPerAcre: 28000,
    expectedPrice: 2050,
    msp: 0,
    priceTrend: 'Bullish',
    deficitPercentage: -42,
    currentStockTonnes: 5200,
    normalStockTonnes: 8900,
    perishability: 'Medium',
    marketDemand: 'High',
    opportunityBadge: 'Summer Cash Inflow',
    historicalPrice: [
      { month: 'Jan', price: 1100 },
      { month: 'Feb', price: 1250 },
      { month: 'Mar', price: 1400 },
      { month: 'Apr (Proj)', price: 1650 },
      { month: 'May (Proj)', price: 1850 },
      { month: 'Jun (Harvest)', price: 2050 }
    ],
    historicalPrices: [
      { month: 'Jan', price: 1100 },
      { month: 'Feb', price: 1250 },
      { month: 'Mar', price: 1400 },
      { month: 'Apr (Proj)', price: 1650 },
      { month: 'May (Proj)', price: 1850 },
      { month: 'Jun (Harvest)', price: 2050 }
    ],
    marketInsights: 'Anticipated severe summer heat index driving heavy wholesale procurement contracts from retail and beverage aggregators.',
    cultivationTips: [
      'Silver-black plastic mulching (25-30 micron) for moisture conservation and weed control',
      'Drip fertigation with 19:19:19 and potassium nitrate at fruit sizing stage',
      'Turn developing fruits gently to ensure uniform ground color'
    ],
    diseaseAlerts: ['Downy mildew during early morning dew', 'Fruit fly damage during ripening phase']
  },

  // 8. Banana
  {
    id: 'banana',
    name: 'Banana',
    localName: 'केला (Kela)',
    category: 'Fruit & Plantation',
    season: ['Perennial'],
    suitableSoils: ['Alluvial', 'Clayey Loam', 'Black', 'Volcanic Rich'],
    cropCycle: '330 - 365 days',
    seedCost: 11500,
    waterRequirement: 'High',
    idealTemperature: { min: 20, max: 36 },
    idealRainfall: { min: 1200, max: 2000 },
    baseDemand: 'Very High',
    currentStock: 12400,
    normalStock: 18000,
    currentPrice: 2150,
    expectedFuturePrice: 2600,
    climateRisk: 'Moderate',

    soilTypes: ['Alluvial', 'Clayey Loam', 'Black', 'Volcanic Rich'],
    waterNeeds: 'High',
    waterSources: ['Drip', 'Borewell', 'Canal'],
    idealTemp: { min: 20, max: 36 },
    idealPh: { min: 6.0, max: 7.5 },
    npkRatio: { n: 200, p: 60, k: 300 },
    durationDays: '330 - 365 days',
    sowingWindow: 'June - July / February - March',
    harvestWindow: '11-12 months from planting',
    yieldPerAcre: 320,
    seedCostPerAcre: 11500,
    inputCostPerAcre: 52000,
    expectedPrice: 2600,
    msp: 0,
    priceTrend: 'Bullish',
    deficitPercentage: -31,
    currentStockTonnes: 12400,
    normalStockTonnes: 18000,
    perishability: 'Medium',
    marketDemand: 'Very High',
    opportunityBadge: 'High Commercial Return',
    historicalPrice: [
      { month: 'Mar', price: 1800 },
      { month: 'Apr', price: 1950 },
      { month: 'May', price: 2150 },
      { month: 'Jun (Proj)', price: 2300 },
      { month: 'Jul (Proj)', price: 2450 },
      { month: 'Aug (Harvest)', price: 2600 }
    ],
    historicalPrices: [
      { month: 'Mar', price: 1800 },
      { month: 'Apr', price: 1950 },
      { month: 'May', price: 2150 },
      { month: 'Jun (Proj)', price: 2300 },
      { month: 'Jul (Proj)', price: 2450 },
      { month: 'Aug (Harvest)', price: 2600 }
    ],
    marketInsights: 'Gulf export shipments and cold-chain refrigerated van transport expansion from Jalgaon and Theni mandis supporting firm pricing.',
    cultivationTips: [
      'Plant disease-free Grand Naine (G9) tissue culture plantlets',
      'Provide bamboo or nylon propping to support heavy bunch weight (25-35 kg)',
      'Bag bunches with non-woven polypropylene covers to prevent sun scorch'
    ],
    diseaseAlerts: ['Sigatoka leaf spot during peak monsoon', 'Panama wilt in ill-drained soil']
  },

  // 9. Sugarcane
  {
    id: 'sugarcane',
    name: 'Sugarcane',
    localName: 'गन्ना (Ganna / Eekh)',
    category: 'Cash Crop & Agro-industrial',
    season: ['Annual'],
    suitableSoils: ['Black', 'Alluvial', 'Clayey Loam', 'Red'],
    cropCycle: '330 - 365 days',
    seedCost: 7500,
    waterRequirement: 'High',
    idealTemperature: { min: 20, max: 38 },
    idealRainfall: { min: 1100, max: 1800 },
    baseDemand: 'Very High',
    currentStock: 48000,
    normalStock: 55000,
    currentPrice: 340,
    expectedFuturePrice: 375,
    climateRisk: 'Low',

    soilTypes: ['Black', 'Alluvial', 'Clayey Loam', 'Red'],
    waterNeeds: 'High',
    waterSources: ['Canal', 'Borewell', 'Drip'],
    idealTemp: { min: 20, max: 38 },
    idealPh: { min: 6.5, max: 8.0 },
    npkRatio: { n: 250, p: 100, k: 120 },
    durationDays: '330 - 365 days',
    sowingWindow: 'January - March (Suru) / October (Adsali)',
    harvestWindow: '12 months from planting',
    yieldPerAcre: 450, // quintals per acre
    seedCostPerAcre: 7500,
    inputCostPerAcre: 48000,
    expectedPrice: 375,
    msp: 340, // FRP per quintal
    priceTrend: 'Stable',
    deficitPercentage: -13,
    currentStockTonnes: 48000,
    normalStockTonnes: 55000,
    perishability: 'Low',
    marketDemand: 'Very High',
    opportunityBadge: 'Guaranteed Statutory FRP',
    historicalPrice: [
      { month: 'Oct', price: 315, msp: 340 },
      { month: 'Nov', price: 325, msp: 340 },
      { month: 'Dec', price: 340, msp: 340 },
      { month: 'Jan (Proj)', price: 350, msp: 340 },
      { month: 'Feb (Proj)', price: 360, msp: 340 },
      { month: 'Mar (Harvest)', price: 375, msp: 340 }
    ],
    historicalPrices: [
      { month: 'Oct', price: 315, msp: 340 },
      { month: 'Nov', price: 325, msp: 340 },
      { month: 'Dec', price: 340, msp: 340 },
      { month: 'Jan (Proj)', price: 350, msp: 340 },
      { month: 'Feb (Proj)', price: 360, msp: 340 },
      { month: 'Mar (Harvest)', price: 375, msp: 340 }
    ],
    marketInsights: 'Ethanol blending mandate (20% target) drives aggressive sugar mill distillery diversion, ensuring timely cane billing.',
    cultivationTips: [
      'Use 2-budded healthy setts treated with carbendazim solution',
      'Pair row planting with subsurface drip irrigation to slash water consumption by 40%',
      'Earthing up at 90-100 days prevents lodging under high winds'
    ],
    diseaseAlerts: ['Red rot in susceptible varieties', 'Early shoot borer during high temperature germination']
  },

  // 10. Cotton
  {
    id: 'cotton',
    name: 'Cotton',
    localName: 'कपास (Kapas)',
    category: 'Cash Crop & Fiber',
    season: ['Kharif'],
    suitableSoils: ['Black', 'Alluvial', 'Clayey', 'Loamy'],
    cropCycle: '150 - 180 days',
    seedCost: 3600,
    waterRequirement: 'Moderate',
    idealTemperature: { min: 22, max: 38 },
    idealRainfall: { min: 600, max: 1100 },
    baseDemand: 'High',
    currentStock: 17500,
    normalStock: 23500,
    currentPrice: 7200,
    expectedFuturePrice: 8050,
    climateRisk: 'Moderate',

    soilTypes: ['Black', 'Alluvial', 'Clayey', 'Loamy'],
    waterNeeds: 'Moderate',
    waterSources: ['Borewell', 'Canal', 'Drip'],
    idealTemp: { min: 22, max: 38 },
    idealPh: { min: 6.5, max: 8.5 },
    npkRatio: { n: 120, p: 60, k: 60 },
    durationDays: '150 - 180 days',
    sowingWindow: 'May 15 - June 30',
    harvestWindow: 'November - January',
    yieldPerAcre: 8.5,
    seedCostPerAcre: 3600,
    inputCostPerAcre: 24000,
    expectedPrice: 8050,
    msp: 7122,
    priceTrend: 'Bullish',
    deficitPercentage: -26,
    currentStockTonnes: 17500,
    normalStockTonnes: 23500,
    perishability: 'Low',
    marketDemand: 'High',
    opportunityBadge: 'Strong Mill Demand',
    historicalPrice: [
      { month: 'Jul', price: 6800, msp: 7122 },
      { month: 'Aug', price: 6950, msp: 7122 },
      { month: 'Sep', price: 7200, msp: 7122 },
      { month: 'Oct (Proj)', price: 7450, msp: 7122 },
      { month: 'Nov (Proj)', price: 7700, msp: 7122 },
      { month: 'Dec (Harvest)', price: 8050, msp: 7122 }
    ],
    historicalPrices: [
      { month: 'Jul', price: 6800, msp: 7122 },
      { month: 'Aug', price: 6950, msp: 7122 },
      { month: 'Sep', price: 7200, msp: 7122 },
      { month: 'Oct (Proj)', price: 7450, msp: 7122 },
      { month: 'Nov (Proj)', price: 7700, msp: 7122 },
      { month: 'Dec (Harvest)', price: 8050, msp: 7122 }
    ],
    marketInsights: 'Textile spinning mills operating at high capacity; multi-year lows in global cotton opening stocks bolster spot auctions.',
    cultivationTips: [
      'Install pheromone traps @ 5 traps/acre for Pink Bollworm surveillance at 45 DAS',
      'Foliar spray of 1% MgSO4 + 1% 19:19:19 to avoid leaf reddening',
      'Nipping / topping of terminal shoots at 80-90 DAS checks vegetative overgrowth'
    ],
    diseaseAlerts: ['Pink bollworm infestation during boll formation', 'Root rot in waterlogged black soils']
  },

  // 11. Maize
  {
    id: 'maize',
    name: 'Maize',
    localName: 'मक्का (Makka / Bhutta)',
    category: 'Coarse Cereal & Feed',
    season: ['Kharif', 'Rabi'],
    suitableSoils: ['Alluvial', 'Red', 'Black', 'Sandy Loam'],
    cropCycle: '90 - 110 days',
    seedCost: 2200,
    waterRequirement: 'Moderate',
    idealTemperature: { min: 18, max: 34 },
    idealRainfall: { min: 500, max: 800 },
    baseDemand: 'High',
    currentStock: 15400,
    normalStock: 20000,
    currentPrice: 2280,
    expectedFuturePrice: 2560,
    climateRisk: 'Low',

    soilTypes: ['Alluvial', 'Red', 'Black', 'Sandy Loam'],
    waterNeeds: 'Moderate',
    waterSources: ['Canal', 'Borewell', 'Rainfed'],
    idealTemp: { min: 18, max: 34 },
    idealPh: { min: 6.0, max: 7.8 },
    npkRatio: { n: 120, p: 60, k: 40 },
    durationDays: '90 - 110 days',
    sowingWindow: 'June 20 - July 15 / October 15 - November 15',
    harvestWindow: 'September - October / February - March',
    yieldPerAcre: 24.0,
    seedCostPerAcre: 2200,
    inputCostPerAcre: 13500,
    expectedPrice: 2560,
    msp: 2090,
    priceTrend: 'Bullish',
    deficitPercentage: -23,
    currentStockTonnes: 15400,
    normalStockTonnes: 20000,
    perishability: 'Low',
    marketDemand: 'High',
    opportunityBadge: 'Ethanol & Poultry Demand',
    historicalPrice: [
      { month: 'Jun', price: 2080, msp: 2090 },
      { month: 'Jul', price: 2160, msp: 2090 },
      { month: 'Aug', price: 2280, msp: 2090 },
      { month: 'Sep (Proj)', price: 2360, msp: 2090 },
      { month: 'Oct (Proj)', price: 2450, msp: 2090 },
      { month: 'Nov (Harvest)', price: 2560, msp: 2090 }
    ],
    historicalPrices: [
      { month: 'Jun', price: 2080, msp: 2090 },
      { month: 'Jul', price: 2160, msp: 2090 },
      { month: 'Aug', price: 2280, msp: 2090 },
      { month: 'Sep (Proj)', price: 2360, msp: 2090 },
      { month: 'Oct (Proj)', price: 2450, msp: 2090 },
      { month: 'Nov (Harvest)', price: 2560, msp: 2090 }
    ],
    marketInsights: 'Poultry feed sector growing 8% annually and grain-based ethanol distillers actively procuring at 15-20% above MSP.',
    cultivationTips: [
      'Maintain spacing of 60 cm x 20 cm for high-yielding single cross hybrids',
      'Tasseling and silking stages are critical; do not allow moisture stress',
      'Apply atrazine @ 1 kg a.i./ha within 48 hours of sowing for weed control'
    ],
    diseaseAlerts: ['Fall armyworm (FAW) whorl feeding in early vegetative stage', 'Maydis leaf blight in cloudy seasons']
  },

  // 12. Groundnut
  {
    id: 'groundnut',
    name: 'Groundnut',
    localName: 'मूंगफली (Mungfali)',
    category: 'Oilseed & Legume',
    season: ['Kharif', 'Rabi'],
    suitableSoils: ['Sandy Loam', 'Red', 'Alluvial', 'Black'],
    cropCycle: '105 - 125 days',
    seedCost: 3900,
    waterRequirement: 'Moderate',
    idealTemperature: { min: 22, max: 32 },
    idealRainfall: { min: 500, max: 850 },
    baseDemand: 'High',
    currentStock: 9400,
    normalStock: 13500,
    currentPrice: 6650,
    expectedFuturePrice: 7420,
    climateRisk: 'Low',

    soilTypes: ['Sandy Loam', 'Red', 'Alluvial', 'Black'],
    waterNeeds: 'Moderate',
    waterSources: ['Drip', 'Borewell', 'Rainfed'],
    idealTemp: { min: 22, max: 32 },
    idealPh: { min: 6.0, max: 7.5 },
    npkRatio: { n: 25, p: 50, k: 40 },
    durationDays: '105 - 125 days',
    sowingWindow: 'June 15 - July 10 / November 1 - November 25',
    harvestWindow: 'October / March - April',
    yieldPerAcre: 11.5,
    seedCostPerAcre: 3900,
    inputCostPerAcre: 16800,
    expectedPrice: 7420,
    msp: 6377,
    priceTrend: 'Bullish',
    deficitPercentage: -30,
    currentStockTonnes: 9400,
    normalStockTonnes: 13500,
    perishability: 'Low',
    marketDemand: 'High',
    opportunityBadge: 'Export Quality Premium',
    historicalPrice: [
      { month: 'May', price: 6150, msp: 6377 },
      { month: 'Jun', price: 6380, msp: 6377 },
      { month: 'Jul', price: 6650, msp: 6377 },
      { month: 'Aug (Proj)', price: 6900, msp: 6377 },
      { month: 'Sep (Proj)', price: 7150, msp: 6377 },
      { month: 'Oct (Harvest)', price: 7420, msp: 6377 }
    ],
    historicalPrices: [
      { month: 'May', price: 6150, msp: 6377 },
      { month: 'Jun', price: 6380, msp: 6377 },
      { month: 'Jul', price: 6650, msp: 6377 },
      { month: 'Aug (Proj)', price: 6900, msp: 6377 },
      { month: 'Sep (Proj)', price: 7150, msp: 6377 },
      { month: 'Oct (Harvest)', price: 7420, msp: 6377 }
    ],
    marketInsights: 'Bold kernel exports to Southeast Asia and strong oil extraction margins keep regional mandi bids buoyant.',
    cultivationTips: [
      'Apply gypsum @ 200 kg/ha at flowering (40 DAS) for proper pegging and pod filling',
      'Seed treatment with Trichoderma viride @ 4g/kg seed to suppress collar rot',
      'Avoid intercultivation after peg initiation to avoid damaging subterranean pods'
    ],
    diseaseAlerts: ['Tikka leaf spot in high humidity', 'Collar rot in saturated soil']
  },

  // 13. Chickpea
  {
    id: 'chickpea',
    name: 'Chickpea',
    localName: 'चना (Chana / Gram)',
    category: 'Pulse & Legume',
    season: ['Rabi'],
    suitableSoils: ['Black', 'Alluvial', 'Clayey', 'Loamy'],
    cropCycle: '100 - 120 days',
    seedCost: 2900,
    waterRequirement: 'Low',
    idealTemperature: { min: 15, max: 30 },
    idealRainfall: { min: 400, max: 700 },
    baseDemand: 'High',
    currentStock: 11200,
    normalStock: 18000,
    currentPrice: 6100,
    expectedFuturePrice: 6650,
    climateRisk: 'Low',

    soilTypes: ['Black', 'Alluvial', 'Clayey', 'Loamy'],
    waterNeeds: 'Low',
    waterSources: ['Borewell', 'Canal', 'Rainfed', 'Drip'],
    idealTemp: { min: 15, max: 30 },
    idealPh: { min: 6.2, max: 8.2 },
    npkRatio: { n: 25, p: 50, k: 25 },
    durationDays: '100 - 120 days',
    sowingWindow: 'October 15 - November 20',
    harvestWindow: 'February - March',
    yieldPerAcre: 7.8,
    seedCostPerAcre: 2900,
    inputCostPerAcre: 12200,
    expectedPrice: 6650,
    msp: 5440,
    priceTrend: 'Surging',
    deficitPercentage: -38,
    currentStockTonnes: 11200,
    normalStockTonnes: 18000,
    perishability: 'Low',
    marketDemand: 'High',
    opportunityBadge: 'High Pulse Demand',
    historicalPrice: [
      { month: 'Sep', price: 5600, msp: 5440 },
      { month: 'Oct', price: 5850, msp: 5440 },
      { month: 'Nov', price: 6100, msp: 5440 },
      { month: 'Dec (Proj)', price: 6300, msp: 5440 },
      { month: 'Jan (Proj)', price: 6480, msp: 5440 },
      { month: 'Feb (Harvest)', price: 6650, msp: 5440 }
    ],
    historicalPrices: [
      { month: 'Sep', price: 5600, msp: 5440 },
      { month: 'Oct', price: 5850, msp: 5440 },
      { month: 'Nov', price: 6100, msp: 5440 },
      { month: 'Dec (Proj)', price: 6300, msp: 5440 },
      { month: 'Jan (Proj)', price: 6480, msp: 5440 },
      { month: 'Feb (Harvest)', price: 6650, msp: 5440 }
    ],
    marketInsights: 'National buffer inventory below target thresholds. Strong festival and institutional procurement driving prices 18% above MSP.',
    cultivationTips: [
      'Nipping of apical shoots at 30-40 DAS promotes vigorous lateral branching and pod numbers',
      'Provide one light irrigation at pre-flowering and one at pod development',
      'Incorporate Rhizobium leguminosarum bio-fertilizer during sowing'
    ],
    diseaseAlerts: ['Fusarium wilt in warm dry soil', 'Helicoverpa armigera pod borer at green pod stage']
  },

  // 14. Turmeric
  {
    id: 'turmeric',
    name: 'Turmeric',
    localName: 'हल्दी (Haldi)',
    category: 'Spice & High-Value Cash',
    season: ['Kharif', 'Annual'],
    suitableSoils: ['Loamy', 'Black', 'Red', 'Alluvial'],
    cropCycle: '210 - 240 days',
    seedCost: 9800,
    waterRequirement: 'Moderate',
    idealTemperature: { min: 20, max: 35 },
    idealRainfall: { min: 1000, max: 1600 },
    baseDemand: 'Very High',
    currentStock: 5400,
    normalStock: 10200,
    currentPrice: 14200,
    expectedFuturePrice: 16200,
    climateRisk: 'Moderate',

    soilTypes: ['Loamy', 'Black', 'Red', 'Alluvial'],
    waterNeeds: 'Moderate',
    waterSources: ['Drip', 'Borewell', 'Canal'],
    idealTemp: { min: 20, max: 35 },
    idealPh: { min: 5.5, max: 7.5 },
    npkRatio: { n: 120, p: 60, k: 120 },
    durationDays: '210 - 240 days',
    sowingWindow: 'May 15 - June 30',
    harvestWindow: 'January - March',
    yieldPerAcre: 22.0,
    seedCostPerAcre: 9800,
    inputCostPerAcre: 36000,
    expectedPrice: 16200,
    msp: 0,
    priceTrend: 'Surging',
    deficitPercentage: -47,
    currentStockTonnes: 5400,
    normalStockTonnes: 10200,
    perishability: 'Low',
    marketDemand: 'Very High',
    opportunityBadge: 'Top Profit Margin',
    historicalPrice: [
      { month: 'Feb', price: 11500 },
      { month: 'Mar', price: 12600 },
      { month: 'Apr', price: 13400 },
      { month: 'May', price: 14200 },
      { month: 'Jun (Proj)', price: 15100 },
      { month: 'Jul (Harvest)', price: 16200 }
    ],
    historicalPrices: [
      { month: 'Feb', price: 11500 },
      { month: 'Mar', price: 12600 },
      { month: 'Apr', price: 13400 },
      { month: 'May', price: 14200 },
      { month: 'Jun (Proj)', price: 15100 },
      { month: 'Jul (Harvest)', price: 16200 }
    ],
    marketInsights: 'Severe crop damage reported from key growing pockets in Marathwada and Telangana; export demand surging for high-curcumin finger grades.',
    cultivationTips: [
      'Plant bold mother rhizomes on raised beds with drip irrigation lines',
      'Apply thick green leaf mulch @ 12 t/ha immediately after planting to retain soil moisture',
      'Foliar spray of micronutrient mixture at 60 and 90 DAS improves rhizome development'
    ],
    diseaseAlerts: ['Rhizome rot in waterlogged conditions', 'Leaf blotch in prolonged damp monsoon spells']
  },

  // 15. Pomegranate
  {
    id: 'pomegranate',
    name: 'Pomegranate',
    localName: 'अनार / डालिंब (Dalimb)',
    category: 'Fruit & High-Value Horticulture',
    season: ['Perennial'],
    suitableSoils: ['Black', 'Sandy Loam', 'Alluvial', 'Red'],
    cropCycle: '150 - 180 days',
    seedCost: 8500,
    waterRequirement: 'Low',
    idealTemperature: { min: 18, max: 38 },
    idealRainfall: { min: 400, max: 750 },
    baseDemand: 'High',
    currentStock: 3600,
    normalStock: 6800,
    currentPrice: 9500,
    expectedFuturePrice: 11200,
    climateRisk: 'Low',

    soilTypes: ['Black', 'Sandy Loam', 'Alluvial', 'Red'],
    waterNeeds: 'Low',
    waterSources: ['Drip', 'Borewell'],
    idealTemp: { min: 18, max: 38 },
    idealPh: { min: 6.5, max: 8.2 },
    npkRatio: { n: 120, p: 60, k: 150 },
    durationDays: '150 - 180 days',
    sowingWindow: 'Hasth Bahar (Sep-Oct) / Mrig Bahar (Jun-Jul)',
    harvestWindow: '5-6 months after flower induction',
    yieldPerAcre: 55.0,
    seedCostPerAcre: 8500,
    inputCostPerAcre: 48000,
    expectedPrice: 11200,
    msp: 0,
    priceTrend: 'Bullish',
    deficitPercentage: -47,
    currentStockTonnes: 3600,
    normalStockTonnes: 6800,
    perishability: 'Medium',
    marketDemand: 'High',
    opportunityBadge: 'High Value Orchard Export',
    historicalPrice: [
      { month: 'Jul', price: 7800 },
      { month: 'Aug', price: 8400 },
      { month: 'Sep', price: 9000 },
      { month: 'Oct', price: 9500 },
      { month: 'Nov (Proj)', price: 10200 },
      { month: 'Dec (Harvest)', price: 11200 }
    ],
    historicalPrices: [
      { month: 'Jul', price: 7800 },
      { month: 'Aug', price: 8400 },
      { month: 'Sep', price: 9000 },
      { month: 'Oct', price: 9500 },
      { month: 'Nov (Proj)', price: 10200 },
      { month: 'Dec (Harvest)', price: 11200 }
    ],
    marketInsights: 'Bhagwa export-grade pomegranate witnessing record realizations in European and Middle-Eastern shipments with zero pesticide interception.',
    cultivationTips: [
      'Induce stress (withhold irrigation for 35-45 days) before pruning for synchronized flowering (Bahar treatment)',
      'Bag individual developing fruits with butter paper covers to prevent fruit borer and sun scald',
      'Incorporate calcium and boron during fruit set to avoid rind cracking'
    ],
    diseaseAlerts: ['Bacterial blight (Telya) surveillance during warm drizzling weather', 'Fruit borer at marble size']
  },

  // Bonus 16: Mustard
  {
    id: 'mustard',
    name: 'Mustard',
    localName: 'सरसों / राई (Sarson)',
    category: 'Oilseed',
    season: ['Rabi'],
    suitableSoils: ['Alluvial', 'Sandy Loam', 'Clayey', 'Red'],
    cropCycle: '110 - 130 days',
    seedCost: 1650,
    waterRequirement: 'Low',
    idealTemperature: { min: 10, max: 28 },
    idealRainfall: { min: 350, max: 600 },
    baseDemand: 'High',
    currentStock: 9800,
    normalStock: 14000,
    currentPrice: 5650,
    expectedFuturePrice: 6200,
    climateRisk: 'Low',

    soilTypes: ['Alluvial', 'Sandy Loam', 'Clayey', 'Red'],
    waterNeeds: 'Low',
    waterSources: ['Borewell', 'Canal', 'Drip'],
    idealTemp: { min: 10, max: 28 },
    idealPh: { min: 6.0, max: 8.0 },
    npkRatio: { n: 80, p: 40, k: 30 },
    durationDays: '110 - 130 days',
    sowingWindow: 'October 10 - November 5',
    harvestWindow: 'February - March',
    yieldPerAcre: 8.2,
    seedCostPerAcre: 1650,
    inputCostPerAcre: 11800,
    expectedPrice: 6200,
    msp: 5650,
    priceTrend: 'Bullish',
    deficitPercentage: -30,
    currentStockTonnes: 9800,
    normalStockTonnes: 14000,
    perishability: 'Low',
    marketDemand: 'High',
    opportunityBadge: 'High Profit Margin',
    historicalPrice: [
      { month: 'Oct', price: 5350, msp: 5650 },
      { month: 'Nov', price: 5480, msp: 5650 },
      { month: 'Dec', price: 5650, msp: 5650 },
      { month: 'Jan (Proj)', price: 5850, msp: 5650 },
      { month: 'Feb (Proj)', price: 6050, msp: 5650 },
      { month: 'Mar (Harvest)', price: 6200, msp: 5650 }
    ],
    historicalPrices: [
      { month: 'Oct', price: 5350, msp: 5650 },
      { month: 'Nov', price: 5480, msp: 5650 },
      { month: 'Dec', price: 5650, msp: 5650 },
      { month: 'Jan (Proj)', price: 5850, msp: 5650 },
      { month: 'Feb (Proj)', price: 6050, msp: 5650 },
      { month: 'Mar (Harvest)', price: 6200, msp: 5650 }
    ],
    marketInsights: 'High import duties on palm oil shifting consumer demand to indigenous mustard oil. Mandis reporting early procurement premiums.',
    cultivationTips: [
      'Apply single superphosphate (SSP) @ 150 kg/ha to supply essential sulphur for oil synthesis',
      'Thinning at 15-20 DAS to maintain 10-12 cm intra-row plant spacing',
      'One irrigation at flowering and one at siliquae filling maximizes seed weight'
    ],
    diseaseAlerts: ['Aphid infestation during cloudy winter periods', 'White rust in foggy conditions']
  },

  // Bonus 17: Moong
  {
    id: 'moong',
    name: 'Green Gram',
    localName: 'मूंग (Moong)',
    category: 'Pulse & Legume',
    season: ['Zaid', 'Kharif'],
    suitableSoils: ['Alluvial', 'Loamy', 'Sandy Loam', 'Black'],
    cropCycle: '60 - 70 days',
    seedCost: 2200,
    waterRequirement: 'Low',
    idealTemperature: { min: 25, max: 38 },
    idealRainfall: { min: 350, max: 600 },
    baseDemand: 'High',
    currentStock: 4800,
    normalStock: 8200,
    currentPrice: 8550,
    expectedFuturePrice: 9100,
    climateRisk: 'Low',

    soilTypes: ['Alluvial', 'Loamy', 'Sandy Loam', 'Black'],
    waterNeeds: 'Low',
    waterSources: ['Borewell', 'Canal', 'Rainfed'],
    idealTemp: { min: 25, max: 38 },
    idealPh: { min: 6.2, max: 7.8 },
    npkRatio: { n: 20, p: 40, k: 20 },
    durationDays: '60 - 70 days',
    sowingWindow: 'March 1 - March 25 (Zaid) / July 1 - July 20 (Kharif)',
    harvestWindow: 'May (Zaid) / September (Kharif)',
    yieldPerAcre: 5.5,
    seedCostPerAcre: 2200,
    inputCostPerAcre: 9800,
    expectedPrice: 9100,
    msp: 8558,
    priceTrend: 'Surging',
    deficitPercentage: -41,
    currentStockTonnes: 4800,
    normalStockTonnes: 8200,
    perishability: 'Low',
    marketDemand: 'High',
    opportunityBadge: 'Ultra-Fast ROI',
    historicalPrice: [
      { month: 'Feb', price: 8200, msp: 8558 },
      { month: 'Mar', price: 8350, msp: 8558 },
      { month: 'Apr', price: 8550, msp: 8558 },
      { month: 'May (Proj)', price: 8750, msp: 8558 },
      { month: 'Jun (Proj)', price: 8900, msp: 8558 },
      { month: 'Jul (Harvest)', price: 9100, msp: 8558 }
    ],
    historicalPrices: [
      { month: 'Feb', price: 8200, msp: 8558 },
      { month: 'Mar', price: 8350, msp: 8558 },
      { month: 'Apr', price: 8550, msp: 8558 },
      { month: 'May (Proj)', price: 8750, msp: 8558 },
      { month: 'Jun (Proj)', price: 8900, msp: 8558 },
      { month: 'Jul (Harvest)', price: 9100, msp: 8558 }
    ],
    marketInsights: 'Highest market realization among short-cycle pulses; pulse mills bidding aggressively for summer harvest stocks.',
    cultivationTips: [
      'Inoculate seeds with Rhizobium culture and Trichoderma before sowing',
      'Grow after wheat or potato to exploit residual soil fertility',
      'Synchronized maturity variety like Virat or IPM 02-3 facilitates single picking'
    ],
    diseaseAlerts: ['Yellow Mosaic Virus transmitted by whitefly', 'Powdery mildew in late season']
  }
];

// Additional rich metadata dictionary for advantages, risks, and advisory notes
export const CROP_METADATA_DETAILS = {
  wheat: {
    advantages: [
      'Assured price realization through government MSP procurement',
      'Low perishability with 12+ months safe storage capability',
      'Highly mechanized harvesting available across all agro-zones'
    ],
    risks: [
      'Terminal heat stress in March during grain filling can reduce test weight',
      'Vulnerable to yellow rust in cool humid pockets'
    ],
    farmingConsiderations: 'Irrigate at Crown Root Initiation (21 DAS) and flowering stage. Sowing beyond Nov 25 suffers 30-40 kg/day yield penalty.'
  },
  rice: {
    advantages: [
      'Extensive state procurement apparatus and stable institutional floor',
      'High biomass yield providing straw for livestock fodder',
      'Thrives in low-lying clay soils where other crops face waterlogging'
    ],
    risks: [
      'High water requirement (1200-1500 mm); vulnerable to delayed monsoon',
      'Methane emissions and high pumping energy requirements'
    ],
    farmingConsiderations: 'Adopt alternate wetting and drying (AWD) or DSR to cut water usage by 30% without yield penalty.'
  },
  soybean: {
    advantages: [
      'Dual income from oil extraction and high-protein defatted meal exports',
      'Low nitrogen fertilizer requirement due to root nodule fixation',
      'Short duration allows timely Rabi wheat or chickpea rotation'
    ],
    risks: [
      'Excess rainfall during harvesting causes grain pod germination in field',
      'Susceptible to stem fly in early vegetative phase'
    ],
    farmingConsiderations: 'Use broad bed furrow (BBF) planting in heavy black soils to safeguard against waterlogging.'
  },
  onion: {
    advantages: [
      'High profit potential during seasonal supply shortage windows',
      'Multiple planting seasons (Kharif, Late Kharif, and Rabi)',
      'Established nationwide APMC distribution networks'
    ],
    risks: [
      'High price volatility and perishable nature in humid monsoons',
      'High input capital (seedlings, transplanting, and curing labor)'
    ],
    farmingConsiderations: 'Ensure 50% harvest is pre-contracted or ventilated cold storage is arranged to avoid distressed sales.'
  },
  tomato: {
    advantages: [
      'Rapid turnaround (picking starts at 70 days)',
      'Continuous cash flow with 8-12 harvest pickings over 6 weeks',
      'High culinary demand in domestic and processing industries'
    ],
    risks: [
      'Extreme price swings from ₹5/kg in harvest gluts to ₹80/kg in supply dips',
      'High susceptibility to viral and fungal blights'
    ],
    farmingConsiderations: 'Use drip fertigation, trellising support, and silver-black mulch for optimum fruit grading.'
  },
  potato: {
    advantages: [
      'Highest caloric and biomass yield per acre of any field crop',
      'Contract farming options with food processing brands (chips/fries)',
      'Predictable cold storage economics for phased market release'
    ],
    risks: [
      'High seed tuber cost (accounts for 40-50% of total input budget)',
      'Late blight disease can destroy entire crop within 72 hours'
    ],
    farmingConsiderations: 'Procure certified disease-free seed tubers. Spray preventive fungicides prior to dense winter fog.'
  },
  watermelon: {
    advantages: [
      'Short 75-90 day crop cycle frees field for subsequent Kharif',
      'Surging demand during peak summer heat wave months',
      'Low chemical residue requirement with high consumer preference'
    ],
    risks: [
      'High freight costs due to weight and bulk handling',
      'Fruit cracking if heavy unseasonal rain follows dry spell'
    ],
    farmingConsiderations: 'Maintain uniform drip irrigation scheduling and gentle fruit positioning on straw mulch.'
  },
  banana: {
    advantages: [
      'Continuous year-round monthly cash flow once established',
      'High domestic per-capita consumption and growing export corridor',
      'High return on invested capital with tissue culture saplings'
    ],
    risks: [
      'Requires constant high-volume drip irrigation and wind protection',
      'Long 12-month lock-in period for land'
    ],
    farmingConsiderations: 'Install windbreaks on western boundary. Provide double propping before bunch maturation.'
  },
  sugarcane: {
    advantages: [
      'Statutory Fair & Remunerative Price (FRP) fixed by Government',
      'Resistant to stray cattle and unseasonal hail once established',
      'Multiple ratoon crops save seedbed preparation expense'
    ],
    risks: [
      '12-month crop duration ties up entire farm acreage',
      'Potential sugar mill payment deferrals and high irrigation load'
    ],
    farmingConsiderations: 'Adopt wide-row paired planting with subsurface drip fertigation for high sucrose recovery.'
  },
  cotton: {
    advantages: [
      'Readily tradable commercial fiber with export parity',
      'Well suited for deep black soils of Central & Western India',
      'Storable dry bales allow holding for favorable price spikes'
    ],
    risks: [
      'Vulnerable to Pink Bollworm and sucking pests',
      'High picking labor requirements in multiple flushes'
    ],
    farmingConsiderations: 'Strictly follow high density planting (HDPS) with timely detopping and pheromone trapping.'
  },
  maize: {
    advantages: [
      'High demand from animal feed mills and starch/ethanol distilleries',
      'Wider adaptability to diverse soils and temperature ranges',
      'Efficient C4 photosynthesis providing excellent grain and stover yield'
    ],
    risks: [
      'Fall Armyworm (FAW) can cause severe leaf defoliation if ignored',
      'Moisture stress at silking stage causes incomplete kernel filling'
    ],
    farmingConsiderations: 'Scout for FAW egg masses at 15-20 DAS. Maintain optimum moisture at tassel emergence.'
  },
  groundnut: {
    advantages: [
      'High oil content (48-50%) and valued edible confectionery market',
      'Enriches soil fertility by fixing 40-50 kg atmospheric N/ha',
      'Groundnut haulm provides premium nutritive cattle fodder'
    ],
    risks: [
      'Aflatoxin contamination if dried improperly under humid conditions',
      'Requires loose sandy loam for effortless peg penetration'
    ],
    farmingConsiderations: 'Apply gypsum at 40 DAS. Ensure rapid field drying to below 8% moisture before bagging.'
  },
  chickpea: {
    advantages: [
      'Deep taproot system thrives on residual soil moisture with low water',
      'High market price supported by structural domestic pulse shortage',
      'Substantial soil nitrogen fixation for subsequent crops'
    ],
    risks: [
      'Excessive irrigation causes vegetative growth at expense of pods',
      'Helicoverpa armigera pod borer damage'
    ],
    farmingConsiderations: 'Practice apical nipping at 35 DAS to multiply productive branches. One light irrigation at pod fill.'
  },
  turmeric: {
    advantages: [
      'Highest market profit margins (₹14,000 - ₹16,000/qtl projected)',
      'Low perishability once boiled and dried; store up to 2 years',
      'Acute national mandi shortage with booming export demand'
    ],
    risks: [
      'Heavy initial investment in rhizome planting material',
      'Rhizome rot in poorly drained waterlogged soils'
    ],
    farmingConsiderations: 'Plant on broad raised beds with drip lines. Mulch heavily with green biomass to prevent weed emergence.'
  },
  pomegranate: {
    advantages: [
      'Drought hardy orchard crop thriving in semi-arid zones',
      'High export realizations (Bhagwa variety commands premium in EU/Gulf)',
      'Flexible Bahar regulation matches harvesting with market peaks'
    ],
    risks: [
      'Bacterial blight (Telya) requires meticulous sanitary pruning',
      'High capital requirement for orchard establishment'
    ],
    farmingConsiderations: 'Practice disciplined water withholding before pruning. Apply 100% drip fertigation.'
  }
};

// Enrich all crops with detailed considerations, aliases, and safety fallbacks
CROPS_DATABASE.forEach(crop => {
  const meta = CROP_METADATA_DETAILS[crop.id] || {};
  crop.advantages = meta.advantages || [
    'Favorable market demand profile in regional wholesale mandis',
    'Compatible with standard farm machinery and local labor pool',
    'Stable yield potential under recommended package of practices'
  ];
  crop.risks = meta.risks || [
    'Market price subject to post-harvest arrival surges',
    'Requires timely pest monitoring and balanced fertilization'
  ];
  crop.farmingConsiderations = meta.farmingConsiderations || 'Follow standard state agricultural university (SAU) package of practices with soil-test-based fertilizer scheduling.';

  // Guarantee all required fields exist
  if (!crop.suitableSoils) crop.suitableSoils = crop.soilTypes || ['Alluvial', 'Black', 'Loamy'];
  if (!crop.cropCycle) crop.cropCycle = crop.durationDays || '90 - 120 days';
  if (typeof crop.seedCost !== 'number') crop.seedCost = crop.seedCostPerAcre || 3000;
  if (!crop.waterRequirement) crop.waterRequirement = crop.waterNeeds || 'Moderate';
  if (!crop.idealTemperature) crop.idealTemperature = crop.idealTemp || { min: 18, max: 32 };
  if (!crop.idealRainfall) crop.idealRainfall = { min: 450, max: 750 };
  if (!crop.baseDemand) crop.baseDemand = crop.marketDemand || 'High';
  if (typeof crop.currentStock !== 'number') crop.currentStock = crop.currentStockTonnes || 10000;
  if (typeof crop.normalStock !== 'number') crop.normalStock = crop.normalStockTonnes || 15000;
  if (typeof crop.currentPrice !== 'number') crop.currentPrice = 3000;
  if (!crop.historicalPrice) crop.historicalPrice = crop.historicalPrices || [];
  if (typeof crop.expectedFuturePrice !== 'number') crop.expectedFuturePrice = crop.expectedPrice || Math.round(crop.currentPrice * 1.15);
  if (!crop.climateRisk) crop.climateRisk = 'Low';

  // Ensure two-way mirror
  crop.soilTypes = crop.suitableSoils;
  crop.durationDays = crop.cropCycle;
  crop.seedCostPerAcre = crop.seedCost;
  crop.waterNeeds = crop.waterRequirement;
  crop.idealTemp = crop.idealTemperature;
  crop.marketDemand = crop.baseDemand;
  crop.currentStockTonnes = crop.currentStock;
  crop.normalStockTonnes = crop.normalStock;
  crop.historicalPrices = crop.historicalPrice;
  crop.mandiPrices = crop.historicalPrice;
  crop.expectedPrice = crop.expectedFuturePrice;
  crop.deficitPercentage = Math.round(((crop.currentStock - crop.normalStock) / crop.normalStock) * 100);
});

export default CROPS_DATABASE;
