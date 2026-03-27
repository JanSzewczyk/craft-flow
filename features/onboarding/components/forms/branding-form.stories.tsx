import { expect, fn, waitFor, within } from "storybook/test";
import { type RedirectAction } from "~/lib/action-types";

import { BrandingForm } from "./branding-form";

import preview from "~/.storybook/preview";

const meta = preview.meta({
  title: "Features/Onboarding/Forms/Branding Form",
  component: BrandingForm,
  parameters: {
    layout: "padded"
  },
  args: {
    onContinueAction: fn(async () => ({ success: true as const, data: null }) as unknown as RedirectAction),
    uploadLogoAction: fn(async () => ({ success: true as const, data: { url: "https://placehold.co/64x64" } })),
    deleteLogoAction: fn(async () => ({ success: true as const, data: undefined })),
    onBackAction: fn(),
    onValuesChange: fn()
  }
});

export const Empty = meta.story({});

Empty.test("Renders all expected content", async ({ canvas }) => {
  await expect(canvas.getByText("Logo firmy")).toBeVisible();
  await expect(canvas.getByText("Kolor przewodni")).toBeVisible();
  await expect(canvas.getByRole("button", { name: /dalej/i })).toBeVisible();
  await expect(canvas.getByRole("button", { name: /wróć/i })).toBeVisible();
});

Empty.test("Shows file upload dropzone when no logo is set", async ({ canvas }) => {
  await expect(canvas.getByText(/kliknij lub przeciągnij plik/i)).toBeVisible();
});

Empty.test("Default brand color preset is selected", async ({ canvas }) => {
  const bluePreset = canvas.getByRole("radio", { name: "Niebieski" });
  await expect(bluePreset).toBeChecked();
});

Empty.test("All brand color presets are rendered", async ({ canvas }) => {
  await expect(canvas.getByRole("radio", { name: "Niebieski" })).toBeInTheDocument();
  await expect(canvas.getByRole("radio", { name: "Fioletowy" })).toBeInTheDocument();
  await expect(canvas.getByRole("radio", { name: "Bursztynowy" })).toBeInTheDocument();
  await expect(canvas.getByRole("radio", { name: "Zielony" })).toBeInTheDocument();
  await expect(canvas.getByRole("radio", { name: "Czerwony" })).toBeInTheDocument();
});

Empty.test("Clicking back button triggers onBackAction", async ({ canvas, userEvent, args }) => {
  const backButton = canvas.getByRole("button", { name: /wróć/i });
  await userEvent.click(backButton);
  await waitFor(async () => {
    await expect(args.onBackAction).toHaveBeenCalledOnce();
  });
});

Empty.test("Keyboard navigation moves focus to next color preset", async ({ canvas, userEvent }) => {
  // RadioGroupItem is sr-only — test keyboard navigation (ArrowRight moves focus).
  // Checking aria-checked via React re-render is not reliable in browser test environment.
  const bluePreset = canvas.getByRole("radio", { name: "Niebieski" });
  bluePreset.focus();
  await userEvent.keyboard("{ArrowRight}");
  const purplePreset = canvas.getByRole("radio", { name: "Fioletowy" });
  await waitFor(async () => {
    await expect(purplePreset).toHaveFocus();
  });
});

export const WithPresetColor = meta.story({
  args: {
    defaultValues: {
      brandColor: "#7C3AED"
    }
  }
});

WithPresetColor.test("Purple color preset is selected when set as default", async ({ canvas }) => {
  const purplePreset = canvas.getByRole("radio", { name: "Fioletowy" });
  await expect(purplePreset).toBeChecked();
});

WithPresetColor.test("Blue preset is not selected when purple is default", async ({ canvas }) => {
  const bluePreset = canvas.getByRole("radio", { name: "Niebieski" });
  await expect(bluePreset).not.toBeChecked();
});

WithPresetColor.test("Color hex input reflects the selected brand color", async ({ canvas }) => {
  const colorInput = canvas.getByRole("textbox", { name: /kolor przewodni/i });
  await expect(colorInput).toHaveValue("#7C3AED");
});

export const WithExistingLogo = meta.story({
  args: {
    defaultValues: {
      brandColor: "#2563EB",
      logoUrl: "https://placehold.co/64x64"
    }
  }
});

WithExistingLogo.test("Shows logo item instead of file upload dropzone", async ({ canvas }) => {
  const logoImage = canvas.getByRole("img", { name: /logo firmy/i });
  await expect(logoImage).toBeVisible();
});

WithExistingLogo.test("File upload dropzone is not visible when logo is already set", async ({ canvas }) => {
  const dropzone = canvas.queryByText(/kliknij lub przeciągnij plik/i);
  await expect(dropzone).toBeNull();
});

WithExistingLogo.test("Remove logo button is present", async ({ canvas }) => {
  const listItem = canvas.getByRole("listitem");
  const removeButton = within(listItem).getByRole("button");
  await expect(removeButton).toBeVisible();
});
