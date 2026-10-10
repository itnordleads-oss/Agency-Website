import React from "react";
import {
  Target,
  Search,
  Building2,
  Mail,
  Sparkles,
  CalendarCheck,
  type LucideIcon,
} from "lucide-react";
import SectionEyebrow from "../SectionEyebrow";
import GlassCard from "../GlassCard";
import { useHomepageCopy } from "./homepageVariantContext";

const FEATURE_ICONS: LucideIcon[] = [Target, Search, Building2, Mail, Sparkles, CalendarCheck];

export default function HomeV2Features() {
  const { features } = useHomepageCopy();

  return (
    <section id="v2-features" className="relative min-w-0 overflow-hidden py-12 sm:py-14 md:py-16">
      <div className="relative z-10 mx-auto w-full min-w-0 max-w-7xl px-3 min-[341px]:px-4 sm:px-6">
        <div className="mx-auto mb-8 max-w-2xl space-y-2.5 text-center md:mb-10">
          <div className="flex justify-center">
            <SectionEyebrow label={features.eyebrow} />
          </div>
          <h2 className="section-title">{features.title}</h2>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 sm:gap-4">
          {features.items.map((item, index) => {
            const Icon = FEATURE_ICONS[index] ?? Target;
            return (
              <GlassCard
                key={item.title}
                className="border border-white/[0.08] bg-white/[0.02] p-4 sm:p-5"
              >
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/12 bg-white/[0.04]">
                  <Icon className="h-4 w-4 text-[#00D2FF]" aria-hidden />
                </span>
                <h3 className="mt-3 text-sm font-semibold text-white sm:text-base">{item.title}</h3>
                <p className="mt-1 text-sm leading-snug text-white/60">{item.description}</p>
              </GlassCard>
            );
          })}
        </div>
      </div>
    </section>
  );
}
