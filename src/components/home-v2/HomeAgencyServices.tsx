import React from "react";
import { ArrowRight } from "lucide-react";
import SectionEyebrow from "../SectionEyebrow";
import GlassCard from "../GlassCard";
import NewHomeSectionCardBorder from "../NewHomeSectionCardBorder";
import { SecondaryButton } from "../Buttons";
import HomeAgencyServiceIcon from "./HomeAgencyServiceIcon";
import { useSiteCopy } from "../../lib/useSiteCopy";
import { navigateAppPath } from "../../App";
import {
  getAgencyServicePath,
  isAgencyServiceId,
  type AgencyServiceId,
} from "../../content/agencyServices";
import { HOME_AGENCY_INTRO, HOME_AGENCY_SECTION, HOME_AGENCY_SHELL } from "./homeAgencyLayout";

/**
 * Homepage services showcase — six approved services as concise preview cards.
 */
export default function HomeAgencyServices() {
  const { homepageV3 } = useSiteCopy();
  const { services } = homepageV3;

  const navigateToService = (event: React.MouseEvent<HTMLAnchorElement>, pathname: string) => {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }
    event.preventDefault();
    navigateAppPath(pathname);
  };

  return (
    <section
      id="services"
      className={HOME_AGENCY_SECTION}
      aria-labelledby="agency-services-heading"
    >
      <div className={HOME_AGENCY_SHELL}>
        <div className="mb-6 flex flex-col gap-3.5 sm:mb-7 md:mb-8 md:flex-row md:items-end md:justify-between md:gap-6">
          <div className={`${HOME_AGENCY_INTRO} text-left`}>
            <span data-homepage-scroll-ref="services">
              <SectionEyebrow label={services.eyebrow} />
            </span>
            <h2 id="agency-services-heading" className="section-title">
              {services.title}
            </h2>
            <p className="text-body max-w-xl text-[0.95rem] leading-relaxed text-white/68 sm:text-base">
              {services.subtitle}
            </p>
          </div>
          <SecondaryButton
            onClick={() => navigateAppPath("/services")}
            className="w-full shrink-0 text-sm sm:w-auto min-[341px]:px-7 min-[341px]:py-3"
          >
            {services.cta}
          </SecondaryButton>
        </div>

        <ul className="m-0 grid list-none grid-cols-1 gap-3 p-0 sm:grid-cols-2 sm:gap-3.5 lg:grid-cols-3 lg:gap-4">
          {services.items.map((item) => {
            if (!isAgencyServiceId(item.id)) {
              throw new Error(`Unexpected homepage service id "${item.id}"`);
            }
            const serviceId = item.id as AgencyServiceId;
            const href = getAgencyServicePath(serviceId);

            return (
              <li key={item.id} className="min-h-0">
                <a
                  href={href}
                  onClick={(event) => navigateToService(event, href)}
                  className="group block h-full rounded-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#3D81E3]"
                  aria-label={`${services.exploreLabel}: ${item.title}`}
                >
                  <NewHomeSectionCardBorder className="h-full rounded-2xl">
                    <GlassCard
                      glowColor="brand"
                      className="relative h-full border border-white/[0.1] bg-white/[0.025] p-4 transition-[border-color,background-color,box-shadow,transform] group-hover:-translate-y-0.5 group-hover:border-[#3D81E3]/45 group-hover:bg-white/[0.05] group-hover:shadow-[0_14px_40px_rgba(0,0,0,0.16)] motion-reduce:transform-none sm:p-5"
                      contentClassName="flex h-full min-h-[11rem] flex-col"
                    >
                      <span className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#3D81E3]/30 bg-[#3D81E3]/10 text-[#A4F4FD] transition-colors group-hover:border-[#A4F4FD]/40 group-hover:bg-[#3D81E3]/15">
                        <HomeAgencyServiceIcon serviceId={serviceId} />
                      </span>
                      <h3 className="text-[0.95rem] font-semibold leading-snug text-white md:text-base">
                        {item.title}
                      </h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-white/62">
                        {item.description}
                      </p>
                      <span className="mt-auto inline-flex items-center gap-2 pt-4 text-sm font-semibold text-[#A4F4FD] transition-colors group-hover:text-white">
                        {services.exploreLabel}
                        <ArrowRight
                          className="h-4 w-4 transition-transform group-hover:translate-x-1 motion-reduce:transform-none"
                          aria-hidden
                        />
                      </span>
                    </GlassCard>
                  </NewHomeSectionCardBorder>
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
