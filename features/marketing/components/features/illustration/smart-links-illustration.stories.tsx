import { expect } from "storybook/test";

import { SmartLinksIllustration } from "./smart-links-illustration";

import preview from "~/.storybook/preview";

const meta = preview.meta({
  title: "Marketing/Features/Smart Links Illustration",
  component: SmartLinksIllustration,
  tags: ["autodocs"],
  parameters: {
    layout: "centered"
  }
});

export const SmartLinksIllustrationStory = meta.story({ name: "Smart Links" });

SmartLinksIllustrationStory.test("Renders all expected content", async ({ canvas, step }) => {
  await step("Renders portal heading and greeting", async () => {
    await expect(canvas.getByText("Twój Portal Klienta")).toBeVisible();
    await expect(
      canvas.getByText(/Dzień dobry, Panie Marku! Projekt "Stół Dębowy" jest w fazie lakierowania/i)
    ).toBeVisible();
  });

  await step("Renders status label and production badge", async () => {
    await expect(canvas.getByText("Aktualny Status")).toBeVisible();
    await expect(canvas.getByText("Produkcja")).toBeVisible();
  });

  await step("Renders action buttons", async () => {
    await expect(canvas.getByRole("button", { name: "Zobacz zdjęcia" })).toBeVisible();
    await expect(canvas.getByRole("button", { name: "Opłać fakturę" })).toBeVisible();
  });
});
