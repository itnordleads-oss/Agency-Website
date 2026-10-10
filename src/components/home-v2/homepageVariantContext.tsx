import React, { createContext, useContext } from "react";
import { useSiteCopy } from "../../lib/useSiteCopy";
import type en from "../../i18n/locales/en";

export type HomepageVariant = "v2" | "v3";

type Translations = typeof en;
type HomepageCopy = Translations["homepageV2"] | Translations["homepageV3"];

const HomepageVariantContext = createContext<HomepageVariant>("v2");

export function HomepageVariantProvider({
  variant,
  children,
}: {
  variant: HomepageVariant;
  children: React.ReactNode;
}) {
  return (
    <HomepageVariantContext.Provider value={variant}>{children}</HomepageVariantContext.Provider>
  );
}

export function useHomepageVariant() {
  return useContext(HomepageVariantContext);
}

/** Returns Homepage V2 or V3 marketing copy based on the active route variant. */
export function useHomepageCopy(): HomepageCopy {
  const variant = useHomepageVariant();
  const { homepageV2, homepageV3 } = useSiteCopy();
  return (variant === "v3" ? homepageV3 : homepageV2) as HomepageCopy;
}
