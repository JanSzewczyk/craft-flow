import { expect, fn, waitFor } from "storybook/test";
import { type Client } from "~/features/crm/types/client";
import { clientBuilder } from "~/features/crm/test/builders";
import { type ActionResponse } from "~/lib/action-types";

import { ClientDetailsContent } from "./client-details-content";

import preview from "~/.storybook/preview";

const meta = preview.meta({
  title: "Features/CRM/Client Details Content",
  component: ClientDetailsContent,
  parameters: {
    layout: "padded"
  },
  args: {
    client: clientBuilder.one(),
    onUpdateAction: fn(
      async () =>
        ({
          success: true,
          data: clientBuilder.one(),
          message: "Dane klienta zostały zaktualizowane"
        }) as unknown as ActionResponse<Client>
    )
  }
});

export const GuestClient = meta.story({});

GuestClient.test("Renders all expected content", async ({ canvas, step }) => {
  await step("All three tabs are visible", async () => {
    await expect(canvas.getByRole("tab", { name: /dane klienta/i })).toBeVisible();
    await expect(canvas.getByRole("tab", { name: /historia projektów/i })).toBeVisible();
    await expect(canvas.getByRole("tab", { name: /adresy/i })).toBeVisible();
  });

  await step("'Dane klienta' tab is selected", async () => {
    await expect(canvas.getByRole("tab", { name: /dane klienta/i })).toHaveAttribute("aria-selected", "true");
  });

  await step("Edit form is visible", async () => {
    await expect(canvas.getByLabelText(/imię i nazwisko/i)).toBeVisible();
    await expect(canvas.getByRole("button", { name: "Zapisz zmiany" })).toBeVisible();
  });

  await step("Email field is enabled for guest client", async () => {
    await expect(canvas.getByLabelText(/e-mail/i)).not.toBeDisabled();
  });
});

GuestClient.test("Switching to placeholder tabs shows 'Wkrótce...'", async ({ canvas, userEvent, step }) => {
  await step("'Historia projektów' tab shows placeholder", async () => {
    await userEvent.click(canvas.getByRole("tab", { name: /historia projektów/i }));
    await waitFor(async () => {
      await expect(canvas.getByText("Wkrótce...")).toBeVisible();
    });
  });

  await step("'Adresy' tab shows placeholder", async () => {
    await userEvent.click(canvas.getByRole("tab", { name: /adresy/i }));
    await waitFor(async () => {
      await expect(canvas.getByText("Wkrótce...")).toBeVisible();
    });
  });
});

export const RegisteredClient = meta.story({
  args: {
    client: clientBuilder.one({ traits: "registered" })
  }
});

RegisteredClient.test("Email field is disabled for registered client", async ({ canvas }) => {
  await expect(canvas.getByLabelText(/e-mail/i)).toBeDisabled();
});
