"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { type CompanyDetailsFormData } from "~/features/contractor/schemas/company-details-schema";
import { updateCompanyProfile } from "~/features/contractor/server/services/company-profile.service";
import { type RedirectAction } from "~/lib/action-types";
import { setToastCookie } from "~/lib/toast/server/toast.cookie";

import { logger } from "./logger";
import { mapCompanyServiceError } from "./map-service-error";

export async function updateCompanyProfileAction(data: CompanyDetailsFormData): RedirectAction {
  const { isAuthenticated, userId } = await auth();
  if (!isAuthenticated) {
    logger.warn({ operation: "updateCompanyProfileAction" }, "Unauthenticated access attempt");
    return { success: false, error: "Nie jesteś zalogowany" };
  }

  const [error] = await updateCompanyProfile(userId, data);
  if (error) return mapCompanyServiceError(error);

  revalidatePath("/app/company");
  revalidatePath("/app/company/edit");

  await setToastCookie("Dane firmy zostały zaktualizowane");

  redirect("/app/company");
}
