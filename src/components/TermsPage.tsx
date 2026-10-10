import React, { useEffect } from "react";
import TermsDocument from "./TermsDocument";
import { useSiteCopy } from "../lib/useSiteCopy";
import { resolveContactEmail } from "../lib/siteContact";
import {
  getAbsoluteUrl,
  getBrandAriaLabel,
  getSeoDescription,
  getSeoTitle,
} from "../lib/studioBranding";

const EFFECTIVE_DATE = "July 8, 2026";
const LAST_UPDATED_DATE = "July 8, 2026";

function useTermsMetadata() {
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

    const previousDescription = description?.getAttribute("content");
    const previousCanonical = canonical?.getAttribute("href");
    const previousOgTitle = ogTitle?.getAttribute("content");
    const previousOgDescription = ogDescription?.getAttribute("content");
    const previousOgUrl = ogUrl?.getAttribute("content");
    const previousTwitterTitle = twitterTitle?.getAttribute("content");
    const previousTwitterDescription = twitterDescription?.getAttribute("content");

    const brandLabel = getBrandAriaLabel();
    const termsTitle = `Terms & Conditions | ${brandLabel}`;
    const termsDescription =
      "Review the Terms & Conditions governing use of this website, inquiries, cookies, acceptable use, and service-related legal information.";
    const termsCanonical = getAbsoluteUrl("/terms");

    document.title = termsTitle;
    description?.setAttribute("content", termsDescription);
    if (termsCanonical) {
      canonical?.setAttribute("href", termsCanonical);
    } else if (canonical) {
      canonical.setAttribute("href", "/terms");
    }
    ogTitle?.setAttribute("content", termsTitle);
    ogDescription?.setAttribute(
      "content",
      "The legal terms governing access to and use of this website and related inquiry channels."
    );
    if (termsCanonical) {
      ogUrl?.setAttribute("content", termsCanonical);
    } else if (ogUrl) {
      ogUrl.removeAttribute("content");
    }
    twitterTitle?.setAttribute("content", termsTitle);
    twitterDescription?.setAttribute(
      "content",
      "Review the legal terms governing use of this website and related inquiry channels."
    );
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
    };
  }, []);
}

export default function TermsPage() {
  const { terms, t } = useSiteCopy();
  const termsSections = Array.isArray(terms.sections) ? terms.sections : [];
  const questionSummary = Array.isArray(terms.summaryCards) ? terms.summaryCards[2] : undefined;
  const contactEmail = resolveContactEmail();

  useTermsMetadata();

  return (
    <main className="flex-1 overflow-x-hidden min-w-0" id="terms-page">
      <TermsDocument
        content={{
          backHome: terms.backHome,
          legalLabel: terms.eyebrowLabel,
          title: terms.title,
          intro: terms.intro,
          effectiveLabel: t("terms.effective", { date: EFFECTIVE_DATE }),
          lastUpdatedLabel: t("terms.lastUpdated", { date: LAST_UPDATED_DATE }),
          questionsTitle: questionSummary?.title,
          questionsBody: questionSummary?.body,
          sections: termsSections,
          contactEmail,
        }}
      />
    </main>
  );
}
