import { build } from "mimicry-js";

import { faker } from "@faker-js/faker";
import { type ProjectStep } from "~/features/projects/server/db/schema";

export const projectStepBuilder = build<ProjectStep>({
  fields: {
    id: () => faker.string.uuid(),
    projectId: () => faker.string.uuid(),
    title: () => faker.lorem.words(3),
    description: () => null,
    isCompleted: () => false,
    completedAt: () => null,
    orderIndex: () => faker.number.int({ min: 0, max: 10 }),
    createdAt: () => faker.date.past(),
    updatedAt: () => faker.date.recent()
  },
  traits: {
    completed: { overrides: { isCompleted: true, completedAt: () => faker.date.recent() } }
  }
});
