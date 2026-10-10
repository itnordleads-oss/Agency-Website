import React from "react";
import { Building2, Workflow, SlidersHorizontal, Send } from "lucide-react";
import { isMetricsModuleEnabled } from "../lib/trustModules";
import { useSiteCopy } from "../lib/useSiteCopy";

const PROOF_ICONS = [Building2, Workflow, SlidersHorizontal, Send] as const;

export default function ProofBand() {
  const { proofBand } = useSiteCopy();
  const items = Array.isArray(proofBand) ? proofBand : [];

  if (!isMetricsModuleEnabled() || items.length === 0) {
    return null;
  }

  const proofPoints = items.map((point, index) => ({
    icon: PROOF_ICONS[index % PROOF_ICONS.length],
    stat: point.stat,
    label: point.label,
  }));

  return (
    <section className="relative overflow-hidden min-w-0" aria-label="Why teams trust ADealForge">
      <div className="max-w-7xl mx-auto px-3 min-[341px]:px-4 sm:px-6 min-w-0">
        <div className="rounded-2xl border border-white/[0.1] bg-white/[0.02] backdrop-blur-md overflow-hidden">
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-white/[0.08]">
            {proofPoints.map((point) => {
              const Icon = point.icon;
              return (
                <div
                  key={point.stat}
                  className="flex flex-col gap-1.5 max-[340px]:gap-1 min-[341px]:gap-2 p-3 max-[340px]:p-2.5 min-[341px]:p-5 md:p-6 min-w-0"
                >
                  <Icon className="w-4 h-4 min-[341px]:w-5 min-[341px]:h-5 text-[#00D2FF] shrink-0" />
                  <div className="text-sm min-[341px]:text-xl md:text-2xl font-extrabold tracking-tight text-white leading-snug min-[341px]:leading-tight break-words">
                    {point.stat}
                  </div>
                  <p className="text-[0.6875rem] min-[341px]:text-[13px] md:text-sm text-white/65 leading-relaxed">
                    {point.label}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
