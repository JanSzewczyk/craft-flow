import { build } from "mimicry-js";

import { faker } from "@faker-js/faker";
import { type ClientProjectListItem, ProjectStatus } from "~/features/projects/types/project";

/**
 * Builder for ClientProjectListItem test data.
 *
 * @example
 * const item = clientProjectListItemBuilder.one();
 *
 * @example
 * const item = clientProjectListItemBuilder.one({
 *   overrides: { name: "Remont łazienki" }
 * });
 *
 * @example
 * const item = clientProjectListItemBuilder.one({ traits: "active" });
 *
 * @example
 * const items = clientProjectListItemBuilder.many(3);
 */
export const clientProjectListItemBuilder = build<ClientProjectListItem>({
  fields: {
    id: () => faker.string.uuid(),
    name: () => faker.lorem.words(3),
    status: ProjectStatus.DRAFT,
    contractorCompanyName: () => faker.company.name(),
    totalSteps: 0,
    completedSteps: 0,
    startedAt: () => null,
    completedAt: () => null,
    updatedAt: () => faker.date.recent(),
    createdAt: () => faker.date.past()
  },
  traits: {
    active: {
      overrides: {
        status: ProjectStatus.ACTIVE,
        startedAt: () => faker.date.past(),
        totalSteps: () => faker.number.int({ min: 3, max: 8 }),
        completedSteps: () => faker.number.int({ min: 1, max: 2 })
      }
    },
    completed: {
      overrides: {
        status: ProjectStatus.COMPLETED,
        startedAt: () => faker.date.past(),
        completedAt: () => faker.date.recent(),
        totalSteps: 8,
        completedSteps: 8
      }
    },
    archived: {
      overrides: {
        status: ProjectStatus.ARCHIVED,
        startedAt: () => faker.date.past(),
        completedAt: () => faker.date.past()
      }
    }
  }
});
