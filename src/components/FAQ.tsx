import React, { useId, useState } from "react";
import { ChevronDown } from "lucide-react";
import SectionEyebrow from "./SectionEyebrow";
import { PrimaryButton } from "./Buttons";
import { useSiteCopy } from "../lib/useSiteCopy";
import { navigateToContact } from "../App";

export default function FAQ() {
  const { faq } = useSiteCopy();
  const faqs = faq.items;
  const panelIdBase = useId();

  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (index: number) => {
    setOpenIndex((current) => (current === index ? null : index));
  };

  return (
    <section className="section-padding relative overflow-hidden" id="faq">
      <div className="absolute top-1/3 left-[12%] w-[360px] h-[360px] rounded-full bg-[#3D81E3]/5 blur-[80px] md:blur-[150px] pointer-events-none motion-reduce:hidden" />

      <div className="max-w-3xl mx-auto px-3 min-[341px]:px-4 sm:px-6 relative z-10 min-w-0">
        <div className="text-center max-w-2xl mx-auto space-y-4 mb-12 md:mb-16">
          <div className="flex justify-center">
            <SectionEyebrow label={faq.eyebrow.label} tag={faq.eyebrow.tag} />
          </div>
          <h2 className="section-title">{faq.title}</h2>
          <p className="text-body text-base md:text-lg leading-relaxed">{faq.subtitle}</p>
        </div>

        <div className="space-y-3">
          {faqs.map((item, index) => {
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
                  className="w-full flex items-center justify-between gap-4 text-left px-5 py-4 cursor-pointer"
                >
                  <span className="text-sm md:text-base font-semibold text-white leading-snug">
                    {item.q}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 shrink-0 text-[#A4F4FD] transition-transform duration-300 motion-reduce:transition-none ${
                      isOpen ? "rotate-180" : ""
                    }`}
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
                    <p className="text-sm text-body leading-relaxed px-5 pb-5">{item.a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-10 flex flex-col items-center gap-3 text-center">
          <p className="text-sm text-muted">{faq.footerNote}</p>
          <PrimaryButton onClick={navigateToContact} className="px-7 py-3">
            {faq.cta}
          </PrimaryButton>
        </div>
      </div>
    </section>
  );
}
