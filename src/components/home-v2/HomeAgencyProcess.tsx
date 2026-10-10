import React from "react";
import { ArrowRight } from "lucide-react";
import SectionEyebrow from "../SectionEyebrow";
import { useSiteCopy } from "../../lib/useSiteCopy";

/**
 * F4 — How we work.
 * Neutral delivery phases only; no timeline or SLA promises.
 */
export default function HomeAgencyProcess() {
  const { homepageV3 } = useSiteCopy();
  const { process } = homepageV3;

  return (
    <section
      id="process"
      className="relative min-w-0 overflow-hidden py-12 sm:py-14 md:py-16"
      aria-labelledby="agency-process-heading"
    >
      <div className="relative z-10 mx-auto w-full min-w-0 max-w-7xl px-3 min-[341px]:px-4 sm:px-6">
        <div className="mx-auto mb-8 max-w-2xl space-y-2.5 text-center md:mb-10">
          <div className="flex justify-center">
            <span data-homepage-scroll-ref="process">
              <SectionEyebrow label={process.eyebrow} />
            </span>
          </div>
          <h2 id="agency-process-heading" className="section-title">
            {process.title}
          </h2>
          <p className="text-body text-sm leading-relaxed text-white/65 sm:text-base">
            {process.subtitle}
          </p>
        </div>

        <ol className="mx-auto flex max-w-5xl flex-col items-stretch gap-2.5 md:flex-row md:items-stretch md:gap-2">
          {process.steps.map((step, index) => (
            <React.Fragment key={step.label}>
              <li className="flex min-w-0 flex-1 flex-col items-center rounded-2xl border border-white/12 bg-white/[0.03] px-3 py-3.5 text-center sm:px-4 sm:py-4">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-accent-soft/30 bg-accent-soft/10 text-xs font-bold text-accent-soft">
                  {index + 1}
                </span>
                <h3 className="mt-2 text-sm font-semibold text-white">{step.label}</h3>
                <p className="mt-1 text-xs leading-snug text-white/55">{step.description}</p>
              </li>
              {index < process.steps.length - 1 ? (
                <ArrowRight
                  className="mx-auto hidden h-4 w-4 shrink-0 self-center text-white/30 md:block"
                  aria-hidden
                />
              ) : null}
            </React.Fragment>
          ))}
        </ol>
      </div>
    </section>
  );
}
