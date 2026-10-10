import type { Page } from "@playwright/test";

/** Dismiss the cookie consent modal when it blocks page interaction. */
export async function acceptCookiesIfPresent(page: Page): Promise<void> {
  const acceptAll = page.getByRole("button", { name: "Accept All" });
  try {
    await acceptAll.waitFor({ state: "visible", timeout: 8_000 });
    await acceptAll.click();
    await acceptAll.waitFor({ state: "hidden", timeout: 5_000 }).catch(() => undefined);
  } catch {
    // Consent may already be stored or modal not shown.
  }
}
