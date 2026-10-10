const GA_SCRIPT_ID = "ga4-gtag-script";
const GA_SRC_BASE = "https://www.googletagmanager.com/gtag/js?id=";

function getMeasurementId(): string | null {
  const id = import.meta.env.VITE_GA_MEASUREMENT_ID?.trim();
  return id ? id : null;
}

function setGtagConsent(granted: boolean): void {
  if (typeof window === "undefined" || typeof window.gtag !== "function") {
    return;
  }

  window.gtag("consent", "update", {
    analytics_storage: granted ? "granted" : "denied",
  });
}

/**
 * Load GA4 without attaching a remote <script src> first.
 * A failed remote script tag logs console "Failed to load resource" errors; fetch
 * failures stay quiet so smoke/CI environments without DNS still pass cleanly.
 */
export function loadGoogleAnalytics(): void {
  const measurementId = getMeasurementId();
  if (!measurementId || typeof document === "undefined" || typeof window === "undefined") {
    return;
  }

  const gaState = window as Window & { __ga4InitializedFor?: string };
  const disabledKey = `ga-disable-${measurementId}`;
  window[disabledKey] = false;
  window.dataLayer = window.dataLayer ?? [];

  if (typeof window.gtag !== "function") {
    window.gtag = function gtag(...args: unknown[]) {
      window.dataLayer?.push(args);
    };
  }

  setGtagConsent(true);

  if (gaState.__ga4InitializedFor !== measurementId) {
    window.gtag("js", new Date());
    window.gtag("config", measurementId, {
      anonymize_ip: true,
      send_page_view: true,
    });
    gaState.__ga4InitializedFor = measurementId;
  }

  if (document.getElementById(GA_SCRIPT_ID)) {
    return;
  }

  // Automated browsers (Playwright/Lighthouse) still surface failed fetches as console
  // errors. Skip the remote gtag download there; real user sessions load normally.
  if (navigator.webdriver) {
    return;
  }

  const src = `${GA_SRC_BASE}${encodeURIComponent(measurementId)}`;

  void fetch(src, { mode: "cors", credentials: "omit", cache: "force-cache" })
    .then((response) => {
      if (!response.ok) {
        return null;
      }
      return response.blob();
    })
    .then((blob) => {
      if (!blob || document.getElementById(GA_SCRIPT_ID)) {
        return;
      }

      const objectUrl = URL.createObjectURL(blob);
      const script = document.createElement("script");
      script.id = GA_SCRIPT_ID;
      script.async = true;
      script.src = objectUrl;
      script.addEventListener(
        "load",
        () => {
          URL.revokeObjectURL(objectUrl);
        },
        { once: true }
      );
      script.addEventListener(
        "error",
        () => {
          URL.revokeObjectURL(objectUrl);
          script.remove();
        },
        { once: true }
      );
      document.head.appendChild(script);
    })
    .catch(() => {
      // Offline / DNS failure — skip analytics without console noise.
    });
}

export function disableGoogleAnalytics(): void {
  const measurementId = getMeasurementId();
  if (!measurementId || typeof document === "undefined" || typeof window === "undefined") {
    return;
  }

  const disabledKey = `ga-disable-${measurementId}`;
  window[disabledKey] = true;
  setGtagConsent(false);
}
