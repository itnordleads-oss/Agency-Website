import React from "react";
import SectionEyebrow from "../SectionEyebrow";
import NewHomeSectionCardBorder from "../NewHomeSectionCardBorder";
import GlassCard from "../GlassCard";
import {
  SERVICES_INTRO_CLASS,
  SERVICES_SECTION_CLASS,
  SERVICES_SHELL_CLASS,
} from "./servicesLayout";
import type en from "../../i18n/locales/en";

type ProcessCopy = (typeof en)["servicesPage"]["process"];

type ServicesProcessProps = {
  copy: ProcessCopy;
};

export default function ServicesProcess({ copy }: ServicesProcessProps) {
  return (
    <section className={SERVICES_SECTION_CLASS} aria-labelledby="services-process-title">
      <div className={SERVICES_SHELL_CLASS}>
        <div className={SERVICES_INTRO_CLASS}>
          <SectionEyebrow label={copy.eyebrow} />
          <h2 id="services-process-title" className="section-title">
            {copy.title}
          </h2>
          <p className="max-w-2xl text-base leading-relaxed text-body">{copy.subtitle}</p>
        </div>
        <ol className="m-0 grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-2 lg:grid-cols-6 2xl:grid-cols-5">
          {copy.steps.map((step, index) => (
            <li
              key={step.number}
              className={`min-h-0 lg:col-span-2 2xl:col-span-1 ${
                index === 3 ? "lg:col-start-2 2xl:col-start-auto" : ""
              }`}
            >
              <NewHomeSectionCardBorder className="h-full rounded-2xl">
                <GlassCard
                  className="h-full border border-white/[0.08] bg-white/[0.02] p-5 md:p-6"
                  contentClassName="flex h-full min-h-[10rem] flex-col"
                >
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#3D81E3]/35 bg-[#3D81E3]/10 text-xs font-bold text-[#A4F4FD]">
                    {step.number}
                  </span>
                  <h3 className="mt-4 text-lg font-semibold leading-snug text-white">
                    {step.title}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-body">
                    {step.description}
                  </p>
                </GlassCard>
              </NewHomeSectionCardBorder>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
