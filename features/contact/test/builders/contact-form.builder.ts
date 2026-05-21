import { build } from "mimicry-js";

import { faker } from "@faker-js/faker";
import { type ContactFormData } from "~/features/contact/schemas/contact-schema";

export const contactFormBuilder = build<ContactFormData>({
  fields: {
    name: () => faker.person.fullName(),
    email: () => faker.internet.email(),
    subject: () => "demo" as const,
    message: () => faker.lorem.sentence(5)
  },
  traits: {
    withPricingSubject: {
      overrides: { subject: "pricing" as const }
    },
    withSupportSubject: {
      overrides: { subject: "support" as const }
    },
    withOtherSubject: {
      overrides: { subject: "other" as const }
    }
  }
});
