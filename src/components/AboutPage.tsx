import React, { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  Code2,
  Layers,
  ListChecks,
  MessagesSquare,
  ShieldCheck,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { motion, useInView, useReducedMotion } from "motion/react";
import SectionEyebrow from "./SectionEyebrow";
import { PrimaryButton, SecondaryButton } from "./Buttons";
import { useSiteCopy } from "../lib/useSiteCopy";
import { getAgencyPageSeo } from "../lib/agencyPageSeo";
import { applyPageMetadata } from "../lib/pageMetadata";
import { navigateAppPath, navigateToContact } from "../App";
import "./about-page.css";
import "./aboutType.css";

const HERO_PRINCIPLE_ICONS: LucideIcon[] = [MessagesSquare, Wrench, ListChecks, ShieldCheck];
const PRINCIPLE_ICONS: LucideIcon[] = [MessagesSquare, ListChecks, Code2, Layers];

/** Bento: a restrained 7/5 split that reverses on the second row. */
const BENTO_LAYOUT = [
  "lg:col-span-7 lg:col-start-1 lg:row-start-1 about-bento-cell--lead",
  "lg:col-span-5 lg:col-start-8 lg:row-start-1",
  "lg:col-span-5 lg:col-start-1 lg:row-start-2",
  "lg:col-span-7 lg:col-start-6 lg:row-start-2 about-bento-cell--lead",
] as const;

/** Mobile gutters ~16px (320–360), ~18–20px (375–430); sm+ established shell. */
const ABOUT_SHELL =
  "relative z-10 mx-auto w-full min-w-0 max-w-7xl px-4 min-[375px]:px-[1.125rem] min-[390px]:px-5 sm:px-6 lg:px-8";

type AboutPrinciple = { title: string; description: string };
type FlowStep = { label: string };
type ProcessStep = { label: string; description: string };

const FALLBACK_STAGE_SUPPORT = [
  "We clarify the problem, users, priorities, risks, and expected outcome before development starts.",
  "We turn the agreed direction into clear, reviewable software and digital experiences.",
  "We test important flows, review progress, and refine the work based on feedback.",
  "We prepare the product for launch or handoff with clear next steps.",
] as const;

function useAboutPageMetadata() {
  useEffect(() => {
    const seo = getAgencyPageSeo("about");
    const restore = applyPageMetadata({
      title: seo.title,
      description: seo.description,
      pathname: seo.pathname,
      ogDescription: seo.ogDescription,
      twitterDescription: seo.twitterDescription,
    });
    window.scrollTo({ top: 0, behavior: "auto" });
    return restore;
  }, []);
}

function revealProps(reduceMotion: boolean | null, delay = 0) {
  if (reduceMotion) {
    return {};
  }

  // Keep opacity at 1 so offscreen/in-progress reveals stay readable (a11y + e2e).
  return {
    initial: { opacity: 1, y: 12 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.12 },
    transition: { duration: 0.42, delay, ease: [0.22, 1, 0.36, 1] as const },
  };
}

function AboutHeroVisual({
  principles,
  flowSteps,
  stageSupport,
  deliveryEyebrow,
  deliveryTitle,
  reduceMotion,
}: {
  principles: AboutPrinciple[];
  flowSteps: FlowStep[];
  stageSupport: readonly string[];
  deliveryEyebrow: string;
  deliveryTitle: string;
  reduceMotion: boolean;
}) {
  const stages = flowSteps.slice(1, 5);
  const stageCount = stages.length;
  const [activeStage, setActiveStage] = useState(reduceMotion ? stageCount - 1 : 0);
  const timersRef = useRef<number[]>([]);
  const interactionStartedRef = useRef(false);
  const supportCopy = stageSupport.length >= stageCount ? stageSupport : FALLBACK_STAGE_SUPPORT;

  const clearProgression = () => {
    timersRef.current.forEach((timer) => window.clearTimeout(timer));
    timersRef.current = [];
  };

  useEffect(() => {
    clearProgression();

    if (reduceMotion) {
      setActiveStage(stageCount - 1);
      return;
    }

    setActiveStage(0);
    timersRef.current = Array.from({ length: Math.max(stageCount - 1, 0) }, (_, index) =>
      window.setTimeout(
        () => {
          if (!interactionStartedRef.current) {
            setActiveStage(index + 1);
          }
        },
        (index + 1) * 320
      )
    );

    return clearProgression;
  }, [reduceMotion, stageCount]);

  const selectStage = (index: number) => {
    interactionStartedRef.current = true;
    clearProgression();
    setActiveStage(index);
  };

  const activeLabel = stages[activeStage]?.label ?? "";

  return (
    <div
      className="about-hero-system w-full max-w-none md:max-w-xl xl:max-w-none"
      role="group"
      aria-label="Studio delivery system"
    >
      <div className="about-hero-system-panel relative overflow-hidden rounded-2xl p-4 sm:rounded-3xl sm:p-5">
        <div className="about-hero-grid-bg pointer-events-none absolute inset-0 opacity-60 motion-reduce:opacity-40" />
        <div className="pointer-events-none absolute -right-16 top-0 h-40 w-40 rounded-full bg-[#00d2ff]/15 blur-[70px] motion-reduce:hidden" />

        <div className="relative z-10">
          <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-[#A4F4FD]/90 sm:text-xs">
            {deliveryEyebrow}
          </p>
          <p className="mt-1 text-[0.9375rem] font-semibold leading-snug tracking-[-0.01em] text-white sm:text-base">
            {deliveryTitle}
          </p>

          <div
            className="about-delivery-path"
            style={
              {
                "--delivery-progress": (activeStage + 1) / Math.max(stageCount, 1),
              } as React.CSSProperties
            }
          >
            <div className="about-delivery-rail" aria-hidden>
              <span className="about-delivery-progress" />
            </div>
            <div className="about-delivery-source">
              <span className="about-flow-node" aria-hidden>
                <span />
              </span>
              <span>{flowSteps[0]?.label ?? "Project Input"}</span>
            </div>
            {stages.map((stage, index) => (
              <button
                key={stage.label}
                type="button"
                className={`about-delivery-stage ${
                  activeStage === index
                    ? "is-active"
                    : index < activeStage
                      ? "is-completed"
                      : "is-upcoming"
                }`}
                aria-pressed={activeStage === index}
                onMouseEnter={() => selectStage(index)}
                onFocus={() => selectStage(index)}
                onClick={() => selectStage(index)}
              >
                <span className="about-flow-node" aria-hidden>
                  <span />
                </span>
                <span>{stage.label}</span>
              </button>
            ))}
          </div>

          <p className="about-stage-detail" aria-live="polite">
            <strong>{activeLabel}</strong>
            <span>{supportCopy[activeStage]}</span>
          </p>

          <div className="relative mt-4 border-t border-white/[0.09] pt-3">
            <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.15em] text-white/60 sm:text-xs">
              Operating principles
            </p>
            <ul className="m-0 mt-2.5 grid list-none grid-cols-1 gap-2 p-0 sm:grid-cols-2">
              {principles.slice(0, 4).map((item, index) => {
                const Icon = HERO_PRINCIPLE_ICONS[index] ?? ListChecks;
                return (
                  <li
                    key={item.title}
                    className={`about-principle-chip rounded-lg px-3 py-2 ${
                      index === activeStage ? "is-active" : ""
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <Icon
                        className="about-principle-chip-icon mt-0.5 h-3.5 w-3.5 shrink-0 text-[#A4F4FD]"
                        aria-hidden
                      />
                      <div className="min-w-0">
                        <p className="about-principle-chip-title text-[0.8125rem] font-semibold leading-[1.4]">
                          {item.title}
                        </p>
                        <p className="about-principle-chip-description mt-0.5 text-xs leading-[1.45]">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function AboutProcess({ steps, reduceMotion }: { steps: ProcessStep[]; reduceMotion: boolean }) {
  const processRef = useRef<HTMLOListElement>(null);
  const isInView = useInView(processRef, { once: true, amount: 0.3 });
  const stepCount = steps.length;
  const [activeStep, setActiveStep] = useState(reduceMotion ? stepCount - 1 : -1);

  useEffect(() => {
    if (reduceMotion) {
      setActiveStep(stepCount - 1);
      return;
    }

    if (!isInView) {
      return;
    }

    const timers = Array.from({ length: stepCount }, (_, index) =>
      window.setTimeout(() => setActiveStep(index), index * 170)
    );

    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [isInView, reduceMotion, stepCount]);

  const isSettled = activeStep >= stepCount - 1;

  return (
    <motion.ol
      ref={processRef}
      className={`about-process-track relative m-0 list-none p-0${isSettled ? " is-settled" : ""}`}
      {...revealProps(reduceMotion, 0.06)}
    >
      <div className="about-process-rail" aria-hidden>
        <span
          className="about-process-progress"
          style={
            {
              "--process-progress": activeStep < 0 ? 0 : activeStep / Math.max(stepCount - 1, 1),
            } as React.CSSProperties
          }
        />
      </div>
      {steps.map((step, index) => {
        const state =
          index < activeStep ? "is-previous" : index === activeStep ? "is-active" : "is-upcoming";
        return (
          <li key={step.label} className={`about-process-step ${state}`}>
            <span className="about-process-node">{String(index + 1).padStart(2, "0")}</span>
            <div className="about-process-copy">
              <h3>{step.label}</h3>
              <p>{step.description}</p>
            </div>
          </li>
        );
      })}
    </motion.ol>
  );
}

/**
 * F6 About page — premium studio narrative: delivery-system hero, editorial
 * Who We Are, bento principles, capability rows, process timeline, closing CTA.
 */
export default function AboutPage() {
  const { aboutPage } = useSiteCopy();
  const reduceMotion = useReducedMotion();
  const shouldReduceMotion = reduceMotion === true;
  const [activePrinciple, setActivePrinciple] = useState(0);
  const [activeFocusArea, setActiveFocusArea] = useState(0);

  useAboutPageMetadata();

  const hero = aboutPage.hero;
  const heroPrinciples = Array.isArray(hero.principles) ? hero.principles : [];
  const deliveryFlow = Array.isArray(hero.deliveryFlow) ? hero.deliveryFlow : [];
  const stageSupport = Array.isArray(hero.stageSupport) ? hero.stageSupport : [];
  const deliveryEyebrow =
    typeof hero.deliveryEyebrow === "string" && hero.deliveryEyebrow.trim()
      ? hero.deliveryEyebrow
      : "Delivery System";
  const deliveryTitle =
    typeof hero.deliveryTitle === "string" && hero.deliveryTitle.trim()
      ? hero.deliveryTitle
      : "A clear path from requirements to launch";
  const titleLine1 =
    typeof hero.titleLine1 === "string" && hero.titleLine1.trim() ? hero.titleLine1 : hero.title;
  const titleLine2 = typeof hero.titleLine2 === "string" ? hero.titleLine2 : "";
  const finalSecondaryCta =
    "secondaryCta" in aboutPage.finalCta && typeof aboutPage.finalCta.secondaryCta === "string"
      ? aboutPage.finalCta.secondaryCta
      : hero.secondaryCta;

  const principles = Array.isArray(aboutPage.principles?.items) ? aboutPage.principles.items : [];
  const focusAreas = Array.isArray(aboutPage.focusAreas?.items) ? aboutPage.focusAreas.items : [];
  const processSteps = Array.isArray(aboutPage.process?.steps) ? aboutPage.process.steps : [];
  const whoParagraphs = Array.isArray(aboutPage.whoWeAre?.paragraphs)
    ? aboutPage.whoWeAre.paragraphs
    : [];
  const whoHighlight =
    typeof aboutPage.whoWeAre?.highlight === "string" ? aboutPage.whoWeAre.highlight : "";
  const workingModel = Array.isArray(aboutPage.whoWeAre?.workingModel)
    ? aboutPage.whoWeAre.workingModel
    : [];
  const sectionMark =
    typeof aboutPage.whoWeAre?.sectionMark === "string" ? aboutPage.whoWeAre.sectionMark : "01";

  const defaultFlow: FlowStep[] = [
    { label: "Project Input" },
    { label: "Understand" },
    { label: "Build" },
    { label: "Review" },
    { label: "Deliver" },
  ];
  const flowSteps = deliveryFlow.length >= 5 ? deliveryFlow : defaultFlow;

  return (
    <main
      className="about-page about-body min-w-0 flex-grow"
      id="about-page"
      aria-labelledby="about-hero-title"
    >
      {/* 1. Hero */}
      <section
        className="about-section about-section-hero relative overflow-hidden pb-10 pt-7 max-[340px]:pt-6 max-[340px]:pb-8 md:pb-12 md:pt-8 xl:pb-14"
        aria-labelledby="about-hero-title"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(920px_circle_at_8%_-5%,rgba(61,129,227,0.2),transparent_52%)] motion-reduce:hidden" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(640px_circle_at_92%_42%,rgba(0,210,255,0.14),transparent_58%)] motion-reduce:hidden" />
        <div className={ABOUT_SHELL}>
          <div className="grid grid-cols-1 items-center gap-6 sm:gap-7 xl:grid-cols-[0.96fr_1.04fr] xl:gap-12">
            <div className="about-fade-in about-hero-copy-block min-w-0">
              <SectionEyebrow label={hero.eyebrow} className="mb-3" />
              <h1 id="about-hero-title" className="about-hero-title">
                <span className="about-hero-title__line">{titleLine1}</span>
                {titleLine2 ? <span className="about-hero-title__line">{titleLine2}</span> : null}
              </h1>
              <p className="about-hero-copy">{hero.subtitle}</p>
              <div className="about-hero-actions mt-5 flex w-full flex-row flex-wrap items-stretch gap-2.5 max-[359px]:flex-col sm:mt-6 sm:gap-3 md:mt-7">
                <PrimaryButton
                  onClick={navigateToContact}
                  className="about-cta-primary min-w-0 flex-1 whitespace-nowrap px-5 py-3.5 max-[359px]:w-full sm:flex-none sm:px-8"
                >
                  {hero.primaryCta}
                </PrimaryButton>
                <SecondaryButton
                  type="button"
                  onClick={() => navigateAppPath("/services")}
                  className="about-cta-secondary min-w-0 flex-1 whitespace-nowrap px-5 py-3.5 max-[359px]:w-full sm:flex-none sm:px-8"
                >
                  {hero.secondaryCta}
                </SecondaryButton>
              </div>
            </div>

            <div className="min-w-0 xl:w-full xl:max-w-[34rem] xl:justify-self-end">
              <AboutHeroVisual
                principles={heroPrinciples}
                flowSteps={flowSteps}
                stageSupport={stageSupport}
                deliveryEyebrow={deliveryEyebrow}
                deliveryTitle={deliveryTitle}
                reduceMotion={shouldReduceMotion}
              />
            </div>
          </div>
        </div>
      </section>

      {/* 2. Who We Are */}
      <section
        className="about-section about-section-who relative py-14 md:py-16 xl:py-20"
        aria-labelledby="about-who-heading"
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/12 to-transparent" />
        <div className={ABOUT_SHELL}>
          <motion.div
            className="grid grid-cols-1 gap-5 md:gap-6 xl:grid-cols-12 xl:gap-12"
            {...revealProps(reduceMotion)}
          >
            <div className="relative xl:col-span-5">
              <span
                className="about-section-mark absolute -left-1 top-4 hidden xl:block"
                aria-hidden
              >
                {sectionMark}
              </span>
              <SectionEyebrow label={aboutPage.whoWeAre.eyebrow} />
              <h2
                id="about-who-heading"
                className="about-section-title relative mt-3.5 max-w-none md:max-w-md"
              >
                {aboutPage.whoWeAre.title}
              </h2>
            </div>
            <div className="space-y-4 xl:col-span-7 xl:pl-2">
              {whoHighlight ? (
                <blockquote className="about-pull-quote relative border-l-2 border-[#A4F4FD] py-0.5 pl-4">
                  {whoHighlight}
                </blockquote>
              ) : null}
              {whoParagraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 48)} className="about-body-copy">
                  {paragraph}
                </p>
              ))}

              {workingModel.length >= 3 ? (
                <div className="about-working-model flex flex-col gap-2.5 pt-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-2">
                  {workingModel.map((label, index) => (
                    <React.Fragment key={label}>
                      <span className="text-sm font-medium text-white/75">{label}</span>
                      {index < workingModel.length - 1 ? (
                        <ArrowRight
                          className="hidden h-3.5 w-3.5 text-[#A4F4FD]/50 sm:inline"
                          aria-hidden
                        />
                      ) : null}
                    </React.Fragment>
                  ))}
                </div>
              ) : null}

              <a
                href="/services"
                onClick={(event) => {
                  event.preventDefault();
                  navigateAppPath("/services");
                }}
                className="group inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#A4F4FD] transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3D81E3]"
              >
                {aboutPage.whoWeAre.exploreServices}
                <ArrowRight
                  className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transform-none"
                  aria-hidden
                />
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 3. Working principles — bento */}
      <section
        className="about-section relative py-14 md:py-16 xl:py-20"
        aria-labelledby="about-principles-heading"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(800px_circle_at_50%_100%,rgba(61,129,227,0.11),transparent_62%)] motion-reduce:hidden" />
        <div className={ABOUT_SHELL}>
          <motion.div
            className="mb-6 max-w-none md:max-w-xl md:mb-7 xl:mb-8 xl:max-w-[48%]"
            {...revealProps(reduceMotion)}
          >
            <SectionEyebrow label={aboutPage.principles.eyebrow} />
            <h2 id="about-principles-heading" className="about-section-title mt-3.5">
              {aboutPage.principles.title}
            </h2>
            <p className="about-section-lede">{aboutPage.principles.subtitle}</p>
          </motion.div>

          <ul className="about-bento-grid m-0 grid list-none grid-cols-1 gap-3 p-0 min-[769px]:grid-cols-2 min-[769px]:gap-3.5 lg:grid-cols-12 lg:grid-rows-2 lg:gap-4">
            {principles.map((item, index) => {
              const Icon = PRINCIPLE_ICONS[index] ?? ListChecks;
              const layout = BENTO_LAYOUT[index] ?? "";
              return (
                <motion.li
                  key={item.title}
                  className={`about-bento-cell relative overflow-hidden rounded-xl ${layout} ${
                    activePrinciple === index ? "is-active" : ""
                  }`}
                  {...revealProps(reduceMotion, index * 0.05)}
                >
                  <button
                    type="button"
                    className="about-bento-button w-full p-4 text-left sm:p-5"
                    aria-pressed={activePrinciple === index}
                    onMouseEnter={() => setActivePrinciple(index)}
                    onFocus={() => setActivePrinciple(index)}
                    onClick={() => setActivePrinciple(index)}
                  >
                    <p className="about-bento-meta">{String(index + 1).padStart(2, "0")}</p>
                    <div className="about-bento-accent mt-2" aria-hidden />
                    <span className="about-bento-icon mt-3 inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#3D81E3]/30 bg-[#3D81E3]/10 text-[#A4F4FD]">
                      <Icon className="h-4 w-4" aria-hidden />
                    </span>
                    <h3>{item.title}</h3>
                    <p className="about-bento-description">{item.description}</p>
                  </button>
                </motion.li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* 4. Capabilities */}
      <section
        className="about-section relative py-14 md:py-16 xl:py-20"
        aria-labelledby="about-focus-heading"
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <div className={ABOUT_SHELL}>
          <motion.div
            className="mb-5 max-w-none md:max-w-xl md:mb-6 xl:mb-7 xl:max-w-[48%]"
            {...revealProps(reduceMotion)}
          >
            <SectionEyebrow label={aboutPage.focusAreas.eyebrow} />
            <h2 id="about-focus-heading" className="about-section-title mt-3.5">
              {aboutPage.focusAreas.title}
            </h2>
            <p className="about-section-lede">{aboutPage.focusAreas.subtitle}</p>
            <a
              href="/services"
              onClick={(event) => {
                event.preventDefault();
                navigateAppPath("/services");
              }}
              className="group mt-4 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#A4F4FD] transition-colors hover:text-white"
            >
              {aboutPage.focusAreas.exploreServices}
              <ArrowRight
                className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transform-none"
                aria-hidden
              />
            </a>
          </motion.div>

          <ul className="m-0 list-none p-0">
            {focusAreas.map((item, index) => (
              <motion.li
                key={item.title}
                className={`about-capability-row ${activeFocusArea === index ? "is-active" : ""}`}
                data-focus-number={String(index + 1).padStart(2, "0")}
                {...revealProps(reduceMotion, index * 0.04)}
              >
                <button
                  type="button"
                  className="about-capability-button relative grid w-full grid-cols-1 items-start gap-1.5 py-4 text-left sm:grid-cols-[auto_1fr_auto] sm:gap-5 sm:py-5 sm:pl-14 md:py-6"
                  aria-pressed={activeFocusArea === index}
                  onMouseEnter={() => setActiveFocusArea(index)}
                  onFocus={() => setActiveFocusArea(index)}
                  onClick={() => setActiveFocusArea(index)}
                >
                  <span className="about-capability-index relative z-10 pt-0.5 font-mono tabular-nums transition-colors duration-300">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="relative z-10 min-w-0">
                    <h3 className="about-capability-title">{item.title}</h3>
                    <p className="about-capability-description max-w-none md:max-w-3xl">
                      {item.description}
                    </p>
                  </div>
                  <ArrowRight
                    className="about-capability-arrow relative z-10 mt-1.5 hidden h-5 w-5 shrink-0 text-[#A4F4FD]/0 transition-all duration-300 motion-reduce:transform-none sm:mt-2 sm:block"
                    aria-hidden
                  />
                </button>
              </motion.li>
            ))}
          </ul>
        </div>
      </section>

      {/* 5. Process timeline */}
      <section
        className="about-section about-section-process relative py-14 md:py-16 xl:py-20"
        aria-labelledby="about-process-heading"
      >
        <div className={ABOUT_SHELL}>
          <motion.div
            className="mb-6 max-w-none md:max-w-xl md:mb-8 xl:mb-9 xl:max-w-[48%]"
            {...revealProps(reduceMotion)}
          >
            <SectionEyebrow label={aboutPage.process.eyebrow} />
            <h2 id="about-process-heading" className="about-section-title mt-3.5">
              {aboutPage.process.title}
            </h2>
            <p className="about-section-lede">{aboutPage.process.subtitle}</p>
          </motion.div>

          <AboutProcess steps={processSteps} reduceMotion={shouldReduceMotion} />
        </div>
      </section>

      {/* 6. CTA */}
      <section
        className="about-section about-section-cta relative pb-14 pt-4 md:pb-16 md:pt-6 xl:pb-20 xl:pt-2"
        aria-labelledby="about-final-cta-heading"
        data-floating-prompt-suppression
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-transparent to-[#3D81E3]/[0.04] motion-reduce:hidden" />
        <div className={ABOUT_SHELL}>
          <motion.div
            className="about-cta-panel relative overflow-hidden rounded-2xl px-4 py-8 max-[340px]:px-3.5 max-[340px]:py-7 sm:rounded-3xl sm:px-10 sm:py-11 md:px-12 md:py-12"
            {...revealProps(reduceMotion)}
          >
            <div className="about-cta-grid pointer-events-none absolute inset-0 motion-reduce:hidden" />
            <div className="about-cta-noise pointer-events-none absolute inset-0 motion-reduce:hidden" />
            <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-[#00d2ff]/18 blur-[80px] motion-reduce:hidden" />
            <div className="relative z-10 mx-auto max-w-2xl text-center">
              <h2 id="about-final-cta-heading" className="about-section-title text-balance">
                {aboutPage.finalCta.title}
              </h2>
              <p className="about-cta-copy">{aboutPage.finalCta.subtitle}</p>
              <div className="about-cta-actions mt-5 flex w-full flex-col items-stretch justify-center gap-2.5 sm:mt-7 sm:flex-row sm:items-center sm:gap-5">
                <PrimaryButton
                  onClick={navigateToContact}
                  className="about-cta-primary w-full whitespace-nowrap px-5 py-3.5 sm:w-auto sm:px-8"
                >
                  {aboutPage.finalCta.primaryCta}
                </PrimaryButton>
                <button
                  type="button"
                  onClick={() => navigateAppPath("/services")}
                  className="group inline-flex min-h-11 items-center justify-center gap-2 whitespace-nowrap text-sm font-semibold text-[#A4F4FD] transition-colors hover:text-white"
                >
                  {finalSecondaryCta}
                  <ArrowRight
                    className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transform-none"
                    aria-hidden
                  />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
