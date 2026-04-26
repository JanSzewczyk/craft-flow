import { expect, type Mock } from "storybook/test";
import { getCompanyProfile } from "~/features/contractor/server/services/company-profile.service";
import { companyProfileBuilder } from "~/features/contractor/test/builders";

import CompanyPage from "./page";

import preview from "~/.storybook/preview";

/*
 * Test plan:
 * 1. WithProfile — full company profile with address
 *    - Breadcrumbs are visible (Craft Flow / Dane firmy)
 *    - Page heading and description are visible
 *    - Edit button links to /app/company/edit
 *    - Company profile cards are rendered
 * 2. WithoutAddress — profile with no address set
 *    - Shows address fallback text in the address card
 * 3. WithNoOptionalFields — profile with null nip, regon, phone
 *    - Shows em-dash fallbacks for optional fields
 */

const meta = preview.meta({
  title: "Pages/Craftman/Company",
  component: CompanyPage,
  args: {
    params: Promise.resolve({}),
    searchParams: Promise.resolve({})
  },
  parameters: {
    layout: "padded",
    react: { rsc: true },
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: "/app/company"
      }
    }
  }
});

// ---------------------------------------------------------------------------
// Story 1: Full profile with address
// ---------------------------------------------------------------------------

export const WithProfile = meta.story();

WithProfile.test("Renders all expected content", async ({ canvas, step }) => {
  await step("Breadcrumbs are visible", async () => {
    await expect(canvas.getByRole("link", { name: "Craft Flow" })).toBeVisible();
    await expect(canvas.getByText("Dane firmy")).toBeVisible();
  });

  await step("Page heading and description are visible", async () => {
    await expect(canvas.getByRole("heading", { name: "Profil Firmy" })).toBeVisible();
    await expect(canvas.getByText(/podstawowe informacje o twojej firmie/i)).toBeVisible();
  });

  await step("Edit button links to company edit page", async () => {
    const editLink = canvas.getByRole("link", { name: /edytuj/i });
    await expect(editLink).toBeVisible();
    await expect(editLink).toHaveAttribute("href", "/app/company/edit");
  });

  await step("Company profile cards are rendered", async () => {
    await expect(canvas.getByText("Dane Biznesowe")).toBeVisible();
    await expect(canvas.getByText("Siedziba Firmy")).toBeVisible();
    await expect(canvas.getByText("Stolarnia u Jana")).toBeVisible();
  });
});

// ---------------------------------------------------------------------------
// Story 2: Profile without address
// ---------------------------------------------------------------------------

export const WithoutAddress = meta.story({
  beforeEach: () => {
    (getCompanyProfile as unknown as Mock).mockResolvedValue([
      null,
      companyProfileBuilder.one({
        traits: "noAddress",
        overrides: {
          companyName: "Firma Bez Adresu",
          email: "kontakt@firma.pl"
        }
      })
    ]);
  }
});

WithoutAddress.test("Shows address fallback text when no address is set", async ({ canvas }) => {
  await expect(canvas.getByText("Nie podano adresu siedziby")).toBeVisible();
});

// ---------------------------------------------------------------------------
// Story 3: Profile with no optional fields
// ---------------------------------------------------------------------------

export const WithNoOptionalFields = meta.story({
  beforeEach: () => {
    (getCompanyProfile as unknown as Mock).mockResolvedValue([
      null,
      companyProfileBuilder.one({
        traits: "noOptionalFields",
        overrides: {
          companyName: "Firma Minimalna",
          email: "kontakt@minimalna.pl",
          address: null
        }
      })
    ]);
  }
});

WithNoOptionalFields.test("Renders em-dash for null optional fields", async ({ canvas }) => {
  const dashes = canvas.getAllByText("—");
  await expect(dashes.length).toBeGreaterThanOrEqual(3);
});
