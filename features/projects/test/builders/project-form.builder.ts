import { build } from "mimicry-js";

import { faker } from "@faker-js/faker";
import { type ProjectFormData } from "~/features/projects/schemas/project-schema";

/**
 * Builder for ProjectFormData test data (mode: existing client).
 *
 * @example
 * const data = projectFormBuilder.one();
 *
 * @example
 * const data = projectFormBuilder.one({
 *   overrides: { name: "Remont kuchni" }
 * });
 *
 * @example
 * const data = projectFormWithNewClientBuilder.one();
 */
export const projectFormBuilder = build<ProjectFormData>({
  fields: {
    name: () => faker.lorem.words(3),
    description: () => null,
    templateId: () => faker.string.uuid(),
    client: () => ({
      mode: "existing" as const,
      clientId: faker.string.uuid()
    })
  },
  traits: {
    withDescription: {
      overrides: {
        description: () => faker.lorem.sentence()
      }
    }
  }
});

/**
 * Builder for ProjectFormData with a new client.
 *
 * @example
 * const data = projectFormWithNewClientBuilder.one();
 *
 * @example
 * const data = projectFormWithNewClientBuilder.one({
 *   overrides: { name: "Projekt z nowym klientem" }
 * });
 */
export const projectFormWithNewClientBuilder = build<ProjectFormData>({
  fields: {
    name: () => faker.lorem.words(3),
    description: () => null,
    templateId: () => faker.string.uuid(),
    client: () => ({
      mode: "new" as const,
      name: faker.person.fullName(),
      email: faker.internet.email(),
      phone: null
    })
  }
});
