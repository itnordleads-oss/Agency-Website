/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CONTACT_ENDPOINT?: string;
  readonly VITE_TURNSTILE_SITE_KEY?: string;
  readonly VITE_GA_MEASUREMENT_ID?: string;
  readonly VITE_DEMO_VIDEO_URL?: string;
  readonly VITE_CALENDLY_URL?: string;
  readonly VITE_MEETING_SCHEDULER_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

type TurnstileRenderOptions = {
  callback?: (token: string) => void;
  "expired-callback"?: () => void;
  "error-callback"?: () => void;
  appearance?: "always" | "execute" | "interaction-only";
  theme?: "light" | "dark" | "auto";
};

type TurnstileApi = {
  render: (
    container: string | HTMLElement,
    options: TurnstileRenderOptions & { sitekey: string }
  ) => string;
  reset: (widgetId?: string) => void;
  remove: (widgetId?: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    [key: `ga-disable-${string}`]: boolean | undefined;
  }
}

export {};
