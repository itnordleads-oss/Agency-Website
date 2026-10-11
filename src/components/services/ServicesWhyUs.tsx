import React from "react";
import SectionEyebrow from "../SectionEyebrow";
import GlassCard from "../GlassCard";
import {
  SERVICES_INTRO_CLASS,
  SERVICES_SECTION_CLASS,
  SERVICES_SHELL_CLASS,
} from "./servicesLayout";
import type en from "../../i18n/locales/en";

type WhyUsCopy = (typeof en)["servicesPage"]["whyUs"];

type ServicesWhyUsProps = {
  copy: WhyUsCopy;
};

export default function ServicesWhyUs({ copy }: ServicesWhyUsProps) {
  return (
    <section
      className={`${SERVICES_SECTION_CLASS} bg-black/10`}
      aria-labelledby="services-why-title"
    >
      <div className={SERVICES_SHELL_CLASS}>
        <div className={SERVICES_INTRO_CLASS}>
          <SectionEyebrow label={copy.eyebrow} />
          <h2 id="services-why-title" className="section-title">
            {copy.title}
          </h2>
          <p className="max-w-2xl text-base leading-relaxed text-body">{copy.subtitle}</p>
        </div>
        <ul className="m-0 grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
          {copy.items.map((item) => (
            <li key={item.title} className="min-h-0">
              <GlassCard
                glowColor="cyan"
                className="h-full border border-white/[0.08] bg-white/[0.02] p-5"
                contentClassName="flex h-full min-h-[7.5rem] flex-col"
              >
                <h3 className="text-base font-semibold text-white">{item.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-body">{item.description}</p>
              </GlassCard>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
