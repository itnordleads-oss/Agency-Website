import React, { useEffect, useMemo, useState } from "react";
import SectionEyebrow from "./SectionEyebrow";
import BackToHomepage from "./BackToHomepage";
import ProjectCard from "./projects/ProjectCard";
import ProjectsFinalCta from "./projects/ProjectsFinalCta";
import {
  getProjectCategoryLabel,
  getPublishedProjectCategories,
  getPublishedProjects,
} from "../lib/agencyProjects";
import { getAgencyPageSeo } from "../lib/agencyPageSeo";
import { applyPageMetadata } from "../lib/pageMetadata";
import type { AgencyProjectCategory } from "../content/agencyProjects";

type FilterId = "all" | AgencyProjectCategory;

/**
 * Public Projects / Portfolio index at `/projects`.
 *
 * Always renders as its own page. When no approved projects exist yet,
 * shows a clear empty state (no fake portfolio items).
 * Filters render only when multiple categories are represented in real data.
 */
export default function ProjectsPage() {
  const projects = useMemo(() => getPublishedProjects(), []);
  const categories = useMemo(() => getPublishedProjectCategories(), []);
  const showFilters = categories.length > 1;
  const [filter, setFilter] = useState<FilterId>("all");

  useEffect(() => {
    const seo = getAgencyPageSeo("projects");
    const restore = applyPageMetadata({
      title: seo.title,
      description: seo.description,
      pathname: seo.pathname,
    });
    window.scrollTo({ top: 0, behavior: "auto" });
    return restore;
  }, []);

  const visibleProjects =
    filter === "all" ? projects : projects.filter((project) => project.category === filter);

  return (
    <main className="min-w-0 flex-grow overflow-x-hidden" id="projects-page" aria-labelledby="projects-hero-title">
      <section className="relative mx-auto max-w-7xl px-3 pt-10 min-[341px]:px-4 sm:px-6 sm:pt-14 pb-8 md:pb-12">
        <BackToHomepage label="Back to homepage" />

        <div className="liquid-glass relative overflow-hidden rounded-2xl border border-white/14 bg-white/[0.04] px-4 py-8 max-[340px]:px-3 max-[340px]:py-7 min-[341px]:px-5 sm:rounded-3xl sm:px-8 sm:py-10 md:px-10 md:py-12">
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(700px circle at 15% -10%, rgba(61,129,227,0.18), transparent 55%), radial-gradient(520px circle at 90% 100%, rgba(0,210,255,0.08), transparent 50%)",
            }}
          />
          <div className="relative z-10 mx-auto max-w-3xl space-y-4 text-center sm:space-y-5">
            <div className="flex justify-center">
              <SectionEyebrow label="PROJECTS" />
            </div>
            <h1 id="projects-hero-title" className="hero-title text-white">
              Work built around real product and business requirements
            </h1>
            <p className="text-body mx-auto max-w-2xl text-sm leading-relaxed text-white/70 sm:text-base md:text-lg">
              Selected software, website, mobile, Shopify, and WordPress projects we are cleared to
              share. Every item comes from approved client or leadership material.
            </p>
          </div>
        </div>
      </section>

      <section
        className="relative mx-auto max-w-7xl px-3 pb-12 min-[341px]:px-4 sm:px-6 md:pb-16"
        aria-label="Project portfolio"
      >
        {showFilters ? (
          <div
            className="mb-6 flex flex-wrap gap-2 sm:mb-8"
            role="group"
            aria-label="Filter projects by category"
          >
            <FilterChip
              label="All"
              active={filter === "all"}
              onClick={() => setFilter("all")}
            />
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

        {visibleProjects.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 md:gap-7">
            {visibleProjects.map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-white/[0.1] bg-white/[0.02] px-5 py-12 text-center sm:px-8 sm:py-16">
            <h2 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
              Projects coming soon
            </h2>
            <p className="text-body mx-auto mt-3 max-w-lg text-sm leading-relaxed text-white/65 sm:text-base">
              Approved case studies will appear here once leadership clears them for publication. We
              do not list sample or placeholder work.
            </p>
          </div>
        )}
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
      className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wide transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00D2FF] ${
        active
          ? "border-[#00D2FF]/40 bg-[#00D2FF]/12 text-[#A4F4FD]"
          : "border-white/14 bg-white/[0.03] text-white/65 hover:border-white/25 hover:text-white"
      }`}
    >
      {label}
    </button>
  );
}
