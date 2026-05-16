import { expect, test } from "@playwright/test";

/**
 * E2E Tests for Terms of Service Page (/terms)
 *
 * Route Handler: app/(marketing)/terms/page.tsx
 * Components: LegalBreadcrumbs, LegalPageHeader, LegalSection, LegalSidebar, LegalCallout
 */

test.describe("Page: Terms of Service", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/terms");
    await page.waitForLoadState("domcontentloaded");
  });

  test("page loads and main structure is visible", async ({ page }) => {
    await expect(page.getByRole("main")).toBeVisible();
  });

  test("page header shows correct title and last updated date", async ({ page }) => {
    await expect(page.getByRole("heading", { name: /Regulamin usługi CraftFlow/i })).toBeVisible();
    await expect(page.getByText(/Ostatnia aktualizacja/i)).toBeVisible();
  });

  test("breadcrumbs are visible", async ({ page }) => {
    await expect(page.getByText(/Regulamin/i).first()).toBeVisible();
  });

  test("all 7 sections headings are present", async ({ page }) => {
    // LegalSection renders headings as: §N. Title (§ prefix via <span>)
    // Use text matching on h2 elements within the article
    const sections = [
      "Postanowienia ogólne",
      "Definicje",
      "Rejestracja i konto",
      "Subskrypcja i płatności",
      "Prawa i obowiązki",
      "Ograniczenie odpowiedzialności",
      "Postanowienia końcowe"
    ];

    for (const section of sections) {
      await expect(page.locator("article h2").filter({ hasText: section })).toBeVisible();
    }
  });

  test("legal sidebar navigation buttons are present on desktop", async ({ page }) => {
    // Sidebar uses <button> elements (not links) to scroll to sections
    // The sidebar is only visible on lg+ screens
    await page.setViewportSize({ width: 1280, height: 900 });
    const sidebarButtons = page.locator("aside nav button").filter({ hasText: /Postanowienia ogólne/i });
    await expect(sidebarButtons.first()).toBeVisible();
  });

  test("14-day trial callout is visible", async ({ page }) => {
    await expect(page.getByText(/14-dniowego okresu próbnego/i)).toBeVisible();
  });

  test("definitions section lists key terms", async ({ page }) => {
    // Use exact matching to avoid strict-mode violations (multiple elements with same text)
    await expect(page.getByText("Subskrypcja", { exact: true }).first()).toBeVisible();
    await expect(page.getByText("Użytkownik / Wykonawca", { exact: true })).toBeVisible();
    await expect(page.getByText("Klient", { exact: true })).toBeVisible();
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
