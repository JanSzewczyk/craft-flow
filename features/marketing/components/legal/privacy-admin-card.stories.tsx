import { expect } from "storybook/test";

import { PrivacyAdminCard } from "./privacy-admin-card";

import preview from "~/.storybook/preview";

const meta = preview.meta({
  title: "Marketing/Legal/Privacy Admin Card",
  component: PrivacyAdminCard,
  args: {
    companyName: "Craft Flow Sp. z o.o.",
    address: "ul. Przykładowa 1, 00-001 Warszawa",
    nip: "123-456-78-90",
    email: "privacy@craftflow.pl"
  },
  parameters: {
    layout: "padded"
  }
});

export const PrivacyAdminCardStory = meta.story({ name: "Privacy Admin Card" });

PrivacyAdminCardStory.test("Renders all expected content", async ({ canvas, step }) => {
  await step("Renders company name as heading", async () => {
    const heading = canvas.getByRole("heading", { level: 3 });
    await expect(heading).toBeVisible();
    await expect(heading).toHaveTextContent("Craft Flow Sp. z o.o.");
  });

  await step("Renders address, NIP, and email link", async () => {
    await expect(canvas.getByText("ul. Przykładowa 1, 00-001 Warszawa")).toBeVisible();
    await expect(canvas.getByText("NIP: 123-456-78-90")).toBeVisible();

    const link = canvas.getByRole("link");
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute("href", "mailto:privacy@craftflow.pl");
    await expect(link).toHaveTextContent("privacy@craftflow.pl");
  });
});
