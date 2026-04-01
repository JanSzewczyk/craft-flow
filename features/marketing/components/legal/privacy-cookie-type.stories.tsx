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

PrivacyCookieTypeStory.test("Renders all expected content", async ({ canvas, step }) => {
  await step("Renders cookie name and description", async () => {
    await expect(canvas.getByText("Niezbędne")).toBeVisible();
    await expect(
      canvas.getByText("Wymagane do prawidłowego funkcjonowania serwisu. Nie można ich wyłączyć.")
    ).toBeVisible();
  });

  await step("Renders container element", async () => {
    const name = canvas.getByText("Niezbędne");
    const container = name.closest("div");
    await expect(container).toBeInTheDocument();
  });
});
