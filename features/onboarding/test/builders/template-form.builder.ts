import { build } from "mimicry-js";

import { faker } from "@faker-js/faker";
import  { type TemplateFormData } from "~/features/onboarding/schemas/template-schema";

import { templateStepFormBuilder } from "./template-step-form.builder";

/**
 * Builder for TemplateFormData test data.
 *
 * @example
 * const data = templateFormBuilder.one();
 *
 * @example
 * const data = templateFormBuilder.one({
 *   overrides: { name: "My Template" }
 * });
 */
export const templateFormBuilder = build<TemplateFormData>({
  fields: {
    name: () => faker.lorem.words(2),
    description: () => faker.lorem.sentence(),
    steps: () => templateStepFormBuilder.many(3)
  }
});
