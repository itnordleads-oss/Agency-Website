import React from "react";
import { Check } from "lucide-react";
import { useHomepageVariant } from "./homepageVariantContext";
import { useLiveCampaignSimulation } from "./useLiveCampaignSimulation";
import "./homeV2ProductFrameLive.css";

type MetricRow = { label: string; value: string };

type AccountRow = {
  company: string;
  fit: string;
  stage: string;
};

interface HomeV2ProductFrameProps {
  badge: string;
  title?: string;
  metrics?: readonly MetricRow[];
  accounts?: readonly AccountRow[];
  progressLabel?: string;
  progressValue?: string;
  progressPercent?: number;
  className?: string;
  /**
   * Optional body override. When provided, replaces the default metrics/accounts/progress
   * layout while preserving the outer frame chrome (traffic-light dots + badge + LIVE pill).
   */
  children?: React.ReactNode;
}

function normalizeStage(stage: string): "research" | "ready" | "sending" | "other" {
  const value = stage.trim().toLowerCase();
  if (value.includes("ready")) {
    return "ready";
  }
  if (value.includes("send")) {
    return "sending";
  }
  if (
    value.includes("research") ||
    value.includes("discovery") ||
    value.includes("validation") ||
    value.includes("personalization") ||
    value.includes("outreach")
  ) {
    return "research";
  }
  return "other";
}

function StageStatusIcon({ stage }: { stage: string }) {
  const kind = normalizeStage(stage);

  if (kind === "research") {
    return (
      <span
        className="home-v2-frame--live__stage-icon home-v2-frame--live__stage-icon--research"
        aria-hidden="true"
      />
    );
  }

  if (kind === "ready") {
    return (
      <span
        className="home-v2-frame--live__stage-icon home-v2-frame--live__stage-icon--ready"
        aria-hidden="true"
      />
    );
  }

  if (kind === "sending") {
    return (
      <span
        className="home-v2-frame--live__stage-icon home-v2-frame--live__stage-icon--sending"
        aria-hidden="true"
      />
    );
  }

  return null;
}

/**
 * Shared product chrome for Homepage V2/V3 — visual-first, no CTAs.
 * Used in Hero (metrics) and Product Overview (account table).
 * Fully live real-time campaign simulation applies only on Homepage V3 account frames.
 */
export default function HomeV2ProductFrame({
  badge,
  title,
  metrics,
  accounts,
  progressLabel,
  progressValue,
  progressPercent = 70,
  className = "",
  children,
}: HomeV2ProductFrameProps) {
  const variant = useHomepageVariant();
  const isLiveCampaign = variant === "v3" && Boolean(accounts && accounts.length > 0);
  const hasBodyOverride = Boolean(children);
  const clampedPercent = Math.max(0, Math.min(100, progressPercent));
  const { allowMotion, activeRowIndex, rows, displayedPercent, updateToken } =
    useLiveCampaignSimulation(isLiveCampaign, accounts, clampedPercent);

  const accountRows = isLiveCampaign ? rows : accounts;
  const liveProgressValue = isLiveCampaign ? `${displayedPercent}%` : progressValue;
  const progressScale = Math.max(0, Math.min(100, displayedPercent)) / 100;

  return (
    <div
      className={`relative w-full overflow-hidden rounded-2xl border border-white/14 bg-[var(--page-bg,#0c111b)] shadow-[0_28px_70px_rgba(0,0,0,0.5)] ${
        isLiveCampaign ? "home-v2-frame--live" : ""
      } ${className}`}
      aria-hidden={isLiveCampaign ? undefined : true}
      aria-label={isLiveCampaign ? "Live campaign updating in real time" : undefined}
      role={isLiveCampaign ? "img" : undefined}
    >
      {isLiveCampaign ? <div className="home-v2-frame--live__ambient" aria-hidden="true" /> : null}
      {isLiveCampaign ? <div className="home-v2-frame--live__sweep" aria-hidden="true" /> : null}

      <div className="flex items-center gap-2 border-b border-white/10 px-3.5 py-2.5 sm:px-4">
        <span className="h-2 w-2 rounded-full bg-white/25" />
        <span className="h-2 w-2 rounded-full bg-white/25" />
        <span className="h-2 w-2 rounded-full bg-white/25" />
        <span className="ml-2 text-[0.65rem] font-medium uppercase tracking-wide text-white/45">
          {badge}
        </span>
        <span
          className={`ml-auto rounded-full border border-accent-soft/30 bg-accent-soft/10 px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wide text-accent-soft ${
            isLiveCampaign ? "home-v2-frame--live__badge" : ""
          }`}
        >
          {isLiveCampaign ? (
            <span className="home-v2-frame--live__dot" aria-hidden="true">
              <span className="home-v2-frame--live__dot-core" />
              <span className="home-v2-frame--live__dot-ring" />
            </span>
          ) : null}
          Live
        </span>
      </div>

      {hasBodyOverride ? (
        <div className="p-4 sm:p-5 md:p-6">{children}</div>
      ) : (
        <div className="space-y-4 p-4 sm:p-5 md:p-6">
          <div className="flex items-center gap-2.5">
            {title ? (
              <p className="text-sm font-semibold text-white md:text-base">{title}</p>
            ) : null}
            {isLiveCampaign ? (
              <span className="home-v2-frame--live__eq" aria-hidden="true">
                <span />
                <span />
                <span />
              </span>
            ) : null}
          </div>

          {metrics && metrics.length > 0 ? (
            <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
              {metrics.map((row) => (
                <div
                  key={row.label}
                  className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-3 sm:px-3.5"
                >
                  <p className="text-[0.65rem] uppercase tracking-wide text-white/45">
                    {row.label}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-white sm:text-[15px]">
                    {row.value}
                  </p>
                </div>
              ))}
            </div>
          ) : null}

          {accountRows && accountRows.length > 0 ? (
            <div
              className={`relative overflow-hidden rounded-xl border border-white/10 ${
                isLiveCampaign ? "home-v2-frame--live__table" : ""
              }`}
            >
              {isLiveCampaign && allowMotion ? (
                <span key={updateToken} className="home-v2-frame--live__scan" aria-hidden="true" />
              ) : null}

              <div className="grid grid-cols-[1.4fr_0.8fr_0.7fr] gap-2 border-b border-white/10 bg-white/[0.03] px-3 py-2 text-[0.65rem] font-semibold uppercase tracking-wide text-white/40">
                <span>Account</span>
                <span>Fit</span>
                <span>Stage</span>
              </div>
              {accountRows.map((row, index) => {
                const isActive = isLiveCampaign && allowMotion && index === activeRowIndex;
                return (
                  <div
                    key={row.company}
                    className={`grid grid-cols-[1.4fr_0.8fr_0.7fr] gap-2 border-b border-white/[0.06] px-3 py-2.5 last:border-b-0 ${
                      isLiveCampaign ? "home-v2-frame--live__row" : ""
                    } ${isActive ? "home-v2-frame--live__row--active" : ""}`}
                  >
                    <span className="truncate text-xs font-medium text-white/85 sm:text-sm">
                      {row.company}
                    </span>
                    <span className="inline-flex items-center gap-1 truncate text-[0.7rem] font-semibold text-accent-soft sm:text-xs">
                      <Check className="h-3 w-3 shrink-0" />
                      {row.fit}
                    </span>
                    {isLiveCampaign ? (
                      <span
                        className={`home-v2-frame--live__stage truncate text-[0.7rem] text-white/55 sm:text-xs ${
                          isActive ? "home-v2-frame--live__stage--flash" : ""
                        }`}
                      >
                        <StageStatusIcon stage={row.stage} />
                        <span className="truncate" key={row.stage}>
                          {row.stage}
                        </span>
                      </span>
                    ) : (
                      <span className="truncate text-[0.7rem] text-white/55 sm:text-xs">
                        {row.stage}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          ) : null}

          {progressLabel && progressValue ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[0.7rem] text-white/50">
                <span>{progressLabel}</span>
                <span
                  className={`font-medium text-accent-soft ${
                    isLiveCampaign ? "home-v2-frame--live__progress-value" : ""
                  }`}
                >
                  {liveProgressValue}
                </span>
              </div>
              <div
                className={`h-2 overflow-hidden rounded-full bg-white/[0.08] ${
                  isLiveCampaign ? "home-v2-frame--live__progress-track" : ""
                }`}
              >
                {isLiveCampaign ? (
                  <div className="home-v2-frame--live__progress-fill-wrap">
                    <div
                      className="home-v2-frame--live__progress-fill"
                      style={{ transform: `scaleX(${progressScale})` }}
                    >
                      <span className="home-v2-frame--live__progress-shimmer" aria-hidden="true" />
                    </div>
                  </div>
                ) : (
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-brand to-accent"
                    style={{ width: `${clampedPercent}%` }}
                  />
                )}
              </div>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
