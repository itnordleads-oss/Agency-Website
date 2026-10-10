/**
 * Cookie consent for static SEO landing pages (same revision/policy as the SPA).
 * Loaded only from generated /landing/* HTML.
 */
(function initLandingCookieBanner() {
  if (typeof window === "undefined" || window.__adealforgeLandingCookieStarted) {
    return;
  }
  window.__adealforgeLandingCookieStarted = true;

  var CONSENT_REVISION = 3;
  var CONSENT_COOKIE_NAME = "cc_cookie";

  var cssHref = "https://cdn.jsdelivr.net/npm/vanilla-cookieconsent@3.1.0/dist/cookieconsent.css";
  var jsSrc = "https://cdn.jsdelivr.net/npm/vanilla-cookieconsent@3.1.0/dist/cookieconsent.umd.js";

  function restorePageInteraction() {
    var html = document.documentElement;
    html.classList.remove("show--consent", "show--preferences", "disable--interaction");
    var ccMain = document.getElementById("cc-main");
    if (ccMain) {
      ccMain.style.pointerEvents = "none";
    }
  }

  function readRawConsentCookie() {
    try {
      var match = document.cookie.match(/(?:^|;\s*)cc_cookie=([^;]*)/);
      if (!match || !match[1]) {
        return null;
      }
      var parsed = JSON.parse(decodeURIComponent(match[1]));
      return parsed && typeof parsed === "object" ? parsed : null;
    } catch (e) {
      return null;
    }
  }

  function hasUsableLegacyConsent(value) {
    if (!value || typeof value.consentId !== "string" || !value.consentId) {
      return false;
    }
    if (!Array.isArray(value.categories) || value.categories.length === 0) {
      return false;
    }
    return value.categories.every(function (category) {
      return typeof category === "string";
    });
  }

  function migrateLegacyConsentCookie() {
    var stored = readRawConsentCookie();
    if (!hasUsableLegacyConsent(stored) || stored.revision === CONSENT_REVISION) {
      return;
    }

    var next = Object.assign({}, stored, {
      revision: CONSENT_REVISION,
      services: stored.services && typeof stored.services === "object" ? stored.services : {},
    });

    var expires =
      typeof stored.expirationTime === "number"
        ? new Date(stored.expirationTime)
        : new Date(Date.now() + 182 * 24 * 60 * 60 * 1000);

    var encoded = encodeURIComponent(JSON.stringify(next));
    var secure = location.protocol === "https:" ? "; Secure" : "";
    document.cookie =
      CONSENT_COOKIE_NAME +
      "=" +
      encoded +
      "; expires=" +
      expires.toUTCString() +
      "; path=/; SameSite=Lax" +
      secure;
  }

  function injectStylesheet() {
    if (document.querySelector("link[data-adealforge-cc]")) {
      return;
    }
    var link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = cssHref;
    link.setAttribute("data-adealforge-cc", "1");
    document.head.appendChild(link);

    var style = document.createElement("style");
    style.setAttribute("data-adealforge-cc-theme", "1");
    style.textContent = `
      #cc-main { --cc-z-index: 2147483647; --cc-bg: #080b12; --cc-primary-color: #fff;
        --cc-btn-primary-bg: #ffffff; --cc-btn-primary-color: #080b12;
        --cc-btn-primary-border-color: #ffffff; position: fixed; inset: 0; z-index: 2147483647; pointer-events: none; }
      #cc-main .cm-wrapper, #cc-main .pm-wrapper { pointer-events: none; }
      html.show--consent #cc-main .cm-wrapper, html.show--consent #cc-main .cm { pointer-events: auto; }
      html.show--preferences #cc-main .pm-wrapper { pointer-events: auto; }
      html.show--preferences #cc-main .cm, html.show--preferences #cc-main .cm-wrapper { pointer-events: none !important; }
      #cc-main .cm.cm--bar { left: max(0.75rem, env(safe-area-inset-left, 0px)) !important;
        right: max(0.75rem, env(safe-area-inset-right, 0px)) !important;
        bottom: max(0.75rem, env(safe-area-inset-bottom, 0px)) !important;
        max-width: min(76rem, calc(100vw - 1.5rem)) !important; margin-inline: auto;
        border-radius: 1.125rem; border: 1px solid rgba(255,255,255,0.12);
        background: linear-gradient(180deg, rgba(255,255,255,0.055), rgba(255,255,255,0.03)), rgba(8,11,18,0.92); }
      #cc-main .cm__body { padding: 1.35rem 1.5rem; gap: 1.15rem; }
      #cc-main .cm__title { padding: 0.35rem 0.15rem 0.2rem; margin-bottom: 0.55rem; color: #fff; font-weight: 700; }
      #cc-main .cm__btn { padding: 0.8rem 1.25rem; }
      #cc-main .cm__btn:not(.cm__btn--secondary) {
        color: #080b12 !important; background: #ffffff !important; border-color: #ffffff !important; }
      #cc-main .cm__btn--secondary {
        color: #fff !important; background: rgba(255,255,255,0.08) !important;
        border-color: rgba(255,255,255,0.22) !important; }
      @media (max-width: 640px) {
        #cc-main .cm.cm--bar {
          left: max(0.875rem, env(safe-area-inset-left, 0px)) !important;
          right: max(0.875rem, env(safe-area-inset-right, 0px)) !important;
          bottom: max(0.875rem, env(safe-area-inset-bottom, 0px)) !important;
          max-width: calc(100vw - 1.75rem) !important;
        }
        #cc-main .cm__body,
        #cc-main .cm--bar.cm--inline .cm__body {
          padding: 1.125rem 0.875rem !important;
          gap: 0.875rem !important;
        }
        #cc-main .cm__title { margin-bottom: 0.5rem; padding: 0; }
        #cc-main .cm__desc { font-size: 0.8125rem; line-height: 1.5; }
        #cc-main .cm__btns, #cc-main .cm__btn-group { gap: 0.625rem; width: 100%; max-width: none; }
        #cc-main .cm__btn { padding: 0.7rem 1rem; min-height: 2.75rem; height: auto; white-space: normal; }
      }
      @media (max-width: 360px) {
        #cc-main .cm__body,
        #cc-main .cm--bar.cm--inline .cm__body {
          padding: 1rem 0.75rem !important;
          gap: 0.75rem !important;
        }
      }
    `;
    document.head.appendChild(style);
  }

  function runConsent() {
    var CookieConsent = window.CookieConsent;
    if (!CookieConsent || typeof CookieConsent.run !== "function") {
      restorePageInteraction();
      return;
    }

    migrateLegacyConsentCookie();

    CookieConsent.run({
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
        necessary: { enabled: true, readOnly: true },
        analytics: {},
      },
      language: {
        default: "en",
        translations: {
          en: {
            consentModal: {
              title: "We Value Your Privacy",
              description:
                'We use cookies to improve your experience, analyze site usage, and support essential functionality. <a href="/terms">Terms & Conditions</a>',
              acceptAllBtn: "Accept All",
              acceptNecessaryBtn: "Reject Optional",
              showPreferencesBtn: "Manage Preferences",
            },
            preferencesModal: {
              title: "Privacy Preferences",
              acceptAllBtn: "Accept All",
              acceptNecessaryBtn: "Reject Optional",
              savePreferencesBtn: "Save Preferences",
              closeIconLabel: "Close preferences",
              sections: [
                {
                  title: "Your privacy choices",
                  description:
                    "Choose which optional services we may enable. Necessary cookies keep the site working and remember your consent choice.",
                },
                {
                  title: "Necessary",
                  description:
                    "Required for basic Site operation and storing your cookie preferences.",
                  linkedCategory: "necessary",
                },
                {
                  title: "Analytics",
                  description:
                    "Google Analytics 4 helps us measure traffic and page performance when you allow analytics cookies.",
                  linkedCategory: "analytics",
                },
              ],
            },
          },
        },
      },
      onConsent: function () {
        restorePageInteraction();
      },
    })
      .then(function () {
        if (typeof CookieConsent.validConsent === "function" && CookieConsent.validConsent()) {
          restorePageInteraction();
          return;
        }
        if (typeof CookieConsent.show === "function") {
          CookieConsent.show(true);
        }
      })
      .catch(function () {
        restorePageInteraction();
      });
  }

  injectStylesheet();

  if (window.CookieConsent) {
    runConsent();
    return;
  }

  var script = document.createElement("script");
  script.src = jsSrc;
  script.async = true;
  script.onload = runConsent;
  script.onerror = restorePageInteraction;
  document.body.appendChild(script);
})();
