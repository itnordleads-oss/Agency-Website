import React, { useEffect } from "react";
import TermsDocument from "./TermsDocument";
import { useSiteCopy } from "../lib/useSiteCopy";
import { resolveContactEmail } from "../lib/siteContact";
import { getAgencyPageSeo } from "../lib/agencyPageSeo";
import { applyPageMetadata } from "../lib/pageMetadata";

const EFFECTIVE_DATE = "July 8, 2026";
const LAST_UPDATED_DATE = "July 8, 2026";

function useTermsMetadata() {
  useEffect(() => {
    if (typeof document === "undefined") {
      return;
    }

    const seo = getAgencyPageSeo("terms");
    const restore = applyPageMetadata({
      title: seo.title,
      description: seo.description,
      pathname: seo.pathname,
    });
    window.scrollTo({ top: 0, behavior: "auto" });

    return restore;
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
