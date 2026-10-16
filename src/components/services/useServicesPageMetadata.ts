import { useEffect } from "react";
import {
  getAbsoluteUrl,
  getBrandAriaLabel,
  getSeoDescription,
  getSeoTitle,
} from "../../lib/studioBranding";

export function useServicesPageMetadata(metaDescription: string) {
  useEffect(() => {
    if (typeof document === "undefined") {
      return;
    }

    const previousTitle = document.title;
    const description = document.querySelector('meta[name="description"]');
    const canonical = document.querySelector('link[rel="canonical"]');
    const ogTitle = document.querySelector('meta[property="og:title"]');
    const ogDescription = document.querySelector('meta[property="og:description"]');
    const ogUrl = document.querySelector('meta[property="og:url"]');
    const twitterTitle = document.querySelector('meta[name="twitter:title"]');
    const twitterDescription = document.querySelector('meta[name="twitter:description"]');
    const robots = document.querySelector('meta[name="robots"]');
    const previousRobots = robots?.getAttribute("content") ?? null;

    const previousDescription = description?.getAttribute("content");
    const previousCanonical = canonical?.getAttribute("href");
    const previousOgTitle = ogTitle?.getAttribute("content");
    const previousOgDescription = ogDescription?.getAttribute("content");
    const previousOgUrl = ogUrl?.getAttribute("content");
    const previousTwitterTitle = twitterTitle?.getAttribute("content");
    const previousTwitterDescription = twitterDescription?.getAttribute("content");

    const brandLabel = getBrandAriaLabel();
    const pageTitle = `Services | ${brandLabel}`;
    const servicesCanonical = getAbsoluteUrl("/services");

    document.title = pageTitle;
    description?.setAttribute("content", metaDescription);
    if (servicesCanonical) {
      canonical?.setAttribute("href", servicesCanonical);
    } else if (canonical) {
      canonical.setAttribute("href", "/services");
    }
    ogTitle?.setAttribute("content", pageTitle);
    ogDescription?.setAttribute("content", metaDescription);
    if (servicesCanonical) {
      ogUrl?.setAttribute("content", servicesCanonical);
    }
    twitterTitle?.setAttribute("content", pageTitle);
    twitterDescription?.setAttribute("content", metaDescription);
    robots?.removeAttribute("content");
    window.scrollTo({ top: 0, behavior: "auto" });

    return () => {
      document.title = previousTitle || getSeoTitle();
      if (previousDescription) {
        description?.setAttribute("content", previousDescription);
      } else {
        description?.setAttribute("content", getSeoDescription());
      }
      if (previousCanonical) {
        canonical?.setAttribute("href", previousCanonical);
      }
      if (previousOgTitle) {
        ogTitle?.setAttribute("content", previousOgTitle);
      }
      if (previousOgDescription) {
        ogDescription?.setAttribute("content", previousOgDescription);
      }
      if (previousOgUrl) {
        ogUrl?.setAttribute("content", previousOgUrl);
      }
      if (previousTwitterTitle) {
        twitterTitle?.setAttribute("content", previousTwitterTitle);
      }
      if (previousTwitterDescription) {
        twitterDescription?.setAttribute("content", previousTwitterDescription);
      }
      if (previousRobots) {
        robots?.setAttribute("content", previousRobots);
      }
    };
  }, [metaDescription]);
}
