import { expect, test } from "@playwright/test";

/**
 * E2E Tests for Features Page (/features)
 *
 * Route Handler: app/(marketing)/features/page.tsx
 * Components: FeaturesHero, FeatureSection
 */

test.describe("Page: Features", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/features");
  });

  test("page loads and content is visible", async ({ page }) => {
    // Verify page title and main structure
    await expect(page).toHaveTitle(/Funkcje/);
    await expect(page.getByRole("main")).toBeVisible();

    // Check for key feature content using more flexible matching
    await expect(page.locator("body")).toContainText(/Oś|Oś czasu|Portal|portal klienta/i);
    await expect(page.locator("body")).toContainText(/Zarządzanie|CRM|szablony etapów/i);

    // Illustrations should be present
    const svgs = page.locator("svg");
    await expect(svgs.first()).toBeVisible();
  });

  test("page is responsive across devices", async ({ page }) => {
    // Test page loads correctly on different screen sizes
    const viewports = [
      { width: 375, height: 667 }, // mobile
      { width: 768, height: 1024 }, // tablet
      { width: 1920, height: 1080 } // desktop
    ];

    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      await expect(page.getByRole("main")).toBeVisible();
    }
  });
});
