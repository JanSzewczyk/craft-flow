import * as React from "react";

import { Toaster } from "@szum-tech/design-system";
import { expect, fn, screen, waitFor } from "storybook/test";

import preview from "~/.storybook/preview";

import { ForgotPasswordForm } from "./forgot-password-form";

const meta = preview.meta({
  title: "Auth/Forms/Forgot Password Form",
  component: ForgotPasswordForm,
  decorators: [
    (Story) => (
      <>
        <Story />
        <Toaster />
      </>
    )
  ],
  parameters: {
    layout: "padded",
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: "/forgot-password"
      }
    }
  }
});

export const Default = meta.story({
  args: {
    onSubmit: fn(async () => ({}))
  }
});

Default.test("Renders email field and validates empty submission", async ({ canvas, args, step, userEvent }) => {
  await step("Renders form fields", async () => {
    await expect(canvas.getByLabelText("Adres e-mail")).toBeVisible();
    await expect(canvas.getByRole("button", { name: /wyślij kod resetowania/i })).toBeVisible();
  });

  await step("Shows validation error on empty submission", async () => {
    await userEvent.click(canvas.getByRole("button", { name: /wyślij kod resetowania/i }));
    await waitFor(async () => {
      await expect(canvas.getByText(/podaj prawidłowy adres e-mail/i)).toBeVisible();
    });
  });

  await step("Fills in valid email and submits", async () => {
    await userEvent.type(canvas.getByLabelText("Adres e-mail"), "test@example.com");
    await userEvent.click(canvas.getByRole("button", { name: /wyślij kod resetowania/i }));
    await waitFor(async () => {
      await expect(args.onSubmit).toHaveBeenCalledOnce();
    });
  });
});

export const SubmitError = meta.story({
  args: {
    onSubmit: fn(async () => ({ error: "Nie znaleziono konta z tym adresem e-mail." }))
  }
});

SubmitError.test("Shows error toast on failure", async ({ canvas, args, step, userEvent }) => {
  await step("Fill and submit form", async () => {
    await userEvent.type(canvas.getByLabelText("Adres e-mail"), "unknown@example.com");
    await userEvent.click(canvas.getByRole("button", { name: /wyślij kod resetowania/i }));
    await waitFor(async () => {
      await expect(args.onSubmit).toHaveBeenCalledOnce();
    });
  });

  await step("Error toast is displayed", async () => {
    await waitFor(async () => {
      const toastTitle = await screen.findByText("Błąd");
      await expect(toastTitle).toBeVisible();
      const toastDesc = await screen.findByText("Nie znaleziono konta z tym adresem e-mail.");
      await expect(toastDesc).toBeVisible();
    });
  });
});
