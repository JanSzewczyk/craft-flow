import { build } from "mimicry-js";

import { faker } from "@faker-js/faker";
import { type Client } from "~/features/crm/server/db/schema";
import { type Project } from "~/features/projects/server/db/schema";
import { type Template } from "~/features/templates/server/db/schema";

export const projectBuilder = build<Project>({
  fields: {
    id: () => faker.string.uuid(),
    contractorId: () => faker.string.uuid(),
    clientId: () => faker.string.uuid(),
    name: () => faker.lorem.words(3),
    status: "DRAFT",
    publicToken: () => faker.string.alphanumeric(16),
    lastClientViewAt: () => null,
    createdAt: () => faker.date.past(),
    updatedAt: () => faker.date.recent()
  },
  traits: {
    active: { overrides: { status: "ACTIVE" } },
    completed: { overrides: { status: "COMPLETED" } }
  }
});

export const templateBuilder = build<Template>({
  fields: {
    id: () => faker.string.uuid(),
    contractorId: () => faker.string.uuid(),
    name: () => faker.lorem.words(3),
    description: () => faker.lorem.sentence(),
    steps: () => [],
    createdAt: () => faker.date.past(),
    updatedAt: () => faker.date.recent()
  },
  traits: {
    noDescription: { overrides: { description: null } },
    withSteps: {
      overrides: {
        steps: () => [
          { title: faker.lorem.words(2), description: null, orderIndex: 0 },
          { title: faker.lorem.words(2), description: null, orderIndex: 1 }
        ]
      }
    }
  }
});

export const clientBuilder = build<Client>({
  fields: {
    id: () => faker.string.uuid(),
    contractorId: () => faker.string.uuid(),
    name: () => faker.person.fullName(),
    email: () => faker.internet.email(),
    phone: () => faker.phone.number(),
    clerkUserId: () => null,
    createdAt: () => faker.date.past(),
    updatedAt: () => faker.date.recent()
  },
  traits: {
    noPhone: { overrides: { phone: null } },
    registered: { overrides: { clerkUserId: () => faker.string.alphanumeric(24) } }
  }
});
