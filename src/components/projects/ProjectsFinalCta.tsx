import React from "react";
import { PrimaryButton } from "../Buttons";
import { navigateToContact } from "../../App";
import { useSiteCopy } from "../../lib/useSiteCopy";

/**
 * Shared final CTA for Projects index and project detail pages.
 */
export default function ProjectsFinalCta() {
  const { projectsPage } = useSiteCopy();

  return (
    <section
      className="projects-page-shell relative min-w-0 overflow-hidden pb-8 max-[340px]:pb-7 md:pb-10"
      aria-labelledby="projects-final-cta-heading"
      data-floating-prompt-suppression
    >
      <div className="liquid-glass cta-glow-panel relative overflow-hidden rounded-2xl border border-white/12 bg-white/[0.04] px-4 py-7 text-center max-[340px]:px-3.5 max-[340px]:py-6 sm:rounded-3xl sm:px-8 sm:py-7 md:px-10 md:py-8">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-full"
          style={{
            backgroundImage:
              "radial-gradient(900px circle at 50% -10%, rgba(61,129,227,0.22), rgba(0,210,255,0.06) 45%, transparent 75%)",
          }}
        />
        <div className="relative z-10 mx-auto max-w-xl space-y-3 md:space-y-3">
          <h2 id="projects-final-cta-heading" className="section-title text-balance">
            {projectsPage.finalCta.title}
          </h2>
          <p className="projects-final-cta__copy">{projectsPage.finalCta.body}</p>
          <div className="flex justify-center pt-1">
            <PrimaryButton
              onClick={navigateToContact}
              className="projects-final-cta__button w-full max-w-full px-5 py-3.5 sm:w-auto sm:px-8 whitespace-normal sm:whitespace-nowrap"
            >
              {projectsPage.finalCta.primaryCta}
            </PrimaryButton>
          </div>
        </div>
      </div>
    </section>
  );
}
