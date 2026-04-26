import { build } from "mimicry-js";

import { faker } from "@faker-js/faker";
import { type CompanyDetailsFormData } from "~/features/contractor/schemas/company-details-schema";

/**
 * Builder for CompanyDetailsFormData test data.
 *
 * @example
 * const data = companyDetailsFormBuilder.one();
 *
 * @example
 * const data = companyDetailsFormBuilder.one({
 *   overrides: { companyName: "Acme Corp" }
 * });
 *
 * @example
 * // With a full address
 * const data = companyDetailsFormBuilder.one({ traits: "withAddress" });
 *
 * @example
 * // With NIP and REGON filled
 * const data = companyDetailsFormBuilder.one({ traits: ["withNip", "withRegon"] });
 */
export const companyDetailsFormBuilder = build<CompanyDetailsFormData>({
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
    nip: null,
    regon: null,
    address: null
  },
  traits: {
    withAddress: {
      overrides: {
        address: {
          street: () => faker.location.streetAddress(),
          postalCode: () => faker.location.zipCode("##-###"),
          city: () => faker.location.city(),
          country: "Polska",
          additionalInfo: null
        }
      }
    },
    withNip: {
      overrides: { nip: () => faker.string.numeric(10) }
    },
    withRegon: {
      overrides: { regon: () => faker.string.numeric(9) }
    }
  }
});
