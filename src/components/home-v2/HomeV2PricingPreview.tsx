import React, { useState } from "react";
import { Check } from "lucide-react";
import SectionEyebrow from "../SectionEyebrow";
import GlassCard from "../GlassCard";
import { PrimaryButton, SecondaryButton } from "../Buttons";
import { navigateToContact } from "../../App";
import { formatMonthlyPrice } from "../../lib/pricingVariants";
import {
  HOMEPAGE_ONE_TIME_LEADS_PLANS,
  HOMEPAGE_SUBSCRIPTION_PLANS,
  YEARLY_DISCOUNT,
  type HomepageOneTimeLeadsPlan,
  type HomepageSubscriptionPlan,
  type PricingMode,
} from "../../lib/homepagePricingPlans";
import { useHomepageCopy } from "./homepageVariantContext";
import "./homeV2PricingSection.css";

const ONE_TIME_LEADS_COPY_FALLBACK = {
  priceSuffix: "one-time",
  billingNote: "No subscription",
  quantityLabel: "Fixed number of verified leads",
  leadCountLabel: "{{count}} verified leads",
  toggleLabel: "One-Time",
};

function isCustomSubscriptionPlan(
  plan: HomepageSubscriptionPlan
): plan is HomepageSubscriptionPlan & { customPricing: true; priceLabel: string } {
  return plan.customPricing === true && typeof plan.priceLabel === "string";
}

export default function HomeV2PricingPreview() {
  const { pricing } = useHomepageCopy();
  const [pricingMode, setPricingMode] = useState<PricingMode>("yearly");
  const isYearly = pricingMode === "yearly";
  const isOneTime = pricingMode === "oneTime";
  const oneTimeCopy = {
    ...ONE_TIME_LEADS_COPY_FALLBACK,
    ...(pricing.oneTimeLeads ?? {}),
    toggleLabel: pricing.billingToggle.oneTimeLeads || ONE_TIME_LEADS_COPY_FALLBACK.toggleLabel,
  };

  return (
    <section
      id="pricing"
      className="homepage-v2-pricing relative min-w-0 scroll-mt-0 overflow-hidden py-12 sm:py-14 md:py-16"
      aria-labelledby="v2-pricing-heading"
    >
      <div className="relative z-10 mx-auto w-full min-w-0 max-w-7xl px-3 min-[341px]:px-4 sm:px-6">
        {/*
          Dedicated Pricing scroll target (QA custom reference).
          Anchors at the visible content start (eyebrow), not the section padding
          box — otherwise header clearance + py-* stacks and lands too low.
          Hash stays /#pricing on the section; scroll-mt stays 0 (JS owns offset).
        */}
        <div
          data-homepage-scroll-ref="pricing"
          aria-hidden="true"
          className="pointer-events-none absolute left-0 top-0 h-0 w-0"
        />
        <div className="relative mx-auto mb-8 max-w-2xl space-y-2.5 text-center md:mb-10">
          <div className="flex justify-center">
            <SectionEyebrow label={pricing.eyebrow} />
          </div>
          <h2 id="v2-pricing-heading" className="section-title">
            {pricing.title}
          </h2>
          <p className="text-body text-sm leading-relaxed md:text-base">{pricing.subtitle}</p>
        </div>

        <div
          className="homepage-v2-pricing__toggle"
          role="group"
          aria-label={pricing.billingToggle.groupLabel}
        >
          <button
            type="button"
            className={`homepage-v2-pricing__toggle-btn ${
              pricingMode === "monthly" ? "homepage-v2-pricing__toggle-btn--active" : ""
            }`}
            aria-pressed={pricingMode === "monthly"}
            onClick={() => setPricingMode("monthly")}
          >
            {pricing.billingToggle.monthly}
          </button>
          <button
            type="button"
            className={`homepage-v2-pricing__toggle-btn ${
              isYearly ? "homepage-v2-pricing__toggle-btn--active" : ""
            }`}
            aria-pressed={isYearly}
            onClick={() => setPricingMode("yearly")}
          >
            {pricing.billingToggle.yearly}
            <span className="homepage-v2-pricing__toggle-save">
              {pricing.billingToggle.saveLabel}
            </span>
          </button>
          <button
            type="button"
            className={`homepage-v2-pricing__toggle-btn ${
              isOneTime ? "homepage-v2-pricing__toggle-btn--active" : ""
            }`}
            aria-pressed={isOneTime}
            onClick={() => setPricingMode("oneTime")}
          >
            {oneTimeCopy.toggleLabel}
          </button>
        </div>

        <div className="mx-auto grid max-w-5xl grid-cols-1 items-stretch gap-3 md:grid-cols-3 md:gap-4">
          {isOneTime
            ? HOMEPAGE_ONE_TIME_LEADS_PLANS.map((plan) => (
                <OneTimeLeadsCard key={plan.id} plan={plan} copy={oneTimeCopy} />
              ))
            : HOMEPAGE_SUBSCRIPTION_PLANS.map((plan) => (
                <SubscriptionPlanCard
                  key={plan.id}
                  plan={plan}
                  isYearly={isYearly}
                  priceSuffix={pricing.priceSuffix}
                  yearlyBillingNote={pricing.yearlyBillingNote}
                />
              ))}
        </div>
      </div>
    </section>
  );
}

function SubscriptionPlanCard({
  plan,
  isYearly,
  priceSuffix,
  yearlyBillingNote,
}: {
  plan: HomepageSubscriptionPlan;
  isYearly: boolean;
  priceSuffix: string;
  yearlyBillingNote: string;
}) {
  const featured = plan.featured === true;
  const custom = isCustomSubscriptionPlan(plan);

  let priceDisplay: string;
  let showSuffix = false;

  if (custom) {
    priceDisplay = plan.priceLabel;
  } else if (plan.monthlyPrice === null) {
    priceDisplay = plan.priceLabel ?? "Custom pricing";
  } else {
    const displayPrice = Math.round(plan.monthlyPrice * (isYearly ? 1 - YEARLY_DISCOUNT : 1));
    priceDisplay = formatMonthlyPrice(displayPrice);
    showSuffix = plan.omitBillingSuffix !== true;
  }

  return (
    <article
      className={`homepage-v2-pricing__card min-w-0 ${featured ? "homepage-v2-pricing-card--featured" : ""}`}
      aria-label={`${plan.name} plan`}
    >
      <GlassCard
        glowColor={featured ? "brand" : "none"}
        contentClassName="flex h-full min-h-0 flex-col"
        className={`relative flex h-full min-h-0 flex-col border p-5 ${
          featured ? "border-[#3D81E3]/40 bg-[#3D81E3]/5" : "border-white/[0.08] bg-white/[0.02]"
        }`}
      >
        <div className="flex min-h-0 flex-col space-y-3">
          <span
            className={`text-xs font-bold uppercase tracking-wide ${
              featured ? "text-[#A4F4FD]" : "text-white/50"
            }`}
          >
            {plan.name}
          </span>

          <div className="flex flex-wrap items-end gap-1.5" aria-live="polite" aria-atomic="true">
            <span
              className="homepage-v2-pricing__price text-3xl font-extrabold tracking-tight text-white md:text-4xl"
              key={`${plan.id}-${isYearly ? "yearly" : "monthly"}`}
            >
              {priceDisplay}
            </span>
            {showSuffix ? <span className="pb-1 text-sm text-white/50">{priceSuffix}</span> : null}
          </div>

          {plan.description ? (
            <p className="text-sm leading-snug text-white/70">{plan.description}</p>
          ) : null}

          {isYearly && showSuffix ? (
            <p className="text-xs text-white/45">{yearlyBillingNote}</p>
          ) : null}

          <ul className="homepage-v2-pricing__features border-t border-white/[0.08] pt-4">
            {plan.features.map((feature) => (
              <li key={feature} className="flex items-start gap-2 text-sm text-white/65">
                <Check
                  className={`mt-0.5 h-3.5 w-3.5 shrink-0 ${
                    featured ? "text-[#A4F4FD]" : "text-[#00D2FF]"
                  }`}
                  aria-hidden
                />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-auto pt-6">
          {featured ? (
            <PrimaryButton onClick={navigateToContact} className="w-full">
              {plan.ctaLabel}
            </PrimaryButton>
          ) : (
            <SecondaryButton onClick={navigateToContact} className="w-full">
              {plan.ctaLabel}
            </SecondaryButton>
          )}
        </div>
      </GlassCard>
    </article>
  );
}

function OneTimeLeadsCard({
  plan,
  copy,
}: {
  plan: HomepageOneTimeLeadsPlan;
  copy: {
    priceSuffix: string;
    billingNote: string;
    quantityLabel: string;
    leadCountLabel: string;
  };
}) {
  const featured = plan.featured === true;
  const hasFixedPrice = typeof plan.price === "number";
  const priceDisplay = hasFixedPrice
    ? formatMonthlyPrice(plan.price)
    : (plan.priceLabel ?? "Contact us for pricing");
  const leadCountLabel =
    plan.leadCount !== null
      ? copy.leadCountLabel.replace("{{count}}", plan.leadCount.toLocaleString("en-US"))
      : null;

  return (
    <article
      className={`homepage-v2-pricing__card min-w-0 ${featured ? "homepage-v2-pricing-card--featured" : ""}`}
      aria-label={`${plan.name} package`}
    >
      <GlassCard
        glowColor={featured ? "brand" : "none"}
        contentClassName="flex h-full min-h-0 flex-col"
        className={`relative flex h-full min-h-0 flex-col border p-5 ${
          featured ? "border-[#3D81E3]/40 bg-[#3D81E3]/5" : "border-white/[0.08] bg-white/[0.02]"
        }`}
      >
        <div className="flex min-h-0 flex-col space-y-3">
          <span
            className={`text-xs font-bold uppercase tracking-wide ${
              featured ? "text-[#A4F4FD]" : "text-white/50"
            }`}
          >
            {plan.name}
          </span>

          <div className="flex flex-wrap items-end gap-1.5" aria-live="polite" aria-atomic="true">
            <span
              className="homepage-v2-pricing__price text-3xl font-extrabold tracking-tight text-white md:text-4xl"
              key={plan.id}
            >
              {priceDisplay}
            </span>
            {hasFixedPrice ? (
              <span className="pb-1 text-sm text-white/50">{copy.priceSuffix}</span>
            ) : null}
          </div>

          <p className="text-sm leading-snug text-white/70">{plan.description}</p>

          <div className="space-y-1">
            {plan.leadCount !== null ? (
              <>
                <p className="text-sm leading-snug text-white/70">{copy.quantityLabel}</p>
                {leadCountLabel ? <p className="text-xs text-white/55">{leadCountLabel}</p> : null}
              </>
            ) : null}
            <p className="text-xs text-white/45">{copy.billingNote}</p>
          </div>
        </div>

        <div className="mt-auto pt-6">
          {featured ? (
            <PrimaryButton onClick={navigateToContact} className="w-full">
              {plan.ctaLabel}
            </PrimaryButton>
          ) : (
            <SecondaryButton onClick={navigateToContact} className="w-full">
              {plan.ctaLabel}
            </SecondaryButton>
          )}
        </div>
      </GlassCard>
    </article>
  );
}
