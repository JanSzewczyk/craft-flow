import { expect } from "storybook/test";

import { HistorySection } from "./history-section";

import preview from "~/.storybook/preview";

const meta = preview.meta({
  title: "Marketing/About/History Section",
  component: HistorySection,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen"
  }
});

export const HistorySectionStory = meta.story({ name: "History Section" });

HistorySectionStory.test("Renders all expected content", async ({ canvas, step }) => {
  await step("Renders story text and image", async () => {
    await expect(canvas.getByText(/craftflow narodziło się z pasji/i)).toBeVisible();
    await expect(canvas.getByRole("img", { name: /artisan workshop with tools/i })).toBeVisible();
  });

  await step("Renders contact button with correct href", async () => {
    const link = canvas.getByRole("link", { name: /skontaktuj się z nami/i });
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute("href", "/contact");
  });
});
