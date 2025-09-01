import React, { useState, useEffect } from 'react';
import { en } from '../locales/en';
import { az } from '../locales/az';
import { LanguageContext } from './LanguageContext';

const translationData = {
  en,
  az
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    // Get language from localStorage or default to English
    if (typeof window !== 'undefined') {
      return localStorage.getItem('ev-tap-language') || 'en';
    }
    return 'en';
  });

  const [translations, setTranslations] = useState(() => {
    return translationData[language] || translationData.en;
  });

  useEffect(() => {
    // Update translations when language changes
    setTranslations(translationData[language] || translationData.en);
    if (typeof window !== 'undefined') {
      localStorage.setItem('ev-tap-language', language);
    }
  }, [language]);

  const changeLanguage = (newLanguage) => {
    setLanguage(newLanguage);
  };

  const t = (key) => {
    return translations[key] || key;
  };

  const value = {
    language,
    changeLanguage,
    t,
    translations
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
