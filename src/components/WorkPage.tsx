import React, { useEffect } from "react";
import SectionEyebrow from "./SectionEyebrow";
import BackToHomepage from "./BackToHomepage";
import { PrimaryButton } from "./Buttons";
import WorkProjectCard from "./work/WorkProjectCard";
import { navigateAppPath, navigateToContact } from "../App";
import { getPublishedWorkProjects, isWorkPagePublished } from "../lib/workProjects";

/**
 * Agency Work / Case Studies page (F7).
 *
 * When no leadership-approved published projects exist, /work is treated as
 * unpublished: soft-redirect to home (no "Coming Soon", no fake portfolio).
 */
export default function WorkPage() {
  const publishedProjects = getPublishedWorkProjects();
  const isPublished = isWorkPagePublished();

  useEffect(() => {
    if (!isPublished) {
      navigateAppPath("/");
      return;
    }

    const previousTitle = document.title;
    document.title = "Work";
    window.scrollTo({ top: 0, behavior: "auto" });

    return () => {
      document.title = previousTitle;
    };
  }, [isPublished]);

  if (!isPublished) {
    return (
      <main
        className="flex-grow px-4 py-24 text-center text-sm text-white/50"
        aria-busy="true"
        aria-live="polite"
      >
        Redirecting…
      </main>
    );
  }

  return (
    <main className="flex-grow w-full min-w-0">
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-10 sm:pt-14 pb-8 md:pb-12">
        <BackToHomepage label="Back to homepage" />

        <div className="max-w-3xl space-y-5">
          <SectionEyebrow label="Work" tag="Selected projects" />
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Selected work
          </h1>
          <p className="text-body text-base md:text-lg leading-relaxed max-w-2xl">
            A selection of projects we are cleared to share publicly. Every item on this page comes
            from approved client or leadership material.
          </p>
        </div>
      </section>

      <section
        className="relative max-w-7xl mx-auto px-4 sm:px-6 pb-16 md:pb-24"
        aria-label="Case studies"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-7">
          {publishedProjects.map((project) => (
            <WorkProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </section>

      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 pb-20 md:pb-28">
        <div className="liquid-glass rounded-3xl border border-white/14 bg-white/[0.04] px-5 sm:px-8 py-12 md:px-12 md:py-16 text-center">
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
            Have a project in mind?
          </h2>
          <p className="mt-4 text-body text-base md:text-lg leading-relaxed max-w-xl mx-auto">
            Tell us what you are building and we will follow up through the contact form.
          </p>
          <div className="mt-8 flex justify-center">
            <PrimaryButton onClick={() => navigateToContact()}>Contact Us</PrimaryButton>
          </div>
        </div>
      </section>
    </main>
  );
}
