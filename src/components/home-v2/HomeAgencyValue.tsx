import React, { useCallback, useEffect, useId, useRef, useState } from "react";
import { MessagesSquare, Code2, Layers, RefreshCw, type LucideIcon } from "lucide-react";
import { motion, useInView, useReducedMotion } from "motion/react";
import SectionEyebrow from "../SectionEyebrow";
import { useSiteCopy } from "../../lib/useSiteCopy";
import { HOME_AGENCY_INTRO, HOME_AGENCY_SHELL } from "./homeAgencyLayout";
import "./homeAgencyValue.css";

/** Same rhythm as HOME_AGENCY_SECTION, but overflow-visible so headings are never clipped. */
const VALUE_SECTION =
  "home-agency-section relative min-w-0 overflow-visible py-14 sm:py-14 md:py-16 lg:py-[4.5rem]";

const VALUE_ICONS: LucideIcon[] = [MessagesSquare, Code2, Layers, RefreshCw];

type PrincipleDiagramProps = {
  index: number;
  reducedMotion: boolean;
};

function PrincipleDiagram({ index, reducedMotion }: PrincipleDiagramProps) {
  if (index === 0) {
    return (
      <div className="home-agency-value__diagram" aria-hidden>
        <span>Client</span>
        <svg
          viewBox="0 0 140 28"
          className="home-agency-value__diagram-svg"
          preserveAspectRatio="none"
        >
          <path
            className={`home-agency-value__diagram-path${reducedMotion ? "" : " is-animated"}`}
            d="M6 14 H52 C60 14 60 6 70 6 C80 6 80 22 90 22 C100 22 100 14 108 14 H134"
          />
          <circle cx="6" cy="14" r="2.4" fill="#00D2FF" />
          <circle cx="134" cy="14" r="2.4" fill="#A4F4FD" />
        </svg>
        <span>Team</span>
      </div>
    );
  }

  if (index === 1) {
    return (
      <div className="home-agency-value__diagram home-agency-value__diagram--steps" aria-hidden>
        <span>Requirement</span>
        <span className="home-agency-value__diagram-arrow" />
        <span>Solution</span>
      </div>
    );
  }

  if (index === 2) {
    return (
      <div className="home-agency-value__diagram home-agency-value__diagram--steps" aria-hidden>
        <span>Plan</span>
        <span className="home-agency-value__diagram-arrow" />
        <span>Build</span>
        <span className="home-agency-value__diagram-arrow" />
        <span>Review</span>
      </div>
    );
  }

  return (
    <div className="home-agency-value__diagram home-agency-value__diagram--steps" aria-hidden>
      <span>Current</span>
      <span className="home-agency-value__diagram-arrow" />
      <span>Iterate</span>
      <span className="home-agency-value__diagram-arrow" />
      <span>Improve</span>
    </div>
  );
}

/**
 * Why work with us — cohesive interactive delivery-principles experience.
 */
export default function HomeAgencyValue() {
  const { homepageV3 } = useSiteCopy();
  const { value } = homepageV3;
  const items = value.items;
  const reduceMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const [panelKey, setPanelKey] = useState(0);
  const sectionRef = useRef<HTMLElement | null>(null);
  const tabsRef = useRef<HTMLDivElement | null>(null);
  const inView = useInView(sectionRef, { once: true, amount: 0.28 });
  const baseId = useId();
  const active = items[activeIndex] ?? items[0];
  const Icon = VALUE_ICONS[activeIndex] ?? MessagesSquare;

  if (!active) {
    throw new Error("Homepage Why Work With Us requires at least one principle.");
  }

  const selectIndex = useCallback(
    (index: number) => {
      const next = Math.max(0, Math.min(items.length - 1, index));
      if (next === activeIndex) {
        return;
      }
      setActiveIndex(next);
      setPanelKey((value) => value + 1);
    },
    [activeIndex, items.length]
  );

  useEffect(() => {
    const root = tabsRef.current;
    if (!root) {
      return;
    }
    root.querySelector<HTMLElement>('[aria-selected="true"]')?.scrollIntoView({
      behavior: reduceMotion ? "auto" : "smooth",
      inline: "nearest",
      block: "nearest",
    });
  }, [activeIndex, reduceMotion]);

  const onTabKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    let next: number | null = null;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      next = (index + 1) % items.length;
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      next = (index - 1 + items.length) % items.length;
    } else if (event.key === "Home") {
      next = 0;
    } else if (event.key === "End") {
      next = items.length - 1;
    }
    if (next === null) {
      return;
    }
    event.preventDefault();
    selectIndex(next);
    document.getElementById(`${baseId}-tab-${next}`)?.focus();
  };

  return (
    <section
      ref={sectionRef}
      id="value"
      className={`home-agency-value ${VALUE_SECTION}${inView || reduceMotion ? " is-revealed" : ""}`}
      aria-labelledby="agency-value-heading"
    >
      <div className="home-agency-value__bg" aria-hidden />
      <div className={HOME_AGENCY_SHELL}>
        <div className="home-agency-value__layout">
          <motion.div
            className={`${HOME_AGENCY_INTRO} home-agency-value__intro`}
            {...(reduceMotion
              ? {}
              : {
                  initial: { opacity: 0 },
                  whileInView: { opacity: 1 },
                  viewport: { once: true, amount: 0.2 },
                  transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const },
                })}
          >
            <span data-homepage-scroll-ref="value">
              <SectionEyebrow label={value.eyebrow} />
            </span>
            <h2
              id="agency-value-heading"
              className="section-title home-agency-value__heading text-left"
            >
              {value.title}
            </h2>
            <p className="home-agency-lede">{value.subtitle}</p>

            <div
              ref={tabsRef}
              className="home-agency-value__index"
              role="tablist"
              aria-label="Delivery principles"
              aria-orientation="horizontal"
            >
              {items.map((item, index) => {
                const selected = activeIndex === index;
                const shortLabel = item.shortLabel || item.title;
                return (
                  <button
                    type="button"
                    role="tab"
                    key={item.title}
                    id={`${baseId}-tab-${index}`}
                    className={`home-agency-value__index-btn${selected ? " is-active" : ""}`}
                    aria-selected={selected}
                    aria-controls={`${baseId}-panel`}
                    tabIndex={selected ? 0 : -1}
                    onClick={() => selectIndex(index)}
                    onKeyDown={(event) => onTabKeyDown(event, index)}
                  >
                    <span className="home-agency-value__index-num">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="home-agency-value__index-label">{shortLabel}</span>
                  </button>
                );
              })}
            </div>
          </motion.div>

          <motion.div
            className="home-agency-value__board"
            {...(reduceMotion
              ? {}
              : {
                  initial: { opacity: 0 },
                  whileInView: { opacity: 1 },
                  viewport: { once: true, amount: 0.2 },
                  transition: {
                    duration: 0.5,
                    delay: 0.06,
                    ease: [0.22, 1, 0.36, 1] as const,
                  },
                })}
          >
            <article
              key={`${active.title}-${panelKey}`}
              id={`${baseId}-panel`}
              role="tabpanel"
              aria-labelledby={`${baseId}-tab-${activeIndex}`}
              className={`home-agency-value__panel${reduceMotion ? "" : " home-agency-value__panel--enter"}`}
            >
              <div className="home-agency-value__panel-top">
                <span className="home-agency-value__icon">
                  <Icon className="h-4 w-4" aria-hidden />
                </span>
                <div className="min-w-0">
                  <p className="home-agency-value__panel-num">
                    {String(activeIndex + 1).padStart(2, "0")}
                  </p>
                  <h3 className="home-agency-value__lead-title">{active.title}</h3>
                </div>
              </div>
              <p className="home-agency-value__lead-copy">{active.description}</p>
              {active.points?.length ? (
                <ul className="home-agency-value__points" aria-label="Principle highlights">
                  {active.points.map((point) => (
                    <li key={point} className="home-agency-value__point">
                      <span className="home-agency-value__point-dot" aria-hidden />
                      <span className="home-agency-value__point-label">{point}</span>
                    </li>
                  ))}
                </ul>
              ) : null}
              <PrincipleDiagram index={activeIndex} reducedMotion={!!reduceMotion} />
            </article>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
