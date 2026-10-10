import React from "react";
import { PrimaryButton, SecondaryButton } from "./Buttons";
import { useSiteCopy } from "../lib/useSiteCopy";
import { navigateToContact } from "../App";

function openMeetingScheduler() {
  const meetingUrl =
    import.meta.env.VITE_MEETING_SCHEDULER_URL?.trim() ||
    import.meta.env.VITE_CALENDLY_URL?.trim() ||
    "";

  if (meetingUrl) {
    window.open(meetingUrl, "_blank", "noopener,noreferrer");
    return;
  }

  navigateToContact();
}

export default function BookDemoSection() {
  const { bookDemo } = useSiteCopy();

  return (
    <section
      className="relative max-w-7xl mx-auto px-3 min-[341px]:px-4 sm:px-6 py-14 max-[340px]:py-12 sm:py-20 md:py-24 overflow-hidden min-w-0"
      id="book-demo"
    >
      <div className="liquid-glass cta-glow-panel relative overflow-hidden rounded-2xl sm:rounded-3xl px-3.5 max-[340px]:px-3 min-[341px]:px-5 sm:px-8 py-10 max-[340px]:py-8 sm:py-14 md:px-12 md:py-20 text-center border border-white/14 bg-white/[0.04]">
        <div
          className="absolute inset-x-0 top-0 h-full pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(900px circle at 50% -10%, rgba(61,129,227,0.22), rgba(0,210,255,0.06) 45%, transparent 75%)",
          }}
        />

        <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 w-[28rem] h-40 rounded-full bg-[#3D81E3]/25 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl mx-auto space-y-8 md:space-y-9">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/6 border border-white/12 px-4 py-2 text-xs font-semibold tracking-wide text-[#A4F4FD] uppercase">
            {bookDemo.eyebrow}
          </span>

          <h2 className="section-title">{bookDemo.title}</h2>

          <p className="text-body text-base md:text-lg leading-relaxed max-w-xl mx-auto">
            {bookDemo.subtitle}
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 pt-2">
            <PrimaryButton onClick={navigateToContact} className="w-full sm:w-auto px-8 py-3.5">
              {bookDemo.primaryCta}
            </PrimaryButton>
            <SecondaryButton
              onClick={openMeetingScheduler}
              className="w-full sm:w-auto px-8 py-3.5"
            >
              {bookDemo.secondaryCta}
            </SecondaryButton>
          </div>

          <div className="text-xs text-subtle tracking-wide uppercase pt-2 flex items-center justify-center gap-2 flex-wrap">
            <span>{bookDemo.footnote[0]}</span>
            <span className="text-white/20">//</span>
            <span>{bookDemo.footnote[1]}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
