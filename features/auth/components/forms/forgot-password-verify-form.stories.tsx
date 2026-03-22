import { expect, fn, screen, waitFor } from "storybook/test";

import { ForgotPasswordVerifyForm } from "./forgot-password-verify-form";

import preview from "~/.storybook/preview";

const meta = preview.meta({
  title: "Auth/Forms/Forgot Password Verify Form",
  component: ForgotPasswordVerifyForm,
  parameters: {
    layout: "padded"
  }
});

export const EmptyForm = meta.story({
  args: {
    onSubmit: fn(async () => ({}))
  }
});

EmptyForm.test("Renders all fields and validates empty submission", async ({ canvas, args, step, userEvent }) => {
  await step("Renders all form fields", async () => {
    await expect(canvas.getByLabelText("Kod weryfikacyjny")).toBeVisible();
    await expect(canvas.getByLabelText("Nowe hasło")).toBeVisible();
    await expect(canvas.getByLabelText("Potwierdź nowe hasło")).toBeVisible();
    await expect(canvas.getByRole("button", { name: /resetuj hasło/i })).toBeVisible();
  });

  await step("Shows validation errors on empty submission", async () => {
    await userEvent.click(canvas.getByRole("button", { name: /resetuj hasło/i }));
    await waitFor(async () => {
      await expect(canvas.getByText(/kod musi mieć dokładnie 6 cyfr/i)).toBeVisible();
      await expect(canvas.getByText(/hasło musi mieć co najmniej 8 znaków/i)).toBeVisible();
    });
  });

  await step("Fills valid data and submits", async () => {
    await userEvent.type(canvas.getByLabelText("Kod weryfikacyjny"), "123456");
    await userEvent.type(canvas.getByLabelText("Nowe hasło"), "newpassword123");
    await userEvent.type(canvas.getByLabelText("Potwierdź nowe hasło"), "newpassword123");
    await userEvent.click(canvas.getByRole("button", { name: /resetuj hasło/i }));
    await waitFor(async () => {
      await expect(args.onSubmit).toHaveBeenCalledOnce();
    });
  });
});

export const InvalidCode = meta.story({
  args: {
    onSubmit: fn(async () => ({ error: "Nieprawidłowy lub wygasły kod." }))
  }
});

InvalidCode.test("Shows error toast on invalid code", async ({ canvas, args, step, userEvent }) => {
  await step("Fill and submit form", async () => {
    await userEvent.type(canvas.getByLabelText("Kod weryfikacyjny"), "000000");
    await userEvent.type(canvas.getByLabelText("Nowe hasło"), "newpassword123");
    await userEvent.type(canvas.getByLabelText("Potwierdź nowe hasło"), "newpassword123");
    await userEvent.click(canvas.getByRole("button", { name: /resetuj hasło/i }));
    await waitFor(async () => {
      await expect(args.onSubmit).toHaveBeenCalledOnce();
    });
  });

  await step("Error toast is displayed", async () => {
    await waitFor(async () => {
      const toastTitle = await screen.findByText("Błąd resetowania hasła");
      await expect(toastTitle).toBeVisible();
    });
  });
});
