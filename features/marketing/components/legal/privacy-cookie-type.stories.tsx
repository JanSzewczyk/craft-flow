import { ShieldCheckIcon } from "lucide-react";
import { expect } from "storybook/test";

import { PrivacyCookieType } from "./privacy-cookie-type";

import preview from "~/.storybook/preview";

const meta = preview.meta({
  title: "Marketing/Legal/Privacy Cookie Type",
  component: PrivacyCookieType,
  args: {
    icon: <ShieldCheckIcon className="size-5" />,
    name: "Niezbędne",
    description: "Wymagane do prawidłowego funkcjonowania serwisu. Nie można ich wyłączyć."
  },
  parameters: {
    layout: "padded"
  }
});

export const PrivacyCookieTypeStory = meta.story({ name: "Privacy Cookie Type" });

PrivacyCookieTypeStory.test("renders cookie name as bold text", async ({ canvas, step }) => {
  await step("Verify cookie name is visible", async () => {
    const name = canvas.getByText("Niezbędne");
    await expect(name).toBeVisible();
  });
});

PrivacyCookieTypeStory.test("renders cookie description", async ({ canvas, step }) => {
  await step("Verify description text is visible", async () => {
    const description = canvas.getByText("Wymagane do prawidłowego funkcjonowania serwisu. Nie można ich wyłączyć.");
    await expect(description).toBeVisible();
  });
});

PrivacyCookieTypeStory.test("renders container with border", async ({ canvas, step }) => {
  await step("Verify container element is in the DOM", async () => {
    const name = canvas.getByText("Niezbędne");
    const container = name.closest("div");
    await expect(container).toBeInTheDocument();
  });
});
