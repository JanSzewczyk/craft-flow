import { expect, fn, waitFor } from "storybook/test";
import { PlanId, PLANS } from "~/features/billing/constants";

import { OnboardingSummary } from "./onboarding-summary";

import preview from "~/.storybook/preview";

const premiumPlan = PLANS.find((p) => p.id === PlanId.PREMIUM)!;
const basicPlan = PLANS.find((p) => p.id === PlanId.BASIC)!;

const baseOnboardingState = {
  contractorId: "contractor-1",
  currentStep: "/onboarding/summary",
  completed: false,
  completedAt: null,
  updatedAt: new Date("2024-01-15T10:00:00Z"),
  createdAt: new Date("2024-01-15T09:00:00Z")
};

const fullOnboardingState = {
  ...baseOnboardingState,
  companyDetails: {
    companyName: "Stolarnia u Jana",
    industry: "stolarstwo",
    phone: "+48 123 456 789",
    email: "jan@stolarnia.pl",
    nip: null,
    regon: null,
    address: null
  },
  branding: {
    brandColor: "#2563EB",
    logoUrl: null
  },
  templateConfig: {
    name: "Mój szablon",
    description: null,
    steps: [
      { title: "Wycena", description: null },
      { title: "Pomiary", description: null },
      { title: "Realizacja", description: null }
    ]
  },
  emailConfig: {
    emailSubject: "Witamy w naszym portalu",
    emailBody: "Drogi kliencie, witamy w systemie."
  }
};

const basicOnboardingState = {
  ...baseOnboardingState,
  companyDetails: {
    companyName: "Mała Firma",
    industry: "construction",
    phone: "+48 987 654 321",
    email: "kontakt@malafirma.pl",
    nip: null,
    regon: null,
    address: null
  },
  branding: null,
  templateConfig: {
    name: "Standardowy szablon",
    description: null,
    steps: [
      { title: "Wycena", description: null },
      { title: "Realizacja", description: null }
    ]
  },
  emailConfig: null
};

const meta = preview.meta({
  title: "Features/Onboarding/Onboarding Summary",
  component: OnboardingSummary,
  parameters: {
    layout: "padded"
  },
  args: {
    onFinalizeAction: fn(async () => ({ success: true as const, data: null })) as never,
    onBackAction: fn()
  }
});

export const AllFeatures = meta.story({
  args: {
    plan: premiumPlan,
    planFeatures: { branding: true, whitelabelEmails: true },
    onboardingState: fullOnboardingState
  }
});

AllFeatures.test("Renders all expected content", async ({ canvas }) => {
  await expect(canvas.getByText("Stolarnia u Jana")).toBeVisible();
  await expect(canvas.getByText("Stolarstwo")).toBeVisible();
  await expect(canvas.getByText("Premium")).toBeVisible();
  await expect(canvas.getByText("Wygląd Portalu")).toBeVisible();
  await expect(canvas.getByText("Proces Pracy")).toBeVisible();
  await expect(canvas.getByText("Komunikacja")).toBeVisible();
  await expect(canvas.getByRole("button", { name: /uruchom projekt/i })).toBeVisible();
  await expect(canvas.getByRole("button", { name: /wróć/i })).toBeVisible();
});

AllFeatures.test("Template steps are visible in the summary", async ({ canvas }) => {
  await expect(canvas.getByText("Wycena")).toBeVisible();
  await expect(canvas.getByText("Pomiary")).toBeVisible();
  await expect(canvas.getByText("Realizacja")).toBeVisible();
});

AllFeatures.test("Clicking Uruchom projekt calls onFinalizeAction", async ({ canvas, userEvent, args }) => {
  const finalizeButton = canvas.getByRole("button", { name: /uruchom projekt/i });
  await userEvent.click(finalizeButton);

  await waitFor(async () => {
    await expect(args.onFinalizeAction).toHaveBeenCalledOnce();
  });
});

AllFeatures.test("Clicking Wróć calls onBackAction", async ({ canvas, userEvent, args }) => {
  const backButton = canvas.getByRole("button", { name: /wróć/i });
  await userEvent.click(backButton);
  await waitFor(async () => {
    await expect(args.onBackAction).toHaveBeenCalledOnce();
  });
});

export const BasicPlan = meta.story({
  args: {
    plan: basicPlan,
    planFeatures: { branding: false, whitelabelEmails: false },
    onboardingState: basicOnboardingState
  }
});

BasicPlan.test("Renders company name and Basic plan badge", async ({ canvas }) => {
  await expect(canvas.getByText("Mała Firma")).toBeVisible();
  await expect(canvas.getByText("Basic")).toBeVisible();
});

BasicPlan.test("Branding section is not visible for basic plan", async ({ canvas }) => {
  const brandingSection = canvas.queryByText("Wygląd Portalu");
  await expect(brandingSection).toBeNull();
});

BasicPlan.test("Email section is not visible for basic plan", async ({ canvas }) => {
  const emailSection = canvas.queryByText("Komunikacja");
  await expect(emailSection).toBeNull();
});

BasicPlan.test("Template section is still visible for basic plan", async ({ canvas }) => {
  await expect(canvas.getByText("Proces Pracy")).toBeVisible();
});

BasicPlan.test("Clicking Wróć calls onBackAction", async ({ canvas, userEvent, args }) => {
  const backButton = canvas.getByRole("button", { name: /wróć/i });
  await userEvent.click(backButton);
  await waitFor(async () => {
    await expect(args.onBackAction).toHaveBeenCalledOnce();
  });
});
