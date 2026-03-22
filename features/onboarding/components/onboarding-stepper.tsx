"use client";

import { CheckIcon } from "lucide-react";

import {
  Stepper,
  StepperIndicator,
  StepperItem,
  StepperNav,
  StepperTitle,
  StepperTrigger
} from "@szum-tech/design-system";
import { type OnboardingStep, type StepConfig } from "~/features/onboarding/constants/onboarding-steps";

type OnboardingStepperProps = {
  steps: StepConfig[];
  currentStepId: OnboardingStep;
};

export function OnboardingStepper({ steps, currentStepId }: OnboardingStepperProps) {
  const currentIndex = steps.findIndex((s) => s.id === currentStepId);

  return (
    <div className="mb-8">
      <p className="text-muted-foreground text-body-sm mb-4 text-center">
        Krok {currentIndex + 1} z {steps.length}
      </p>
      <Stepper defaultValue={String(currentIndex + 1)}>
        <StepperNav className="pointer-events-none">
          {steps.map((step, index) => (
            <StepperItem key={step.id} value={String(index + 1)}>
              <StepperTrigger>
                <StepperIndicator>
                  {index < currentIndex ? <CheckIcon className="size-4" /> : index + 1}
                </StepperIndicator>
                <StepperTitle>{step.label}</StepperTitle>
              </StepperTrigger>
            </StepperItem>
          ))}
        </StepperNav>
      </Stepper>
    </div>
  );
}
