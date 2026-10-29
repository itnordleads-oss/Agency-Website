import React from "react";
import { navigateAppPath } from "../../App";
import "./serviceExploreLink.css";

type ServiceExploreLinkProps = {
  children: React.ReactNode;
  /** Destination path when this control is the interactive element. */
  href?: string;
  className?: string;
  /**
   * Visual-only marker when a parent card/link already owns navigation.
   * Renders a non-interactive span so we never nest anchors.
   */
  embedded?: boolean;
  "aria-label"?: string;
};

function shouldClientNavigate(event: React.MouseEvent<HTMLAnchorElement>) {
  return !(
    event.defaultPrevented ||
    event.button !== 0 ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey
  );
}

/**
 * Compact secondary service navigation — text link, not a button.
 * Used on Services hub cards, hero capability summary, blueprint panel, and homepage.
 */
export default function ServiceExploreLink({
  children,
  href,
  className = "",
  embedded = false,
  "aria-label": ariaLabel,
}: ServiceExploreLinkProps) {
  const classes = `service-explore-link${className ? ` ${className}` : ""}`;

  const content = (
    <>
      <span className="service-explore-link__label">{children}</span>
      <span className="service-explore-link__arrow" aria-hidden>
        →
      </span>
    </>
  );

  if (embedded || !href) {
    return (
      <span className={classes} aria-hidden={embedded || undefined}>
        {content}
      </span>
    );
  }

  return (
    <a
      href={href}
      className={classes}
      aria-label={ariaLabel}
      onClick={(event) => {
        if (!shouldClientNavigate(event)) {
          return;
        }
        event.preventDefault();
        navigateAppPath(href);
      }}
    >
      {content}
    </a>
  );
}
