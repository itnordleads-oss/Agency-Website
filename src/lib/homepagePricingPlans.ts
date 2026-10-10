/**
 * Homepage Pricing — typed plan configuration (English source of truth for plan structure).
 * Toggle labels / section chrome stay in i18n; card economics live here so we do not invent
 * unapproved prices or scatter 25,000 / 50,000 strings through JSX.
 */

export type PricingMode = "monthly" | "yearly" | "oneTime";

export type HomepageSubscriptionPlan = {
  id: "free" | "growth" | "flexible";
  name: string;
  /** Numeric monthly list price. Null = custom / contact pricing (no hardcoded amount). */
  monthlyPrice: number | null;
  /** When true, omit /month and /year suffixes (free plan). */
  omitBillingSuffix?: boolean;
  /** When true, show priceLabel instead of a formatted currency amount. */
  customPricing?: boolean;
  priceLabel?: string;
  description: string;
  features: string[];
  ctaLabel: string;
  featured?: boolean;
};

export type HomepageOneTimeLeadsPlan = {
  id: "starter-leads" | "growth-leads" | "flexible-leads";
  name: string;
  description: string;
  /** Null = volume is custom / not fixed. */
  leadCount: number | null;
  /** Approved fixed price only. Null = contact / custom (do not invent). */
  price: number | null;
  priceLabel?: string;
  ctaLabel: string;
  featured?: boolean;
};

/** Subscription cards for Monthly / Yearly modes. */
export const HOMEPAGE_SUBSCRIPTION_PLANS: readonly HomepageSubscriptionPlan[] = [
  {
    id: "free",
    name: "FREE",
    monthlyPrice: 0,
    omitBillingSuffix: true,
    description: "A clear start for small sales teams testing outbound sales automation.",
    ctaLabel: "Get Started",
    features: [
      "Prospect research basics",
      "Contact details added",
      "Email checks",
      "5,000 contacts",
      "Cold email software outreach",
      "Connect to your sales tools",
      "Simple dashboard",
      "Basic reports",
      "Standard support",
    ],
  },
  {
    id: "growth",
    name: "Growth",
    monthlyPrice: 399,
    featured: true,
    description: "Built for growing B2B teams that want more outbound sales volume.",
    ctaLabel: "Let's Talk",
    features: [
      "Everything in Free",
      "50,000 contacts",
      "Cold email personalization help",
      "Automated follow-ups",
      "LinkedIn outreach",
      "Smart reminders",
      "Better revenue intelligence reports",
      "Team access",
      "Sales tool sync",
      "Extra integrations",
      "Priority support",
    ],
  },
  {
    id: "flexible",
    name: "FLEXIBLE",
    monthlyPrice: null,
    customPricing: true,
    priceLabel: "Custom pricing",
    description:
      "Flexible pricing based on your lead volume, workflow requirements, and campaign goals.",
    ctaLabel: "Contact Us",
    features: [
      "Everything in Growth",
      "Tailored lead volume",
      "Custom outbound sales setup",
      "Workflow-aligned campaign scope",
      "Your own support manager",
      "Guided setup",
      "Strong security",
      "One login for your team",
      "Custom connections",
      "Guaranteed support times",
    ],
  },
] as const;

/**
 * One-Time Leads cards.
 * Starter price/lead count reuse the previously approved placeholder commercial values.
 * Growth uses 50,000 leads with contact pricing (no approved 50k one-time price in-repo).
 */
export const HOMEPAGE_ONE_TIME_LEADS_PLANS: readonly HomepageOneTimeLeadsPlan[] = [
  {
    id: "starter-leads",
    name: "Starter",
    description: "A one-time lead package for smaller campaigns or testing.",
    leadCount: 500,
    price: 499,
    ctaLabel: "Buy Leads",
  },
  {
    id: "growth-leads",
    name: "Growth",
    description: "A larger one-time lead package for scaling outbound campaigns.",
    leadCount: 50_000,
    price: null,
    priceLabel: "Contact us for pricing",
    featured: true,
    ctaLabel: "Request Pricing",
  },
  {
    id: "flexible-leads",
    name: "Flexible",
    description:
      "A flexible one-time lead package tailored to the required lead volume, targeting criteria, validation, and campaign needs.",
    leadCount: null,
    price: null,
    priceLabel: "Custom pricing",
    ctaLabel: "Contact Us",
  },
] as const;

export const YEARLY_DISCOUNT = 0.2;
