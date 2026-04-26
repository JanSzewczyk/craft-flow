import { fn } from "storybook/test";
import { companyProfileBuilder } from "~/features/contractor/test/builders";

const defaultProfile = companyProfileBuilder.one({
  overrides: {
    companyName: "Stolarnia u Jana",
    industry: "stolarstwo",
    email: "kontakt@stolarnia.pl",
    phone: "+48 123 456 789",
    nip: "1234567890",
    regon: "123456789",
    address: {
      id: "addr-1",
      street: "ul. Przykładowa 1",
      postalCode: "00-001",
      city: "Warszawa",
      country: "Polska",
      additionalInfo: null,
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date("2024-01-01")
    }
  }
});

export const getCompanyProfile = fn(async () => [null, defaultProfile] as [null, typeof defaultProfile]).mockName(
  "getCompanyProfile"
);
