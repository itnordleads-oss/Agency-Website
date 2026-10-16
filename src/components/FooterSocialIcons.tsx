import React from "react";
import { footerSocialLinkItems, socialIconBaseClass } from "../lib/socialLinks";

/**
 * Configured destinations only. `footerSocialLinkItems` excludes every
 * missing or invalid URL before this component renders.
 */
export default function FooterSocialIcons() {
  if (footerSocialLinkItems.length === 0) {
    return null;
  }

  return (
    <nav className="site-footer__connect-inner" aria-label="Social links">
      <p className="site-footer__nav-heading">Connect</p>
      <div className="site-footer__social-links">
        {footerSocialLinkItems.map((item) => (
          <a
            key={item.key}
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={item.label}
            title={item.label}
            className={`${socialIconBaseClass} site-footer__social-link ${item.platformClass}`}
          >
            {item.icon}
          </a>
        ))}
      </div>
    </nav>
  );
}
