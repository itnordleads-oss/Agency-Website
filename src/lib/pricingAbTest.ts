import {
  getPricingVariantConfig,
  isPricingVariantId,
  type PricingVariantConfig,
  type PricingVariantId,
} from "./pricingVariants";

export const PRICING_AB_STORAGE_KEY = "adealforge:pricing-ab-variant";

function assignRandomVariant(): PricingVariantId {
  return Math.random() < 0.5 ? "a" : "b";
}

export function resolvePricingVariantId(): PricingVariantId {
  if (typeof window === "undefined") {
    return "a";
  }

  const storedVariant = window.localStorage.getItem(PRICING_AB_STORAGE_KEY);
  if (isPricingVariantId(storedVariant)) {
    return storedVariant;
  }

  const assignedVariant = assignRandomVariant();
  window.localStorage.setItem(PRICING_AB_STORAGE_KEY, assignedVariant);
  return assignedVariant;
}

export function getActivePricingVariant(): PricingVariantConfig {
  return getPricingVariantConfig(resolvePricingVariantId());
}

export function setPricingVariantForTesting(variantId: PricingVariantId): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(PRICING_AB_STORAGE_KEY, variantId);
}

export function clearPricingVariantAssignment(): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(PRICING_AB_STORAGE_KEY);
}
