import React from "react";
import SectionEyebrow from "./SectionEyebrow";
import GlassCard from "./GlassCard";
import NewHomeSectionCardBorder from "./NewHomeSectionCardBorder";
import { Wrench, Truck, Users, Factory, Layers, Briefcase, ExternalLink } from "lucide-react";
import { useSiteCopy } from "../lib/useSiteCopy";
import { navigateToContact } from "../App";

export default function SectorGrid() {
  const { sectors: sectorCopy } = useSiteCopy();
  const inspectUseCase = (sectorTitle: string) => {
    window.dispatchEvent(
      new CustomEvent("prefillTargetMarket", { detail: { sector: sectorTitle } })
    );
    navigateToContact();
  };

  const sectors = [
    {
      title: sectorCopy.items[0].title,
      icon: Wrench,
      pill: sectorCopy.items[0].pill,
      highlight: sectorCopy.items[0].highlight,
      desc: sectorCopy.items[0].desc,
      bestWhen: sectorCopy.items[0].bestWhen,
    },
    {
      title: sectorCopy.items[1].title,
      icon: Truck,
      pill: sectorCopy.items[1].pill,
      highlight: sectorCopy.items[1].highlight,
      desc: sectorCopy.items[1].desc,
      bestWhen: sectorCopy.items[1].bestWhen,
    },
    {
      title: sectorCopy.items[2].title,
      icon: Users,
      pill: sectorCopy.items[2].pill,
      highlight: sectorCopy.items[2].highlight,
      desc: sectorCopy.items[2].desc,
      bestWhen: sectorCopy.items[2].bestWhen,
    },
    {
      title: sectorCopy.items[3].title,
      icon: Factory,
      pill: sectorCopy.items[3].pill,
      highlight: sectorCopy.items[3].highlight,
      desc: sectorCopy.items[3].desc,
      bestWhen: sectorCopy.items[3].bestWhen,
    },
    {
      title: sectorCopy.items[4].title,
      icon: Layers,
      pill: sectorCopy.items[4].pill,
      highlight: sectorCopy.items[4].highlight,
      desc: sectorCopy.items[4].desc,
      bestWhen: sectorCopy.items[4].bestWhen,
    },
    {
      title: sectorCopy.items[5].title,
      icon: Briefcase,
      pill: sectorCopy.items[5].pill,
      highlight: sectorCopy.items[5].highlight,
      desc: sectorCopy.items[5].desc,
      bestWhen: sectorCopy.items[5].bestWhen,
    },
  ];

  return (
    <section className="section-padding relative overflow-hidden" id="use-cases">
      {/* Decorative Network Line Backgrounds */}
      <div className="absolute inset-0 max-w-7xl mx-auto px-6 pointer-events-none opacity-25 z-0">
        <svg
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          focusable="false"
          role="presentation"
        >
          {/* Subtle connecting mesh nodes */}
          <line
            x1="10%"
            y1="15%"
            x2="50%"
            y2="45%"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="1"
            strokeDasharray="3 3"
          />
          <line
            x1="50%"
            y1="45%"
            x2="90%"
            y2="85%"
            stroke="rgba(61,129,227,0.08)"
            strokeWidth="1"
          />
          <line
            x1="90%"
            y1="15%"
            x2="30%"
            y2="65%"
            stroke="rgba(0,210,255,0.06)"
            strokeWidth="1.5"
          />
          <circle cx="50%" cy="45%" r="3" fill="#3D81E3" />
          <circle cx="30%" cy="65%" r="3" fill="#00D2FF" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-3 min-[341px]:px-4 sm:px-6 relative z-10 min-w-0">
        <div className="text-center max-w-2xl mx-auto space-y-4 mb-12 md:mb-20">
          <SectionEyebrow label={sectorCopy.eyebrow.label} tag={sectorCopy.eyebrow.tag} />

          <h2 className="section-title">{sectorCopy.title}</h2>

          <p className="text-body text-base md:text-lg leading-relaxed">{sectorCopy.subtitle}</p>
        </div>

        {/* 6 Grid items */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-7">
          {sectors.map((sector) => {
            const IconComponent = sector.icon;

            return (
              <NewHomeSectionCardBorder key={sector.title} className="h-full rounded-2xl">
                <GlassCard
                  glowColor={sector.highlight ? "brand" : "none"}
                  className={`flex flex-col justify-between md:min-h-[260px] group transition-all duration-300 ${
                    sector.highlight
                      ? "border-[#3D81E3]/40 bg-[#3D81E3]/5 md:col-span-1 lg:col-span-1 shadow-[0_4px_24px_rgba(61,129,227,0.15)]"
                      : "border-white/[0.08]"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-4 flex-wrap">
                      <div
                        className={`w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center border transition-all duration-300 ${
                          sector.highlight
                            ? "border-[#3D81E3]/45 bg-[#3D81E3]/15 text-[#A4F4FD]"
                            : "border-white/10 text-white/50 group-hover:text-white"
                        }`}
                      >
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <span
                        className={`status-pill ${sector.highlight ? "status-pill--active" : ""}`}
                      >
                        {sector.pill}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-white tracking-wide group-hover:text-[#00D2FF] transition-colors flex items-center gap-1.5">
                      {sector.title}
                    </h3>

                    <p className="text-sm text-body leading-relaxed mt-3">{sector.desc}</p>
                    <p className="text-xs text-subtle leading-relaxed mt-3">{sector.bestWhen}</p>
                  </div>

                  <button
                    onClick={() => inspectUseCase(sector.title)}
                    className="w-full flex items-center justify-end pt-4 border-t border-white/[0.08] text-xs text-subtle group-hover:text-[#A4F4FD] transition-colors cursor-pointer"
                  >
                    <span className="flex items-center gap-1">
                      {sectorCopy.ctaLink}{" "}
                      <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  </button>
                </GlassCard>
              </NewHomeSectionCardBorder>
            );
          })}
        </div>
      </div>
    </section>
  );
}
