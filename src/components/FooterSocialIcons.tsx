import React from "react";
import { footerSocialLinkItems, socialIconBaseClass } from "../lib/socialLinks";

const iconSizeClass =
  "site-footer__social-link inline-flex items-center justify-center rounded-full border shrink-0";

/**
 * Configured destinations only. `footerSocialLinkItems` excludes every
 * missing or invalid URL before this component renders.
 */
export default function FooterSocialIcons() {
  if (footerSocialLinkItems.length === 0) {
    return null;
  }

  return (
    <nav className="site-footer__connect" aria-label="Social links">
      <p className="site-footer__nav-heading">Connect</p>
      <div className="site-footer__social-links">
        {footerSocialLinkItems.map((item) => (
          <a
            key={item.key}
            href={item.href}
            target={item.key === "email" ? undefined : "_blank"}
            rel={item.key === "email" ? undefined : "noopener noreferrer"}
            aria-label={item.label}
            title={item.label}
            className={`${socialIconBaseClass} ${iconSizeClass} ${item.platformClass}`}
          >
            {item.icon}
          </a>
        ))}
      </div>
    </nav>
  );
}
