import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import "@fontsource/inter/800.css";
import "@fontsource/inter/latin-ext-400.css";
import "@fontsource/inter/latin-ext-500.css";
import "@fontsource/inter/latin-ext-600.css";
import "@fontsource/inter/latin-ext-700.css";
import "@fontsource/inter/latin-ext-800.css";
import "@fontsource/inter/cyrillic-400.css";
import "@fontsource/inter/cyrillic-500.css";
import "@fontsource/inter/cyrillic-600.css";
import "@fontsource/inter/cyrillic-700.css";
import "@fontsource/inter/cyrillic-800.css";
import "./index.css";
import { initI18n } from "./i18n";
import { getFaviconHref, isConfigured } from "./lib/studioBranding";

function ensureStudioFavicon() {
  const href = getFaviconHref();
  if (!isConfigured(href) || typeof document === "undefined") {
    return;
  }
  const head = document.head;
  const ensureLink = (rel: string, attrs: Record<string, string>) => {
    const sizes = attrs.sizes;
    const selector = sizes
      ? `link[rel="${rel}"][sizes="${sizes}"]`
      : `link[rel="${rel}"]:not([sizes])`;
    let el = head.querySelector(selector) as HTMLLinkElement | null;
    if (!el) {
      el = document.createElement("link");
      el.rel = rel;
      head.appendChild(el);
    }
    Object.entries(attrs).forEach(([key, value]) => {
      el!.setAttribute(key, value);
    });
  };
  ensureLink("icon", { href, sizes: "any" });
  ensureLink("icon", {
    href: "/favicon-32x32.png",
    type: "image/png",
    sizes: "32x32",
  });
  ensureLink("icon", {
    href: "/favicon-16x16.png",
    type: "image/png",
    sizes: "16x16",
  });
  ensureLink("apple-touch-icon", {
    href: "/apple-touch-icon.png",
    sizes: "180x180",
  });
}


async function bootstrap() {
  ensureStudioFavicon();
  await initI18n();

  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <App />
    </StrictMode>
  );

  let cookieStarted = false;
  const scheduleCookieInit = () => {
    if (cookieStarted) {
      return;
    }
    cookieStarted = true;
    void import("./lib/cookieConsent")
      .then(({ initCookieConsent }) => initCookieConsent())
      .catch(() => undefined);
  };

  // Init on every SPA load (all routes share this shell) so the banner is available
  // without waiting for first interaction. Keep a tiny deferral for first paint.
  window.requestAnimationFrame(() => {
    window.setTimeout(scheduleCookieInit, 0);
  });
}

void bootstrap();
