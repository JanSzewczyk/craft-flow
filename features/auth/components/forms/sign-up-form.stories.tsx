import * as React from "react";

import { Toaster } from "@szum-tech/design-system";
import { expect, fn, screen, waitFor } from "storybook/test";

import preview from "~/.storybook/preview";

import { SignUpForm } from "./sign-up-form";

const meta = preview.meta({
  title: "Auth/Forms/Sign Up Form",
  component: SignUpForm,
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
        pathname: "/sign-up"
      }
    }
  }
});

export const Default = meta.story({
  args: {
    onEmailSignUp: fn(async () => ({})),
    onGoogleSignUp: fn()
  }
});

Default.test("Renders all fields and validates empty submission", async ({ canvas, args, step, userEvent }) => {
  await step("Renders all form fields", async () => {
    await expect(canvas.getByLabelText("Adres e-mail")).toBeVisible();
    await expect(canvas.getByLabelText("Hasło")).toBeVisible();
    await expect(canvas.getByLabelText("Potwierdź hasło")).toBeVisible();
    await expect(canvas.getByRole("button", { name: /utwórz konto/i })).toBeVisible();
  });

  await step("Shows validation errors on empty submission", async () => {
    await userEvent.click(canvas.getByRole("button", { name: /utwórz konto/i }));
    await waitFor(async () => {
      await expect(canvas.getByText(/podaj prawidłowy adres e-mail/i)).toBeVisible();
      await expect(canvas.getByText(/hasło musi mieć co najmniej 8 znaków/i)).toBeVisible();
    });
  });

  await step("Shows password mismatch error", async () => {
    await userEvent.type(canvas.getByLabelText("Adres e-mail"), "test@example.com");
    await userEvent.type(canvas.getByLabelText("Hasło"), "password123");
    await userEvent.type(canvas.getByLabelText("Potwierdź hasło"), "different");
    await userEvent.click(canvas.getByRole("button", { name: /utwórz konto/i }));
    await waitFor(async () => {
      await expect(canvas.getByText(/hasła nie są zgodne/i)).toBeVisible();
    });
  });
});

export const RegistrationError = meta.story({
  args: {
    onEmailSignUp: fn(async () => ({ error: "Ten adres e-mail jest już zarejestrowany." })),
    onGoogleSignUp: fn()
  }
});

RegistrationError.test("Shows error toast on registration failure", async ({ canvas, args, step, userEvent }) => {
  await step("Fill and submit form", async () => {
    await userEvent.type(canvas.getByLabelText("Adres e-mail"), "existing@example.com");
    await userEvent.type(canvas.getByLabelText("Hasło"), "password123");
    await userEvent.type(canvas.getByLabelText("Potwierdź hasło"), "password123");
    await userEvent.click(canvas.getByRole("button", { name: /utwórz konto/i }));
    await waitFor(async () => {
      await expect(args.onEmailSignUp).toHaveBeenCalledOnce();
    });
  });

  await step("Error toast is displayed", async () => {
    await waitFor(async () => {
      const toastTitle = await screen.findByText("Błąd rejestracji");
      await expect(toastTitle).toBeVisible();
      const toastDesc = await screen.findByText("Ten adres e-mail jest już zarejestrowany.");
      await expect(toastDesc).toBeVisible();
    });
  });
});
