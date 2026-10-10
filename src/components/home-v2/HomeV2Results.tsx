import React from "react";
import SectionEyebrow from "../SectionEyebrow";
import { useSiteCopy } from "../../lib/useSiteCopy";

/**
 * Outcome-focused results band for Homepage V3.
 * Placed after Benefits so the story moves from differentiation → expected outcomes.
 */
export default function HomeV2Results() {
  const { homepageV3 } = useSiteCopy();
  const results = homepageV3.results;
  const items = Array.isArray(results?.items) ? results.items : [];

  return (
    <section id="v2-results" className="relative min-w-0 overflow-hidden py-12 sm:py-14 md:py-16">
      <div className="relative z-10 mx-auto w-full min-w-0 max-w-7xl px-3 min-[341px]:px-4 sm:px-6">
        <div className="mx-auto mb-8 max-w-2xl space-y-2.5 text-center md:mb-10">
          <div className="flex justify-center">
            <SectionEyebrow label={results.eyebrow} />
          </div>
          <h2 className="section-title">{results.title}</h2>
          <p className="text-body mx-auto max-w-lg text-sm leading-relaxed md:text-base">
            {results.subtitle}
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-white/[0.1] bg-white/[0.02]">
          <ul className="grid grid-cols-1 items-stretch divide-y divide-white/[0.08] sm:grid-cols-2 sm:divide-x lg:grid-cols-4 lg:divide-y-0">
            {items.map((item) => (
              <li
                key={item.stat}
                className="flex min-h-0 min-w-0 flex-col px-5 py-6 sm:px-6 sm:py-7"
              >
                <p className="text-lg font-semibold leading-snug tracking-tight text-white sm:text-xl sm:leading-snug">
                  {item.stat}
                </p>
                <p className="mt-2 text-sm leading-snug text-white/60">{item.label}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
