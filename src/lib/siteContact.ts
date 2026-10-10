import {
  getContactEmail,
  getMailSubject,
  getWhatsAppDefaultMessage,
  getWhatsAppDigitsConfigured,
  isConfigured,
} from "./studioBranding";

/** Published contact email, or `null` while leadership approval is TBC. */
export function resolveContactEmail(): string | null {
  return getContactEmail();
}

/**
 * Backward-compatible export for call sites that still read a constant.
 * Prefer `resolveContactEmail()` / `hasContactEmail()` for new code.
 * Empty string means unpublished — do not render as a mailto target.
 */
export const CONTACT_EMAIL = getContactEmail() ?? "";

export function hasContactEmail(): boolean {
  return isConfigured(getContactEmail());
}

export function resolveMailSubject(): string | null {
  return getMailSubject();
}

/** Native mailto href — `null` when email is unpublished. */
export function getContactMailtoHref(subject?: string): string | null {
  const email = getContactEmail();
  if (!isConfigured(email)) {
    return null;
  }

  const resolvedSubject = subject ?? getMailSubject();
  if (isConfigured(resolvedSubject)) {
    return `mailto:${email}?subject=${encodeURIComponent(resolvedSubject)}`;
  }

  return `mailto:${email}`;
}

/** Digits-only WhatsApp number, or `null` when unpublished. */
export function getWhatsAppDigits(): string | null {
  return getWhatsAppDigitsConfigured();
}

export function hasWhatsAppContact(): boolean {
  return isConfigured(getWhatsAppDigitsConfigured()) && isConfigured(getWhatsAppDefaultMessage());
}

export function getWhatsAppHref(): string | null {
  const digits = getWhatsAppDigitsConfigured();
  const message = getWhatsAppDefaultMessage();
  if (!isConfigured(digits) || !isConfigured(message)) {
    return null;
  }
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}
