import React, { useEffect, useId, useRef, useState } from "react";
import { ServiceIcon } from "./serviceIcons";
import type { ServiceId, ServiceVisualType } from "./serviceDetailData";

type CapabilityDetail = {
  description: string;
  visualLabel: string;
};

type ServiceDetailCapabilitiesProps = {
  serviceId: ServiceId;
  visualType: ServiceVisualType;
  capabilities: readonly string[];
  details: readonly CapabilityDetail[];
};

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export default function ServiceDetailCapabilities({
  serviceId,
  visualType,
  capabilities,
  details,
}: ServiceDetailCapabilitiesProps) {
  if (capabilities.length !== details.length) {
    throw new Error(
      `Service "${serviceId}" has ${capabilities.length} capabilities but ${details.length} capability details`
    );
  }

  const idBase = useId();
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const switchTimerRef = useRef<number | null>(null);
  const [activeCapability, setActiveCapability] = useState(0);
  const [displayedCapability, setDisplayedCapability] = useState(0);
  const [switching, setSwitching] = useState(false);
  const activeTitle = capabilities[displayedCapability];
  const activeDetail = details[displayedCapability];

  useEffect(() => {
    return () => {
      if (switchTimerRef.current !== null) {
        window.clearTimeout(switchTimerRef.current);
      }
    };
  }, []);

  if (!activeTitle || !activeDetail) {
    throw new Error(`Service "${serviceId}" requires at least one capability`);
  }

  const activateCapability = (index: number, moveFocus = false) => {
    const nextIndex = (index + capabilities.length) % capabilities.length;
    setActiveCapability(nextIndex);
    if (switchTimerRef.current !== null) {
      window.clearTimeout(switchTimerRef.current);
      switchTimerRef.current = null;
    }
    if (nextIndex === displayedCapability || prefersReducedMotion()) {
      setDisplayedCapability(nextIndex);
      setSwitching(false);
    } else {
      setSwitching(true);
      switchTimerRef.current = window.setTimeout(() => {
        setDisplayedCapability(nextIndex);
        setSwitching(false);
        switchTimerRef.current = null;
      }, 110);
    }
    if (moveFocus) {
      window.requestAnimationFrame(() => tabRefs.current[nextIndex]?.focus());
    }
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (event.key === "ArrowDown" || event.key === "ArrowRight") {
      event.preventDefault();
      activateCapability(index + 1, true);
      return;
    }
    if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
      event.preventDefault();
      activateCapability(index - 1, true);
      return;
    }
    if (event.key === "Home") {
      event.preventDefault();
      activateCapability(0, true);
      return;
    }
    if (event.key === "End") {
      event.preventDefault();
      activateCapability(capabilities.length - 1, true);
    }
  };

  return (
    <div className="service-detail-capability-system">
      <div
        className="service-detail-capability-selector"
        role="tablist"
        aria-label="Service capabilities"
      >
        {capabilities.map((capability, index) => {
          const selected = index === activeCapability;
          return (
            <button
              key={capability}
              ref={(node) => {
                tabRefs.current[index] = node;
              }}
              id={`${idBase}-tab-${index}`}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls={`${idBase}-panel`}
              tabIndex={selected ? 0 : -1}
              className="service-detail-capability-tab"
              onClick={() => activateCapability(index)}
              onFocus={() => activateCapability(index)}
              onMouseEnter={() => activateCapability(index)}
              onKeyDown={(event) => onKeyDown(event, index)}
            >
              <span className="service-detail-capability-tab__number" aria-hidden>
                {String(index + 1).padStart(2, "0")}
              </span>
              <span>{capability}</span>
            </button>
          );
        })}
      </div>

      <div
        id={`${idBase}-panel`}
        role="tabpanel"
        aria-labelledby={`${idBase}-tab-${displayedCapability}`}
        className={`service-detail-capability-panel service-detail-capability-panel--${visualType}${
          switching ? " is-switching" : ""
        }`}
      >
        <div
          key={`${serviceId}-${displayedCapability}`}
          className="service-detail-capability-panel__in"
        >
          <span className="service-detail-capability-panel__icon" aria-hidden>
            <ServiceIcon serviceId={serviceId} className="h-5 w-5" />
          </span>
          <p className="service-detail-capability-panel__kicker">Active capability</p>
          <h3>{activeTitle}</h3>
          <p>{activeDetail.description}</p>
          <div className="service-detail-capability-map" aria-hidden>
            <span>{activeDetail.visualLabel}</span>
            <i />
            <i />
            <i />
          </div>
        </div>
      </div>
    </div>
  );
}
