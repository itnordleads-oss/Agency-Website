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

export type CareerExpertiseId = "software" | "web" | "mobile" | "shopify" | "wordpress" | "themes";

export type CareerExpertiseItem = {
  id: CareerExpertiseId;
  label: string;
  title: string;
  description: string;
  tags: readonly string[];
};

export const CAREER_EXPERTISE: readonly CareerExpertiseItem[] = [
  {
    id: "software",
    label: "Software",
    title: "Software",
    description:
      "Custom software for workflows, integrations, internal tools, and product operations.",
    tags: ["Workflows", "Integrations", "Product Operations"],
  },
  {
    id: "web",
    label: "Web",
    title: "Web",
    description:
      "Modern websites and web experiences focused on usability, performance, and clear delivery.",
    tags: ["Usability", "Performance", "Clear Delivery"],
  },
  {
    id: "mobile",
    label: "Mobile",
    title: "Mobile",
    description: "Mobile product experiences designed and developed around useful user flows.",
    tags: ["User Flows", "Focused Screens", "Useful Actions"],
  },
  {
    id: "shopify",
    label: "Shopify",
    title: "Shopify",
    description: "Commerce experiences and Shopify storefront work.",
    tags: ["Storefronts", "Customization", "Commerce"],
  },
  {
    id: "wordpress",
    label: "WordPress",
    title: "WordPress",
    description: "WordPress websites focused on maintainability, content, and practical delivery.",
    tags: ["Content", "Maintainability", "Publishing"],
  },
  {
    id: "themes",
    label: "Custom Themes",
    title: "Custom Themes",
    description: "Purpose-built WordPress theme work for more tailored website requirements.",
    tags: ["Layouts", "Components", "CMS Sections"],
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
