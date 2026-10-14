import type en from "../../i18n/locales/en";

export type ServiceId = (typeof en)["servicesPage"]["services"][number]["id"];

export type ServiceVisualType =
  "software" | "web" | "mobile" | "shopify" | "wordpress" | "custom-theme";

type DetailItem = {
  title: string;
  description: string;
};

type CapabilityDetail = {
  description: string;
  visualLabel: string;
};

export type HeroVisualState = {
  id: string;
  label: string;
  detail: string;
};

export type ServiceDetailContent = {
  eyebrow: string;
  metaDescription: string;
  visualConfig: {
    type: ServiceVisualType;
    processLabel: string;
    heroStates: readonly HeroVisualState[];
  };
  overviewTitle: string;
  capabilityDetails: readonly CapabilityDetail[];
  benefitsTitle: string;
  benefitsSubtitle: string;
  benefits: readonly DetailItem[];
  approachTitle: string;
  approachDescription: string;
  platforms?: {
    title: string;
    description: string;
    items: readonly string[];
  };
  faqs: readonly {
    q: string;
    a: string;
  }[];
  relatedServiceIds: readonly ServiceId[];
};

export const SERVICE_DETAIL_CONTENT: Readonly<Record<ServiceId, ServiceDetailContent>> = {
  "software-development": {
    eyebrow: "Software Development",
    metaDescription:
      "Custom software development for business applications, internal tools, workflows, integrations, and existing software modernization.",
    visualConfig: {
      type: "software",
      processLabel: "Requirements → system → delivery",
      heroStates: [
        { id: "input", label: "Input", detail: "Requirements" },
        { id: "logic", label: "Logic", detail: "Workflow rules" },
        { id: "data", label: "Data", detail: "Structured data" },
        { id: "interface", label: "Interface", detail: "User surface" },
        { id: "integrations", label: "Integrations", detail: "Connected systems" },
      ],
    },
    overviewTitle: "Software designed around how your business works",
    capabilityDetails: [
      {
        description:
          "Purpose-built interfaces support defined teams, roles, and operational tasks.",
        visualLabel: "Tool flow",
      },
      {
        description:
          "Browser-based applications make structured workflows available across devices.",
        visualLabel: "Application layer",
      },
      {
        description: "Repeated operational steps can be connected through clear automation rules.",
        visualLabel: "Automation path",
      },
      {
        description: "Approved APIs connect data and actions across the systems already in use.",
        visualLabel: "Integration map",
      },
      {
        description:
          "Application boundaries and data flows stay understandable as requirements evolve.",
        visualLabel: "System structure",
      },
      {
        description:
          "Focused changes improve existing software without forcing unnecessary replacement.",
        visualLabel: "Modernization",
      },
    ],
    benefitsTitle: "Built for practical business needs",
    benefitsSubtitle:
      "The solution is shaped around users, workflows, and existing systems—not a generic product checklist.",
    benefits: [
      {
        title: "Requirement-led scope",
        description: "Features and priorities stay tied to defined business and user requirements.",
      },
      {
        title: "Connected workflows",
        description:
          "Integrations can reduce repeated handoffs between the tools your team already uses.",
      },
      {
        title: "Maintainable structure",
        description:
          "Clear application structure supports future fixes, improvements, and handover.",
      },
      {
        title: "Modernization path",
        description:
          "Existing software can be improved in focused stages instead of replaced blindly.",
      },
    ],
    approachTitle: "From requirements to a reviewable application",
    approachDescription:
      "We clarify workflows and constraints, define a practical architecture, build in reviewable increments, and test the complete experience before launch or handover.",
    faqs: [
      {
        q: "Can you improve software we already use?",
        a: "Yes. We can assess an existing application and plan focused improvements, integrations, or modernization work around its current constraints.",
      },
      {
        q: "Can custom software connect to other systems?",
        a: "Yes, where those systems provide suitable integration options. We confirm API and data requirements during discovery.",
      },
      {
        q: "Do you build internal business tools?",
        a: "Yes. Internal applications, operational workflows, and administration interfaces are within this service.",
      },
    ],
    relatedServiceIds: ["website-development", "mobile-app-development"],
  },
  "website-development": {
    eyebrow: "Website Development",
    metaDescription:
      "Responsive website development for business, corporate, agency, and landing-page experiences with practical integrations.",
    visualConfig: {
      type: "web",
      processLabel: "Content → responsive build → launch",
      heroStates: [
        { id: "desktop", label: "Desktop", detail: "Full page layout" },
        { id: "mobile", label: "Mobile", detail: "Compact viewport" },
      ],
    },
    overviewTitle: "A professional website that is clear to use and maintain",
    capabilityDetails: [
      {
        description: "Clear business pages organize services, proof, and conversion paths.",
        visualLabel: "Page system",
      },
      {
        description: "Focused campaign pages connect concise messaging with a clear next action.",
        visualLabel: "Landing flow",
      },
      {
        description: "Layouts adapt deliberately across phone, tablet, laptop, and desktop widths.",
        visualLabel: "Responsive grid",
      },
      {
        description: "Forms and approved backend connections support practical customer journeys.",
        visualLabel: "Connected forms",
      },
      {
        description:
          "Existing pages can be restructured without discarding useful content or workflows.",
        visualLabel: "Modernization",
      },
      {
        description:
          "Implementation choices keep the front end understandable and performance-conscious.",
        visualLabel: "Delivery quality",
      },
    ],
    benefitsTitle: "A stronger foundation for your public web presence",
    benefitsSubtitle:
      "Delivery balances responsive presentation, usable content structure, practical integrations, and maintainable implementation.",
    benefits: [
      {
        title: "Responsive by default",
        description: "Layouts are planned for common phone, tablet, laptop, and desktop sizes.",
      },
      {
        title: "Clear content hierarchy",
        description:
          "Pages are structured so visitors can understand the offer and take the next step.",
      },
      {
        title: "Practical integrations",
        description:
          "Forms and backend connections are scoped around real operational requirements.",
      },
      {
        title: "Maintainable delivery",
        description:
          "Implementation choices consider updates and improvements after the initial launch.",
      },
    ],
    approachTitle: "A structured path from content to launch",
    approachDescription:
      "We align goals, page structure, approved design direction, responsive behavior, and integration needs before building and reviewing the website across devices.",
    platforms: {
      title: "Web implementation",
      description:
        "This Agency Website verifies React and TypeScript in the current web stack. Project technology is confirmed from the requirements rather than assumed in advance.",
      items: ["React", "TypeScript"],
    },
    faqs: [
      {
        q: "Can you rebuild an existing website?",
        a: "Yes. We can modernize an existing site while preserving useful content, workflows, and integrations.",
      },
      {
        q: "Do you build landing pages?",
        a: "Yes. Landing pages and focused marketing pages are included within website development.",
      },
      {
        q: "Can the website include contact or business forms?",
        a: "Yes. Form and contact-flow requirements are reviewed as part of planning and implementation.",
      },
    ],
    relatedServiceIds: ["wordpress-websites", "shopify-stores", "software-development"],
  },
  "mobile-app-development": {
    eyebrow: "Mobile App Development",
    metaDescription:
      "Mobile app development for business and customer-facing applications with authentication, APIs, and backend-connected features.",
    visualConfig: {
      type: "mobile",
      processLabel: "User flow → screens → release",
      heroStates: [
        { id: "primary", label: "Primary", detail: "Main product flow" },
        { id: "secondary", label: "Secondary", detail: "Supporting screen" },
        { id: "data", label: "Data", detail: "API connection" },
      ],
    },
    overviewTitle: "Mobile experiences connected to your product and operations",
    capabilityDetails: [
      {
        description: "Core mobile journeys prioritize the actions customers and teams use most.",
        visualLabel: "Primary journey",
      },
      {
        description: "Approved interface direction becomes clear, touch-friendly product screens.",
        visualLabel: "Screen system",
      },
      {
        description:
          "Sign-in, account state, and protected actions are planned as one coherent flow.",
        visualLabel: "Account flow",
      },
      {
        description: "Mobile actions connect to approved services and operational data.",
        visualLabel: "Data connection",
      },
      {
        description: "Suitable APIs provide the bridge between the app and existing systems.",
        visualLabel: "API path",
      },
      {
        description: "Reviewable releases make targeted improvement possible after launch.",
        visualLabel: "Release cycle",
      },
    ],
    benefitsTitle: "Focused mobile product delivery",
    benefitsSubtitle:
      "The experience is planned around mobile users, core workflows, backend requirements, and the information needed on smaller screens.",
    benefits: [
      {
        title: "Mobile-first workflows",
        description:
          "Core actions are prioritized for touch interaction and smaller-screen contexts.",
      },
      {
        title: "Backend connectivity",
        description:
          "Application flows can connect to approved APIs and existing business systems.",
      },
      {
        title: "Account experiences",
        description:
          "Authentication and user-state requirements are considered as part of the product flow.",
      },
      {
        title: "Iterative improvement",
        description:
          "The application can be reviewed and extended in focused stages after the first release.",
      },
    ],
    approachTitle: "Technology follows the product requirements",
    approachDescription:
      "We define users, devices, workflows, data, authentication, and backend needs before selecting an implementation approach. No mobile framework is assumed without project approval.",
    faqs: [
      {
        q: "Can the app connect to an existing backend?",
        a: "Yes, when the backend exposes suitable APIs. We review data, authentication, and integration requirements first.",
      },
      {
        q: "Can you improve an existing mobile application?",
        a: "Yes. Existing app improvements can cover user flows, interface implementation, integrations, and maintainability.",
      },
      {
        q: "Which mobile technology will you use?",
        a: "The technology is selected after requirements and constraints are understood. We do not prescribe an unverified stack on this page.",
      },
    ],
    relatedServiceIds: ["software-development", "website-development"],
  },
  "shopify-stores": {
    eyebrow: "Shopify Stores",
    metaDescription:
      "Shopify store setup, storefront development, theme customization, catalog configuration, app integrations, and store improvements.",
    visualConfig: {
      type: "shopify",
      processLabel: "Catalog → storefront → launch",
      heroStates: [
        { id: "collections", label: "Collections", detail: "Browse structure" },
        { id: "featured", label: "Featured", detail: "Selected product" },
        { id: "catalog", label: "Catalog", detail: "Product grid" },
        { id: "cart", label: "Cart", detail: "Cart state" },
      ],
    },
    overviewTitle: "A Shopify storefront structured for your products and customers",
    capabilityDetails: [
      {
        description:
          "Store settings and operational basics are configured around agreed requirements.",
        visualLabel: "Store setup",
      },
      {
        description: "Theme presentation is adapted to the approved storefront direction.",
        visualLabel: "Theme layer",
      },
      {
        description: "Products and collections form a catalog customers can navigate clearly.",
        visualLabel: "Catalog journey",
      },
      {
        description: "Commerce layouts remain usable from compact phones through desktop screens.",
        visualLabel: "Responsive shop",
      },
      {
        description:
          "Required apps are connected only after their role and constraints are confirmed.",
        visualLabel: "App connection",
      },
      {
        description:
          "Focused refinements improve an existing store without unnecessary rebuild work.",
        visualLabel: "Store refinement",
      },
    ],
    benefitsTitle: "Practical commerce delivery on Shopify",
    benefitsSubtitle:
      "Store setup, presentation, catalog structure, and integrations are aligned to the way your team operates the storefront.",
    benefits: [
      {
        title: "Clear storefront journeys",
        description:
          "Navigation and page structure help customers move through products and content.",
      },
      {
        title: "Responsive presentation",
        description: "Storefront layouts are implemented for common mobile and desktop sizes.",
      },
      {
        title: "Usable catalog structure",
        description: "Products and collections are organized around agreed catalog requirements.",
      },
      {
        title: "Focused improvements",
        description:
          "Existing stores can be refined without inventing unnecessary replacement work.",
      },
    ],
    approachTitle: "Store requirements before theme decisions",
    approachDescription:
      "We review products, collections, content, customer journeys, approved theme direction, and required app connections before configuring and testing the storefront.",
    platforms: {
      title: "Verified commerce platform",
      description:
        "Shopify is a confirmed agency service. Theme and app choices are selected from the store requirements.",
      items: ["Shopify"],
    },
    faqs: [
      {
        q: "Can you set up a new Shopify store?",
        a: "Yes. Store setup, catalog structure, storefront configuration, and responsive presentation are included.",
      },
      {
        q: "Can you customize an existing Shopify theme?",
        a: "Yes. We can adapt theme presentation and layouts to agreed design and content requirements.",
      },
      {
        q: "Can you improve an existing Shopify store?",
        a: "Yes. We can focus on storefront layouts, catalog structure, app integrations, and maintainable refinements.",
      },
    ],
    relatedServiceIds: ["website-development", "wordpress-websites"],
  },
  "wordpress-websites": {
    eyebrow: "WordPress Websites",
    metaDescription:
      "Complete WordPress website development with responsive pages, editable content, templates, plugin integrations, and existing-site improvements.",
    visualConfig: {
      type: "wordpress",
      processLabel: "Content → templates → publish",
      heroStates: [
        { id: "content", label: "Content", detail: "Page structure" },
        { id: "blocks", label: "Blocks", detail: "Reusable sections" },
        { id: "media", label: "Media", detail: "Content assets" },
        { id: "publish", label: "Publish", detail: "Ready state" },
      ],
    },
    overviewTitle: "Complete WordPress website delivery for content-led teams",
    capabilityDetails: [
      {
        description:
          "Complete WordPress delivery connects site structure, content, and publishing needs.",
        visualLabel: "Site system",
      },
      {
        description: "Pages are built to work clearly across common device sizes.",
        visualLabel: "Responsive pages",
      },
      {
        description: "Content structures reflect what editors need to maintain day to day.",
        visualLabel: "Editor flow",
      },
      {
        description: "Reusable page and template patterns keep publishing consistent.",
        visualLabel: "Template system",
      },
      {
        description: "Required plugins are selected and configured from verified project needs.",
        visualLabel: "Plugin path",
      },
      {
        description:
          "Existing sites can receive focused structural, template, and integration updates.",
        visualLabel: "Site refinement",
      },
    ],
    benefitsTitle: "A website your team can work with",
    benefitsSubtitle:
      "Complete site delivery covering structure, editable content, integrations, and responsive layouts.",
    benefits: [
      {
        title: "Editable content",
        description:
          "Approved sections are structured so content teams can manage routine updates.",
      },
      {
        title: "Reusable page structure",
        description: "Reusable templates keep pages consistent and routine updates practical.",
      },
      {
        title: "Responsive website delivery",
        description: "Pages are implemented for common mobile, tablet, and desktop layouts.",
      },
      {
        title: "Existing-site improvements",
        description: "Existing sites can be refined through focused template and integration work.",
      },
    ],
    approachTitle: "Plan the complete website, then configure the CMS",
    approachDescription:
      "We define structure, templates, editable sections, plugins, and design direction before implementation.",
    platforms: {
      title: "Verified content platform",
      description:
        "WordPress is a confirmed service; plugins and implementation choices follow project requirements.",
      items: ["WordPress"],
    },
    faqs: [
      {
        q: "Will the website have editable sections?",
        a: "Yes. Editable areas are planned around what your team needs to maintain.",
      },
      {
        q: "Can you improve an existing WordPress website?",
        a: "Yes. We can refine pages, templates, responsive behavior, plugins, and content structure.",
      },
      {
        q: "How is this different from custom theme development?",
        a: "WordPress Website Development covers the complete site; Custom Theme Development focuses on its presentation layer.",
      },
    ],
    relatedServiceIds: ["custom-wordpress-theme-development", "website-development"],
  },
  "custom-wordpress-theme-development": {
    eyebrow: "Custom WordPress Theme Development",
    metaDescription:
      "Custom WordPress themes with design implementation, reusable templates, responsive layouts, editable sections, and maintainable theme structure.",
    visualConfig: {
      type: "custom-theme",
      processLabel: "Components → templates → theme",
      heroStates: [
        { id: "header", label: "Header", detail: "Global component" },
        { id: "hero", label: "Hero", detail: "Feature region" },
        { id: "navigation", label: "Navigation", detail: "Wayfinding" },
        { id: "content", label: "Content", detail: "CMS-editable region" },
        { id: "cta", label: "CTA", detail: "Action component" },
        { id: "footer", label: "Footer", detail: "Global component" },
      ],
    },
    overviewTitle: "A WordPress theme built around specific design requirements",
    capabilityDetails: [
      {
        description:
          "A bespoke presentation layer follows approved design and content requirements.",
        visualLabel: "Theme system",
      },
      {
        description: "Approved screens are translated into responsive WordPress components.",
        visualLabel: "Design mapping",
      },
      {
        description: "Shared templates and partials keep repeated page structures consistent.",
        visualLabel: "Component set",
      },
      {
        description: "Layout rules adapt deliberately across phone, tablet, and desktop widths.",
        visualLabel: "Responsive grid",
      },
      {
        description: "Editable regions expose only the content controls marketing teams require.",
        visualLabel: "Editable regions",
      },
      {
        description: "Existing theme code can be reorganized through focused, reviewable changes.",
        visualLabel: "Theme refinement",
      },
    ],
    benefitsTitle: "A focused presentation layer for WordPress",
    benefitsSubtitle:
      "Theme work translates approved design and content requirements into reusable, responsive, and maintainable WordPress presentation.",
    benefits: [
      {
        title: "Design-specific implementation",
        description:
          "Layouts follow approved visual requirements rather than a generic theme preset.",
      },
      {
        title: "Reusable templates",
        description: "Shared layouts and components support consistent publishing across the site.",
      },
      {
        title: "CMS-editable sections",
        description: "Content controls are planned around what editors need to update safely.",
      },
      {
        title: "Maintainable theme structure",
        description: "Theme code is organized for practical updates and future refinement.",
      },
    ],
    approachTitle: "Translate design into a reusable WordPress system",
    approachDescription:
      "We review the design system, page templates, responsive states, content controls, and existing WordPress setup before implementing and testing the theme.",
    platforms: {
      title: "Verified theme platform",
      description:
        "This service is specifically for WordPress theme implementation and customization.",
      items: ["WordPress"],
    },
    faqs: [
      {
        q: "Can you implement an existing design in WordPress?",
        a: "Yes. Design-to-WordPress implementation is a core part of this service when approved designs and responsive requirements are available.",
      },
      {
        q: "Can the theme include reusable templates?",
        a: "Yes. Reusable templates and editable sections are planned from the site's content requirements.",
      },
      {
        q: "Is this the same as a complete WordPress website?",
        a: "No. This service focuses on the theme and presentation layer. Complete WordPress Website Development also covers broader site structure, setup, pages, and integrations.",
      },
    ],
    relatedServiceIds: ["wordpress-websites", "website-development"],
  },
};

export const SERVICE_IDS = Object.keys(SERVICE_DETAIL_CONTENT) as ServiceId[];

export function isServiceId(value: string): value is ServiceId {
  return Object.prototype.hasOwnProperty.call(SERVICE_DETAIL_CONTENT, value);
}
