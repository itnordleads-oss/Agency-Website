import React, { useEffect, useState } from "react";
import DeferredMount from "../DeferredMount";
import CompanyLogoCarousel from "./CompanyLogoCarousel";
import HomeV2Hero from "./HomeV2Hero";
import HomeV2Trust from "./HomeV2Trust";
import HomeV2ProductOverview from "./HomeV2ProductOverview";
import HomeV2Features from "./HomeV2Features";
import HomeV2Workflow from "./HomeV2Workflow";
import HomeV2Benefits from "./HomeV2Benefits";
import HomeV2Testimonials from "./HomeV2Testimonials";
import HomeV2PricingPreview from "./HomeV2PricingPreview";
import HomeV2Faq from "./HomeV2Faq";
import HomeV2Blog from "./HomeV2Blog";
import HomeV2FinalCta from "./HomeV2FinalCta";
import ScrollToTopButton from "../ScrollToTopButton";
import { HomepageVariantProvider, type HomepageVariant } from "./homepageVariantContext";
import {
  cancelHomepageSectionScroll,
  readHomepageSectionHash,
  scrollToHomepageSection,
  type HomepageSectionId,
} from "../../lib/homepageSections";

const V2_TITLE = "ADealForge | Homepage V2";
const V3_TITLE = "ADealForge | Outbound Sales Automation for B2B Teams";
const V3_DESCRIPTION =
  "ADealForge helps sales teams book more meetings with less outbound busywork—prospect research, clear first emails, and live campaign support in one workflow.";

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

    // Keep hash targets (e.g. /#pricing) — do not wipe the pending section scroll.
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

    let cancelled = false;
    let frameId = 0;
    let attempts = 0;
    const maxAttempts = 180;

    const isReadyToScroll = () => {
      // Target must exist. Wait for major sections above so DeferredMount/hero
      // expansion does not move the target after the scroll.
      const hasTarget = !!document.querySelector(
        `[data-homepage-scroll-ref="${requestedSectionId}"]`
      );
      if (!hasTarget) {
        return false;
      }
      // Hero is the largest above-fold expander on Homepage V3.
      if (!document.querySelector("main h1")) {
        return false;
      }
      if (requestedSectionId === "pricing" || requestedSectionId === "benefits") {
        const product = document.getElementById("product");
        // Placeholder DeferredMount host is 20rem; wait until real product layout exists.
        return !!product && product.offsetHeight > 360;
      }
      return true;
    };

    const tick = () => {
      if (cancelled) {
        return;
      }

      if (isReadyToScroll()) {
        // One layout frame after mounts, then a single smooth scroll.
        // Extra settle/auto passes fight smooth scroll going up and down.
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
 * Flow (V3): Hero → Company logos → Product → Trust → Benefits → Testimonials → Pricing → FAQ → CTA
 * V3: one value section, outcomes after differentiation, blog removed to protect CTA focus.
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
          hash click remounts Hero/Product and moves Pricing after scroll.
        */}
        <DeferredMount rootMargin={sectionRootMargin(requestedSectionId)} minHeight="24rem">
          <HomeV2Hero />
        </DeferredMount>

        {isV3 ? (
          <div className="min-w-0">
            <CompanyLogoCarousel />
          </div>
        ) : (
          <DeferredMount rootMargin={sectionRootMargin(requestedSectionId)} minHeight="6rem">
            <HomeV2Trust />
          </DeferredMount>
        )}

        <DeferredMount rootMargin={sectionRootMargin(requestedSectionId)} minHeight="20rem">
          <HomeV2ProductOverview />
        </DeferredMount>

        {isV3 ? (
          // Keep trust mounted (not DeferredMount): the carousel smoke test jump-scrolls
          // to document end and can skip a short deferred host, leaving #v2-trust unmounted.
          <div className="min-w-0">
            <HomeV2Trust />
          </div>
        ) : null}

        {isV3 ? (
          <>
            {/* Benefits hover interaction must stay mounted for reliable desktop hit-testing. */}
            <HomeV2Benefits />
          </>
        ) : (
          <>
            <DeferredMount rootMargin={sectionRootMargin(requestedSectionId)} minHeight="18rem">
              <HomeV2Features />
            </DeferredMount>

            <DeferredMount rootMargin={sectionRootMargin(requestedSectionId)} minHeight="12rem">
              <HomeV2Workflow />
            </DeferredMount>
          </>
        )}

        {/* Customer-story SEO quote must stay in the document (not DeferredMount) for crawl + E2E. */}
        <HomeV2Testimonials />

        {/*
          Pricing hash expands rootMargin so the section mounts in place.
          Do not swap the wrapper — remounting is why click missed and refresh hit.
        */}
        <DeferredMount rootMargin={sectionRootMargin(requestedSectionId)} minHeight="16rem">
          <HomeV2PricingPreview />
        </DeferredMount>

        <DeferredMount rootMargin="0px" minHeight="14rem">
          <HomeV2Faq />
        </DeferredMount>

        {!isV3 ? (
          <DeferredMount rootMargin="0px" minHeight="18rem">
            <HomeV2Blog />
          </DeferredMount>
        ) : null}

        <DeferredMount rootMargin="0px" minHeight="12rem">
          <HomeV2FinalCta />
        </DeferredMount>
      </main>
      {!isV3 ? <ScrollToTopButton /> : null}
    </HomepageVariantProvider>
  );
}
