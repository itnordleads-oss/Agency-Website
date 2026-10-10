export type CompanyLogoSize = "wide" | "standard" | "compact" | "square" | "tall";

export type CompanyLogo = {
  id: string;
  name: string;
  src: string;
  alt: string;
  /** Visual size category for balanced carousel display */
  size: CompanyLogoSize;
  /** Natural pixel width — set on raster logos to prevent CSS upscaling blur */
  intrinsicWidth?: number;
  /** Natural pixel height — set on raster logos to prevent CSS upscaling blur */
  intrinsicHeight?: number;
  /** Optional display cap override (px) for fine-tuning visual balance */
  displayMaxWidth?: number;
  /** Optional display cap override (px) for fine-tuning visual balance */
  displayMaxHeight?: number;
};

export const COMPANY_LOGO_CAROUSEL_HEADING = "Companies We\u2019ve Worked With";

/**
 * Approved client logos only (F12).
 * Inherited ADealForge / unverified logos stay out of the public list until leadership approves them.
 * Re-enable via TRUST_MODULES.clientLogosEnabled once this array has verified entries.
 */
export const COMPANY_LOGOS: CompanyLogo[] = [];
