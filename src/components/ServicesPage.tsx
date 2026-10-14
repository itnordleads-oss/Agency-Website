import React from "react";
import BackToHomepage from "./BackToHomepage";
import { useSiteCopy } from "../lib/useSiteCopy";
import { useServicesPageMetadata } from "./services/useServicesPageMetadata";
import ServicesHero from "./services/ServicesHero";
import ServicesOverviewGrid from "./services/ServicesOverviewGrid";
import ServicesSpotlight from "./services/ServicesSpotlight";
import ServicesWhyUs from "./services/ServicesWhyUs";
import ServicesProcess from "./services/ServicesProcess";
import ServicesFaq from "./services/ServicesFaq";
import ServicesFinalCta from "./services/ServicesFinalCta";
import { SERVICES_SHELL_CLASS } from "./services/servicesLayout";

export default function ServicesPage() {
  const { servicesPage } = useSiteCopy();
  const services = Array.isArray(servicesPage.services) ? servicesPage.services : [];

  useServicesPageMetadata(servicesPage.metaDescription);

  return (
    <main id="services-page" className="min-w-0 flex-1 overflow-x-hidden">
      <div className={`${SERVICES_SHELL_CLASS} pt-5 sm:pt-6`}>
        <BackToHomepage label={servicesPage.backHome} />
      </div>
      <ServicesHero copy={servicesPage.hero} services={services} />
      <ServicesOverviewGrid overview={servicesPage.overview} services={services} />
      <ServicesSpotlight copy={servicesPage.spotlight} services={services} />
      <ServicesWhyUs copy={servicesPage.whyUs} />
      <ServicesProcess copy={servicesPage.process} />
      <ServicesFaq copy={servicesPage.faq} />
      <ServicesFinalCta copy={servicesPage.finalCta} />
    </main>
  );
}
