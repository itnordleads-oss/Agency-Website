import React from "react";
import { Mail } from "lucide-react";
import FooterLogo from "./FooterLogo";
import FooterSocialIcons from "./FooterSocialIcons";
import { getContactMailtoHref, hasContactEmail, resolveContactEmail } from "../lib/siteContact";
import { socialLinkItems } from "../lib/socialLinks";
import { useSiteCopy } from "../lib/useSiteCopy";
import { navigateAppPath, navigateToSection } from "../App";
import { getHomepageSectionHref, resolveHomepageSectionId } from "../lib/homepageSections";
import "./footer.css";

/** Matches production header nav: hide obsolete Product / Benefits entries. */
const FOOTER_NAV_EXCLUDED_IDS = new Set([
  "homepage-v1",
  "homepage-v2",
  "homepage-v3",
  "v2-product",
  "v2-benefits",
]);

const FOOTER_NAV_HREF: Record<string, string> = {
  home: "/",
  platform: "/platform",
  workflow: "/workflow",
  contact: "/contact",
};

function getFooterNavHref(id: string): string {
  if (FOOTER_NAV_HREF[id]) {
    return FOOTER_NAV_HREF[id];
  }

  const homepageSectionId = resolveHomepageSectionId(id);
  if (homepageSectionId) {
    return getHomepageSectionHref(homepageSectionId);
  }

  return "/";
}

export default function Footer() {
  const { footer, nav } = useSiteCopy();
  const menuItems = (Array.isArray(nav.menu) ? nav.menu : []).filter(
    (item) => !FOOTER_NAV_EXCLUDED_IDS.has(item.id)
  );

  const navTo = (id: string) => {
    if (id === "contact") {
      navigateAppPath("/contact");
      return;
    }
    if (id === "platform") {
      navigateAppPath("/platform");
      return;
    }
    if (id === "workflow") {
      navigateAppPath("/workflow");
      return;
    }
    if (id === "home") {
      navigateAppPath("/");
      return;
    }
    navigateToSection(id);
  };

  const footerNavLinkClassName =
    "text-left text-sm text-muted font-medium hover:text-white transition-colors py-0.5";
  const showContactColumn = hasContactEmail() || socialLinkItems.length > 0;

  return (
    <footer className="site-footer border-t border-white/[0.1] bg-[#0A0F19] text-white/70 relative z-10">
      <div className="border-t border-white/8 py-7 max-[340px]:py-6 md:py-8">
        <div className="site-footer__shell max-w-7xl mx-auto px-3 min-[341px]:px-4 sm:px-6 min-w-0">
          <div className="site-footer__compose">
            <div className="site-footer__brand">
              <div className="flex items-center">
                <FooterLogo />
              </div>
              <p className="text-muted text-sm leading-relaxed max-w-sm">
                {footer.brandDescription}
              </p>
            </div>

            <nav className="site-footer__nav" aria-label="Footer navigation">
              {[
                { title: "Explore", ids: ["home", "platform"] },
                { title: "Product", ids: ["workflow", "v2-pricing"] },
                { title: "Company", ids: ["contact", "terms"] },
              ].map((group) => (
                <div key={group.title} className="site-footer__nav-group">
                  <p className="site-footer__nav-heading">{group.title}</p>
                  {group.ids.map((id) => {
                    if (id === "terms") {
                      return (
                        <a
                          key={id}
                          href="/terms"
                          className={`${footerNavLinkClassName} whitespace-nowrap`}
                        >
                          {footer.termsLink}
                        </a>
                      );
                    }

                    const item = menuItems.find((menuItem) => menuItem.id === id);
                    if (!item) {
                      return null;
                    }

                    return (
                      <a
                        key={item.id}
                        href={getFooterNavHref(item.id)}
                        onClick={(event) => {
                          event.preventDefault();
                          navTo(item.id);
                        }}
                        className={footerNavLinkClassName}
                      >
                        {item.label}
                      </a>
                    );
                  })}
                </div>
              ))}
            </nav>

            {showContactColumn ? (
              <div className="site-footer__contact">
                {hasContactEmail() ? (
                  <a
                    href={getContactMailtoHref() ?? undefined}
                    className="inline-flex items-center gap-2 text-sm text-body hover:text-white transition-colors w-fit"
                  >
                    <Mail className="w-4 h-4 text-brand shrink-0" aria-hidden="true" />
                    {resolveContactEmail()}
                  </a>
                ) : null}
                <FooterSocialIcons />
              </div>
            ) : null}

            <div className="site-footer__legal">
              <p className="text-subtle text-xs shrink-0">{footer.copyright}</p>
              <p className="site-footer__tagline text-subtle text-xs leading-relaxed max-w-md">
                {footer.tagline}
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
