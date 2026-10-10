import React, { useEffect } from "react";
import TermsDocument from "./TermsDocument";
import { useSiteCopy } from "../lib/useSiteCopy";

const CONTACT_EMAIL = "contact@adealforge.com";
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

    document.title = "Terms & Conditions | ADealForge";
    description?.setAttribute(
      "content",
      "Review the Terms & Conditions governing use of the ADealForge website, inquiries, cookies, acceptable use, and service-related legal information."
    );
    canonical?.setAttribute("href", "https://adealforge.com/terms");
    ogTitle?.setAttribute("content", "Terms & Conditions | ADealForge");
    ogDescription?.setAttribute(
      "content",
      "The legal terms governing access to and use of the ADealForge website and related inquiry channels."
    );
    ogUrl?.setAttribute("content", "https://adealforge.com/terms");
    twitterTitle?.setAttribute("content", "Terms & Conditions | ADealForge");
    twitterDescription?.setAttribute(
      "content",
      "Review the legal terms governing use of the ADealForge website and related inquiry channels."
    );
    window.scrollTo({ top: 0, behavior: "auto" });

    return () => {
      document.title = previousTitle;
      if (previousDescription) {
        description?.setAttribute("content", previousDescription);
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
          contactEmail: CONTACT_EMAIL,
        }}
      />
    </main>
  );
}
