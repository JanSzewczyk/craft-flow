import { expect } from "storybook/test";
import { PlanId } from "~/features/billing/constants";

import { PlanLimitWidget } from "./plan-limit-widget";

import preview from "~/.storybook/preview";

const meta = preview.meta({
  title: "Features/Contractor/Plan Limit Widget",
  component: PlanLimitWidget,
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    )
  ]
});

export const BasicPlanLowUsage = meta.story({
  name: "Basic Plan — Low Usage",
  args: {
    planId: PlanId.BASIC,
    planName: "Basic",
    activeProjectsCount: 2,
    projectLimit: 5
  }
});

BasicPlanLowUsage.test("Renders correctly", async ({ canvas, step }) => {
  await step("Shows title outside card, plan name, and usage count", async () => {
    await expect(canvas.getByRole("heading", { name: /twój limit/i })).toBeVisible();
    await expect(canvas.getByText("Basic")).toBeVisible();
    await expect(canvas.getByRole("heading", { name: /2 z 5/i })).toBeVisible();
    await expect(canvas.getByText(/aktywnych projektów w tym miesiącu/i)).toBeVisible();
  });

  await step("Shows 'Zmień plan' button and no warning text", async () => {
    await expect(canvas.getByText("Zmień plan")).toBeVisible();
    await expect(canvas.queryByText(/zbliżasz się do limitu/i)).not.toBeInTheDocument();
  });
});

export const StandardPlanNearLimit = meta.story({
  name: "Standard Plan — Near Limit",
  args: {
    planId: PlanId.STANDARD,
    planName: "Standard",
    activeProjectsCount: 17,
    projectLimit: 20
  }
});

StandardPlanNearLimit.test("Renders correctly with near-limit warning", async ({ canvas, step }) => {
  await step("Shows plan name and usage count", async () => {
    await expect(canvas.getByText("Standard")).toBeVisible();
    await expect(canvas.getByRole("heading", { name: /17 z 20/i })).toBeVisible();
  });

  await step("Shows warning text and 'Zmień plan' button", async () => {
    await expect(canvas.getByText(/zbliżasz się do limitu/i)).toBeVisible();
    await expect(canvas.getByText("Zmień plan")).toBeVisible();
  });
});

export const PremiumPlanUnlimited = meta.story({
  name: "Premium Plan — Unlimited",
  args: {
    planId: PlanId.PREMIUM,
    planName: "Premium",
    activeProjectsCount: 42,
    projectLimit: null
  }
});

PremiumPlanUnlimited.test("Renders correctly for unlimited plan", async ({ canvas, step }) => {
  await step("Shows plan name and count without limit fraction", async () => {
    await expect(canvas.getByText("Premium")).toBeVisible();
    await expect(canvas.getByRole("heading", { level: 3 })).toHaveTextContent("42");
    await expect(canvas.getByText(/aktywnych projektów \(bez limitu\)/i)).toBeVisible();
  });
});

PremiumPlanUnlimited.test("Does not render 'Zmień plan' button", async ({ canvas }) => {
  await expect(canvas.queryByText("Zmień plan")).not.toBeInTheDocument();
});
