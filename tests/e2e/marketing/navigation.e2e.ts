import { expect, test } from "@playwright/test";

/**
 * E2E Tests for Cross-Page Navigation
 *
 * This test suite verifies that navigation works correctly across all marketing pages.
 * Header NAV_LINKS order: Funkcje (0), Cennik (1), O nas (2), Kontakt (3)
 */

test.describe("Navigation: Cross-Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("header navigation links work correctly", async ({ page }) => {
    // Desktop nav links — nav inside header
    const desktopNav = page.locator("header nav");
    const navLinks = desktopNav.getByRole("link");

    // → /features
    await navLinks.getByText("Funkcje").click();
    await expect(page).toHaveURL("/features");
    await expect(page).toHaveTitle(/Funkcje/);

    // → /pricing
    await page.goto("/");
    await desktopNav.getByRole("link", { name: "Cennik" }).click();
    await expect(page).toHaveURL("/pricing");
    await expect(page).toHaveTitle(/Cennik/);

    // → /about-us
    await page.goto("/");
    await desktopNav.getByRole("link", { name: "O nas" }).click();
    await expect(page).toHaveURL("/about-us");
    await expect(page).toHaveTitle(/O nas/);

    // → /contact
    await page.goto("/");
    await desktopNav.getByRole("link", { name: "Kontakt" }).click();
    await expect(page).toHaveURL("/contact");
    await expect(page).toHaveTitle(/Kontakt/);
  });

  test("header CTA buttons are present and link correctly", async ({ page }) => {
    // "Zaloguj się" button
    const signInButton = page.getByRole("link", { name: "Zaloguj się" });
    await expect(signInButton).toBeVisible();
    await expect(signInButton).toHaveAttribute("href", "/sign-in");

    // "Rozpocznij okres próbny" button (visible on xl screens)
    const trialButton = page.getByRole("link", { name: "Rozpocznij okres próbny" });
    await expect(trialButton.first()).toBeVisible();
    await expect(trialButton.first()).toHaveAttribute("href", "/pricing");
  });

  test("footer is present with product, company and legal links", async ({ page }) => {
    const footer = page.getByRole("contentinfo");
    await expect(footer).toBeVisible();

    // Product links
    await expect(footer.getByRole("link", { name: "Funkcje" })).toBeVisible();
    await expect(footer.getByRole("link", { name: "Cennik" })).toBeVisible();

    // Company links
    await expect(footer.getByRole("link", { name: "O nas" })).toBeVisible();
    await expect(footer.getByRole("link", { name: "Kontakt" })).toBeVisible();

    // Legal links
    await expect(footer.getByRole("link", { name: "Regulamin" })).toBeVisible();
    await expect(footer.getByRole("link", { name: "Polityka prywatności" })).toBeVisible();
  });

  test("footer legal links navigate to correct pages", async ({ page }) => {
    const footer = page.getByRole("contentinfo");

    // Terms link
    const termsLink = footer.getByRole("link", { name: "Regulamin" });
    await expect(termsLink).toHaveAttribute("href", "/terms");

    // Privacy link
    const privacyLink = footer.getByRole("link", { name: "Polityka prywatności" });
    await expect(privacyLink).toHaveAttribute("href", "/privacy");
  });

  test("direct URL access works for all public marketing pages", async ({ page }) => {
    const pages = [
      { url: "/", titlePattern: /Strona główna/ },
      { url: "/features", titlePattern: /Funkcje/ },
      { url: "/pricing", titlePattern: /Cennik/ },
      { url: "/about-us", titlePattern: /O nas/ },
      { url: "/contact", titlePattern: /Kontakt/ }
    ];

    for (const { url, titlePattern } of pages) {
      await page.goto(url);
      await expect(page).toHaveTitle(titlePattern);
      await expect(page.getByRole("main")).toBeVisible();
    }
  });

  test("header and footer are present on all marketing pages", async ({ page }) => {
    const urls = ["/", "/features", "/pricing", "/about-us", "/contact", "/terms", "/privacy"];

    for (const url of urls) {
      await page.goto(url);
      await expect(page.getByRole("banner")).toBeVisible(); // <header> = banner landmark
      await expect(page.getByRole("contentinfo")).toBeVisible(); // <footer> = contentinfo landmark
    }
  });

  test("active nav link is marked with aria-current=page", async ({ page }) => {
    await page.goto("/features");
    const activeLink = page.locator("header nav a[aria-current='page']");
    await expect(activeLink).toBeVisible();
    await expect(activeLink).toHaveText("Funkcje");

    await page.goto("/pricing");
    const activePricingLink = page.locator("header nav a[aria-current='page']");
    await expect(activePricingLink).toHaveText("Cennik");
  });

  test("page is responsive across devices", async ({ page }) => {
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
