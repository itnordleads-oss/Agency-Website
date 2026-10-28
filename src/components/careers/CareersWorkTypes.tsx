import React, { useCallback, useEffect, useId, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { CAREER_EXPERTISE } from "../../content/careers";
import SectionEyebrow from "../SectionEyebrow";
import { HOME_AGENCY_SHELL } from "../home-v2/homeAgencyLayout";
import CareersWorkTypesVisual from "./CareersWorkTypesVisual";

type CareersWorkTypesProps = {
  reveal: (reduceMotion: boolean, delay?: number) => Record<string, unknown>;
};

/**
 * Careers “Work Types” interactive showcase.
 * Scoped polish only — does not redesign other Careers sections.
 */
export default function CareersWorkTypes({ reveal }: CareersWorkTypesProps) {
  const reduceMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const [panelKey, setPanelKey] = useState(0);
  const tabsRef = useRef<HTMLDivElement | null>(null);
  const baseId = useId();
  const active = CAREER_EXPERTISE[activeIndex] ?? CAREER_EXPERTISE[0];

  const selectIndex = useCallback((index: number) => {
    const next = Math.max(0, Math.min(CAREER_EXPERTISE.length - 1, index));
    setActiveIndex(next);
    setPanelKey((value) => value + 1);
  }, []);

  useEffect(() => {
    const root = tabsRef.current;
    if (!root) {
      return;
    }
    const activeTab = root.querySelector<HTMLElement>('[aria-selected="true"]');
    activeTab?.scrollIntoView({
      behavior: reduceMotion ? "auto" : "smooth",
      inline: "nearest",
      block: "nearest",
    });
  }, [activeIndex, reduceMotion]);

  const onTabKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    let next: number | null = null;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      next = (index + 1) % CAREER_EXPERTISE.length;
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      next = (index - 1 + CAREER_EXPERTISE.length) % CAREER_EXPERTISE.length;
    } else if (event.key === "Home") {
      next = 0;
    } else if (event.key === "End") {
      next = CAREER_EXPERTISE.length - 1;
    }

    if (next === null) {
      return;
    }

    event.preventDefault();
    selectIndex(next);
    const nextButton = tabsRef.current?.querySelector<HTMLButtonElement>(
      `#${CSS.escape(`${baseId}-tab-${CAREER_EXPERTISE[next].id}`)}`
    );
    nextButton?.focus();
  };

  return (
    <section className="careers-section careers-expertise" aria-labelledby="work-types-heading">
      <div className={HOME_AGENCY_SHELL}>
        <motion.div className="careers-expertise__heading" {...reveal(!!reduceMotion)}>
          <SectionEyebrow label="Work types" />
          <h2 id="work-types-heading" className="section-title text-left">
            Work across different kinds of digital products
          </h2>
        </motion.div>

        <motion.div className="careers-expertise__rail" {...reveal(!!reduceMotion, 0.05)}>
          <div
            ref={tabsRef}
            className="careers-expertise__tabs"
            role="tablist"
            aria-label="Areas of work"
          >
            {CAREER_EXPERTISE.map((item, index) => {
              const selected = activeIndex === index;
              return (
                <button
                  type="button"
                  role="tab"
                  key={item.id}
                  id={`${baseId}-tab-${item.id}`}
                  aria-selected={selected}
                  aria-controls={`${baseId}-panel`}
                  tabIndex={selected ? 0 : -1}
                  className={selected ? "is-active" : ""}
                  onClick={() => selectIndex(index)}
                  onKeyDown={(event) => onTabKeyDown(event, index)}
                >
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          <div
            id={`${baseId}-panel`}
            role="tabpanel"
            aria-labelledby={`${baseId}-tab-${active.id}`}
            className="careers-expertise__panel"
          >
            <div key={`copy-${active.id}-${panelKey}`} className="careers-expertise__panel-copy">
              <span className="careers-expertise__panel-label">{active.label}</span>
              <h3>{active.title}</h3>
              <p>{active.description}</p>
              <ul className="careers-expertise__tags" aria-label="Capability focus">
                {active.tags.map((tag) => (
                  <li key={tag}>{tag}</li>
                ))}
              </ul>
            </div>

            <div
              key={`visual-${active.id}-${panelKey}`}
              className="careers-expertise__visual-shell"
            >
              <CareersWorkTypesVisual type={active.id} reducedMotion={!!reduceMotion} />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
