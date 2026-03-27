import { build } from "mimicry-js";

import { faker } from "@faker-js/faker";
import  { type TemplateStepFormData } from "~/features/onboarding/schemas/template-schema";

/**
 * Builder for TemplateStepFormData test data.
 *
 * @example
 * const step = templateStepFormBuilder.one();
 *
 * @example
 * const step = templateStepFormBuilder.one({
 *   overrides: { title: "Custom Step" }
 * });
 */
export const templateStepFormBuilder = build<TemplateStepFormData>({
  fields: {
    title: () => faker.lorem.words(3),
    description: () => faker.lorem.sentence()
  }
});
