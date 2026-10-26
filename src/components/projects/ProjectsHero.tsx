import React, { useCallback, useEffect, useRef } from "react";
import SectionEyebrow from "../SectionEyebrow";
import ProjectVisual from "./ProjectVisual";
import "./projectsHero.css";

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return false;
  }
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function canUsePointerParallax(): boolean {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return false;
  }
  return window.matchMedia("(hover: hover) and (pointer: fine)").matches;
}

/**
 * Premium portfolio hero with layered concept previews.
 * Entrance runs once; pointer parallax stays within a few pixels.
 */
export default function ProjectsHero() {
  const visualRef = useRef<HTMLDivElement | null>(null);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);

  const onPointerMove = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    if (!canUsePointerParallax() || prefersReducedMotion()) {
      return;
    }
    const node = visualRef.current;
    if (!node) {
      return;
    }
    const { clientX, clientY } = event;
    if (frameRef.current !== null) {
      window.cancelAnimationFrame(frameRef.current);
    }
    frameRef.current = window.requestAnimationFrame(() => {
      frameRef.current = null;
      const rect = node.getBoundingClientRect();
      if (rect.width < 1 || rect.height < 1) {
        return;
      }
      const x = (clientX - rect.left) / rect.width - 0.5;
      const y = (clientY - rect.top) / rect.height - 0.5;
      node.style.setProperty("--hero-shift-x", `${(x * 5).toFixed(2)}px`);
      node.style.setProperty("--hero-shift-y", `${(y * 4).toFixed(2)}px`);
    });
  }, []);

  const onPointerLeave = useCallback(() => {
    const node = visualRef.current;
    if (!node) {
      return;
    }
    node.style.setProperty("--hero-shift-x", "0px");
    node.style.setProperty("--hero-shift-y", "0px");
  }, []);

  return (
    <section className="relative mx-auto max-w-7xl px-3 pt-6 min-[341px]:px-4 sm:px-6 sm:pt-8 pb-4 md:pb-6">
      <div className="projects-hero liquid-glass relative overflow-hidden rounded-2xl border border-white/13 bg-white/[0.035] px-4 py-6 max-[340px]:px-3 max-[340px]:py-5 min-[341px]:px-5 sm:rounded-3xl sm:px-8 sm:py-8 md:px-10 md:py-9">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(700px circle at 15% -10%, rgba(61,129,227,0.18), transparent 55%), radial-gradient(520px circle at 90% 100%, rgba(0,210,255,0.1), transparent 50%)",
          }}
        />
        <div className="relative z-10 grid items-center gap-7 lg:grid-cols-2 lg:gap-10 xl:gap-12">
          <div className="mx-auto max-w-xl space-y-3.5 text-center sm:space-y-4 lg:mx-0 lg:max-w-[28rem] lg:text-left">
            <div className="projects-hero__enter projects-hero__enter--eyebrow flex justify-center lg:justify-start">
              <SectionEyebrow label="PROJECTS" />
            </div>
            <h1
              id="projects-hero-title"
              className="projects-hero__enter projects-hero__enter--title projects-hero-title mx-auto lg:mx-0"
            >
              Digital products and web experiences built around real requirements
            </h1>
            <p className="projects-hero__enter projects-hero__enter--copy projects-hero-copy mx-auto lg:mx-0">
              Explore software, websites, and interactive demo projects created to demonstrate
              different approaches to design, development, and digital product delivery.
            </p>
          </div>

          <div
            ref={visualRef}
            className="projects-hero-visual projects-hero__enter projects-hero__enter--visual relative mx-auto h-[15.5rem] w-full max-w-lg sm:h-[17.25rem] lg:mx-0 lg:h-[18.75rem] lg:max-w-none"
            aria-hidden
            onPointerMove={onPointerMove}
            onPointerLeave={onPointerLeave}
          >
            <div className="projects-hero-visual__layer projects-hero-visual__layer--back absolute inset-x-[6%] top-[6%] bottom-[20%] rotate-[-5deg] opacity-75 motion-reduce:rotate-0">
              <ProjectVisual motif="dashboard" variant={2} density="rich" className="h-full" />
              <span className="projects-hero-visual__caption">Software</span>
            </div>
            <div className="projects-hero-visual__layer projects-hero-visual__layer--mid absolute inset-x-[16%] top-[16%] bottom-[6%] rotate-[2.5deg] motion-reduce:rotate-0">
              <ProjectVisual motif="commerce" variant={1} density="rich" className="h-full" />
              <span className="projects-hero-visual__caption">Web</span>
            </div>
            <div className="projects-hero-visual__layer projects-hero-visual__layer--front absolute right-[2%] top-[18%] hidden h-[62%] w-[32%] sm:block">
              <div className="h-full rotate-[6deg] motion-reduce:rotate-0">
                <ProjectVisual motif="mobile" variant={1} className="h-full" />
              </div>
              <span className="projects-hero-visual__caption">Mobile</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
