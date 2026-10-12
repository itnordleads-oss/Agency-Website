import React, { useEffect } from "react";
import BackToHomepage from "./BackToHomepage";
import { getBrandAriaLabel } from "../lib/studioBranding";

type StudioRoutePlaceholderProps = {
  title: string;
  routePath: string;
  /** Internal ownership note — not shown in the public UI (F13). */
  ownershipNote: string;
};

/**
 * Temporary accessible shell for studio routes whose final content is owned
 * by a later feature (F5 Services, F6 About). Not finished studio content.
 */
export default function StudioRoutePlaceholder({
  title,
  routePath,
  ownershipNote: _ownershipNote,
}: StudioRoutePlaceholderProps) {
  useEffect(() => {
    if (typeof document === "undefined") {
      return;
    }

    const previousTitle = document.title;
    const robots = document.querySelector('meta[name="robots"]');
    const previousRobots = robots?.getAttribute("content") ?? null;

    document.title = `${title} — ${getBrandAriaLabel()}`;
    robots?.setAttribute("content", "noindex, nofollow");
    window.scrollTo({ top: 0, behavior: "auto" });

    return () => {
      document.title = previousTitle;
      if (previousRobots) {
        robots?.setAttribute("content", previousRobots);
      }
    };
  }, [title]);

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
