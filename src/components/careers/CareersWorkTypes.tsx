import React, { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { CAREER_EXPERTISE, type CareerExpertiseId } from "../../content/careers";
import { useSiteCopy } from "../../lib/useSiteCopy";
import SectionEyebrow from "../SectionEyebrow";
import { HOME_AGENCY_SHELL } from "../home-v2/homeAgencyLayout";
import CareersWorkTypesVisual from "./CareersWorkTypesVisual";

type CareersWorkTypesProps = {
  reveal: (reduceMotion: boolean, delay?: number) => Record<string, unknown>;
};

type WorkTypeItem = {
  id: CareerExpertiseId;
  label: string;
  title: string;
  description: string;
  tags: readonly string[];
};

/**
 * Careers “Work Types” interactive showcase.
 * Scoped polish only — does not redesign other Careers sections.
 */
export default function CareersWorkTypes({ reveal }: CareersWorkTypesProps) {
  const { careersPage, language } = useSiteCopy();
  const reduceMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const [panelKey, setPanelKey] = useState(0);
  const tabsRef = useRef<HTMLDivElement | null>(null);
  const baseId = useId();

  const expertiseItems = careersPage.expertise.items;
  const items = useMemo<WorkTypeItem[]>(() => {
    const translated = Array.isArray(expertiseItems) ? expertiseItems : [];
    return CAREER_EXPERTISE.map((fallback) => {
      const match = translated.find((item) => item.id === fallback.id);
      return {
        id: fallback.id,
        label: match?.label ?? fallback.label,
        title: match?.label ?? fallback.title,
        description: match?.description ?? fallback.description,
        tags: fallback.tags,
      };
    });
  }, [expertiseItems]);

  const active = items[activeIndex] ?? items[0];

  const selectIndex = useCallback(
    (index: number) => {
      const next = Math.max(0, Math.min(items.length - 1, index));
      const lockedY = typeof window !== "undefined" ? window.scrollY : 0;
      setActiveIndex(next);
      setPanelKey((value) => value + 1);
      // Keep page scroll stable — tab focus / panel remount must not jump the document.
      const restore = () => {
        if (Math.abs(window.scrollY - lockedY) > 1) {
          window.scrollTo({ top: lockedY, behavior: "auto" });
        }
      };
      requestAnimationFrame(() => {
        restore();
        requestAnimationFrame(restore);
      });
    },
    [items.length]
  );

  useEffect(() => {
    setActiveIndex(0);
    setPanelKey((value) => value + 1);
  }, [language]);

  useEffect(() => {
    const root = tabsRef.current;
    if (!root) {
      return;
    }
    const activeTab = root.querySelector<HTMLElement>('[aria-selected="true"]');
    if (!activeTab) {
      return;
    }
    // Horizontal-only — never scrollIntoView the document page.
    const scrollerRect = root.getBoundingClientRect();
    const tabRect = activeTab.getBoundingClientRect();
    const leftOverflow = tabRect.left - scrollerRect.left;
    const rightOverflow = tabRect.right - scrollerRect.right;
    let nextLeft = root.scrollLeft;
    if (leftOverflow < 0) {
      nextLeft += leftOverflow - 10;
    } else if (rightOverflow > 0) {
      nextLeft += rightOverflow + 10;
    } else {
      return;
    }
    root.scrollTo({
      left: Math.max(0, nextLeft),
      behavior: reduceMotion ? "auto" : "smooth",
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
    const nextButton = tabsRef.current?.querySelector<HTMLButtonElement>(
      `#${CSS.escape(`${baseId}-tab-${items[next].id}`)}`
    );
    nextButton?.focus({ preventScroll: true });
  };

  return (
    <section className="careers-section careers-expertise" aria-labelledby="work-types-heading">
      <div className={HOME_AGENCY_SHELL}>
        <motion.div className="careers-expertise__heading" {...reveal(!!reduceMotion)}>
          <SectionEyebrow label={careersPage.expertise.eyebrow} />
          <h2 id="work-types-heading" className="section-title text-left">
            {careersPage.expertise.title}
          </h2>
        </motion.div>

        <motion.div className="careers-expertise__rail" {...reveal(!!reduceMotion, 0.05)}>
          <div
            ref={tabsRef}
            className="careers-expertise__tabs"
            role="tablist"
            aria-label={careersPage.expertise.tabsAriaLabel}
          >
            {items.map((item, index) => {
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
                  onMouseDown={(event) => {
                    // Avoid browser focus-scroll jumping the page when tapping tabs.
                    if (event.button === 0) {
                      event.preventDefault();
                    }
                  }}
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
