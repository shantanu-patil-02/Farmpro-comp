<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/3cd68ce4-f83f-4966-8c01-9db9881c51fd

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

```
Farmpro-ad
├─ bun.lock
├─ client
│  └─ src
│     └─ i18n
│        ├─ en.js
│        ├─ hi.js
│        └─ mr.js
├─ index.html
├─ metadata.json
├─ package.json
├─ public
│  └─ assets
│     └─ aistudio
├─ README.md
├─ server
│  ├─ config
│  │  └─ db.js
│  ├─ middleware
│  │  └─ auth.js
│  ├─ models
│  │  ├─ Crop.js
│  │  ├─ Farm.js
│  │  ├─ Feedback.js
│  │  ├─ Recommendation.js
│  │  └─ User.js
│  ├─ routes
│  │  ├─ aiRoutes.js
│  │  ├─ authRoutes.js
│  │  ├─ cropRoutes.js
│  │  ├─ farmRoutes.js
│  │  ├─ feedbackRoutes.js
│  │  ├─ marketRoutes.js
│  │  ├─ recommendationRoutes.js
│  │  ├─ subscriptionRoutes.js
│  │  └─ weatherRoutes.js
│  ├─ seed.js
│  ├─ server.js
│  ├─ services
│  │  ├─ geminiService.js
│  │  ├─ marketService.js
│  │  ├─ recommendationService.js
│  │  └─ weatherService.js
│  ├─ test-endpoints.js
│  └─ utils
│     ├─ cropScoring.js
│     ├─ cropScoring.test.js
│     └─ seed.js
├─ src
│  ├─ App.jsx
│  ├─ components
│  │  ├─ AIChat.jsx
│  │  ├─ CropCard.jsx
│  │  ├─ CropDeepDiveModal.jsx
│  │  ├─ DataSourceBadge.jsx
│  │  ├─ FarmConditionsForm.jsx
│  │  ├─ FarmProfitCalculator.jsx
│  │  ├─ FeedbackForm.jsx
│  │  ├─ Footer.jsx
│  │  ├─ LanguageSelector.jsx
│  │  ├─ LoadingSpinner.jsx
│  │  ├─ MarketChart.jsx
│  │  ├─ MarketIntelligenceView.jsx
│  │  ├─ Navbar.jsx
│  │  ├─ PriceChart.jsx
│  │  ├─ ProtectedRoute.jsx
│  │  ├─ RecommendationCard.jsx
│  │  ├─ RecommendationFeedback.jsx
│  │  ├─ RecommendationForm.jsx
│  │  ├─ ScoreBreakdown.jsx
│  │  ├─ SubscriptionCard.jsx
│  │  ├─ WeatherCard.jsx
│  │  └─ WhyNotAnalysis.jsx
│  ├─ context
│  │  └─ FarmContext.jsx
│  ├─ data
│  │  ├─ cropDatabase.js
│  │  └─ regionalPresets.js
│  ├─ i18n
│  │  ├─ en.js
│  │  ├─ hi.js
│  │  ├─ index.jsx
│  │  └─ mr.js
│  ├─ index.css
│  ├─ main.jsx
│  ├─ pages
│  │  ├─ About.jsx
│  │  ├─ CropDetails.jsx
│  │  ├─ Dashboard.jsx
│  │  ├─ Feedback.jsx
│  │  ├─ History.jsx
│  │  ├─ Home.jsx
│  │  ├─ Login.jsx
│  │  ├─ MarketInsights.jsx
│  │  ├─ NotFound.jsx
│  │  ├─ Profile.jsx
│  │  ├─ Recommendation.jsx
│  │  ├─ Register.jsx
│  │  ├─ Results.jsx
│  │  └─ Subscription.jsx
│  └─ services
│     ├─ apiClient.js
│     └─ recommendationEngine.js
├─ tsconfig.json
└─ vite.config.ts

```
```
Farmpro-ad
├─ bun.lock
├─ client
│  └─ src
│     └─ i18n
│        ├─ en.js
│        ├─ hi.js
│        └─ mr.js
├─ index.html
├─ metadata.json
├─ package-lock.json
├─ package.json
├─ public
│  └─ farmpro_icon2.png
├─ README.md
├─ server
│  ├─ config
│  │  └─ db.js
│  ├─ middleware
│  │  └─ auth.js
│  ├─ models
│  │  ├─ Crop.js
│  │  ├─ Farm.js
│  │  ├─ Feedback.js
│  │  ├─ Recommendation.js
│  │  └─ User.js
│  ├─ routes
│  │  ├─ aiRoutes.js
│  │  ├─ authRoutes.js
│  │  ├─ cropRoutes.js
│  │  ├─ farmRoutes.js
│  │  ├─ feedbackRoutes.js
│  │  ├─ marketRoutes.js
│  │  ├─ recommendationRoutes.js
│  │  ├─ subscriptionRoutes.js
│  │  └─ weatherRoutes.js
│  ├─ seed.js
│  ├─ server.js
│  ├─ services
│  │  ├─ geminiService.js
│  │  ├─ marketService.js
│  │  ├─ recommendationService.js
│  │  └─ weatherService.js
│  ├─ test-endpoints.js
│  └─ utils
│     ├─ cropScoring.js
│     ├─ cropScoring.test.js
│     └─ seed.js
├─ src
│  ├─ App.jsx
│  ├─ components
│  │  ├─ AIChat.jsx
│  │  ├─ CropCard.jsx
│  │  ├─ CropDeepDiveModal.jsx
│  │  ├─ DataSourceBadge.jsx
│  │  ├─ FarmConditionsForm.jsx
│  │  ├─ FarmProfitCalculator.jsx
│  │  ├─ FeedbackForm.jsx
│  │  ├─ Footer.jsx
│  │  ├─ LanguageSelector.jsx
│  │  ├─ LoadingSpinner.jsx
│  │  ├─ MarketChart.jsx
│  │  ├─ MarketIntelligenceView.jsx
│  │  ├─ Navbar.jsx
│  │  ├─ PriceChart.jsx
│  │  ├─ ProtectedRoute.jsx
│  │  ├─ RecommendationCard.jsx
│  │  ├─ RecommendationFeedback.jsx
│  │  ├─ RecommendationForm.jsx
│  │  ├─ ScoreBreakdown.jsx
│  │  ├─ SubscriptionCard.jsx
│  │  ├─ WeatherCard.jsx
│  │  └─ WhyNotAnalysis.jsx
│  ├─ context
│  │  └─ FarmContext.jsx
│  ├─ data
│  │  ├─ cropDatabase.js
│  │  └─ regionalPresets.js
│  ├─ i18n
│  │  ├─ en.js
│  │  ├─ hi.js
│  │  ├─ index.jsx
│  │  └─ mr.js
│  ├─ index.css
│  ├─ main.jsx
│  ├─ pages
│  │  ├─ About.jsx
│  │  ├─ CropDetails.jsx
│  │  ├─ Dashboard.jsx
│  │  ├─ Feedback.jsx
│  │  ├─ History.jsx
│  │  ├─ Home.jsx
│  │  ├─ Login.jsx
│  │  ├─ MarketInsights.jsx
│  │  ├─ NotFound.jsx
│  │  ├─ Profile.jsx
│  │  ├─ Recommendation.jsx
│  │  ├─ Register.jsx
│  │  ├─ Results.jsx
│  │  └─ Subscription.jsx
│  └─ services
│     ├─ apiClient.js
│     └─ recommendationEngine.js
├─ tsconfig.json
└─ vite.config.ts

```