import { expect, test } from "@playwright/test";

/**
 * E2E Tests for Pricing Page (/pricing)
 *
 * Route Handler: app/(marketing)/pricing/page.tsx
 * Components: PricingCardsSection, PricingFAQ
 * Server Action: selectPlan (redirects to /sign-up with plan parameter)
 *
 * This page is CRITICAL - primary revenue conversion point.
 */

test.describe("Page: Pricing", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/pricing");
  });

  test("pricing page loads and cards display correctly", async ({ page }) => {
    // Verify page title and main structure
    await expect(page).toHaveTitle(/Cennik/);
    await expect(page.getByRole("main")).toBeVisible();
    await expect(page.getByText(/Wybierz plan/)).toBeVisible();

    // All 3 pricing cards should be present
    const cards = page.locator('[data-slot="pricing-card"]');
    await expect(cards).toHaveCount(3);

    // Plan names and prices should be visible
    await expect(page.getByRole("heading", { name: "Basic" })).toBeVisible();
    await expect(page.getByText("79 PLN")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Standard" })).toBeVisible();
    await expect(page.getByText("149 PLN")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Premium" })).toBeVisible();
    await expect(page.getByText("299 PLN")).toBeVisible();

    // Featured plan (Standard) should have badge
    await expect(page.getByText(/Najlepszy wybór/)).toBeVisible();
  });

  test("revenue flow: plan selection redirects to sign-up correctly", async ({ page }) => {
    // This is THE CRITICAL test - verifies all plan buttons redirect with correct parameters

    // Test Basic plan
    await page.goto("/pricing");
    const cards = page.locator('[data-slot="pricing-card"]');
    await cards.first().locator("button").click();
    await expect(page).toHaveURL(/\/sign-up\?plan=basic/);

    // Test Standard plan
    await page.goto("/pricing");
    await cards.nth(1).locator("button").click();
    await expect(page).toHaveURL(/\/sign-up\?plan=standard/);

    // Test Premium plan
    await page.goto("/pricing");
    await cards.nth(2).locator("button").click();
    await expect(page).toHaveURL(/\/sign-up\?plan=premium/);
  });
});
