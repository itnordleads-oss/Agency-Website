/**
 * Source marketing copy for locale generation.
 * Content is synced into `src/i18n/locales` via `scripts/build-locales.mjs`.
 * Keep this file as the generation source of truth.
 */
export const marketingCopy = {
  seo: {
    title: "ADealForge | Managed B2B Outbound Services for Qualified Pipeline Growth",
    description:
      "ADealForge runs managed B2B outbound programs that combine ICP targeting, account research, and personalized email outreach to help sales teams generate qualified pipeline.",
    organizationDescription:
      "ADealForge is a managed B2B outbound partner that helps revenue teams target ideal accounts, launch personalized outreach, and book more qualified sales meetings.",
    websiteDescription: "Managed B2B outbound prospecting and personalized email outreach service.",
  },

  hero: {
    eyebrow: "Managed B2B outbound lead generation",
    headlineLead: "Build a predictable pipeline of qualified B2B opportunities",
    headlineAccent: "without building an in-house SDR operation",
    subheadline:
      "We identify right-fit accounts, research every company, and execute personalized first-touch outreach so your team can focus on meetings, demos, and closed revenue.",
    primaryCta: "Book a Pilot Strategy Call",
    secondaryCta: "See the Delivery Process",
    processLine: ["Finding prospects", "Research", "Review", "Personalization", "Outreach"],
    pills: [
      "Built for founders and revenue leaders",
      "Works across B2B industries",
      "Fully managed by our team",
    ],
    proofLine: "Proven in outbound programs scaled to up to 100,000 companies.",
  },

  platformStrip: {
    kicker: "Managed outbound",
    title: "Full outbound execution, managed by specialists.",
    subtitle:
      "We build qualified account lists, research each account, and deliver personalized first-touch campaigns that convert.",
    values: [
      {
        title: "ICP-aligned account lists",
        desc: "Built around your ideal customer profile, market priorities, and offer instead of generic exports.",
        stage: "discovery",
      },
      {
        title: "Research-driven personalization",
        desc: "Each first-touch email reflects real account context and is ready for review or launch.",
        stage: "personalization",
      },
      {
        title: "End-to-end campaign delivery",
        desc: "From account discovery to sending infrastructure, we handle execution while your team focuses on sales conversations.",
        stage: "outreach",
      },
    ],
    cta: "Book a Pilot Strategy Call",
    footnote: "Proven at outbound scale up to 100,000 companies",
  },

  capabilities: {
    eyebrow: { label: "Capabilities", tag: "Prospecting workflow" },
    title: "Everything needed to run high-performing B2B outbound.",
    subtitle:
      "From ICP targeting to inbox delivery, we run the operational work required to produce qualified sales conversations.",
    pills: ["Done-for-you execution", "Cross-industry B2B coverage", "Scaled to 100,000 companies"],
    chips: ["Finding", "Research", "Review", "Messaging", "Sending", "Handoff"],
    primaryCta: "Book a Pilot Strategy Call",
    secondaryCta: "View Delivery Steps",
    items: [
      {
        title: "ICP-focused prospect discovery",
        desc: "We identify companies that match your target market, geography, buying signals, and ideal customer profile.",
      },
      {
        title: "Account-level intelligence",
        desc: "Every account is enriched with business context, market relevance, and fit rationale tied to your offer.",
      },
      {
        title: "Decision-maker data validation",
        desc: "We separate reliable contact routes from uncertain records before any campaign is activated.",
      },
      {
        title: "Personalized outbound messaging",
        desc: "First-touch emails are tailored to each account using your positioning, offer narrative, and tone.",
      },
      {
        title: "Managed sending and deliverability",
        desc: "We send from your domains or provision warmed inboxes, with deliverability monitoring and controls managed for you.",
      },
    ],
  },

  proofBand: [
    {
      stat: "Up to 100,000",
      label: "companies reached in a single managed outbound program",
    },
    {
      stat: "End-to-end",
      label: "delivery from account research to inbox-ready execution",
    },
    {
      stat: "Your voice, your offer",
      label: "outreach messaging aligned with your sales narrative",
    },
    {
      stat: "Your domains or ours",
      label: "sending infrastructure configured for steady inbox placement",
    },
  ],

  workflow: {
    eyebrow: "Inside your campaign",
    title: "See what your sales team receives at every outbound stage",
    subtitle:
      "Follow one target account from initial qualification to send-ready outreach and see what your team gets at each stage.",
    consoleTitle: "Deal Intelligence Console",
    workspaceName: "ADealForge Workspace",
    workspaceNote: "Managed by our team",
    cta: "Book a Pilot Strategy Call",
    sampleAccountLabel: "Sample account",
    sampleAccountIntro:
      "Watch one account progress from initial match to send-ready as the workflow advances.",
    detailLabel: "Campaign Workspace Detail",
    deliverablesTitle: "What your team gets here",
    outcomeTitle: "What this means for you",
    exportNote: "Delivered as a CRM-ready export",
    exportCta: "Get this workflow for your market ->",
    stages: [
      {
        id: "discovery" as const,
        navLabel: "Discovery",
        accentLabel: "Discovery",
        panelTitle: "Start with companies that genuinely match your ICP.",
        panelDescription:
          "We convert your target brief into a focused shortlist so your team never works from random or outdated account lists.",
        deliverables: [
          "Shortlist matched to your ideal customer",
          "Market, location, and size filters applied",
          "Accounts ranked by fit",
        ],
        stageOutcome:
          "You start with qualified companies instead of thousands of low-fit accounts.",
        angle: "Ranked by sector, size, and commercial fit — best matches first.",
      },
      {
        id: "enrichment" as const,
        navLabel: "Enrichment",
        accentLabel: "Enrichment",
        panelTitle: "Understand why each account is worth contacting.",
        panelDescription:
          "We research what each company does, where they operate, and why they are likely to need what you sell.",
        deliverables: [
          "Clear company summary",
          "Service and market context",
          "Profiles ready to segment",
        ],
        stageOutcome: "Your team understands account relevance before writing a single email.",
        angle: "Profiled by activity, focus, and regional relevance.",
      },
      {
        id: "contacts" as const,
        navLabel: "Contacts",
        accentLabel: "Contact review",
        panelTitle: "Reach the right contacts, not dead ends.",
        panelDescription:
          "We verify contact paths and remove weak records so your campaign budget is not lost to bounces.",
        deliverables: [
          "Reachable decision-maker contacts",
          "Confidence check on each record",
          "Cleaner list before outreach",
        ],
        stageOutcome: "You reduce bounce risk and protect sender reputation before launch.",
        angle: "Verified routes to the right people, ready for review.",
      },
      {
        id: "review" as const,
        navLabel: "Review",
        accentLabel: "Quality review",
        panelTitle: "Launch with a list your team can trust.",
        panelDescription:
          "Every account is checked for relevance, completeness, and deduplication before outreach begins.",
        deliverables: [
          "Reviewed and approved accounts",
          "Duplicates and weak fits removed",
          "Campaign-ready entries",
        ],
        stageOutcome: "You move forward with fewer wasted sends and no overlapping outreach.",
        angle: "Approved accounts only — relevant, complete, and deduplicated.",
      },
      {
        id: "personalization" as const,
        navLabel: "Personalization",
        accentLabel: "Personalization",
        panelTitle: "Send emails that feel written for each individual account.",
        panelDescription:
          "We prepare a first-touch angle for every account using real research, not generic mail-merge templates.",
        deliverables: [
          "Tailored opening angle per account",
          "First email draft based on context",
          "Stronger message-to-fit alignment",
        ],
        stageOutcome:
          "You give prospects a compelling reason to reply instead of ignoring another template.",
        angle:
          "Noticed your recent regional expansion projects. We help similar teams scale delivery without increasing headcount.",
      },
      {
        id: "outreach" as const,
        navLabel: "Outreach",
        accentLabel: "Outreach-ready",
        panelTitle: "We launch outreach or hand over a fully prepared campaign.",
        panelDescription:
          "Qualified accounts are ready to launch. We manage sending and deliverability, or export everything to your team for execution.",
        deliverables: [
          "Personalized first-touch emails",
          "Sending from your or new domains",
          "Warmed inboxes and CRM-ready export",
        ],
        stageOutcome: "You get more booked conversations, not another spreadsheet to manage.",
        angle: "Outreach managed end to end through reliable, warmed inbox infrastructure.",
      },
    ],
    recordFields: [
      { label: "Sector & company size", detail: "Construction · 80–120 staff" },
      { label: "Business activity", detail: "Commercial fit-outs, regional projects" },
      { label: "Contact route", detail: "Verified decision-maker email" },
      { label: "Quality review", detail: "Approved · no duplicates" },
      { label: "Outreach angle", detail: "Tailored to current projects" },
      { label: "Send-ready", detail: "Queued for first-touch email" },
    ],
  },

  sectors: {
    eyebrow: { label: "Use Cases", tag: "Adaptable workflow" },
    title: "Built for the way modern B2B teams sell and scale.",
    subtitle:
      "Whether you focus on one niche or multiple verticals, we help you reach the right companies with outreach aligned to buying behavior.",
    ctaLink: "Plan outbound strategy for this sector",
    items: [
      {
        title: "Construction & Subcontracting",
        pill: "Core sector",
        highlight: true,
        desc: "Reach contractors, subcontractors, and project-based firms with outreach aligned to how they win commercial work.",
        bestWhen: "Best when you sell project-based B2B services.",
      },
      {
        title: "Logistics & Warehousing",
        pill: "High-volume market",
        highlight: false,
        desc: "Find transport operators, warehouses, and fulfillment providers with account context your team can act on quickly.",
        bestWhen: "Best when location and capacity matter.",
      },
      {
        title: "Staffing & Recruitment",
        pill: "Demand-driven",
        highlight: false,
        desc: "Identify companies that need workforce capacity, subcontracted teams, or recruitment support.",
        bestWhen: "Best when timing and hiring pressure drive deals.",
      },
      {
        title: "Manufacturing & Industrial Services",
        pill: "Industrial focus",
        highlight: false,
        desc: "Build qualified pipelines across production, maintenance, and supplier networks with relevant outreach angles.",
        bestWhen: "Best when specialization shapes qualification.",
      },
      {
        title: "Facility Services & Cleaning",
        pill: "Service market",
        highlight: false,
        desc: "Target property managers, facility operators, and service buyers with clean, review-ready prospect intelligence.",
        bestWhen: "Best when recurring contracts are the core offer.",
      },
      {
        title: "Professional & B2B Services",
        pill: "Flexible use case",
        highlight: false,
        desc: "Help agencies and B2B service firms reach better-fit buyers with messaging that reflects their positioning.",
        bestWhen: "Best when fit and positioning drive win rate.",
      },
    ],
  },

  howItWorks: {
    eyebrow: { label: "How It Works", tag: "3-step delivery" },
    title: "From target market definition to qualified sales conversations.",
    sidebar:
      "We turn market research into qualified accounts and outreach-ready execution so your team speaks with buyers, not spreadsheets.",
    cta: "Book a Pilot Strategy Call",
    steps: [
      {
        step: 1,
        title: "Define your ideal customer profile",
        desc: "Share the markets, industries, and company profiles that best match your ideal customer profile.",
        stageLabel: "Target brief",
        outcome: "You get a clear picture of who the campaign should reach.",
      },
      {
        step: 2,
        title: "We build and enrich your account list",
        desc: "We identify matching companies and enrich each record with the context your team needs to open relevant conversations.",
        stageLabel: "Qualified list",
        outcome: "You receive a focused list with useful account context.",
      },
      {
        step: 3,
        title: "We personalize and launch campaigns",
        desc: "We prepare personalized first-touch emails and deliver a send-ready campaign, or run sending on your behalf.",
        stageLabel: "Outreach-ready",
        outcome: "You get conversations to pursue, not more admin work.",
      },
    ],
  },

  dataQuality: {
    eyebrow: { label: "Data Quality", tag: "Quality & Trust" },
    title: "Better prospect data creates stronger reply rates.",
    subtitle:
      "Weak contact data silently hurts campaign performance. We review, deduplicate, and organize every record before outreach begins.",
    pills: ["Reviewed before launch", "Human QA where needed", "CRM and spreadsheet ready"],
    cta: "Discuss Your Target Market",
    cards: [
      {
        title: "Complete profiles",
        desc: "Relevant company details are organized in one place so your team understands each account before outreach.",
        method: "Structured company profiles",
        status: "Organized",
        impact: "Sharper targeting before outreach begins.",
      },
      {
        title: "Useful context",
        desc: "Service focus and market position are captured so messaging reflects real business priorities.",
        method: "Account context review",
        status: "Enriched",
        impact: "More relevant emails and stronger replies.",
      },
      {
        title: "Reliable contacts",
        desc: "Available contact details are checked and sorted before any campaign email is sent.",
        method: "Contact verification",
        status: "Reviewed",
        impact: "Fewer bounces and wasted sends.",
      },
      {
        title: "No duplicates",
        desc: "Repeated companies and overlapping records are removed before your team executes outreach.",
        method: "Duplicate checks",
        status: "Controlled",
        impact: "Cleaner campaigns across teams and markets.",
      },
      {
        title: "Smart segments",
        desc: "Prospects are grouped by geography, industry, fit, and priority so your team focuses where conversion potential is strongest.",
        method: "Segment mapping",
        status: "Segmented",
        impact: "Clearer priorities for sales follow-up.",
      },
      {
        title: "Ready to use",
        desc: "Clean exports your sales or partnership team can use immediately inside existing workflows.",
        method: "CRM-ready structure",
        status: "Ready",
        impact: "Faster launch and smoother handoff.",
      },
    ],
  },

  faq: {
    eyebrow: { label: "FAQ", tag: "Before you book" },
    title: "Common questions before launching a pilot.",
    subtitle:
      "Clear answers about scope, timing, deliverables, and how a managed outbound engagement works.",
    footerNote: "Still have questions? Bring them to your strategy call.",
    cta: "Book a Pilot Strategy Call",
    items: [
      {
        q: "What exactly do we receive in a pilot?",
        a: "You receive a qualified account list, researched company context, personalized first-touch emails, and a CRM-ready export. We manage the outbound workflow end to end.",
      },
      {
        q: "How quickly can we launch?",
        a: "We begin with a short fit call, align on targeting, and share a pilot delivery plan. Most teams launch faster than with a traditional agency onboarding process.",
      },
      {
        q: "Will this work in our industry?",
        a: "Yes. We support multiple B2B sectors, including construction, logistics, staffing, manufacturing, facility services, professional services, and more.",
      },
      {
        q: "What do you need from our team?",
        a: "We need your ideal customer profile, target markets, and key offer positioning. We handle research, messaging, and sending execution.",
      },
      {
        q: "How personalized is the outreach?",
        a: "Each message is built from real account research and written to match your offer and tone. You can review examples before any outreach goes live.",
      },
      {
        q: "Who handles sending and deliverability?",
        a: "We can run outreach from your domains or set up warmed inboxes for you, with deliverability managed throughout the campaign lifecycle.",
      },
      {
        q: "How much volume can you support?",
        a: "Our workflow supports campaigns reaching up to 100,000 companies, so we can scale with your pipeline and meeting goals.",
      },
    ],
  },

  finalCta: {
    eyebrow: "ADealForge Managed Outbound",
    title: "Turn your target market into consistent qualified conversations.",
    subtitle:
      "Start with a focused pilot. We handle research, personalization, and campaign execution so your team gets meetings worth their time.",
    primaryCta: "Book a Pilot Strategy Call",
    secondaryCta: "Review Workflow Steps",
    footnote: ["Fully managed outbound execution", "Scaled to 100,000 companies"],
  },
} as const;
