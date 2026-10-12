import React, { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { CalendarDays, X } from "lucide-react";
import { PrimaryButton, SecondaryButton } from "./Buttons";
import { useSiteCopy } from "../lib/useSiteCopy";
import { onModalClose, onModalOpen } from "../lib/modalManager";
import { navigateToContact } from "../App";
import "./floatingScheduleMeeting.css";

const STORAGE_KEY = "agency:schedule-meeting-dismissed-at";
const DISMISS_TTL_MS = 7 * 24 * 60 * 60 * 1000;
const SHOW_DELAY_MS = 10_000;
const AUTO_COLLAPSE_MS = 10_000;
const EXIT_ANIMATION_MS = 320;

function isDismissedFresh(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return false;
  }

  const dismissedAt = Number(raw);
  if (!Number.isFinite(dismissedAt)) {
    window.localStorage.removeItem(STORAGE_KEY);
    return false;
  }

  return Date.now() - dismissedAt < DISMISS_TTL_MS;
}

function persistDismissal() {
  window.localStorage.setItem(STORAGE_KEY, String(Date.now()));
}

function isCookieOverlayActive(): boolean {
  const html = document.documentElement;
  return html.classList.contains("show--consent") || html.classList.contains("show--preferences");
}

function trackConversationPromptClick() {
  if (typeof window === "undefined" || typeof window.gtag !== "function") {
    return;
  }

  window.gtag("event", "conversation_prompt_click", {
    event_category: "engagement",
    event_label: "floating_conversation_prompt",
  });
}

/**
 * FLIP-style morph target for the auto-collapse: the card shrinks onto the floating email FAB.
 * The custom properties are left unset when the FAB is missing (e.g. /terms) or unmeasurable,
 * so the CSS fallbacks keep the previous in-place fade.
 */
function applyCollapseMorphVars(panel: HTMLElement) {
  const fab = document.querySelector(".email-fab");
  if (!fab) {
    return;
  }

  const panelRect = panel.getBoundingClientRect();
  const fabRect = fab.getBoundingClientRect();
  if (panelRect.width < 1 || panelRect.height < 1 || fabRect.width < 1 || fabRect.height < 1) {
    return;
  }

  const dx = fabRect.left + fabRect.width / 2 - (panelRect.left + panelRect.width / 2);
  const dy = fabRect.top + fabRect.height / 2 - (panelRect.top + panelRect.height / 2);

  panel.style.setProperty("--collapse-translate-x", `${Math.round(dx)}px`);
  panel.style.setProperty("--collapse-translate-y", `${Math.round(dy)}px`);
  panel.style.setProperty("--collapse-scale-x", (fabRect.width / panelRect.width).toFixed(3));
  panel.style.setProperty("--collapse-scale-y", (fabRect.height / panelRect.height).toFixed(3));
}

/**
 * Shared floating conversation prompt for non-homepage public routes.
 * App.tsx unmounts this on `/` so Hero + Final CTA remain the homepage conversion path.
 * Single source of truth: homepageV3.conversationPrompt (no route-specific copy).
 *
 * Flow: wait SHOW_DELAY_MS → show full card → after AUTO_COLLAPSE_MS collapse into the
 * floating email FAB and unmount for the session. Auto-collapse runs only once after the
 * first automatic appearance.
 * Manual dismiss (X / Keep Browsing / CTA) persists and removes the widget.
 */
export default function FloatingScheduleMeeting() {
  const { homepageV3 } = useSiteCopy();
  const conversationPrompt = homepageV3.conversationPrompt;

  const [delayElapsed, setDelayElapsed] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isCollapsing, setIsCollapsing] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [isDismissed, setIsDismissed] = useState(() => isDismissedFresh());
  const [isHiddenForCookie, setIsHiddenForCookie] = useState(false);

  const panelRef = useRef<HTMLDivElement | null>(null);
  const showTimerRef = useRef<number | null>(null);
  const autoCollapseTimerRef = useRef<number | null>(null);
  const collapseAnimTimerRef = useRef<number | null>(null);
  const exitTimerRef = useRef<number | null>(null);
  const autoCollapseScheduledRef = useRef(false);

  const title = conversationPrompt.title || "Let's Start a Conversation";
  const subtitle =
    conversationPrompt.subtitle || "No pressure. No obligation. Just a friendly conversation.";
  const primaryCta = conversationPrompt.primaryCta || "Start Here";
  const dismissCta = conversationPrompt.dismissCta || "Keep Browsing";
  const closeLabel = conversationPrompt.closeLabel || "Dismiss conversation card";

  const clearAutoCollapseTimer = useCallback(() => {
    if (autoCollapseTimerRef.current) {
      window.clearTimeout(autoCollapseTimerRef.current);
      autoCollapseTimerRef.current = null;
    }
  }, []);

  const clearCollapseAnimTimer = useCallback(() => {
    if (collapseAnimTimerRef.current) {
      window.clearTimeout(collapseAnimTimerRef.current);
      collapseAnimTimerRef.current = null;
    }
  }, []);

  const syncCookieVisibility = useCallback(() => {
    setIsHiddenForCookie(isCookieOverlayActive());
  }, []);

  const dismiss = useCallback(() => {
    if (isDismissed || isExiting) {
      return;
    }

    clearAutoCollapseTimer();
    clearCollapseAnimTimer();
    persistDismissal();
    setIsCollapsing(false);
    setIsExiting(true);

    exitTimerRef.current = window.setTimeout(() => {
      setIsVisible(false);
      setIsExpanded(false);
      setIsExiting(false);
      setIsDismissed(true);
      exitTimerRef.current = null;
    }, EXIT_ANIMATION_MS);
  }, [clearAutoCollapseTimer, clearCollapseAnimTimer, isDismissed, isExiting]);

  useEffect(() => {
    if (isDismissed) {
      return;
    }

    showTimerRef.current = window.setTimeout(() => {
      setDelayElapsed(true);
      showTimerRef.current = null;
    }, SHOW_DELAY_MS);

    return () => {
      if (showTimerRef.current) {
        window.clearTimeout(showTimerRef.current);
        showTimerRef.current = null;
      }
      clearAutoCollapseTimer();
      clearCollapseAnimTimer();
      if (exitTimerRef.current) {
        window.clearTimeout(exitTimerRef.current);
        exitTimerRef.current = null;
      }
    };
  }, [clearAutoCollapseTimer, clearCollapseAnimTimer, isDismissed]);

  useEffect(() => {
    syncCookieVisibility();

    const unsubOpen = onModalOpen((modalName) => {
      if (modalName === "consentModal" || modalName === "preferencesModal") {
        setIsHiddenForCookie(true);
      }
    });

    const unsubClose = onModalClose((modalName) => {
      if (modalName === "consentModal" || modalName === "preferencesModal") {
        syncCookieVisibility();
      }
    });

    const observer = new MutationObserver(syncCookieVisibility);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    return () => {
      unsubOpen();
      unsubClose();
      observer.disconnect();
    };
  }, [syncCookieVisibility]);

  useEffect(() => {
    if (isDismissed || !delayElapsed || isHiddenForCookie) {
      if (isHiddenForCookie) {
        setIsVisible(false);
        clearAutoCollapseTimer();
      }
      return;
    }

    setIsVisible(true);

    // First automatic appearance only: expand + schedule one-time auto-collapse.
    if (!autoCollapseScheduledRef.current) {
      autoCollapseScheduledRef.current = true;
      setIsExpanded(true);
      clearAutoCollapseTimer();
      autoCollapseTimerRef.current = window.setTimeout(() => {
        autoCollapseTimerRef.current = null;
        if (panelRef.current) {
          applyCollapseMorphVars(panelRef.current);
        }
        setIsCollapsing(true);
        collapseAnimTimerRef.current = window.setTimeout(() => {
          setIsExpanded(false);
          setIsCollapsing(false);
          // Session-only unmount: persistDismissal() is intentionally skipped so the
          // invitation returns on the next page load.
          setIsDismissed(true);
          collapseAnimTimerRef.current = null;
        }, EXIT_ANIMATION_MS);
      }, AUTO_COLLAPSE_MS);
    }
  }, [clearAutoCollapseTimer, delayElapsed, isDismissed, isHiddenForCookie]);

  const handlePrimaryAction = () => {
    trackConversationPromptClick();
    navigateToContact();
    dismiss();
  };

  // The panel is the only render path now that the launcher is gone, so gating on it here
  // keeps an empty shell out of the DOM once the collapse finishes.
  const showPanel = isExpanded || isCollapsing;

  if (isDismissed || isHiddenForCookie || (!isVisible && !isExiting) || !showPanel) {
    return null;
  }

  const widget = (
    <aside
      className={`schedule-meeting-float${isVisible && !isExiting ? " schedule-meeting-float--visible" : ""}${
        isExiting ? " schedule-meeting-float--exiting" : ""
      }`}
      aria-label={title}
      role="complementary"
    >
      <div
        ref={panelRef}
        className={`schedule-meeting-float__panel${
          isCollapsing ? " schedule-meeting-float__panel--collapsing" : ""
        }${isExiting ? " schedule-meeting-float__panel--exiting" : ""}`}
      >
        <button
          type="button"
          className="schedule-meeting-float__close"
          onClick={dismiss}
          aria-label={closeLabel}
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>

        <div className="schedule-meeting-float__header">
          <span className="schedule-meeting-float__icon" aria-hidden="true">
            <CalendarDays className="h-4 w-4" />
          </span>
          <div>
            <h2 className="schedule-meeting-float__title">{title}</h2>
            <p className="schedule-meeting-float__subtitle">{subtitle}</p>
          </div>
        </div>

        <div className="schedule-meeting-float__actions">
          <PrimaryButton
            onClick={handlePrimaryAction}
            className="schedule-meeting-float__cta schedule-meeting-float__cta--primary px-4 py-2.5 text-xs sm:px-5 sm:text-sm"
          >
            {primaryCta}
          </PrimaryButton>
          <SecondaryButton
            onClick={dismiss}
            className="schedule-meeting-float__cta schedule-meeting-float__cta--secondary px-4 py-2.5 text-xs sm:px-5 sm:text-sm"
          >
            {dismissCta}
          </SecondaryButton>
        </div>
      </div>
    </aside>
  );

  return createPortal(widget, document.body);
}
