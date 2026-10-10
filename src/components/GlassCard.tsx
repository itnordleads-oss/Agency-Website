import React from "react";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  glowColor?: "brand" | "cyan" | "none";
  className?: string;
  /** Optional classes for the inner content wrapper (opt-in; default unchanged). */
  contentClassName?: string;
  key?: string | number;
}

export default function GlassCard({
  children,
  glowColor = "none",
  className = "",
  contentClassName = "",
  ...props
}: GlassCardProps) {
  return (
    <div
      className={`liquid-glass rounded-2xl p-6 md:p-7 max-[340px]:p-4 transition-colors duration-300 hover:bg-white/[0.04] hover:border-white/15 group/card ${className}`}
      {...props}
    >
      {/* Premium Glass Hover Glow Overlay */}
      {glowColor !== "none" && (
        <div
          className={`absolute opacity-30 transition-opacity duration-300 group-hover/card:opacity-60 pointer-events-none ${
            glowColor === "cyan"
              ? "glass-glow-cyan -top-10 -right-10"
              : "glass-glow-brand -bottom-10 -left-10"
          }`}
        />
      )}

      <div className={contentClassName || undefined}>{children}</div>
    </div>
  );
}
