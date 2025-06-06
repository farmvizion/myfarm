import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import translationEN from './locales/en/translation.json';
import translationDE from './locales/de/translation.json';
import translationHI from './locales/hi/translation.json';
import translationTE from './locales/te/translation.json';
import translationOR from './locales/or/translation.json';

// import others...

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: translationEN },
      de: { translation: translationDE },
      hi: { translation: translationHI },
      te: { translation: translationTE },
      or: { translation: translationOR },
      // others...
    },
    lng: 'en', // default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
