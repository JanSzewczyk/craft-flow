import { expect, fn } from "storybook/test";
import { brandingFormBuilder } from "~/features/contractor/test/builders";
import { type RedirectAction } from "~/lib/action-types";

import { BrandingView } from "./branding-view";

import preview from "~/.storybook/preview";

const meta = preview.meta({
  title: "Features/Onboarding/Branding View",
  component: BrandingView,
  parameters: {
    layout: "padded"
  },
  args: {
    onContinueAction: fn(async () => ({ success: true as const, data: null }) as unknown as RedirectAction),
    uploadLogoAction: fn(async () => ({ success: true as const, data: { url: "https://placehold.co/64x64" } })),
    deleteLogoAction: fn(async () => ({ success: true as const, data: undefined })),
    onBackAction: fn()
  }
});

export const Default = meta.story({});

Default.test("Renders all expected content", async ({ canvas }) => {
  await expect(canvas.getByText("Kolor przewodni")).toBeVisible();
  await expect(canvas.getByText("Logo firmy")).toBeVisible();
  await expect(canvas.getByText("Podgląd na żywo")).toBeVisible();
  await expect(canvas.getByRole("button", { name: /dalej/i })).toBeVisible();
  await expect(canvas.getByRole("button", { name: /wróć/i })).toBeVisible();
});

Default.test("Shows availability alert for the feature", async ({ canvas }) => {
  await expect(canvas.getByText(/funkcja dostępna w planie standard i premium/i)).toBeVisible();
});

Default.test("File upload dropzone is visible when no logo set", async ({ canvas }) => {
  await expect(canvas.getByText(/kliknij lub przeciągnij plik/i)).toBeVisible();
});

Default.test("Default blue color preset is selected", async ({ canvas }) => {
  const bluePreset = canvas.getByRole("radio", { name: "Niebieski" });
  await expect(bluePreset).toBeChecked();
});

export const WithExistingBranding = meta.story({
  args: {
    defaultValues: brandingFormBuilder.one({ traits: "withPurple" })
  }
});

WithExistingBranding.test("Renders form with pre-filled brand color", async ({ canvas }) => {
  await expect(canvas.getByText("Kolor przewodni")).toBeVisible();
  const purplePreset = canvas.getByRole("radio", { name: "Fioletowy" });
  await expect(purplePreset).toBeChecked();
});
