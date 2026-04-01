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

PrivacyRightItemStory.test("Renders all expected content", async ({ canvas, step }) => {
  await step("Renders title and description", async () => {
    await expect(canvas.getByText("Prawo dostępu")).toBeVisible();
    await expect(
      canvas.getByText(
        "Masz prawo uzyskać informację, czy przetwarzamy Twoje dane osobowe, a jeśli tak – uzyskać do nich dostęp."
      )
    ).toBeVisible();
  });

  await step("Renders icon wrapper element", async () => {
    const title = canvas.getByText("Prawo dostępu");
    const titleContainer = title.closest("div");
    await expect(titleContainer).toBeInTheDocument();
    const icon = titleContainer?.querySelector("span[aria-hidden]");
    await expect(icon).toBeInTheDocument();
  });
});
