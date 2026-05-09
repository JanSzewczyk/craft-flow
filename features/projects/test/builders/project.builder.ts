import { build } from "mimicry-js";

import { faker } from "@faker-js/faker";
import { clientBuilder } from "~/features/crm/test/builders";
import { ProjectStatus, type Project } from "~/features/projects/server/db/schema";

import { projectStepBuilder } from "./project-step.builder";

/**
 * Builder for Project test data.
 *
 * Default: DRAFT status, no steps, random client.
 *
 * @example
 * const project = projectBuilder.one();
 *
 * @example
 * const project = projectBuilder.one({ traits: "activeWithSteps" });
 *
 * @example
 * // Active project with a client that has no phone number
 * const project = projectBuilder.one({
 *   traits: "activeWithSteps",
 *   overrides: { client: clientBuilder.one({ traits: "noPhone" }) }
 * });
 *
 * @example
 * const projects = projectBuilder.many(3, { traits: "activeWithMixedSteps" });
 */
export const projectBuilder = build<Project>({
  fields: {
    id: () => faker.string.uuid(),
    contractorId: () => faker.string.uuid(),
    clientId: () => faker.string.uuid(),
    name: () => faker.lorem.words(3),
    description: () => null,
    status: ProjectStatus.DRAFT,
    publicToken: () => faker.string.alphanumeric(16),
    lastClientViewAt: () => null,
    createdAt: () => faker.date.past(),
    updatedAt: () => faker.date.recent(),
    client: () => clientBuilder.one(),
    steps: () => []
  },
  traits: {
    active: {
      overrides: { status: ProjectStatus.ACTIVE }
    },
    completed: {
      overrides: { status: ProjectStatus.COMPLETED }
    },
    draftWithSteps: {
      overrides: {
        status: ProjectStatus.DRAFT,
        steps: () => projectStepBuilder.many(3)
      }
    },
    activeWithSteps: {
      overrides: {
        status: ProjectStatus.ACTIVE,
        steps: () => projectStepBuilder.many(3)
      }
    },
    activeWithMixedSteps: {
      overrides: {
        status: ProjectStatus.ACTIVE,
        steps: () => [...projectStepBuilder.many(2, { traits: "completed" }), ...projectStepBuilder.many(2)]
      }
    },
    activeAllDone: {
      overrides: {
        status: ProjectStatus.ACTIVE,
        steps: () => projectStepBuilder.many(3, { traits: "completed" })
      }
    },
    completedWithSteps: {
      overrides: {
        status: ProjectStatus.COMPLETED,
        steps: () => projectStepBuilder.many(3, { traits: "completed" })
      }
    }
  },
  postBuild: (project) => ({
    ...project,
    steps: project.steps.map((step, i) => ({ ...step, orderIndex: i }))
  })
});
