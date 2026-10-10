import React, { useEffect } from "react";
import { ArrowRight, Code2, Layers, ListChecks, MessagesSquare, type LucideIcon } from "lucide-react";
import SectionEyebrow from "./SectionEyebrow";
import BackToHomepage from "./BackToHomepage";
import GlassCard from "./GlassCard";
import { PrimaryButton } from "./Buttons";
import { useSiteCopy } from "../lib/useSiteCopy";
import { getBrandAriaLabel } from "../lib/studioBranding";
import { navigateToContact } from "../App";

const APPROACH_ICONS: LucideIcon[] = [MessagesSquare, ListChecks, Code2, Layers];
const CAPABILITY_ICONS: LucideIcon[] = [Code2, Layers, MessagesSquare, ListChecks];

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

/**
 * F6 — public About page.
 * Uses approved footer positioning and defensible delivery qualities only.
 * Omits team, values, history, metrics, and Work until those are approved.
 */
export default function AboutPage() {
  const { aboutPage } = useSiteCopy();
  const brandLabel = getBrandAriaLabel();
  const documentTitle = `${brandLabel} | ${aboutPage.documentTitleSuffix}`;

  useAboutPageMetadata(documentTitle);

  return (
    <main className="min-w-0 flex-grow overflow-x-hidden" id="about-page" aria-labelledby="about-hero-title">
      <div className="mx-auto w-full min-w-0 max-w-7xl px-3 py-8 max-[340px]:py-7 min-[341px]:px-4 sm:px-6 sm:py-12 md:py-16">
        <BackToHomepage label={aboutPage.backHome} />

        <div className="flex flex-col gap-12 sm:gap-14 md:gap-16">
          <section
            className="liquid-glass relative overflow-hidden rounded-2xl border border-white/14 bg-white/[0.04] px-4 py-8 max-[340px]:px-3 max-[340px]:py-7 min-[341px]:px-5 sm:rounded-3xl sm:px-8 sm:py-10 md:px-10 md:py-12"
            aria-labelledby="about-hero-title"
          >
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                backgroundImage:
                  "radial-gradient(700px circle at 15% -10%, rgba(61,129,227,0.18), transparent 55%), radial-gradient(520px circle at 90% 100%, rgba(0,210,255,0.08), transparent 50%)",
              }}
            />
            <div className="relative z-10 mx-auto max-w-3xl space-y-3 text-center sm:space-y-4">
              <div className="flex justify-center">
                <SectionEyebrow label={aboutPage.hero.eyebrow} />
              </div>
              <h1 id="about-hero-title" className="hero-title text-white">
                {aboutPage.hero.title}
              </h1>
              <p className="text-body mx-auto max-w-2xl text-sm leading-relaxed text-white/70 sm:text-base md:text-lg">
                {aboutPage.hero.subtitle}
              </p>
            </div>
          </section>

          <section aria-labelledby="about-focus-heading">
            <div className="mx-auto mb-6 max-w-2xl space-y-2.5 text-center md:mb-8">
              <div className="flex justify-center">
                <SectionEyebrow label={aboutPage.focus.eyebrow} />
              </div>
              <h2 id="about-focus-heading" className="section-title">
                {aboutPage.focus.title}
              </h2>
              <p className="text-body text-sm leading-relaxed text-white/65 sm:text-base">
                {aboutPage.focus.subtitle}
              </p>
            </div>
          </section>

          <section aria-labelledby="about-approach-heading">
            <div className="mx-auto mb-6 max-w-2xl space-y-2.5 text-center md:mb-8">
              <div className="flex justify-center">
                <SectionEyebrow label={aboutPage.approach.eyebrow} />
              </div>
              <h2 id="about-approach-heading" className="section-title">
                {aboutPage.approach.title}
              </h2>
              <p className="text-body text-sm leading-relaxed text-white/65 sm:text-base">
                {aboutPage.approach.subtitle}
              </p>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
              {aboutPage.approach.items.map((item, index) => {
                const Icon = APPROACH_ICONS[index] ?? ListChecks;
                return (
                  <GlassCard
                    key={item.title}
                    className="border border-white/[0.08] bg-white/[0.02] p-4 sm:p-5"
                  >
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/12 bg-white/[0.04]">
                      <Icon className="h-4 w-4 text-[#00D2FF]" aria-hidden />
                    </span>
                    <h3 className="mt-3 text-sm font-semibold text-white sm:text-base">{item.title}</h3>
                    <p className="mt-1 text-sm leading-snug text-white/60">{item.description}</p>
                  </GlassCard>
                );
              })}
            </div>
          </section>

          <section aria-labelledby="about-capabilities-heading">
            <div className="mx-auto mb-6 max-w-2xl space-y-2.5 text-center md:mb-8">
              <div className="flex justify-center">
                <SectionEyebrow label={aboutPage.capabilities.eyebrow} />
              </div>
              <h2 id="about-capabilities-heading" className="section-title">
                {aboutPage.capabilities.title}
              </h2>
              <p className="text-body text-sm leading-relaxed text-white/65 sm:text-base">
                {aboutPage.capabilities.subtitle}
              </p>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
              {aboutPage.capabilities.items.map((item, index) => {
                const Icon = CAPABILITY_ICONS[index] ?? Code2;
                return (
                  <GlassCard
                    key={item.title}
                    className="border border-white/[0.08] bg-white/[0.02] p-4 sm:p-5"
                  >
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/12 bg-white/[0.04]">
                      <Icon className="h-4 w-4 text-[#00D2FF]" aria-hidden />
                    </span>
                    <h3 className="mt-3 text-sm font-semibold text-white sm:text-base">{item.title}</h3>
                    <p className="mt-1 text-sm leading-snug text-white/60">{item.description}</p>
                  </GlassCard>
                );
              })}
            </div>
          </section>

          <section aria-labelledby="about-process-heading">
            <div className="mx-auto mb-6 max-w-2xl space-y-2.5 text-center md:mb-8">
              <div className="flex justify-center">
                <SectionEyebrow label={aboutPage.process.eyebrow} />
              </div>
              <h2 id="about-process-heading" className="section-title">
                {aboutPage.process.title}
              </h2>
              <p className="text-body text-sm leading-relaxed text-white/65 sm:text-base">
                {aboutPage.process.subtitle}
              </p>
            </div>
            <ol className="mx-auto flex max-w-5xl flex-col items-stretch gap-2.5 md:flex-row md:items-stretch md:gap-2">
              {aboutPage.process.steps.map((step, index) => (
                <React.Fragment key={step.label}>
                  <li className="flex min-w-0 flex-1 flex-col items-center rounded-2xl border border-white/12 bg-white/[0.03] px-3 py-3.5 text-center sm:px-4 sm:py-4">
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-accent-soft/30 bg-accent-soft/10 text-xs font-bold text-accent-soft">
                      {index + 1}
                    </span>
                    <h3 className="mt-2 text-sm font-semibold text-white">{step.label}</h3>
                    <p className="mt-1 text-xs leading-snug text-white/55">{step.description}</p>
                  </li>
                  {index < aboutPage.process.steps.length - 1 ? (
                    <ArrowRight
                      className="mx-auto hidden h-4 w-4 shrink-0 self-center text-white/30 md:block"
                      aria-hidden
                    />
                  ) : null}
                </React.Fragment>
              ))}
            </ol>
          </section>

          <section
            className="relative min-w-0 overflow-hidden"
            aria-labelledby="about-final-cta-heading"
          >
            <div className="liquid-glass cta-glow-panel relative overflow-hidden rounded-2xl border border-white/14 bg-white/[0.04] px-4 py-10 text-center max-[340px]:px-3 max-[340px]:py-9 sm:rounded-3xl sm:px-8 sm:py-14 md:px-12 md:py-16">
              <div
                className="pointer-events-none absolute inset-x-0 top-0 h-full"
                style={{
                  backgroundImage:
                    "radial-gradient(900px circle at 50% -10%, rgba(61,129,227,0.22), rgba(0,210,255,0.06) 45%, transparent 75%)",
                }}
              />
              <div className="relative z-10 mx-auto max-w-xl space-y-5 md:space-y-6">
                <h2 id="about-final-cta-heading" className="section-title">
                  {aboutPage.finalCta.title}
                </h2>
                <p className="text-body text-sm leading-snug md:text-base">
                  {aboutPage.finalCta.subtitle}
                </p>
                <div className="flex justify-center pt-1">
                  <PrimaryButton onClick={navigateToContact} className="w-full px-8 py-3.5 sm:w-auto">
                    {aboutPage.finalCta.primaryCta}
                  </PrimaryButton>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-2 text-xs uppercase tracking-wide text-subtle">
                  <span>{aboutPage.finalCta.footnote[0]}</span>
                  {aboutPage.finalCta.footnote[1] ? (
                    <>
                      <span className="text-white/20">//</span>
                      <span>{aboutPage.finalCta.footnote[1]}</span>
                    </>
                  ) : null}
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
