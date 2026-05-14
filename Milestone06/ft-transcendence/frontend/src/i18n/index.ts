import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { LANGUAGES } from './config';

import en from './locales/en.json';
import zh from './locales/zh.json';
import ja from './locales/ja.json';
import ar from './locales/ar.json';

const resources = {
  en: { translation: en },
  zh: { translation: zh },
  ja: { translation: ja },
  ar: { translation: ar },
};

const supportedLngs = Object.keys(LANGUAGES) as (keyof typeof LANGUAGES)[];

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    supportedLngs,
    load: 'languageOnly',
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
    },
  });

// Set initial dir and lang
function applyDirection(lng: string) {
  const lang = lng.split('-')[0] as keyof typeof LANGUAGES;
  const config = LANGUAGES[lang] ?? LANGUAGES.en;
  document.documentElement.setAttribute('dir', config.dir);
  document.documentElement.setAttribute('lang', lng);
}

// Apply on init
applyDirection(i18n.language || 'en');

// Apply on language change
i18n.on('languageChanged', applyDirection);

export { i18n };
export { LANGUAGES } from './config';
export type { LanguageCode } from './config';
export { translateApiMessage, API_MESSAGE_KEYS } from './apiMessages';
