import React from "react";
import { socialIconBaseClass, socialLinkItems } from "../lib/socialLinks";

const iconSizeClass =
  "inline-flex items-center justify-center w-10 h-10 rounded-full border hover:scale-110 active:scale-105 transition-[transform,color,background-color,background-image,border-color,box-shadow] duration-300 ease-out shrink-0";

/**
 * Footer social row. Unpublished platforms are omitted by `socialLinkItems`
 * so incorrect ADealForge URLs are not published while studio identity is TBC.
 */
export default function FooterSocialIcons() {
  if (socialLinkItems.length === 0) {
    return null;
  }

  return (
    <div
      className="flex flex-row flex-wrap items-center gap-2.5 sm:gap-3 max-w-full"
      aria-label="Social media"
    >
      {socialLinkItems.map((item) => (
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
  );
}
