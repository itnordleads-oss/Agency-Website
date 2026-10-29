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
            <p className="home-agency-lede max-w-xl">{services.subtitle}</p>
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
            // Animate from the grid parent once; avoid per-tile whileInView leaving
            // lower-row cards stuck at opacity 0 on short mobile viewports.
            const tileMotion = reduceMotion
              ? {}
              : {
                  initial: { opacity: 0, y: 14 },
                  whileInView: { opacity: 1, y: 0 },
                  viewport: { once: true, amount: 0.01, margin: "120px 0px 160px 0px" },
                  transition: {
                    duration: 0.5,
                    delay: homepageStaggerDelay(index, 0.05),
                    ease: [0.22, 1, 0.36, 1] as const,
                  },
                };

            return (
              <motion.li key={item.id} className="min-h-0 min-w-0" {...tileMotion}>
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
                    <h3 className="home-agency-card-title">{item.title}</h3>
                    <p className="home-agency-card-copy">{item.description}</p>
                    <ServiceExploreLink embedded className="home-agency-card-cta mt-auto">
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
