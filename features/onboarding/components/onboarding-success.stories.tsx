import { expect, waitFor } from "storybook/test";
import { PLANS } from "~/features/billing/constants";

import { OnboardingSuccess } from "./onboarding-success";

import preview from "~/.storybook/preview";

const premiumPlan = PLANS.find((p) => p.id === "premium")!;
const basicPlan = PLANS.find((p) => p.id === "basic")!;

const meta = preview.meta({
  title: "Features/Onboarding/Onboarding Success",
  component: OnboardingSuccess,
  parameters: {
    layout: "fullscreen"
  }
});

export const AllFeatures = meta.story({
  name: "All Features",
  args: {
    plan: premiumPlan,
    features: { branding: true, whitelabelEmails: true },
    companyName: "Stolarnia u Jana",
    hasBranding: true,
    hasEmail: true,
    templateCount: 5
  }
});

AllFeatures.test("Renders all expected content", async ({ canvas }) => {
  await waitFor(async () => {
    await expect(canvas.getByRole("heading", { name: /Twój warsztat jest gotowy!/i })).toBeVisible();
    await expect(canvas.getByRole("link", { name: /Otwórz Dashboard/ })).toBeVisible();
    await expect(canvas.getByText(/Stworzyliśmy dla Ciebie Projekt Demo/)).toBeVisible();
    await expect(canvas.getByText("Premium")).toBeVisible();
    await expect(canvas.getByText("Stolarnia u Jana")).toBeVisible();
    await expect(canvas.getByText("Skonfigurowano")).toBeVisible();
    await expect(canvas.getByText("5 etapów gotowych")).toBeVisible();
    await expect(canvas.getByText("Szablon zapisany")).toBeVisible();
    await expect(canvas.getByRole("link", { name: /Przejdź do konfiguracji warsztatu/i })).toBeVisible();
  });
});

export const BasicPlan = meta.story({
  name: "Basic Plan",
  args: {
    plan: basicPlan,
    features: { branding: false, whitelabelEmails: false },
    companyName: "Warsztat ABC",
    hasBranding: false,
    hasEmail: false,
    templateCount: 3
  }
});

BasicPlan.test("Renders basic plan content without branding and email steps", async ({ canvas }) => {
  await waitFor(async () => {
    await expect(canvas.getByText("Basic")).toBeVisible();
    await expect(canvas.getByText("Warsztat ABC")).toBeVisible();
    await expect(canvas.getByText("3 etapów gotowych")).toBeVisible();
    // Branding and email steps are hidden for basic plan (features.branding = false, features.whitelabelEmails = false)
    await expect(canvas.queryByText("Skonfigurowano")).toBeNull();
    await expect(canvas.queryByText("Szablon zapisany")).toBeNull();
  });
});
