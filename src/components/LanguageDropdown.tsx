import React, { useEffect, useId, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { supportedLanguages, type SupportedLanguage } from "../i18n";

interface LanguageDropdownProps {
  id?: string;
  label: string;
  value: SupportedLanguage;
  /** Compact codes shown on the trigger (EN, PL, …). */
  languageCodes: Partial<Record<SupportedLanguage, string>>;
  /** Full readable names shown in the menu (English, Polski, …). */
  languageLabels: Partial<Record<SupportedLanguage, string>>;
  onChange: (language: SupportedLanguage) => void;
  /** Align the floating menu on desktop. */
  menuAlign?: "start" | "end";
  /**
   * `panel` keeps the same dropdown control, but opens the list in-flow
   * so mobile hamburger overflow cannot clip/misplace it.
   */
  variant?: "default" | "panel";
  className?: string;
}

export default function LanguageDropdown({
  id,
  label,
  value,
  languageCodes,
  languageLabels,
  onChange,
  menuAlign = "end",
  variant = "default",
  className = "",
}: LanguageDropdownProps) {
  const generatedId = useId();
  const triggerId = id ?? generatedId;
  const listboxId = `${triggerId}-listbox`;
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLUListElement>(null);
  const isPanel = variant === "panel";

  useEffect(() => {
    if (!open) {
      return;
    }

    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
        triggerRef.current?.focus();
      }
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  useEffect(() => {
    if (!open) {
      return;
    }
    const selected = document.getElementById(`${triggerId}-option-${value}`);
    selected?.focus();
    menuRef.current?.scrollIntoView({ block: "nearest", inline: "nearest" });
  }, [open, triggerId, value]);

  const selectLanguage = (language: SupportedLanguage) => {
    if (language !== value) {
      onChange(language);
    }
    setOpen(false);
    triggerRef.current?.focus();
  };

  const onTriggerKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "ArrowDown" || event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setOpen(true);
    }
  };

  const onOptionKeyDown = (
    event: React.KeyboardEvent<HTMLButtonElement>,
    language: SupportedLanguage,
    index: number
  ) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      selectLanguage(language);
      return;
    }

    if (event.key === "Home") {
      event.preventDefault();
      document.getElementById(`${triggerId}-option-${supportedLanguages[0]}`)?.focus();
      return;
    }

    if (event.key === "End") {
      event.preventDefault();
      document
        .getElementById(`${triggerId}-option-${supportedLanguages[supportedLanguages.length - 1]}`)
        ?.focus();
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      const next = supportedLanguages[(index + 1) % supportedLanguages.length];
      document.getElementById(`${triggerId}-option-${next}`)?.focus();
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      const prev =
        supportedLanguages[(index - 1 + supportedLanguages.length) % supportedLanguages.length];
      document.getElementById(`${triggerId}-option-${prev}`)?.focus();
    }
  };

  const triggerLabel = languageCodes[value] ?? value.toUpperCase();
  const panelTriggerLabel = languageLabels[value] ?? triggerLabel;

  return (
    <div
      ref={rootRef}
      className={`language-dropdown relative z-50 shrink-0${
        isPanel ? " language-dropdown--panel" : ""
      }${className ? ` ${className}` : ""}`}
    >
      {isPanel ? (
        <p className="language-dropdown__panel-label" id={`${triggerId}-label`}>
          {label}
        </p>
      ) : (
        <span className="sr-only" id={`${triggerId}-label`}>
          {label}
        </span>
      )}
      <button
        type="button"
        ref={triggerRef}
        id={triggerId}
        aria-labelledby={`${triggerId}-label`}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        onClick={() => setOpen((current) => !current)}
        onKeyDown={onTriggerKeyDown}
        className="language-dropdown__trigger"
      >
        <span className="language-dropdown__value" lang={value}>
          {isPanel ? panelTriggerLabel : triggerLabel}
        </span>
        <ChevronDown
          className={`language-dropdown__chevron ${open ? "language-dropdown__chevron--open" : ""}`}
          aria-hidden="true"
        />
      </button>

      {open ? (
        <ul
          ref={menuRef}
          id={listboxId}
          role="listbox"
          aria-labelledby={`${triggerId}-label`}
          className={`language-dropdown__menu language-dropdown__menu--${menuAlign}${
            isPanel ? " language-dropdown__menu--panel" : ""
          }`}
        >
          {supportedLanguages.map((language, index) => {
            const isSelected = language === value;
            const fullName = languageLabels[language] ?? language.toUpperCase();
            const code = languageCodes[language] ?? language.toUpperCase();
            return (
              <li key={language} role="presentation">
                <button
                  type="button"
                  id={`${triggerId}-option-${language}`}
                  role="option"
                  aria-selected={isSelected}
                  tabIndex={isSelected ? 0 : -1}
                  lang={language}
                  onClick={() => selectLanguage(language)}
                  onKeyDown={(event) => onOptionKeyDown(event, language, index)}
                  className={`language-dropdown__option${
                    isSelected ? " language-dropdown__option--selected" : ""
                  }`}
                >
                  <span className="language-dropdown__option-name">{fullName}</span>
                  <span className="language-dropdown__option-code" aria-hidden="true">
                    {code}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
