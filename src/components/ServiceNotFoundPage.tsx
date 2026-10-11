import React from "react";
import { navigateAppPath } from "../App";
import { PrimaryButton } from "./Buttons";
import SectionEyebrow from "./SectionEyebrow";
import { SERVICES_SHELL_CLASS } from "./services/servicesLayout";
import { useServiceDetailMetadata } from "./services/useServiceDetailMetadata";

export default function ServiceNotFoundPage() {
  useServiceDetailMetadata({
    title: "Service Not Found",
    description: "The requested service page could not be found.",
    pathname: "/services",
    noIndex: true,
  });

  return (
    <main className="min-w-0 flex-1 overflow-x-hidden" aria-labelledby="service-not-found-title">
      <section className="py-16 sm:py-20 md:py-24">
        <div className={SERVICES_SHELL_CLASS}>
          <div className="liquid-glass mx-auto max-w-3xl rounded-2xl border border-white/12 bg-white/[0.035] px-5 py-12 text-center sm:px-8 sm:py-16">
            <div className="flex justify-center">
              <SectionEyebrow label="404" />
            </div>
            <h1 id="service-not-found-title" className="section-title mt-4">
              Service page not found
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-body">
              This service URL does not match one of our six published services. Return to the
              Services page to explore the available options.
            </p>
            <div className="mt-7 flex justify-center">
              <PrimaryButton onClick={() => navigateAppPath("/services")}>
                View Services
              </PrimaryButton>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
