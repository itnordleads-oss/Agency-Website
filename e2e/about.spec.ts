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
        name: /Software and digital product development shaped around real requirements/i,
      })
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { level: 2, name: /How we keep delivery useful/i })
    ).toBeVisible();
    await expect(
      page.getByRole("heading", {
        level: 2,
        name: /Practical capabilities across software and web projects/i,
      })
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { level: 2, name: /A clear path from idea to launch/i })
    ).toBeVisible();

    await expect(page.locator('[aria-label="Studio delivery system"]')).toHaveCount(1);
    await expect(page.locator(".about-bento-cell").first()).toBeVisible();
    await expect(page.locator(".about-capability-row").first()).toBeVisible();
    await expect(page.locator(".about-process-node").first()).toBeVisible();
    await expect(page.getByText("Build what the product actually needs.")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Custom Software Development" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Understand", exact: true })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Launch", exact: true })).toBeVisible();

    await page
      .getByRole("button", { name: /explore services/i })
      .first()
      .click();
    await expect(page).toHaveURL(/\/services/);

    await page.goto("/about");
    await page
      .locator("main#about-page")
      .getByRole("button", { name: /start the conversation/i })
      .click();
    await expect(page).toHaveURL(/\/contact/);
  });

  test("delivery stages, principles, focus rows, and process work without hover dependency", async ({
    page,
  }) => {
    await page.goto("/about");
    await acceptCookiesIfPresent(page);

    const stages = page.locator(".about-delivery-stage");
    await expect(stages).toHaveCount(4);
    await expect(stages.nth(3)).toHaveAttribute("aria-pressed", "true", { timeout: 2_000 });
    await expect(page.locator(".about-delivery-stage.is-completed")).toHaveCount(3);
    const settledStageContrast = await stages.evaluateAll((elements) =>
      elements.map((element) => {
        const color = getComputedStyle(element).color;
        const alpha = color.match(/rgba\([^,]+,[^,]+,[^,]+,\s*([^)]+)\)/)?.[1];
        return alpha ? Number(alpha) : 1;
      })
    );
    expect(settledStageContrast.every((alpha) => alpha >= 0.65)).toBe(true);

    await stages.nth(1).focus();
    await expect(stages.nth(1)).toHaveAttribute("aria-pressed", "true");
    await expect(page.locator(".about-principle-chip").nth(1)).toHaveClass(/is-active/);

    await stages.nth(2).hover();
    await expect(stages.nth(2)).toHaveAttribute("aria-pressed", "true");
    await stages.nth(0).click();
    await expect(stages.nth(0)).toHaveAttribute("aria-pressed", "true");

    const principle = page.locator(".about-bento-button").nth(2);
    await principle.click();
    await expect(principle).toHaveAttribute("aria-pressed", "true");

    const focusRow = page.locator(".about-capability-button").nth(3);
    await focusRow.focus();
    await expect(focusRow).toHaveAttribute("aria-pressed", "true");

    await page.locator(".about-process-track").scrollIntoViewIfNeeded();
    await expect(page.locator(".about-process-step.is-active")).toHaveCount(1);
    await expect(page.locator(".about-process-step").last()).toHaveClass(/is-active/, {
      timeout: 2_000,
    });
    await expect(page.locator(".about-process-step.is-previous")).toHaveCount(4);
  });

  test("reduced motion shows settled delivery and process states", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/about");
    await acceptCookiesIfPresent(page);

    await expect(page.locator(".about-delivery-stage").last()).toHaveAttribute(
      "aria-pressed",
      "true"
    );
    await expect(page.locator(".about-process-step").last()).toHaveClass(/is-active/);
  });

  test("offscreen reveals stay readable and completed states remain stable after scrolling", async ({
    page,
  }) => {
    await page.goto("/about");
    await acceptCookiesIfPresent(page);

    const readableTargets = page.locator(
      ".about-bento-cell, .about-capability-row, .about-process-track, .about-cta-panel"
    );
    const initialOpacities = await readableTargets.evaluateAll((elements) =>
      elements.map((element) => Number(getComputedStyle(element).opacity))
    );
    expect(initialOpacities.every((opacity) => opacity === 1)).toBe(true);

    const defaultCardOpacities = await page
      .locator(".about-bento-cell")
      .evaluateAll((elements) =>
        elements.map((element) => Number(getComputedStyle(element).opacity))
      );
    expect(defaultCardOpacities).toEqual([1, 1, 1, 1]);

    await page.locator(".about-process-track").scrollIntoViewIfNeeded();
    await expect(page.locator(".about-process-step.is-previous")).toHaveCount(4, {
      timeout: 2_000,
    });
    await expect(page.locator(".about-process-step.is-active")).toHaveCount(1);

    await page.locator("#about-hero-title").scrollIntoViewIfNeeded();
    await expect(page.locator(".about-process-step.is-previous")).toHaveCount(4);
    await expect(page.locator(".about-process-step.is-active")).toHaveCount(1);
    await expect(page.locator(".about-process-track")).toHaveCSS("opacity", "1");
  });

  test("floating conversation prompt yields to the final CTA and returns above it", async ({
    page,
  }) => {
    await page.addInitScript(() => {
      const originalSetTimeout = window.setTimeout.bind(window);
      let longTimerCount = 0;
      window.setTimeout = ((handler: TimerHandler, timeout = 0, ...args: unknown[]) => {
        const adjustedTimeout =
          timeout === 10_000 ? (++longTimerCount === 1 ? 40 : 5_000) : timeout;
        return originalSetTimeout(handler, adjustedTimeout, ...args);
      }) as typeof window.setTimeout;
    });

    await page.goto("/about");
    await acceptCookiesIfPresent(page);

    const prompt = page.locator(".schedule-meeting-float");
    await expect(prompt).toBeVisible({ timeout: 2_000 });

    await page.locator("[data-floating-prompt-suppression]").scrollIntoViewIfNeeded();
    await expect(prompt).toHaveAttribute("aria-hidden", "true");
    await expect(prompt).toHaveCSS("opacity", "0");

    await page.locator("#about-hero-title").scrollIntoViewIfNeeded();
    await expect(prompt).not.toHaveAttribute("aria-hidden", "true");
    await expect(prompt).toBeVisible();
  });

  test("required viewports have no horizontal overflow and keep the mobile process vertical", async ({
    page,
  }) => {
    const viewportWidths = [320, 360, 375, 390, 414, 430, 768, 820, 1024, 1280, 1440];
    const consoleErrors: string[] = [];
    page.on("console", (message) => {
      if (message.type() === "error") {
        consoleErrors.push(message.text());
      }
    });

    await page.goto("/about");
    await acceptCookiesIfPresent(page);

    for (const width of viewportWidths) {
      await page.setViewportSize({ width, height: width <= 768 ? 1_000 : 900 });
      const layout = await page.evaluate(() => {
        const process = document.querySelector<HTMLElement>(".about-process-track");
        const rail = document.querySelector<HTMLElement>(".about-process-rail");
        const deliveryRail = document.querySelector<HTMLElement>(".about-delivery-rail");
        const hero = document.querySelector<HTMLElement>(".about-section-hero .grid");
        if (!process || !rail || !deliveryRail || !hero) {
          throw new Error("About responsive layout is missing");
        }

        const actionButtons = [
          ...document.querySelectorAll<HTMLElement>(
            ".about-section-hero .about-fade-in button, .about-section-cta button"
          ),
        ];
        const headings = [
          ...document.querySelectorAll<HTMLElement>("#about-page h1, #about-page h2"),
        ];

        return {
          clientWidth: document.documentElement.clientWidth,
          scrollWidth: document.documentElement.scrollWidth,
          processColumns: getComputedStyle(process).gridTemplateColumns,
          heroColumns: getComputedStyle(hero).gridTemplateColumns.split(" ").length,
          railWidth: rail.getBoundingClientRect().width,
          railHeight: rail.getBoundingClientRect().height,
          deliveryRailWidth: deliveryRail.getBoundingClientRect().width,
          deliveryRailHeight: deliveryRail.getBoundingClientRect().height,
          wrappedActionLabels: actionButtons
            .filter((button) => button.scrollWidth > button.clientWidth + 1)
            .map((button) => button.textContent?.trim()),
          clippedHeadings: headings
            .filter((heading) => {
              const rect = heading.getBoundingClientRect();
              return rect.left < 0 || rect.right > document.documentElement.clientWidth;
            })
            .map((heading) => heading.textContent?.trim()),
        };
      });

      expect(layout.scrollWidth, `${width}px page width`).toBeLessThanOrEqual(layout.clientWidth);
      expect(layout.wrappedActionLabels, `${width}px action labels`).toEqual([]);
      expect(layout.clippedHeadings, `${width}px headings`).toEqual([]);
      if (width <= 1024) {
        expect(layout.railHeight, `${width}px vertical process rail`).toBeGreaterThan(
          layout.railWidth
        );
      } else {
        expect(layout.railWidth, `${width}px horizontal process rail`).toBeGreaterThan(
          layout.railHeight
        );
      }
      if (width <= 768) {
        expect(
          layout.deliveryRailHeight,
          `${width}px vertical Delivery System rail`
        ).toBeGreaterThan(layout.deliveryRailWidth);
      } else {
        expect(
          layout.deliveryRailWidth,
          `${width}px horizontal Delivery System rail`
        ).toBeGreaterThan(layout.deliveryRailHeight);
      }
      expect(layout.heroColumns, `${width}px Hero columns`).toBe(width <= 1024 ? 1 : 2);
    }

    expect(consoleErrors).toEqual([]);
  });
});
