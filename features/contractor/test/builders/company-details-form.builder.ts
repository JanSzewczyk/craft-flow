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
 */
export const companyDetailsFormBuilder = build<CompanyDetailsFormData>({
  fields: {
    companyName: () => faker.company.name(),
    industry: () => faker.helpers.arrayElement(["woodworking", "construction", "plumbing", "electrical", "painting"]),
    phone: () => faker.phone.number({ style: "international" }),
    email: () => faker.internet.email(),
    nip: null,
    address: null
  }
});
