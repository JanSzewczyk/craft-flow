import { expect } from "storybook/test";

import preview from "~/.storybook/preview";

import { FeaturesHero } from "./features-hero";

const meta = preview.meta({
  title: "Marketing/Features/Features Hero",
  component: FeaturesHero,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen"
  }
});

export const FeaturesHeroStory = meta.story({ name: "Features Hero" });

FeaturesHeroStory.test("Renders all expected content", async ({ canvas }) => {
  await expect(canvas.getByRole("heading", { name: /funkcje stworzone dla twojego warsztatu/i })).toBeVisible();

  await expect(canvas.getByText("Portal Klienta")).toBeVisible();
  await expect(canvas.getByText("Zarządzanie Projektami")).toBeVisible();
  await expect(canvas.getByText("Branding Firmowy")).toBeVisible();
});
