import React from "react";
import { ArrowRight, Check, ChevronRight } from "lucide-react";
import { navigateAppPath, navigateToContact } from "../App";
import type en from "../i18n/locales/en";
import { PrimaryButton, SecondaryButton } from "./Buttons";
import SectionEyebrow from "./SectionEyebrow";
import ServicesFaq from "./services/ServicesFaq";
import ServicesFinalCta from "./services/ServicesFinalCta";
import { ServiceIcon } from "./services/serviceIcons";
import { SERVICE_DETAIL_CONTENT, type ServiceId } from "./services/serviceDetailData";
import { SERVICES_DETAIL_CLASS, SERVICES_SHELL_CLASS } from "./services/servicesLayout";
import { useServiceDetailMetadata } from "./services/useServiceDetailMetadata";

type ServiceSummary = (typeof en)["servicesPage"]["services"][number];
type ProcessCopy = (typeof en)["servicesPage"]["process"];
type FinalCtaCopy = (typeof en)["servicesPage"]["finalCta"];

type ServiceDetailPageProps = {
  service: ServiceSummary;
  allServices: readonly ServiceSummary[];
  process: ProcessCopy;
  finalCta: FinalCtaCopy;
};

function navigateLink(event: React.MouseEvent<HTMLAnchorElement>, pathname: string) {
  if (
    event.defaultPrevented ||
    event.button !== 0 ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey
  ) {
    return;
  }
  event.preventDefault();
  navigateAppPath(pathname);
}

export default function ServiceDetailPage({
  service,
  allServices,
  process,
  finalCta,
}: ServiceDetailPageProps) {
  const serviceId = service.id as ServiceId;
  const detail = SERVICE_DETAIL_CONTENT[serviceId];
  const pathname = `/services/${service.id}`;
  const relatedServices = detail.relatedServiceIds.map((relatedId) => {
    const relatedService = allServices.find((item) => item.id === relatedId);
    if (!relatedService) {
      throw new Error(
        `Missing required related service copy for "${relatedId}" on service "${service.id}"`
      );
    }
    return relatedService;
  });

  useServiceDetailMetadata({
    title: service.title,
    description: detail.metaDescription,
    pathname,
  });

  return (
    <main
      id={`service-detail-${service.id}`}
      className="service-detail-page min-w-0 flex-1 overflow-x-hidden"
      aria-labelledby="service-detail-title"
    >
      <section className="relative overflow-hidden pb-10 pt-5 sm:pb-12 sm:pt-6 md:pb-14">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(650px_circle_at_78%_24%,rgba(61,129,227,0.16),transparent_68%)] motion-reduce:hidden" />
        <div className={SERVICES_SHELL_CLASS}>
          <nav aria-label="Breadcrumb" className="mb-6 sm:mb-7">
            <ol className="m-0 flex min-w-0 list-none flex-wrap items-center gap-x-2 gap-y-1.5 p-0 text-xs text-white/60 sm:text-sm">
              <li>
                <a
                  href="/"
                  onClick={(event) => navigateLink(event, "/")}
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
                  onClick={(event) => navigateLink(event, "/services")}
                  className="rounded-sm transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3D81E3]"
                >
                  Services
                </a>
              </li>
              <li aria-hidden>
                <ChevronRight className="h-4 w-4" />
              </li>
              <li className="min-w-0 break-words text-white/85" aria-current="page">
                {service.title}
              </li>
            </ol>
          </nav>

          <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-10 xl:gap-14">
            <div className="flex flex-col justify-center lg:col-span-7">
              <SectionEyebrow label={detail.eyebrow} />
              <h1
                id="service-detail-title"
                className="mt-4 max-w-4xl text-balance text-3xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-4xl lg:text-5xl"
              >
                {service.title} built around your requirements
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-body md:text-lg">
                {service.shortDescription} We define the work around your users, operations, and
                approved project goals.
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <PrimaryButton onClick={navigateToContact} className="w-full px-8 py-3.5 sm:w-auto">
                  Start a Project
                </PrimaryButton>
                <SecondaryButton
                  onClick={() =>
                    document
                      .getElementById("service-capabilities")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="w-full px-8 py-3.5 sm:w-auto"
                >
                  Explore the Service
                </SecondaryButton>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="liquid-glass relative overflow-hidden rounded-2xl border border-white/12 bg-white/[0.035] p-5 sm:p-6">
                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(145deg,rgba(61,129,227,0.12),transparent_48%,rgba(0,210,255,0.05))]" />
                <div className="relative flex items-center gap-4">
                  <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[#3D81E3]/35 bg-[#3D81E3]/12 text-[#A4F4FD]">
                    <ServiceIcon serviceId={service.id} className="h-6 w-6" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-white/50">
                      Agency service
                    </p>
                    <p className="mt-1 text-lg font-semibold leading-snug text-white">
                      {service.title}
                    </p>
                  </div>
                </div>
                <ul className="relative mt-5 grid list-none grid-cols-1 gap-2 p-0 xl:grid-cols-2">
                  {service.capabilities.slice(0, 4).map((capability) => (
                    <li
                      key={capability}
                      className="flex min-w-0 items-start gap-2.5 rounded-xl border border-white/[0.09] bg-[#0C111B]/50 px-3 py-2.5 text-xs leading-snug text-white/75"
                    >
                      <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#A4F4FD]" aria-hidden />
                      <span>{capability}</span>
                    </li>
                  ))}
                </ul>
                <p className="relative mt-4 border-t border-white/[0.08] pt-4 text-xs leading-relaxed text-white/55">
                  {detail.overviewTitle}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="service-overview"
        className={SERVICES_DETAIL_CLASS}
        aria-labelledby="service-overview-title"
      >
        <div className={SERVICES_SHELL_CLASS}>
          <div className="grid grid-cols-1 gap-6 border-y border-white/[0.08] py-8 md:py-10 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-5">
              <SectionEyebrow label="Service overview" />
              <h2 id="service-overview-title" className="section-title mt-4 text-balance">
                {detail.overviewTitle}
              </h2>
            </div>
            <div className="space-y-4 lg:col-span-7 lg:pt-7">
              {service.paragraphs.map((paragraph) => (
                <p
                  key={paragraph.slice(0, 48)}
                  className="max-w-3xl text-base leading-relaxed text-body"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section
        id="service-capabilities"
        className={SERVICES_DETAIL_CLASS}
        aria-labelledby="service-capabilities-title"
      >
        <div className={SERVICES_SHELL_CLASS}>
          <div className="mb-7 max-w-3xl space-y-3 md:mb-8">
            <SectionEyebrow label="Capabilities" />
            <h2 id="service-capabilities-title" className="section-title">
              {service.capabilitiesTitle}
            </h2>
          </div>
          <ul className="m-0 grid list-none grid-cols-1 gap-3 p-0 sm:grid-cols-2 lg:grid-cols-3">
            {service.capabilities.map((capability) => (
              <li
                key={capability}
                className="flex min-h-0 items-start gap-3 rounded-xl border border-white/[0.09] bg-white/[0.025] p-4 sm:p-5"
              >
                <span className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-[#3D81E3]/30 bg-[#3D81E3]/10">
                  <Check className="h-3.5 w-3.5 text-[#A4F4FD]" aria-hidden />
                </span>
                <h3 className="pt-1 text-sm font-semibold leading-snug text-white sm:text-base">
                  {capability}
                </h3>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section
        id="service-benefits"
        className={SERVICES_DETAIL_CLASS}
        aria-labelledby="service-benefits-title"
      >
        <div className={SERVICES_SHELL_CLASS}>
          <div className="rounded-2xl border border-white/[0.09] bg-white/[0.02] p-5 sm:p-7 md:p-8">
            <div className="mb-7 grid grid-cols-1 gap-4 lg:grid-cols-12 lg:items-end lg:gap-10">
              <div className="lg:col-span-6">
                <SectionEyebrow label="Key benefits" />
                <h2 id="service-benefits-title" className="section-title mt-4">
                  {detail.benefitsTitle}
                </h2>
              </div>
              <p className="max-w-2xl text-base leading-relaxed text-body lg:col-span-6">
                {detail.benefitsSubtitle}
              </p>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {detail.benefits.map((benefit) => (
                <div
                  key={benefit.title}
                  className="h-full rounded-xl border border-white/[0.08] bg-[#0C111B]/35 p-4 sm:p-5"
                >
                  <h3 className="text-base font-semibold text-white">{benefit.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-body">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section
        id="service-process"
        className={SERVICES_DETAIL_CLASS}
        aria-labelledby="service-approach-title"
      >
        <div className={SERVICES_SHELL_CLASS}>
          <div className="mb-7 max-w-3xl space-y-3 md:mb-8">
            <SectionEyebrow label="Development process" />
            <h2 id="service-approach-title" className="section-title">
              {detail.approachTitle}
            </h2>
            <p className="max-w-2xl text-base leading-relaxed text-body">
              {detail.approachDescription}
            </p>
          </div>
          <ol className="m-0 grid list-none grid-cols-1 gap-3 p-0 sm:grid-cols-2 lg:grid-cols-6 2xl:grid-cols-5">
            {process.steps.map((step, index) => (
              <li
                key={step.number}
                className={`h-full rounded-xl border border-white/[0.09] bg-white/[0.025] p-4 sm:p-5 lg:col-span-2 2xl:col-span-1 ${
                  index === 3 ? "lg:col-start-2 2xl:col-start-auto" : ""
                }`}
              >
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#3D81E3]/35 bg-[#3D81E3]/10 text-xs font-bold text-[#A4F4FD]">
                  {step.number}
                </span>
                <h3 className="mt-4 text-base font-semibold leading-snug text-white">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-body">{step.description}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {detail.platforms ? (
        <section
          id="service-platforms"
          className="relative overflow-hidden py-5 sm:py-6 md:py-8"
          aria-labelledby="service-platforms-title"
        >
          <div className={SERVICES_SHELL_CLASS}>
            <div className="grid grid-cols-1 items-center gap-5 rounded-2xl border border-[#3D81E3]/20 bg-[#3D81E3]/[0.055] p-5 sm:p-6 lg:grid-cols-12 lg:gap-8">
              <div className="lg:col-span-8">
                <SectionEyebrow label="Platform" />
                <h2
                  id="service-platforms-title"
                  className="mt-3 text-xl font-semibold tracking-tight text-white sm:text-2xl"
                >
                  {detail.platforms.title}
                </h2>
                <p className="mt-2 max-w-3xl text-sm leading-relaxed text-body sm:text-base">
                  {detail.platforms.description}
                </p>
              </div>
              <ul className="m-0 flex list-none flex-wrap gap-2.5 p-0 lg:col-span-4 lg:justify-end">
                {detail.platforms.items.map((item) => (
                  <li
                    key={item}
                    className="rounded-full border border-[#3D81E3]/35 bg-[#0C111B]/45 px-4 py-2.5 text-sm font-semibold text-white"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      ) : null}

      <section
        id="related-services"
        className={SERVICES_DETAIL_CLASS}
        aria-labelledby="related-services-title"
      >
        <div className={SERVICES_SHELL_CLASS}>
          <div className="mb-7 max-w-3xl space-y-3 md:mb-8">
            <SectionEyebrow label="Related services" />
            <h2 id="related-services-title" className="section-title">
              Continue exploring
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
            {relatedServices.map((relatedService) => {
              const relatedPath = `/services/${relatedService.id}`;
              return (
                <a
                  key={relatedService.id}
                  href={relatedPath}
                  onClick={(event) => navigateLink(event, relatedPath)}
                  className="group flex h-full flex-col rounded-2xl border border-white/10 bg-white/[0.025] p-5 transition-[border-color,background-color,box-shadow,transform] hover:-translate-y-0.5 hover:border-[#3D81E3]/40 hover:bg-white/[0.045] hover:shadow-[0_14px_36px_rgba(0,0,0,0.16)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3D81E3] motion-reduce:transform-none"
                >
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#3D81E3]/30 bg-[#3D81E3]/10 text-[#A4F4FD]">
                    <ServiceIcon serviceId={relatedService.id} className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 text-lg font-semibold leading-snug text-white">
                    {relatedService.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-body">
                    {relatedService.shortDescription}
                  </p>
                  <span className="mt-auto inline-flex items-center gap-2 pt-5 text-sm font-semibold text-[#A4F4FD]">
                    Explore service
                    <ArrowRight
                      className="h-4 w-4 transition-transform group-hover:translate-x-1 motion-reduce:transform-none"
                      aria-hidden
                    />
                  </span>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      <ServicesFaq
        copy={{
          eyebrow: "FAQ",
          title: `${service.title} questions`,
          subtitle: "Useful answers before we discuss your specific requirements.",
          items: detail.faqs,
        }}
        variant="detail"
      />
      <ServicesFinalCta copy={finalCta} />
    </main>
  );
}
