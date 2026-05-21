import { expect } from "storybook/test";

import { ContractorsEmptyState } from "./contractors-empty-state";

import preview from "~/.storybook/preview";

const meta = preview.meta({
  title: "Features/CRM/Portal/Contractors Empty State",
  component: ContractorsEmptyState,
  parameters: {
    layout: "padded"
  }
});

export const ContractorsEmptyStateStory = meta.story({ name: "Contractors Empty State" });

ContractorsEmptyStateStory.test("Renders title and description", async ({ canvas }) => {
  await expect(canvas.getByText("Brak wykonawców")).toBeVisible();
  await expect(
    canvas.getByText(
      "Nie masz jeszcze żadnych wykonawców. Projekty mogą być inicjowane wyłącznie przez wykonawców — skontaktuj się bezpośrednio ze swoim fachowcem."
    )
  ).toBeVisible();
});
