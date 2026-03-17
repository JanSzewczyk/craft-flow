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

PrivacyPartnerItemStory.test("renders partner name", async ({ canvas, step }) => {
  await step("Verify partner name is visible", async () => {
    const name = canvas.getByText("Clerk");
    await expect(name).toBeVisible();
  });
});

PrivacyPartnerItemStory.test("renders partner category label", async ({ canvas, step }) => {
  await step("Verify category label is visible", async () => {
    const category = canvas.getByText("Autentykacja");
    await expect(category).toBeVisible();
  });
});
