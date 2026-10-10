import React, { useEffect, useId, useState } from "react";
import { useTranslation } from "react-i18next";
import HeaderLogo from "./HeaderLogo";
import { PrimaryButton } from "./Buttons";
import { Menu, X } from "lucide-react";
import { useSiteCopy } from "../lib/useSiteCopy";
import LanguageDropdown from "./LanguageDropdown";
import { changeAppLanguage, resolveActiveLanguage, type SupportedLanguage } from "../i18n";
import { getBrandAriaLabel } from "../lib/studioBranding";
import {
  emitModalClose,
  emitModalOpen,
  lockBodyScroll,
  onModalOpen,
  unlockBodyScroll,
} from "../lib/modalManager";
import {
  navigateAppPath,
  navigateToContact,
  navigateToPlatform,
  navigateToSection,
  navigateToWorkflow,
  resolvePublicPath,
} from "../App";
import { getHomepageSectionHref, resolveHomepageSectionId } from "../lib/homepageSections";
import { isPricingModuleEnabled } from "../lib/trustModules";

/** Canonical production navbar order. Home is always first. */
const PRODUCTION_NAV_ORDER = ["home", "platform", "workflow", "v2-pricing", "contact"] as const;

/** Homepage section nav ids that map 1:1 to in-page anchors. */
const HOMEPAGE_SECTION_NAV_IDS = ["v2-pricing"] as const;

function sortProductionNavItems<T extends { id: string }>(items: T[]): T[] {
  const order = new Map(PRODUCTION_NAV_ORDER.map((id, index) => [id, index]));
  return [...items].sort((a, b) => {
    const aIndex = order.get(a.id as (typeof PRODUCTION_NAV_ORDER)[number]);
    const bIndex = order.get(b.id as (typeof PRODUCTION_NAV_ORDER)[number]);
    if (aIndex === undefined && bIndex === undefined) {
      return 0;
    }
    if (aIndex === undefined) {
      return 1;
    }
    if (bIndex === undefined) {
      return 1;
    }
    return aIndex - bIndex;
  });
}

type HomepageSectionNavId = (typeof HOMEPAGE_SECTION_NAV_IDS)[number];

function isHomepageSectionNavId(id: string): id is HomepageSectionNavId {
  return (HOMEPAGE_SECTION_NAV_IDS as readonly string[]).includes(id);
}

/**
 * Resolve which primary nav item is active from the current route
 * and (on `/`) the in-view homepage section.
 */
function resolveActiveNavId(path: string, activeSectionId: string | null): string | null {
  if (path === "/platform") {
    return "platform";
  }
  if (path === "/workflow") {
    return "workflow";
  }
  if (path === "/contact") {
    return "contact";
  }
  if (path === "/") {
    if (activeSectionId && isHomepageSectionNavId(activeSectionId)) {
      return activeSectionId;
    }
    return "home";
  }
  return null;
}

/** Last section whose top has crossed below the sticky header wins (classic scroll-spy). */
function readActiveHomepageSectionId(): string | null {
  if (typeof document === "undefined") {
    return null;
  }

  const headerOffset = 120;
  let current: string | null = null;

  for (const id of HOMEPAGE_SECTION_NAV_IDS) {
    const sectionId = resolveHomepageSectionId(id);
    const element = sectionId ? document.getElementById(sectionId) : null;
    if (!element) {
      continue;
    }
    if (element.getBoundingClientRect().top <= headerOffset) {
      current = id;
    }
  }

  return current;
}

export default function Navbar() {
  const { t, nav, homepageV3 } = useSiteCopy();
  const { i18n } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [path, setPath] = useState(() =>
    typeof window !== "undefined" ? resolvePublicPath(window.location.pathname) : "/"
  );
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
  const menuId = useId();
  const desktopLanguageSwitcherId = useId();
  const mobileLanguageSwitcherId = useId();
  const menuItems = sortProductionNavItems(Array.isArray(nav.menu) ? nav.menu : []).filter(
    (item) =>
      item.id !== "homepage-v1" &&
      item.id !== "homepage-v2" &&
      item.id !== "homepage-v3" &&
      item.id !== "v2-product" &&
      item.id !== "v2-benefits" &&
      !(item.id === "v2-pricing" && !isPricingModuleEnabled())
  );
  const activeLanguage = resolveActiveLanguage(i18n.resolvedLanguage ?? i18n.language);
  const [selectedLanguage, setSelectedLanguage] = useState<SupportedLanguage>(activeLanguage);
  const primaryCtaLabel = homepageV3.hero.primaryCta;
  const activeNavId = resolveActiveNavId(path, activeSectionId);

  useEffect(() => {
    setSelectedLanguage(activeLanguage);
  }, [activeLanguage]);

  useEffect(() => {
    const onPopState = () => {
      setPath(resolvePublicPath(window.location.pathname));
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  useEffect(() => {
    if (path !== "/") {
      setActiveSectionId(null);
      return;
    }

    const syncActiveSection = () => {
      setActiveSectionId(readActiveHomepageSectionId());
    };

    syncActiveSection();
    window.addEventListener("scroll", syncActiveSection, { passive: true });
    window.addEventListener("resize", syncActiveSection);

    return () => {
      window.removeEventListener("scroll", syncActiveSection);
      window.removeEventListener("resize", syncActiveSection);
    };
  }, [path]);

  useEffect(() => {
    return onModalOpen((modalName) => {
      if (modalName !== "mobileMenu") {
        setMobileMenuOpen(false);
      }
    });
  }, []);

  useEffect(() => {
    if (!mobileMenuOpen) {
      return;
    }

    emitModalOpen("mobileMenu");
    lockBodyScroll();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      unlockBodyScroll();
      emitModalClose("mobileMenu");
    };
  }, [mobileMenuOpen]);

  const handleNavItem = (targetId: string) => {
    if (targetId === "contact") {
      if (mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
      navigateToContact();
      return;
    }

    if (targetId === "platform") {
      if (mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
      navigateToPlatform();
      return;
    }

    if (targetId === "workflow") {
      if (mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
      navigateToWorkflow();
      setPath("/workflow");
      setActiveSectionId(null);
      return;
    }

    if (
      targetId === "home" ||
      targetId === "homepage-v1" ||
      targetId === "homepage-v2" ||
      targetId === "homepage-v3"
    ) {
      if (mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
      navigateAppPath("/");
      setPath("/");
      setActiveSectionId(null);
      return;
    }

    const homepageSectionId = resolveHomepageSectionId(targetId);
    if (homepageSectionId) {
      if (mobileMenuOpen) {
        setMobileMenuOpen(false);
        window.setTimeout(() => {
          navigateToSection(homepageSectionId);
          setPath("/");
        }, 320);
        return;
      }

      navigateToSection(homepageSectionId);
      setPath("/");
      return;
    }

    if (mobileMenuOpen) {
      setMobileMenuOpen(false);
      window.setTimeout(() => navigateToSection(targetId), 320);
      return;
    }

    navigateToSection(targetId);
  };

  const handleLanguageChange = (language: SupportedLanguage) => {
    setSelectedLanguage(language);
    void changeAppLanguage(language);
  };

  const renderLanguageSwitcher = (switcherId: string) => (
    <LanguageDropdown
      id={switcherId}
      label={nav.languageLabel}
      value={selectedLanguage}
      languageLabels={nav.languages ?? {}}
      onChange={handleLanguageChange}
    />
  );

  const desktopNavClassName = (isActive: boolean) =>
    `text-ui-button font-medium transition-colors cursor-pointer relative py-1 group ${
      isActive ? "text-white" : "text-white/70 hover:text-white"
    }`;

  const desktopNavUnderlineClassName = (isActive: boolean) =>
    `absolute bottom-0 left-0 h-px bg-brand transition-all duration-300 ${
      isActive ? "w-full" : "w-0 group-hover:w-full"
    }`;

  const mobileNavClassName = (isActive: boolean) =>
    `text-left py-2 text-ui-button font-medium border-b ${
      isActive ? "text-white border-brand/35" : "text-white/70 hover:text-white border-white/[0.03]"
    }`;

  return (
    <>
      {/* Mobile: fixed so sticky survives overflow-x ancestors; desktop keeps sticky. */}
      <header className="fixed top-0 left-0 right-0 md:sticky md:top-0 z-40 w-full border-b border-white/[0.08] bg-[#0C111B]/95 md:bg-[#0C111B]/90 md:backdrop-blur-md min-w-0">
        <div className="max-w-7xl mx-auto px-3 min-[341px]:px-4 sm:px-6 h-16 max-[340px]:h-[4.25rem] min-[341px]:h-20 flex items-center justify-between gap-2 min-[341px]:gap-3 min-w-0">
          <a
            href="/"
            onClick={(event) => {
              event.preventDefault();
              navigateAppPath("/");
              setPath("/");
              setActiveSectionId(null);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="flex items-center cursor-pointer min-w-0"
            aria-label={getBrandAriaLabel()}
          >
            <HeaderLogo />
          </a>

          <nav className="hidden md:flex items-center gap-8" aria-label="Primary">
            {menuItems.map((item) => {
              const isActive = activeNavId === item.id;
              const homepageSectionId = resolveHomepageSectionId(item.id);
              const content = (
                <>
                  {item.label}
                  <span className={desktopNavUnderlineClassName(isActive)} aria-hidden="true" />
                </>
              );

              if (homepageSectionId) {
                return (
                  <a
                    key={item.id}
                    href={getHomepageSectionHref(homepageSectionId)}
                    onClick={(event) => {
                      event.preventDefault();
                      handleNavItem(homepageSectionId);
                    }}
                    className={desktopNavClassName(isActive)}
                    aria-current={isActive ? "page" : undefined}
                  >
                    {content}
                  </a>
                );
              }

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNavItem(item.id)}
                  className={desktopNavClassName(isActive)}
                  aria-current={isActive ? "page" : undefined}
                >
                  {content}
                </button>
              );
            })}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            {renderLanguageSwitcher(desktopLanguageSwitcherId)}
            <PrimaryButton onClick={() => navigateToContact()}>{primaryCtaLabel}</PrimaryButton>
          </div>

          <div className="md:hidden flex items-center gap-2">
            {renderLanguageSwitcher(mobileLanguageSwitcherId)}
            <button
              type="button"
              onClick={() => setMobileMenuOpen((open) => !open)}
              className="w-11 h-11 flex items-center justify-center rounded-full border border-white/15 bg-white/5 active:scale-95 transition-all text-white/80 hover:text-white hover:bg-white/10"
              aria-label={nav.toggleMenuLabel}
              aria-expanded={mobileMenuOpen}
              aria-controls={menuId}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen ? (
          <div
            id={menuId}
            className="md:hidden border-b border-white/10 bg-[#0C111B]/95 backdrop-blur-2xl overflow-hidden"
            role="dialog"
            aria-modal="true"
            aria-label={t("nav.toggleMenuLabel")}
          >
            <div className="px-3 min-[341px]:px-4 sm:px-6 py-5 max-[340px]:py-4 flex flex-col gap-4 min-[341px]:gap-5">
              {menuItems.map((item) => {
                const isActive = activeNavId === item.id;
                const homepageSectionId = resolveHomepageSectionId(item.id);

                if (homepageSectionId) {
                  return (
                    <a
                      key={item.id}
                      href={getHomepageSectionHref(homepageSectionId)}
                      onClick={(event) => {
                        event.preventDefault();
                        handleNavItem(homepageSectionId);
                      }}
                      className={mobileNavClassName(isActive)}
                      aria-current={isActive ? "page" : undefined}
                    >
                      {item.label}
                    </a>
                  );
                }

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleNavItem(item.id)}
                    className={mobileNavClassName(isActive)}
                    aria-current={isActive ? "page" : undefined}
                  >
                    {item.label}
                  </button>
                );
              })}
              <div className="pt-2">
                <PrimaryButton
                  onClick={() => navigateToContact()}
                  className="w-full justify-center"
                >
                  {primaryCtaLabel}
                </PrimaryButton>
              </div>
            </div>
          </div>
        ) : null}
      </header>
      {/* Reserve header height on mobile so content is not hidden under fixed header. */}
      <div
        className="md:hidden h-16 max-[340px]:h-[4.25rem] min-[341px]:h-20 shrink-0"
        aria-hidden="true"
      />
    </>
  );
}
