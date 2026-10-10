import { resolveSiteOrigin } from "./site-origin.mjs";

/** @typedef {{ heading: string; body?: string; bullets?: string[] }} LandingSection */

/** @typedef {{
 *   slug: string;
 *   title: string;
 *   metaDescription: string;
 *   h1: string;
 *   intro: string;
 *   sections: LandingSection[];
 *   cta: string;
 *   relatedSlugs?: string[];
 * }} LandingPage */

/** @type {LandingPage[]} */
export const landingPages = [
  {
    slug: "b2b-lead-generation",
    title: "B2B Lead Generation Services | ADealForge",
    metaDescription:
      "Scale qualified B2B lead generation with AI-powered outbound. ADealForge delivers verified contacts, personalized sequences, and pipeline-ready meetings.",
    h1: "B2B Lead Generation That Fills Your Pipeline",
    intro:
      "Stop chasing cold lists. ADealForge combines agentic AI with human-quality outreach to identify ideal buyers, enrich decision-makers, and book meetings that convert.",
    sections: [
      {
        heading: "Why outbound still wins for B2B",
        body: "Inbound alone rarely hits aggressive growth targets. Structured outbound reaches accounts before competitors and creates predictable pipeline when ICP, messaging, and follow-up are aligned.",
      },
      {
        heading: "How ADealForge generates leads",
        body: "Our platform orchestrates research, list building, multi-channel sequences, and reply handling—so your team focuses on closing, not manual prospecting.",
      },
      {
        heading: "What you get",
        bullets: [
          "ICP-aligned prospect lists with verified emails",
          "Personalized copy at scale without generic templates",
          "CRM-ready activity and meeting handoff",
          "Compliance-aware sending and domain health monitoring",
        ],
      },
    ],
    cta: "Request a pilot",
    relatedSlugs: ["managed-outbound-services", "ai-lead-generation", "b2b-appointment-setting"],
  },
  {
    slug: "outbound-sales-automation",
    title: "Outbound Sales Automation Platform | ADealForge",
    metaDescription:
      "Automate outbound sales without losing quality. ADealForge runs research, sequencing, and follow-ups with AI agents built for B2B teams.",
    h1: "Outbound Sales Automation for Modern B2B Teams",
    intro:
      "Manual outbound does not scale. ADealForge automates prospect research, first touch, follow-ups, and routing while keeping every message relevant to the buyer.",
    sections: [
      {
        heading: "Automation that preserves context",
        body: "Generic automation burns domains and replies. Our agents use account-level research so each touch references real triggers—funding, hiring, product launches, or tech stack changes.",
      },
      {
        heading: "Built for revenue operations",
        bullets: [
          "Workflow orchestration across email and LinkedIn",
          "Reply classification and handoff to AEs",
          "Deliverability monitoring and send pacing",
          "Reporting tied to meetings booked, not vanity sends",
        ],
      },
    ],
    cta: "See the platform",
    relatedSlugs: [
      "b2b-prospecting-software",
      "cold-email-outreach-service",
      "sales-pipeline-generation",
    ],
  },
  {
    slug: "cold-email-outreach-service",
    title: "Cold Email Outreach Service for B2B | ADealForge",
    metaDescription:
      "Managed cold email outreach for B2B teams. ICP targeting, copy personalization, deliverability, and meeting booking—handled end to end by ADealForge.",
    h1: "Cold Email Outreach That Sounds Human at Scale",
    intro:
      "Most cold email fails because it is either too generic or too risky for your domain. ADealForge runs managed programs with research-backed personalization and strict deliverability controls.",
    sections: [
      {
        heading: "Deliverability-first execution",
        body: "We warm domains, rotate inboxes responsibly, and monitor bounce and spam signals so your brand domain stays healthy while volume scales.",
      },
      {
        heading: "Personalization beyond {{first_name}}",
        body: "Every sequence is grounded in account research—role, company motion, and timing—so prospects feel understood, not spammed.",
      },
      {
        heading: "Program outcomes",
        bullets: [
          "Qualified replies routed to your calendar",
          "Weekly pipeline and activity reporting",
          "Continuous A/B testing on hooks and CTAs",
          "Clear opt-out and compliance handling",
        ],
      },
    ],
    cta: "Start outbound",
    relatedSlugs: ["managed-outbound-services", "b2b-lead-generation", "b2b-appointment-setting"],
  },
  {
    slug: "b2b-prospecting-software",
    title: "B2B Prospecting Software | ADealForge",
    metaDescription:
      "AI-powered B2B prospecting software for account research, contact enrichment, and multi-step outreach. Built for teams that need pipeline, not busywork.",
    h1: "B2B Prospecting Software Your Reps Will Actually Use",
    intro:
      "Prospecting tools should reduce work, not add tabs. ADealForge unifies ICP filters, enrichment, sequencing, and reply management in one agentic workflow.",
    sections: [
      {
        heading: "From list to meeting in one flow",
        body: "Define your ICP once. Agents find lookalike accounts, verify contacts, draft tailored outreach, and escalate interested replies—without exporting CSVs between five tools.",
      },
      {
        heading: "Designed for B2B buying committees",
        bullets: [
          "Multi-threading across roles and departments",
          "Account-level context shared across sequences",
          "Integration-friendly export to your CRM",
          "Transparent audit trail for every touch",
        ],
      },
    ],
    cta: "Request a demo",
    relatedSlugs: ["outbound-sales-automation", "ai-lead-generation", "sales-pipeline-generation"],
  },
  {
    slug: "managed-outbound-services",
    title: "Managed Outbound Services for B2B | ADealForge",
    metaDescription:
      "Fully managed B2B outbound: strategy, lists, copy, sending, and meeting booking. ADealForge acts as your outbound team without the headcount.",
    h1: "Managed Outbound Services Without Hiring an SDR Team",
    intro:
      "Building an internal outbound motion takes months. ADealForge delivers a managed program—ICP workshop, messaging, execution, and reporting—from week one.",
    sections: [
      {
        heading: "What we manage",
        bullets: [
          "ICP definition and TAM mapping",
          "List building and data verification",
          "Sequence writing and iteration",
          "Inbox management and meeting scheduling",
        ],
      },
      {
        heading: "Who it is for",
        body: "Founders and revenue leaders who need qualified meetings now but cannot afford a full SDR bench, tooling stack, and deliverability ops on day one.",
      },
    ],
    cta: "Talk to sales",
    relatedSlugs: ["b2b-lead-generation", "cold-email-outreach-service", "b2b-appointment-setting"],
  },
  {
    slug: "ai-lead-generation",
    title: "AI Lead Generation for B2B Sales | ADealForge",
    metaDescription:
      "Use AI lead generation to research accounts, personalize outreach, and book B2B meetings. ADealForge combines agents with managed execution.",
    h1: "AI Lead Generation That Protects Your Brand",
    intro:
      "AI can accelerate prospecting—or destroy trust with obvious automation. ADealForge uses agentic workflows with human review gates so speed never sacrifices quality.",
    sections: [
      {
        heading: "Agents handle the heavy lifting",
        body: "Research agents gather firmographic and trigger data. Writing agents draft variants per persona. Ops agents pace sends and surface replies that need a human.",
      },
      {
        heading: "You stay in control",
        bullets: [
          "Approve ICP and messaging before launch",
          "Set guardrails on tone and claims",
          "Review samples and live replies",
          "Measure ROI on meetings and pipeline",
        ],
      },
    ],
    cta: "Explore AI outbound",
    relatedSlugs: [
      "b2b-prospecting-software",
      "outbound-sales-automation",
      "sales-pipeline-generation",
    ],
  },
  {
    slug: "sales-pipeline-generation",
    title: "B2B Sales Pipeline Generation | ADealForge",
    metaDescription:
      "Generate predictable B2B sales pipeline with managed outbound. ADealForge targets ideal accounts and converts interest into qualified opportunities.",
    h1: "Sales Pipeline Generation You Can Forecast",
    intro:
      "Pipeline anxiety comes from inconsistent top-of-funnel. ADealForge runs repeatable outbound programs with clear metrics: sends, replies, meetings, and opportunities created.",
    sections: [
      {
        heading: "Pipeline math that leadership trusts",
        body: "We report on leading indicators (reply rate, positive sentiment) and lagging outcomes (meetings held, SQLs). No vanity metrics—just signals tied to revenue.",
      },
      {
        heading: "Compounding improvements",
        bullets: [
          "Message testing by segment and persona",
          "List quality feedback loops",
          "Seasonal and trigger-based plays",
          "Playbooks reused across territories",
        ],
      },
    ],
    cta: "Build pipeline",
    relatedSlugs: ["b2b-lead-generation", "managed-outbound-services", "b2b-appointment-setting"],
  },
  {
    slug: "b2b-appointment-setting",
    title: "B2B Appointment Setting Service | ADealForge",
    metaDescription:
      "B2B appointment setting with personalized outreach and inbox management. ADealForge books qualified meetings with decision-makers in your ICP.",
    h1: "B2B Appointment Setting for Decision-Makers",
    intro:
      "Calendar fills when outreach reaches the right person with the right reason to meet. ADealForge specializes in booking conversations—not just clicks or form fills.",
    sections: [
      {
        heading: "Quality over quantity",
        body: "We optimize for held meetings with qualified buyers, not raw booking rates from unqualified leads that waste AE time.",
      },
      {
        heading: "End-to-end booking workflow",
        bullets: [
          "Prospect research and multi-touch sequences",
          "Reply handling and objection routing",
          "Calendar coordination across time zones",
          "CRM logging and handoff notes for AEs",
        ],
      },
    ],
    cta: "Book more meetings",
    relatedSlugs: [
      "cold-email-outreach-service",
      "managed-outbound-services",
      "sales-pipeline-generation",
    ],
  },
];

/**
 * Public site origin for release/smoke tooling.
 * Null when leadership-approved domain is TBC — never defaults to adealforge.com.
 * Set SITE_ORIGIN, PUBLIC_SITE_ORIGIN, or VITE_STUDIO_DOMAIN at build/deploy time.
 */
export const SITE_ORIGIN = resolveSiteOrigin();
export const CONTACT_PATH = "/contact";
export const HOME_PATH = "/";
export const TERMS_PATH = "/terms";
/** Product landings are retired from the indexable agency surface (F9/F11). */
export const INDEXABLE_LANDING_PAGES = [];
