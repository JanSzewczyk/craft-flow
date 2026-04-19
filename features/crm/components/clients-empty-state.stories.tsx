import { expect } from "storybook/test";

import { ClientsEmptyState } from "./clients-empty-state";

import preview from "~/.storybook/preview";

const meta = preview.meta({
  title: "Features/CRM/Clients Empty State",
  component: ClientsEmptyState,
  parameters: {
    layout: "padded",
    nextjs: { appDirectory: true }
  }
});

export const ClientsEmptyStateStory = meta.story({ name: "Clients Empty State" });

ClientsEmptyStateStory.test("Renders all expected content", async ({ canvas, step }) => {
  await step("Title and description are visible", async () => {
    await expect(canvas.getByText("Brak klientów")).toBeVisible();
    await expect(canvas.getByText(/dodaj pierwszego klienta, aby rozpocząć/i)).toBeVisible();
  });

  await step("CTA button links to new client page", async () => {
    const link = canvas.getByRole("link", { name: /dodaj pierwszego klienta/i });
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute("href", "/app/clients/new");
  });
});
