import React from "react";
import { MessagesSquare, Code2, Layers, ListChecks, type LucideIcon } from "lucide-react";
import SectionEyebrow from "../SectionEyebrow";
import { useSiteCopy } from "../../lib/useSiteCopy";
import { HOME_AGENCY_INTRO, HOME_AGENCY_SECTION, HOME_AGENCY_SHELL } from "./homeAgencyLayout";

const VALUE_ICONS: LucideIcon[] = [MessagesSquare, Code2, Layers, ListChecks];

/**
 * Why work with us — editorial lead principle + supporting qualities.
 */
export default function HomeAgencyValue() {
  const { homepageV3 } = useSiteCopy();
  const { value } = homepageV3;
  const [lead, ...supporting] = value.items;

  return (
    <section id="value" className={HOME_AGENCY_SECTION} aria-labelledby="agency-value-heading">
      <div className={HOME_AGENCY_SHELL}>
        <div className="grid items-start gap-7 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-10 xl:gap-14">
          <div className={HOME_AGENCY_INTRO}>
            <span data-homepage-scroll-ref="value">
              <SectionEyebrow label={value.eyebrow} />
            </span>
            <h2 id="agency-value-heading" className="section-title text-left">
              {value.title}
            </h2>
            <p className="text-body text-[0.95rem] leading-relaxed text-white/68 sm:text-base">
              {value.subtitle}
            </p>
          </div>

          <div className="min-w-0 space-y-3">
            {lead ? (
              <article className="relative overflow-hidden rounded-2xl border border-white/12 bg-white/[0.035] p-4 sm:p-5">
                <div
                  className="pointer-events-none absolute inset-0"
                  style={{
                    backgroundImage:
                      "radial-gradient(360px circle at 100% 0%, rgba(0,210,255,0.10), transparent 55%)",
                  }}
                />
                <div className="relative z-10 flex gap-3.5">
                  <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/12 bg-white/[0.04]">
                    <MessagesSquare className="h-4 w-4 text-[#00D2FF]" aria-hidden />
                  </span>
                  <div className="min-w-0">
                    <h3 className="text-base font-semibold text-white sm:text-lg">{lead.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-white/65">
                      {lead.description}
                    </p>
                  </div>
                </div>
              </article>
            ) : null}

            <ul className="m-0 grid list-none grid-cols-1 gap-2.5 p-0 sm:grid-cols-3 sm:gap-0 sm:divide-x sm:divide-white/10 sm:rounded-2xl sm:border sm:border-white/10 sm:bg-white/[0.02]">
              {supporting.map((item, index) => {
                const Icon = VALUE_ICONS[index + 1] ?? ListChecks;
                return (
                  <li
                    key={item.title}
                    className="min-w-0 rounded-xl border border-white/10 p-3.5 sm:rounded-none sm:border-0 sm:p-4"
                  >
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-white/12 bg-white/[0.04]">
                      <Icon className="h-3.5 w-3.5 text-[#00D2FF]" aria-hidden />
                    </span>
                    <h3 className="mt-2.5 text-sm font-semibold text-white">{item.title}</h3>
                    <p className="mt-1 text-sm leading-snug text-white/60">{item.description}</p>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
