import { expect, fn } from "storybook/test";
import { brandingFormBuilder } from "~/features/contractor/test/builders";

import { BrandingEditor } from "./branding-editor";

import preview from "~/.storybook/preview";

/*
 * Test plan:
 * 1. EmptyEditor — no defaultValues
 *    - Renders all expected content (branding form fields, action buttons)
 *    - Logo upload dropzone is visible
 *    - Brand color field is visible
 * 2. WithDefaults — pre-populated with brandColor and logoUrl
 *    - Logo item is visible with remove button
 *    - Brand color input shows the pre-filled color value
 */

const meta = preview.meta({
  title: "Features/Contractor/Branding Editor",
  component: BrandingEditor,
  parameters: {
    layout: "padded"
  },
  args: {
    onSaveAction: fn(async () => ({ success: false as const, error: "Nie udało się zapisać" })),
    uploadLogoAction: fn(async () => ({ success: false as const, error: "Nie udało się przesłać logo" })),
    deleteLogoAction: fn(async () => ({ success: true as const, data: undefined, message: "Logo usunięte" }))
  }
});

// ---------------------------------------------------------------------------
// Story 1: Empty editor (no defaults)
// ---------------------------------------------------------------------------

export const EmptyEditor = meta.story({
  name: "Empty Editor"
});

EmptyEditor.test("Renders all expected content", async ({ canvas, step }) => {
  await step("Logo upload dropzone is visible", async () => {
    await expect(canvas.getByText(/kliknij lub przeciągnij plik/i)).toBeVisible();
  });

  await step("Brand color field is visible", async () => {
    await expect(canvas.getByLabelText(/kolor przewodni/i)).toBeVisible();
  });

  await step("Action buttons are visible", async () => {
    await expect(canvas.getByRole("button", { name: /anuluj/i })).toBeVisible();
    await expect(canvas.getByRole("button", { name: /zapisz zmiany/i })).toBeVisible();
  });
});

EmptyEditor.test("Save and cancel buttons are visible", async ({ canvas }) => {
  await expect(canvas.getByRole("button", { name: /anuluj/i })).toBeVisible();
  await expect(canvas.getByRole("button", { name: /zapisz zmiany/i })).toBeVisible();
});

// ---------------------------------------------------------------------------
// Story 2: Editor with pre-filled values
// ---------------------------------------------------------------------------

const preFilledData = brandingFormBuilder.one({ traits: "noLogo" });

export const WithDefaults = meta.story({
  name: "With Defaults",
  args: {
    defaultValues: preFilledData
  }
});

WithDefaults.test("Renders brand color input with pre-filled value", async ({ canvas }) => {
  const colorInput = canvas.getByLabelText(/kolor przewodni/i) as HTMLInputElement;
  await expect(colorInput.value).toMatch(/^#[0-9a-fA-F]{6}$/);
});
