import React from "react";
import { ArrowUpRight } from "lucide-react";
import FooterLogo from "./FooterLogo";
import FooterSocialIcons from "./FooterSocialIcons";
import { navigateAppPath } from "../App";
import { getBrandAriaLabel } from "../lib/studioBranding";
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
  const publishedItems = getPublishedStudioNavItems();

  const handleInternalNavigation = (event: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    event.preventDefault();
    navigateAppPath(path);
    window.scrollTo({ top: 0, behavior: "auto" });
  };

  return (
    <footer className="site-footer relative z-10" aria-label="Site footer">
      <div className="site-footer__shell mx-auto min-w-0 max-w-7xl px-3 min-[341px]:px-4 sm:px-6">
        <div className="site-footer__top">
          <div className="site-footer__brand">
            <a
              href="/"
              className="site-footer__brand-link"
              aria-label={`${getBrandAriaLabel()} home`}
              onClick={(event) => handleInternalNavigation(event, "/")}
            >
              <span className="flex items-center">
                <FooterLogo />
              </span>
            </a>
            <p className="site-footer__description">
              Custom software and digital product delivery for growing teams.
            </p>
            <a
              href="/contact"
              className="site-footer__cta"
              onClick={(event) => handleInternalNavigation(event, "/contact")}
            >
              <span>Start a Project</span>
              <ArrowUpRight aria-hidden="true" />
            </a>
            <FooterSocialIcons />
          </div>

          <div className="site-footer__nav">
            {FOOTER_GROUPS.map((group) => (
              <nav
                key={group.title}
                className="site-footer__nav-group"
                aria-label={`Footer ${group.title}`}
              >
                <p className="site-footer__nav-heading">{group.title}</p>
                <div className="site-footer__nav-links">
                  {group.ids.map((id) => {
                    const item = publishedItems.find((candidate) => candidate.id === id);
                    if (!item) {
                      return null;
                    }

                    return (
                      <a
                        key={item.id}
                        href={item.path}
                        className="site-footer__nav-link"
                        onClick={(event) => handleInternalNavigation(event, item.path)}
                      >
                        {item.label}
                      </a>
                    );
                  })}
                </div>
              </nav>
            ))}

            <nav className="site-footer__nav-group" aria-label="Footer Legal">
              <p className="site-footer__nav-heading">Legal</p>
              <div className="site-footer__nav-links">
                <a
                  href="/terms"
                  className="site-footer__nav-link"
                  onClick={(event) => handleInternalNavigation(event, "/terms")}
                >
                  Terms
                </a>
              </div>
            </nav>
          </div>
        </div>

        <div className="site-footer__bottom">
          <p>© 2026. All rights reserved.</p>
          <p className="site-footer__service-line">
            Software, web, mobile, Shopify, and WordPress delivery.
          </p>
        </div>
      </div>
    </footer>
  );
}
