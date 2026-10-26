import { useEffect } from "react";
import { getAgencyPageSeo } from "../../lib/agencyPageSeo";
import { applyPageMetadata } from "../../lib/pageMetadata";

/**
 * Applies Services hub document metadata via the shared agency SEO helpers
 * (same pattern as Home / About / Careers).
 */
export function useServicesPageMetadata() {
  useEffect(() => {
    if (typeof document === "undefined") {
      return;
    }

    const seo = getAgencyPageSeo("services");
    const restore = applyPageMetadata({
      title: seo.title,
      description: seo.description,
      pathname: seo.pathname,
      ogDescription: seo.ogDescription,
      twitterDescription: seo.twitterDescription,
    });
    window.scrollTo({ top: 0, behavior: "auto" });
    return restore;
  }, []);
}
