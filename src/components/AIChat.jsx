import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, Sparkles, Sprout, CornerDownLeft, Loader2, Globe, AlertCircle, RefreshCw } from 'lucide-react';
import { useFarm } from '../context/FarmContext.jsx';
import { aiAPI } from '../services/apiClient.js';

const QUICK_PROMPTS = [
  'Which crop should I plant?',
  'Why was watermelon recommended?',
  'How much water does this crop need?',
  'What does stock shortage mean?',
  'Explain this chart.',
  'What is soil suitability?',
  'What is the risk of this crop?'
];

// Simple markdown-to-JSX renderer for chat bubbles
function ChatMessageContent({ text }) {
  if (!text) return null;

  // Split by line breaks to render paragraphs and lists
  const lines = text.split('\n');

  return (
    <div className="space-y-1.5 text-xs leading-relaxed">
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={idx} className="h-1" />;

        // Header style
        if (trimmed.startsWith('### ') || trimmed.startsWith('## ')) {
          return (
            <p key={idx} className="font-bold text-slate-900 mt-2 text-xs">
              {trimmed.replace(/^#+\s*/, '')}
            </p>
          );
        }

        // Bullet point
        if (trimmed.startsWith('•') || trimmed.startsWith('*') || trimmed.startsWith('-')) {
          const content = trimmed.replace(/^[•*-]\s*/, '');
          return (
            <div key={idx} className="flex items-start gap-1.5 ml-1">
              <span className="text-emerald-700 font-bold shrink-0">•</span>
              <span dangerouslySetInnerHTML={{ __html: formatBold(content) }} />
            </div>
          );
        }

        // Numbered item (e.g., 1. 2.)
        const numMatch = trimmed.match(/^(\d+\.)\s+(.*)$/);
        if (numMatch) {
          return (
            <div key={idx} className="flex items-start gap-1.5 ml-1">
              <span className="font-semibold text-emerald-800 shrink-0">{numMatch[1]}</span>
              <span dangerouslySetInnerHTML={{ __html: formatBold(numMatch[2]) }} />
            </div>
          );
        }

        // Standard line
        return (
          <p key={idx} dangerouslySetInnerHTML={{ __html: formatBold(trimmed) }} />
        );
      })}
    </div>
  );
}

// Utility to safely render **bold** markers
function formatBold(str = '') {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
}

export default function AIChat({ embedded = false }) {
  const { farmForm, recommendationResults, language, setLanguage } = useFarm();
  const [isOpen, setIsOpen] = useState(embedded);
  const [chatLanguage, setChatLanguage] = useState(language || 'en');
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: getWelcomeGreeting(language || 'en', farmForm.location),
      time: 'Just now'
    }
  ]);
  const [input, setInput] = useState('');
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [chatError, setChatError] = useState(null);
  const messagesEndRef = useRef(null);

  // Sync chat language with global language if changed
  useEffect(() => {
    if (language && language !== chatLanguage) {
      setChatLanguage(language);
    }
  }, [language]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isBotTyping, isOpen]);

  function getWelcomeGreeting(lang, loc) {
    if (lang === 'hi') {
      return `नमस्ते! मैं **FarmPro AI** हूँ — आपका कृषि एवं मंडी सलाहकार। ${loc || 'आपके खेत'} की फसलों, जल आवश्यकता, मंडी स्टॉक कमी या चार्ट के बारे में कुछ भी पूछें।`;
    }
    if (lang === 'mr') {
      return `नमस्कार शेतकरी बंधूंनो! मी **FarmPro AI** — आपला कृषी व बाजार सल्लागार. ${loc || 'आपल्या परिसरातील'} पिके, पाण्याची गरज, बाजारपेठेतील तुटवडा याबद्दल काहीही विचारा.`;
    }
    return `Namaste! I am **FarmPro AI**, your agricultural decision-support assistant. Ask me about crop suitability, mandi stock shortage, water needs, or risk breakdown for ${loc || 'your farm'}.`;
  }

  const handleSend = async (textToSend) => {
    const query = (textToSend || input).trim();
    if (!query || isBotTyping) return;

    const userMsg = {
      sender: 'user',
      text: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsBotTyping(true);
    setChatError(null);

    // Build rich context payload when recommendation exists
    const topRecs = recommendationResults?.topRecommendations || recommendationResults?.top5 || [];
    const context = {
      location: farmForm.location || 'Nagpur, Maharashtra',
      soilType: farmForm.soilType || 'Black Soil',
      landArea: farmForm.landArea || 5,
      landUnit: farmForm.landUnit || 'Acres',
      cropCycle: farmForm.cropCycle || '6 Months',
      farmingObjective: farmForm.farmingObjective || 'Maximum Profit',
      waterAvailability: farmForm.waterAvailability || 'Medium',
      nitrogen: farmForm.nitrogen,
      phosphorus: farmForm.phosphorus,
      potassium: farmForm.potassium,
      ph: farmForm.ph,
      language: chatLanguage,
      recommendedCrops: topRecs.map(r => ({
        cropName: r.cropName || r.crop?.name || r.name,
        score: r.overallScore || r.score || r.recommendationScore,
        currentPrice: r.currentPrice || r.crop?.currentPrice,
        expectedPrice: r.expectedPrice || r.crop?.expectedPrice,
        shortage: r.supplyStatus || r.shortage || r.crop?.supplyStatus,
        soilSuitability: r.soilSuitability || `${r.agronomic?.score || 85}%`,
        waterRequirement: r.waterNeeds || r.waterRequirement || r.crop?.waterNeeds,
        climateRisk: r.climateRisk || r.climate?.riskLevel,
        factors: r.factors,
        financials: r.financials
      })),
      topCrop: topRecs[0]?.cropName || topRecs[0]?.crop?.name || 'Soybean',
      weather: recommendationResults?.weather || farmForm.weather || {
        temperature: 28,
        humidity: 65,
        rainfall: 750,
        condition: 'Partly Cloudy',
        climateRisk: 'Low'
      },
      marketSummary: recommendationResults?.marketSummary || {
        averagePriceGrowthPercent: 14.2,
        dataSource: recommendationResults?.dataSource || 'APMC Mandi Data'
      }
    };

    try {
      // Send query and complete context to Express Backend POST /api/ai/chat
      const response = await aiAPI.chat(query, context);

      if (response && response.reply) {
        setMessages(prev => [
          ...prev,
          {
            sender: 'bot',
            text: response.reply,
            source: response.source || 'gemini-3.8-flash',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      } else {
        throw new Error('Empty response from AI assistant');
      }
    } catch (apiError) {
      console.warn('AI chat error handled gracefully:', apiError.message);
      setChatError('Could not reach Gemini live service. Showing agronomist advisory fallback.');
      
      // Friendly fallback reply ensuring app never breaks
      const friendlyFallback = chatLanguage === 'hi'
        ? `क्षमा करें, AI सहायक से संपर्क में विलंब हो रहा है। आपके **${farmForm.location}** एवं **${farmForm.soilType}** के लिए शीर्ष सिफारिश **${topRecs[0]?.cropName || 'सोयाबीन'}** है जिसमें अच्छा बाजार अवसर है।`
        : chatLanguage === 'mr'
        ? `क्षमस्व, AI सेवेशी संपर्क साधण्यात अडचण येत आहे. आपल्या **${farmForm.location}** व **${farmForm.soilType}** साठी मुख्य शिफारस **${topRecs[0]?.cropName || 'सोयाबीन'}** आहे.`
        : `I am currently operating in offline agronomist mode. Based on your **${farmForm.soilType}** in **${farmForm.location}**, our top-scored crop is **${topRecs[0]?.cropName || 'Soybean'}** with positive market momentum and manageable climate risk.`;

      setMessages(prev => [
        ...prev,
        {
          sender: 'bot',
          text: friendlyFallback,
          source: 'offline-fallback',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsBotTyping(false);
    }
  };

  // Floating Button on Bottom-Right
  if (!isOpen && !embedded) {
    return (
      <button
        type="button"
        id="open-ai-chat-btn"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-full bg-emerald-900 hover:bg-emerald-800 text-white shadow-xl border border-emerald-700 hover:scale-105 transition-all cursor-pointer group"
        aria-label="Open FarmPro AI Assistant"
      >
        <span className="text-base">🌱</span>
        <div className="flex flex-col text-left">
          <span className="text-xs font-bold font-heading tracking-wide">
            FarmPro AI
          </span>
          <span className="text-[10px] text-amber-300 font-medium leading-none">
            Decision Assistant
          </span>
        </div>
        <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse ml-1"></span>
      </button>
    );
  }

  return (
    <div
      className={`${
        embedded
          ? 'w-full h-full'
          : 'fixed bottom-5 right-5 z-50 w-[94vw] sm:w-[420px] h-[560px] max-h-[85vh]'
      } bg-white rounded-2xl shadow-2xl border border-slate-300 flex flex-col overflow-hidden font-sans`}
      id="ai-farmpro-chat-window"
    >
      {/* Header */}
      <div className="bg-emerald-950 text-white px-4 py-3 flex items-center justify-between border-b border-emerald-900 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-400 text-emerald-950 flex items-center justify-center font-bold text-base shadow-xs">
            🌱
          </div>
          <div>
            <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
              <span>FarmPro AI Assistant</span>
              <span className="text-[9px] font-semibold text-emerald-950 bg-amber-300 px-1.5 py-0.5 rounded font-mono">
                Gemini 3.8
              </span>
            </h4>
            <p className="text-[10px] text-emerald-300">
              Agronomic & Market Decision Support
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Language Toggle in Chat Header */}
          <div className="flex items-center bg-emerald-900/80 rounded-lg p-0.5 border border-emerald-800">
            <button
              type="button"
              onClick={() => {
                setChatLanguage('en');
                setLanguage('en');
              }}
              className={`px-1.5 py-0.5 rounded text-[10px] font-semibold transition ${chatLanguage === 'en' ? 'bg-amber-400 text-emerald-950' : 'text-emerald-300 hover:text-white'}`}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => {
                setChatLanguage('hi');
                setLanguage('hi');
              }}
              className={`px-1.5 py-0.5 rounded text-[10px] font-semibold transition ${chatLanguage === 'hi' ? 'bg-amber-400 text-emerald-950' : 'text-emerald-300 hover:text-white'}`}
            >
              हिन्दी
            </button>
            <button
              type="button"
              onClick={() => {
                setChatLanguage('mr');
                setLanguage('mr');
              }}
              className={`px-1.5 py-0.5 rounded text-[10px] font-semibold transition ${chatLanguage === 'mr' ? 'bg-amber-400 text-emerald-950' : 'text-emerald-300 hover:text-white'}`}
            >
              मराठी
            </button>
          </div>

          {!embedded && (
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg text-emerald-300 hover:text-white hover:bg-emerald-900 transition cursor-pointer"
              aria-label="Close FarmPro AI Chat"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Suggested Quick Prompts */}
      <div className="px-3 py-2 bg-slate-50 border-b border-slate-200 overflow-x-auto whitespace-nowrap flex gap-1.5 scrollbar-none shrink-0">
        {QUICK_PROMPTS.map((q, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSend(q)}
            disabled={isBotTyping}
            className="text-[11px] font-medium bg-white text-slate-700 hover:text-emerald-900 hover:border-emerald-400 px-2.5 py-1 rounded-full border border-slate-200 shadow-2xs transition shrink-0 cursor-pointer disabled:opacity-50"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Message Stream */}
      <div className="flex-1 p-3.5 overflow-y-auto space-y-3 bg-slate-50/50">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex items-start gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.sender === 'bot' && (
              <div className="w-6 h-6 rounded-md bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 text-xs font-bold mt-0.5">
                🌱
              </div>
            )}

            <div
              className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 shadow-2xs ${
                msg.sender === 'user'
                  ? 'bg-emerald-900 text-white rounded-tr-none'
                  : 'bg-white text-slate-800 border border-slate-200/90 rounded-tl-none'
              }`}
            >
              {msg.sender === 'bot' ? (
                <ChatMessageContent text={msg.text} />
              ) : (
                <p className="text-xs leading-relaxed">{msg.text}</p>
              )}

              <div className="flex items-center justify-between gap-2 mt-1.5 pt-1 border-t border-slate-100/30">
                {msg.source && msg.sender === 'bot' && (
                  <span className="text-[9px] text-emerald-600 font-medium">
                    {msg.source === 'gemini-3.8-flash' ? '✨ Gemini Grounded' : '🌿 Agronomist Rules'}
                  </span>
                )}
                <span className={`text-[9px] ml-auto ${msg.sender === 'user' ? 'text-emerald-200' : 'text-slate-400'}`}>
                  {msg.time}
                </span>
              </div>
            </div>
          </div>
        ))}

        {isBotTyping && (
          <div className="flex items-start gap-2 justify-start">
            <div className="w-6 h-6 rounded-md bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 text-xs font-bold mt-0.5">
              🌱
            </div>
            <div className="bg-white text-slate-600 border border-slate-200 rounded-2xl rounded-tl-none px-3.5 py-2.5 text-xs flex items-center gap-2 shadow-2xs">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-700 shrink-0" />
              <span>Analyzing recommendations & agro-climatic context...</span>
            </div>
          </div>
        )}

        {chatError && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-800 text-[11px] rounded-lg border border-amber-200">
            <AlertCircle className="w-3.5 h-3.5 shrink-0 text-amber-600" />
            <span>{chatError}</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <div className="p-2.5 bg-white border-t border-slate-200 shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            placeholder={
              chatLanguage === 'hi'
                ? 'फसल, जल आवश्यकता या मंडी के बारे में पूछें...'
                : chatLanguage === 'mr'
                ? 'पीक, पाण्याचे नियोजन किंवा बाजाराबद्दल विचारा...'
                : 'Ask FarmPro AI about crops, water needs, risks...'
            }
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isBotTyping}
            className="flex-1 px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:border-emerald-700 disabled:bg-slate-50"
          />
          <button
            type="submit"
            disabled={!input.trim() || isBotTyping}
            className="px-3 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 disabled:opacity-40 text-white font-medium text-xs flex items-center gap-1 transition cursor-pointer shrink-0 shadow-2xs"
            aria-label="Send message"
          >
            <Send className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Ask</span>
          </button>
        </form>
        <p className="text-[10px] text-slate-400 mt-1 text-center">
          FarmPro AI provides decision support. Verify local weather and agro-conditions.
        </p>
      </div>
    </div>
  );
}
