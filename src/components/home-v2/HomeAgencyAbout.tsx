import React, { useRef } from "react";
import { ArrowRight } from "lucide-react";
import { motion, useInView, useReducedMotion } from "motion/react";
import SectionEyebrow from "../SectionEyebrow";
import { useSiteCopy } from "../../lib/useSiteCopy";
import { navigateAppPath } from "../../App";
import { HOME_AGENCY_SHELL } from "./homeAgencyLayout";
import "./homeAgencyAbout.css";

/**
 * Homepage About preview — editorial typographic studio identity.
 * Distinct from Why Us (principles), How We Work (timeline), and the full /about page.
 */
export default function HomeAgencyAbout() {
  const { homepageV3 } = useSiteCopy();
  const { aboutPreview } = homepageV3;
  const { identity } = aboutPreview;
  const reduceMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement | null>(null);
  const inView = useInView(sectionRef, { once: true, amount: 0.28 });
  const revealed = Boolean(inView || reduceMotion);
  const ease = [0.22, 1, 0.36, 1] as const;

  return (
    <section
      ref={sectionRef}
      id="about"
      className={`home-agency-about${revealed ? " is-revealed" : ""}`}
      aria-labelledby="agency-about-heading"
    >
      <div className="home-agency-about__bg" aria-hidden />
      <div className={`${HOME_AGENCY_SHELL} home-agency-about__shell`}>
        <div className="home-agency-about__layout">
          <div className="home-agency-about__intro">
            <motion.span
              data-homepage-scroll-ref="about"
              {...(reduceMotion
                ? {}
                : {
                    initial: { opacity: 0 },
                    whileInView: { opacity: 1 },
                    viewport: { once: true, amount: 0.35 },
                    transition: { duration: 0.4, ease },
                  })}
            >
              <SectionEyebrow label={aboutPreview.eyebrow} />
            </motion.span>

            <motion.h2
              id="agency-about-heading"
              className="section-title home-agency-about__heading text-left"
              {...(reduceMotion
                ? {}
                : {
                    initial: { opacity: 0, y: 12 },
                    whileInView: { opacity: 1, y: 0 },
                    viewport: { once: true, amount: 0.35 },
                    transition: { duration: 0.42, ease },
                  })}
            >
              {aboutPreview.title}
            </motion.h2>

            <motion.p
              className="home-agency-about__support"
              {...(reduceMotion
                ? {}
                : {
                    initial: { opacity: 0, y: 10 },
                    whileInView: { opacity: 1, y: 0 },
                    viewport: { once: true, amount: 0.35 },
                    transition: { duration: 0.4, delay: 0.04, ease },
                  })}
            >
              {aboutPreview.support}
            </motion.p>

            <motion.a
              href="/about"
              className="home-agency-about__cta"
              {...(reduceMotion
                ? {}
                : {
                    initial: { opacity: 0 },
                    whileInView: { opacity: 1 },
                    viewport: { once: true, amount: 0.35 },
                    transition: { duration: 0.4, delay: 0.08, ease },
                  })}
              onClick={(event) => {
                if (
                  event.defaultPrevented ||
                  event.button !== 0 ||
                  event.metaKey ||
                  event.ctrlKey ||
                  event.shiftKey ||
                  event.altKey
                ) {
                  return;
                }
                event.preventDefault();
                navigateAppPath("/about");
              }}
            >
              {aboutPreview.cta}
              <ArrowRight className="home-agency-about__cta-arrow h-4 w-4" aria-hidden />
            </motion.a>
          </div>

          <motion.aside
            className="home-agency-about__identity"
            aria-label="Studio focus"
            {...(reduceMotion
              ? {}
              : {
                  initial: { opacity: 0, y: 14 },
                  whileInView: { opacity: 1, y: 0 },
                  viewport: { once: true, amount: 0.28 },
                  transition: { duration: 0.42, delay: 0.05, ease },
                })}
          >
            <p className="home-agency-about__watermark" aria-hidden>
              Studio
            </p>

            <div className="home-agency-about__identity-block">
              <p className="home-agency-about__identity-lead">{identity.lead}</p>
              <ul className="home-agency-about__domains">
                {identity.domains.map((domain) => (
                  <li key={domain}>{domain}</li>
                ))}
              </ul>
            </div>

            <div className="home-agency-about__identity-rule" aria-hidden />

            <div className="home-agency-about__identity-row">
              <span className="home-agency-about__identity-label">{identity.aroundLabel}</span>
              <span className="home-agency-about__identity-value">{identity.aroundValue}</span>
            </div>

            <div className="home-agency-about__identity-rule" aria-hidden />

            <div className="home-agency-about__identity-row">
              <span className="home-agency-about__identity-label">{identity.forLabel}</span>
              <span className="home-agency-about__identity-value home-agency-about__identity-value--accent">
                {identity.forValue}
              </span>
            </div>
          </motion.aside>
        </div>
      </div>
    </section>
  );
}
