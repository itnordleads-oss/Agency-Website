/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import DeferredMount from "./components/DeferredMount";
import FloatingEmailButton from "./components/FloatingEmailButton";
import FloatingScheduleMeeting from "./components/FloatingScheduleMeeting";
import Footer from "./components/Footer";
import PageBackground from "./components/PageBackground";
import TermsPage from "./components/TermsPage";
import ContactPage from "./components/ContactPage";
import PlatformPage from "./components/PlatformPage";
import WorkflowPage from "./components/WorkflowPage";
import ServicesPage from "./components/ServicesPage";
import AboutPage from "./components/AboutPage";
import HomepageV3Page from "./components/home-v2/HomepageV3Page";
import {
  getHomepageSectionHref,
  requestInstantHomepageSectionScroll,
  resolveHomepageSectionId,
  scrollToHomepageSection,
} from "./lib/homepageSections";
import { getStudioNavHref } from "./lib/studioNavigation";

/**
 * Legacy preview URLs — redirected to production `/` (Homepage V3).
 * Homepage V1 (`HomepageV1Page.tsx`) and Homepage V2 (`home-v2/HomepageV2Page.tsx`)
 * source remain in the repo; V2 layout is reused by V3.
 * Product `/platform` and `/workflow` remain routable until F9 retirement.
 */
const LEGACY_HOMEPAGE_PATHS = new Set(["/homepage-v1", "/homepage-v2", "/homepage-v3"]);

function normalizePath(pathname: string) {
  return pathname.replace(/\/+$/, "") || "/";
}

function isLegacyHomepagePath(pathname: string) {
  return LEGACY_HOMEPAGE_PATHS.has(normalizePath(pathname));
}

/** Resolve the public path, rewriting retired homepage URLs to `/`. */
export function resolvePublicPath(pathname: string) {
  const path = normalizePath(pathname);
  return isLegacyHomepagePath(path) ? "/" : path;
}

/**
 * Soft client-side navigation helper for TermsPage / in-app links when needed.
 * Legacy homepage paths always resolve to production `/`.
 */
export function navigateAppPath(path: string) {
  const next = resolvePublicPath(path);
  if (typeof window === "undefined") {
    return;
  }
  if (normalizePath(window.location.pathname) === next) {
    return;
  }
  window.history.pushState({}, "", next);
  window.dispatchEvent(new PopStateEvent("popstate"));
}

function replaceAppPath(path: string) {
  const next = resolvePublicPath(path);
  if (typeof window === "undefined") {
    return;
  }
  if (normalizePath(window.location.pathname) === next) {
    return;
  }
  window.history.replaceState({}, "", next);
  window.dispatchEvent(new PopStateEvent("popstate"));
}

export function navigateToSection(targetId: string) {
  if (targetId === "contact") {
    navigateAppPath("/contact");
    return;
  }

  if (targetId === "services") {
    navigateAppPath(getStudioNavHref("services"));
    return;
  }

  if (targetId === "about") {
    navigateAppPath(getStudioNavHref("about"));
    return;
  }

  if (targetId === "work") {
    navigateAppPath(getStudioNavHref("work"));
    return;
  }

  if (targetId === "platform") {
    navigateAppPath("/platform");
    return;
  }

  if (targetId === "workflow") {
    const currentPath = resolvePublicPath(window.location.pathname);
    if (currentPath === "/workflow") {
      document.getElementById("workflow")?.scrollIntoView({ behavior: "smooth" });
      return;
    }
    navigateAppPath("/workflow");
    window.setTimeout(() => {
      document.getElementById("workflow")?.scrollIntoView({ behavior: "smooth" });
    }, 50);
    return;
  }

  // Home / retired homepage nav ids → production Homepage V3 at `/`.
  if (
    targetId === "home" ||
    targetId === "homepage-v1" ||
    targetId === "homepage-v2" ||
    targetId === "homepage-v3"
  ) {
    navigateAppPath("/");
    return;
  }

  const homepageSectionId = resolveHomepageSectionId(targetId);
  if (homepageSectionId) {
    if (typeof window === "undefined") {
      return;
    }

    const href = getHomepageSectionHref(homepageSectionId);
    const isCurrentTarget =
      resolvePublicPath(window.location.pathname) === "/" &&
      window.location.hash === `#${homepageSectionId}`;

    if (!isCurrentTarget) {
      // Cross-route → /#section: mark the pending hash so homepage scroll owns it.
      if (resolvePublicPath(window.location.pathname) !== "/") {
        requestInstantHomepageSectionScroll(homepageSectionId);
      }
      // Update hash/history only. HomepageV2Page is the single scroll owner for
      // hash/popstate (avoids competing scrolls that shake Pricing navigation).
      window.history.pushState({}, "", href);
      window.dispatchEvent(new PopStateEvent("popstate"));
      return;
    }

    // Same hash clicked again: hashchange/popstate will not re-fire, so scroll once.
    let attempts = 0;
    const tryScroll = () => {
      if (scrollToHomepageSection(homepageSectionId) || attempts >= 120) {
        return;
      }
      attempts += 1;
      window.requestAnimationFrame(tryScroll);
    };
    window.requestAnimationFrame(tryScroll);
    return;
  }

  const currentPath = resolvePublicPath(window.location.pathname);
  // Non-navigation anchors may still scroll in place on the homepage or Workflow.
  if (currentPath === "/" || currentPath === "/workflow") {
    document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth" });
    return;
  }

  navigateAppPath("/");
  window.setTimeout(() => {
    document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth" });
  }, 50);
}

export function navigateToContact() {
  navigateAppPath("/contact");
}

export function navigateToServices() {
  navigateAppPath(getStudioNavHref("services"));
}

export function navigateToAbout() {
  navigateAppPath(getStudioNavHref("about"));
}

export function navigateToPlatform() {
  navigateAppPath("/platform");
}

export function navigateToWorkflow() {
  const currentPath = resolvePublicPath(window.location.pathname);
  if (currentPath === "/workflow") {
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }
  navigateAppPath("/workflow");
}

/** Production homepage is Homepage V3 at `/`. */
export function isHomepageV3Path(pathname: string) {
  return resolvePublicPath(pathname) === "/";
}

function getInitialPublicPath() {
  if (typeof window === "undefined") {
    return "/";
  }

  const path = normalizePath(window.location.pathname);
  if (isLegacyHomepagePath(path)) {
    window.history.replaceState({}, "", "/");
    return "/";
  }

  return path;
}

export default function App() {
  const [path, setPath] = useState(getInitialPublicPath);
  const isTermsPage = path === "/terms";
  const isContactPage = path === "/contact";
  const isServicesPage = path === "/services";
  const isAboutPage = path === "/about";
  const isPlatformPage = path === "/platform";
  const isWorkflowPage = path === "/workflow";

  useEffect(() => {
    const onPopState = () => {
      const next = normalizePath(window.location.pathname);
      if (isLegacyHomepagePath(next)) {
        replaceAppPath("/");
        setPath("/");
        return;
      }
      setPath(next);
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#0C111B] text-white selection:bg-brand/35 selection:text-white font-sans w-full max-w-[100vw] min-w-0 touch-fast app-root">
      <PageBackground />

      <div className="relative z-10 flex flex-col min-h-screen min-w-0 overflow-x-hidden">
        <Navbar />

        {isTermsPage ? (
          <TermsPage />
        ) : isContactPage ? (
          <>
            <ContactPage />
            <DeferredMount rootMargin="0px" minHeight="32rem">
              <Footer />
            </DeferredMount>
          </>
        ) : isServicesPage ? (
          <>
            <ServicesPage />
            <DeferredMount rootMargin="0px" minHeight="32rem">
              <Footer />
            </DeferredMount>
          </>
        ) : isAboutPage ? (
          <>
            <AboutPage />
            <DeferredMount rootMargin="0px" minHeight="32rem">
              <Footer />
            </DeferredMount>
          </>
        ) : isPlatformPage ? (
          <>
            <PlatformPage />
            <DeferredMount rootMargin="0px" minHeight="32rem">
              <Footer />
            </DeferredMount>
          </>
        ) : isWorkflowPage ? (
          <>
            <WorkflowPage />
            <DeferredMount rootMargin="0px" minHeight="32rem">
              <Footer />
            </DeferredMount>
          </>
        ) : (
          <>
            {/* Production homepage — Homepage V3 only. V1/V2 remain preserved in-repo. */}
            <HomepageV3Page />
            <DeferredMount rootMargin="0px" minHeight="32rem">
              <Footer />
            </DeferredMount>
          </>
        )}

        {!isTermsPage ? <FloatingEmailButton /> : null}
        <FloatingScheduleMeeting />
      </div>
    </div>
  );
}
