import React, { useId, useLayoutEffect, useRef, useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import SectionEyebrow from "../SectionEyebrow";
import { navigateAppPath } from "../../App";
import { ServiceIcon } from "./serviceIcons";
import ServicesSpotlightVisuals from "./ServicesSpotlightVisuals";
import {
  SERVICES_INTRO_CLASS,
  SERVICES_SECTION_CLASS,
  SERVICES_SHELL_CLASS,
} from "./servicesLayout";
import type en from "../../i18n/locales/en";
import "./servicesHub.css";

type SpotlightCopy = (typeof en)["servicesPage"]["spotlight"];
type ServiceSummary = (typeof en)["servicesPage"]["services"][number];

type ServicesSpotlightProps = {
  copy: SpotlightCopy;
  services: readonly ServiceSummary[];
};

export default function ServicesSpotlight({ copy, services }: ServicesSpotlightProps) {
  const tablistId = useId();
  const selectorRef = useRef<HTMLDivElement | null>(null);
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [activeId, setActiveId] = useState(services[0]?.id ?? "");
  const [rail, setRail] = useState({ left: 0, width: 0 });
  const activeIndex = Math.max(
    0,
    services.findIndex((service) => service.id === activeId)
  );
  const activeService = services[activeIndex] ?? services[0];

  useLayoutEffect(() => {
    const selector = selectorRef.current;
    const activeTab = tabRefs.current[activeId];

    if (!selector || !activeTab) {
      return;
    }

    const updateRail = () => {
      setRail({ left: activeTab.offsetLeft, width: activeTab.offsetWidth });
    };

    updateRail();
    const resizeObserver =
      typeof ResizeObserver === "undefined" ? null : new ResizeObserver(updateRail);
    resizeObserver?.observe(selector);
    window.addEventListener("resize", updateRail);

    return () => {
      resizeObserver?.disconnect();
      window.removeEventListener("resize", updateRail);
    };
  }, [activeId]);

  if (!activeService) {
    return null;
  }

  const suitableFor = activeService.suitableFor.slice(0, 3);
  const capabilities =
    activeService.blueprintHighlights?.slice(0, 3) ?? activeService.capabilities.slice(0, 3);

  const activateService = (index: number) => {
    const next = services[index];
    if (!next) {
      return;
    }
    setActiveId(next.id);
    window.requestAnimationFrame(() => {
      document.getElementById(`${tablistId}-${next.id}`)?.focus();
    });
  };

  const onTabKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      event.preventDefault();
      activateService((index + 1) % services.length);
      return;
    }
    if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      event.preventDefault();
      activateService((index - 1 + services.length) % services.length);
      return;
    }
    if (event.key === "Home") {
      event.preventDefault();
      activateService(0);
      return;
    }
    if (event.key === "End") {
      event.preventDefault();
      activateService(services.length - 1);
    }
  };

  return (
    <section
      className={`${SERVICES_SECTION_CLASS} services-blueprint-section bg-black/[0.12]`}
      aria-labelledby="services-spotlight-title"
    >
      <div className={SERVICES_SHELL_CLASS}>
        <div className={SERVICES_INTRO_CLASS}>
          <SectionEyebrow label={copy.eyebrow} />
          <h2 id="services-spotlight-title" className="section-title">
            {copy.title}
          </h2>
          <p className="services-section-lede max-w-2xl">{copy.subtitle}</p>
        </div>

        <div
          ref={selectorRef}
          className="services-blueprint-selector mb-8"
          role="tablist"
          aria-label={copy.title}
          id={tablistId}
        >
          {services.map((service, index) => {
            const selected = service.id === activeService.id;
            return (
              <button
                key={service.id}
                type="button"
                role="tab"
                id={`${tablistId}-${service.id}`}
                aria-selected={selected}
                aria-controls={`${tablistId}-panel`}
                tabIndex={selected ? 0 : -1}
                className="services-blueprint-selector__tab"
                ref={(node) => {
                  tabRefs.current[service.id] = node;
                }}
                onClick={() => setActiveId(service.id)}
                onMouseEnter={() => {
                  if (
                    typeof window !== "undefined" &&
                    window.matchMedia("(hover: hover) and (pointer: fine)").matches
                  ) {
                    setActiveId(service.id);
                  }
                }}
                onKeyDown={(event) => onTabKeyDown(event, index)}
              >
                {service.tabLabel}
              </button>
            );
          })}
          <span
            className="services-blueprint-selector__rail"
            aria-hidden
            style={{ left: rail.left, width: rail.width }}
          />
        </div>

        <div
          key={activeService.id}
          id={`${tablistId}-panel`}
          role="tabpanel"
          aria-labelledby={`${tablistId}-${activeService.id}`}
          className="services-blueprint-panel grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-10"
        >
          <div className="services-blueprint-panel__content min-w-0 space-y-4 lg:col-span-4">
            <div className="services-blueprint-mark" aria-hidden>
              <ServiceIcon serviceId={activeService.id} className="h-5 w-5" />
            </div>
            <h3 className="services-blueprint-panel__title">{activeService.title}</h3>
            <p className="services-blueprint-panel__copy max-w-sm">
              {activeService.shortDescription}
            </p>
            <div className="space-y-2.5">
              <p className="services-blueprint-kicker">{copy.capabilitiesLabel}</p>
              <ul className="space-y-2">
                {capabilities.map((capability) => (
                  <li key={capability} className="flex gap-2.5">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#A4F4FD]" aria-hidden />
                    <span>{capability}</span>
                  </li>
                ))}
              </ul>
            </div>
            {suitableFor.length > 0 ? (
              <div className="space-y-2">
                <p className="services-blueprint-kicker">{copy.suitableLabel}</p>
                <div className="flex flex-wrap gap-1.5">
                  {suitableFor.map((item) => (
                    <span key={item} className="services-blueprint-chip">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}
            <button
              type="button"
              className="inline-flex items-center gap-2 pt-1 text-sm font-semibold text-[#A4F4FD] transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00D2FF]"
              onClick={() => navigateAppPath(`/services/${activeService.id}`)}
            >
              {copy.exploreCta}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </button>
          </div>
          <div className="services-blueprint-panel__visual min-w-0 lg:col-span-8">
            <div className="services-blueprint-canvas">
              <p className="services-blueprint-canvas__label" aria-hidden>
                Service blueprint
              </p>
              <ServicesSpotlightVisuals serviceId={activeService.id} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
