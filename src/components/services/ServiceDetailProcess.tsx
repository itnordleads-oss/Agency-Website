import React, { useEffect, useRef, useState } from "react";
import { BadgeCheck, Code2, ListTree, Rocket, Search } from "lucide-react";
import type en from "../../i18n/locales/en";
import type { ServiceVisualType } from "./serviceDetailData";

type ProcessCopy = (typeof en)["servicesPage"]["process"];

type ServiceDetailProcessProps = {
  copy: ProcessCopy;
  visualType: ServiceVisualType;
  visualLabel: string;
};

const STEP_ICONS = [Search, ListTree, Code2, BadgeCheck, Rocket] as const;
const STEP_LABELS = ["Discover", "Define", "Build", "Review", "Deliver"] as const;

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export default function ServiceDetailProcess({
  copy,
  visualType,
  visualLabel,
}: ServiceDetailProcessProps) {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [activeStep, setActiveStep] = useState(-1);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) {
      return;
    }

    if (prefersReducedMotion()) {
      setRevealed(true);
      setActiveStep(copy.steps.length - 1);
      return;
    }

    if (typeof IntersectionObserver === "undefined") {
      setRevealed(true);
      setActiveStep(copy.steps.length - 1);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setRevealed(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, [copy.steps.length]);

  useEffect(() => {
    if (!revealed || prefersReducedMotion()) {
      return;
    }

    const timers = copy.steps.map((_, index) =>
      window.setTimeout(() => setActiveStep(index), 180 + index * 240)
    );

    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [copy.steps, revealed]);

  return (
    <div
      ref={sectionRef}
      className={`service-detail-process service-detail-process--${visualType}${
        revealed ? " is-revealed" : ""
      }`}
      role="region"
      aria-label="Delivery approach stages"
    >
      <p className="service-detail-process__variant" aria-hidden>
        {visualLabel}
      </p>
      <div className="service-detail-process__route" aria-hidden />
      <ol>
        {copy.steps.map((step, index) => {
          const StepIcon = STEP_ICONS[index] ?? Search;
          const isActive = index <= activeStep;

          return (
            <li key={step.number} className={isActive ? "is-active" : ""}>
              <span className="service-detail-process__node">{step.number}</span>
              <div className="service-detail-process__body">
                <span className="service-detail-process__kicker">{STEP_LABELS[index]}</span>
                <StepIcon aria-hidden />
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
