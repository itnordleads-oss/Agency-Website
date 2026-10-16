import React from "react";
import type { ServiceId } from "./serviceDetailData";
import "./servicesHub.css";

type SpotlightVisualProps = {
  serviceId: ServiceId;
};

export default function ServicesSpotlightVisuals({ serviceId }: SpotlightVisualProps) {
  switch (serviceId) {
    case "software-development":
      return (
        <div className="service-blueprint-visual service-blueprint-visual--software" aria-hidden>
          <svg className="blueprint-system-lines" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M28 25 C42 25 43 38 50 45" />
            <path d="M28 75 C42 75 43 62 50 55" />
            <path d="M50 45 L72 32" />
            <path d="M50 55 L72 68" />
          </svg>
          <span className="blueprint-system-signal" />
          <div className="blueprint-system-node blueprint-system-node--intake">
            <small>Input</small>
            <strong>Intake</strong>
            <span>Requirements</span>
          </div>
          <div className="blueprint-system-node blueprint-system-node--logic">
            <small>Process</small>
            <strong>Logic</strong>
            <span>Workflows</span>
          </div>
          <div className="blueprint-system-node blueprint-system-node--data">
            <small>Connect</small>
            <strong>Data</strong>
            <span>Integrations</span>
          </div>
          <div className="blueprint-system-node blueprint-system-node--interface">
            <small>Present</small>
            <strong>Interface</strong>
            <span>Users</span>
          </div>
          <div className="blueprint-system-core">System map</div>
        </div>
      );
    case "website-development":
      return (
        <div className="service-blueprint-visual service-blueprint-visual--web" aria-hidden>
          <div className="blueprint-browser">
            <div className="blueprint-browser__bar">
              <i />
              <i />
              <i />
              <span>site structure</span>
            </div>
            <div className="blueprint-browser__page">
              <header>Header</header>
              <div className="blueprint-web-hero">Hero</div>
              <div className="blueprint-web-grid">
                <span>Content</span>
                <span>Content</span>
                <span>Content</span>
              </div>
              <footer>CTA / Footer</footer>
            </div>
          </div>
          <div className="blueprint-browser__mobile">
            <span />
            <b />
            <i />
          </div>
        </div>
      );
    case "mobile-app-development":
      return (
        <div className="service-blueprint-visual service-blueprint-visual--mobile" aria-hidden>
          <div className="blueprint-mobile-ghost">
            <span>Account</span>
            <span>Activity</span>
          </div>
          <div className="blueprint-phone">
            <div className="blueprint-phone__notch" />
            <div className="blueprint-phone__screen">
              <p>Today</p>
              <strong>Primary action</strong>
              <div className="blueprint-phone__card">Product content</div>
              <div className="blueprint-phone__card blueprint-phone__card--quiet">
                Account state
              </div>
              <span className="blueprint-phone__action">Continue</span>
            </div>
            <nav>
              <i />
              <i className="is-current" />
              <i />
            </nav>
          </div>
        </div>
      );
    case "shopify-stores":
      return (
        <div className="service-blueprint-visual service-blueprint-visual--shopify" aria-hidden>
          <div className="blueprint-shop">
            <header>
              <span>Storefront</span>
              <small>Collections</small>
              <b>Cart</b>
            </header>
            <div className="blueprint-shop__feature">
              <span>Featured collection</span>
            </div>
            <div className="blueprint-shop__products">
              <article className="is-picked">
                <i />
                <span>Product</span>
              </article>
              <article>
                <i />
                <span>Product</span>
              </article>
              <article>
                <i />
                <span>Product</span>
              </article>
            </div>
          </div>
        </div>
      );
    case "wordpress-websites":
      return (
        <div className="service-blueprint-visual service-blueprint-visual--wordpress" aria-hidden>
          <div className="blueprint-publishing">
            <aside>
              <span>Content</span>
              <span className="is-active">Blocks</span>
              <span>Media</span>
              <span>Publish</span>
            </aside>
            <main>
              <header>
                <span>Page preview</span>
                <i>Publish</i>
              </header>
              <div className="blueprint-publishing__block blueprint-publishing__block--first is-current">
                Hero section
              </div>
              <div className="blueprint-publishing__block blueprint-publishing__block--second">
                Editorial content
              </div>
              <div className="blueprint-publishing__split">
                <span>Reusable section</span>
                <span>Media</span>
              </div>
            </main>
          </div>
        </div>
      );
    case "custom-wordpress-theme-development":
      return (
        <div
          className="service-blueprint-visual service-blueprint-visual--themes service-blueprint-visual--custom-theme"
          aria-hidden
        >
          <div className="blueprint-theme-grid">
            <div className="blueprint-theme-cell blueprint-theme-cell--header">
              Header component
            </div>
            <div className="blueprint-theme-cell blueprint-theme-cell--hero">Hero region</div>
            <div className="blueprint-theme-cell blueprint-theme-cell--nav">Navigation</div>
            <div className="blueprint-theme-cell blueprint-theme-cell--content">
              Content section
              <small>CMS editable</small>
            </div>
            <div className="blueprint-theme-cell blueprint-theme-cell--cta">CTA component</div>
            <div className="blueprint-theme-cell blueprint-theme-cell--footer">
              Footer component
            </div>
          </div>
          <span className="blueprint-theme-guide blueprint-theme-guide--one" />
          <span className="blueprint-theme-guide blueprint-theme-guide--two" />
        </div>
      );
    default: {
      const unsupportedService: never = serviceId;
      throw new Error(`Unsupported service visual "${unsupportedService}"`);
    }
  }
}
