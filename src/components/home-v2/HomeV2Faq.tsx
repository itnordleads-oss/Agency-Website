import React, { useId, useState } from "react";
import { ChevronDown } from "lucide-react";
import SectionEyebrow from "../SectionEyebrow";
import { useHomepageCopy } from "./homepageVariantContext";

export default function HomeV2Faq() {
  const { faq } = useHomepageCopy();
  const panelIdBase = useId();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section
      id="v2-faq"
      className="relative min-w-0 overflow-hidden pt-12 pb-0 max-[340px]:pt-10 sm:pt-14 md:pt-16"
    >
      <div className="relative z-10 mx-auto w-full min-w-0 max-w-3xl px-3 min-[341px]:px-4 sm:px-6">
        <div className="mx-auto mb-8 max-w-2xl space-y-2.5 text-center md:mb-10">
          <div className="flex justify-center">
            <SectionEyebrow label={faq.eyebrow} />
          </div>
          <h2 className="section-title">{faq.title}</h2>
        </div>

        <div className="space-y-2.5">
          {faq.items.map((item, index) => {
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
                  onClick={() => setOpenIndex((current) => (current === index ? null : index))}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  className="flex w-full cursor-pointer items-center justify-between gap-4 px-4 py-3.5 text-left sm:px-5 sm:py-4"
                >
                  <span className="text-sm font-semibold leading-snug text-white">{item.q}</span>
                  <ChevronDown
                    className={`h-5 w-5 shrink-0 text-[#A4F4FD] transition-transform duration-300 motion-reduce:transition-none ${
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
                    <p className="px-4 pb-4 text-sm leading-snug text-body sm:px-5 sm:pb-5">
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
