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
  /** Optional real screenshot path (preferred over CSS concept frame). */
  image?: string;
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
    id: "live-relay",
    slug: "relay",
    title: "Relay",
    label: "Interactive Workflow Website",
    shortDescription:
      "An interactive workflow product demo built around a live visual canvas and a focused product interface.",
    homepageDescription: "Workflow product website with a live 3D canvas.",
    overview:
      "Relay is a published product website. The homepage shows the handoff story, a branching canvas, and a direct link to the live deployment.",
    category: "software",
    services: ["Website Development", "Interactive Web"],
    technologies: ["React", "TypeScript", "CSS"],
    thumbnail: "/projects/relay.jpg",
    thumbnailAlt: "Relay interactive workflow demo preview",
    heroImage: "/projects/relay.jpg",
    gallery: [{ variant: 1, alt: "Relay interactive workflow demo preview", layout: "full" }],
    challenge:
      "The page has to explain a multi-step workflow without turning the first screen into a diagram legend.",
    solution:
      "A short headline, one visible canvas, and a live site link so the motion can be opened in the browser.",
    deliverables: ["Product homepage", "Workflow canvas", "Live site link"],
    outcome: "Published at the Relay deployment and linked from the portfolio.",
    projectUrl: "https://gallary1.vercel.app/",
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
    label: "Specialty Coffee Website",
    shortDescription:
      "An editorial coffee website concept built around product storytelling, motion, and a focused visual experience.",
    homepageDescription: "Coffee house site with a floating 3D cup.",
    overview:
      "Brewnns is a published coffee website. The first screen pairs the house line with a cup and bag, then continues into the menu.",
    category: "websites",
    services: ["Website Development"],
    technologies: ["React", "TypeScript", "CSS"],
    thumbnail: "/projects/brewnns.jpg",
    thumbnailAlt: "Brewnns coffee website preview",
    heroImage: "/projects/brewnns.jpg",
    gallery: [{ variant: 1, alt: "Brewnns coffee website preview", layout: "full" }],
    challenge: "The first screen needs the drink and the house name in one view.",
    solution:
      "Large type on the left and the cup and bag on the right, with the menu one step away.",
    deliverables: ["Homepage", "Menu path", "Live site link"],
    outcome: "Published at the Brewnns deployment and linked from the portfolio.",
    projectUrl: "https://gallary-secound.vercel.app/",
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
    label: "Trade Services Website",
    shortDescription:
      "A trade services website concept combining strong photography, clear messaging, and straightforward service presentation.",
    homepageDescription: "Roofing website built around a job-site photograph.",
    overview:
      "Ridgeline Roofing is a published services website. The homepage leads with the crew photograph and the inspection offer.",
    category: "websites",
    services: ["Website Development"],
    technologies: ["React", "TypeScript", "CSS"],
    thumbnail: "/projects/ridgeline.jpg",
    thumbnailAlt: "Ridgeline Roofing website preview",
    heroImage: "/projects/ridgeline.jpg",
    gallery: [{ variant: 1, alt: "Ridgeline Roofing website preview", layout: "full" }],
    challenge: "A trade homepage has to show the work, not a stock icon of a house.",
    solution:
      "The crew photograph carries the first screen, with services and the inspection path below it.",
    deliverables: ["Services homepage", "Inspection path", "Live site link"],
    outcome: "Published at the Ridgeline deployment and linked from the portfolio.",
    projectUrl: "https://gallary-3rd.vercel.app/",
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
    label: "Furniture Catalogue Website",
    shortDescription:
      "A furniture catalogue concept designed around product imagery, editorial layout, and clear browsing.",
    homepageDescription: "Furniture catalogue with floating product frames.",
    overview:
      "Halden is a published furniture website. The homepage sets the collection in large type and shows pieces as framed photographs.",
    category: "websites",
    services: ["Website Development"],
    technologies: ["React", "TypeScript", "CSS"],
    thumbnail: "/projects/halden.jpg",
    thumbnailAlt: "Halden furniture website preview",
    heroImage: "/projects/halden.jpg",
    gallery: [{ variant: 1, alt: "Halden furniture website preview", layout: "full" }],
    challenge:
      "A catalogue homepage has to introduce the house and the pieces without a dense grid.",
    solution: "Oversized type with a few framed photographs, then the in-stock list.",
    deliverables: ["Catalogue homepage", "Product frames", "Live site link"],
    outcome: "Published at the Halden deployment and linked from the portfolio.",
    projectUrl: "https://gallary-4th.vercel.app/",
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
    label: "Interactive Product Website",
    shortDescription:
      "A network-inspired product website featuring an interactive node field and a focused digital product presentation.",
    homepageDescription: "Network product site with a 3D node field.",
    overview:
      "Stemline is a published product website. The homepage states the relay path and shows the node field before the connect action.",
    category: "software",
    services: ["Website Development", "Interactive Web"],
    technologies: ["React", "TypeScript", "CSS"],
    thumbnail: "/projects/stemline.jpg",
    thumbnailAlt: "Stemline interactive network website preview",
    heroImage: "/projects/stemline.jpg",
    gallery: [{ variant: 1, alt: "Stemline interactive network website preview", layout: "full" }],
    challenge: "The first screen has to show a private path without a wall of protocol text.",
    solution: "One sentence, the node field, and a connect action that stays on the live site.",
    deliverables: ["Product homepage", "Node field", "Live site link"],
    outcome: "Published at the Stemline deployment and linked from the portfolio.",
    projectUrl: "https://gallary-5th.vercel.app/",
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
    published: false,
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
    published: false,
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
    published: false,
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
    published: false,
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
    published: false,
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
    published: false,
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
  {
    id: "live-megapersonals-automation",
    slug: "megapersonals-automation",
    title: "MegaPersonals Automation Panel",
    label: "Operations Dashboard Application",
    shortDescription:
      "A production-style operations dashboard for managing accounts, workflows, locations, and automation tools.",
    homepageDescription: "Production operations application for account and ad workflows.",
    overview:
      "MegaPersonals Automation Panel is a production operations application. The live product covers dashboard metrics, account tables, advertisement management, Gmail connections, location targeting, automation rules, reports, and workspace settings.",
    category: "software",
    services: ["Software Development", "Dashboard UI"],
    technologies: ["React", "TypeScript", "Vite"],
    thumbnail: "/projects/megapersonals.jpg",
    thumbnailAlt: "MegaPersonals Automation Panel dashboard application preview",
    heroImage: "/projects/megapersonals.jpg",
    projectType: "Software product",
    platform: "Web",
    status: "Live",
    featured: true,
    visualMotif: "dashboard",
    isDemo: false,
    published: true,
    projectUrl: "https://hrnordleads-sso.github.io/gallary6/",
    challenge:
      "An operations team needed one shell for account provisioning, ad posting, inbox sync, and city coverage without hopping between tools.",
    solution:
      "A full product UI with sidebar navigation, KPI cards, tables, maps, charts, and automation controls on a dedicated live deployment.",
    deliverables: [
      "Operations dashboard",
      "Accounts and advertisements modules",
      "Gmail and location targeting modules",
      "Automation, reports, and settings",
    ],
    outcome: "Published at the gallery deployment and linked from the portfolio.",
    gallery: [
      {
        variant: 1,
        alt: "MegaPersonals Automation Panel dashboard application preview",
        layout: "full",
      },
      { variant: 2, alt: "MegaPersonals accounts table and status badges", layout: "wide" },
      { variant: 3, alt: "MegaPersonals automation and activity widgets", layout: "default" },
    ],
  },
  {
    id: "live-diet-soda",
    slug: "diet-soda",
    title: "Diet Soda",
    label: "Interactive Beverage Website",
    shortDescription:
      "A full-screen product concept featuring a 3D can, motion-driven interactions, and playful visual transitions.",
    homepageDescription: "Interactive 3D beverage landing with flavor transitions.",
    overview:
      "Diet Soda is a published product landing page. A dark radial gradient fills the viewport while a Google model-viewer can tilts toward the cursor. Floating cherry and leaf models use parallax and pointer repulsion; translucent bubbles rise endlessly. Flavor cards choreograph a background morph, a 720° can spin with texture swap, and berry implode/explode transitions between Classic and Zero Lime.",
    category: "websites",
    services: ["Website Development", "Interactive Web"],
    technologies: ["HTML", "CSS", "JavaScript", "GSAP", "model-viewer"],
    thumbnail: "/projects/diet-soda.jpg",
    thumbnailAlt: "Diet Soda 3D beverage website preview",
    heroImage: "/projects/diet-soda.jpg",
    projectType: "Brand website",
    platform: "Web",
    status: "Live",
    featured: true,
    visualMotif: "commerce",
    isDemo: false,
    published: true,
    projectUrl: "https://hrnordleads-sso.github.io/gallary7/",
    challenge:
      "A beverage brand needed a no-scroll first impression that feels premium and interactive without a build step.",
    solution:
      "A single self-contained HTML page with GSAP choreography, model-viewer 3D assets, and pointer-driven motion for the can, berries, and leaves.",
    deliverables: [
      "Full-viewport hero landing",
      "Flavor carousel with texture swap",
      "3D can, berries, leaves, and bubble motion",
      "Live static deployment",
    ],
    outcome: "Published at the gallery deployment and linked from the portfolio.",
    gallery: [
      { variant: 1, alt: "Diet Soda 3D beverage website preview", layout: "full" },
      { variant: 2, alt: "Diet Soda flavor cards and side headline", layout: "wide" },
      { variant: 3, alt: "Diet Soda Zero Lime blue theme transition", layout: "default" },
    ],
  },
  {
    id: "live-neural-monitor",
    slug: "neural-monitor",
    title: "Neural Monitor",
    label: "Cinematic 3D Neural Experience",
    shortDescription:
      "A scroll-driven 3D experience built around a neural point cloud, depth, camera movement, and synchronized storytelling.",
    homepageDescription: "Immersive scroll-driven 3D neural field experience.",
    overview:
      "Neural Monitor is a published immersive website. A dark navy void holds a luminous point-cloud cerebrum while GSAP ScrollTrigger drives camera paths, scan sweeps, particle dispersal, and chaptered narrative across seven full-viewport stages.",
    category: "websites",
    services: ["Website Development", "Interactive Web"],
    technologies: ["Next.js", "TypeScript", "Three.js", "React Three Fiber", "GSAP"],
    thumbnail: "/projects/neural-monitor.jpg",
    thumbnailAlt:
      "Neural Monitor live Arrival preview with luminous cyan point-cloud brain and HUD",
    heroImage: "/projects/neural-monitor.jpg",
    projectType: "Brand website",
    platform: "Web",
    status: "Live",
    featured: true,
    visualMotif: "platform",
    isDemo: false,
    published: true,
    projectUrl: "https://hrnordleads-sso.github.io/gallary8/",
    challenge:
      "An AI/health narrative needed a premium, scroll-synchronized 3D specimen instead of a static hero illustration.",
    solution:
      "A Next.js experience with a procedural brain point cloud, starfield parallax, ScrollTrigger scrubbing, and HUD storytelling timed to camera and particle states.",
    deliverables: [
      "Seven-chapter scroll narrative",
      "3D brain point cloud with scan and scatter",
      "HUD metrics and responsive layout",
      "Static GitHub Pages deployment",
    ],
    outcome: "Published at the gallery deployment and linked from the portfolio.",
    gallery: [
      {
        variant: 1,
        alt: "Neural Monitor Arrival — live preview with glowing cerebrum",
        layout: "full",
        image: "/projects/neural-monitor.jpg",
      },
      {
        variant: 2,
        alt: "Neural Monitor cortical scan chapter from live preview",
        layout: "wide",
        image: "/projects/neural-monitor-2.jpg",
      },
      {
        variant: 3,
        alt: "Neural Monitor constellation release from live preview",
        layout: "default",
        image: "/projects/neural-monitor-3.jpg",
      },
    ],
  },
  {
    id: "live-ferro-room",
    slug: "ferro-room",
    title: "Ferro Room",
    label: "Collectible Plate Gallery Website",
    shortDescription:
      "An interactive gallery concept where objects sit behind glass with layered motion, depth, and visual detail.",
    homepageDescription: "Collectible plate gallery with drawn cases and a sleeve list.",
    overview:
      "Ferro Room is a published gallery website. The homepage keeps plates behind glass, walks intake through shelf steps, and shows a demo list of sleeve notes without storing or selling real cards.",
    category: "websites",
    services: ["Website Development", "Interactive Web"],
    technologies: ["React", "TypeScript", "CSS"],
    thumbnail: "/projects/ferro-room.jpg",
    thumbnailAlt: "Ferro Room gallery website preview",
    heroImage: "/projects/ferro-room.jpg",
    projectType: "Gallery website",
    platform: "Web",
    status: "Live",
    featured: true,
    visualMotif: "commerce",
    isDemo: false,
    published: true,
    projectUrl: "https://gallary-6th.vercel.app/",
    challenge:
      "A collectible gallery page has to show plates and process notes without claiming a real vault or sale.",
    solution:
      "Drawn cases, a four-step shelf path, and an open list so the demo stays visual and readable.",
    deliverables: ["Gallery homepage", "Shelf process steps", "Plate list", "Live site link"],
    outcome: "Published at the Ferro Room deployment and linked from the portfolio.",
    gallery: [
      { variant: 1, alt: "Ferro Room gallery website preview", layout: "full" },
      { variant: 2, alt: "Ferro Room shelf process and plate cards", layout: "wide" },
      { variant: 3, alt: "Ferro Room list notes and membership path", layout: "default" },
    ],
  },
  {
    id: "live-virell",
    slug: "virell",
    title: "Virell",
    label: "Interactive Brand Field Website",
    shortDescription:
      "An experimental brand experience where particles gather from a signal field into structured visual forms.",
    homepageDescription: "Brand field website from signal to structure.",
    overview:
      "Virell is a published brand website. The homepage moves from signal to structure, then shows identity, motion, systems, and signal marks in a single gravity field demo.",
    category: "websites",
    services: ["Website Development", "Interactive Web"],
    technologies: ["React", "TypeScript", "CSS"],
    thumbnail: "/projects/virell.jpg",
    thumbnailAlt: "Virell interactive particle website preview",
    heroImage: "/projects/virell.jpg",
    projectType: "Brand website",
    platform: "Web",
    status: "Live",
    featured: true,
    visualMotif: "platform",
    isDemo: false,
    published: true,
    projectUrl: "https://gallary-8th.vercel.app/",
    challenge:
      "A brand demo has to feel centered and heavy without turning into a long scroll of empty claims.",
    solution:
      "One clear headline, a gravity field visual, and short marks for identity, motion, systems, and signal.",
    deliverables: ["Brand homepage", "Field visual", "Capability marks", "Live site link"],
    outcome: "Published at the Virell deployment and linked from the portfolio.",
    gallery: [
      { variant: 1, alt: "Virell interactive particle website preview", layout: "full" },
      { variant: 2, alt: "Virell field visual and capability marks", layout: "wide" },
      { variant: 3, alt: "Virell enter-the-field closing section", layout: "default" },
    ],
  },
  {
    id: "live-voltara",
    slug: "voltara",
    title: "Voltara",
    label: "Motion Brand Website",
    shortDescription:
      "A cinematic brand website combining a sculptural 3D emblem, flowing ribbons, and controlled motion.",
    homepageDescription: "Motion brand website with sharp signal and fast motion.",
    overview:
      "Voltara is a published brand website. The homepage pairs a sharp signal with fast motion and presents Voltara as a clear mark so teams move with direction instead of noise.",
    category: "websites",
    services: ["Website Development", "Interactive Web"],
    technologies: ["React", "TypeScript", "CSS"],
    thumbnail: "/projects/voltara.jpg",
    thumbnailAlt: "Voltara motion brand website preview",
    heroImage: "/projects/voltara.jpg",
    projectType: "Brand website",
    platform: "Web",
    status: "Live",
    featured: true,
    visualMotif: "platform",
    isDemo: false,
    published: true,
    projectUrl: "https://gallary-9th.vercel.app/",
    challenge:
      "A motion brand page has to show direction quickly without filling the first screen with process jargon.",
    solution:
      "A short signal headline, a portrait visual, and a lead line that states the mark in plain language.",
    deliverables: ["Brand homepage", "Hero portrait", "Lead statement", "Live site link"],
    outcome: "Published at the Voltara deployment and linked from the portfolio.",
    gallery: [
      { variant: 1, alt: "Voltara motion brand website preview", layout: "full" },
      { variant: 2, alt: "Voltara portrait and lead designer mark", layout: "portrait" },
      { variant: 3, alt: "Voltara direction statement section", layout: "default" },
    ],
  },
];
