import React from "react";
import { Code2, Globe, LayoutTemplate, Paintbrush, ShoppingBag, Smartphone } from "lucide-react";
import type { AgencyServiceId } from "../../content/agencyServices";

type HomeAgencyServiceIconProps = {
  serviceId: AgencyServiceId;
  className?: string;
};

export default function HomeAgencyServiceIcon({
  serviceId,
  className = "h-5 w-5",
}: HomeAgencyServiceIconProps) {
  switch (serviceId) {
    case "software-development":
      return <Code2 className={className} aria-hidden />;
    case "website-development":
      return <Globe className={className} aria-hidden />;
    case "mobile-app-development":
      return <Smartphone className={className} aria-hidden />;
    case "shopify-stores":
      return <ShoppingBag className={className} aria-hidden />;
    case "wordpress-websites":
      return <LayoutTemplate className={className} aria-hidden />;
    case "custom-wordpress-theme-development":
      return <Paintbrush className={className} aria-hidden />;
    default: {
      const _exhaustive: never = serviceId;
      return _exhaustive;
    }
  }
}
