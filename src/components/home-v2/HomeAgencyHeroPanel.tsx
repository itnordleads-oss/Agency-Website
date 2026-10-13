import React, { useCallback, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { useSiteCopy } from "../../lib/useSiteCopy";
import "./homeAgencyHeroPanel.css";

const STAGE_NODES = [
  { id: "brief", label: "Brief", x: 12, y: 28 },
  { id: "understand", label: "Understand", x: 31, y: 44 },
  { id: "build", label: "Design / Build", x: 50, y: 28 },
  { id: "review", label: "Review", x: 69, y: 44 },
  { id: "product", label: "Product", x: 88, y: 28 },
] as const;

const SURFACE_LABELS = ["SOFTWARE", "WEB", "MOBILE", "COMMERCE", "CMS"] as const;
const PATH_D =
  "M12 28 C22 28, 24 44, 31 44 C38 44, 42 28, 50 28 C58 28, 62 44, 69 44 C76 44, 80 28, 88 28";

function canUsePointerTilt(): boolean {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return false;
  }
  return (
    window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/**
 * Homepage hero visual — animated delivery system from brief to product.
 */
export default function HomeAgencyHeroPanel() {
  const { homepageV3 } = useSiteCopy();
  const visual = homepageV3.heroVisual;
  const reduceMotion = useReducedMotion();
  const panelRef = useRef<HTMLDivElement | null>(null);
  const frameRef = useRef<number | null>(null);
  const [tiltEnabled, setTiltEnabled] = useState(false);

  useEffect(() => {
    const update = () => setTiltEnabled(canUsePointerTilt());
    update();
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const hoverQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
    motionQuery.addEventListener("change", update);
    hoverQuery.addEventListener("change", update);
    return () => {
      motionQuery.removeEventListener("change", update);
      hoverQuery.removeEventListener("change", update);
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);

  const onPointerMove = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (!tiltEnabled || !panelRef.current) {
        return;
      }
      const { clientX, clientY } = event;
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
      }
      frameRef.current = window.requestAnimationFrame(() => {
        frameRef.current = null;
        const node = panelRef.current;
        if (!node) {
          return;
        }
        const rect = node.getBoundingClientRect();
        if (rect.width < 1 || rect.height < 1) {
          return;
        }
        const x = (clientX - rect.left) / rect.width;
        const y = (clientY - rect.top) / rect.height;
        node.style.setProperty("--hero-tilt-y", `${((x - 0.5) * 5).toFixed(2)}deg`);
        node.style.setProperty("--hero-tilt-x", `${((0.5 - y) * 5).toFixed(2)}deg`);
      });
    },
    [tiltEnabled]
  );

  const onPointerLeave = useCallback(() => {
    if (frameRef.current !== null) {
      window.cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }
    const node = panelRef.current;
    if (!node) {
      return;
    }
    node.style.setProperty("--hero-tilt-x", "0deg");
    node.style.setProperty("--hero-tilt-y", "0deg");
  }, []);

  return (
    <div
      ref={panelRef}
      className="home-hero-panel relative mx-auto w-full max-w-md overflow-hidden rounded-2xl border border-white/12 bg-[#0A1220]/80 p-3.5 shadow-[0_20px_60px_rgba(0,0,0,0.28)] sm:max-w-lg sm:rounded-[1.35rem] sm:p-4 lg:ml-auto lg:mr-0 lg:max-w-none"
      aria-label={visual.ariaLabel}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
    >
      <div
        className="home-hero-panel__glow pointer-events-none absolute inset-0"
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
              className="home-hero-panel__path"
              d={PATH_D}
              fill="none"
              stroke="url(#hero-rail)"
              strokeWidth="0.75"
              strokeLinecap="round"
            />
            {!reduceMotion ? (
              <circle className="home-hero-panel__pulse" r="1.35" fill="#A4F4FD">
                <animateMotion dur="4.8s" begin="1.3s" repeatCount="indefinite" path={PATH_D} />
              </circle>
            ) : null}
            {STAGE_NODES.map((node) => (
              <g key={node.id} className="home-hero-panel__node">
                <circle
                  cx={node.x}
                  cy={node.y}
                  r="3.1"
                  fill="rgba(10,18,32,0.95)"
                  stroke={node.id === "product" ? "rgba(164,244,253,0.95)" : "rgba(0,210,255,0.7)"}
                  strokeWidth={node.id === "product" ? "0.9" : "0.7"}
                />
                <circle cx={node.x} cy={node.y} r="1.05" fill="#00D2FF" />
              </g>
            ))}
          </svg>

          <div className="absolute inset-0 flex flex-col justify-between p-2.5 sm:p-3.5">
            <div className="flex flex-wrap justify-between gap-1.5">
              {STAGE_NODES.map((node) => (
                <span
                  key={node.id}
                  className={`home-hero-panel__chip rounded-md border bg-[#0C111B]/8 px-1.5 py-1 text-[0.58rem] font-semibold text-white/90 backdrop-blur-sm sm:px-2 sm:text-[0.68rem] ${
                    node.id === "product" ? "border-[#A4F4FD]/45 text-[#A4F4FD]" : "border-white/12"
                  }`}
                >
                  {node.label}
                </span>
              ))}
            </div>

            <div className="grid grid-cols-5 gap-1 sm:gap-1.5">
              {SURFACE_LABELS.map((label) => (
                <div
                  key={label}
                  className="home-hero-panel__chip rounded-md border border-white/12 bg-white/[0.045] px-0.5 py-1.5 text-center sm:rounded-lg sm:px-1.5 sm:py-2"
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
