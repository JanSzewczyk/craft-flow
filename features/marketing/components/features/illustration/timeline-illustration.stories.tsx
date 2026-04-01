import { expect } from "storybook/test";

import preview from "~/.storybook/preview";

import { TimelineIllustration } from "./timeline-illustration";

const meta = preview.meta({
  title: "Marketing/Features/Timeline Illustration",
  component: TimelineIllustration,
  tags: ["autodocs"],
  parameters: {
    layout: "centered"
  }
});

export const TimelineIllustrationStory = meta.story({ name: "Timeline" });

TimelineIllustrationStory.test("Renders all expected content", async ({ canvas, step }) => {
  await step("Renders heading and browser URL bar", async () => {
    await expect(canvas.getByText("Oś Czasu Projektu")).toBeVisible();
    await expect(canvas.getByText("app.craftflow.pl/projekty/renowacja-biurka")).toBeVisible();
  });

  await step("Renders completed step", async () => {
    await expect(canvas.getByText("Czyszczenie i szlifowanie")).toBeVisible();
    await expect(canvas.getByText("Wczoraj")).toBeVisible();
  });

  await step("Renders in-progress step", async () => {
    await expect(canvas.getByText(/Nakładanie bejcy \(W trakcie\)/i)).toBeVisible();
    await expect(canvas.getByText("Status: Klient oczekuje na zdjęcia")).toBeVisible();
  });

  await step("Renders action button", async () => {
    await expect(canvas.getByRole("button", { name: "Zakończ etap" })).toBeVisible();
  });
});
