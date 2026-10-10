import React from "react";
import SectionEyebrow from "./SectionEyebrow";
import GlassCard from "./GlassCard";
import NewHomeSectionCardBorder from "./NewHomeSectionCardBorder";
import { SecondaryButton } from "./Buttons";
import { Sliders, Layers, Send } from "lucide-react";
import { useSiteCopy } from "../lib/useSiteCopy";
import { navigateToContact } from "../App";

export default function HowItWorks() {
  const { howItWorks } = useSiteCopy();

  const processSteps = [
    {
      step: 1,
      title: howItWorks.steps[0].title,
      desc: howItWorks.steps[0].desc,
      icon: Sliders,
      stageLabel: howItWorks.steps[0].stageLabel,
      outcome: `Outcome: ${howItWorks.steps[0].outcome}`,
    },
    {
      step: 2,
      title: howItWorks.steps[1].title,
      desc: howItWorks.steps[1].desc,
      icon: Layers,
      stageLabel: howItWorks.steps[1].stageLabel,
      outcome: `Outcome: ${howItWorks.steps[1].outcome}`,
    },
    {
      step: 3,
      title: howItWorks.steps[2].title,
      desc: howItWorks.steps[2].desc,
      icon: Send,
      stageLabel: howItWorks.steps[2].stageLabel,
      outcome: `Outcome: ${howItWorks.steps[2].outcome}`,
    },
  ];

  return (
    <section className="bg-black/10 section-padding relative overflow-hidden" id="how-it-works">
      {/* Background visual light streak */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[1px] bg-gradient-to-r from-transparent via-[#3D81E3]/30 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-3 min-[341px]:px-4 sm:px-6 relative z-10 min-w-0">
        {/* Header content */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 md:mb-20 animate-fade-in">
          <div className="space-y-4 max-w-xl">
            <SectionEyebrow label={howItWorks.eyebrow.label} tag={howItWorks.eyebrow.tag} />
            <h2 className="section-title">{howItWorks.title}</h2>
          </div>
          <div className="space-y-4 max-w-md">
            <p className="text-body text-sm md:text-base leading-relaxed border-l-2 border-[#3D81E3]/40 pl-5">
              {howItWorks.sidebar}
            </p>
            <SecondaryButton onClick={navigateToContact} className="w-full sm:w-auto px-5 py-2.5">
              {howItWorks.cta}
            </SecondaryButton>
          </div>
        </div>

        {/* Process Cards Grid/Track */}
        {/* On mobile, stack. On desktop, structured 3-column flow */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {processSteps.map((item, index) => {
            const IconComponent = item.icon;

            return (
              <div key={item.step} className="relative group">
                {/* Horizontal flow connectors in desktop view */}
                {index % 3 !== 2 && (
                  <div className="hidden lg:block absolute top-10 -right-4 w-8 h-px bg-white/10 z-0 pointer-events-none" />
                )}

                <NewHomeSectionCardBorder className="h-full rounded-2xl">
                  <GlassCard
                    glowColor="cyan"
                    className="h-full md:min-h-[220px] flex flex-col justify-between p-6 border border-white/[0.08] bg-white/[0.015]"
                  >
                    <div className="space-y-4">
                      {/* Top line with step number and icon */}
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold tracking-wide text-[#7ddfff] uppercase bg-[#00d2ff]/10 px-3 py-1 rounded-full border border-[#00d2ff]/25">
                          Step 0{item.step}
                        </span>
                        <div className="w-8 h-8 rounded-full bg-white/5 border border-white/15 flex items-center justify-center text-white/60 group-hover:text-white transition-colors">
                          <IconComponent className="w-4 h-4" />
                        </div>
                      </div>

                      {/* Step Title */}
                      <h3 className="text-base font-bold text-white tracking-wide group-hover:text-[#00D2FF] transition-colors">
                        {item.title}
                      </h3>

                      {/* Step description */}
                      <p className="text-sm text-body leading-relaxed">{item.desc}</p>
                    </div>

                    {/* Connecting index lines */}
                    <div className="mt-4 pt-4 border-t border-white/[0.08] flex items-center justify-start">
                      <span className="status-pill">{item.stageLabel}</span>
                    </div>
                    <p className="text-xs text-subtle leading-relaxed mt-3">{item.outcome}</p>
                  </GlassCard>
                </NewHomeSectionCardBorder>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
