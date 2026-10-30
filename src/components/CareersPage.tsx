import React, { useId, useRef, useState } from "react";
import { ArrowRight, BriefcaseBusiness, ChevronDown, CircleDot, MessageSquare } from "lucide-react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { CAREER_JOBS } from "../content/careers";
import { navigateAppPath } from "../App";
import { getAgencyPageSeo } from "../lib/agencyPageSeo";
import { applyPageMetadata } from "../lib/pageMetadata";
import { useSiteCopy } from "../lib/useSiteCopy";
import { PrimaryButton, SecondaryButton } from "./Buttons";
import SectionEyebrow from "./SectionEyebrow";
import CareersWorkTypes from "./careers/CareersWorkTypes";
import CareersWorkingHere from "./careers/CareersWorkingHere";
import { HOME_AGENCY_SHELL } from "./home-v2/homeAgencyLayout";
import "./careers.css";
import "./careersType.css";

const reveal = (reduceMotion: boolean, delay = 0) =>
  reduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 14 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, amount: 0.18 },
        transition: { duration: 0.4, delay, ease: [0.22, 1, 0.36, 1] as const },
      };

function scrollToCareersSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function CareersPage() {
  const { careersPage, language } = useSiteCopy();
  const reduceMotion = useReducedMotion();
  const [openFaq, setOpenFaq] = useState<string | null>(careersPage.faq?.items?.[0]?.id ?? null);
  const styleRef = useRef<HTMLElement | null>(null);
  const hiringRef = useRef<HTMLElement | null>(null);
  const styleVisible = useInView(styleRef, { once: true, amount: 0.3 }) || reduceMotion;
  const hiringVisible = useInView(hiringRef, { once: true, amount: 0.3 }) || reduceMotion;
  const faqBaseId = useId();
  const openJobs = CAREER_JOBS.filter((job) => job.status === "open");

  const workingStyle = Array.isArray(careersPage.workingStyle?.steps)
    ? careersPage.workingStyle.steps
    : [];
  const hiringSteps = Array.isArray(careersPage.hiring?.steps) ? careersPage.hiring.steps : [];
  const faqs = Array.isArray(careersPage.faq?.items) ? careersPage.faq.items : [];
  const flowNodes = Array.isArray(careersPage.hero?.flowNodes) ? careersPage.hero.flowNodes : [];
  const roles = Array.isArray(careersPage.hero?.roles) ? careersPage.hero.roles : [];
  const firstFaqId = careersPage.faq?.items?.[0]?.id ?? null;

  React.useEffect(() => {
    const seo = getAgencyPageSeo("careers");
    const restore = applyPageMetadata({
      title: seo.title,
      description: seo.description,
      pathname: seo.pathname,
    });
    window.scrollTo({ top: 0, behavior: "auto" });
    return restore;
  }, []);

  // Only reset FAQ when language changes — never on every render object identity.
  React.useEffect(() => {
    setOpenFaq(firstFaqId);
  }, [language, firstFaqId]);

  return (
    <main id="careers-page" className="careers-page min-w-0 flex-grow">
      <section className="careers-hero" aria-labelledby="careers-hero-title">
        <div className={`${HOME_AGENCY_SHELL} careers-hero__shell`}>
          <div className="careers-hero__layout">
            <motion.div className="careers-hero__copy" {...reveal(!!reduceMotion)}>
              <SectionEyebrow label={careersPage.hero.eyebrow} />
              <h1 id="careers-hero-title" className="careers-hero__title">
                {careersPage.hero.titleLine1}
                <span className="careers-hero__break" aria-hidden>
                  {" "}
                </span>
                <br className="careers-hero__br" />
                {careersPage.hero.titleLine2}
              </h1>
              <p className="careers-hero__support">{careersPage.hero.support}</p>
              <div className="careers-hero__actions">
                <PrimaryButton onClick={() => scrollToCareersSection("open-positions")}>
                  {careersPage.hero.primaryCta}
                </PrimaryButton>
                <SecondaryButton onClick={() => scrollToCareersSection("working-style")}>
                  {careersPage.hero.secondaryCta}
                </SecondaryButton>
              </div>
            </motion.div>

            <motion.div
              className="careers-flow"
              aria-label={careersPage.hero.flowAriaLabel}
              {...reveal(!!reduceMotion, 0.08)}
            >
              <div className="careers-flow__topline">
                <span>{careersPage.hero.sharedDelivery}</span>
                <span className="careers-flow__status">
                  <CircleDot aria-hidden /> {careersPage.hero.inMotion}
                </span>
              </div>
              <div className="careers-flow__path-layer" aria-hidden>
                <svg className="careers-flow__line" viewBox="0 0 500 172">
                  <path
                    className="careers-flow__path"
                    d="M34 54 C106 54 106 118 170 118 S235 54 300 54 S365 118 466 118"
                  />
                  <path
                    className="careers-flow__path-active"
                    d="M34 54 C106 54 106 118 170 118 S235 54 300 54 S365 118 466 118"
                  />
                </svg>
              </div>
              <div className="careers-flow__nodes">
                {flowNodes.map((label, index) => (
                  <div
                    key={`${label}-${index}`}
                    className={`careers-flow__node careers-flow__node--${index + 1}`}
                  >
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <strong>{label}</strong>
                  </div>
                ))}
              </div>
              <div className="careers-flow__roles" aria-label="Broad contribution areas">
                {roles.map((role) => (
                  <span key={role}>{role}</span>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <CareersWorkingHere reveal={reveal} />

      <CareersWorkTypes reveal={reveal} />

      <section
        ref={styleRef}
        id="working-style"
        className={`careers-section careers-style${styleVisible ? " is-revealed" : ""}`}
        aria-labelledby="working-style-heading"
      >
        <div className={HOME_AGENCY_SHELL}>
          <motion.div
            className="careers-section__intro careers-style__intro"
            {...reveal(!!reduceMotion)}
          >
            <SectionEyebrow label={careersPage.workingStyle.eyebrow} />
            <h2 id="working-style-heading" className="section-title text-left">
              {careersPage.workingStyle.title}
            </h2>
            <p className="text-body">{careersPage.workingStyle.subtitle}</p>
          </motion.div>
          <ol className="careers-style__flow">
            {workingStyle.map((step, index) => (
              <li key={step.title}>
                <span className="careers-style__step">{String(index + 1).padStart(2, "0")}</span>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section
        id="open-positions"
        className="careers-section careers-positions"
        aria-labelledby="open-positions-heading"
      >
        <div className={HOME_AGENCY_SHELL}>
          <motion.div className="careers-positions__heading" {...reveal(!!reduceMotion)}>
            <SectionEyebrow label={careersPage.positions.eyebrow} />
            <h2 id="open-positions-heading" className="section-title text-left">
              {careersPage.positions.title}
            </h2>
          </motion.div>
          {openJobs.length > 0 ? (
            <div className="careers-jobs">
              {openJobs.map((job) => (
                <a key={job.id} href={job.applyUrl} className="careers-job">
                  <div>
                    <h3>{job.title}</h3>
                    <p>
                      {[job.department, job.employmentType, job.location, job.workMode]
                        .filter(Boolean)
                        .join(" · ")}
                    </p>
                    <span>{job.shortDescription}</span>
                  </div>
                  <span>
                    {careersPage.positions.viewPosition} <ArrowRight aria-hidden />
                  </span>
                </a>
              ))}
            </div>
          ) : (
            <motion.div className="careers-empty" {...reveal(!!reduceMotion, 0.06)}>
              <BriefcaseBusiness aria-hidden />
              <div>
                <h3>{careersPage.positions.emptyTitle}</h3>
                <p>{careersPage.positions.emptyBody}</p>
              </div>
              <button
                type="button"
                onClick={() => navigateAppPath("/contact")}
                className="careers-text-link"
              >
                {careersPage.positions.contactCta} <ArrowRight aria-hidden />
              </button>
            </motion.div>
          )}
        </div>
      </section>

      <section
        ref={hiringRef}
        className={`careers-section careers-hiring${hiringVisible ? " is-revealed" : ""}`}
        aria-labelledby="hiring-heading"
      >
        <div className={HOME_AGENCY_SHELL}>
          <motion.div
            className="careers-section__intro careers-hiring__intro"
            {...reveal(!!reduceMotion)}
          >
            <SectionEyebrow label={careersPage.hiring.eyebrow} />
            <h2 id="hiring-heading" className="section-title text-left">
              {careersPage.hiring.title}
            </h2>
          </motion.div>
          <ol className="careers-hiring__timeline">
            {hiringSteps.map((step, index) => (
              <li key={step.title}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="careers-section careers-faq" aria-labelledby="careers-faq-heading">
        <div className={`${HOME_AGENCY_SHELL} careers-faq__layout`}>
          <motion.div className="careers-section__intro" {...reveal(!!reduceMotion)}>
            <SectionEyebrow label={careersPage.faq.eyebrow} />
            <h2 id="careers-faq-heading" className="section-title text-left">
              {careersPage.faq.title}
            </h2>
          </motion.div>
          <motion.div className="careers-faq__items" {...reveal(!!reduceMotion, 0.05)}>
            {faqs.map((faq, index) => {
              const expanded = openFaq === faq.id;
              const buttonId = `${faqBaseId}-faq-${index}`;
              const panelId = `${buttonId}-panel`;
              return (
                <div className="careers-faq__item" key={faq.id}>
                  <button
                    type="button"
                    id={buttonId}
                    aria-expanded={expanded}
                    aria-controls={panelId}
                    onClick={() => setOpenFaq(expanded ? null : faq.id)}
                  >
                    <span>{faq.question}</span>
                    <ChevronDown aria-hidden />
                  </button>
                  <div
                    id={panelId}
                    role="region"
                    aria-labelledby={buttonId}
                    className={expanded ? "is-open" : ""}
                  >
                    <p>{faq.answer}</p>
                  </div>
                </div>
              );
            })}
          </motion.div>
        </div>
      </section>

      <section className="careers-final" aria-labelledby="careers-final-heading">
        <div className={HOME_AGENCY_SHELL}>
          <motion.div className="careers-final__panel" {...reveal(!!reduceMotion)}>
            <div>
              <SectionEyebrow label={careersPage.finalCta.eyebrow} />
              <h2 id="careers-final-heading" className="section-title">
                {careersPage.finalCta.title}
              </h2>
              <p>{careersPage.finalCta.body}</p>
            </div>
            <div className="careers-final__actions">
              <PrimaryButton onClick={() => scrollToCareersSection("open-positions")}>
                {careersPage.finalCta.primaryCta}
              </PrimaryButton>
              <SecondaryButton onClick={() => navigateAppPath("/contact")}>
                <MessageSquare aria-hidden />
                {careersPage.finalCta.secondaryCta}
              </SecondaryButton>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
