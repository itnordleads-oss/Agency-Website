import React from "react";
import { ChevronRight } from "lucide-react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  className?: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export function PrimaryButton({
  children = "Primary Action",
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      type="button"
      className={`group inline-flex items-center justify-center gap-2 rounded-full bg-white text-black font-semibold text-ui-button px-6 py-3.5 max-[340px]:px-4 max-[340px]:py-3 transition-[transform,box-shadow,background-color] duration-200 hover:bg-white hover:shadow-[0_12px_40px_rgba(255,255,255,0.2)] hover:-translate-y-px active:scale-[0.98] motion-reduce:transform-none cursor-pointer ${className}`}
      {...props}
    >
      <span className="inline-flex items-center justify-center gap-2">{children}</span>
      <ChevronRight className="w-4 h-4 shrink-0 text-black transition-transform duration-200 group-hover:translate-x-[2px] motion-reduce:transform-none" />
    </button>
  );
}

export function SecondaryButton({
  children = "Secondary Action",
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      type="button"
      className={`inline-flex items-center justify-center gap-2 rounded-full border border-white/25 bg-white/[0.03] text-white text-ui-button font-semibold px-6 py-3.5 max-[340px]:px-4 max-[340px]:py-3 transition-[transform,background-color,border-color] duration-200 hover:bg-white/10 hover:border-white/40 hover:-translate-y-px active:scale-[0.98] motion-reduce:transform-none cursor-pointer ${className}`}
      {...props}
    >
      {/* inline-flex keeps icon+label on one row (block span was stacking them) */}
      <span className="inline-flex items-center justify-center gap-2">{children}</span>
    </button>
  );
}
