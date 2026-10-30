import React from "react";
import { PrimaryButton, SecondaryButton } from "../Buttons";
import { navigateAppPath, navigateToContact } from "../../App";
import HomeV2ProductFrame from "./HomeV2ProductFrame";
import HomeAgencyHeroPanel from "./HomeAgencyHeroPanel";
import { useHomepageCopy, useHomepageVariant } from "./homepageVariantContext";
import { HOME_AGENCY_SHELL } from "./homeAgencyLayout";

export default function HomeV2Hero() {
  const { hero } = useHomepageCopy();
  const variant = useHomepageVariant();
  const isV3 = variant === "v3";

  const onSecondaryCta = () => {
    if (!isV3) {
      document.getElementById("v2-workflow")?.scrollIntoView({ behavior: "smooth" });
      return;
    }
    navigateAppPath("/services");
  };

  return (
    <section
      id="v2-hero"
      className={
        isV3
          ? "home-agency-hero relative overflow-hidden pt-7 pb-10 max-[340px]:pt-6 max-[340px]:pb-8 sm:pt-9 sm:pb-11 md:pt-12 md:pb-12 lg:pt-14 lg:pb-14"
          : "relative overflow-hidden pt-8 pb-10 max-[340px]:pt-7 max-[340px]:pb-8 sm:pt-10 sm:pb-12 md:pt-14 md:pb-14"
      }
    >
      {isV3 ? (
        <>
          <div
            className="pointer-events-none absolute inset-0 -z-0"
            style={{
              backgroundImage:
                "radial-gradient(700px circle at 18% 12%, rgba(0,210,255,0.10), transparent 55%), radial-gradient(640px circle at 88% 18%, rgba(61,129,227,0.12), transparent 50%)",
            }}
          />
          <div
            className="pointer-events-none absolute inset-0 -z-0 opacity-[0.16]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(164,244,253,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(164,244,253,0.06) 1px, transparent 1px)",
              backgroundSize: "48px 48px",
              maskImage: "linear-gradient(180deg, black 0%, transparent 88%)",
            }}
          />
        </>
      ) : null}

      <div className={HOME_AGENCY_SHELL}>
        <div
          className={
            isV3
              ? "grid items-center gap-7 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:gap-10 xl:gap-12"
              : "grid items-center gap-8 lg:grid-cols-2 lg:gap-12"
          }
        >
          <div
            className={`min-w-0 ${
              isV3 ? "home-agency-hero__copy space-y-3.5 sm:space-y-4" : "space-y-4 sm:space-y-5"
            }`}
          >
            <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-white/14 bg-white/[0.05] px-3 py-1.5 min-[341px]:px-4 min-[341px]:py-2 md:backdrop-blur-md">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#00D2FF] min-[341px]:h-2 min-[341px]:w-2" />
              <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.1em] leading-snug text-[#A4F4FD] min-[341px]:text-xs">
                {hero.eyebrow}
              </span>
            </div>

            <h1
              className={
                isV3
                  ? "hero-title hero-title--agency break-words"
                  : "hero-title max-w-xl break-words"
              }
            >
              {hero.headline}
            </h1>
            <p
              className={
                isV3
                  ? "hero-subtitle text-body md:max-w-lg"
                  : "hero-subtitle text-body max-w-lg text-sm sm:text-base md:text-[1.05rem]"
              }
            >
              {hero.subheadline}
            </p>

            <div
              className={
                isV3
                  ? "home-agency-hero__actions flex w-full flex-row flex-wrap items-stretch gap-2.5 pt-1 max-[359px]:flex-col sm:gap-3.5"
                  : "flex w-full flex-col items-stretch gap-2.5 pt-0.5 min-[390px]:w-auto min-[390px]:flex-row min-[390px]:items-center min-[390px]:gap-3 sm:gap-3.5"
              }
            >
              <PrimaryButton
                onClick={navigateToContact}
                className={
                  isV3
                    ? "home-hero-cta min-w-0 flex-1 whitespace-nowrap px-5 py-3.5 shadow-[0_8px_32px_rgba(255,255,255,0.12)] max-[359px]:w-full sm:flex-none sm:px-8"
                    : "w-full whitespace-nowrap text-sm shadow-[0_8px_32px_rgba(255,255,255,0.12)] min-[390px]:w-auto min-[341px]:px-8 min-[341px]:py-3.5"
                }
              >
                {hero.primaryCta}
              </PrimaryButton>
              <SecondaryButton
                onClick={onSecondaryCta}
                className={
                  isV3
                    ? "home-hero-cta min-w-0 flex-1 whitespace-nowrap px-5 py-3.5 max-[359px]:w-full sm:flex-none sm:px-8"
                    : "w-full whitespace-nowrap text-sm min-[390px]:w-auto min-[341px]:px-8 min-[341px]:py-3.5"
                }
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
