const en = {
  common: {
    // F2 English baseline: layout chrome only. Leadership-approved studio name is TBC.
    // Full marketing copy rebrand across locales is tracked for F10.
    brand: "Agency",
    ctaBookPilot: "Let's Talk",
  },
  nav: {
    toggleMenuLabel: "Toggle menu",
    languageLabel: "Language",
    languages: {
      en: "EN",
      ru: "RU",
      de: "DE",
      es: "ES",
      fr: "FR",
      pt: "PT",
      it: "IT",
      zh: "ZH",
    },
    menu: [
      {
        id: "home",
        label: "Home",
      },
      {
        id: "platform",
        label: "Platform",
      },
      {
        id: "workflow",
        label: "Workflow",
      },
      {
        id: "v2-product",
        label: "Product",
      },
      {
        id: "v2-benefits",
        label: "Benefits",
      },
      {
        id: "v2-pricing",
        label: "Pricing",
      },
      {
        id: "contact",
        label: "Contact",
      },
    ],
  },
  emailButton: {
    openLabel: "Email us at {{email}}",
    openingLabel: "Opening email client",
    openingShort: "Opening...",
    title: "Email {{email}}",
    titleOpening: "Opening email client...",
  },
  contactPage: {
    backHome: "Back to homepage",
    eyebrowLabel: "Contact",
    socialTitle: "Contact us another way",
    socialSubtitle: "Reach us wherever is easiest — LinkedIn, email, or WhatsApp.",
    mapTitle: "Our office",
    mapSubtitle:
      "We're a remote company that works online. The address below is our registered business address for legal registration and official mail. All meetings and client work are conducted remotely.",
    mapOpenMaps: "Open in Google Maps",
  },
  aboutPage: {
    documentTitleSuffix: "About",
    hero: {
      eyebrow: "About",
      title: "A development studio focused on useful delivery",
      titleLine1: "A development studio",
      titleLine2: "focused on useful delivery",
      subtitle:
        "Custom software and digital products, shaped around the requirements you actually have.",
      primaryCta: "Start a Project",
      secondaryCta: "Explore Services",
      deliveryFlow: [
        { label: "Project input" },
        { label: "Understand" },
        { label: "Build" },
        { label: "Review" },
        { label: "Deliver" },
      ],
      principles: [
        {
          title: "Clear Communication",
          description: "Priorities and decisions stay visible.",
        },
        {
          title: "Practical Engineering",
          description: "Build what the product needs — not speculative extras.",
        },
        {
          title: "Structured Delivery",
          description: "Scope, checkpoints, and reviewable progress.",
        },
        {
          title: "Maintainable Solutions",
          description: "Code and systems teams can keep running.",
        },
      ],
    },
    whoWeAre: {
      eyebrow: "Who we are",
      title: "Software and digital product delivery shaped around real requirements",
      highlight: "Build what the product actually needs.",
      paragraphs: [
        "We plan and build custom software and digital products around the brief — not a one-size template.",
      ],
      exploreServices: "Explore Services",
      workingModel: ["Requirement-led", "Reviewable delivery", "Maintainable outcome"],
      sectionMark: "01",
    },
    principles: {
      eyebrow: "Working principles",
      title: "How we keep delivery useful",
      subtitle:
        "Four habits that keep collaboration clear and delivery sized to what the product needs next.",
      items: [
        {
          title: "Understand the Problem",
          description: "Clarify goals, constraints, and what success looks like before building.",
        },
        {
          title: "Define the Scope",
          description: "Shape a focused plan so work stays reviewable and aligned.",
        },
        {
          title: "Build and Review",
          description: "Implement with steady progress and shared checkpoints for feedback.",
        },
        {
          title: "Iterate and Deliver",
          description: "Refine based on review, then ship with clear next steps.",
        },
      ],
    },
    focusAreas: {
      eyebrow: "What we focus on",
      title: "Broad capabilities we apply across projects",
      subtitle:
        "About covers the kinds of work we take on. Detailed offerings live on the Services page.",
      exploreServices: "Explore Services",
      items: [
        {
          title: "Custom Software Delivery",
          description: "Application work shaped around real product workflows and constraints.",
        },
        {
          title: "Digital Product Experiences",
          description:
            "Modern web experiences that stay clear for users and maintainable for teams.",
        },
        {
          title: "Frontend & Backend Development",
          description:
            "Contemporary application development across the stack when the project needs it.",
        },
        {
          title: "Structured Project Delivery",
          description: "A simple path from understanding needs through review and launch.",
        },
      ],
    },
    process: {
      eyebrow: "How we work",
      title: "A simple path from idea to launch",
      subtitle: "Neutral delivery phases we use to keep work visible and reviewable.",
      steps: [
        {
          label: "Understand",
          description: "Clarify goals, constraints, and what success looks like.",
        },
        {
          label: "Plan",
          description: "Shape scope, approach, and the next delivery steps.",
        },
        {
          label: "Build",
          description: "Implement with practical engineering and steady progress.",
        },
        {
          label: "Review",
          description: "Check quality together and refine based on feedback.",
        },
        {
          label: "Launch",
          description: "Ship confidently and hand off with clear next steps.",
        },
      ],
    },
    finalCta: {
      title: "Ready to start a project?",
      subtitle: "Tell us what you need. We will explain how we can help.",
      primaryCta: "Get in Touch",
    },
  },
  platformPage: {
    documentTitle: "Agency | Platform",
    backHome: "Back to homepage",
    eyebrowLabel: "Platform",
    eyebrowTag: "B2B sales outreach",
    title: "Platform",
    subtitle:
      "Find the right companies, conduct prospect research, and prepare personalized first sales emails with human review and live campaign support.",
    statusNote:
      "Managed outreach is available now through a reviewed workflow. Public platform access stays closed while development continues.",
    ctaLead:
      "Tell us your outbound goals and we’ll share how managed services can help—no pressure.",
    primaryCta: "Start the Conversation",
    illustrationAriaLabel: "Platform under construction illustration",
  },
  workflowPage: {
    documentTitle: "Agency | Workflow",
    backHome: "Back to homepage",
    metaDescription:
      "See how ADealForge runs outbound end to end — from finding fit companies to prepared first emails and live campaign support.",
  },
  cookie: {
    consentModal: {
      title: "We Value Your Privacy",
      description:
        'We use cookies to improve your experience, analyze site usage, and support essential functionality. <a href="/terms">Terms & Conditions</a>',
      acceptAllBtn: "Accept All",
      acceptNecessaryBtn: "Reject Optional",
      showPreferencesBtn: "Manage Preferences",
    },
    preferencesModal: {
      title: "Privacy Preferences",
      acceptAllBtn: "Accept All",
      acceptNecessaryBtn: "Reject Optional",
      savePreferencesBtn: "Save Preferences",
      closeIconLabel: "Close preferences",
      sections: [
        {
          title: "Your privacy choices",
          description:
            "Choose which optional services we may enable. Necessary cookies keep the site working and remember your consent choice.",
        },
        {
          title: "Necessary",
          description: "Required for basic Site operation and storing your cookie preferences.",
          linkedCategory: "necessary",
        },
        {
          title: "Analytics",
          description:
            "Google Analytics 4 helps us measure traffic and page performance when you allow analytics cookies.",
          linkedCategory: "analytics",
        },
      ],
    },
  },
  terms: {
    backHome: "Back to homepage",
    eyebrowLabel: "Legal",
    eyebrowTag: "Terms & Conditions",
    title: "Terms & Conditions",
    intro:
      'These Terms & Conditions ("Terms") govern your access to and use of this website (the "Site"), operated by Agency ("Agency", "we", "us", or "our"). By accessing or using the Site, you agree to be bound by these Terms. If you do not agree, you must not use the Site.',
    effective: "Effective {{date}}",
    lastUpdated: "Last updated {{date}}",
    tableOfContents: "Table of contents",
    summaryTitle: "At a glance",
    sectionsHeading: "Website Terms of Use",
    sectionsIntro:
      "Please review these numbered terms carefully before using the Site or submitting an inquiry.",
    footerNote: "Need a copy of a signed client agreement instead? Email {{email}}.",
    summaryCards: [
      {
        title: "Website use",
        body: "These Terms apply to browsing, inquiries, and publicly available materials on the Site. They do not replace a signed commercial agreement for paid services.",
      },
      {
        title: "Client engagements",
        body: "Any paid project or custom commercial scope is governed by its own proposal or agreement.",
      },
      {
        title: "Questions",
        body: "For questions about these Terms, privacy, cookies, or your engagement paperwork, contact us and we will direct you to the correct document.",
      },
    ],
    sections: [
      {
        title: "1. Acceptance of Terms",
        paragraphs: [
          "By accessing, browsing, or otherwise using the Site, you confirm that you are at least 18 years of age (or the age of legal majority in your jurisdiction) and have the legal capacity to enter into a binding agreement.",
          'If you access the Site on behalf of a company or other legal entity, you represent that you have authority to bind that entity to these Terms, and "you" refers to that entity.',
        ],
      },
      {
        title: "2. Changes to These Terms",
        paragraphs: [
          'We may revise these Terms from time to time to reflect changes in law, our services, or Site features. The "Effective" date at the top of this page indicates when the current version took effect.',
          "Your continued use of the Site after revised Terms are posted constitutes acceptance of the updates. If you do not agree to the revised Terms, you must stop using the Site.",
        ],
      },
      {
        title: "3. Description of the Site and Services",
        paragraphs: [
          "The Site describes Agency's custom software, websites, and digital product work, and provides channels for prospective clients to contact us.",
          "Content on the Site is for general informational purposes only. It does not constitute a binding offer, legal advice, financial advice, or other regulated professional advice. Service scope, pricing, timelines, and deliverables are defined only in written commercial agreements executed between you and Agency.",
        ],
      },
      {
        title: "4. Accounts, Inquiries, and Submitted Information",
        paragraphs: [
          "When you submit an inquiry through the Site (including contact forms), you agree to provide accurate, current, and complete information and to update it as needed.",
          "You must not submit confidential, highly sensitive, or unnecessary personal data unless we have agreed in writing to receive it under an appropriate confidentiality or data-processing framework. You are responsible for the lawfulness of any information you share with us.",
          "We may use information you submit to respond to your inquiry, evaluate commercial fit, operate spam and security protections, and communicate about relevant services, as further described in our privacy and cookie practices.",
        ],
      },
      {
        title: "5. Acceptable Use",
        paragraphs: [
          "You agree to use the Site only for lawful business purposes and in accordance with these Terms. Without limitation, you must not: (a) attempt to gain unauthorized access to the Site, related systems, or data; (b) interfere with or disrupt the Site's integrity or performance; (c) introduce malware, bots, or harmful code; (d) scrape, harvest, or index the Site in a manner that overloads or harms our infrastructure or violates applicable law; (e) reverse engineer any non-public aspect of the Site except where mandatory law permits; or (f) use the Site to transmit unlawful, infringing, deceptive, or harassing content.",
          "We may suspend or restrict access to the Site if we reasonably believe you have violated these Terms or pose a security or legal risk.",
        ],
      },
      {
        title: "6. Intellectual Property",
        paragraphs: [
          "The Site and all related materials—including text, graphics, logos, icons, images, audiovisual content, software, design, and arrangement—are owned by or licensed to Agency and are protected by copyright, trademark, and other intellectual property laws.",
          "Subject to these Terms, we grant you a limited, non-exclusive, non-transferable, revocable license to access and use the Site for your internal business evaluation. No other rights are granted by implication or otherwise. You may not copy, modify, distribute, sell, lease, or commercially exploit Site content without our prior written consent, except for limited excerpts used in good-faith, non-commercial evaluation with attribution where customary.",
        ],
      },
      {
        title: "7. Third-Party Services and Links",
        paragraphs: [
          "The Site may integrate or link to third-party services such as analytics providers, spam-prevention tools (including CAPTCHA), payment or scheduling tools, and social media platforms. Those services are governed by their own terms and privacy policies.",
          "Agency does not control and is not responsible for third-party content, availability, security, or practices. Linking to a third-party site does not imply endorsement.",
        ],
      },
      {
        title: "8. Cookies and Analytics",
        paragraphs: [
          "We use necessary cookies to operate the Site and store consent preferences. Optional analytics cookies (for example Google Analytics) are used only with your consent where required. You can manage preferences through our cookie banner or preference center.",
          "Disabling optional cookies may limit our ability to measure Site performance but will not prevent use of core Site features.",
        ],
      },
      {
        title: "9. Disclaimer of Warranties",
        paragraphs: [
          'THE SITE AND ALL CONTENT ARE PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS WITHOUT WARRANTIES OF ANY KIND, WHETHER EXPRESS, IMPLIED, OR STATUTORY, INCLUDING IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, AND NON-INFRINGEMENT.',
          "Without limiting the foregoing, we do not warrant that the Site will be uninterrupted, secure, error-free, or free of harmful components, or that content will be accurate, complete, or current. You use the Site at your own risk.",
        ],
      },
      {
        title: "10. Limitation of Liability",
        paragraphs: [
          "TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, AGENCY AND ITS AFFILIATES, OFFICERS, EMPLOYEES, AND AGENTS WILL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, EXEMPLARY, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS, REVENUE, DATA, GOODWILL, OR BUSINESS OPPORTUNITY, ARISING OUT OF OR RELATED TO YOUR USE OF (OR INABILITY TO USE) THE SITE, WHETHER BASED ON WARRANTY, CONTRACT, TORT (INCLUDING NEGLIGENCE), OR ANY OTHER LEGAL THEORY, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.",
          "TO THE MAXIMUM EXTENT PERMITTED BY LAW, OUR TOTAL LIABILITY ARISING OUT OF OR RELATED TO THE SITE WILL NOT EXCEED ONE HUNDRED U.S. DOLLARS (USD $100) OR THE MINIMUM AMOUNT REQUIRED BY APPLICABLE LAW, WHICHEVER IS GREATER. Some jurisdictions do not allow certain limitations; in those cases, our liability is limited to the fullest extent permitted.",
        ],
      },
      {
        title: "11. Indemnification",
        paragraphs: [
          "You agree to defend, indemnify, and hold harmless Agency and its affiliates, officers, employees, and agents from and against any claims, damages, losses, liabilities, costs, and expenses (including reasonable attorneys' fees) arising out of or related to: (a) your use of the Site; (b) your violation of these Terms; or (c) your violation of any law or third-party right in connection with the Site.",
        ],
      },
      {
        title: "12. Termination",
        paragraphs: [
          "We may terminate or suspend your access to the Site at any time, with or without notice, if we believe you have violated these Terms or if we discontinue the Site.",
          "Upon termination, the license granted under Section 6 ends immediately. Sections that by their nature should survive (including intellectual property, disclaimers, limitations of liability, indemnification, and governing law) will survive termination.",
        ],
      },
      {
        title: "13. Governing Law and Dispute Resolution",
        paragraphs: [
          "These Terms are governed by the laws applicable in the jurisdiction where Agency principally conducts business, without regard to conflict-of-law principles, except where mandatory consumer or local laws provide otherwise.",
          "Before filing a formal claim, you agree to contact us at {{email}} and attempt to resolve the dispute informally within thirty (30) days. If unresolved, disputes will be resolved in the courts of competent jurisdiction in that principal place of business, unless applicable law requires another forum.",
        ],
      },
      {
        title: "14. Severability and Entire Agreement",
        paragraphs: [
          "If any provision of these Terms is held unenforceable, that provision will be enforced to the maximum extent permissible, and the remaining provisions will remain in full force and effect.",
          "These Terms, together with any notices or policies expressly referenced on the Site (including cookie preferences), constitute the entire agreement between you and Agency regarding Site use and supersede prior understandings on that subject. They do not supersede executed commercial agreements for paid services.",
        ],
      },
      {
        title: "15. Contact",
        paragraphs: [
          "For questions about these Terms & Conditions, contact Agency at {{email}}.",
          "Active clients seeking information about commercial terms, confidentiality, data processing, or deliverables should refer to their signed agreement or contact their Agency representative.",
        ],
      },
    ],
  },
  footer: {
    title: "Let's start the conversation.",
    subtitle:
      "Tell us what you need built. We'll review it and suggest the next step — no pressure, no obligation.",
    confidential: "No pressure. No commitment. Friendly conversation.",
    scaleProof: "We usually reply within one business day. Your information stays private.",
    successTitle: "Thanks — we got your message.",
    successBody:
      "We'll review what you shared and reply to your email within one business day with a clear next step.",
    submitAnother: "Send another message",
    fields: {
      businessName: "Name",
      businessNamePlaceholder: "Your name or company",
      businessEmail: "Email",
      businessEmailPlaceholder: "you@company.com",
      targetMarket: "What are you working on?",
      targetMarketPlaceholder:
        "A few sentences about the product, site, or workflow you want help with",
      website: "Website",
    },
    loadingProtection: "Loading…",
    spamProtectionTitle: "Something went wrong on our side.",
    spamProtectionBody: "Please refresh the page and try again in a moment.",
    submitIdle: "Start the Conversation",
    submitLoading: "Sending…",
    requestReadyTitle: "We couldn't send that just yet.",
    noSpam: "No spam. A short, human reply from our team.",
    nextTitle: "What happens next",
    nextSteps: [
      "We review your details.",
      "We'll suggest the best plan.",
      "If we can help, we'll plan the next step together.",
    ],
    brandDescription: "Custom software and digital product delivery for growing teams.",
    copyright: "© 2026. All rights reserved.",
    tagline: "",
    navigate: "Navigate",
    termsLink: "Terms",
    prefillMessage: "I'm looking at a {{sector}} project. Happy to share more about what we need.",
    validation: {
      nameRequired: "Add your name or company.",
      emailRequired: "Add the email where we should reply.",
      emailInvalid: "Use a valid email address.",
      messageRequired: "Share a short note about what you're working on.",
      turnstileRequired: "Please confirm you're human to continue.",
      turnstileExpired: "Please confirm you're human again before sending.",
      captchaFailed: "Please refresh the page and try again.",
      fallbackError: "Something went wrong. Please try again or email {{email}}.",
      fallbackErrorNoEmail: "Something went wrong. Please try again in a moment.",
    },
  },
  hero: {
    eyebrow: "Managed B2B outbound lead generation",
    headlineLead: "Build a predictable pipeline of qualified B2B opportunities",
    headlineAccent: "without building an in-house SDR operation",
    subheadline:
      "We identify right-fit accounts, research every company, and execute personalized first-touch outreach so your team can focus on meetings, demos, and closed revenue.",
    primaryCta: "Let's Talk",
    secondaryCta: "See the Delivery Process",
    processLine: ["Finding prospects", "Research", "Review", "Personalization", "Outreach"],
    pills: [
      "Built for founders and revenue leaders",
      "Works across B2B industries",
      "Fully managed by our team",
    ],
    proofLine: "Proven in outbound programs scaled to up to 100,000 companies.",
    consoleTitle: "Deal Intelligence Console",
    workspaceBadge: "Pipeline workspace",
    cards: {
      discovery: {
        title: "Prospect Discovery",
        badge: "High fit",
        items: [
          {
            company: "Target Company A",
            status: "High fit",
          },
          {
            company: "Regional Supplier",
            status: "Enriched",
          },
          {
            company: "Service Provider",
            status: "Reviewed",
          },
        ],
      },
      intelligence: {
        title: "Company Intelligence",
        badge: "Enriched",
        tags: ["Company Profile", "Business Activity", "Contact Signal"],
      },
      workflowCard: {
        title: "Outreach Workflow",
        badge: "Export-ready",
        steps: ["Discovery", "Enrichment", "Review", "Outreach"],
        footer: "Records organized for review · Outreach angle prepared",
      },
    },
  },
  platformStrip: {
    kicker: "How it works",
    title: "From target market to ready emails.",
    subtitle:
      "Three clear stages. Human review where it matters. Your team stays focused on conversations.",
    values: [
      {
        title: "Find the right companies",
        desc: "Build a shortlist that matches your ideal customer — not a basic list.",
        stage: "discovery",
      },
      {
        title: "Research before you write",
        desc: "Each first email reflects real company context, ready for review or launch.",
        stage: "personalization",
      },
      {
        title: "Launch with support",
        desc: "Campaign work and tracking stay managed while your team talks to buyers.",
        stage: "outreach",
      },
    ],
    cta: "Let's Talk",
    footnote: "No pressure. No obligation.",
  },
  capabilities: {
    eyebrow: {
      label: "Capabilities",
      tag: "What you get",
    },
    title: "The work behind better outbound.",
    subtitle:
      "Each step produces something your team can review — from a filtered account list to inbox-ready outreach.",
    pills: ["Human review", "Verified data", "Campaign visibility"],
    chips: ["Finding", "Research", "Review", "Messaging", "Sending", "Handoff"],
    primaryCta: "Start the Conversation",
    secondaryCta: "See how it works",
    items: [
      {
        title: "Find matching companies",
        desc: "Your ICP filters produce a ranked shortlist — industry, geography, company size, and buying signals applied before anyone researches accounts.",
      },
      {
        title: "Company research",
        desc: "Each account gets a brief: what they do, where they sell, team size, and the signal that makes them worth contacting.",
      },
      {
        title: "Check contact details",
        desc: "Every contact is checked for a deliverable email route; uncertain addresses are flagged before outreach starts.",
      },
      {
        title: "Personalized sales emails",
        desc: "First-touch drafts reference real account context — company, role, and signal — written in your voice and ready for approval.",
      },
      {
        title: "Managed email sending",
        desc: "Send from your domain or warmed inboxes while inbox health, warmup status, and delivery routing stay monitored.",
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
    title: "See what your sales team receives at every outreach step",
    subtitle:
      "Follow one target account from first check to emails ready to send and see what your team gets at each stage.",
    consoleTitle: "Campaign Overview",
    workspaceName: "ADealForge Workspace",
    workspaceNote: "Managed by our team",
    cta: "Let's Talk",
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
        id: "discovery",
        navLabel: "Discovery",
        accentLabel: "Discovery",
        panelTitle: "Start with companies that match your target customer.",
        panelDescription:
          "We convert your target details into a short list so your team never works from random or outdated account lists.",
        deliverables: [
          "Shortlist matched to your ideal customer",
          "Market, location, and size filters applied",
          "Best matches shown first",
        ],
        stageOutcome: "You start with matching companies instead of thousands of poor matches.",
        angle: "Ranked by industry, size, and business match — best matches first.",
      },
      {
        id: "enrichment",
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
        id: "contacts",
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
        id: "review",
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
        id: "personalization",
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
        id: "outreach",
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
      {
        label: "Sector & company size",
        detail: "Construction · 80–120 staff",
      },
      {
        label: "Business activity",
        detail: "Commercial fit-outs, regional projects",
      },
      {
        label: "Contact route",
        detail: "Verified decision-maker email",
      },
      {
        label: "Quality review",
        detail: "Approved · no duplicates",
      },
      {
        label: "Outreach angle",
        detail: "Tailored to current projects",
      },
      {
        label: "Send-ready",
        detail: "Queued for first-touch email",
      },
    ],
  },
  sectors: {
    eyebrow: {
      label: "Use Cases",
      tag: "Adaptable workflow",
    },
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
    eyebrow: {
      label: "How It Works",
      tag: "3-step delivery",
    },
    title: "From target market definition to qualified sales conversations.",
    sidebar:
      "We turn market research into qualified accounts and outreach-ready execution so your team speaks with buyers, not spreadsheets.",
    cta: "Let's Talk",
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
    eyebrow: {
      label: "Data Quality",
      tag: "Quality & Trust",
    },
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
  pricing: {
    eyebrow: {
      label: "Pricing",
      tag: "Flexible packages",
    },
    title: "Flexible packages for B2B growth",
    subtitle:
      "All packages include standard setup and support designed to turn raw target data into outreach-ready workflows.",
    priceSuffix: "/mo",
    tiers: {
      basic: {
        name: "Basic",
        pill: "Starter",
        description: "For companies that want to validate one country, niche, or target segment.",
        cta: "Start with Basic",
        features: [
          "Target prospect list",
          "Basic data cleaning",
          "Website and contact enrichment",
          "AI message drafts",
          "CSV/XLSX export",
          "Campaign preparation",
        ],
      },
      pro: {
        name: "Pro",
        pill: "Recommended",
        highlighted: true,
        description: "For B2B teams that need recurring prospecting and campaign preparation.",
        cta: "Book Pro Plan",
        features: [
          "Larger prospect volumes",
          "Advanced enrichment",
          "Multilingual AI personalization",
          "Lead status tracking",
          "Multiple markets",
          "Workflow support",
        ],
      },
      enterprise: {
        name: "Enterprise",
        pill: "Custom scale",
        description:
          "For agencies and companies that need a tailored prospecting and enrichment pipeline.",
        cta: "Discuss Enterprise",
        features: [
          "Custom prospecting workflows",
          "Multiple projects",
          "Custom data fields",
          "CRM-ready exports",
          "Team workflow setup",
          "Dedicated support",
        ],
      },
    },
  },
  productDemo: {
    eyebrow: {
      label: "Product demo",
      tag: "See it in action",
    },
    title: "See how ADealForge turns target markets into outreach-ready pipelines.",
    subtitle:
      "Watch a short walkthrough of targeting, enrichment, personalization, and campaign preparation — the workflow behind consistent qualified conversations.",
    watchCta: "Watch Demo",
    placeholderTitle: "Product walkthrough",
    placeholderHint:
      "Demo video loads when you press play. Add VITE_DEMO_VIDEO_URL to embed your host.",
  },
  scheduleMeeting: {
    title: "Schedule a Meeting",
    subtitle: "Book a short strategy call with our team.",
    primaryCta: "Book a Meeting",
    dismissCta: "Maybe Later",
    closeLabel: "Dismiss schedule meeting card",
  },
  testimonials: {
    eyebrow: {
      label: "Testimonials",
      tag: "Trusted by B2B teams",
    },
    title: "Teams choose ADealForge to fill pipeline with better conversations.",
    subtitle:
      "Operators and revenue leaders use managed outbound to reach the right accounts without building a full internal prospecting stack.",
    items: [
      {
        quote:
          "We finally stopped guessing at lists. ADealForge delivered researched accounts and outreach that sounded like us — and meetings followed within the first pilot cycle.",
        name: "Elena Marquez",
        title: "Head of Growth",
        company: "Northline Logistics",
        rating: 5,
        logoInitials: "NL",
      },
      {
        quote:
          "The workflow from targeting to CRM-ready export was clear and fast. Our sales team spent time on conversations instead of cleaning data and drafting cold emails.",
        name: "James Okoro",
        title: "VP of Sales",
        company: "BuildSpan Group",
        rating: 5,
        logoInitials: "BG",
      },
      {
        quote:
          "Onboarding was straightforward, messaging quality was strong, and support stayed close through launch. It felt like an extension of our revenue team.",
        name: "Sofia Bergström",
        title: "Revenue Operations Lead",
        company: "Facet Facilities",
        rating: 5,
        logoInitials: "FF",
      },
    ],
  },
  bookDemo: {
    eyebrow: "Live product demo",
    title: "Book a live demo and see your market path end to end.",
    subtitle:
      "Walk through targeting, enrichment, AI personalization, and campaign setup with our team — then decide if a pilot is the right next step.",
    primaryCta: "Book a Demo",
    secondaryCta: "Schedule a Meeting",
    footnote: ["Live walkthrough with our team", "No long sales pitch required"],
  },
  faq: {
    eyebrow: {
      label: "FAQ",
      tag: "Before you book",
    },
    title: "Common questions before launching a pilot.",
    subtitle:
      "Clear answers about the product, features, integrations, pricing, security, support, and onboarding.",
    footerNote: "Still have questions? Bring them to your strategy call.",
    cta: "Let's Talk",
    items: [
      {
        q: "What is ADealForge?",
        a: "ADealForge is a managed B2B outbound platform that turns your target market into researched accounts, personalized outreach, and CRM-ready deliverables — so your team focuses on conversations that convert.",
      },
      {
        q: "What features do we get in a typical engagement?",
        a: "You get prospect targeting, data cleaning and enrichment, multilingual AI message drafts, campaign preparation, lead status tracking, and exports built for your workflow.",
      },
      {
        q: "What exactly do we receive in a pilot?",
        a: "You receive a qualified account list, researched company context, personalized first-touch emails, and a CRM-ready export. We manage the outbound workflow end to end.",
      },
      {
        q: "Which tools and systems can you integrate with?",
        a: "We deliver CRM-ready CSV/XLSX exports and can align fields to your CRM or sales stack. HubSpot, Salesforce, and similar tools are supported through structured exports and handoff workflows.",
      },
      {
        q: "How does pricing work?",
        a: "Packages are flexible by volume and complexity — from Basic validation pilots to Pro recurring prospecting and custom Enterprise pipelines. Book a call for a recommendation that fits your market and goals.",
      },
      {
        q: "How do you handle security and data privacy?",
        a: "We treat prospect and customer data as confidential, use it only to deliver your engagement, and follow responsible data handling practices across sourcing, enrichment, and campaign execution.",
      },
      {
        q: "What support do we get after kickoff?",
        a: "You work with our team on targeting alignment, messaging review, delivery updates, and campaign adjustments. Enterprise plans include dedicated support for multi-market and multi-project work.",
      },
      {
        q: "What does onboarding look like?",
        a: "We start with a short fit call, align on your ICP and markets, confirm offer positioning, then share a pilot plan. Most teams launch faster than with traditional agency onboarding.",
      },
      {
        q: "Will this work in our industry?",
        a: "Yes. We support multiple B2B sectors, including construction, logistics, staffing, manufacturing, facility services, professional services, and more.",
      },
      {
        q: "How personalized is the outreach?",
        a: "Each message is built from real account research and written to match your offer and tone. You can review examples before any outreach goes live.",
      },
    ],
  },
  finalCta: {
    eyebrow: "Next step",
    title: "See if we're a good fit.",
    subtitle:
      "Tell us about your outbound goals. We'll review what you share and suggest a clear next step — no pressure.",
    primaryCta: "Start the Conversation",
    secondaryCta: "See how it works",
    footnote: ["No pressure. No obligation.", "Usually reply within one business day"],
  },
  homepageV2: {
    hero: {
      eyebrow: "Simple B2B outreach",
      headline: "Find buyers. Send emails. Book meetings.",
      subheadline:
        "We help you reach the right companies with clear, personal emails. Your team can focus on closing deals.",
      primaryCta: "Get Started",
      secondaryCta: "See how it works",
      previewBadge: "Your outreach view",
      previewTitle: "Campaign progress",
      previewRows: [
        { label: "Matching companies", value: "1,240" },
        { label: "Checked contacts", value: "880" },
        { label: "Ready to send", value: "70%" },
        { label: "Status", value: "Sending" },
      ],
    },
    trust: {
      title: "Built for teams that want more sales conversations",
      metrics: [
        { stat: "100k+", label: "Companies in a single campaign" },
        { stat: "Full service", label: "We handle the outreach work" },
        { stat: "Ready for sales", label: "Clean results for your team" },
      ],
      logoLabels: ["B2B SaaS", "Services", "Industrial", "Staffing", "Logistics"],
    },
    product: {
      eyebrow: "Product",
      title: "One place to run outreach",
      subtitle:
        "Find companies, prepare emails, and send results to your sales team—without switching between many tools.",
      highlights: [
        { title: "The right companies", description: "We focus on buyers that fit your business." },
        { title: "Better first emails", description: "Messages based on real company research." },
        {
          title: "Ready for sales",
          description: "Your team spends time on meetings, not messy lists.",
        },
      ],
      panelBadge: "Live campaign",
      panelTitle: "Companies in progress",
      accounts: [
        { company: "Nordic Build Partners", fit: "Strong", stage: "Sending" },
        { company: "Vertex Logistics EU", fit: "Good fit", stage: "Research" },
        { company: "Facet Facilities", fit: "Good fit", stage: "Ready" },
        { company: "BuildSpan Group", fit: "Strong", stage: "Sending" },
      ],
    },
    features: {
      eyebrow: "What you get",
      title: "What ADealForge does for you",
      items: [
        {
          title: "Choose your audience",
          description: "Decide which companies and markets to reach.",
        },
        {
          title: "Find buyers",
          description: "Build company lists that match your goals.",
        },
        {
          title: "Company research",
          description: "Useful details that make emails more relevant.",
        },
        {
          title: "Check contact details",
          description: "Confirm emails before you send.",
        },
        {
          title: "Personal emails",
          description: "Clear first messages—not copy-paste templates.",
        },
        {
          title: "Pass leads to sales",
          description: "Clean results so your team can book meetings.",
        },
      ],
    },
    workflow: {
      eyebrow: "How it works",
      title: "Five simple steps",
      steps: [
        { label: "Choose your audience" },
        { label: "Find buyers" },
        { label: "Check contacts" },
        { label: "Send emails" },
        { label: "Book meetings" },
      ],
    },
    testimonials: {
      eyebrow: "Results",
      title: "What teams notice first",
      items: [
        {
          quote: "Better company lists and emails that sounded like us. We got meetings quickly.",
          name: "Elena Marquez",
          title: "Head of Growth",
          company: "Northline Logistics",
          result: "Faster meetings",
          logoInitials: "NL",
        },
        {
          quote: "Clean lists for our sales tools. Our team talked to real buyers—not bad data.",
          name: "James Okoro",
          title: "VP of Sales",
          company: "BuildSpan Group",
          result: "More time selling",
          logoInitials: "BG",
        },
        {
          quote: "Clear emails and helpful support from day one.",
          name: "Sofia Bergström",
          title: "Revenue Operations",
          company: "Facet Facilities",
          result: "Easier launch",
          logoInitials: "FF",
        },
      ],
    },
    pricing: {
      eyebrow: "Pricing",
      title: "Simple, clear pricing",
      subtitle: "Pick a plan that fits your business and grow your outreach with confidence.",
      priceSuffix: "/month",
      yearlyBillingNote: "Billed once a year",
      billingToggle: {
        groupLabel: "Select pricing mode",
        monthly: "Monthly",
        yearly: "Yearly",
        oneTimeLeads: "One-Time",
        saveLabel: "Save 20%",
      },
      oneTimeLeads: {
        priceSuffix: "one-time",
        billingNote: "No subscription",
        quantityLabel: "Fixed number of verified leads",
        leadCountLabel: "{{count}} verified leads",
      },
      tiers: [
        {
          id: "starter",
          name: "Starter",
          monthlyPrice: 199,
          description: "Perfect for startups and small businesses.",
          cta: "Get Started",
          features: [
            "Find the right companies",
            "Add contact details",
            "Check email addresses",
            "5,000 contacts",
            "Email outreach",
            "Connect to your sales tools",
            "Simple dashboard",
            "Basic reports",
            "Standard support",
          ],
        },
        {
          id: "growth",
          name: "Growth",
          monthlyPrice: 399,
          featured: true,
          description: "Best for growing teams that want to reach more buyers.",
          cta: "Get Started",
          features: [
            "Everything in Starter",
            "50,000 contacts",
            "Help writing personal emails",
            "Automated follow-ups",
            "LinkedIn outreach",
            "Smart reminders",
            "Better reports",
            "Team access",
            "Sales tool sync",
            "Extra integrations",
            "Priority support",
          ],
        },
        {
          id: "enterprise",
          name: "Enterprise",
          monthlyPrice: 699,
          description: "Built for larger teams with bigger outreach needs.",
          cta: "Contact Sales",
          features: [
            "Everything in Growth",
            "Unlimited contacts",
            "Unlimited campaigns",
            "Custom outreach setup",
            "Your own support manager",
            "Guided setup",
            "Strong security",
            "One login for your team",
            "Custom connections",
            "Guaranteed support times",
          ],
        },
      ],
    },
    blog: {
      eyebrow: "Insights",
      title: "Latest from ADealForge",
      description: "Simple tips on finding buyers, sending better emails, and growing sales.",
      readArticleLabel: "Read article",
      posts: [
        {
          category: "Finding buyers",
          title: "How to Build a Strong List of Buyers",
          description:
            "Learn how to pick the right companies and contacts for stronger email campaigns.",
          readingTime: "6 min read",
          href: "/blog/build-a-b2b-prospect-list",
          imageAlt: "Illustration for building a strong list of buyers",
        },
        {
          category: "Email outreach",
          title: "How AI Helps With Sales Emails",
          description: "See how AI can help with research, personal emails, and running campaigns.",
          readingTime: "5 min read",
          href: "/blog/ai-in-b2b-outreach",
          imageAlt: "Illustration for AI in sales emails",
        },
        {
          category: "Sales tips",
          title: "From First Contact to a Sales Meeting",
          description: "A simple plan for turning prospects into real sales conversations.",
          readingTime: "7 min read",
          href: "/blog/cold-lead-to-qualified-meeting",
          imageAlt: "Illustration for turning contacts into sales meetings",
        },
      ],
    },
    faq: {
      eyebrow: "FAQ",
      title: "Common questions",
      items: [
        {
          q: "What does ADealForge do?",
          a: "We find the right companies, check contact details, write personal first emails, and prepare clean results for your sales team.",
        },
        {
          q: "How fast can we start?",
          a: "Most teams start after a short intro call to confirm your market and message.",
        },
        {
          q: "Do we need a sales outreach team?",
          a: "No. We handle the outreach work so your team can focus on meetings and closing deals.",
        },
        {
          q: "How does pricing work?",
          a: "Plans depend on your market size and goals. We help you pick what fits.",
        },
        {
          q: "Is our data safe?",
          a: "Yes. We only use your data to run your campaigns, with careful handling practices.",
        },
      ],
    },
    finalCta: {
      title: "Ready for more sales conversations?",
      subtitle: "Start today. We will help you reach the right companies with a clear plan.",
      primaryCta: "Get Started",
      footnote: ["Easy to begin", "No long setup"],
    },
  },
  homepageV3: {
    hero: {
      eyebrow: "Development studio",
      headline: "Custom software and digital products, delivered with clarity.",
      subheadline:
        "Scoped to the requirements you bring, from the first conversation through launch.",
      primaryCta: "Start a Project",
      secondaryCta: "Explore Services",
      secondaryCtaWork: "See Our Work",
      previewBadge: "Outbound sales view",
      previewTitle: "Campaign progress",
      previewRows: [
        { label: "Matching companies", value: "1,240" },
        { label: "Checked contacts", value: "880" },
        { label: "Ready to send", value: "70%" },
        { label: "Status", value: "Sending" },
      ],
    },
    heroVisual: {
      eyebrow: "Delivery system",
      title: "From brief to shipped product",
      badge: "Studio",
      caption: "Brief to product across software, web, mobile, commerce, and CMS.",
      ariaLabel:
        "Illustration of digital product delivery from brief through understand, design and build, and review to product",
    },
    services: {
      eyebrow: "Services",
      title: "Six focused services for product and web delivery",
      subtitle: "Brief previews here, with full detail on each service page.",
      cta: "Explore All Services",
      exploreLabel: "Explore Service",
      backToServices: "Back to services",
      detailPrimaryCta: "Start a Project",
      relatedTitle: "Related services",
      items: [
        {
          id: "software-development",
          title: "Software Development",
          description: "Custom software for workflows, users, and integration needs.",
        },
        {
          id: "website-development",
          title: "Website Development",
          description: "Responsive websites with clean implementation and room to grow.",
        },
        {
          id: "mobile-app-development",
          title: "Mobile App Development",
          description:
            "Mobile applications connected to your product, data, and authentication needs.",
        },
        {
          id: "shopify-stores",
          title: "Shopify Stores",
          description: "Shopify storefront setup, customization, and store improvements.",
        },
        {
          id: "wordpress-websites",
          title: "WordPress Websites",
          description: "Maintainable WordPress websites for content-driven teams.",
        },
        {
          id: "custom-wordpress-theme-development",
          title: "Custom WordPress Theme Development",
          description: "Custom themes for distinct layouts and CMS-editable sections.",
        },
      ],
    },
    value: {
      eyebrow: "Why work with us",
      title: "A delivery approach teams can plan around",
      subtitle: "Clear communication and practical engineering from scope through delivery.",
      items: [
        {
          title: "Clear Communication",
          description: "Priorities and decisions stay visible.",
        },
        {
          title: "Practical Engineering",
          description: "Build what the product needs.",
        },
        {
          title: "Structured Delivery",
          description: "Scope and progress stay reviewable.",
        },
        {
          title: "Maintainable Solutions",
          description: "Code and systems stay practical after launch.",
        },
      ],
    },
    workPreview: {
      eyebrow: "Featured projects",
      title: "Selected work",
      subtitle: "Eleven live gallery websites. Open a card to visit the site.",
      cta: "View All Projects",
    },
    process: {
      eyebrow: "How we work",
      title: "A simple path from idea to launch",
      subtitle: "Five clear phases that keep scope, progress, and reviews visible.",
      steps: [
        {
          label: "Understand",
          description: "Clarify goals, users, and constraints.",
        },
        {
          label: "Plan",
          description: "Define scope, priorities, and direction.",
        },
        {
          label: "Build",
          description: "Develop in clear, reviewable increments.",
        },
        {
          label: "Review",
          description: "Test quality, usability, and requirements.",
        },
        {
          label: "Launch",
          description: "Prepare delivery and next steps.",
        },
      ],
    },
    aboutPreview: {
      eyebrow: "About",
      title: "A development studio focused on useful delivery",
      support:
        "We turn clear requirements into practical, reviewable, maintainable digital products.",
      identity: {
        lead: "We build",
        domains: ["software", "web", "mobile", "commerce", "content systems"],
        aroundLabel: "Around",
        aroundValue: "clear requirements",
        forLabel: "For",
        forValue: "useful delivery",
      },
      cta: "About Us",
    },
    trust: {
      title: "Built for outbound teams across industries",
      metrics: [
        { stat: "100k+", label: "Companies reached in outbound programs" },
        { stat: "Full service", label: "Research to outreach handled for you" },
        { stat: "Sales ready", label: "Clean handoff for your sellers" },
      ],
      logoLabels: ["B2B SaaS", "Services", "Industrial", "Staffing", "Logistics"],
    },
    product: {
      eyebrow: "Platform",
      title: "See your outreach in one place",
      subtitle:
        "A live view of companies moving from research to ready-to-send—so your team always knows what is happening.",
      highlights: [
        {
          title: "Find right companies",
          description: "Target accounts that match your market before outreach starts.",
        },
        {
          title: "Prepare clear first emails",
          description: "Use real company context so messages feel relevant, not generic.",
        },
        {
          title: "Hand off sales-ready work",
          description: "Give your team clean lists and messaging instead of messy spreadsheets.",
        },
      ],
      panelBadge: "Live campaign",
      panelTitle: "Companies being checked",
      accounts: [
        { company: "Nordic Build Partners", fit: "Strong", stage: "Sending" },
        { company: "Vertex Logistics EU", fit: "Good fit", stage: "Research" },
        { company: "Facet Facilities", fit: "Good fit", stage: "Ready" },
        { company: "BuildSpan Group", fit: "Strong", stage: "Sending" },
      ],
    },
    features: {
      eyebrow: "What you get",
      title: "Everything you need for outbound sales",
      items: [
        {
          title: "Prospect Research",
          description: "Build focused lists of companies that fit your ideal buyer profile.",
        },
        {
          title: "Sales Intelligence Software",
          description: "See the company details that help sales teams write better first emails.",
        },
        {
          title: "Cold Email Personalization",
          description: "Send clear first messages based on real research—not copy-paste templates.",
        },
        {
          title: "Outbound Sales Automation",
          description:
            "Keep research, writing, and sending moving in one simple sales automation flow.",
        },
        {
          title: "Revenue Intelligence",
          description: "Spot which accounts and messages create replies and qualified meetings.",
        },
        {
          title: "Agentic Workflow",
          description: "Let guided steps handle the busywork while your team focuses on closing.",
        },
      ],
    },
    benefits: {
      // F13: use layout brand fallback until F10 replaces product copy.
      eyebrow: "Why teams choose Agency",
      title: "From outreach work to sales results",
      subtitle:
        "Building reliable outbound internally requires research, validation, personalisation, campaign operations, and continuous quality control. Agency handles that work as one managed system.",
      contrast: {
        withoutLabel: "Without Agency",
        withLabel: "With Agency",
        withoutPoints: [
          "Hours spent finding and qualifying companies by hand",
          "Contacts and first emails checked across separate tools",
          "Research, enrichment, review, and sending split across handoffs",
          "Sellers lose conversation time to preparation and campaign ops",
        ],
        withPoints: [
          "ICP-matched shortlists arrive with account context",
          "Validated records and account-specific first emails with human review",
          "One visible process from research through send-ready outreach",
          "Preparation is handled before qualified conversations reach sellers",
        ],
      },
      labels: {
        problem: "Problem",
        workRequired: "Work required",
        solution: "How Agency helps",
        outcome: "Business outcome",
      },
      items: [
        {
          problem: "Account research eats selling hours.",
          workRequired:
            "Teams dig through lists, websites, and notes to decide which companies are worth contacting.",
          solution: "We build an ICP-matched shortlist with the account context sellers need.",
          outcome: "Your team starts from relevant accounts—not raw databases.",
        },
        {
          problem: "Weak contacts and generic messaging weaken campaigns.",
          workRequired:
            "Someone has to verify records, rewrite openers, and catch quality issues before launch.",
          solution:
            "We validate records and prepare account-specific first emails with human quality review.",
          outcome: "Outreach starts with cleaner data and stronger relevance.",
        },
        {
          problem: "Outbound ops stretch across tools and handoffs.",
          workRequired:
            "Research, enrichment, review, sending, and status tracking live in different places.",
          solution: "We run the workflow as one visible process your team can follow.",
          outcome: "Fewer steps. Less operational fragmentation.",
        },
        {
          problem: "Internal execution steals time from buyers.",
          workRequired:
            "Salespeople spend cycles on prep, coordination, and campaign operations instead of conversations.",
          solution: "We handle the work before qualified conversations reach your sales team.",
          outcome: "More capacity stays on buyers and active opportunities.",
        },
      ],
    },
    results: {
      eyebrow: "Outcomes",
      title: "What this means for your business",
      subtitle: "See how our managed service helps your sales team.",
      items: [
        {
          stat: "Steady sales flow",
          label: "We run outreach regularly, not as one-time campaigns.",
        },
        {
          stat: "Expert help without hiring",
          label:
            "Our team handles the work from research to sending. No hiring or new tools needed.",
        },
        {
          stat: "Quality at every size",
          label: "Every account is researched and checked, whether you target 50 or 5,000.",
        },
        {
          stat: "See every step",
          label: "See every step from target company to booked meeting.",
        },
      ],
    },
    testimonials: {
      eyebrow: "Customer stories",
      title: "Clearer sales outreach for your team.",
      items: [
        {
          quote:
            "Our outbound sales finally felt clear. Better lists, better emails, and more qualified meetings.",
          name: "Elena Marquez",
          title: "Head of Growth",
          company: "Northline Logistics",
          result: "More qualified meetings",
          logoInitials: "NL",
        },
        {
          quote:
            "Sales automation saved our team hours each week and streamlined our outbound sales workflow.",
          name: "James Okoro",
          title: "VP of Sales",
          company: "BuildSpan Group",
          result: "More time selling",
          logoInitials: "BG",
        },
        {
          quote:
            "B2B outbound sales felt easier from week one. Clear emails and support we could trust.",
          name: "Sofia Bergström",
          title: "Revenue Operations",
          company: "Facet Facilities",
          result: "Faster launch",
          logoInitials: "FF",
        },
      ],
    },
    pricing: {
      eyebrow: "Pricing",
      title: "Pricing for managed outbound sales",
      subtitle:
        "Choose a plan that fits B2B sales teams and growing companies ready to scale outbound sales.",
      priceSuffix: "/month",
      yearlyBillingNote: "Billed once a year",
      billingToggle: {
        groupLabel: "Select pricing mode",
        monthly: "Monthly",
        yearly: "Yearly",
        oneTimeLeads: "One-Time",
        saveLabel: "Save 20%",
      },
      oneTimeLeads: {
        priceSuffix: "one-time",
        billingNote: "No subscription",
        quantityLabel: "Fixed number of verified leads",
        leadCountLabel: "{{count}} verified leads",
      },
      tiers: [
        {
          id: "free",
          name: "FREE",
          monthlyPrice: 0,
          description: "A clear start for small sales teams testing outbound sales automation.",
          cta: "Get Started",
          features: [
            "Prospect research basics",
            "Contact details added",
            "Email checks",
            "5,000 contacts",
            "Cold email software outreach",
            "Connect to your sales tools",
            "Simple dashboard",
            "Basic reports",
            "Standard support",
          ],
        },
        {
          id: "growth",
          name: "Growth",
          monthlyPrice: 399,
          featured: true,
          description: "Built for growing B2B teams that want more outbound sales volume.",
          cta: "Let's Talk",
          features: [
            "Everything in Free",
            "50,000 contacts",
            "Cold email personalization help",
            "Automated follow-ups",
            "LinkedIn outreach",
            "Smart reminders",
            "Better revenue intelligence reports",
            "Team access",
            "Sales tool sync",
            "Extra integrations",
            "Priority support",
          ],
        },
        {
          id: "flexible",
          name: "FLEXIBLE",
          monthlyPrice: 0,
          customPricing: true,
          priceLabel: "Custom pricing",
          description:
            "Flexible pricing based on your lead volume, workflow requirements, and campaign goals.",
          cta: "Contact Us",
          features: [
            "Everything in Growth",
            "Tailored lead volume",
            "Custom outbound sales setup",
            "Workflow-aligned campaign scope",
            "Your own support manager",
            "Guided setup",
            "Strong security",
            "One login for your team",
            "Custom connections",
            "Guaranteed support times",
          ],
        },
      ],
    },
    blog: {
      eyebrow: "Insights",
      title: "Ideas to strengthen outbound sales",
      description:
        "Practical tips on outbound sales automation, prospect research, and better first emails.",
      readArticleLabel: "Read article",
      posts: [
        {
          category: "Outbound sales",
          title: "How to Build Stronger Outbound Sales Lists",
          description:
            "Use prospect research to choose the right companies before you start outreach.",
          readingTime: "6 min read",
          href: "/blog/build-a-b2b-prospect-list",
          imageAlt: "Illustration for outbound sales list building and prospect research",
        },
        {
          category: "Outbound sales automation",
          title: "Outbound Sales Automation That Feels Personal",
          description:
            "See how cold email personalization and AI cold email support improve reply rates.",
          readingTime: "5 min read",
          href: "/blog/ai-in-b2b-outreach",
          imageAlt: "Illustration for outbound sales automation and AI cold email",
        },
        {
          category: "Sales intelligence",
          title: "Using Sales Intelligence to Start Better Conversations",
          description:
            "Turn company context into clearer outbound sales conversations with less guesswork.",
          readingTime: "7 min read",
          href: "/blog/cold-lead-to-qualified-meeting",
          imageAlt: "Illustration for sales intelligence software and meeting booking",
        },
      ],
    },
    faq: {
      eyebrow: "FAQ",
      title: "Common questions",
      items: [
        {
          q: "What happens after I contact you?",
          a: "We learn about your outbound sales goals and explain how we can help.",
        },
        {
          q: "How soon can we start?",
          a: "Most teams start after a short intro call to confirm your market and message. Then we can move from research to sending without a long setup.",
        },
        {
          q: "Do we need a large sales team?",
          a: "No. Small and growing B2B teams use ADealForge. You stay focused on selling. We handle the research and email work.",
        },
        {
          q: "What industries work best?",
          a: "We work with B2B teams in SaaS, services, industrial, staffing, logistics, and similar markets.",
        },
        {
          q: "Do we stay in control of messaging and targeting?",
          a: "Yes. You decide who we contact and what the message should say. We handle the research, prep, and sending. Your team stays focused on conversations.",
        },
      ],
    },
    finalCta: {
      eyebrow: "Start a project",
      title: "Have a project in mind?",
      subtitle: "Tell us what you're building and we'll discuss the right approach.",
      primaryCta: "Start a Project",
      secondaryCta: "Explore Services",
      footnote: ["Talk to our team", ""],
    },
    conversationPrompt: {
      title: "Let's Start a Conversation",
      subtitle: "No pressure. No obligation. Just a friendly conversation.",
      primaryCta: "Start Here",
      dismissCta: "Keep Browsing",
      closeLabel: "Dismiss conversation card",
    },
  },
  servicesPage: {
    backHome: "Back to homepage",
    metaDescription:
      "Explore Nordlead Studio services for custom software, website development, mobile apps, Shopify stores, WordPress websites, and custom WordPress themes.",
    hero: {
      eyebrow: "Software & Web Development Services",
      title: "Build digital products and web experiences around your business",
      subtitle:
        "We design and build custom software, websites, mobile apps, Shopify stores, and WordPress experiences around real business requirements.",
      primaryCta: "Start a Project",
      secondaryCta: "Explore Services",
      visualNote: "Six connected delivery capabilities.",
      activeSummaryLabel: "Active capability",
      systemLabel: "Connected Delivery Capabilities",
      exploreServiceCta: "Explore Service",
    },
    overview: {
      eyebrow: "Overview",
      title: "Six focused development services",
      subtitle:
        "Choose the service that fits your project, then open the dedicated page for capabilities, process, and next steps.",
      learnMore: "Explore Service",
    },
    spotlight: {
      eyebrow: "Explore Capabilities",
      title: "Explore what we can build",
      subtitle:
        "Select a service to review a practical blueprint, fit signals, and the dedicated service page.",
      exploreCta: "Explore Service",
      suitableLabel: "Good fit for",
      capabilitiesLabel: "Capabilities",
    },
    detailSectionEyebrow: "Service details",
    services: [
      {
        id: "software-development",
        title: "Software Development",
        shortDescription:
          "Custom software for business workflows, internal tools, platforms, and product ideas.",
        tabLabel: "Software",
        suitableFor: ["Internal tools", "Workflow systems", "Product operations"],
        hubHighlights: ["Business apps and internal tools", "Workflows and integrations"],
        blueprintHighlights: ["Internal tools", "Automation", "Integrations"],
        paragraphs: [
          "Custom software shaped around the workflow you have — tools, admin screens, integrations, and maintainable application structure.",
        ],
        capabilitiesTitle: "What we can help with",
        capabilities: [
          "Custom business applications and internal tools",
          "Web-based software and admin interfaces",
          "Workflow and process automation",
          "API and third-party integrations",
          "Structured, maintainable application architecture",
          "Enhancements to existing software",
        ],
        cta: "Discuss software development",
      },
      {
        id: "website-development",
        title: "Website Development",
        shortDescription:
          "Responsive, maintainable websites built around your content and business goals.",
        tabLabel: "Web",
        suitableFor: ["Marketing sites", "Business websites", "Landing pages"],
        hubHighlights: ["Business and marketing websites", "Responsive front-end builds"],
        blueprintHighlights: ["Business sites", "Responsive pages", "Forms and integrations"],
        paragraphs: [
          "Business and marketing websites that stay responsive, clear for users, and practical to extend as requirements change.",
        ],
        capabilitiesTitle: "What we can help with",
        capabilities: [
          "Business, corporate, and agency websites",
          "Landing pages and marketing sites",
          "Responsive layout and front-end development",
          "Backend and form integrations",
          "Website modernization and refactors",
          "Performance-conscious, maintainable code",
        ],
        cta: "Discuss website development",
      },
      {
        id: "mobile-app-development",
        title: "Mobile App Development",
        shortDescription:
          "Mobile applications designed around your product, users, and day-to-day workflows.",
        tabLabel: "Mobile",
        suitableFor: ["Customer apps", "Business apps", "Account flows"],
        hubHighlights: ["Mobile product flows", "Accounts and data connections"],
        blueprintHighlights: ["Product flows", "Accounts", "Data connections"],
        paragraphs: [
          "Mobile apps for customer and business flows, planned around product requirements, accounts, and connected data.",
        ],
        capabilitiesTitle: "What we can help with",
        capabilities: [
          "Business and customer-facing mobile applications",
          "UI implementation for mobile product flows",
          "Authentication and account experiences",
          "Backend-connected mobile features",
          "API integration for mobile clients",
          "Iterative improvements after initial release",
        ],
        cta: "Discuss mobile development",
      },
      {
        id: "shopify-stores",
        title: "Shopify Stores",
        shortDescription:
          "Shopify storefront development, theme work, and practical store improvements.",
        tabLabel: "Shopify",
        suitableFor: ["New stores", "Theme updates", "Catalog polish"],
        hubHighlights: ["Store setup and theme work", "Catalog and storefront polish"],
        blueprintHighlights: ["Store setup", "Theme work", "Commerce improvements"],
        paragraphs: [
          "Shopify storefronts, theme customization, and catalog improvements for a new or existing store.",
        ],
        capabilitiesTitle: "What we can help with",
        capabilities: [
          "Shopify store setup and configuration",
          "Storefront theme customization",
          "Product and catalog structure",
          "Responsive customer-facing layouts",
          "Third-party app integrations",
          "Improvements to existing Shopify stores",
        ],
        cta: "Discuss a Shopify project",
      },
      {
        id: "wordpress-websites",
        title: "WordPress Websites",
        shortDescription:
          "Flexible WordPress websites that are clear to manage, update, and maintain.",
        tabLabel: "WordPress",
        suitableFor: ["Content sites", "Business sites", "Editable pages"],
        hubHighlights: ["Content-friendly structure", "Maintainable WordPress builds"],
        blueprintHighlights: ["Editable pages", "Content structure", "Plugin integration"],
        paragraphs: [
          "WordPress websites with editable content, clear structure, and room to improve as the site grows.",
        ],
        capabilitiesTitle: "What we can help with",
        capabilities: [
          "Business WordPress website delivery",
          "Responsive WordPress development",
          "Site setup and content-friendly structures",
          "Page and template development",
          "Plugin integration and configuration",
          "Improvements to existing WordPress sites",
        ],
        cta: "Discuss WordPress development",
      },
      {
        id: "custom-wordpress-theme-development",
        title: "Custom WordPress Theme Development",
        shortDescription:
          "Custom WordPress themes for unique layouts, content needs, and brand experiences.",
        tabLabel: "Custom Themes",
        suitableFor: ["Design systems", "Theme rebuilds", "Editable sections"],
        hubHighlights: ["Custom layout systems", "CMS-editable sections"],
        blueprintHighlights: ["Layout systems", "Reusable templates", "Editable sections"],
        paragraphs: [
          "Custom WordPress theme implementation when the site structure exists and the layout needs to be distinct and maintainable.",
        ],
        capabilitiesTitle: "What we can help with",
        capabilities: [
          "Custom WordPress theme implementation",
          "Design-to-WordPress development",
          "Reusable templates and partials",
          "Responsive layout systems",
          "CMS-editable sections for marketing teams",
          "Theme customization and structured refactors",
        ],
        cta: "Discuss custom theme work",
      },
    ],
    whyUs: {
      eyebrow: "Why Work With Us",
      title: "Clear delivery without inflated promises",
      subtitle:
        "Focused scope, visible progress, and maintainable builds — without claiming outcomes we cannot support.",
      principles: [
        {
          shortLabel: "Communication",
          title: "Clear Communication",
          description:
            "Priorities, decisions, and next steps stay visible so the project remains easy to follow.",
        },
        {
          shortLabel: "Requirements",
          title: "Requirement-Focused Development",
          description:
            "We build around the product requirements you actually have instead of speculative extras.",
        },
        {
          shortLabel: "Delivery",
          title: "Structured Delivery",
          description:
            "Scope, checkpoints, and reviewable progress keep the work aligned before it moves forward.",
        },
        {
          shortLabel: "Maintainability",
          title: "Maintainable Solutions",
          description:
            "We aim for practical code and systems that remain understandable after launch.",
        },
      ],
    },
    process: {
      eyebrow: "Process",
      title: "Our development process",
      subtitle:
        "A clear path from requirements to launch, with room to refine as the product takes shape.",
      steps: [
        {
          number: "01",
          title: "Discovery",
          description:
            "Clarify goals, users, constraints, priorities, and what a successful outcome should look like.",
        },
        {
          number: "02",
          title: "Planning",
          description:
            "Define scope, priorities, technical direction, and the review points that keep delivery focused.",
        },
        {
          number: "03",
          title: "Design & Development",
          description:
            "Turn the approved direction into working software and web experiences in reviewable increments.",
        },
        {
          number: "04",
          title: "Review & Testing",
          description:
            "Validate quality, usability, responsiveness, and important flows before release.",
        },
        {
          number: "05",
          title: "Launch & Iteration",
          description:
            "Prepare for launch or handoff, then continue improving where new needs become clear.",
        },
      ],
    },
    platforms: {
      eyebrow: "Platforms & tools",
      title: "Technologies we work with",
      subtitle:
        "We use platforms and tools that match the service—confirmed stacks for this site and delivery work are listed below.",
      groups: [
        {
          label: "Web frontend",
          items: ["React", "TypeScript"],
        },
        {
          label: "Content management",
          items: ["WordPress"],
        },
        {
          label: "E-commerce",
          items: ["Shopify"],
        },
        {
          label: "Mobile",
          items: ["Requirement-led mobile application development"],
        },
      ],
    },
    engagement: {
      eyebrow: "Engagement",
      title: "Flexible project approaches",
      subtitle:
        "Engagements are shaped by what you are building—not fixed packages or list prices on this page.",
      themes: [
        "New product or application development",
        "Improvements to existing websites or apps",
        "Redesign and rebuild of public web experiences",
        "Platform and third-party integrations",
        "Ongoing enhancements after launch",
      ],
    },
    faq: {
      eyebrow: "FAQ",
      title: "Common questions",
      subtitle: "Straightforward answers about our services and how delivery works.",
      contactPrompt: "Still have a question?",
      contactCta: "Contact Us",
      items: [
        {
          q: "What types of projects do you work on?",
          a: "We work across custom software, website development, mobile apps, Shopify stores, WordPress websites, and custom WordPress themes.",
        },
        {
          q: "Can you develop a project from scratch?",
          a: "Yes. We can take a project from requirements and planning through design, development, review, and launch.",
        },
        {
          q: "Can you improve an existing website or application?",
          a: "Yes. We improve existing products with interface work, integrations, structural updates, and maintainable refinements.",
        },
        {
          q: "Do you build Shopify stores?",
          a: "Yes. We support Shopify store setup, theme customization, catalog structure, and practical storefront improvements.",
        },
        {
          q: "Do you work with WordPress?",
          a: "Yes. We build and improve WordPress websites with clear content structure and maintainable implementation.",
        },
        {
          q: "Can you build a custom WordPress theme?",
          a: "Yes. We implement custom WordPress themes with reusable templates and CMS-editable sections when the project needs them.",
        },
        {
          q: "How can we discuss a project?",
          a: "Share a short project brief through Contact, including goals, current stage, and any existing materials you already have.",
          ctaLabel: "Start a Project",
          ctaHref: "/contact",
        },
      ],
    },
    finalCta: {
      title: "Have a project in mind?",
      subtitle:
        "Tell us what you are building and what you need help with. We will outline the next step.",
      primaryCta: "Start a Project",
    },
  },
} as const;

export default en;
