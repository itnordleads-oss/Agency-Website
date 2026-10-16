import React, { useLayoutEffect, useRef } from "react";
import { ArrowRight } from "lucide-react";
import { navigateAppPath } from "../App";
import type en from "../i18n/locales/en";
import SectionEyebrow from "./SectionEyebrow";
import ServicesFaq from "./services/ServicesFaq";
import ServicesFinalCta from "./services/ServicesFinalCta";
import ServiceDetailBenefits from "./services/ServiceDetailBenefits";
import ServiceDetailCapabilities from "./services/ServiceDetailCapabilities";
import ServiceDetailHero from "./services/ServiceDetailHero";
import ServiceDetailProcess from "./services/ServiceDetailProcess";
import { ServiceIcon } from "./services/serviceIcons";
import { SERVICE_DETAIL_CONTENT, type ServiceId } from "./services/serviceDetailData";
import { SERVICES_DETAIL_CLASS, SERVICES_SHELL_CLASS } from "./services/servicesLayout";
import { useServiceDetailMetadata } from "./services/useServiceDetailMetadata";
import "./services/serviceDetail.css";
import "./services/serviceDetailHero.css";

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
  const pageRef = useRef<HTMLElement | null>(null);
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

  useLayoutEffect(() => {
    const page = pageRef.current;
    if (!page) {
      return;
    }

    const sections = Array.from(
      page.querySelectorAll<HTMLElement>(":scope > section:not(.service-detail-hero)")
    );
    sections.forEach((section) => section.classList.add("service-detail-reveal"));
    page.classList.add("service-detail-motion-ready");

    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      typeof IntersectionObserver === "undefined"
    ) {
      sections.forEach((section) => section.classList.add("is-revealed"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [serviceId]);

  useServiceDetailMetadata({
    title: service.title,
    description: detail.metaDescription,
    pathname,
  });

  return (
    <main
      ref={pageRef}
      id={`service-detail-${service.id}`}
      className="service-detail-page min-w-0 flex-1 overflow-x-hidden"
      data-service-visual={detail.visualConfig.type}
      aria-labelledby="service-detail-title"
    >
      <ServiceDetailHero
        key={serviceId}
        serviceId={serviceId}
        title={service.title}
        shortDescription={service.shortDescription}
        eyebrow={detail.eyebrow}
        visualConfig={detail.visualConfig}
        onNavigate={navigateLink}
      />

      <section
        id="service-overview"
        className={SERVICES_DETAIL_CLASS}
        aria-labelledby="service-overview-title"
      >
        <div className={SERVICES_SHELL_CLASS}>
          <div className="service-detail-overview grid grid-cols-1 gap-6 border-y border-white/[0.08] py-8 md:py-10 lg:grid-cols-12 lg:gap-12">
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
          <div className="service-detail-section-intro mb-7 max-w-3xl space-y-3 md:mb-8">
            <SectionEyebrow label="Capabilities" />
            <h2 id="service-capabilities-title" className="section-title">
              {service.capabilitiesTitle}
            </h2>
          </div>
          <ServiceDetailCapabilities
            serviceId={serviceId}
            visualType={detail.visualConfig.type}
            capabilities={service.capabilities}
            details={detail.capabilityDetails}
          />
        </div>
      </section>

      <section
        id="service-benefits"
        className={SERVICES_DETAIL_CLASS}
        aria-labelledby="service-benefits-title"
      >
        <div className={SERVICES_SHELL_CLASS}>
          <div className="service-detail-benefits">
            <div>
              <SectionEyebrow label="Key benefits" />
              <h2 id="service-benefits-title" className="section-title mt-4">
                {detail.benefitsTitle}
              </h2>
              <p className="mt-4 max-w-md text-base leading-relaxed text-body">
                {detail.benefitsSubtitle}
              </p>
            </div>
            <ServiceDetailBenefits serviceId={serviceId} benefits={detail.benefits} />
          </div>
        </div>
      </section>

      <section
        id="service-process"
        className={SERVICES_DETAIL_CLASS}
        aria-labelledby="service-approach-title"
      >
        <div className={SERVICES_SHELL_CLASS}>
          <div className="service-detail-section-intro mb-7 max-w-3xl space-y-3 md:mb-8">
            <SectionEyebrow label="Development process" />
            <h2 id="service-approach-title" className="section-title">
              {detail.approachTitle}
            </h2>
            <p className="max-w-2xl text-base leading-relaxed text-body">
              {detail.approachDescription}
            </p>
          </div>
          <ServiceDetailProcess
            key={serviceId}
            copy={process}
            visualType={detail.visualConfig.type}
            visualLabel={detail.visualConfig.processLabel}
          />
        </div>
      </section>

      {detail.platforms ? (
        <section
          id="service-platforms"
          className="relative overflow-hidden py-5 sm:py-6 md:py-8"
          aria-labelledby="service-platforms-title"
        >
          <div className={SERVICES_SHELL_CLASS}>
            <div className="service-detail-platform">
              <div>
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
              <ul className="m-0 flex list-none flex-wrap gap-2.5 p-0">
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
          <div className="service-detail-section-intro mb-7 max-w-3xl space-y-3 md:mb-8">
            <SectionEyebrow label="Related services" />
            <h2 id="related-services-title" className="section-title">
              Continue exploring
            </h2>
          </div>
          <div className="service-detail-related-grid grid grid-cols-1 gap-x-8 md:grid-cols-2 lg:grid-cols-3">
            {relatedServices.map((relatedService) => {
              const relatedPath = `/services/${relatedService.id}`;
              return (
                <a
                  key={relatedService.id}
                  href={relatedPath}
                  onClick={(event) => navigateLink(event, relatedPath)}
                  className="service-detail-related-card group focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3D81E3]"
                >
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#3D81E3]/30 bg-[#3D81E3]/10 text-[#A4F4FD]">
                    <ServiceIcon serviceId={relatedService.id} className="h-5 w-5" />
                  </span>
                  <div className="min-w-0">
                    <h3 className="text-base font-semibold leading-snug text-white">
                      {relatedService.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-body">
                      {relatedService.shortDescription}
                    </p>
                    <span className="mt-3 inline-flex whitespace-nowrap items-center gap-2 text-sm font-semibold text-[#A4F4FD]">
                      Explore service
                      <ArrowRight
                        className="h-4 w-4 transition-transform group-hover:translate-x-1 motion-reduce:transform-none"
                        aria-hidden
                      />
                    </span>
                  </div>
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
