import { build } from "mimicry-js";

import { faker } from "@faker-js/faker";
import { type TemplateListItem } from "~/features/templates/server/db/queries";

/**
 * Builder for TemplateListItem test data.
 *
 * @example
 * const item = templateListItemBuilder.one();
 *
 * @example
 * const item = templateListItemBuilder.one({
 *   overrides: { name: "Produkcja Stołu", stepsCount: 5 }
 * });
 *
 * @example
 * const items = templateListItemBuilder.many(3);
 */
export const templateListItemBuilder = build<TemplateListItem>({
  fields: {
    id: () => faker.string.uuid(),
    name: () => faker.lorem.sentence({ min: 3, max: 5 }),
    description: () => faker.lorem.sentence(),
    stepsCount: () => faker.number.int({ min: 4, max: 8 }),
    previewSteps: () => [
      faker.lorem.sentence({ min: 3, max: 5 }),
      faker.lorem.sentence({ min: 3, max: 5 }),
      faker.lorem.sentence({ min: 3, max: 5 })
    ],
    createdAt: () => faker.date.past(),
    updatedAt: () => faker.date.recent()
  },
  traits: {
    noDescription: {
      overrides: {
        description: null
      }
    },
    manySteps: {
      overrides: {
        stepsCount: 6,
        previewSteps: () => [
          faker.lorem.sentence({ min: 3, max: 5 }),
          faker.lorem.sentence({ min: 3, max: 5 }),
          faker.lorem.sentence({ min: 3, max: 5 })
        ]
      }
    },
    singleStep: {
      overrides: {
        stepsCount: 1,
        previewSteps: () => [faker.lorem.words(2)]
      }
    }
  }
});
