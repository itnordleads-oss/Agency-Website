import React from "react";
import { getBrandAriaLabel, getLogoSrc, getStudioName, isConfigured } from "../lib/studioBranding";

interface BrandLogoProps {
  className: string;
  loading?: "eager" | "lazy";
  fetchPriority?: "high" | "low" | "auto";
  width?: number;
  height?: number;
}

/**
 * Production company logo used in the navbar and footer.
 * When the approved logo asset is TBC, renders a text mark instead of the
 * previous product logo so unapproved identity is not published.
 */
export default function BrandLogo({
  className,
  loading = "lazy",
  fetchPriority = "auto",
  width = 264,
  height = 72,
}: BrandLogoProps) {
  const logoSrc = getLogoSrc();
  const label = getBrandAriaLabel();

  if (!isConfigured(logoSrc)) {
    // Text mark only — parent link supplies the accessible name (avoid duplicate labels).
    return (
      <span
        className={`inline-flex items-center font-semibold tracking-tight text-white ${className}`}
      >
        {getStudioName() ?? label}
      </span>
    );
  }

  return (
    <img
      src={logoSrc}
      alt={label}
      width={width}
      height={height}
      loading={loading}
      decoding="async"
      fetchPriority={fetchPriority}
      className={className}
    />
  );
}
