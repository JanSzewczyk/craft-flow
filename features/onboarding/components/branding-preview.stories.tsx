import { expect, waitFor } from "storybook/test";

import { BrandingPreview } from "./branding-preview";

import preview from "~/.storybook/preview";


const meta = preview.meta({
  title: "Features/Onboarding/Branding Preview",
  component: BrandingPreview,
  parameters: {
    layout: "centered"
  }
});

export const DefaultBlue = meta.story({
  name: "Default Blue",
  args: {
    brandColor: "#2563EB",
    logoUrl: null
  }
});

DefaultBlue.test("Renders all expected content", async ({ canvas }) => {
  await expect(canvas.getByText("Craft Flow")).toBeVisible();
  await expect(canvas.getByText("Klienci")).toBeVisible();
  await expect(canvas.getByText("Przychód")).toBeVisible();
  await expect(canvas.getByText("Ostatnia aktywność")).toBeVisible();
  await expect(canvas.getByText("Podgląd na żywo")).toBeVisible();
  await expect(canvas.getByText("Nowy projekt")).toBeVisible();
});

DefaultBlue.test("Shows avatar fallback when no logo is provided", async ({ canvas }) => {
  const fallback = canvas.getByText("CF");
  await expect(fallback).toBeVisible();
});

export const CustomPurple = meta.story({
  name: "Custom Purple",
  args: {
    brandColor: "#7C3AED",
    logoUrl: null
  }
});

export const WithoutLogo = meta.story({
  name: "Without Logo",
  args: {}
});

// Using a data URL ensures the image loads immediately without network dependency
const LOGO_DATA_URL = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

export const WithLogoUrl = meta.story({
  name: "With Logo URL",
  args: {
    brandColor: "#2563EB",
    logoUrl: LOGO_DATA_URL
  }
});

WithLogoUrl.test("Renders logo image and activity feed items", async ({ canvas }) => {
  await waitFor(async () => {
    await expect(canvas.getByRole("img", { name: /logo/i })).toBeInTheDocument();
  });
  await expect(canvas.getByText("Nowe zamówienie #1024")).toBeVisible();
  await expect(canvas.getByText("Wiadomość od klienta")).toBeVisible();
  await expect(canvas.getByText("Zakończono projekt")).toBeVisible();
});
