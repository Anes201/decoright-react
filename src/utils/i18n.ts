
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
// load translation using http -> see /public/locales (i.e. https://github.com/i18next/react-i18next/tree/master/example/react/public/locales)
// learn more: https://github.com/i18next/i18next-http-backend
// want your translations to be loaded from a professional CDN? => https://github.com/locize/react-tutorial#step-2---use-the-locize-cdn
.use(Backend)
// detect user language
// learn more: https://github.com/i18next/i18next-browser-languageDetector
.use(LanguageDetector)
// pass the i18n instance to react-i18next.
.use(initReactI18next)
// init i18next
// for all options read: https://www.i18next.com/overview/configuration-options
.init({
  ns: ['common', 'pages', 'nav', 'messages'],
  defaultNS: 'common',
  debug: true,
  fallbackLng: 'en',
  react: {
    useSuspense: true, // Use React Suspense for loading translations
  },
  backend: {
    loadPath: "/locales/{{lng}}/{{ns}}.json",
  },
  supportedLngs: ['en', 'fr', 'ar'],
  interpolation: {
    escapeValue: false, // not needed for react as it escapes by default

    // custom formatter: support "compact" format
    format: (value: any, format?: string, lng?: string) => {
      if (format === 'compact' && typeof value === 'number') {
        try {
          return new Intl.NumberFormat(lng || 'en', {
            notation: 'compact',
            maximumFractionDigits: 1
          }).format(value);
        } catch (e) {
          // fallback simple compact
          if (value >= 1_000_000_000) return `${Math.round(value / 1_000_000_000)}B`;
          if (value >= 1_000_000) return `${Math.round(value / 1_000_000)}M`;
          if (value >= 1_000) return `${Math.round(value / 1_000)}K`;
          return String(value);
        }
      }
      // default: return raw
      return value;
    }
  },
  detection: {
    order: ['localStorage', 'cookie', 'navigator'], // Look in localStorage first
    caches: ['localStorage'], // Save the language here
  },
});

// Helper function to check for RTL direction
export const isRTL = (lng: string) => {
  const rtlLanguages = ['ar']; // RTL locales here
  return rtlLanguages.includes(lng.split('-')[0]); // Use split for cases like 'ar-EG'
};

// Listen for language changes
i18n.on('languageChanged', (lng) => {
  // Update the lang attribute (e.g., 'en', 'ar')
  document.documentElement.lang = lng;

  // Update the dir attribute (e.g., 'ltr', 'rtl')
  // i18n.dir() automatically detects direction based on the locale
  document.documentElement.dir = i18n.dir(lng);
});

export default i18n;