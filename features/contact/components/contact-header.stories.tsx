import { expect } from "storybook/test";

import { ContactHeader } from "./contact-header";

import preview from "~/.storybook/preview";

const meta = preview.meta({
  title: "Contact/Contact Header",
  component: ContactHeader,
  args: {
    title: "Skontaktuj się z nami",
    description: "Masz pytania? Nasz zespół jest gotowy, aby Ci pomóc. Napisz do nas, a odpowiemy w ciągu 24 godzin."
  },
  parameters: {
    layout: "fullscreen"
  }
});

export const Header = meta.story({ name: "Contact Header" });

Header.test("Renders title and description", async ({ canvas, args, step }) => {
  await step("Renders the heading with provided title", async () => {
    const heading = canvas.getByRole("heading", { level: 1 });
    await expect(heading).toBeVisible();
    await expect(heading).toHaveTextContent(args.title);
  });

  await step("Renders the description paragraph", async () => {
    const description = canvas.getByText(args.description);
    await expect(description).toBeVisible();
  });

  await step("Heading is accessible with correct role", async () => {
    const heading = canvas.getByRole("heading", { level: 1 });
    await expect(heading).toHaveAccessibleName(args.title);
  });

  await step("Title and description are rendered as distinct elements", async () => {
    const heading = canvas.getByRole("heading", { level: 1 });
    const description = canvas.getByText(args.description);
    await expect(heading).not.toBe(description);
  });
});
