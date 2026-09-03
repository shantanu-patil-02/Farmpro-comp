import React, { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { useTranslation, SUPPORTED_LANGUAGES } from '../i18n/index.jsx';
import { useFarm } from '../context/FarmContext.jsx';

export default function LanguageSelector({ compact = false }) {
  const { language, setLanguage } = useTranslation();
  const farmCtx = useFarm();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const currentLang = SUPPORTED_LANGUAGES.find(l => l.code === language) || SUPPORTED_LANGUAGES[0];

  const handleSelectLanguage = (code) => {
    setLanguage(code);
    if (farmCtx?.setLanguage) {
      farmCtx.setLanguage(code);
    }
    setIsOpen(false);
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        id="language-selector-btn"
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-950/70 hover:bg-emerald-900 border border-emerald-700/60 text-emerald-100 text-xs font-medium transition cursor-pointer"
        aria-expanded={isOpen}
      >
        <Globe className="w-3.5 h-3.5 text-amber-400" />
        <span className="truncate max-w-[80px] sm:max-w-none">
          {compact ? currentLang.code.toUpperCase() : currentLang.native}
        </span>
        <ChevronDown className={`w-3 h-3 text-emerald-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1.5 w-44 rounded-xl bg-white shadow-xl border border-slate-200 py-1.5 z-50 text-slate-800 animate-in fade-in-50 zoom-in-95 duration-100">
          <div className="px-3 py-1 text-[10px] uppercase font-bold text-slate-400 tracking-wider border-b border-slate-100">
            Language / भाषा / भाषा
          </div>
          <div className="py-1">
            {SUPPORTED_LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                type="button"
                onClick={() => handleSelectLanguage(lang.code)}
                className={`w-full flex items-center justify-between px-3 py-1.5 text-xs text-left hover:bg-emerald-50 transition cursor-pointer ${
                  language === lang.code ? 'font-bold text-emerald-800 bg-emerald-50/70' : 'text-slate-700'
                }`}
              >
                <div>
                  <span className="block font-medium">{lang.native}</span>
                  <span className="text-[10px] text-slate-400">{lang.name}</span>
                </div>
                {language === lang.code && (
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

