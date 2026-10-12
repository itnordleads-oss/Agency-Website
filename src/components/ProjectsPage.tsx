import React, { useEffect, useMemo, useState } from "react";
import SectionEyebrow from "./SectionEyebrow";
import FeaturedProjects from "./projects/FeaturedProjects";
import ProjectCard from "./projects/ProjectCard";
import ProjectsFinalCta from "./projects/ProjectsFinalCta";
import ProjectsHero from "./projects/ProjectsHero";
import {
  getFeaturedProjects,
  getProjectCategoryLabel,
  getPublishedProjectCategories,
  getPublishedProjects,
} from "../lib/agencyProjects";
import { getAgencyPageSeo } from "../lib/agencyPageSeo";
import { applyPageMetadata } from "../lib/pageMetadata";
import type { AgencyProjectCategory } from "../content/agencyProjects";
import "./projects/projectsPage.css";

type FilterId = "all" | AgencyProjectCategory;

/**
 * Public Projects / Portfolio index at `/projects`.
 */
export default function ProjectsPage() {
  const projects = useMemo(() => getPublishedProjects(), []);
  const featured = useMemo(() => getFeaturedProjects(3), []);
  const categories = useMemo(() => getPublishedProjectCategories(), []);
  const showFilters = categories.length > 1;
  const [filter, setFilter] = useState<FilterId>("all");

  useEffect(() => {
    const seo = getAgencyPageSeo("projects");
    const restore = applyPageMetadata({
      title: seo.title,
      description: seo.description,
      pathname: seo.pathname,
      robots: "index, follow, max-image-preview:large",
    });
    window.scrollTo({ top: 0, behavior: "auto" });
    return restore;
  }, []);

  const visibleProjects =
    filter === "all" ? projects : projects.filter((project) => project.category === filter);

  return (
    <main
      className="min-w-0 flex-grow overflow-x-hidden"
      id="projects-page"
      aria-labelledby="projects-hero-title"
    >
      <ProjectsHero />

      {filter === "all" && featured.length > 0 ? <FeaturedProjects projects={featured} /> : null}

      <section
        className="relative mx-auto max-w-7xl px-3 pb-8 min-[341px]:px-4 sm:px-6 md:pb-11"
        aria-labelledby="all-projects-heading"
      >
        <div className="mb-6 flex flex-col gap-3 md:mb-7 md:flex-row md:items-end md:justify-between md:gap-6">
          <div className="space-y-2">
            <h2 id="all-projects-heading" className="section-title text-left">
              All projects
            </h2>
            <p className="text-body max-w-2xl text-sm text-white/65 sm:text-base">
              Browse concept work across software, web, mobile, Shopify, and WordPress.
            </p>
          </div>

          {showFilters ? (
            <div
              className="flex max-w-full flex-wrap gap-2 md:max-w-xl md:justify-end"
              role="group"
              aria-label="Filter projects by category"
            >
              <FilterChip label="All" active={filter === "all"} onClick={() => setFilter("all")} />
              {categories.map((category) => (
                <FilterChip
                  key={category}
                  label={getProjectCategoryLabel(category)}
                  active={filter === category}
                  onClick={() => setFilter(category)}
                />
              ))}
            </div>
          ) : null}
        </div>

        {visibleProjects.length > 0 ? (
          <div
            key={filter}
            className="projects-grid-enter grid grid-cols-1 items-stretch gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3 xl:gap-5"
          >
            {visibleProjects.map((project, index) => (
              <ProjectCard key={`${filter}-${project.slug}`} project={project} enterIndex={index} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-white/55">No projects match this filter.</p>
        )}
      </section>

      <section
        className="relative mx-auto max-w-7xl px-3 pb-6 min-[341px]:px-4 sm:px-6 md:pb-8"
        aria-labelledby="projects-approach-heading"
      >
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] px-5 py-4 sm:px-6 sm:py-5">
          <div className="mb-2">
            <SectionEyebrow label="PROJECT APPROACH" />
          </div>
          <h2
            id="projects-approach-heading"
            className="section-title text-left text-[1.35rem] sm:text-[1.5rem]"
          >
            From idea to a product people can use
          </h2>
          <p className="text-body mt-2 max-w-2xl text-sm leading-relaxed text-white/65 sm:text-base">
            We shape software, web, mobile, commerce, and content experiences around the
            requirements of each project.
          </p>
        </div>
      </section>

      <ProjectsFinalCta />
    </main>
  );
}

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-full border px-3 py-1.5 text-xs font-semibold uppercase tracking-wide transition-[color,background-color,border-color,box-shadow] duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00D2FF] ${
        active
          ? "border-[#00D2FF]/45 bg-[#00D2FF]/14 text-[#A4F4FD] shadow-[0_0_0_1px_rgba(0,210,255,0.12)]"
          : "border-white/14 bg-white/[0.03] text-white/65 hover:border-white/28 hover:bg-white/[0.05] hover:text-white"
      }`}
    >
      {label}
    </button>
  );
}
