export const HOMEPAGE_SECTION_IDS = ["product", "benefits", "pricing"] as const;

export type HomepageSectionId = (typeof HOMEPAGE_SECTION_IDS)[number];

const HOMEPAGE_SECTION_ALIASES: Record<string, HomepageSectionId> = {
  product: "product",
  "v2-product": "product",
  benefits: "benefits",
  "v2-benefits": "benefits",
  pricing: "pricing",
  "v2-pricing": "pricing",
};

/** Fallback when the header node is not measurable yet (matches min-[341px]:h-20). */
const HOMEPAGE_SECTION_SCROLL_FALLBACK_OFFSET_PX = 80;

/**
 * Clearance under the sticky/fixed header.
 * Matches existing E2E (target top must be >= 8px below the header bottom).
 */
const HOMEPAGE_SECTION_SCROLL_GAP_PX = 8;

let sectionScrollToken = 0;
let sectionLayoutFrame = 0;
let sectionScrollEndHandler: (() => void) | null = null;
let sectionStyleRestoreTimer = 0;
let previousRootScrollBehavior: string | null = null;
let previousBodyScrollBehavior: string | null = null;
/** Set when navigating to a homepage hash from a non-home route. */
let pendingInstantSectionScroll: HomepageSectionId | null = null;

export type ScrollToHomepageSectionOptions = {
  behavior?: ScrollBehavior;
};

/**
 * Mark the next scroll to this section. Used for cross-route jumps
 * (e.g. /platform → /#pricing). Instant only when reduced-motion or explicit auto.
 */
export function requestInstantHomepageSectionScroll(sectionId: HomepageSectionId) {
  pendingInstantSectionScroll = sectionId;
}

function consumeInstantHomepageSectionScroll(sectionId: HomepageSectionId) {
  if (pendingInstantSectionScroll !== sectionId) {
    return false;
  }
  pendingInstantSectionScroll = null;
  return true;
}

/**
 * CSSOM: `scrollTo({ behavior: "auto" })` still honors CSS `scroll-behavior`.
 * Temporarily force an instant root scroll, then restore prior inline values.
 * Same pattern as route-enter resets on Platform/Contact pages (behavior auto),
 * with an explicit override for global `html, body { scroll-behavior: smooth }`.
 */
function runWithForcedInstantRootScroll(run: () => void) {
  const root = document.documentElement;
  const body = document.body;
  const previousRoot = root.style.scrollBehavior;
  const previousBody = body.style.scrollBehavior;
  root.style.scrollBehavior = "auto";
  body.style.scrollBehavior = "auto";
  try {
    run();
  } finally {
    window.requestAnimationFrame(() => {
      root.style.scrollBehavior = previousRoot;
      body.style.scrollBehavior = previousBody;
    });
  }
}

export function resolveHomepageSectionId(value: string): HomepageSectionId | null {
  return HOMEPAGE_SECTION_ALIASES[value] ?? null;
}

export function getHomepageSectionHref(sectionId: HomepageSectionId) {
  return `/#${sectionId}`;
}

export function readHomepageSectionHash(): HomepageSectionId | null {
  if (typeof window === "undefined") {
    return null;
  }

  return resolveHomepageSectionId(window.location.hash.replace(/^#/, ""));
}

/**
 * Prefer an explicit custom scroll reference when present
 * (`[data-homepage-scroll-ref="<sectionId>"]`), otherwise the section root `#id`.
 * Pricing never falls back to `#pricing` (that box includes section padding).
 */
export function resolveHomepageSectionScrollTarget(
  sectionId: HomepageSectionId
): HTMLElement | null {
  if (typeof document === "undefined") {
    return null;
  }

  const custom = document.querySelector(`[data-homepage-scroll-ref="${sectionId}"]`);
  if (custom instanceof HTMLElement) {
    return custom;
  }

  if (sectionId === "pricing") {
    return null;
  }

  return document.getElementById(sectionId);
}

/**
 * True when the header will still cover the viewport top after scrolling.
 * Fixed (mobile) stays. Sticky (desktop) does not — overflow-x ancestors detach it.
 * Click used to measure the header while still at the page top and reserved ~80px;
 * refresh measured after the header had already left, so it landed tighter.
 */
function headerWillRemainPinned(header: Element) {
  const position = window.getComputedStyle(header).position;
  if (position === "fixed") {
    return true;
  }
  if (position !== "sticky" && position !== "-webkit-sticky") {
    return false;
  }

  let parent = header.parentElement;
  while (parent && parent !== document.documentElement) {
    const style = window.getComputedStyle(parent);
    if (
      /(auto|scroll|hidden|overlay)/.test(style.overflowX) ||
      /(auto|scroll|hidden|overlay)/.test(style.overflowY)
    ) {
      return false;
    }
    parent = parent.parentElement;
  }

  return true;
}

/**
 * Space to leave above the section target after scroll.
 * Only reserve header height when it will still cover the top (mobile fixed).
 * Desktop sticky is detached by overflow, so use the same 8px gap as refresh.
 */
export function readHomepageSectionScrollOffsetPx(_sectionId?: HomepageSectionId) {
  const gap = HOMEPAGE_SECTION_SCROLL_GAP_PX;

  if (typeof document === "undefined") {
    return HOMEPAGE_SECTION_SCROLL_FALLBACK_OFFSET_PX + gap;
  }

  const header = document.querySelector("header");
  if (!header) {
    return gap;
  }

  if (!headerWillRemainPinned(header)) {
    return gap;
  }

  const height = Math.round(header.getBoundingClientRect().height || header.offsetHeight);
  return (height || HOMEPAGE_SECTION_SCROLL_FALLBACK_OFFSET_PX) + gap;
}

function readSectionScrollTop(target: HTMLElement) {
  return Math.max(
    0,
    Math.floor(
      window.scrollY + target.getBoundingClientRect().top - readHomepageSectionScrollOffsetPx()
    )
  );
}

function restoreRootScrollBehavior() {
  if (previousRootScrollBehavior === null) {
    return;
  }

  document.documentElement.style.scrollBehavior = previousRootScrollBehavior;
  document.body.style.scrollBehavior = previousBodyScrollBehavior ?? "";
  previousRootScrollBehavior = null;
  previousBodyScrollBehavior = null;
}

function beginExclusiveJsSmoothScroll() {
  if (previousRootScrollBehavior !== null) {
    return;
  }

  previousRootScrollBehavior = document.documentElement.style.scrollBehavior;
  previousBodyScrollBehavior = document.body.style.scrollBehavior;
  document.documentElement.style.scrollBehavior = "auto";
  document.body.style.scrollBehavior = "auto";
}

function clearSectionScrollWork() {
  if (typeof window === "undefined") {
    return;
  }

  window.cancelAnimationFrame(sectionLayoutFrame);
  sectionLayoutFrame = 0;
  sectionScrollToken += 1;

  if (sectionScrollEndHandler) {
    window.removeEventListener("scrollend", sectionScrollEndHandler);
    sectionScrollEndHandler = null;
  }

  if (sectionStyleRestoreTimer) {
    window.clearTimeout(sectionStyleRestoreTimer);
    sectionStyleRestoreTimer = 0;
  }

  restoreRootScrollBehavior();
}

/** Cancel an in-flight homepage section scroll (route change / effect cleanup). */
export function cancelHomepageSectionScroll() {
  clearSectionScrollWork();
}

function applySectionScroll(target: HTMLElement, behavior: ScrollBehavior) {
  const top = readSectionScrollTop(target);
  if (behavior === "auto") {
    runWithForcedInstantRootScroll(() => {
      window.scrollTo({ top, behavior: "auto" });
    });
    return;
  }

  // One JS smooth animation only. CSS `html, body { scroll-behavior: smooth }`
  // plus a post-scroll instant snap made Pricing freeze/chunk when it stopped.
  beginExclusiveJsSmoothScroll();
  window.scrollTo({ top, behavior: "smooth" });

  const restore = () => {
    if (sectionScrollEndHandler) {
      window.removeEventListener("scrollend", sectionScrollEndHandler);
      sectionScrollEndHandler = null;
    }
    if (sectionStyleRestoreTimer) {
      window.clearTimeout(sectionStyleRestoreTimer);
      sectionStyleRestoreTimer = 0;
    }
    restoreRootScrollBehavior();
  };

  sectionScrollEndHandler = restore;
  window.addEventListener("scrollend", sectionScrollEndHandler, { once: true });
  sectionStyleRestoreTimer = window.setTimeout(restore, 800);
}

function waitForSectionLayoutStable(sectionId: HomepageSectionId, token: number, done: () => void) {
  let lastY = Number.NaN;
  let lastDocHeight = Number.NaN;
  let stableFrames = 0;
  let frames = 0;
  const maxFrames = 180;
  const needStableFrames = 8;

  const tick = () => {
    sectionLayoutFrame = 0;
    if (token !== sectionScrollToken) {
      return;
    }

    const liveTarget = resolveHomepageSectionScrollTarget(sectionId);
    if (!liveTarget) {
      frames += 1;
      if (frames >= maxFrames) {
        done();
        return;
      }
      sectionLayoutFrame = window.requestAnimationFrame(tick);
      return;
    }

    void liveTarget.offsetHeight;
    const y = Math.round(window.scrollY + liveTarget.getBoundingClientRect().top);
    const docHeight = document.documentElement.scrollHeight;
    frames += 1;

    if (y === lastY && docHeight === lastDocHeight) {
      stableFrames += 1;
    } else {
      stableFrames = 0;
      lastY = y;
      lastDocHeight = docHeight;
    }

    if (stableFrames >= needStableFrames || frames >= maxFrames) {
      done();
      return;
    }

    sectionLayoutFrame = window.requestAnimationFrame(tick);
  };

  sectionLayoutFrame = window.requestAnimationFrame(tick);
}

/**
 * Scroll to a homepage section. Same path for product, benefits, and pricing:
 * wait for a stable layout, then one smooth scroll to the eyebrow/ref with
 * visible header + 8px. Instant only for reduced-motion or explicit auto.
 * No snap at the end — that froze/chunked when Pricing stopped.
 * Returns false until the target exists.
 */
export function scrollToHomepageSection(
  sectionId: HomepageSectionId,
  options?: ScrollToHomepageSectionOptions
) {
  if (typeof window === "undefined") {
    return false;
  }

  const target = resolveHomepageSectionScrollTarget(sectionId);
  if (!target) {
    return false;
  }

  void target.offsetHeight;

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  consumeInstantHomepageSectionScroll(sectionId);
  const useInstant = options?.behavior === "auto" || prefersReducedMotion;

  clearSectionScrollWork();
  const token = sectionScrollToken;

  waitForSectionLayoutStable(sectionId, token, () => {
    if (token !== sectionScrollToken) {
      return;
    }

    const liveTarget = resolveHomepageSectionScrollTarget(sectionId);
    if (!liveTarget) {
      return;
    }

    applySectionScroll(liveTarget, useInstant ? "auto" : "smooth");
  });

  return true;
}
