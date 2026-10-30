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
    <section className="services-final-cta relative overflow-hidden py-10 sm:py-10 md:py-11">
      <div className={SERVICES_SHELL_CLASS}>
        <div className="liquid-glass cta-glow-panel relative overflow-hidden rounded-2xl border border-white/14 bg-white/[0.04] px-4 py-8 text-center max-[340px]:px-3.5 max-[340px]:py-7 min-[390px]:px-5 sm:rounded-3xl sm:px-8 sm:py-10 md:px-12 md:py-11">
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-full"
            style={{
              backgroundImage:
                "radial-gradient(900px circle at 50% -10%, rgba(61,129,227,0.24), rgba(0,210,255,0.07) 45%, transparent 75%)",
            }}
            aria-hidden
          />
          <div className="relative z-10 mx-auto max-w-lg space-y-3.5">
            <h2 className="section-title text-balance">{copy.title}</h2>
            <p className="services-final-cta__copy">{copy.subtitle}</p>
            <div className="flex justify-center pt-1">
              <PrimaryButton
                onClick={navigateToContact}
                className="min-h-11 w-full whitespace-nowrap px-5 py-3.5 sm:w-auto sm:px-8"
              >
                {copy.primaryCta}
              </PrimaryButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
