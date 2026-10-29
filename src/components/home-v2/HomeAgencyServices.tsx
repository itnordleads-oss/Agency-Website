import React from "react";
import { motion, useReducedMotion } from "motion/react";
import SectionEyebrow from "../SectionEyebrow";
import { SecondaryButton } from "../Buttons";
import HomeAgencyServiceIcon from "./HomeAgencyServiceIcon";
import ServiceExploreLink from "../services/ServiceExploreLink";
import { useSiteCopy } from "../../lib/useSiteCopy";
import { navigateAppPath } from "../../App";
import {
  getAgencyServicePath,
  isAgencyServiceId,
  type AgencyServiceId,
} from "../../content/agencyServices";
import { HOME_AGENCY_INTRO, HOME_AGENCY_SECTION, HOME_AGENCY_SHELL } from "./homeAgencyLayout";
import { homepageRevealProps, homepageStaggerDelay } from "./homeAgencyMotion";
import "./homeAgencyServices.css";

/**
 * Homepage services showcase — six approved services as one connected editorial grid.
 * No running/perimeter border animation; hover uses a short local accent only.
 */
export default function HomeAgencyServices() {
  const { homepageV3 } = useSiteCopy();
  const { services } = homepageV3;
  const reduceMotion = useReducedMotion();

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
        <motion.div
          className="mb-5 flex flex-col gap-3 sm:mb-6 md:mb-7 md:flex-row md:items-end md:justify-between md:gap-5"
          {...homepageRevealProps(reduceMotion)}
        >
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
        </motion.div>

        <motion.ul
          className="home-agency-services-grid"
          {...homepageRevealProps(reduceMotion, 0.04)}
        >
          {services.items.map((item, index) => {
            if (!isAgencyServiceId(item.id)) {
              throw new Error(`Unexpected homepage service id "${item.id}"`);
            }
            const serviceId = item.id as AgencyServiceId;
            const href = getAgencyServicePath(serviceId);

            return (
              <motion.li
                key={item.id}
                className="min-h-0 min-w-0"
                {...homepageRevealProps(reduceMotion, homepageStaggerDelay(index, 0.05))}
              >
                <a
                  href={href}
                  onClick={(event) => navigateToService(event, href)}
                  className="home-agency-services-tile group"
                  aria-label={`${services.exploreLabel}: ${item.title}`}
                >
                  <span className="home-agency-services-deco" aria-hidden />
                  <span className="relative z-[1] flex h-full min-h-0 flex-col">
                    <span className="home-agency-services-icon mb-2.5">
                      <HomeAgencyServiceIcon serviceId={serviceId} className="h-4 w-4" />
                    </span>
                    <h3 className="text-[0.95rem] font-semibold leading-snug text-white md:text-base">
                      {item.title}
                    </h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-white/66">
                      {item.description}
                    </p>
                    <ServiceExploreLink embedded className="mt-auto pt-2">
                      {services.exploreLabel}
                    </ServiceExploreLink>
                  </span>
                </a>
              </motion.li>
            );
          })}
        </motion.ul>
      </div>
    </section>
  );
}
