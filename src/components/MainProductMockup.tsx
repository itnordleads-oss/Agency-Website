import React, { useEffect, useState } from "react";
import {
  Sparkles,
  Search,
  Building,
  CheckCircle,
  Send,
  Mail,
  Target,
  FileSpreadsheet,
} from "lucide-react";
import { useSiteCopy } from "../lib/useSiteCopy";
import { navigateToContact } from "../App";
import BackToHomepage from "./BackToHomepage";
import "./mainProductMockup.css";

type StageId = "discovery" | "enrichment" | "contacts" | "review" | "personalization" | "outreach";

interface StageMeta {
  id: StageId;
  navLabel: string;
  icon: typeof Search;
  accentLabel: string;
  metrics: { label: string; value: string; accent?: boolean }[];
}

interface Stage extends StageMeta {
  panelTitle: string;
  panelDescription: string;
  deliverables: string[];
  stageOutcome: string;
  angle: string;
}

const STAGE_META: StageMeta[] = [
  {
    id: "discovery",
    navLabel: "Discovery",
    icon: Search,
    accentLabel: "Discovery",
    metrics: [
      { label: "Companies to review", value: "1,240" },
      { label: "Research level", value: "Basic profile" },
      { label: "Contact check", value: "Not checked", accent: true },
      { label: "Ready to send", value: "0%", accent: true },
    ],
  },
  {
    id: "enrichment",
    navLabel: "Enrichment",
    icon: Building,
    accentLabel: "Enrichment",
    metrics: [
      { label: "Companies to review", value: "1,240" },
      { label: "Research level", value: "Full context" },
      { label: "Contact check", value: "Not checked", accent: true },
      { label: "Ready to send", value: "20%", accent: true },
    ],
  },
  {
    id: "contacts",
    navLabel: "Contacts",
    icon: Mail,
    accentLabel: "Contact review",
    metrics: [
      { label: "Companies to review", value: "880 reachable" },
      { label: "Research level", value: "Full context" },
      { label: "Contact check", value: "Verified", accent: true },
      { label: "Ready to send", value: "45%", accent: true },
    ],
  },
  {
    id: "review",
    navLabel: "Review",
    icon: CheckCircle,
    accentLabel: "Quality review",
    metrics: [
      { label: "Companies to review", value: "640 approved" },
      { label: "Research level", value: "Full context" },
      { label: "Contact check", value: "Verified", accent: true },
      { label: "Ready to send", value: "70%", accent: true },
    ],
  },
  {
    id: "personalization",
    navLabel: "Personalization",
    icon: Sparkles,
    accentLabel: "Personalization",
    metrics: [
      { label: "Companies to review", value: "640" },
      { label: "Research level", value: "Full + angle" },
      { label: "Contact check", value: "Verified", accent: true },
      { label: "Ready to send", value: "90%", accent: true },
    ],
  },
  {
    id: "outreach",
    navLabel: "Outreach",
    icon: Send,
    accentLabel: "Outreach-ready",
    metrics: [
      { label: "Companies to review", value: "640 ready" },
      { label: "Research level", value: "Full + angle" },
      { label: "Contact check", value: "Verified", accent: true },
      { label: "Ready to send", value: "100%", accent: true },
    ],
  },
];

export default function MainProductMockup({ showBackHome = false }: { showBackHome?: boolean }) {
  const { workflow, workflowPage, platformPage } = useSiteCopy();

  const stages: Stage[] = STAGE_META.map((meta) => {
    const stage = workflow.stages.find((entry) => entry.id === meta.id);
    if (!stage) {
      throw new Error(`Missing workflow copy for ${meta.id}`);
    }
    return {
      ...meta,
      navLabel: stage.navLabel || meta.navLabel,
      accentLabel: stage.accentLabel || meta.accentLabel,
      panelTitle: stage.panelTitle,
      panelDescription: stage.panelDescription,
      deliverables: [...stage.deliverables],
      stageOutcome: stage.stageOutcome,
      angle: stage.angle,
    };
  });

  const [activeStageId, setActiveStageId] = useState<StageId>("discovery");

  const activeIndex = Math.max(
    0,
    stages.findIndex((s) => s.id === activeStageId)
  );
  const activeStage = stages[activeIndex] ?? stages[0];

  useEffect(() => {
    const onExternalStageSelect = (event: Event) => {
      const customEvent = event as CustomEvent<{ stage?: StageId }>;
      const stage = customEvent.detail?.stage;
      if (stage && STAGE_META.some((s) => s.id === stage)) {
        setActiveStageId(stage);
      }
    };

    window.addEventListener("workflowStageSelect", onExternalStageSelect as EventListener);
    return () =>
      window.removeEventListener("workflowStageSelect", onExternalStageSelect as EventListener);
  }, []);

  const ctaButton = (
    <button
      type="button"
      onClick={navigateToContact}
      className="group inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-white px-4 py-3.5 text-sm font-semibold text-black transition-[transform,background-color] duration-200 hover:bg-white/95 active:scale-[0.99] motion-reduce:transform-none"
    >
      <Send className="h-4 w-4 shrink-0 text-black" aria-hidden />
      <span>{workflow.cta}</span>
    </button>
  );

  const stageTabsMobile = (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Workflow stages">
      {stages.map((stage) => {
        const Icon = stage.icon;
        const active = stage.id === activeStageId;
        return (
          <button
            key={stage.id}
            type="button"
            onClick={() => setActiveStageId(stage.id)}
            aria-pressed={active}
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-2 text-xs font-semibold transition-colors cursor-pointer ${
              active
                ? "border-[#3D81E3]/60 bg-[#3D81E3]/16 text-white"
                : "border-white/12 bg-white/[0.02] text-white/65"
            }`}
          >
            <Icon className="w-3.5 h-3.5 text-[#3D81E3] shrink-0" />
            <span>{stage.navLabel}</span>
          </button>
        );
      })}
    </div>
  );

  const stageNavDesktop = (
    <nav className="space-y-1" aria-label="Workflow navigation">
      <span className="text-xs font-semibold tracking-wide text-subtle uppercase px-2 block mb-2.5">
        Workflow
      </span>
      {stages.map((stage) => {
        const Icon = stage.icon;
        return (
          <button
            key={stage.id}
            type="button"
            onClick={() => setActiveStageId(stage.id)}
            aria-pressed={stage.id === activeStageId}
            className={`workflow-stage-nav__btn w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-left transition-colors cursor-pointer border border-transparent ${
              stage.id === activeStageId
                ? "bg-white/[0.08] text-white"
                : "text-white/60 hover:text-white hover:bg-white/[0.04]"
            }`}
          >
            <Icon className="w-4 h-4 text-[#3D81E3] shrink-0" />
            <span>{stage.navLabel}</span>
          </button>
        );
      })}
    </nav>
  );

  const renderDetailContent = (stage: Stage, stageIndex: number) => {
    const stageProgressPct = Math.round(((stageIndex + 1) / stages.length) * 100);

    return (
      <>
        <div className="flex items-center gap-3">
          <div className="h-1.5 min-w-0 flex-1 rounded-full bg-white/[0.06] overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-brand to-accent transition-all duration-500"
              style={{ width: `${stageProgressPct}%` }}
            />
          </div>
          <span className="status-pill status-pill--active inline-flex shrink-0 items-center gap-1.5">
            <Sparkles className="w-3 h-3" />
            {stage.accentLabel}
          </span>
        </div>

        <div className="space-y-3">
          <div>
            <h3 className="text-lg md:text-xl font-bold text-white tracking-tight">
              {stage.panelTitle}
            </h3>
            <p className="text-body text-sm leading-relaxed mt-1.5 mb-3">
              {stage.panelDescription}
            </p>
            <div className="min-w-0 overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] p-3.5">
              <div className="mb-2.5 flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#3D81E3]/15">
                  <Sparkles className="h-4 w-4 text-[#00D2FF]" />
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-bold text-white">{workflow.deliverablesTitle}</div>
                  <div className="mt-0.5 text-xs text-subtle">{stage.accentLabel}</div>
                </div>
              </div>
              <div className="space-y-1.5">
                {stage.deliverables.map((item) => (
                  <div
                    key={item}
                    className="flex min-w-0 items-center gap-3 text-sm leading-relaxed text-body"
                  >
                    <span className="flex w-8 shrink-0 items-center justify-center" aria-hidden>
                      <span className="h-1.5 w-1.5 rounded-full bg-[#00D2FF]" />
                    </span>
                    <span className="min-w-0">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid min-w-0 grid-cols-2 gap-2.5">
            {stage.metrics.map((metric) => (
              <div
                key={metric.label}
                className="min-w-0 overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] p-3 transition-colors hover:border-white/20"
              >
                <div className="text-xs font-semibold text-subtle uppercase tracking-wide">
                  {metric.label}
                </div>
                <div
                  className={`font-bold mt-1.5 text-sm ${
                    metric.accent ? "text-[#7ddfff]" : "text-white"
                  }`}
                >
                  {metric.value}
                </div>
              </div>
            ))}
          </div>

          <div className="min-w-0 overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] p-3.5">
            <div className="flex items-center gap-2 mb-1.5">
              <Target className="w-4 h-4 text-[#3D81E3]" />
              <span className="text-xs font-semibold text-[#A4F4FD] uppercase tracking-wide">
                {workflow.outcomeTitle}
              </span>
            </div>
            <p className="text-sm text-body leading-relaxed mb-2.5">{stage.stageOutcome}</p>
            <div className="min-w-0 overflow-hidden rounded-lg border border-white/8 bg-black/35 p-3">
              <p className="text-sm text-white/90 italic leading-relaxed">“{stage.angle}”</p>
            </div>
          </div>
        </div>

        {/* Separator only — avoid stacking a second line against the outcome card border.
            pb/pr reserve space so the export CTA focus ring is not clipped. */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1 pr-1 pb-1 text-xs text-subtle">
          <span className="flex min-w-0 items-center gap-2">
            <FileSpreadsheet className="w-4 h-4 shrink-0 text-[#3D81E3]" />
            <span className="min-w-0">{workflow.exportNote}</span>
          </span>
          <button
            type="button"
            onClick={navigateToContact}
            className="shrink-0 rounded-sm text-subtle font-semibold transition-colors cursor-pointer hover:text-[#A4F4FD] focus:outline-none focus-visible:text-[#A4F4FD] focus-visible:ring-2 focus-visible:ring-brand/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#080B12]"
          >
            {workflow.exportCta}
          </button>
        </div>
      </>
    );
  };

  // One active stage only — stacked invisible panels left ghost borders / glass blur bands.
  // Factory so mobile + desktop each get their own element tree (never reuse one vnode).
  const renderDetailPanel = (variant: "mobile" | "desktop") => (
    <div
      id={`workflow-panel-${activeStage.id}-${variant}`}
      key={`${activeStage.id}-${variant}`}
      className="workflow-console-panel flex min-w-0 w-full max-w-full flex-col gap-4"
    >
      {renderDetailContent(activeStage, activeIndex)}
    </div>
  );

  return (
    <section
      className={`relative max-w-7xl mx-auto px-3 min-[341px]:px-4 sm:px-6 overflow-hidden min-w-0 ${
        showBackHome
          ? // Match Platform/Contact page-shell top spacing under the site header.
            "py-8 max-[340px]:py-7 sm:py-12 md:py-16"
          : "section-padding"
      }`}
      id="workflow"
    >
      <div className="relative z-10">
        {showBackHome ? (
          <BackToHomepage
            label={workflowPage.backHome || platformPage.backHome || "Back to homepage"}
          />
        ) : null}

        <div className="mb-6 flex flex-col items-center text-center md:mb-8">
          <h2 className="section-title max-w-3xl">{workflow.title}</h2>
          <p className="mt-3 max-w-xl text-base leading-relaxed text-muted md:text-lg">
            {workflow.subtitle}
          </p>
        </div>
      </div>

      <div className="relative z-10 rounded-2xl overflow-hidden border border-white/14 bg-white/[0.03]">
        <div className="min-h-11 md:min-h-12 bg-black/30 border-b border-white/[0.1] flex items-center justify-between flex-wrap gap-2 px-4 sm:px-5 md:px-6 py-2 relative z-10">
          <div className="flex items-center gap-3 min-w-0">
            <span className="workspace-chrome__dot" />
            <span className="text-xs sm:text-sm font-semibold text-white/70 tracking-wide truncate">
              {workflow.consoleTitle}
            </span>
          </div>
          <span className="status-pill status-pill--active">
            Stage {activeIndex + 1} of {stages.length}
          </span>
        </div>

        {/* Mobile layout: horizontal stage tabs, then campaign workspace details */}
        <div className="lg:hidden relative z-10">
          <div className="border-b border-white/[0.08] bg-black/25 px-4 py-3">
            {stageTabsMobile}
          </div>
          <div className="flex min-w-0 flex-col gap-4 p-4 sm:p-5">
            {renderDetailPanel("mobile")}
            {ctaButton}
          </div>
        </div>

        {/* Desktop layout: sidebar + campaign workspace */}
        <div className="hidden lg:grid lg:grid-cols-12 relative z-10 min-w-0">
          <div className="lg:col-span-3 lg:border-r border-white/[0.08] bg-black/25 p-4 flex flex-col justify-between gap-4 min-w-0">
            <div className="space-y-4">
              {ctaButton}
              {stageNavDesktop}
            </div>

            <div className="pt-3 border-t border-white/[0.08] flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-white/[0.06] flex items-center justify-center border border-white/12 font-bold text-xs text-[#A4F4FD]">
                ADF
              </div>
              <div className="min-w-0">
                <div className="text-xs font-semibold text-white/80">{workflow.workspaceName}</div>
                <div className="text-xs text-subtle mt-0.5">{workflow.workspaceNote}</div>
              </div>
            </div>
          </div>

          <div className="flex min-w-0 flex-col gap-4 p-5 lg:col-span-9">
            {renderDetailPanel("desktop")}
          </div>
        </div>
      </div>
    </section>
  );
}
