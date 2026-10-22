import React, { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import SectionEyebrow from "../SectionEyebrow";
import { useSiteCopy } from "../../lib/useSiteCopy";
import { HOME_AGENCY_INTRO, HOME_AGENCY_SECTION, HOME_AGENCY_SHELL } from "./homeAgencyLayout";
import { homepageRevealProps } from "./homeAgencyMotion";
import "./homeAgencyProcess.css";

function useHorizontalProcessLayout(): boolean {
  const [horizontal, setHorizontal] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
      return;
    }
    const query = window.matchMedia("(min-width: 1024px)");
    const sync = () => setHorizontal(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  return horizontal;
}

/**
 * How we work — connected delivery timeline.
 * Vertical below lg; horizontal open rail at lg+.
 */
export default function HomeAgencyProcess() {
  const { homepageV3 } = useSiteCopy();
  const { process } = homepageV3;
  const reduceMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement | null>(null);
  const inView = useInView(sectionRef, { once: true, amount: 0.32 });
  const revealed = Boolean(inView || reduceMotion);
  const horizontal = useHorizontalProcessLayout();

  return (
    <section
      ref={sectionRef}
      id="process"
      className={`home-agency-process ${HOME_AGENCY_SECTION}${revealed ? " is-revealed" : ""}`}
      aria-labelledby="agency-process-heading"
    >
      <div className="home-agency-process__bg" aria-hidden />
      <div className={`${HOME_AGENCY_SHELL} home-agency-process__shell`}>
        <motion.div
          className={`${HOME_AGENCY_INTRO} mb-5 sm:mb-6 md:mb-7`}
          {...homepageRevealProps(reduceMotion)}
        >
          <span data-homepage-scroll-ref="process">
            <SectionEyebrow label={process.eyebrow} />
          </span>
          <h2 id="agency-process-heading" className="section-title text-left">
            {process.title}
          </h2>
          <p className="home-agency-lede">{process.subtitle}</p>
        </motion.div>

        <motion.div {...homepageRevealProps(reduceMotion, 0.08)}>
          <p className="home-agency-process__bridge" aria-hidden>
            <span>Idea</span>
            <span className="home-agency-process__bridge-line" />
            <span>Delivery</span>
          </p>

          {!horizontal ? (
            <div className="home-agency-process__vertical-wrap">
              <div className="home-agency-process__v-rail" aria-hidden>
                <div className="home-agency-process__v-progress" />
              </div>
              <ol className="home-agency-process__vertical">
                {process.steps.map((step, index) => (
                  <li key={step.label} className="home-agency-process__v-item">
                    <span className="home-agency-process__node">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div className="min-w-0">
                      <h3 className="home-agency-process__title">{step.label}</h3>
                      <p className="home-agency-process__copy">{step.description}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          ) : (
            <div className="home-agency-process__horizontal-wrap">
              <div className="home-agency-process__h-rail" aria-hidden>
                <div className="home-agency-process__h-progress" />
                {!reduceMotion ? <span className="home-agency-process__indicator" /> : null}
              </div>
              <ol className="home-agency-process__horizontal">
                {process.steps.map((step, index) => (
                  <li key={step.label} className="home-agency-process__h-item">
                    <span className="home-agency-process__node">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <h3 className="home-agency-process__title">{step.label}</h3>
                    <p className="home-agency-process__copy">{step.description}</p>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
