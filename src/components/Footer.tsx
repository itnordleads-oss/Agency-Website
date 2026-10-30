import React, { useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import FooterLogo from "./FooterLogo";
import FooterSocialIcons from "./FooterSocialIcons";
import { navigateAppPath } from "../App";
import { footerSocialLinkItems } from "../lib/socialLinks";
import { getBrandAriaLabel } from "../lib/studioBranding";
import { useSiteCopy } from "../lib/useSiteCopy";
import {
  FOOTER_COMPANY_NAV_IDS,
  FOOTER_EXPLORE_NAV_IDS,
  getPublishedStudioNavItems,
  type StudioNavItemId,
} from "../lib/studioNavigation";
import "./footer.css";

function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export default function Footer() {
  const { nav, footer, studioChrome } = useSiteCopy();
  const footerRef = useRef<HTMLElement | null>(null);
  const [revealed, setRevealed] = useState(false);
  const publishedItems = getPublishedStudioNavItems(nav.studio);
  const hasSocialLinks = footerSocialLinkItems.length > 0;

  const footerGroups: ReadonlyArray<{
    title: string;
    ariaLabel: string;
    ids: readonly StudioNavItemId[];
  }> = [
    {
      title: studioChrome.footerExplore,
      ariaLabel: studioChrome.footerExploreAria,
      ids: FOOTER_EXPLORE_NAV_IDS,
    },
    {
      title: studioChrome.footerCompany,
      ariaLabel: studioChrome.footerCompanyAria,
      ids: FOOTER_COMPANY_NAV_IDS,
    },
  ];

  useEffect(() => {
    const node = footerRef.current;
    if (!node) {
      return;
    }

    if (prefersReducedMotion()) {
      setRevealed(true);
      return;
    }

    if (typeof IntersectionObserver === "undefined") {
      setRevealed(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setRevealed(true);
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const handleInternalNavigation = (event: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    event.preventDefault();
    navigateAppPath(path);
    window.scrollTo({ top: 0, behavior: "auto" });
  };

  return (
    <footer
      ref={footerRef}
      className={`site-footer relative z-10${revealed ? " is-revealed" : ""}${
        hasSocialLinks ? " site-footer--has-connect" : ""
      }`}
      aria-label={studioChrome.footerAriaLabel}
    >
      <div className="site-footer__accent" aria-hidden="true" />
      <div className="site-footer__shell mx-auto min-w-0 max-w-7xl px-4 min-[375px]:px-[1.125rem] min-[390px]:px-5 sm:px-6 lg:px-8">
        <div className="site-footer__top">
          <div className="site-footer__brand">
            <a
              href="/"
              className="site-footer__brand-link"
              aria-label={`${getBrandAriaLabel()} ${studioChrome.footerHomeAriaSuffix}`}
              onClick={(event) => handleInternalNavigation(event, "/")}
            >
              <FooterLogo />
            </a>
            <p className="site-footer__description">{studioChrome.footerDescription}</p>
            <p className="site-footer__service-tags">{studioChrome.footerServiceTags}</p>
            <a
              href="/contact"
              className="site-footer__cta"
              onClick={(event) => handleInternalNavigation(event, "/contact")}
            >
              <span>{studioChrome.footerCta}</span>
              <ArrowRight aria-hidden="true" />
            </a>
            {hasSocialLinks ? (
              <div className="site-footer__connect">
                <FooterSocialIcons />
              </div>
            ) : null}
          </div>

          <div className="site-footer__clusters">
            <div className="site-footer__nav">
              {footerGroups.map((group, groupIndex) => (
                <nav
                  key={group.title}
                  className="site-footer__nav-group"
                  aria-label={group.ariaLabel}
                  style={{ "--footer-stagger": groupIndex } as React.CSSProperties}
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

              <nav
                className="site-footer__nav-group"
                aria-label={studioChrome.footerLegalAria}
                style={{ "--footer-stagger": 2 } as React.CSSProperties}
              >
                <p className="site-footer__nav-heading">{studioChrome.footerLegal}</p>
                <div className="site-footer__nav-links">
                  <a
                    href="/terms"
                    className="site-footer__nav-link"
                    onClick={(event) => handleInternalNavigation(event, "/terms")}
                  >
                    {footer.termsLink}
                  </a>
                </div>
              </nav>
            </div>
          </div>
        </div>

        <div className="site-footer__bottom">
          <p>{studioChrome.footerCopyright}</p>
          <p className="site-footer__service-line">{studioChrome.footerServiceLine}</p>
        </div>
      </div>
    </footer>
  );
}
