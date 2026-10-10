import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en";

/**
 * F10 / F1 language scope: English-only v1 until leadership approves multilingual copy.
 * Locale files for other languages remain in-repo for later activation.
 */
export const supportedLanguages = ["en"] as const;
export type SupportedLanguage = (typeof supportedLanguages)[number];

const OPTIONAL_LOCALE_IMPORTERS = {
  ru: () => import("./locales/ru"),
  de: () => import("./locales/de"),
  es: () => import("./locales/es"),
  fr: () => import("./locales/fr"),
  pt: () => import("./locales/pt"),
  it: () => import("./locales/it"),
  zh: () => import("./locales/zh"),
} as const;

function isSupportedLanguage(value: string | null | undefined): value is SupportedLanguage {
  return supportedLanguages.includes(value as SupportedLanguage);
}

export function resolveActiveLanguage(_language: string | null | undefined): SupportedLanguage {
  return "en";
}

export function detectLanguage(): SupportedLanguage {
  return "en";
}

function syncDocumentLanguage(language: string) {
  if (typeof document === "undefined") {
    return;
  }

  const normalized = isSupportedLanguage(language) ? language : "en";
  document.documentElement.lang = normalized;
}

export async function loadLocale(language: SupportedLanguage) {
  if (i18n.hasResourceBundle(language, "translation")) {
    return;
  }

  if (language === "en") {
    i18n.addResourceBundle("en", "translation", en, true, true);
    return;
  }

  // Reserved for future multilingual activation after F1 approval.
  const importer = OPTIONAL_LOCALE_IMPORTERS[language as keyof typeof OPTIONAL_LOCALE_IMPORTERS];
  if (!importer) {
    return;
  }

  const localeModule = await importer();
  i18n.addResourceBundle(language, "translation", localeModule.default, true, true);
}

export async function changeAppLanguage(language: SupportedLanguage) {
  await loadLocale(language);
  await i18n.changeLanguage(language);
}

export async function initI18n() {
  await i18n.use(initReactI18next).init({
    resources: {
      en: { translation: en },
    },
    lng: "en",
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  });

  syncDocumentLanguage("en");

  i18n.on("languageChanged", (language) => {
    const normalizedLanguage = resolveActiveLanguage(language);
    window.localStorage.setItem("app-language", normalizedLanguage);
    syncDocumentLanguage(normalizedLanguage);
    window.dispatchEvent(
      new CustomEvent("agency:language-changed", { detail: { language: normalizedLanguage } })
    );
  });

  return i18n;
}

export default i18n;
