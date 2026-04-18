import { build } from "mimicry-js";

import { faker } from "@faker-js/faker";
import { type Client } from "~/features/crm/server/db/schema";

/**
 * Builder for Client test data.
 *
 * @example
 * const client = clientBuilder.one();
 *
 * @example
 * const client = clientBuilder.one({ overrides: { name: "Jan Kowalski" } });
 *
 * @example
 * const clients = clientBuilder.many(3);
 */
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
    registered: {
      overrides: { clerkUserId: () => faker.string.alphanumeric(24) }
    },
    noPhone: {
      overrides: { phone: null }
    }
  }
});
