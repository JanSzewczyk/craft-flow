import { expect, test } from "@playwright/test";

/**
 * E2E Tests for Contact Page (/contact)
 *
 * Route Handler: app/(marketing)/contact/page.tsx
 * Components: ContactHeader, ContactSection
 * Server Action: sendContactEmail
 */

test.describe("Page: Contact", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/contact");
    await page.waitForLoadState("domcontentloaded");
  });

  test("page loads with correct title and main structure", async ({ page }) => {
    await expect(page).toHaveTitle(/Kontakt/);
    await expect(page.getByRole("main")).toBeVisible();
  });

  test("contact header is visible", async ({ page }) => {
    await expect(page.getByRole("heading", { name: /Skontaktuj się z nami/i })).toBeVisible();
    await expect(page.getByText(/Masz pytanie/i)).toBeVisible();
  });

  test("contact form is present with all required fields", async ({ page }) => {
    // Name field — label: "Imię i nazwisko"
    await expect(page.getByLabel("Imię i nazwisko")).toBeVisible();

    // Email field — label: "Adres e-mail"
    await expect(page.getByLabel("Adres e-mail")).toBeVisible();

    // Subject select — label text "Temat" is visible; the select uses a combobox role
    await expect(page.getByText("Temat", { exact: true })).toBeVisible();
    await expect(page.getByRole("combobox")).toBeVisible();

    // Message textarea — label: "Wiadomość"
    await expect(page.getByLabel("Wiadomość")).toBeVisible();

    // Submit button
    await expect(page.getByRole("button", { name: "Wyślij wiadomość" })).toBeVisible();
  });

  test("form fields accept user input", async ({ page }) => {
    const nameInput = page.getByLabel("Imię i nazwisko");
    const emailInput = page.getByLabel("Adres e-mail");

    await nameInput.fill("Jan Kowalski");
    await emailInput.fill("jan@example.com");

    await expect(nameInput).toHaveValue("Jan Kowalski");
    await expect(emailInput).toHaveValue("jan@example.com");
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
