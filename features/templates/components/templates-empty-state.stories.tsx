import { expect } from "storybook/test";

import preview from "~/.storybook/preview";

import { TemplatesEmptyState } from "./templates-empty-state";

const meta = preview.meta({
  title: "Features/Templates/Templates Empty State",
  component: TemplatesEmptyState,
  parameters: {
    layout: "centered",
    nextjs: { appDirectory: true }
  }
});

export const TemplatesEmptyStateStory = meta.story({ name: "Templates Empty State" });

TemplatesEmptyStateStory.test("Renders all expected content", async ({ canvas, step }) => {
  await step("Heading and description are visible", async () => {
    await expect(canvas.getByText("Brak szablonów")).toBeVisible();
    await expect(
      canvas.getByText("Stwórz swój pierwszy szablon etapów, aby przyspieszyć tworzenie projektów.")
    ).toBeVisible();
  });

  await step("Create button link is visible", async () => {
    const link = canvas.getByRole("link", { name: /utwórz pierwszy szablon/i });
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute("href", "/app/templates/create");
  });
});
