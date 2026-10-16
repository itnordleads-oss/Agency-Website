import React, { useEffect } from "react";
import { ArrowUpRight, ChevronRight } from "lucide-react";
import SectionEyebrow from "./SectionEyebrow";
import ProjectGallery from "./projects/ProjectGallery";
import ProjectVisual from "./projects/ProjectVisual";
import ProjectsFinalCta from "./projects/ProjectsFinalCta";
import RelatedProjects from "./projects/RelatedProjects";
import { PrimaryButton, SecondaryButton } from "./Buttons";
import { navigateAppPath, navigateToContact } from "../App";
import "./projects/projectCard.css";
import "./projects/projectDetail.css";
import {
  getProjectCategoryLabel,
  getProjectDeliverables,
  getPublishedProjectBySlug,
  getRelatedProjects,
} from "../lib/agencyProjects";
import { applyPageMetadata } from "../lib/pageMetadata";
import { getSeoSiteName } from "../lib/studioBranding";

type ProjectDetailPageProps = {
  slug: string;
};

/**
 * Shared premium project detail / concept case-study template.
 * All six routes render through this single architecture.
 */
export default function ProjectDetailPage({ slug }: ProjectDetailPageProps) {
  const project = getPublishedProjectBySlug(slug);

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
  const categoryLabel = getProjectCategoryLabel(project.category);
  const deliverables = getProjectDeliverables(project);
  const goalTitle = project.isDemo ? "Project Goal" : "Challenge";
  const directionTitle = project.isDemo ? "Concept Direction" : "Solution";
  const outcomeTitle = project.isDemo ? "What This Demonstrates" : "Outcome";
  const serviceLine = [categoryLabel, project.services?.[0]].filter(Boolean).join(" / ");
  const overviewRows: Array<{ label: string; value: string }> = [
    project.projectType ? { label: "Project Type", value: project.projectType } : null,
    project.services && project.services.length > 0
      ? { label: "Primary Service", value: project.services.join(", ") }
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

  return (
    <main
      className="project-detail min-w-0 flex-grow overflow-x-hidden"
      id="project-detail-page"
      aria-labelledby="project-detail-title"
    >
      <div className="project-detail__shell mx-auto max-w-7xl px-3 pt-9 min-[341px]:px-4 sm:px-6 sm:pt-12">
        <nav aria-label="Breadcrumb" className="project-detail__reveal mb-5 sm:mb-6">
          <ol className="flex flex-wrap items-center gap-1.5 text-sm text-white/50">
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
            <li className="font-medium text-white/75" aria-current="page">
              {project.title}
            </li>
          </ol>
        </nav>
      </div>

      <section
        className="project-detail__hero relative mx-auto max-w-7xl px-3 pb-10 min-[341px]:px-4 sm:px-6 md:pb-12 lg:max-w-[84rem]"
        aria-labelledby="project-detail-title"
      >
        <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-14">
          <div className="project-detail__reveal project-detail__reveal--1 min-w-0 space-y-3.5 sm:space-y-4">
            <SectionEyebrow label={project.isDemo ? "CONCEPT PROJECT" : "PROJECT / CASE STUDY"} />
            <h1 id="project-detail-title" className="hero-title text-white">
              {project.title}
            </h1>
            <p className="project-detail__prose text-body text-base leading-relaxed text-white/72 sm:text-lg">
              {project.shortDescription}
            </p>
            {serviceLine ? (
              <p className="text-sm font-medium text-white/48">{serviceLine}</p>
            ) : null}
            <div className="flex flex-wrap gap-3 pt-1">
              <SecondaryButton onClick={() => navigateAppPath("/projects")}>
                Back to Projects
              </SecondaryButton>
              {project.projectUrl ? (
                <a
                  href={project.projectUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 self-center text-sm font-semibold text-[#A4F4FD] transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00D2FF]"
                >
                  View Demo
                  <ArrowUpRight className="h-4 w-4" aria-hidden />
                </a>
              ) : null}
            </div>
          </div>

          <div className="project-detail__reveal project-detail__reveal--2 project-detail__hero-visual">
            <div className="project-detail__hero-frame">
              {project.heroImage || project.thumbnail ? (
                <img
                  src={project.heroImage || project.thumbnail}
                  alt={project.thumbnailAlt || `${project.title} preview`}
                  className="project-detail__hero-media"
                />
              ) : (
                <ProjectVisual
                  motif={project.visualMotif}
                  variant={1}
                  density="rich"
                  className="h-full min-h-[16rem] lg:min-h-[22rem]"
                />
              )}
            </div>
          </div>
        </div>
      </section>

      {overviewRows.length > 0 ? (
        <section
          className="project-detail__section project-detail__band relative mx-auto max-w-7xl px-3 pb-10 min-[341px]:px-4 sm:px-6 md:pb-12"
          aria-labelledby="project-overview-heading"
        >
          <h2 id="project-overview-heading" className="section-title mb-5 text-left md:mb-6">
            Project Overview
          </h2>
          <dl className="project-detail__overview">
            {overviewRows.map((row) => (
              <div key={row.label} className="project-detail__overview-item">
                <dt>{row.label}</dt>
                <dd>{row.value}</dd>
              </div>
            ))}
          </dl>
        </section>
      ) : null}

      {project.challenge ? (
        <DetailSection id="goal" title={goalTitle}>
          <p className="project-detail__prose text-body text-sm leading-relaxed text-white/70 sm:text-base">
            {project.challenge}
          </p>
        </DetailSection>
      ) : null}

      {project.solution ? (
        <DetailSection id="solution" title={directionTitle}>
          <p className="project-detail__prose text-body text-sm leading-relaxed text-white/70 sm:text-base">
            {project.solution}
          </p>
        </DetailSection>
      ) : null}

      {deliverables.length > 0 ? (
        <DetailSection id="what-we-built" title="What We Built">
          <ol className="project-detail__built-list">
            {deliverables.map((item, index) => (
              <li key={item}>
                <span className="project-detail__built-index" aria-hidden>
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ol>
        </DetailSection>
      ) : null}

      <ProjectGallery project={project} />

      {project.technologies && project.technologies.length > 0 ? (
        <DetailSection id="technologies" title="Technologies / Platform">
          <ul className="flex flex-wrap gap-2">
            {project.technologies.map((tech) => (
              <li key={tech} className="project-card__tech-tag">
                {tech}
              </li>
            ))}
          </ul>
        </DetailSection>
      ) : null}

      {project.outcome ? (
        <DetailSection id="outcome" title={outcomeTitle}>
          <p className="project-detail__prose text-body text-sm leading-relaxed text-white/70 sm:text-base">
            {project.outcome}
          </p>
        </DetailSection>
      ) : null}

      <RelatedProjects projects={related} />
      <ProjectsFinalCta />
    </main>
  );
}

function DetailSection({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  const headingId = `project-${id}-heading`;
  return (
    <section
      className="project-detail__section project-detail__band relative mx-auto max-w-7xl px-3 pb-10 min-[341px]:px-4 sm:px-6 md:pb-12 lg:max-w-[84rem]"
      aria-labelledby={headingId}
    >
      <h2 id={headingId} className="section-title mb-4 text-left md:mb-5">
        {title}
      </h2>
      {children}
    </section>
  );
}
