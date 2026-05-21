import { build } from "mimicry-js";

import { faker } from "@faker-js/faker";
import { type ClientProjectDetail, ProjectStatus } from "~/features/projects/types/project";

import { clientProjectStepBuilder } from "./client-project-step.builder";

/**
 * Builder for ClientProjectDetail test data.
 *
 * @example
 * const detail = clientProjectDetailBuilder.one();
 *
 * @example
 * const detail = clientProjectDetailBuilder.one({ traits: "withSteps" });
 *
 * @example
 * const detail = clientProjectDetailBuilder.one({ traits: "withCompletedSteps" });
 */
export const clientProjectDetailBuilder = build<ClientProjectDetail>({
  fields: {
    id: () => faker.string.uuid(),
    name: () => faker.lorem.words(3),
    status: ProjectStatus.DRAFT,
    contractorCompanyName: () => faker.company.name(),
    totalSteps: () => 0,
    completedSteps: () => 0,
    startedAt: () => null,
    completedAt: () => null,
    updatedAt: () => faker.date.recent(),
    createdAt: () => faker.date.past(),
    description: () => null,
    contractorEmail: () => faker.internet.email(),
    contractorPhone: () => null,
    contractorLogoUrl: () => null,
    steps: () => []
  },
  traits: {
    withSteps: {
      overrides: {
        steps: () => clientProjectStepBuilder.many(3),
        totalSteps: () => 3,
        completedSteps: () => 0,
        status: ProjectStatus.ACTIVE,
        startedAt: () => faker.date.past()
      }
    },
    withCompletedSteps: {
      overrides: {
        steps: () => clientProjectStepBuilder.many(3, { traits: "completed" }),
        totalSteps: () => 3,
        completedSteps: () => 3,
        status: ProjectStatus.COMPLETED,
        startedAt: () => faker.date.past(),
        completedAt: () => faker.date.recent()
      }
    },
    withContactInfo: {
      overrides: {
        contractorPhone: () => faker.phone.number(),
        contractorLogoUrl: () => faker.image.url()
      }
    }
  }
});
