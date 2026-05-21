import * as React from "react";

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@szum-tech/design-system";
import { expect, waitFor } from "storybook/test";
import {
  companyDetailsSchema,
  type CompanyDetailsFormData
} from "~/features/contractor/schemas/company-details-schema";

import preview from "~/.storybook/preview";

import { AddressFormFields } from "./address-form-fields";

/*
 * Test plan:
 * 1. Empty — no default address values
 *    - Renders all address field labels
 *    - All inputs are empty
 *    - Can type into fields
 * 2. Prefilled — pre-filled address values
 *    - Each field shows its pre-filled value
 */

function FormWrapper({ defaultAddress }: { defaultAddress?: CompanyDetailsFormData["address"] }) {
  const form = useForm<CompanyDetailsFormData>({
    resolver: zodResolver(companyDetailsSchema),
    defaultValues: {
      companyName: "",
      industry: "",
      phone: null,
      email: "",
      nip: null,
      regon: null,
      address: defaultAddress ?? null
    }
  });

  return (
    <form noValidate>
      <AddressFormFields form={form} />
      <Button type="submit" className="mt-4">
        Zapisz
      </Button>
    </form>
  );
}

const meta = preview.meta({
  title: "Features/Shared/Address Form Fields",
  component: AddressFormFields,
  parameters: {
    layout: "padded"
  }
});

export const Empty = meta.story({
  render: () => <FormWrapper />
});

Empty.test("Renders all expected content", async ({ canvas, step }) => {
  await step("Street field is visible", async () => {
    await expect(canvas.getByLabelText("Ulica i numer")).toBeVisible();
  });

  await step("Postal code field is visible", async () => {
    await expect(canvas.getByLabelText("Kod pocztowy")).toBeVisible();
  });

  await step("City field is visible", async () => {
    await expect(canvas.getByLabelText("Miasto")).toBeVisible();
  });

  await step("Country field is visible", async () => {
    await expect(canvas.getByLabelText("Kraj")).toBeVisible();
  });

  await step("Additional info field is visible", async () => {
    await expect(canvas.getByLabelText("Informacje dodatkowe")).toBeVisible();
  });
});

Empty.test("All inputs are empty by default", async ({ canvas }) => {
  await expect(canvas.getByLabelText("Ulica i numer")).toHaveValue("");
  await expect(canvas.getByLabelText("Kod pocztowy")).toHaveValue("");
  await expect(canvas.getByLabelText("Miasto")).toHaveValue("");
  await expect(canvas.getByLabelText("Kraj")).toHaveValue("");
});

Empty.test("Can type into address fields", async ({ canvas, userEvent }) => {
  const streetInput = canvas.getByLabelText("Ulica i numer");
  await userEvent.type(streetInput, "ul. Testowa 1");

  await waitFor(async () => {
    await expect(streetInput).toHaveValue("ul. Testowa 1");
  });

  const cityInput = canvas.getByLabelText("Miasto");
  await userEvent.type(cityInput, "Warszawa");

  await waitFor(async () => {
    await expect(cityInput).toHaveValue("Warszawa");
  });
});

const prefilledAddress: CompanyDetailsFormData["address"] = {
  street: "ul. Główna 12",
  postalCode: "00-001",
  city: "Warszawa",
  country: "Polska",
  additionalInfo: null
};

export const Prefilled = meta.story({
  render: () => <FormWrapper defaultAddress={prefilledAddress} />
});

Prefilled.test("Displays pre-filled address values", async ({ canvas, step }) => {
  await step("Street is pre-filled", async () => {
    await expect(canvas.getByLabelText("Ulica i numer")).toHaveValue("ul. Główna 12");
  });

  await step("Postal code is pre-filled", async () => {
    await expect(canvas.getByLabelText("Kod pocztowy")).toHaveValue("00-001");
  });

  await step("City is pre-filled", async () => {
    await expect(canvas.getByLabelText("Miasto")).toHaveValue("Warszawa");
  });

  await step("Country is pre-filled", async () => {
    await expect(canvas.getByLabelText("Kraj")).toHaveValue("Polska");
  });
});

Prefilled.test("Can modify pre-filled street value", async ({ canvas, userEvent }) => {
  const streetInput = canvas.getByLabelText("Ulica i numer");
  await userEvent.clear(streetInput);
  await userEvent.type(streetInput, "ul. Nowa 5");

  await waitFor(async () => {
    await expect(streetInput).toHaveValue("ul. Nowa 5");
  });
});
