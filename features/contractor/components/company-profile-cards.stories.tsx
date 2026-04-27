import { expect } from "storybook/test";
import { companyProfileBuilder } from "~/features/contractor/test/builders";

import { CompanyProfileCards } from "./company-profile-cards";

import preview from "~/.storybook/preview";

/*
 * Test plan:
 * 1. WithAddress — full profile with address and additionalInfo
 *    - Renders "Dane Biznesowe" card with all business fields
 *    - Renders "Siedziba Firmy" card with all address fields
 *    - Renders additionalInfo row when present
 * 2. WithoutAddress — profile with address: null
 *    - Renders "Dane Biznesowe" card
 *    - Shows "Nie podano adresu siedziby" fallback
 * 3. NoOptionalFields — nip, regon, phone are null → shows em-dash fallbacks
 */

const meta = preview.meta({
  title: "Features/Contractor/Company/Company Profile Cards",
  component: CompanyProfileCards,
  parameters: {
    layout: "padded"
  },
  args: {
    companyProfile: companyProfileBuilder.one()
  }
});

// ---------------------------------------------------------------------------
// Story 1: Full profile with address and additionalInfo
// ---------------------------------------------------------------------------

export const WithAddress = meta.story({
  name: "With Address",
  args: {
    companyProfile: companyProfileBuilder.one({ traits: "withAddressAndAdditionalInfo" })
  }
});

WithAddress.test("Renders all expected content", async ({ canvas, args, step }) => {
  await step("Dane Biznesowe card is visible", async () => {
    await expect(canvas.getByText("Dane Biznesowe")).toBeVisible();
  });

  await step("Business fields are visible", async () => {
    await expect(canvas.getByText(args.companyProfile.companyName)).toBeVisible();
    await expect(canvas.getByText(args.companyProfile.email)).toBeVisible();
    await expect(canvas.getByText(args.companyProfile.nip!)).toBeVisible();
    await expect(canvas.getByText(args.companyProfile.regon!)).toBeVisible();
    await expect(canvas.getByText(args.companyProfile.phone!)).toBeVisible();
  });

  await step("Siedziba Firmy card is visible", async () => {
    await expect(canvas.getByText("Siedziba Firmy")).toBeVisible();
  });

  await step("Address fields are visible", async () => {
    await expect(canvas.getByText(args.data.address!.street!)).toBeVisible();
    await expect(canvas.getByText(args.data.address!.postalCode!)).toBeVisible();
    await expect(canvas.getByText(args.data.address!.city!)).toBeVisible();
    await expect(canvas.getByText(args.data.address!.country!)).toBeVisible();
  });

  await step("Additional info row is visible", async () => {
    await expect(canvas.getByText(args.data.address!.additionalInfo!)).toBeVisible();
  });
});

// ---------------------------------------------------------------------------
// Story 2: Profile without address
// ---------------------------------------------------------------------------

export const WithoutAddress = meta.story({
  name: "Without Address",
  args: {
    data: companyProfileBuilder.one({ traits: "noAddress" })
  }
});

WithoutAddress.test("Renders Dane Biznesowe card", async ({ canvas }) => {
  await expect(canvas.getByText("Dane Biznesowe")).toBeVisible();
});

WithoutAddress.test("Shows fallback text when address is null", async ({ canvas }) => {
  await expect(canvas.getByText("Nie podano adresu siedziby")).toBeVisible();
});

WithoutAddress.test("Does not render address fields", async ({ canvas }) => {
  await expect(canvas.queryByText("Ulica i numer")).not.toBeInTheDocument();
});

// ---------------------------------------------------------------------------
// Story 3: Null optional fields render em-dash fallback
// ---------------------------------------------------------------------------

export const NoOptionalFields = meta.story({
  name: "No Optional Fields",
  args: {
    data: companyProfileBuilder.one({ traits: ["noOptionalFields", "noAddress"] })
  }
});

NoOptionalFields.test("Renders em-dash for null optional fields", async ({ canvas }) => {
  const dashes = canvas.getAllByText("—");
  await expect(dashes.length).toBeGreaterThanOrEqual(3);
});
