import { build } from "mimicry-js";

import { faker } from "@faker-js/faker";
import { type CompanyProfile } from "~/features/contractor/server/services/company-profile.service";

/**
 * Builder for CompanyProfile test data (read model used in CompanyProfileCards).
 *
 * @example
 * const profile = companyProfileBuilder.one();
 *
 * @example
 * const profile = companyProfileBuilder.one({
 *   overrides: { companyName: "Stolarnia u Jana" }
 * });
 *
 * @example
 * // With a full address including additional info
 * const profile = companyProfileBuilder.one({ traits: "withAddressAndAdditionalInfo" });
 *
 * @example
 * // Without address
 * const profile = companyProfileBuilder.one({ traits: "noAddress" });
 */
export const companyProfileBuilder = build<CompanyProfile>({
  fields: {
    companyName: () => faker.company.name(),
    industry: () =>
      faker.helpers.arrayElement([
        "stolarstwo",
        "hydraulika",
        "elektryka",
        "remonty",
        "malarstwo",
        "dekarstwo",
        "podlogi",
        "ogrodnictwo",
        "hvac",
        "inna"
      ]),
    phone: () => faker.phone.number({ style: "international" }),
    email: () => faker.internet.email(),
    nip: () => faker.string.numeric(10),
    regon: () => faker.string.numeric(9),
    address: () => ({
      id: faker.string.uuid(),
      street: faker.location.streetAddress(),
      postalCode: faker.location.zipCode("##-###"),
      city: faker.location.city(),
      country: "Polska",
      additionalInfo: null,
      createdAt: faker.date.past(),
      updatedAt: faker.date.recent()
    })
  },
  traits: {
    withAddressAndAdditionalInfo: {
      overrides: {
        address: {
          id: faker.string.uuid(),
          street: "ul. Przykładowa 1",
          postalCode: "00-001",
          city: "Warszawa",
          country: "Polska",
          additionalInfo: "Piętro 3, biuro 12",
          createdAt: new Date("2024-01-01"),
          updatedAt: new Date("2024-01-01")
        }
      }
    },
    noAddress: {
      overrides: {
        address: null
      }
    },
    noOptionalFields: {
      overrides: {
        nip: null,
        regon: null,
        phone: null
      }
    }
  }
});
