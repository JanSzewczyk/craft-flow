import { build } from "mimicry-js";

import { faker } from "@faker-js/faker";
import { type ClientProjectStep } from "~/features/projects/types/project";

/**
 * Builder for ClientProjectStep test data.
 *
 * @example
 * const step = clientProjectStepBuilder.one();
 *
 * @example
 * const step = clientProjectStepBuilder.one({ traits: "completed" });
 *
 * @example
 * const steps = clientProjectStepBuilder.many(3);
 */
export const clientProjectStepBuilder = build<ClientProjectStep>({
  fields: {
    id: () => faker.string.uuid(),
    title: () => faker.lorem.words(3),
    description: () => null,
    isCompleted: () => false,
    completedAt: () => null,
    orderIndex: () => 0
  },
  traits: {
    completed: {
      overrides: {
        isCompleted: () => true,
        completedAt: () => faker.date.recent()
      }
    },
    pending: {
      overrides: {
        isCompleted: () => false,
        completedAt: () => null
      }
    },
    withDescription: {
      overrides: {
        description: () => faker.lorem.sentence()
      }
    }
  }
});
