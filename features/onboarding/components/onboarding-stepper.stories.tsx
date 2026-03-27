import { expect } from "storybook/test";
import { OnboardingStep } from "~/features/onboarding/constants/onboarding-steps";

import { OnboardingStepper } from "./onboarding-stepper";

import preview from "~/.storybook/preview";

const meta = preview.meta({
  title: "Features/Onboarding/Onboarding Stepper",
  component: OnboardingStepper,
  parameters: {
    layout: "padded",
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: "/onboarding/company-details"
      }
    }
  },
  args: {
    children: "Step content"
  }
});

export const FirstStep = meta.story({
  args: {
    steps: [
      { step: OnboardingStep.COMPANY_DETAILS, label: "Firma" },
      { step: OnboardingStep.TEMPLATE, label: "Szablony" },
      { step: OnboardingStep.SUMMARY, label: "Podsumowanie" }
    ]
  },
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: "/onboarding/company-details"
      }
    }
  }
});

FirstStep.test("Renders all expected step labels", async ({ canvas }) => {
  await expect(canvas.getByText("Firma")).toBeVisible();
  await expect(canvas.getByText("Szablony")).toBeVisible();
  await expect(canvas.getByText("Podsumowanie")).toBeVisible();
});

FirstStep.test("Stepper navigation has correct aria-label", async ({ canvas }) => {
  const nav = canvas.getByLabelText("Onboarding stepper");
  await expect(nav).toBeVisible();
});

FirstStep.test("Children content is rendered inside stepper panel", async ({ canvas }) => {
  await expect(canvas.getByText("Step content")).toBeVisible();
});

export const TemplateStep = meta.story({
  args: {
    steps: [
      { step: OnboardingStep.COMPANY_DETAILS, label: "Firma" },
      { step: OnboardingStep.TEMPLATE, label: "Szablony" },
      { step: OnboardingStep.SUMMARY, label: "Podsumowanie" }
    ]
  },
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: "/onboarding/template"
      }
    }
  }
});

export const WithAllSteps = meta.story({
  args: {
    steps: [
      { step: OnboardingStep.COMPANY_DETAILS, label: "Firma" },
      { step: OnboardingStep.BRANDING, label: "Branding" },
      { step: OnboardingStep.TEMPLATE, label: "Szablony" },
      { step: OnboardingStep.EMAIL, label: "E-mail" },
      { step: OnboardingStep.SUMMARY, label: "Podsumowanie" }
    ]
  },
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: "/onboarding/branding"
      }
    }
  }
});

WithAllSteps.test("Renders all five step labels", async ({ canvas }) => {
  await expect(canvas.getByText("Firma")).toBeVisible();
  await expect(canvas.getByText("Branding")).toBeVisible();
  await expect(canvas.getByText("Szablony")).toBeVisible();
  await expect(canvas.getByText("E-mail")).toBeVisible();
  await expect(canvas.getByText("Podsumowanie")).toBeVisible();
});
