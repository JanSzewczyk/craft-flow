import { expect } from "storybook/test";
import { CONTACT_FAQ_ITEMS } from "~/features/contact/constants/contact-faq-items";

import { ContactFAQ } from "./contact-faq";

import preview from "~/.storybook/preview";

const meta = preview.meta({
  title: "Contact/Contact FAQ",
  component: ContactFAQ,
  parameters: {
    layout: "padded"
  }
});

export const FAQ = meta.story({ name: "Contact FAQ" });

FAQ.test(
  "Renders all FAQ items, expands on click, and accordion state changes correctly",
  async ({ canvas, step, userEvent }) => {
    const firstItem = CONTACT_FAQ_ITEMS[0];
    const secondItem = CONTACT_FAQ_ITEMS[1];

    if (!firstItem || !secondItem) {
      throw new Error("CONTACT_FAQ_ITEMS must have at least 2 items");
    }

    await step("Renders all FAQ question triggers", async () => {
      for (const item of CONTACT_FAQ_ITEMS) {
        const trigger = canvas.getByText(item.question);
        await expect(trigger).toBeVisible();
      }
    });

    await step("All accordion items are initially closed", async () => {
      const accordionItems = canvas.getAllByRole("button");
      for (const trigger of accordionItems) {
        await expect(trigger).toHaveAttribute("aria-expanded", "false");
      }
    });

    await step("Clicking a question expands its answer", async () => {
      const firstTrigger = canvas.getByText(firstItem.question);
      await userEvent.click(firstTrigger);

      await expect(firstTrigger.closest("button")).toHaveAttribute("aria-expanded", "true");
      const firstAnswer = canvas.getByText(firstItem.answer);
      await expect(firstAnswer).toBeInTheDocument();
    });

    await step("Clicking another question expands it (only one open at a time)", async () => {
      const secondTrigger = canvas.getByText(secondItem.question);
      await userEvent.click(secondTrigger);

      await expect(secondTrigger.closest("button")).toHaveAttribute("aria-expanded", "true");

      const firstTrigger = canvas.getByText(firstItem.question);
      await expect(firstTrigger.closest("button")).toHaveAttribute("aria-expanded", "false");
    });

    await step("Clicking the open question again collapses it", async () => {
      const secondTrigger = canvas.getByText(secondItem.question);
      await userEvent.click(secondTrigger);

      await expect(secondTrigger.closest("button")).toHaveAttribute("aria-expanded", "false");
    });

    await step("FAQ triggers are keyboard accessible", async () => {
      const firstTrigger = canvas.getByText(firstItem.question).closest("button");
      if (firstTrigger) {
        firstTrigger.focus();
        await expect(firstTrigger).toHaveFocus();
      }
    });
  }
);
