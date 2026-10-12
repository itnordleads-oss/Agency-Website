import { expect, test } from "@playwright/test";
import { acceptCookiesIfPresent } from "./helpers/cookies";

test.describe("About page structural layout", () => {
  test("/about uses split hero and differentiated sections", async ({ page }) => {
    await page.goto("/about");
    await acceptCookiesIfPresent(page);

    await expect(page.locator("#about-hero-title")).toBeVisible();
    await expect(page.getByRole("link", { name: /back to homepage/i })).toHaveCount(0);
    await expect(page.getByText(/pending leadership approval/i)).toHaveCount(0);
    await expect(page.getByText(/real conversation/i)).toHaveCount(0);

    await expect(page.getByText("WHO WE ARE", { exact: false })).toBeVisible();
    await expect(
      page.getByRole("heading", {
        level: 2,
        name: /Software and digital product delivery shaped around real requirements/i,
      })
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { level: 2, name: /How we keep delivery useful/i })
    ).toBeVisible();
    await expect(
      page.getByRole("heading", {
        level: 2,
        name: /Broad capabilities we apply across projects/i,
      })
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { level: 2, name: /A simple path from idea to launch/i })
    ).toBeVisible();

    await expect(page.locator('[aria-label="Studio delivery system"]')).toHaveCount(1);
    await expect(page.locator(".about-bento-cell").first()).toBeVisible();
    await expect(page.locator(".about-capability-row").first()).toBeVisible();
    await expect(page.locator(".about-process-node").first()).toBeVisible();
    await expect(page.getByText("Build what the product actually needs.")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Custom Software Delivery" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Understand", exact: true })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Launch", exact: true })).toBeVisible();

    await page
      .getByRole("button", { name: /explore services/i })
      .first()
      .click();
    await expect(page).toHaveURL(/\/services/);

    await page.goto("/about");
    await page.getByRole("button", { name: /get in touch/i }).click();
    await expect(page).toHaveURL(/\/contact/);
  });
});
