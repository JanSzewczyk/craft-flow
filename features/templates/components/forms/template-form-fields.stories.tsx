"use client";

import * as React from "react";

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@szum-tech/design-system";
import { expect, waitFor, within } from "storybook/test";
import { templateSchema, type TemplateFormData } from "~/features/templates/schemas/template-schema";

import { TemplateFormFields } from "./template-form-fields";

import preview from "~/.storybook/preview";

/**
 * Wrapper that provides the required React Hook Form context.
 * Renders TemplateFormFields inside a <form> with a submit button for validation testing.
 */
function FormWrapper({
  defaultValues,
  showProTip,
  onSubmit
}: {
  defaultValues?: Partial<TemplateFormData>;
  showProTip?: boolean;
  onSubmit?: (data: TemplateFormData) => void;
}) {
  const form = useForm<TemplateFormData>({
    resolver: zodResolver(templateSchema),
    defaultValues: {
      name: "",
      description: null,
      steps: [{ title: "", description: null }],
      ...defaultValues
    }
  });

  return (
    <form onSubmit={form.handleSubmit((data) => onSubmit?.(data))} noValidate>
      <TemplateFormFields form={form} showProTip={showProTip} />
      <Button type="submit" className="mt-4">
        Zapisz
      </Button>
    </form>
  );
}

const meta = preview.meta({
  title: "Features/Templates/Forms/Template Form Fields",
  component: TemplateFormFields,
  parameters: {
    layout: "padded"
  }
});

export const Empty = meta.story({
  render: () => <FormWrapper />
});

Empty.test("Renders name input", async ({ canvas }) => {
  await expect(canvas.getByLabelText("Nazwa szablonu")).toBeVisible();
});

Empty.test("Renders description textarea", async ({ canvas }) => {
  const textarea = canvas.getByPlaceholderText(/krótki opis szablonu/i);
  await expect(textarea).toBeVisible();
});

Empty.test("Renders 'Etapy procesu' section", async ({ canvas }) => {
  await expect(canvas.getByText("Etapy procesu")).toBeVisible();
});

Empty.test("Renders 'Dodaj kolejny etap' button", async ({ canvas }) => {
  await expect(canvas.getByRole("button", { name: /dodaj kolejny etap/i })).toBeVisible();
});

Empty.test("Shows validation error for empty name on submit", async ({ canvas, userEvent }) => {
  await userEvent.click(canvas.getByRole("button", { name: /zapisz/i }));
  await waitFor(async () => {
    await expect(canvas.getByText(/nazwa szablonu nie może być pusta/i)).toBeVisible();
  });
});

export const WithProTip = meta.story({
  render: () => <FormWrapper showProTip />
});

WithProTip.test("Renders Pro Tip section when showProTip is true", async ({ canvas }) => {
  await expect(canvas.getByText("Pro Tip")).toBeVisible();
});

export const WithSteps = meta.story({
  render: () => (
    <FormWrapper
      defaultValues={{
        name: "Szablon testowy",
        steps: [
          { title: "Projekt", description: "Faza projektowania" },
          { title: "Produkcja", description: null }
        ]
      }}
    />
  )
});

WithSteps.test("Renders all steps from defaultValues", async ({ canvas }) => {
  await expect(canvas.getByText("Projekt")).toBeVisible();
  await expect(canvas.getByText("Produkcja")).toBeVisible();
});

WithSteps.test("Renders step count label", async ({ canvas }) => {
  await expect(canvas.getByText("2 etapy")).toBeVisible();
});

export const AddStep = meta.story({
  render: () => (
    <FormWrapper
      defaultValues={{
        name: "Szablon",
        steps: [{ title: "Wycena", description: null }]
      }}
    />
  )
});

AddStep.test("Opens add step dialog when 'Dodaj kolejny etap' is clicked", async ({ canvas, userEvent }) => {
  await userEvent.click(canvas.getByRole("button", { name: /dodaj kolejny etap/i }));
  await waitFor(async () => {
    await expect(within(document.body).getByText("Dodaj nowy etap")).toBeVisible();
  });
});

AddStep.test("New step appears in list after filling dialog and submitting", async ({ canvas, userEvent }) => {
  await userEvent.click(canvas.getByRole("button", { name: /dodaj kolejny etap/i }));

  const body = within(document.body);
  await waitFor(async () => {
    await expect(body.getByLabelText("Nazwa etapu")).toBeVisible();
  });

  await userEvent.type(body.getByLabelText("Nazwa etapu"), "Nowy etap");
  await userEvent.click(body.getByRole("button", { name: /dodaj/i }));

  await waitFor(async () => {
    await expect(canvas.getByText("Nowy etap")).toBeVisible();
  });
});
