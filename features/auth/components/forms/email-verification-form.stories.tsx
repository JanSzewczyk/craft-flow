import * as React from "react";

import { Toaster } from "@szum-tech/design-system";
import { expect, fn, screen, waitFor } from "storybook/test";

import preview from "~/.storybook/preview";

import { EmailVerificationForm } from "./email-verification-form";

const meta = preview.meta({
  title: "Auth/Forms/Email Verification Form",
  component: EmailVerificationForm,
  decorators: [
    (Story) => (
      <>
        <Story />
        <Toaster />
      </>
    )
  ],
  parameters: {
    layout: "padded"
  }
});

export const Default = meta.story({
  args: {
    onVerify: fn(async () => ({})),
    onResend: fn(async () => ({}))
  }
});

Default.test("Renders code field and validates empty submission", async ({ canvas, args, step, userEvent }) => {
  await step("Renders form fields", async () => {
    await expect(canvas.getByLabelText("Kod weryfikacyjny")).toBeVisible();
    await expect(canvas.getByRole("button", { name: /zweryfikuj e-mail/i })).toBeVisible();
    await expect(canvas.getByRole("button", { name: /wyślij ponownie/i })).toBeVisible();
  });

  await step("Shows validation error on empty submission", async () => {
    await userEvent.click(canvas.getByRole("button", { name: /zweryfikuj e-mail/i }));
    await waitFor(async () => {
      await expect(canvas.getByText(/kod musi mieć dokładnie 6 cyfr/i)).toBeVisible();
    });
  });

  await step("Fills in valid code and submits", async () => {
    await userEvent.type(canvas.getByLabelText("Kod weryfikacyjny"), "123456");
    await userEvent.click(canvas.getByRole("button", { name: /zweryfikuj e-mail/i }));
    await waitFor(async () => {
      await expect(args.onVerify).toHaveBeenCalledOnce();
    });
  });
});

export const InvalidCode = meta.story({
  args: {
    onVerify: fn(async () => ({ error: "Nieprawidłowy lub wygasły kod weryfikacyjny." })),
    onResend: fn(async () => ({}))
  }
});

InvalidCode.test("Shows error toast on invalid code", async ({ canvas, args, step, userEvent }) => {
  await step("Fill and submit form", async () => {
    await userEvent.type(canvas.getByLabelText("Kod weryfikacyjny"), "000000");
    await userEvent.click(canvas.getByRole("button", { name: /zweryfikuj e-mail/i }));
    await waitFor(async () => {
      await expect(args.onVerify).toHaveBeenCalledOnce();
    });
  });

  await step("Error toast is displayed", async () => {
    await waitFor(async () => {
      const toastTitle = await screen.findByText("Błąd weryfikacji");
      await expect(toastTitle).toBeVisible();
    });
  });
});

export const ResendSuccess = meta.story({
  args: {
    onVerify: fn(async () => ({})),
    onResend: fn(async () => ({}))
  }
});

ResendSuccess.test("Shows success toast on resend", async ({ canvas, args, step, userEvent }) => {
  await step("Click resend button", async () => {
    await userEvent.click(canvas.getByRole("button", { name: /wyślij ponownie/i }));
    await waitFor(async () => {
      await expect(args.onResend).toHaveBeenCalledOnce();
    });
  });

  await step("Success toast is displayed", async () => {
    await waitFor(async () => {
      const toastTitle = await screen.findByText("Kod wysłany ponownie");
      await expect(toastTitle).toBeVisible();
    });
  });
});
