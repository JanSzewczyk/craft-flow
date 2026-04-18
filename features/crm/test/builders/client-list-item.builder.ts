import { build } from "mimicry-js";

import { faker } from "@faker-js/faker";
import { type ClientListItem } from "~/features/crm/server/db/queries";

/**
 * Builder for ClientListItem test data.
 *
 * @example
 * const item = clientListItemBuilder.one();
 *
 * @example
 * const item = clientListItemBuilder.one({
 *   overrides: { name: "Jan Kowalski" }
 * });
 *
 * @example
 * const items = clientListItemBuilder.many(3);
 */
export const clientListItemBuilder = build<ClientListItem>({
  fields: {
    id: () => faker.string.uuid(),
    contractorId: () => faker.string.uuid(),
    name: () => faker.person.fullName(),
    email: () => faker.internet.email(),
    phone: () => faker.phone.number(),
    clerkUserId: () => null,
    hasProjects: () => false,
    createdAt: () => faker.date.past()
  },
  traits: {
    registered: {
      overrides: { clerkUserId: () => faker.string.alphanumeric(24) }
    },
    noPhone: {
      overrides: { phone: null }
    },
    withProjects: {
      overrides: { hasProjects: true }
    }
  }
});
