import React from "react";
import { PrimaryButton } from "../Buttons";
import { navigateToContact } from "../../App";

/**
 * Shared final CTA for Projects index and project detail pages.
 */
export default function ProjectsFinalCta() {
  return (
    <section
      className="relative mx-auto min-w-0 max-w-7xl overflow-hidden px-3 pb-20 max-[340px]:pb-16 min-[341px]:px-4 sm:px-6 md:pb-28"
      aria-labelledby="projects-final-cta-heading"
    >
      <div className="liquid-glass cta-glow-panel relative overflow-hidden rounded-2xl border border-white/14 bg-white/[0.04] px-4 py-10 text-center max-[340px]:px-3 max-[340px]:py-9 sm:rounded-3xl sm:px-8 sm:py-14 md:px-12 md:py-16">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-full"
          style={{
            backgroundImage:
              "radial-gradient(900px circle at 50% -10%, rgba(61,129,227,0.22), rgba(0,210,255,0.06) 45%, transparent 75%)",
          }}
        />
        <div className="relative z-10 mx-auto max-w-xl space-y-5 md:space-y-6">
          <h2 id="projects-final-cta-heading" className="section-title">
            Have a project in mind?
          </h2>
          <p className="text-body text-sm leading-snug md:text-base">
            Tell us what you are building and we will follow up through the contact form.
          </p>
          <div className="flex justify-center pt-1">
            <PrimaryButton onClick={navigateToContact} className="w-full px-8 py-3.5 sm:w-auto">
              Start a Project
            </PrimaryButton>
          </div>
        </div>
      </div>
    </section>
  );
}
