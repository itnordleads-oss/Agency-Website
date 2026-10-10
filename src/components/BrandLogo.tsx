import React from "react";

const PRODUCTION_LOGO_SRC = "/brand/adealforge-logo-production.png";
const PRODUCTION_LOGO_ALT = "ADealForge";

interface BrandLogoProps {
  className: string;
  loading?: "eager" | "lazy";
  fetchPriority?: "high" | "low" | "auto";
  width?: number;
  height?: number;
}

/** Production company logo used in the navbar and footer. */
export default function BrandLogo({
  className,
  loading = "lazy",
  fetchPriority = "auto",
  width = 264,
  height = 72,
}: BrandLogoProps) {
  return (
    <img
      src={PRODUCTION_LOGO_SRC}
      alt={PRODUCTION_LOGO_ALT}
      width={width}
      height={height}
      loading={loading}
      decoding="async"
      fetchPriority={fetchPriority}
      className={className}
    />
  );
}
