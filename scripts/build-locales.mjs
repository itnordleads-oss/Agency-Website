import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { execSync } from "node:child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const require = createRequire(import.meta.url);

function loadCjsFromTsObject(tsSource, exportName) {
  let transformed = tsSource
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/^\s*\/\/.*$/gm, "")
    .replace(new RegExp(`(?:export\\s+)?const\\s+${exportName}\\s*=\\s*`), "module.exports = ")
    .replace(/ as const/g, "")
    .replace(new RegExp(`\\nexport\\s+default\\s+${exportName};\\s*$`), "\n")
    .trim();
  if (!transformed.startsWith("module.exports")) {
    throw new Error(`Failed to transform export for ${exportName}`);
  }
  const tmp = path.join(root, `scripts/.tmp-${exportName}-${Date.now()}.cjs`);
  fs.writeFileSync(tmp, transformed);
  try {
    return require(tmp);
  } finally {
    fs.unlinkSync(tmp);
  }
}

function toTsModule(name, value) {
  return `const ${name} = ${JSON.stringify(value, null, 2)} as const;\n\nexport default ${name};\n`;
}

function deepMergePreferOld(enNode, ruNode) {
  if (typeof enNode === "string") {
    return typeof ruNode === "string" && ruNode.trim() ? ruNode : enNode;
  }
  if (Array.isArray(enNode)) {
    if (!Array.isArray(ruNode)) {
      return enNode.map((item) => deepMergePreferOld(item, undefined));
    }
    return enNode.map((item, index) => deepMergePreferOld(item, ruNode[index]));
  }
  if (enNode && typeof enNode === "object") {
    const out = {};
    for (const key of Object.keys(enNode)) {
      out[key] = deepMergePreferOld(enNode[key], ruNode ? ruNode[key] : undefined);
    }
    return out;
  }
  return enNode;
}

const marketingSrc = fs.readFileSync(path.join(root, "src/content/marketingCopy.ts"), "utf8");
const marketing = loadCjsFromTsObject(marketingSrc, "marketingCopy");

const oldRuRaw = execSync("git show origin/translations:src/i18n/locales/ru.ts", {
  encoding: "utf8",
  cwd: root,
});
const oldRu = loadCjsFromTsObject(oldRuRaw, "ru");

const common = {
  brand: "ADealForge",
  ctaBookPilot: "Book a Pilot Strategy Call",
};

const nav = {
  toggleMenuLabel: "Toggle menu",
  languageLabel: "Language",
  languages: { en: "EN", ru: "RU" },
  menu: [
    { id: "platform", label: "Platform" },
    { id: "workflow", label: "Workflow" },
    { id: "use-cases", label: "Use Cases" },
    { id: "data-quality", label: "Data Quality" },
    { id: "contact", label: "Contact" },
  ],
};

const emailButton = {
  openLabel: "Email us at {{email}}",
  openingLabel: "Opening email client",
  openingShort: "Opening...",
  title: "Email {{email}}",
  titleOpening: "Opening email client...",
};

const cookie = {
  consentModal: {
    title: "We Value Your Privacy",
    description:
      'We use cookies to improve your browsing experience, remember your preferences, and analyze website traffic. Optional analytics cookies are used only with your consent. You can change your preferences at any time. See our <a href="/terms">Terms & Conditions</a> for more about how we operate the site.',
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
};

const terms = {
  backHome: "Back to homepage",
  eyebrowLabel: "Legal",
  eyebrowTag: "Terms & Conditions",
  title: "Terms & Conditions",
  intro:
    'These Terms & Conditions ("Terms") govern your access to and use of the ADealForge website located at adealforge.com (the "Site"), operated by ADealForge ("ADealForge", "we", "us", or "our"). By accessing or using the Site, you agree to be bound by these Terms. If you do not agree, you must not use the Site.',
  effective: "Effective {{date}}",
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
      body: "Any paid pilot, managed outbound program, or custom commercial scope is governed by its own proposal, order form, or master service agreement.",
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
        "The Site describes ADealForge's managed B2B outbound, prospecting, research, personalization, and related revenue-support offerings, and provides channels for prospective clients to contact us.",
        "Content on the Site is for general informational purposes only. It does not constitute a binding offer, legal advice, financial advice, or other regulated professional advice. Service scope, pricing, timelines, and deliverables are defined only in written commercial agreements executed between you and ADealForge.",
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
        "The Site and all related materials—including text, graphics, logos, icons, images, audiovisual content, software, design, and arrangement—are owned by or licensed to ADealForge and are protected by copyright, trademark, and other intellectual property laws.",
        "Subject to these Terms, we grant you a limited, non-exclusive, non-transferable, revocable license to access and use the Site for your internal business evaluation. No other rights are granted by implication or otherwise. You may not copy, modify, distribute, sell, lease, or commercially exploit Site content without our prior written consent, except for limited excerpts used in good-faith, non-commercial evaluation with attribution where customary.",
      ],
    },
    {
      title: "7. Third-Party Services and Links",
      paragraphs: [
        "The Site may integrate or link to third-party services such as analytics providers, spam-prevention tools (including CAPTCHA), payment or scheduling tools, and social media platforms. Those services are governed by their own terms and privacy policies.",
        "ADealForge does not control and is not responsible for third-party content, availability, security, or practices. Linking to a third-party site does not imply endorsement.",
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
        "TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, ADEALFORGE AND ITS AFFILIATES, OFFICERS, EMPLOYEES, AND AGENTS WILL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, EXEMPLARY, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS, REVENUE, DATA, GOODWILL, OR BUSINESS OPPORTUNITY, ARISING OUT OF OR RELATED TO YOUR USE OF (OR INABILITY TO USE) THE SITE, WHETHER BASED ON WARRANTY, CONTRACT, TORT (INCLUDING NEGLIGENCE), OR ANY OTHER LEGAL THEORY, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.",
        "TO THE MAXIMUM EXTENT PERMITTED BY LAW, OUR TOTAL LIABILITY ARISING OUT OF OR RELATED TO THE SITE WILL NOT EXCEED ONE HUNDRED U.S. DOLLARS (USD $100) OR THE MINIMUM AMOUNT REQUIRED BY APPLICABLE LAW, WHICHEVER IS GREATER. Some jurisdictions do not allow certain limitations; in those cases, our liability is limited to the fullest extent permitted.",
      ],
    },
    {
      title: "11. Indemnification",
      paragraphs: [
        "You agree to defend, indemnify, and hold harmless ADealForge and its affiliates, officers, employees, and agents from and against any claims, damages, losses, liabilities, costs, and expenses (including reasonable attorneys' fees) arising out of or related to: (a) your use of the Site; (b) your violation of these Terms; or (c) your violation of any law or third-party right in connection with the Site.",
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
        "These Terms are governed by the laws applicable in the jurisdiction where ADealForge principally conducts business, without regard to conflict-of-law principles, except where mandatory consumer or local laws provide otherwise.",
        "Before filing a formal claim, you agree to contact us at {{email}} and attempt to resolve the dispute informally within thirty (30) days. If unresolved, disputes will be resolved in the courts of competent jurisdiction in that principal place of business, unless applicable law requires another forum.",
      ],
    },
    {
      title: "14. Severability and Entire Agreement",
      paragraphs: [
        "If any provision of these Terms is held unenforceable, that provision will be enforced to the maximum extent permissible, and the remaining provisions will remain in full force and effect.",
        "These Terms, together with any notices or policies expressly referenced on the Site (including cookie preferences), constitute the entire agreement between you and ADealForge regarding Site use and supersede prior understandings on that subject. They do not supersede executed commercial agreements for paid services.",
      ],
    },
    {
      title: "15. Contact",
      paragraphs: [
        "For questions about these Terms & Conditions, contact ADealForge at {{email}}.",
        "Active clients seeking information about commercial terms, confidentiality, data processing, or deliverables should refer to their signed agreement or contact their ADealForge representative.",
      ],
    },
  ],
};

const footer = {
  title: "Start your managed outbound pilot.",
  subtitle:
    "Tell us which market, sector, or account type you want to target, and we will design a structured B2B outbound workflow around your revenue goals.",
  confidential: "Confidential, professional strategy discussion",
  scaleProof: "Outbound process proven at campaign scale up to 100,000 companies",
  successTitle: "Pilot Request Received",
  successBody:
    "Thank you. A representative will contact you through your business email within one business day to align next steps.",
  submitAnother: "Submit another request",
  fields: {
    businessName: "Business Name",
    businessNamePlaceholder: "Your company name",
    businessEmail: "Business Email",
    businessEmailPlaceholder: "you@company.com",
    targetMarket: "Target Market or Sector",
    targetMarketPlaceholder: "Describe the country, sector or company type you want to target",
    website: "Website",
  },
  loadingProtection: "Loading spam protection...",
  spamProtectionTitle: "Spam protection is still loading.",
  spamProtectionBody: "Refresh the page and try again in a few seconds.",
  submitIdle: "Get Pilot Plan",
  submitLoading: "Sending...",
  requestReadyTitle: "Your request is almost ready.",
  noSpam: "No spam. One focused reply from our team.",
  nextTitle: "What happens next",
  nextSteps: ["15-min fit call", "Targeting brief", "Pilot launch plan"],
  brandDescription:
    "ADealForge helps B2B teams turn account research into structured prospecting workflows, cleaner data, and higher-converting outreach.",
  copyright: "© 2026 ADealForge. All rights reserved.",
  tagline:
    "Managed B2B outbound lead generation: discovery, research, personalization, and sending, fully done for you.",
  navigate: "Navigate",
  termsLink: "Terms & Conditions",
  logoOptions: "Logo options",
  prefillMessage: "Target sector: {{sector}}. Please help us prepare a pilot outreach workflow.",
  validation: {
    nameRequired: "Add your company name.",
    emailRequired: "Add the best email for our reply.",
    emailInvalid: "Use a valid business email address.",
    messageRequired: "Share the market or sector you want to target.",
    turnstileRequired: "Confirm the spam check to continue.",
    turnstileExpired: "Complete the spam check before sending.",
    captchaFailed: "Captcha failed to load. Please refresh the page and try again.",
    fallbackError: "Something went wrong. Please try again or email {{email}}.",
  },
};

const en = {
  common,
  nav,
  emailButton,
  cookie,
  terms,
  footer,
  hero: {
    ...marketing.hero,
    consoleTitle: "Deal Intelligence Console",
    workspaceBadge: "Pipeline workspace",
    cards: {
      discovery: {
        title: "Prospect Discovery",
        badge: "High fit",
        items: [
          { company: "Target Company A", status: "High fit" },
          { company: "Regional Supplier", status: "Enriched" },
          { company: "Service Provider", status: "Reviewed" },
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
  platformStrip: marketing.platformStrip,
  capabilities: marketing.capabilities,
  proofBand: marketing.proofBand,
  workflow: marketing.workflow,
  sectors: marketing.sectors,
  howItWorks: marketing.howItWorks,
  dataQuality: marketing.dataQuality,
  faq: marketing.faq,
  finalCta: marketing.finalCta,
};

/** Remap old translations-branch RU onto current marketingCopy keys. */
const ruMapped = {
  common: {
    brand: "ADealForge",
    ctaBookPilot: oldRu.common?.ctaBookPilot || "Заказать пилотный звонок",
  },
  nav: {
    toggleMenuLabel: oldRu.nav?.toggleMenuLabel || "Открыть меню",
    languageLabel: oldRu.nav?.languageLabel || "Язык",
    languages: { en: "EN", ru: "RU" },
    menu: Array.isArray(oldRu.nav?.menu)
      ? oldRu.nav.menu
      : [
          { id: "platform", label: "Платформа" },
          { id: "workflow", label: "Процесс" },
          { id: "use-cases", label: "Сценарии" },
          { id: "data-quality", label: "Качество данных" },
          { id: "contact", label: "Контакты" },
        ],
  },
  emailButton: {
    openLabel: "Написать на {{email}}",
    openingLabel: "Открытие почтового клиента",
    openingShort: "Открываем...",
    title: "Email {{email}}",
    titleOpening: "Открытие почтового клиента...",
  },
  cookie: {
    consentModal: {
      title: "Мы уважаем вашу конфиденциальность",
      description:
        'Мы используем файлы cookie, чтобы улучшить работу сайта, запомнить ваши настройки и анализировать трафик. Дополнительные аналитические cookie применяются только с вашего согласия. Вы можете изменить предпочтения в любое время. Подробнее — в <a href="/terms">Условиях использования</a>.',
      acceptAllBtn: "Принять все",
      acceptNecessaryBtn: "Отклонить необязательные",
      showPreferencesBtn: "Настроить",
    },
    preferencesModal: {
      title: "Настройки конфиденциальности",
      acceptAllBtn: "Принять все",
      acceptNecessaryBtn: "Отклонить необязательные",
      savePreferencesBtn: "Сохранить",
      closeIconLabel: "Закрыть",
      sections: [
        {
          title: "Ваш выбор",
          description:
            "Выберите, какие дополнительные сервисы можно включить. Необходимые cookie обеспечивают работу сайта и сохраняют ваш выбор.",
        },
        {
          title: "Необходимые",
          description: "Нужны для базовой работы сайта и хранения ваших настроек согласия.",
          linkedCategory: "necessary",
        },
        {
          title: "Аналитика",
          description:
            "Google Analytics 4 помогает измерять посещаемость и производительность страниц, если вы разрешите аналитические cookie.",
          linkedCategory: "analytics",
        },
      ],
    },
  },
  hero: {
    eyebrow: oldRu.hero?.badge || "Управляемая B2B outbound-генерация лидов",
    headlineLead:
      oldRu.hero?.titleLead || "Создавайте предсказуемый поток квалифицированных B2B-возможностей",
    headlineAccent: oldRu.hero?.titleAccent || "без собственной SDR-команды",
    subheadline:
      oldRu.hero?.subtitle ||
      "Мы находим подходящие компании, исследуем каждый аккаунт и запускаем персонализированный первый контакт — под ключ.",
    primaryCta: oldRu.common?.ctaBookPilot || "Заказать пилотный звонок",
    secondaryCta: oldRu.hero?.ctaWorkflow || "Смотреть процесс доставки",
    processLine: oldRu.hero?.trustSteps || [
      "Поиск",
      "Исследование",
      "Проверка",
      "Персонализация",
      "Аутбаунд",
    ],
    pills: oldRu.hero?.trustPills || [
      "Для основателей и sales-лидеров",
      "Для разных B2B-отраслей",
      "Полностью под нашим управлением",
    ],
    proofLine:
      oldRu.hero?.trustProof || "Проверено на outbound-программах масштабом до 100 000 компаний.",
    consoleTitle: oldRu.hero?.consoleTitle || "Deal Intelligence Console",
    workspaceBadge: oldRu.hero?.workspaceBadge || "Pipeline workspace",
    cards: {
      discovery: oldRu.hero?.cards?.discovery,
      intelligence: oldRu.hero?.cards?.intelligence,
      workflowCard: oldRu.hero?.cards?.workflow,
    },
  },
  platformStrip: {
    kicker: oldRu.nav?.managedOutbound || "Управляемый outbound",
    title: oldRu.platformOverview?.title,
    subtitle: oldRu.platformOverview?.subtitle,
    values: Array.isArray(oldRu.platformOverview?.items)
      ? oldRu.platformOverview.items.map((item) => ({
          title: item.title,
          desc: item.desc,
          stage: item.stage,
        }))
      : undefined,
    cta: oldRu.common?.ctaBookPilot,
    footnote: oldRu.platformOverview?.proof,
  },
  capabilities: oldRu.capabilities
    ? {
        eyebrow: {
          label: oldRu.capabilities.eyebrowLabel || oldRu.capabilities.eyebrow?.label,
          tag: oldRu.capabilities.eyebrowTag || oldRu.capabilities.eyebrow?.tag,
        },
        title: oldRu.capabilities.title,
        subtitle: oldRu.capabilities.subtitle,
        pills: oldRu.capabilities.pills,
        chips: oldRu.capabilities.chips,
        primaryCta: oldRu.common?.ctaBookPilot || oldRu.capabilities.primaryCta,
        secondaryCta: oldRu.capabilities.ctaSteps || oldRu.capabilities.secondaryCta,
        items: Array.isArray(oldRu.capabilities.details)
          ? oldRu.capabilities.details.map((item) => ({
              title: item.title,
              desc: item.desc,
            }))
          : oldRu.capabilities.items,
      }
    : undefined,
  proofBand: Array.isArray(oldRu.proofBand?.items)
    ? oldRu.proofBand.items.map((item) => ({
        stat: item.stat || item.value || item.title,
        label: item.label || item.desc || item.description,
      }))
    : Array.isArray(oldRu.proofBand)
      ? oldRu.proofBand
      : undefined,
  workflow: oldRu.workflow
    ? {
        ...oldRu.workflow,
        cta: oldRu.common?.ctaBookPilot || oldRu.workflow.cta,
        sampleAccountIntro:
          oldRu.workflow.sampleAccountDescription || oldRu.workflow.sampleAccountIntro,
        exportCta: oldRu.workflow.ctaMarket || oldRu.workflow.exportCta,
        exportNote: oldRu.workflow.deliveredAs || oldRu.workflow.exportNote,
        detailLabel: oldRu.workflow.workspaceDetail || oldRu.workflow.detailLabel,
        deliverablesTitle: oldRu.workflow.whatTeamGets || oldRu.workflow.deliverablesTitle,
        outcomeTitle: oldRu.workflow.whatThisMeans || oldRu.workflow.outcomeTitle,
        workspaceNote: oldRu.workflow.workspaceManaged || oldRu.workflow.workspaceNote,
      }
    : undefined,
  sectors: oldRu.sectors
    ? {
        ...oldRu.sectors,
        eyebrow: {
          label: oldRu.sectors.eyebrowLabel || oldRu.sectors.eyebrow?.label,
          tag: oldRu.sectors.eyebrowTag || oldRu.sectors.eyebrow?.tag,
        },
        ctaLink: oldRu.sectors.ctaLink,
        items: oldRu.sectors.items,
      }
    : undefined,
  howItWorks: oldRu.howItWorks
    ? {
        ...oldRu.howItWorks,
        eyebrow: {
          label: oldRu.howItWorks.eyebrowLabel || oldRu.howItWorks.eyebrow?.label,
          tag: oldRu.howItWorks.eyebrowTag || oldRu.howItWorks.eyebrow?.tag,
        },
        sidebar: oldRu.howItWorks.sidebar || oldRu.howItWorks.subtitle,
        cta: oldRu.common?.ctaBookPilot || oldRu.howItWorks.cta,
      }
    : undefined,
  dataQuality: oldRu.dataQuality
    ? {
        ...oldRu.dataQuality,
        eyebrow: {
          label: oldRu.dataQuality.eyebrowLabel || oldRu.dataQuality.eyebrow?.label,
          tag: oldRu.dataQuality.eyebrowTag || oldRu.dataQuality.eyebrow?.tag,
        },
        cta: oldRu.dataQuality.cta || oldRu.dataQuality.ctaMarket,
      }
    : undefined,
  faq: oldRu.faq
    ? {
        ...oldRu.faq,
        eyebrow: {
          label: oldRu.faq.eyebrowLabel || oldRu.faq.eyebrow?.label,
          tag: oldRu.faq.eyebrowTag || oldRu.faq.eyebrow?.tag,
        },
        footerNote: oldRu.faq.stillQuestion || oldRu.faq.footerNote || oldRu.faq.note,
        cta: oldRu.common?.ctaBookPilot || oldRu.faq.cta,
        items: Array.isArray(oldRu.faq.items)
          ? oldRu.faq.items.map((item) => ({
              q: item.q || item.question,
              a: item.a || item.answer,
            }))
          : undefined,
      }
    : undefined,
  finalCta: oldRu.finalCta
    ? {
        eyebrow: oldRu.finalCta.badge || oldRu.finalCta.eyebrow,
        title: oldRu.finalCta.title,
        subtitle: oldRu.finalCta.subtitle,
        primaryCta: oldRu.common?.ctaBookPilot || oldRu.finalCta.primaryCta,
        secondaryCta:
          oldRu.finalCta.reviewWorkflow ||
          oldRu.finalCta.secondaryCta ||
          oldRu.finalCta.ctaWorkflow,
        footnote:
          oldRu.finalCta.line1 && oldRu.finalCta.line2
            ? [oldRu.finalCta.line1, oldRu.finalCta.line2]
            : oldRu.finalCta.footnote || oldRu.finalCta.trustLine,
      }
    : undefined,
  footer: {
    ...oldRu.footer,
    title: oldRu.footer?.title || "Запустите управляемый outbound-пилот.",
    navigate: "Навигация",
    termsLink: "Условия использования",
    logoOptions: "Варианты логотипа",
    tagline:
      "Управляемая B2B outbound-генерация лидов: поиск, исследование, персонализация и отправка — полностью под нашим управлением.",
  },
  terms: {
    backHome: "На главную",
    eyebrowLabel: "Правовая информация",
    eyebrowTag: "Условия использования",
    title: "Условия использования",
    intro:
      'Настоящие Условия использования ("Условия") регулируют доступ к сайту ADealForge по адресу adealforge.com ("Сайт"), которым управляет ADealForge ("ADealForge", "мы", "нас" или "наш"). Получая доступ к Сайту или используя его, вы соглашаетесь соблюдать эти Условия. Если вы не согласны, пожалуйста, не используйте Сайт.',
    effective: "Действуют с {{date}}",
    summaryTitle: "Кратко",
    sectionsHeading: "Условия использования сайта",
    sectionsIntro:
      "Внимательно ознакомьтесь с пронумерованными разделами перед использованием Сайта или отправкой заявки.",
    footerNote: "Нужна копия подписанного клиентского договора? Напишите на {{email}}.",
    summaryCards: [
      {
        title: "Использование сайта",
        body: "Эти Условия применяются к просмотру, запросам и публичным материалам на Сайте. Они не заменяют подписанный коммерческий договор на платные услуги.",
      },
      {
        title: "Клиентские проекты",
        body: "Любой платный пилот, управляемый outbound-проект или индивидуальный коммерческий объём регулируется отдельным предложением, формой заказа или соглашением об услугах.",
      },
      {
        title: "Вопросы",
        body: "По вопросам об этих Условиях, конфиденциальности, cookie или документах по вашему проекту свяжитесь с нами — мы направим вас к нужному документу.",
      },
    ],
    sections: en.terms.sections.map((section, index) => {
      const titlesRu = [
        "1. Принятие Условий",
        "2. Изменения Условий",
        "3. Описание Сайта и услуг",
        "4. Запросы и отправляемая информация",
        "5. Допустимое использование",
        "6. Интеллектуальная собственность",
        "7. Сторонние сервисы и ссылки",
        "8. Cookie и аналитика",
        "9. Отказ от гарантий",
        "10. Ограничение ответственности",
        "11. Возмещение убытков",
        "12. Прекращение доступа",
        "13. Применимое право и споры",
        "14. Делимость и полнота соглашения",
        "15. Контакты",
      ];
      return {
        title: titlesRu[index] || section.title,
        paragraphs: section.paragraphs,
      };
    }),
  },
};

const ru = deepMergePreferOld(en, ruMapped);

const outDir = path.join(root, "src/i18n/locales");
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, "en.ts"), toTsModule("en", en));
fs.writeFileSync(path.join(outDir, "ru.ts"), toTsModule("ru", ru));

const sample = ru.hero.headlineLead;
console.log("Wrote locales. RU hero lead:", sample);
console.log("RU nav[0]:", ru.nav.menu[0]?.label);
console.log("Has Cyrillic hero:", /[А-Яа-я]/.test(sample));
