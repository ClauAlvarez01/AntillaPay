import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { translations, getNestedValue } from './translations';

const LanguageContext = createContext();

const STORAGE_KEY = 'flowli_lang';

// Detect browser language
const detectBrowserLanguage = () => {
  const browserLang = navigator.language || navigator.userLanguage;
  if (browserLang.startsWith('es')) return 'es';
  if (browserLang.startsWith('zh')) return 'zh-Hans';
  return 'en';
};

// Get initial language from localStorage or browser
const getInitialLanguage = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && translations[stored]) {
      return stored;
    }
  } catch (e) {
    console.error('Error reading from localStorage:', e);
  }
  return detectBrowserLanguage();
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(getInitialLanguage);

  const t = useCallback((key) => {
    const value = getNestedValue(translations[language], key);
    if (value) return value;
    // Fallback to English
    const enValue = getNestedValue(translations.en, key);
    if (enValue) return enValue;
    // Return key if not found (for debugging)
    return key;
  }, [language]);

  const changeLanguage = useCallback((lang) => {
    if (translations[lang]) {
      setLanguage(lang);
      try {
        localStorage.setItem(STORAGE_KEY, lang);
      } catch (e) {
        console.error('Error saving to localStorage:', e);
      }
    }
  }, []);

  return (
    <LanguageContext.Provider value={{ language, t, changeLanguage, translations: translations[language] }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};