export interface CapabilityBlock {
  id: string;
  title: string;
  description: string;
  iconName: string;
}

export interface SectorBlock {
  id: string;
  title: string;
  description: string;
}

export interface HowItWorksStep {
  step: number;
  title: string;
  description: string;
  iconName: string;
}

export interface DataQualityCard {
  id: string;
  title: string;
  description: string;
  methodLabel: string;
  status: string;
}

export const capabilitiesData: CapabilityBlock[] = [
  {
    id: "prospect-discovery",
    title: "Prospect Discovery",
    description:
      "Identify companies that match your target market, sector, location and business activity.",
    iconName: "SearchCode",
  },
  {
    id: "company-intelligence",
    title: "Company Intelligence",
    description:
      "Turn company information into structured profiles with business context, service focus and relevance signals.",
    iconName: "Binary",
  },
  {
    id: "contact-review",
    title: "Contact Review",
    description:
      "Review available contact details and separate usable records from uncertain data before outreach begins.",
    iconName: "ShieldCheck",
  },
  {
    id: "ai-personalization",
    title: "AI Personalization",
    description:
      "Prepare tailored outreach angles based on each company's activity, context and potential business fit.",
    iconName: "Sparkles",
  },
];

export const sectorsData: SectorBlock[] = [
  {
    id: "construction",
    title: "Construction & Subcontracting",
    description:
      "Find contractors, subcontractors, renovation companies and project-based firms for targeted prospect workflows.",
  },
  {
    id: "logistics",
    title: "Logistics & Warehousing",
    description:
      "Identify warehouses, transport operators and logistics providers with structured business context.",
  },
  {
    id: "staffing",
    title: "Staffing & Recruitment",
    description:
      "Discover companies that may need workforce support, subcontracted teams or recruitment capacity.",
  },
  {
    id: "manufacturing",
    title: "Manufacturing & Industrial Services",
    description:
      "Build prospect pipelines across production, maintenance, technical services and supplier networks.",
  },
  {
    id: "facility",
    title: "Facility Services & Cleaning",
    description:
      "Target offices, property managers and facility operators with organized prospect data.",
  },
  {
    id: "professional-services",
    title: "Professional & B2B Services",
    description:
      "Help service companies identify better-fit prospects and approach them with relevant commercial messaging.",
  },
];

export const howItWorksData: HowItWorksStep[] = [
  {
    step: 1,
    title: "Define Target Criteria",
    description:
      "Choose the countries, sectors, business categories and company types that match your commercial goals.",
    iconName: "Sliders",
  },
  {
    step: 2,
    title: "Discover and Enrich Companies",
    description:
      "Build a focused prospect list based on business activity, location and market relevance, then enrich each profile with useful business context.",
    iconName: "Database",
  },
  {
    step: 3,
    title: "Personalize and Export",
    description:
      "Review company context, prepare outreach angles and export structured prospect data for your sales or business development workflow.",
    iconName: "Send",
  },
];

export const dataQualityData: DataQualityCard[] = [
  {
    id: "profile-completeness",
    title: "Profile Completeness",
    description:
      "Collect and organize relevant company information, business activity and target indicators into a structured operating context.",
    methodLabel: "Company profile structure",
    status: "Organized",
  },
  {
    id: "business-context",
    title: "Business Context",
    description:
      "Capture service focus, market position and business context so your team can understand relevance before outreach begins.",
    methodLabel: "Business context review",
    status: "Enriched",
  },
  {
    id: "contact-review",
    title: "Contact Review",
    description:
      "Organize available contact details and separate usable records from uncertain data before outreach begins.",
    methodLabel: "Contact data preparation",
    status: "Reviewed",
  },
  {
    id: "duplicate-control",
    title: "Duplicate Control",
    description:
      "Reduce repeated companies, overlapping records and duplicate listings before exporting prospect lists.",
    methodLabel: "Entity matching workflow",
    status: "Controlled",
  },
  {
    id: "segmentation",
    title: "Segmentation",
    description:
      "Group prospects by geography, industry, service type, business fit and outreach priority.",
    methodLabel: "Target group mapping",
    status: "Segmented",
  },
  {
    id: "export-readiness",
    title: "Export Readiness",
    description:
      "Prepare clean, organized datasets for sales, partnership or business development workflows.",
    methodLabel: "Spreadsheet and CRM-ready structure",
    status: "Ready",
  },
];
