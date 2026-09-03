import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { en } from './en.js';
import { hi } from './hi.js';
import { mr } from './mr.js';

export const TRANSLATIONS = {
  en,
  hi,
  mr
};

export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', native: 'English' },
  { code: 'hi', name: 'Hindi', native: 'हिन्दी' },
  { code: 'mr', name: 'Marathi', native: 'मराठी' }
];

export const LanguageContext = createContext(null);

/**
 * Safely resolves nested keys like 'nav.home' or 'form.title'
 */
export function resolveTranslation(lang = 'en', keyPath = '', fallback = '') {
  const dictionary = TRANSLATIONS[lang] || TRANSLATIONS.en;
  if (!keyPath) return fallback;

  const parts = keyPath.split('.');
  let current = dictionary;

  for (const part of parts) {
    if (current && typeof current === 'object' && part in current) {
      current = current[part];
    } else {
      // Try fallback to English dictionary
      let fallbackCurrent = TRANSLATIONS.en;
      let foundFallback = true;
      for (const fPart of parts) {
        if (fallbackCurrent && typeof fallbackCurrent === 'object' && fPart in fallbackCurrent) {
          fallbackCurrent = fallbackCurrent[fPart];
        } else {
          foundFallback = false;
          break;
        }
      }
      if (foundFallback && typeof fallbackCurrent === 'string') {
        return fallbackCurrent;
      }
      return fallback || keyPath;
    }
  }

  return typeof current === 'string' || typeof current === 'number' ? current : fallback || keyPath;
}

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('farmpro_language');
      if (saved && (saved === 'en' || saved === 'hi' || saved === 'mr')) {
        return saved;
      }
    }
    return 'en';
  });

  const setLanguage = useCallback((langCode) => {
    const valid = langCode === 'hi' || langCode === 'mr' ? langCode : 'en';
    setLanguageState(valid);
    if (typeof window !== 'undefined') {
      localStorage.setItem('farmpro_language', valid);
      document.documentElement.lang = valid;
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.documentElement.lang = language;
    }
  }, [language]);

  const t = useCallback((keyPath, fallback = '') => {
    return resolveTranslation(language, keyPath, fallback);
  }, [language]);

  const value = {
    language,
    setLanguage,
    t,
    supportedLanguages: SUPPORTED_LANGUAGES,
    currentLanguageDetails: SUPPORTED_LANGUAGES.find(l => l.code === language) || SUPPORTED_LANGUAGES[0]
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(LanguageContext);
  if (!context) {
    // Fallback if rendered outside provider
    return {
      language: 'en',
      setLanguage: () => {},
      t: (keyPath, fallback = '') => resolveTranslation('en', keyPath, fallback),
      supportedLanguages: SUPPORTED_LANGUAGES,
      currentLanguageDetails: SUPPORTED_LANGUAGES[0]
    };
  }
  return context;
}

export default LanguageContext;
