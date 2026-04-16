import { expect } from "storybook/test";

import { CreateTemplateButton } from "./create-template-button";

import preview from "~/.storybook/preview";

const meta = preview.meta({
  title: "Features/Templates/Create Template Button",
  component: CreateTemplateButton,
  parameters: {
    layout: "centered",
    nextjs: { appDirectory: true }
  }
});

export const BelowLimit = meta.story({
  args: {
    limits: { used: 2, max: 5 }
  }
});

BelowLimit.test("Renders an active link button below the limit", async ({ canvas }) => {
  const link = canvas.getByRole("link", { name: /utwórz nowy szablon/i });
  await expect(link).toBeVisible();
});

export const NoLimit = meta.story({
  args: {
    limits: { used: 10, max: null }
  }
});

NoLimit.test("Renders active button when plan has no template limit", async ({ canvas }) => {
  const link = canvas.getByRole("link", { name: /utwórz nowy szablon/i });
  await expect(link).toBeVisible();
});

export const AtLimit = meta.story({
  args: {
    limits: { used: 5, max: 5 }
  }
});

AtLimit.test("Renders a disabled button at the limit", async ({ canvas }) => {
  const button = canvas.getByRole("button", { name: /utwórz nowy szablon/i });
  await expect(button).toBeDisabled();
});
