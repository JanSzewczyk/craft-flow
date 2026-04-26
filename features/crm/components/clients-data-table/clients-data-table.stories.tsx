import { expect, fn } from "storybook/test";
import { clientListItemBuilder } from "~/features/crm/test/builders";
import { type ActionResponse } from "~/lib/action-types";

import { ClientsDataTable } from "./clients-data-table";

import preview from "~/.storybook/preview";

const meta = preview.meta({
  title: "Features/CRM/Clients Data Table",
  component: ClientsDataTable,
  parameters: {
    layout: "padded"
  },
  args: {
    onDeleteAction: fn(
      async () =>
        ({ success: true, data: { id: "1" }, message: "Klient został usunięty" }) as unknown as ActionResponse<{
          id: string;
        }>
    )
  }
});

export const WithClients = meta.story({
  args: {
    items: clientListItemBuilder.many(3)
  }
});

WithClients.test("Renders all expected content", async ({ canvas, step, args }) => {
  await step("Table headers are visible", async () => {
    await expect(canvas.getByRole("columnheader", { name: /klient/i })).toBeVisible();
    await expect(canvas.getByRole("columnheader", { name: /kontakt/i })).toBeVisible();
    await expect(canvas.getByRole("columnheader", { name: /status/i })).toBeVisible();
    await expect(canvas.getByRole("columnheader", { name: /data dodania/i })).toBeVisible();
  });

  await step("Correct number of data rows", async () => {
    const rows = canvas.getAllByRole("row");
    // 1 header row + 3 data rows
    await expect(rows).toHaveLength(args.items.length + 1);
  });

  await step("Client names and emails are visible", async () => {
    for (const item of args.items) {
      await expect(canvas.getByText(item.name)).toBeVisible();
      await expect(canvas.getByText(item.email)).toBeVisible();
    }
  });
});

export const WithRegisteredClient = meta.story({
  args: {
    items: [clientListItemBuilder.one({ traits: "registered" })]
  }
});

WithRegisteredClient.test("Shows 'Zarejestrowany' badge for registered client", async ({ canvas }) => {
  await expect(canvas.getByText("Zarejestrowany")).toBeVisible();
});

export const WithGuestClient = meta.story({
  args: {
    items: [clientListItemBuilder.one()]
  }
});

WithGuestClient.test("Shows 'Gość' badge for unregistered client", async ({ canvas }) => {
  await expect(canvas.getByText("Gość")).toBeVisible();
});

export const WithPhone = meta.story({
  args: {
    items: [clientListItemBuilder.one()]
  }
});

WithPhone.test("Renders both mail and phone contact icons", async ({ canvas }) => {
  const mailLink = canvas.getByRole("link", { name: /wyślij e-mail/i });
  await expect(mailLink).toBeVisible();
  const phoneLink = canvas.getByRole("link", { name: /zadzwoń/i });
  await expect(phoneLink).toBeVisible();
});

export const WithoutPhone = meta.story({
  args: {
    items: [clientListItemBuilder.one({ traits: "noPhone" })]
  }
});

WithoutPhone.test("Renders only mail icon when phone is null", async ({ canvas }) => {
  const mailLink = canvas.getByRole("link", { name: /wyślij e-mail/i });
  await expect(mailLink).toBeVisible();
  const phoneLink = canvas.queryByRole("link", { name: /zadzwoń/i });
  await expect(phoneLink).toBeNull();
});
