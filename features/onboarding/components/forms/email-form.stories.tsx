import { expect, fn, waitFor } from "storybook/test";
import { DEFAULT_EMAIL_SUBJECT } from "~/features/onboarding/constants";

import { EmailForm } from "./email-form";

import preview from "~/.storybook/preview";

const meta = preview.meta({
  title: "Features/Onboarding/Forms/Email Form",
  component: EmailForm,
  parameters: {
    layout: "padded"
  }
});

export const DefaultValues = meta.story({
  args: {
    onContinueAction: fn(async () => ({ success: true as const, data: null })) as never,
    onBackAction: fn()
  }
});

DefaultValues.test("Renders subject input pre-filled with default value", async ({ canvas }) => {
  const subjectInput = canvas.getByLabelText("Temat");
  await expect(subjectInput).toHaveValue(DEFAULT_EMAIL_SUBJECT);
});

DefaultValues.test("Renders all form fields and navigation buttons", async ({ canvas }) => {
  await expect(canvas.getByLabelText("Temat")).toBeVisible();
  await expect(canvas.getByLabelText("Treść wiadomości")).toBeVisible();
  await expect(canvas.getByRole("button", { name: /dalej/i })).toBeVisible();
  await expect(canvas.getByRole("button", { name: /wróć/i })).toBeVisible();
});

DefaultValues.test("Calls onBackAction when back button is clicked", async ({ canvas, args, userEvent }) => {
  const backButton = canvas.getByRole("button", { name: /wróć/i });
  await userEvent.click(backButton);
  await waitFor(async () => {
    await expect(args.onBackAction).toHaveBeenCalledOnce();
  });
});

export const Empty = meta.story({
  args: {
    defaultValues: {
      emailSubject: "",
      emailBody: ""
    },
    onContinueAction: fn(async () => ({ success: true as const, data: null })) as never,
    onBackAction: fn()
  }
});

Empty.test("Shows validation errors on empty form submission", async ({ canvas, userEvent }) => {
  const submitButton = canvas.getByRole("button", { name: /dalej/i });
  await userEvent.click(submitButton);

  await waitFor(async () => {
    await expect(canvas.getByText(/temat nie może być pusty/i)).toBeVisible();
    await expect(canvas.getByText(/treść musi mieć co najmniej 10 znaków/i)).toBeVisible();
  });
});

Empty.test("Does not call onContinueAction when form has validation errors", async ({ canvas, args, userEvent }) => {
  const submitButton = canvas.getByRole("button", { name: /dalej/i });
  await userEvent.click(submitButton);

  await waitFor(async () => {
    await expect(canvas.getByText(/temat nie może być pusty/i)).toBeVisible();
  });

  await expect(args.onContinueAction).not.toHaveBeenCalled();
});

export const FilledValid = meta.story({
  args: {
    defaultValues: {
      emailSubject: "Temat testowy",
      emailBody: "Treść wiadomości testowej długa"
    },
    onContinueAction: fn(async () => ({ success: true as const, data: null })) as never,
    onBackAction: fn()
  }
});

FilledValid.test("Renders pre-filled form values", async ({ canvas }) => {
  const subjectInput = canvas.getByLabelText("Temat");
  await expect(subjectInput).toHaveValue("Temat testowy");

  const bodyTextarea = canvas.getByLabelText("Treść wiadomości");
  await expect(bodyTextarea).toHaveValue("Treść wiadomości testowej długa");
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
        emailSubject: "Temat testowy",
        emailBody: "Treść wiadomości testowej długa"
      })
    );
  });
});
