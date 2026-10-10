import {
  acceptedCategory,
  hide,
  hidePreferences,
  run,
  show,
  validConsent,
} from "vanilla-cookieconsent";
import "vanilla-cookieconsent/dist/cookieconsent.css";
import "./cookieConsent.css";
import { disableGoogleAnalytics, loadGoogleAnalytics } from "./analytics";
import i18n, {
  detectLanguage,
  loadLocale,
  supportedLanguages,
  type SupportedLanguage,
} from "../i18n";
import {
  emitModalClose,
  emitModalOpen,
  lockBodyScroll,
  resetBodyScrollLock,
  unlockBodyScroll,
} from "./modalManager";

/** Keep in sync with public/landing-cookie-banner.js */
const CONSENT_REVISION = 3;
const CONSENT_COOKIE_NAME = "cc_cookie";

type StoredConsent = {
  categories?: unknown;
  consentId?: unknown;
  consentTimestamp?: unknown;
  lastConsentTimestamp?: unknown;
  revision?: unknown;
  services?: unknown;
  data?: unknown;
  languageCode?: unknown;
  expirationTime?: unknown;
};

function syncAnalyticsConsent(): void {
  if (acceptedCategory("analytics")) {
    loadGoogleAnalytics();
    return;
  }

  disableGoogleAnalytics();
}

function getCookieTranslations(language: SupportedLanguage) {
  const bundle = i18n.getResourceBundle(language, "translation") as
    { cookie?: unknown } | undefined;

  return bundle?.cookie;
}

function clearAppScrollLockIfIdle() {
  const html = document.documentElement;
  if (!html.classList.contains("show--consent") && !html.classList.contains("show--preferences")) {
    resetBodyScrollLock();
  }
}

/** Remove leftover interaction blockers so the site never stays unclickable. */
function restorePageInteraction() {
  const html = document.documentElement;
  html.classList.remove("show--consent", "show--preferences", "disable--interaction");
  resetBodyScrollLock();

  const ccMain = document.getElementById("cc-main");
  if (ccMain) {
    ccMain.style.pointerEvents = "none";
  }
}

function readRawConsentCookie(): StoredConsent | null {
  try {
    const match = document.cookie.match(/(?:^|;\s*)cc_cookie=([^;]*)/);
    if (!match?.[1]) {
      return null;
    }
    const parsed = JSON.parse(decodeURIComponent(match[1])) as StoredConsent;
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch {
    return null;
  }
}

function hasUsableLegacyConsent(value: StoredConsent | null): value is StoredConsent {
  if (!value || typeof value.consentId !== "string" || !value.consentId) {
    return false;
  }
  if (!Array.isArray(value.categories) || value.categories.length === 0) {
    return false;
  }
  return value.categories.every((category) => typeof category === "string");
}

/**
 * Older builds stored a valid accept choice under a different revision (or without one).
 * Rewrite those cookies to the current revision so vanilla-cookieconsent treats them as valid
 * and does not leave disable--interaction active without a usable banner.
 */
function migrateLegacyConsentCookie(): void {
  const stored = readRawConsentCookie();
  if (!hasUsableLegacyConsent(stored)) {
    return;
  }

  if (stored.revision === CONSENT_REVISION) {
    return;
  }

  const next: StoredConsent = {
    ...stored,
    revision: CONSENT_REVISION,
    categories: stored.categories,
    services: stored.services && typeof stored.services === "object" ? stored.services : {},
  };

  const expires =
    typeof stored.expirationTime === "number"
      ? new Date(stored.expirationTime)
      : new Date(Date.now() + 182 * 24 * 60 * 60 * 1000);

  const encoded = encodeURIComponent(JSON.stringify(next));
  const secure =
    typeof location !== "undefined" && location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${CONSENT_COOKIE_NAME}=${encoded}; expires=${expires.toUTCString()}; path=/; SameSite=Lax${secure}`;
}

function ensureInteractiveAfterConsent() {
  if (validConsent()) {
    restorePageInteraction();
    hide();
    hidePreferences();
  }
}

export function initCookieConsent(): void {
  if (typeof window === "undefined") {
    return;
  }

  const start = () => {
    void (async () => {
      const initialLanguage = detectLanguage();
      await loadLocale("en");
      await loadLocale(initialLanguage);

      const translations: Record<string, unknown> = {};
      for (const language of supportedLanguages) {
        if (language === initialLanguage || language === "en") {
          const bundle = getCookieTranslations(language);
          if (bundle) {
            translations[language] = bundle;
          }
        }
      }

      const enCookie = getCookieTranslations("en");

      if (!enCookie) {
        restorePageInteraction();
        return;
      }

      try {
        migrateLegacyConsentCookie();

        await run({
          mode: "opt-in",
          revision: CONSENT_REVISION,
          autoShow: true,
          lazyHtmlGeneration: false,
          // Never block page interaction behind the consent bar: banner-blocker
          // extensions can hide the modal without firing library events, which
          // would otherwise leave the page locked forever.
          hideFromBots: false,
          root: document.body,
          guiOptions: {
            consentModal: {
              layout: "bar inline",
              position: "bottom",
              equalWeightButtons: false,
            },
            preferencesModal: {
              layout: "box",
              equalWeightButtons: false,
            },
          },
          categories: {
            necessary: {
              enabled: true,
              readOnly: true,
            },
            analytics: {
              autoClear: {
                cookies: [],
              },
            },
          },
          language: {
            default: initialLanguage,
            translations: translations as never,
          },
          onConsent: () => {
            syncAnalyticsConsent();
            restorePageInteraction();
          },
          onChange: () => {
            syncAnalyticsConsent();
          },
          onModalShow: ({ modalName }) => {
            const isPreferences = modalName === "preferencesModal";
            emitModalOpen(isPreferences ? "preferencesModal" : "consentModal");

            if (isPreferences) {
              lockBodyScroll();
              hide();
              return;
            }

            // The consent bar must not lock the page; release a lock left over
            // by the preferences modal (preferences -> consent transition).
            unlockBodyScroll();
            hidePreferences();
          },
          onModalHide: ({ modalName }) => {
            clearAppScrollLockIfIdle();
            emitModalClose(modalName === "preferencesModal" ? "preferencesModal" : "consentModal");
            // If consent is already valid, never leave blockers behind.
            ensureInteractiveAfterConsent();
          },
        });

        syncAnalyticsConsent();

        if (validConsent()) {
          // Returning visitors (including migrated legacy consent): keep the site fully usable.
          restorePageInteraction();
        } else {
          show(true);
        }
      } catch {
        // Cookie UI is progressive enhancement; never leave the page blocked.
        restorePageInteraction();
      }
    })();
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true });
    return;
  }

  start();
}
