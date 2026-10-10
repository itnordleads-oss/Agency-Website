import React from "react";
import SectionEyebrow from "./SectionEyebrow";
import GlassCard from "./GlassCard";
import NewHomeSectionCardBorder from "./NewHomeSectionCardBorder";
import { SecondaryButton } from "./Buttons";
import { useSiteCopy } from "../lib/useSiteCopy";
import { navigateToContact } from "../App";

export default function DataQuality() {
  const { dataQuality } = useSiteCopy();

  const qualityCards = [
    {
      title: dataQuality.cards[0].title,
      desc: dataQuality.cards[0].desc,
      method: dataQuality.cards[0].method,
      status: dataQuality.cards[0].status,
      impact: dataQuality.cards[0].impact,
    },
    {
      title: dataQuality.cards[1].title,
      desc: dataQuality.cards[1].desc,
      method: dataQuality.cards[1].method,
      status: dataQuality.cards[1].status,
      impact: dataQuality.cards[1].impact,
    },
    {
      title: dataQuality.cards[2].title,
      desc: dataQuality.cards[2].desc,
      method: dataQuality.cards[2].method,
      status: dataQuality.cards[2].status,
      impact: dataQuality.cards[2].impact,
    },
    {
      title: dataQuality.cards[3].title,
      desc: dataQuality.cards[3].desc,
      method: dataQuality.cards[3].method,
      status: dataQuality.cards[3].status,
      impact: dataQuality.cards[3].impact,
    },
    {
      title: dataQuality.cards[4].title,
      desc: dataQuality.cards[4].desc,
      method: dataQuality.cards[4].method,
      status: dataQuality.cards[4].status,
      impact: dataQuality.cards[4].impact,
    },
    {
      title: dataQuality.cards[5].title,
      desc: dataQuality.cards[5].desc,
      method: dataQuality.cards[5].method,
      status: dataQuality.cards[5].status,
      impact: dataQuality.cards[5].impact,
    },
  ];

  return (
    <section className="section-padding relative overflow-hidden" id="data-quality">
      {/* Soft background cyan overlay */}
      <div className="absolute bottom-1/4 right-[10%] w-[400px] h-[400px] rounded-full bg-[#00d2ff]/5 blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-3 min-[341px]:px-4 sm:px-6 relative z-10 min-w-0">
        {/* Header Block & Info bar */}
        <div className="text-center max-w-2xl mx-auto space-y-4 mb-12 md:mb-20">
          <SectionEyebrow label={dataQuality.eyebrow.label} tag={dataQuality.eyebrow.tag} />
          <h2 className="section-title">{dataQuality.title}</h2>
          <p className="text-body text-base md:text-lg leading-relaxed">{dataQuality.subtitle}</p>
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-white/75">
            {dataQuality.pills.map((pill) => (
              <span key={pill} className="status-pill">
                {pill}
              </span>
            ))}
          </div>
        </div>

        {/* 6 data quality cards with indicators */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-7">
          {qualityCards.map((card) => {
            return (
              <NewHomeSectionCardBorder key={card.title} className="h-full rounded-2xl">
                <GlassCard className="flex flex-col justify-between md:min-h-[280px] border border-white/[0.1] bg-white/[0.02] group hover:border-[#00D2FF]/35 hover:bg-[#00D2FF]/[0.02] transition-all duration-300">
                  <div className="space-y-4">
                    {/* Card Title & Icon */}
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <span className="flex items-center gap-2 text-sm font-bold tracking-wide text-white">
                        {card.title}
                      </span>
                      <span className="status-pill">{card.status}</span>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-body leading-relaxed">{card.desc}</p>
                  </div>

                  {/* Bottom line: method */}
                  <div className="border-t border-white/[0.08] pt-4 mt-auto space-y-2 text-xs text-subtle">
                    <span className="block">{card.method}</span>
                    <span className="block text-white/70">{card.impact}</span>
                  </div>
                </GlassCard>
              </NewHomeSectionCardBorder>
            );
          })}
        </div>

        <div className="mt-10 flex justify-center">
          <SecondaryButton onClick={navigateToContact} className="px-7 py-3">
            {dataQuality.cta}
          </SecondaryButton>
        </div>
      </div>
    </section>
  );
}
