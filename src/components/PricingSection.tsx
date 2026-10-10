import React, { useMemo } from "react";
import { Check } from "lucide-react";
import SectionEyebrow from "./SectionEyebrow";
import GlassCard from "./GlassCard";
import { PrimaryButton, SecondaryButton } from "./Buttons";
import { useSiteCopy } from "../lib/useSiteCopy";
import { navigateToContact } from "../App";
import { resolvePricingVariantId } from "../lib/pricingAbTest";
import {
  formatMonthlyPrice,
  getPricingVariantConfig,
  PRICING_TIER_ORDER,
  type PricingTierId,
} from "../lib/pricingVariants";
import { isPricingModuleEnabled } from "../lib/trustModules";
import "./pricingSection.css";

type PricingTierView = {
  id: PricingTierId;
  name: string;
  description: string;
  features: string[];
  cta: string;
  pill?: string;
  highlighted: boolean;
  price: number;
};

export default function PricingSection() {
  const { pricing } = useSiteCopy();
  const variantId = useMemo(() => resolvePricingVariantId(), []);
  const variant = useMemo(() => getPricingVariantConfig(variantId), [variantId]);

  if (!isPricingModuleEnabled()) {
    return null;
  }

  const tiers: PricingTierView[] = PRICING_TIER_ORDER.map((tierId) => {
    const tierCopy = pricing.tiers[tierId];
    return {
      id: tierId,
      name: tierCopy.name,
      description: tierCopy.description,
      features: [...tierCopy.features],
      cta: tierCopy.cta,
      pill: tierCopy.pill,
      highlighted: "highlighted" in tierCopy && tierCopy.highlighted === true,
      price: variant.prices[tierId],
    };
  });

  return (
    <section
      className="section-padding relative overflow-hidden"
      id="pricing"
      data-pricing-variant={variantId}
    >
      <div className="absolute top-1/4 left-[8%] w-[360px] h-[360px] rounded-full bg-[#3D81E3]/5 blur-[80px] md:blur-[150px] pointer-events-none motion-reduce:hidden" />

      <div className="max-w-7xl mx-auto px-3 min-[341px]:px-4 sm:px-6 relative z-10 min-w-0">
        <div className="text-center max-w-2xl mx-auto space-y-4 mb-12 md:mb-16">
          <div className="flex justify-center">
            <SectionEyebrow label={pricing.eyebrow.label} tag={pricing.eyebrow.tag} />
          </div>
          <h2 className="section-title">{pricing.title}</h2>
          <p className="text-body text-base md:text-lg leading-relaxed">{pricing.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-7 max-w-5xl mx-auto">
          {tiers.map((tier) => {
            const formattedPrice = formatMonthlyPrice(tier.price);

            return (
              <div
                key={`${variantId}-${tier.id}`}
                className={`pricing-card-frame ${
                  tier.highlighted ? "pricing-card-frame--featured" : "pricing-card-frame--standard"
                }`}
              >
                <GlassCard
                  glowColor={tier.highlighted ? "brand" : "none"}
                  className={`relative flex flex-col justify-between md:min-h-[420px] ${
                    tier.highlighted
                      ? "border-[#3D81E3]/40 bg-[#3D81E3]/5 shadow-[0_4px_24px_rgba(61,129,227,0.15)]"
                      : "border-white/[0.08]"
                  }`}
                >
                  {tier.highlighted ? (
                    <span className="absolute top-4 right-4 status-pill status-pill--active">
                      {tier.pill}
                    </span>
                  ) : tier.pill ? (
                    <span className="absolute top-4 right-4 status-pill">{tier.pill}</span>
                  ) : null}

                  <div className="space-y-4">
                    <span
                      className={`text-xs font-bold uppercase tracking-wide ${tier.highlighted ? "text-[#A4F4FD]" : "text-subtle"}`}
                    >
                      {tier.name}
                    </span>

                    <div
                      className="flex items-end gap-1.5"
                      aria-label={`${tier.name} price ${formattedPrice} ${pricing.priceSuffix}`}
                    >
                      <span className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
                        {formattedPrice}
                      </span>
                      <span className="text-sm text-subtle pb-1">{pricing.priceSuffix}</span>
                    </div>

                    <p className="text-sm text-body leading-relaxed">{tier.description}</p>

                    <ul className="space-y-2.5 pt-4 border-t border-white/[0.08]">
                      {tier.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2 text-sm text-body">
                          <Check
                            className={`w-4 h-4 shrink-0 mt-0.5 ${tier.highlighted ? "text-[#A4F4FD]" : "text-white/55"}`}
                            aria-hidden="true"
                          />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-8">
                    {tier.highlighted ? (
                      <PrimaryButton onClick={navigateToContact} className="w-full">
                        {tier.cta}
                      </PrimaryButton>
                    ) : (
                      <SecondaryButton onClick={navigateToContact} className="w-full">
                        {tier.cta}
                      </SecondaryButton>
                    )}
                  </div>
                </GlassCard>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
