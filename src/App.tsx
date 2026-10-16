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
import WorkPage from "./components/WorkPage";
import ServicesPage from "./components/ServicesPage";
import ServiceDetailRoute from "./components/ServiceDetailRoute";
import AboutPage from "./components/AboutPage";
import HomepageV3Page from "./components/home-v2/HomepageV3Page";
import { isWorkPagePublished } from "./lib/workProjects";
import {
  getHomepageSectionHref,
  requestInstantHomepageSectionScroll,
  resolveHomepageSectionId,
  scrollToHomepageSection,
} from "./lib/homepageSections";
import { getStudioNavHref, IS_WORK_NAV_PUBLISHED } from "./lib/studioNavigation";
import { normalizeAppPath, resolveProductRouteRedirect } from "./lib/productRouteRetirement";

/**
 * Legacy preview URLs — redirected to production `/` (Homepage V3).
 * Homepage V1/V2 source remains in-repo; V2 layout is reused by V3.
 * F9: `/platform`, `/workflow`, and `/landing/*` redirect to agency routes.
 */
const LEGACY_HOMEPAGE_PATHS = new Set(["/homepage-v1", "/homepage-v2", "/homepage-v3"]);

function normalizePath(pathname: string) {
  return normalizeAppPath(pathname);
}

function isLegacyHomepagePath(pathname: string) {
  return LEGACY_HOMEPAGE_PATHS.has(normalizePath(pathname));
}

/** Unpublished Work must not silently render the homepage under `/work`. */
function isUnpublishedWorkPath(pathname: string) {
  return normalizePath(pathname) === "/work" && !IS_WORK_NAV_PUBLISHED;
}

/**
 * Resolve the public path:
 * - legacy homepage previews → `/`
 * - unpublished Work → `/`
 * - retired product surfaces → agency destinations (F9)
 */
export function resolvePublicPath(pathname: string) {
  const path = normalizePath(pathname);
  if (isLegacyHomepagePath(path) || isUnpublishedWorkPath(path)) {
    return "/";
  }
  // F7: unpublished /work resolves to home before first paint (no child-effect redirect race).
  if (path === "/work" && !isWorkPagePublished()) {
    return "/";
  }
  return resolveProductRouteRedirect(path) ?? path;
}

/**
 * Soft client-side navigation helper for TermsPage / in-app links when needed.
 * Legacy homepage and retired product paths resolve to their public destinations.
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

  // F9: product route ids resolve to Services.
  if (targetId === "platform" || targetId === "workflow") {
    navigateAppPath(getStudioNavHref("services"));
    return;
  }

  // Retired product pricing hash → Contact (no agency pricing page).
  if (targetId === "pricing" || targetId === "v2-pricing") {
    navigateAppPath("/contact");
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
      if (resolvePublicPath(window.location.pathname) !== "/") {
        requestInstantHomepageSectionScroll(homepageSectionId);
      }
      window.history.pushState({}, "", href);
      window.dispatchEvent(new PopStateEvent("popstate"));
      return;
    }

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
  if (currentPath === "/") {
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

/**
 * Navigate to /work only when published case studies exist (F7).
 * Otherwise keep callers on a safe public route.
 */
export function navigateToWork() {
  if (!isWorkPagePublished()) {
    navigateAppPath("/");
    return;
  }
  navigateAppPath("/work");
}

export function navigateToServices() {
  navigateAppPath(getStudioNavHref("services"));
}

export function navigateToAbout() {
  navigateAppPath(getStudioNavHref("about"));
}

/** @deprecated F9 — product Platform retired; navigates to Services. */
export function navigateToPlatform() {
  navigateAppPath(getStudioNavHref("services"));
}

/** @deprecated F9 — product Workflow retired; navigates to Services. */
export function navigateToWorkflow() {
  navigateAppPath(getStudioNavHref("services"));
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
  const hash = window.location.hash.replace(/^#/, "");

  // F9: product pricing hash retired — resolve before first paint so React state matches URL.
  if ((hash === "pricing" || hash === "v2-pricing") && (path === "/" || path === "")) {
    window.history.replaceState({}, "", "/contact");
    return "/contact";
  }

  if (isLegacyHomepagePath(path) || isUnpublishedWorkPath(path)) {
    window.history.replaceState({}, "", "/");
    return "/";
  }

  const resolved = resolvePublicPath(path);
  if (resolved !== path) {
    window.history.replaceState({}, "", resolved);
  }
  return resolved;
}

export default function App() {
  const [path, setPath] = useState(getInitialPublicPath);
  const isTermsPage = path === "/terms";
  const isContactPage = path === "/contact";
  const isServicesPage = path === "/services";
  const serviceDetailSlug = path.startsWith("/services/") ? path.slice("/services/".length) : null;
  const isAboutPage = path === "/about";
  /** F7 Work route — public only when published projects exist; otherwise WorkPage redirects home. */
  const isWorkPage = path === "/work";

  useEffect(() => {
    const onPopState = () => {
      const next = normalizePath(window.location.pathname);
      const resolved = resolvePublicPath(next);
      if (resolved !== next) {
        replaceAppPath(resolved);
        setPath(resolved);
        return;
      }
      setPath(next);
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#0C111B] text-white selection:bg-brand/35 selection:text-white font-sans w-full max-w-[100vw] min-w-0 touch-fast app-root">
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <PageBackground />

      <div className="relative z-10 flex flex-col min-h-screen min-w-0 overflow-x-hidden">
        <Navbar />

        <div id="main-content" tabIndex={-1} className="flex flex-col flex-1 min-w-0 outline-none">
          {isTermsPage ? (
            <TermsPage />
          ) : isContactPage ? (
            <>
              <ContactPage />
              <DeferredMount rootMargin="0px" minHeight="32rem">
                <Footer />
              </DeferredMount>
            </>
          ) : serviceDetailSlug ? (
            <>
              <ServiceDetailRoute slug={serviceDetailSlug} />
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
          ) : isWorkPage ? (
            <>
              <WorkPage />
              {isWorkPagePublished() ? (
                <DeferredMount rootMargin="0px" minHeight="32rem">
                  <Footer />
                </DeferredMount>
              ) : null}
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
        </div>

        {!isTermsPage ? <FloatingEmailButton /> : null}
        <FloatingScheduleMeeting />
      </div>
    </div>
  );
}
