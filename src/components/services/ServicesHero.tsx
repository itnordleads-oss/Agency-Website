import React, { useEffect, useId, useRef, useState } from "react";
import SectionEyebrow from "../SectionEyebrow";
import { PrimaryButton, SecondaryButton } from "../Buttons";
import { navigateAppPath, navigateToContact } from "../../App";
import { SERVICES_SHELL_CLASS } from "./servicesLayout";
import { ServiceIcon } from "./serviceIcons";
import type en from "../../i18n/locales/en";
import "./servicesHub.css";

type HeroCopy = (typeof en)["servicesPage"]["hero"];
type ServiceSummary = (typeof en)["servicesPage"]["services"][number];

type ServicesHeroProps = {
  copy: HeroCopy;
  services: readonly ServiceSummary[];
};

type NodeMeta = {
  label: string;
  /** Node center in viewBox coords (0–100), used only for button placement. */
  x: number;
  y: number;
  /** Explicit perimeter anchor: connector terminates under the pill border. */
  nx: number;
  ny: number;
  /** Safe docking point beside the central stage label. */
  ax: number;
  ay: number;
  /** Quadratic bend control point. */
  bx: number;
  by: number;
};

/**
 * Editorial (non-radial) node layout. Each service docks to a different
 * point on the vertical delivery axis via a bent connector.
 */
const NODE_META: Record<string, NodeMeta> = {
  "software-development": {
    label: "Software",
    x: 14,
    y: 20,
    nx: 24,
    ny: 20,
    ax: 43,
    ay: 36,
    bx: 32,
    by: 22,
  },
  "website-development": {
    label: "Web",
    x: 86,
    y: 18,
    nx: 77,
    ny: 18,
    ax: 57,
    ay: 14,
    bx: 68,
    by: 14,
  },
  "mobile-app-development": {
    label: "Mobile",
    x: 14,
    y: 50,
    nx: 24,
    ny: 50,
    ax: 43,
    ay: 60,
    bx: 32,
    by: 52,
  },
  "shopify-stores": {
    label: "Shopify",
    x: 86,
    y: 48,
    nx: 77,
    ny: 48,
    ax: 57,
    ay: 60,
    bx: 68,
    by: 54,
  },
  "wordpress-websites": {
    label: "WP",
    x: 14,
    y: 82,
    nx: 24,
    ny: 82,
    ax: 43,
    ay: 86,
    bx: 32,
    by: 84,
  },
  "custom-wordpress-theme-development": {
    label: "Themes",
    x: 86,
    y: 80,
    nx: 77,
    ny: 80,
    ax: 57,
    ay: 86,
    bx: 68,
    by: 82,
  },
};

const AXIS_STEPS = [
  { y: 14, label: "Requirement" },
  { y: 36, label: "Define" },
  { y: 60, label: "Build" },
  { y: 86, label: "Deliver" },
] as const;

function pathFor(meta: NodeMeta) {
  // Start beside the axis and stop beneath the opaque node perimeter.
  // `nx`/`ny` are deliberately not the visual center of a node.
  return `M ${meta.ax} ${meta.ay} Q ${meta.bx} ${meta.by} ${meta.nx} ${meta.ny}`;
}

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export default function ServicesHero({ copy, services }: ServicesHeroProps) {
  const labelId = useId();
  const [selectedId, setSelectedId] = useState(services[0]?.id ?? "");
  const [previewId, setPreviewId] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [userLocked, setUserLocked] = useState(false);
  const interactedRef = useRef(false);

  const activeServiceId = previewId ?? selectedId;
  const activeService = services.find((service) => service.id === activeServiceId) ?? services[0];

  const selectService = (serviceId: string) => {
    interactedRef.current = true;
    setUserLocked(true);
    setSelectedId(serviceId);
    setPreviewId(null);
  };

  const previewService = (serviceId: string) => {
    interactedRef.current = true;
    setUserLocked(true);
    setPreviewId(serviceId);
  };

  const clearPreview = () => {
    setPreviewId(null);
  };

  useEffect(() => {
    if (prefersReducedMotion()) {
      setReady(true);
      return;
    }
    const timer = window.setTimeout(() => setReady(true), 60);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (userLocked || prefersReducedMotion() || services.length < 2) {
      return;
    }
    const timer = window.setInterval(() => {
      if (interactedRef.current) {
        return;
      }
      setSelectedId((current) => {
        const index = Math.max(
          0,
          services.findIndex((service) => service.id === current)
        );
        return services[(index + 1) % services.length]?.id ?? current;
      });
    }, 6200);
    return () => window.clearInterval(timer);
  }, [services, userLocked]);

  const scrollToOverview = () => {
    document.getElementById("services-overview")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      className="relative overflow-hidden pb-9 pt-1 sm:pb-11 md:pb-12"
      aria-labelledby="services-hero-title"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(700px_circle_at_80%_35%,rgba(61,129,227,0.14),transparent_62%)] motion-reduce:hidden"
        aria-hidden
      />
      <div className={SERVICES_SHELL_CLASS}>
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-10 xl:gap-12">
          <div className="services-hub-reveal lg:col-span-5 xl:col-span-5">
            <SectionEyebrow label={copy.eyebrow} className="mb-4" />
            <h1
              id="services-hero-title"
              className="max-w-[16ch] text-balance text-[clamp(2.25rem,9vw,3.25rem)] font-extrabold leading-[1.08] tracking-tight text-white sm:max-w-[18ch] lg:text-5xl"
            >
              {copy.title}
            </h1>
            <p className="mt-4 max-w-md text-base leading-relaxed text-white/72 md:text-lg">
              {copy.subtitle}
            </p>
            <div className="mt-7 flex flex-col flex-wrap gap-3 sm:flex-row sm:gap-3.5">
              <PrimaryButton
                onClick={navigateToContact}
                className="w-full whitespace-nowrap px-8 py-3.5 sm:w-auto"
              >
                {copy.primaryCta}
              </PrimaryButton>
              <SecondaryButton
                type="button"
                onClick={scrollToOverview}
                className="w-full whitespace-nowrap px-8 py-3.5 sm:w-auto"
              >
                {copy.secondaryCta}
              </SecondaryButton>
            </div>
          </div>

          <div className="relative lg:col-span-7 xl:col-span-7">
            <div
              className={`services-hero-system${ready ? " is-ready" : ""}`}
              role="group"
              aria-labelledby={labelId}
            >
              <p id={labelId} className="services-hero-system__label">
                Connected Delivery Capabilities
              </p>

              {/* Desktop / tablet editorial diagram */}
              <div className="services-hero-system__stage services-hero-system__stage--desktop">
                <svg
                  className="services-hero-system__svg"
                  viewBox="0 0 100 100"
                  preserveAspectRatio="xMidYMid meet"
                  aria-hidden
                >
                  <line
                    className="services-hero-system__axis-line"
                    x1="50"
                    y1="10"
                    x2="50"
                    y2="90"
                  />
                  {AXIS_STEPS.map((step) => (
                    <circle
                      key={step.label}
                      className="services-hero-system__axis-dot"
                      cx="50"
                      cy={step.y}
                      r="1.1"
                    />
                  ))}
                  {services.map((service) => {
                    const meta = NODE_META[service.id];
                    if (!meta) {
                      return null;
                    }
                    const isActive = service.id === activeService?.id;
                    const d = pathFor(meta);
                    return (
                      <g key={service.id}>
                        <path className="services-hero-system__link-base" d={d} pathLength={1} />
                        <path
                          className={`services-hero-system__link-fill${isActive ? " is-active" : ""}`}
                          d={d}
                          pathLength={1}
                        />
                      </g>
                    );
                  })}
                </svg>

                <div className="services-hero-system__axis" aria-hidden>
                  {AXIS_STEPS.map((step) => (
                    <span
                      key={step.label}
                      className="services-hero-system__axis-label"
                      style={{ top: `${step.y}%` }}
                    >
                      {step.label}
                    </span>
                  ))}
                </div>

                {services.map((service, index) => {
                  const meta = NODE_META[service.id];
                  if (!meta) {
                    return null;
                  }
                  const isSelected = service.id === selectedId;
                  const isActive = service.id === activeService?.id;
                  return (
                    <button
                      key={service.id}
                      type="button"
                      className={`services-hero-system__node${isActive ? " is-active" : ""}`}
                      style={{
                        left: `${meta.x}%`,
                        top: `${meta.y}%`,
                        animationDelay: ready ? `${100 + index * 55}ms` : undefined,
                      }}
                      aria-pressed={isSelected}
                      onClick={() => selectService(service.id)}
                      onMouseEnter={() => previewService(service.id)}
                      onMouseLeave={clearPreview}
                      onFocus={() => selectService(service.id)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          selectService(service.id);
                        }
                      }}
                    >
                      <span className="services-hero-system__node-icon">
                        <ServiceIcon serviceId={service.id} className="h-3.5 w-3.5" />
                      </span>
                      <span className="services-hero-system__node-label">{meta.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Mobile compact vertical delivery list */}
              <div className="services-hero-system__stage services-hero-system__stage--mobile">
                <div className="services-hero-system__mobile-axis" aria-hidden>
                  <span>Requirement</span>
                  <span>Define</span>
                  <span>Build</span>
                  <span>Deliver</span>
                </div>
                <div className="services-hero-system__mobile-nodes">
                  {services.map((service) => {
                    const meta = NODE_META[service.id];
                    const isSelected = service.id === selectedId;
                    const isActive = service.id === activeService?.id;
                    return (
                      <button
                        key={service.id}
                        type="button"
                        className={`services-hero-system__mobile-node${isActive ? " is-active" : ""}`}
                        aria-pressed={isSelected}
                        onClick={() => selectService(service.id)}
                        onFocus={() => selectService(service.id)}
                      >
                        <span className="services-hero-system__mobile-rail" aria-hidden />
                        <span className="services-hero-system__node-icon">
                          <ServiceIcon serviceId={service.id} className="h-3.5 w-3.5" />
                        </span>
                        <span className="services-hero-system__node-label">
                          {meta?.label ?? service.tabLabel}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {activeService ? (
                <div className="services-hero-system__summary" key={activeService.id}>
                  <p className="services-hero-system__summary-kicker">{copy.activeSummaryLabel}</p>
                  <p className="services-hero-system__summary-title">{activeService.title}</p>
                  <p className="services-hero-system__summary-copy">
                    {activeService.shortDescription}
                  </p>
                  <button
                    type="button"
                    className="services-hero-system__summary-cta"
                    onClick={() => navigateAppPath(`/services/${activeService.id}`)}
                  >
                    Explore Service
                    <span aria-hidden>→</span>
                  </button>
                </div>
              ) : null}
            </div>
            <p className="mt-3 text-xs leading-relaxed text-white/45">{copy.visualNote}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
