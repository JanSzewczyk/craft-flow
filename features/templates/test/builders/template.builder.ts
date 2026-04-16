import { build } from "mimicry-js";

import { faker } from "@faker-js/faker";

import { type Template } from "~/features/templates/server/db/schema";

/**
 * Builder for Template test data.
 *
 * @example
 * const template = templateBuilder.one();
 *
 * @example
 * const template = templateBuilder.one({ overrides: { name: "My Template" } });
 *
 * @example
 * const templates = templateBuilder.many(3);
 */
export const templateBuilder = build<Template>({
  fields: {
    id: () => faker.string.uuid(),
    contractorId: () => faker.string.uuid(),
    name: () => faker.lorem.words(3),
    description: () => faker.lorem.sentence(),
    createdAt: () => faker.date.past(),
    updatedAt: () => faker.date.recent()
  },
  traits: {
    noDescription: {
      overrides: { description: null }
    }
  }
});
