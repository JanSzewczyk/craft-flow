import { build } from "mimicry-js";

import { faker } from "@faker-js/faker";
import { ProjectStatus, type PublicProjectView } from "~/features/projects/types/project";

function buildStep(overrides: Partial<PublicProjectView["steps"][0]> = {}): PublicProjectView["steps"][0] {
  return {
    id: faker.string.uuid(),
    title: faker.lorem.words(3),
    description: null,
    isCompleted: false,
    completedAt: null,
    createdAt: faker.date.past(),
    orderIndex: 0,
    ...overrides
  };
}

function buildCompletedStep(orderIndex: number): PublicProjectView["steps"][0] {
  return buildStep({ isCompleted: true, completedAt: faker.date.past(), orderIndex });
}

function buildPendingStep(orderIndex: number): PublicProjectView["steps"][0] {
  return buildStep({ orderIndex });
}

export const publicProjectViewBuilder = build<PublicProjectView>({
  fields: {
    id: () => faker.string.uuid(),
    client: () => ({
      id: faker.string.uuid(),
      name: faker.person.fullName(),
      email: faker.internet.email()
    }),
    name: () => faker.lorem.words(3),
    status: ProjectStatus.ACTIVE,
    clientName: () => faker.person.fullName(),
    steps: () => [],
    contractor: () => ({
      companyName: faker.company.name(),
      brandColor: null,
      logoUrl: null
    })
  },
  traits: {
    active: {
      overrides: { status: ProjectStatus.ACTIVE }
    },
    completed: {
      overrides: { status: ProjectStatus.COMPLETED }
    },
    activeWithMixedSteps: {
      overrides: {
        status: ProjectStatus.ACTIVE,
        steps: () => [buildCompletedStep(0), buildCompletedStep(1), buildPendingStep(2), buildPendingStep(3)]
      }
    },
    completedWithSteps: {
      overrides: {
        status: ProjectStatus.COMPLETED,
        steps: () => [buildCompletedStep(0), buildCompletedStep(1), buildCompletedStep(2)]
      }
    }
  }
});
