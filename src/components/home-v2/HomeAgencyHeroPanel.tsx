import React from "react";
import { useSiteCopy } from "../../lib/useSiteCopy";

const STAGE_NODES = [
  { id: "idea", label: "Idea", x: 18, y: 26 },
  { id: "build", label: "Design / Build", x: 50, y: 46 },
  { id: "product", label: "Product", x: 82, y: 26 },
] as const;

const SURFACE_LABELS = ["Product", "Web", "Mobile", "Commerce", "CMS"] as const;

/**
 * Homepage hero visual — digital product delivery composition.
 * Integrated into the Hero so How We Work is not duplicated here.
 */
export default function HomeAgencyHeroPanel() {
  const { homepageV3 } = useSiteCopy();
  const visual = homepageV3.heroVisual;

  return (
    <div
      className="relative mx-auto w-full max-w-md overflow-hidden rounded-2xl border border-white/12 bg-[#0A1220]/80 p-3.5 shadow-[0_20px_60px_rgba(0,0,0,0.28)] sm:max-w-lg sm:rounded-[1.35rem] sm:p-4 lg:ml-auto lg:mr-0 lg:max-w-none"
      aria-label={visual.ariaLabel}
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(380px circle at 82% 6%, rgba(0,210,255,0.14), transparent 55%), radial-gradient(320px circle at 8% 94%, rgba(61,129,227,0.12), transparent 52%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.18]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(164,244,253,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(164,244,253,0.07) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
          maskImage: "radial-gradient(circle at 50% 42%, black 30%, transparent 76%)",
        }}
      />

      <div className="relative z-10 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[0.625rem] font-semibold uppercase tracking-[0.16em] text-[#A4F4FD] min-[341px]:text-xs">
              {visual.eyebrow}
            </p>
            <p className="mt-1 text-sm font-semibold leading-snug text-white sm:text-[0.95rem]">
              {visual.title}
            </p>
          </div>
          <span className="shrink-0 rounded-full border border-accent-soft/25 bg-accent-soft/10 px-2.5 py-1 text-[0.62rem] font-semibold uppercase tracking-wide text-[#A4F4FD]">
            {visual.badge}
          </span>
        </div>

        <div className="relative aspect-[5/3.05] w-full overflow-hidden rounded-xl border border-white/10 bg-white/[0.025] sm:rounded-2xl">
          <svg
            className="absolute inset-0 h-full w-full"
            viewBox="0 0 100 62"
            role="presentation"
            aria-hidden
          >
            <defs>
              <linearGradient id="hero-rail" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgba(0,210,255,0.18)" />
                <stop offset="50%" stopColor="rgba(0,210,255,0.55)" />
                <stop offset="100%" stopColor="rgba(61,129,227,0.35)" />
              </linearGradient>
            </defs>
            <path
              d="M18 26 C30 26, 36 46, 50 46 C64 46, 70 26, 82 26"
              fill="none"
              stroke="url(#hero-rail)"
              strokeWidth="0.75"
            />
            {STAGE_NODES.map((node) => (
              <g key={node.id}>
                <circle
                  cx={node.x}
                  cy={node.y}
                  r="3.1"
                  fill="rgba(10,18,32,0.95)"
                  stroke="rgba(0,210,255,0.7)"
                  strokeWidth="0.7"
                />
                <circle cx={node.x} cy={node.y} r="1.05" fill="#00D2FF" />
              </g>
            ))}
          </svg>

          <div className="absolute inset-0 flex flex-col justify-between p-2.5 sm:p-3.5">
            <div className="flex justify-between gap-1.5">
              {STAGE_NODES.map((node) => (
                <span
                  key={node.id}
                  className="rounded-md border border-white/12 bg-[#0C111B]/8 px-1.5 py-1 text-[0.6rem] font-semibold text-white/90 backdrop-blur-sm sm:px-2 sm:text-[0.7rem]"
                >
                  {node.label}
                </span>
              ))}
            </div>

            <div className="grid grid-cols-5 gap-1 sm:gap-1.5">
              {SURFACE_LABELS.map((label) => (
                <div
                  key={label}
                  className="rounded-md border border-white/12 bg-white/[0.045] px-0.5 py-1.5 text-center sm:rounded-lg sm:px-1.5 sm:py-2"
                >
                  <span className="block text-[0.5rem] font-semibold uppercase tracking-wide text-[#A4F4FD]/95 sm:text-[0.6rem]">
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <p className="text-[0.75rem] leading-relaxed text-white/58 sm:text-xs">{visual.caption}</p>
      </div>
    </div>
  );
}
