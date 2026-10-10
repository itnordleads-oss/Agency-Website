import React, { useEffect } from "react";
import MainProductMockup from "./MainProductMockup";
import { getBrandAriaLabel } from "../lib/studioBranding";

/**
 * Product Workflow page — still routable until F9 retirement.
 * F13: noindex + agency chrome title; page keeps a single h1 via MainProductMockup.
 */
function useWorkflowPageMetadata() {
  useEffect(() => {
    if (typeof document === "undefined") {
      return;
    }

    const previousTitle = document.title;
    const robots = document.querySelector('meta[name="robots"]');
    const previousRobots = robots?.getAttribute("content") ?? null;
    const description = document.querySelector('meta[name="description"]');
    const previousDescription = description?.getAttribute("content");

    document.title = `Workflow — ${getBrandAriaLabel()}`;
    description?.setAttribute(
      "content",
      "This product page is retired from the agency site index."
    );
    robots?.setAttribute("content", "noindex, nofollow");
    window.scrollTo({ top: 0, behavior: "auto" });

    return () => {
      document.title = previousTitle;
      if (previousRobots) {
        robots?.setAttribute("content", previousRobots);
      }
      if (previousDescription) {
        description?.setAttribute("content", previousDescription);
      }
    };
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
