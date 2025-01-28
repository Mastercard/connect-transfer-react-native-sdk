import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './en.json';
import es from './es.json';

i18next
  .use(initReactI18next) // Connects i18next with React for live reload of translations.
  .init({
    resources: {
      en: { translation: en },
      es: { translation: es },
    },
    lng: 'en', // default language
    fallbackLng: 'en', // fallback language
    interpolation: {
      escapeValue: false, // Set to false to render translation values as-is without escaping
    },
    compatibilityJSON: 'v3', // Use v3 compatibility mode
  });

export default i18next;
