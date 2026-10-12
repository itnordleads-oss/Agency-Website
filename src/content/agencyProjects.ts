/**
 * Agency Projects / Portfolio content.
 *
 * Demo entries are allowed for design completion and MUST set `isDemo: true`.
 * They must never be presented as real clients, commissions, or business results.
 *
 * Future real projects: set `isDemo: false`, replace copy/assets, publish with verified facts only.
 */

export const AGENCY_PROJECT_CATEGORIES = [
  "software",
  "websites",
  "mobile",
  "shopify",
  "wordpress",
] as const;

export type AgencyProjectCategory = (typeof AGENCY_PROJECT_CATEGORIES)[number];

export type ProjectVisualMotif =
  "commerce" | "dashboard" | "mobile" | "cms" | "platform" | "shopify";

export type AgencyProjectGalleryItem = {
  /** CSS concept frame variant — not a stock photo of a real product. */
  variant: 1 | 2 | 3;
  alt: string;
};

export type AgencyProject = {
  id: string;
  slug: string;
  title: string;
  /** Short meta label, e.g. category headline under the title. */
  label?: string;
  shortDescription: string;
  /** Longer overview used on the detail hero. */
  overview: string;
  category: AgencyProjectCategory;
  services?: string[];
  technologies?: string[];
  thumbnail?: string;
  thumbnailAlt?: string;
  heroImage?: string;
  gallery?: AgencyProjectGalleryItem[];
  /** Demo-safe “Project Goal” copy lives here when `isDemo` is true. */
  challenge?: string;
  solution?: string;
  deliverables?: string[];
  /** @deprecated Prefer `deliverables`. Kept for older callers. */
  whatWeBuilt?: string[];
  /** Delivery / concept summary — never fake metrics. */
  outcome?: string;
  projectUrl?: string;
  projectType?: string;
  platform?: string;
  status?: string;
  featured?: boolean;
  /** CSS concept visual theme when no screenshot asset exists. */
  visualMotif: ProjectVisualMotif;
  /** True for placeholder/concept entries that must show a Demo badge. */
  isDemo: boolean;
  published: boolean;
};

export const PROJECT_CATEGORY_LABELS: Record<AgencyProjectCategory, string> = {
  software: "Software",
  websites: "Web",
  mobile: "Mobile",
  shopify: "Shopify",
  wordpress: "WordPress",
};

/**
 * Demo portfolio concepts for UI completion.
 * Replace individually with real projects later — no UI rewrite required.
 */
export const AGENCY_PROJECTS: AgencyProject[] = [
  {
    id: "demo-nova-commerce",
    slug: "nova-commerce",
    title: "Nova Commerce",
    label: "E-commerce storefront concept",
    shortDescription:
      "A concept storefront exploring product discovery, collection browsing, and checkout-oriented flows.",
    overview:
      "Nova Commerce is a demo concept for a modern commerce experience. It focuses on clear product navigation, responsive layouts, and a maintainable storefront structure — not a real client engagement.",
    category: "websites",
    services: ["Website Development"],
    technologies: ["React", "TypeScript", "CSS"],
    projectType: "Website concept",
    platform: "Web",
    status: "Concept / Demo",
    featured: true,
    visualMotif: "commerce",
    isDemo: true,
    published: true,
    challenge:
      "The concept explores how a modern commerce experience could organize product discovery, navigation, and checkout-oriented flows without overloading the shopper.",
    solution:
      "A responsive storefront structure with reusable product surfaces, clear collection hierarchy, and component patterns that stay adaptable as catalog complexity grows.",
    deliverables: [
      "Responsive storefront layout",
      "Product and collection UI patterns",
      "Navigation and filter scaffolding",
      "Checkout-oriented flow structure",
    ],
    outcome:
      "Demonstrates a maintainable commerce UI architecture with clear visual hierarchy and reusable components for future real storefront work.",
    gallery: [
      { variant: 1, alt: "Nova Commerce concept — storefront overview frame" },
      { variant: 2, alt: "Nova Commerce concept — product grid frame" },
      { variant: 3, alt: "Nova Commerce concept — detail panel frame" },
    ],
  },
  {
    id: "demo-orbit-dashboard",
    slug: "orbit-dashboard",
    title: "Orbit Dashboard",
    label: "SaaS dashboard concept",
    shortDescription:
      "A business dashboard concept for monitoring activity, status, and operational views in one place.",
    overview:
      "Orbit Dashboard is a demo SaaS interface concept. It shows how dense operational information can stay readable through hierarchy, cards, and restrained data presentation — presented as a concept only.",
    category: "software",
    services: ["Software Development"],
    technologies: ["React", "TypeScript"],
    projectType: "Software concept",
    platform: "Web application",
    status: "Concept / Demo",
    featured: true,
    visualMotif: "dashboard",
    isDemo: true,
    published: true,
    challenge:
      "The concept explores how a business dashboard can surface status, activity, and key views without becoming visually noisy.",
    solution:
      "A modular dashboard shell with clear section grouping, compact metric panels, and a layout that scales from overview to detail screens.",
    deliverables: [
      "Dashboard shell and navigation",
      "Metric and status panel patterns",
      "Table and list views",
      "Responsive operational layout",
    ],
    outcome:
      "Shows a component-driven dashboard structure suited to future product tooling and internal business applications.",
    gallery: [
      { variant: 1, alt: "Orbit Dashboard concept — overview frame" },
      { variant: 2, alt: "Orbit Dashboard concept — metrics frame" },
      { variant: 3, alt: "Orbit Dashboard concept — activity list frame" },
    ],
  },
  {
    id: "demo-atlas-mobile",
    slug: "atlas-mobile",
    title: "Atlas Mobile",
    label: "Mobile application concept",
    shortDescription:
      "A mobile-first concept focused on clear primary actions, readable screens, and thumb-friendly navigation.",
    overview:
      "Atlas Mobile is a demo mobile application concept. It explores focused screens, progressive disclosure, and interaction patterns that stay comfortable on small devices.",
    category: "mobile",
    services: ["Mobile App Development"],
    technologies: ["React", "TypeScript"],
    projectType: "Mobile concept",
    platform: "iOS / Android concept",
    status: "Concept / Demo",
    featured: true,
    visualMotif: "mobile",
    isDemo: true,
    published: true,
    challenge:
      "The concept explores how a mobile product can keep core tasks obvious while leaving room for secondary screens and account flows.",
    solution:
      "A mobile-first screen set with strong primary actions, compact information blocks, and navigation that remains usable one-handed.",
    deliverables: [
      "Mobile screen flows",
      "Primary action hierarchy",
      "Account and settings patterns",
      "Touch-friendly component spacing",
    ],
    outcome:
      "Demonstrates mobile-first composition and interaction patterns ready to adapt for a future shipped application.",
    gallery: [
      { variant: 1, alt: "Atlas Mobile concept — home screen frame" },
      { variant: 2, alt: "Atlas Mobile concept — detail screen frame" },
      { variant: 3, alt: "Atlas Mobile concept — profile screen frame" },
    ],
  },
  {
    id: "demo-vertex-cms",
    slug: "vertex-cms",
    title: "Vertex CMS",
    label: "Content-driven website concept",
    shortDescription:
      "A WordPress-oriented concept for structured pages, reusable sections, and editor-friendly content layout.",
    overview:
      "Vertex CMS is a demo content-site concept. It focuses on sectioned page composition and CMS-friendly structure — not a live WordPress client site.",
    category: "wordpress",
    services: ["WordPress", "Custom WordPress Theme"],
    technologies: ["WordPress", "PHP", "CSS"],
    projectType: "WordPress concept",
    platform: "WordPress",
    status: "Concept / Demo",
    featured: false,
    visualMotif: "cms",
    isDemo: true,
    published: true,
    challenge:
      "The concept explores how a content-driven website can stay flexible for editors while presenting a consistent public design system.",
    solution:
      "A section-based page architecture with reusable content blocks, clear typography hierarchy, and a theme structure oriented toward WordPress editing workflows.",
    deliverables: [
      "Content section templates",
      "Theme layout structure",
      "Reusable page blocks",
      "Responsive content presentation",
    ],
    outcome:
      "Illustrates a content-friendly WordPress theme approach that can later be adapted for a real publishing site.",
    gallery: [
      { variant: 1, alt: "Vertex CMS concept — landing sections frame" },
      { variant: 2, alt: "Vertex CMS concept — article layout frame" },
      { variant: 3, alt: "Vertex CMS concept — content blocks frame" },
    ],
  },
  {
    id: "demo-lumen-platform",
    slug: "lumen-platform",
    title: "Lumen Platform",
    label: "Custom software platform concept",
    shortDescription:
      "A custom software concept for multi-view workflows, settings, and connected operational screens.",
    overview:
      "Lumen Platform is a demo custom software concept. It shows how a broader product shell can organize modules, settings, and workflow views without inventing a real product company.",
    category: "software",
    services: ["Software Development"],
    technologies: ["React", "TypeScript", "Node"],
    projectType: "Custom software concept",
    platform: "Web platform",
    status: "Concept / Demo",
    featured: false,
    visualMotif: "platform",
    isDemo: true,
    published: true,
    challenge:
      "The concept explores how a custom platform can keep multiple modules coherent while giving each area a clear entry point.",
    solution:
      "A modular application shell with shared navigation, settings patterns, and workspace views that stay consistent across feature areas.",
    deliverables: [
      "Application shell",
      "Module navigation",
      "Settings and preference patterns",
      "Workspace and detail views",
    ],
    outcome:
      "Demonstrates a scalable software shell and interaction model suitable for future custom platform builds.",
    gallery: [
      { variant: 1, alt: "Lumen Platform concept — workspace frame" },
      { variant: 2, alt: "Lumen Platform concept — modules frame" },
      { variant: 3, alt: "Lumen Platform concept — settings frame" },
    ],
  },
  {
    id: "demo-forge-store",
    slug: "forge-store",
    title: "Forge Store",
    label: "Shopify commerce concept",
    shortDescription:
      "A Shopify-oriented concept for product merchandising, collection pages, and storefront presentation.",
    overview:
      "Forge Store is a demo Shopify commerce concept. It focuses on merchandising layout and storefront clarity for a concept shop — not a commissioned Shopify store.",
    category: "shopify",
    services: ["Shopify"],
    technologies: ["Shopify", "Liquid", "CSS"],
    projectType: "Shopify concept",
    platform: "Shopify",
    status: "Concept / Demo",
    featured: false,
    visualMotif: "shopify",
    isDemo: true,
    published: true,
    challenge:
      "The concept explores how a Shopify storefront can highlight collections and product stories while staying easy to scan on mobile.",
    solution:
      "A merchandising-led storefront layout with featured collections, product cards, and a responsive theme structure oriented toward Shopify storefront patterns.",
    deliverables: [
      "Shopify theme layout patterns",
      "Collection and product cards",
      "Featured merchandising sections",
      "Mobile-first storefront presentation",
    ],
    outcome:
      "Shows a Shopify-oriented theme structure and merchandising presentation ready to adapt for a future real store build.",
    gallery: [
      { variant: 1, alt: "Forge Store concept — storefront frame" },
      { variant: 2, alt: "Forge Store concept — collection frame" },
      { variant: 3, alt: "Forge Store concept — product frame" },
    ],
  },
];
