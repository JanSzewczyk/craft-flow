import { expect } from "storybook/test";

import { PrivacyPartnerItem } from "./privacy-partner-item";

import preview from "~/.storybook/preview";

const meta = preview.meta({
  title: "Marketing/Legal/Privacy Partner Item",
  component: PrivacyPartnerItem,
  args: {
    name: "Clerk",
    category: "Autentykacja"
  },
  parameters: {
    layout: "padded"
  }
});

export const PrivacyPartnerItemStory = meta.story({ name: "Privacy Partner Item" });

PrivacyPartnerItemStory.test("Renders partner name and category", async ({ canvas, step }) => {
  await step("Renders partner name and category label", async () => {
    await expect(canvas.getByText("Clerk")).toBeVisible();
    await expect(canvas.getByText("Autentykacja")).toBeVisible();
  });
});
