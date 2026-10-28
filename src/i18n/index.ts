import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en";

/**
 * Production multilingual scope for the Agency website.
 * English is the default and the safe fallback for any missing keys.
 */
export const supportedLanguages = ["en", "pl", "de", "ru", "fr", "es"] as const;
export type SupportedLanguage = (typeof supportedLanguages)[number];

export const LANGUAGE_STORAGE_KEY = "app-language";

const OPTIONAL_LOCALE_IMPORTERS = {
  pl: () => import("./locales/pl"),
  de: () => import("./locales/de"),
  ru: () => import("./locales/ru"),
  fr: () => import("./locales/fr"),
  es: () => import("./locales/es"),
} as const;

export function isSupportedLanguage(value: string | null | undefined): value is SupportedLanguage {
  return supportedLanguages.includes(value as SupportedLanguage);
}

export function resolveActiveLanguage(language: string | null | undefined): SupportedLanguage {
  if (!language) {
    return "en";
  }

  const normalized = language.toLowerCase().split("-")[0];
  return isSupportedLanguage(normalized) ? normalized : "en";
}

export function detectLanguage(): SupportedLanguage {
  if (typeof window === "undefined") {
    return "en";
  }

  try {
    const stored = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (isSupportedLanguage(stored)) {
      return stored;
    }
  } catch {
    // Ignore storage access errors (private mode / blocked storage).
  }

  return "en";
}

function syncDocumentLanguage(language: string) {
  if (typeof document === "undefined") {
    return;
  }

  document.documentElement.lang = resolveActiveLanguage(language);
}

export async function loadLocale(language: SupportedLanguage) {
  if (i18n.hasResourceBundle(language, "translation")) {
    return;
  }

  if (language === "en") {
    i18n.addResourceBundle("en", "translation", en, true, true);
    return;
  }

  const importer = OPTIONAL_LOCALE_IMPORTERS[language];
  if (!importer) {
    return;
  }

  const localeModule = await importer();
  i18n.addResourceBundle(language, "translation", localeModule.default, true, true);
}

export async function changeAppLanguage(language: SupportedLanguage) {
  const next = resolveActiveLanguage(language);
  await loadLocale(next);
  await i18n.changeLanguage(next);
}

export async function initI18n() {
  const initialLanguage = detectLanguage();

  await i18n.use(initReactI18next).init({
    resources: {
      en: { translation: en },
    },
    lng: "en",
    fallbackLng: "en",
    supportedLngs: [...supportedLanguages],
    nonExplicitSupportedLngs: true,
    load: "languageOnly",
    interpolation: {
      escapeValue: false,
    },
    returnNull: false,
    returnEmptyString: false,
    parseMissingKeyHandler: (key) => {
      // Never surface raw "undefined" in the UI.
      return key;
    },
    react: {
      useSuspense: false,
    },
  });

  if (initialLanguage !== "en") {
    await loadLocale(initialLanguage);
    await i18n.changeLanguage(initialLanguage);
  }

  syncDocumentLanguage(i18n.language);

  i18n.on("languageChanged", (language) => {
    const normalizedLanguage = resolveActiveLanguage(language);
    try {
      window.localStorage.setItem(LANGUAGE_STORAGE_KEY, normalizedLanguage);
    } catch {
      // Ignore storage write failures.
    }
    syncDocumentLanguage(normalizedLanguage);
    window.dispatchEvent(
      new CustomEvent("agency:language-changed", {
        detail: { language: normalizedLanguage },
      })
    );
  });

  return i18n;
}

export default i18n;
