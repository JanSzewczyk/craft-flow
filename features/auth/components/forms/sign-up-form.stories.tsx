import { expect, fn, screen, waitFor } from "storybook/test";

import { SignUpForm } from "./sign-up-form";

import preview from "~/.storybook/preview";

const meta = preview.meta({
  title: "Auth/Forms/Sign Up Form",
  component: SignUpForm,
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

export const EmptyForm = meta.story({
  args: {
    onEmailSignUp: fn(async () => ({})),
    onGoogleSignUp: fn()
  }
});

EmptyForm.test("Renders all expected content", async ({ canvas }) => {
  await expect(canvas.getByLabelText("Imię")).toBeVisible();
  await expect(canvas.getByLabelText("Nazwisko")).toBeVisible();
  await expect(canvas.getByLabelText("E-mail firmowy")).toBeVisible();
  await expect(canvas.getByLabelText("Hasło")).toBeVisible();
  await expect(canvas.getByLabelText("Potwierdź hasło")).toBeVisible();
  await expect(canvas.getByRole("button", { name: /zacznij darmowy trial/i })).toBeVisible();
  await expect(canvas.getByText(/zarejestruj się przez google/i)).toBeVisible();
});

EmptyForm.test("Shows validation errors on empty submission", async ({ canvas, step, userEvent }) => {
  await step("Clicks submit without filling form", async () => {
    await userEvent.click(canvas.getByRole("button", { name: /zacznij darmowy trial/i }));
  });

  await step("Validation errors are displayed for all fields", async () => {
    await waitFor(async () => {
      await expect(canvas.getByText(/imię jest wymagane/i)).toBeVisible();
      await expect(canvas.getByText(/nazwisko jest wymagane/i)).toBeVisible();
      await expect(canvas.getByText(/podaj prawidłowy adres e-mail/i)).toBeVisible();
      await expect(canvas.getByText(/hasło musi mieć co najmniej 8 znaków/i)).toBeVisible();
      await expect(canvas.getByText(/potwierdzenie hasła jest wymagane/i)).toBeVisible();
    });
  });
});

EmptyForm.test("Does not call onEmailSignUp when form has validation errors", async ({ canvas, args, userEvent }) => {
  await userEvent.click(canvas.getByRole("button", { name: /zacznij darmowy trial/i }));
  await expect(args.onEmailSignUp).not.toHaveBeenCalled();
});

EmptyForm.test("Shows mismatch error when passwords do not match", async ({ canvas, args, step, userEvent }) => {
  await step("Fill form with mismatched passwords", async () => {
    await userEvent.type(canvas.getByLabelText("Imię"), "Jan");
    await userEvent.type(canvas.getByLabelText("Nazwisko"), "Kowalski");
    await userEvent.type(canvas.getByLabelText("E-mail firmowy"), "jan@firma.pl");
    await userEvent.type(canvas.getByLabelText("Hasło"), "password123");
    await userEvent.type(canvas.getByLabelText("Potwierdź hasło"), "different456");
    await userEvent.click(canvas.getByRole("button", { name: /zacznij darmowy trial/i }));
  });

  await step("Shows password mismatch validation error", async () => {
    await waitFor(async () => {
      await expect(canvas.getByText(/hasła nie są zgodne/i)).toBeVisible();
    });
    await expect(args.onEmailSignUp).not.toHaveBeenCalled();
  });
});

EmptyForm.test("Submits form with valid data and calls onEmailSignUp", async ({ canvas, args, step, userEvent }) => {
  await step("Fills in all fields with valid data", async () => {
    await userEvent.type(canvas.getByLabelText("Imię"), "Jan");
    await userEvent.type(canvas.getByLabelText("Nazwisko"), "Kowalski");
    await userEvent.type(canvas.getByLabelText("E-mail firmowy"), "jan.kowalski@firma.pl");
    await userEvent.type(canvas.getByLabelText("Hasło"), "password123");
    await userEvent.type(canvas.getByLabelText("Potwierdź hasło"), "password123");
  });

  await step("Submits the form", async () => {
    await userEvent.click(canvas.getByRole("button", { name: /zacznij darmowy trial/i }));
    await waitFor(async () => {
      await expect(args.onEmailSignUp).toHaveBeenCalledOnce();
    });
  });
});

EmptyForm.test("Calls onGoogleSignUp when Google button is clicked", async ({ canvas, args, userEvent }) => {
  await userEvent.click(canvas.getByText(/zarejestruj się przez google/i));
  await expect(args.onGoogleSignUp).toHaveBeenCalledOnce();
});

export const RegistrationError = meta.story({
  args: {
    onEmailSignUp: fn(async () => ({ error: "Ten adres e-mail jest już zarejestrowany." })),
    onGoogleSignUp: fn()
  }
});

RegistrationError.test("Shows error toast on registration failure", async ({ canvas, args, step, userEvent }) => {
  await step("Fill and submit form", async () => {
    await userEvent.type(canvas.getByLabelText("Imię"), "Jan");
    await userEvent.type(canvas.getByLabelText("Nazwisko"), "Kowalski");
    await userEvent.type(canvas.getByLabelText("E-mail firmowy"), "existing@example.com");
    await userEvent.type(canvas.getByLabelText("Hasło"), "password123");
    await userEvent.type(canvas.getByLabelText("Potwierdź hasło"), "password123");
    await userEvent.click(canvas.getByRole("button", { name: /zacznij darmowy trial/i }));
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
