import { expect, test } from "@playwright/test";

const SERVICES = [
  {
    slug: "software-development",
    title: "Software Development",
    relatedCount: 2,
    hasPlatform: false,
    visualType: "software",
    heroStateCount: 5,
  },
  {
    slug: "website-development",
    title: "Website Development",
    relatedCount: 3,
    hasPlatform: true,
    visualType: "web",
    heroStateCount: 2,
  },
  {
    slug: "mobile-app-development",
    title: "Mobile App Development",
    relatedCount: 2,
    hasPlatform: false,
    visualType: "mobile",
    heroStateCount: 3,
  },
  {
    slug: "shopify-stores",
    title: "Shopify Stores",
    relatedCount: 2,
    hasPlatform: true,
    visualType: "shopify",
    heroStateCount: 4,
  },
  {
    slug: "wordpress-websites",
    title: "WordPress Websites",
    relatedCount: 2,
    hasPlatform: true,
    visualType: "wordpress",
    heroStateCount: 4,
  },
  {
    slug: "custom-wordpress-theme-development",
    title: "Custom WordPress Theme Development",
    relatedCount: 2,
    hasPlatform: true,
    visualType: "custom-theme",
    heroStateCount: 6,
  },
] as const;

const VIEWPORTS = [
  { width: 320, height: 800 },
  { width: 360, height: 800 },
  { width: 375, height: 812 },
  { width: 390, height: 844 },
  { width: 414, height: 896 },
  { width: 430, height: 932 },
  { width: 768, height: 1024 },
  { width: 820, height: 1024 },
  { width: 1024, height: 900 },
  { width: 1280, height: 900 },
  { width: 1440, height: 1000 },
  { width: 1600, height: 1000 },
] as const;

test.describe("services experience", () => {
  test("hero delivery axis activates one perimeter connector per capability", async ({ page }) => {
    await page.goto("/services");

    const heroSystem = page.locator(".services-hero-system");
    await expect(heroSystem.locator(".services-hero-system__core")).toHaveCount(0);
    await expect(heroSystem.locator(".services-hero-system__axis-label")).toHaveCount(4);
    await expect(heroSystem.locator(".services-hero-system__link-base")).toHaveCount(6);

    const mobileNode = heroSystem.locator(".services-hero-system__stage--desktop button", {
      hasText: "Mobile",
    });
    await mobileNode.click();

    await expect(heroSystem.locator(".services-hero-system__summary-title")).toHaveText(
      "Mobile App Development"
    );
    await expect(heroSystem.locator(".services-hero-system__link-fill.is-active")).toHaveCount(1);
    await expect(heroSystem.locator(".services-hero-system__node.is-active")).toContainText(
      "Mobile"
    );
  });

  test("Service Blueprint selector synchronizes visual, content, and route", async ({ page }) => {
    await page.goto("/services");

    const blueprint = page.locator(".services-blueprint-section");
    await expect(blueprint.locator(".service-blueprint-visual--software")).toBeVisible();
    await expect(blueprint.locator(".services-blueprint-selector__rail")).toBeVisible();

    await blueprint.getByRole("tab", { name: "SHOPIFY" }).click();
    await expect(blueprint.getByRole("heading", { name: "Shopify Stores" })).toBeVisible();
    await expect(blueprint.locator(".service-blueprint-visual--shopify")).toBeVisible();
    await expect(blueprint.getByRole("tab", { name: "SHOPIFY" })).toHaveAttribute(
      "aria-selected",
      "true"
    );

    await blueprint.getByRole("button", { name: "Explore Service" }).click();
    await expect(page).toHaveURL(/\/services\/shopify-stores$/);
  });

  test("principle navigator synchronizes its canvas and the process remains readable", async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/services");

    const whyUs = page.locator(".services-principle-section");
    const requirements = whyUs.getByRole("button", { name: /Requirements/ });
    await requirements.focus();
    await requirements.press("Enter");

    await expect(requirements).toHaveAttribute("aria-pressed", "true");
    await expect(
      whyUs.getByRole("heading", { name: "Requirement-Focused Development" })
    ).toBeVisible();
    await expect(whyUs.getByText("INPUT", { exact: true })).toBeVisible();
    await expect(whyUs.getByText("SCOPE", { exact: true })).toBeVisible();
    await expect(whyUs.getByText("BUILD", { exact: true })).toBeVisible();

    const process = page.locator(".services-process-timeline");
    await expect(process.locator(".services-process-step")).toHaveCount(5);
    await expect(process.locator(".services-process-step.is-active")).toHaveCount(5);
    await expect(process.locator(".services-process-step__icon")).toHaveCount(5);
  });

  test("process progresses once after entering the viewport", async ({ page }) => {
    test.setTimeout(15_000);
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/services");

    const process = page.locator(".services-process-timeline");
    await expect(process).not.toHaveClass(/is-revealed/);

    await page.getByRole("heading", { name: "Our development process" }).scrollIntoViewIfNeeded();
    await expect(process).toHaveClass(/is-revealed/);
    await expect(page.locator(".services-delivery-system__path")).toBeVisible();
    await expect(page.locator(".services-delivery-system__path-base")).toHaveCount(5);
    await expect(process.locator(".services-process-step").nth(4)).toHaveClass(/is-current/, {
      timeout: 3_000,
    });
    await expect(process.locator(".services-process-step.is-active")).toHaveCount(5);
    await expect(page.locator(".services-delivery-system__path-active.is-active")).toHaveCount(5);
  });

  test("hub FAQ keeps one unique answer open and supports keyboard control", async ({ page }) => {
    await page.goto("/services");

    const faq = page.locator(".services-faq-section");
    const rows = faq.locator(".services-faq-row");
    await expect(rows).toHaveCount(7);

    const firstQuestion = rows.nth(0).locator(".services-faq-row__question");
    const firstButton = rows.nth(0).getByRole("button");
    const firstAnswer = rows.nth(0).locator(".services-faq-row__answer p");
    await expect(firstButton).toHaveAttribute("aria-expanded", "true");
    expect((await firstAnswer.textContent())?.trim()).not.toBe(
      (await firstQuestion.textContent())?.trim()
    );

    for (let index = 1; index < 7; index += 1) {
      const row = rows.nth(index);
      const question = row.locator(".services-faq-row__question");
      const button = row.getByRole("button");
      const answer = row.locator(".services-faq-row__answer p");

      await button.click();
      await expect(button).toHaveAttribute("aria-expanded", "true");
      await expect(answer).toBeVisible();
      expect((await answer.textContent())?.trim()).not.toBe((await question.textContent())?.trim());

      await expect(rows.nth(index - 1).getByRole("button")).toHaveAttribute(
        "aria-expanded",
        "false"
      );
    }

    const lastButton = rows.nth(6).getByRole("button");
    await lastButton.focus();
    await lastButton.press("Space");
    await expect(lastButton).toHaveAttribute("aria-expanded", "false");
  });

  test("hub presents exactly six approved service links", async ({ page }) => {
    const pageErrors: string[] = [];
    page.on("pageerror", (error) => pageErrors.push(error.message));

    await page.goto("/services");

    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "Build digital products and web experiences"
    );

    const serviceLinks = page.locator('#services-overview a[href^="/services/"]');
    await expect(serviceLinks).toHaveCount(6);

    for (const service of SERVICES) {
      await expect(page.getByRole("link", { name: `Explore ${service.title}` })).toHaveAttribute(
        "href",
        `/services/${service.slug}`
      );
    }

    await expect(
      page.getByRole("heading", { name: "Clear delivery without inflated promises" })
    ).toBeVisible();
    await expect(page.getByRole("heading", { name: "Our development process" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Common questions" })).toBeVisible();
    await expect(page.getByRole("heading", { name: /Technologies we work with/i })).toHaveCount(0);
    await expect(page.getByRole("heading", { name: /Flexible project approaches/i })).toHaveCount(
      0
    );

    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    const footer = page.locator("footer");
    await expect(footer).toBeVisible();
    await expect(footer.getByText("© 2026. All rights reserved.", { exact: true })).toHaveCount(1);
    await expect(
      footer.getByText("Software, web, mobile, Shopify, and WordPress delivery.", {
        exact: true,
      })
    ).toHaveCount(1);
    await expect(footer.getByRole("link", { name: "Services" })).toHaveAttribute(
      "href",
      "/services"
    );
    await expect(footer.getByRole("link", { name: "Platform" })).toHaveCount(0);
    await expect(footer.getByRole("link", { name: "Workflow" })).toHaveCount(0);

    expect(pageErrors).toEqual([]);
  });

  for (const service of SERVICES) {
    test(`${service.title} detail page renders with navigation and metadata`, async ({ page }) => {
      const pageErrors: string[] = [];
      const consoleErrors: string[] = [];
      page.on("pageerror", (error) => pageErrors.push(error.message));
      page.on("console", (message) => {
        if (message.type() === "error") {
          consoleErrors.push(message.text());
        }
      });

      await page.goto(`/services/${service.slug}`);

      await expect(page).toHaveURL(new RegExp(`/services/${service.slug}$`));
      await expect(page.getByRole("heading", { level: 1 })).toContainText(service.title);
      await expect(page).toHaveTitle(new RegExp(`${service.title} \\|`));
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
        "href",
        `/services/${service.slug}`
      );
      await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);

      const breadcrumb = page.getByRole("navigation", { name: "Breadcrumb" });
      await expect(breadcrumb).toBeVisible();
      await expect(breadcrumb.getByRole("link", { name: "Services" })).toHaveAttribute(
        "href",
        "/services"
      );

      await expect(page.getByRole("button", { name: "Explore the Service" })).toBeVisible();
      const heroVisual = page.locator(
        `.service-detail-hero__visual .service-detail-hero-visual--${service.visualType}`
      );
      await expect(heroVisual).toBeVisible();
      await expect(heroVisual.getByRole("button")).toHaveCount(service.heroStateCount);
      await expect(heroVisual.getByRole("button").first()).toHaveAttribute("aria-pressed", "true");
      await heroVisual.getByRole("button").last().click();
      await expect(heroVisual.getByRole("button").last()).toHaveAttribute("aria-pressed", "true");
      await expect(page.locator("#service-capabilities [role=tab]")).toHaveCount(6);
      await expect(page.locator("#service-capabilities [role=tabpanel]")).toBeVisible();
      await expect(page.locator("#service-benefits h3")).toHaveCount(4);
      await expect(page.locator("#service-process li")).toHaveCount(5);
      await expect(page.locator(".service-detail-process__route")).toBeVisible();
      await expect(page.locator("#service-platforms")).toHaveCount(service.hasPlatform ? 1 : 0);
      await expect(page.getByRole("heading", { name: "Continue exploring" })).toBeVisible();
      await expect(page.locator('#related-services a[href^="/services/"]')).toHaveCount(
        service.relatedCount
      );
      await expect(page.locator(".service-detail-faq .services-faq-row")).toHaveCount(3);
      await expect(page.getByRole("button", { name: "Start a Project" }).first()).toBeVisible();
      expect(pageErrors).toEqual([]);
      expect(consoleErrors).toEqual([]);
    });
  }

  test("detail interactions and state reset follow service-to-service navigation", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/services/software-development");

    const capabilities = page.locator("#service-capabilities");
    const capabilityTabs = capabilities.getByRole("tab");
    await expect(capabilityTabs.first()).toHaveAttribute("aria-selected", "true");

    await capabilityTabs.nth(1).click();
    await expect(capabilityTabs.nth(1)).toHaveAttribute("aria-selected", "true");
    await expect(capabilities.getByRole("tabpanel")).toContainText(
      "Browser-based applications make structured workflows available across devices."
    );

    await capabilityTabs.nth(1).press("End");
    await expect(capabilityTabs.nth(5)).toHaveAttribute("aria-selected", "true");

    const benefits = page.locator("#service-benefits");
    const benefitButtons = benefits.getByRole("button");
    await benefitButtons.nth(2).click();
    await expect(benefitButtons.nth(2)).toHaveAttribute("aria-pressed", "true");

    const faq = page.locator(".service-detail-faq");
    await faq.getByRole("button").nth(1).click();
    await expect(faq.getByRole("button").nth(1)).toHaveAttribute("aria-expanded", "true");

    await page.locator('#related-services a[href="/services/website-development"]').click();
    await expect(page).toHaveURL(/\/services\/website-development$/);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Website Development");
    await expect(page.getByRole("heading", { level: 1, name: "Software Development" })).toHaveCount(
      0
    );
    const websiteHero = page.locator(".service-detail-hero-visual--web");
    await expect(websiteHero).toBeVisible();
    await expect(websiteHero.getByRole("button").first()).toHaveAttribute("aria-pressed", "true");
    await expect(page.locator("#service-capabilities").getByRole("tab").first()).toHaveAttribute(
      "aria-selected",
      "true"
    );
    await expect(page.locator(".service-detail-faq").getByRole("button").first()).toHaveAttribute(
      "aria-expanded",
      "true"
    );
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeLessThanOrEqual(1);
  });

  test("detail motion resolves immediately when reduced motion is requested", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/services/custom-wordpress-theme-development");

    const capabilities = page.locator("#service-capabilities");
    const secondCapability = capabilities.getByRole("tab").nth(1);
    await secondCapability.click();
    await expect(secondCapability).toHaveAttribute("aria-selected", "true");
    await expect(capabilities.getByRole("tabpanel")).toContainText(
      "Approved screens are translated into responsive WordPress components."
    );

    const process = page.locator(".service-detail-process");
    await process.scrollIntoViewIfNeeded();
    await expect(process).toHaveClass(/is-revealed/);
    await expect(process.locator("li.is-active")).toHaveCount(5);

    const motionState = await page
      .locator(".service-detail-hero__visual-column")
      .evaluate((element) => getComputedStyle(element).animationName);
    expect(motionState).toBe("none");
  });

  test("detail Hero visual controls support hover and keyboard activation", async ({ page }) => {
    await page.goto("/services/software-development");

    const heroVisual = page.locator(".service-detail-hero-visual--software");
    const logic = heroVisual.getByRole("button", { name: /Logic/ });
    const data = heroVisual.getByRole("button", { name: /^Data/ });

    await logic.hover();
    await expect(logic).toHaveAttribute("aria-pressed", "true");
    await expect(heroVisual).toHaveAttribute("data-active-state", "logic");

    await data.focus();
    await data.press("Space");
    await expect(data).toHaveAttribute("aria-pressed", "true");
    await expect(heroVisual).toHaveAttribute("data-active-state", "data");
  });

  test("invalid service URL renders a noindex not-found state", async ({ page }) => {
    await page.goto("/services/not-a-service");

    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Service page not found");
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      "content",
      "noindex, nofollow"
    );
  });

  test("hub and detail layouts do not overflow supported viewports", async ({ page }) => {
    test.setTimeout(90_000);

    for (const viewport of VIEWPORTS) {
      await page.setViewportSize(viewport);

      for (const pathname of [
        "/services",
        ...SERVICES.map((service) => `/services/${service.slug}`),
      ]) {
        await page.goto(pathname);
        await expect(page.locator("main").first()).toBeVisible();

        const dimensions = await page.evaluate(() => ({
          clientWidth: document.documentElement.clientWidth,
          scrollWidth: document.documentElement.scrollWidth,
        }));
        expect(
          dimensions.scrollWidth,
          `${pathname} overflowed at ${viewport.width}px`
        ).toBeLessThanOrEqual(dimensions.clientWidth);

        if (pathname !== "/services") {
          const responsiveState = await page.evaluate(() => {
            const processList = document.querySelector<HTMLOListElement>(
              ".service-detail-process ol"
            );
            const processRoute = document.querySelector<HTMLElement>(
              ".service-detail-process__route"
            );
            const heroButtons = Array.from(
              document.querySelectorAll<HTMLButtonElement>(".service-detail-hero-visual button")
            ).filter((button) => {
              const bounds = button.getBoundingClientRect();
              return bounds.width > 0 && bounds.height > 0;
            });
            const sectionControls = Array.from(
              document.querySelectorAll<HTMLElement>(
                "#service-capabilities [role=tab], #service-benefits button, .service-detail-faq button, #related-services a"
              )
            ).filter((control) => {
              const bounds = control.getBoundingClientRect();
              return bounds.width > 0 && bounds.height > 0;
            });
            const title = document.querySelector<HTMLHeadingElement>(".service-detail-hero__title");
            const lineHeight = title ? Number.parseFloat(getComputedStyle(title).lineHeight) : 0;
            const routeBounds = processRoute?.getBoundingClientRect();

            if (!processList || !processRoute || !title || lineHeight === 0 || !routeBounds) {
              throw new Error(`Missing responsive detail structure on ${window.location.pathname}`);
            }

            return {
              processColumns: getComputedStyle(processList).gridTemplateColumns.split(" ").length,
              processRouteHeight: routeBounds.height,
              processRouteWidth: routeBounds.width,
              minimumHeroControlHeight: Math.min(
                ...heroButtons.map((button) => button.offsetHeight)
              ),
              minimumSectionControlHeight: Math.min(
                ...sectionControls.map((control) => control.getBoundingClientRect().height)
              ),
              titleLines: Math.round(title.getBoundingClientRect().height / lineHeight),
            };
          });

          if (viewport.width <= 1024) {
            expect(
              responsiveState.processColumns,
              `${pathname} used a compressed process grid at ${viewport.width}px`
            ).toBe(1);
            expect(
              responsiveState.processRouteHeight,
              `${pathname} did not use a vertical process route at ${viewport.width}px`
            ).toBeGreaterThan(responsiveState.processRouteWidth);
          }

          if (viewport.width <= 1024) {
            expect(
              responsiveState.minimumHeroControlHeight,
              `${pathname} had an undersized Hero control at ${viewport.width}px`
            ).toBeGreaterThanOrEqual(44);
            expect(
              responsiveState.minimumSectionControlHeight,
              `${pathname} had an undersized section control at ${viewport.width}px`
            ).toBeGreaterThanOrEqual(44);
          }

          if (
            pathname === "/services/custom-wordpress-theme-development" &&
            viewport.width <= 375
          ) {
            expect(
              responsiveState.titleLines,
              `${pathname} wrapped too narrowly at ${viewport.width}px`
            ).toBeLessThanOrEqual(3);
          }

          if (viewport.width >= 1280) {
            expect(
              responsiveState.processColumns,
              `${pathname} desktop process layout regressed at ${viewport.width}px`
            ).toBe(5);
          }
        }
      }
    }
  });

  test("card, related service, FAQ, and contact interactions work", async ({ page }) => {
    await page.goto("/services");
    await page.getByRole("link", { name: "Explore Software Development" }).click();
    await expect(page).toHaveURL(/\/services\/software-development$/);

    await page.getByRole("link", { name: /Website Development/ }).click();
    await expect(page).toHaveURL(/\/services\/website-development$/);

    const secondQuestion = page.getByRole("button", {
      name: "Do you build landing pages?",
    });
    await secondQuestion.click();
    await expect(secondQuestion).toHaveAttribute("aria-expanded", "true");

    await page.getByRole("button", { name: "Start a Project" }).first().click();
    await expect(page).toHaveURL(/\/contact$/);
  });
});
