import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { LanguageProvider } from './i18n/index.jsx';
import { FarmProvider } from './context/FarmContext.jsx';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import AIChat from './components/AIChat.jsx';

// Pages
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Recommendation from './pages/Recommendation.jsx';
import Results from './pages/Results.jsx';
import CropDetails from './pages/CropDetails.jsx';
import MarketInsights from './pages/MarketInsights.jsx';
import History from './pages/History.jsx';
import Profile from './pages/Profile.jsx';
import Subscription from './pages/Subscription.jsx';
import About from './pages/About.jsx';
import Feedback from './pages/Feedback.jsx';
import NotFound from './pages/NotFound.jsx';

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);

  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <FarmProvider>
          <ScrollToTop />
          <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-amber-200 selection:text-emerald-950">
            
            {/* Global High-Density Navbar */}
            <Navbar />

            {/* Main View Area */}
            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/recommendation" element={<Recommendation />} />
                <Route path="/results" element={<Results />} />
                <Route path="/crop/:id" element={<CropDetails />} />
                <Route path="/market-insights" element={<MarketInsights />} />
                <Route path="/history" element={<History />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/subscription" element={<Subscription />} />
                <Route path="/about" element={<About />} />
                <Route path="/feedback" element={<Feedback />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>

            {/* AI Kisan Assistant Floating Widget */}
            <AIChat />

            {/* Global High-Density Footer */}
            <Footer />

          </div>
        </FarmProvider>
      </LanguageProvider>
    </BrowserRouter>
  );
}

