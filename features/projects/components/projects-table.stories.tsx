import { expect } from "storybook/test";
import { ProjectStatus } from "~/features/projects/server/db/schema";

import { ProjectsTable } from "./projects-table";

import preview from "~/.storybook/preview";

const mockItems = [
  {
    id: "1",
    name: "Remont łazienki",
    clientName: "Jan Kowalski",
    status: ProjectStatus.ACTIVE,
    totalSteps: 5,
    completedSteps: 2,
    lastClientViewAt: null,
    updatedAt: new Date(Date.now() - 3600_000)
  },
  {
    id: "2",
    name: "Malowanie salonu",
    clientName: "Anna Nowak",
    status: ProjectStatus.DRAFT,
    totalSteps: 0,
    completedSteps: 0,
    lastClientViewAt: null,
    updatedAt: new Date(Date.now() - 86400_000)
  },
  {
    id: "3",
    name: "Wymiana okien",
    clientName: "Piotr Wiśniewski",
    status: ProjectStatus.COMPLETED,
    totalSteps: 8,
    completedSteps: 8,
    lastClientViewAt: null,
    updatedAt: new Date(Date.now() - 7 * 86400_000)
  }
];

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
  args: { items: mockItems }
});

WithItems.test("Renders table with project rows", async ({ canvas, step }) => {
  await step("Table headers are visible", async () => {
    await expect(canvas.getByText("Nazwa projektu")).toBeVisible();
    await expect(canvas.getByText("Klient")).toBeVisible();
    await expect(canvas.getByText("Status")).toBeVisible();
    await expect(canvas.getByText("Postęp")).toBeVisible();
  });

  await step("Project names are visible", async () => {
    await expect(canvas.getByText("Remont łazienki")).toBeVisible();
    await expect(canvas.getByText("Malowanie salonu")).toBeVisible();
    await expect(canvas.getByText("Wymiana okien")).toBeVisible();
  });

  await step("Client names are visible", async () => {
    await expect(canvas.getByText("Jan Kowalski")).toBeVisible();
    await expect(canvas.getByText("Anna Nowak")).toBeVisible();
    await expect(canvas.getByText("Piotr Wiśniewski")).toBeVisible();
  });

  await step("Status badges are visible", async () => {
    await expect(canvas.getByText("Aktywny")).toBeVisible();
    await expect(canvas.getByText("Szkic")).toBeVisible();
    await expect(canvas.getByText("Zakończony")).toBeVisible();
  });
});
