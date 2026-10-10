import React from "react";
import { PrimaryButton, SecondaryButton } from "../Buttons";
import { navigateToContact } from "../../App";
import HomeV2ProductFrame from "./HomeV2ProductFrame";
import HomeAgencyHeroPanel from "./HomeAgencyHeroPanel";
import { useHomepageCopy, useHomepageVariant } from "./homepageVariantContext";
import { scrollToHomepageSection } from "../../lib/homepageSections";

export default function HomeV2Hero() {
  const { hero } = useHomepageCopy();
  const variant = useHomepageVariant();
  const isV3 = variant === "v3";

  const scrollToSecondarySection = () => {
    if (isV3) {
      scrollToHomepageSection("process");
      return;
    }
    document.getElementById("v2-workflow")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="v2-hero"
      className="relative overflow-hidden pt-8 pb-10 max-[340px]:pt-7 max-[340px]:pb-8 sm:pt-12 sm:pb-14 md:pt-16 md:pb-16"
    >
      <div className="relative z-10 mx-auto w-full min-w-0 max-w-7xl px-3 min-[341px]:px-4 sm:px-6">
        <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
          <div className="min-w-0 space-y-4 sm:space-y-5">
            <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-white/14 bg-white/[0.05] px-3 py-1.5 min-[341px]:px-4 min-[341px]:py-2 md:backdrop-blur-md">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#00D2FF] min-[341px]:h-2 min-[341px]:w-2" />
              <span className="text-[0.625rem] font-semibold uppercase tracking-wide leading-snug text-[#A4F4FD] min-[341px]:text-xs">
                {hero.eyebrow}
              </span>
            </div>

            <h1 className="hero-title max-w-xl break-words">{hero.headline}</h1>
            <p className="hero-subtitle text-body max-w-md text-sm sm:text-base md:text-[1.05rem]">
              {hero.subheadline}
            </p>

            <div className="flex w-full flex-col items-stretch gap-2.5 pt-1 sm:w-auto sm:flex-row sm:items-center sm:gap-4">
              <PrimaryButton
                onClick={navigateToContact}
                className="w-full text-sm shadow-[0_8px_32px_rgba(255,255,255,0.12)] sm:w-auto min-[341px]:px-8 min-[341px]:py-3.5"
              >
                {hero.primaryCta}
              </PrimaryButton>
              <SecondaryButton
                onClick={scrollToSecondarySection}
                className="w-full text-sm sm:w-auto min-[341px]:px-8 min-[341px]:py-3.5"
              >
                {hero.secondaryCta}
              </SecondaryButton>
            </div>
          </div>

          <div className={`relative min-w-0 ${isV3 ? "" : "lg:pl-2"}`}>
            {isV3 ? (
              <HomeAgencyHeroPanel />
            ) : (
              <HomeV2ProductFrame
                badge={hero.previewBadge}
                title={hero.previewTitle}
                metrics={hero.previewRows}
                progressLabel="Ready to send"
                progressValue="70%"
                progressPercent={70}
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
