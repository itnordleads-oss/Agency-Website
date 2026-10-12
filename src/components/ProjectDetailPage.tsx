import React, { useEffect } from "react";
import { ArrowUpRight, ChevronRight } from "lucide-react";
import SectionEyebrow from "./SectionEyebrow";
import ProjectsFinalCta from "./projects/ProjectsFinalCta";
import RelatedProjects from "./projects/RelatedProjects";
import { PrimaryButton, SecondaryButton } from "./Buttons";
import { navigateAppPath, navigateToContact } from "../App";
import {
  getProjectCategoryLabel,
  getPublishedProjectBySlug,
  getRelatedProjects,
} from "../lib/agencyProjects";
import { applyPageMetadata } from "../lib/pageMetadata";
import { getSeoSiteName } from "../lib/studioBranding";

type ProjectDetailPageProps = {
  slug: string;
};

/**
 * Project case-study detail at `/projects/:slug`.
 * Optional sections render only when real data is present.
 */
export default function ProjectDetailPage({ slug }: ProjectDetailPageProps) {
  const project = getPublishedProjectBySlug(slug);

  useEffect(() => {
    if (!project) {
      window.scrollTo({ top: 0, behavior: "auto" });
      return;
    }

    const siteName = getSeoSiteName();
    const restore = applyPageMetadata({
      title: `${project.title} | ${siteName}`,
      description: project.shortDescription || project.summary,
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
  const overviewRows: Array<{ label: string; value: string }> = [
    project.projectType ? { label: "Project Type", value: project.projectType } : null,
    project.services && project.services.length > 0
      ? { label: "Services", value: project.services.join(", ") }
      : null,
    project.platform ? { label: "Platform", value: project.platform } : null,
    project.technologies && project.technologies.length > 0
      ? { label: "Technology", value: project.technologies.join(", ") }
      : null,
    project.status ? { label: "Status", value: project.status } : null,
  ].filter((row): row is { label: string; value: string } => row !== null);

  return (
    <main
      className="min-w-0 flex-grow overflow-x-hidden"
      id="project-detail-page"
      aria-labelledby="project-detail-title"
    >
      <div className="mx-auto max-w-7xl px-3 pt-10 min-[341px]:px-4 sm:px-6 sm:pt-14">
        <nav aria-label="Breadcrumb" className="mb-6 sm:mb-8">
          <ol className="flex flex-wrap items-center gap-1.5 text-sm text-white/55">
            <li>
              <button
                type="button"
                onClick={() => navigateAppPath("/")}
                className="transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00D2FF]"
              >
                Home
              </button>
            </li>
            <li aria-hidden className="text-white/25">
              <ChevronRight className="h-3.5 w-3.5" />
            </li>
            <li>
              <button
                type="button"
                onClick={() => navigateAppPath("/projects")}
                className="transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00D2FF]"
              >
                Projects
              </button>
            </li>
            <li aria-hidden className="text-white/25">
              <ChevronRight className="h-3.5 w-3.5" />
            </li>
            <li className="font-medium text-white/80" aria-current="page">
              {project.title}
            </li>
          </ol>
        </nav>
      </div>

      <section className="relative mx-auto max-w-7xl px-3 pb-10 min-[341px]:px-4 sm:px-6 md:pb-14">
        <div className="grid items-start gap-8 lg:grid-cols-2 lg:gap-12">
          <div className="min-w-0 space-y-4 sm:space-y-5">
            <SectionEyebrow label="PROJECT / CASE STUDY" tag={categoryLabel} />
            <h1 id="project-detail-title" className="hero-title text-white">
              {project.title}
            </h1>
            <p className="text-body max-w-xl text-sm leading-relaxed text-white/70 sm:text-base md:text-lg">
              {project.summary}
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="status-pill">{categoryLabel}</span>
              {project.services?.map((service) => (
                <span key={service} className="status-pill">
                  {service}
                </span>
              ))}
            </div>
            {project.projectUrl ? (
              <div className="pt-1">
                <a
                  href={project.projectUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-[#A4F4FD] transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00D2FF]"
                >
                  Visit live project
                  <ArrowUpRight className="h-4 w-4" aria-hidden />
                </a>
              </div>
            ) : null}
          </div>

          <div className="overflow-hidden rounded-2xl border border-white/[0.1] bg-gradient-to-br from-[#12203a] via-[#0C111B] to-[#0a1628] sm:rounded-3xl">
            {project.thumbnail ? (
              <img
                src={project.thumbnail}
                alt={project.thumbnailAlt || `${project.title} preview`}
                className="aspect-[16/10] w-full object-cover object-top"
              />
            ) : (
              <div
                className="flex aspect-[16/10] items-end p-6"
                aria-hidden
                style={{
                  backgroundImage:
                    "radial-gradient(480px circle at 20% 0%, rgba(0,210,255,0.16), transparent 55%), radial-gradient(420px circle at 90% 80%, rgba(61,129,227,0.14), transparent 50%)",
                }}
              >
                <span className="text-xs font-semibold uppercase tracking-[0.14em] text-white/35">
                  {categoryLabel}
                </span>
              </div>
            )}
          </div>
        </div>
      </section>

      {overviewRows.length > 0 ? (
        <section
          className="relative mx-auto max-w-7xl px-3 pb-10 min-[341px]:px-4 sm:px-6 md:pb-14"
          aria-labelledby="project-overview-heading"
        >
          <h2 id="project-overview-heading" className="section-title mb-5 text-left md:mb-6">
            Overview
          </h2>
          <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {overviewRows.map((row) => (
              <div
                key={row.label}
                className="rounded-xl border border-white/[0.08] bg-white/[0.02] px-4 py-3.5"
              >
                <dt className="text-xs font-semibold uppercase tracking-wide text-white/45">
                  {row.label}
                </dt>
                <dd className="mt-1.5 text-sm leading-relaxed text-white/80">{row.value}</dd>
              </div>
            ))}
          </dl>
        </section>
      ) : null}

      {project.challenge ? (
        <DetailSection id="challenge" title="Challenge">
          <p className="text-body text-sm leading-relaxed text-white/70 sm:text-base">
            {project.challenge}
          </p>
        </DetailSection>
      ) : null}

      {project.solution ? (
        <DetailSection id="solution" title="Solution">
          <p className="text-body text-sm leading-relaxed text-white/70 sm:text-base">
            {project.solution}
          </p>
        </DetailSection>
      ) : null}

      {project.whatWeBuilt && project.whatWeBuilt.length > 0 ? (
        <DetailSection id="what-we-built" title="What We Built">
          <ul className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            {project.whatWeBuilt.map((item) => (
              <li
                key={item}
                className="rounded-xl border border-white/[0.08] bg-white/[0.02] px-4 py-3 text-sm text-white/75"
              >
                {item}
              </li>
            ))}
          </ul>
        </DetailSection>
      ) : null}

      {project.technologies && project.technologies.length > 0 ? (
        <DetailSection id="technologies" title="Technologies">
          <ul className="flex flex-wrap gap-2">
            {project.technologies.map((tech) => (
              <li key={tech} className="status-pill">
                {tech}
              </li>
            ))}
          </ul>
        </DetailSection>
      ) : null}

      {project.gallery && project.gallery.length > 0 ? (
        <DetailSection id="gallery" title="Screenshots">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {project.gallery.map((item) => (
              <figure
                key={item.src}
                className="overflow-hidden rounded-xl border border-white/[0.1] bg-black/30"
              >
                <img
                  src={item.src}
                  alt={item.alt}
                  className="aspect-[16/10] w-full object-cover object-top"
                  loading="lazy"
                />
              </figure>
            ))}
          </div>
        </DetailSection>
      ) : null}

      {project.outcome ? (
        <DetailSection id="outcome" title="Outcome">
          <p className="text-body text-sm leading-relaxed text-white/70 sm:text-base">
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
      className="relative mx-auto max-w-7xl px-3 pb-10 min-[341px]:px-4 sm:px-6 md:pb-14"
      aria-labelledby={headingId}
    >
      <h2 id={headingId} className="section-title mb-4 text-left md:mb-5">
        {title}
      </h2>
      {children}
    </section>
  );
}
