/**
 * F2 — centralized Development Studio branding configuration.
 *
 * `null` means the leadership-approved value is still TBC.
 * Do not invent studio name, logo, domain, contact, social URLs, or colors.
 * Optional `VITE_*` env overrides allow approved values to be injected at deploy
 * time without committing unapproved identity into the repository.
 *
 * Remaining marketing copy localization beyond this English baseline is F10 work
 * (see docs/f10-branding-i18n-debt.md).
 */

export type StudioSocialPlatform =
  "facebook" | "linkedin" | "twitter" | "instagram" | "youtube" | "github" | "dribbble" | "behance";

export type StudioBusinessLocation = {
  name: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  region: string;
  postalCode: string;
  country: string;
  latitude: number;
  longitude: number;
};

function readEnv(name: keyof ImportMetaEnv): string | null {
  const value = import.meta.env[name];
  if (typeof value !== "string") {
    return null;
  }
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function configuredOrEnv(configured: string | null, envName: keyof ImportMetaEnv): string | null {
  const fromEnv = readEnv(envName);
  if (fromEnv) {
    return fromEnv;
  }
  return configured;
}

/**
 * Leadership-approved identity fields.
 * Keep every public identity value `null` until explicitly approved.
 */
const APPROVED = {
  studioName: null as string | null,
  domain: null as string | null,
  logoSrc: null as string | null,
  faviconHref: null as string | null,
  ogImagePath: null as string | null,
  contactEmail: null as string | null,
  contactPhone: null as string | null,
  whatsappDigits: null as string | null,
  mailSubject: null as string | null,
  whatsappDefaultMessage: null as string | null,
  social: {
    /** No verified public Facebook page found — leave unset / use env when approved. */
    facebook: null as string | null,
    /** Public NordLeads company page. */
    linkedin: "https://www.linkedin.com/company/nordleadsai" as string | null,
    twitter: null as string | null,
    /** Public NordLeads Instagram profile. */
    instagram: "https://www.instagram.com/nordleads" as string | null,
    /** No verified public YouTube channel found — leave unset / use env when approved. */
    youtube: null as string | null,
    /**
     * Public GitHub organization that owns this repository
     * (`itnordleads-oss/Agency-Website`). Not a fabricated profile URL.
     */
    github: "https://github.com/itnordleads-oss" as string | null,
    dribbble: null as string | null,
    behance: null as string | null,
  },
  location: null as StudioBusinessLocation | null,
  seo: {
    title: null as string | null,
    description: null as string | null,
    siteName: null as string | null,
    twitterHandle: null as string | null,
  },
  /**
   * Leadership-approved brand palette. Null keeps the existing provisional CSS
   * tokens in `src/index.css` until a replacement palette is approved.
   */
  colors: {
    brand: null as string | null,
    accent: null as string | null,
    accentSoft: null as string | null,
  },
} as const;

/**
 * Non-marketing layout chrome used only when `studioName` is TBC.
 * Matches the repository product label ("Agency Website"), not a trade name claim.
 */
export const LAYOUT_BRAND_FALLBACK = "Agency";

/** Provisional document title while SEO identity remains TBC. */
export const PROVISIONAL_DOCUMENT_TITLE = "Agency Website";

/** Provisional meta description while SEO identity remains unpublished. */
export const PROVISIONAL_DOCUMENT_DESCRIPTION =
  "Custom software, websites, mobile apps, Shopify stores, and WordPress delivery for growing teams.";

export function isConfigured(value: string | null | undefined): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

export function getStudioName(): string | null {
  return configuredOrEnv(APPROVED.studioName, "VITE_STUDIO_NAME");
}

/** Accessible brand label for logo links; never invents a studio trade name. */
export function getBrandAriaLabel(): string {
  return getStudioName() ?? LAYOUT_BRAND_FALLBACK;
}

export function getStudioDomain(): string | null {
  const raw = configuredOrEnv(APPROVED.domain, "VITE_STUDIO_DOMAIN");
  if (!raw) {
    return null;
  }
  return raw.replace(/^https?:\/\//i, "").replace(/\/+$/, "");
}

export function getPublicOrigin(): string | null {
  const domain = getStudioDomain();
  if (!domain) {
    return null;
  }
  return `https://${domain}`;
}

export function getAbsoluteUrl(pathname = "/"): string | null {
  const origin = getPublicOrigin();
  if (!origin) {
    return null;
  }
  const path = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return `${origin}${path}`;
}

export function getLogoSrc(): string | null {
  return configuredOrEnv(APPROVED.logoSrc, "VITE_STUDIO_LOGO_SRC");
}

export function getFaviconHref(): string | null {
  return configuredOrEnv(APPROVED.faviconHref, "VITE_STUDIO_FAVICON_HREF");
}

export function getOgImageUrl(): string | null {
  const absolute = configuredOrEnv(APPROVED.ogImagePath, "VITE_STUDIO_OG_IMAGE_URL");
  if (absolute?.startsWith("http://") || absolute?.startsWith("https://")) {
    return absolute;
  }
  if (isConfigured(absolute)) {
    return getAbsoluteUrl(absolute.startsWith("/") ? absolute : `/${absolute}`);
  }
  return null;
}

export function getContactEmail(): string | null {
  return configuredOrEnv(APPROVED.contactEmail, "VITE_CONTACT_EMAIL");
}

export function getContactPhone(): string | null {
  return configuredOrEnv(APPROVED.contactPhone, "VITE_CONTACT_PHONE");
}

export function getMailSubject(): string | null {
  const studioName = getStudioName();
  const configured = configuredOrEnv(APPROVED.mailSubject, "VITE_CONTACT_MAIL_SUBJECT");
  if (configured) {
    return configured;
  }
  if (studioName) {
    return `${studioName} inquiry`;
  }
  return null;
}

export function getWhatsAppDigitsConfigured(): string | null {
  const fromEnv = readEnv("VITE_WHATSAPP_NUMBER");
  if (fromEnv) {
    return fromEnv.replace(/\D/g, "") || null;
  }
  if (!isConfigured(APPROVED.whatsappDigits)) {
    return null;
  }
  return APPROVED.whatsappDigits.replace(/\D/g, "") || null;
}

export function getWhatsAppDefaultMessage(): string | null {
  const configured = configuredOrEnv(
    APPROVED.whatsappDefaultMessage,
    "VITE_WHATSAPP_DEFAULT_MESSAGE"
  );
  if (configured) {
    return configured;
  }
  const studioName = getStudioName();
  if (studioName) {
    return `Hi — I'd like to start a conversation with ${studioName}.`;
  }
  return null;
}

export function getSocialUrl(platform: StudioSocialPlatform): string | null {
  const envKey = (
    {
      facebook: "VITE_SOCIAL_FACEBOOK_URL",
      linkedin: "VITE_SOCIAL_LINKEDIN_URL",
      twitter: "VITE_SOCIAL_TWITTER_URL",
      instagram: "VITE_SOCIAL_INSTAGRAM_URL",
      youtube: "VITE_SOCIAL_YOUTUBE_URL",
      github: "VITE_SOCIAL_GITHUB_URL",
      dribbble: "VITE_SOCIAL_DRIBBBLE_URL",
      behance: "VITE_SOCIAL_BEHANCE_URL",
    } as const
  )[platform];

  return configuredOrEnv(APPROVED.social[platform], envKey);
}

export function getBusinessLocation(): StudioBusinessLocation | null {
  return APPROVED.location;
}

export function hasPublishedBusinessLocation(): boolean {
  return APPROVED.location !== null;
}

export function getSeoTitle(): string {
  return configuredOrEnv(APPROVED.seo.title, "VITE_SEO_TITLE") ?? PROVISIONAL_DOCUMENT_TITLE;
}

export function getSeoDescription(): string {
  return (
    configuredOrEnv(APPROVED.seo.description, "VITE_SEO_DESCRIPTION") ??
    PROVISIONAL_DOCUMENT_DESCRIPTION
  );
}

export function getSeoSiteName(): string {
  return (
    configuredOrEnv(APPROVED.seo.siteName, "VITE_SEO_SITE_NAME") ??
    getStudioName() ??
    LAYOUT_BRAND_FALLBACK
  );
}

export function getTwitterHandle(): string | null {
  const handle = configuredOrEnv(APPROVED.seo.twitterHandle, "VITE_SEO_TWITTER_HANDLE");
  if (!handle) {
    return null;
  }
  return handle.startsWith("@") ? handle : `@${handle}`;
}

/** Documented provisional palette mirrors; CSS remains authoritative until approved. */
export function getProvisionalColorTokens() {
  return {
    brand: APPROVED.colors.brand ?? "#3d81e3",
    accent: APPROVED.colors.accent ?? "#00d2ff",
    accentSoft: APPROVED.colors.accentSoft ?? "#a4f4fd",
    source: APPROVED.colors.brand ? ("approved" as const) : ("provisional-css" as const),
  };
}
