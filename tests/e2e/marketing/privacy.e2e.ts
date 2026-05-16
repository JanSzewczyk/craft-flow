import { expect, test } from "@playwright/test";

/**
 * E2E Tests for Privacy Policy Page (/privacy)
 *
 * Route Handler: app/(marketing)/privacy/page.tsx
 * Components: LegalBreadcrumbs, LegalPageHeader, LegalSection, LegalSidebar,
 *             PrivacyAdminCard, PrivacyDataItem, PrivacyPartnerItem, PrivacyRightItem
 */

test.describe("Page: Privacy Policy", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/privacy");
    await page.waitForLoadState("domcontentloaded");
  });

  test("page loads and main structure is visible", async ({ page }) => {
    await expect(page.getByRole("main")).toBeVisible();
  });

  test("page header shows correct title and last updated date", async ({ page }) => {
    await expect(page.getByRole("heading", { name: /Polityka prywatności CraftFlow/i })).toBeVisible();
    await expect(page.getByText(/Ostatnia aktualizacja/i)).toBeVisible();
  });

  test("breadcrumbs are visible", async ({ page }) => {
    await expect(page.getByText(/Polityka prywatności/i).first()).toBeVisible();
  });

  test("all 7 legal sections headings are present", async ({ page }) => {
    // LegalSection renders headings as: §N. Title (§ prefix via <span>)
    // Use text matching on h2 elements within the article
    const sections = [
      "Administrator danych",
      "Zakres zbieranych danych",
      "Cel i podstawa przetwarzania",
      "Przekazywanie danych",
      "Okres przechowywania danych",
      "Prawa użytkownika",
      "Pliki cookie"
    ];

    for (const section of sections) {
      await expect(page.locator("article h2").filter({ hasText: section })).toBeVisible();
    }
  });

  test("legal sidebar navigation buttons are present on desktop", async ({ page }) => {
    // Sidebar uses <button> elements (not links) to scroll to sections
    // The sidebar is only visible on lg+ screens (hidden class on mobile)
    await page.setViewportSize({ width: 1280, height: 900 });
    const sidebarButtons = page.locator("aside nav button").filter({ hasText: /Administrator danych/i });
    await expect(sidebarButtons.first()).toBeVisible();
  });

  test("privacy admin card shows company details", async ({ page }) => {
    await expect(page.getByRole("heading", { name: /CraftFlow sp. z o.o./i })).toBeVisible();
    await expect(page.getByRole("link", { name: /privacy@craftflow.pl/i }).first()).toBeVisible();
  });

  test("GDPR rights section lists user rights", async ({ page }) => {
    await expect(page.getByText(/Prawo dostępu/i)).toBeVisible();
    await expect(page.getByText(/Prawo sprostowania/i)).toBeVisible();
    await expect(page.getByText(/Prawo do usunięcia/i)).toBeVisible();
  });

  test("contact email links are functional", async ({ page }) => {
    const emailLinks = page.getByRole("link", { name: /privacy@craftflow.pl/i });
    await expect(emailLinks.first()).toBeVisible();
    await expect(emailLinks.first()).toHaveAttribute("href", "mailto:privacy@craftflow.pl");
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
