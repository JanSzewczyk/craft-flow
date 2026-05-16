import { expect, test } from "@playwright/test";

/**
 * E2E Tests for About Us Page (/about-us)
 *
 * Route Handler: app/(marketing)/about-us/page.tsx
 * Components: AboutHeroSection, HistorySection, ValuesSection, TeamSection, BottomCtaSection
 */

test.describe("Page: About Us", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/about-us");
    await page.waitForLoadState("domcontentloaded");
  });

  test("page loads with correct title and main structure", async ({ page }) => {
    await expect(page).toHaveTitle(/O nas/);
    await expect(page.getByRole("main")).toBeVisible();
  });

  test("hero section is visible", async ({ page }) => {
    // AboutHeroSection renders above the fold
    const hero = page.locator("section").first();
    await expect(hero).toBeVisible();
  });

  test("history section content is visible", async ({ page }) => {
    await expect(page.locator("body")).toContainText(/historia|Historia|rzemieślnika|rzemieślnicy/i);
  });

  test("values section content is visible", async ({ page }) => {
    await expect(page.locator("body")).toContainText(/wartości|Wartości|misja|Misja/i);
  });

  test("team section is visible", async ({ page }) => {
    await expect(page.locator("body")).toContainText(/zespół|Zespół|team/i);
  });

  test("bottom CTA section has link to pricing", async ({ page }) => {
    const ctaLink = page.getByRole("link", { name: /Wypróbuj CraftFlow za darmo/i });
    await expect(ctaLink).toBeVisible();
    await expect(ctaLink).toHaveAttribute("href", "/pricing");
  });

  test("page is responsive across devices", async ({ page }) => {
    const viewports = [
      { width: 375, height: 667 },
      { width: 768, height: 1024 },
      { width: 1920, height: 1080 }
    ];

    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      await expect(page.getByRole("main")).toBeVisible();
    }
  });
});
