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
 * Company logo gallery. Animation duplicates are rendered separately for the
 * marquee, but each source company is defined once here.
 */
export const COMPANY_LOGOS: CompanyLogo[] = [
  {
    id: "bockelmann",
    name: "Bockelmann Holz",
    src: "/company-logos/bockelmann-holz.png",
    alt: "Bockelmann Holz logo",
    size: "wide",
    intrinsicWidth: 295,
    intrinsicHeight: 39,
  },
  {
    id: "solartime",
    name: "Solartime",
    src: "/company-logos/solartime.svg",
    alt: "Solartime logo",
    size: "compact",
    displayMaxWidth: 70,
    displayMaxHeight: 18,
  },
  {
    id: "kovotvar",
    name: "Kovotvar",
    src: "/company-logos/kovotvar.png",
    alt: "Kovotvar logo",
    size: "compact",
    intrinsicWidth: 269,
    intrinsicHeight: 73,
    displayMaxWidth: 76,
    displayMaxHeight: 20,
  },
  {
    id: "baltexport",
    name: "Baltexport",
    src: "/company-logos/baltexport-millenium.png",
    alt: "Baltexport logo",
    size: "standard",
    intrinsicWidth: 195,
    intrinsicHeight: 122,
  },
  {
    id: "apex",
    name: "Apex Construction",
    src: "/company-logos/apex-construction.png",
    alt: "Apex Construction logo",
    size: "tall",
    intrinsicWidth: 128,
    intrinsicHeight: 225,
    displayMaxWidth: 14,
    displayMaxHeight: 24,
  },
  {
    id: "bcs-batiment",
    name: "BCS Bâtiment",
    src: "/company-logos/bcs-batiment.png",
    alt: "BCS Bâtiment logo",
    size: "compact",
    intrinsicWidth: 209,
    intrinsicHeight: 171,
    displayMaxWidth: 64,
    displayMaxHeight: 28,
  },
  {
    id: "edilizia-moderna",
    name: "Edilizia Moderna",
    src: "/company-logos/edilizia-moderna.png",
    alt: "Edilizia Moderna logo",
    size: "wide",
    intrinsicWidth: 800,
    intrinsicHeight: 175,
  },
  {
    id: "nordic-bygg",
    name: "Nordic Bygg",
    src: "/company-logos/nordic-bygg.png",
    alt: "Nordic Bygg logo",
    size: "compact",
    intrinsicWidth: 1602,
    intrinsicHeight: 269,
    displayMaxWidth: 72,
    displayMaxHeight: 18,
  },
  {
    id: "holzpol",
    name: "Holzpol",
    src: "/company-logos/holzpol.png",
    alt: "Holzpol logo",
    size: "standard",
    intrinsicWidth: 766,
    intrinsicHeight: 511,
    displayMaxWidth: 72,
    displayMaxHeight: 30,
  },
  {
    id: "ldbouw",
    name: "LDL Bouw",
    src: "/company-logos/ldbouw.svg",
    alt: "LDL Bouw logo",
    size: "standard",
    displayMaxWidth: 68,
    displayMaxHeight: 28,
  },
  {
    id: "parkkozijnen",
    name: "PARL Kozijnen",
    src: "/company-logos/parkkozijnen.png",
    alt: "PARL Kozijnen logo",
    size: "compact",
    intrinsicWidth: 580,
    intrinsicHeight: 271,
    displayMaxWidth: 74,
    displayMaxHeight: 28,
  },
  {
    id: "etalones",
    name: "Etalones",
    src: "/company-logos/etalones.png",
    alt: "Etalones logo",
    size: "square",
    intrinsicWidth: 600,
    intrinsicHeight: 600,
    displayMaxWidth: 32,
    displayMaxHeight: 32,
  },
];
