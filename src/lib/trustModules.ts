/**
 * Agency Website F12 — verified-only trust / social-proof policy.
 *
 * Default v1: every module stays off until leadership provides approved content.
 * Flip a flag only when the matching data source is real, approved, and agency-relevant.
 */
export const TRUST_MODULES = {
  testimonialsEnabled: false,
  clientLogosEnabled: false,
  pricingEnabled: false,
  metricsEnabled: false,
} as const;

export type TrustModuleKey = keyof typeof TRUST_MODULES;

export function isTestimonialsModuleEnabled(): boolean {
  return TRUST_MODULES.testimonialsEnabled;
}

export function isClientLogosModuleEnabled(): boolean {
  return TRUST_MODULES.clientLogosEnabled;
}

export function isPricingModuleEnabled(): boolean {
  return TRUST_MODULES.pricingEnabled;
}

export function isMetricsModuleEnabled(): boolean {
  return TRUST_MODULES.metricsEnabled;
}
