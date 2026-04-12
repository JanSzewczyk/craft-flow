import { expect } from "storybook/test";

import { PricingCardsSection } from "./pricing-cards-section";

import preview from "~/.storybook/preview";

const meta = preview.meta({
  title: "Marketing/Pricing/Pricing Cards Section",
  component: PricingCardsSection,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen"
  }
});

export const PricingCardsSectionStory = meta.story({ name: "Pricing Cards Section" });

PricingCardsSectionStory.test("Renders all expected content", async ({ canvas, step }) => {
  await step("Renders section heading and description", async () => {
    await expect(canvas.getByRole("heading", { name: /Wybierz plan dla swojego warsztatu/i })).toBeVisible();
    await expect(canvas.getByText(/Wypróbuj plan Basic za darmo przez 14 dni/i)).toBeVisible();
  });

  await step("Renders all three plan names and featured badge", async () => {
    await expect(canvas.getByRole("heading", { name: "Basic" })).toBeVisible();
    await expect(canvas.getByRole("heading", { name: "Standard" })).toBeVisible();
    await expect(canvas.getByRole("heading", { name: "Premium" })).toBeVisible();
    await expect(canvas.getByText("Najlepszy wybór")).toBeVisible();
  });
});
