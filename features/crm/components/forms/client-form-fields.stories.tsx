"use client";

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@szum-tech/design-system";
import { expect, waitFor } from "storybook/test";
import { clientSchema, type ClientFormData } from "~/features/crm/schemas/client-schema";

import { ClientFormFields } from "./client-form-fields";

import preview from "~/.storybook/preview";

function FormWrapper({
  defaultValues,
  isEmailLocked
}: {
  defaultValues?: Partial<ClientFormData>;
  isEmailLocked?: boolean;
}) {
  const form = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: null,
      ...defaultValues
    }
  });

  return (
    <form onSubmit={form.handleSubmit(() => {})} noValidate>
      <ClientFormFields form={form} isEmailLocked={isEmailLocked} />
      <Button type="submit" className="mt-4">
        Zapisz
      </Button>
    </form>
  );
}

const meta = preview.meta({
  title: "Features/CRM/Forms/Client Form Fields",
  component: ClientFormFields,
  parameters: {
    layout: "padded"
  }
});

export const EmptyForm = meta.story({
  render: () => <FormWrapper />
});

EmptyForm.test("Renders all expected content", async ({ canvas, step }) => {
  await step("All form fields are visible", async () => {
    await expect(canvas.getByLabelText(/imię i nazwisko/i)).toBeVisible();
    await expect(canvas.getByLabelText(/e-mail/i)).toBeVisible();
    await expect(canvas.getByLabelText(/telefon/i)).toBeVisible();
  });

  await step("Email field is enabled", async () => {
    await expect(canvas.getByLabelText(/e-mail/i)).not.toBeDisabled();
  });
});

EmptyForm.test("Shows validation errors on empty submit", async ({ canvas, userEvent }) => {
  await userEvent.click(canvas.getByRole("button", { name: /zapisz/i }));

  await waitFor(async () => {
    await expect(canvas.getByText(/imię i nazwisko musi mieć co najmniej 2 znaki/i)).toBeVisible();
  });
});

export const LockedEmail = meta.story({
  render: () => <FormWrapper isEmailLocked defaultValues={{ name: "Jan Kowalski", email: "jan@gmail.com" }} />
});

LockedEmail.test("Email field is disabled when locked", async ({ canvas }) => {
  await expect(canvas.getByLabelText(/e-mail/i)).toBeDisabled();
});

LockedEmail.test("Pre-filled values are displayed", async ({ canvas }) => {
  await expect(canvas.getByLabelText(/imię i nazwisko/i)).toHaveValue("Jan Kowalski");
  await expect(canvas.getByLabelText(/e-mail/i)).toHaveValue("jan@gmail.com");
});

export const WithValues = meta.story({
  render: () => (
    <FormWrapper
      defaultValues={{
        name: "Anna Nowak",
        email: "anna@test.pl",
        phone: "+48 123 456 789"
      }}
    />
  )
});

WithValues.test("Renders pre-filled form values", async ({ canvas }) => {
  await expect(canvas.getByLabelText(/imię i nazwisko/i)).toHaveValue("Anna Nowak");
  await expect(canvas.getByLabelText(/e-mail/i)).toHaveValue("anna@test.pl");
  await expect(canvas.getByLabelText(/telefon/i)).toHaveValue("+48 123 456 789");
});
