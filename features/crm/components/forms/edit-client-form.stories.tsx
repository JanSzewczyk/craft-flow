import { expect, fn, screen, waitFor } from "storybook/test";
import { type ActionResponse } from "~/lib/action-types";
import { type Client } from "~/features/crm/server/db/schema";
import { clientBuilder, clientFormBuilder } from "~/features/crm/test/builders";

import { EditClientForm } from "./edit-client-form";

import preview from "~/.storybook/preview";

const meta = preview.meta({
  title: "Features/CRM/Forms/Edit Client Form",
  component: EditClientForm,
  parameters: {
    layout: "padded"
  },
  args: {
    clientId: "client-1",
    defaultValues: clientFormBuilder.one(),
    isEmailLocked: false,
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

export const PreFilled = meta.story({});

PreFilled.test("Renders all expected content", async ({ canvas, step, args }) => {
  await step("Form fields show default values", async () => {
    await expect(canvas.getByLabelText(/imię i nazwisko/i)).toHaveValue(args.defaultValues.name);
    await expect(canvas.getByLabelText(/e-mail/i)).toHaveValue(args.defaultValues.email);
  });

  await step("Email field is enabled when not locked", async () => {
    await expect(canvas.getByLabelText(/e-mail/i)).not.toBeDisabled();
  });

  await step("Submit button is visible", async () => {
    await expect(canvas.getByRole("button", { name: "Zapisz zmiany" })).toBeVisible();
  });
});

export const LockedEmail = meta.story({
  args: {
    isEmailLocked: true
  }
});

LockedEmail.test("Email field is disabled when locked", async ({ canvas }) => {
  await expect(canvas.getByLabelText(/e-mail/i)).toBeDisabled();
});

export const ValidationError = meta.story({
  args: {
    defaultValues: { name: "", email: "", phone: null }
  }
});

ValidationError.test("Shows validation errors on empty submit", async ({ canvas, userEvent }) => {
  await userEvent.click(canvas.getByRole("button", { name: "Zapisz zmiany" }));

  await waitFor(async () => {
    await expect(canvas.getByText(/imię i nazwisko musi mieć co najmniej 2 znaki/i)).toBeVisible();
  });
});

export const SubmitSuccess = meta.story({
  args: {
    onUpdateAction: fn(async () => ({
      success: true as const,
      data: {} as never,
      message: "Dane klienta zostały zaktualizowane"
    }))
  }
});

SubmitSuccess.test("Calls onUpdateAction and shows success toast", async ({ canvas, userEvent, args }) => {
  await userEvent.click(canvas.getByRole("button", { name: "Zapisz zmiany" }));

  await waitFor(async () => {
    await expect(args.onUpdateAction).toHaveBeenCalledOnce();
  });

  await waitFor(async () => {
    await expect(await screen.findByText(/dane klienta zostały zaktualizowane/i)).toBeVisible();
  });
});

export const SubmitError = meta.story({
  args: {
    onUpdateAction: fn(async () => ({ success: false as const, error: "Nie udało się zapisać zmian" }))
  }
});

SubmitError.test("Shows error toast when update fails", async ({ canvas, userEvent, args }) => {
  await userEvent.click(canvas.getByRole("button", { name: "Zapisz zmiany" }));

  await waitFor(async () => {
    await expect(args.onUpdateAction).toHaveBeenCalledOnce();
  });

  await waitFor(async () => {
    await expect(await screen.findByText(/nie udało się zapisać zmian/i)).toBeVisible();
  });
});
