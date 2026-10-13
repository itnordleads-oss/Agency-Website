import React from "react";
import SectionEyebrow from "../SectionEyebrow";
import ProjectVisual from "./ProjectVisual";

/**
 * Premium portfolio hero with layered concept previews.
 */
export default function ProjectsHero() {
  return (
    <section className="relative mx-auto max-w-7xl px-3 pt-6 min-[341px]:px-4 sm:px-6 sm:pt-8 pb-6 md:pb-8">
      <div className="liquid-glass relative overflow-hidden rounded-2xl border border-white/14 bg-white/[0.04] px-4 py-6 max-[340px]:px-3 max-[340px]:py-5 min-[341px]:px-5 sm:rounded-3xl sm:px-8 sm:py-8 md:px-10 md:py-9">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(700px circle at 15% -10%, rgba(61,129,227,0.18), transparent 55%), radial-gradient(520px circle at 90% 100%, rgba(0,210,255,0.1), transparent 50%)",
          }}
        />
        <div className="relative z-10 grid items-center gap-7 lg:grid-cols-2 lg:gap-10">
          <div className="mx-auto max-w-xl space-y-3.5 text-center sm:space-y-4 lg:mx-0 lg:max-w-lg lg:text-left">
            <div className="flex justify-center lg:justify-start">
              <SectionEyebrow label="PROJECTS" />
            </div>
            <h1
              id="projects-hero-title"
              className="hero-title text-white max-w-[16ch] sm:max-w-none lg:max-w-[14ch]"
            >
              Digital products built around real requirements
            </h1>
            <p className="text-body mx-auto max-w-md text-sm leading-relaxed text-white/70 sm:text-base lg:mx-0 lg:max-w-md">
              A showcase of software, web, mobile, Shopify, and WordPress work. Entries marked
              Concept Project are portfolio concepts used to present our approach.
            </p>
          </div>

          <div
            className="relative mx-auto h-[15.5rem] w-full max-w-lg sm:h-[17.25rem] lg:mx-0 lg:h-[17.5rem]"
            aria-hidden
          >
            <div className="absolute inset-x-[6%] top-[6%] bottom-[20%] rotate-[-5deg] opacity-75 motion-reduce:rotate-0">
              <ProjectVisual motif="dashboard" variant={2} density="rich" className="h-full" />
            </div>
            <div className="absolute inset-x-[16%] top-[16%] bottom-[6%] rotate-[2.5deg] motion-reduce:rotate-0">
              <ProjectVisual motif="commerce" variant={1} density="rich" className="h-full" />
            </div>
            <div className="absolute right-[2%] top-[18%] hidden h-[62%] w-[32%] sm:block">
              <div className="h-full rotate-[6deg] motion-reduce:rotate-0">
                <ProjectVisual motif="mobile" variant={1} className="h-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
