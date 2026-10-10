import React, { useEffect, useState } from "react";
import DeferredMount from "../DeferredMount";
import HomeV2Hero from "./HomeV2Hero";
import HomeV2Trust from "./HomeV2Trust";
import HomeV2ProductOverview from "./HomeV2ProductOverview";
import HomeV2Features from "./HomeV2Features";
import HomeV2Workflow from "./HomeV2Workflow";
import HomeV2Testimonials from "./HomeV2Testimonials";
import HomeV2PricingPreview from "./HomeV2PricingPreview";
import HomeV2Faq from "./HomeV2Faq";
import HomeV2Blog from "./HomeV2Blog";
import HomeV2FinalCta from "./HomeV2FinalCta";
import HomeAgencyServices from "./HomeAgencyServices";
import HomeAgencyValue from "./HomeAgencyValue";
import HomeAgencyProcess from "./HomeAgencyProcess";
import HomeAgencyAbout from "./HomeAgencyAbout";
import ScrollToTopButton from "../ScrollToTopButton";
import { HomepageVariantProvider, type HomepageVariant } from "./homepageVariantContext";
import {
  cancelHomepageSectionScroll,
  readHomepageSectionHash,
  scrollToHomepageSection,
  type HomepageSectionId,
} from "../../lib/homepageSections";

const V2_TITLE = "Home";
const V3_TITLE = "Home";
const V3_DESCRIPTION =
  "Tell us about your project. We will review what you share and follow up with a clear next step.";

function useHomepageMetadata(variant: HomepageVariant) {
  useEffect(() => {
    if (typeof document === "undefined") {
      return;
    }

    const previousTitle = document.title;
    const descriptionTag = document.querySelector('meta[name="description"]');
    const previousDescription = descriptionTag?.getAttribute("content") ?? null;

    if (variant === "v3") {
      document.title = V3_TITLE;
      descriptionTag?.setAttribute("content", V3_DESCRIPTION);
    } else {
      document.title = V2_TITLE;
    }

    // Keep hash targets (e.g. /#process) — do not wipe the pending section scroll.
    if (!readHomepageSectionHash()) {
      window.scrollTo({ top: 0, behavior: "auto" });
    }

    return () => {
      document.title = previousTitle;
      if (variant === "v3" && descriptionTag && previousDescription !== null) {
        descriptionTag.setAttribute("content", previousDescription);
      }
    };
  }, [variant]);
}

function useHomepageSectionNavigation() {
  const [requestedSectionId, setRequestedSectionId] = useState<HomepageSectionId | null>(
    readHomepageSectionHash
  );

  useEffect(() => {
    const syncRequestedSection = () => {
      setRequestedSectionId(readHomepageSectionHash());
    };

    window.addEventListener("popstate", syncRequestedSection);
    window.addEventListener("hashchange", syncRequestedSection);
    return () => {
      window.removeEventListener("popstate", syncRequestedSection);
      window.removeEventListener("hashchange", syncRequestedSection);
    };
  }, []);

  useEffect(() => {
    if (!requestedSectionId) {
      return;
    }

    // F9: product pricing section removed from Homepage V3 — send hash traffic to Contact.
    if (requestedSectionId === "pricing") {
      window.history.replaceState({}, "", "/contact");
      window.dispatchEvent(new PopStateEvent("popstate"));
      return;
    }

    let cancelled = false;
    let frameId = 0;
    let attempts = 0;
    const maxAttempts = 180;

    const isReadyToScroll = () => {
      const hasTarget = !!document.querySelector(
        `[data-homepage-scroll-ref="${requestedSectionId}"]`
      );
      if (!hasTarget) {
        return false;
      }
      if (!document.querySelector("main h1")) {
        return false;
      }
      return true;
    };

    const tick = () => {
      if (cancelled) {
        return;
      }

      if (isReadyToScroll()) {
        frameId = window.requestAnimationFrame(() => {
          if (cancelled) {
            return;
          }
          scrollToHomepageSection(requestedSectionId);
        });
        return;
      }

      if (attempts >= maxAttempts) {
        return;
      }
      attempts += 1;
      frameId = window.requestAnimationFrame(tick);
    };

    frameId = window.requestAnimationFrame(tick);
    return () => {
      cancelled = true;
      window.cancelAnimationFrame(frameId);
      cancelHomepageSectionScroll();
    };
  }, [requestedSectionId]);

  return requestedSectionId;
}

function sectionRootMargin(requestedSectionId: HomepageSectionId | null) {
  // When any homepage hash is requested, expand all DeferredMount roots so
  // sections above the target mount before the scroll — prevents mid-scroll
  // layout shifts that look like shaking.
  return requestedSectionId ? "10000px" : "0px";
}

/**
 * Homepage V2 layout (preserved in-repo; not publicly routed).
 * Production Homepage V3 reuses this page with `variant="v3"` at `/`.
 *
 * Flow (V2): Hero → Trust → Product → Features → Workflow → Proof → Pricing → FAQ → Blog → CTA
 * Flow (V3 / F4 agency): Hero → Services → Value → Process → About preview → Final CTA
 * Unverified trust, work, pricing, FAQ, and product surfaces are omitted on V3.
 */
export default function HomepageV2Page({ variant = "v2" }: { variant?: HomepageVariant }) {
  useHomepageMetadata(variant);
  const requestedSectionId = useHomepageSectionNavigation();
  const isV3 = variant === "v3";

  return (
    <HomepageVariantProvider variant={variant}>
      <main className="min-w-0 flex-grow overflow-x-hidden">
        {/*
          Keep DeferredMount wrappers stable. Swapping them for eager trees on
          hash click remounts Hero and moves section targets after scroll.
        */}
        <DeferredMount rootMargin={sectionRootMargin(requestedSectionId)} minHeight="24rem">
          <HomeV2Hero />
        </DeferredMount>

        {isV3 ? (
          <>
            <DeferredMount rootMargin={sectionRootMargin(requestedSectionId)} minHeight="10rem">
              <HomeAgencyServices />
            </DeferredMount>

            <DeferredMount rootMargin={sectionRootMargin(requestedSectionId)} minHeight="16rem">
              <HomeAgencyValue />
            </DeferredMount>

            <DeferredMount rootMargin={sectionRootMargin(requestedSectionId)} minHeight="14rem">
              <HomeAgencyProcess />
            </DeferredMount>

            <DeferredMount rootMargin={sectionRootMargin(requestedSectionId)} minHeight="12rem">
              <HomeAgencyAbout />
            </DeferredMount>
          </>
        ) : (
          <>
            <DeferredMount rootMargin={sectionRootMargin(requestedSectionId)} minHeight="6rem">
              <HomeV2Trust />
            </DeferredMount>

            <DeferredMount rootMargin={sectionRootMargin(requestedSectionId)} minHeight="20rem">
              <HomeV2ProductOverview />
            </DeferredMount>

            <DeferredMount rootMargin={sectionRootMargin(requestedSectionId)} minHeight="18rem">
              <HomeV2Features />
            </DeferredMount>

            <DeferredMount rootMargin={sectionRootMargin(requestedSectionId)} minHeight="12rem">
              <HomeV2Workflow />
            </DeferredMount>

            <HomeV2Testimonials />

            <DeferredMount rootMargin={sectionRootMargin(requestedSectionId)} minHeight="16rem">
              <HomeV2PricingPreview />
            </DeferredMount>

            <DeferredMount rootMargin="0px" minHeight="14rem">
              <HomeV2Faq />
            </DeferredMount>

            <DeferredMount rootMargin="0px" minHeight="18rem">
              <HomeV2Blog />
            </DeferredMount>
          </>
        )}

        <DeferredMount rootMargin="0px" minHeight="12rem">
          <HomeV2FinalCta />
        </DeferredMount>
      </main>
      {!isV3 ? <ScrollToTopButton /> : null}
    </HomepageVariantProvider>
  );
}
