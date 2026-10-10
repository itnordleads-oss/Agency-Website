import React from "react";
import { Target, MailCheck, Handshake } from "lucide-react";
import { useSiteCopy } from "../lib/useSiteCopy";
import { navigateToSection } from "../App";

type PlatformOverviewStripProps = {
  /** When false, hides the Let's Talk CTA column (Platform page). Defaults to true for homepage. */
  showCta?: boolean;
};

export default function PlatformOverviewStrip({ showCta = true }: PlatformOverviewStripProps) {
  const { platformStrip, common } = useSiteCopy();

  const valueItems = [
    {
      icon: Target,
      title: platformStrip.values[0].title,
      desc: platformStrip.values[0].desc,
    },
    {
      icon: MailCheck,
      title: platformStrip.values[1].title,
      desc: platformStrip.values[1].desc,
    },
    {
      icon: Handshake,
      title: platformStrip.values[2].title,
      desc: platformStrip.values[2].desc,
    },
  ] as const;

  return (
    <div
      className="w-full bg-white/[0.03] backdrop-blur-md border-t border-b border-white/[0.1] relative z-30"
      id="platform-overview-strip"
    >
      <div className="max-w-7xl mx-auto px-3 min-[341px]:px-4 sm:px-6 py-5 md:py-6 min-w-0">
        <div
          className={
            showCta
              ? "flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 lg:gap-8"
              : "flex flex-col lg:flex-row lg:items-center gap-5 lg:gap-8"
          }
        >
          <div className="lg:max-w-xs shrink-0 space-y-1.5">
            <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-white/60">
              <span className="text-white font-bold normal-case text-sm">{common.brand}</span>
              <span className="text-white/25">/</span>
              <span>{platformStrip.kicker}</span>
            </div>
            <p className="text-base md:text-lg font-bold text-white leading-snug">
              {platformStrip.title}
            </p>
            <p className="text-sm text-white/70 leading-relaxed">{platformStrip.subtitle}</p>
          </div>

          <div
            className={
              showCta
                ? "grid grid-cols-1 sm:grid-cols-3 gap-2.5 flex-1 lg:max-w-3xl"
                : "grid grid-cols-1 sm:grid-cols-3 gap-2.5 flex-1 min-w-0"
            }
          >
            {valueItems.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="text-left rounded-xl border border-white/[0.1] bg-white/[0.02] p-3.5"
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <Icon className="w-4 h-4 text-[#00D2FF] shrink-0" />
                    <span className="text-sm font-semibold text-white leading-snug">
                      {item.title}
                    </span>
                  </div>
                  <p className="text-xs text-white/65 leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>

          {showCta ? (
            <div className="flex flex-col items-stretch lg:items-end gap-2 shrink-0">
              <button
                onClick={() => navigateToSection("contact")}
                className="w-full lg:w-auto inline-flex items-center justify-center rounded-full bg-white text-black text-xs font-semibold uppercase tracking-wide px-5 py-2.5 hover:bg-white/90 transition-colors cursor-pointer"
              >
                {platformStrip.cta}
              </button>
              <span className="text-[11px] text-white/45 text-center lg:text-right">
                {platformStrip.footnote}
              </span>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
