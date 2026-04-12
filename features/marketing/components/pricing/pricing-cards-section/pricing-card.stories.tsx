import { expect, fn } from "storybook/test";
import { PLANS } from "~/features/billing/constants";

import { PricingCard } from "./pricing-card";

import preview from "~/.storybook/preview";

const mockSelectPlan = fn();

const basicPlan = PLANS[0]!;
const standardPlan = PLANS[1]!;

const meta = preview.meta({
  title: "Marketing/Pricing/Pricing Card",
  component: PricingCard,
  tags: ["autodocs"],
  parameters: {
    layout: "centered"
  },
  args: {
    onSelectAction: mockSelectPlan
  }
});

/**
 * Basic plan card with trial badge.
 */
export const BasicPlanCard = meta.story({
  args: {
    plan: basicPlan
  }
});

BasicPlanCard.test("Renders all content and handles CTA click", async ({ canvas, step, userEvent }) => {
  await step("Renders plan name, description, and price", async () => {
    await expect(canvas.getByRole("heading", { name: basicPlan.name })).toBeVisible();
    await expect(canvas.getByText(basicPlan.description)).toBeVisible();
    await expect(canvas.getByText(`${basicPlan.price} PLN`)).toBeVisible();
  });

  await step("Renders all plan features", async () => {
    const featureList = canvas.getByRole("list", { name: `${basicPlan.name} plan features` });
    const items = featureList.querySelectorAll("li");
    await expect(items).toHaveLength(basicPlan.features.length);

    for (const feature of basicPlan.features) {
      await expect(canvas.getByText(feature)).toBeVisible();
    }
  });

  await step("Renders trial CTA button and calls onSelectAction on click", async () => {
    const button = canvas.getByRole("button", { name: /Wyprubuje 14-dniowy trial/i });
    await expect(button).toBeVisible();
    await userEvent.click(button);
    await expect(mockSelectPlan).toHaveBeenCalledWith(basicPlan.id);
  });
});

/**
 * Featured Standard plan card with "Najlepszy wybór" badge.
 */
export const FeaturedPlanCard = meta.story({
  args: {
    plan: standardPlan
  }
});

FeaturedPlanCard.test("Renders featured badge and standard CTA", async ({ canvas, step }) => {
  await step("Renders Najlepszy wybór badge", async () => {
    await expect(canvas.getByText("Najlepszy wybór")).toBeVisible();
  });

  await step("Renders standard CTA button (not trial)", async () => {
    await expect(canvas.getByRole("button", { name: `Wybieram ${standardPlan.name}` })).toBeVisible();
  });
});
