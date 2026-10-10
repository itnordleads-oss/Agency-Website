import React from "react";
import "./newHomeSectionCardBorder.css";

interface NewHomeSectionCardBorderProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Animated border wrapper for specifically scoped Homepage card groups
 * (Data Quality, Use Cases / sectors, Testimonials, How It Works).
 * Do not use on unrelated cards.
 */
export default function NewHomeSectionCardBorder({
  children,
  className = "",
}: NewHomeSectionCardBorderProps) {
  return (
    <div className={`new-home-section-card-frame${className ? ` ${className}` : ""}`}>
      {children}
    </div>
  );
}
