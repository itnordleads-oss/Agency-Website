import React, { useCallback, useEffect, useId, useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useSiteCopy } from "../../lib/useSiteCopy";
import SectionEyebrow from "../SectionEyebrow";
import { HOME_AGENCY_SHELL } from "../home-v2/homeAgencyLayout";

type PrincipleItem = {
  id: string;
  title: string;
  description: string;
};

const PRINCIPLE_IDS = ["meaningful", "collaboration", "ownership", "improvement"] as const;

function PrincipleVisual({
  principleId,
  reducedMotion,
}: {
  principleId: (typeof PRINCIPLE_IDS)[number];
  reducedMotion: boolean;
}) {
  const gid = `wh-${principleId}`;

  return (
    <div
      className={`careers-wh-visual careers-wh-visual--${principleId}${
        reducedMotion ? " careers-wh-visual--reduced" : ""
      }`}
      aria-hidden="true"
    >
      <div className="careers-wh-visual__grid" />
      <svg
        className="careers-wh-visual__svg"
        viewBox="0 0 480 220"
        preserveAspectRatio="xMidYMid meet"
        role="presentation"
      >
        <defs>
          <linearGradient id={`${gid}-line`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00D2FF" stopOpacity="0.2" />
            <stop offset="55%" stopColor="#00D2FF" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#3D81E3" stopOpacity="0.3" />
          </linearGradient>
        </defs>

        {principleId === "meaningful" ? (
          <>
            <rect className="careers-wh-panel" x="48" y="48" width="250" height="124" rx="14" />
            <rect className="careers-wh-chrome" x="48" y="48" width="250" height="28" rx="14" />
            <circle className="careers-wh-dot" cx="68" cy="62" r="3.5" />
            <circle className="careers-wh-dot" cx="82" cy="62" r="3.5" />
            <circle className="careers-wh-dot" cx="96" cy="62" r="3.5" />
            <rect className="careers-wh-bar" x="68" y="96" width="150" height="8" rx="4" />
            <rect className="careers-wh-bar" x="68" y="116" width="110" height="8" rx="4" />
            <rect className="careers-wh-bar" x="68" y="136" width="84" height="8" rx="4" />
            <path className="careers-wh-path" stroke={`url(#${gid}-line)`} d="M318 110 H360" />
            <circle className="careers-wh-node careers-wh-node--active" cx="392" cy="110" r="16" />
            <path
              className="careers-wh-check"
              d="M384 110 L390 116 L402 102"
              fill="none"
              stroke="#0c111b"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </>
        ) : null}

        {principleId === "collaboration" ? (
          <>
            <circle className="careers-wh-node" cx="90" cy="70" r="12" />
            <circle className="careers-wh-node" cx="170" cy="150" r="12" />
            <circle className="careers-wh-node careers-wh-node--active" cx="260" cy="70" r="14" />
            <circle className="careers-wh-node" cx="350" cy="150" r="12" />
            <circle className="careers-wh-node" cx="400" cy="90" r="10" />
            <path
              className="careers-wh-path"
              stroke={`url(#${gid}-line)`}
              d="M102 78 L158 140 M182 140 L246 80 M274 80 L338 140 M362 148 L390 100"
            />
            <rect className="careers-wh-panel" x="220" y="34" width="80" height="28" rx="8" />
            <text className="careers-wh-label" x="260" y="52" textAnchor="middle">
              Align
            </text>
          </>
        ) : null}

        {principleId === "ownership" ? (
          <>
            <rect className="careers-wh-panel" x="70" y="54" width="340" height="112" rx="14" />
            <circle className="careers-wh-node careers-wh-node--active" cx="120" cy="110" r="14" />
            <path className="careers-wh-path" stroke={`url(#${gid}-line)`} d="M136 110 H360" />
            <circle className="careers-wh-node" cx="190" cy="110" r="8" />
            <circle className="careers-wh-node" cx="260" cy="110" r="8" />
            <circle className="careers-wh-node" cx="330" cy="110" r="8" />
            <circle className="careers-wh-node" cx="380" cy="110" r="10" />
            <text className="careers-wh-label" x="120" y="148" textAnchor="middle">
              Own
            </text>
            <text className="careers-wh-label" x="380" y="148" textAnchor="middle">
              Ship
            </text>
          </>
        ) : null}

        {principleId === "improvement" ? (
          <>
            <rect className="careers-wh-panel" x="70" y="40" width="340" height="140" rx="14" />
            <path
              className="careers-wh-path careers-wh-path--loop"
              stroke={`url(#${gid}-line)`}
              d="M180 120 C180 70 300 70 300 120 C300 160 180 160 180 120"
            />
            <circle className="careers-wh-node" cx="180" cy="120" r="8" />
            <circle className="careers-wh-node careers-wh-node--active" cx="300" cy="120" r="12" />
            <path
              className="careers-wh-check"
              d="M294 120 L299 125 L308 114"
              fill="none"
              stroke="#0c111b"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <text className="careers-wh-label" x="240" y="168" textAnchor="middle">
              Refine
            </text>
          </>
        ) : null}
      </svg>
    </div>
  );
}

type CareersWorkingHereProps = {
  reveal: (reduceMotion: boolean, delay?: number) => Record<string, unknown>;
};

/**
 * Working Here — interactive principles.
 * Desktop: selector + detail/visual split.
 * Mobile: accordion with one open principle.
 */
export default function CareersWorkingHere({ reveal }: CareersWorkingHereProps) {
  const { careersPage, language } = useSiteCopy();
  const reduceMotion = useReducedMotion();
  const baseId = useId();
  const [activeIndex, setActiveIndex] = useState(0);
  const [panelKey, setPanelKey] = useState(0);

  const principleItems = careersPage.principles.items;
  const principles = useMemo<PrincipleItem[]>(() => {
    const items = Array.isArray(principleItems) ? principleItems : [];
    return items.map((item, index) => ({
      id: PRINCIPLE_IDS[index] ?? `principle-${index}`,
      title: item.title,
      description: item.description,
    }));
  }, [principleItems]);

  useEffect(() => {
    setActiveIndex(0);
    setPanelKey((value) => value + 1);
  }, [language]);

  const active = principles[activeIndex] ?? principles[0];
  const principleId = (PRINCIPLE_IDS[activeIndex] ??
    "meaningful") as (typeof PRINCIPLE_IDS)[number];

  const selectIndex = useCallback((index: number) => {
    setActiveIndex((current) => {
      if (current === index) {
        return current;
      }
      setPanelKey((value) => value + 1);
      return index;
    });
  }, []);

  const onSelectorKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    let next: number | null = null;
    if (event.key === "ArrowDown" || event.key === "ArrowRight") {
      next = (index + 1) % principles.length;
    } else if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
      next = (index - 1 + principles.length) % principles.length;
    } else if (event.key === "Home") {
      next = 0;
    } else if (event.key === "End") {
      next = principles.length - 1;
    }

    if (next === null) {
      return;
    }

    event.preventDefault();
    selectIndex(next);
    const nextButton = document.getElementById(`${baseId}-tab-${principles[next]?.id}`);
    nextButton?.focus({ preventScroll: true });
  };

  const transition = reduceMotion
    ? { duration: 0 }
    : { duration: 0.3, ease: [0.22, 1, 0.36, 1] as const };

  return (
    <section className="careers-section careers-principles" aria-labelledby="working-here-heading">
      <div className={HOME_AGENCY_SHELL}>
        <motion.div className="careers-section__intro" {...reveal(!!reduceMotion)}>
          <SectionEyebrow label={careersPage.principles.eyebrow} />
          <h2 id="working-here-heading" className="section-title text-left">
            {careersPage.principles.title}
          </h2>
          <p className="text-body">{careersPage.principles.subtitle}</p>
        </motion.div>

        {/* Desktop / tablet split composition */}
        <motion.div className="careers-principles__desktop" {...reveal(!!reduceMotion, 0.05)}>
          <div
            className="careers-principles__selector"
            role="tablist"
            aria-label={careersPage.principles.listAriaLabel}
            aria-orientation="vertical"
          >
            {principles.map((principle, index) => {
              const selected = index === activeIndex;
              return (
                <button
                  type="button"
                  role="tab"
                  key={principle.id}
                  id={`${baseId}-tab-${principle.id}`}
                  aria-selected={selected}
                  aria-controls={`${baseId}-panel`}
                  tabIndex={selected ? 0 : -1}
                  className={`careers-principles__option${selected ? " is-active" : ""}`}
                  onMouseDown={(event) => {
                    if (event.button === 0) {
                      event.preventDefault();
                    }
                  }}
                  onClick={() => selectIndex(index)}
                  onKeyDown={(event) => onSelectorKeyDown(event, index)}
                >
                  <span className="careers-principles__option-num">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <strong className="careers-principles__option-title">{principle.title}</strong>
                  <span className="careers-principles__option-indicator" aria-hidden />
                </button>
              );
            })}
          </div>

          <div
            id={`${baseId}-panel`}
            role="tabpanel"
            aria-labelledby={`${baseId}-tab-${active?.id ?? "principle"}`}
            className="careers-principles__detail"
          >
            <motion.div
              key={`${active?.id ?? "principle"}-${panelKey}`}
              className="careers-principles__detail-inner"
              initial={reduceMotion ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={transition}
            >
              <span className="careers-principles__number">
                {String(activeIndex + 1).padStart(2, "0")}
              </span>
              <h3>{active?.title}</h3>
              <p>{active?.description}</p>
              <PrincipleVisual principleId={principleId} reducedMotion={!!reduceMotion} />
            </motion.div>
          </div>
        </motion.div>

        {/* Mobile accordion composition */}
        <motion.div className="careers-principles__mobile" {...reveal(!!reduceMotion, 0.05)}>
          <div
            className="careers-principles__accordion"
            role="list"
            aria-label={careersPage.principles.listAriaLabel}
          >
            {principles.map((principle, index) => {
              const expanded = index === activeIndex;
              const panelId = `${baseId}-m-panel-${principle.id}`;
              const buttonId = `${baseId}-m-btn-${principle.id}`;
              const visualId = (PRINCIPLE_IDS[index] ??
                "meaningful") as (typeof PRINCIPLE_IDS)[number];

              return (
                <div
                  key={principle.id}
                  className={`careers-principles__acc-item${expanded ? " is-open" : ""}`}
                  role="listitem"
                >
                  <button
                    type="button"
                    id={buttonId}
                    className="careers-principles__acc-trigger"
                    aria-expanded={expanded}
                    aria-controls={panelId}
                    onClick={() => selectIndex(index)}
                  >
                    <span className="careers-principles__option-num">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <strong className="careers-principles__option-title">{principle.title}</strong>
                    <ChevronDown className="careers-principles__acc-icon" aria-hidden />
                  </button>

                  <div
                    id={panelId}
                    role="region"
                    aria-labelledby={buttonId}
                    className={`careers-principles__acc-panel${expanded ? " is-open" : ""}`}
                    aria-hidden={!expanded}
                  >
                    <div className="careers-principles__acc-panel-inner">
                      {expanded ? (
                        <motion.div
                          key={`${principle.id}-${panelKey}`}
                          initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={transition}
                        >
                          <p>{principle.description}</p>
                          <PrincipleVisual principleId={visualId} reducedMotion={!!reduceMotion} />
                        </motion.div>
                      ) : null}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
