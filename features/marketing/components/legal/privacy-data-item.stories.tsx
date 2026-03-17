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

PrivacyDataItemStory.test("renders title as bold text", async ({ canvas, step }) => {
  await step("Verify title text is visible", async () => {
    const title = canvas.getByText("Dane identyfikacyjne");
    await expect(title).toBeVisible();
  });
});

PrivacyDataItemStory.test("renders description text", async ({ canvas, step }) => {
  await step("Verify description is visible", async () => {
    const description = canvas.getByText("Imię, nazwisko, adres e-mail oraz numer telefonu podane przy rejestracji.");
    await expect(description).toBeVisible();
  });
});

PrivacyDataItemStory.test("renders as a list item element", async ({ canvas, step }) => {
  await step("Verify li element is in the DOM", async () => {
    const listItem = canvas.getByRole("listitem");
    await expect(listItem).toBeInTheDocument();
  });
});
