import React from "react";
import { Mail, Linkedin, Instagram, Facebook, Github, Youtube } from "lucide-react";
import {
  getContactMailtoHref,
  getWhatsAppHref,
  hasContactEmail,
  resolveContactEmail,
} from "./siteContact";
import { getSocialUrl, isConfigured, type StudioSocialPlatform } from "./studioBranding";

export type SocialPlatform = StudioSocialPlatform | "whatsapp" | "email";

export type SocialLinkItem = {
  key: SocialPlatform;
  href: string;
  label: string;
  platformClass: string;
  icon: React.ReactNode;
};

type FooterSocialKey = Exclude<StudioSocialPlatform, never>;

type FooterSocialDefinition = {
  key: FooterSocialKey;
  label: string;
  platformClass: string;
  icon: React.ReactNode;
  resolveHref: () => string | null;
};

function isSafeExternalUrl(value: string | null | undefined): value is string {
  if (!isConfigured(value)) {
    return false;
  }

  const trimmed = value.trim();
  if (trimmed === "#" || trimmed.toLowerCase() === "about:blank") {
    return false;
  }

  try {
    const url = new URL(trimmed);
    return (url.protocol === "https:" || url.protocol === "http:") && url.hostname.length > 0;
  } catch {
    return false;
  }
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.89-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function DribbbleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12 0C5.374 0 0 5.373 0 12s5.374 12 12 12 12-5.373 12-12S18.626 0 12 0zm7.893 6.164c1.292 1.68 2.077 3.78 2.13 6.05-2.32-.47-4.447-.47-6.36-.05a27.34 27.34 0 00-.47-1.09c2.03-.84 3.65-2.07 4.7-4.91zm-1.71-1.55c-.9 2.45-2.29 3.52-4.15 4.25A37.24 37.24 0 0011.74 2.8c2.53.4 4.72 1.64 6.443 3.814zM10.52 2.96c.54 2.07 1.23 4.06 2.05 5.95-3.14.93-6.8 1.05-10.2.34A10.01 10.01 0 0110.52 2.96zM2.05 10.7c3.8.68 7.78.53 11.18-.47.34.7.65 1.42.93 2.15-3.58 1.12-6.48 3.23-8.22 6.6A9.96 9.96 0 012.05 10.7zm2.64 9.2c1.54-3.05 4.12-5 7.35-6.05.7 2.02 1.22 4.12 1.54 6.28A9.98 9.98 0 014.69 19.9zm10.54-.55c-.35-2.2-.9-4.32-1.64-6.34 1.72-.32 3.65-.3 5.8.14a10.02 10.02 0 01-4.16 6.2z" />
    </svg>
  );
}

function BehanceIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M8.22 10.52c.72 0 1.22-.4 1.22-1.05s-.5-1.05-1.22-1.05H6.86v2.1h1.36zm-.08 3.96c.82 0 1.4-.45 1.4-1.18 0-.72-.58-1.16-1.4-1.16H6.86v2.34h1.28zM22 7.98h-5.2v1.2H22V7.98zM4 6h4.55C10.8 6 12 7.12 12 8.95c0 1.2-.62 2.12-1.68 2.48v.06c1.4.3 2.28 1.38 2.28 2.92C12.6 16.2 11.05 17.5 8.7 17.5H4V6zm7.98 8.55c0-1.95 1.4-3.35 3.55-3.35 2.05 0 3.42 1.32 3.42 3.28v.45h-5.05c.12 1.05.9 1.7 1.98 1.7.85 0 1.48-.32 1.8-.95l1.55.62c-.62 1.28-1.9 1.95-3.4 1.95-2.28 0-4.05-1.52-4.05-3.7zm5.05-.85c-.08-.95-.78-1.55-1.72-1.55-.95 0-1.65.6-1.85 1.55h3.57zM6.86 8.1h1.2c.78 0 1.25.42 1.25 1.12S8.84 10.35 8.06 10.35h-1.2V8.1z" />
    </svg>
  );
}

const iconClassName = "w-4 h-4";

/** Centralized Footer Connect destinations. Empty/invalid href values are filtered out. */
const FOOTER_SOCIAL_DEFINITIONS: readonly FooterSocialDefinition[] = [
  {
    key: "linkedin",
    label: "LinkedIn",
    platformClass: "social-icon--linkedin",
    icon: <Linkedin className={iconClassName} strokeWidth={2} />,
    resolveHref: () => getSocialUrl("linkedin"),
  },
  {
    key: "facebook",
    label: "Facebook",
    platformClass: "social-icon--facebook",
    icon: <Facebook className={iconClassName} strokeWidth={2} />,
    resolveHref: () => getSocialUrl("facebook"),
  },
  {
    key: "instagram",
    label: "Instagram",
    platformClass: "social-icon--instagram",
    icon: <Instagram className={iconClassName} strokeWidth={2} />,
    resolveHref: () => getSocialUrl("instagram"),
  },
  {
    key: "youtube",
    label: "YouTube",
    platformClass: "social-icon--youtube",
    icon: <Youtube className={iconClassName} strokeWidth={2} />,
    resolveHref: () => getSocialUrl("youtube"),
  },
  {
    key: "twitter",
    label: "X",
    platformClass: "social-icon--x",
    icon: <XIcon className={iconClassName} />,
    resolveHref: () => getSocialUrl("twitter"),
  },
  {
    key: "github",
    label: "GitHub",
    platformClass: "social-icon--github",
    icon: <Github className={iconClassName} strokeWidth={2} />,
    resolveHref: () => getSocialUrl("github"),
  },
  {
    key: "dribbble",
    label: "Dribbble",
    platformClass: "social-icon--dribbble",
    icon: <DribbbleIcon className={iconClassName} />,
    resolveHref: () => getSocialUrl("dribbble"),
  },
  {
    key: "behance",
    label: "Behance",
    platformClass: "social-icon--behance",
    icon: <BehanceIcon className={iconClassName} />,
    resolveHref: () => getSocialUrl("behance"),
  },
];

export const SOCIAL_LINKS = {
  facebook: getSocialUrl("facebook"),
  linkedin: getSocialUrl("linkedin"),
  twitter: getSocialUrl("twitter"),
  instagram: getSocialUrl("instagram"),
  youtube: getSocialUrl("youtube"),
  github: getSocialUrl("github"),
  dribbble: getSocialUrl("dribbble"),
  behance: getSocialUrl("behance"),
} as const;

function buildSocialLinkItems(): SocialLinkItem[] {
  const items: Array<SocialLinkItem | null> = [
    (() => {
      const href = SOCIAL_LINKS.linkedin;
      if (!isSafeExternalUrl(href)) {
        return null;
      }
      return {
        key: "linkedin" as const,
        href,
        label: "Follow on LinkedIn",
        platformClass: "social-icon--linkedin",
        icon: <Linkedin className={iconClassName} strokeWidth={2} />,
      };
    })(),
    (() => {
      if (!hasContactEmail()) {
        return null;
      }
      const email = resolveContactEmail();
      const href = getContactMailtoHref();
      if (!isConfigured(email) || !isConfigured(href)) {
        return null;
      }
      return {
        key: "email" as const,
        href,
        label: `Email ${email}`,
        platformClass: "social-icon--email",
        icon: <Mail className={iconClassName} strokeWidth={2} />,
      };
    })(),
    (() => {
      const href = getWhatsAppHref();
      if (!isConfigured(href)) {
        return null;
      }
      return {
        key: "whatsapp" as const,
        href,
        label: "Chat on WhatsApp",
        platformClass: "social-icon--whatsapp",
        icon: <WhatsAppIcon className={iconClassName} />,
      };
    })(),
    (() => {
      const href = SOCIAL_LINKS.facebook;
      if (!isSafeExternalUrl(href)) {
        return null;
      }
      return {
        key: "facebook" as const,
        href,
        label: "Follow on Facebook",
        platformClass: "social-icon--facebook",
        icon: <Facebook className={iconClassName} strokeWidth={2} />,
      };
    })(),
    (() => {
      const href = SOCIAL_LINKS.twitter;
      if (!isSafeExternalUrl(href)) {
        return null;
      }
      return {
        key: "twitter" as const,
        href,
        label: "Follow on X",
        platformClass: "social-icon--x",
        icon: <XIcon className={iconClassName} />,
      };
    })(),
    (() => {
      const href = SOCIAL_LINKS.instagram;
      if (!isSafeExternalUrl(href)) {
        return null;
      }
      return {
        key: "instagram" as const,
        href,
        label: "Follow on Instagram",
        platformClass: "social-icon--instagram",
        icon: <Instagram className={iconClassName} strokeWidth={2} />,
      };
    })(),
    (() => {
      const href = SOCIAL_LINKS.github;
      if (!isSafeExternalUrl(href)) {
        return null;
      }
      return {
        key: "github" as const,
        href,
        label: "GitHub",
        platformClass: "social-icon--github",
        icon: <Github className={iconClassName} strokeWidth={2} />,
      };
    })(),
  ];

  return items.filter((item): item is SocialLinkItem => item !== null);
}

/** Contact-page order with unpublished platforms omitted. */
export const socialLinkItems: SocialLinkItem[] = buildSocialLinkItems();

/** Agency Footer Connect icons — only networks with a verified external URL. */
export const footerSocialLinkItems: SocialLinkItem[] = FOOTER_SOCIAL_DEFINITIONS.flatMap(
  (definition) => {
    const href = definition.resolveHref();
    if (!isSafeExternalUrl(href)) {
      return [];
    }
    return [
      {
        key: definition.key,
        href,
        label: definition.label,
        platformClass: definition.platformClass,
        icon: definition.icon,
      },
    ];
  }
);

export const socialIconBaseClass =
  "social-icon inline-flex items-center justify-center rounded-full border transition-[transform,color,background-color,background-image,border-color,box-shadow] duration-300 ease-out shrink-0";
