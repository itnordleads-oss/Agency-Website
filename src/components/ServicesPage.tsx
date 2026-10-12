import React from "react";
import StudioRoutePlaceholder from "./StudioRoutePlaceholder";

/**
 * F3 temporary `/services` shell.
 * Final Services content is owned by Developer B (F5) — do not flesh out here.
 */
export default function ServicesPage() {
  return (
    <StudioRoutePlaceholder
      title="Services"
      routePath="/services"
      ownershipNote="Final Services content will land via feature F5."
    />
  );
}
