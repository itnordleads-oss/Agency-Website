import React, { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ArrowUp } from "lucide-react";
import { onModalClose, onModalOpen } from "../lib/modalManager";
import "./scrollToTop.css";

const SCROLL_THRESHOLD = 500;

function isCookieOverlayActive(): boolean {
  const html = document.documentElement;
  return html.classList.contains("show--consent") || html.classList.contains("show--preferences");
}

function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

function smoothScrollToTop(): void {
  window.scrollTo({
    top: 0,
    behavior: prefersReducedMotion() ? "auto" : "smooth",
  });
}

export default function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);
  const [isHiddenForModal, setIsHiddenForModal] = useState(false);
  const [isRippling, setIsRippling] = useState(false);
  const rippleTimerRef = useRef<number | null>(null);

  const syncModalVisibility = useCallback(() => {
    setIsHiddenForModal(isCookieOverlayActive());
  }, []);

  useEffect(() => {
    const onScroll = () => {
      setIsVisible(window.scrollY >= SCROLL_THRESHOLD);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    syncModalVisibility();

    const unsubOpen = onModalOpen((modalName) => {
      if (modalName === "consentModal" || modalName === "preferencesModal") {
        setIsHiddenForModal(true);
      }
    });

    const unsubClose = onModalClose((modalName) => {
      if (modalName === "consentModal" || modalName === "preferencesModal") {
        syncModalVisibility();
      }
    });

    const observer = new MutationObserver(syncModalVisibility);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    return () => {
      unsubOpen();
      unsubClose();
      observer.disconnect();

      if (rippleTimerRef.current) {
        window.clearTimeout(rippleTimerRef.current);
      }
    };
  }, [syncModalVisibility]);

  const handleClick = useCallback(() => {
    setIsRippling(true);

    if (rippleTimerRef.current) {
      window.clearTimeout(rippleTimerRef.current);
    }

    rippleTimerRef.current = window.setTimeout(() => {
      setIsRippling(false);
      rippleTimerRef.current = null;
    }, 420);

    smoothScrollToTop();
  }, []);

  if (isHiddenForModal) {
    return null;
  }

  const button = (
    <button
      type="button"
      onClick={handleClick}
      aria-label="Scroll to top"
      className={`scroll-to-top ${isVisible ? "scroll-to-top--visible" : ""}`}
    >
      <span className="scroll-to-top__border-track" aria-hidden="true">
        <span className="scroll-to-top__border-glow" />
      </span>
      <span className="scroll-to-top__surface">
        <ArrowUp className="scroll-to-top__icon" strokeWidth={2.25} aria-hidden="true" />
      </span>
      <span
        className={`scroll-to-top__ripple ${isRippling ? "scroll-to-top__ripple--active" : ""}`}
        aria-hidden="true"
      />
    </button>
  );

  return createPortal(button, document.body);
}
