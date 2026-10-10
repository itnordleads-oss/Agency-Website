import React from "react";
import { useSiteCopy } from "../../lib/useSiteCopy";

/**
 * F4 — Hero visual panel.
 * Replaces product campaign/preview UI with a simple process overview.
 */
export default function HomeAgencyHeroPanel() {
  const { homepageV3 } = useSiteCopy();
  const { process } = homepageV3;

  return (
    <div className="liquid-glass relative overflow-hidden rounded-2xl border border-white/14 bg-white/[0.04] p-5 sm:rounded-3xl sm:p-6 md:p-7 lg:mx-6">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(500px circle at 80% 0%, rgba(0,210,255,0.12), transparent 55%), radial-gradient(420px circle at 10% 100%, rgba(61,129,227,0.14), transparent 50%)",
        }}
      />
      <div className="relative z-10 space-y-4">
        <p className="text-[0.625rem] font-semibold uppercase tracking-[0.14em] text-[#A4F4FD] min-[341px]:text-xs">
          {process.eyebrow}
        </p>
        <ol className="space-y-2.5">
          {process.steps.map((step, index) => (
            <li
              key={step.label}
              className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5"
            >
              <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-accent-soft/30 bg-accent-soft/10 text-[0.65rem] font-bold text-accent-soft">
                {index + 1}
              </span>
              <span className="min-w-0 text-left">
                <span className="block text-sm font-semibold text-white">{step.label}</span>
                <span className="mt-0.5 block text-xs leading-snug text-white/55">
                  {step.description}
                </span>
              </span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
