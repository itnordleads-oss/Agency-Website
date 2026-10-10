import React from "react";

export default function PageBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
      <div
        className="absolute inset-0 opacity-28"
        style={{
          backgroundImage: `
            radial-gradient(circle at 1px 1px, rgba(255, 255, 255, 0.09) 1px, transparent 0),
            linear-gradient(135deg, #0A0F19 0%, #0C111B 50%, #070A12 100%)
          `,
          backgroundSize: "45px 45px, 100% 100%",
        }}
      />

      <div className="absolute inset-0 glass-noise mix-blend-overlay opacity-18 motion-reduce:hidden" />
      <div className="diagonal-beam top-1/3 -right-1/4 opacity-20 motion-reduce:hidden" />
      <div className="absolute -bottom-[15%] -right-[20%] w-[80%] h-[80%] rounded-full bg-gradient-to-bl from-[#00d2ff]/14 via-transparent to-transparent blur-[36px] md:blur-[72px] motion-reduce:hidden" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#0C111B]/15 via-transparent to-[#0C111B]/85" />
    </div>
  );
}
