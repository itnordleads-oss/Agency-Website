import React from "react";
import { isMetricsModuleEnabled } from "../../lib/trustModules";
import { useHomepageCopy } from "./homepageVariantContext";

export default function HomeV2Trust() {
  const { trust } = useHomepageCopy();
  const metrics = Array.isArray(trust.metrics) ? trust.metrics : [];
  const logoLabels = Array.isArray(trust.logoLabels) ? trust.logoLabels : [];

  if (!isMetricsModuleEnabled() || (metrics.length === 0 && logoLabels.length === 0)) {
    return null;
  }

  return (
    <section
      id="v2-trust"
      className="relative min-w-0 overflow-hidden border-y border-white/[0.06] py-5 sm:py-6"
      aria-label={trust.title}
    >
      <div className="mx-auto w-full min-w-0 max-w-7xl px-3 min-[341px]:px-4 sm:px-6">
        <p className="mb-4 text-center text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-white/40 sm:mb-5">
          {trust.title}
        </p>

        {metrics.length > 0 ? (
          <div
            className={`mx-auto grid max-w-3xl gap-3 sm:gap-6 ${
              metrics.length === 1
                ? "grid-cols-1"
                : metrics.length === 2
                  ? "grid-cols-2"
                  : "grid-cols-3"
            }`}
          >
            {metrics.map((point) => (
              <div key={point.stat} className="min-w-0 text-center">
                <p className="text-base font-extrabold tracking-tight text-white sm:text-xl">
                  {point.stat}
                </p>
                <p className="mt-0.5 text-[0.65rem] leading-snug text-white/50 sm:text-xs">
                  {point.label}
                </p>
              </div>
            ))}
          </div>
        ) : null}

        {logoLabels.length > 0 ? (
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2 sm:mt-6">
            {logoLabels.map((label) => (
              <span
                key={label}
                className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[0.65rem] font-semibold tracking-wide text-white/45 sm:text-[0.7rem]"
              >
                {label}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
