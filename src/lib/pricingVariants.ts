export type PricingTierId = "basic" | "pro" | "enterprise";

export type PricingVariantId = "a" | "b";

export interface PricingVariantPrices {
  basic: number;
  pro: number;
  enterprise: number;
}

export interface PricingVariantConfig {
  id: PricingVariantId;
  label: string;
  prices: PricingVariantPrices;
}

export const PRICING_TIER_ORDER: PricingTierId[] = ["basic", "pro", "enterprise"];

export const PRICING_VARIANTS: Record<PricingVariantId, PricingVariantConfig> = {
  a: {
    id: "a",
    label: "Variant A",
    prices: {
      basic: 29,
      pro: 59,
      enterprise: 99,
    },
  },
  b: {
    id: "b",
    label: "Variant B",
    prices: {
      basic: 39,
      pro: 69,
      enterprise: 109,
    },
  },
};

export function isPricingVariantId(value: string | null): value is PricingVariantId {
  return value === "a" || value === "b";
}

export function getPricingVariantConfig(variantId: PricingVariantId): PricingVariantConfig {
  return PRICING_VARIANTS[variantId];
}

export function formatMonthlyPrice(amount: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}
