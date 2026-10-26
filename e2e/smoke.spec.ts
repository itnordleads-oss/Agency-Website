import { expect, test, type Page } from "@playwright/test";
import { acceptCookiesIfPresent } from "./helpers/cookies";

declare global {
  interface Window {
    __contactFormSubmitCount?: number;
  }
}

type HomepageSectionId = "services" | "value" | "process" | "about";

const HOMEPAGE_H1_PATTERN =
  /custom software|software and digital|meetings|busywork|delivery|clarity/i;
const SERVICES_H1 = /Build digital products and web experiences that fit your business/i;

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
    await expect(page.getByRole("heading", { level: 1 })).toContainText(HOMEPAGE_H1_PATTERN);
    await expect(page.getByRole("link", { name: "Skip to main content" })).toHaveAttribute(
      "href",
      "#main-content"
    );
  });

  test("legacy /work redirects to /projects", { tag: "@critical" }, async ({ page }) => {
    await page.goto("/work");
    await acceptCookiesIfPresent(page);
    await expect(page).toHaveURL(/\/projects\/?(?:\?|$)/);
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      /digital products built around real requirements/i
    );
  });

  test("/projects renders the dedicated Projects page", { tag: "@critical" }, async ({ page }) => {
    await page.goto("/projects");
    await acceptCookiesIfPresent(page);
    await expect(page).toHaveURL(/\/projects\/?(?:\?|$)/);
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      /digital products built around real requirements/i
    );
    await expect(page.getByRole("heading", { level: 2, name: /selected projects/i })).toBeVisible();
    await expect(page.getByRole("heading", { level: 2, name: /featured projects/i })).toHaveCount(
      0
    );
    const projectsRegion = page.getByRole("region", { name: /selected projects/i });
    await expect(projectsRegion.getByRole("link")).toHaveCount(8);
    await expect(projectsRegion.getByText("Concept Project")).toHaveCount(0);
    for (const title of ["Relay", "Brewnns", "Ridgeline Roofing", "Halden", "Stemline"]) {
      await expect(
        projectsRegion.getByRole("link", { name: new RegExp(`Visit website: ${title}`, "i") })
      ).toHaveCount(1);
    }
    await expect(
      projectsRegion.getByRole("link", {
        name: /Open application: MegaPersonals Automation Panel/i,
      })
    ).toHaveCount(1);
    await expect(projectsRegion.getByText("Production", { exact: true })).toBeVisible();
    await expect(page.getByRole("region", { name: /interactive demos/i })).toHaveCount(0);
  });

  test("MegaPersonals automation demo opens all sidebar pages", async ({ page }) => {
    await page.goto("/demos/megapersonals-automation");
    await acceptCookiesIfPresent(page);
    await expect(page.getByRole("heading", { level: 1, name: "Dashboard" })).toBeVisible();
    await expect(page.getByText(/Portfolio demo/i)).toBeVisible();

    for (const [name, heading] of [
      ["Accounts", "Accounts"],
      ["Advertisements", "Advertisements"],
      ["Gmail Accounts", "Gmail Accounts"],
      ["Location Targeting", "Location Targeting"],
      ["Automation", "Automation"],
      ["Reports", "Reports"],
      ["Settings", "Settings"],
    ] as const) {
      await page
        .getByRole("navigation", { name: "Demo navigation" })
        .getByRole("link", { name, exact: true })
        .click();
      await expect(page.getByRole("heading", { level: 1, name: heading })).toBeVisible();
    }
  });

  test("project detail opens from the portfolio grid", { tag: "@critical" }, async ({ page }) => {
    await page.goto("/projects/relay");
    await acceptCookiesIfPresent(page);
    await expect(page).toHaveURL(/\/projects\/relay\/?(?:\?|$)/);
    await expect(page.getByRole("heading", { level: 1, name: /Relay/i })).toBeVisible();
    await expect(page.getByText("Concept Project")).toHaveCount(0);
    await expect(page.getByRole("heading", { level: 2, name: /Challenge/i })).toBeVisible();
    await expect(page.getByRole("heading", { level: 2, name: "Project Overview" })).toBeVisible();
    await expect(page.getByRole("heading", { level: 2, name: "Visual Gallery" })).toBeVisible();
  });

  test("all project detail routes resolve from centralized data", async ({ page }) => {
    test.setTimeout(90_000);
    const projects = [
      ["relay", "Relay"],
      ["brewnns", "Brewnns"],
      ["ridgeline", "Ridgeline Roofing"],
      ["halden", "Halden"],
      ["stemline", "Stemline"],
      ["megapersonals-automation", "MegaPersonals Automation Panel"],
      ["diet-soda", "Diet Soda"],
      ["neural-monitor", "Neural Monitor"],
      ["ferro-room", "Ferro Room"],
      ["virell", "Virell"],
      ["voltara", "Voltara"],
    ] as const;

    for (const [slug, title] of projects) {
      await page.goto(`/projects/${slug}`);
      await acceptCookiesIfPresent(page);
      await expect(page.getByRole("heading", { level: 1, name: title })).toBeVisible();
      await expect(page.getByText("Concept Project")).toHaveCount(0);
      await expect(page.getByRole("navigation", { name: "Breadcrumb" })).toBeVisible();

      const related = page.getByRole("region", { name: "Related Projects" });
      await expect(related.getByRole("link")).toHaveCount(3);
      await expect(related.getByRole("link", { name: new RegExp(title, "i") })).toHaveCount(0);
    }

    await page.goto("/projects/nova-commerce");
    await expect(page.getByRole("heading", { level: 1, name: "Project not found" })).toBeVisible();

    await page.goto("/projects/not-a-real-project");
    await expect(page.getByRole("heading", { level: 1, name: "Project not found" })).toBeVisible();
  });

  test("company carousel replaces and repositions the homepage trust block", async ({ page }) => {
    test.skip(true, "F4 agency Homepage V3 omits the product trust logo carousel.");
    // Multi-viewport navigations + mount scroll + reduced-motion reload exceed the 30s default.
    test.setTimeout(90_000);
    const consoleErrors: string[] = [];
    const pageErrors: string[] = [];
    const brokenImages: string[] = [];
    page.on("console", (message) => {
      if (message.type() === "error") {
        consoleErrors.push(message.text());
      }
    });
    page.on("pageerror", (error) => pageErrors.push(error.message));
    page.on("response", (response) => {
      if (response.request().resourceType() === "image" && response.status() >= 400) {
        brokenImages.push(`${response.status()} ${response.url()}`);
      }
    });

    await page.emulateMedia({ reducedMotion: "no-preference" });

    for (const viewport of [
      { width: 390, height: 844 },
      { width: 768, height: 1024 },
      { width: 1440, height: 900 },
    ]) {
      await page.setViewportSize(viewport);
      await page.goto("/");
      await acceptCookiesIfPresent(page);

      const carousel = page.locator("#company-logo-carousel");
      await carousel.scrollIntoViewIfNeeded();
      await expect(
        carousel.getByRole("heading", { level: 2, name: "Companies We’ve Worked With" })
      ).toBeVisible({ timeout: 15_000 });

      const layout = await page.evaluate(() => {
        const section = document.querySelector<HTMLElement>("#company-logo-carousel");
        const sectionBox = section?.getBoundingClientRect();
        return {
          documentFitsViewport: document.documentElement.scrollWidth <= window.innerWidth,
          sectionLeft: sectionBox?.left ?? -1,
          sectionRight: sectionBox?.right ?? Number.POSITIVE_INFINITY,
          viewportWidth: document.documentElement.clientWidth,
        };
      });
      expect(layout.documentFitsViewport).toBe(true);
      expect(layout.sectionLeft).toBeGreaterThanOrEqual(-1);
      expect(layout.sectionRight).toBeLessThanOrEqual(layout.viewportWidth + 1);
    }

    const carousel = page.locator("#company-logo-carousel");
    const originalSet = carousel.locator('[data-company-logo-set="original"]');
    const duplicateSets = carousel.locator(".company-logo-carousel__set--duplicate");
    const approvedCompanies = [
      { id: "bockelmann", name: "Bockelmann Holz" },
      { id: "solartime", name: "Solartime" },
      { id: "kovotvar", name: "Kovotvar" },
      { id: "baltexport", name: "Baltexport" },
      { id: "apex", name: "Apex Construction" },
      { id: "bcs-batiment", name: "BCS Bâtiment" },
      { id: "edilizia-moderna", name: "Edilizia Moderna" },
      { id: "nordic-bygg", name: "Nordic Bygg" },
      { id: "holzpol", name: "Holzpol" },
      { id: "ldbouw", name: "LDL Bouw" },
      { id: "parkkozijnen", name: "PARL Kozijnen" },
      { id: "etalones", name: "Etalones" },
    ];

    await expect(originalSet.locator("[data-company-logo]")).toHaveCount(approvedCompanies.length);
    await expect(originalSet.locator('[data-logo-status="asset-required"]')).toHaveCount(0);
    await expect(originalSet.locator("[data-logo-placeholder]")).toHaveCount(0);
    await expect(carousel.getByText(/logo asset pending/i)).toHaveCount(0);
    for (const company of approvedCompanies) {
      const entry = originalSet.locator(`[data-company-logo="${company.id}"]`);
      await expect(entry).toBeVisible();
      await expect(entry.locator("img, svg")).toHaveCount(1);
      await expect(entry.getByRole("img", { name: `${company.name} logo` })).toBeVisible();
    }

    await expect(duplicateSets).toHaveCount(2);
    for (const duplicateSet of await duplicateSets.all()) {
      await expect(duplicateSet).toHaveAttribute("aria-hidden", "true");
      await expect(duplicateSet.locator("[data-company-logo]")).toHaveCount(
        approvedCompanies.length
      );
      await expect(duplicateSet.locator('img[alt=""]')).toHaveCount(approvedCompanies.length);
      await expect(duplicateSet.getByRole("link")).toHaveCount(0);
    }

    // The marquee is display-only: no logo may link, redirect, take focus or react to a click.
    await expect(carousel.getByRole("link")).toHaveCount(0);
    const interactivity = await carousel.evaluate((section) => {
      const slots = Array.from(section.querySelectorAll<HTMLElement>("[data-company-logo]"));
      const images = Array.from(
        section.querySelectorAll<HTMLElement>(".company-logo-carousel__image")
      );
      let focusLandedInCarousel = false;
      for (const element of [...slots, ...images]) {
        element.focus();
        if (section.contains(document.activeElement)) {
          focusLandedInCarousel = true;
        }
      }
      const viewportStyles = getComputedStyle(
        section.querySelector<HTMLElement>(".company-logo-carousel__viewport") as HTMLElement
      );
      return {
        anchorCount: section.querySelectorAll("a, [href]").length,
        focusableCount: section.querySelectorAll(
          'a, button, [tabindex]:not([tabindex="-1"]), input, select, textarea'
        ).length,
        focusLandedInCarousel,
        pointerEvents: viewportStyles.pointerEvents,
        userSelect: viewportStyles.userSelect,
      };
    });
    expect(interactivity.anchorCount).toBe(0);
    expect(interactivity.focusableCount).toBe(0);
    expect(interactivity.focusLandedInCarousel).toBe(false);
    expect(interactivity.pointerEvents).toBe("none");
    expect(interactivity.userSelect).toBe("none");

    // Keyboard users must never land inside the carousel while tabbing the homepage.
    await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());
    let tabLandedInCarousel = false;
    for (let press = 0; press < 40; press += 1) {
      await page.keyboard.press("Tab");
      if (await carousel.evaluate((section) => section.contains(document.activeElement))) {
        tabLandedInCarousel = true;
        break;
      }
    }
    expect(tabLandedInCarousel).toBe(false);

    // Clicking a logo must not navigate the page or open a new tab.
    const urlBeforeLogoClick = page.url();
    const pagesBeforeLogoClick = page.context().pages().length;
    const logoClickPoint = await carousel.evaluate((section) => {
      const viewportBox = (
        section.querySelector(".company-logo-carousel__viewport") as HTMLElement
      ).getBoundingClientRect();
      const slotBox = Array.from(section.querySelectorAll("[data-company-logo]"))
        .map((slot) => slot.getBoundingClientRect())
        .find((box) => box.left > viewportBox.left + 24 && box.right < viewportBox.right - 24);
      return slotBox
        ? { x: slotBox.left + slotBox.width / 2, y: slotBox.top + slotBox.height / 2 }
        : null;
    });
    expect(logoClickPoint).not.toBeNull();
    await page.mouse.click(logoClickPoint?.x ?? 0, logoClickPoint?.y ?? 0);
    await page.waitForTimeout(500);
    expect(page.url()).toBe(urlBeforeLogoClick);
    expect(page.context().pages().length).toBe(pagesBeforeLogoClick);

    const track = carousel.locator(".company-logo-carousel__track");
    await expect(track).toHaveCSS("animation-name", "company-logo-carousel-scroll");
    await expect(track).toHaveCSS("animation-duration", "34s");
    await expect(track).toHaveCSS("animation-timing-function", "linear");
    await expect(track).toHaveCSS("animation-play-state", "running");
    const initialTrackX = await track.evaluate(
      (element) => new DOMMatrix(getComputedStyle(element).transform).m41
    );
    // force: the viewport is pointer-events: none, so it never receives the hover itself.
    await carousel.locator(".company-logo-carousel__viewport").hover({ force: true });
    await expect(track).toHaveCSS("animation-play-state", "running");
    await page.waitForTimeout(350);
    const movedTrackX = await track.evaluate(
      (element) => new DOMMatrix(getComputedStyle(element).transform).m41
    );
    expect(Math.abs(movedTrackX - initialTrackX)).toBeGreaterThan(1);

    const loopGeometry = await carousel.evaluate((section) => {
      const sets = Array.from(
        section.querySelectorAll<HTMLElement>(".company-logo-carousel__set")
      ).map((set) => set.getBoundingClientRect());
      return {
        firstStride: sets[1].left - sets[0].left,
        secondStride: sets[2].left - sets[1].left,
        firstSeamGap: sets[1].left - sets[0].right,
        secondSeamGap: sets[2].left - sets[1].right,
      };
    });
    expect(Math.abs(loopGeometry.firstStride - loopGeometry.secondStride)).toBeLessThan(1);
    expect(Math.abs(loopGeometry.firstSeamGap - loopGeometry.secondSeamGap)).toBeLessThan(1);
    expect(loopGeometry.firstSeamGap).toBeGreaterThan(0);
    expect(loopGeometry.firstSeamGap).toBeLessThan(64);

    await page.evaluate(async () => {
      for (let attempt = 0; attempt < 35; attempt += 1) {
        window.scrollTo(0, document.documentElement.scrollHeight);
        await new Promise((resolve) => window.setTimeout(resolve, 80));
      }
    });

    const trust = page.locator("#v2-trust");
    await expect(trust).toHaveCount(1);
    await expect(trust).toHaveAttribute("aria-label", "Built for outbound teams across industries");
    await expect(trust.getByText("100k+", { exact: true })).toBeVisible();
    await expect(
      trust.getByText("Companies reached in outbound programs", { exact: true })
    ).toBeVisible();
    await expect(trust.getByText("Full service", { exact: true })).toBeVisible();
    await expect(
      trust.getByText("Research to outreach handled for you", { exact: true })
    ).toBeVisible();
    await expect(trust.getByText("Sales ready", { exact: true })).toBeVisible();
    await expect(trust.getByText("Clean handoff for your sellers", { exact: true })).toBeVisible();
    for (const tag of ["B2B SaaS", "Services", "Industrial", "Staffing", "Logistics"]) {
      await expect(trust.getByText(tag, { exact: true })).toBeVisible();
    }

    const placement = await page.evaluate(() => {
      const product = document.querySelector("#product");
      const productHost = product?.parentElement;
      const nextSection = productHost?.nextElementSibling?.querySelector("section");
      const sections = Array.from(document.querySelectorAll("main > div > section")).map(
        (section) => section.id
      );
      return {
        nextSectionId: nextSection?.id ?? null,
        carouselIndex: sections.indexOf("company-logo-carousel"),
        productIndex: sections.indexOf("product"),
        trustIndex: sections.indexOf("v2-trust"),
      };
    });
    expect(placement.nextSectionId).toBe("v2-trust");
    expect(placement.carouselIndex).toBeGreaterThanOrEqual(0);
    expect(placement.productIndex).toBe(placement.carouselIndex + 1);
    expect(placement.trustIndex).toBe(placement.productIndex + 1);

    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.reload();
    const reducedMotionCarousel = page.locator("#company-logo-carousel");
    await reducedMotionCarousel.scrollIntoViewIfNeeded();
    await expect(reducedMotionCarousel.locator(".company-logo-carousel__track")).toHaveCSS(
      "animation-name",
      "none"
    );
    await expect(
      reducedMotionCarousel.locator(".company-logo-carousel__set--duplicate").first()
    ).toHaveCSS("display", "none");
    await expect(
      reducedMotionCarousel.locator('[data-company-logo-set="original"]').locator("img, svg")
    ).toHaveCount(approvedCompanies.length);
    await expect(reducedMotionCarousel.getByRole("link")).toHaveCount(0);

    // Autoplay is off under reduced motion, so the viewport must stay scrollable by pointer.
    const reducedMotionViewport = await reducedMotionCarousel.evaluate((section) => {
      const viewport = section.querySelector(".company-logo-carousel__viewport") as HTMLElement;
      const styles = getComputedStyle(viewport);
      return {
        anchorCount: section.querySelectorAll("a, [href]").length,
        pointerEvents: styles.pointerEvents,
        overflowX: styles.overflowX,
        isScrollable: viewport.scrollWidth > viewport.clientWidth,
      };
    });
    expect(reducedMotionViewport.anchorCount).toBe(0);
    expect(reducedMotionViewport.pointerEvents).toBe("auto");
    expect(reducedMotionViewport.overflowX).toBe("auto");
    expect(reducedMotionViewport.isScrollable).toBe(true);

    expect(consoleErrors).toEqual([]);
    expect(pageErrors).toEqual([]);
    expect(brokenImages).toEqual([]);
  });

  test("customer stories carousel keeps autoplay during hover and page wheel scroll", async ({
    page,
  }) => {
    test.skip(true, "F4 agency Homepage V3 omits the product testimonials carousel.");
    test.setTimeout(90_000);
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    await acceptCookiesIfPresent(page);

    const section = page.locator("#v2-testimonials");
    await section.scrollIntoViewIfNeeded();
    await expect(section.getByRole("heading", { level: 2 })).toBeVisible({ timeout: 15_000 });

    const viewport = section.locator(".testimonials-carousel__viewport");
    const track = section.locator(".testimonials-carousel__track");
    await expect(viewport).toBeVisible();

    const readTrackX = () =>
      track.evaluate((element) => new DOMMatrix(element.style.transform || "none").m41);

    // This marquee has no prev/next or pagination controls (autoplay-only).
    await expect(section.getByRole("button")).toHaveCount(0);
    await expect(viewport).toHaveCSS("cursor", "default");
    await expect(viewport).not.toHaveCSS("cursor", "grab");

    // 1–4: hover must not pause autoplay.
    const initialX = await readTrackX();
    await viewport.hover();
    await page.waitForTimeout(450);
    const hoveredX = await readTrackX();
    expect(Math.abs(hoveredX - initialX)).toBeGreaterThan(4);

    // 5–8: mouse-wheel over carousel scrolls the page; marquee keeps autoplaying.
    const scrollBefore = await page.evaluate(() => window.scrollY);
    const preWheelX = await readTrackX();
    await viewport.hover();
    await page.mouse.wheel(0, 220);
    // Sample immediately — only autoplay drift is allowed, not a scrub jump.
    const immediateAfterWheelX = await readTrackX();
    expect(Math.abs(immediateAfterWheelX - preWheelX)).toBeLessThan(40);
    await expect
      .poll(async () => page.evaluate(() => window.scrollY), { timeout: 3_000 })
      .toBeGreaterThan(scrollBefore);
    await page.waitForTimeout(450);
    const postWheelX = await readTrackX();
    expect(Math.abs(postWheelX - immediateAfterWheelX)).toBeGreaterThan(4);

    // 9–10: trackpad-like wheel deltas while hovered.
    await viewport.hover();
    const preTrackpadX = await readTrackX();
    const scrollBeforeTrackpad = await page.evaluate(() => window.scrollY);
    for (let i = 0; i < 6; i += 1) {
      await page.mouse.wheel(0, 40);
    }
    const midTrackpadX = await readTrackX();
    // Six quick wheel ticks should not scrub (~200ms autoplay ≈ 7px).
    expect(Math.abs(midTrackpadX - preTrackpadX)).toBeLessThan(40);
    await expect
      .poll(async () => page.evaluate(() => window.scrollY), { timeout: 3_000 })
      .toBeGreaterThan(scrollBeforeTrackpad);
    await page.waitForTimeout(450);
    const postTrackpadX = await readTrackX();
    expect(Math.abs(postTrackpadX - midTrackpadX)).toBeGreaterThan(4);

    const box = await viewport.boundingBox();
    expect(box).not.toBeNull();
    const pointerX = (box?.x ?? 0) + (box?.width ?? 0) * 0.55;
    const pointerY = (box?.y ?? 0) + (box?.height ?? 0) * 0.45;

    // 11–12: horizontal drag must not scrub or pause the marquee.
    const beforeDragX = await readTrackX();
    await page.mouse.move(pointerX, pointerY);
    await page.mouse.down();
    await page.mouse.move(pointerX + 80, pointerY, { steps: 8 });
    const midDragX = await readTrackX();
    await page.mouse.up();
    // Only autoplay drift (~33px/s) is allowed — not an 80px scrub jump.
    expect(Math.abs(midDragX - beforeDragX)).toBeLessThan(40);
    await page.waitForTimeout(400);
    const afterDragX = await readTrackX();
    expect(Math.abs(afterDragX - midDragX)).toBeGreaterThan(3);

    // 13–14: click-and-hold must not pause autoplay.
    const beforeHoldX = await readTrackX();
    await page.mouse.move(pointerX, pointerY);
    await page.mouse.down();
    await page.waitForTimeout(500);
    const duringHoldX = await readTrackX();
    await page.mouse.up();
    expect(Math.abs(duringHoldX - beforeHoldX)).toBeGreaterThan(4);

    // 15–17: no carousel nav controls to click; autoplay remains active afterward.
    await expect(
      section.locator(
        'button, [aria-label*="next" i], [aria-label*="previous" i], [aria-label*="prev" i]'
      )
    ).toHaveCount(0);
    const afterNavCheckX0 = await readTrackX();
    await page.waitForTimeout(400);
    const afterNavCheckX1 = await readTrackX();
    expect(Math.abs(afterNavCheckX1 - afterNavCheckX0)).toBeGreaterThan(3);

    for (const viewportSize of [
      { width: 320, height: 720 },
      { width: 375, height: 812 },
      { width: 390, height: 844 },
      { width: 430, height: 932 },
      { width: 768, height: 1024 },
      { width: 1024, height: 768 },
    ] as const) {
      await page.setViewportSize(viewportSize);
      await section.scrollIntoViewIfNeeded();
      await viewport.hover();
      const x0 = await readTrackX();
      await page.waitForTimeout(450);
      const x1 = await readTrackX();
      expect(Math.abs(x1 - x0)).toBeGreaterThan(3);
    }
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

    await expect(page).toHaveURL(/\/services$/);
    await expect(page.getByRole("heading", { level: 1, name: SERVICES_H1 })).toBeVisible({
      timeout: 15_000,
    });
  });

  test("platform capabilities use interactive walkthrough and preserve content", async ({
    page,
  }) => {
    test.skip(true, "F9 retired /platform; Services placeholder has no product walkthrough.");
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

  test("platform page keeps fixed english seo when language changes", async ({ page }) => {
    await page.goto("/platform");
    await acceptCookiesIfPresent(page);

    await expect(page).toHaveURL(/\/services$/);
    await expect(page.getByRole("heading", { level: 1, name: SERVICES_H1 })).toBeVisible({
      timeout: 15_000,
    });
    await expect(page).toHaveTitle(/Services \|/i);
    await expect(page.locator('meta[name="robots"]')).not.toHaveAttribute("content", /noindex/i);
  });

  test("approved SEO copy appears on active public routes", async ({ page }) => {
    test.setTimeout(90_000);
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
      hero.getByText(/Custom software and digital products, delivered with clarity\./i)
    ).toBeVisible();
    await expect(hero.getByRole("button", { name: "Start a Project" })).toBeVisible();
    await expect(hero.getByRole("button", { name: "Explore Services" })).toBeVisible();
    await expect(hero.getByText(/How we work/i)).toHaveCount(0);
    await expect(hero.getByText(/ADealForge finds qualified companies/i)).toHaveCount(0);
    await expect(page.getByText(/vanity metrics/i)).toHaveCount(0);
    await expect(page.getByText(/unverified claims/i)).toHaveCount(0);

    await page.evaluate(async () => {
      for (let attempt = 0; attempt < 40; attempt += 1) {
        window.scrollTo(0, document.documentElement.scrollHeight);
        await new Promise((resolve) => window.setTimeout(resolve, 120));
      }
    });

    for (const sectionId of ["services", "value", "process", "about"] as const) {
      await expect(page.locator(`section#${sectionId}`)).toBeVisible({ timeout: 15_000 });
    }
    await expect(page.locator("section#work-preview")).toHaveCount(0);
    await expect(page.getByRole("heading", { name: "Software Development" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Website Development" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Mobile App Development" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Shopify Stores" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "WordPress Websites" })).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Custom WordPress Theme Development" })
    ).toBeVisible();
    await expect(page.getByRole("heading", { name: "Have a project in mind?" })).toBeVisible();
    await expect(page.locator("section#pricing")).toHaveCount(0);
    await expect(page.locator("section#v2-results")).toHaveCount(0);
    await expect(page.locator("#v2-testimonials")).toHaveCount(0);

    await expect(
      page
        .locator("footer")
        .getByText("Custom software and digital product delivery for growing teams.", {
          exact: true,
        })
    ).toBeVisible();

    await page.goto("/services");
    await acceptCookiesIfPresent(page);
    await expect(page.locator("main#services-page")).toBeVisible({ timeout: 15_000 });
    await expect(
      page.locator("main#services-page").getByRole("heading", { level: 1, name: SERVICES_H1 })
    ).toBeVisible({ timeout: 15_000 });

    expect(consoleErrors).toEqual([]);
  });

  test(
    "workflow page renders only the workflow dashboard",
    { tag: "@critical" },
    async ({ page }) => {
      test.skip(true, "F9 retired /workflow; deep links redirect to Services.");
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
    test.skip(true, "F9 retired /workflow; deep links redirect to Services.");
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
    test.skip(true, "F9 retired /workflow; deep links redirect to Services.");
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

  test("workflow page keeps fixed english seo when language changes", async ({ page }) => {
    test.skip(true, "F9 retired /workflow; deep links redirect to Services.");
    await page.goto("/workflow");
    await acceptCookiesIfPresent(page);

    await expect(page).toHaveTitle(/Workflow — Agency/i);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      "content",
      /retired from the agency site index/i
    );
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/i);

    await page
      .locator("header")
      .getByRole("button", { name: /Language/i })
      .first()
      .click();
    await page.getByRole("option", { name: /^DE$/i }).first().click();

    // Document SEO stays English/noindex after locale switch.
    await expect(page).toHaveTitle(/Workflow — Agency/i);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      "content",
      /retired from the agency site index/i
    );
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/i);
    await expect(page.locator("main#workflow-page > section#workflow")).toHaveCount(1);
    await expect(
      page.getByRole("navigation", { name: "Primary" }).getByRole("link", { name: "Services" })
    ).toBeVisible();
    await expect(
      page.getByRole("navigation", { name: "Primary" }).getByRole("link", { name: "Workflow" })
    ).toHaveCount(0);
  });

  test(
    "homepage pricing modes switch monthly yearly and one-time leads",
    { tag: "@critical" },
    async ({ page, browserName }) => {
      // REM-XB-1 (pre-existing): on WebKit the click-stability check never settles
      // for the pricing nav/toggle while smooth-scroll/animations run, so the test
      // always dies on the 30s test timeout (timeout failures cannot be marked as
      // expected-fail). Skipped on WebKit until triaged; runs normally elsewhere.
      test.fixme(
        browserName === "webkit",
        "REM-XB-1: WebKit click-stability timeout on pricing controls"
      );
      const consoleErrors: string[] = [];
      page.on("console", (message) => {
        if (message.type() === "error") {
          consoleErrors.push(message.text());
        }
      });

      // F9: product pricing hash retired — homepage sends users to Contact.
      await page.goto("/#pricing");
      await acceptCookiesIfPresent(page);
      await expect(page).toHaveURL(/\/contact$/);

      await page.goto("/");
      await acceptCookiesIfPresent(page);
      await expect(page.locator("section#pricing")).toHaveCount(0);

      expect(consoleErrors).toEqual([]);
    }
  );

  test("homepage benefits section presents radial business outcomes", async ({ page }) => {
    test.skip(true, "F4 agency Homepage V3 uses #value cards instead of radial benefits.");
    test.setTimeout(90_000);
    const consoleErrors: string[] = [];
    page.on("console", (message) => {
      if (message.type() === "error") {
        consoleErrors.push(message.text());
      }
    });

    await page.goto("/#benefits");
    await acceptCookiesIfPresent(page);

    const benefits = page.locator("section#benefits");
    await expect(benefits).toBeVisible({ timeout: 15_000 });
    await expect(
      benefits.getByRole("heading", {
        level: 2,
        name: /From outreach work to sales results/i,
      })
    ).toBeVisible();

    // Outcome nodes are not clickable buttons.
    await expect(benefits.getByRole("button", { name: /Agency/i })).toHaveCount(0);
    await expect(benefits.getByRole("button", { name: /Better company matches/i })).toHaveCount(0);
    await expect(
      benefits.getByRole("button", { name: /More qualified conversations/i })
    ).toHaveCount(0);
    await expect(benefits.locator("[aria-expanded]")).toHaveCount(0);

    await expect(benefits.getByText("Agency").first()).toBeVisible();
    await expect(benefits.getByText("ADealForge")).toHaveCount(0);
    await expect(benefits.getByText(/Better company matches/i).first()).toBeVisible();
    await expect(benefits.getByText(/More qualified conversations/i).first()).toBeVisible();
    await expect(benefits.getByText(/Account research eats selling hours/i)).toHaveCount(0);
    await expect(
      benefits.getByRole("heading", { level: 3, name: /^Human quality review$/i })
    ).toHaveCount(0);
    await expect(
      benefits.getByRole("heading", { level: 2, name: /Built for sales teams/i })
    ).toHaveCount(0);
    await expect(
      benefits.getByRole("heading", { name: /Want to see if this fits your team\?/i })
    ).toHaveCount(0);
    await expect(benefits.getByRole("button", { name: /Let's Talk/i })).toHaveCount(0);
    await expect(benefits.getByText("See Outcomes", { exact: true })).toHaveCount(0);
    await expect(benefits.locator(".homepage-v3-benefits__orbit + *")).toHaveCount(0);

    // Desktop: one SVG line per outcome, center-to-outcome only.
    await page.setViewportSize({ width: 1440, height: 900 });
    await expect(benefits).toBeVisible();
    const lines = benefits.locator("svg.homepage-v3-benefits__lines line");
    await expect(lines).toHaveCount(8);
    await expect
      .poll(async () => {
        const x1 = await lines.first().getAttribute("x1");
        return x1 !== null && Number.isFinite(Number(x1));
      })
      .toBe(true);
    await expect(benefits.locator(".homepage-v3-benefits__node")).toHaveCount(8);

    const betterFit = benefits.locator(
      '.homepage-v3-benefits__node[data-outcome-id="better-fit-accounts"]'
    );
    await betterFit.focus();
    await expect(betterFit).toHaveClass(/is-active/);
    await expect(
      benefits.locator(
        'svg.homepage-v3-benefits__lines line[data-outcome-id="better-fit-accounts"]'
      )
    ).toHaveClass(/is-active/);
    await expect(benefits.locator(".homepage-v3-benefits__orbit")).toHaveClass(/is-dimming/);

    await betterFit.blur();
    await expect(betterFit).not.toHaveClass(/is-active/);

    const lineGeometry = await page.evaluate(() => {
      const stage = document.querySelector("#benefits .homepage-v3-benefits__stage");
      const center = document.querySelector(
        "#benefits .homepage-v3-benefits__stage > .homepage-v3-benefits__center"
      );
      const line = document.querySelector(
        '#benefits svg.homepage-v3-benefits__lines line[data-outcome-id="better-fit-accounts"]'
      ) as SVGLineElement | null;
      const node = document.querySelector(
        '#benefits .homepage-v3-benefits__node[data-outcome-id="better-fit-accounts"]'
      );
      if (!stage || !center || !line || !node) {
        return null;
      }
      const stageBox = stage.getBoundingClientRect();
      const centerBox = center.getBoundingClientRect();
      const nodeBox = node.getBoundingClientRect();
      const x1 = Number(line.getAttribute("x1"));
      const y1 = Number(line.getAttribute("y1"));
      const x2 = Number(line.getAttribute("x2"));
      const y2 = Number(line.getAttribute("y2"));
      const startX = stageBox.left + (x1 / 100) * stageBox.width;
      const startY = stageBox.top + (y1 / 100) * stageBox.height;
      const endX = stageBox.left + (x2 / 100) * stageBox.width;
      const endY = stageBox.top + (y2 / 100) * stageBox.height;
      const inset = 2;
      const pointInside = (x: number, y: number, box: DOMRect) =>
        x > box.left + inset &&
        x < box.right - inset &&
        y > box.top + inset &&
        y < box.bottom - inset;
      return {
        startInsideCenter: pointInside(startX, startY, centerBox),
        endInsideNode: pointInside(endX, endY, nodeBox),
        lineCount: document.querySelectorAll("#benefits svg.homepage-v3-benefits__lines line")
          .length,
      };
    });
    expect(lineGeometry).not.toBeNull();
    expect(lineGeometry?.lineCount).toBe(8);
    expect(lineGeometry?.startInsideCenter).toBe(false);
    expect(lineGeometry?.endInsideNode).toBe(false);

    // Mobile: descriptions visible without tap; nodes still not buttons.
    await page.setViewportSize({ width: 390, height: 844 });
    await expect(
      benefits.getByText(/Companies that match your target customer/i).first()
    ).toBeVisible();
    await expect(benefits.getByText(/More companies ready to contact/i).first()).toBeVisible();
    await expect(benefits.getByRole("button", { name: /Better company matches/i })).toHaveCount(0);
    await expect(benefits.locator("svg.homepage-v3-benefits__lines")).toHaveCount(0);

    for (const width of [1440, 768, 390] as const) {
      await page.setViewportSize({ width, height: width === 1440 ? 900 : 844 });
      await expect(benefits).toBeVisible();
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
    await expect(primaryNavigation.getByRole("link", { name: "Projects" })).toHaveAttribute(
      "href",
      "/projects"
    );

    const servicesLink = primaryNavigation.getByRole("link", { name: "Services" });
    await servicesLink.focus();
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/\/services$/);
    await expect(page.getByRole("heading", { level: 1, name: SERVICES_H1 })).toBeVisible();

    expect(consoleErrors).toEqual([]);
    expect(pageErrors).toEqual([]);
  });

  test(
    "studio nav links navigate correctly from every public route",
    { tag: "@critical" },
    async ({ page }) => {
      test.setTimeout(90_000);

      for (const source of [
        { path: "/", target: "Services", href: "/services", heading: SERVICES_H1 },
        {
          path: "/contact",
          target: "About",
          href: "/about",
          heading: /development studio|useful delivery/i,
        },
        {
          path: "/services",
          target: "Contact",
          href: "/contact",
          heading: /start the conversation/i,
        },
        { path: "/about", target: "Home", href: "/", heading: HOMEPAGE_H1_PATTERN },
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
      const mobileMenu = page.getByRole("dialog", { name: "Main menu" });
      await expect(mobileMenu.getByText("Platform", { exact: true })).toHaveCount(0);
      await expect(mobileMenu.getByText("Workflow", { exact: true })).toHaveCount(0);
      await expect(mobileMenu.getByText("Pricing", { exact: true })).toHaveCount(0);
      await expect(mobileMenu.getByText("Work", { exact: true })).toHaveCount(0);
      await expect(mobileMenu.getByRole("link", { name: "Projects" })).toHaveAttribute(
        "href",
        "/projects"
      );
      const aboutLink = mobileMenu.getByRole("link", { name: "About" });
      await expect(aboutLink).toHaveAttribute("href", "/about");
      await aboutLink.click();

      await expect(page).toHaveURL(/\/about$/);
      await expect(mobileMenu).toHaveCount(0);
      await expect(page.getByRole("heading", { level: 1 })).toContainText(/development studio/i);
    }
  );

  test("homepage section hashes survive refresh and browser history navigation", async ({
    page,
  }) => {
    await page.goto("/#process");
    await acceptCookiesIfPresent(page);
    await expect(page).toHaveURL(/\/#process$/);
    await expectHomepageSectionBelowNavbar(page, "process");

    await page.reload();
    await expect(page).toHaveURL(/\/#process$/);
    await expectHomepageSectionBelowNavbar(page, "process");

    await page.evaluate(() => {
      window.location.hash = "product";
    });
    await expect(page).toHaveURL(/\/#product$/);
    await expectHomepageSectionBelowNavbar(page, "services");

    await page.goBack();
    await expect(page).toHaveURL(/\/#process$/);
    await expectHomepageSectionBelowNavbar(page, "process");

    await page.goForward();
    await expect(page).toHaveURL(/\/#product$/);
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
      await expect(page.getByRole("heading", { level: 1 })).toContainText(HOMEPAGE_H1_PATTERN);
    }
  );

  test("legacy homepage v2 redirects to production home", async ({ page }) => {
    await page.goto("/homepage-v2");
    await acceptCookiesIfPresent(page);

    await expect(page).toHaveURL(/\/$/);
    await expect(page).toHaveTitle(/Agency Website/i);
    await expect(page.getByRole("heading", { level: 1 })).toContainText(HOMEPAGE_H1_PATTERN);
  });

  test("legacy homepage v3 redirects to production home", async ({ page }) => {
    await page.goto("/homepage-v3");
    await acceptCookiesIfPresent(page);

    await expect(page).toHaveURL(/\/$/);
    await expect(page).toHaveTitle(/Agency Website/i);
    await expect(page.getByRole("heading", { level: 1 })).toContainText(HOMEPAGE_H1_PATTERN);
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

  test.describe("shared agency footer", () => {
    async function openFooter(page: Page, path = "/contact") {
      await page.goto(path);
      await acceptCookiesIfPresent(page);
      await page.evaluate(async () => {
        window.scrollTo(0, document.documentElement.scrollHeight);
        for (let i = 0; i < 60; i++) {
          const footerNode = document.querySelector("footer.site-footer");
          if (footerNode) {
            footerNode.classList.add("is-revealed");
            footerNode.scrollIntoView({ block: "end" });
            return;
          }
          window.scrollBy(0, Math.floor(window.innerHeight * 0.9));
          if (i % 8 === 7) {
            window.scrollTo(0, document.documentElement.scrollHeight);
          }
          await new Promise((resolve) => window.setTimeout(resolve, 80));
        }
        window.scrollTo(0, document.documentElement.scrollHeight);
        await new Promise((resolve) => window.setTimeout(resolve, 300));
      });
      const footer = page.locator("footer.site-footer");
      await expect(footer).toBeVisible({ timeout: 20_000 });
      await footer.evaluate((node) => node.classList.add("is-revealed"));
      await footer.scrollIntoViewIfNeeded();
      return footer;
    }

    test("uses verified route groups, one CTA, and one bottom row", async ({ page }) => {
      const footer = await openFooter(page);

      await expect(footer.getByRole("navigation", { name: "Footer Explore" })).toBeVisible();
      await expect(footer.getByRole("navigation", { name: "Footer Company" })).toBeVisible();
      await expect(footer.getByRole("navigation", { name: "Footer Legal" })).toBeVisible();

      const expectedLinks = [
        ["Home", "/"],
        ["Services", "/services"],
        ["Projects", "/projects"],
        ["About", "/about"],
        ["Careers", "/careers"],
        ["Contact", "/contact"],
        ["Terms", "/terms"],
      ] as const;
      for (const [label, href] of expectedLinks) {
        await expect(footer.getByRole("link", { name: label, exact: true })).toHaveAttribute(
          "href",
          href
        );
      }

      await expect(footer.getByRole("link", { name: "Start a Project" })).toHaveAttribute(
        "href",
        "/contact"
      );
      await expect(footer.getByRole("link", { name: "Platform", exact: true })).toHaveCount(0);
      await expect(footer.locator('a[href="#"], a[href=""]')).toHaveCount(0);
      await expect(footer.getByText("© 2026. All rights reserved.", { exact: true })).toHaveCount(
        1
      );
      await expect(
        footer.getByText("Software, web, mobile, Shopify, and WordPress delivery.", {
          exact: true,
        })
      ).toHaveCount(1);
    });

    test("stays balanced without horizontal overflow at required widths", async ({ page }) => {
      test.setTimeout(90_000);
      const widths = [320, 360, 375, 390, 430, 768, 1024, 1280, 1440];

      for (const width of widths) {
        await page.setViewportSize({ width, height: width < 768 ? 812 : 900 });
        const footer = await openFooter(page);

        const metrics = await footer.evaluate((element) => {
          const top = element.querySelector(".site-footer__top");
          const brand = element.querySelector(".site-footer__brand");
          const navigation = element.querySelector(".site-footer__nav");
          const bottom = element.querySelector(".site-footer__bottom");
          if (
            !(top instanceof HTMLElement) ||
            !(brand instanceof HTMLElement) ||
            !(navigation instanceof HTMLElement) ||
            !(bottom instanceof HTMLElement)
          ) {
            return null;
          }

          const topStyle = getComputedStyle(top);
          const navStyle = getComputedStyle(navigation);
          const bottomStyle = getComputedStyle(bottom);
          const footerBox = element.getBoundingClientRect();
          const brandBox = brand.getBoundingClientRect();
          const navBox = navigation.getBoundingClientRect();

          return {
            overflowX:
              document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
            insideViewport: footerBox.left >= -1 && footerBox.right <= window.innerWidth + 1,
            topColumns: topStyle.gridTemplateColumns.split(" ").length,
            navColumns: navStyle.gridTemplateColumns.split(" ").length,
            brandBeforeNav: brandBox.bottom <= navBox.top + 2,
            bottomDirection: bottomStyle.flexDirection,
          };
        });

        expect(metrics, `footer metrics at ${width}px`).not.toBeNull();
        expect(metrics?.overflowX, `page overflow at ${width}px`).toBe(false);
        expect(metrics?.insideViewport, `footer bounds at ${width}px`).toBe(true);
        expect(metrics?.topColumns, `top grid at ${width}px`).toBe(width < 768 ? 1 : 2);
        expect(metrics?.navColumns, `navigation grid at ${width}px`).toBe(
          width < 360 ? 1 : width < 640 ? 2 : 3
        );
        expect(metrics?.brandBeforeNav, `mobile stack at ${width}px`).toBe(width < 768);
        expect(metrics?.bottomDirection, `bottom row at ${width}px`).toBe(
          width < 768 ? "column" : "row"
        );
      }
    });

    test("honors reduced motion on the shared footer", async ({ page }) => {
      const footer = await openFooter(page, "/contact");
      await expect(footer).toHaveCount(1);
      await expect(footer.getByRole("link", { name: "Start a Project" })).toBeVisible();

      await page.emulateMedia({ reducedMotion: "reduce" });
      await footer.getByRole("link", { name: "Start a Project" }).hover();

      const motion = await footer
        .getByRole("link", { name: "Start a Project" })
        .evaluate((link) => {
          const style = getComputedStyle(link);
          return {
            transform: style.transform,
            transitionDuration: style.transitionDuration,
          };
        });

      expect(motion.transform).toBe("none");
      expect(motion.transitionDuration).toBe("0s");
    });
  });

  test("contact social section renders verified cards while office location stays hidden", async ({
    page,
  }) => {
    await page.goto("/contact");
    await acceptCookiesIfPresent(page);

    const contact = page.locator("main#contact-page");
    await expect(contact).toBeVisible({ timeout: 15_000 });

    const heading = contact.getByRole("heading", { name: "Contact us another way" });
    await expect(heading).toBeVisible();

    const cards = contact.locator("a.contact-social-card");
    await expect(cards).toHaveCount(3);

    const linkedin = contact.getByRole("link", { name: /LinkedIn/i });
    await expect(linkedin).toBeVisible();
    await expect(linkedin).toHaveAttribute("href", "https://www.linkedin.com/company/nordleadsai");
    await expect(linkedin).toHaveAttribute("target", "_blank");
    await expect(linkedin).toHaveAttribute("rel", "noopener noreferrer");

    const instagram = contact.getByRole("link", { name: /Instagram/i });
    await expect(instagram).toBeVisible();
    await expect(instagram).toHaveAttribute("href", "https://www.instagram.com/nordleads");

    const github = contact.getByRole("link", { name: "GitHub", exact: true });
    await expect(github).toBeVisible();
    await expect(github).toHaveAttribute("href", "https://github.com/itnordleads-oss");

    await expect(contact.getByRole("link", { name: /Facebook/i })).toHaveCount(0);
    await expect(contact.getByRole("link", { name: /YouTube/i })).toHaveCount(0);
    await expect(contact.getByRole("link", { name: /Follow on X/i })).toHaveCount(0);
    await expect(page.locator("#contact-location")).toHaveCount(0);
  });

  test("homepage no longer renders the repeated outcomes section", async ({ page }) => {
    await page.goto("/");
    await acceptCookiesIfPresent(page);

    await expect(page.locator("section#v2-results")).toHaveCount(0);
    await expect(page.locator("section#benefits")).toHaveCount(0);
    await expect(page.locator("#v2-testimonials")).toHaveCount(0);

    // Services grid is taller than the old teaser — scroll so DeferredMount sections appear.
    await page.evaluate(async () => {
      for (let attempt = 0; attempt < 40; attempt += 1) {
        window.scrollTo(0, document.documentElement.scrollHeight);
        await new Promise((resolve) => window.setTimeout(resolve, 120));
      }
    });

    await expect(page.locator("section#services")).toBeVisible({ timeout: 15_000 });
    await expect(page.locator("section#value")).toBeVisible({ timeout: 15_000 });
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
        window.localStorage.removeItem("agency:schedule-meeting-dismissed-at");
      });

      // Homepage keeps Hero + Final CTA only — floating prompt is unmounted on `/`.
      await page.goto("/");
      await acceptCookiesIfPresent(page);
      await expect(page.locator(".schedule-meeting-float")).toHaveCount(0);

      const routes = ["/services", "/about", "/projects", "/careers", "/contact"] as const;

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
          window.localStorage.getItem("agency:schedule-meeting-dismissed-at")
        );
        expect(autoCollapseDismissedAt).toBeNull();
      }

      // Manual dismissal still persists and removes the widget before auto-collapse.
      await page.goto("/services");
      await acceptCookiesIfPresent(page);
      const dismissiblePrompt = page.locator(".schedule-meeting-float");
      await expect(dismissiblePrompt).toBeVisible({ timeout: 18_000 });
      await dismissiblePrompt.getByRole("button", { name: /Keep Browsing/i }).click();
      await expect(dismissiblePrompt).toHaveCount(0, { timeout: 5_000 });
      await expect(page.locator(".email-fab")).toHaveCount(0);
      const dismissedAt = await page.evaluate(() =>
        window.localStorage.getItem("agency:schedule-meeting-dismissed-at")
      );
      expect(Number(dismissedAt)).toBeGreaterThan(0);

      expect(consoleErrors).toEqual([]);
    }
  );
});
