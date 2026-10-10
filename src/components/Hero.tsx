import React from "react";
import { PrimaryButton, SecondaryButton } from "./Buttons";
import { useSiteCopy } from "../lib/useSiteCopy";
import { navigateToContact, navigateToSection } from "../App";

export default function Hero({ id = "platform" }: { id?: string }) {
  const { hero } = useSiteCopy();

  const scrollToWorkflow = () => {
    navigateToSection("workflow");
  };

  return (
    <section
      className="relative overflow-hidden pt-8 max-[340px]:pt-7 sm:pt-12 md:pt-16 pb-7 max-[340px]:pb-6 sm:pb-10 md:pb-14 text-left min-h-[calc(100svh-4.25rem)] min-[341px]:min-h-[calc(100svh-5rem)] flex items-center"
      id={id}
    >
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[min(720px,130vw)] h-[min(420px,75vw)] rounded-full bg-gradient-to-r from-[#3D81E3]/18 to-transparent blur-[48px] md:blur-[100px] pointer-events-none z-0 motion-reduce:hidden" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[min(620px,115vw)] h-[min(320px,55vw)] rounded-full bg-gradient-to-r from-[#7C3AED]/12 to-transparent blur-[40px] md:blur-[90px] pointer-events-none z-0 motion-reduce:hidden" />

      <div className="relative max-w-7xl mx-auto px-3 min-[341px]:px-4 sm:px-6 w-full min-w-0 z-10">
        <div className="flex flex-col items-start text-left space-y-4 max-[340px]:space-y-3.5 sm:space-y-5 md:space-y-7 min-w-0 w-full">
          <div className="inline-flex items-center gap-2 max-[340px]:gap-1.5 px-3 max-[340px]:px-2.5 min-[341px]:px-4 py-1.5 max-[340px]:py-1 min-[341px]:py-2 rounded-full border border-white/14 bg-white/[0.05] md:backdrop-blur-md premium-glow-badge max-w-full">
            <span className="w-1.5 h-1.5 min-[341px]:w-2 min-[341px]:h-2 rounded-full bg-[#00D2FF] shrink-0" />
            <span className="text-[0.625rem] min-[341px]:text-xs font-semibold tracking-wide text-[#A4F4FD] uppercase leading-snug">
              {hero.eyebrow}
            </span>
          </div>

          <h1 className="hero-title max-w-full min-[341px]:max-w-2xl md:max-w-[22ch] lg:max-w-none break-words">
            <span>{hero.headlineLead} </span>
            <span className="hero-gradient-text select-none inline-block md:block font-black">
              {hero.headlineAccent}
            </span>
          </h1>

          <p className="hero-subtitle text-body max-w-xl">{hero.subheadline}</p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 max-[340px]:gap-2 sm:gap-4 w-full sm:w-auto pt-1">
            <PrimaryButton
              onClick={navigateToContact}
              className="w-full sm:w-auto text-sm max-[340px]:py-3 max-[340px]:px-5 min-[341px]:py-3.5 min-[341px]:px-8 shadow-[0_8px_32px_rgba(255,255,255,0.12)]"
            >
              {hero.primaryCta}
            </PrimaryButton>
            <SecondaryButton
              onClick={scrollToWorkflow}
              className="w-full sm:w-auto text-sm max-[340px]:py-3 max-[340px]:px-5 min-[341px]:py-3.5 min-[341px]:px-8"
            >
              {hero.secondaryCta}
            </SecondaryButton>
          </div>

          <div className="w-full pt-6 border-t border-white/[0.1] space-y-3">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5 max-[340px]:gap-y-1 text-xs min-[341px]:text-sm font-medium text-white/70">
              {(hero.processLine ?? []).map((step, index) => (
                <React.Fragment key={step}>
                  {index > 0 ? <span className="text-white/25">·</span> : null}
                  <span>{step}</span>
                </React.Fragment>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-2 text-xs text-white/70">
              {(hero.pills ?? []).map((pill) => (
                <span key={pill} className="status-pill">
                  {pill}
                </span>
              ))}
            </div>
            <p className="text-white/65 text-sm md:text-[15px] leading-relaxed max-w-lg">
              {hero.proofLine}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
