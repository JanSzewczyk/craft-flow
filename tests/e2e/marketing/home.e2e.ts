import { expect, test } from "@playwright/test";

/**
 * E2E Tests for Homepage (/)
 *
 * Route Handler: app/(marketing)/page.tsx
 * Components: HeroSection, WhyCraftFlowSection, TestimonialsSection, BottomCtaSection
 */

test.describe("Page: Home", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    // Wait for page to be fully loaded
    await page.waitForLoadState("domcontentloaded");
  });

  test("page loads and key elements are visible", async ({ page }) => {
    // Verify page title and main structure
    await expect(page).toHaveTitle(/Strona główna/);
    await expect(page.getByRole("main")).toBeVisible();

    // Hero section elements
    await expect(page.getByText("Nowoczesny Warsztat")).toBeVisible();
    await expect(page.locator("h1")).toContainText(/Zakończ erę ciągłych telefonów od klientów/);

    // CTA buttons in hero - check visibility (don't click to avoid timing issues)
    expect(await page.locator("a[href='/features']").all()).toHaveLength(3);
    expect(await page.locator("a[href='/pricing']").all()).toHaveLength(5);

    // Social proof and sections
    await expect(page.getByText("+500 warsztatów")).toBeVisible();
    await expect(page.getByText("Status Zlecenia", { exact: true })).toBeVisible();
    await expect(page.locator("h2").filter({ hasText: /Zaufali nam rzemieślnicy/ })).toHaveCount(1);

    // Bottom CTA section
    await expect(page.locator("h2").filter({ hasText: /Gotowy na rewolucję/ })).toBeVisible();

    // Bottom CTA buttons
    expect(await page.locator("a[href='/contact']").all()).toHaveLength(3);
  });
});
