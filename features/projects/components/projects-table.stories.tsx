import { expect } from "storybook/test";
import { projectListItemBuilder } from "~/features/projects/test/builders";

import { ProjectsTable } from "./projects-table";

import preview from "~/.storybook/preview";

const meta = preview.meta({
  title: "Features/Projects/Projects Table",
  component: ProjectsTable,
  parameters: { layout: "padded" }
});

export const EmptyTable = meta.story({
  args: { items: [] }
});

EmptyTable.test("Shows empty state when no projects", async ({ canvas, step }) => {
  await step("Empty state heading is visible", async () => {
    await expect(canvas.getByText("Brak projektów")).toBeVisible();
  });

  await step("Empty state description is visible", async () => {
    await expect(canvas.getByText(/Nie znaleziono projektów/)).toBeVisible();
  });
});

export const WithItems = meta.story({
  args: {
    items: [
      projectListItemBuilder.one({ traits: "active" }),
      projectListItemBuilder.one(),
      projectListItemBuilder.one({ traits: "completed" })
    ]
  }
});

WithItems.test("Renders table with project rows", async ({ canvas, step }) => {
  await step("Table headers are visible", async () => {
    await expect(canvas.getByText("Nazwa projektu")).toBeVisible();
    await expect(canvas.getByText("Klient")).toBeVisible();
    await expect(canvas.getByText("Status")).toBeVisible();
    await expect(canvas.getByText("Postęp")).toBeVisible();
    await expect(canvas.getByText("Data utworzenia")).toBeVisible();
    await expect(canvas.getByText("Aktualizacja")).toBeVisible();
  });

  await step("Status badges are visible", async () => {
    await expect(canvas.getByText("Aktywny")).toBeVisible();
    await expect(canvas.getByText("Szkic")).toBeVisible();
    await expect(canvas.getByText("Zakończony")).toBeVisible();
  });
});
