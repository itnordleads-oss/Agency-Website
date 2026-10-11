import { expect, test } from "@playwright/test";

const SERVICES = [
  {
    slug: "software-development",
    title: "Software Development",
    relatedCount: 2,
    hasPlatform: false,
  },
  {
    slug: "website-development",
    title: "Website Development",
    relatedCount: 3,
    hasPlatform: true,
  },
  {
    slug: "mobile-app-development",
    title: "Mobile App Development",
    relatedCount: 2,
    hasPlatform: false,
  },
  {
    slug: "shopify-stores",
    title: "Shopify Stores",
    relatedCount: 2,
    hasPlatform: true,
  },
  {
    slug: "wordpress-websites",
    title: "WordPress Websites",
    relatedCount: 2,
    hasPlatform: true,
  },
  {
    slug: "custom-wordpress-theme-development",
    title: "Custom WordPress Theme Development",
    relatedCount: 2,
    hasPlatform: true,
  },
] as const;

const VIEWPORTS = [
  { width: 320, height: 800 },
  { width: 375, height: 812 },
  { width: 390, height: 844 },
  { width: 768, height: 1024 },
  { width: 1024, height: 900 },
  { width: 1280, height: 900 },
  { width: 1440, height: 1000 },
] as const;

test.describe("services experience", () => {
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
      page.on("pageerror", (error) => pageErrors.push(error.message));

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
      await expect(page.locator("#service-capabilities li")).toHaveCount(6);
      await expect(page.locator("#service-benefits h3")).toHaveCount(4);
      await expect(page.locator("#service-process li")).toHaveCount(5);
      await expect(page.locator("#service-platforms")).toHaveCount(service.hasPlatform ? 1 : 0);
      await expect(page.getByRole("heading", { name: "Continue exploring" })).toBeVisible();
      await expect(page.locator('#related-services a[href^="/services/"]')).toHaveCount(
        service.relatedCount
      );
      await expect(page.getByRole("button", { name: "Start a Project" }).first()).toBeVisible();
      expect(pageErrors).toEqual([]);
    });
  }

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
