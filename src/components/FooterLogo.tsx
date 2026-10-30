import React from "react";
import BrandLogo from "./BrandLogo";

/**
 * Footer lockup fills the shared brand column width so the mark lines up
 * with the description and service tags beneath it (see footer.css).
 * Intrinsic ratio matches production lockup (~699×151).
 */
export default function FooterLogo() {
  return <BrandLogo width={272} height={59} className="site-footer__wordmark" />;
}
