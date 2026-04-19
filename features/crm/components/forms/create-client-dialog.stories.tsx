import { expect, fn, screen, waitFor, within } from "storybook/test";
import { type Client } from "~/features/crm/server/db/schema";
import { type ActionResponse } from "~/lib/action-types";

import { CreateClientDialog } from "./create-client-dialog";

import preview from "~/.storybook/preview";

const meta = preview.meta({
  title: "Features/CRM/Forms/Create Client Dialog",
  component: CreateClientDialog,
  parameters: {
    layout: "fullscreen",
    nextjs: { appDirectory: true }
  },
  args: {
    onCreateAction: fn(
      async () =>
        ({
          success: true,
          data: {},
          message: "Klient został dodany"
        }) as unknown as ActionResponse<Client>
    )
  }
});

export const Default = meta.story({});

Default.test("Renders dialog with title and form fields", async ({ step }) => {
  const canvas = within(await screen.findByRole("dialog", { name: /nowy klient/i }));

  await step("Dialog title and description are visible", async () => {
    await waitFor(async () => {
      await expect(canvas.getByText("Nowy klient")).toBeVisible();
    });
    await expect(canvas.getByText(/dane klienta pozwolą/i)).toBeVisible();
  });

  await step("Form fields are rendered", async () => {
    await expect(canvas.getByLabelText(/imię i nazwisko/i)).toBeVisible();
    await expect(canvas.getByLabelText(/e-mail/i)).toBeVisible();
    await expect(canvas.getByLabelText(/telefon/i)).toBeVisible();
  });

  await step("Action buttons are visible", async () => {
    await expect(canvas.getByRole("button", { name: "Anuluj" })).toBeVisible();
    await expect(canvas.getByRole("button", { name: "Dodaj klienta" })).toBeVisible();
  });
});

Default.test("Shows validation errors when submitting empty form", async ({ userEvent }) => {
  const canvas = within(await screen.findByRole("dialog", { name: /nowy klient/i }));

  await waitFor(async () => {
    await expect(canvas.getByRole("button", { name: "Dodaj klienta" })).toBeVisible();
  });

  await userEvent.click(canvas.getByRole("button", { name: "Dodaj klienta" }));

  await waitFor(async () => {
    await expect(canvas.getByText(/imię i nazwisko musi mieć co najmniej 2 znaki/i)).toBeVisible();
  });
});

export const SubmitSuccess = meta.story({
  args: {
    onCreateAction: fn(async () => ({ success: true as const, data: {} as never, message: "Klient został dodany" }))
  }
});

SubmitSuccess.test("Calls onCreateAction and shows success toast on valid submit", async ({ args, userEvent }) => {
  const canvas = within(await screen.findByRole("dialog", { name: /nowy klient/i }));

  await waitFor(async () => {
    await expect(canvas.getByRole("button", { name: "Dodaj klienta" })).toBeVisible();
  });

  await userEvent.type(canvas.getByLabelText(/imię i nazwisko/i), "Jan Kowalski");
  await userEvent.type(canvas.getByLabelText(/e-mail/i), "jan@gmail.com");

  await userEvent.click(canvas.getByRole("button", { name: "Dodaj klienta" }));

  await waitFor(async () => {
    await expect(args.onCreateAction).toHaveBeenCalledOnce();
  });

  await waitFor(async () => {
    await expect(await screen.findByText(/klient został dodany/i)).toBeVisible();
  });
});

export const SubmitError = meta.story({
  args: {
    onCreateAction: fn(async () => ({ success: false as const, error: "Klient z tym adresem e-mail już istnieje" }))
  }
});

SubmitError.test("Shows error toast when onCreateAction returns failure", async ({ args, userEvent }) => {
  const canvas = within(await screen.findByRole("dialog", { name: /nowy klient/i }));

  await waitFor(async () => {
    await expect(canvas.getByRole("button", { name: "Dodaj klienta" })).toBeVisible();
  });

  await userEvent.type(canvas.getByLabelText(/imię i nazwisko/i), "Jan Kowalski");
  await userEvent.type(canvas.getByLabelText(/e-mail/i), "jan@gmail.com");

  await userEvent.click(canvas.getByRole("button", { name: "Dodaj klienta" }));

  await waitFor(async () => {
    await expect(args.onCreateAction).toHaveBeenCalledOnce();
  });

  await waitFor(async () => {
    await expect(await screen.findByText(/klient z tym adresem e-mail już istnieje/i)).toBeVisible();
  });
});
