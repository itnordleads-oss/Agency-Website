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
  getPublishedStudioNavItems,
  resolveActiveStudioNavId,
  type StudioNavItemId,
} from "../lib/studioNavigation";
import {
  emitModalClose,
  emitModalOpen,
  lockBodyScroll,
  onModalOpen,
  unlockBodyScroll,
} from "../lib/modalManager";
import { navigateAppPath, navigateToContact, resolvePublicPath } from "../App";

export default function Navbar() {
  const { nav, homepageV3 } = useSiteCopy();
  const { i18n } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [path, setPath] = useState(() =>
    typeof window !== "undefined" ? resolvePublicPath(window.location.pathname) : "/"
  );
  const menuId = useId();
  const desktopLanguageSwitcherId = useId();
  const mobileLanguageSwitcherId = useId();
  const menuItems = getPublishedStudioNavItems();
  const activeLanguage = resolveActiveLanguage(i18n.resolvedLanguage ?? i18n.language);
  const [selectedLanguage, setSelectedLanguage] = useState<SupportedLanguage>(activeLanguage);
  const primaryCtaLabel = homepageV3.hero.primaryCta;
  const activeNavId = resolveActiveStudioNavId(path);

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

  const handleNavItem = (id: StudioNavItemId, href: string) => {
    if (mobileMenuOpen) {
      setMobileMenuOpen(false);
    }
    navigateAppPath(href);
    setPath(resolvePublicPath(href));
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
      <header className="fixed top-0 left-0 right-0 lg:sticky lg:top-0 z-40 w-full border-b border-white/[0.08] bg-[#0C111B]/95 lg:bg-[#0C111B]/90 lg:backdrop-blur-md min-w-0">
        <div className="max-w-7xl mx-auto px-3 min-[341px]:px-4 sm:px-6 h-16 max-[340px]:h-[4.25rem] min-[341px]:h-20 flex items-center justify-between gap-2 min-[341px]:gap-3 min-w-0">
          <a
            href="/"
            onClick={(event) => {
              event.preventDefault();
              navigateAppPath("/");
              setPath("/");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="flex items-center cursor-pointer min-w-0"
            aria-label={getBrandAriaLabel()}
          >
            <HeaderLogo />
          </a>

          <nav className="hidden lg:flex items-center gap-7 xl:gap-8" aria-label="Primary">
            {menuItems.map((item) => {
              const isActive = activeNavId === item.id;

              return (
                <a
                  key={item.id}
                  href={item.path}
                  onClick={(event) => {
                    event.preventDefault();
                    handleNavItem(item.id, item.path);
                  }}
                  className={desktopNavClassName(isActive)}
                  aria-current={isActive ? "page" : undefined}
                >
                  {item.label}
                  <span className={desktopNavUnderlineClassName(isActive)} aria-hidden="true" />
                </a>
              );
            })}
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            {renderLanguageSwitcher(desktopLanguageSwitcherId)}
            <PrimaryButton onClick={() => navigateToContact()}>{primaryCtaLabel}</PrimaryButton>
          </div>

          <div className="lg:hidden flex items-center gap-2">
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
            className="lg:hidden border-b border-white/10 bg-[#0C111B]/95 backdrop-blur-2xl overflow-hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Main menu"
          >
            <div className="px-3 min-[341px]:px-4 sm:px-6 py-5 max-[340px]:py-4 flex flex-col gap-4 min-[341px]:gap-5">
              {menuItems.map((item) => {
                const isActive = activeNavId === item.id;

                return (
                  <a
                    key={item.id}
                    href={item.path}
                    onClick={(event) => {
                      event.preventDefault();
                      handleNavItem(item.id, item.path);
                    }}
                    className={mobileNavClassName(isActive)}
                    aria-current={isActive ? "page" : undefined}
                  >
                    {item.label}
                  </a>
                );
              })}
              <div className="pt-2">
                <PrimaryButton
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigateToContact();
                  }}
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
        className="lg:hidden h-16 max-[340px]:h-[4.25rem] min-[341px]:h-20 shrink-0"
        aria-hidden="true"
      />
    </>
  );
}
