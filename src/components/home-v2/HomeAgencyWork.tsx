import React from "react";
import { ArrowRight } from "lucide-react";
import SectionEyebrow from "../SectionEyebrow";
import WorkProjectCard from "../work/WorkProjectCard";
import { SecondaryButton } from "../Buttons";
import { useSiteCopy } from "../../lib/useSiteCopy";
import { navigateAppPath } from "../../App";
import { getPublishedWorkProjects } from "../../lib/workProjects";
import { IS_WORK_NAV_PUBLISHED } from "../../lib/studioNavigation";
import { HOME_AGENCY_INTRO, HOME_AGENCY_SECTION, HOME_AGENCY_SHELL } from "./homeAgencyLayout";

/**
 * Selected Work — rendered only when approved published projects exist
 * and the Work nav/route gate is enabled.
 */
export default function HomeAgencyWork() {
  const { homepageV3 } = useSiteCopy();
  const { workPreview } = homepageV3;
  const projects =
    IS_WORK_NAV_PUBLISHED && getPublishedWorkProjects().length > 0
      ? getPublishedWorkProjects().slice(0, 3)
      : [];

  if (projects.length === 0) {
    return null;
  }

  return (
    <section
      id="work-preview"
      className={HOME_AGENCY_SECTION}
      aria-labelledby="agency-work-heading"
    >
      <div className={HOME_AGENCY_SHELL}>
        <div className="mb-6 flex flex-col gap-3.5 sm:mb-7 md:mb-8 md:flex-row md:items-end md:justify-between">
          <div className={HOME_AGENCY_INTRO}>
            <SectionEyebrow label={workPreview.eyebrow} />
            <h2 id="agency-work-heading" className="section-title text-left">
              {workPreview.title}
            </h2>
            <p className="text-body max-w-xl text-[0.95rem] leading-relaxed text-white/68 sm:text-base">
              {workPreview.subtitle}
            </p>
          </div>
          <SecondaryButton
            onClick={() => navigateAppPath("/work")}
            className="w-full shrink-0 text-sm sm:w-auto"
          >
            <span className="inline-flex items-center gap-2">
              {workPreview.cta}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </span>
          </SecondaryButton>
        </div>

        <ul className="m-0 grid list-none grid-cols-1 gap-4 p-0 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <li key={project.slug}>
              <WorkProjectCard project={project} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
