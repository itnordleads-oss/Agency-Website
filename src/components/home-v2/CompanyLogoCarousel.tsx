import React from "react";
import { COMPANY_LOGO_CAROUSEL_HEADING, COMPANY_LOGOS, type CompanyLogo } from "./companyLogos";
import "./companyLogoCarousel.css";

function CompanyLogoItem({ logo, isDuplicate }: { logo: CompanyLogo; isDuplicate: boolean }) {
  const displayStyle =
    logo.displayMaxWidth || logo.displayMaxHeight
      ? ({
          ...(logo.displayMaxWidth && {
            "--company-logo-max-width": `${logo.displayMaxWidth}px`,
          }),
          ...(logo.displayMaxHeight && {
            "--company-logo-max-height": `${logo.displayMaxHeight}px`,
          }),
        } as React.CSSProperties)
      : undefined;

  return (
    <img
      src={logo.src}
      alt={isDuplicate ? "" : logo.alt}
      width={logo.intrinsicWidth}
      height={logo.intrinsicHeight}
      loading="eager"
      decoding="async"
      className={`company-logo-carousel__image company-logo-carousel__image--${logo.size}`}
      data-logo-size={logo.size}
      style={displayStyle}
    />
  );
}

function CompanyLogoSet({
  isDuplicate = false,
  duplicateIndex,
}: {
  isDuplicate?: boolean;
  duplicateIndex?: number;
}) {
  return (
    <div
      className={`company-logo-carousel__set${
        isDuplicate ? " company-logo-carousel__set--duplicate" : ""
      }`}
      data-company-logo-set={isDuplicate ? `duplicate-${duplicateIndex}` : "original"}
      aria-hidden={isDuplicate ? "true" : undefined}
    >
      {COMPANY_LOGOS.map((logo) => (
        <div
          key={`${isDuplicate ? `duplicate-${duplicateIndex}` : "original"}-${logo.id}`}
          className="company-logo-carousel__item"
          data-company-logo={logo.id}
          data-logo-status="ready"
        >
          <CompanyLogoItem logo={logo} isDuplicate={isDuplicate} />
        </div>
      ))}
    </div>
  );
}

export default function CompanyLogoCarousel() {
  return (
    <section
      id="company-logo-carousel"
      className="company-logo-carousel"
      aria-labelledby="company-logo-carousel-heading"
    >
      <div className="company-logo-carousel__heading-wrap">
        <h2 id="company-logo-carousel-heading" className="company-logo-carousel__heading">
          {COMPANY_LOGO_CAROUSEL_HEADING}
        </h2>
      </div>

      <div className="company-logo-carousel__viewport">
        <div className="company-logo-carousel__track">
          <CompanyLogoSet />
          <CompanyLogoSet isDuplicate duplicateIndex={1} />
          <CompanyLogoSet isDuplicate duplicateIndex={2} />
        </div>
      </div>
    </section>
  );
}
