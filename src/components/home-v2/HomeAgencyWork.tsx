import React, { useMemo } from "react";
import { ArrowRight } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import SectionEyebrow from "../SectionEyebrow";
import HomeAgencyProjectSpotlight from "./HomeAgencyProjectSpotlight";
import { SecondaryButton } from "../Buttons";
import { useSiteCopy } from "../../lib/useSiteCopy";
import { navigateAppPath } from "../../App";
import { getFeaturedProjects, isProjectsPublished } from "../../lib/agencyProjects";
import { HOME_AGENCY_INTRO, HOME_AGENCY_SECTION, HOME_AGENCY_SHELL } from "./homeAgencyLayout";
import { homepageRevealProps } from "./homeAgencyMotion";

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
      className={`${HOME_AGENCY_SECTION} relative`}
      aria-labelledby="agency-work-heading"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-0 opacity-90"
        style={{
          backgroundImage:
            "radial-gradient(640px circle at 78% 18%, rgba(0,210,255,0.08), transparent 55%), radial-gradient(520px circle at 8% 80%, rgba(61,129,227,0.07), transparent 50%)",
        }}
      />
      <div className={HOME_AGENCY_SHELL}>
        <motion.div
          className="mb-5 flex flex-col gap-3 sm:mb-6 md:mb-7 md:flex-row md:items-end md:justify-between md:gap-5"
          {...homepageRevealProps(reduceMotion)}
        >
          <div className={HOME_AGENCY_INTRO}>
            <span data-homepage-scroll-ref="work">
              <SectionEyebrow label={workPreview.eyebrow} />
            </span>
            <h2 id="agency-work-heading" className="section-title text-left">
              {workPreview.title}
            </h2>
            <p className="home-agency-lede max-w-xl">{workPreview.subtitle}</p>
          </div>
          <SecondaryButton
            onClick={() => navigateAppPath("/projects")}
            className="w-full shrink-0 text-sm sm:w-auto"
          >
            <span className="inline-flex items-center gap-2">
              {workPreview.cta}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </span>
          </SecondaryButton>
        </motion.div>

        <motion.div {...homepageRevealProps(reduceMotion, 0.08)}>
          <HomeAgencyProjectSpotlight projects={featured} />
        </motion.div>
      </div>
    </section>
  );
}
