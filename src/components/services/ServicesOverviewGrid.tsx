import React from "react";
import SectionEyebrow from "../SectionEyebrow";
import NewHomeSectionCardBorder from "../NewHomeSectionCardBorder";
import GlassCard from "../GlassCard";
import { ArrowRight, Check } from "lucide-react";
import { navigateAppPath } from "../../App";
import { ServiceIcon } from "./serviceIcons";
import {
  SERVICES_INTRO_CLASS,
  SERVICES_SECTION_CLASS,
  SERVICES_SHELL_CLASS,
} from "./servicesLayout";
import type en from "../../i18n/locales/en";

type OverviewCopy = (typeof en)["servicesPage"]["overview"];
type ServiceSummary = (typeof en)["servicesPage"]["services"][number];

type ServicesOverviewGridProps = {
  overview: OverviewCopy;
  services: ServiceSummary[];
};

export default function ServicesOverviewGrid({ overview, services }: ServicesOverviewGridProps) {
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
      id="services-overview"
      className={SERVICES_SECTION_CLASS}
      aria-labelledby="services-overview-title"
    >
      <div className={SERVICES_SHELL_CLASS}>
        <div className={SERVICES_INTRO_CLASS}>
          <SectionEyebrow label={overview.eyebrow} />
          <h2 id="services-overview-title" className="section-title">
            {overview.title}
          </h2>
          <p className="text-body text-base leading-relaxed max-w-2xl">{overview.subtitle}</p>
        </div>

        <ul className="m-0 grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6">
          {services.map((service) => (
            <li key={service.id} className="min-h-0">
              <a
                href={`/services/${service.id}`}
                onClick={(event) => navigateToService(event, `/services/${service.id}`)}
                className="group block h-full rounded-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#3D81E3]"
                aria-label={`Explore ${service.title}`}
              >
                <NewHomeSectionCardBorder className="h-full rounded-2xl">
                  <GlassCard
                    glowColor="brand"
                    className="services-overview-card relative border border-white/[0.1] bg-white/[0.025] p-5 transition-[border-color,background-color,box-shadow,transform] group-hover:-translate-y-1 group-hover:border-[#3D81E3]/45 group-hover:bg-white/[0.05] group-hover:shadow-[0_18px_50px_rgba(0,0,0,0.18)] motion-reduce:transform-none md:p-6"
                    contentClassName="flex h-full min-h-[15.5rem] flex-col"
                  >
                    <span className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl border border-[#3D81E3]/30 bg-[#3D81E3]/10 text-[#A4F4FD] transition-colors group-hover:border-[#A4F4FD]/40 group-hover:bg-[#3D81E3]/15">
                      <ServiceIcon serviceId={service.id} className="h-5.5 w-5.5" />
                    </span>
                    <h3 className="text-lg font-semibold leading-snug text-white md:text-xl">
                      {service.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-body">
                      {service.shortDescription}
                    </p>
                    <ul className="mt-4 space-y-1.5">
                      {service.capabilities.slice(0, 2).map((capability) => (
                        <li
                          key={capability}
                          className="flex gap-2.5 text-xs leading-relaxed text-white/58"
                        >
                          <Check
                            className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#A4F4FD]"
                            aria-hidden
                          />
                          <span>{capability}</span>
                        </li>
                      ))}
                    </ul>
                    <span className="mt-auto inline-flex items-center gap-2 pt-5 text-sm font-semibold text-[#A4F4FD] transition-colors group-hover:text-white">
                      {overview.learnMore}
                      <ArrowRight
                        className="h-4 w-4 transition-transform group-hover:translate-x-1 motion-reduce:transform-none"
                        aria-hidden
                      />
                    </span>
                  </GlassCard>
                </NewHomeSectionCardBorder>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
