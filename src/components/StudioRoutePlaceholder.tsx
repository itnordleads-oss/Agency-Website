import React, { useEffect } from "react";
import BackToHomepage from "./BackToHomepage";
import { getAgencyPageSeo, type AgencySeoPageId } from "../lib/agencyPageSeo";
import { applyPageMetadata } from "../lib/pageMetadata";

type StudioRoutePlaceholderProps = {
  title: string;
  routePath: string;
  /** Internal ownership note — not shown in the public UI. */
  ownershipNote: string;
  /** Maps to agency SEO page definitions for unique title/description. */
  seoPageId: Extract<AgencySeoPageId, "services" | "about" | "work" | "projects">;
};

/**
 * Temporary accessible shell for studio routes whose final content is owned
 * by a later feature. Not finished studio content.
 */
export default function StudioRoutePlaceholder({
  title,
  routePath,
  ownershipNote: _ownershipNote,
  seoPageId,
}: StudioRoutePlaceholderProps) {
  useEffect(() => {
    if (typeof document === "undefined") {
      return;
    }

    const seo = getAgencyPageSeo(seoPageId);
    const restore = applyPageMetadata({
      title: seo.title,
      description: seo.description,
      pathname: seo.pathname,
      robots: seo.indexable ? "index, follow, max-image-preview:large" : "noindex, nofollow",
    });
    window.scrollTo({ top: 0, behavior: "auto" });

    return restore;
  }, [seoPageId]);

  return (
    <main
      className="flex-1 overflow-x-hidden min-w-0"
      id={`${routePath.replace(/^\//, "") || "home"}-page`}
      aria-labelledby="studio-route-placeholder-title"
    >
      <section className="max-w-3xl mx-auto px-3 min-[341px]:px-4 sm:px-6 py-14 sm:py-20">
        <BackToHomepage label="Back to homepage" />
        <h1
          id="studio-route-placeholder-title"
          className="mt-8 text-3xl sm:text-4xl font-semibold tracking-tight text-white"
        >
          {title}
        </h1>
        <p className="mt-4 text-base leading-relaxed text-white/70">
          This page is not published yet. Final content will appear here when it is approved.
        </p>
      </section>
    </main>
  );
}
