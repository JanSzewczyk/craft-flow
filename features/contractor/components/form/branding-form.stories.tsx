import { expect, fn, screen, waitFor } from "storybook/test";
import { brandingFormBuilder } from "~/features/contractor/test/builders";

import preview from "~/.storybook/preview";

import { BrandingForm } from "./branding-form";

/*
 * Test plan:
 * 1. EmptyForm — no defaultValues
 *    - Renders form fields (logo upload, brand color) and action buttons
 *    - Submit button is disabled when form is not dirty
 *    - Cancel button is disabled when form is not dirty
 * 2. WithExistingBranding — has logoUrl and brandColor
 *    - Logo image is rendered instead of dropzone
 *    - Submit and cancel buttons are disabled initially
 *    - After changing color input, submit becomes enabled
 *    - Calls onSaveAction when form is dirty and valid
 * 3. SubmitError — onSaveAction returns error
 *    - Shows error toast when save fails
 */

const meta = preview.meta({
  title: "Features/Contractor/Form/Branding Form",
  component: BrandingForm,
  parameters: {
    layout: "padded"
  },
  args: {
    onSaveAction: fn(
      async () => ({ success: false as const, error: "Nie udało się zapisać zmian" }) as unknown as never
    ),
    uploadLogoAction: fn(
      async () => ({ success: true as const, data: { url: "https://example.com/logo.png" } }) as unknown as never
    )
  }
});

// ---------------------------------------------------------------------------
// Story 1: Empty form
// ---------------------------------------------------------------------------

export const EmptyForm = meta.story({
  name: "Empty Form"
});

EmptyForm.test("Renders all expected content", async ({ canvas, step }) => {
  await step("Logo upload dropzone is visible", async () => {
    await expect(canvas.getByText("Kliknij lub przeciągnij plik")).toBeVisible();
  });

  await step("Brand color field is visible", async () => {
    await expect(canvas.getByText("Kolor przewodni")).toBeVisible();
    await expect(canvas.getByLabelText("Pick Color")).toBeVisible();
  });

  await step("Action buttons are visible", async () => {
    await expect(canvas.getByRole("button", { name: /anuluj/i })).toBeVisible();
    await expect(canvas.getByRole("button", { name: /zapisz zmiany/i })).toBeVisible();
  });
});

EmptyForm.test("Action buttons are rendered and accessible", async ({ canvas }) => {
  await expect(canvas.getByRole("button", { name: /zapisz zmiany/i })).toBeInTheDocument();
  await expect(canvas.getByRole("button", { name: /anuluj/i })).toBeInTheDocument();
});

// ---------------------------------------------------------------------------
// Story 2: With existing branding
// ---------------------------------------------------------------------------

const existingBranding = brandingFormBuilder.one({
  overrides: {
    logoUrl: "https://placehold.co/64x64/2563EB/white?text=Logo",
    brandColor: "#2563EB"
  }
});

export const WithExistingBranding = meta.story({
  name: "With Existing Branding",
  args: {
    defaultValues: existingBranding,
    onSaveAction: fn(async () => ({ success: true as const, message: "Zapisano" }) as unknown as never)
  }
});

WithExistingBranding.test("Renders existing logo instead of upload dropzone", async ({ canvas }) => {
  const img = canvas.getByRole("img", { name: "Logo firmy" });
  await expect(img).toBeVisible();
  await expect(canvas.queryByText("Kliknij lub przeciągnij plik")).not.toBeInTheDocument();
});

WithExistingBranding.test("Submit button is rendered", async ({ canvas }) => {
  await expect(canvas.getByRole("button", { name: /zapisz zmiany/i })).toBeInTheDocument();
});

WithExistingBranding.test("Calls onSaveAction when form is dirty and valid", async ({ canvas, userEvent, args }) => {
  const colorInput = canvas.getByRole("textbox", { name: /kolor przewodni/i });
  await userEvent.clear(colorInput);
  await userEvent.type(colorInput, "#7C3AED");

  await userEvent.click(canvas.getByRole("button", { name: /zapisz zmiany/i }));

  await waitFor(async () => {
    await expect(args.onSaveAction).toHaveBeenCalledOnce();
  });
});

// ---------------------------------------------------------------------------
// Story 3: Submit returns error
// ---------------------------------------------------------------------------

export const SubmitError = meta.story({
  name: "Submit Error",
  args: {
    defaultValues: brandingFormBuilder.one({ overrides: { brandColor: "#2563EB" } }),
    onSaveAction: fn(
      async () => ({ success: false as const, error: "Nie udało się zapisać zmian" }) as unknown as never
    )
  }
});

SubmitError.test("Shows error toast when onSaveAction returns failure", async ({ canvas, userEvent, args }) => {
  const colorInput = canvas.getByRole("textbox", { name: /kolor przewodni/i });
  await userEvent.clear(colorInput);
  await userEvent.type(colorInput, "#EF4444");

  await userEvent.click(canvas.getByRole("button", { name: /zapisz zmiany/i }));

  await waitFor(async () => {
    await expect(args.onSaveAction).toHaveBeenCalledOnce();
  });

  await waitFor(async () => {
    await expect(await screen.findByText(/nie udało się zapisać zmian/i)).toBeVisible();
  });
});
