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

export type AgencyProjectGalleryLayout = "full" | "wide" | "portrait" | "default";

export type AgencyProjectGalleryItem = {
  /** CSS concept frame variant — not a stock photo of a real product. */
  variant: 1 | 2 | 3;
  alt: string;
  /** Short editorial caption shown under the frame. */
  caption?: string;
  /** Editorial layout hint for detail gallery composition. */
  layout?: AgencyProjectGalleryLayout;
};

export type AgencyProject = {
  id: string;
  slug: string;
  title: string;
  /** Short meta label, e.g. category headline under the title. */
  label?: string;
  shortDescription: string;
  /** Longer overview used for SEO/supporting context; hero uses shortDescription. */
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
  /**
   * Optional capability signals for the demonstrates section.
   * Must stay concept/capability-focused — never fake results.
   */
  demonstrateSignals?: string[];
  /** Compact concept-direction flow labels (editorial, not metrics). */
  directionSteps?: string[];
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
    label: "Storefront concept",
    shortDescription: "Storefront concept for discovery, collections, and checkout flow.",
    overview:
      "Nova Commerce is a demo commerce UI concept focused on product navigation and storefront structure — not a real client engagement.",
    category: "websites",
    services: ["Website Development"],
    technologies: ["React", "TypeScript", "CSS"],
    projectType: "Website concept",
    platform: "Web",
    status: "Concept Project",
    featured: true,
    visualMotif: "commerce",
    isDemo: true,
    published: true,
    challenge:
      "Organize discovery, collections, and checkout flow without overloading the shopper.",
    solution:
      "Clear collection hierarchy with reusable product surfaces and adaptable catalog patterns.",
    deliverables: [
      "Storefront layout",
      "Product and collection UI",
      "Navigation scaffolding",
      "Checkout flow structure",
    ],
    outcome: "A maintainable commerce UI architecture with clear hierarchy and reusable surfaces.",
    demonstrateSignals: [
      "Product discovery hierarchy",
      "Reusable storefront surfaces",
      "Commerce structure",
    ],
    directionSteps: [
      "Product discovery",
      "Collection structure",
      "Reusable surfaces",
      "Checkout flow",
    ],
    gallery: [
      {
        variant: 1,
        alt: "Nova Commerce concept — storefront overview frame",
        caption: "Storefront",
        layout: "full",
      },
      {
        variant: 2,
        alt: "Nova Commerce concept — product grid frame",
        caption: "Collections",
        layout: "default",
      },
      {
        variant: 3,
        alt: "Nova Commerce concept — detail panel frame",
        caption: "Product detail",
        layout: "default",
      },
    ],
  },
  {
    id: "demo-orbit-dashboard",
    slug: "orbit-dashboard",
    title: "Orbit Dashboard",
    label: "Dashboard concept",
    shortDescription: "Dashboard concept for status, activity, and operational views.",
    overview:
      "Orbit Dashboard is a demo SaaS interface concept for readable operational views — presented as a concept only.",
    category: "software",
    services: ["Software Development"],
    technologies: ["React", "TypeScript"],
    projectType: "Software concept",
    platform: "Web application",
    status: "Concept Project",
    featured: true,
    visualMotif: "dashboard",
    isDemo: true,
    published: true,
    challenge: "Surface status and activity clearly without visual noise.",
    solution: "Modular shell with compact panels that scale from overview to detail.",
    deliverables: [
      "Dashboard shell",
      "Status panel patterns",
      "Table and list views",
      "Operational layout",
    ],
    outcome: "A component-driven dashboard structure for future product tooling.",
    demonstrateSignals: [
      "Operational hierarchy",
      "Modular workspace panels",
      "Scalable dashboard shell",
    ],
    directionSteps: ["Overview shell", "Status grouping", "Module panels", "Detail views"],
    gallery: [
      {
        variant: 1,
        alt: "Orbit Dashboard concept — overview frame",
        caption: "Overview",
        layout: "full",
      },
      {
        variant: 2,
        alt: "Orbit Dashboard concept — metrics frame",
        caption: "Status modules",
        layout: "default",
      },
      {
        variant: 3,
        alt: "Orbit Dashboard concept — activity list frame",
        caption: "Activity",
        layout: "default",
      },
    ],
  },
  {
    id: "demo-atlas-mobile",
    slug: "atlas-mobile",
    title: "Atlas Mobile",
    label: "Mobile concept",
    shortDescription: "Mobile concept with clear primary actions and thumb-friendly navigation.",
    overview:
      "Atlas Mobile is a demo mobile application concept focused on clear screens and one-handed use.",
    category: "mobile",
    services: ["Mobile App Development"],
    technologies: ["React", "TypeScript"],
    projectType: "Mobile concept",
    platform: "iOS / Android",
    status: "Concept Project",
    featured: true,
    visualMotif: "mobile",
    isDemo: true,
    published: true,
    challenge: "Keep core tasks obvious while leaving room for secondary flows.",
    solution: "Strong primary actions, compact blocks, and navigation built for one hand.",
    deliverables: [
      "Mobile screen flows",
      "Primary action hierarchy",
      "Account patterns",
      "Touch-friendly spacing",
    ],
    outcome: "Mobile-first composition and interaction patterns ready to adapt later.",
    demonstrateSignals: [
      "Thumb-friendly navigation",
      "Clear primary actions",
      "Focused mobile screens",
    ],
    directionSteps: ["Primary action", "Screen hierarchy", "Secondary flows", "Touch spacing"],
    gallery: [
      {
        variant: 1,
        alt: "Atlas Mobile concept — home screen frame",
        caption: "Home",
        layout: "full",
      },
      {
        variant: 2,
        alt: "Atlas Mobile concept — detail screen frame",
        caption: "Detail",
        layout: "default",
      },
      {
        variant: 3,
        alt: "Atlas Mobile concept — profile screen frame",
        caption: "Account",
        layout: "default",
      },
    ],
  },
  {
    id: "demo-vertex-cms",
    slug: "vertex-cms",
    title: "Vertex CMS",
    label: "WordPress concept",
    shortDescription: "WordPress concept for structured pages and editor-friendly layouts.",
    overview:
      "Vertex CMS is a demo content-site concept for sectioned pages and theme structure — not a live client site.",
    category: "wordpress",
    services: ["WordPress", "Custom WordPress Theme"],
    technologies: ["WordPress", "PHP", "CSS"],
    projectType: "WordPress concept",
    platform: "WordPress",
    status: "Concept Project",
    featured: false,
    visualMotif: "cms",
    isDemo: true,
    published: true,
    challenge: "Stay flexible for editors while keeping a consistent public design system.",
    solution: "Section-based pages with reusable blocks and a theme shaped for editing workflows.",
    deliverables: [
      "Content section templates",
      "Theme layout structure",
      "Reusable page blocks",
      "Responsive content presentation",
    ],
    outcome:
      "A content-friendly WordPress theme approach ready to adapt for a real publishing site.",
    demonstrateSignals: [
      "Reusable content structure",
      "Editor-friendly architecture",
      "Consistent responsive presentation",
    ],
    directionSteps: [
      "Content structure",
      "Reusable blocks",
      "Editorial control",
      "Consistent frontend",
    ],
    gallery: [
      {
        variant: 1,
        alt: "Vertex CMS concept — landing sections frame",
        caption: "Landing structure",
        layout: "full",
      },
      {
        variant: 2,
        alt: "Vertex CMS concept — article layout frame",
        caption: "Article layout",
        layout: "default",
      },
      {
        variant: 3,
        alt: "Vertex CMS concept — content blocks frame",
        caption: "Reusable content blocks",
        layout: "default",
      },
    ],
  },
  {
    id: "demo-lumen-platform",
    slug: "lumen-platform",
    title: "Lumen Platform",
    label: "Platform concept",
    shortDescription: "Software concept for multi-view workflows and connected screens.",
    overview:
      "Lumen Platform is a demo custom software concept for modular shells and workspace views.",
    category: "software",
    services: ["Software Development"],
    technologies: ["React", "TypeScript", "Node"],
    projectType: "Software concept",
    platform: "Web platform",
    status: "Concept Project",
    featured: false,
    visualMotif: "platform",
    isDemo: true,
    published: true,
    challenge: "Keep multiple modules coherent with a clear entry point for each area.",
    solution: "Shared navigation and workspace views that stay consistent across modules.",
    deliverables: [
      "Application shell",
      "Module navigation",
      "Settings patterns",
      "Workspace views",
    ],
    outcome: "A scalable software shell and interaction model for future platform builds.",
    demonstrateSignals: ["Multi-module shell", "Shared navigation", "Connected workspace views"],
    directionSteps: [
      "Application shell",
      "Module entry points",
      "Shared patterns",
      "Workspace views",
    ],
    gallery: [
      {
        variant: 1,
        alt: "Lumen Platform concept — workspace frame",
        caption: "Workspace",
        layout: "full",
      },
      {
        variant: 2,
        alt: "Lumen Platform concept — modules frame",
        caption: "Modules",
        layout: "default",
      },
      {
        variant: 3,
        alt: "Lumen Platform concept — settings frame",
        caption: "Settings",
        layout: "default",
      },
    ],
  },
  {
    id: "demo-forge-store",
    slug: "forge-store",
    title: "Forge Store",
    label: "Shopify concept",
    shortDescription: "Shopify concept for collections, merchandising, and storefront clarity.",
    overview:
      "Forge Store is a demo Shopify commerce concept focused on merchandising layout — not a commissioned store.",
    category: "shopify",
    services: ["Shopify"],
    technologies: ["Shopify", "Liquid", "CSS"],
    projectType: "Shopify concept",
    platform: "Shopify",
    status: "Concept Project",
    featured: false,
    visualMotif: "shopify",
    isDemo: true,
    published: true,
    challenge: "Highlight collections and product stories while staying easy to scan on mobile.",
    solution: "Merchandising-led layout with featured collections and clear product cards.",
    deliverables: [
      "Theme layout patterns",
      "Collection and product cards",
      "Merchandising sections",
      "Mobile storefront presentation",
    ],
    outcome: "A Shopify-oriented theme structure ready to adapt for a future store build.",
    demonstrateSignals: [
      "Merchandising-led storefront",
      "Collection clarity",
      "Mobile commerce layout",
    ],
    directionSteps: ["Storefront layout", "Collections", "Product stories", "Mobile presentation"],
    gallery: [
      {
        variant: 1,
        alt: "Forge Store concept — storefront frame",
        caption: "Storefront",
        layout: "full",
      },
      {
        variant: 2,
        alt: "Forge Store concept — collection frame",
        caption: "Collection",
        layout: "default",
      },
      {
        variant: 3,
        alt: "Forge Store concept — product frame",
        caption: "Product",
        layout: "default",
      },
    ],
  },
];
