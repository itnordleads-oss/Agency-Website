import React from "react";
import { socialIconBaseClass, socialLinkItems } from "../lib/socialLinks";
import "./contactSocialSection.css";

interface ContactSocialSectionProps {
  title: string;
  subtitle: string;
}

export default function ContactSocialSection({ title, subtitle }: ContactSocialSectionProps) {
  return (
    <section
      className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6 shadow-[0_12px_40px_rgba(0,0,0,0.22)]"
      aria-labelledby="contact-social-heading"
    >
      <div className="mb-5 space-y-1.5">
        <h2 id="contact-social-heading" className="text-sm font-semibold tracking-tight text-white">
          {title}
        </h2>
        <p className="text-sm leading-relaxed text-white/60">{subtitle}</p>
      </div>

      <div className="grid grid-cols-2 items-stretch gap-3 sm:grid-cols-3">
        {socialLinkItems.map((item) => {
          const shortLabel =
            item.key === "email"
              ? "Email"
              : item.label.replace(/^(Chat on |Follow on |Email )/, "");

          return (
            <a
              key={item.key}
              href={item.href}
              target={item.key === "email" ? undefined : "_blank"}
              rel={item.key === "email" ? undefined : "noopener noreferrer"}
              aria-label={item.label}
              title={item.label}
              className={`contact-social-card group ${socialIconBaseClass} ${item.platformClass} !h-auto !w-full min-h-[3.25rem] !rounded-xl flex-col justify-center gap-2 px-3 py-3.5 hover:scale-110 active:scale-105`}
            >
              <span className="motion-reduce:transition-none">{item.icon}</span>
              <span className="text-center text-[0.6875rem] font-medium leading-tight text-white/55 transition-colors duration-300 ease-out group-hover:text-white/85">
                {shortLabel}
              </span>
            </a>
          );
        })}
      </div>
    </section>
  );
}
