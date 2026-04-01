import { expect } from "storybook/test";

import preview from "~/.storybook/preview";

import { PricingFAQ } from "./pricing-faq";

const meta = preview.meta({
  title: "Marketing/Pricing/FAQ",
  component: PricingFAQ,
  tags: ["autodocs"],
  parameters: {
    layout: "centered"
  }
});

export const PricingFAQStory = meta.story({ name: "FAQ" });

PricingFAQStory.test(
  "Renders all FAQ questions, expands on click, and collapses correctly",
  async ({ canvas, step, userEvent }) => {
    await step("Renders all FAQ question triggers", async () => {
      await expect(canvas.getByText("Czy mogę zrezygnować w dowolnym momencie?")).toBeVisible();
      await expect(canvas.getByText("Jak działa darmowy trial?")).toBeVisible();
      await expect(canvas.getByText("Czy mój klient musi zakładać konto?")).toBeVisible();
      await expect(canvas.getByText("Czy mogę zmienić plan w trakcie trwania subskrypcji?")).toBeVisible();
      await expect(canvas.getByText("Jakie metody płatności są obsługiwane?")).toBeVisible();
      await expect(canvas.getByText("Czy moje dane są bezpieczne?")).toBeVisible();
      await expect(canvas.getByText("Co się stanie po zakończeniu 14-dniowego trialu?")).toBeVisible();
    });

    await step("Clicking a question expands its answer", async () => {
      const trigger = canvas.getByText("Jak działa darmowy trial?");
      await userEvent.click(trigger);
      await expect(canvas.getByText(/Darmowy trial 14-dniowy dotyczy wyłącznie planu Basic/i)).toBeVisible();
    });

    await step("Clicking the same question again collapses it", async () => {
      const trigger = canvas.getByText("Jak działa darmowy trial?");
      await userEvent.click(trigger);
      const content = canvas.queryByText(/Darmowy trial 14-dniowy dotyczy wyłącznie planu Basic/i);
      await expect(content).not.toBeVisible();
    });
  }
);
