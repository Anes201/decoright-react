
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
.use(Backend)
.use(LanguageDetector)
.use(initReactI18next)
.init({
  ns: ['translation'],
  defaultNS: 'translation',
  debug: true,
  fallbackLng: 'en',
  react: {
    useSuspense: true,
  },
  backend: {
    loadPath: "/locales/{{lng}}/{{ns}}.json",
  },
  supportedLngs: ['en', 'fr', 'ar'],
  interpolation: {
    escapeValue: false,
  },
  detection: {
    order: ['localStorage', 'cookie', 'navigator'],
    caches: ['localStorage'],
  },
});

i18n.services.formatter?.add('compact', (value, lng) => {
  if (typeof value !== 'number') return String(value);
  try {
    return new Intl.NumberFormat(lng || 'en', {
      notation: 'compact',
      maximumFractionDigits: 1
    }).format(value);
  } catch {
    if (value >= 1_000_000_000) return `${Math.round(value / 1_000_000_000)}B`;
    if (value >= 1_000_000) return `${Math.round(value / 1_000_000)}M`;
    if (value >= 1_000) return `${Math.round(value / 1_000)}K`;
    return String(value);
  }
});

export const isRTL = (lng: string) => {
  const rtlLanguages = ['ar'];
  return rtlLanguages.includes(lng.split('-')[0]);
};

i18n.on('languageChanged', (lng) => {
  document.documentElement.lang = lng;
  document.documentElement.dir = i18n.dir(lng);
});

export default i18n;

export const getLocalizedContent = (data: any, field: string, language: string) => {
  if (!data) return '';

  const localizedField = `${field}_${language}`;
  if (data[localizedField]) {
    return data[localizedField];
  }

  const enField = `${field}_en`;
  if (data[enField]) {
    return data[enField];
  }

  return data[field] || '';
};
