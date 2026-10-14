import React from "react";
import { ChevronRight } from "lucide-react";
import { navigateToContact } from "../../App";
import { PrimaryButton, SecondaryButton } from "../Buttons";
import SectionEyebrow from "../SectionEyebrow";
import type { ServiceDetailContent, ServiceId } from "./serviceDetailData";
import ServiceDetailHeroVisual from "./ServiceDetailHeroVisual";
import { SERVICES_SHELL_CLASS } from "./servicesLayout";

type ServiceDetailHeroProps = {
  serviceId: ServiceId;
  title: string;
  shortDescription: string;
  eyebrow: string;
  visualConfig: ServiceDetailContent["visualConfig"];
  onNavigate: (event: React.MouseEvent<HTMLAnchorElement>, pathname: string) => void;
};

function scrollToCapabilities() {
  const target = document.getElementById("service-capabilities");
  if (!target) {
    throw new Error('Required service detail section "service-capabilities" was not found');
  }
  target.scrollIntoView({
    behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
  });
}

export default function ServiceDetailHero({
  serviceId,
  title,
  shortDescription,
  eyebrow,
  visualConfig,
  onNavigate,
}: ServiceDetailHeroProps) {
  return (
    <section className="service-detail-hero relative overflow-hidden pb-10 pt-5 sm:pb-12 sm:pt-6 md:pb-14">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(650px_circle_at_78%_24%,rgba(61,129,227,0.16),transparent_68%)] motion-reduce:hidden"
        aria-hidden
      />
      <div className={SERVICES_SHELL_CLASS}>
        <nav aria-label="Breadcrumb" className="mb-6 sm:mb-7">
          <ol className="m-0 flex min-w-0 list-none flex-wrap items-center gap-x-2 gap-y-1.5 p-0 text-xs text-white/60 sm:text-sm">
            <li>
              <a
                href="/"
                onClick={(event) => onNavigate(event, "/")}
                className="rounded-sm transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3D81E3]"
              >
                Home
              </a>
            </li>
            <li aria-hidden>
              <ChevronRight className="h-4 w-4" />
            </li>
            <li>
              <a
                href="/services"
                onClick={(event) => onNavigate(event, "/services")}
                className="rounded-sm transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3D81E3]"
              >
                Services
              </a>
            </li>
            <li aria-hidden>
              <ChevronRight className="h-4 w-4" />
            </li>
            <li className="min-w-0 break-words text-white/85" aria-current="page">
              {title}
            </li>
          </ol>
        </nav>

        <div className="service-detail-hero__layout grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-10 xl:gap-12">
          <div className="service-detail-hero__copy flex flex-col justify-center lg:col-span-5">
            <div className="service-detail-hero__eyebrow">
              <SectionEyebrow label={eyebrow} />
            </div>
            <h1
              id="service-detail-title"
              className="service-detail-hero__title mt-4 max-w-2xl text-balance text-[clamp(2.125rem,8vw,3.25rem)] font-extrabold leading-[1.08] tracking-tight text-white lg:text-[clamp(2.5rem,4vw,3rem)]"
            >
              {title}
            </h1>
            <p className="service-detail-hero__description mt-4 max-w-xl text-base leading-relaxed text-body md:text-lg">
              {shortDescription}
            </p>
            <div className="service-detail-hero__actions mt-7 flex flex-col gap-3 sm:flex-row">
              <PrimaryButton
                onClick={navigateToContact}
                className="w-full whitespace-nowrap px-8 py-3.5 sm:w-auto"
              >
                Start a Project
              </PrimaryButton>
              <SecondaryButton
                onClick={scrollToCapabilities}
                className="w-full whitespace-nowrap px-8 py-3.5 sm:w-auto"
              >
                Explore the Service
              </SecondaryButton>
            </div>
          </div>

          <div
            className="service-detail-hero__visual-column lg:col-span-7"
            data-visual-type={visualConfig.type}
          >
            <div className="service-detail-hero__visual">
              <ServiceDetailHeroVisual
                key={serviceId}
                serviceId={serviceId}
                serviceTitle={title}
                visualType={visualConfig.type}
                states={visualConfig.heroStates}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
