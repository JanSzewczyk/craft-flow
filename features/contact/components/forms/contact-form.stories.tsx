import { expect, fn, screen, waitFor } from "storybook/test";

import { ContactForm } from "./contact-form";

import preview from "~/.storybook/preview";

const meta = preview.meta({
  title: "Contact/Forms/Contact Form",
  component: ContactForm,
  parameters: {
    layout: "padded"
  }
});

export const EmptyForm = meta.story({
  args: {
    onSubmitAction: fn(async () => ({ success: true as const, data: null }))
  }
});

EmptyForm.test(
  "Renders all fields, validates empty submission, and shows success toast on valid submit",
  async ({ canvas, args, step, userEvent }) => {
    await step("Renders all form fields and submit button", async () => {
      await expect(canvas.getByLabelText("Imię i nazwisko")).toBeVisible();
      await expect(canvas.getByLabelText("Adres e-mail")).toBeVisible();
      await expect(canvas.getByText("Temat")).toBeVisible();
      await expect(canvas.getByLabelText("Wiadomość")).toBeVisible();
      await expect(canvas.getByRole("button", { name: /wyślij wiadomość/i })).toBeVisible();
    });

    await step("Shows validation errors when submitting empty form", async () => {
      const submitButton = canvas.getByRole("button", { name: /wyślij wiadomość/i });
      await userEvent.click(submitButton);

      await waitFor(async () => {
        await expect(canvas.getByText(/imię musi mieć co najmniej 2 znaki/i)).toBeVisible();
        await expect(canvas.getByText(/podaj prawidłowy adres e-mail/i)).toBeVisible();
        await expect(canvas.getByText(/wiadomość musi mieć co najmniej 20 znaków/i)).toBeVisible();
      });
    });

    await step("onSubmitAction is not called when form has validation errors", async () => {
      await expect(args.onSubmitAction).not.toHaveBeenCalled();
    });

    await step("Fills in valid data and submits successfully", async () => {
      await userEvent.type(canvas.getByLabelText("Imię i nazwisko"), "Jan Kowalski");
      await userEvent.type(canvas.getByLabelText("Adres e-mail"), "jan@firma.pl");
      await userEvent.type(
        canvas.getByLabelText("Wiadomość"),
        "Proszę o informacje dotyczące waszego systemu i możliwości integracji."
      );

      const submitButton = canvas.getByRole("button", { name: /wyślij wiadomość/i });
      await userEvent.click(submitButton);

      await waitFor(async () => {
        await expect(args.onSubmitAction).toHaveBeenCalledOnce();
      });
    });

    await step("Shows success toast after successful submission", async () => {
      await waitFor(async () => {
        const toast = await screen.findByText("Wiadomość wysłana!");
        await expect(toast).toBeVisible();
      });
    });

    await step("Form fields are reset after successful submission", async () => {
      await waitFor(async () => {
        const nameInput = canvas.getByLabelText("Imię i nazwisko");
        await expect(nameInput).toHaveValue("");
      });
    });
  }
);

export const SubmitErrorForm = meta.story({
  args: {
    onSubmitAction: fn(async () => ({
      success: false as const,
      error: "Nie udało się wysłać wiadomości. Spróbuj ponownie."
    }))
  }
});

SubmitErrorForm.test(
  "Shows error toast when submission fails and preserves form values",
  async ({ canvas, args, step, userEvent }) => {
    await step("Fills in valid form data", async () => {
      await userEvent.type(canvas.getByLabelText("Imię i nazwisko"), "Anna Nowak");
      await userEvent.type(canvas.getByLabelText("Adres e-mail"), "anna@example.com");
      await userEvent.type(
        canvas.getByLabelText("Wiadomość"),
        "Mam pytanie dotyczące funkcjonalności systemu CraftFlow dla mojego warsztatu."
      );
    });

    await step("Submits the form", async () => {
      const submitButton = canvas.getByRole("button", { name: /wyślij wiadomość/i });
      await userEvent.click(submitButton);

      await waitFor(async () => {
        await expect(args.onSubmitAction).toHaveBeenCalledOnce();
      });
    });

    await step("Shows error toast with server error message", async () => {
      await waitFor(async () => {
        const toastTitle = await screen.findByText("Błąd wysyłania");
        await expect(toastTitle).toBeVisible();

        const toastDescription = await screen.findByText("Nie udało się wysłać wiadomości. Spróbuj ponownie.");
        await expect(toastDescription).toBeVisible();
      });
    });

    await step("Form values are preserved after failed submission", async () => {
      await expect(canvas.getByLabelText("Imię i nazwisko")).toHaveValue("Anna Nowak");
      await expect(canvas.getByLabelText("Adres e-mail")).toHaveValue("anna@example.com");
    });
  }
);
