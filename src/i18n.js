import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import các file dịch
import en from './locales/en.json';
import ja from './locales/ja.json';
import ko from './locales/ko.json';
import vi from './locales/vi.json';
import es from './locales/es.json';
import fr from './locales/fr.json';

const resources = {
  en: { translation: en },
  ja: { translation: ja },
  ko: { translation: ko },
  vi: { translation: vi },
  es: { translation: es },
  fr: { translation: fr },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', // Ngôn ngữ mặc định
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // React đã xử lý escaping
    },
  });

export default i18n;