import React from "react";
import SectionEyebrow from "../SectionEyebrow";
import { useSiteCopy } from "../../lib/useSiteCopy";
import { HOME_AGENCY_INTRO, HOME_AGENCY_SECTION, HOME_AGENCY_SHELL } from "./homeAgencyLayout";

/**
 * How we work — single canonical process timeline for the homepage.
 * Mobile: vertical. Tablet (md): 3 + 2. Desktop (lg+): 5-column horizontal.
 */
export default function HomeAgencyProcess() {
  const { homepageV3 } = useSiteCopy();
  const { process } = homepageV3;

  return (
    <section id="process" className={HOME_AGENCY_SECTION} aria-labelledby="agency-process-heading">
      <div className={HOME_AGENCY_SHELL}>
        <div className={`${HOME_AGENCY_INTRO} mb-6 sm:mb-7 md:mb-8`}>
          <span data-homepage-scroll-ref="process">
            <SectionEyebrow label={process.eyebrow} />
          </span>
          <h2 id="agency-process-heading" className="section-title text-left">
            {process.title}
          </h2>
          <p className="text-body text-[0.95rem] leading-relaxed text-white/68 sm:text-base">
            {process.subtitle}
          </p>
        </div>

        <div className="relative">
          <div
            aria-hidden
            className="pointer-events-none absolute left-[8%] right-[8%] top-5 hidden h-px bg-gradient-to-r from-transparent via-[#00D2FF]/45 to-transparent lg:block"
          />
          <ol className="relative m-0 list-none border-l border-white/15 md:grid md:grid-cols-3 md:gap-x-5 md:gap-y-8 md:border-l-0 lg:grid-cols-5 lg:gap-3">
            {process.steps.map((step, index) => (
              <li
                key={step.label}
                className="relative flex gap-4 py-3.5 pl-8 first:pt-0 last:pb-0 md:block md:px-1 md:py-0 md:pl-0 md:text-center"
              >
                <span className="absolute left-0 top-4 flex h-8 w-8 -translate-x-1/2 items-center justify-center rounded-full border border-accent-soft/35 bg-[#0C111B] text-xs font-bold text-accent-soft md:relative md:left-auto md:top-auto md:mx-auto md:h-9 md:w-9 md:translate-x-0 lg:h-10 lg:w-10 lg:border-accent-soft/40 lg:shadow-[0_0_0_6px_rgba(12,17,27,1)]">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className="min-w-0 pt-0.5 md:pt-0">
                  <h3 className="text-base font-semibold text-white md:mt-3.5 md:text-[0.95rem] lg:mt-4 lg:text-base">
                    {step.label}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-white/65 md:mt-1.5 md:text-[0.8125rem] lg:text-sm">
                    {step.description}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
