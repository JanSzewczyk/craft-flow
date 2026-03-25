"use client";

import * as React from "react";

import { HandshakeIcon } from "lucide-react";

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

type StepItem = {
  step: string;
  label: string;
};

type OnboardingStepperProps = {
  steps: StepItem[];
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
                <HandshakeIcon className="size-4" />
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
