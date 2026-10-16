import React from "react";
import type { ProjectVisualMotif } from "../../content/agencyProjects";
import "./projectVisual.css";

const MOTIF_ACCENT: Record<ProjectVisualMotif, string> = {
  commerce: "#5CC8FF",
  dashboard: "#00D2FF",
  mobile: "#7DD3FC",
  cms: "#38BDF8",
  platform: "#22D3EE",
  shopify: "#67E8F9",
};

const MOTIF_URL: Record<ProjectVisualMotif, string> = {
  commerce: "nova.demo / shop",
  dashboard: "orbit.demo / app",
  mobile: "atlas.demo / mobile",
  cms: "vertex.demo / site",
  platform: "lumen.demo / platform",
  shopify: "forge.demo / store",
};

type ProjectVisualProps = {
  motif: ProjectVisualMotif;
  variant?: 1 | 2 | 3;
  label?: string;
  className?: string;
  /** Larger composition for heroes / featured previews. */
  density?: "default" | "rich";
};

/**
 * Original CSS concept UI frames for portfolio concepts.
 * Not screenshots of real products or brands.
 */
export default function ProjectVisual({
  motif,
  variant = 1,
  label,
  className = "",
  density = "default",
}: ProjectVisualProps) {
  const accent = MOTIF_ACCENT[motif];
  const isMobile = motif === "mobile";

  return (
    <div
      className={`project-visual project-visual--${motif} project-visual--v${variant}${
        isMobile ? " project-visual--mobile" : ""
      }${density === "rich" ? " project-visual--rich" : ""} ${className}`.trim()}
      style={{ ["--project-accent" as string]: accent }}
      aria-hidden
    >
      <div
        className="project-visual__glow"
        style={{
          backgroundImage: `radial-gradient(420px circle at 18% 10%, ${accent}33, transparent 55%), radial-gradient(380px circle at 88% 85%, rgba(61,129,227,0.18), transparent 50%)`,
        }}
      />
      {isMobile ? (
        <div className="project-visual__phone">
          <div className="project-visual__phone-notch" />
          <MobileScene variant={variant} />
          <div className="project-visual__phone-bar">
            <span />
            <span />
            <span />
          </div>
        </div>
      ) : (
        <div className="project-visual__frame">
          <div className="project-visual__chrome">
            <span className="project-visual__dot" />
            <span className="project-visual__dot" />
            <span className="project-visual__dot" />
            <span className="project-visual__url">{MOTIF_URL[motif]}</span>
          </div>
          <div className="project-visual__body">
            {motif === "commerce" ? <CommerceScene variant={variant} /> : null}
            {motif === "dashboard" ? <DashboardScene variant={variant} /> : null}
            {motif === "cms" ? <CmsScene variant={variant} /> : null}
            {motif === "platform" ? <PlatformScene variant={variant} /> : null}
            {motif === "shopify" ? <ShopifyScene variant={variant} /> : null}
            {label ? <span className="project-visual__label">{label}</span> : null}
          </div>
        </div>
      )}
    </div>
  );
}

function CommerceScene({ variant }: { variant: 1 | 2 | 3 }) {
  return (
    <div className={`pv-commerce pv-commerce--v${variant}`}>
      <div className="pv-commerce__nav">
        <span className="pv-commerce__logo" />
        <span className="pv-line pv-line--sm" />
        <span className="pv-line pv-line--sm" />
        <span className="pv-pill" />
      </div>
      {variant === 1 ? (
        <>
          <div className="pv-commerce__hero">
            <div className="pv-commerce__hero-copy">
              <span className="pv-line pv-line--lg" />
              <span className="pv-line" />
              <span className="pv-pill pv-pill--accent" />
            </div>
            <div className="pv-commerce__hero-art" />
          </div>
          <div className="pv-commerce__grid">
            <div className="pv-product">
              <div className="pv-product__img" />
              <span className="pv-line" />
              <span className="pv-line pv-line--sm" />
            </div>
            <div className="pv-product">
              <div className="pv-product__img pv-product__img--alt" />
              <span className="pv-line" />
              <span className="pv-line pv-line--sm" />
            </div>
            <div className="pv-product">
              <div className="pv-product__img" />
              <span className="pv-line" />
              <span className="pv-line pv-line--sm" />
            </div>
          </div>
        </>
      ) : null}
      {variant === 2 ? (
        <div className="pv-commerce__split">
          <div className="pv-commerce__filters">
            <span className="pv-line" />
            <span className="pv-line pv-line--sm" />
            <span className="pv-line pv-line--sm" />
            <span className="pv-chip" />
            <span className="pv-chip" />
          </div>
          <div className="pv-commerce__grid pv-commerce__grid--2">
            <div className="pv-product">
              <div className="pv-product__img" />
              <span className="pv-line" />
            </div>
            <div className="pv-product">
              <div className="pv-product__img pv-product__img--alt" />
              <span className="pv-line" />
            </div>
          </div>
        </div>
      ) : null}
      {variant === 3 ? (
        <div className="pv-commerce__detail">
          <div className="pv-commerce__detail-img" />
          <div className="pv-commerce__detail-copy">
            <span className="pv-line pv-line--lg" />
            <span className="pv-line" />
            <span className="pv-line pv-line--sm" />
            <div className="pv-commerce__swatches">
              <span />
              <span />
              <span />
            </div>
            <span className="pv-pill pv-pill--accent" />
          </div>
        </div>
      ) : null}
    </div>
  );
}

function DashboardScene({ variant }: { variant: 1 | 2 | 3 }) {
  return (
    <div className={`pv-dash pv-dash--v${variant}`}>
      <aside className="pv-dash__side">
        <span className="pv-dash__mark" />
        <span className="pv-dash__nav pv-dash__nav--active" />
        <span className="pv-dash__nav" />
        <span className="pv-dash__nav" />
        <span className="pv-dash__nav" />
      </aside>
      <div className="pv-dash__main">
        <div className="pv-dash__top">
          <span className="pv-line pv-line--lg" />
          <span className="pv-pill" />
        </div>
        <div className="pv-dash__metrics">
          <div className="pv-metric">
            <span className="pv-line pv-line--sm" />
            <span className="pv-metric__value" />
            <span className="pv-bars">
              <i style={{ height: "40%" }} />
              <i style={{ height: "70%" }} />
              <i style={{ height: "55%" }} />
              <i style={{ height: "85%" }} />
            </span>
          </div>
          <div className="pv-metric">
            <span className="pv-line pv-line--sm" />
            <span className="pv-metric__value" />
            <span className="pv-spark" />
          </div>
          <div className="pv-metric">
            <span className="pv-line pv-line--sm" />
            <span className="pv-metric__value" />
            <span className="pv-ring" />
          </div>
        </div>
        {variant !== 3 ? (
          <div className="pv-dash__table">
            <span className="pv-line" />
            <span className="pv-line" />
            <span className="pv-line pv-line--sm" />
            <span className="pv-line" />
          </div>
        ) : (
          <div className="pv-dash__panels">
            <div className="pv-panel" />
            <div className="pv-panel pv-panel--accent" />
          </div>
        )}
      </div>
    </div>
  );
}

function MobileScene({ variant }: { variant: 1 | 2 | 3 }) {
  return (
    <div className={`pv-mobile pv-mobile--v${variant}`}>
      <div className="pv-mobile__status">
        <span />
        <span />
      </div>
      <span className="pv-line pv-line--lg" />
      <span className="pv-line pv-line--sm" />
      {variant === 1 ? (
        <>
          <div className="pv-mobile__hero" />
          <div className="pv-mobile__cards">
            <div className="pv-mobile__card" />
            <div className="pv-mobile__card pv-mobile__card--accent" />
          </div>
        </>
      ) : null}
      {variant === 2 ? (
        <div className="pv-mobile__list">
          <div className="pv-mobile__row" />
          <div className="pv-mobile__row" />
          <div className="pv-mobile__row pv-mobile__row--accent" />
        </div>
      ) : null}
      {variant === 3 ? (
        <div className="pv-mobile__profile">
          <div className="pv-mobile__avatar" />
          <span className="pv-line" />
          <span className="pv-line pv-line--sm" />
          <span className="pv-pill pv-pill--accent" />
        </div>
      ) : null}
    </div>
  );
}

function CmsScene({ variant }: { variant: 1 | 2 | 3 }) {
  return (
    <div className={`pv-cms pv-cms--v${variant}`}>
      <aside className="pv-cms__rail">
        <span className="pv-cms__rail-item pv-cms__rail-item--active" />
        <span className="pv-cms__rail-item" />
        <span className="pv-cms__rail-item" />
      </aside>
      <div className="pv-cms__canvas">
        <span className="pv-line pv-line--lg" />
        <span className="pv-line" />
        {variant === 1 ? (
          <div className="pv-cms__sections">
            <div className="pv-cms__block pv-cms__block--hero" />
            <div className="pv-cms__block" />
            <div className="pv-cms__block pv-cms__block--accent" />
          </div>
        ) : null}
        {variant === 2 ? (
          <div className="pv-cms__article">
            <div className="pv-cms__block pv-cms__block--wide" />
            <span className="pv-line" />
            <span className="pv-line" />
            <span className="pv-line pv-line--sm" />
            <span className="pv-line" />
          </div>
        ) : null}
        {variant === 3 ? (
          <div className="pv-cms__blocks">
            <div className="pv-cms__tile" />
            <div className="pv-cms__tile pv-cms__tile--accent" />
            <div className="pv-cms__tile" />
            <div className="pv-cms__tile" />
          </div>
        ) : null}
      </div>
    </div>
  );
}

function PlatformScene({ variant }: { variant: 1 | 2 | 3 }) {
  return (
    <div className={`pv-platform pv-platform--v${variant}`}>
      <div className="pv-platform__top">
        <span className="pv-platform__brand" />
        <span className="pv-line pv-line--sm" />
        <span className="pv-line pv-line--sm" />
        <span className="pv-pill" />
      </div>
      <div className="pv-platform__body">
        <aside className="pv-platform__modules">
          <span className="pv-platform__mod pv-platform__mod--active" />
          <span className="pv-platform__mod" />
          <span className="pv-platform__mod" />
          <span className="pv-platform__mod" />
        </aside>
        <div className="pv-platform__workspace">
          <span className="pv-line pv-line--lg" />
          <div className="pv-platform__cards">
            <div className="pv-platform__card" />
            <div className="pv-platform__card pv-platform__card--accent" />
            {variant !== 2 ? <div className="pv-platform__card" /> : null}
          </div>
          {variant === 3 ? <div className="pv-platform__settings" /> : null}
        </div>
      </div>
    </div>
  );
}

function ShopifyScene({ variant }: { variant: 1 | 2 | 3 }) {
  return (
    <div className={`pv-shop pv-shop--v${variant}`}>
      <div className="pv-shop__bar">
        <span className="pv-shop__mark" />
        <span className="pv-line pv-line--sm" />
        <span className="pv-line pv-line--sm" />
        <span className="pv-pill" />
      </div>
      {variant === 1 ? (
        <>
          <div className="pv-shop__banner">
            <span className="pv-line pv-line--lg" />
            <span className="pv-pill pv-pill--accent" />
          </div>
          <div className="pv-shop__row">
            <div className="pv-product">
              <div className="pv-product__img" />
              <span className="pv-line" />
            </div>
            <div className="pv-product">
              <div className="pv-product__img pv-product__img--alt" />
              <span className="pv-line" />
            </div>
            <div className="pv-product">
              <div className="pv-product__img" />
              <span className="pv-line" />
            </div>
          </div>
        </>
      ) : null}
      {variant === 2 ? (
        <div className="pv-shop__collection">
          <span className="pv-line pv-line--lg" />
          <div className="pv-shop__row pv-shop__row--2">
            <div className="pv-product">
              <div className="pv-product__img" />
              <span className="pv-line" />
              <span className="pv-line pv-line--sm" />
            </div>
            <div className="pv-product">
              <div className="pv-product__img pv-product__img--alt" />
              <span className="pv-line" />
              <span className="pv-line pv-line--sm" />
            </div>
          </div>
        </div>
      ) : null}
      {variant === 3 ? (
        <div className="pv-shop__pdp">
          <div className="pv-shop__pdp-img" />
          <div className="pv-shop__pdp-copy">
            <span className="pv-line pv-line--lg" />
            <span className="pv-line" />
            <span className="pv-line pv-line--sm" />
            <span className="pv-pill pv-pill--accent" />
          </div>
        </div>
      ) : null}
    </div>
  );
}
