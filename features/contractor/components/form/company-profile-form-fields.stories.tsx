import * as React from "react";

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@szum-tech/design-system";
import { expect, waitFor } from "storybook/test";
import {
  companyDetailsSchema,
  type CompanyDetailsFormData
} from "~/features/contractor/schemas/company-details-schema";
import { companyDetailsFormBuilder } from "~/features/contractor/test/builders";

import { CompanyProfileFormFields } from "./company-profile-form-fields";

import preview from "~/.storybook/preview";

/*
 * Test plan:
 * 1. EmptyForm — no default values
 *    - Renders all fieldsets and labels
 *    - Address checkbox is unchecked by default
 *    - Checking the address checkbox reveals address fields
 *    - Shows validation errors on required fields when submitted empty
 * 2. WithValues — pre-filled basic fields (no address)
 *    - Pre-filled values are shown in inputs
 * 3. WithAddress — pre-filled with address
 *    - Address fields are visible
 *    - Unchecking the checkbox hides address fields
 */

function FormWrapper({
  defaultValues,
  onSubmit
}: {
  defaultValues?: Partial<CompanyDetailsFormData>;
  onSubmit?: (data: CompanyDetailsFormData) => void;
}) {
  const form = useForm<CompanyDetailsFormData>({
    resolver: zodResolver(companyDetailsSchema),
    defaultValues: {
      companyName: "",
      industry: "",
      phone: null,
      email: "",
      nip: null,
      regon: null,
      address: null,
      ...defaultValues
    }
  });

  return (
    <form onSubmit={form.handleSubmit((data) => onSubmit?.(data))} noValidate>
      <CompanyProfileFormFields form={form} />
      <Button type="submit" className="mt-4">
        Zapisz
      </Button>
    </form>
  );
}

const meta = preview.meta({
  title: "Features/Contractor/Company/Edit/Company Profile Form Fields",
  component: CompanyProfileFormFields,
  parameters: {
    layout: "padded"
  }
});

// ---------------------------------------------------------------------------
// Story 1: Empty form
// ---------------------------------------------------------------------------

export const EmptyForm = meta.story({
  render: () => <FormWrapper />
});

EmptyForm.test("Renders all expected content", async ({ canvas, step }) => {
  await step("Dane Twojej firmy fieldset is visible", async () => {
    await expect(canvas.getByText("Dane Twojej firmy")).toBeVisible();
    await expect(canvas.getByLabelText("Nazwa firmy")).toBeVisible();
    await expect(canvas.getByText("Branża")).toBeVisible();
  });

  await step("Twoje dane kontaktowe fieldset is visible", async () => {
    await expect(canvas.getByText("Twoje dane kontaktowe")).toBeVisible();
    await expect(canvas.getByLabelText("Publiczny e-mail")).toBeVisible();
  });

  await step("Address section header is visible", async () => {
    await expect(canvas.getByText("Adres siedziby Twojej firmy")).toBeVisible();
  });

  await step("Address checkbox is unchecked", async () => {
    const checkbox = canvas.getByRole("checkbox", { name: /chcę podać adres siedziby firmy/i });
    await expect(checkbox).not.toBeChecked();
  });
});

EmptyForm.test("Address fields are hidden when checkbox is unchecked", async ({ canvas }) => {
  await expect(canvas.queryByLabelText("Ulica i numer")).not.toBeInTheDocument();
  await expect(canvas.queryByLabelText("Miasto")).not.toBeInTheDocument();
});

EmptyForm.test("Checking the address checkbox reveals address fields", async ({ canvas, userEvent }) => {
  const checkbox = canvas.getByRole("checkbox", { name: /chcę podać adres siedziby firmy/i });
  await userEvent.click(checkbox);

  await waitFor(async () => {
    await expect(canvas.getByLabelText("Ulica i numer")).toBeVisible();
    await expect(canvas.getByLabelText("Miasto")).toBeVisible();
    await expect(canvas.getByLabelText("Kod pocztowy")).toBeVisible();
    await expect(canvas.getByLabelText("Kraj")).toBeVisible();
  });
});

EmptyForm.test("Shows validation errors on empty submit", async ({ canvas, userEvent }) => {
  await userEvent.click(canvas.getByRole("button", { name: /zapisz/i }));

  await waitFor(async () => {
    await expect(canvas.getByText(/nazwa firmy musi mieć co najmniej 2 znaki/i)).toBeVisible();
    await expect(canvas.getByText(/wybierz branżę/i, { selector: '[data-slot="field-error"]' })).toBeVisible();
  });
});

// ---------------------------------------------------------------------------
// Story 2: Pre-filled values (no address)
// ---------------------------------------------------------------------------

const filledData = companyDetailsFormBuilder.one({
  overrides: {
    companyName: "Stolarnia u Jana",
    industry: "stolarstwo",
    email: "kontakt@stolarnia.pl",
    phone: "+48 123 456 789",
    nip: null,
    regon: null,
    address: null
  }
});

export const WithValues = meta.story({
  render: () => <FormWrapper defaultValues={filledData} />
});

WithValues.test("Displays pre-filled values", async ({ canvas }) => {
  await expect(canvas.getByLabelText("Nazwa firmy")).toHaveValue("Stolarnia u Jana");
  await expect(canvas.getByLabelText("Publiczny e-mail")).toHaveValue("kontakt@stolarnia.pl");
  await expect(canvas.getByLabelText(/telefon/i)).toHaveValue("+48 123 456 789");
});

WithValues.test("Address checkbox remains unchecked when no address in data", async ({ canvas }) => {
  const checkbox = canvas.getByRole("checkbox", { name: /chcę podać adres siedziby firmy/i });
  await expect(checkbox).not.toBeChecked();
});

// ---------------------------------------------------------------------------
// Story 3: Pre-filled with address
// ---------------------------------------------------------------------------

const dataWithAddress = companyDetailsFormBuilder.one({
  traits: "withAddress",
  overrides: {
    companyName: "Firma z Adresem",
    industry: "hydraulika",
    email: "biuro@firma.pl"
  }
});

export const WithAddress = meta.story({
  render: () => <FormWrapper defaultValues={dataWithAddress} />
});

WithAddress.test("Address checkbox is checked when address is provided", async ({ canvas }) => {
  const checkbox = canvas.getByRole("checkbox", { name: /chcę podać adres siedziby firmy/i });
  await expect(checkbox).toBeChecked();
});

WithAddress.test("Address fields are visible when address is provided", async ({ canvas }) => {
  await expect(canvas.getByLabelText("Ulica i numer")).toBeVisible();
  await expect(canvas.getByLabelText("Miasto")).toBeVisible();
  await expect(canvas.getByLabelText("Kod pocztowy")).toBeVisible();
  await expect(canvas.getByLabelText("Kraj")).toBeVisible();
});

WithAddress.test("Unchecking the address checkbox hides address fields", async ({ canvas, userEvent }) => {
  const checkbox = canvas.getByRole("checkbox", { name: /chcę podać adres siedziby firmy/i });
  await userEvent.click(checkbox);

  await waitFor(async () => {
    await expect(canvas.queryByLabelText("Ulica i numer")).not.toBeInTheDocument();
  });
});
