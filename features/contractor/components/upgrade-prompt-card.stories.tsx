import { expect } from "storybook/test";

import { UpgradePromptCard } from "./upgrade-prompt-card";

import preview from "~/.storybook/preview";

/*
 * Test plan:
 * 1. BrandingVariant — variant="branding"
 *    - Renders card title, description, benefits list, upgrade button
 *    - Upgrade button links to /app/settings
 * 2. EmailVariant — variant="email"
 *    - Renders card title, description, benefits list, upgrade button
 */

const meta = preview.meta({
  title: "Features/Contractor/Upgrade Prompt Card",
  component: UpgradePromptCard,
  parameters: {
    layout: "padded",
    nextjs: {
      appDirectory: true
    }
  }
});

// ---------------------------------------------------------------------------
// Story 1: Branding variant
// ---------------------------------------------------------------------------

export const BrandingVariant = meta.story({
  name: "Branding Variant",
  args: {
    variant: "branding"
  }
});

BrandingVariant.test("Renders all expected content", async ({ canvas, step }) => {
  await step("Card title and description are visible", async () => {
    await expect(canvas.getByText("Dostosuj wygląd swojej marki")).toBeVisible();
    await expect(canvas.getByText(/zmień logo, kolor przewodni/i)).toBeVisible();
  });

  await step("Benefits list is visible", async () => {
    await expect(canvas.getByText(/własne logo firmy w panelu klienta/i)).toBeVisible();
    await expect(canvas.getByText(/kolor przewodni dopasowany do twojej marki/i)).toBeVisible();
    await expect(canvas.getByText(/podgląd na żywo zmian brandingu/i)).toBeVisible();
  });

  await step("Upgrade button is visible", async () => {
    await expect(canvas.getByRole("link", { name: /zmień plan/i })).toBeVisible();
  });
});

BrandingVariant.test("Upgrade button links to settings page", async ({ canvas }) => {
  const link = canvas.getByRole("link", { name: /zmień plan/i });
  await expect(link).toHaveAttribute("href", "/app/settings");
});

// ---------------------------------------------------------------------------
// Story 2: Email variant
// ---------------------------------------------------------------------------

export const EmailVariant = meta.story({
  name: "Email Variant",
  args: {
    variant: "email"
  }
});

EmailVariant.test("Renders all expected content", async ({ canvas, step }) => {
  await step("Card title and description are visible", async () => {
    await expect(canvas.getByText("Personalizuj szablony e-mail")).toBeVisible();
    await expect(canvas.getByText(/dostosuj treść powiadomień/i)).toBeVisible();
  });

  await step("Benefits list is visible", async () => {
    await expect(canvas.getByText(/własny temat i treść wiadomości powitalnej/i)).toBeVisible();
    await expect(canvas.getByText(/zmienne dynamiczne/i)).toBeVisible();
    await expect(canvas.getByText(/kolejne szablony wkrótce/i)).toBeVisible();
  });

  await step("Upgrade button is visible", async () => {
    await expect(canvas.getByRole("link", { name: /zmień plan/i })).toBeVisible();
  });
});
