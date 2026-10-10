import React from "react";
import SectionEyebrow from "../SectionEyebrow";
import { SecondaryButton } from "../Buttons";
import { useSiteCopy } from "../../lib/useSiteCopy";
import { navigateAppPath } from "../../App";

/**
 * F4 — Services overview teaser.
 * Does not invent a service catalog; F5 owns the approved list on `/services`.
 */
export default function HomeAgencyServices() {
  const { homepageV3 } = useSiteCopy();
  const { services } = homepageV3;

  return (
    <section
      id="services"
      className="relative min-w-0 overflow-hidden py-12 sm:py-14 md:py-16"
      aria-labelledby="agency-services-heading"
    >
      <div className="relative z-10 mx-auto w-full min-w-0 max-w-7xl px-3 min-[341px]:px-4 sm:px-6">
        <div className="mx-auto max-w-2xl space-y-3 text-center md:space-y-4">
          <div className="flex justify-center">
            <span data-homepage-scroll-ref="services">
              <SectionEyebrow label={services.eyebrow} />
            </span>
          </div>
          <h2 id="agency-services-heading" className="section-title">
            {services.title}
          </h2>
          <p className="text-body text-sm leading-relaxed text-white/65 sm:text-base">
            {services.subtitle}
          </p>
          <div className="flex justify-center pt-2">
            <SecondaryButton
              onClick={() => navigateAppPath("/services")}
              className="w-full text-sm sm:w-auto min-[341px]:px-8 min-[341px]:py-3.5"
            >
              {services.cta}
            </SecondaryButton>
          </div>
        </div>
      </div>
    </section>
  );
}
