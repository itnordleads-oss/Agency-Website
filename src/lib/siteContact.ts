/** Shared public contact endpoints used across footer, FAB, and terms. */
export const CONTACT_EMAIL = "contact@adealforge.com";

export const CONTACT_MAIL_SUBJECT = "ADealForge inquiry";

/** Native mailto href — works without JavaScript. */
export function getContactMailtoHref(subject: string = CONTACT_MAIL_SUBJECT): string {
  return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}`;
}

/**
 * Default WhatsApp number (digits only, no +).
 * Override in production builds with VITE_WHATSAPP_NUMBER.
 */
export const DEFAULT_WHATSAPP_NUMBER = "1234567890";

export const WHATSAPP_DEFAULT_MESSAGE =
  "Hi — I'd like to start a conversation about outbound with ADealForge.";

/** Resolves WhatsApp digits from env, falling back to the site default. */
export function getWhatsAppDigits(): string {
  const fromEnv = import.meta.env.VITE_WHATSAPP_NUMBER?.trim();
  const raw = fromEnv && fromEnv.length > 0 ? fromEnv : DEFAULT_WHATSAPP_NUMBER;
  return raw.replace(/\D/g, "");
}

export function getWhatsAppHref(): string {
  return `https://wa.me/${getWhatsAppDigits()}?text=${encodeURIComponent(WHATSAPP_DEFAULT_MESSAGE)}`;
}
