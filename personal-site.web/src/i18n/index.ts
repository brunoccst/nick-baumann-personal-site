import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';

import de from './locales/de.json';
import en from './locales/en.json';

export const SUPPORTED_LANGUAGES = ['en', 'de'] as const;

export type Language = (typeof SUPPORTED_LANGUAGES)[number];

export const DEFAULT_LANGUAGE: Language = 'en';

const STORAGE_KEY = 'nick-baumann-site.language';

// Maps each supported language to its locale object, so both places that
// need to read `meta` (the initial <html lang> assignment and
// `persistLanguage`) share one lookup instead of duplicating a switch.
const LOCALES: Record<Language, typeof en> = { en, de };

// Narrows an unknown string to a supported language code.
export function isSupported(value: string | null | undefined): value is Language {
  return SUPPORTED_LANGUAGES.includes(value as Language);
}

// Returns the stored language, then the browser language, then the default.
function detectLanguage(): Language {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (isSupported(stored)) return stored;
  } catch {
    // localStorage is unavailable in private modes; fall through to detection.
  }

  for (const candidate of navigator.languages ?? [navigator.language]) {
    const base = candidate.split('-')[0]?.toLowerCase();
    if (isSupported(base)) return base;
  }

  return DEFAULT_LANGUAGE;
}

// Writes the language to storage and syncs the `lang` attribute on <html>.
export function persistLanguage(language: Language): void {
  document.documentElement.lang = LOCALES[language].meta.htmlLang;
  try {
    window.localStorage.setItem(STORAGE_KEY, language);
  } catch {
    // Ignore storage failures; the language still applies for this session.
  }
}

const initialLanguage = detectLanguage();

void i18next.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    de: { translation: de },
  },
  lng: initialLanguage,
  fallbackLng: DEFAULT_LANGUAGE,
  supportedLngs: [...SUPPORTED_LANGUAGES],
  interpolation: { escapeValue: false },
  returnObjects: true,
});

document.documentElement.lang = LOCALES[initialLanguage].meta.htmlLang;

export default i18next;
