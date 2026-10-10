import React, { useId, useRef, useState } from "react";
import {
  Building2,
  CheckCircle2,
  Database,
  Mail,
  Search,
  Send,
  ShieldCheck,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { PrimaryButton, SecondaryButton } from "./Buttons";
import SectionEyebrow from "./SectionEyebrow";
import { navigateToContact } from "../App";
import { useSiteCopy } from "../lib/useSiteCopy";
import "./platformCapabilities.css";

const CAPABILITY_ICONS: LucideIcon[] = [Search, Database, ShieldCheck, Sparkles, Send];
const CAPABILITY_ACCENTS = ["blue", "cyan", "soft-cyan", "violet", "cyan"] as const;

type CapabilityPreviewProps = {
  index: number;
};

function CapabilityPreview({ index }: CapabilityPreviewProps) {
  switch (index) {
    case 0:
      return (
        <div className="capability-preview" data-preview="discovery" aria-hidden="true">
          <div className="capability-preview__chrome">
            <span className="capability-preview__chrome-dot" />
            <span>ICP Discovery</span>
            <span className="capability-preview__badge">Filters applied</span>
          </div>
          <div className="capability-preview__search">
            <Search aria-hidden="true" />
            <span>B2B SaaS · EU · 50–500 employees · RevOps hiring</span>
          </div>
          <div className="capability-preview__chips">
            <span>Industry: SaaS</span>
            <span>Region: EU</span>
            <span>Signal: Hiring RevOps</span>
          </div>
          <ul className="capability-preview__list">
            <li>
              <span className="capability-preview__avatar">NC</span>
              <div>
                <strong>Nordic Cloud GmbH</strong>
                <small>Berlin · Series B · 180 employees</small>
              </div>
              <span className="capability-preview__metric">SaaS · DACH</span>
            </li>
            <li>
              <span className="capability-preview__avatar">AS</span>
              <div>
                <strong>Atlas Systems</strong>
                <small>Amsterdam · Growth · 95 employees</small>
              </div>
              <span className="capability-preview__metric">EU · Mid-market</span>
            </li>
            <li>
              <span className="capability-preview__avatar">LQ</span>
              <div>
                <strong>Lumen Quotient</strong>
                <small>Dublin · Mid-market · 120 employees</small>
              </div>
              <span className="capability-preview__metric">Signal match</span>
            </li>
          </ul>
          <div className="capability-preview__footer">
            <span>Output: ranked account list with match reasons</span>
            <span className="capability-preview__badge">ICP shortlist ready</span>
          </div>
        </div>
      );
    case 1:
      return (
        <div className="capability-preview" data-preview="intelligence" aria-hidden="true">
          <div className="capability-preview__chrome">
            <span className="capability-preview__chrome-dot" />
            <span>Account Intelligence</span>
            <span className="capability-preview__badge">Brief ready</span>
          </div>
          <div className="capability-preview__profile">
            <span className="capability-preview__profile-icon">
              <Building2 aria-hidden="true" />
            </span>
            <div>
              <strong>Nordic Cloud GmbH</strong>
              <small>Cloud infrastructure · Berlin, DE</small>
            </div>
            <span className="capability-preview__score">Account brief</span>
          </div>
          <div className="capability-preview__grid">
            <div>
              <span>What they do</span>
              <strong>B2B cloud platform</strong>
            </div>
            <div>
              <span>Company size</span>
              <strong>180 employees</strong>
            </div>
            <div>
              <span>Markets</span>
              <strong>DACH + Nordics</strong>
            </div>
            <div>
              <span>Why contact</span>
              <strong>Hiring RevOps lead</strong>
            </div>
          </div>
          <p className="capability-preview__note">
            RevOps hire suggests outbound tooling is a current priority for this account.
          </p>
          <div className="capability-preview__footer">
            <span>Output: account brief your rep can use before outreach</span>
            <span className="capability-preview__badge">Account rationale ready</span>
          </div>
        </div>
      );
    case 2:
      return (
        <div className="capability-preview" data-preview="validation" aria-hidden="true">
          <div className="capability-preview__chrome">
            <span className="capability-preview__chrome-dot" />
            <span>Contact Validation</span>
            <span className="capability-preview__badge">Route checks</span>
          </div>
          <ul className="capability-preview__contacts">
            <li>
              <span className="capability-preview__avatar">MK</span>
              <div>
                <strong>Mira Keller</strong>
                <small>VP Sales · mira@nordiccloud.io</small>
              </div>
              <span className="capability-preview__status capability-preview__status--ok">
                <CheckCircle2 aria-hidden="true" />
                Email verified
              </span>
            </li>
            <li>
              <span className="capability-preview__avatar">JR</span>
              <div>
                <strong>Jonas Reeve</strong>
                <small>Head of RevOps · jonas@nordiccloud.io</small>
              </div>
              <span className="capability-preview__status capability-preview__status--ok">
                <CheckCircle2 aria-hidden="true" />
                MX route OK
              </span>
            </li>
            <li>
              <span className="capability-preview__avatar">AL</span>
              <div>
                <strong>Alex Lang</strong>
                <small>CTO · alex@nordiccloud.io</small>
              </div>
              <span className="capability-preview__status capability-preview__status--warn">
                Role unverified
              </span>
            </li>
          </ul>
          <div className="capability-preview__footer">
            <span>Output: verified contacts ranked; uncertain routes held back</span>
            <span className="capability-preview__badge">Reliable routes prioritized</span>
          </div>
        </div>
      );
    case 3:
      return (
        <div className="capability-preview" data-preview="messaging" aria-hidden="true">
          <div className="capability-preview__chrome">
            <span className="capability-preview__chrome-dot" />
            <span>Outbound Draft</span>
            <span className="capability-preview__badge capability-preview__badge--draft">
              Awaiting approval
            </span>
          </div>
          <div className="capability-preview__profile">
            <span className="capability-preview__avatar">MK</span>
            <div>
              <strong>Mira Keller</strong>
              <small>VP Sales · mira@nordiccloud.io</small>
            </div>
            <span className="capability-preview__score">Primary contact</span>
          </div>
          <div className="capability-preview__grid">
            <div>
              <span>Context used</span>
              <strong>Hiring RevOps</strong>
            </div>
            <div>
              <span>Account</span>
              <strong>Nordic Cloud GmbH</strong>
            </div>
          </div>
          <ul className="capability-preview__send-rows">
            <li>
              <span>Subject · Quick idea for Nordic Cloud’s outbound pipeline</span>
              <span className="capability-preview__metric">Draft</span>
            </li>
          </ul>
          <div className="capability-preview__draft">
            <div className="capability-preview__draft-head">
              <span className="capability-preview__profile-icon">
                <Mail aria-hidden="true" />
              </span>
              <div>
                <strong>First-touch draft</strong>
                <small>Uses company, role, and signal from research</small>
              </div>
              <span className="capability-preview__metric">Ready</span>
            </div>
            <p className="capability-preview__draft-body">
              Hi Mira — noticed Nordic Cloud is hiring RevOps. We help teams like yours turn ICP
              research into first-touch emails your sales team can approve and send.
            </p>
            <div className="capability-preview__chips">
              <span>{"{{company}}"}</span>
              <span>{"{{role}}"}</span>
              <span>{"{{signal}}"}</span>
            </div>
          </div>
          <div className="capability-preview__footer">
            <span>
              <Mail aria-hidden="true" /> Output: draft for your team to approve before send
            </span>
            <span className="capability-preview__badge">Ready for review</span>
          </div>
        </div>
      );
    case 4:
    default:
      return (
        <div className="capability-preview" data-preview="sending" aria-hidden="true">
          <div className="capability-preview__chrome">
            <span className="capability-preview__chrome-dot" />
            <span>Sending Dashboard</span>
            <span className="capability-preview__badge capability-preview__badge--live">
              Monitoring
            </span>
          </div>
          <div className="capability-preview__metrics">
            <div>
              <span>Inbox health</span>
              <strong>Monitored</strong>
            </div>
            <div>
              <span>Send status</span>
              <strong>Scheduled</strong>
            </div>
            <div>
              <span>Warmup</span>
              <strong>Stable</strong>
            </div>
          </div>
          <ul className="capability-preview__send-rows">
            <li>
              <span>outreach@yourdomain.com</span>
              <span className="capability-preview__status capability-preview__status--ok">
                Healthy
              </span>
            </li>
            <li>
              <span>hello@warmed-inbox.com</span>
              <span className="capability-preview__status capability-preview__status--ok">
                Sending
              </span>
            </li>
          </ul>
          <div className="capability-preview__footer">
            <span>Output: sends from your inboxes with health checks ongoing</span>
            <span className="capability-preview__badge">Managed send</span>
          </div>
        </div>
      );
  }
}

export default function PlatformCapabilities() {
  const { capabilities } = useSiteCopy();
  const baseId = useId();
  const tablistRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const capabilityDetails = capabilities.items.map((item, index) => ({
    ...item,
    icon: CAPABILITY_ICONS[index] ?? Sparkles,
    accent: CAPABILITY_ACCENTS[index] ?? "blue",
    tabId: `${baseId}-tab-${index}`,
    panelId: `${baseId}-panel-${index}`,
    accordionPanelId: `${baseId}-accordion-${index}`,
  }));

  const scrollToHowItWorks = () => {
    const element =
      document.getElementById("how-it-works") ||
      document.getElementById("platform-overview-strip") ||
      document.getElementById("platform-anchor");
    element?.scrollIntoView({ behavior: "smooth" });
  };

  const selectCapability = (index: number) => {
    setActiveIndex(index);
  };

  const onNavPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse") {
      return;
    }

    const target = (event.target as HTMLElement | null)?.closest<HTMLElement>(
      "[data-capability-tab]"
    );
    if (!target) {
      return;
    }

    const nextIndex = Number(target.dataset.capabilityIndex);
    if (Number.isNaN(nextIndex)) {
      return;
    }

    setActiveIndex((current) => (current === nextIndex ? current : nextIndex));
  };

  const focusTab = (index: number) => {
    const tabs = tablistRef.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]');
    tabs?.[index]?.focus();
  };

  const onTabKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    const lastIndex = capabilityDetails.length - 1;
    const nextIndexByKey: Record<string, number> = {
      ArrowDown: index === lastIndex ? 0 : index + 1,
      ArrowRight: index === lastIndex ? 0 : index + 1,
      ArrowUp: index === 0 ? lastIndex : index - 1,
      ArrowLeft: index === 0 ? lastIndex : index - 1,
      Home: 0,
      End: lastIndex,
    };
    const nextIndex = nextIndexByKey[event.key];

    if (nextIndex === undefined) {
      return;
    }

    event.preventDefault();
    selectCapability(nextIndex);
    focusTab(nextIndex);
  };

  return (
    <section
      className="platform-capabilities"
      id="platform-anchor"
      aria-labelledby="platform-capabilities-heading"
    >
      <div className="platform-capabilities__ambient" aria-hidden="true" />

      <div className="platform-capabilities__container">
        <div className="platform-capabilities__frame">
          <div className="platform-capabilities__layout">
            <div className="platform-capabilities__rail">
              <div className="platform-capabilities__intro">
                <SectionEyebrow label={capabilities.eyebrow.label} tag={capabilities.eyebrow.tag} />

                <div className="platform-capabilities__heading-group">
                  <h2 id="platform-capabilities-heading" className="section-title-lg">
                    {capabilities.title}
                  </h2>
                  <p className="platform-capabilities__subtitle">{capabilities.subtitle}</p>
                </div>

                <ul className="platform-capabilities__proof" aria-label={capabilities.eyebrow.tag}>
                  {capabilities.pills.map((pill) => (
                    <li key={pill}>{pill}</li>
                  ))}
                </ul>
              </div>

              <div
                ref={tablistRef}
                className="platform-capabilities__nav"
                role="tablist"
                aria-label={capabilities.eyebrow.tag}
                aria-orientation="vertical"
                onPointerMove={onNavPointerMove}
              >
                {capabilityDetails.map((capability, index) => {
                  const isActive = index === activeIndex;
                  const Icon = capability.icon;

                  return (
                    <button
                      key={capability.title}
                      type="button"
                      id={capability.tabId}
                      role="tab"
                      className={`platform-capabilities__nav-item${isActive ? " is-active" : ""}`}
                      data-accent={capability.accent}
                      data-capability-tab
                      data-capability-index={index}
                      aria-selected={isActive}
                      aria-controls={capability.panelId}
                      tabIndex={isActive ? 0 : -1}
                      onClick={() => selectCapability(index)}
                      onFocus={() => selectCapability(index)}
                      onKeyDown={(event) => onTabKeyDown(event, index)}
                    >
                      <span className="platform-capabilities__nav-icon" aria-hidden="true">
                        <Icon aria-hidden="true" />
                      </span>
                      <span className="platform-capabilities__nav-label">{capability.title}</span>
                    </button>
                  );
                })}
              </div>

              <div className="platform-capabilities__actions">
                <PrimaryButton onClick={navigateToContact} className="w-full sm:w-auto px-6 py-3">
                  {capabilities.primaryCta}
                </PrimaryButton>
                <SecondaryButton
                  onClick={scrollToHowItWorks}
                  className="w-full sm:w-auto px-6 py-3"
                >
                  {capabilities.secondaryCta}
                </SecondaryButton>
              </div>
            </div>

            <div className="platform-capabilities__panel-stack" data-capability-panel>
              {capabilityDetails.map((capability, index) => {
                const isActive = index === activeIndex;
                const Icon = capability.icon;

                return (
                  <div
                    key={capability.title}
                    className={`platform-capabilities__panel${isActive ? " is-active" : ""}`}
                    id={capability.panelId}
                    role="tabpanel"
                    data-accent={capability.accent}
                    data-capability-preview={index}
                    aria-labelledby={capability.tabId}
                    hidden={!isActive}
                  >
                    <div className="platform-capabilities__panel-inner">
                      <div className="platform-capabilities__panel-topline">
                        <span className="platform-capabilities__panel-icon" aria-hidden="true">
                          <Icon aria-hidden="true" />
                        </span>
                        <span className="platform-capabilities__panel-index" aria-hidden="true">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                      </div>

                      <div className="platform-capabilities__panel-copy">
                        <p className="platform-capabilities__panel-step">
                          Capability {index + 1} of {capabilityDetails.length}
                        </p>
                        <h3>{capability.title}</h3>
                        <p>{capability.desc}</p>
                      </div>

                      <CapabilityPreview index={index} />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="platform-capabilities__accordion" data-capability-accordion>
              {capabilityDetails.map((capability, index) => {
                const isOpen = index === activeIndex;
                const Icon = capability.icon;

                return (
                  <div
                    key={capability.title}
                    className={`platform-capabilities__accordion-item${isOpen ? " is-open" : ""}`}
                    data-accent={capability.accent}
                    data-capability-card
                  >
                    <button
                      type="button"
                      className="platform-capabilities__accordion-trigger"
                      aria-expanded={isOpen}
                      aria-controls={capability.accordionPanelId}
                      onClick={() => selectCapability(index)}
                    >
                      <span className="platform-capabilities__accordion-icon" aria-hidden="true">
                        <Icon aria-hidden="true" />
                      </span>
                      <span className="platform-capabilities__accordion-title">
                        {capability.title}
                      </span>
                    </button>

                    <div
                      id={capability.accordionPanelId}
                      role="region"
                      className="platform-capabilities__accordion-panel"
                      hidden={!isOpen}
                    >
                      <p>{capability.desc}</p>
                      <CapabilityPreview index={index} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
