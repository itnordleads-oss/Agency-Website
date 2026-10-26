import React from "react";
import { socialIconBaseClass, socialLinkItems } from "../lib/socialLinks";
import "./contactSocialSection.css";

interface ContactSocialSectionProps {
  title: string;
  subtitle: string;
}

export default function ContactSocialSection({ title, subtitle }: ContactSocialSectionProps) {
  if (socialLinkItems.length === 0) {
    return null;
  }

  return (
    <section
      className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:p-6 shadow-[0_12px_40px_rgba(0,0,0,0.22)]"
      aria-labelledby="contact-social-heading"
    >
      <div className="mb-5 space-y-1.5">
        <h2 id="contact-social-heading" className="contact-social-heading">
          {title}
        </h2>
        <p className="contact-social-subtitle">{subtitle}</p>
      </div>

      <div className="grid grid-cols-1 items-stretch gap-3 min-[390px]:grid-cols-2 sm:grid-cols-3">
        {socialLinkItems.map((item) => {
          const shortLabel =
            item.key === "email"
              ? "Email"
              : item.label.replace(/^(Chat on |Follow on |Email |Visit Nordlead Studio on )/, "");

          return (
            <a
              key={item.key}
              href={item.href}
              target={item.key === "email" ? undefined : "_blank"}
              rel={item.key === "email" ? undefined : "noopener noreferrer"}
              aria-label={item.label}
              title={item.label}
              className={`contact-social-card group ${socialIconBaseClass} ${item.platformClass} !h-auto !w-full min-h-11 !rounded-xl flex-col justify-center gap-2 px-3 py-3.5`}
            >
              <span className="motion-reduce:transition-none [&_svg]:h-5 [&_svg]:w-5" aria-hidden>
                {item.icon}
              </span>
              <span className="contact-social-card-label text-center transition-colors duration-300 ease-out group-hover:text-white">
                {shortLabel}
              </span>
            </a>
          );
        })}
      </div>
    </section>
  );
}
