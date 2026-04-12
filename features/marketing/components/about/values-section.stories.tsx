import { expect } from "storybook/test";

import { ValuesSection } from "./values-section";

import preview from "~/.storybook/preview";

const meta = preview.meta({
  title: "Marketing/About/Values Section",
  component: ValuesSection,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen"
  }
});

export const ValuesSectionStory = meta.story({ name: "Values Section" });

ValuesSectionStory.test("Renders heading and all value names with descriptions", async ({ canvas }) => {
  await expect(canvas.getByRole("heading", { name: "Nasze Wartości" })).toBeVisible();

  await expect(canvas.getByText("Prostota")).toBeVisible();
  await expect(canvas.getByText(/tworzymy narzędzia, których obsługa jest intuicyjna/i)).toBeVisible();

  await expect(canvas.getByText("Szacunek do czasu")).toBeVisible();
  await expect(canvas.getByText(/szanujemy twój czas/i)).toBeVisible();

  await expect(canvas.getByText("Transparentność")).toBeVisible();
  await expect(canvas.getByText(/jasne zasady i przejrzysty proces/i)).toBeVisible();

  await expect(canvas.getByText("Pasja")).toBeVisible();
  await expect(canvas.getByText(/sami jesteśmy twórcami/i)).toBeVisible();
});
