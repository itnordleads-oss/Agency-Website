import React, { useEffect } from "react";
import {
  ArrowRight,
  ChevronDown,
  Code2,
  Layers,
  ListChecks,
  MessagesSquare,
  ShieldCheck,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import SectionEyebrow from "./SectionEyebrow";
import { PrimaryButton, SecondaryButton } from "./Buttons";
import { useSiteCopy } from "../lib/useSiteCopy";
import { getBrandAriaLabel } from "../lib/studioBranding";
import { navigateAppPath, navigateToContact } from "../App";
import "./about-page.css";

const HERO_PRINCIPLE_ICONS: LucideIcon[] = [MessagesSquare, Wrench, ListChecks, ShieldCheck];
const PRINCIPLE_ICONS: LucideIcon[] = [MessagesSquare, ListChecks, Code2, Layers];

/** Bento: top 2/3 + 1/3, bottom 1/3 + 2/3 on a 3-column grid. */
const BENTO_LAYOUT = [
  "lg:col-span-2 lg:col-start-1 lg:row-start-1 about-bento-cell--lead",
  "lg:col-span-1 lg:col-start-3 lg:row-start-1",
  "lg:col-span-1 lg:col-start-1 lg:row-start-2",
  "lg:col-span-2 lg:col-start-2 lg:row-start-2 about-bento-cell--lead",
] as const;

const ABOUT_SHELL =
  "relative z-10 mx-auto w-full min-w-0 max-w-7xl px-4 min-[341px]:px-5 sm:px-6 lg:px-8";

type AboutPrinciple = { title: string; description: string };
type FlowStep = { label: string };

function useAboutPageMetadata(documentTitle: string) {
  useEffect(() => {
    if (typeof document === "undefined") {
      return;
    }

    const previousTitle = document.title;
    document.title = documentTitle;
    window.scrollTo({ top: 0, behavior: "auto" });

    return () => {
      document.title = previousTitle;
    };
  }, [documentTitle]);
}

function revealProps(reduceMotion: boolean | null, delay = 0) {
  if (reduceMotion) {
    return {};
  }

  return {
    initial: { opacity: 0, y: 18 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.15 },
    transition: { duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] as const },
  };
}

function AboutHeroVisual({
  principles,
  flowSteps,
}: {
  principles: AboutPrinciple[];
  flowSteps: FlowStep[];
}) {
  return (
    <div
      className="about-hero-system w-full max-w-lg lg:max-w-none"
      role="group"
      aria-label="Studio delivery system"
    >
      <div className="about-hero-system-panel relative overflow-hidden rounded-2xl p-4 sm:rounded-3xl sm:p-5 md:p-6">
        <div className="about-hero-grid-bg pointer-events-none absolute inset-0 opacity-60 motion-reduce:opacity-40" />
        <div className="pointer-events-none absolute -right-16 top-0 h-40 w-40 rounded-full bg-[#00d2ff]/15 blur-[70px] motion-reduce:hidden" />

        <div className="relative z-10">
          <p className="text-[0.625rem] font-semibold uppercase tracking-[0.2em] text-[#A4F4FD]/85 sm:text-[0.6875rem]">
            Delivery system
          </p>

          <ol className="about-flow-list m-0 mt-4 list-none space-y-0 p-0">
            {flowSteps.map((step, index) => (
              <li
                key={step.label}
                className={`about-flow-step flex items-center gap-3 py-2 ${index === 0 ? "pt-0" : ""}`}
              >
                <span className="about-flow-node inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[#3D81E3]/45 bg-[#0C111B]">
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${index === flowSteps.length - 1 ? "bg-[#A4F4FD]" : "bg-[#3D81E3]/80"}`}
                    aria-hidden
                  />
                </span>
                <span
                  className={`text-sm font-medium sm:text-[0.9375rem] ${
                    index === 0 ? "text-white/55 uppercase tracking-[0.12em] text-xs" : "text-white"
                  }`}
                >
                  {step.label}
                </span>
                {index < flowSteps.length - 1 ? (
                  <ChevronDown
                    className="ml-auto h-3.5 w-3.5 text-[#A4F4FD]/35 md:hidden"
                    aria-hidden
                  />
                ) : null}
              </li>
            ))}
          </ol>

          <div className="relative mt-5 border-t border-white/[0.09] pt-4">
            <p className="text-[0.625rem] font-semibold uppercase tracking-[0.16em] text-white/45">
              Operating principles
            </p>
            <ul className="m-0 mt-3 grid list-none grid-cols-1 gap-2 p-0 sm:grid-cols-2">
              {principles.slice(0, 4).map((item, index) => {
                const Icon = HERO_PRINCIPLE_ICONS[index] ?? ListChecks;
                return (
                  <li key={item.title} className="about-principle-chip rounded-xl px-3 py-2.5">
                    <div className="flex items-start gap-2">
                      <Icon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#A4F4FD]" aria-hidden />
                      <div className="min-w-0">
                        <p className="text-xs font-semibold leading-snug text-white">
                          {item.title}
                        </p>
                        <p className="mt-0.5 text-[0.6875rem] leading-snug text-white/55">
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

/**
 * F6 About page — premium studio narrative: delivery-system hero, editorial
 * Who We Are, bento principles, capability rows, process timeline, closing CTA.
 */
export default function AboutPage() {
  const { aboutPage } = useSiteCopy();
  const reduceMotion = useReducedMotion();
  const brandLabel = getBrandAriaLabel();
  const documentTitle = `${brandLabel} | ${aboutPage.documentTitleSuffix}`;

  useAboutPageMetadata(documentTitle);

  const hero = aboutPage.hero;
  const heroPrinciples = Array.isArray(hero.principles) ? hero.principles : [];
  const deliveryFlow = Array.isArray(hero.deliveryFlow) ? hero.deliveryFlow : [];
  const titleLine1 =
    typeof hero.titleLine1 === "string" && hero.titleLine1.trim() ? hero.titleLine1 : hero.title;
  const titleLine2 = typeof hero.titleLine2 === "string" ? hero.titleLine2 : "";

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
    { label: "Project input" },
    { label: "Understand" },
    { label: "Build" },
    { label: "Review" },
    { label: "Deliver" },
  ];
  const flowSteps = deliveryFlow.length >= 5 ? deliveryFlow : defaultFlow;

  return (
    <main
      className="about-page about-body min-w-0 flex-grow overflow-x-hidden"
      id="about-page"
      aria-labelledby="about-hero-title"
    >
      {/* 1. Hero */}
      <section
        className="about-section-hero relative overflow-hidden pb-11 pt-7 sm:pb-12 sm:pt-8 md:pb-14 md:pt-9"
        aria-labelledby="about-hero-title"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(920px_circle_at_8%_-5%,rgba(61,129,227,0.2),transparent_52%)] motion-reduce:hidden" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(640px_circle_at_92%_42%,rgba(0,210,255,0.14),transparent_58%)] motion-reduce:hidden" />
        <div className={ABOUT_SHELL}>
          <div className="grid grid-cols-1 items-center gap-9 lg:grid-cols-[1.32fr_1fr] lg:gap-10 xl:gap-12">
            <div className="about-fade-in min-w-0">
              <SectionEyebrow label={hero.eyebrow} className="mb-5" />
              <h1
                id="about-hero-title"
                className="max-w-[14ch] text-balance text-[2.25rem] font-extrabold leading-[1.02] tracking-[-0.035em] text-white sm:text-5xl lg:text-[3.5rem] xl:text-[3.75rem]"
              >
                <span className="block">{titleLine1}</span>
                {titleLine2 ? <span className="mt-1 block text-white/92">{titleLine2}</span> : null}
              </h1>
              <p className="mt-5 max-w-lg text-base leading-relaxed text-body md:text-lg">
                {hero.subtitle}
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <PrimaryButton onClick={navigateToContact} className="w-full px-8 py-3.5 sm:w-auto">
                  {hero.primaryCta}
                </PrimaryButton>
                <SecondaryButton
                  type="button"
                  onClick={() => navigateAppPath("/services")}
                  className="w-full px-8 py-3.5 sm:w-auto"
                >
                  {hero.secondaryCta}
                </SecondaryButton>
              </div>
            </div>

            <div className="min-w-0 lg:max-w-[28rem] lg:justify-self-end xl:max-w-[32rem]">
              <AboutHeroVisual principles={heroPrinciples} flowSteps={flowSteps} />
            </div>
          </div>
        </div>
      </section>

      {/* 2. Who We Are */}
      <section
        className="about-section-who relative py-14 sm:py-16 md:py-20"
        aria-labelledby="about-who-heading"
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/12 to-transparent" />
        <div className={ABOUT_SHELL}>
          <motion.div
            className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12 xl:gap-16"
            {...revealProps(reduceMotion)}
          >
            <div className="relative lg:col-span-5">
              <span
                className="about-section-mark absolute -left-1 top-6 hidden lg:block"
                aria-hidden
              >
                {sectionMark}
              </span>
              <SectionEyebrow label={aboutPage.whoWeAre.eyebrow} />
              <h2
                id="about-who-heading"
                className="relative mt-5 max-w-md text-balance text-3xl font-bold leading-[1.1] tracking-tight text-white sm:text-4xl lg:text-[2.625rem]"
              >
                {aboutPage.whoWeAre.title}
              </h2>
            </div>
            <div className="space-y-6 lg:col-span-7 lg:pl-4">
              {whoHighlight ? (
                <blockquote className="about-pull-quote relative border-l-2 border-[#A4F4FD] py-1 pl-5">
                  {whoHighlight}
                </blockquote>
              ) : null}
              {whoParagraphs.map((paragraph) => (
                <p
                  key={paragraph.slice(0, 48)}
                  className="max-w-2xl text-base leading-relaxed text-body md:text-lg md:leading-relaxed"
                >
                  {paragraph}
                </p>
              ))}

              {workingModel.length >= 3 ? (
                <div className="about-working-model flex flex-col gap-3 pt-4 sm:flex-row sm:flex-wrap sm:items-center sm:gap-2">
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
                className="group inline-flex items-center gap-2 pt-1 text-sm font-semibold text-[#A4F4FD] transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3D81E3]"
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
        className="relative py-14 sm:py-16 md:py-20"
        aria-labelledby="about-principles-heading"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(800px_circle_at_50%_100%,rgba(61,129,227,0.11),transparent_62%)] motion-reduce:hidden" />
        <div className={ABOUT_SHELL}>
          <motion.div
            className="mb-8 max-w-xl md:mb-10 lg:max-w-[48%]"
            {...revealProps(reduceMotion)}
          >
            <SectionEyebrow label={aboutPage.principles.eyebrow} />
            <h2
              id="about-principles-heading"
              className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl"
            >
              {aboutPage.principles.title}
            </h2>
            <p className="mt-3 text-base leading-relaxed text-body md:text-lg">
              {aboutPage.principles.subtitle}
            </p>
          </motion.div>

          <ul className="m-0 grid list-none grid-cols-1 gap-3 p-0 sm:grid-cols-2 lg:grid-cols-3 lg:grid-rows-2 lg:gap-4">
            {principles.map((item, index) => {
              const Icon = PRINCIPLE_ICONS[index] ?? ListChecks;
              const layout = BENTO_LAYOUT[index] ?? "";
              return (
                <motion.li
                  key={item.title}
                  className={`about-bento-cell group relative overflow-hidden rounded-2xl p-5 sm:p-6 ${layout}`}
                  {...revealProps(reduceMotion, index * 0.05)}
                >
                  <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[#3D81E3]/12 blur-2xl motion-reduce:hidden" />
                  <p className="text-[0.625rem] font-semibold uppercase tracking-[0.18em] text-[#A4F4FD]/85">
                    {String(index + 1).padStart(2, "0")}
                  </p>
                  <div className="about-bento-accent mt-3" aria-hidden />
                  <span className="mt-4 inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#3D81E3]/30 bg-[#3D81E3]/10 text-[#A4F4FD]">
                    <Icon className="h-4 w-4" aria-hidden />
                  </span>
                  <h3 className="mt-4 text-lg font-semibold leading-snug text-white">
                    {item.title}
                  </h3>
                  <p className="mt-2 max-w-md text-sm leading-relaxed text-body md:text-[0.9375rem]">
                    {item.description}
                  </p>
                </motion.li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* 4. Capabilities */}
      <section className="relative py-14 sm:py-16 md:py-20" aria-labelledby="about-focus-heading">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <div className={ABOUT_SHELL}>
          <motion.div
            className="mb-8 max-w-xl md:mb-10 lg:max-w-[48%]"
            {...revealProps(reduceMotion)}
          >
            <SectionEyebrow label={aboutPage.focusAreas.eyebrow} />
            <h2
              id="about-focus-heading"
              className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl"
            >
              {aboutPage.focusAreas.title}
            </h2>
            <p className="mt-3 text-base leading-relaxed text-body md:text-lg">
              {aboutPage.focusAreas.subtitle}
            </p>
            <a
              href="/services"
              onClick={(event) => {
                event.preventDefault();
                navigateAppPath("/services");
              }}
              className="group mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#A4F4FD] transition-colors hover:text-white"
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
                className="about-capability-row group"
                {...revealProps(reduceMotion, index * 0.04)}
              >
                <span className="about-capability-bg-num font-mono tabular-nums" aria-hidden>
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className="relative grid grid-cols-[auto_1fr_auto] items-start gap-4 py-6 pl-14 sm:gap-6 sm:py-7 sm:pl-16 md:py-8">
                  <span className="relative z-10 pt-1 font-mono text-lg font-medium tabular-nums text-white/30 transition-colors duration-300 group-hover:text-[#A4F4FD] sm:text-xl">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="relative z-10 min-w-0">
                    <h3 className="about-capability-title text-xl font-semibold leading-snug text-white sm:text-2xl">
                      {item.title}
                    </h3>
                    <p className="mt-2 max-w-3xl text-sm leading-relaxed text-body sm:text-base md:text-[1.0625rem]">
                      {item.description}
                    </p>
                  </div>
                  <ArrowRight
                    className="relative z-10 mt-2 h-5 w-5 shrink-0 text-[#A4F4FD]/0 transition-all duration-300 group-hover:translate-x-1.5 group-hover:text-[#A4F4FD]/85 motion-reduce:transform-none sm:mt-3"
                    aria-hidden
                  />
                </div>
              </motion.li>
            ))}
          </ul>
        </div>
      </section>

      {/* 5. Process timeline */}
      <section
        className="about-section-process relative py-14 sm:py-16 md:py-20"
        aria-labelledby="about-process-heading"
      >
        <div className={ABOUT_SHELL}>
          <motion.div className="mb-10 max-w-xl lg:max-w-[48%]" {...revealProps(reduceMotion)}>
            <SectionEyebrow label={aboutPage.process.eyebrow} />
            <h2
              id="about-process-heading"
              className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl"
            >
              {aboutPage.process.title}
            </h2>
            <p className="mt-3 text-base leading-relaxed text-body md:text-lg">
              {aboutPage.process.subtitle}
            </p>
          </motion.div>

          <motion.ol
            className="about-process-track relative m-0 hidden list-none p-0 md:flex md:flex-wrap md:justify-between md:gap-y-10 lg:flex-nowrap lg:gap-3"
            {...revealProps(reduceMotion, 0.06)}
          >
            <div
              className="about-process-rail pointer-events-none absolute left-[4%] right-[4%] top-[1.4rem] hidden lg:block"
              aria-hidden
            />
            {processSteps.map((step, index) => (
              <li
                key={step.label}
                className={`about-process-step relative min-w-0 flex-1 px-1 text-center ${
                  index >= 3 ? "md:basis-[30%] lg:basis-auto" : "md:basis-[30%] lg:basis-auto"
                }`}
              >
                <span className="about-process-node relative z-10 mx-auto inline-flex h-12 w-12 items-center justify-center rounded-full border border-[#3D81E3]/50 bg-[#0C111B] text-xs font-bold text-[#A4F4FD]">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-4 text-base font-semibold text-white">{step.label}</h3>
                <p className="mx-auto mt-2 max-w-[11rem] text-sm leading-relaxed text-body">
                  {step.description}
                </p>
              </li>
            ))}
          </motion.ol>

          <ol className="relative m-0 list-none space-y-8 border-l border-white/10 p-0 pl-6 md:hidden">
            {processSteps.map((step, index) => (
              <li key={step.label} className="about-process-step relative">
                <span className="about-process-node absolute -left-[1.84rem] top-0 inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#3D81E3]/50 bg-[#0C111B] text-[0.65rem] font-bold text-[#A4F4FD]">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="text-base font-semibold text-white">{step.label}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-body">{step.description}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 6. CTA */}
      <section
        className="relative pb-14 pt-2 sm:pb-16 md:pb-20"
        aria-labelledby="about-final-cta-heading"
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-transparent to-[#3D81E3]/[0.04] motion-reduce:hidden" />
        <div className={ABOUT_SHELL}>
          <motion.div
            className="about-cta-panel relative overflow-hidden rounded-3xl px-6 py-10 sm:px-10 sm:py-12 md:px-14 md:py-12"
            {...revealProps(reduceMotion)}
          >
            <div className="about-cta-grid pointer-events-none absolute inset-0 motion-reduce:hidden" />
            <div className="about-cta-noise pointer-events-none absolute inset-0 motion-reduce:hidden" />
            <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-[#00d2ff]/18 blur-[80px] motion-reduce:hidden" />
            <div className="relative z-10 mx-auto max-w-2xl text-center">
              <h2
                id="about-final-cta-heading"
                className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-[2.625rem]"
              >
                {aboutPage.finalCta.title}
              </h2>
              <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed text-body md:text-lg">
                {aboutPage.finalCta.subtitle}
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-5">
                <PrimaryButton onClick={navigateToContact} className="w-full px-8 py-3.5 sm:w-auto">
                  {aboutPage.finalCta.primaryCta}
                </PrimaryButton>
                <button
                  type="button"
                  onClick={() => navigateAppPath("/services")}
                  className="group inline-flex items-center gap-2 text-sm font-semibold text-[#A4F4FD] transition-colors hover:text-white"
                >
                  {hero.secondaryCta}
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
