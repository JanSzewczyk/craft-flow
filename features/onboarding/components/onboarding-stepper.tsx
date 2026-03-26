"use client";

import * as React from "react";

import { BuildingIcon, LayoutTemplateIcon, MailIcon, PaletteIcon, SparklesIcon } from "lucide-react";

import {
  Stepper,
  StepperIndicator,
  StepperItem,
  StepperNav,
  StepperPanel,
  StepperTitle,
  StepperTrigger
} from "@szum-tech/design-system";
import { usePathname, useRouter } from "next/navigation";
import { type StepConfig } from "~/features/onboarding/server";

import { OnboardingStep } from "../constants";

type OnboardingStepperProps = {
  steps: Array<StepConfig>;
  children: React.ReactNode;
};

export function OnboardingStepper({ steps, children }: OnboardingStepperProps) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <Stepper value={pathname} onValueChange={(value) => router.push(value)}>
      <StepperNav aria-label="Onboarding stepper">
        {steps.map((item) => (
          <StepperItem key={item.step} value={item.step}>
            <StepperTrigger>
              <StepperIndicator>
                {item.step === OnboardingStep.COMPANY_DETAILS ? (
                  <BuildingIcon className="size-4" />
                ) : item.step === OnboardingStep.BRANDING ? (
                  <PaletteIcon className="size-4" />
                ) : item.step === OnboardingStep.TEMPLATE ? (
                  <LayoutTemplateIcon className="size-4" />
                ) : item.step === OnboardingStep.EMAIL ? (
                  <MailIcon className="size-4" />
                ) : item.step === OnboardingStep.SUMMARY ? (
                  <SparklesIcon className="size-4" />
                ) : null}
              </StepperIndicator>
              <StepperTitle>{item.label}</StepperTitle>
            </StepperTrigger>
          </StepperItem>
        ))}
      </StepperNav>

      <StepperPanel className="mt-8">{children}</StepperPanel>
    </Stepper>
  );
}
