import React, { useEffect } from "react";
import { Construction } from "lucide-react";
import SectionEyebrow from "./SectionEyebrow";
import BackToHomepage from "./BackToHomepage";
import { PrimaryButton } from "./Buttons";
import DeferredMount from "./DeferredMount";
import PlatformOverviewStrip from "./PlatformOverviewStrip";
import PlatformCapabilities from "./PlatformCapabilities";
import FinalCTA from "./FinalCTA";
import { useSiteCopy } from "../lib/useSiteCopy";
import { navigateToContact } from "../App";
import "./platformPage.css";

function usePlatformPageMetadata(documentTitle: string) {
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

function PlatformUnderConstructionIllustration({ ariaLabel }: { ariaLabel: string }) {
  return (
    <div
      className="relative mx-auto w-full max-w-md aspect-[4/3] rounded-2xl border border-white/12 bg-[#0a0e16]/80 overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.35)]"
      aria-hidden="true"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-brand/10 via-transparent to-accent/10" />
      <svg
        viewBox="0 0 400 300"
        className="relative z-10 h-full w-full"
        role="img"
        aria-label={ariaLabel}
      >
        <defs>
          <linearGradient id="platform-sky" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#121a27" />
            <stop offset="100%" stopColor="#080B12" />
          </linearGradient>
          <linearGradient id="platform-glow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3D81E3" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#00D2FF" stopOpacity="0.2" />
          </linearGradient>
        </defs>

        <rect width="400" height="300" fill="url(#platform-sky)" />
        <rect x="0" y="230" width="400" height="70" fill="#070a10" />
        <rect x="0" y="228" width="400" height="4" fill="#3D81E3" opacity="0.35" />

        <g opacity="0.25">
          <rect x="40" y="60" width="120" height="8" rx="4" fill="#A4F4FD" />
          <rect x="40" y="78" width="90" height="8" rx="4" fill="#ffffff" />
          <rect x="40" y="96" width="105" height="8" rx="4" fill="#ffffff" />
        </g>

        <g>
          <rect
            x="155"
            y="170"
            width="90"
            height="58"
            rx="6"
            fill="#1a2438"
            stroke="#3D81E3"
            strokeWidth="2"
          />
          <rect x="168" y="183" width="64" height="10" rx="3" fill="url(#platform-glow)" />
          <rect x="168" y="200" width="48" height="8" rx="2" fill="#ffffff" opacity="0.35" />
          <rect x="168" y="214" width="56" height="8" rx="2" fill="#ffffff" opacity="0.25" />
        </g>

        <g stroke="#A4F4FD" strokeWidth="3" strokeLinecap="round">
          <line x1="70" y1="228" x2="70" y2="70" />
          <line x1="70" y1="70" x2="250" y2="70" />
          <line x1="250" y1="70" x2="250" y2="228" />
          <line x1="70" y1="70" x2="250" y2="70" />
        </g>

        <g>
          <line x1="250" y1="70" x2="250" y2="145" stroke="#ffffff" strokeWidth="2" />
          <line x1="250" y1="145" x2="200" y2="175" stroke="#00D2FF" strokeWidth="2.5" />
          <polygon points="198,178 206,178 202,186" fill="#00D2FF" />
          <rect x="188" y="168" width="34" height="18" rx="3" fill="#3D81E3" opacity="0.85" />
        </g>

        <g opacity="0.5">
          <circle cx="320" cy="52" r="18" fill="#3D81E3" opacity="0.2" />
          <text x="320" y="58" textAnchor="middle" fontSize="20">
            🏗️
          </text>
        </g>

        <g>
          <rect
            x="285"
            y="185"
            width="78"
            height="43"
            rx="5"
            fill="#121a27"
            stroke="#ffffff"
            strokeOpacity="0.15"
          />
          <rect x="295" y="196" width="58" height="7" rx="2" fill="#3D81E3" opacity="0.6" />
          <rect x="295" y="209" width="42" height="6" rx="2" fill="#ffffff" opacity="0.3" />
          <rect x="295" y="220" width="50" height="6" rx="2" fill="#ffffff" opacity="0.2" />
        </g>
      </svg>
    </div>
  );
}

/**
 * Platform page flow (Homepage V3 philosophy, existing UI):
 * What it is → How it works → What you get → Start the conversation.
 */
export default function PlatformPage() {
  const { platformPage, common } = useSiteCopy();
  usePlatformPageMetadata(platformPage.documentTitle || "Platform");

  return (
    <main className="flex-grow overflow-x-hidden min-w-0" id="platform-page">
      <div className="w-full min-w-0 max-w-7xl mx-auto px-3 min-[341px]:px-4 sm:px-6 py-8 max-[340px]:py-7 sm:py-12 md:py-16">
        <BackToHomepage label={platformPage.backHome} />

        <div className="flex flex-col gap-8 sm:gap-10 md:gap-12">
          <section className="liquid-glass relative overflow-hidden rounded-2xl sm:rounded-3xl border border-white/14 bg-white/[0.04] px-4 min-[341px]:px-5 sm:px-8 md:px-10 py-6 sm:py-8 md:py-9">
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-center">
              <div className="space-y-3 sm:space-y-4">
                <SectionEyebrow label={platformPage.eyebrowLabel} tag={platformPage.eyebrowTag} />

                <div className="space-y-2.5 sm:space-y-3">
                  <h1 className="hero-title text-white">{platformPage.title}</h1>
                  <p className="text-body text-sm sm:text-base md:text-lg leading-relaxed max-w-xl">
                    {platformPage.subtitle}
                  </p>
                </div>

                <div className="inline-flex items-start gap-3 rounded-xl border border-amber-400/25 bg-amber-400/10 px-3.5 py-2.5 text-sm text-amber-100/95 leading-snug max-w-xl">
                  <Construction className="w-4 h-4 shrink-0 mt-0.5 text-amber-300" />
                  <p>{platformPage.statusNote}</p>
                </div>

                <div className="space-y-3">
                  <p className="text-sm sm:text-base text-muted leading-snug max-w-lg">
                    {platformPage.ctaLead}
                  </p>
                  <PrimaryButton onClick={() => navigateToContact()} className="w-full sm:w-auto">
                    {platformPage.primaryCta}
                  </PrimaryButton>
                </div>
              </div>

              <PlatformUnderConstructionIllustration
                ariaLabel={platformPage.illustrationAriaLabel || common.brand}
              />
            </div>
          </section>
        </div>
      </div>

      {/* Overview strip must stay mounted for E2E (jump-scroll can skip DeferredMount). */}
      <PlatformOverviewStrip showCta={false} />

      <DeferredMount
        rootMargin="0px"
        minHeight="24rem"
        className="platform-page__capabilities-mount"
      >
        <PlatformCapabilities />
      </DeferredMount>

      <DeferredMount rootMargin="0px" minHeight="16rem" className="platform-page__final-cta-host">
        <FinalCTA className="platform-page__final-cta" />
      </DeferredMount>
    </main>
  );
}
