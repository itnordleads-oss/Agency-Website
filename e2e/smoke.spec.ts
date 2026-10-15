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
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      /digital products|delivery partner/i
    );
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

  test("retired platform route redirects to services", { tag: "@critical" }, async ({ page }) => {
    await page.goto("/platform");
    await acceptCookiesIfPresent(page);
    await expect(page).toHaveURL(/\/services\/?$/);
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Services", {
      timeout: 15_000,
    });
    await expect(page.locator("main#platform-page")).toHaveCount(0);
  });

  test("retired workflow route redirects to services", { tag: "@critical" }, async ({ page }) => {
    await page.goto("/workflow");
    await acceptCookiesIfPresent(page);
    await expect(page).toHaveURL(/\/services\/?$/);
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Services", {
      timeout: 15_000,
    });
    await expect(page.locator("main#workflow-page")).toHaveCount(0);
  });

  test("retired product landing path redirects to services", async ({ page }) => {
    await page.goto("/landing/b2b-lead-generation/");
    await acceptCookiesIfPresent(page);
    await expect(page).toHaveURL(/\/services\/?$/);
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Services", {
      timeout: 15_000,
    });
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

    expect(consoleErrors).toEqual([]);
  });

  test("product pricing section is not exposed on homepage", async ({ page }) => {
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

  test("homepage pricing hash navigates to contact", async ({ page }) => {
    await page.goto("/#pricing");
    await acceptCookiesIfPresent(page);
    await expect(page).toHaveURL(/\/contact\/?$/, { timeout: 15_000 });
    await expect(page.locator("main#contact-page")).toBeVisible({ timeout: 15_000 });
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
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
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Services");

    expect(consoleErrors).toEqual([]);
    expect(pageErrors).toEqual([]);
  });

  test(
    "studio nav links navigate correctly from every public route",
    { tag: "@critical" },
    async ({ page }) => {
      test.setTimeout(90_000);

      for (const source of [
        {
          path: "/",
          target: "Services",
          href: "/services",
          heading: "Services",
        },
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
          heading: /Let's start the conversation/i,
        },
        {
          path: "/about",
          target: "Home",
          href: "/",
          heading: /digital products|delivery partner/i,
        },
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
      const aboutLink = mobileMenu.getByRole("link", { name: "About" });
      await expect(aboutLink).toHaveAttribute("href", "/about");
      await aboutLink.click();

      await expect(page).toHaveURL(/\/about$/);
      await expect(mobileMenu).toHaveCount(0);
      await expect(
        page.getByRole("heading", { level: 1, name: /development studio|useful delivery/i })
      ).toBeVisible();
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
      await expect(page.getByRole("heading", { level: 1 })).toContainText(
        /digital products|delivery partner/i
      );
    }
  );

  test("legacy homepage v2 redirects to production home", async ({ page }) => {
    await page.goto("/homepage-v2");
    await acceptCookiesIfPresent(page);

    await expect(page).toHaveURL(/\/$/);
    await expect(page).toHaveTitle(/Agency Website/i);
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      /digital products|delivery partner/i
    );
  });

  test("legacy homepage v3 redirects to production home", async ({ page }) => {
    await page.goto("/homepage-v3");
    await acceptCookiesIfPresent(page);

    await expect(page).toHaveURL(/\/$/);
    await expect(page).toHaveTitle(/Agency Website/i);
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      /digital products|delivery partner/i
    );
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

  test("footer Connect renders only verified social URLs", async ({ page }) => {
    // Contact is shorter than home, so the DeferredMount footer activates reliably.
    await page.goto("/contact");
    await acceptCookiesIfPresent(page);

    await page.evaluate(async () => {
      window.scrollTo(0, document.documentElement.scrollHeight);
      for (let i = 0; i < 60; i++) {
        if (document.querySelector("footer")) {
          document.querySelector("footer")?.scrollIntoView({ block: "end" });
          return;
        }
        window.scrollBy(0, Math.floor(window.innerHeight * 0.9));
        if (i % 8 === 7) {
          window.scrollTo(0, document.documentElement.scrollHeight);
        }
        await new Promise((resolve) => window.setTimeout(resolve, 80));
      }
      window.scrollTo(0, document.documentElement.scrollHeight);
      await new Promise((resolve) => window.setTimeout(resolve, 250));
    });

    const footer = page.locator("footer");
    await expect(footer).toBeVisible({ timeout: 20_000 });
    await footer.scrollIntoViewIfNeeded();

    const connect = footer.getByRole("navigation", { name: "Social links" });
    await expect(connect).toBeVisible();
    await expect(connect.getByText("Connect", { exact: true })).toBeVisible();

    const linkedin = connect.getByRole("link", { name: "LinkedIn", exact: true });
    await expect(linkedin).toBeVisible();
    await expect(linkedin).toHaveAttribute("href", "https://www.linkedin.com/company/nordleadsai");
    await expect(linkedin).toHaveAttribute("target", "_blank");
    await expect(linkedin).toHaveAttribute("rel", "noopener noreferrer");

    const instagram = connect.getByRole("link", { name: "Instagram", exact: true });
    await expect(instagram).toBeVisible();
    await expect(instagram).toHaveAttribute("href", "https://www.instagram.com/nordleads");

    const github = connect.getByRole("link", { name: "GitHub", exact: true });
    await expect(github).toBeVisible();
    await expect(github).toHaveAttribute("href", "https://github.com/itnordleads-oss");

    // Circular icon controls (not square chips).
    await expect
      .poll(async () =>
        github.evaluate((el) => getComputedStyle(el).borderRadius.replace(/\s/g, ""))
      )
      .toMatch(/^(9999?px|50%)$/);

    // Unpublished networks must not render as placeholders.
    await expect(connect.getByRole("link", { name: "Facebook", exact: true })).toHaveCount(0);
    await expect(connect.getByRole("link", { name: "YouTube", exact: true })).toHaveCount(0);
    await expect(connect.getByRole("link", { name: "X", exact: true })).toHaveCount(0);
    await expect(connect.getByRole("link", { name: "Dribbble", exact: true })).toHaveCount(0);
    await expect(connect.getByRole("link", { name: "Behance", exact: true })).toHaveCount(0);
    await expect(footer.locator('a[href="#"], a[href=""]')).toHaveCount(0);
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
        ["About", "/about"],
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
      await expect(footer.getByRole("link", { name: /Projects|Careers|Privacy/ })).toHaveCount(0);
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

    test("renders the same shared footer on Terms and honors reduced motion", async ({ page }) => {
      const footer = await openFooter(page, "/terms");
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

    // Unpublished networks must not render as placeholders.
    await expect(contact.getByRole("link", { name: /Facebook/i })).toHaveCount(0);
    await expect(contact.getByRole("link", { name: /YouTube/i })).toHaveCount(0);
    await expect(contact.getByRole("link", { name: /Follow on X/i })).toHaveCount(0);

    // Office location stays hidden while the registered business address is TBC (F2).
    await expect(page.locator("#contact-location")).toHaveCount(0);
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
      // 10s show delay + 10s expanded window + collapse, x4 routes, plus overhead.
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

      // F9: product-era /platform and /workflow redirect to /services, so the
      // floating prompt is only exercised on live agency routes.
      const routes = ["/", "/services", "/contact", "/about"] as const;

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
      await page.goto("/");
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
