import { expect, type Mock, screen, waitFor } from "storybook/test";
import { updateCompanyProfileAction } from "~/features/contractor/server/actions/company/update-company-profile.action";
import { getCompanyProfile } from "~/features/contractor/server/services/company-profile.service";
import { companyProfileBuilder } from "~/features/contractor/test/builders";

import CompanyEditPage from "./page";

import preview from "~/.storybook/preview";

/*
 * Test plan:
 * 1. WithProfile — full company profile pre-filling the form
 *    - Breadcrumbs are visible (Craft Flow / Dane firmy / Edytuj)
 *    - Page heading is visible
 *    - Form fields are pre-filled with data from the profile
 *    - Save button is disabled until form is dirty
 * 2. SubmitError — onSaveAction returns an error
 *    - Shows error toast when action returns failure
 */

const meta = preview.meta({
  title: "Pages/Craftman/Company Edit",
  component: CompanyEditPage,
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
        pathname: "/app/company/edit"
      }
    }
  }
});

// ---------------------------------------------------------------------------
// Story 1: Pre-filled form
// ---------------------------------------------------------------------------

export const WithProfile = meta.story();

WithProfile.test("Renders all expected content", async ({ canvas, step }) => {
  await step("Breadcrumbs are visible", async () => {
    await expect(canvas.getByRole("link", { name: "Craft Flow" })).toBeVisible();
    await expect(canvas.getByRole("link", { name: "Dane firmy" })).toBeVisible();
    await expect(canvas.getByText("Edytuj")).toBeVisible();
  });

  await step("Page heading is visible", async () => {
    await expect(canvas.getByRole("heading", { name: "Edytuj dane firmy" })).toBeVisible();
  });

  await step("Form fields are pre-filled", async () => {
    await expect(canvas.getByLabelText("Nazwa firmy")).toHaveValue("Stolarnia u Jana");
    await expect(canvas.getByLabelText("Publiczny e-mail")).toHaveValue("kontakt@stolarnia.pl");
  });
});

WithProfile.test("Save button is disabled until form is dirty", async ({ canvas }) => {
  await expect(canvas.getByRole("button", { name: /zapisz zmiany/i })).toBeDisabled();
});

// ---------------------------------------------------------------------------
// Story 2: Submit returns error
// ---------------------------------------------------------------------------

export const SubmitError = meta.story({
  beforeEach: () => {
    (getCompanyProfile as unknown as Mock).mockResolvedValue([null, companyProfileBuilder.one()]);

    (updateCompanyProfileAction as unknown as Mock).mockResolvedValue({
      success: false as const,
      error: "Nie udało się zaktualizować danych firmy"
    } as unknown as never);
  }
});

SubmitError.test("Shows error toast when action returns failure", async ({ canvas, userEvent }) => {
  await userEvent.type(canvas.getByLabelText("Nazwa firmy"), " zmiana");
  await userEvent.click(canvas.getByRole("button", { name: /zapisz zmiany/i }));

  await waitFor(async () => {
    await expect(updateCompanyProfileAction as unknown as Mock).toHaveBeenCalledOnce();
  });

  await waitFor(async () => {
    await expect(await screen.findByText(/nie udało się zaktualizować danych firmy/i)).toBeVisible();
  });
});
