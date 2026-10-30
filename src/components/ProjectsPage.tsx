import React, { useEffect, useMemo, useRef, useState } from "react";
import SectionEyebrow from "./SectionEyebrow";
import ProjectCard from "./projects/ProjectCard";
import ProjectsFinalCta from "./projects/ProjectsFinalCta";
import ProjectsHero from "./projects/ProjectsHero";
import {
  getInteractiveDemoProjects,
  getPublishedProjectCategories,
  getPublishedProjects,
} from "../lib/agencyProjects";
import { getAgencyPageSeo } from "../lib/agencyPageSeo";
import { applyPageMetadata } from "../lib/pageMetadata";
import { useSiteCopy } from "../lib/useSiteCopy";
import type { AgencyProjectCategory } from "../content/agencyProjects";
import "./projects/projectsPage.css";
import "./projects/projectsApproach.css";
import "./projects/projectsType.css";

type FilterId = "all" | AgencyProjectCategory;

/**
 * Public Projects / Portfolio index at `/projects`.
 * One grid derived from AGENCY_PROJECTS — no featured duplicate strip.
 */
export default function ProjectsPage() {
  const { projectsPage, t } = useSiteCopy();
  const projects = useMemo(() => getPublishedProjects(), []);
  const interactiveDemos = useMemo(() => getInteractiveDemoProjects(), []);
  const categories = useMemo(() => getPublishedProjectCategories(), []);
  const showFilters = categories.length > 1 && projects.length > 6;
  const [filter, setFilter] = useState<FilterId>("all");
  const approachRef = useRef<HTMLElement | null>(null);
  const [approachVisible, setApproachVisible] = useState(false);

  const categoryLabel = (category: AgencyProjectCategory) => {
    const labels = projectsPage.categories as Record<string, string>;
    return labels[category] || category;
  };

  useEffect(() => {
    const seo = getAgencyPageSeo("projects");
    const restore = applyPageMetadata({
      title: seo.title,
      description: seo.description,
      pathname: seo.pathname,
      ogDescription: seo.ogDescription,
      twitterDescription: seo.twitterDescription,
      robots: "index, follow, max-image-preview:large",
    });
    window.scrollTo({ top: 0, behavior: "auto" });
    return restore;
  }, []);

  useEffect(() => {
    const node = approachRef.current;
    if (!node) {
      return;
    }

    const reduced =
      typeof window !== "undefined" &&
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced) {
      setApproachVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setApproachVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.28, rootMargin: "0px 0px -8% 0px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const reduced =
      typeof window !== "undefined" &&
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      return;
    }

    const sections = Array.from(
      document.querySelectorAll<HTMLElement>("#projects-page .projects-section-reveal")
    );
    if (sections.length === 0) {
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
          }, 520);
        }
      },
      { threshold: 0.18 }
    );

    for (const section of sections) {
      observer.observe(section);
    }

    return () => observer.disconnect();
  }, [filter]);

  const visibleProjects =
    filter === "all" ? projects : projects.filter((project) => project.category === filter);

  const countLede = t("projectsPage.grid.countLede", { count: projects.length });

  return (
    <main className="min-w-0 flex-grow" id="projects-page" aria-labelledby="projects-hero-title">
      <ProjectsHero />

      <section
        className="projects-section-reveal projects-page-shell projects-page-section"
        aria-labelledby="all-projects-heading"
      >
        <div className="mb-5 flex flex-col gap-3.5 md:mb-6 md:flex-row md:items-end md:justify-between md:gap-6">
          <div className="min-w-0 space-y-2">
            <SectionEyebrow label={projectsPage.grid.eyebrow} />
            <h2
              id="all-projects-heading"
              className="section-title text-left"
              style={{ textWrap: "balance" }}
            >
              {projectsPage.grid.title}
            </h2>
            <p className="projects-section-lede max-w-none md:max-w-2xl">
              {projects.length > 0 ? countLede : projectsPage.grid.emptyLede}
            </p>
          </div>

          {showFilters ? (
            <div className="projects-filter-shell">
              <div
                className="projects-filter-row flex max-w-full gap-2 overflow-x-auto pb-0.5 md:flex-wrap md:justify-end md:overflow-visible md:pb-0 md:max-w-xl"
                role="group"
                aria-label={projectsPage.grid.filterAriaLabel}
              >
                <FilterChip
                  label={projectsPage.grid.filterAll}
                  active={filter === "all"}
                  onClick={() => setFilter("all")}
                />
                {categories.map((category) => (
                  <FilterChip
                    key={category}
                    label={categoryLabel(category)}
                    active={filter === category}
                    onClick={() => setFilter(category)}
                  />
                ))}
              </div>
            </div>
          ) : null}
        </div>

        {visibleProjects.length > 0 ? (
          <div
            key={filter}
            className="projects-grid-enter grid grid-cols-1 items-stretch gap-10 md:grid-cols-2 md:gap-5 xl:grid-cols-3 xl:gap-5"
          >
            {visibleProjects.map((project, index) => (
              <ProjectCard key={`${filter}-${project.slug}`} project={project} enterIndex={index} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-white/55">{projectsPage.grid.noMatch}</p>
        )}
      </section>

      {interactiveDemos.length > 0 ? (
        <section
          className="projects-section-reveal projects-page-shell projects-page-section"
          aria-labelledby="interactive-demos-heading"
        >
          <div className="mb-5 space-y-2 md:mb-6">
            <h2
              id="interactive-demos-heading"
              className="section-title text-left"
              style={{ textWrap: "balance" }}
            >
              {projectsPage.grid.interactiveTitle}
            </h2>
            <p className="projects-section-lede max-w-none md:max-w-2xl">
              {projectsPage.grid.interactiveLede}
            </p>
          </div>
          <div className="projects-grid-enter grid grid-cols-1 items-stretch gap-10 md:grid-cols-2 md:gap-5 xl:grid-cols-3 xl:gap-5">
            {interactiveDemos.map((project, index) => (
              <ProjectCard key={`demo-${project.slug}`} project={project} enterIndex={index} />
            ))}
          </div>
        </section>
      ) : null}

      <section
        ref={approachRef}
        className={`projects-approach projects-section-reveal projects-page-shell${
          approachVisible ? " projects-approach--visible" : ""
        }`}
        aria-labelledby="projects-approach-heading"
      >
        <div className="projects-approach__layout">
          <div className="min-w-0">
            <SectionEyebrow label={projectsPage.approach.eyebrow} />
            <h2
              id="projects-approach-heading"
              className="projects-approach__heading section-title text-left"
              style={{ textWrap: "balance" }}
            >
              {projectsPage.approach.title}
            </h2>
            <p className="projects-approach__lede text-body">{projectsPage.approach.lede}</p>
          </div>
          <p className="projects-approach__copy text-body">{projectsPage.approach.copy}</p>
        </div>

        <ol className="projects-approach__rail" aria-label={projectsPage.approach.railAriaLabel}>
          {projectsPage.approach.steps.map((step, index) => (
            <li
              key={step.id}
              className="projects-approach__step"
              style={{ ["--step-index" as string]: String(index) }}
            >
              <span className="projects-approach__node" aria-hidden />
              <div className="projects-approach__step-copy min-w-0">
                <span className="projects-approach__step-label">{step.label}</span>
                <p className="projects-approach__step-desc">{step.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <div className="projects-section-reveal">
        <ProjectsFinalCta />
      </div>
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
      onClick={(event) => {
        onClick();
        // Keep the chip visible in the horizontal filter row only —
        // never scrollIntoView the page document.
        const button = event.currentTarget;
        const scroller = button.parentElement;
        window.requestAnimationFrame(() => {
          if (!scroller) {
            return;
          }
          const scrollerRect = scroller.getBoundingClientRect();
          const buttonRect = button.getBoundingClientRect();
          const leftOverflow = buttonRect.left - scrollerRect.left;
          const rightOverflow = buttonRect.right - scrollerRect.right;
          let nextLeft = scroller.scrollLeft;
          if (leftOverflow < 0) {
            nextLeft += leftOverflow - 8;
          } else if (rightOverflow > 0) {
            nextLeft += rightOverflow + 8;
          } else {
            return;
          }
          scroller.scrollTo({ left: Math.max(0, nextLeft), behavior: "smooth" });
        });
      }}
      aria-pressed={active}
      className={`projects-filter-chip rounded-full border font-semibold uppercase transition-[color,background-color,border-color,box-shadow] duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00D2FF] ${
        active
          ? "border-[#00D2FF]/50 bg-[#00D2FF]/15 text-[#D2F8FF]"
          : "border-white/16 bg-white/[0.03] text-white/72 hover:border-white/28 hover:bg-white/[0.055] hover:text-white/92"
      }`}
    >
      {label}
    </button>
  );
}
