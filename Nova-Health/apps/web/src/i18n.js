// src/i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const localeLoaders = {
  en: () => import('./locales/en.json'),
  zh: () => import('./locales/zh.json'),
};

const defaultLng = 'zh';
const fallbackLng = 'en';

// Initialize with empty resources, load active locale on demand
i18n
  .use(initReactI18next)
  .init({
    resources: {},
    lng: defaultLng,
    fallbackLng,
    interpolation: {
      escapeValue: false,
    },
  });

// Load active language immediately, then fallback in background
localeLoaders[defaultLng]().then((mod) => {
  i18n.addResourceBundle(defaultLng, 'translation', mod.default, true, true);
});

localeLoaders[fallbackLng]().then((mod) => {
  i18n.addResourceBundle(fallbackLng, 'translation', mod.default, true, true);
});

// Export helper to switch language with lazy loading
export async function changeLanguage(lng) {
  if (!i18n.hasResourceBundle(lng, 'translation') && localeLoaders[lng]) {
    const mod = await localeLoaders[lng]();
    i18n.addResourceBundle(lng, 'translation', mod.default, true, true);
  }
  return i18n.changeLanguage(lng);
}

export default i18n;