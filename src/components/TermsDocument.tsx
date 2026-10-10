import React from "react";
import BackToHomepage from "./BackToHomepage";
import "./termsDocument.css";

export type TermsSection = {
  title: string;
  paragraphs: string[];
};

export type TermsDocumentContent = {
  backHome: string;
  legalLabel: string;
  title: string;
  intro: string;
  effectiveLabel: string;
  lastUpdatedLabel: string;
  questionsTitle?: string;
  questionsBody?: string;
  sections: TermsSection[];
  contactEmail: string;
};

interface TermsDocumentProps {
  content: TermsDocumentContent;
}

function stripSectionNumber(title: string) {
  return title.replace(/^\d+\.\s*/, "");
}

function sectionId(title: string, index: number) {
  const slug = stripSectionNumber(title)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  return `terms-section-${index + 1}${slug ? `-${slug}` : ""}`;
}

function isContactSection(title: string) {
  return /^contact$/i.test(stripSectionNumber(title));
}

/** Keep the email address visible only in the Contact section. */
function resolveParagraphText(paragraph: string, email: string, showEmail: boolean) {
  if (showEmail) {
    return paragraph.replace(/\{\{email\}\}/g, email);
  }

  return paragraph
    .replace(/\s*at\s*\{\{email\}\}/gi, "")
    .replace(/\s*\{\{email\}\}/g, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function renderWithEmail(text: string, email: string, showEmail: boolean) {
  if (!showEmail) {
    return text;
  }

  const parts = text.split(email);

  return parts.map((part, index) => (
    <React.Fragment key={`${part}-${index}`}>
      {part}
      {index < parts.length - 1 ? <a href={`mailto:${email}`}>{email}</a> : null}
    </React.Fragment>
  ));
}

export default function TermsDocument({ content }: TermsDocumentProps) {
  return (
    <article className="terms-document">
      <BackToHomepage label={content.backHome} />

      <header className="terms-document__header">
        <p className="terms-document__label">{content.legalLabel}</p>
        <h1 className="terms-document__title">{content.title}</h1>
        <p className="terms-document__intro">{content.intro}</p>
        <p className="terms-document__meta">{content.effectiveLabel}</p>
        <p className="terms-document__meta">{content.lastUpdatedLabel}</p>
      </header>

      <div className="terms-document__body">
        {content.sections.map((section, index) => {
          const showEmail = isContactSection(section.title);

          return (
            <section
              key={section.title}
              id={sectionId(section.title, index)}
              className="terms-document__section"
              aria-labelledby={`${sectionId(section.title, index)}-title`}
            >
              <h2 id={`${sectionId(section.title, index)}-title`}>{section.title}</h2>
              {section.paragraphs.map((paragraph) => {
                const text = resolveParagraphText(paragraph, content.contactEmail, showEmail);
                return (
                  <p key={paragraph}>{renderWithEmail(text, content.contactEmail, showEmail)}</p>
                );
              })}
            </section>
          );
        })}

        {content.questionsTitle || content.questionsBody ? (
          <section className="terms-document__questions" aria-labelledby="terms-contact-title">
            <h2 id="terms-contact-title">{content.questionsTitle || "Questions?"}</h2>
            {content.questionsBody ? <p>{content.questionsBody}</p> : null}
          </section>
        ) : null}
      </div>
    </article>
  );
}
