import React from "react";
import { MessagesSquare, Code2, Layers, ListChecks, type LucideIcon } from "lucide-react";
import SectionEyebrow from "../SectionEyebrow";
import GlassCard from "../GlassCard";
import { useSiteCopy } from "../../lib/useSiteCopy";

const VALUE_ICONS: LucideIcon[] = [MessagesSquare, Code2, Layers, ListChecks];

/**
 * F4 — Why work with us.
 * Defensible delivery qualities only; no unverified metrics or superlatives.
 */
export default function HomeAgencyValue() {
  const { homepageV3 } = useSiteCopy();
  const { value } = homepageV3;

  return (
    <section
      id="value"
      className="relative min-w-0 overflow-hidden py-12 sm:py-14 md:py-16"
      aria-labelledby="agency-value-heading"
    >
      <div className="relative z-10 mx-auto w-full min-w-0 max-w-7xl px-3 min-[341px]:px-4 sm:px-6">
        <div className="mx-auto mb-8 max-w-2xl space-y-2.5 text-center md:mb-10">
          <div className="flex justify-center">
            <span data-homepage-scroll-ref="value">
              <SectionEyebrow label={value.eyebrow} />
            </span>
          </div>
          <h2 id="agency-value-heading" className="section-title">
            {value.title}
          </h2>
          <p className="text-body text-sm leading-relaxed text-white/65 sm:text-base">
            {value.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
          {value.items.map((item, index) => {
            const Icon = VALUE_ICONS[index] ?? ListChecks;
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
      </div>
    </section>
  );
}
