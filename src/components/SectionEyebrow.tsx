import React from "react";

interface SectionEyebrowProps {
  label: string;
  tag?: string;
  className?: string;
}

export default function SectionEyebrow({ label, tag, className = "" }: SectionEyebrowProps) {
  return (
    <div
      className={`inline-flex items-center flex-wrap gap-2.5 ${className}`}
      id={`eyebrow-${label.toLowerCase().replace(/\s+/g, "-")}`}
    >
      {/* Outer border container */}
      <span className="inline-flex items-center gap-2.5 text-xs uppercase tracking-[0.14em] font-semibold text-white/70">
        <span className="w-1.5 h-1.5 rounded-full bg-brand shadow-[0_0_8px_#3D81E3]" />
        {label}
      </span>

      {tag && <span className="status-pill">{tag}</span>}
    </div>
  );
}
