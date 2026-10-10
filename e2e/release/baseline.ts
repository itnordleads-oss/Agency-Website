import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

/**
 * Shared baseline handling for release checks running in triage mode.
 * A baseline entry marks a CONFIRMED pre-existing defect: it stays visible as a
 * warning and must carry a remediation reference and an expiry date. Expired or
 * malformed entries stop suppressing the finding, so exemptions cannot become
 * permanent anonymous debt.
 */
export interface BaselineEntry {
  /** Check identifier — SEO check id, or `axeRuleId::cssTarget` for accessibility. */
  id: string;
  /** Route the entry applies to, e.g. `/contact` or `/` (state suffix allowed, e.g. `/ :: banner dismissed`). */
  route: string;
  reason: string;
  ticket: string;
  /** YYYY-MM-DD. Past this date the entry no longer suppresses the finding. */
  expires: string;
}

const HERE = path.dirname(fileURLToPath(import.meta.url));

export function loadBaseline(fileName: string): BaselineEntry[] {
  const file = path.join(HERE, "baselines", fileName);
  if (!fs.existsSync(file)) {
    return [];
  }
  const parsed = JSON.parse(fs.readFileSync(file, "utf8")) as { entries?: BaselineEntry[] };
  return Array.isArray(parsed.entries) ? parsed.entries : [];
}

export function isExpired(entry: { expires: string }, today: Date = new Date()): boolean {
  const expiry = Date.parse(`${entry.expires}T23:59:59Z`);
  return Number.isNaN(expiry) || expiry < today.getTime();
}

/**
 * Exact match by default. An entry id ending in `*` matches by prefix — used
 * only for a stable component class that produces several node targets
 * (e.g. five eyebrow items sharing one Tailwind class). Never use a bare
 * rule id without a target; that would silently swallow future violations.
 */
export function findEntry(
  entries: BaselineEntry[],
  id: string,
  route: string
): BaselineEntry | undefined {
  return entries.find((entry) => {
    if (entry.route !== route) {
      return false;
    }
    if (entry.id.endsWith("*")) {
      return id.startsWith(entry.id.slice(0, -1));
    }
    return entry.id === id;
  });
}
