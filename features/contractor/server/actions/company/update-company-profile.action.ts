"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { type CompanyDetailsFormData } from "~/features/contractor/schemas/company-details-schema";
import {
  type CompanyProfile,
  updateCompanyProfile
} from "~/features/contractor/server/services/company-profile.service";
import { type ActionResponse } from "~/lib/action-types";

import { logger } from "./logger";
import { mapCompanyServiceError } from "./map-service-error";

export async function updateCompanyProfileAction(data: CompanyDetailsFormData): ActionResponse<CompanyProfile> {
  const { isAuthenticated, userId } = await auth();
  if (!isAuthenticated) {
    logger.warn({ operation: "updateCompanyProfileAction" }, "Unauthenticated access attempt");
    return { success: false, error: "Nie jesteś zalogowany" };
  }

  const [error, profile] = await updateCompanyProfile(userId, data);
  if (error) return mapCompanyServiceError(error);

  revalidatePath("/app/company");
  revalidatePath("/app/company/edit");
  return { success: true, data: profile, message: "Dane firmy zostały zaktualizowane" };
}
