import React, { createContext, useContext, useState, useEffect } from 'react';
import enTranslations from '../i18n/en.json';
import arTranslations from '../i18n/ar.json';

type Translations = typeof enTranslations;
type Language = 'en' | 'ar';

interface I18nContextType {
  language: Language;
  translations: Translations;
  t: (key: string, fallback?: string) => string;
  setLanguage: (lang: Language) => void;
  isRTL: boolean;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

const translationsMap = {
  en: enTranslations,
  ar: arTranslations,
};

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('appLanguage');
    return (saved === 'ar' || saved === 'en' ? saved : 'en') as Language;
  });

  const translations = translationsMap[language];
  const isRTL = language === 'ar';

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('appLanguage', lang);
  };

  // Apply RTL direction and load RTL CSS when Arabic
  useEffect(() => {
    const htmlElement = document.documentElement;
    htmlElement.dir = isRTL ? 'rtl' : 'ltr';
    htmlElement.lang = language;

    // Load or remove RTL stylesheet
    const rtlLink = document.getElementById('rtl-stylesheet') as HTMLLinkElement;
    if (isRTL) {
      if (!rtlLink) {
        const link = document.createElement('link');
        link.id = 'rtl-stylesheet';
        link.rel = 'stylesheet';
        link.href = '/legacy-css/arabic_css.css';
        document.head.appendChild(link);
      }
    } else {
      if (rtlLink) {
        rtlLink.remove();
      }
    }
  }, [isRTL, language]);

  // Helper function to get nested translation using dot notation
  const t = (key: string, fallback?: string): string => {
    const keys = key.split('.');
    let value: any = translations;
    
    for (const k of keys) {
      if (value && typeof value === 'object') {
        value = value[k];
      } else {
        return fallback || key;
      }
    }
    
    return typeof value === 'string' ? value : (fallback || key);
  };

  return (
    <I18nContext.Provider value={{ language, translations, t, setLanguage, isRTL }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = (): I18nContextType => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within I18nProvider');
  }
  return context;
};

// Convenience hook for translation only
export const useT = () => {
  const { t } = useI18n();
  return t;
};
