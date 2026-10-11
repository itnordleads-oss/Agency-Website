import React from "react";
import SectionEyebrow from "../SectionEyebrow";
import { PrimaryButton, SecondaryButton } from "../Buttons";
import { navigateToContact } from "../../App";
import { SERVICES_SHELL_CLASS } from "./servicesLayout";
import { ServiceIcon } from "./serviceIcons";
import type en from "../../i18n/locales/en";

type HeroCopy = (typeof en)["servicesPage"]["hero"];
type ServiceSummary = (typeof en)["servicesPage"]["services"][number];

type ServicesHeroProps = {
  copy: HeroCopy;
  services: readonly ServiceSummary[];
};

export default function ServicesHero({ copy, services }: ServicesHeroProps) {
  const scrollToOverview = () => {
    document.getElementById("services-overview")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      className="relative overflow-hidden pb-10 pt-1 sm:pb-12 md:pb-14"
      aria-labelledby="services-hero-title"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(700px_circle_at_80%_35%,rgba(61,129,227,0.16),transparent_62%)] motion-reduce:hidden" />
      <div className={SERVICES_SHELL_CLASS}>
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-10 xl:gap-14">
          <div className="lg:col-span-7">
            <SectionEyebrow label={copy.eyebrow} className="mb-4" />
            <h1
              id="services-hero-title"
              className="max-w-4xl text-balance text-3xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-4xl lg:text-5xl"
            >
              {copy.title}
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-body md:text-lg">
              {copy.subtitle}
            </p>
            <div className="mt-7 flex flex-col flex-wrap gap-3 sm:flex-row">
              <PrimaryButton onClick={navigateToContact} className="w-full px-8 py-3.5 sm:w-auto">
                {copy.primaryCta}
              </PrimaryButton>
              <SecondaryButton
                type="button"
                onClick={scrollToOverview}
                className="w-full px-8 py-3.5 sm:w-auto"
              >
                {copy.secondaryCta}
              </SecondaryButton>
            </div>
          </div>

          <div className="relative lg:col-span-5">
            <div className="liquid-glass relative overflow-hidden rounded-2xl border border-white/12 bg-white/[0.035] p-4 sm:p-5">
              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(61,129,227,0.1),transparent_45%,rgba(0,210,255,0.05))]" />
              <div className="relative grid grid-cols-2 gap-2.5 sm:gap-3">
                {services.map((service) => (
                  <div
                    key={service.id}
                    className="flex min-w-0 items-center gap-2.5 rounded-xl border border-white/10 bg-[#0C111B]/55 p-3 sm:p-3.5"
                  >
                    <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[#3D81E3]/30 bg-[#3D81E3]/10 text-[#A4F4FD]">
                      <ServiceIcon serviceId={service.id} className="h-4 w-4" />
                    </span>
                    <span className="min-w-0 text-xs font-semibold leading-snug text-white/85 sm:text-sm">
                      {service.title}
                    </span>
                  </div>
                ))}
              </div>
              <div className="relative mt-3 flex items-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.025] px-4 py-3">
                <span className="h-2 w-2 shrink-0 rounded-full bg-[#A4F4FD] shadow-[0_0_12px_rgba(164,244,253,0.75)]" />
                <span className="text-xs leading-relaxed text-white/60">{copy.visualNote}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
