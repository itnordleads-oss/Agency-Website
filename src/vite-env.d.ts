/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CONTACT_ENDPOINT?: string;
  readonly VITE_TURNSTILE_SITE_KEY?: string;
  readonly VITE_GA_MEASUREMENT_ID?: string;
  readonly VITE_DEMO_VIDEO_URL?: string;
  readonly VITE_CALENDLY_URL?: string;
  readonly VITE_MEETING_SCHEDULER_URL?: string;
  readonly VITE_WHATSAPP_NUMBER?: string;
  readonly VITE_WHATSAPP_DEFAULT_MESSAGE?: string;
  readonly VITE_STUDIO_NAME?: string;
  readonly VITE_STUDIO_DOMAIN?: string;
  readonly VITE_STUDIO_LOGO_SRC?: string;
  readonly VITE_STUDIO_FAVICON_HREF?: string;
  readonly VITE_STUDIO_OG_IMAGE_URL?: string;
  readonly VITE_CONTACT_EMAIL?: string;
  readonly VITE_CONTACT_PHONE?: string;
  readonly VITE_CONTACT_MAIL_SUBJECT?: string;
  readonly VITE_SOCIAL_FACEBOOK_URL?: string;
  readonly VITE_SOCIAL_LINKEDIN_URL?: string;
  readonly VITE_SOCIAL_TWITTER_URL?: string;
  readonly VITE_SOCIAL_INSTAGRAM_URL?: string;
  readonly VITE_SEO_TITLE?: string;
  readonly VITE_SEO_DESCRIPTION?: string;
  readonly VITE_SEO_SITE_NAME?: string;
  readonly VITE_SEO_TWITTER_HANDLE?: string;
  readonly VITE_GOOGLE_MAPS_EMBED_API_KEY?: string;
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
