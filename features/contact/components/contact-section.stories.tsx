import * as React from "react";

import { Toaster } from "@szum-tech/design-system";
import { expect, fn } from "storybook/test";

import { ContactSection } from "./contact-section";

import preview from "~/.storybook/preview";

const meta = preview.meta({
  title: "Contact/Contact Section",
  component: ContactSection,
  decorators: [
    (Story) => (
      <>
        <Story />
        <Toaster />
      </>
    )
  ],
  parameters: {
    layout: "padded"
  }
});

export const Section = meta.story({
  args: {
    onSubmitAction: fn(async () => ({ success: true as const, data: null }))
  }
});

Section.test("Renders layout structure with heading, contact info, and form card", async ({ canvas, step }) => {
  await step("Renders the main section heading", async () => {
    const heading = canvas.getByText("Porozmawiajmy o Twoim warsztacie.");
    await expect(heading).toBeVisible();
  });

  await step("Renders the contact info heading and email address", async () => {
    const contactHeading = canvas.getByText("Informacje kontaktowe");
    await expect(contactHeading).toBeVisible();

    const email = canvas.getByText("kontakt@craftflow.pl");
    await expect(email).toBeVisible();
  });

  await step("Renders the support hours info", async () => {
    const supportHours = canvas.getByText("Pon–Pt, 9:00–17:00");
    await expect(supportHours).toBeVisible();
  });

  await step("Renders the contact form inside a card", async () => {
    const submitButton = canvas.getByRole("button", { name: /wyślij wiadomość/i });
    await expect(submitButton).toBeVisible();
  });

  await step("Renders the form fields", async () => {
    await expect(canvas.getByLabelText("Imię i nazwisko")).toBeVisible();
    await expect(canvas.getByLabelText("Adres e-mail")).toBeVisible();
    await expect(canvas.getByText("Temat")).toBeVisible();
    await expect(canvas.getByLabelText("Wiadomość")).toBeVisible();
  });
});
