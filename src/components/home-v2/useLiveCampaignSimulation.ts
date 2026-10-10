import { useEffect, useState } from "react";

export type LiveAccountRow = {
  company: string;
  fit: string;
  stage: string;
};

/** Full outbound path — READY is the only stage that advances global progress. */
const STAGE_ORDER = [
  "Discovery",
  "Research",
  "Validation",
  "Personalization",
  "Outreach",
  "Ready",
] as const;

const INITIAL_STAGE = STAGE_ORDER[0];
const TICK_MS = 1500;
const RESET_PAUSE_MS = 1000;

function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

function isReadyStage(stage: string): boolean {
  return stage.trim().toLowerCase() === "ready";
}

function advanceStage(stage: string): string {
  const index = STAGE_ORDER.findIndex((item) => item.toLowerCase() === stage.trim().toLowerCase());
  if (index < 0) {
    return INITIAL_STAGE;
  }
  if (index >= STAGE_ORDER.length - 1) {
    return STAGE_ORDER[STAGE_ORDER.length - 1];
  }
  return STAGE_ORDER[index + 1];
}

function cloneInitialRows(accounts: readonly LiveAccountRow[]): LiveAccountRow[] {
  return accounts.map((row) => ({ ...row, stage: INITIAL_STAGE }));
}

/** Progress is READY companies only: readyCount / total × 100. */
function readyProgressPercent(rows: readonly LiveAccountRow[]): number {
  if (rows.length === 0) {
    return 0;
  }
  const readyCount = rows.filter((row) => isReadyStage(row.stage)).length;
  return Math.round((readyCount / rows.length) * 100);
}

/**
 * V3-only real-time campaign simulation.
 * Advances one company through each workflow stage; progress tracks READY count only.
 * When every company is READY, pauses briefly, resets, and loops.
 */
export function useLiveCampaignSimulation(
  enabled: boolean,
  accounts: readonly LiveAccountRow[] | undefined,
  initialPercent: number
) {
  const [allowMotion, setAllowMotion] = useState(false);
  const [activeRowIndex, setActiveRowIndex] = useState(0);
  const [rows, setRows] = useState<LiveAccountRow[]>(() =>
    accounts ? cloneInitialRows(accounts) : []
  );
  const [displayedPercent, setDisplayedPercent] = useState(0);
  const [updateToken, setUpdateToken] = useState(0);

  useEffect(() => {
    setAllowMotion(!prefersReducedMotion());
  }, []);

  useEffect(() => {
    if (!enabled || !accounts?.length) {
      setRows(accounts ? accounts.map((row) => ({ ...row })) : []);
      setDisplayedPercent(initialPercent);
      setActiveRowIndex(0);
      return;
    }

    if (!allowMotion) {
      setRows(cloneInitialRows(accounts));
      setDisplayedPercent(0);
      setActiveRowIndex(0);
      return;
    }

    let cancelled = false;
    let timeoutId = 0;
    let rowsSnapshot = cloneInitialRows(accounts);

    setRows(rowsSnapshot);
    setDisplayedPercent(0);
    setActiveRowIndex(0);

    const schedule = (delayMs: number, next: () => void) => {
      timeoutId = window.setTimeout(() => {
        if (!cancelled) {
          next();
        }
      }, delayMs);
    };

    const step = () => {
      const processingIndex = rowsSnapshot.findIndex((row) => !isReadyStage(row.stage));

      if (processingIndex < 0) {
        rowsSnapshot = cloneInitialRows(accounts);
        setRows(rowsSnapshot);
        setDisplayedPercent(0);
        setActiveRowIndex(0);
        setUpdateToken((token) => token + 1);
        schedule(TICK_MS, step);
        return;
      }

      rowsSnapshot = rowsSnapshot.map((row, index) =>
        index === processingIndex ? { ...row, stage: advanceStage(row.stage) } : row
      );

      const percent = readyProgressPercent(rowsSnapshot);
      setRows(rowsSnapshot);
      setActiveRowIndex(processingIndex);
      setDisplayedPercent(percent);
      setUpdateToken((token) => token + 1);

      if (percent >= 100) {
        schedule(RESET_PAUSE_MS, step);
        return;
      }

      schedule(TICK_MS, step);
    };

    schedule(TICK_MS, step);

    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
    };
  }, [accounts, allowMotion, enabled, initialPercent]);

  return {
    allowMotion,
    activeRowIndex,
    rows: enabled ? rows : accounts ? [...accounts] : [],
    displayedPercent: enabled ? displayedPercent : initialPercent,
    updateToken,
  };
}
