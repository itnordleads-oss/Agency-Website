import React from "react";
import SectionEyebrow from "../SectionEyebrow";
import { SecondaryButton } from "../Buttons";
import { useSiteCopy } from "../../lib/useSiteCopy";
import { navigateAppPath } from "../../App";

/**
 * F4 — About preview linking to `/about`.
 * No invented founders, team size, history, or locations.
 */
export default function HomeAgencyAbout() {
  const { homepageV3 } = useSiteCopy();
  const { aboutPreview } = homepageV3;

  return (
    <section
      id="about"
      className="relative min-w-0 overflow-hidden py-12 sm:py-14 md:py-16"
      aria-labelledby="agency-about-heading"
    >
      <div className="relative z-10 mx-auto w-full min-w-0 max-w-7xl px-3 min-[341px]:px-4 sm:px-6">
        <div className="liquid-glass relative overflow-hidden rounded-2xl border border-white/14 bg-white/[0.04] px-4 py-10 text-center max-[340px]:px-3 max-[340px]:py-9 sm:rounded-3xl sm:px-8 sm:py-12 md:px-12">
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-full"
            style={{
              backgroundImage:
                "radial-gradient(800px circle at 50% -20%, rgba(61,129,227,0.18), rgba(0,210,255,0.05) 45%, transparent 75%)",
            }}
          />
          <div className="relative z-10 mx-auto max-w-2xl space-y-3 md:space-y-4">
            <div className="flex justify-center">
              <span data-homepage-scroll-ref="about">
                <SectionEyebrow label={aboutPreview.eyebrow} />
              </span>
            </div>
            <h2 id="agency-about-heading" className="section-title">
              {aboutPreview.title}
            </h2>
            <p className="text-body text-sm leading-relaxed text-white/65 sm:text-base">
              {aboutPreview.subtitle}
            </p>
            <div className="flex justify-center pt-2">
              <SecondaryButton
                onClick={() => navigateAppPath("/about")}
                className="w-full text-sm sm:w-auto min-[341px]:px-8 min-[341px]:py-3.5"
              >
                {aboutPreview.cta}
              </SecondaryButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
