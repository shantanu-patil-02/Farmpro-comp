import { GoogleGenAI } from '@google/genai';

let aiClient = null;

/**
 * Lazy initialization of GoogleGenAI client on backend only.
 * Uses process.env.GEMINI_API_KEY.
 */
function getGeminiClient() {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey && apiKey.trim() !== '' && apiKey !== 'MY_GEMINI_API_KEY') {
      aiClient = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });
    }
  }
  return aiClient;
}

/**
 * Maps language code to display name for clear prompt instructions
 */
function getLanguageName(langCode = 'en') {
  const code = (langCode || 'en').toLowerCase();
  if (code === 'hi') return 'Hindi (हिन्दी)';
  if (code === 'mr') return 'Marathi (मराठी)';
  if (code === 'pa') return 'Punjabi (ਪੰਜਾਬੀ)';
  if (code === 'gu') return 'Gujarati (ગુજરાતી)';
  if (code === 'te') return 'Telugu (తెలుగు)';
  if (code === 'kn') return 'Kannada (ಕನ್ನಡ)';
  if (code === 'bn') return 'Bengali (বাংলা)';
  return 'English';
}

/**
 * Formats context into structured text for Gemini prompt
 */
function formatFarmerContext(context = {}) {
  const parts = [];

  const loc = context.location || 'Maharashtra, India';
  const soil = context.soilType || 'Black Soil';
  const land = context.landArea ? `${context.landArea} ${context.landUnit || 'Acres'}` : '5 Acres';
  const cycle = context.cropCycle || '6 Months (Kharif / Rabi)';
  const objective = context.farmingObjective || 'Maximum Profit';
  const water = context.waterAvailability || 'Medium';
  const npk = context.nitrogen ? `N:${context.nitrogen}, P:${context.phosphorus}, K:${context.potassium}, pH:${context.ph || context.soilPH || 6.8}` : null;

  parts.push(`=== FARM CONDITIONS ===`);
  parts.push(`• Location: ${loc}`);
  parts.push(`• Soil Type: ${soil}`);
  parts.push(`• Land Area: ${land}`);
  parts.push(`• Water Availability: ${water}`);
  parts.push(`• Crop Cycle: ${cycle}`);
  parts.push(`• Objective: ${objective}`);
  if (npk) parts.push(`• Soil Chemistry: ${npk}`);

  // Recommended Crops Context
  if (Array.isArray(context.recommendedCrops) && context.recommendedCrops.length > 0) {
    parts.push(`\n=== RECOMMENDED CROPS (Top 5 Engine Results) ===`);
    context.recommendedCrops.slice(0, 5).forEach((rec, idx) => {
      const name = rec.cropName || rec.name || rec.crop?.name || `Crop ${idx + 1}`;
      const score = rec.score || rec.overallScore || rec.recommendationScore || 'N/A';
      const curPrice = rec.currentPrice || rec.crop?.currentPrice || 'N/A';
      const expPrice = rec.expectedPrice || rec.crop?.expectedPrice || 'N/A';
      const shortage = rec.shortage || rec.supplyStatus || rec.crop?.supplyStatus || 'Balanced';
      const suitability = rec.soilSuitability || `${rec.agronomic?.score || 85}%`;
      const waterReq = rec.waterRequirement || rec.crop?.waterNeeds || 'Moderate';
      const risk = rec.climateRisk || rec.climate?.riskLevel || 'Low';

      parts.push(`Rank ${idx + 1}: ${name} (Score: ${score}/100)`);
      parts.push(`   - Current Modal Price: ₹${curPrice}/qtl | Expected Harvest Price: ₹${expPrice}/qtl`);
      parts.push(`   - Mandi Supply Status: ${shortage} | Soil Suitability: ${suitability}`);
      parts.push(`   - Water Requirement: ${waterReq} | Climate Risk: ${risk}`);
      
      if (rec.factors) {
        parts.push(`   - 6-Factor Scores -> Stock Shortage: ${rec.factors.stockShortageScore || 'N/A'}, Price Growth: ${rec.factors.priceGrowthScore || 'N/A'}, Soil Match: ${rec.factors.soilMatchScore || 'N/A'}, Seed Cost: ${rec.factors.seedCostScore || 'N/A'}, Water Need: ${rec.factors.waterRequirementScore || 'N/A'}, Climate Risk Factor: ${rec.factors.climateRiskScore || 'N/A'}`);
      }
    });
  } else if (context.topCrop) {
    parts.push(`\n=== TOP RECOMMENDED CROP ===`);
    parts.push(`• Crop: ${context.topCrop}`);
  }

  // Weather Context
  if (context.weather) {
    const w = context.weather;
    parts.push(`\n=== REGIONAL WEATHER DATA ===`);
    parts.push(`• Temperature: ${w.temperature || 28}°C (Min: ${w.tempMin || 22}°C, Max: ${w.tempMax || 34}°C)`);
    parts.push(`• Condition: ${w.condition || 'Partly Cloudy'}`);
    parts.push(`• Humidity: ${w.humidity || 65}% | Rainfall: ${w.rainfall || 750}mm`);
    parts.push(`• Climate Risk Rating: ${w.climateRisk || 'Low'}`);
    if (w.advisory) parts.push(`• Agromet Advisory: ${w.advisory}`);
  }

  // Market Data Summary
  if (context.marketSummary) {
    const m = context.marketSummary;
    parts.push(`\n=== APMC MANDI MARKET OVERVIEW ===`);
    parts.push(`• Average Price Growth: ${m.averagePriceGrowthPercent || 14.5}%`);
    parts.push(`• Mandi Data Status: ${m.dataSource || 'Demo Market Data'}`);
  }

  return parts.join('\n');
}

/**
 * Handle FarmPro AI chat inquiries using Gemini 3.8 Flash model
 */
export async function chatWithAgronomist({ message, context = {} }) {
  const client = getGeminiClient();
  const selectedLang = getLanguageName(context.language || 'en');

  // Base System Instruction mandated by user specification
  const systemInstruction = `You are FarmPro AI, an agricultural decision-support assistant. Explain recommendations clearly in simple language. Do not guarantee profits. If information is uncertain or unavailable, say so.

Guidelines:
1. Always reply in ${selectedLang}.
2. Use clear formatting with bullet points, short paragraphs, and bold text for key terms.
3. Be respectful, encouraging, and supportive of farmers.
4. When asked about specific crops (e.g. "Why was watermelon recommended?", "Which crop should I plant?"), refer directly to the farm conditions, soil match, APMC mandi supply shortages, price momentum, water needs, and climate risks provided in the context.
5. If asked about stock shortage, explain that a supply deficit in wholesale mandis creates higher buyer competition and better prices for farmers.
6. If asked about charts or metrics, explain the 6-factor composite scoring: Stock Shortage, Price Growth, Soil Match in the numerator vs Seed Cost, Water Need, and Climate Risk in the denominator.
7. If data is missing or not provided, politely clarify what is known and what requires testing. Do not fabricate unsupported claims.`;

  // Try real Gemini API call if configured
  if (client) {
    try {
      const contextText = formatFarmerContext(context);
      const userPrompt = `${contextText}\n\n=== FARMER INQUIRY ===\n${message}`;

      const response = await client.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: userPrompt,
        config: {
          systemInstruction,
          temperature: 0.6,
        },
      });

      const replyText = response.text;
      if (replyText && replyText.trim()) {
        return {
          success: true,
          reply: replyText.trim(),
          source: 'gemini-3.8-flash',
          language: context.language || 'en',
          timestamp: new Date().toISOString(),
        };
      }
    } catch (err) {
      console.warn('Gemini API call failed or unavailable, activating intelligent agronomist fallback:', err.message);
    }
  }

  // Graceful rule-based agronomist fallback engine (maintains seamless UX in all environments)
  const lang = (context.language || 'en').toLowerCase();
  const lowerQuery = (message || '').toLowerCase();
  let fallbackReply = '';

  if (lang === 'hi') {
    // Hindi Responses
    if (lowerQuery.includes('water') || lowerQuery.includes('पानी') || lowerQuery.includes('सिंचाई')) {
      fallbackReply = `**जल आवश्यकता और सिंचाई मार्गदर्शन:**
• **मध्यम जल उपलब्धता** के लिए सोयाबीन (Soybean), मूंग (Moong), और कपास (Cotton) अनुकूल हैं।
• यदि जल स्रोत सीमित है, तो ड्रिप या स्प्रिंकलर सिंचाई से 35-40% पानी की बचत होती है।
• तरबूज जैसी फसलों को फूल और फल विकास के समय नियमित हल्की सिंचाई की आवश्यकता होती है।`;
    } else if (lowerQuery.includes('shortage') || lowerQuery.includes('कमी') || lowerQuery.includes('मंडी')) {
      fallbackReply = `**मंडी स्टॉक कमी (Stock Shortage) का अर्थ:**
• जब मंडियों में किसी फसल का बफर स्टॉक सामान्य स्तर से कम (डेफिसिट) होता है, तो मांग आपूर्ति से अधिक हो जाती है।
• इससे किसानों को कटाई के समय उच्च और प्रतिस्पर्धी भाव (Price Realization) मिलने की संभावना बढ़ जाती है।`;
    } else if (lowerQuery.includes('soil') || lowerQuery.includes('मिट्टी') || lowerQuery.includes('उपयुक्तता')) {
      fallbackReply = `**मृदा उपयुक्तता (Soil Suitability):**
• आपके खेत की **${context.soilType || 'काली मिट्टी (Black Soil)'}** नमी बनाए रखने और पोषक तत्वों के संतुलन के लिए उत्कृष्ट है।
• उपयुक्तता स्कोर यह जांचता है कि फसल के आदर्श pH और NPK अनुपात आपकी मिट्टी की संरचना से कितना मेल खाते हैं।`;
    } else if (lowerQuery.includes('risk') || lowerQuery.includes('जोखिम')) {
      fallbackReply = `**फसल जोखिम कारक:**
• **जलवायु जोखिम:** अत्यधिक वर्षा या सूखे का प्रभाव।
• **बाजार जोखिम:** अत्यधिक उत्पादन (Glut) के कारण भाव गिरना।
• FarmPro इन जोखिमों को कम करने के लिए प्रमाणित बीज और बहु-फसली विविधीकरण की सलाह देता है।`;
    } else {
      const topName = context.recommendedCrops?.[0]?.cropName || context.topCrop || 'सोयाबीन (Soybean)';
      fallbackReply = `नमस्ते! आपके खेत की स्थिति (${context.location || 'महाराष्ट्र'}, ${context.soilType || 'काली मिट्टी'}) के विश्लेषण के आधार पर:

1. **शीर्ष सिफारिश:** **${topName}** — मजबूत मंडी मांग और आपकी मिट्टी के साथ उत्तम अनुकूलता।
2. **बाजार अवसर:** स्थानीय मंडियों में आपूर्ति घाटा होने से कटाई के समय अच्छे भाव मिलने की प्रबल संभावना है।
3. **सिफारिश:** संतुलित NPK खाद और आवश्यकतानुसार सिंचाई प्रबंधन अपनाएं।

(नोट: यह कृषि निर्णय-सहायता अनुमानित आंकड़ों पर आधारित है। कृपया स्थानीय मौसम पर भी नजर रखें।)`;
    }
  } else if (lang === 'mr') {
    // Marathi Responses
    if (lowerQuery.includes('water') || lowerQuery.includes('पाणी') || lowerQuery.includes('सिंचन')) {
      fallbackReply = `**पाण्याची गरज व सिंचन सल्ला:**
• मध्यम पाणी उपलब्धतेसाठी सोयाबीन, मूग आणि कापूस अत्यंत योग्य आहेत.
• ठिबक सिंचनाचा वापर केल्यास ३५-४०% पाण्याची बचत होते व पिकाची वाढ जोमदार होते.
• कलिंगडसारख्या फळपिकांसाठी फुलोरा व फळधारणेच्या काळात नियमित पाणी देणे गरजेचे असते.`;
    } else if (lowerQuery.includes('shortage') || lowerQuery.includes('तुटवडा') || lowerQuery.includes('बाजार')) {
      fallbackReply = `**बाजारपेठेतील तुटवडा (Stock Shortage) म्हणजे काय?**
• जेव्हा मुख्य कृषी उत्पन्न बाजार समित्यांमध्ये (APMC) आवक नेहमीपेक्षा कमी असते, तेव्हा त्याला सप्लाय डेफिसिट म्हणतात.
• अशा पिकांना काढणीच्या हंगामात अधिक दर मिळण्याची दाट शक्यता असते.`;
    } else if (lowerQuery.includes('soil') || lowerQuery.includes('माती') || lowerQuery.includes('सुपीकता')) {
      fallbackReply = `**मातीची उपयुक्तता (Soil Suitability):**
• आपल्या शेतातील **${context.soilType || 'काळी जमीन (Black Soil)'}** ओलावा टिकवून ठेवण्यासाठी सर्वोत्तम आहे.
• जमिनीचा pH ६.५ ते ७.५ दरम्यान असल्यास पिकांना खतांची उचल उत्तम प्रकारे होते.`;
    } else {
      const topName = context.recommendedCrops?.[0]?.cropName || context.topCrop || 'सोयाबीन (Soybean)';
      fallbackReply = `नमस्कार शेतकरी बंधूंनो! आपल्या शेतजमिनीच्या नोंदींनुसार (${context.location || 'महाराष्ट्र'}, ${context.soilType || 'काळी जमीन'}):

1. **प्रमुख शिफारस:** **${topName}** — ही पीक पद्धती आपल्या जमिनीसाठी व सध्याच्या बाजार मागणीसाठी सर्वोत्तम ठरत आहे.
2. **बाजार भाव अंदाज:** आगामी हंगामात चांगल्या नफ्याची संधी उपलब्ध आहे.
3. **कृषी सल्ला:** पेरणीपूर्वी बुरशीनाशक बीजप्रक्रिया अवश्य करा.

(टीप: हा अंदाज उपलब्ध बाजार माहितीवर आधारित असून नफ्याची खात्री देत नाही.)`;
    }
  } else {
    // English Responses
    if (lowerQuery.includes('which crop') || lowerQuery.includes('should i plant') || lowerQuery.includes('recommend')) {
      const topName = context.recommendedCrops?.[0]?.cropName || context.topCrop || 'Soybean';
      const secondName = context.recommendedCrops?.[1]?.cropName || 'Green Gram (Moong)';
      fallbackReply = `Based on your farm parameters in **${context.location || 'Nagpur, Maharashtra'}** with **${context.soilType || 'Black Soil'}**:

1. **Primary Pick: ${topName}** — Ranked #1 due to strong soil compatibility (${context.soilType || 'Black Soil'}), high moisture retention, and favorable APMC mandi demand.
2. **Alternative: ${secondName}** — Short-duration cycle with high return-on-investment and nitrogen-fixing soil benefits.

*Note: FarmPro provides decision support based on available market and agromet data. Profit margins are indicative.*`;
    } else if (lowerQuery.includes('watermelon') || lowerQuery.includes('why was')) {
      fallbackReply = `**Why Watermelon is Recommended:**
• **High Value Zaid/Cash Opportunity**: High market demand during summer harvest with low supply glut in central mandis.
• **Short Duration**: 85-95 day cycle allowing quick crop turnover before main monsoon Kharif.
• **Water Requirement**: Requires regular drip irrigation but thrives in well-drained loamy or black soils with warm temperatures.`;
    } else if (lowerQuery.includes('water') || lowerQuery.includes('irrigation')) {
      fallbackReply = `**Water Requirement Guidelines:**
• **Low Water (Rainfed)**: Chickpea, Green Gram, Pigeon Pea (Tur), Pearl Millet (Bajra).
• **Medium Water (Borewell / Seasonal)**: Soybean, Groundnut, Cotton, Mustard.
• **High Water (Canal / Perennial)**: Sugarcane, Paddy, Vegetables, Banana.
For your **${context.waterAvailability || 'Medium'}** water setup, drip or furrow irrigation maximizes yield while conserving moisture.`;
    } else if (lowerQuery.includes('shortage') || lowerQuery.includes('stock shortage')) {
      fallbackReply = `**What Stock Shortage Means in FarmPro:**
• **Stock Shortage Score (S_i)** measures wholesale supply deficits across terminal APMC mandis relative to normal 3-year buffer stocks.
• When a crop has a **negative deficit (e.g., -18%)**, regional supplies are low while industrial crushing or consumer demand remains strong.
• This creates aggressive bidding at mandi gates, leading to higher price realization for farmers at harvest.`;
    } else if (lowerQuery.includes('chart') || lowerQuery.includes('explain this chart')) {
      fallbackReply = `**How to Read FarmPro Charts:**
• **Score Comparison Chart**: Displays the 0-100 Opportunity Score combining 6 weighted factors.
• **Price Growth Chart**: Compares current modal APMC rate against projected harvest rate.
• **Deficit vs Surplus Chart**: Visualizes stock balance — bars in the deficit zone indicate high seller pricing power.
• **Radar Chart**: Compares soil match, water need, seed cost, and climate risk for balanced decision making.`;
    } else if (lowerQuery.includes('soil suitability') || lowerQuery.includes('soil')) {
      fallbackReply = `**What Soil Suitability (M_i) Means:**
• Evaluates how closely your soil texture (${context.soilType || 'Black Soil'}), pH, and NPK nutrient balance match the biological requirements of the crop.
• High soil suitability (>85%) ensures maximum root penetration, effective fertilizer uptake, and optimal yields per acre.`;
    } else if (lowerQuery.includes('risk') || lowerQuery.includes('climate risk')) {
      fallbackReply = `**Understanding Crop & Climate Risk:**
• **Climate Risk Factor (R_i)** assesses susceptibility to monsoon delays, unseasonal rain, temperature anomalies, and humidity-triggered pest outbreaks.
• **Market Risk**: Crops in extreme supply surplus (>+20%) face high price depreciation risks at harvest.
• FarmPro factors risk into the denominator of the scoring formula to prevent over-recommending fragile or over-produced crops.`;
    } else {
      const topName = context.recommendedCrops?.[0]?.cropName || context.topCrop || 'Soybean';
      fallbackReply = `Namaste! I am FarmPro AI, your agricultural decision-support assistant.

• **Location & Soil**: ${context.location || 'Maharashtra'} • ${context.soilType || 'Black Soil'}
• **Top Recommended Crop**: **${topName}**
• **Opportunity Driver**: Positive price trajectory combined with solid regional soil suitability and manageable seed costs.

Ask me anything about water needs, fertilizer dosage, mandi shortage trends, or specific crop risks!`;
    }
  }

  return {
    success: true,
    reply: fallbackReply,
    source: 'agronomist-engine-fallback',
    language: context.language || 'en',
    timestamp: new Date().toISOString(),
  };
}

export default {
  chatWithAgronomist,
};
