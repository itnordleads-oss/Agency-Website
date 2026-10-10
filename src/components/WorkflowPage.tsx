import React, { useEffect } from "react";
import MainProductMockup from "./MainProductMockup";
import { useSiteCopy } from "../lib/useSiteCopy";

/**
 * Public Workflow page — one dashboard/process component under the production
 * App shell (global Navbar + Footer).
 */
function useWorkflowPageMetadata(documentTitle: string, metaDescription: string) {
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

    document.title = documentTitle;
    description?.setAttribute("content", metaDescription);
    canonical?.setAttribute("href", "https://adealforge.com/workflow");
    ogTitle?.setAttribute("content", documentTitle);
    ogDescription?.setAttribute("content", metaDescription);
    ogUrl?.setAttribute("content", "https://adealforge.com/workflow");
    twitterTitle?.setAttribute("content", documentTitle);
    twitterDescription?.setAttribute("content", metaDescription);
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
  }, [documentTitle, metaDescription]);
}

export default function WorkflowPage() {
  const { workflowPage } = useSiteCopy();

  useWorkflowPageMetadata(
    workflowPage.documentTitle || "ADealForge | Workflow",
    workflowPage.metaDescription ||
      "See how ADealForge runs outbound end to end — from finding fit companies to prepared first emails and live campaign support."
  );

  return (
    <main id="workflow-page" className="flex-grow overflow-x-hidden min-w-0">
      <MainProductMockup showBackHome />
    </main>
  );
}
