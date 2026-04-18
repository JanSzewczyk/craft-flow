import { build } from "mimicry-js";

import { faker } from "@faker-js/faker";
import { type ClientFormData } from "~/features/crm/schemas/client-schema";

/**
 * Builder for ClientFormData test data.
 *
 * @example
 * const data = clientFormBuilder.one();
 *
 * @example
 * const data = clientFormBuilder.one({
 *   overrides: { name: "Jan Kowalski" }
 * });
 */
export const clientFormBuilder = build<ClientFormData>({
  fields: {
    name: () => faker.person.fullName(),
    email: () => faker.internet.email(),
    phone: () => faker.phone.number()
  },
  traits: {
    noPhone: {
      overrides: { phone: null }
    }
  }
});
