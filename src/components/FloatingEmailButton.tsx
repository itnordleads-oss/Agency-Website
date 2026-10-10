import React, { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { LoaderCircle, Mail } from "lucide-react";
import { useSiteCopy } from "../lib/useSiteCopy";
import { onModalClose, onModalOpen } from "../lib/modalManager";
import { getContactMailtoHref, hasContactEmail, resolveContactEmail } from "../lib/siteContact";

function isCookieOverlayActive(): boolean {
  const html = document.documentElement;
  return html.classList.contains("show--consent") || html.classList.contains("show--preferences");
}

export default function FloatingEmailButton() {
  const { t } = useSiteCopy();
  const [isOpening, setIsOpening] = useState(false);
  const [isHiddenForModal, setIsHiddenForModal] = useState(false);
  const resetTimerRef = useRef<number | null>(null);

  const syncModalVisibility = useCallback(() => {
    setIsHiddenForModal(isCookieOverlayActive());
  }, []);

  useEffect(() => {
    return () => {
      if (resetTimerRef.current) {
        window.clearTimeout(resetTimerRef.current);
      }
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
    };
  }, [syncModalVisibility]);

  const handleClick = () => {
    if (isOpening) {
      return;
    }

    setIsOpening(true);

    if (resetTimerRef.current) {
      window.clearTimeout(resetTimerRef.current);
    }

    resetTimerRef.current = window.setTimeout(() => {
      setIsOpening(false);
      resetTimerRef.current = null;
    }, 2600);
  };

  const mailtoHref = getContactMailtoHref();
  const contactEmail = resolveContactEmail();

  if (isHiddenForModal || !hasContactEmail() || !mailtoHref || !contactEmail) {
    return null;
  }

  const fab = (
    <a
      href={mailtoHref}
      onClick={handleClick}
      aria-busy={isOpening}
      aria-label={
        isOpening
          ? t("emailButton.openingLabel")
          : t("emailButton.openLabel", { email: contactEmail })
      }
      title={
        isOpening ? t("emailButton.titleOpening") : t("emailButton.title", { email: contactEmail })
      }
      className={`email-fab group fixed z-[60] no-underline ${
        isOpening ? "email-fab--opening" : ""
      }`}
    >
      <span className="email-fab__glow" aria-hidden="true" />
      <span className="email-fab__surface">
        {isOpening ? (
          <LoaderCircle
            className="email-fab__icon email-fab__icon--spin"
            strokeWidth={2}
            aria-hidden="true"
          />
        ) : (
          <Mail className="email-fab__icon" strokeWidth={2} aria-hidden="true" />
        )}
      </span>
    </a>
  );

  return createPortal(fab, document.body);
}
