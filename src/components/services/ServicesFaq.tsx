import React, { useId, useState } from "react";
import { ChevronDown } from "lucide-react";
import SectionEyebrow from "../SectionEyebrow";
import { navigateAppPath } from "../../App";
import {
  SERVICES_DETAIL_CLASS,
  SERVICES_SECTION_CLASS,
  SERVICES_SHELL_CLASS,
} from "./servicesLayout";

type FaqCopy = {
  eyebrow: string;
  title: string;
  subtitle: string;
  contactPrompt?: string;
  contactCta?: string;
  items: readonly {
    q: string;
    a: string;
    ctaLabel?: string;
    ctaHref?: string;
  }[];
};

type ServicesFaqProps = {
  copy: FaqCopy;
  variant?: "hub" | "detail";
};

export default function ServicesFaq({ copy, variant = "hub" }: ServicesFaqProps) {
  const panelIdBase = useId();
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const isDetail = variant === "detail";

  const toggle = (index: number) => {
    setOpenIndex((current) => (current === index ? null : index));
  };

  if (isDetail) {
    return (
      <section
        className={`${SERVICES_DETAIL_CLASS} service-detail-faq-section`}
        aria-labelledby="services-faq-title"
      >
        <div className={SERVICES_SHELL_CLASS}>
          <div className="service-detail-faq">
            <div className="space-y-3">
              <SectionEyebrow label={copy.eyebrow} />
              <h2 id="services-faq-title" className="section-title">
                {copy.title}
              </h2>
              <p className="max-w-sm text-sm leading-relaxed text-body sm:text-base">
                {copy.subtitle}
              </p>
            </div>

            <div className="service-detail-faq__list">
              {copy.items.map((item, index) => {
                const isOpen = index === openIndex;
                const panelId = `${panelIdBase}-panel-${index}`;
                const buttonId = `${panelIdBase}-button-${index}`;
                return (
                  <div key={item.q} className={`services-faq-row${isOpen ? " is-open" : ""}`}>
                    <button
                      id={buttonId}
                      type="button"
                      onClick={() => toggle(index)}
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      className="services-faq-row__button"
                    >
                      <span className="services-faq-row__number" aria-hidden>
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="services-faq-row__question">{item.q}</span>
                      <ChevronDown className="services-faq-row__chevron" aria-hidden />
                    </button>
                    <div
                      id={panelId}
                      role="region"
                      aria-labelledby={buttonId}
                      className="services-faq-row__answer"
                    >
                      <div>
                        <p>{item.a}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      className={`${SERVICES_SECTION_CLASS} services-faq-section`}
      aria-labelledby="services-faq-title"
    >
      <div className={SERVICES_SHELL_CLASS}>
        <div className="services-faq-layout">
          <div className="services-faq-intro">
            <SectionEyebrow label={copy.eyebrow} />
            <h2 id="services-faq-title" className="section-title">
              {copy.title}
            </h2>
            <p>{copy.subtitle}</p>
            <a
              className="services-faq-contact"
              href="/contact"
              onClick={(event) => {
                if (
                  event.defaultPrevented ||
                  event.button !== 0 ||
                  event.metaKey ||
                  event.ctrlKey ||
                  event.shiftKey ||
                  event.altKey
                ) {
                  return;
                }
                event.preventDefault();
                navigateAppPath("/contact");
              }}
            >
              {copy.contactPrompt ?? "Still have a question?"}
              <span>{copy.contactCta ?? "Contact Us"} →</span>
            </a>
          </div>

          <div className="services-faq-list">
            {copy.items.map((item, index) => {
              const isOpen = index === openIndex;
              const panelId = `${panelIdBase}-panel-${index}`;
              const buttonId = `${panelIdBase}-button-${index}`;

              return (
                <div key={item.q} className={`services-faq-row${isOpen ? " is-open" : ""}`}>
                  <button
                    id={buttonId}
                    type="button"
                    onClick={() => toggle(index)}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    className="services-faq-row__button"
                  >
                    <span className="services-faq-row__number" aria-hidden>
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="services-faq-row__question">{item.q}</span>
                    <ChevronDown className="services-faq-row__chevron" aria-hidden />
                  </button>
                  <div
                    id={panelId}
                    role="region"
                    aria-labelledby={buttonId}
                    className="services-faq-row__answer"
                  >
                    <div>
                      <p>{item.a}</p>
                      {item.ctaLabel && item.ctaHref ? (
                        <a
                          className="services-faq-contact mt-3 inline-flex"
                          href={item.ctaHref}
                          onClick={(event) => {
                            if (
                              event.defaultPrevented ||
                              event.button !== 0 ||
                              event.metaKey ||
                              event.ctrlKey ||
                              event.shiftKey ||
                              event.altKey
                            ) {
                              return;
                            }
                            event.preventDefault();
                            navigateAppPath(item.ctaHref!);
                          }}
                        >
                          <span>{item.ctaLabel} →</span>
                        </a>
                      ) : null}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
