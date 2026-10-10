import React, { useEffect } from "react";
import MainProductMockup from "./MainProductMockup";
import { applyPageMetadata } from "../lib/pageMetadata";
import { getSeoSiteName } from "../lib/studioBranding";

/**
 * Product Workflow page — still routable until F9 retirement redirects land.
 * F11: noindex + no product-era SEO copy; excluded from agency sitemap.
 */
function useWorkflowPageMetadata() {
  useEffect(() => {
    if (typeof document === "undefined") {
      return;
    }

    const restore = applyPageMetadata({
      title: `Workflow — ${getSeoSiteName()}`,
      description: "This product page is retired and is not part of the agency site index.",
      pathname: "/workflow",
      robots: "noindex, nofollow",
    });
    window.scrollTo({ top: 0, behavior: "auto" });

    return restore;
  }, []);
}

export default function WorkflowPage() {
  useWorkflowPageMetadata();

  return (
    <main id="workflow-page" className="flex-grow overflow-x-hidden min-w-0">
      <MainProductMockup showBackHome />
    </main>
  );
}
