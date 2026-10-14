import React, { useState } from "react";
import { ServiceIcon } from "./serviceIcons";
import type { HeroVisualState, ServiceId, ServiceVisualType } from "./serviceDetailData";

type ServiceDetailHeroVisualProps = {
  serviceId: ServiceId;
  serviceTitle: string;
  visualType: ServiceVisualType;
  states: readonly HeroVisualState[];
};

type VisualControlProps = {
  state: HeroVisualState;
  index: number;
  activeIndex: number;
  className: string;
  onActivate: (index: number) => void;
};

function VisualControl({ state, index, activeIndex, className, onActivate }: VisualControlProps) {
  const active = index === activeIndex;

  return (
    <button
      type="button"
      className={`${className}${active ? " is-active" : ""}`}
      aria-pressed={active}
      onClick={() => onActivate(index)}
      onFocus={() => onActivate(index)}
      onMouseEnter={() => onActivate(index)}
    >
      <span>{state.label}</span>
      <small>{state.detail}</small>
    </button>
  );
}

function SoftwareVisual({
  states,
  activeIndex,
  onActivate,
}: {
  states: readonly HeroVisualState[];
  activeIndex: number;
  onActivate: (index: number) => void;
}) {
  const paths = [
    "M18 26 C34 26 35 42 48 46",
    "M48 46 C58 49 59 65 73 70",
    "M18 76 C34 76 35 57 48 52",
    "M48 52 C60 48 62 31 78 28",
    "M73 70 C82 70 84 56 91 51",
  ];

  return (
    <div className="sdhv-software">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
        {paths.map((path, index) => (
          <path key={path} d={path} className={index === activeIndex ? "is-active" : ""} />
        ))}
      </svg>
      <span className="sdhv-software__signal" aria-hidden />
      {states.map((state, index) => (
        <VisualControl
          key={state.id}
          state={state}
          index={index}
          activeIndex={activeIndex}
          className={`sdhv-software__module sdhv-software__module--${state.id}`}
          onActivate={onActivate}
        />
      ))}
    </div>
  );
}

function WebsiteVisual({
  states,
  activeIndex,
  onActivate,
}: {
  states: readonly HeroVisualState[];
  activeIndex: number;
  onActivate: (index: number) => void;
}) {
  return (
    <div className={`sdhv-web${activeIndex === 1 ? " is-mobile" : ""}`}>
      <div className="sdhv-web__modes">
        {states.map((state, index) => (
          <VisualControl
            key={state.id}
            state={state}
            index={index}
            activeIndex={activeIndex}
            className="sdhv-web__mode"
            onActivate={onActivate}
          />
        ))}
      </div>
      <div className="sdhv-web__desktop" aria-hidden>
        <div className="sdhv-web__bar">
          <i />
          <i />
          <i />
          <span>responsive page</span>
        </div>
        <div className="sdhv-web__page">
          <header>Header</header>
          <section>Hero block</section>
          <div>
            <i />
            <i />
            <i />
          </div>
          <footer>CTA</footer>
        </div>
      </div>
      <div className="sdhv-web__phone" aria-hidden>
        <span />
        <b />
        <i />
        <i />
      </div>
      <span className="sdhv-web__guide" aria-hidden />
    </div>
  );
}

function MobileVisual({
  states,
  activeIndex,
  onActivate,
}: {
  states: readonly HeroVisualState[];
  activeIndex: number;
  onActivate: (index: number) => void;
}) {
  return (
    <div className={`sdhv-mobile sdhv-mobile--state-${activeIndex}`}>
      <div className="sdhv-mobile__modes">
        {states.map((state, index) => (
          <VisualControl
            key={state.id}
            state={state}
            index={index}
            activeIndex={activeIndex}
            className="sdhv-mobile__mode"
            onActivate={onActivate}
          />
        ))}
      </div>
      <div className="sdhv-mobile__secondary" aria-hidden>
        <span>Secondary</span>
        <i />
        <i />
      </div>
      <div className="sdhv-mobile__phone" aria-hidden>
        <span className="sdhv-mobile__notch" />
        <div className="sdhv-mobile__screen">
          <div className={activeIndex === 0 ? "is-active" : ""}>
            <small>Today</small>
            <strong>Primary action</strong>
            <i />
            <b>Continue</b>
          </div>
          <div className={activeIndex === 1 ? "is-active" : ""}>
            <small>Activity</small>
            <strong>Secondary state</strong>
            <i />
            <i />
          </div>
          <div className={activeIndex === 2 ? "is-active" : ""}>
            <small>Connected</small>
            <strong>Data / API</strong>
            <i />
            <b>Synced</b>
          </div>
        </div>
        <nav>
          <i />
          <i />
          <i />
          <span />
        </nav>
      </div>
      <svg className="sdhv-mobile__connection" viewBox="0 0 120 40" aria-hidden>
        <path d="M4 20 C34 20 36 7 60 7 S88 30 116 20" />
      </svg>
    </div>
  );
}

function ShopifyVisual({
  states,
  activeIndex,
  onActivate,
}: {
  states: readonly HeroVisualState[];
  activeIndex: number;
  onActivate: (index: number) => void;
}) {
  return (
    <div className={`sdhv-shopify sdhv-shopify--state-${activeIndex}`}>
      <header>
        <strong>Storefront</strong>
        <VisualControl
          state={states[0]!}
          index={0}
          activeIndex={activeIndex}
          className="sdhv-shopify__collection"
          onActivate={onActivate}
        />
        <VisualControl
          state={states[3]!}
          index={3}
          activeIndex={activeIndex}
          className="sdhv-shopify__cart"
          onActivate={onActivate}
        />
      </header>
      <VisualControl
        state={states[1]!}
        index={1}
        activeIndex={activeIndex}
        className="sdhv-shopify__featured"
        onActivate={onActivate}
      />
      <VisualControl
        state={states[2]!}
        index={2}
        activeIndex={activeIndex}
        className="sdhv-shopify__catalog"
        onActivate={onActivate}
      />
    </div>
  );
}

function WordPressVisual({
  states,
  activeIndex,
  onActivate,
}: {
  states: readonly HeroVisualState[];
  activeIndex: number;
  onActivate: (index: number) => void;
}) {
  return (
    <div className={`sdhv-wordpress sdhv-wordpress--state-${activeIndex}`}>
      <aside>
        {states.map((state, index) => (
          <VisualControl
            key={state.id}
            state={state}
            index={index}
            activeIndex={activeIndex}
            className="sdhv-wordpress__control"
            onActivate={onActivate}
          />
        ))}
      </aside>
      <div className="sdhv-wordpress__preview" aria-hidden>
        <header>
          <span>Page preview</span>
          <b className={activeIndex === 3 ? "is-active" : ""}>Publish</b>
        </header>
        <section className={activeIndex === 1 ? "is-active" : ""}>Hero section</section>
        <section className={activeIndex === 0 ? "is-active" : ""}>Editorial content</section>
        <div>
          <span className={activeIndex === 1 ? "is-active" : ""}>Reusable section</span>
          <span className={activeIndex === 2 ? "is-active" : ""}>Media</span>
        </div>
      </div>
    </div>
  );
}

function ThemeVisual({
  states,
  activeIndex,
  onActivate,
}: {
  states: readonly HeroVisualState[];
  activeIndex: number;
  onActivate: (index: number) => void;
}) {
  return (
    <div className="sdhv-theme">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
        <rect x="5" y="7" width="90" height="86" rx="3" />
        <line x1="11" y1="22" x2="89" y2="22" />
        <line x1="11" y1="78" x2="89" y2="78" />
        <line x1="28" y1="28" x2="28" y2="71" />
      </svg>
      <div className="sdhv-theme__grid">
        {states.map((state, index) => (
          <VisualControl
            key={state.id}
            state={state}
            index={index}
            activeIndex={activeIndex}
            className={`sdhv-theme__component sdhv-theme__component--${state.id}`}
            onActivate={onActivate}
          />
        ))}
      </div>
      <span className="sdhv-theme__editable" aria-hidden>
        CMS editable
      </span>
    </div>
  );
}

export default function ServiceDetailHeroVisual({
  serviceId,
  serviceTitle,
  visualType,
  states,
}: ServiceDetailHeroVisualProps) {
  if (states.length === 0) {
    throw new Error(`Service "${serviceId}" requires at least one hero visual state`);
  }

  const [activeIndex, setActiveIndex] = useState(0);
  const activeState = states[activeIndex];
  if (!activeState) {
    throw new Error(`Service "${serviceId}" has an invalid hero visual state`);
  }

  const visualProps = { states, activeIndex, onActivate: setActiveIndex };
  let visual: React.ReactNode;

  switch (visualType) {
    case "software":
      visual = <SoftwareVisual {...visualProps} />;
      break;
    case "web":
      visual = <WebsiteVisual {...visualProps} />;
      break;
    case "mobile":
      visual = <MobileVisual {...visualProps} />;
      break;
    case "shopify":
      if (states.length !== 4) {
        throw new Error(`Shopify hero requires exactly four visual states`);
      }
      visual = <ShopifyVisual {...visualProps} />;
      break;
    case "wordpress":
      visual = <WordPressVisual {...visualProps} />;
      break;
    case "custom-theme":
      visual = <ThemeVisual {...visualProps} />;
      break;
    default: {
      const unsupportedVisual: never = visualType;
      throw new Error(`Unsupported service hero visual "${unsupportedVisual}"`);
    }
  }

  return (
    <div
      className={`service-detail-hero-visual service-detail-hero-visual--${visualType}`}
      data-active-state={activeState.id}
      role="group"
      aria-label={`${serviceTitle} interactive service preview`}
    >
      <p className="sr-only">Select a visual state to explore how this service is structured.</p>
      <div className="service-detail-hero-visual__status" aria-hidden>
        <span>
          <ServiceIcon serviceId={serviceId} className="h-4 w-4" />
          {serviceTitle}
        </span>
        <b>{activeState.detail}</b>
      </div>
      <div className="service-detail-hero-visual__stage">{visual}</div>
    </div>
  );
}
