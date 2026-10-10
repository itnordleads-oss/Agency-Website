/**
 * Homepage one-time leads helpers.
 * Canonical plan data lives in `homepagePricingPlans.ts`.
 */
export {
  HOMEPAGE_ONE_TIME_LEADS_PLANS,
  type HomepageOneTimeLeadsPlan,
} from "./homepagePricingPlans";

import { HOMEPAGE_ONE_TIME_LEADS_PLANS } from "./homepagePricingPlans";

export function getHomepageOneTimeLeadsPackage(tierId: string) {
  return HOMEPAGE_ONE_TIME_LEADS_PLANS.find((plan) => plan.id === tierId) ?? null;
}
