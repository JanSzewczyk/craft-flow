import { expect } from "storybook/test";

import { BrandLogo, CraftFlowLogo } from "./brand-logo";

import preview from "~/.storybook/preview";

const meta = preview.meta({
  title: "Components/UI/Brand Logo",
  parameters: {
    layout: "centered"
  }
});

export const BrandLogoStory = meta.story({
  name: "Brand Logo",
  render: () => <BrandLogo />
});

BrandLogoStory.test("Renders CraftFlow text", async ({ canvas }) => {
  const text = canvas.getByText("CraftFlow");
  await expect(text).toBeVisible();
});

BrandLogoStory.test("Renders SVG icon", async ({ canvasElement }) => {
  const svg = canvasElement.querySelector("svg");
  await expect(svg).toBeInTheDocument();
});

export const CraftFlowLogoStory = meta.story({
  name: "CraftFlow Logo",
  render: () => <CraftFlowLogo />
});

CraftFlowLogoStory.test("Renders SVG icon", async ({ canvasElement }) => {
  const svg = canvasElement.querySelector("svg");
  await expect(svg).toBeInTheDocument();
});

CraftFlowLogoStory.test("Does not render CraftFlow text", async ({ canvas }) => {
  const text = canvas.queryByText("CraftFlow");
  await expect(text).not.toBeInTheDocument();
});
