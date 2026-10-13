export type CareerJob = {
  id: string;
  slug: string;
  title: string;
  department?: string;
  employmentType?: string;
  location?: string;
  workMode?: string;
  shortDescription: string;
  requirements?: string[];
  responsibilities?: string[];
  status: "open" | "closed";
  applyUrl?: string;
  featured?: boolean;
};

/**
 * Public roles are deliberately empty until a vacancy and application route
 * have been confirmed. The Careers UI remains data-driven for future roles.
 */
export const CAREER_JOBS: readonly CareerJob[] = [];

export const CAREER_EXPERTISE = [
  {
    id: "software",
    label: "Software",
    description: "Custom software for workflows, integrations, and product operations.",
  },
  {
    id: "web",
    label: "Web",
    description: "Websites and digital experiences with clear, maintainable implementation.",
  },
  {
    id: "mobile",
    label: "Mobile",
    description: "Mobile applications shaped around focused screens and useful actions.",
  },
  {
    id: "shopify",
    label: "Shopify",
    description: "Storefront setup, customization, and commerce-focused improvements.",
  },
  {
    id: "wordpress",
    label: "WordPress",
    description: "Content-driven websites designed for practical publishing workflows.",
  },
  {
    id: "themes",
    label: "Custom themes",
    description: "Distinct layouts and CMS-editable sections for WordPress sites.",
  },
] as const;

export const CAREER_FAQS = [
  {
    id: "apply",
    question: "How do I apply for an open position?",
    answer: "Each published role will include its application instructions and contact route.",
  },
  {
    id: "roles",
    question: "Where will open roles be listed?",
    answer: "Current opportunities will be published on this page when they become available.",
  },
  {
    id: "contact",
    question: "Can I contact the studio if there are no current openings?",
    answer: "You can contact us with a relevant enquiry through the contact page.",
  },
  {
    id: "details",
    question: "What information should I include when applying?",
    answer: "Use the information requested in the published role and include work relevant to it.",
  },
] as const;
