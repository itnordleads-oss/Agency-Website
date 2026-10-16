import { useTranslation } from "react-i18next";
import type en from "../i18n/locales/en";

type Translations = typeof en;

function asObject<T>(value: unknown, fallback: T): T {
  return (value ?? fallback) as T;
}

/**
 * Typed access to nested marketing copy via i18n.
 * Mirrors the previous marketingCopy module shape for minimal component churn.
 * Explicitly depends on `i18n.language` so Platform and other pages re-read
 * returnObjects bundles immediately after navbar language changes.
 */
export function useSiteCopy() {
  const { t, i18n } = useTranslation();
  const language = i18n.resolvedLanguage ?? i18n.language;

  return {
    t,
    i18n,
    language,
    common: asObject(
      t("common", { returnObjects: true, lng: language }),
      {} as Translations["common"]
    ),
    nav: asObject(t("nav", { returnObjects: true, lng: language }), {} as Translations["nav"]),
    emailButton: asObject(
      t("emailButton", { returnObjects: true, lng: language }),
      {} as Translations["emailButton"]
    ),
    cookie: asObject(
      t("cookie", { returnObjects: true, lng: language }),
      {} as Translations["cookie"]
    ),
    terms: asObject(
      t("terms", { returnObjects: true, lng: language }),
      {} as Translations["terms"]
    ),
    footer: asObject(
      t("footer", { returnObjects: true, lng: language }),
      {} as Translations["footer"]
    ),
    hero: asObject(t("hero", { returnObjects: true, lng: language }), {} as Translations["hero"]),
    platformStrip: asObject(
      t("platformStrip", { returnObjects: true, lng: language }),
      {} as Translations["platformStrip"]
    ),
    capabilities: asObject(
      t("capabilities", { returnObjects: true, lng: language }),
      {} as Translations["capabilities"]
    ),
    proofBand: asObject(
      t("proofBand", { returnObjects: true, lng: language }),
      [] as unknown as Translations["proofBand"]
    ),
    workflow: asObject(
      t("workflow", { returnObjects: true, lng: language }),
      {} as Translations["workflow"]
    ),
    sectors: asObject(
      t("sectors", { returnObjects: true, lng: language }),
      {} as Translations["sectors"]
    ),
    howItWorks: asObject(
      t("howItWorks", { returnObjects: true, lng: language }),
      {} as Translations["howItWorks"]
    ),
    dataQuality: asObject(
      t("dataQuality", { returnObjects: true, lng: language }),
      {} as Translations["dataQuality"]
    ),
    pricing: asObject(
      t("pricing", { returnObjects: true, lng: language }),
      {} as Translations["pricing"]
    ),
    productDemo: asObject(
      t("productDemo", { returnObjects: true, lng: language }),
      {} as Translations["productDemo"]
    ),
    scheduleMeeting: asObject(
      t("scheduleMeeting", { returnObjects: true, lng: language }),
      {} as Translations["scheduleMeeting"]
    ),
    testimonials: asObject(
      t("testimonials", { returnObjects: true, lng: language }),
      {} as Translations["testimonials"]
    ),
    bookDemo: asObject(
      t("bookDemo", { returnObjects: true, lng: language }),
      {} as Translations["bookDemo"]
    ),
    faq: asObject(t("faq", { returnObjects: true, lng: language }), {} as Translations["faq"]),
    finalCta: asObject(
      t("finalCta", { returnObjects: true, lng: language }),
      {} as Translations["finalCta"]
    ),
    homepageV2: asObject(
      t("homepageV2", { returnObjects: true, lng: language }),
      {} as Translations["homepageV2"]
    ),
    homepageV3: asObject(
      t("homepageV3", { returnObjects: true, lng: language }),
      {} as Translations["homepageV3"]
    ),
    aboutPage: asObject(
      t("aboutPage", { returnObjects: true, lng: language }),
      {} as Translations["aboutPage"]
    ),
    servicesPage: asObject(
      t("servicesPage", { returnObjects: true, lng: language }),
      {} as Translations["servicesPage"]
    ),
    platformPage: asObject(
      t("platformPage", { returnObjects: true, lng: language }),
      {} as Translations["platformPage"]
    ),
    workflowPage: asObject(
      t("workflowPage", { returnObjects: true, lng: language }),
      {} as Translations["workflowPage"]
    ),
  };
}
