import { expect } from "storybook/test";

import { CreateTemplateCard } from "./create-template-card";

import preview from "~/.storybook/preview";

const meta = preview.meta({
  title: "Features/Templates/Create Template Card",
  component: CreateTemplateCard,
  parameters: {
    layout: "centered",
    nextjs: { appDirectory: true }
  }
});

export const CreateTemplateCardStory = meta.story({ name: "Create Template Card" });

CreateTemplateCardStory.test("Renders all expected content", async ({ canvas, step }) => {
  await step("Title and description are visible", async () => {
    await expect(canvas.getByText("Nowy Szablon")).toBeVisible();
    await expect(canvas.getByText("Złóż kilka etapów dla swoich standardowych projektów.")).toBeVisible();
  });

  await step("Link navigates to create page", async () => {
    const link = canvas.getByRole("link", { name: /nowy szablon/i });
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute("href", "/app/templates/create");
  });
});
