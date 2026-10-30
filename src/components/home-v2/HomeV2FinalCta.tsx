import React from "react";
import SectionEyebrow from "../SectionEyebrow";
import { PrimaryButton, SecondaryButton } from "../Buttons";
import { navigateAppPath, navigateToContact } from "../../App";
import { useHomepageCopy, useHomepageVariant } from "./homepageVariantContext";
import { HOME_AGENCY_SHELL } from "./homeAgencyLayout";

export default function HomeV2FinalCta() {
  const { finalCta } = useHomepageCopy();
  const variant = useHomepageVariant();
  const isV3 = variant === "v3";
  const secondaryCta =
    "secondaryCta" in finalCta && typeof finalCta.secondaryCta === "string"
      ? finalCta.secondaryCta
      : null;
  const eyebrow =
    "eyebrow" in finalCta && typeof finalCta.eyebrow === "string" ? finalCta.eyebrow : null;

  return (
    <section
      id="v2-final-cta"
      className={
        isV3
          ? "relative overflow-hidden py-14 sm:py-14 md:py-16"
          : "relative mx-auto min-w-0 max-w-7xl overflow-hidden px-3 py-14 max-[340px]:py-12 min-[341px]:px-4 sm:px-6 sm:py-16 md:py-20"
      }
    >
      <div className={isV3 ? HOME_AGENCY_SHELL : undefined}>
        <div
          className={`liquid-glass cta-glow-panel relative overflow-hidden rounded-2xl border border-white/14 bg-white/[0.04] text-center ${
            isV3
              ? "px-4 py-8 max-[340px]:px-3.5 max-[340px]:py-7 sm:rounded-3xl sm:px-8 sm:py-11 md:px-10 md:py-12"
              : "px-4 py-10 max-[340px]:px-3 max-[340px]:py-9 sm:rounded-3xl sm:px-8 sm:py-12 md:px-12 md:py-14"
          }`}
        >
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-full"
            style={{
              backgroundImage:
                "radial-gradient(820px circle at 50% -10%, rgba(61,129,227,0.20), rgba(0,210,255,0.05) 45%, transparent 75%), linear-gradient(rgba(164,244,253,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(164,244,253,0.035) 1px, transparent 1px)",
              backgroundSize: "auto, 36px 36px, 36px 36px",
            }}
          />

          <div
            className={`relative z-10 mx-auto max-w-xl ${
              isV3 ? "space-y-3.5 md:space-y-5" : "space-y-5 md:space-y-6"
            }`}
          >
            {isV3 && eyebrow ? (
              <div className="flex justify-center">
                <SectionEyebrow label={eyebrow} />
              </div>
            ) : null}
            <h2 className={`section-title${isV3 ? " text-balance" : ""}`}>{finalCta.title}</h2>
            <p
              className={
                isV3
                  ? "home-agency-lede mx-auto max-w-md text-pretty"
                  : "text-body text-[0.95rem] leading-relaxed text-white/70 md:text-base"
              }
            >
              {finalCta.subtitle}
            </p>

            <div
              className={
                isV3
                  ? "flex w-full flex-row flex-wrap items-stretch justify-center gap-2.5 pt-0.5 max-[359px]:flex-col sm:gap-3"
                  : "flex flex-col items-stretch justify-center gap-2.5 pt-0.5 min-[390px]:flex-row min-[390px]:items-center min-[390px]:gap-3"
              }
            >
              <PrimaryButton
                onClick={navigateToContact}
                className={
                  isV3
                    ? "home-hero-cta min-w-0 flex-1 whitespace-nowrap px-5 py-3.5 max-[359px]:w-full sm:flex-none sm:px-8"
                    : "w-full whitespace-nowrap px-8 py-3.5 min-[390px]:w-auto"
                }
              >
                {finalCta.primaryCta}
              </PrimaryButton>
              {isV3 && secondaryCta ? (
                <SecondaryButton
                  onClick={() => navigateAppPath("/services")}
                  className="home-hero-cta min-w-0 flex-1 whitespace-nowrap px-5 py-3.5 max-[359px]:w-full sm:flex-none sm:px-8"
                >
                  {secondaryCta}
                </SecondaryButton>
              ) : null}
            </div>

            {"footnote" in finalCta && Array.isArray(finalCta.footnote) && finalCta.footnote[0] ? (
              <div className="flex flex-wrap items-center justify-center gap-2 text-xs uppercase tracking-wide text-subtle">
                <span>{finalCta.footnote[0]}</span>
                {finalCta.footnote[1] ? (
                  <>
                    <span className="text-white/20">//</span>
                    <span>{finalCta.footnote[1]}</span>
                  </>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
