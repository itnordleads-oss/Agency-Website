import React, { useRef, useState } from "react";
import { MessagesSquare, Code2, Layers, ListChecks, type LucideIcon } from "lucide-react";
import { motion, useInView, useReducedMotion } from "motion/react";
import SectionEyebrow from "../SectionEyebrow";
import { useSiteCopy } from "../../lib/useSiteCopy";
import { HOME_AGENCY_INTRO, HOME_AGENCY_SHELL } from "./homeAgencyLayout";
import { homepageStaggerDelay } from "./homeAgencyMotion";
import "./homeAgencyValue.css";

/** Same rhythm as HOME_AGENCY_SECTION, but overflow-visible so headings are never clipped. */
const VALUE_SECTION = "relative min-w-0 overflow-visible py-12 sm:py-14 md:py-16 lg:py-[4.5rem]";

const VALUE_ICONS: LucideIcon[] = [MessagesSquare, Code2, Layers, ListChecks];
const INDEX_LABELS = ["Communication", "Engineering", "Delivery", "Change"] as const;

function canUseHoverPreview(): boolean {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return false;
  }
  return window.matchMedia("(hover: hover) and (pointer: fine)").matches;
}

/**
 * Why work with us — asymmetric principles board with a dominant lead principle.
 */
export default function HomeAgencyValue() {
  const { homepageV3 } = useSiteCopy();
  const { value } = homepageV3;
  const [lead, ...supporting] = value.items;
  const reduceMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionRef = useRef<HTMLElement | null>(null);
  const inView = useInView(sectionRef, { once: true, amount: 0.28 });

  if (!lead) {
    throw new Error("Homepage Why Work With Us requires a lead principle.");
  }

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
                  // Opacity-only: parent main uses overflow-x-hidden, which can clip
                  // vertical translateY reveals at the section top edge.
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

            <ol className="home-agency-value__index" aria-label="Delivery principles">
              {INDEX_LABELS.map((label, index) => (
                <li key={label}>
                  <button
                    type="button"
                    className={`home-agency-value__index-btn${
                      activeIndex === index ? " is-active" : ""
                    }`}
                    onClick={() => setActiveIndex(index)}
                    onMouseEnter={() => {
                      if (canUseHoverPreview()) {
                        setActiveIndex(index);
                      }
                    }}
                    aria-pressed={activeIndex === index}
                  >
                    <span className="home-agency-value__index-num">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="home-agency-value__index-label">{label}</span>
                  </button>
                </li>
              ))}
            </ol>
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
              className={`home-agency-value__lead${activeIndex === 0 ? " is-active" : ""}`}
              onMouseEnter={() => {
                if (canUseHoverPreview()) {
                  setActiveIndex(0);
                }
              }}
            >
              <div className="home-agency-value__lead-top">
                <span className="home-agency-value__icon">
                  <MessagesSquare className="h-4 w-4" aria-hidden />
                </span>
                <div className="min-w-0">
                  <h3 className="home-agency-value__lead-title">{lead.title}</h3>
                  <p className="home-agency-value__lead-copy">{lead.description}</p>
                </div>
              </div>

              <div className="home-agency-value__signal" aria-hidden>
                <span className="home-agency-value__signal-label">Client</span>
                <svg
                  className="home-agency-value__signal-svg"
                  viewBox="0 0 120 24"
                  preserveAspectRatio="none"
                >
                  <path
                    className="home-agency-value__signal-path"
                    d="M4 12 H48 C56 12 56 5 64 5 C72 5 72 19 80 19 C88 19 88 12 96 12 H116"
                  />
                  <circle cx="4" cy="12" r="2.2" fill="#00D2FF" />
                  <circle cx="116" cy="12" r="2.2" fill="#A4F4FD" />
                </svg>
                <span className="home-agency-value__signal-label">Team</span>
              </div>
            </article>

            <ul className="home-agency-value__support">
              {supporting.map((item, index) => {
                const principleIndex = index + 1;
                const Icon = VALUE_ICONS[principleIndex] ?? ListChecks;
                return (
                  <motion.li
                    key={item.title}
                    {...(reduceMotion
                      ? {}
                      : {
                          // Opacity-only inside overflow-hidden board (no translate clip).
                          initial: { opacity: 0 },
                          whileInView: { opacity: 1 },
                          viewport: { once: true, amount: 0.2 },
                          transition: {
                            duration: 0.4,
                            delay: homepageStaggerDelay(principleIndex, 0.05),
                            ease: [0.22, 1, 0.36, 1] as const,
                          },
                        })}
                  >
                    <button
                      type="button"
                      className={`home-agency-value__support-item${
                        activeIndex === principleIndex ? " is-active" : ""
                      }`}
                      onClick={() => setActiveIndex(principleIndex)}
                      onMouseEnter={() => {
                        if (canUseHoverPreview()) {
                          setActiveIndex(principleIndex);
                        }
                      }}
                      aria-pressed={activeIndex === principleIndex}
                    >
                      <div className="home-agency-value__support-head">
                        <span className="home-agency-value__icon home-agency-value__icon--sm">
                          <Icon className="h-3.5 w-3.5" aria-hidden />
                        </span>
                        <span className="home-agency-value__support-num">
                          {String(principleIndex).padStart(2, "0")}
                        </span>
                        <span className="home-agency-value__support-title">{item.title}</span>
                      </div>
                      <span className="home-agency-value__support-copy">{item.description}</span>
                    </button>
                  </motion.li>
                );
              })}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
