import React from "react";
import StudioRoutePlaceholder from "./StudioRoutePlaceholder";

/**
 * F3 temporary `/about` shell.
 * Final About content is owned by Developer A (F6) — do not flesh out here.
 */
export default function AboutPage() {
  return (
    <StudioRoutePlaceholder
      title="About"
      routePath="/about"
      ownershipNote="Final About content will land via feature F6."
    />
  );
}
