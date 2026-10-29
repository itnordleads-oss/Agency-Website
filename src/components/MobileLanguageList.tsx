import React, { useId } from "react";
import { Check } from "lucide-react";
import { supportedLanguages, type SupportedLanguage } from "../i18n";
import "./mobileLanguageList.css";

type MobileLanguageListProps = {
  label: string;
  value: SupportedLanguage;
  languageLabels: Partial<Record<SupportedLanguage, string>>;
  onChange: (language: SupportedLanguage) => void;
};

/**
 * Mobile-only language picker — flat list inside the hamburger menu.
 * Desktop continues to use LanguageDropdown.
 */
export default function MobileLanguageList({
  label,
  value,
  languageLabels,
  onChange,
}: MobileLanguageListProps) {
  const baseId = useId();
  const headingId = `${baseId}-heading`;
  const listId = `${baseId}-list`;

  const onOptionKeyDown = (
    event: React.KeyboardEvent<HTMLButtonElement>,
    language: SupportedLanguage,
    index: number
  ) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onChange(language);
      return;
    }

    let nextIndex: number | null = null;
    if (event.key === "ArrowDown") {
      nextIndex = (index + 1) % supportedLanguages.length;
    } else if (event.key === "ArrowUp") {
      nextIndex = (index - 1 + supportedLanguages.length) % supportedLanguages.length;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = supportedLanguages.length - 1;
    }

    if (nextIndex === null) {
      return;
    }

    event.preventDefault();
    document.getElementById(`${baseId}-option-${supportedLanguages[nextIndex]}`)?.focus();
  };

  return (
    <div className="mobile-language-list">
      <p id={headingId} className="mobile-language-list__heading">
        {label}
      </p>
      <ul
        id={listId}
        className="mobile-language-list__options"
        role="listbox"
        aria-labelledby={headingId}
        aria-orientation="vertical"
      >
        {supportedLanguages.map((language, index) => {
          const selected = language === value;
          const name = languageLabels[language] ?? language.toUpperCase();

          return (
            <li key={language} role="presentation">
              <button
                type="button"
                id={`${baseId}-option-${language}`}
                role="option"
                aria-selected={selected}
                tabIndex={selected ? 0 : -1}
                lang={language}
                className={`mobile-language-list__option${
                  selected ? " mobile-language-list__option--selected" : ""
                }`}
                onClick={() => onChange(language)}
                onKeyDown={(event) => onOptionKeyDown(event, language, index)}
              >
                <span className="mobile-language-list__name">{name}</span>
                {selected ? (
                  <Check className="mobile-language-list__check" aria-hidden="true" />
                ) : (
                  <span className="mobile-language-list__check-slot" aria-hidden="true" />
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
