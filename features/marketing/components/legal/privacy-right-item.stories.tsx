import { EyeIcon } from "lucide-react";

import { expect } from "storybook/test";

import { PrivacyRightItem } from "./privacy-right-item";

import preview from "~/.storybook/preview";

const meta = preview.meta({
  title: "Marketing/Legal/Privacy Right Item",
  component: PrivacyRightItem,
  args: {
    icon: <EyeIcon className="size-4" />,
    title: "Prawo dostępu",
    description:
      "Masz prawo uzyskać informację, czy przetwarzamy Twoje dane osobowe, a jeśli tak – uzyskać do nich dostęp."
  },
  parameters: {
    layout: "padded"
  }
});

export const PrivacyRightItemStory = meta.story({ name: "Privacy Right Item" });

PrivacyRightItemStory.test("renders title text", async ({ canvas, step }) => {
  await step("Verify title is visible", async () => {
    const title = canvas.getByText("Prawo dostępu");
    await expect(title).toBeVisible();
  });
});

PrivacyRightItemStory.test("renders description text", async ({ canvas, step }) => {
  await step("Verify description is visible", async () => {
    const description = canvas.getByText(
      "Masz prawo uzyskać informację, czy przetwarzamy Twoje dane osobowe, a jeśli tak – uzyskać do nich dostęp."
    );
    await expect(description).toBeVisible();
  });
});

PrivacyRightItemStory.test("renders icon wrapper element", async ({ canvas, step }) => {
  await step("Verify icon span is present in the DOM", async () => {
    const title = canvas.getByText("Prawo dostępu");
    const titleContainer = title.closest("div");
    await expect(titleContainer).toBeInTheDocument();
    const icon = titleContainer?.querySelector("span[aria-hidden]");
    await expect(icon).toBeInTheDocument();
  });
});
