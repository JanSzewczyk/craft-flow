import { build, oneOf, sequence } from "mimicry-js";

import { faker } from "@faker-js/faker";
import { OnboardingStep } from "~/features/onboarding/constants/onboarding-steps";
import { type OnboardingState } from "~/features/onboarding/server/db/schema";
import { templateFormBuilder } from "~/features/templates/test/builders";

import { brandingFormBuilder } from "./branding-form.builder";
import { companyDetailsFormBuilder } from "./company-details-form.builder";
import { emailFormBuilder } from "./email-form.builder";

const ONBOARDING_STEPS = Object.values(OnboardingStep);

/**
 * Builder for OnboardingState test data.
 *
 * @example
 * const state = onboardingStateBuilder.one();
 *
 * @example
 * const state = onboardingStateBuilder.one({
 *   overrides: { currentStep: "/onboarding/email" }
 * });
 *
 * @example
 * const state = onboardingStateBuilder.one({ traits: "withAllData" });
 *
 * @example
 * const state = onboardingStateBuilder.one({ traits: "completed" });
 */
export const onboardingStateBuilder = build<OnboardingState>({
  fields: {
    contractorId: sequence((n) => `user-${n}`),
    currentStep: oneOf(...ONBOARDING_STEPS),
    companyDetails: null,
    branding: null,
    templateConfig: null,
    emailConfig: null,
    completed: false,
    completedAt: null,
    updatedAt: () => faker.date.recent(),
    createdAt: () => faker.date.past()
  },
  traits: {
    withAllData: {
      overrides: {
        companyDetails: () => companyDetailsFormBuilder.one(),
        branding: () => brandingFormBuilder.one(),
        templateConfig: () => templateFormBuilder.one(),
        emailConfig: () => emailFormBuilder.one()
      }
    },
    completed: {
      overrides: {
        completed: true,
        completedAt: () => faker.date.recent()
      }
    }
  }
});
