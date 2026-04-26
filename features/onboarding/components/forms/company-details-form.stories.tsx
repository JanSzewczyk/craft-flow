import { expect, fn, waitFor } from "storybook/test";
import { companyDetailsFormBuilder } from "~/features/contractor/test/builders";
import { type RedirectAction } from "~/lib/action-types";

import { CompanyDetailsForm } from "./company-details-form";

import preview from "~/.storybook/preview";

const meta = preview.meta({
  title: "Features/Onboarding/Forms/Company Details Form",
  component: CompanyDetailsForm,
  args: {
    onContinueAction: fn(async () => ({ success: true as const, data: null }) as unknown as RedirectAction)
  },
  parameters: {
    layout: "padded"
  }
});

export const Empty = meta.story({});

Empty.test("Renders all form fields and submit button", async ({ canvas }) => {
  await expect(canvas.getByLabelText("Nazwa firmy")).toBeVisible();
  await expect(canvas.getByText("Branża")).toBeVisible();
  await expect(canvas.getByRole("button", { name: /dalej/i })).toBeVisible();
});

Empty.test("Shows validation errors on empty form submission", async ({ canvas, userEvent }) => {
  const submitButton = canvas.getByRole("button", { name: /dalej/i });
  await userEvent.click(submitButton);

  await waitFor(async () => {
    await expect(canvas.getByText(/nazwa firmy musi mieć co najmniej 2 znaki/i)).toBeVisible();
    await expect(canvas.getByText(/wybierz branżę/i)).toBeVisible();
  });
});

Empty.test("Does not call onContinueAction when form has validation errors", async ({ canvas, args, userEvent }) => {
  const submitButton = canvas.getByRole("button", { name: /dalej/i });
  await userEvent.click(submitButton);

  await waitFor(async () => {
    await expect(canvas.getByText(/nazwa firmy musi mieć co najmniej 2 znaki/i)).toBeVisible();
  });

  await expect(args.onContinueAction).not.toHaveBeenCalled();
});

export const FilledValid = meta.story({
  args: {
    defaultValues: companyDetailsFormBuilder.one({
      overrides: {
        companyName: "Stolarnia u Jana",
        industry: "stolarstwo"
      }
    })
  }
});

FilledValid.test("Renders pre-filled form values", async ({ canvas, args }) => {
  const companyNameInput = canvas.getByLabelText("Nazwa firmy");
  await expect(companyNameInput).toHaveValue(args.defaultValues!.companyName as string);
});

FilledValid.test("Calls onContinueAction on valid form submission", async ({ canvas, args, userEvent }) => {
  const submitButton = canvas.getByRole("button", { name: /dalej/i });
  await userEvent.click(submitButton);

  await waitFor(async () => {
    await expect(args.onContinueAction).toHaveBeenCalledOnce();
  });
});

FilledValid.test("Calls onContinueAction with correct form data", async ({ canvas, args, userEvent }) => {
  const submitButton = canvas.getByRole("button", { name: /dalej/i });
  await userEvent.click(submitButton);

  await waitFor(async () => {
    await expect(args.onContinueAction).toHaveBeenCalledWith(
      expect.objectContaining({
        companyName: args.defaultValues!.companyName,
        industry: args.defaultValues!.industry
      })
    );
  });
});
