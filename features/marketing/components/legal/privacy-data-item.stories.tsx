import { DatabaseIcon } from "lucide-react";

import { expect } from "storybook/test";

import { PrivacyDataItem } from "./privacy-data-item";

import preview from "~/.storybook/preview";

const meta = preview.meta({
  title: "Marketing/Legal/Privacy Data Item",
  component: PrivacyDataItem,
  args: {
    icon: <DatabaseIcon className="size-5" />,
    title: "Dane identyfikacyjne",
    description: "Imię, nazwisko, adres e-mail oraz numer telefonu podane przy rejestracji."
  },
  decorators: [
    (Story) => (
      <ul>
        <Story />
      </ul>
    )
  ],
  parameters: {
    layout: "padded"
  }
});

export const PrivacyDataItemStory = meta.story({ name: "Privacy Data Item" });

PrivacyDataItemStory.test("Renders all expected content", async ({ canvas, step }) => {
  await step("Renders title and description", async () => {
    await expect(canvas.getByText("Dane identyfikacyjne")).toBeVisible();
    await expect(
      canvas.getByText("Imię, nazwisko, adres e-mail oraz numer telefonu podane przy rejestracji.")
    ).toBeVisible();
  });

  await step("Renders as a list item element", async () => {
    const listItem = canvas.getByRole("listitem");
    await expect(listItem).toBeInTheDocument();
  });
});
