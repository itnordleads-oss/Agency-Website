import React from "react";
import SectionEyebrow from "../SectionEyebrow";
import { navigateAppPath } from "../../App";
import { ServiceIcon } from "./serviceIcons";
import ServiceExploreLink from "./ServiceExploreLink";
import {
  SERVICES_INTRO_CLASS,
  SERVICES_SECTION_CLASS,
  SERVICES_SHELL_CLASS,
} from "./servicesLayout";
import type en from "../../i18n/locales/en";
import "./servicesHub.css";

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
          <p className="services-section-lede max-w-2xl">{overview.subtitle}</p>
        </div>

        <ul className="services-overview-board m-0 list-none p-0">
          {services.map((service) => {
            const highlights = service.hubHighlights.slice(0, 2);

            return (
              <li key={service.id} className="min-h-0">
                <a
                  href={`/services/${service.id}`}
                  onClick={(event) => navigateToService(event, `/services/${service.id}`)}
                  className="services-overview-tile group focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#00D2FF]"
                  aria-label={`Explore ${service.title}`}
                >
                  <span className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[#3D81E3]/25 bg-[#3D81E3]/10 text-[#A4F4FD] transition-colors group-hover:border-[#A4F4FD]/40 group-hover:text-[#C8F8FF]">
                    <ServiceIcon serviceId={service.id} className="h-4 w-4" />
                  </span>
                  <h3 className="services-overview-tile__title">{service.title}</h3>
                  <p className="services-overview-tile__copy">{service.shortDescription}</p>
                  <ul className="services-overview-tile__bullets">
                    {highlights.map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                  <ServiceExploreLink embedded className="services-overview-tile__cta mt-auto">
                    {overview.learnMore}
                  </ServiceExploreLink>
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
