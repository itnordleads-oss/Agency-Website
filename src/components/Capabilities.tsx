import React from "react";
import SectionEyebrow from "./SectionEyebrow";
import GlassCard from "./GlassCard";
import { PrimaryButton, SecondaryButton } from "./Buttons";
import { Search, Database, ShieldCheck, Sparkles, Send } from "lucide-react";
import { useSiteCopy } from "../lib/useSiteCopy";
import { navigateToContact } from "../App";

export default function Capabilities() {
  const { capabilities } = useSiteCopy();
  const chips = capabilities.chips;

  const capabilityDetails = [
    {
      title: capabilities.items[0].title,
      icon: Search,
      desc: capabilities.items[0].desc,
      accent: "text-[#3D81E3]",
    },
    {
      title: capabilities.items[1].title,
      icon: Database,
      desc: capabilities.items[1].desc,
      accent: "text-[#00D2FF]",
    },
    {
      title: capabilities.items[2].title,
      icon: ShieldCheck,
      desc: capabilities.items[2].desc,
      accent: "text-[#A4F4FD]",
    },
    {
      title: capabilities.items[3].title,
      icon: Sparkles,
      desc: capabilities.items[3].desc,
      accent: "text-[#7C3AED]",
    },
    {
      title: capabilities.items[4].title,
      icon: Send,
      desc: capabilities.items[4].desc,
      accent: "text-[#00D2FF]",
    },
  ];

  const scrollToHowItWorks = () => {
    const element =
      document.getElementById("how-it-works") ||
      document.getElementById("platform-overview-strip") ||
      document.getElementById("platform-anchor");
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="section-padding relative overflow-hidden min-w-0" id="platform-anchor">
      <div className="max-w-7xl mx-auto px-3 min-[341px]:px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-12 gap-10 max-[340px]:gap-8 sm:gap-12 lg:gap-16 items-center min-w-0">
        {/* Left Column */}
        <div className="lg:col-span-5 space-y-6">
          <SectionEyebrow label={capabilities.eyebrow.label} tag={capabilities.eyebrow.tag} />

          <h2 className="section-title">{capabilities.title}</h2>

          <p className="text-body text-base md:text-lg leading-relaxed">{capabilities.subtitle}</p>

          <div className="flex flex-wrap gap-2 text-xs text-white/75">
            {capabilities.pills.map((pill) => (
              <span key={pill} className="status-pill">
                {pill}
              </span>
            ))}
          </div>

          <div className="flex flex-wrap gap-2 pt-3">
            {chips.map((chip) => (
              <span
                key={chip}
                className="px-3.5 py-1.5 rounded-full bg-white/[0.03] hover:bg-white/[0.08] border border-white/12 text-xs font-semibold text-white/70 hover:text-white transition-all select-none cursor-default shadow-sm hover:shadow-[0_2px_10px_rgba(0,210,255,0.15)] hover:border-[#00D2FF]/45"
              >
                {chip}
              </span>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
            <PrimaryButton onClick={navigateToContact} className="w-full sm:w-auto px-6 py-3">
              {capabilities.primaryCta}
            </PrimaryButton>
            <SecondaryButton onClick={scrollToHowItWorks} className="w-full sm:w-auto px-6 py-3">
              {capabilities.secondaryCta}
            </SecondaryButton>
          </div>
        </div>

        {/* Right Column Layout: Liquid glass card containing 4 capacity blocks */}
        <div className="lg:col-span-7">
          <GlassCard glowColor="brand" className="space-y-6 divide-y divide-white/10">
            {capabilityDetails.map((block) => (
              <div
                key={block.title}
                className={`flex gap-5 pt-6 first:pt-0 group/block transition-all duration-300`}
              >
                {/* Visual circle wrapping the icon */}
                <div
                  className={`w-12 h-12 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center shrink-0 transition-transform duration-300 group-hover/block:scale-110`}
                >
                  <block.icon className={`w-5 h-5 ${block.accent}`} />
                </div>

                {/* Text section */}
                <div className="space-y-1.5 pb-2">
                  <h3 className="text-base font-bold text-white tracking-wide flex items-center gap-2">
                    {block.title}
                    <span className="w-1 h-1 rounded-full bg-brand opacity-0 group-hover/block:opacity-100 transition-opacity" />
                  </h3>
                  <p className="text-sm text-body leading-relaxed max-w-xl">{block.desc}</p>
                </div>
              </div>
            ))}
          </GlassCard>
        </div>
      </div>
    </section>
  );
}
