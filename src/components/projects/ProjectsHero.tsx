import React from "react";
import SectionEyebrow from "../SectionEyebrow";
import ProjectVisual from "./ProjectVisual";
import "./projectsHero.css";

/**
 * Premium portfolio hero with layered concept previews.
 */
export default function ProjectsHero() {
  return (
    <section className="relative mx-auto max-w-7xl px-3 pt-6 min-[341px]:px-4 sm:px-6 sm:pt-8 pb-4 md:pb-6">
      <div className="liquid-glass relative overflow-hidden rounded-2xl border border-white/13 bg-white/[0.035] px-4 py-6 max-[340px]:px-3 max-[340px]:py-5 min-[341px]:px-5 sm:rounded-3xl sm:px-8 sm:py-8 md:px-10 md:py-9">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(700px circle at 15% -10%, rgba(61,129,227,0.18), transparent 55%), radial-gradient(520px circle at 90% 100%, rgba(0,210,255,0.1), transparent 50%)",
          }}
        />
        <div className="relative z-10 grid items-center gap-7 lg:grid-cols-2 lg:gap-10 xl:gap-12">
          <div className="mx-auto max-w-xl space-y-3.5 text-center sm:space-y-4 lg:mx-0 lg:max-w-[28rem] lg:text-left">
            <div className="flex justify-center lg:justify-start">
              <SectionEyebrow label="PROJECTS" />
            </div>
            <h1
              id="projects-hero-title"
              className="hero-title text-white max-w-[15ch] sm:max-w-[18ch] lg:max-w-[14ch]"
            >
              Digital products built around real requirements
            </h1>
            <p className="text-body mx-auto max-w-[21rem] text-sm leading-relaxed text-white/70 sm:text-base lg:mx-0 lg:max-w-[26rem]">
              Software, web, mobile, Shopify, and WordPress portfolio concepts — each labeled
              Concept Project when shown here.
            </p>
          </div>

          <div
            className="projects-hero-visual relative mx-auto h-[15.5rem] w-full max-w-lg sm:h-[17.25rem] lg:mx-0 lg:h-[18.75rem] lg:max-w-none"
            aria-hidden
          >
            <div className="projects-hero-visual__layer projects-hero-visual__layer--back absolute inset-x-[6%] top-[6%] bottom-[20%] rotate-[-5deg] opacity-75 motion-reduce:rotate-0">
              <ProjectVisual motif="dashboard" variant={2} density="rich" className="h-full" />
            </div>
            <div className="projects-hero-visual__layer projects-hero-visual__layer--mid absolute inset-x-[16%] top-[16%] bottom-[6%] rotate-[2.5deg] motion-reduce:rotate-0">
              <ProjectVisual motif="commerce" variant={1} density="rich" className="h-full" />
            </div>
            <div className="projects-hero-visual__layer projects-hero-visual__layer--front absolute right-[2%] top-[18%] hidden h-[62%] w-[32%] sm:block">
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
