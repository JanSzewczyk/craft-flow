import { build } from "mimicry-js";

import { faker } from "@faker-js/faker";
import { type ClientContractorListItem } from "~/features/projects/types/contractor";

/**
 * Builder for ClientContractorListItem test data.
 *
 * @example
 * const item = clientContractorListItemBuilder.one();
 *
 * @example
 * const item = clientContractorListItemBuilder.one({ traits: "withAddress" });
 *
 * @example
 * const items = clientContractorListItemBuilder.many(3);
 */
export const clientContractorListItemBuilder = build<ClientContractorListItem>({
  fields: {
    id: () => faker.string.uuid(),
    companyName: () => faker.company.name(),
    industry: () => faker.commerce.department(),
    email: () => faker.internet.email(),
    phone: () => null,
    logoUrl: () => null,
    brandColor: () => null,
    projectCount: () => faker.number.int({ min: 0, max: 20 }),
    activeProjectCount: () => faker.number.int({ min: 0, max: 5 }),
    address: () => null
  },
  traits: {
    withPhone: {
      overrides: { phone: () => faker.phone.number() }
    },
    withLogo: {
      overrides: { logoUrl: () => faker.image.url() }
    },
    withBranding: {
      overrides: {
        logoUrl: () => faker.image.url(),
        brandColor: () => faker.color.rgb({ format: "hex" })
      }
    },
    withAddress: {
      overrides: {
        address: () => ({
          street: faker.location.streetAddress(),
          postalCode: faker.location.zipCode(),
          city: faker.location.city(),
          country: faker.location.country(),
          additionalInfo: null
        })
      }
    },
    noAddress: {
      overrides: { address: () => null }
    }
  }
});
