import React from "react";
import { PrimaryButton } from "../Buttons";
import { navigateToContact } from "../../App";
import { SERVICES_SHELL_CLASS } from "./servicesLayout";
import type en from "../../i18n/locales/en";

type FinalCtaCopy = (typeof en)["servicesPage"]["finalCta"];

type ServicesFinalCtaProps = {
  copy: FinalCtaCopy;
};

export default function ServicesFinalCta({ copy }: ServicesFinalCtaProps) {
  return (
    <section className="relative overflow-hidden py-8 sm:py-10 md:py-12">
      <div className={SERVICES_SHELL_CLASS}>
        <div className="liquid-glass cta-glow-panel relative overflow-hidden rounded-2xl border border-white/14 bg-white/[0.04] px-5 py-8 text-center sm:rounded-3xl sm:px-8 sm:py-10 md:px-12 md:py-11">
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-full"
            style={{
              backgroundImage:
                "radial-gradient(900px circle at 50% -10%, rgba(61,129,227,0.22), rgba(0,210,255,0.06) 45%, transparent 75%)",
            }}
          />
          <div className="relative z-10 mx-auto max-w-2xl space-y-5">
            <h2 className="section-title">{copy.title}</h2>
            <p className="text-sm leading-relaxed text-body md:text-base">{copy.subtitle}</p>
            <div className="flex justify-center pt-1">
              <PrimaryButton onClick={navigateToContact} className="w-full px-8 py-3.5 sm:w-auto">
                {copy.primaryCta}
              </PrimaryButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
