import { expect, fn, screen, waitFor, within } from "storybook/test";
import { type Client } from "~/features/crm/server/db/schema";
import { clientBuilder } from "~/features/crm/test/builders";
import { type ActionResponse } from "~/lib/action-types";

import { ClientDetailsSheet } from "./client-details-sheet";

import preview from "~/.storybook/preview";

const defaultClient = clientBuilder.one({ overrides: { name: "Jan Kowalski" } });

const meta = preview.meta({
  title: "Features/CRM/Client Details Sheet",
  component: ClientDetailsSheet,
  parameters: {
    layout: "fullscreen",
    nextjs: { appDirectory: true }
  },
  args: {
    client: defaultClient,
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

export const ClientDetailsSheetStory = meta.story({ name: "Client Details Sheet" });

ClientDetailsSheetStory.test("Renders all expected content", async ({ step, args }) => {
  const canvas = within(await screen.findByRole("dialog"));

  await step("Client name is visible as title", async () => {
    await waitFor(async () => {
      await expect(canvas.getByText(args.client.name)).toBeVisible();
    });
  });

  await step("Client ID prefix is visible in description", async () => {
    await expect(canvas.getByText(`ID Klienta: ${args.client.id.slice(0, 8)}`)).toBeVisible();
  });

  await step("Sheet contains tabs", async () => {
    await expect(canvas.getByRole("tab", { name: /dane klienta/i })).toBeVisible();
    await expect(canvas.getByRole("tab", { name: /historia projektów/i })).toBeVisible();
    await expect(canvas.getByRole("tab", { name: /adresy/i })).toBeVisible();
  });
});
