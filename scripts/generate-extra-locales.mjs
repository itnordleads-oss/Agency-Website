import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const require = createRequire(import.meta.url);

function loadEn() {
  const tsSource = fs.readFileSync(path.join(root, "src/i18n/locales/en.ts"), "utf8");
  const transformed = tsSource
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/^\s*\/\/.*$/gm, "")
    .replace(/const en = /, "module.exports = ")
    .replace(/ as const;/, ";")
    .replace(/\nexport default en;\s*$/, "\n");
  const tmp = path.join(root, "scripts/.tmp-en-locale.cjs");
  fs.writeFileSync(tmp, transformed);
  try {
    return require(tmp);
  } finally {
    fs.unlinkSync(tmp);
  }
}

function deepMerge(base, patch) {
  if (patch === undefined) return base;
  if (typeof patch === "string") return patch;
  if (Array.isArray(patch)) {
    return patch.map((item, i) => deepMerge(base?.[i], item));
  }
  if (patch && typeof patch === "object") {
    const out = Array.isArray(base) ? [...base] : { ...base };
    for (const key of Object.keys(patch)) {
      out[key] = deepMerge(base?.[key], patch[key]);
    }
    return out;
  }
  return patch;
}

function toTsModule(name, value) {
  return `const ${name} = ${JSON.stringify(value, null, 2)} as const;\n\nexport default ${name};\n`;
}

const en = loadEn();

const languageLabels = {
  de: "DE",
  es: "ES",
  fr: "FR",
  pt: "PT",
  it: "IT",
  zh: "ZH",
};

const overlays = {
  de: {
    common: { ctaBookPilot: "Pilot-Strategiegespräch buchen" },
    nav: {
      toggleMenuLabel: "Menü umschalten",
      languageLabel: "Sprache",
      languages: languageLabels,
      menu: [
        { id: "platform", label: "Plattform" },
        { id: "workflow", label: "Workflow" },
        { id: "use-cases", label: "Anwendungsfälle" },
        { id: "data-quality", label: "Datenqualität" },
        { id: "contact", label: "Kontakt" },
      ],
    },
    emailButton: {
      openLabel: "E-Mail an {{email}}",
      openingLabel: "E-Mail-Client wird geöffnet",
      openingShort: "Öffnen...",
      title: "E-Mail {{email}}",
      titleOpening: "E-Mail-Client wird geöffnet...",
    },
    cookie: {
      consentModal: {
        title: "Wir respektieren Ihre Privatsphäre",
        description:
          'Wir verwenden Cookies, um Ihr Surferlebnis zu verbessern, Ihre Einstellungen zu speichern und den Website-Traffic zu analysieren. Optionale Analyse-Cookies werden nur mit Ihrer Zustimmung verwendet. Sie können Ihre Einstellungen jederzeit ändern. Weitere Informationen finden Sie in unseren <a href="/terms">Allgemeinen Geschäftsbedingungen</a>.',
        acceptAllBtn: "Alle akzeptieren",
        acceptNecessaryBtn: "Optionale ablehnen",
        showPreferencesBtn: "Einstellungen verwalten",
      },
      preferencesModal: {
        title: "Datenschutzeinstellungen",
        acceptAllBtn: "Alle akzeptieren",
        acceptNecessaryBtn: "Optionale ablehnen",
        savePreferencesBtn: "Einstellungen speichern",
        closeIconLabel: "Schließen",
        sections: [
          {
            title: "Ihre Datenschutzauswahl",
            description:
              "Wählen Sie, welche optionalen Dienste wir aktivieren dürfen. Notwendige Cookies halten die Website funktionsfähig und speichern Ihre Zustimmung.",
          },
          {
            title: "Notwendig",
            description:
              "Erforderlich für den Betrieb der Website und zum Speichern Ihrer Cookie-Einstellungen.",
          },
          {
            title: "Analyse",
            description:
              "Google Analytics 4 hilft uns, Traffic und Seitenleistung zu messen, wenn Sie Analyse-Cookies erlauben.",
          },
        ],
      },
    },
    footer: {
      title: "Starten Sie Ihren verwalteten Outbound-Piloten.",
      subtitle:
        "Nennen Sie uns Markt, Branche oder Account-Typ — wir entwerfen einen strukturierten B2B-Outbound-Workflow für Ihre Umsatzziele.",
      confidential: "Vertrauliches, professionelles Strategiegespräch",
      scaleProof: "Outbound-Prozess bewährt bis zu 100.000 Unternehmen",
      successTitle: "Pilotanfrage erhalten",
      successBody:
        "Vielen Dank. Ein Mitarbeiter kontaktiert Sie innerhalb eines Werktags per Geschäfts-E-Mail.",
      submitAnother: "Weitere Anfrage senden",
      fields: {
        businessName: "Firmenname",
        businessNamePlaceholder: "Name Ihres Unternehmens",
        businessEmail: "Geschäfts-E-Mail",
        businessEmailPlaceholder: "sie@unternehmen.com",
        targetMarket: "Zielmarkt oder Branche",
        targetMarketPlaceholder: "Land, Branche oder Unternehmenstyp beschreiben",
      },
      loadingProtection: "Spam-Schutz wird geladen...",
      spamProtectionTitle: "Spam-Schutz wird noch geladen.",
      spamProtectionBody: "Seite aktualisieren und in wenigen Sekunden erneut versuchen.",
      submitIdle: "Pilotplan anfordern",
      submitLoading: "Senden...",
      requestReadyTitle: "Ihre Anfrage ist fast fertig.",
      noSpam: "Kein Spam. Eine fokussierte Antwort von unserem Team.",
      nextTitle: "Wie es weitergeht",
      nextSteps: ["15-Min-Fit-Call", "Targeting-Brief", "Pilot-Startplan"],
      brandDescription:
        "ADealForge hilft B2B-Teams, Account-Recherche in strukturierte Prospecting-Workflows, saubere Daten und bessere Outreach-Ergebnisse zu verwandeln.",
      navigate: "Navigation",
      termsLink: "Allgemeine Geschäftsbedingungen",
      logoOptions: "Logo-Optionen",
      prefillMessage:
        "Zielbranche: {{sector}}. Bitte helfen Sie uns, einen Pilot-Outreach-Workflow vorzubereiten.",
      validation: {
        nameRequired: "Bitte Firmennamen angeben.",
        emailRequired: "Bitte E-Mail für unsere Antwort angeben.",
        emailInvalid: "Bitte gültige Geschäfts-E-Mail verwenden.",
        messageRequired: "Bitte Zielmarkt oder Branche angeben.",
        turnstileRequired: "Spam-Prüfung bestätigen, um fortzufahren.",
        turnstileExpired: "Spam-Prüfung vor dem Senden abschließen.",
        captchaFailed: "Captcha konnte nicht geladen werden. Seite aktualisieren.",
        fallbackError: "Etwas ist schiefgelaufen. Erneut versuchen oder {{email}} schreiben.",
      },
    },
    hero: {
      eyebrow: "Verwaltete B2B-Outbound-Lead-Generierung",
      headlineLead: "Aufbau einer planbaren Pipeline qualifizierter B2B-Chancen",
      headlineAccent: "ohne internes SDR-Team",
      subheadline:
        "Wir identifizieren passende Accounts, recherchieren jedes Unternehmen und führen personalisierte Erstkontakte aus — Ihr Team konzentriert sich auf Meetings und Abschlüsse.",
      primaryCta: "Pilot-Strategiegespräch buchen",
      secondaryCta: "Lieferprozess ansehen",
      proofLine: "Bewährt in Outbound-Programmen bis zu 100.000 Unternehmen.",
    },
    platformStrip: {
      kicker: "Verwaltetes Outbound",
      title: "Vollständige Outbound-Ausführung von Spezialisten.",
      subtitle:
        "Wir erstellen qualifizierte Account-Listen, recherchieren jeden Account und liefern personalisierte Erstkontakt-Kampagnen.",
      cta: "Pilot-Strategiegespräch buchen",
      footnote: "Bewährt im Outbound-Maßstab bis zu 100.000 Unternehmen",
    },
    finalCta: {
      title: "Verwandeln Sie Ihren Zielmarkt in konstante qualifizierte Gespräche.",
      subtitle:
        "Starten Sie mit einem fokussierten Piloten. Wir übernehmen Recherche, Personalisierung und Kampagnenausführung.",
      primaryCta: "Pilot-Strategiegespräch buchen",
      secondaryCta: "Workflow-Schritte ansehen",
    },
    contactPage: {
      backHome: "Zur Startseite",
      eyebrowLabel: "Kontakt",
      eyebrowTag: "Pilot anfragen",
    },
  },
  es: {
    common: { ctaBookPilot: "Reservar llamada estratégica piloto" },
    nav: {
      toggleMenuLabel: "Alternar menú",
      languageLabel: "Idioma",
      languages: languageLabels,
      menu: [
        { id: "platform", label: "Plataforma" },
        { id: "workflow", label: "Flujo de trabajo" },
        { id: "use-cases", label: "Casos de uso" },
        { id: "data-quality", label: "Calidad de datos" },
        { id: "contact", label: "Contacto" },
      ],
    },
    emailButton: {
      openLabel: "Escríbenos a {{email}}",
      openingLabel: "Abriendo cliente de correo",
      title: "Correo {{email}}",
      titleOpening: "Abriendo cliente de correo...",
    },
    footer: {
      title: "Inicie su piloto outbound gestionado.",
      subtitle:
        "Indíquenos mercado, sector o tipo de cuenta y diseñaremos un flujo B2B outbound estructurado.",
      submitIdle: "Obtener plan piloto",
      submitLoading: "Enviando...",
      navigate: "Navegar",
      termsLink: "Términos y condiciones",
    },
    hero: {
      headlineLead: "Construya un pipeline predecible de oportunidades B2B calificadas",
      headlineAccent: "sin crear un equipo SDR interno",
      primaryCta: "Reservar llamada estratégica piloto",
      secondaryCta: "Ver proceso de entrega",
    },
    contactPage: {
      backHome: "Volver al inicio",
      eyebrowLabel: "Contacto",
      eyebrowTag: "Solicitar piloto",
    },
  },
  fr: {
    common: { ctaBookPilot: "Réserver un appel stratégique pilote" },
    nav: {
      toggleMenuLabel: "Basculer le menu",
      languageLabel: "Langue",
      languages: languageLabels,
      menu: [
        { id: "platform", label: "Plateforme" },
        { id: "workflow", label: "Workflow" },
        { id: "use-cases", label: "Cas d'usage" },
        { id: "data-quality", label: "Qualité des données" },
        { id: "contact", label: "Contact" },
      ],
    },
    footer: {
      title: "Lancez votre pilote outbound géré.",
      submitIdle: "Obtenir le plan pilote",
      submitLoading: "Envoi...",
      navigate: "Navigation",
      termsLink: "Conditions générales",
    },
    hero: {
      headlineLead: "Construisez un pipeline prévisible d'opportunités B2B qualifiées",
      headlineAccent: "sans équipe SDR interne",
      primaryCta: "Réserver un appel stratégique pilote",
    },
    contactPage: {
      backHome: "Retour à l'accueil",
      eyebrowLabel: "Contact",
      eyebrowTag: "Demander un pilote",
    },
  },
  pt: {
    common: { ctaBookPilot: "Agendar chamada estratégica piloto" },
    nav: {
      toggleMenuLabel: "Alternar menu",
      languageLabel: "Idioma",
      languages: languageLabels,
      menu: [
        { id: "platform", label: "Plataforma" },
        { id: "workflow", label: "Fluxo de trabalho" },
        { id: "use-cases", label: "Casos de uso" },
        { id: "data-quality", label: "Qualidade de dados" },
        { id: "contact", label: "Contato" },
      ],
    },
    footer: {
      title: "Inicie seu piloto outbound gerenciado.",
      submitIdle: "Obter plano piloto",
      submitLoading: "Enviando...",
      navigate: "Navegar",
      termsLink: "Termos e condições",
    },
    hero: {
      headlineLead: "Construa um pipeline previsível de oportunidades B2B qualificadas",
      headlineAccent: "sem equipe SDR interna",
      primaryCta: "Agendar chamada estratégica piloto",
    },
    contactPage: {
      backHome: "Voltar ao início",
      eyebrowLabel: "Contato",
      eyebrowTag: "Solicitar piloto",
    },
  },
  it: {
    common: { ctaBookPilot: "Prenota call strategica pilota" },
    nav: {
      toggleMenuLabel: "Apri/chiudi menu",
      languageLabel: "Lingua",
      languages: languageLabels,
      menu: [
        { id: "platform", label: "Piattaforma" },
        { id: "workflow", label: "Workflow" },
        { id: "use-cases", label: "Casi d'uso" },
        { id: "data-quality", label: "Qualità dati" },
        { id: "contact", label: "Contatto" },
      ],
    },
    footer: {
      title: "Avvia il tuo pilota outbound gestito.",
      submitIdle: "Ottieni piano pilota",
      submitLoading: "Invio...",
      navigate: "Naviga",
      termsLink: "Termini e condizioni",
    },
    hero: {
      headlineLead: "Costruisci un pipeline prevedibile di opportunità B2B qualificate",
      headlineAccent: "senza un team SDR interno",
      primaryCta: "Prenota call strategica pilota",
    },
    contactPage: {
      backHome: "Torna alla home",
      eyebrowLabel: "Contatto",
      eyebrowTag: "Richiedi pilota",
    },
  },
  zh: {
    common: { ctaBookPilot: "预约试点战略通话" },
    nav: {
      toggleMenuLabel: "切换菜单",
      languageLabel: "语言",
      languages: languageLabels,
      menu: [
        { id: "platform", label: "平台" },
        { id: "workflow", label: "工作流程" },
        { id: "use-cases", label: "使用场景" },
        { id: "data-quality", label: "数据质量" },
        { id: "contact", label: "联系" },
      ],
    },
    footer: {
      title: "启动托管出站试点。",
      submitIdle: "获取试点计划",
      submitLoading: "发送中...",
      navigate: "导航",
      termsLink: "条款与条件",
    },
    hero: {
      headlineLead: "建立可预测的合格 B2B 商机管道",
      headlineAccent: "无需自建 SDR 团队",
      primaryCta: "预约试点战略通话",
      secondaryCta: "查看交付流程",
    },
    contactPage: {
      backHome: "返回首页",
      eyebrowLabel: "联系",
      eyebrowTag: "申请试点",
    },
  },
};

const contactPageEn = {
  backHome: "Back to homepage",
  eyebrowLabel: "Contact",
  eyebrowTag: "Request a pilot",
};

const outDir = path.join(root, "src/i18n/locales");
for (const [code, overlay] of Object.entries(overlays)) {
  const merged = deepMerge(deepMerge(en, { contactPage: contactPageEn }), overlay);
  merged.nav.languages = { ...en.nav.languages, ...languageLabels, en: "EN", ru: "RU" };
  fs.writeFileSync(path.join(outDir, `${code}.ts`), toTsModule(code, merged));
}

console.log("Generated locales:", Object.keys(overlays).join(", "));
