import { expect, fn, screen, waitFor } from "storybook/test";
import { companyDetailsFormBuilder } from "~/features/contractor/test/builders";

import { CompanyProfileForm } from "./company-profile-form";

import preview from "~/.storybook/preview";

/*
 * Test plan:
 * 1. EmptyForm — no defaultValues
 *    - Renders form fields and action buttons
 *    - Submit button is disabled (form not dirty)
 *    - Shows validation errors on empty submit after dirtying form
 *    - Does not call onSaveAction when form is invalid
 * 2. PreFilled — pre-populated with valid data
 *    - Fields show pre-filled values
 *    - Submit button is disabled until a field is changed
 *    - After changing a field, submit button becomes enabled
 *    - Calls onSaveAction when form is dirty and valid
 * 3. SubmitError — onSaveAction returns error
 *    - Shows error toast when action returns failure
 */

const meta = preview.meta({
  title: "Features/Contractor/Form/Company Profile Form",
  component: CompanyProfileForm,
  parameters: {
    layout: "padded"
  },
  args: {
    onSaveAction: fn(
      async () => ({ success: false as const, error: "Nie udało się zapisać zmian" }) as unknown as never
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
  await step("Form fields are visible", async () => {
    await expect(canvas.getByLabelText("Nazwa firmy")).toBeVisible();
    await expect(canvas.getByLabelText("Publiczny e-mail")).toBeVisible();
  });

  await step("Cancel button is visible", async () => {
    await expect(canvas.getByRole("button", { name: /anuluj/i })).toBeVisible();
  });

  await step("Submit button is visible", async () => {
    await expect(canvas.getByRole("button", { name: /zapisz zmiany/i })).toBeVisible();
  });
});

EmptyForm.test("Submit button is disabled when form is not dirty", async ({ canvas }) => {
  await expect(canvas.getByRole("button", { name: /zapisz zmiany/i })).toBeDisabled();
});

EmptyForm.test("Shows validation errors after dirtying form and submitting", async ({ canvas, userEvent }) => {
  await userEvent.type(canvas.getByLabelText("Nazwa firmy"), "A");
  await userEvent.clear(canvas.getByLabelText("Nazwa firmy"));

  // Type a single char to dirty the form and enable submit
  await userEvent.type(canvas.getByLabelText("Publiczny e-mail"), "x");

  await userEvent.click(canvas.getByRole("button", { name: /zapisz zmiany/i }));

  await waitFor(async () => {
    await expect(canvas.getByText(/nazwa firmy musi mieć co najmniej 2 znaki/i)).toBeVisible();
  });
});

EmptyForm.test("Does not call onSaveAction when form has validation errors", async ({ canvas, userEvent, args }) => {
  await userEvent.type(canvas.getByLabelText("Publiczny e-mail"), "x");
  await userEvent.click(canvas.getByRole("button", { name: /zapisz zmiany/i }));

  await waitFor(async () => {
    await expect(canvas.getByText(/nazwa firmy musi mieć co najmniej 2 znaki/i)).toBeVisible();
  });

  await expect(args.onSaveAction).not.toHaveBeenCalled();
});

// ---------------------------------------------------------------------------
// Story 2: Pre-filled with valid data
// ---------------------------------------------------------------------------

const preFilledData = companyDetailsFormBuilder.one({
  overrides: {
    companyName: "Stolarnia u Jana",
    email: "kontakt@stolarnia.pl"
  }
});

export const PreFilled = meta.story({
  name: "Pre Filled",
  args: {
    defaultValues: preFilledData
  }
});

PreFilled.test("Renders pre-filled form values", async ({ canvas, args, step }) => {
  await step("Company name is pre-filled", async () => {
    await expect(canvas.getByLabelText("Nazwa firmy")).toHaveValue(args.defaultValues!.companyName as string);
  });

  await step("Email is pre-filled", async () => {
    await expect(canvas.getByLabelText("Publiczny e-mail")).toHaveValue(args.defaultValues!.email as string);
  });
});

PreFilled.test("Submit button is disabled until a field is changed", async ({ canvas, userEvent }) => {
  const submitButton = canvas.getByRole("button", { name: /zapisz zmiany/i });
  await expect(submitButton).toBeDisabled();

  await userEvent.type(canvas.getByLabelText("Nazwa firmy"), " S.A.");
  await expect(submitButton).not.toBeDisabled();
});

PreFilled.test("Calls onSaveAction with form data when valid and dirty", async ({ canvas, userEvent, args }) => {
  await userEvent.type(canvas.getByLabelText("Nazwa firmy"), " Updated");
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
    defaultValues: companyDetailsFormBuilder.one(),
    onSaveAction: fn(
      async () => ({ success: false as const, error: "Nie udało się zapisać zmian" }) as unknown as never
    )
  }
});

SubmitError.test("Shows error toast when onSaveAction returns failure", async ({ canvas, userEvent, args }) => {
  await userEvent.type(canvas.getByLabelText("Nazwa firmy"), " zmiana");
  await userEvent.click(canvas.getByRole("button", { name: /zapisz zmiany/i }));

  await waitFor(async () => {
    await expect(args.onSaveAction).toHaveBeenCalledOnce();
  });

  await waitFor(async () => {
    await expect(await screen.findByText(/nie udało się zapisać zmian/i)).toBeVisible();
  });
});
