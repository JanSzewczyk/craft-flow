import { expect } from "storybook/test";

import { AboutHeroSection } from "./hero-section";

import preview from "~/.storybook/preview";

const meta = preview.meta({
  title: "Marketing/About/Hero Section",
  component: AboutHeroSection,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen"
  }
});

export const AboutHeroSectionStory = meta.story({ name: "About Hero Section" });

AboutHeroSectionStory.test("Renders all expected content", async ({ canvas }) => {
  await expect(canvas.getByRole("heading", { name: /dlaczego stworzyliśmy craftflow/i })).toBeVisible();

  await expect(canvas.getByText(/przywracamy rzemieślnikom czas na rzemiosło/i)).toBeVisible();

  await expect(canvas.getByText(/the trust builder/i)).toBeVisible();
});
