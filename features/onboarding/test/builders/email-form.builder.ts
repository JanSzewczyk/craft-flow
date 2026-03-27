import { build } from "mimicry-js";

import { faker } from "@faker-js/faker";
import { type EmailFormData } from "~/features/onboarding/schemas/email-schema";

/**
 * Builder for EmailFormData test data.
 *
 * @example
 * const data = emailFormBuilder.one();
 *
 * @example
 * const data = emailFormBuilder.one({
 *   overrides: { emailSubject: "Welcome!" }
 * });
 */
export const emailFormBuilder = build<EmailFormData>({
  fields: {
    emailSubject: () => faker.lorem.sentence(),
    emailBody: () => faker.lorem.paragraph() // min 10 chars required by schema
  }
});
