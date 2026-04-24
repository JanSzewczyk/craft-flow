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
 * // Client owned by a specific contractor
 * const client = clientBuilder.one({ overrides: { contractorId: profileId } });
 *
 * @example
 * // Client with a linked Clerk account
 * const client = clientBuilder.one({ traits: "registered" });
 *
 * @example
 * // Client without a Clerk account (explicit)
 * const client = clientBuilder.one({ traits: "unregistered" });
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
    unregistered: {
      overrides: { clerkUserId: null }
    },
    noPhone: {
      overrides: { phone: null }
    }
  }
});
