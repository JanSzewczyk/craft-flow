import { build } from "mimicry-js";

import { faker } from "@faker-js/faker";
import { type ProjectListItem } from "~/features/projects/server/db";
import { ProjectStatus } from "~/features/projects/server/db/schema";

export const projectListItemBuilder = build<ProjectListItem>({
  fields: {
    id: () => faker.string.uuid(),
    name: () => faker.lorem.words(3),
    status: ProjectStatus.DRAFT,
    clientName: () => faker.person.fullName(),
    lastClientViewAt: () => null,
    createdAt: () => faker.date.past(),
    updatedAt: () => faker.date.recent(),
    totalSteps: 0,
    completedSteps: 0
  },
  traits: {
    active: {
      overrides: {
        status: ProjectStatus.ACTIVE,
        totalSteps: () => faker.number.int({ min: 3, max: 8 }),
        completedSteps: () => faker.number.int({ min: 1, max: 2 })
      }
    },
    completed: {
      overrides: {
        status: ProjectStatus.COMPLETED,
        totalSteps: 8,
        completedSteps: 8
      }
    }
  }
});
