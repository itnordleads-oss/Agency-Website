import React from "react";
import { Mail } from "lucide-react";
import FooterLogo from "./FooterLogo";
import FooterSocialIcons from "./FooterSocialIcons";
import { getContactMailtoHref, hasContactEmail, resolveContactEmail } from "../lib/siteContact";
import { socialLinkItems } from "../lib/socialLinks";
import { useSiteCopy } from "../lib/useSiteCopy";
import { navigateAppPath } from "../App";
import {
  FOOTER_COMPANY_NAV_IDS,
  FOOTER_EXPLORE_NAV_IDS,
  getPublishedStudioNavItems,
  type StudioNavItemId,
} from "../lib/studioNavigation";
import "./footer.css";

const FOOTER_GROUPS: ReadonlyArray<{
  title: string;
  ids: readonly StudioNavItemId[];
}> = [
  { title: "Explore", ids: FOOTER_EXPLORE_NAV_IDS },
  { title: "Company", ids: FOOTER_COMPANY_NAV_IDS },
];

export default function Footer() {
  const { footer } = useSiteCopy();
  const publishedItems = getPublishedStudioNavItems();
  const tagline = typeof footer.tagline === "string" ? footer.tagline.trim() : "";

  const footerNavLinkClassName =
    "text-left text-sm text-muted font-medium hover:text-white transition-colors py-0.5";
  const showContactColumn = hasContactEmail() || socialLinkItems.length > 0;

  return (
    <footer className="site-footer border-t border-white/[0.1] bg-[#0A0F19] text-white/70 relative z-10">
      <div className="border-t border-white/8 py-6 max-[340px]:py-5 md:py-7">
        <div className="site-footer__shell max-w-7xl mx-auto px-4 min-[341px]:px-5 sm:px-6 lg:px-8 min-w-0">
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
              {FOOTER_GROUPS.map((group) => (
                <div key={group.title} className="site-footer__nav-group">
                  <p className="site-footer__nav-heading">{group.title}</p>
                  {group.ids.map((id) => {
                    const item = publishedItems.find((navItem) => navItem.id === id);
                    if (!item) {
                      return null;
                    }

                    return (
                      <a
                        key={item.id}
                        href={item.path}
                        onClick={(event) => {
                          event.preventDefault();
                          navigateAppPath(item.path);
                        }}
                        className={footerNavLinkClassName}
                      >
                        {item.label}
                      </a>
                    );
                  })}
                </div>
              ))}
              <div className="site-footer__nav-group">
                <p className="site-footer__nav-heading">Legal</p>
                <a
                  href="/terms"
                  onClick={(event) => {
                    event.preventDefault();
                    navigateAppPath("/terms");
                  }}
                  className={`${footerNavLinkClassName} whitespace-nowrap`}
                >
                  {footer.termsLink}
                </a>
              </div>
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
              {tagline ? (
                <p className="site-footer__tagline text-subtle text-xs leading-relaxed max-w-md">
                  {tagline}
                </p>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
