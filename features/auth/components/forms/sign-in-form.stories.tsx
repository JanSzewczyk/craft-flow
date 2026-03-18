import { expect, fn, screen, waitFor } from "storybook/test";

import { SignInForm } from "./sign-in-form";

import preview from "~/.storybook/preview";

const meta = preview.meta({
  title: "Auth/Forms/Sign In Form",
  component: SignInForm,
  parameters: {
    layout: "padded",
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: "/sign-in"
      }
    }
  }
});

export const EmptyForm = meta.story({
  args: {
    onEmailSignIn: fn(async () => ({})),
    onGoogleSignIn: fn()
  }
});

EmptyForm.test("Renders all fields and validates empty submission", async ({ canvas, args, step, userEvent }) => {
  await step("Renders all form fields", async () => {
    await expect(canvas.getByLabelText("Adres e-mail")).toBeVisible();
    await expect(canvas.getByLabelText("Hasło")).toBeVisible();
    await expect(canvas.getByRole("button", { name: /zaloguj się/i })).toBeVisible();
    await expect(canvas.getByRole("button", { name: /kontynuuj przez google/i })).toBeVisible();
  });

  await step("Shows validation errors on empty submission", async () => {
    await userEvent.click(canvas.getByRole("button", { name: /zaloguj się/i }));
    await waitFor(async () => {
      await expect(canvas.getByText(/podaj prawidłowy adres e-mail/i)).toBeVisible();
      await expect(canvas.getByText(/hasło jest wymagane/i)).toBeVisible();
    });
  });

  await step("onEmailSignIn is not called when form has validation errors", async () => {
    await expect(args.onEmailSignIn).not.toHaveBeenCalled();
  });

  await step("Fills in valid data and submits", async () => {
    await userEvent.type(canvas.getByLabelText("Adres e-mail"), "test@example.com");
    await userEvent.type(canvas.getByLabelText("Hasło"), "password123");
    await userEvent.click(canvas.getByRole("button", { name: /zaloguj się/i }));
    await waitFor(async () => {
      await expect(args.onEmailSignIn).toHaveBeenCalledOnce();
    });
  });
});

export const InvalidCredentials = meta.story({
  args: {
    onEmailSignIn: fn(async () => ({ error: "Nieprawidłowy e-mail lub hasło." })),
    onGoogleSignIn: fn()
  }
});

InvalidCredentials.test("Shows error toast on invalid credentials", async ({ canvas, args, step, userEvent }) => {
  await step("Fill and submit form", async () => {
    await userEvent.type(canvas.getByLabelText("Adres e-mail"), "test@example.com");
    await userEvent.type(canvas.getByLabelText("Hasło"), "wrongpassword");
    await userEvent.click(canvas.getByRole("button", { name: /zaloguj się/i }));
    await waitFor(async () => {
      await expect(args.onEmailSignIn).toHaveBeenCalledOnce();
    });
  });

  await step("Error toast is displayed", async () => {
    await waitFor(async () => {
      const toastTitle = await screen.findByText("Błąd logowania");
      await expect(toastTitle).toBeVisible();
      const toastDesc = await screen.findByText("Nieprawidłowy e-mail lub hasło.");
      await expect(toastDesc).toBeVisible();
    });
  });
});
