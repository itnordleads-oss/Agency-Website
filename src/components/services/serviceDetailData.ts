import type en from "../../i18n/locales/en";

export type ServiceId = (typeof en)["servicesPage"]["services"][number]["id"];

type DetailItem = {
  title: string;
  description: string;
};

export type ServiceDetailContent = {
  eyebrow: string;
  metaDescription: string;
  overviewTitle: string;
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
    overviewTitle: "Software designed around how your business works",
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
    overviewTitle: "A professional website that is clear to use and maintain",
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
    overviewTitle: "Mobile experiences connected to your product and operations",
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
    overviewTitle: "A Shopify storefront structured for your products and customers",
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
    overviewTitle: "Complete WordPress website delivery for content-led teams",
    benefitsTitle: "A website your team can work with",
    benefitsSubtitle:
      "This service covers the broader website—structure, pages, content editing, integrations, and responsive delivery.",
    benefits: [
      {
        title: "Editable content",
        description:
          "Approved sections are structured so content teams can manage routine updates.",
      },
      {
        title: "Reusable page structure",
        description:
          "Templates support consistent pages without making every update a development task.",
      },
      {
        title: "Responsive website delivery",
        description: "Pages are implemented for common mobile, tablet, and desktop layouts.",
      },
      {
        title: "Existing-site improvements",
        description:
          "Current WordPress sites can be refined through focused template and integration work.",
      },
    ],
    approachTitle: "Plan the complete website, then configure the CMS",
    approachDescription:
      "We define information architecture, templates, editable sections, plugin needs, and approved design direction before implementation and content review.",
    platforms: {
      title: "Verified content platform",
      description:
        "WordPress is a confirmed agency service. Plugins and implementation choices are reviewed against the project requirements.",
      items: ["WordPress"],
    },
    faqs: [
      {
        q: "Will the website have editable sections?",
        a: "Yes. Editable content areas are defined during planning based on what your team needs to maintain.",
      },
      {
        q: "Can you improve an existing WordPress website?",
        a: "Yes. We can refine pages, templates, responsive behavior, plugins, and content structure.",
      },
      {
        q: "How is this different from custom theme development?",
        a: "WordPress Website Development covers complete site delivery. Custom Theme Development focuses specifically on the presentation and theme layer.",
      },
    ],
    relatedServiceIds: ["custom-wordpress-theme-development", "website-development"],
  },
  "custom-wordpress-theme-development": {
    eyebrow: "Custom WordPress Theme Development",
    metaDescription:
      "Custom WordPress themes with design implementation, reusable templates, responsive layouts, editable sections, and maintainable theme structure.",
    overviewTitle: "A WordPress theme built around specific design requirements",
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
