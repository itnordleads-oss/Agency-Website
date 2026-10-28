import React, { useId, useRef, useState } from "react";
import { ArrowRight, BriefcaseBusiness, ChevronDown, CircleDot, MessageSquare } from "lucide-react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { CAREER_FAQS, CAREER_JOBS } from "../content/careers";
import { navigateAppPath } from "../App";
import { getAgencyPageSeo } from "../lib/agencyPageSeo";
import { applyPageMetadata } from "../lib/pageMetadata";
import { PrimaryButton, SecondaryButton } from "./Buttons";
import SectionEyebrow from "./SectionEyebrow";
import CareersWorkTypes from "./careers/CareersWorkTypes";
import { HOME_AGENCY_SHELL } from "./home-v2/homeAgencyLayout";
import "./careers.css";
import "./careersType.css";

const WORKING_PRINCIPLES = [
  {
    title: "Meaningful Work",
    description: "Contribute to software, web, mobile, commerce, and content-focused products.",
  },
  {
    title: "Clear Collaboration",
    description: "Requirements, progress, and feedback stay visible through delivery.",
  },
  {
    title: "Ownership",
    description: "Take responsibility for useful work from understanding through review.",
  },
  {
    title: "Continuous Improvement",
    description: "Learn through implementation, review, iteration, and project decisions.",
  },
] as const;

const WORKING_STYLE = [
  ["Understand", "Know the requirement before implementation."],
  ["Work", "Keep changes reviewable and manageable."],
  ["Review", "Use feedback to improve implementation."],
  ["Deliver", "Refine the work toward a useful release."],
] as const;

const HIRING_STEPS = [
  ["Application", "Submit your details for an available role."],
  ["Review", "We review the application against the role requirements."],
  ["Conversation", "Relevant candidates may be invited to discuss the role and experience."],
  ["Next Steps", "Further steps are shared directly with candidates."],
] as const;

const reveal = (reduceMotion: boolean, delay = 0) =>
  reduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 16 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, amount: 0.18 },
        transition: { duration: 0.46, delay, ease: [0.22, 1, 0.36, 1] as const },
      };

function scrollToCareersSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function CareersPage() {
  const reduceMotion = useReducedMotion();
  const [activePrinciple, setActivePrinciple] = useState(0);
  const [openFaq, setOpenFaq] = useState<string | null>(CAREER_FAQS[0]?.id ?? null);
  const styleRef = useRef<HTMLElement | null>(null);
  const hiringRef = useRef<HTMLElement | null>(null);
  const styleVisible = useInView(styleRef, { once: true, amount: 0.3 }) || reduceMotion;
  const hiringVisible = useInView(hiringRef, { once: true, amount: 0.3 }) || reduceMotion;
  const faqBaseId = useId();
  const openJobs = CAREER_JOBS.filter((job) => job.status === "open");

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

  return (
    <main id="careers-page" className="careers-page min-w-0 flex-grow">
      <section className="careers-hero" aria-labelledby="careers-hero-title">
        <div className={`${HOME_AGENCY_SHELL} careers-hero__shell`}>
          <div className="careers-hero__layout">
            <motion.div className="careers-hero__copy" {...reveal(reduceMotion)}>
              <SectionEyebrow label="Careers" />
              <h1 id="careers-hero-title" className="careers-hero__title">
                Build useful products.
                <br />
                Grow with the work.
              </h1>
              <p className="careers-hero__support">
                Software and product work, with shared review.
              </p>
              <div className="careers-hero__actions">
                <PrimaryButton onClick={() => scrollToCareersSection("open-positions")}>
                  View Open Positions
                </PrimaryButton>
                <SecondaryButton onClick={() => scrollToCareersSection("working-style")}>
                  How We Work
                </SecondaryButton>
              </div>
            </motion.div>

            <motion.div
              className="careers-flow"
              aria-label="Collaboration flow from idea to ship"
              {...reveal(reduceMotion, 0.08)}
            >
              <div className="careers-flow__topline">
                <span>Shared delivery</span>
                <span className="careers-flow__status">
                  <CircleDot aria-hidden /> In motion
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
                {["Idea", "Collaborate", "Build", "Review", "Ship"].map((label, index) => (
                  <div
                    key={label}
                    className={`careers-flow__node careers-flow__node--${index + 1}`}
                  >
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <strong>{label}</strong>
                  </div>
                ))}
              </div>
              <div className="careers-flow__roles" aria-label="Broad contribution areas">
                {["Engineering", "Product", "Design", "Delivery"].map((role) => (
                  <span key={role}>{role}</span>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section
        className="careers-section careers-principles"
        aria-labelledby="working-here-heading"
      >
        <div className={`${HOME_AGENCY_SHELL} careers-principles__layout`}>
          <motion.div className="careers-section__intro" {...reveal(reduceMotion)}>
            <SectionEyebrow label="Working here" />
            <h2 id="working-here-heading" className="section-title text-left">
              Work where contribution stays visible
            </h2>
            <p className="text-body">
              Useful work moves forward when context, decisions, and feedback are shared.
            </p>
          </motion.div>
          <motion.div className="careers-principles__surface" {...reveal(reduceMotion, 0.06)}>
            <article className="careers-principles__lead">
              <span className="careers-principles__number">01</span>
              <h3>{WORKING_PRINCIPLES[activePrinciple]?.title}</h3>
              <p>{WORKING_PRINCIPLES[activePrinciple]?.description}</p>
            </article>
            <div className="careers-principles__list" role="list" aria-label="Working principles">
              {WORKING_PRINCIPLES.map((principle, index) => (
                <button
                  type="button"
                  role="listitem"
                  key={principle.title}
                  className={index === activePrinciple ? "is-active" : ""}
                  aria-pressed={index === activePrinciple}
                  onClick={() => setActivePrinciple(index)}
                  onFocus={() => setActivePrinciple(index)}
                >
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <strong>{principle.title}</strong>
                  <ArrowRight aria-hidden />
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

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
            {...reveal(reduceMotion)}
          >
            <SectionEyebrow label="Working style" />
            <h2 id="working-style-heading" className="section-title text-left">
              Keep the work clear and moving
            </h2>
            <p className="text-body">
              A shared rhythm for contributing, reviewing, and improving useful work.
            </p>
          </motion.div>
          <ol className="careers-style__flow">
            {WORKING_STYLE.map(([title, description], index) => (
              <li key={title}>
                <span className="careers-style__step">{String(index + 1).padStart(2, "0")}</span>
                <h3>{title}</h3>
                <p>{description}</p>
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
          <motion.div className="careers-positions__heading" {...reveal(reduceMotion)}>
            <SectionEyebrow label="Opportunities" />
            <h2 id="open-positions-heading" className="section-title text-left">
              Open positions
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
                    View Position <ArrowRight aria-hidden />
                  </span>
                </a>
              ))}
            </div>
          ) : (
            <motion.div className="careers-empty" {...reveal(reduceMotion, 0.06)}>
              <BriefcaseBusiness aria-hidden />
              <div>
                <h3>There are currently no open positions.</h3>
                <p>We’ll publish new opportunities here when they become available.</p>
              </div>
              <button
                type="button"
                onClick={() => navigateAppPath("/contact")}
                className="careers-text-link"
              >
                Contact Us <ArrowRight aria-hidden />
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
            {...reveal(reduceMotion)}
          >
            <SectionEyebrow label="Hiring journey" />
            <h2 id="hiring-heading" className="section-title text-left">
              A clear path through the conversation
            </h2>
          </motion.div>
          <ol className="careers-hiring__timeline">
            {HIRING_STEPS.map(([title, description], index) => (
              <li key={title}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h3>{title}</h3>
                <p>{description}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="careers-section careers-faq" aria-labelledby="careers-faq-heading">
        <div className={`${HOME_AGENCY_SHELL} careers-faq__layout`}>
          <motion.div className="careers-section__intro" {...reveal(reduceMotion)}>
            <SectionEyebrow label="FAQ" />
            <h2 id="careers-faq-heading" className="section-title text-left">
              A few useful details
            </h2>
          </motion.div>
          <motion.div className="careers-faq__items" {...reveal(reduceMotion, 0.05)}>
            {CAREER_FAQS.map((faq, index) => {
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
          <motion.div className="careers-final__panel" {...reveal(reduceMotion)}>
            <div>
              <SectionEyebrow label="Careers" />
              <h2 id="careers-final-heading" className="section-title">
                Interested in working with us?
              </h2>
              <p>Keep an eye on open roles or get in touch when there is a relevant opportunity.</p>
            </div>
            <div className="careers-final__actions">
              <PrimaryButton onClick={() => scrollToCareersSection("open-positions")}>
                View Open Positions
              </PrimaryButton>
              <SecondaryButton onClick={() => navigateAppPath("/contact")}>
                <MessageSquare aria-hidden />
                Contact Us
              </SecondaryButton>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
