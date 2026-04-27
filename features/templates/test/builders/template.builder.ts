import { build } from "mimicry-js";

import { faker } from "@faker-js/faker";
import { type Template, type TemplateStep } from "~/features/templates/server/db/schema";

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
    steps: (): TemplateStep[] => [
      { title: faker.lorem.words(3), description: faker.lorem.sentence(), orderIndex: 0 },
      { title: faker.lorem.words(3), description: null, orderIndex: 1 }
    ],
    createdAt: () => faker.date.past(),
    updatedAt: () => faker.date.recent()
  },
  traits: {
    noDescription: {
      overrides: { description: null }
    },
    noSteps: {
      overrides: { steps: [] }
    }
  }
});
