import React, { useEffect, useRef, useState } from "react";
import { ChevronRight } from "lucide-react";
import ProjectBuildFeatures from "./projects/ProjectBuildFeatures";
import ProjectDetailHero from "./projects/ProjectDetailHero";
import ProjectGallery from "./projects/ProjectGallery";
import ProjectsFinalCta from "./projects/ProjectsFinalCta";
import RelatedProjects from "./projects/RelatedProjects";
import { PrimaryButton, SecondaryButton } from "./Buttons";
import { navigateAppPath, navigateToContact } from "../App";
import "./projects/projectCard.css";
import "./projects/projectDetail.css";
import {
  getProjectDeliverables,
  getPublishedProjectBySlug,
  getRelatedProjects,
} from "../lib/agencyProjects";
import { applyPageMetadata } from "../lib/pageMetadata";
import { getSeoSiteName } from "../lib/studioBranding";

type ProjectDetailPageProps = {
  slug: string;
};

function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/**
 * Shared premium project detail / concept case-study template.
 * All six routes render through this single architecture.
 */
export default function ProjectDetailPage({ slug }: ProjectDetailPageProps) {
  const project = getPublishedProjectBySlug(slug);
  const pageRef = useRef<HTMLElement | null>(null);
  const [activeDirectionStep, setActiveDirectionStep] = useState(0);
  const [activeSignal, setActiveSignal] = useState(0);

  useEffect(() => {
    if (!project) {
      window.scrollTo({ top: 0, behavior: "auto" });
      return;
    }

    const siteName = getSeoSiteName();
    const description = project.isDemo
      ? `${project.title} — portfolio concept project. ${project.shortDescription}`
      : project.shortDescription || project.overview;
    const title = project.isDemo
      ? `${project.title} — Concept Project | ${siteName}`
      : `${project.title} | ${siteName}`;
    const restore = applyPageMetadata({
      title,
      description,
      pathname: `/projects/${project.slug}`,
    });
    window.scrollTo({ top: 0, behavior: "auto" });
    return restore;
  }, [project]);

  useEffect(() => {
    setActiveDirectionStep(0);
    setActiveSignal(0);
  }, [slug]);

  useEffect(() => {
    const root = pageRef.current;
    if (!root || prefersReducedMotion()) {
      return;
    }

    const bands = Array.from(root.querySelectorAll<HTMLElement>(".project-detail__reveal-band"));
    if (bands.length === 0) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) {
            continue;
          }
          const target = entry.target as HTMLElement;
          target.classList.add("is-entering");
          observer.unobserve(target);
          window.setTimeout(() => {
            target.classList.remove("is-entering");
          }, 560);
        }
      },
      { threshold: 0.16 }
    );

    for (const band of bands) {
      observer.observe(band);
    }

    return () => observer.disconnect();
  }, [slug]);

  if (!project) {
    return (
      <main
        className="min-w-0 flex-grow overflow-x-hidden"
        id="project-not-found"
        aria-labelledby="project-not-found-title"
      >
        <div className="mx-auto max-w-7xl px-3 py-16 min-[341px]:px-4 sm:px-6 sm:py-24 text-center">
          <h1 id="project-not-found-title" className="section-title">
            Project not found
          </h1>
          <p className="text-body mx-auto mt-4 max-w-md text-sm text-white/65 sm:text-base">
            This project is not available, or the link may be incorrect.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <PrimaryButton onClick={() => navigateAppPath("/projects")}>
              Back to Projects
            </PrimaryButton>
            <SecondaryButton onClick={navigateToContact}>Contact</SecondaryButton>
          </div>
        </div>
      </main>
    );
  }

  const related = getRelatedProjects(project.slug, 3);
  const deliverables = getProjectDeliverables(project);
  const goalTitle = project.isDemo ? "Project Goal" : "Challenge";
  const directionTitle = project.isDemo ? "Concept Direction" : "Solution";
  const outcomeTitle = project.isDemo ? "What This Demonstrates" : "Outcome";

  const overviewRows: Array<{ label: string; value: string }> = [
    project.projectType ? { label: "Project Type", value: project.projectType } : null,
    project.services && project.services.length > 0
      ? { label: "Primary Service", value: project.services.join(" / ") }
      : null,
    project.platform ? { label: "Platform", value: project.platform } : null,
    project.technologies && project.technologies.length > 0
      ? { label: "Technologies", value: project.technologies.join(", ") }
      : null,
    project.isDemo
      ? { label: "Status", value: "Concept Project" }
      : project.status
        ? { label: "Status", value: project.status }
        : null,
  ].filter((row): row is { label: string; value: string } => row !== null);

  const techPlatform = project.platform ?? null;
  const techList = project.technologies ?? [];

  return (
    <main
      key={project.slug}
      ref={pageRef}
      className="project-detail min-w-0 flex-grow overflow-x-hidden"
      id="project-detail-page"
      aria-labelledby="project-detail-title"
    >
      <div className="project-detail__shell mx-auto max-w-7xl px-3 pt-8 min-[341px]:px-4 sm:px-6 sm:pt-10">
        <nav
          aria-label="Breadcrumb"
          className="project-detail__enter project-detail__enter--crumb mb-5 sm:mb-6"
        >
          <ol className="flex flex-wrap items-center gap-1.5 text-sm text-white/55">
            <li>
              <a
                href="/projects"
                onClick={(event) => {
                  event.preventDefault();
                  navigateAppPath("/projects");
                }}
                className="transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00D2FF]"
              >
                Projects
              </a>
            </li>
            <li aria-hidden className="text-white/25">
              <ChevronRight className="h-3.5 w-3.5" />
            </li>
            <li className="font-medium text-white/78" aria-current="page">
              {project.title}
            </li>
          </ol>
        </nav>
      </div>

      <ProjectDetailHero project={project} />

      {overviewRows.length > 0 ? (
        <section
          className="project-detail__section project-detail__reveal-band relative mx-auto max-w-7xl px-3 min-[341px]:px-4 sm:px-6 lg:max-w-[84rem]"
          aria-labelledby="project-overview-heading"
        >
          <h2
            id="project-overview-heading"
            className="project-detail__h2 project-detail__overview-heading mb-5 text-left md:mb-6"
          >
            Project Overview
          </h2>
          <dl className="project-detail__overview">
            {overviewRows.map((row, index) => (
              <div
                key={row.label}
                className="project-detail__overview-item"
                style={{ ["--overview-index" as string]: String(index) }}
              >
                <dt>{row.label}</dt>
                <dd>{row.value}</dd>
              </div>
            ))}
          </dl>
        </section>
      ) : null}

      {project.challenge || project.solution ? (
        <section
          className="project-detail__section project-detail__reveal-band relative mx-auto max-w-7xl px-3 min-[341px]:px-4 sm:px-6 lg:max-w-[84rem]"
          aria-labelledby="project-goal-heading"
        >
          <div className="project-detail__narrative">
            {project.challenge ? (
              <div className="project-detail__narrative-col project-detail__narrative-col--goal">
                <h2 id="project-goal-heading" className="project-detail__h2">
                  {goalTitle}
                </h2>
                <p className="project-detail__prose text-body text-[0.9375rem] leading-relaxed text-white/74 sm:text-base">
                  {project.challenge}
                </p>
              </div>
            ) : null}

            {project.solution ? (
              <div className="project-detail__narrative-col project-detail__narrative-col--direction">
                <h2 id="project-solution-heading" className="project-detail__h2">
                  {directionTitle}
                </h2>
                <p className="project-detail__prose text-body text-[0.9375rem] leading-relaxed text-white/74 sm:text-base">
                  {project.solution}
                </p>
                {project.directionSteps && project.directionSteps.length > 0 ? (
                  <ol
                    className="project-detail__direction-flow"
                    aria-label="Concept direction flow"
                  >
                    {project.directionSteps.map((step, index) => (
                      <li key={step}>
                        <button
                          type="button"
                          className={`project-detail__direction-chip${
                            activeDirectionStep === index
                              ? " project-detail__direction-chip--active"
                              : ""
                          }`}
                          aria-pressed={activeDirectionStep === index}
                          onClick={() => setActiveDirectionStep(index)}
                          onFocus={() => setActiveDirectionStep(index)}
                          onMouseEnter={() => {
                            if (
                              typeof window !== "undefined" &&
                              typeof window.matchMedia === "function" &&
                              window.matchMedia("(hover: hover) and (pointer: fine)").matches
                            ) {
                              setActiveDirectionStep(index);
                            }
                          }}
                        >
                          {step}
                        </button>
                        {index < project.directionSteps!.length - 1 ? (
                          <span className="project-detail__direction-arrow" aria-hidden>
                            →
                          </span>
                        ) : null}
                      </li>
                    ))}
                  </ol>
                ) : null}
              </div>
            ) : null}
          </div>
        </section>
      ) : null}

      {deliverables.length > 0 ? (
        <section
          className="project-detail__section project-detail__reveal-band relative mx-auto max-w-7xl px-3 min-[341px]:px-4 sm:px-6 lg:max-w-[84rem]"
          aria-labelledby="project-what-we-built-heading"
        >
          <h2
            id="project-what-we-built-heading"
            className="project-detail__h2 mb-5 text-left md:mb-6"
          >
            What We Built
          </h2>
          <ProjectBuildFeatures key={project.slug} project={project} items={deliverables} />
        </section>
      ) : null}

      <ProjectGallery key={`${project.slug}-gallery`} project={project} />

      {techList.length > 0 || techPlatform ? (
        <section
          className="project-detail__section project-detail__reveal-band relative mx-auto max-w-7xl px-3 min-[341px]:px-4 sm:px-6 lg:max-w-[84rem]"
          aria-labelledby="project-technologies-heading"
        >
          <h2
            id="project-technologies-heading"
            className="project-detail__h2 mb-5 text-left md:mb-6"
          >
            Technologies / Platform
          </h2>
          <div className="project-detail__tech">
            {techPlatform ? (
              <div className="project-detail__tech-block">
                <h3 className="project-detail__h3">Platform</h3>
                <p className="project-detail__tech-platform">{techPlatform}</p>
              </div>
            ) : null}
            {techList.length > 0 ? (
              <div className="project-detail__tech-block">
                <h3 className="project-detail__h3">Technologies</h3>
                <ul className="project-detail__tech-list">
                  {techList.map((tech, index) => (
                    <li
                      key={tech}
                      className="project-detail__tech-badge"
                      style={{ ["--tech-index" as string]: String(index) }}
                      tabIndex={0}
                    >
                      {tech}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        </section>
      ) : null}

      {project.outcome ? (
        <section
          className="project-detail__section project-detail__reveal-band relative mx-auto max-w-7xl px-3 min-[341px]:px-4 sm:px-6 lg:max-w-[84rem]"
          aria-labelledby="project-outcome-heading"
        >
          <h2 id="project-outcome-heading" className="project-detail__h2 mb-4 text-left md:mb-5">
            {outcomeTitle}
          </h2>
          <p className="project-detail__prose text-body text-[0.9375rem] leading-relaxed text-white/74 sm:text-base">
            {project.outcome}
          </p>
          {project.demonstrateSignals && project.demonstrateSignals.length > 0 ? (
            <ul className="project-detail__signals" aria-label="Capability signals">
              {project.demonstrateSignals.map((signal, index) => (
                <li key={signal}>
                  <button
                    type="button"
                    className={`project-detail__signal${
                      activeSignal === index ? " project-detail__signal--active" : ""
                    }`}
                    style={{ ["--signal-index" as string]: String(index) }}
                    aria-pressed={activeSignal === index}
                    onClick={() => setActiveSignal(index)}
                    onFocus={() => setActiveSignal(index)}
                    onMouseEnter={() => {
                      if (
                        typeof window !== "undefined" &&
                        typeof window.matchMedia === "function" &&
                        window.matchMedia("(hover: hover) and (pointer: fine)").matches
                      ) {
                        setActiveSignal(index);
                      }
                    }}
                  >
                    <span className="project-detail__signal-marker" aria-hidden />
                    <span className="project-detail__signal-label">{signal}</span>
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
        </section>
      ) : null}

      <div className="project-detail__reveal-band">
        <RelatedProjects projects={related} />
      </div>
      <div className="project-detail__reveal-band">
        <ProjectsFinalCta />
      </div>
    </main>
  );
}
