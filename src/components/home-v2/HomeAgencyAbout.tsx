import React from "react";
import { ArrowRight } from "lucide-react";
import SectionEyebrow from "../SectionEyebrow";
import { useSiteCopy } from "../../lib/useSiteCopy";
import { navigateAppPath } from "../../App";
import { HOME_AGENCY_SECTION, HOME_AGENCY_SHELL } from "./homeAgencyLayout";

/**
 * Editorial About preview — intentionally distinct from the Final CTA surface.
 */
export default function HomeAgencyAbout() {
  const { homepageV3 } = useSiteCopy();
  const { aboutPreview } = homepageV3;

  return (
    <section id="about" className={HOME_AGENCY_SECTION} aria-labelledby="agency-about-heading">
      <div className={HOME_AGENCY_SHELL}>
        <div className="grid gap-7 border-y border-white/10 py-8 md:grid-cols-2 md:gap-10 md:py-10 lg:gap-14">
          <div className="min-w-0 space-y-2.5 md:border-r md:border-white/10 md:pr-8">
            <span data-homepage-scroll-ref="about">
              <SectionEyebrow label={aboutPreview.eyebrow} />
            </span>
            <h2 id="agency-about-heading" className="section-title max-w-md text-left">
              {aboutPreview.title}
            </h2>
          </div>

          <div className="min-w-0 space-y-4 md:pl-1">
            <p className="text-body max-w-xl text-[0.95rem] leading-relaxed text-white/70 sm:text-base">
              {aboutPreview.subtitle}
            </p>
            <ul className="m-0 grid list-none gap-2 p-0 sm:grid-cols-2 sm:gap-x-4 sm:gap-y-2">
              {aboutPreview.principles.map((principle) => (
                <li key={principle} className="flex items-start gap-2.5 text-sm text-white/68">
                  <span
                    className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#00D2FF]"
                    aria-hidden
                  />
                  <span>{principle}</span>
                </li>
              ))}
            </ul>
            <a
              href="/about"
              onClick={(event) => {
                event.preventDefault();
                navigateAppPath("/about");
              }}
              className="group mt-1 inline-flex items-center gap-2 rounded-full border border-white/18 bg-white/[0.04] px-4 py-2 text-sm font-semibold text-[#A4F4FD] transition-[color,background-color,border-color,transform] hover:-translate-y-px hover:border-white/30 hover:bg-white/[0.07] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#3D81E3] motion-reduce:transform-none"
            >
              {aboutPreview.cta}
              <ArrowRight
                className="h-4 w-4 transition-transform group-hover:translate-x-1 motion-reduce:transform-none"
                aria-hidden
              />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
