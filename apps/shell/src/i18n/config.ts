import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en_US from '../locales/en_US/translation.json';
import pt_BR from '../locales/pt_BR/translation.json';

const resources = {
  en_US: {
    translation: en_US,
  },
  pt_BR: {
    translation: pt_BR,
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en_US', // default language
    fallbackLng: 'en_US',
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;
