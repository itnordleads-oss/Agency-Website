import { useEffect } from "react";
import {
  getAbsoluteUrl,
  getBrandAriaLabel,
  getSeoDescription,
  getSeoTitle,
} from "../../lib/studioBranding";

type ServiceMetadata = {
  title: string;
  description: string;
  pathname: string;
  noIndex?: boolean;
};

export function useServiceDetailMetadata({
  title,
  description,
  pathname,
  noIndex = false,
}: ServiceMetadata) {
  useEffect(() => {
    if (typeof document === "undefined") {
      return;
    }

    const metadata = {
      description: document.querySelector('meta[name="description"]'),
      canonical: document.querySelector('link[rel="canonical"]'),
      ogTitle: document.querySelector('meta[property="og:title"]'),
      ogDescription: document.querySelector('meta[property="og:description"]'),
      ogUrl: document.querySelector('meta[property="og:url"]'),
      twitterTitle: document.querySelector('meta[name="twitter:title"]'),
      twitterDescription: document.querySelector('meta[name="twitter:description"]'),
      robots: document.querySelector('meta[name="robots"]'),
    };
    const previous = {
      title: document.title,
      description: metadata.description?.getAttribute("content"),
      canonical: metadata.canonical?.getAttribute("href"),
      ogTitle: metadata.ogTitle?.getAttribute("content"),
      ogDescription: metadata.ogDescription?.getAttribute("content"),
      ogUrl: metadata.ogUrl?.getAttribute("content"),
      twitterTitle: metadata.twitterTitle?.getAttribute("content"),
      twitterDescription: metadata.twitterDescription?.getAttribute("content"),
      robots: metadata.robots?.getAttribute("content"),
    };

    const pageTitle = `${title} | ${getBrandAriaLabel()}`;
    const canonicalUrl = getAbsoluteUrl(pathname) ?? pathname;

    document.title = pageTitle;
    metadata.description?.setAttribute("content", description);
    metadata.canonical?.setAttribute("href", canonicalUrl);
    metadata.ogTitle?.setAttribute("content", pageTitle);
    metadata.ogDescription?.setAttribute("content", description);
    metadata.ogUrl?.setAttribute("content", canonicalUrl);
    metadata.twitterTitle?.setAttribute("content", pageTitle);
    metadata.twitterDescription?.setAttribute("content", description);
    if (noIndex) {
      metadata.robots?.setAttribute("content", "noindex, nofollow");
    } else {
      metadata.robots?.removeAttribute("content");
    }
    window.scrollTo({ top: 0, behavior: "auto" });

    return () => {
      document.title = previous.title || getSeoTitle();
      metadata.description?.setAttribute("content", previous.description ?? getSeoDescription());
      if (previous.canonical) {
        metadata.canonical?.setAttribute("href", previous.canonical);
      }
      if (previous.ogTitle) {
        metadata.ogTitle?.setAttribute("content", previous.ogTitle);
      }
      if (previous.ogDescription) {
        metadata.ogDescription?.setAttribute("content", previous.ogDescription);
      }
      if (previous.ogUrl) {
        metadata.ogUrl?.setAttribute("content", previous.ogUrl);
      }
      if (previous.twitterTitle) {
        metadata.twitterTitle?.setAttribute("content", previous.twitterTitle);
      }
      if (previous.twitterDescription) {
        metadata.twitterDescription?.setAttribute("content", previous.twitterDescription);
      }
      if (previous.robots) {
        metadata.robots?.setAttribute("content", previous.robots);
      } else {
        metadata.robots?.removeAttribute("content");
      }
    };
  }, [description, noIndex, pathname, title]);
}
