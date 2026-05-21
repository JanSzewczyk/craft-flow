import { expect } from "storybook/test";

import { ClientProjectsEmptyState } from "./client-projects-empty-state";

import preview from "~/.storybook/preview";

const meta = preview.meta({
  title: "Features/CRM/Portal/Client Projects Empty State",
  component: ClientProjectsEmptyState,
  parameters: {
    layout: "padded"
  }
});

export const Active = meta.story({
  args: {
    context: "active"
  }
});

Active.test("Renders title and description for active context", async ({ canvas }) => {
  await expect(canvas.getByText("Brak aktywnych projektów")).toBeVisible();
  await expect(
    canvas.getByText("Nie masz żadnych aktywnych projektów. Skontaktuj się z wykonawcą, aby rozpocząć nową realizację.")
  ).toBeVisible();
});

export const History = meta.story({
  args: {
    context: "history"
  }
});

History.test("Renders title and description for history context", async ({ canvas }) => {
  await expect(canvas.getByText("Brak projektów w historii")).toBeVisible();
  await expect(canvas.getByText("Zakończone i zarchiwizowane projekty będą widoczne tutaj.")).toBeVisible();
});
