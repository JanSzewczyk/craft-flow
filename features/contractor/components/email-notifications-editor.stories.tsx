import { expect, fn } from "storybook/test";
import { emailFormBuilder } from "~/features/contractor/test/builders";

import { EmailNotificationsEditor } from "./email-notifications-editor";

import preview from "~/.storybook/preview";

/*
 * Test plan:
 * 1. EmptyEditor — no defaultValues
 *    - Renders "Powitanie" tab (the only enabled tab)
 *    - Email form fields (subject, body) are visible
 *    - Variables reference card is visible with all available variables
 * 2. WithDefaults — pre-populated email subject and body
 *    - Subject input shows pre-filled value
 *    - Body textarea shows pre-filled value
 */

const meta = preview.meta({
  title: "Features/Contractor/Email Notifications Editor",
  component: EmailNotificationsEditor,
  parameters: {
    layout: "padded"
  },
  args: {
    onSaveAction: fn(async () => ({
      success: false as const,
      error: "Nie udało się zapisać szablonu"
    }))
  }
});

// ---------------------------------------------------------------------------
// Story 1: Empty editor (no defaults)
// ---------------------------------------------------------------------------

export const EmptyEditor = meta.story({
  name: "Empty Editor"
});

EmptyEditor.test("Renders all expected content", async ({ canvas, step }) => {
  await step("Powitanie tab is visible and active", async () => {
    await expect(canvas.getByRole("tab", { name: /powitanie/i })).toBeVisible();
  });

  await step("Email form fields are visible", async () => {
    await expect(canvas.getByLabelText(/temat/i)).toBeVisible();
    await expect(canvas.getByLabelText(/treść wiadomości/i)).toBeVisible();
  });

  await step("Variables reference card is visible", async () => {
    await expect(canvas.getByText("Dostępne zmienne")).toBeVisible();
    await expect(canvas.getByText("Imię i nazwisko klienta")).toBeVisible();
    await expect(canvas.getByText("Nazwa projektu")).toBeVisible();
  });
});

// ---------------------------------------------------------------------------
// Story 2: Editor with pre-filled values
// ---------------------------------------------------------------------------

const preFilledData = emailFormBuilder.one({
  overrides: {
    emailSubject: "Witaj w naszym projekcie!",
    emailBody: "Dziękujemy za zaufanie. Chętnie odpowiemy na wszelkie pytania."
  }
});

export const WithDefaults = meta.story({
  name: "With Defaults",
  args: {
    defaultValues: preFilledData
  }
});

WithDefaults.test("Displays pre-filled values in form fields", async ({ canvas, step }) => {
  await step("Subject is pre-filled", async () => {
    await expect(canvas.getByLabelText(/temat/i)).toHaveValue("Witaj w naszym projekcie!");
  });

  await step("Body is pre-filled", async () => {
    await expect(canvas.getByLabelText(/treść wiadomości/i)).toHaveValue(
      "Dziękujemy za zaufanie. Chętnie odpowiemy na wszelkie pytania."
    );
  });
});
