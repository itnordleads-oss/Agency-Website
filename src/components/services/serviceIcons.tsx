import { Code2, Globe, LayoutTemplate, Paintbrush, ShoppingBag, Smartphone } from "lucide-react";

type ServiceIconProps = {
  serviceId: string;
  className?: string;
};

export function ServiceIcon({ serviceId, className }: ServiceIconProps) {
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
    default:
      return <Code2 className={className} aria-hidden />;
  }
}
