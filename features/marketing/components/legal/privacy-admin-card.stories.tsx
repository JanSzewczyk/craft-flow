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

PrivacyAdminCardStory.test("renders company name as heading", async ({ canvas, step }) => {
  await step("Verify h3 heading renders with company name", async () => {
    const heading = canvas.getByRole("heading", { level: 3 });
    await expect(heading).toBeVisible();
    await expect(heading).toHaveTextContent("Craft Flow Sp. z o.o.");
  });
});

PrivacyAdminCardStory.test("renders address and NIP", async ({ canvas, step }) => {
  await step("Verify address text is visible", async () => {
    const address = canvas.getByText("ul. Przykładowa 1, 00-001 Warszawa");
    await expect(address).toBeVisible();
  });

  await step("Verify NIP label is visible", async () => {
    const nip = canvas.getByText("NIP: 123-456-78-90");
    await expect(nip).toBeVisible();
  });
});

PrivacyAdminCardStory.test("renders email link with mailto href", async ({ canvas, step }) => {
  await step("Verify email link is present and has correct href", async () => {
    const link = canvas.getByRole("link");
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute("href", "mailto:privacy@craftflow.pl");
    await expect(link).toHaveTextContent("privacy@craftflow.pl");
  });
});
