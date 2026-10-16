import React, { useEffect, useRef, useState } from "react";
import { BadgeCheck, Code2, ListTree, Rocket, Search } from "lucide-react";
import SectionEyebrow from "../SectionEyebrow";
import {
  SERVICES_INTRO_CLASS,
  SERVICES_SECTION_CLASS,
  SERVICES_SHELL_CLASS,
} from "./servicesLayout";
import type en from "../../i18n/locales/en";
import "./servicesHub.css";

type ProcessCopy = (typeof en)["servicesPage"]["process"];

type ServicesProcessProps = {
  copy: ProcessCopy;
};

const STEP_ICONS = [Search, ListTree, Code2, BadgeCheck, Rocket] as const;

const DELIVERY_PATHS = [
  "M 1 36 H 4.4",
  "M 6.2 36 H 24.4",
  "M 26.2 36 H 45.4",
  "M 45.4 37.8 V 61.4 Q 45.4 63 47.2 63",
  "M 47.2 63 H 77.4",
] as const;

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export default function ServicesProcess({ copy }: ServicesProcessProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [activeStep, setActiveStep] = useState(-1);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) {
      return;
    }

    if (prefersReducedMotion()) {
      setRevealed(true);
      setActiveStep(copy.steps.length - 1);
      return;
    }

    if (typeof IntersectionObserver === "undefined") {
      setRevealed(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setRevealed(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [copy.steps.length]);

  useEffect(() => {
    if (!revealed || prefersReducedMotion()) {
      return;
    }

    const timers: number[] = [];
    copy.steps.forEach((_, index) => {
      timers.push(
        window.setTimeout(
          () => {
            setActiveStep(index);
          },
          220 + index * 280
        )
      );
    });

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, [copy.steps, revealed]);

  const progress =
    activeStep < 0 || copy.steps.length < 2
      ? "0%"
      : `${Math.min(100, (activeStep / (copy.steps.length - 1)) * 100)}%`;
  return (
    <section
      ref={sectionRef}
      className={`${SERVICES_SECTION_CLASS} services-process-section`}
      aria-labelledby="services-process-title"
    >
      <div className={SERVICES_SHELL_CLASS}>
        <div
          className={`${SERVICES_INTRO_CLASS} services-process-intro${revealed ? " is-revealed" : ""}`}
        >
          <SectionEyebrow label={copy.eyebrow} />
          <h2 id="services-process-title" className="section-title">
            {copy.title}
          </h2>
          <p className="max-w-2xl text-base leading-relaxed text-white/68">{copy.subtitle}</p>
        </div>

        <div className="services-delivery-system">
          <svg
            className="services-delivery-system__path"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden
          >
            {DELIVERY_PATHS.map((path, index) => (
              <g key={path}>
                <path className="services-delivery-system__path-base" d={path} />
                <path
                  className={`services-delivery-system__path-active${
                    index <= activeStep ? " is-active" : ""
                  }`}
                  d={path}
                  pathLength={1}
                />
              </g>
            ))}
          </svg>
          <ol
            className={`services-process-timeline${revealed ? " is-revealed" : ""}`}
            aria-label={copy.title}
            style={{ "--services-process-progress": progress } as React.CSSProperties}
          >
            {copy.steps.map((step, index) => {
              const isActive = index <= activeStep;
              const isCurrent = index === activeStep;
              const StepIcon = STEP_ICONS[index] ?? Search;
              return (
                <li
                  key={step.number}
                  className={`services-process-step services-process-step--${index + 1}${
                    isActive ? " is-active" : ""
                  }${isCurrent ? " is-current" : ""}`}
                >
                  <span className="services-process-step__node">{step.number}</span>
                  <div className="services-process-step__body">
                    <StepIcon className="services-process-step__icon" aria-hidden />
                    <h3>{step.title}</h3>
                    <p>{step.description}</p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
