import React from "react";
import DeferredMount from "./DeferredMount";
import MainProductMockup from "./MainProductMockup";
import ProofBand from "./ProofBand";
import Hero from "./Hero";
import PlatformOverviewStrip from "./PlatformOverviewStrip";
import Capabilities from "./Capabilities";
import SectorGrid from "./SectorGrid";
import HowItWorks from "./HowItWorks";
import DataQuality from "./DataQuality";
import PricingSection from "./PricingSection";
import ProductDemoSection from "./ProductDemoSection";
import TestimonialsSection from "./TestimonialsSection";
import BookDemoSection from "./BookDemoSection";
import FAQ from "./FAQ";
import FinalCTA from "./FinalCTA";
import Footer from "./Footer";
import ContactPage from "./ContactPage";

/**
 * Preserved Homepage V1 implementation (not publicly routed).
 * Production serves Homepage V3 at `/`. The public Workflow page at `/workflow`
 * reuses this section flow under the production App shell.
 */
export default function HomepageV1Page() {
  return (
    <>
      <main className="flex-grow overflow-x-hidden min-w-0">
        <DeferredMount rootMargin="0px" minHeight="28rem">
          <Hero id="hero" />
        </DeferredMount>

        <DeferredMount rootMargin="0px" minHeight="10rem">
          <ProofBand />
        </DeferredMount>

        <div id="platform">
          <DeferredMount rootMargin="0px" minHeight="12rem">
            <PlatformOverviewStrip />
          </DeferredMount>

          <DeferredMount rootMargin="0px" minHeight="24rem">
            <Capabilities />
          </DeferredMount>
        </div>

        <DeferredMount rootMargin="0px" minHeight="28rem">
          <MainProductMockup />
        </DeferredMount>

        <DeferredMount rootMargin="0px" minHeight="28rem">
          <ProductDemoSection />
        </DeferredMount>

        <DeferredMount rootMargin="0px" minHeight="24rem">
          <HowItWorks />
        </DeferredMount>

        <DeferredMount rootMargin="0px" minHeight="28rem">
          <SectorGrid />
        </DeferredMount>

        <DeferredMount rootMargin="0px" minHeight="28rem">
          <DataQuality />
        </DeferredMount>

        <DeferredMount rootMargin="0px" minHeight="28rem">
          <PricingSection />
        </DeferredMount>

        <DeferredMount rootMargin="0px" minHeight="28rem">
          <TestimonialsSection />
        </DeferredMount>

        <DeferredMount rootMargin="0px" minHeight="16rem">
          <BookDemoSection />
        </DeferredMount>

        <DeferredMount rootMargin="0px" minHeight="24rem">
          <FAQ />
        </DeferredMount>

        <DeferredMount rootMargin="0px" minHeight="16rem">
          <FinalCTA />
        </DeferredMount>

        <DeferredMount rootMargin="0px" minHeight="32rem">
          <ContactPage embedded />
        </DeferredMount>
      </main>

      <DeferredMount rootMargin="0px" minHeight="32rem">
        <Footer />
      </DeferredMount>
    </>
  );
}
