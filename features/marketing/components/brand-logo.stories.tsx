import { expect } from "storybook/test";

import { BrandLogo } from "./brand-logo";

import preview from "~/.storybook/preview";

const meta = preview.meta({
  title: "Marketing/Brand Logo",
  component: BrandLogo,
  tags: ["autodocs"],
  parameters: {
    layout: "centered"
  }
});

export const BrandLogoStory = meta.story({ name: "Brand Logo" });

BrandLogoStory.test("Renders all expected content", async ({ canvas, step }) => {
  await step("Renders CraftFlow text and icon", async () => {
    await expect(canvas.getByText("CraftFlow")).toBeVisible();
  });

  await step("Link points to home page with SVG icon", async () => {
    const link = canvas.getByRole("link", { name: /craftflow/i });
    await expect(link).toHaveAttribute("href", "/");
    const svg = link.querySelector("svg");
    await expect(svg).toBeInTheDocument();
  });
});
