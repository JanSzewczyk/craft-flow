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
import { OnboardingStep } from "~/features/onboarding/constants/onboarding-steps";

type OnboardingStepperProps = {
  children: React.ReactNode;
};

export function OnboardingStepper({ children }: OnboardingStepperProps) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <Stepper value={pathname} onValueChange={(value) => router.push(value)}>
      <StepperNav aria-label="Onboarding stepper">
        <StepperItem value={OnboardingStep.COMPANY_DETAILS}>
          <StepperTrigger>
            <StepperIndicator>
              <HandshakeIcon className="size-4" />
            </StepperIndicator>
            <StepperTitle>Firma</StepperTitle>
          </StepperTrigger>
        </StepperItem>

        <StepperItem value={OnboardingStep.BRANDING}>
          <StepperTrigger>
            <StepperIndicator>
              <HandshakeIcon className="size-4" />
            </StepperIndicator>
            <StepperTitle>Branding</StepperTitle>
          </StepperTrigger>
        </StepperItem>

        <StepperItem value={OnboardingStep.TEMPLATE}>
          <StepperTrigger>
            <StepperIndicator>
              <HandshakeIcon className="size-4" />
            </StepperIndicator>
            <StepperTitle>Szablony</StepperTitle>
          </StepperTrigger>
        </StepperItem>

        <StepperItem value={OnboardingStep.EMAIL}>
          <StepperTrigger>
            <StepperIndicator>
              <HandshakeIcon className="size-4" />
            </StepperIndicator>
            <StepperTitle>E-mail</StepperTitle>
          </StepperTrigger>
        </StepperItem>
      </StepperNav>

      <StepperPanel className="mt-8">{children}</StepperPanel>
    </Stepper>
  );
}
