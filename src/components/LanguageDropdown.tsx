import React, { useEffect, useId, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { supportedLanguages, type SupportedLanguage } from "../i18n";

interface LanguageDropdownProps {
  id?: string;
  label: string;
  value: SupportedLanguage;
  languageLabels: Partial<Record<SupportedLanguage, string>>;
  onChange: (language: SupportedLanguage) => void;
}

export default function LanguageDropdown({
  id,
  label,
  value,
  languageLabels,
  onChange,
}: LanguageDropdownProps) {
  const generatedId = useId();
  const triggerId = id ?? generatedId;
  const listboxId = `${triggerId}-listbox`;
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

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
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const selectLanguage = (language: SupportedLanguage) => {
    if (language !== value) {
      onChange(language);
    }
    setOpen(false);
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

  return (
    <div ref={rootRef} className="language-dropdown relative z-50 shrink-0">
      <span className="sr-only" id={`${triggerId}-label`}>
        {label}
      </span>
      <button
        type="button"
        id={triggerId}
        aria-labelledby={`${triggerId}-label`}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        onClick={() => setOpen((current) => !current)}
        onKeyDown={onTriggerKeyDown}
        className="language-dropdown__trigger"
      >
        <span className="language-dropdown__value">
          {languageLabels[value] ?? value.toUpperCase()}
        </span>
        <ChevronDown
          className={`language-dropdown__chevron ${open ? "language-dropdown__chevron--open" : ""}`}
          aria-hidden="true"
        />
      </button>

      {open ? (
        <ul
          id={listboxId}
          role="listbox"
          aria-labelledby={`${triggerId}-label`}
          className="language-dropdown__menu"
        >
          {supportedLanguages.map((language, index) => {
            const isSelected = language === value;
            return (
              <li key={language} role="presentation">
                <button
                  type="button"
                  id={`${triggerId}-option-${language}`}
                  role="option"
                  aria-selected={isSelected}
                  tabIndex={isSelected ? 0 : -1}
                  onClick={() => selectLanguage(language)}
                  onKeyDown={(event) => onOptionKeyDown(event, language, index)}
                  className={`language-dropdown__option${isSelected ? " language-dropdown__option--selected" : ""}`}
                >
                  {languageLabels[language] ?? language.toUpperCase()}
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
