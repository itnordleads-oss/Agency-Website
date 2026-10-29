import React, { useMemo } from "react";
import { motion, useReducedMotion } from "motion/react";
import SectionEyebrow from "../SectionEyebrow";
import HomeAgencyProjectSpotlight from "./HomeAgencyProjectSpotlight";
import { useSiteCopy } from "../../lib/useSiteCopy";
import { navigateAppPath } from "../../App";
import { getFeaturedProjects, isProjectsPublished } from "../../lib/agencyProjects";
import { HOME_AGENCY_SECTION, HOME_AGENCY_SHELL } from "./homeAgencyLayout";
import { homepageRevealProps } from "./homeAgencyMotion";
import "./homeAgencyProjectSpotlight.css";

/**
 * Homepage Featured Projects — spotlight preview (not the /projects featured card grid).
 * Concept projects remain explicitly labeled in the spotlight.
 */
export default function HomeAgencyWork() {
  const { homepageV3 } = useSiteCopy();
  const { workPreview } = homepageV3;
  const reduceMotion = useReducedMotion();
  // Stable reference — avoid remounting spotlight state on parent re-renders.
  const featured = useMemo(() => (isProjectsPublished() ? getFeaturedProjects(3) : []), []);

  if (featured.length === 0) {
    return null;
  }

  return (
    <section
      id="featured-projects"
      className={`${HOME_AGENCY_SECTION} home-agency-work relative`}
      aria-labelledby="agency-work-heading"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-0 opacity-95"
        style={{
          backgroundImage:
            "radial-gradient(680px circle at 76% 16%, rgba(0,210,255,0.09), transparent 56%), radial-gradient(520px circle at 10% 84%, rgba(61,129,227,0.07), transparent 52%)",
        }}
      />
      <div className={HOME_AGENCY_SHELL}>
        <motion.div
          className="home-agency-work__intro mb-6 flex flex-col gap-3 sm:mb-7 md:mb-8 lg:flex-row lg:items-end lg:justify-between lg:gap-6"
          {...homepageRevealProps(reduceMotion)}
        >
          <div className="home-agency-work__copy max-w-2xl">
            <span data-homepage-scroll-ref="work">
              <SectionEyebrow label={workPreview.eyebrow} />
            </span>
            <h2 id="agency-work-heading" className="section-title home-agency-work__title text-left">
              {workPreview.title}
            </h2>
            <p className="home-agency-lede home-agency-work__lede max-w-xl">
              {workPreview.subtitle}
            </p>
          </div>
          <a
            href="/projects"
            className="home-agency-work__view-all"
            onClick={(event) => {
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
              navigateAppPath("/projects");
            }}
          >
            <span>{workPreview.cta}</span>
            <span className="home-agency-work__view-all-arrow" aria-hidden>
              →
            </span>
          </a>
        </motion.div>

        <HomeAgencyProjectSpotlight projects={featured} />
      </div>
    </section>
  );
}
