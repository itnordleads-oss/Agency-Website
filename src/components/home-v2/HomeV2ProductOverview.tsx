import React from "react";
import SectionEyebrow from "../SectionEyebrow";
import HomeV2ProductFrame from "./HomeV2ProductFrame";
import { useHomepageCopy } from "./homepageVariantContext";

export default function HomeV2ProductOverview() {
  const { product } = useHomepageCopy();

  return (
    <section
      id="product"
      className="relative min-w-0 scroll-mt-24 overflow-hidden py-12 sm:py-14 md:py-16"
    >
      <div className="relative z-10 mx-auto w-full min-w-0 max-w-7xl px-3 min-[341px]:px-4 sm:px-6">
        <div
          data-homepage-scroll-ref="product"
          className="mx-auto mb-8 max-w-2xl space-y-2.5 text-center md:mb-10"
        >
          <div className="flex justify-center">
            <SectionEyebrow label={product.eyebrow} />
          </div>
          <h2 className="section-title">{product.title}</h2>
          <p className="text-body mx-auto max-w-lg text-sm leading-relaxed md:text-base">
            {product.subtitle}
          </p>
        </div>

        <div className="grid items-center gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-12">
          <HomeV2ProductFrame
            badge={product.panelBadge}
            title={product.panelTitle}
            accounts={product.accounts}
            progressLabel="Ready to launch"
            progressValue="82%"
            progressPercent={82}
          />

          <ul className="min-w-0 space-y-3">
            {product.highlights.map((item, index) => (
              <li
                key={item.title}
                className="rounded-2xl border border-white/10 bg-white/[0.025] px-4 py-4 sm:px-5"
              >
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-accent-soft/25 bg-accent-soft/10 text-xs font-bold text-accent-soft">
                    {index + 1}
                  </span>
                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold text-white md:text-base">{item.title}</h3>
                    <p className="mt-1 text-sm leading-snug text-white/60">{item.description}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
