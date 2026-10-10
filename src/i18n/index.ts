import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en";

export const supportedLanguages = ["en", "ru", "de", "es", "fr", "pt", "it", "zh"] as const;
export type SupportedLanguage = (typeof supportedLanguages)[number];

const localeImporters: Record<
  Exclude<SupportedLanguage, "en">,
  () => Promise<{ default: Record<string, unknown> }>
> = {
  ru: () => import("./locales/ru"),
  de: () => import("./locales/de"),
  es: () => import("./locales/es"),
  fr: () => import("./locales/fr"),
  pt: () => import("./locales/pt"),
  it: () => import("./locales/it"),
  zh: () => import("./locales/zh"),
};

function isSupportedLanguage(value: string | null | undefined): value is SupportedLanguage {
  return supportedLanguages.includes(value as SupportedLanguage);
}

export function resolveActiveLanguage(language: string | null | undefined): SupportedLanguage {
  const base = language?.split("-")[0]?.toLowerCase() ?? "en";
  return isSupportedLanguage(base) ? base : "en";
}

function resolveBrowserLanguage(): SupportedLanguage {
  const browserLanguage = window.navigator.language.toLowerCase();
  if (browserLanguage.startsWith("ru")) return "ru";
  if (browserLanguage.startsWith("de")) return "de";
  if (browserLanguage.startsWith("es")) return "es";
  if (browserLanguage.startsWith("fr")) return "fr";
  if (browserLanguage.startsWith("pt")) return "pt";
  if (browserLanguage.startsWith("it")) return "it";
  if (browserLanguage.startsWith("zh")) return "zh";
  return "en";
}

export function detectLanguage(): SupportedLanguage {
  if (typeof window === "undefined") {
    return "en";
  }

  const storedLanguage = window.localStorage.getItem("app-language");
  if (storedLanguage) {
    return resolveActiveLanguage(storedLanguage);
  }

  return resolveBrowserLanguage();
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

  const localeModule = await localeImporters[language]();
  i18n.addResourceBundle(language, "translation", localeModule.default, true, true);
}

export async function changeAppLanguage(language: SupportedLanguage) {
  await loadLocale(language);
  await i18n.changeLanguage(language);
}

export async function initI18n() {
  const initialLanguage = detectLanguage();

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

  if (initialLanguage !== "en") {
    await loadLocale(initialLanguage);
    await i18n.changeLanguage(initialLanguage);
  }

  syncDocumentLanguage(i18n.language);

  i18n.on("languageChanged", (language) => {
    const normalizedLanguage = resolveActiveLanguage(language);
    window.localStorage.setItem("app-language", normalizedLanguage);
    syncDocumentLanguage(normalizedLanguage);
    window.dispatchEvent(new CustomEvent("adealforge:language-changed", { detail: { language } }));
  });

  return i18n;
}

export default i18n;
