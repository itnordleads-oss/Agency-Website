import React, { useId, useState } from "react";
import { ChevronDown } from "lucide-react";
import SectionEyebrow from "../SectionEyebrow";
import {
  SERVICES_DETAIL_CLASS,
  SERVICES_SECTION_CLASS,
  SERVICES_SHELL_CLASS,
} from "./servicesLayout";

type FaqCopy = {
  eyebrow: string;
  title: string;
  subtitle: string;
  items: readonly {
    q: string;
    a: string;
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

  return (
    <section
      className={isDetail ? SERVICES_DETAIL_CLASS : `${SERVICES_SECTION_CLASS} bg-black/[0.08]`}
      aria-labelledby="services-faq-title"
    >
      <div className={SERVICES_SHELL_CLASS}>
        <div
          className={`mx-auto max-w-3xl space-y-3 text-center ${
            isDetail ? "mb-7 md:mb-8" : "mb-8 md:mb-10"
          }`}
        >
          <div className="flex justify-center">
            <SectionEyebrow label={copy.eyebrow} />
          </div>
          <h2 id="services-faq-title" className="section-title">
            {copy.title}
          </h2>
          <p className="text-base leading-relaxed text-body">{copy.subtitle}</p>
        </div>

        <div className="mx-auto w-full max-w-4xl space-y-2.5">
          {copy.items.map((item, index) => {
            const isOpen = index === openIndex;
            const panelId = `${panelIdBase}-panel-${index}`;
            return (
              <div
                key={item.q}
                className={`rounded-xl border transition-colors ${
                  isOpen
                    ? "border-[#3D81E3]/40 bg-[#3D81E3]/[0.06]"
                    : "border-white/[0.1] bg-white/[0.02] hover:border-white/20"
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggle(index)}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  className="flex min-h-12 w-full cursor-pointer items-center justify-between gap-4 px-4 py-3.5 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3D81E3] sm:px-5 sm:py-4"
                >
                  <span className="text-sm font-semibold leading-snug text-white md:text-base">
                    {item.q}
                  </span>
                  <ChevronDown
                    className={`h-5 w-5 shrink-0 text-[#A4F4FD] transition-transform duration-300 motion-reduce:transition-none ${
                      isOpen ? "rotate-180" : ""
                    }`}
                    aria-hidden
                  />
                </button>
                <div
                  id={panelId}
                  role="region"
                  className={`grid transition-[grid-template-rows,opacity] duration-300 ease-in-out motion-reduce:transition-none ${
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="px-4 pb-4 text-sm leading-relaxed text-body sm:px-5 sm:pb-5">
                      {item.a}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
