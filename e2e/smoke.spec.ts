import { expect, test, type Page } from "@playwright/test";
import { acceptCookiesIfPresent } from "./helpers/cookies";

declare global {
  interface Window {
    __contactFormSubmitCount?: number;
  }
}

type HomepageSectionId = "services" | "value" | "process" | "about";

async function expectHomepageSectionBelowNavbar(page: Page, sectionId: HomepageSectionId) {
  const section = page.locator(`section#${sectionId}`);
  const heading = section.getByRole("heading", { level: 2 }).first();
  // All homepage sections land on the content-start marker (eyebrow), not the padded box.
  const scrollTarget = page.locator(`[data-homepage-scroll-ref="${sectionId}"]`);
  const minGapPx = 8;
  const maxGapPx = 48;

  await expect(section).toBeVisible({ timeout: 15_000 });
  await expect(heading).toBeVisible();
  await expect(scrollTarget).toBeAttached();
  await expect
    .poll(
      async () => {
        const [headerBox, targetBox] = await Promise.all([
          page.locator("header").boundingBox(),
          scrollTarget.boundingBox(),
        ]);
        if (!headerBox || !targetBox) {
          return -1;
        }
        // On-screen header bottom (clamped). Detached sticky has scrolled away.
        const visibleHeaderBottom = Math.max(0, headerBox.y + headerBox.height);
        return targetBox.y - visibleHeaderBottom;
      },
      { timeout: 15_000 }
    )
    .toBeGreaterThanOrEqual(minGapPx);
  await expect
    .poll(
      async () => {
        const [headerBox, targetBox] = await Promise.all([
          page.locator("header").boundingBox(),
          scrollTarget.boundingBox(),
        ]);
        if (!headerBox || !targetBox) {
          return Number.POSITIVE_INFINITY;
        }
        const visibleHeaderBottom = Math.max(0, headerBox.y + headerBox.height);
        return targetBox.y - visibleHeaderBottom;
      },
      { timeout: 15_000 }
    )
    .toBeLessThanOrEqual(maxGapPx);
}

test.describe("smoke", () => {
  test("home page loads Homepage V3", { tag: "@critical" }, async ({ page }) => {
    await page.goto("/");
    await acceptCookiesIfPresent(page);

    await expect(page).toHaveTitle(/Agency Website/i);
    await expect(page.getByRole("banner").getByLabel("Agency")).toBeVisible();
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible({ timeout: 15_000 });
    await expect(page.getByRole("heading", { level: 1 })).toContainText(/digital products|delivery partner/i);
  });

  test("homepage hides unverified trust modules and product surfaces", async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on("console", (message) => {
      if (message.type() === "error") {
        consoleErrors.push(message.text());
      }
    });

    await page.goto("/");
    await acceptCookiesIfPresent(page);

    await page.evaluate(async () => {
      for (let attempt = 0; attempt < 35; attempt += 1) {
        window.scrollTo(0, document.documentElement.scrollHeight);
        await new Promise((resolve) => window.setTimeout(resolve, 80));
      }
    });

    await expect(page.locator("#company-logo-carousel")).toHaveCount(0);
    await expect(page.locator("#v2-trust")).toHaveCount(0);
    await expect(page.locator("#v2-testimonials")).toHaveCount(0);
    await expect(page.locator("section#pricing")).toHaveCount(0);
    await expect(page.locator("section#product")).toHaveCount(0);
    await expect(page.locator("section#benefits")).toHaveCount(0);
    await expect(page.locator("section#v2-faq")).toHaveCount(0);
    await expect(page.getByText(/ADealForge/i)).toHaveCount(0);
    await expect(page.getByText(/outbound sales/i)).toHaveCount(0);
    await expect(page.getByText(/100k\+/i)).toHaveCount(0);

    await expect(page.locator("section#services")).toBeVisible();
    await expect(page.locator("section#value")).toBeVisible();
    await expect(page.locator("section#process")).toBeVisible();
    await expect(page.locator("section#about")).toBeVisible();
    await expect(page.locator("section#v2-final-cta")).toBeVisible();

    for (const viewport of [
      { width: 390, height: 844 },
      { width: 768, height: 1024 },
      { width: 1440, height: 900 },
    ]) {
      await page.setViewportSize(viewport);
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth > document.documentElement.clientWidth
      );
      expect(overflow).toBe(false);
    }

    expect(consoleErrors).toEqual([]);
  });

  test("homepage omits unverified testimonials", async ({ page }) => {
    await page.goto("/");
    await acceptCookiesIfPresent(page);
    await page.evaluate(async () => {
      for (let attempt = 0; attempt < 25; attempt += 1) {
        window.scrollTo(0, document.documentElement.scrollHeight);
        await new Promise((resolve) => window.setTimeout(resolve, 60));
      }
    });
    await expect(page.locator("#v2-testimonials")).toHaveCount(0);
    await expect(page.getByText(/Customer stories/i)).toHaveCount(0);
  });

  test("header brand mark stays compact and vertically centered across breakpoints", async ({
    page,
  }) => {
    const consoleErrors: string[] = [];
    page.on("console", (message) => {
      if (message.type() === "error") {
        consoleErrors.push(message.text());
      }
    });

    for (const viewport of [
      { width: 390, height: 844, maxMarkHeight: 36 },
      { width: 768, height: 1024, maxMarkHeight: 44 },
      { width: 1440, height: 900, maxMarkHeight: 48 },
    ]) {
      await page.setViewportSize(viewport);
      await page.goto("/");
      await acceptCookiesIfPresent(page);

      const header = page.locator("header");
      // F2: approved logo asset is TBC, so the header may render a text mark instead of <img>.
      const logoLink = header.getByRole("link", { name: "Agency" });
      await expect(logoLink).toBeVisible();

      const metrics = await page.evaluate(() => {
        const headerEl = document.querySelector("header");
        const linkEl = headerEl?.querySelector('a[aria-label="Agency"]') as HTMLElement | null;
        const markEl = (linkEl?.querySelector("img") ??
          linkEl?.querySelector("span")) as HTMLElement | null;
        if (!headerEl || !linkEl || !markEl) {
          return null;
        }

        const headerBox = headerEl.getBoundingClientRect();
        const linkBox = linkEl.getBoundingClientRect();
        const markBox = markEl.getBoundingClientRect();
        const headerCenter = headerBox.top + headerBox.height / 2;
        const markCenter = markBox.top + markBox.height / 2;

        return {
          markHeight: markBox.height,
          verticalOffset: Math.abs(markCenter - headerCenter),
          linkWithinHeader:
            linkBox.top >= headerBox.top - 1 && linkBox.bottom <= headerBox.bottom + 1,
        };
      });

      expect(metrics).not.toBeNull();
      expect(metrics?.markHeight ?? 0).toBeGreaterThan(10);
      expect(metrics?.markHeight ?? 99).toBeLessThanOrEqual(viewport.maxMarkHeight);
      expect(metrics?.verticalOffset ?? 99).toBeLessThanOrEqual(8);
      expect(metrics?.linkWithinHeader).toBe(true);
    }

    expect(consoleErrors).toEqual([]);
  });

  test("platform page loads", { tag: "@critical" }, async ({ page }) => {
    await page.goto("/platform");
    await acceptCookiesIfPresent(page);

    await expect(page).toHaveTitle(/Platform/i);
    await expect(page.getByRole("heading", { level: 1, name: "Platform" })).toBeVisible({
      timeout: 15_000,
    });

    await page.evaluate(async () => {
      for (let attempt = 0; attempt < 24; attempt += 1) {
        window.scrollTo(0, document.documentElement.scrollHeight);
        await new Promise((resolve) => window.setTimeout(resolve, 80));
      }
    });

    const overviewStrip = page.locator("#platform-overview-strip");
    await expect(overviewStrip).toBeVisible({ timeout: 15_000 });
    await overviewStrip.scrollIntoViewIfNeeded();
    await expect(overviewStrip.getByRole("button", { name: /Let's Talk/i })).toHaveCount(0);
    await expect(
      overviewStrip.getByText("No pressure. No obligation.", { exact: true })
    ).toHaveCount(0);
    for (const title of [
      "Find the right companies",
      "Research before you write",
      "Launch with support",
    ]) {
      await expect(overviewStrip.getByText(title, { exact: true })).toBeVisible();
    }
    await expect(overviewStrip.getByRole("button")).toHaveCount(0);
    await expect(overviewStrip.getByRole("link")).toHaveCount(0);
  });

  test("platform capabilities use interactive walkthrough and preserve content", async ({
    page,
  }) => {
    test.setTimeout(90_000);

    const consoleErrors: string[] = [];
    const pageErrors: string[] = [];
    page.on("console", (message) => {
      if (message.type() === "error") {
        consoleErrors.push(message.text());
      }
    });
    page.on("pageerror", (error) => pageErrors.push(error.message));

    const mountCapabilities = async () => {
      await page.goto("/platform");
      await acceptCookiesIfPresent(page);
      await page.evaluate(async () => {
        for (let attempt = 0; attempt < 24; attempt += 1) {
          window.scrollTo(0, document.documentElement.scrollHeight);
          await new Promise((resolve) => window.setTimeout(resolve, 80));
        }
      });

      const section = page.locator("section#platform-anchor");
      await expect(section).toBeVisible({ timeout: 15_000 });
      await section.scrollIntoViewIfNeeded();
      return section;
    };

    const capabilityContent = [
      {
        title: "Find matching companies",
        description:
          "Your ICP filters produce a ranked shortlist — industry, geography, company size, and buying signals applied before anyone researches accounts.",
      },
      {
        title: "Company research",
        description:
          "Each account gets a brief: what they do, where they sell, team size, and the signal that makes them worth contacting.",
      },
      {
        title: "Check contact details",
        description:
          "Every contact is checked for a deliverable email route; uncertain addresses are flagged before outreach starts.",
      },
      {
        title: "Personalized sales emails",
        description:
          "First-touch drafts reference real account context — company, role, and signal — written in your voice and ready for approval.",
      },
      {
        title: "Managed email sending",
        description:
          "Send from your domain or warmed inboxes while inbox health, warmup status, and delivery routing stay monitored.",
      },
    ];

    await page.emulateMedia({ reducedMotion: "no-preference" });

    for (const viewport of [
      { width: 320, height: 720, layout: "accordion" },
      { width: 390, height: 844, layout: "accordion" },
      { width: 768, height: 1024, layout: "stacked" },
      { width: 1440, height: 900, layout: "columns" },
    ] as const) {
      await page.setViewportSize(viewport);
      const section = await mountCapabilities();
      const intro = section.locator(".platform-capabilities__intro");
      const panelStack = section.locator("[data-capability-panel]");
      const accordion = section.locator("[data-capability-accordion]");
      const nav = section.locator(".platform-capabilities__nav");

      const layout = await page.evaluate(() => {
        const sectionEl = document.querySelector<HTMLElement>("section#platform-anchor");
        const introEl = sectionEl?.querySelector<HTMLElement>(".platform-capabilities__intro");
        const panelEl = sectionEl?.querySelector<HTMLElement>("[data-capability-panel]");
        const accordionEl = sectionEl?.querySelector<HTMLElement>("[data-capability-accordion]");
        const navEl = sectionEl?.querySelector<HTMLElement>(".platform-capabilities__nav");
        const sectionBox = sectionEl?.getBoundingClientRect();
        const introBox = introEl?.getBoundingClientRect();
        const panelBox = panelEl?.getBoundingClientRect();
        const accordionBox = accordionEl?.getBoundingClientRect();
        const navStyles = navEl ? window.getComputedStyle(navEl) : null;
        const panelStyles = panelEl ? window.getComputedStyle(panelEl) : null;
        const accordionStyles = accordionEl ? window.getComputedStyle(accordionEl) : null;

        return {
          documentFitsViewport:
            document.documentElement.scrollWidth <= document.documentElement.clientWidth,
          sectionFitsViewport:
            (sectionBox?.left ?? -1) >= -1 &&
            (sectionBox?.right ?? Number.POSITIVE_INFINITY) <=
              document.documentElement.clientWidth + 1,
          intro: introBox
            ? { top: introBox.top, right: introBox.right, bottom: introBox.bottom }
            : null,
          panel: panelBox
            ? { top: panelBox.top, left: panelBox.left, width: panelBox.width }
            : null,
          accordion: accordionBox
            ? { top: accordionBox.top, left: accordionBox.left, height: accordionBox.height }
            : null,
          introRight: introBox?.right ?? 0,
          navDisplay: navStyles?.display ?? "none",
          panelDisplay: panelStyles?.display ?? "none",
          accordionDisplay: accordionStyles?.display ?? "none",
        };
      });

      expect(layout.documentFitsViewport).toBe(true);
      expect(layout.sectionFitsViewport).toBe(true);
      expect(layout.intro).not.toBeNull();
      await expect(intro).toBeVisible();

      if (viewport.layout === "accordion") {
        expect(layout.navDisplay).toBe("none");
        expect(layout.panelDisplay).toBe("none");
        expect(layout.accordionDisplay).not.toBe("none");
        expect(layout.accordion?.top ?? 0).toBeGreaterThan((layout.intro?.bottom ?? 0) + 8);
        await expect(accordion).toBeVisible();
        await expect(section.locator("[data-capability-card]")).toHaveCount(5);
        const openCard = section.locator("[data-capability-card].is-open");
        await expect(openCard.getByText(capabilityContent[0].title)).toBeVisible();
        await expect(
          openCard.getByText(capabilityContent[0].description, { exact: true })
        ).toBeVisible();
        await expect(
          openCard.locator(".capability-preview[data-preview='discovery']")
        ).toBeVisible();
      } else {
        expect(layout.navDisplay).not.toBe("none");
        expect(layout.panelDisplay).not.toBe("none");
        expect(layout.accordionDisplay).toBe("none");
        await expect(nav).toBeVisible();
        await expect(panelStack).toBeVisible();
        await expect(section.getByRole("tab")).toHaveCount(5);
        await expect(section.getByRole("tab", { selected: true })).toHaveCount(1);
        await expect(
          section.getByRole("tab", { name: capabilityContent[0].title, selected: true })
        ).toBeVisible();
        const activePanel = section
          .getByRole("tabpanel")
          .filter({ hasText: capabilityContent[0].description });
        await expect(activePanel).toBeVisible();
        await expect(
          activePanel.locator(".capability-preview[data-preview='discovery']")
        ).toBeVisible();

        if (viewport.layout === "columns") {
          expect(layout.panel?.left ?? 0).toBeGreaterThan(layout.introRight + 20);
        } else {
          expect(layout.panel?.top ?? 0).toBeGreaterThan((layout.intro?.bottom ?? 0) + 8);
        }
      }
    }

    await page.setViewportSize({ width: 1440, height: 900 });
    const section = await mountCapabilities();
    await expect(
      section.getByRole("heading", { level: 2, name: "The work behind better outbound." })
    ).toBeVisible();
    await expect(
      section.getByText(
        "Each step produces something your team can review — from a filtered account list to inbox-ready outreach.",
        { exact: true }
      )
    ).toBeVisible();

    const capabilityPreviews = [
      { preview: "discovery", marker: "ICP shortlist ready" },
      { preview: "intelligence", marker: "Account rationale ready" },
      { preview: "validation", marker: "Reliable routes prioritized" },
      { preview: "messaging", marker: "Ready for review" },
      { preview: "sending", marker: "Managed send" },
    ] as const;

    for (const [index, capability] of capabilityContent.entries()) {
      const tab = section.getByRole("tab", { name: capability.title });
      await tab.click();
      await expect(tab).toHaveAttribute("aria-selected", "true");
      const panel = section.getByRole("tabpanel").filter({ hasText: capability.title });
      await expect(panel).toBeVisible();
      await expect(panel.getByRole("heading", { level: 3, name: capability.title })).toBeVisible();
      await expect(panel.getByText(capability.description, { exact: true })).toBeVisible();
      await expect(panel.getByText(`Capability ${index + 1} of 5`)).toBeVisible();
      await expect(
        panel.locator(`.capability-preview[data-preview='${capabilityPreviews[index].preview}']`)
      ).toBeVisible();
      await expect(
        panel.getByText(capabilityPreviews[index].marker, { exact: true })
      ).toBeVisible();
      const previewBox = await panel.locator(".capability-preview").boundingBox();
      expect(previewBox?.height ?? 0).toBeGreaterThan(120);
    }

    const firstTab = section.getByRole("tab", { name: capabilityContent[0].title });
    await firstTab.click();
    await firstTab.focus();
    await expect(firstTab).toBeFocused();
    await page.keyboard.press("ArrowDown");
    await expect(
      section.getByRole("tab", { name: capabilityContent[1].title, selected: true })
    ).toBeFocused();
    await expect(
      section.getByRole("tabpanel").filter({ hasText: capabilityContent[1].description })
    ).toBeVisible();

    for (const pill of ["Human review", "Verified data", "Campaign visibility"]) {
      await expect(section.getByText(pill, { exact: true })).toBeVisible();
    }
    await expect(section.locator(".platform-capabilities__stages")).toHaveCount(0);

    const frame = section.locator(".platform-capabilities__frame");
    const initialFrameHeight = await frame.evaluate(
      (element) => element.getBoundingClientRect().height
    );
    await section.getByRole("tab", { name: capabilityContent[4].title }).hover();
    await expect(
      section.getByRole("tab", { name: capabilityContent[4].title, selected: true })
    ).toBeVisible();
    await expect(
      section.getByRole("tabpanel").filter({ hasText: capabilityContent[4].description })
    ).toBeVisible();
    await page.waitForTimeout(300);
    const stableFrameHeight = await frame.evaluate(
      (element) => element.getBoundingClientRect().height
    );
    expect(Math.abs(stableFrameHeight - initialFrameHeight)).toBeLessThanOrEqual(2);

    const secondaryCta = section.getByRole("button", { name: "See how it works" });
    await secondaryCta.focus();
    await expect(secondaryCta).toBeFocused();
    const scrollBeforeSecondaryCta = await page.evaluate(() => window.scrollY);
    await page.keyboard.press("Enter");
    await expect
      .poll(() => page.evaluate(() => window.scrollY), { timeout: 5_000 })
      .toBeLessThan(scrollBeforeSecondaryCta);

    await page.setViewportSize({ width: 390, height: 844 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    const reducedMotionSection = await mountCapabilities();
    const accordionItems = reducedMotionSection.locator("[data-capability-card]");
    await expect(accordionItems).toHaveCount(5);
    await accordionItems.nth(2).locator("button").click();
    await expect(accordionItems.nth(2)).toHaveClass(/is-open/);
    await expect(
      accordionItems.nth(2).getByText(capabilityContent[2].description, { exact: true })
    ).toBeVisible();
    await expect(
      accordionItems.nth(2).locator(".capability-preview[data-preview='validation']")
    ).toBeVisible();
    await expect(accordionItems.nth(0)).not.toHaveClass(/is-open/);

    const panelAnimation = await reducedMotionSection
      .locator(".platform-capabilities__panel-inner")
      .first()
      .evaluate((element) => getComputedStyle(element).animationName);
    expect(panelAnimation === "none" || panelAnimation === "").toBe(true);

    const primaryCta = reducedMotionSection.getByRole("button", {
      name: "Start the Conversation",
    });
    await primaryCta.click();
    await expect(page).toHaveURL(/\/contact$/);

    expect(consoleErrors).toEqual([]);
    expect(pageErrors).toEqual([]);
  });

  test("platform page updates when language changes", async ({ page }) => {
    await page.goto("/platform");
    await acceptCookiesIfPresent(page);

    await expect(page.getByRole("heading", { level: 1, name: "Platform" })).toBeVisible({
      timeout: 15_000,
    });

    await page
      .locator("header")
      .getByRole("button", { name: /Language/i })
      .first()
      .click();
    await page.getByRole("option", { name: /^DE$/i }).first().click();

    await expect(page).toHaveTitle(/Plattform/i);
    await expect(page.getByRole("heading", { level: 1, name: "Plattform" })).toBeVisible({
      timeout: 15_000,
    });
    await expect(page.getByRole("button", { name: /Gespräch starten/i }).first()).toBeVisible();
  });

  test("approved SEO copy appears on active public routes", async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on("console", (message) => {
      if (message.type() === "error") {
        consoleErrors.push(message.text());
      }
    });

    await page.goto("/");
    await acceptCookiesIfPresent(page);

    const hero = page.locator("section#v2-hero");
    await expect(
      hero.getByText(
        "We help growing teams plan, build, and launch custom software and modern web experiences—with practical engineering and clear communication.",
        { exact: true }
      )
    ).toBeVisible();
    await expect(hero.getByText(/ADealForge/i)).toHaveCount(0);
    await expect(hero.getByText(/outbound sales/i)).toHaveCount(0);

    await page.evaluate(async () => {
      for (let attempt = 0; attempt < 35; attempt += 1) {
        window.scrollTo(0, document.documentElement.scrollHeight);
        await new Promise((resolve) => window.setTimeout(resolve, 80));
      }
    });

    await expect(page.locator("section#v2-results")).toHaveCount(0);
    await expect(page.locator("section#benefits")).toHaveCount(0);
    await expect(page.locator("#v2-testimonials")).toHaveCount(0);
    await expect(page.locator("section#pricing")).toHaveCount(0);
    await expect(page.locator("section#v2-faq")).toHaveCount(0);
    await expect(page.locator("section#services")).toBeVisible();
    await expect(page.locator("section#value")).toBeVisible();
    await expect(page.locator("section#process")).toBeVisible();
    await expect(page.locator("section#about")).toBeVisible();
    await expect(
      page
        .locator("footer")
        .getByText("Custom software and digital product delivery for growing teams.", {
          exact: true,
        })
    ).toBeVisible();

    await page.goto("/platform");
    await acceptCookiesIfPresent(page);

    const platform = page.locator("main#platform-page");
    await expect(
      platform.getByText(
        "Find the right companies, conduct prospect research, and prepare personalized first sales emails with human review and live campaign support.",
        { exact: true }
      )
    ).toBeVisible();
    await expect(
      platform.getByText(
        "Managed outreach is available now through a reviewed workflow. Public platform access stays closed while development continues.",
        { exact: true }
      )
    ).toBeVisible();
    await expect(
      platform.getByText(
        "Tell us your outbound goals and we’ll share how managed services can help—no pressure.",
        { exact: true }
      )
    ).toBeVisible();
    await expect(platform.getByText(/The platform is still being built/i)).toHaveCount(0);
    await expect(platform.getByText(/Curious about what we're building\?/i)).toHaveCount(0);

    expect(consoleErrors).toEqual([]);
  });

  test(
    "workflow page renders only the workflow dashboard",
    { tag: "@critical" },
    async ({ page }) => {
      const consoleErrors: string[] = [];
      const pageErrors: string[] = [];
      page.on("console", (message) => {
        if (message.type() === "error") {
          consoleErrors.push(message.text());
        }
      });
      page.on("pageerror", (error) => pageErrors.push(error.message));

      await page.goto("/workflow");
      await acceptCookiesIfPresent(page);

      await expect(page).toHaveTitle(/Workflow/i);
      await expect(page.locator("main#workflow-page > section#workflow")).toHaveCount(1);
      await expect(page.locator("section#workflow")).toBeVisible({ timeout: 15_000 });
      await expect(
        page.locator("section#workflow").getByRole("navigation", { name: "Workflow navigation" })
      ).toBeVisible();

      for (const removedSectionId of [
        "hero",
        "platform",
        "how-it-works",
        "proof",
        "sectors",
        "capabilities",
        "pricing",
        "faq",
        "final-cta",
        "contact",
        "product",
        "benefits",
        "v2-results",
        "v2-testimonials",
        "v2-faq",
        "v2-final-cta",
      ]) {
        await expect(page.locator(`#${removedSectionId}`)).toHaveCount(0);
      }

      await expect(page.locator("main#workflow-page > section")).toHaveCount(1);

      // F3: product Workflow is no longer in the public studio navbar.
      await expect(
        page.getByRole("navigation", { name: "Primary" }).getByRole("link", { name: "Workflow" })
      ).toHaveCount(0);

      expect(consoleErrors).toEqual([]);
      expect(pageErrors).toEqual([]);
    }
  );

  test("workflow dashboard remains responsive on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/workflow");
    await acceptCookiesIfPresent(page);

    const workflow = page.locator("main#workflow-page > section#workflow");
    await expect(workflow).toBeVisible({ timeout: 15_000 });
    await expect(workflow.getByRole("group", { name: "Workflow stages" })).toBeVisible();
    await expect(page.locator("main#workflow-page > section")).toHaveCount(1);

    const workflowBox = await workflow.boundingBox();
    expect(workflowBox).not.toBeNull();
    expect(workflowBox?.x).toBeGreaterThanOrEqual(0);
    expect((workflowBox?.x ?? 0) + (workflowBox?.width ?? 0)).toBeLessThanOrEqual(390);
  });

  test("workflow header-to-content top spacing matches Platform and Contact", async ({ page }) => {
    test.setTimeout(90_000);

    let cookiesHandled = false;
    const readHeaderToBackGap = async (path: string, mainSelector: string) => {
      await page.goto(path);
      if (!cookiesHandled) {
        await acceptCookiesIfPresent(page);
        cookiesHandled = true;
      }
      await page.evaluate(() => window.scrollTo({ top: 0, behavior: "auto" }));

      const main = page.locator(mainSelector);
      await expect(main).toBeVisible({ timeout: 15_000 });

      const back = main.getByRole("button", { name: /Back to homepage/i }).first();
      await expect(back).toBeVisible();

      return page.evaluate((selector) => {
        const header = document.querySelector("header");
        const mainEl = document.querySelector(selector);
        const target = Array.from(mainEl?.querySelectorAll("button") ?? []).find((button) =>
          /Back to homepage/i.test(button.textContent ?? "")
        );
        if (!header || !target) {
          return null;
        }
        return target.getBoundingClientRect().top - header.getBoundingClientRect().bottom;
      }, mainSelector);
    };

    for (const viewport of [
      { width: 390, height: 844 },
      { width: 768, height: 1024 },
      { width: 1440, height: 900 },
    ]) {
      await page.setViewportSize(viewport);

      const platformGap = await readHeaderToBackGap("/platform", "main#platform-page");
      const contactGap = await readHeaderToBackGap("/contact", "main#contact-page");
      const workflowGap = await readHeaderToBackGap("/workflow", "main#workflow-page");

      expect(platformGap).not.toBeNull();
      expect(contactGap).not.toBeNull();
      expect(workflowGap).not.toBeNull();

      // Shared page-shell padding; allow small sub-pixel / Contact border-t variance.
      expect(Math.abs((platformGap as number) - (contactGap as number))).toBeLessThanOrEqual(2);
      expect(Math.abs((workflowGap as number) - (platformGap as number))).toBeLessThanOrEqual(2);
      expect(workflowGap as number).toBeGreaterThanOrEqual(8);
    }
  });

  test("workflow page updates when language changes", async ({ page }) => {
    await page.goto("/workflow");
    await acceptCookiesIfPresent(page);

    await expect(page).toHaveTitle(/Workflow/i);

    await page
      .locator("header")
      .getByRole("button", { name: /Language/i })
      .first()
      .click();
    await page.getByRole("option", { name: /^DE$/i }).first().click();

    await expect(page).toHaveTitle(/Workflow/i);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      "content",
      /Sehen Sie, wie ADealForge/
    );
    await expect(page.locator("main#workflow-page > section#workflow")).toHaveCount(1);
    await expect(
      page.getByRole("navigation", { name: "Primary" }).getByRole("link", { name: "Services" })
    ).toBeVisible();
    await expect(
      page.getByRole("navigation", { name: "Primary" }).getByRole("link", { name: "Workflow" })
    ).toHaveCount(0);
  });

  test("homepage omits product pricing", async ({ page }) => {
    await page.goto("/");
    await acceptCookiesIfPresent(page);
    await page.evaluate(async () => {
      for (let attempt = 0; attempt < 30; attempt += 1) {
        window.scrollTo(0, document.documentElement.scrollHeight);
        await new Promise((resolve) => window.setTimeout(resolve, 60));
      }
    });
    await expect(page.locator("section#pricing")).toHaveCount(0);
    await expect(page.getByRole("button", { name: /^Monthly$/i })).toHaveCount(0);
    await expect(page.getByText(/verified leads/i)).toHaveCount(0);
  });

  test("homepage value and process sections render across breakpoints", async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on("console", (message) => {
      if (message.type() === "error") {
        consoleErrors.push(message.text());
      }
    });

    await page.goto("/#process");
    await acceptCookiesIfPresent(page);
    await expectHomepageSectionBelowNavbar(page, "process");

    const value = page.locator("section#value");
    const process = page.locator("section#process");
    await expect(value.getByRole("heading", { level: 2 })).toBeVisible();
    await expect(process.getByRole("heading", { level: 2 })).toBeVisible();
    await expect(value.getByText("Clear communication")).toBeVisible();
    await expect(process.getByRole("heading", { name: "Understand", exact: true })).toBeVisible();
    await expect(process.getByRole("heading", { name: "Launch", exact: true })).toBeVisible();
    await expect(page.getByText(/ADealForge/i)).toHaveCount(0);

    for (const viewport of [
      { width: 1440, height: 900 },
      { width: 768, height: 1024 },
      { width: 390, height: 844 },
    ]) {
      await page.setViewportSize(viewport);
      await expect(value).toBeVisible();
      await expect(process).toBeVisible();
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth > document.documentElement.clientWidth
      );
      expect(overflow).toBe(false);
    }

    expect(consoleErrors).toEqual([]);
  });

  test("homepage navbar exposes studio routes only", async ({ page }) => {
    const consoleErrors: string[] = [];
    const pageErrors: string[] = [];
    page.on("console", (message) => {
      if (message.type() === "error") {
        consoleErrors.push(message.text());
      }
    });
    page.on("pageerror", (error) => pageErrors.push(error.message));

    await page.goto("/");
    await acceptCookiesIfPresent(page);

    const primaryNavigation = page.getByRole("navigation", { name: "Primary" });
    await expect(primaryNavigation.getByRole("link", { name: "Home" })).toHaveAttribute(
      "href",
      "/"
    );
    await expect(primaryNavigation.getByRole("link", { name: "Services" })).toHaveAttribute(
      "href",
      "/services"
    );
    await expect(primaryNavigation.getByRole("link", { name: "About" })).toHaveAttribute(
      "href",
      "/about"
    );
    await expect(primaryNavigation.getByRole("link", { name: "Contact" })).toHaveAttribute(
      "href",
      "/contact"
    );

    // Product-era and unpublished routes stay out of the public studio navbar.
    await expect(primaryNavigation.getByRole("link", { name: "Platform" })).toHaveCount(0);
    await expect(primaryNavigation.getByRole("link", { name: "Workflow" })).toHaveCount(0);
    await expect(primaryNavigation.getByRole("link", { name: "Pricing" })).toHaveCount(0);
    await expect(primaryNavigation.getByRole("link", { name: "Product" })).toHaveCount(0);
    await expect(primaryNavigation.getByRole("link", { name: "Benefits" })).toHaveCount(0);
    await expect(primaryNavigation.getByRole("link", { name: "Work" })).toHaveCount(0);

    const servicesLink = primaryNavigation.getByRole("link", { name: "Services" });
    await servicesLink.focus();
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/\/services$/);
    await expect(page.getByRole("heading", { level: 1, name: "Services" })).toBeVisible();

    expect(consoleErrors).toEqual([]);
    expect(pageErrors).toEqual([]);
  });

  test(
    "studio nav links navigate correctly from every public route",
    { tag: "@critical" },
    async ({ page }) => {
      test.setTimeout(90_000);

      for (const source of [
        { path: "/", target: "Services", href: "/services", heading: "Services" },
        { path: "/contact", target: "About", href: "/about", heading: "About" },
        {
          path: "/services",
          target: "Contact",
          href: "/contact",
          heading: /start the conversation/i,
        },
        { path: "/about", target: "Home", href: "/", heading: /digital products|delivery partner/i },
      ] as const) {
        await page.goto(source.path);
        await acceptCookiesIfPresent(page);

        const link = page
          .getByRole("navigation", { name: "Primary" })
          .getByRole("link", { name: source.target });
        await expect(link).toHaveAttribute("href", source.href);
        await link.click();
        await expect(page).toHaveURL(
          source.href === "/" ? /\/(?:$|\?)/ : new RegExp(`${source.href}$`)
        );
        await expect(page.getByRole("heading", { level: 1 })).toContainText(source.heading);
      }
    }
  );

  test(
    "mobile navbar studio link routes and closes the menu",
    { tag: "@critical" },
    async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto("/contact");
      await acceptCookiesIfPresent(page);

      await page.getByRole("button", { name: "Toggle menu" }).click();
      const mobileMenu = page.getByRole("dialog", { name: "Toggle menu" });
      await expect(mobileMenu.getByText("Platform", { exact: true })).toHaveCount(0);
      await expect(mobileMenu.getByText("Workflow", { exact: true })).toHaveCount(0);
      await expect(mobileMenu.getByText("Pricing", { exact: true })).toHaveCount(0);
      await expect(mobileMenu.getByText("Work", { exact: true })).toHaveCount(0);
      const aboutLink = mobileMenu.getByRole("link", { name: "About" });
      await expect(aboutLink).toHaveAttribute("href", "/about");
      await aboutLink.click();

      await expect(page).toHaveURL(/\/about$/);
      await expect(mobileMenu).toHaveCount(0);
      await expect(page.getByRole("heading", { level: 1, name: "About" })).toBeVisible();
    }
  );

  test("homepage section hashes survive refresh and browser history navigation", async ({
    page,
  }) => {
    await page.goto("/#process");
    await acceptCookiesIfPresent(page);
    await expectHomepageSectionBelowNavbar(page, "process");

    await page.reload();
    await expect(page).toHaveURL(/\/#process$/);
    await expectHomepageSectionBelowNavbar(page, "process");

    await page.evaluate(() => {
      window.location.hash = "services";
    });
    await expect(page).toHaveURL(/\/#services$/);
    await expectHomepageSectionBelowNavbar(page, "services");

    await page.goBack();
    await expect(page).toHaveURL(/\/#process$/);
    await expectHomepageSectionBelowNavbar(page, "process");

    await page.goForward();
    await expect(page).toHaveURL(/\/#services$/);
    await expectHomepageSectionBelowNavbar(page, "services");
  });

  test(
    "legacy homepage v1 redirects to production home",
    { tag: "@critical" },
    async ({ page }) => {
      await page.goto("/homepage-v1");
      await acceptCookiesIfPresent(page);

      await expect(page).toHaveURL(/\/$/);
      await expect(page).toHaveTitle(/Agency Website/i);
      await expect(page.getByRole("heading", { level: 1 })).toContainText(/digital products|delivery partner/i);
    }
  );

  test("legacy homepage v2 redirects to production home", async ({ page }) => {
    await page.goto("/homepage-v2");
    await acceptCookiesIfPresent(page);

    await expect(page).toHaveURL(/\/$/);
    await expect(page).toHaveTitle(/Agency Website/i);
    await expect(page.getByRole("heading", { level: 1 })).toContainText(/digital products|delivery partner/i);
  });

  test("legacy homepage v3 redirects to production home", async ({ page }) => {
    await page.goto("/homepage-v3");
    await acceptCookiesIfPresent(page);

    await expect(page).toHaveURL(/\/$/);
    await expect(page).toHaveTitle(/Agency Website/i);
    await expect(page.getByRole("heading", { level: 1 })).toContainText(/digital products|delivery partner/i);
  });

  test("contact page loads", { tag: "@critical" }, async ({ page }) => {
    await page.goto("/contact");
    await acceptCookiesIfPresent(page);

    await expect(page).toHaveTitle(/Contact/i);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible({ timeout: 15_000 });
  });

  test.describe("contact form keyboard submit", () => {
    const nameError = "Add your name or company.";

    async function openContactForm(page: Page) {
      await page.goto("/contact");
      await acceptCookiesIfPresent(page);
      const form = page.locator("main#contact-page form");
      await expect(form).toBeVisible({ timeout: 15_000 });
      await page.evaluate(() => {
        const contactForm = document.querySelector("main#contact-page form");
        if (!(contactForm instanceof HTMLFormElement)) {
          return;
        }
        window.__contactFormSubmitCount = 0;
        contactForm.addEventListener("submit", () => {
          window.__contactFormSubmitCount += 1;
        });
      });
      return form;
    }

    async function submitCount(page: Page) {
      return page.evaluate(() => window.__contactFormSubmitCount ?? 0);
    }

    test("Enter in Name submits the form", async ({ page }) => {
      const form = await openContactForm(page);
      await form.locator("#business-name").fill("Northline Logistics");
      await form.locator("#business-name").press("Enter");

      await expect(form.getByText(nameError)).toHaveCount(0);
      await expect(form.getByText("Add the email where we should reply.")).toBeVisible();
      expect(await submitCount(page)).toBe(1);
    });

    test("Enter in Email submits the form", async ({ page }) => {
      const form = await openContactForm(page);
      await form.locator("#business-email").fill("james@buildspan.example");
      await form.locator("#business-email").press("Enter");

      await expect(form.getByText(nameError)).toBeVisible();
      expect(await submitCount(page)).toBe(1);
    });

    test("Enter in the description textarea submits the form", async ({ page }) => {
      const form = await openContactForm(page);
      const message = form.locator("#target-market");
      await message.fill("We need outbound help for logistics buyers.");
      await message.press("Enter");

      await expect(message).toHaveValue("We need outbound help for logistics buyers.");
      await expect(form.getByText(nameError)).toBeVisible();
      expect(await submitCount(page)).toBe(1);
    });

    test("Shift+Enter in the description textarea inserts a new line", async ({ page }) => {
      const form = await openContactForm(page);
      const message = form.locator("#target-market");
      await message.fill("First line");
      await message.press("Shift+Enter");
      await message.type("Second line");

      await expect(message).toHaveValue("First line\nSecond line");
      await expect(form.getByText(nameError)).toHaveCount(0);
      expect(await submitCount(page)).toBe(0);
    });

    test("Enter outside the form does not submit", async ({ page }) => {
      const form = await openContactForm(page);
      await page.getByRole("heading", { level: 1 }).click();
      await page.keyboard.press("Enter");

      await expect(form.getByText(nameError)).toHaveCount(0);
      expect(await submitCount(page)).toBe(0);
    });

    test("Enter during IME composition does not submit", async ({ page }) => {
      const form = await openContactForm(page);
      await form.locator("#business-name").focus();
      await form.locator("#business-name").evaluate((node) => {
        node.dispatchEvent(
          new KeyboardEvent("keydown", {
            key: "Enter",
            bubbles: true,
            cancelable: true,
            composed: true,
            isComposing: true,
          })
        );
      });

      await expect(form.getByText(nameError)).toHaveCount(0);
      expect(await submitCount(page)).toBe(0);
    });

    test("Enter does not submit again while the form is already submitting", async ({ page }) => {
      const form = await openContactForm(page);
      await form.locator('button[type="submit"]').evaluate((button) => {
        if (button instanceof HTMLButtonElement) {
          button.disabled = true;
        }
      });
      await form.locator("#business-name").fill("Facet Facilities");
      await form.locator("#business-name").press("Enter");

      await expect(form.getByText(nameError)).toHaveCount(0);
      expect(await submitCount(page)).toBe(0);
    });
  });

  test("footer social icons stay unpublished while studio social URLs are TBC", async ({
    page,
  }) => {
    // Contact is shorter than home, so the DeferredMount footer activates reliably.
    await page.goto("/contact");
    await acceptCookiesIfPresent(page);

    await page.evaluate(async () => {
      for (let i = 0; i < 40; i++) {
        if (document.querySelector("footer")) {
          document.querySelector("footer")?.scrollIntoView({ block: "end" });
          return;
        }
        window.scrollBy(0, Math.floor(window.innerHeight * 0.85));
        await new Promise((resolve) => window.setTimeout(resolve, 50));
      }
    });

    const footer = page.locator("footer");
    await expect(footer).toBeVisible({ timeout: 20_000 });
    await footer.scrollIntoViewIfNeeded();

    // F2: do not publish previous-product social destinations without leadership approval.
    await expect(footer.getByRole("link", { name: /Follow on Facebook/i })).toHaveCount(0);
    await expect(footer.getByRole("link", { name: /Follow on X/i })).toHaveCount(0);
    await expect(footer.getByRole("link", { name: /Follow on Instagram/i })).toHaveCount(0);
    await expect(footer.getByRole("link", { name: /Follow on LinkedIn/i })).toHaveCount(0);
    await expect(footer.locator('[aria-label="Social media"]')).toHaveCount(0);
  });

  test.describe("footer proportional spacing", () => {
    async function openContactFooter(page: Page) {
      await page.goto("/contact");
      await acceptCookiesIfPresent(page);
      await page.evaluate(async () => {
        for (let i = 0; i < 40; i++) {
          if (document.querySelector("footer.site-footer")) {
            document.querySelector("footer.site-footer")?.scrollIntoView({ block: "end" });
            return;
          }
          window.scrollBy(0, Math.floor(window.innerHeight * 0.85));
          await new Promise((resolve) => window.setTimeout(resolve, 50));
        }
      });
      const footer = page.locator("footer.site-footer");
      await expect(footer).toBeVisible({ timeout: 20_000 });
      await footer.scrollIntoViewIfNeeded();
      return footer;
    }

    test("navigation items stay links and span the footer on small screens", async ({ page }) => {
      for (const width of [320, 375, 768]) {
        await page.setViewportSize({ width, height: 812 });
        const footer = await openContactFooter(page);
        const nav = footer.locator("nav.site-footer__nav");
        const navLinks = nav.locator("a");

        // Home, Services, About, Contact, Terms
        await expect(navLinks).toHaveCount(5);
        await expect(footer.locator("nav.site-footer__nav button")).toHaveCount(0);
        await expect(navLinks.first()).toHaveAttribute("href", "/");
        await expect(footer.getByRole("link", { name: "Services" })).toHaveAttribute(
          "href",
          "/services"
        );
        await expect(footer.getByRole("link", { name: "Platform" })).toHaveCount(0);

        const widths = await page.evaluate(() => {
          const compose = document.querySelector(".site-footer__compose");
          const navigation = document.querySelector(".site-footer__nav");
          if (!(compose instanceof HTMLElement) || !(navigation instanceof HTMLElement)) {
            return null;
          }
          return {
            compose: compose.getBoundingClientRect().width,
            nav: navigation.getBoundingClientRect().width,
          };
        });

        expect(widths, `compact nav at ${width}px`).not.toBeNull();
        expect(widths?.nav, `nav width at ${width}px`).toBeGreaterThan(80);
        expect(widths?.nav ?? 0, `nav width at ${width}px`).toBeGreaterThan(
          (widths?.compose ?? 0) * 0.9
        );
      }
    });

    test("mobile footer stays stacked and tablet keeps brand/nav/legal structure", async ({
      page,
    }) => {
      const footer = await openContactFooter(page);

      await page.setViewportSize({ width: 375, height: 812 });
      await footer.scrollIntoViewIfNeeded();
      const mobile = await page.evaluate(() => {
        const brand = document.querySelector(".site-footer__brand");
        const nav = document.querySelector(".site-footer__nav");
        const legal = document.querySelector(".site-footer__legal");
        if (
          !(brand instanceof HTMLElement) ||
          !(nav instanceof HTMLElement) ||
          !(legal instanceof HTMLElement)
        ) {
          return null;
        }
        const brandBox = brand.getBoundingClientRect();
        const navBox = nav.getBoundingClientRect();
        const legalBox = legal.getBoundingClientRect();
        return {
          stacked: brandBox.bottom <= navBox.top + 2 && navBox.bottom <= legalBox.top + 2,
        };
      });
      expect(mobile?.stacked).toBe(true);

      for (const width of [768, 820, 900, 1023]) {
        await page.setViewportSize({ width, height: 900 });
        await footer.scrollIntoViewIfNeeded();

        const tablet = await page.evaluate(() => {
          const brand = document.querySelector(".site-footer__brand");
          const contact = document.querySelector(".site-footer__contact");
          const nav = document.querySelector(".site-footer__nav");
          const legal = document.querySelector(".site-footer__legal");
          const compose = document.querySelector(".site-footer__compose");
          if (
            !(brand instanceof HTMLElement) ||
            !(nav instanceof HTMLElement) ||
            !(legal instanceof HTMLElement) ||
            !(compose instanceof HTMLElement)
          ) {
            return null;
          }

          const brandBox = brand.getBoundingClientRect();
          const navBox = nav.getBoundingClientRect();
          const legalBox = legal.getBoundingClientRect();
          const composeBox = compose.getBoundingClientRect();
          const overflowX =
            document.documentElement.scrollWidth > document.documentElement.clientWidth + 1;

          return {
            // Contact/social column is omitted while F2 identity values remain TBC.
            contactPresent: contact instanceof HTMLElement,
            navBelow: navBox.top >= brandBox.bottom - 2,
            legalBelowNav: legalBox.top >= navBox.bottom - 2,
            legalSpans: Math.abs(legalBox.width - composeBox.width) <= 2,
            navSpansRow: navBox.width >= composeBox.width * 0.9,
            overflowX,
          };
        });

        expect(tablet, `tablet metrics at ${width}px`).not.toBeNull();
        expect(tablet?.contactPresent, `contact column unpublished at ${width}px`).toBe(false);
        expect(tablet?.navBelow, `nav spans below at ${width}px`).toBe(true);
        expect(tablet?.legalBelowNav, `legal full-width row at ${width}px`).toBe(true);
        expect(tablet?.legalSpans, `legal width at ${width}px`).toBe(true);
        expect(tablet?.navSpansRow, `full-width nav at ${width}px`).toBe(true);
        expect(tablet?.overflowX, `no overflow at ${width}px`).toBe(false);
      }
    });

    test("logo gap matches footer spacing and desktop groups share a baseline", async ({
      page,
    }) => {
      const footer = await openContactFooter(page);
      await expect(footer.locator("nav.site-footer__nav a")).toHaveCount(5);

      for (const width of [1024, 1440, 1920]) {
        await page.setViewportSize({ width, height: 900 });
        await footer.scrollIntoViewIfNeeded();

        const metrics = await page.evaluate(() => {
          const brand = document.querySelector(".site-footer__brand");
          const nav = document.querySelector(".site-footer__nav");
          const compose = document.querySelector(".site-footer__compose");
          if (
            !(brand instanceof HTMLElement) ||
            !(nav instanceof HTMLElement) ||
            !(compose instanceof HTMLElement)
          ) {
            return null;
          }

          const logo = brand.firstElementChild;
          const description = brand.lastElementChild;
          if (!(logo instanceof HTMLElement) || !(description instanceof HTMLElement)) {
            return null;
          }

          return {
            logoGap: Math.round(description.offsetTop - (logo.offsetTop + logo.offsetHeight)),
            brandGap: Number.parseFloat(getComputedStyle(brand).gap),
            composeGap: Number.parseFloat(getComputedStyle(compose).rowGap),
            brandBottom: Math.round(brand.getBoundingClientRect().bottom),
            navBottom: Math.round(nav.getBoundingClientRect().bottom),
          };
        });

        expect(metrics, `footer metrics at ${width}px`).not.toBeNull();
        expect(metrics?.brandGap, `token match at ${width}px`).toBe(metrics?.composeGap);
        // Desktop brand uses space-between so the description shares the nav baseline.
        // Visual logo→copy gap may exceed the CSS gap token when the nav column is taller
        // (studio Explore/Company groups vs the former three-column product footer).
        expect(metrics?.logoGap, `logo gap size at ${width}px`).toBeGreaterThanOrEqual(20);
        expect(
          metrics?.logoGap ?? 0,
          `logo gap at least spacing token at ${width}px`
        ).toBeGreaterThanOrEqual((metrics?.brandGap ?? 0) - 8);
        expect(
          Math.abs((metrics?.brandBottom ?? 0) - (metrics?.navBottom ?? 0)),
          `nav baseline at ${width}px`
        ).toBeLessThanOrEqual(2);
      }
    });
  });

  test("contact social section stays unpublished while studio social URLs are TBC", async ({
    page,
  }) => {
    await page.goto("/contact");
    await acceptCookiesIfPresent(page);

    const contact = page.locator("main#contact-page");
    await expect(contact).toBeVisible({ timeout: 15_000 });

    await expect(contact.locator("a.contact-social-card")).toHaveCount(0);
    await expect(contact.getByRole("heading", { name: /Contact us another way/i })).toHaveCount(0);
  });

  test("homepage no longer renders product outcomes trust or pricing", async ({ page }) => {
    await page.goto("/");
    await acceptCookiesIfPresent(page);

    await page.evaluate(async () => {
      for (let attempt = 0; attempt < 35; attempt += 1) {
        window.scrollTo(0, document.documentElement.scrollHeight);
        await new Promise((resolve) => window.setTimeout(resolve, 80));
      }
    });

    await expect(page.locator("section#v2-results")).toHaveCount(0);
    await expect(page.locator("section#benefits")).toHaveCount(0);
    await expect(page.locator("#v2-testimonials")).toHaveCount(0);
    await expect(page.locator("section#pricing")).toHaveCount(0);
    await expect(page.locator("section#value")).toBeVisible();
    await expect(page.locator("section#process")).toBeVisible();

    for (const viewport of [
      { width: 1440, height: 900 },
      { width: 768, height: 1024 },
      { width: 390, height: 844 },
    ]) {
      await page.setViewportSize(viewport);
      await expect(page.locator("section#value")).toBeVisible();
      await expect(page.locator("section#process")).toBeVisible();

      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth > document.documentElement.clientWidth
      );
      expect(overflow).toBe(false);
    }
  });

  test("contact page hides office location while business address is TBC", async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on("console", (message) => {
      if (message.type() === "error") {
        consoleErrors.push(message.text());
      }
    });

    await page.goto("/contact");
    await acceptCookiesIfPresent(page);

    const contact = page.locator("main#contact-page");
    const office = page.locator("#contact-location");
    await expect(contact).toBeVisible({ timeout: 15_000 });
    // Previous-product Warsaw address must not publish without leadership approval (F2).
    await expect(office).toHaveCount(0);
    await expect(contact.getByText("UL. TARGOWA 66A / 26")).toHaveCount(0);
    await expect(contact.getByText("03-734 WARSZAWA")).toHaveCount(0);
    await expect(contact.getByText(/ADealForge/i)).toHaveCount(0);

    for (const viewport of [
      { width: 1440, height: 900 },
      { width: 768, height: 1024 },
      { width: 390, height: 844 },
    ]) {
      await page.setViewportSize(viewport);
      await expect(contact).toBeVisible();
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth > document.documentElement.clientWidth
      );
      expect(overflow).toBe(false);

      await expect(contact.locator(".contact-social-card")).toHaveCount(0);
    }

    expect(consoleErrors).toEqual([]);
  });

  test("terms page loads", { tag: "@critical" }, async ({ page }) => {
    await page.goto("/terms");
    await acceptCookiesIfPresent(page);

    await expect(page).toHaveTitle(/Terms/i);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "/terms");
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      "content",
      /governing use of this website/i
    );
    await expect(page.getByRole("heading", { level: 1, name: "Terms & Conditions" })).toBeVisible({
      timeout: 15_000,
    });

    await expect(page.getByRole("navigation", { name: "Table of contents" })).toHaveCount(0);
    await expect(
      page.getByRole("heading", { level: 2, name: /Cookies and Analytics/ })
    ).toBeVisible();
    await expect(page.getByRole("heading", { level: 2, name: /^15\.\s*Contact$/i })).toBeVisible();

    // Contact email stays unpublished while leadership approval is TBC (F2).
    await expect(page.locator("#terms-page").getByRole("link", { name: /@/ })).toHaveCount(0);
    await expect(page.locator("#terms-page").getByText("contact@adealforge.com")).toHaveCount(0);

    await expect(page.getByText(/at least 18 years of age/)).toBeAttached();

    // Plain-document Terms page must not render decorative marketing chrome.
    await expect(page.locator("#terms-page .liquid-glass")).toHaveCount(0);
    await expect(page.locator("#terms-page aside")).toHaveCount(0);
    await expect(page.locator("#terms-page .terms-document__layout")).toHaveCount(0);

    const termsSurface = await page.locator("#terms-page").evaluate((element) => {
      const styles = window.getComputedStyle(element);
      return {
        backgroundImage: styles.backgroundImage,
        backgroundColor: styles.backgroundColor,
        color: styles.color,
      };
    });
    expect(termsSurface.backgroundImage).toBe("none");
    // Site page canvas --page-bg / #0c111b
    expect(termsSurface.backgroundColor).toMatch(/rgb\(\s*12,\s*17,\s*27\s*\)/);
    // White document text on dark canvas
    expect(termsSurface.color).toMatch(/rgb\(\s*255,\s*255,\s*255\s*\)/);
  });

  test("terms page remains responsive across breakpoints", async ({ page }) => {
    test.setTimeout(90_000);
    for (const viewport of [
      { width: 320, height: 720 },
      { width: 375, height: 812 },
      { width: 390, height: 844 },
      { width: 430, height: 932 },
      { width: 768, height: 1024 },
      { width: 1024, height: 768 },
      { width: 1280, height: 800 },
      { width: 1440, height: 900 },
    ]) {
      await page.setViewportSize(viewport);
      await page.goto("/terms");
      await acceptCookiesIfPresent(page);

      const termsDocument = page.locator("article.terms-document");
      const header = page.locator(".terms-document__header");
      const legalContent = page.locator(".terms-document__body");
      await expect(termsDocument).toBeVisible({ timeout: 15_000 });
      await expect(header).toBeVisible();
      await expect(legalContent).toBeVisible();
      await expect(page.getByRole("navigation", { name: "Table of contents" })).toHaveCount(0);
      await expect(page.locator("#terms-page .liquid-glass")).toHaveCount(0);

      const termsSurface = await page.locator("#terms-page").evaluate((element) => {
        const styles = window.getComputedStyle(element);
        return {
          backgroundImage: styles.backgroundImage,
          backgroundColor: styles.backgroundColor,
        };
      });
      expect(termsSurface.backgroundImage).toBe("none");
      expect(termsSurface.backgroundColor).toMatch(/rgb\(\s*12,\s*17,\s*27\s*\)/);

      const horizontalOverflow = await page.evaluate(
        () => document.documentElement.scrollWidth > document.documentElement.clientWidth
      );
      expect(horizontalOverflow).toBe(false);

      const documentBox = await termsDocument.boundingBox();
      expect(documentBox).not.toBeNull();
      expect(documentBox?.x).toBeGreaterThanOrEqual(0);
      expect((documentBox?.x ?? 0) + (documentBox?.width ?? 0)).toBeLessThanOrEqual(
        viewport.width + 1
      );

      const headerBox = await header.boundingBox();
      const bodyBox = await legalContent.boundingBox();
      expect(headerBox).not.toBeNull();
      expect(bodyBox).not.toBeNull();
      expect(bodyBox?.y ?? 0).toBeGreaterThan((headerBox?.y ?? 0) + (headerBox?.height ?? 0) - 1);
    }
  });

  test(
    "floating conversation prompt is consistent across public routes",
    { tag: "@critical" },
    async ({ page }) => {
      // 10s show delay + 10s expanded window + collapse, × 4 routes, plus overhead.
      test.setTimeout(180_000);

      const consoleErrors: string[] = [];
      page.on("console", (message) => {
        if (message.type() !== "error") {
          return;
        }
        const text = message.text();
        // Contact form / analytics can emit unrelated network noise in smoke.
        if (/Failed to load resource: the server responded with a status of 4\d\d/i.test(text)) {
          return;
        }
        consoleErrors.push(text);
      });

      await page.addInitScript(() => {
        window.localStorage.removeItem("adealforge:schedule-meeting-dismissed-at");
      });

      const routes = ["/", "/platform", "/workflow", "/contact"] as const;

      for (const route of routes) {
        await page.goto(route);

        const prompt = page.locator(".schedule-meeting-float");
        const launcher = page.locator(".schedule-meeting-float__launcher");
        const launcherByName = page.getByRole("button", { name: /Let's Start a Conversation/i });
        const emailFab = page.locator(".email-fab");
        await expect(prompt).toHaveCount(0);

        await acceptCookiesIfPresent(page);
        await expect(prompt).toBeVisible({ timeout: 18_000 });

        // The expanded window is only AUTO_COLLAPSE_MS (10s) wide, so assert the card first.
        const startHere = prompt.getByRole("button", { name: /Start Here/i });

        await expect(
          prompt.getByRole("heading", { level: 2, name: /Let's Start a Conversation/i })
        ).toBeVisible();
        await expect(prompt.locator(".schedule-meeting-float__subtitle")).toHaveText(
          "No pressure. No obligation. Just a friendly conversation."
        );
        await expect(prompt.getByText(/learn a little about your business/i)).toHaveCount(0);
        await expect(startHere).toBeVisible();
        await expect(prompt.getByRole("button", { name: /Keep Browsing/i })).toBeVisible();

        await expect(prompt.getByText(/Schedule a Meeting/i)).toHaveCount(0);
        await expect(prompt.getByRole("button", { name: /^Book a Meeting$/i })).toHaveCount(0);
        await expect(prompt.getByRole("button", { name: /^Maybe Later$/i })).toHaveCount(0);

        const overflow = await page.evaluate(
          () => document.documentElement.scrollWidth > document.documentElement.clientWidth
        );
        expect(overflow).toBe(false);

        // Auto-collapse unmounts the widget. Email FAB stays hidden while contact
        // email is unpublished (F2 TBC).
        await expect(prompt).toHaveCount(0, { timeout: 16_000 });

        // The standalone floating calendar launcher is gone for good.
        await expect(launcher).toHaveCount(0);
        await expect(launcherByName).toHaveCount(0);
        await expect(emailFab).toHaveCount(0);

        // Auto-collapse must not persist, so the invitation returns on the next page load.
        const autoCollapseDismissedAt = await page.evaluate(() =>
          window.localStorage.getItem("adealforge:schedule-meeting-dismissed-at")
        );
        expect(autoCollapseDismissedAt).toBeNull();
      }

      // Manual dismissal still persists and removes the widget before auto-collapse.
      await page.goto("/");
      await acceptCookiesIfPresent(page);
      const dismissiblePrompt = page.locator(".schedule-meeting-float");
      await expect(dismissiblePrompt).toBeVisible({ timeout: 18_000 });
      await dismissiblePrompt.getByRole("button", { name: /Keep Browsing/i }).click();
      await expect(dismissiblePrompt).toHaveCount(0, { timeout: 5_000 });
      await expect(page.locator(".email-fab")).toHaveCount(0);
      const dismissedAt = await page.evaluate(() =>
        window.localStorage.getItem("adealforge:schedule-meeting-dismissed-at")
      );
      expect(Number(dismissedAt)).toBeGreaterThan(0);

      expect(consoleErrors).toEqual([]);
    }
  );
});
