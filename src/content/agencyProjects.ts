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
  /** One-line summary for the homepage project spotlight. */
  homepageDescription: string;
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
    id: "live-relay",
    slug: "relay",
    title: "Relay",
    label: "Workflow product website",
    shortDescription:
      "A dark product site for a workflow tool, with a live canvas, run history, and a path that opens the deployed site.",
    homepageDescription: "Workflow product website with a live 3D canvas.",
    overview:
      "Relay is a published product website. The homepage shows the handoff story, a branching canvas, and a direct link to the live deployment.",
    category: "software",
    services: ["Website Development"],
    technologies: ["React", "TypeScript", "CSS"],
    thumbnail: "/projects/relay.jpg",
    thumbnailAlt: "Relay homepage with the green workflow canvas",
    heroImage: "/projects/relay.jpg",
    gallery: [{ variant: 1, alt: "Relay homepage with the green workflow canvas", layout: "full" }],
    challenge:
      "The page has to explain a multi-step workflow without turning the first screen into a diagram legend.",
    solution:
      "A short headline, one visible canvas, and a live site link so the motion can be opened in the browser.",
    deliverables: ["Product homepage", "Workflow canvas", "Live site link"],
    outcome: "Published at the Relay deployment and linked from the portfolio.",
    projectUrl: "https://serene-salamander-aee7de.netlify.app/",
    projectType: "Product website",
    platform: "Web",
    status: "Live",
    featured: true,
    visualMotif: "platform",
    isDemo: false,
    published: true,
  },
  {
    id: "live-brewnns",
    slug: "brewnns",
    title: "Brewnns",
    label: "Specialty coffee website",
    shortDescription:
      "A coffee house site with a floating cup and bag, a short menu path, and a link to the live page.",
    homepageDescription: "Coffee house site with a floating 3D cup.",
    overview:
      "Brewnns is a published coffee website. The first screen pairs the house line with a cup and bag, then continues into the menu.",
    category: "websites",
    services: ["Website Development"],
    technologies: ["React", "TypeScript", "CSS"],
    thumbnail: "/projects/brewnns.jpg",
    thumbnailAlt: "Brewnns homepage with the floating coffee cup",
    heroImage: "/projects/brewnns.jpg",
    gallery: [{ variant: 1, alt: "Brewnns homepage with the floating coffee cup", layout: "full" }],
    challenge: "The first screen needs the drink and the house name in one view.",
    solution:
      "Large type on the left and the cup and bag on the right, with the menu one step away.",
    deliverables: ["Homepage", "Menu path", "Live site link"],
    outcome: "Published at the Brewnns deployment and linked from the portfolio.",
    projectUrl: "https://adorable-entremet-21bb72.netlify.app/",
    projectType: "Brand website",
    platform: "Web",
    status: "Live",
    featured: true,
    visualMotif: "commerce",
    isDemo: false,
    published: true,
  },
  {
    id: "live-ridgeline",
    slug: "ridgeline",
    title: "Ridgeline Roofing",
    label: "Trade services website",
    shortDescription:
      "A roofing company site with a job-site photograph, inspection path, and a link to the live page.",
    homepageDescription: "Roofing website built around a job-site photograph.",
    overview:
      "Ridgeline Roofing is a published services website. The homepage leads with the crew photograph and the inspection offer.",
    category: "websites",
    services: ["Website Development"],
    technologies: ["React", "TypeScript", "CSS"],
    thumbnail: "/projects/ridgeline.jpg",
    thumbnailAlt: "Ridgeline Roofing homepage with the crew on a roof",
    heroImage: "/projects/ridgeline.jpg",
    gallery: [
      { variant: 1, alt: "Ridgeline Roofing homepage with the crew on a roof", layout: "full" },
    ],
    challenge: "A trade homepage has to show the work, not a stock icon of a house.",
    solution:
      "The crew photograph carries the first screen, with services and the inspection path below it.",
    deliverables: ["Services homepage", "Inspection path", "Live site link"],
    outcome: "Published at the Ridgeline deployment and linked from the portfolio.",
    projectUrl: "https://phenomenal-mousse-96f0ff.netlify.app/",
    projectType: "Services website",
    platform: "Web",
    status: "Live",
    featured: true,
    visualMotif: "cms",
    isDemo: false,
    published: true,
  },
  {
    id: "live-halden",
    slug: "halden",
    title: "Halden",
    label: "Furniture catalogue website",
    shortDescription:
      "A furniture catalogue with editorial type, floating product frames, and a link to the live shop.",
    homepageDescription: "Furniture catalogue with floating product frames.",
    overview:
      "Halden is a published furniture website. The homepage sets the collection in large type and shows pieces as framed photographs.",
    category: "websites",
    services: ["Website Development"],
    technologies: ["React", "TypeScript", "CSS"],
    thumbnail: "/projects/halden.jpg",
    thumbnailAlt: "Halden homepage with red type and framed furniture photos",
    heroImage: "/projects/halden.jpg",
    gallery: [
      {
        variant: 1,
        alt: "Halden homepage with red type and framed furniture photos",
        layout: "full",
      },
    ],
    challenge:
      "A catalogue homepage has to introduce the house and the pieces without a dense grid.",
    solution: "Oversized type with a few framed photographs, then the in-stock list.",
    deliverables: ["Catalogue homepage", "Product frames", "Live site link"],
    outcome: "Published at the Halden deployment and linked from the portfolio.",
    projectUrl: "https://funny-rolypoly-363e5b.netlify.app/",
    projectType: "Catalogue website",
    platform: "Web",
    status: "Live",
    featured: true,
    visualMotif: "commerce",
    isDemo: false,
    published: true,
  },
  {
    id: "live-stemline",
    slug: "stemline",
    title: "Stemline",
    label: "Network product website",
    shortDescription:
      "A network product site with a node field, a connect action, and a link to the live page.",
    homepageDescription: "Network product site with a 3D node field.",
    overview:
      "Stemline is a published product website. The homepage states the relay path and shows the node field before the connect action.",
    category: "software",
    services: ["Website Development"],
    technologies: ["React", "TypeScript", "CSS"],
    thumbnail: "/projects/stemline.jpg",
    thumbnailAlt: "Stemline homepage with the node field",
    heroImage: "/projects/stemline.jpg",
    gallery: [{ variant: 1, alt: "Stemline homepage with the node field", layout: "full" }],
    challenge: "The first screen has to show a private path without a wall of protocol text.",
    solution: "One sentence, the node field, and a connect action that stays on the live site.",
    deliverables: ["Product homepage", "Node field", "Live site link"],
    outcome: "Published at the Stemline deployment and linked from the portfolio.",
    projectUrl: "https://eclectic-caramel-f7d059.netlify.app/",
    projectType: "Product website",
    platform: "Web",
    status: "Live",
    featured: true,
    visualMotif: "platform",
    isDemo: false,
    published: true,
  },
  {
    id: "demo-nova-commerce",
    slug: "nova-commerce",
    title: "Nova Commerce",
    label: "E-commerce storefront concept",
    shortDescription:
      "Concept storefront for product discovery, collections, and checkout-oriented flows.",
    homepageDescription: "A concept storefront for discovery, collections, and checkout.",
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
      { variant: 1, alt: "Nova Commerce concept — storefront overview frame", layout: "full" },
      { variant: 2, alt: "Nova Commerce concept — product grid frame", layout: "default" },
      { variant: 3, alt: "Nova Commerce concept — detail panel frame", layout: "portrait" },
    ],
  },
  {
    id: "demo-orbit-dashboard",
    slug: "orbit-dashboard",
    title: "Orbit Dashboard",
    label: "SaaS dashboard concept",
    shortDescription: "Dashboard concept for activity, status, and operational views in one place.",
    homepageDescription: "A concept dashboard for activity, status, and operations.",
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
      { variant: 1, alt: "Orbit Dashboard concept — overview frame", layout: "full" },
      { variant: 2, alt: "Orbit Dashboard concept — metrics frame", layout: "default" },
      { variant: 3, alt: "Orbit Dashboard concept — activity list frame", layout: "wide" },
    ],
  },
  {
    id: "demo-atlas-mobile",
    slug: "atlas-mobile",
    title: "Atlas Mobile",
    label: "Mobile application concept",
    shortDescription:
      "Mobile-first concept with clear primary actions and thumb-friendly navigation.",
    homepageDescription: "A mobile concept for clear actions and thumb-friendly navigation.",
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
      { variant: 1, alt: "Atlas Mobile concept — home screen frame", layout: "portrait" },
      { variant: 2, alt: "Atlas Mobile concept — detail screen frame", layout: "default" },
      { variant: 3, alt: "Atlas Mobile concept — profile screen frame", layout: "portrait" },
    ],
  },
  {
    id: "demo-vertex-cms",
    slug: "vertex-cms",
    title: "Vertex CMS",
    label: "Content-driven website concept",
    shortDescription:
      "WordPress concept for structured pages, reusable sections, and editor-friendly layouts.",
    homepageDescription: "A content concept for structured pages and reusable sections.",
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
      { variant: 1, alt: "Vertex CMS concept — landing sections frame", layout: "full" },
      { variant: 2, alt: "Vertex CMS concept — article layout frame", layout: "wide" },
      { variant: 3, alt: "Vertex CMS concept — content blocks frame", layout: "default" },
    ],
  },
  {
    id: "demo-lumen-platform",
    slug: "lumen-platform",
    title: "Lumen Platform",
    label: "Custom software platform concept",
    shortDescription:
      "Custom software concept for multi-view workflows, settings, and connected screens.",
    homepageDescription: "A platform concept for workflows, settings, and connected views.",
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
      { variant: 1, alt: "Lumen Platform concept — workspace frame", layout: "full" },
      { variant: 2, alt: "Lumen Platform concept — modules frame", layout: "default" },
      { variant: 3, alt: "Lumen Platform concept — settings frame", layout: "default" },
    ],
  },
  {
    id: "demo-forge-store",
    slug: "forge-store",
    title: "Forge Store",
    label: "Shopify commerce concept",
    shortDescription:
      "Shopify concept for merchandising, collection pages, and storefront presentation.",
    homepageDescription:
      "A Shopify concept for merchandising, collections, and storefront presentation.",
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
      { variant: 1, alt: "Forge Store concept — storefront frame", layout: "full" },
      { variant: 2, alt: "Forge Store concept — collection frame", layout: "default" },
      { variant: 3, alt: "Forge Store concept — product frame", layout: "portrait" },
    ],
  },
];
