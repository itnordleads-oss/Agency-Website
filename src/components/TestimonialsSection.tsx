import React from "react";
import { Star } from "lucide-react";
import SectionEyebrow from "./SectionEyebrow";
import GlassCard from "./GlassCard";
import NewHomeSectionCardBorder from "./NewHomeSectionCardBorder";
import { isTestimonialsModuleEnabled } from "../lib/trustModules";
import { useSiteCopy } from "../lib/useSiteCopy";

export default function TestimonialsSection() {
  const { testimonials } = useSiteCopy();
  const items = Array.isArray(testimonials.items) ? testimonials.items : [];

  if (!isTestimonialsModuleEnabled() || items.length === 0) {
    return null;
  }

  return (
    <section className="section-padding relative overflow-hidden" id="testimonials">
      <div className="absolute top-1/3 left-[15%] w-[340px] h-[340px] rounded-full bg-[#3D81E3]/5 blur-[80px] md:blur-[150px] pointer-events-none motion-reduce:hidden" />

      <div className="max-w-7xl mx-auto px-3 min-[341px]:px-4 sm:px-6 relative z-10 min-w-0">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-10 md:mb-14">
          <div className="flex justify-center">
            <SectionEyebrow label={testimonials.eyebrow.label} tag={testimonials.eyebrow.tag} />
          </div>
          <h2 className="section-title">{testimonials.title}</h2>
          <p className="text-body text-base md:text-lg leading-relaxed">{testimonials.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {items.map((item) => (
            <NewHomeSectionCardBorder
              key={`${item.name}-${item.company}`}
              className="h-full rounded-2xl"
            >
              <GlassCard
                glowColor="cyan"
                className="h-full flex flex-col justify-between border border-white/[0.08] bg-white/[0.015] p-6"
              >
                <div className="space-y-5">
                  <div className="flex items-center gap-3">
                    <span
                      className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/[0.06] text-xs font-bold tracking-wide text-[#A4F4FD]"
                      aria-hidden
                    >
                      {item.logoInitials}
                    </span>
                    <div
                      className="flex items-center gap-0.5"
                      aria-label={`${item.rating} out of 5 stars`}
                    >
                      {Array.from({ length: item.rating }).map((_, index) => (
                        <Star
                          key={`${item.name}-star-${index}`}
                          className="h-3.5 w-3.5 fill-[#A4F4FD] text-[#A4F4FD]"
                          aria-hidden
                        />
                      ))}
                    </div>
                  </div>

                  <p className="text-sm md:text-[15px] text-white/85 leading-relaxed">
                    “{item.quote}”
                  </p>
                </div>

                <div className="mt-6 pt-5 border-t border-white/[0.08]">
                  <p className="text-sm font-semibold text-white">{item.name}</p>
                  <p className="text-xs text-white/55 mt-1">
                    {item.title} · {item.company}
                  </p>
                </div>
              </GlassCard>
            </NewHomeSectionCardBorder>
          ))}
        </div>
      </div>
    </section>
  );
}
