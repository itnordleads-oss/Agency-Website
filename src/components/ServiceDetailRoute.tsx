import React from "react";
import { useSiteCopy } from "../lib/useSiteCopy";
import ServiceDetailPage from "./ServiceDetailPage";
import ServiceNotFoundPage from "./ServiceNotFoundPage";
import { isServiceId } from "./services/serviceDetailData";

type ServiceDetailRouteProps = {
  slug: string;
};

export default function ServiceDetailRoute({ slug }: ServiceDetailRouteProps) {
  const { servicesPage } = useSiteCopy();
  const services = Array.isArray(servicesPage.services) ? servicesPage.services : [];

  if (!isServiceId(slug)) {
    return <ServiceNotFoundPage />;
  }

  const service = services.find((item) => item.id === slug);
  if (!service) {
    throw new Error(`Missing required Services copy for service id "${slug}"`);
  }

  return (
    <ServiceDetailPage
      key={service.id}
      service={service}
      allServices={services}
      process={servicesPage.process}
      finalCta={servicesPage.finalCta}
    />
  );
}
