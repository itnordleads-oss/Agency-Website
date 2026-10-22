import React, { useState } from "react";
import { ArrowRight, Check, GitBranch, MessageSquare, ShieldCheck, Target } from "lucide-react";
import SectionEyebrow from "../SectionEyebrow";
import { SERVICES_SECTION_CLASS, SERVICES_SHELL_CLASS } from "./servicesLayout";
import type en from "../../i18n/locales/en";
import "./servicesHub.css";

type WhyUsCopy = (typeof en)["servicesPage"]["whyUs"];

type ServicesWhyUsProps = {
  copy: WhyUsCopy;
};

const PRINCIPLE_ICONS = [MessageSquare, Target, GitBranch, ShieldCheck] as const;

function PrincipleCanvas({ activeIndex }: { activeIndex: number }) {
  const diagrams = [
    {
      nodes: ["CLIENT", "TEAM"],
      caption: "Shared context",
      paths: ["M24 52 H76"],
    },
    {
      nodes: ["INPUT", "SCOPE", "BUILD"],
      caption: "Defined before delivery",
      paths: ["M15 52 H43", "M57 52 H85"],
    },
    {
      nodes: ["PLAN", "REVIEW", "SHIP"],
      caption: "Visible delivery loop",
      paths: ["M15 52 H43", "M57 52 H85", "M85 52 L90 42"],
    },
    {
      nodes: ["BUILD", "EXTEND", "MAINTAIN"],
      caption: "Made to evolve",
      paths: ["M15 52 H43", "M57 52 H85", "M85 52 C85 78 45 78 45 62"],
    },
  ] as const;
  const diagram = diagrams[activeIndex] ?? diagrams[0];

  return (
    <div className="services-principle-canvas__diagram" aria-hidden>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none">
        {diagram.paths.map((path) => (
          <path key={path} d={path} />
        ))}
      </svg>
      <div className={`services-principle-canvas__nodes is-${diagram.nodes.length}`}>
        {diagram.nodes.map((node) => (
          <span key={node}>{node}</span>
        ))}
      </div>
      <p>{diagram.caption}</p>
    </div>
  );
}

export default function ServicesWhyUs({ copy }: ServicesWhyUsProps) {
  const principles = copy.principles;
  const [activeIndex, setActiveIndex] = useState(0);
  const activeItem = principles[activeIndex] ?? principles[0];
  const ActiveIcon = PRINCIPLE_ICONS[activeIndex] ?? MessageSquare;

  if (!activeItem) {
    return null;
  }

  return (
    <section
      className={`${SERVICES_SECTION_CLASS} services-principle-section`}
      aria-labelledby="services-why-title"
    >
      <div className={SERVICES_SHELL_CLASS}>
        <div className="services-principle-layout">
          <div className="min-w-0 space-y-5">
            <div className="space-y-3">
              <SectionEyebrow label={copy.eyebrow} />
              <h2 id="services-why-title" className="section-title text-left">
                {copy.title}
              </h2>
              <p className="services-why-intro max-w-sm">{copy.subtitle}</p>
            </div>

            <ol className="services-principle-nav" aria-label="Delivery principles">
              {principles.map((item, index) => {
                const isActive = index === activeIndex;
                return (
                  <li key={item.title}>
                    <button
                      type="button"
                      className={`services-principle-nav__button${isActive ? " is-active" : ""}`}
                      aria-pressed={isActive}
                      onClick={() => setActiveIndex(index)}
                      onMouseEnter={() => {
                        if (
                          typeof window !== "undefined" &&
                          window.matchMedia("(hover: hover) and (pointer: fine)").matches
                        ) {
                          setActiveIndex(index);
                        }
                      }}
                      onFocus={() => setActiveIndex(index)}
                    >
                      <span aria-hidden>{String(index + 1).padStart(2, "0")}</span>
                      {item.shortLabel}
                    </button>
                  </li>
                );
              })}
            </ol>
          </div>

          <div className="services-principle-canvas">
            <div key={activeItem.title} className="services-principle-canvas__content">
              <div className="services-principle-canvas__mark" aria-hidden>
                <ActiveIcon className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="services-principle-canvas__index" aria-hidden>
                  {String(activeIndex + 1).padStart(2, "0")}
                </p>
                <h3 className="services-principle-canvas__title">{activeItem.title}</h3>
                <p className="services-principle-canvas__copy">{activeItem.description}</p>
              </div>
              <PrincipleCanvas activeIndex={activeIndex} />
              <ArrowRight className="services-principle-canvas__arrow" aria-hidden />
              <Check className="services-principle-canvas__check" aria-hidden />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
